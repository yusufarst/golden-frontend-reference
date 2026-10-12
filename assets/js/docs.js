/* =============================================================================
   MULTIPLECORP Golden Reference: DOCUMENT runtime (r13, Layer A: Golden Design System) — MCDoc

   ONE paper renderer and ONE calculation contract for every generated document (R13_SPEC §8, DISC §2.5):
   the composer preview, Detail Dokumen (51), Dokumen Administrasi (52) and the purchase-order preview (03)
   all render through MCDoc.paper / MCDoc.mount; editor, preview, checks, confirmation and the issued paper
   all compute money through MCDoc.totals. No business data and no project names here: pages (Layer C) build
   a view model from their records and pass it in. Pairs with assets/css/patterns.css §12 (".pt-paper").
   Load deferred AFTER patterns.js and BEFORE modules/domain.js (shared runtime on every shell page).

   MCDoc.totals(lines, profile) -> { lines, taxes, salesValue, tax, total, count, incomplete, basis, rounding, level }
     lines:   [{ qty, price, taxes: [{ id, label, rate }], key }]   rate comes from the project's tax table, never a
              constant in code; a line without a valid qty (> 0) or price (>= 0) is counted in `incomplete`
     profile: { priceBasis: 'INCLUSIVE' | 'EXCLUSIVE', rounding: 'HALF_UP' | 'HALF_EVEN' | 'DOWN' | 'UP',
                level: 'DOCUMENT' | 'LINE' }   integer rupiah; inclusive prices: sales value = gross / (1 + rate)
              rounded once per document (DOCUMENT) or per line (LINE), tax = gross - sales value
   MCDoc.round(x, mode)          integer rounding with the configured mode (half away from zero by default)

   MCDoc.paper(vm, o) -> HTML string: the whole document on one sheet (no measuring). o.mode: 'draft' | 'issued' |
     'void' | 'revised' | 'scan'; o.mini (the 52 thumbnail: top of the first page); o.photos (show the photo column
     when the table offers it); o.label.
   MCDoc.mount(host, vm, o) -> controller { update(vm, o), setScale('fit' | number), pages(), pageAt(scrollTop),
     scroller(), destroy() }: the A4 sheets, paginated ("Halaman n dari m", the table head repeats on a new page),
     scaled to the host width (o.scale 'fit' = up to 100 %, or a number), re-paginated after the web font loads.
     Desktop / tablet: fixed A4 geometry (640 x 905 at 100 %, every size in em). Phones (<= 767 px): the same page
     breaks, each page reflowed at reading size (o.flow === false keeps the fixed geometry).

   View model (all text, escaped here; never HTML):
     { title, heading, number, numberText, version, date, issuer: { name, address, npwp, phone, email, city,
       mark: { monogram, tone }, prepared }, band, prepBand, parties: [{ label, lines: [] }], refs: [{ label, value }],
       body: [{ p } | { kv: [{ label, value | lines, em }] } | { amount }], table: { columns: [{ label, num }],
       rows: [{ cells: [text | { text, sub }], photo: { src, alt, w, h } }], empty, photoLabel },
       totals: [{ label, value, strong }], estimate, validity: { label, value }, notes: [] | { items, example, title },
       terms: { title, items, example }, signs: [{ lead, name, role }], footer, scan: { org, unit, address, title,
       reference, date, signer, caption } }
   Signatures and stamps are text placeholders only (DC-4); a draft carries the diagonal marking
   "DRAF — belum terbit" and "Nomor: Ditetapkan saat terbit" (DC-2).
   ============================================================================= */
(function (root) {
  'use strict';

  /* ---- 1. rounding + totals (DOM-free; exported to Node for tests) ------------------------------- */
  function round(x, mode) {
    if (x == null || !isFinite(x)) return 0;
    var s = x < 0 ? -1 : 1, a = Math.abs(+x);
    a = Math.round(a * 1e6) / 1e6;                     /* float noise (2.4999999998) never decides a rupiah */
    var f = Math.floor(a), d = a - f, half = Math.abs(d - 0.5) < 1e-9;
    var r;
    switch (mode) {
      case 'DOWN': r = f; break;                                    /* toward zero */
      case 'UP': r = d > 1e-9 ? f + 1 : f; break;                   /* away from zero */
      case 'HALF_EVEN': r = half ? (f % 2 === 0 ? f : f + 1) : (d > 0.5 ? f + 1 : f); break;
      case 'HALF_DOWN': r = half ? f : (d > 0.5 ? f + 1 : f); break;
      default: r = (half || d > 0.5) ? f + 1 : f;                   /* HALF_UP: half away from zero */
    }
    return s * r || 0;
  }
  function validTaxes(l) { return (l && l.taxes || []).filter(function (t) { return t && t.id && isFinite(t.rate); }); }
  /* tax amounts of one base; inclusive: the components share the fixed gross - net, the last takes the remainder */
  function splitTax(net, taxes, fixed, mode) {
    var a = taxes.map(function (t) { return round(net * t.rate, mode); });
    if (fixed != null && a.length) a[a.length - 1] = fixed - a.slice(0, -1).reduce(function (s, v) { return s + v; }, 0);
    return a;
  }
  function totals(lines, profile) {
    profile = profile || {};
    var basis = profile.priceBasis === 'INCLUSIVE' ? 'INCLUSIVE' : 'EXCLUSIVE';
    var mode = profile.rounding || 'HALF_UP';
    var level = profile.level === 'LINE' ? 'LINE' : 'DOCUMENT';
    var out = { lines: [], taxes: [], salesValue: 0, tax: 0, total: 0, count: 0, incomplete: 0, basis: basis, rounding: mode, level: level };
    var comps = {}, order = [], groups = {}, gorder = [];
    function comp(t) {
      if (!comps[t.id]) { comps[t.id] = { id: t.id, label: t.label || t.id, rate: +t.rate, base: 0, amount: 0 }; order.push(t.id); }
      return comps[t.id];
    }
    function book(net, taxes, fixed) {
      var am = splitTax(net, taxes, fixed, mode), sum = am.reduce(function (s, v) { return s + v; }, 0);
      taxes.forEach(function (t, k) { var c = comp(t); c.base += net; c.amount += am[k]; });
      out.salesValue += net; out.tax += sum; out.total += net + sum;
      return { amounts: am, tax: sum };
    }
    (lines || []).forEach(function (l, i) {
      l = l || {};
      var qty = l.qty == null || l.qty === '' ? NaN : +l.qty, price = l.price == null || l.price === '' ? NaN : +l.price;
      var issue = !(isFinite(qty) && qty > 0) ? 'qty' : !(isFinite(price) && price >= 0) ? 'price' : null;
      var taxes = validTaxes(l);
      var row = { index: i, key: l.key != null ? l.key : i, ok: !issue, issue: issue, qty: qty, price: price, value: null, net: null, tax: null, gross: null };
      out.lines.push(row);
      if (issue) { out.incomplete++; return; }
      out.count++;
      var value = round(qty * price, mode), rate = taxes.reduce(function (s, t) { return s + (+t.rate); }, 0);
      row.value = value;
      if (level === 'LINE' || !taxes.length) {
        var net = basis === 'INCLUSIVE' ? round(value / (1 + rate), mode) : value;
        var b = book(net, taxes, basis === 'INCLUSIVE' ? value - net : null);
        row.net = net; row.tax = b.tax; row.gross = net + b.tax;
      } else {
        var key = taxes.map(function (t) { return t.id; }).sort().join('+');
        if (!groups[key]) { groups[key] = { taxes: taxes, rate: rate, value: 0 }; gorder.push(key); }
        groups[key].value += value;
        row.net = basis === 'INCLUSIVE' ? round(value / (1 + rate), mode) : value;     /* indicative per line; the document rounds once */
        row.gross = basis === 'INCLUSIVE' ? value : null;
      }
    });
    gorder.forEach(function (k) {
      var g = groups[k];
      if (basis === 'INCLUSIVE') { var net = round(g.value / (1 + g.rate), mode); book(net, g.taxes, g.value - net); }
      else book(g.value, g.taxes, null);
    });
    out.taxes = order.map(function (id) { return comps[id]; });
    return out;
  }

  if (typeof module !== 'undefined' && module.exports && typeof document === 'undefined') { module.exports = { totals: totals, round: round }; return; }
  if (typeof document === 'undefined') return;

  /* ---- 2. paper markup -------------------------------------------------------------------------- */
  var doc = document;
  var BASE = 11, WIDTH = 640, HEIGHT = 905;            /* the A4 sheet at 100 % (css px); every inner size is in em */
  var DRAFT_MARK = 'DRAF — belum terbit';
  var MARKS = { draft: DRAFT_MARK, void: 'DIBATALKAN', revised: 'VERSI LAMA' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function txt(v) { return v == null ? '' : String(v); }
  function nonEmpty(list) { return (list || []).filter(function (x) { return x != null && x !== ''; }); }
  function notesOf(n) { if (!n) return null; if (Array.isArray(n)) return { items: nonEmpty(n) }; return { items: nonEmpty(n.items), example: !!n.example, title: n.title }; }

  function markHTML(m) {
    if (!m || !m.monogram) return '';
    return '<div class="pt-paper__mark pt-paper__mark--' + esc(m.tone || 'olive') + '" aria-hidden="true">' + esc(m.monogram) + '</div>';
  }
  function headHTML(vm, o) {
    var is = vm.issuer || {};
    /* phone and e-mail each stay whole (an address never breaks at its hyphen) */
    var contact = nonEmpty([is.phone ? 'Telp ' + is.phone : '', is.email]).map(function (x) { return '<span class="pt-paper__nw">' + esc(x) + '</span>'; }).join(' · ');
    var from = (is.prepared ? '<span class="pt-paper__label">' + esc(is.preparedLabel || 'Disiapkan oleh') + '</span>' : '') +
      '<div class="pt-paper__co">' + esc(is.name) + '</div>' + (is.address ? '<div>' + esc(is.address) + '</div>' : '') +
      (!is.prepared && is.npwp ? '<div>NPWP ' + esc(is.npwp) + '</div>' : '') + (contact ? '<div class="pt-paper__contact">' + contact + '</div>' : '');
    var pending = !vm.number;
    var num = vm.number ? vm.number : (vm.numberText || 'Nomor: Ditetapkan saat terbit');
    return '<header class="pt-paper__head"><div class="pt-paper__from' + (is.mark && is.mark.monogram ? ' has-mark' : '') + '">' + markHTML(is.mark) +
      '<div class="pt-paper__fromtext">' + from + '</div></div>' +
      '<div class="pt-paper__id"><strong>' + esc(txt(vm.heading || vm.title).toUpperCase()) + '</strong>' +
      '<div class="pt-paper__num' + (pending ? ' is-pending' : '') + '">' + esc(num) + (vm.version > 1 ? ' · versi ' + esc(vm.version) : '') + '</div>' +
      (vm.date ? '<div>' + esc(vm.date) + '</div>' : '') + '</div></header>';
  }
  function cellHTML(c) {
    if (c == null) return '';
    if (typeof c !== 'object') return esc(c);
    return esc(c.text) + (c.sub ? '<br><small>' + esc(c.sub) + '</small>' : '');
  }
  function tableParts(t, o) {
    var photos = !!(o.photos && t.photos !== false && (t.rows || []).some(function (r) { return r && 'photo' in r; }) || (o.photos && t.photoColumn));
    var cols = (t.columns || []).slice();
    if (photos) cols.unshift({ label: t.photoLabel || 'Foto', photo: true });
    var head = '<thead><tr>' + cols.map(function (c) { return '<th' + (c.num ? ' class="is-num"' : c.photo ? ' class="pt-paper__photo-h"' : '') + '>' + esc(c.label) + '</th>'; }).join('') + '</tr></thead>';
    var rows = (t.rows || []).map(function (r) {
      var cells = (r.cells || []).map(function (c, i) { var col = t.columns && t.columns[i]; return '<td' + (col && col.num ? ' class="is-num"' : '') + '>' + cellHTML(c) + '</td>'; }).join('');
      if (photos) {
        var p = r.photo;
        cells = '<td class="pt-paper__photo">' + (p && p.src ? '<img src="' + esc(p.src) + '" alt="' + esc(p.alt || '') + '" width="' + esc(p.w || 240) + '" height="' + esc(p.h || 180) + '" loading="lazy" decoding="async">' : '') + '</td>' + cells;
      }
      return '<tr>' + cells + '</tr>';
    });
    if (!rows.length) rows = ['<tr><td colspan="' + cols.length + '">' + esc(t.empty || 'Belum ada baris.') + '</td></tr>'];
    return { open: '<table class="pt-paper__table' + (photos ? ' has-photos' : '') + '">', head: head, rows: rows, close: '</table>' };
  }
  function bodyHTML(list) {
    return (list || []).map(function (b) {
      if (!b) return '';
      if (b.p != null) return '<p class="pt-paper__text">' + esc(b.p) + '</p>';
      if (b.amount != null) return '<p class="pt-paper__amount">' + esc(b.amount) + '</p>';
      if (b.kv) return '<dl class="pt-paper__kv">' + b.kv.map(function (r) {
        var v = r.lines ? r.lines.map(esc).join('<br>') : esc(r.value);
        return '<div><dt>' + esc(r.label) + '</dt><dd>' + (r.em ? '<em>' + v + '</em>' : v) + '</dd></div>';
      }).join('') + '</dl>';
      return '';
    }).join('');
  }
  /* the document as blocks; a table is splittable by rows (its head repeats on the next page) */
  function blocks(vm, o) {
    var out = [];
    function add(kind, html) { if (html) out.push({ kind: kind, html: html }); }
    if (vm.prepBand) add('prepband', '<p class="pt-paper__band pt-paper__band--prep">' + esc(vm.prepBand) + '</p>');
    add('head', headHTML(vm, o));
    if (vm.band) add('band', '<p class="pt-paper__band">' + esc(vm.band) + '</p>');
    add('title', '<p class="pt-paper__title">' + esc(vm.title) + '</p>');
    var parties = (vm.parties || []).filter(function (p) { return p && nonEmpty(p.lines).length; });
    if (parties.length) add('parties', '<div class="pt-paper__parties">' + parties.map(function (p) {
      return '<div class="pt-paper__party"><span class="pt-paper__label">' + esc(p.label) + '</span>' + nonEmpty(p.lines).map(function (l, i) { return i ? '<span>' + esc(l) + '</span>' : '<strong>' + esc(l) + '</strong>'; }).join('') + '</div>';
    }).join('') + '</div>');
    var refs = (vm.refs || []).filter(Boolean);
    if (refs.length) add('refs', '<dl class="pt-paper__refs">' + refs.map(function (r) { return '<div><dt>' + esc(r.label) + '</dt><dd>' + esc(r.value) + '</dd></div>'; }).join('') + '</dl>');
    add('body', bodyHTML(vm.body));
    if (vm.table) { var tp = tableParts(vm.table, o); out.push({ kind: 'table', table: tp, html: tp.open + tp.head + '<tbody>' + tp.rows.join('') + '</tbody>' + tp.close }); }
    var tot = (vm.totals || []).filter(Boolean);
    if (tot.length) add('totals', '<dl class="pt-paper__totals">' + tot.map(function (r) {
      /* a draft's total is an estimate: "Total penawaran (termasuk PPN, perkiraan)" */
      var lab = r.strong && vm.estimate ? (/\)$/.test(r.label) ? r.label.replace(/\)$/, ', perkiraan)') : r.label + ' (perkiraan)') : r.label;
      return '<div' + (r.strong ? ' class="is-strong"' : '') + '><dt>' + esc(lab) + '</dt><dd>' + esc(r.value) + '</dd></div>';
    }).join('') + '</dl>');
    if (vm.validity && vm.validity.value) add('validity', '<p class="pt-paper__validity"><span>' + esc(vm.validity.label || 'Berlaku sampai') + '</span> <strong>' + esc(vm.validity.value) + '</strong></p>');
    var notes = notesOf(vm.notes);
    if (notes && notes.items.length) add('notes', (notes.example || notes.title ? '<p class="pt-paper__label pt-paper__sublabel">' + esc(notes.title || 'Catatan') + (notes.example ? '<span class="pt-paper__example">Contoh tata letak</span>' : '') + '</p>' : '') +
      '<ul class="pt-paper__notes' + (notes.example ? ' is-example' : '') + '">' + notes.items.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>');
    var terms = notesOf(vm.terms);
    if (terms && terms.items.length) add('terms', '<div class="pt-paper__terms' + (terms.example ? ' is-example' : '') + '"><p class="pt-paper__label pt-paper__sublabel">' + esc(terms.title || 'Syarat dan ketentuan') +
      (terms.example ? '<span class="pt-paper__example">Contoh tata letak</span>' : '') + '</p><ol>' + terms.items.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ol></div>');
    var signs = (vm.signs || []).filter(Boolean);
    if (signs.length) add('signs', '<div class="pt-paper__signs">' + signs.map(function (s) {
      return '<div class="pt-paper__sign">' + esc(s.lead) + '<span class="pt-paper__sign-space" aria-hidden="true"></span><strong>' + esc(s.name) + '</strong>' + (s.role ? '<br>' + esc(s.role) : '') + '</div>';
    }).join('') + '</div>');
    return out;
  }
  function modeOf(o) { return o && o.mode || 'issued'; }
  function wmHTML(o) {
    var m = MARKS[modeOf(o)];
    return m ? '<div class="pt-paper__clip" aria-hidden="true"><div class="pt-paper__wm">' + esc(m) + '</div></div>' : '';
  }
  function footHTML(vm, n, total) {
    return '<div class="pt-paper__foot"><span>' + esc(vm.footer || vm.number || (txt(vm.title) + ' · draf')) + '</span><span>Halaman ' + n + ' dari ' + total + '</span></div>';
  }
  function runheadHTML(vm) {
    var is = vm.issuer || {};
    return '<div class="pt-paper__runhead"><span>' + esc(is.name) + '</span><span>' + esc(vm.title) + ' · ' + esc(vm.number || 'draf') + ' · lanjutan</span></div>';
  }
  function labelOf(vm, o) {
    var m = modeOf(o);
    return o && o.label ? o.label : 'Pratinjau ' + txt(vm.title) + (m === 'draft' ? ', draf belum terbit' : m === 'void' ? ', dibatalkan' : m === 'revised' ? ', versi lama' : '');
  }
  function paperClass(o, layout) {
    var m = modeOf(o);
    return 'pt-paper pt-paper--' + layout + (m !== 'issued' && m !== 'mini' ? ' pt-paper--' + m : '') + (o && o.cls ? ' ' + o.cls : '');
  }
  function isMini(o) { return !!(o && (o.mini || o.mode === 'mini')); }
  function scanHTML(vm, o) {
    var s = vm.scan || {};
    var widths = [96, 88, 92, 70, 0, 94, 90, 84, 60, 0, 92, 76];
    return '<div class="' + paperClass(o, isMini(o) ? 'mini' : 'grow') + '" role="document" aria-label="' + esc(o.label || ('Pratinjau gambar hasil pindai: ' + txt(vm.title))) + '">' +
      '<figure class="pt-paper__page pt-paper__scan">' +
      '<div class="pt-paper__scanhead"><strong>' + esc(s.org || '') + '</strong><span>' + esc(s.unit || '') + '</span><span>' + esc(s.address || '') + '</span></div>' +
      '<p class="pt-paper__scantitle">' + esc(txt(s.title || vm.title).toUpperCase()) + '</p>' +
      '<p class="pt-paper__scanref">Nomor ' + esc(s.reference || '—') + ' · ' + esc(s.date || '') + '</p>' +
      '<div class="pt-paper__scanlines" aria-hidden="true">' + widths.map(function (w) { return w ? '<span class="pt-paper__w' + w + '"></span>' : '<i></i>'; }).join('') + '</div>' +
      '<div class="pt-paper__scansign" aria-hidden="true"><span class="pt-paper__stamp">' + esc(s.signer || '') + '</span><span class="pt-paper__scanline"></span><span>Tanda tangan dan cap ' + esc(s.signer || '') + '</span></div>' +
      '<figcaption class="pt-paper__scancap">' + esc(s.caption || 'Pratinjau gambar hasil pindai, tanpa metadata.') + '</figcaption></figure></div>';
  }
  /* one sheet with every block (string only; the sheet grows with its content) */
  function paper(vm, o) {
    o = o || {};
    vm = vm || {};
    if (modeOf(o) === 'scan') return scanHTML(vm, o);
    var bl = blocks(vm, o), mini = isMini(o);
    return '<div class="' + paperClass(o, mini ? 'mini' : 'grow') + '" role="document" aria-label="' + esc(labelOf(vm, o)) + '">' +
      '<div class="pt-paper__page">' + wmHTML(o) + bl.map(function (b) { return b.html; }).join('') + (mini ? '' : footHTML(vm, 1, 1)) + '</div></div>';
  }

  /* ---- 3. pagination: measured once at the reference size (11 px, 640 px sheet), then rendered at any scale */
  var measureHost = null;
  function measurer() {
    if (measureHost && doc.body.contains(measureHost)) return measureHost;
    measureHost = doc.createElement('div');
    measureHost.className = 'pt-paper-measure';
    measureHost.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(measureHost);
    return measureHost;
  }
  function px(el, prop) { return parseFloat(root.getComputedStyle(el)[prop]) || 0; }
  function paginate(vm, o, bl) {
    var host = measurer();
    var htmlBlocks = bl.map(function (b, i) {
      if (b.kind === 'table') return b.table.open.replace('<table ', '<table data-mb="' + i + '" ') + b.table.head + '<tbody>' + b.table.rows.map(function (r) { return r.replace('<tr>', '<tr data-mr>'); }).join('') + '</tbody>' + b.table.close;
      return '<div class="pt-paper__mb" data-mb="' + i + '">' + b.html + '</div>';
    });
    host.innerHTML = '<div class="' + paperClass(o, 'fixed') + '" style="--pp-s:1"><div class="pt-paper__page" data-mp>' + htmlBlocks.join('') + '</div>' +
      '<div class="pt-paper__page" data-mp2>' + runheadHTML(vm) + '</div></div>';
    var page = host.querySelector('[data-mp]'), p2 = host.querySelector('[data-mp2]');
    var padT = px(page, 'paddingTop'), padB = px(page, 'paddingBottom');
    var cap = HEIGHT - padT - padB;                   /* the A4 page box at 100 % (the measuring page may overflow) */
    var runH = p2.firstChild.offsetHeight + px(p2.firstChild, 'marginBottom');
    var els = Array.prototype.slice.call(page.querySelectorAll(':scope > [data-mb]'));
    var tops = els.map(function (e) { return e.offsetTop - padT; });
    var lastEl = els[els.length - 1];
    var end = lastEl ? lastEl.offsetTop + lastEl.offsetHeight + px(lastEl, 'marginBottom') - padT : 0;
    var heights = els.map(function (e, i) { return (i + 1 < els.length ? tops[i + 1] : end) - tops[i]; });
    var pages = [[]], y = 0, start = 0;
    function newPage() { pages.push([]); start = runH; y = runH; }
    bl.forEach(function (b, i) {
      var h = heights[i];
      if (y + h <= cap + 0.5 || (b.kind !== 'table' && y <= start)) { pages[pages.length - 1].push({ i: i }); y += h; return; }
      if (b.kind === 'table') {
        var t = els[i], thead = t.querySelector('thead'), rows = Array.prototype.slice.call(t.querySelectorAll('tbody > tr'));
        var mt = px(t, 'marginTop'), mb = px(t, 'marginBottom'), headH = thead ? thead.offsetHeight : 0;
        var k = 0;
        while (k < rows.length) {
          var avail = cap - y - mt - mb - headH, take = 0, used = 0;
          while (k + take < rows.length && used + rows[k + take].offsetHeight <= avail + 0.5) { used += rows[k + take].offsetHeight; take++; }
          if (!take && y > start) { newPage(); continue; }
          if (!take) take = 1;                                    /* a row taller than a page: place it anyway */
          pages[pages.length - 1].push({ i: i, from: k, to: k + take });
          y += mt + headH + used + mb;
          k += take;
          if (k < rows.length) newPage();
        }
        return;
      }
      newPage();
      pages[pages.length - 1].push({ i: i }); y += h;
    });
    host.innerHTML = '';
    return pages.filter(function (p) { return p.length; });
  }
  function pagesHTML(vm, o, bl, plan, layout) {
    var total = plan.length;
    return '<div class="' + paperClass(o, layout) + '" role="document" aria-label="' + esc(labelOf(vm, o)) + '">' + plan.map(function (items, n) {
      return '<div class="pt-paper__page" data-page="' + (n + 1) + '">' + wmHTML(o) + (n ? runheadHTML(vm) : '') + items.map(function (it) {
        var b = bl[it.i];
        if (b.kind === 'table' && it.from != null) return b.table.open + b.table.head + '<tbody>' + b.table.rows.slice(it.from, it.to).join('') + '</tbody>' + b.table.close;
        return b.html;
      }).join('') + footHTML(vm, n + 1, total) + '</div>';
    }).join('') + '</div>';
  }

  /* ---- 4. mount: paginated, scaled sheets in a stage ----------------------------------------------- */
  var mqPhone = root.matchMedia ? root.matchMedia('(max-width: 767px)') : { matches: false };
  function mount(host, vm, o) {
    if (!host) return null;
    if (host.__mcDoc) { host.__mcDoc.update(vm, o); return host.__mcDoc; }
    o = o || {};
    var state = { vm: vm || {}, o: o, scale: o.scale || 'fit', plan: [[]], s: 1, flow: false };
    var stage = doc.createElement('div');
    stage.className = 'pt-paper-stage' + (o.stageCls ? ' ' + o.stageCls : '');
    host.innerHTML = '';
    host.appendChild(stage);
    function render() {
      var vmx = state.vm, ox = state.o;
      if (modeOf(ox) === 'scan' || isMini(ox)) { stage.innerHTML = paper(vmx, ox); state.plan = [[]]; return; }
      state.flow = ox.flow !== false && mqPhone.matches;
      var bl = blocks(vmx, ox);
      try { state.plan = paginate(vmx, ox, bl); } catch (e) { state.plan = [bl.map(function (b, i) { return { i: i }; })]; }
      var top = stage.scrollTop, left = stage.scrollLeft;
      stage.innerHTML = pagesHTML(vmx, ox, bl, state.plan, state.flow ? 'flow' : 'fixed');
      applyScale();
      stage.scrollTop = top; stage.scrollLeft = left;
      if (ox.onRender) ox.onRender(ctl);
    }
    function applyScale() {
      var p = stage.querySelector('.pt-paper--fixed');
      if (!p) return;
      var cs = root.getComputedStyle(stage);
      var avail = stage.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      var s = state.scale === 'fit' ? Math.min(state.o.maxScale || 1, avail / WIDTH) : +state.scale;
      if (!(s > 0.2)) s = 0.2;
      state.s = s;
      p.style.setProperty('--pp-s', s.toFixed(4));
      stage.setAttribute('data-scale', state.scale === 'fit' ? 'fit' : String(state.scale));
    }
    var ro = root.ResizeObserver ? new root.ResizeObserver(function () { if (state.scale === 'fit') applyScale(); }) : null;
    if (ro) ro.observe(stage);
    function onMq() { render(); }
    if (mqPhone.addEventListener) mqPhone.addEventListener('change', onMq);
    if (doc.fonts && doc.fonts.status !== 'loaded' && doc.fonts.ready) doc.fonts.ready.then(function () { if (host.__mcDoc === ctl) render(); });
    var ctl = {
      update: function (v, o2) { if (v) state.vm = v; if (o2) { state.o = o2; if (o2.scale) state.scale = o2.scale; } render(); },
      setScale: function (s) { state.scale = s; applyScale(); if (state.o.onRender) state.o.onRender(ctl); },
      scale: function () { return state.scale; },
      factor: function () { return state.s; },
      pages: function () { return state.plan.length; },
      scroller: function () { return stage; },
      /* the page whose top third is in view (for "Halaman n dari m") */
      pageAt: function (scrollTop) {
        if (!stage.clientHeight) return 1;                       /* hidden (a closed pane): the first page */
        var ps = stage.querySelectorAll('.pt-paper__page'), t = (scrollTop == null ? stage.scrollTop : scrollTop) + stage.clientHeight / 3, n = 1;
        Array.prototype.forEach.call(ps, function (p, i) { if (p.offsetTop - stage.offsetTop <= t) n = i + 1; });
        return n;
      },
      destroy: function () { if (ro) ro.disconnect(); if (mqPhone.removeEventListener) mqPhone.removeEventListener('change', onMq); host.__mcDoc = null; host.innerHTML = ''; }
    };
    host.__mcDoc = ctl;
    render();
    return ctl;
  }

  root.MCDoc = { paper: paper, mount: mount, totals: totals, round: round, blocks: blocks, DRAFT_MARK: DRAFT_MARK, size: { width: WIDTH, height: HEIGHT, base: BASE } };
})(typeof window !== 'undefined' ? window : this);
