/* =============================================================================
   MULTIPLECORP Golden Reference: PAGE PATTERNS runtime (r10, Layer A: Golden Design System)

   Reusable behaviour for every module screen. No business data and no project fixture: pages
   (Layer C) pass rows, labels and status registries in. Pairs with assets/css/patterns.css.
   Load deferred, AFTER the fixture data and BEFORE the page module and interactions.js:
     <script src="../assets/js/fixtures/<project>-data.js" defer></script>
     <script src="../assets/js/patterns.js" defer></script>
     <script src="../assets/js/modules/domain.js" defer></script>
     <script src="../assets/js/modules/<module>.js" defer></script>
     <script src="../assets/js/interactions.js" defer></script>
   so a page renders its content first and interactions.js then enhances it (selects, entrance
   motion, long text, disclosures) exactly as on the static pages.

   Globals
     MCUI      esc, icon, fmt (rp, num, qty, pct, date, time, datetime, rel, due, days),
               pill, status, co, cell, link, btn, state, notice, toast, uid,
               signals(items, o): the derived "Perlu tindakan" block (r11), thumb(img, o) (= MCMedia.thumb)
    MCMedia   (r13) thumb / frame / primary / sorted / sniff / inspect / derive: image slots, the missing-image
               placeholder and the client checks of an image upload (magic bytes, size, dimensions)
     MCForm    (r13) num.parse / num.format / num.value: Indonesian money and quantity entry ("1.250.000,50"),
               an explicit error sentence instead of silent digit stripping (also exported to Node for tests)
     MCList    mount(host, spec) -> { update(rows), setState(kind), rows() }: one data set as a
               desktop table AND phone rows, keyset "Muat Lagi" (25), empty / error / loading
     MCFilter  mount(host, spec) -> { state(), reset() }: search + filter selects + the company
               view "Tampilkan: Semua perusahaan" (only for accounts with 2+ companies)
     MCCompany get(), set(code), options(), visible(code)   (session-wide company view)
     MCTabs    mount(host, spec) -> { select(id), current() }: real tabs, ?tab= in the address;
               r12 VIEW mode when the navigation lists every tab as an entry (no tab row)
     MCSeg     mount(host, spec): segmented view switch inside a section
     MCSheet   open({ title, html, back }) -> { close(), body }: phone detail sheet (Back closes)
     MCRisk    run(spec): LOW (no confirm) / COMMIT (validate -> summary -> execute) /
               DESTRUCTIVE (consequence, safe focus) / CRITICAL (reason + typed confirmation),
               one in-flight guard per key (double-execution protection)
     MCAction  on(name, fn): delegated [data-action] handlers; [data-demo] demo actions
     MCPage    route, guard(), crumbs(map), title(text), notFound(), ready(fn), subnav(items)
               (r12: renders nothing for items the role's navigation provides); r13 (persistent shell,
               docs/PERSISTENT_SHELL.md): route is live, go(href, o) navigates router-aware, isDirty(),
               askLeave(), applyContainer(), reset(); dirtyGuard also arms one shared beforeunload;
               MCAction handlers / MCPalette providers registered by page code leave with the page
     MCPalette register(fn(query) -> groups), groups(query): command-palette providers
     MCMenu    html({ label, text, items }): overflow / row menu (body-level popover; phone action
               sheet); items = [{ label, icon, href | action | demo, danger, disabled, reason, sep }]
     MCActions html(defs) / render(host, defs): page actions by priority (1 primary, <= 2 secondary,
               the rest + destructive in one overflow menu; phones: primary + menu), role-filtered
   Docs: docs/COMPONENT_CATALOG.md (patterns, archetypes), docs/APP_ARCHITECTURE.md.
   ============================================================================= */
(function (root) {
  'use strict';

  /* ---- 1. Formatting (DOM-free; also exported to Node for tests) ------------------------ */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var MONTH = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var DAY = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  function group(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function num(n, dec) {
    if (n == null || isNaN(n)) return '—';
    var neg = n < 0, a = Math.abs(n), s;
    if (dec) {
      var f = a.toFixed(dec).split('.');
      s = group(f[0]) + (/^0+$/.test(f[1]) ? '' : ',' + f[1].replace(/0+$/, ''));
    } else s = group(Math.round(a));
    return (neg ? '−' : '') + s;
  }
  function rp(n, o) {
    if (n == null || isNaN(n)) return '—';
    var neg = n < 0, a = Math.abs(Math.round(n)), s;
    if (o && o.short) {
      if (a >= 1e9) s = (a / 1e9).toFixed(2).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',') + ' M';
      else if (a >= 1e6) s = (a / 1e6).toFixed(1).replace(/\.0$/, '').replace('.', ',') + ' jt';
      else if (a >= 1e3) s = (a / 1e3).toFixed(0) + ' rb';
      else s = String(a);
    } else s = group(a);
    return (neg ? '−' : '') + 'Rp' + s;
  }
  function qty(n, unit) { return num(n, 2) + (unit ? ' ' + unit : ''); }
  function pct(n) { return n == null || isNaN(n) ? '—' : Math.round(n) + '%'; }   /* PUEBI: the percent sign is written attached (76%), as on the Beranda */
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* Dates: 'YYYY-MM-DD' is a calendar date (no zone); a datetime string is shown in the project
     time zone (MCTime, Asia/Jakarta for MULTIPLECORP). */
  function parts(v) {
    if (!v) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (m) return { y: +m[1], m: +m[2], d: +m[3], dateOnly: true };
    var d = v instanceof Date ? v : new Date(v);
    if (isNaN(d)) return null;
    var p = root.MCTime ? root.MCTime.parts(d) : { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: d.getHours(), minute: d.getMinutes() };
    return { y: p.year, m: p.month, d: p.day, h: p.hour, min: p.minute };
  }
  function ymd(p) { return p.y + '-' + pad(p.m) + '-' + pad(p.d); }
  function weekday(p) { return DAY[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()]; }
  function date(v, style) {
    var p = parts(v);
    if (!p) return '—';
    if (style === 'long') return p.d + ' ' + MONTH[p.m - 1] + ' ' + p.y;
    if (style === 'day') return weekday(p) + ', ' + p.d + ' ' + MON[p.m - 1] + ' ' + p.y;
    if (style === 'noyear') return p.d + ' ' + MON[p.m - 1];
    if (style === 'month') return MONTH[p.m - 1] + ' ' + p.y;
    return p.d + ' ' + MON[p.m - 1] + ' ' + p.y;
  }
  function time(v) { var p = parts(v); return !p || p.dateOnly ? '' : pad(p.h) + '.' + pad(p.min); }
  function datetime(v) { var p = parts(v); if (!p) return '—'; return p.dateOnly ? date(v) : date(v) + ', ' + time(v); }
  function today() { return root.MCTime ? root.MCTime.today() : ymd(parts(new Date())); }
  function days(a, b) {                       /* whole days from a to b (calendar dates) */
    var pa = parts(a), pb = parts(b || today());
    if (!pa || !pb) return null;
    return Math.round((Date.UTC(pb.y, pb.m - 1, pb.d) - Date.UTC(pa.y, pa.m - 1, pa.d)) / 864e5);
  }
  function rel(v) {
    var p = parts(v);
    if (!p) return '—';
    var d = days(ymd(p), today());
    var t = p.dateOnly ? '' : ', ' + time(v);
    if (d === 0) return 'Hari ini' + t;
    if (d === 1) return 'Kemarin' + t;
    if (d > 1 && d < 7) return d + ' hari lalu';
    return date(v, p.y === parts(today()).y ? 'noyear' : null);
  }
  function due(v) {                            /* due-date phrase relative to today */
    var d = days(today(), v);
    if (d == null) return '—';
    if (d < 0) return 'Lewat ' + (-d) + ' hari';
    if (d === 0) return 'Jatuh tempo hari ini';
    if (d === 1) return 'Jatuh tempo besok';
    return 'Jatuh tempo ' + d + ' hari lagi';
  }
  var fmt = { rp: rp, num: num, qty: qty, pct: pct, date: date, time: time, datetime: datetime, rel: rel, due: due, days: days, today: today, parts: parts, months: MONTH };

  /* ---- 1b. MCForm.num (r13, R13_SPEC §9): Indonesian money / quantity entry -----------------------
     parse(text, o) -> { ok, value, empty, error, code }   o: { decimals (0), negative (false), min, max, label }
       "1.250.000" -> 1250000 · "Rp 1.250.000" -> 1250000 · "1250000" -> 1250000 · "1.250.000,50" -> 1250000.5
       (decimals >= 2) or an explicit error (decimals 0: "tanpa angka di belakang koma"). Nothing is ever stripped
       silently: a letter, a misplaced thousands dot ("1.25.000", "1.5"), two commas or too many decimals give an
       error sentence instead of a different number. Empty -> { ok: true, empty: true, value: null }.
     format(n, o) -> "1.250.000" / "1.250.000,5" (o.decimals: maximum decimals shown, trailing zeros dropped)
     value(text, o) -> the number, or null when empty or invalid (for live totals that must not guess)
     The live digit mask of a field (03 Buat Pembelian) is display formatting the user sees while typing; every
     VALUE is read through parse(). */
  var NUM_ERR = {
    chars: 'Isi angka saja: titik untuk ribuan, koma untuk desimal.',
    commas: 'Gunakan satu koma untuk desimal.',
    group: 'Periksa titik pemisah ribuan, contoh 1.250.000.',
    decimalDot: 'Untuk desimal gunakan koma, contoh 2,5.',
    integer: 'Isi bilangan bulat tanpa angka di belakang koma.',
    money: 'Isi rupiah bulat tanpa sen, contoh 1.250.000.',
    places: 'Paling banyak {n} angka di belakang koma.',
    negative: 'Angka tidak boleh negatif.',
    min: 'Angka paling kecil {n}.',
    max: 'Angka paling besar {n}.'
  };
  function numParse(text, o) {
    o = o || {};
    var dec = o.decimals == null ? 0 : o.decimals;
    var raw = String(text == null ? '' : text).replace(/[  ]/g, ' ').trim();
    var bad = function (code, n) { return { ok: false, value: null, empty: false, code: code, error: NUM_ERR[code].replace('{n}', n == null ? '' : num(n, 4)) }; };
    if (o.money !== false) raw = raw.replace(/^rp\.?\s*/i, '');
    raw = raw.replace(/\s+/g, '');
    if (!raw) return { ok: true, value: null, empty: true, code: null, error: null };
    var neg = false;
    if (/^[-−]/.test(raw)) { neg = true; raw = raw.slice(1); }
    if (!/^[0-9.,]+$/.test(raw) || !/[0-9]/.test(raw)) return bad('chars');
    var parts2 = raw.split(',');
    if (parts2.length > 2) return bad('commas');
    var ip = parts2[0], fp = parts2.length === 2 ? parts2[1] : null;
    if (fp !== null && !/^[0-9]+$/.test(fp)) return bad(fp.indexOf('.') >= 0 ? 'group' : 'chars');
    if (ip === '') ip = '0';
    if (ip.indexOf('.') >= 0) {
      if (!/^[0-9]{1,3}(\.[0-9]{3})+$/.test(ip)) return bad(fp === null && /^[0-9]+\.[0-9]{1,2}$/.test(ip) ? 'decimalDot' : 'group');
      ip = ip.replace(/\./g, '');
    }
    if (fp !== null && fp.length > dec) return dec === 0 ? bad(o.unit === 'money' ? 'money' : 'integer') : bad('places', dec);
    var v = parseInt(ip, 10) + (fp ? parseFloat('0.' + fp) : 0);
    if (fp) v = Math.round(v * Math.pow(10, fp.length)) / Math.pow(10, fp.length);
    if (neg) { if (!o.negative) return bad('negative'); v = -v; }
    if (o.min != null && v < o.min) return bad('min', o.min);
    if (o.max != null && v > o.max) return bad('max', o.max);
    return { ok: true, value: v, empty: false, code: null, error: null };
  }
  function numFormat(n, o) {
    if (n == null || n === '' || isNaN(n)) return '';
    return num(+n, (o && o.decimals) || 0);
  }
  var MCFormNum = {
    parse: numParse, format: numFormat, messages: NUM_ERR,
    value: function (text, o) { var r = numParse(text, o); return r.ok && !r.empty ? r.value : null; }
  };

  if (typeof module !== 'undefined' && module.exports && typeof document === 'undefined') { module.exports = { fmt: fmt, num: MCFormNum }; return; }
  root.MCForm = root.MCForm || {};
  root.MCForm.num = MCFormNum;
  if (typeof document === 'undefined') return;

  var doc = document;
  var P = root.MCProject, R = root.MCRoutes;
  var mqReduce = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var mqPhone = root.matchMedia ? root.matchMedia('(max-width: 767px)') : { matches: false };

  /* ---- 2. MCUI: markup helpers ------------------------------------------------------------ */
  var uidN = 0;
  function uid(p) { uidN += 1; return (p || 'pt') + '-' + uidN; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(name, cls) { return '<svg class="mc-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + esc(name) + '"></use></svg>'; }
  var TONES = { neutral: 1, info: 1, success: 1, warning: 1, danger: 1, pending: 1, attention: 1, inactive: 1 };
  /* r13 pilot (status contract, docs/COMPONENT_RULES.md "Status"): ONE semantic status component in two densities.
     variant 'badge' (default) = the filled pill for the record in view (page / card head); variant 'text' = dot +
     label without fill for list rows and table cells, so every state in a column shares the same anatomy (font,
     size, weight, line height, dot geometry) and only the dot / label tone carries meaning: strong ink only for
     danger and attention, a muted label for inactive. Tones are semantic (neutral · info · pending · attention ·
     success · warning · danger · inactive); the project's registry maps its business states to them. Never animated
     in the text density. */
  function pill(label, tone, o) {
    o = o || {};
    var t = TONES[tone] ? tone : (tone === 'brand' ? 'success' : 'neutral');
    if (o.variant === 'text') return '<span class="mc-status mc-status--' + t + '"><span class="mc-status__dot" aria-hidden="true"></span><span class="mc-status__label">' + esc(label) + '</span></span>';
    return '<span class="mc-pill mc-pill--' + t + ' mc-pill--' + (o.size || 'sm') + (o.live ? ' mc-pill--live' : '') + '">' +
      (o.dot === false ? '' : '<span class="mc-pill__dot" aria-hidden="true"></span>') + esc(label) + '</span>';
  }
  /* status(registry, key, opts): a domain state rendered from the project's status registry
     ({ KEY: { label, tone, live } }). opts.live only animates a state the registry marks live. */
  function status(reg, key, o) {
    o = o || {};
    var s = reg && reg[key];
    if (!s) return pill(key || '—', 'neutral', o);
    return pill(s.label, s.tone, { size: o.size, dot: o.dot, live: !!(o.live && s.live), variant: o.variant });
  }
  function co(code, o) {
    o = o || {};
    if (o.other) return '<span class="pt-co pt-co--other" title="Perusahaan di luar akses Anda">perusahaan lain</span>';
    return '<span class="pt-co"' + (o.name ? ' title="' + esc(o.name) + '"' : '') + '>' + esc(code) + '</span>';
  }
  function cell(title, sub, href, o) {
    o = o || {};
    var t = href ? '<a class="pt-cell__title" href="' + esc(href) + '">' + (o.rawTitle ? title : esc(title)) + '</a>'
      : '<span class="pt-cell__title">' + (o.rawTitle ? title : esc(title)) + '</span>';
    return '<span class="pt-cell' + (o.wrap ? ' pt-cell--wrap' : '') + '">' + t + (sub ? '<span class="pt-cell__sub">' + (o.rawSub ? sub : esc(sub)) + '</span>' : '') + '</span>';
  }
  function link(text, href, o) {
    o = o || {};
    return '<a class="' + (o.cls || 'pt-link') + '" href="' + esc(href) + '">' + esc(text) + (o.arrow === false ? '' : icon('chevron-right')) + '</a>';
  }
  /* btn({ label, variant, size, icon, href, action, attrs }) */
  function btn(o) {
    var cls = 'mc-btn mc-btn--' + (o.variant || 'outline') + ' mc-btn--' + (o.size || 'md') + (o.cls ? ' ' + o.cls : '');
    var inner = (o.icon ? icon(o.icon) : '') + '<span class="mc-btn__label">' + esc(o.label) + '</span>' +
      (o.pending !== false && !o.href ? icon('loader', 'mc-btn__spin') : '');
    var attrs = (o.action ? ' data-action="' + esc(o.action) + '"' : '') + (o.attrs || '');
    if (o.href) return '<a class="' + cls + '" href="' + esc(o.href) + '"' + attrs + '>' + inner + '</a>';
    return '<button class="' + cls + '" type="' + (o.type || 'button') + '"' + attrs + (o.disabled ? ' disabled' : '') + '>' + inner + '</button>';
  }
  /* state(kind, { title, text, action: { label, href | action }, ref }) */
  function state(kind, o) {
    o = o || {};
    var icons = { empty: 'search', error: 'alert-triangle', permission: 'lock', done: 'check-circle', info: 'info' };
    if (kind === 'loading') {
      return '<div class="pt-skel" role="status" aria-live="polite"><span class="mc-visually-hidden">Memuat data…</span>' +
        '<span class="pt-skel__line"></span><span class="pt-skel__line"></span><span class="pt-skel__line"></span><span class="pt-skel__line"></span></div>';
    }
    var a = o.action;
    return '<div class="pt-state pt-state--' + kind + '"' + (kind === 'error' ? ' role="alert"' : '') + '>' +
      '<span class="pt-state__icon">' + icon(o.icon || icons[kind] || 'info', 'mc-icon--22') + '</span>' +
      '<p class="pt-state__title">' + esc(o.title || '') + '</p>' +
      (o.text ? '<p class="pt-state__text">' + esc(o.text) + '</p>' : '') +
      (o.ref ? '<p class="pt-state__ref">Kode rujukan: ' + esc(o.ref) + '</p>' : '') +
      (a ? btn({ label: a.label, href: a.href, action: a.action, variant: a.variant || 'outline', size: 'md', icon: a.icon }) : '') +
      '</div>';
  }
  function notice(tone, title, text, actionsHTML) {
    var ic = { info: 'info', warning: 'alert-triangle', danger: 'alert-circle', success: 'check-circle' }[tone] || 'info';
    return '<div class="pt-notice pt-notice--' + tone + '"' + (tone === 'danger' ? ' role="alert"' : '') + '>' + icon(ic) +
      '<div><span class="pt-notice__title">' + esc(title) + '</span>' + (text ? esc(text) : '') + '</div>' +
      (actionsHTML ? '<div class="pt-notice__actions">' + actionsHTML + '</div>' : '<span></span>') + '</div>';
  }
  /* signals(items, o) (r11, D-31): the derived "Perlu tindakan" block, one pattern for every hub.
     items: [{ tone: 'danger' | 'warning' | 'pending' | 'info', title, meta, href, end }]
     Sorted danger > warning > pending > info; the first o.max (3) rows show and the rest open in place
     ("Lihat semua (n)"). A row is ONE link with a chevron: the condition is the strong line, record
     numbers / dates / amounts sit in the quieter meta line. o: { title ('Perlu tindakan'), sub, max,
     id, cls, flat (no card: for use inside another section) } */
  /* listHead({ count, sortHTML, id }) (r11): the quiet head of a single list: result line on the left
     ("10 proyek"), an optional sort control on the right. Replaces card heads that repeat the page title. */
  function listHead(o) {
    o = o || {};
    return '<div class="pt-listhead"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + '><span class="pt-listhead__count" data-list-count aria-live="polite">' + esc(o.count == null ? '' : o.count) + '</span>' +
      (o.sortHTML ? '<span class="pt-listhead__sort">' + o.sortHTML + '</span>' : '') + '</div>';
  }
  var TONE_RANK = { danger: 0, warning: 1, pending: 2, info: 3, neutral: 4 };
  function signals(items, o) {
    o = o || {};
    var list = (items || []).filter(Boolean).slice().sort(function (a, b) { return (TONE_RANK[a.tone] == null ? 9 : TONE_RANK[a.tone]) - (TONE_RANK[b.tone] == null ? 9 : TONE_RANK[b.tone]); });
    if (!list.length) return '';
    var max = o.max == null ? 3 : o.max, sid = o.id || uid('sig');
    var rows = list.map(function (s, i) {
      var inner = '<span class="pt-row__main"><span class="pt-signal__title">' + esc(s.title) + '</span>' + (s.metaHTML ? '<span class="pt-signal__meta">' + s.metaHTML + '</span>' : s.meta ? '<span class="pt-signal__meta">' + esc(s.meta) + '</span>' : '') + '</span>' +
        '<span class="pt-row__end">' + (s.end || '') + '</span>' + (s.href ? icon('chevron-right', 'pt-row__chev') : '<span></span>');
      var rc = 'pt-row has-chevron pt-signal pt-signal--' + esc(s.tone || 'info') + (o.rowCls ? ' ' + esc(o.rowCls) : '');
      return '<li' + (i >= max ? ' class="pt-signal--more" hidden' : '') + '>' + (s.href ? '<a class="' + rc + '" href="' + esc(s.href) + '">' + inner + '</a>'
        : '<div class="' + rc + '">' + inner + '</div>') + '</li>';
    }).join('');
    var more = list.length > max ? '<div class="pt-signals__foot"><button class="pt-link" type="button" data-signals-more aria-expanded="false" aria-controls="' + sid + '-list">Lihat semua (' + list.length + ')' + icon('chevron-down') + '</button></div>' : '';
    var body = '<ul class="pt-rows pt-signals__list" id="' + sid + '-list" role="list">' + rows + '</ul>' + more;
    if (o.flat) return '<div class="pt-signals pt-signals--flat' + (o.cls ? ' ' + o.cls : '') + '">' + body + '</div>';
    return '<section class="mc-card pt-section pt-signals' + (o.cls ? ' ' + o.cls : '') + '" aria-labelledby="' + sid + '-t"><div class="pt-section__head"><div class="pt-section__titles"><h2 class="pt-section__title" id="' + sid + '-t">' + esc(o.title || 'Perlu tindakan') + '</h2>' +
      (o.sub ? '<p class="pt-section__sub">' + esc(o.sub) + '</p>' : '') + '</div>' + (list.length > max || list.length < 2 ? '' : '<span class="pt-signals__count">' + list.length + '</span>') + '</div>' + body + '</section>';   /* the foot already says "Lihat semua (n)" */
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-signals-more]');
    if (!b) return;
    var box = b.closest('.pt-signals'), open = b.getAttribute('aria-expanded') !== 'true';
    qa('.pt-signal--more', box).forEach(function (li) { li.hidden = !open; });
    b.setAttribute('aria-expanded', String(open));
    b.firstChild.textContent = open ? 'Tampilkan lebih sedikit' : 'Lihat semua (' + qa('.pt-signals__list > li', box).length + ')';
  });
  function toast(type, title, message) {
    if (root.MCToast) return root.MCToast.show({ type: type || 'success', title: title, message: message });
    return null;
  }
  function q(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function qa(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* ---- 2b. MCMedia (r13, R13_SPEC §7): record images ------------------------------------------ */
  /* One look for every image slot. An image record is { id, src (large/card file), thumb (square derivative),
     alt, primary, w, h, type }; pages pass the records in (no project data here).
       thumb(img, o)  fixed square slot (o.size px, default 40): object-fit cover, 8 px radius, 1 px subtle
                      border, width/height attributes, loading="lazy", decoding="async", alt. Without an image:
                      a calm placeholder tile (o.glyph, default 'image') labelled o.label ("Belum ada foto"),
                      never a broken-image icon. o.decorative: alt="" (the row names the record already).
       frame(img, o)  the record's large image in a 4:3 frame (same border/radius family); empty = glyph +
                      "Belum ada foto" + o.note.
       primary(list) / sorted(list)   the primary image (else the first) / primary first, then sort order
       sniff(bytes)   'image/jpeg' | 'image/png' | 'image/webp' | 'image/svg+xml' | null, by MAGIC BYTES (never by
                      the file name): JPEG FF D8 FF · PNG 89 50 4E 47 · WebP "RIFF" .... "WEBP"
       inspect(file, rules) -> Promise({ ok, type, label, size, w, h, error: { code, title, text } }): type by
                      magic bytes, size limit, decodes (createImageBitmap) for the minimum dimensions
       derive(file, w, h, quality) -> Promise(dataURL): centre-cropped WebP derivative (the prototype's stand-in
                      for the server re-encode; production validates and re-encodes server-side)
     A failed image (missing file) turns into the placeholder through ONE capture listener (shell-owned). */
  var MEDIA_TYPES = { 'image/jpeg': 'JPEG', 'image/png': 'PNG', 'image/webp': 'WebP' };
  function mediaSorted(list) {
    return (list || []).filter(Boolean).slice().sort(function (a, b) { return (b.primary ? 1 : 0) - (a.primary ? 1 : 0) || (a.sort || 0) - (b.sort || 0); });
  }
  function mediaPrimary(list) { return mediaSorted(list)[0] || null; }
  function mediaEmpty(o, cls) {
    var label = o.label || 'Belum ada foto';
    /* decorative (a list row that names the record): hidden from assistive technology, tooltip only */
    return '<span class="mc-thumb mc-thumb--empty' + (cls || '') + '"' + (o.decorative ? ' aria-hidden="true"' : ' role="img" aria-label="' + esc(label) + '"') + ' title="' + esc(label) + '" data-media-empty' + (o.attrs || '') + '>' + icon(o.glyph || 'image', 'mc-thumb__glyph') + '</span>';
  }
  function thumb(img, o) {
    o = o || {};
    var size = o.size || 40, cls = (size !== 40 ? ' mc-thumb--' + size : '') + (o.cls ? ' ' + o.cls : '');
    var attrs = (o.attrs || '') + ' style="--thumb-size:' + size + 'px"';
    if (!img || !(img.thumb || img.src)) return mediaEmpty({ label: o.label, glyph: o.glyph, attrs: attrs, decorative: o.decorative }, cls);
    var alt = o.decorative ? '' : (o.alt != null ? o.alt : img.alt || '');
    return '<span class="mc-thumb' + cls + '"' + attrs + (o.decorative ? ' aria-hidden="true"' : '') + '><img class="mc-thumb__img" src="' + esc(img.thumb || img.src) + '" width="' + size + '" height="' + size + '" alt="' + esc(alt) + '"' +
      ' loading="' + (o.eager ? 'eager' : 'lazy') + '" decoding="async" data-media="thumb"' + (img.id ? ' data-media-id="' + esc(img.id) + '"' : '') + ' data-media-label="' + esc(o.label || 'Belum ada foto') + '" data-media-glyph="' + esc(o.glyph || 'image') + '"></span>';
  }
  function frame(img, o) {
    o = o || {};
    if (!img || !img.src) {
      return '<div class="mc-media-frame mc-media-frame--empty' + (o.cls ? ' ' + o.cls : '') + '"><span class="mc-media-frame__empty">' + icon(o.glyph || 'image', 'mc-media-frame__glyph') +
        '<span class="mc-media-frame__label">' + esc(o.label || 'Belum ada foto') + '</span>' + (o.note ? '<span class="mc-media-frame__note">' + esc(o.note) + '</span>' : '') + '</span></div>';
    }
    return '<div class="mc-media-frame' + (o.cls ? ' ' + o.cls : '') + '">' + (o.badge ? '<span class="mc-media-frame__badge">' + esc(o.badge) + '</span>' : '') +
      '<img class="mc-media-frame__img" src="' + esc(img.src) + '" width="' + (img.w || 960) + '" height="' + (img.h || 720) + '" alt="' + esc(o.alt != null ? o.alt : img.alt || '') + '"' +
      ' loading="' + (o.lazy ? 'lazy' : 'eager') + '" decoding="async" data-media="frame"' + (img.id ? ' data-media-id="' + esc(img.id) + '"' : '') + ' data-media-label="' + esc(o.label || 'Belum ada foto') + '" data-media-glyph="' + esc(o.glyph || 'image') + '"></div>';
  }
  function sniff(b) {
    if (!b || b.length < 4) return null;
    if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'image/jpeg';
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'image/png';
    if (b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
    var head = ''; for (var i = 0; i < Math.min(b.length, 64); i++) head += String.fromCharCode(b[i]);
    if (/^\s*(<\?xml|<svg|<!DOCTYPE svg)/i.test(head)) return 'image/svg+xml';
    return null;
  }
  function fileSize(bytes, up) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
    var mb = bytes / (1024 * 1024);
    if (mb === Math.round(mb)) return mb + ' MB';
    return (up ? Math.ceil(mb * 10) / 10 : Math.round(mb * 10) / 10).toFixed(1).replace('.', ',') + ' MB';   /* up: an over-limit size never rounds down to the limit */
  }
  function readHead(file, n) {
    var part = file.slice(0, n);
    if (part.arrayBuffer) return part.arrayBuffer().then(function (buf) { return new Uint8Array(buf); });
    return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(new Uint8Array(fr.result)); }; fr.onerror = rej; fr.readAsArrayBuffer(part); });
  }
  function decode(file) {
    if (root.createImageBitmap) return root.createImageBitmap(file);
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(u); res(im); };
      im.onerror = function () { URL.revokeObjectURL(u); rej(new Error('decode')); };
      im.src = u;
    });
  }
  function inspect(file, rules) {
    rules = rules || {};
    var max = rules.maxBytes || 5 * 1024 * 1024, minW = rules.minW || 400, minH = rules.minH || 300;
    var out = { ok: false, name: file && file.name, size: file ? file.size : 0, type: null, label: '', w: 0, h: 0, error: null };
    function fail(code, title, text) { out.error = { code: code, title: title, text: text }; return out; }
    if (!file) return Promise.resolve(fail('none', 'Belum ada foto yang dipilih', 'Pilih foto JPEG, PNG, atau WebP.'));
    return readHead(file, 16).then(function (b) {
      var type = sniff(b);
      out.type = type; out.label = MEDIA_TYPES[type] || '';
      if (type === 'image/svg+xml') return fail('svg', 'Berkas SVG tidak dapat dipakai sebagai foto', 'Gunakan foto JPEG, PNG, atau WebP.');
      if (!MEDIA_TYPES[type]) return fail('type', 'Berkas ini bukan foto JPEG, PNG, atau WebP', 'Isi berkasnya diperiksa, bukan nama atau ekstensinya. Pilih foto lain.');
      if (file.size > max) return fail('size', 'Ukuran foto ' + fileSize(file.size, true) + ' melebihi batas ' + fileSize(max), 'Perkecil atau kompres fotonya, lalu pilih lagi.');
      return decode(file).then(function (bm) {
        out.w = bm.width; out.h = bm.height;
        if (bm.close) bm.close();
        if (Math.max(out.w, out.h) < Math.max(minW, minH) || Math.min(out.w, out.h) < Math.min(minW, minH)) {
          return fail('small', 'Foto terlalu kecil (' + out.w + ' × ' + out.h + ' px)', 'Gunakan foto minimal ' + minW + ' × ' + minH + ' px agar tetap tajam di daftar dan dokumen.');
        }
        out.ok = true;
        return out;
      }, function () { return fail('decode', 'Foto tidak dapat dibaca', 'Berkas mungkin rusak atau terpotong. Pilih foto lain.'); });
    }, function () { return fail('read', 'Berkas tidak dapat dibaca', 'Pilih berkas lain dari perangkat Anda.'); });
  }
  function derive(file, w, h, quality) {
    return decode(file).then(function (bm) {
      var c = doc.createElement('canvas');
      c.width = w; c.height = h;
      var g = c.getContext('2d'), sw = bm.width, sh = bm.height, s = Math.max(w / sw, h / sh);
      var cw = w / s, ch = h / s;
      g.imageSmoothingEnabled = true;
      if ('imageSmoothingQuality' in g) g.imageSmoothingQuality = 'high';
      g.drawImage(bm, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, w, h);
      if (bm.close) bm.close();
      var url = c.toDataURL('image/webp', quality || 0.82);
      return /^data:image\/webp/.test(url) ? url : c.toDataURL('image/jpeg', quality || 0.85);
    });
  }
  /* a missing or broken file never shows the browser's broken-image icon: the slot becomes its placeholder */
  doc.addEventListener('error', function (e) {
    var im = e.target;
    if (!im || im.tagName !== 'IMG' || !im.hasAttribute('data-media')) return;
    var box = im.parentNode, label = im.getAttribute('data-media-label') || 'Belum ada foto', glyph = im.getAttribute('data-media-glyph') || 'image';
    if (!box) return;
    if (im.getAttribute('data-media') === 'frame') {
      box.classList.add('mc-media-frame--empty');
      box.innerHTML = '<span class="mc-media-frame__empty">' + icon(glyph, 'mc-media-frame__glyph') + '<span class="mc-media-frame__label">Foto tidak dapat dimuat</span></span>';
    } else {
      box.classList.add('mc-thumb--empty');
      box.setAttribute('title', label); box.setAttribute('data-media-empty', '');
      if (box.getAttribute('aria-hidden') !== 'true') { box.setAttribute('role', 'img'); box.setAttribute('aria-label', label); }
      box.innerHTML = icon(glyph, 'mc-thumb__glyph');
    }
  }, true);
  root.MCMedia = { thumb: thumb, frame: frame, primary: mediaPrimary, sorted: mediaSorted, sniff: sniff, inspect: inspect, derive: derive, size: fileSize, types: MEDIA_TYPES };

  root.MCUI = {
    esc: esc, icon: icon, fmt: fmt, pill: pill, status: status, co: co, cell: cell, link: link, btn: btn,
    state: state, notice: notice, toast: toast, uid: uid, q: q, qa: qa, signals: signals, listHead: listHead, thumb: thumb,
    phone: function () { return mqPhone.matches; },
    reduced: function () { return mqReduce.matches; }
  };

  /* ---- 3. MCCompany: the company VIEW (not an authorization). Session-wide. ---------------- */
  var companyProvider = function () { return []; };
  var COMPANY_KEY = 'mc:company';
  function userCompanies() {
    var u = (root.MC_PROJECT && root.MC_PROJECT.user) || {};
    var all = companyProvider();
    if (!u.companies || u.companies === 'all') return all;
    return all.filter(function (c) { return u.companies.indexOf(c.code) >= 0; });
  }
  root.MCCompany = {
    provide: function (fn) { companyProvider = fn; },
    options: userCompanies,
    all: function () { return companyProvider(); },
    visible: function (code) { return userCompanies().some(function (c) { return c.code === code; }); },
    get: function () {
      var v = null;
      try { v = sessionStorage.getItem(COMPANY_KEY); } catch (e) { /* storage blocked */ }
      return v && root.MCCompany.visible(v) ? v : 'all';
    },
    set: function (code) {
      try { if (code && code !== 'all') sessionStorage.setItem(COMPANY_KEY, code); else sessionStorage.removeItem(COMPANY_KEY); } catch (e) { /* storage blocked */ }
      doc.dispatchEvent(new CustomEvent('mc:company', { detail: { code: code || 'all' } }));
    },
    multi: function () { return userCompanies().length > 1; }
  };

  /* ---- 3c. MCPager: page-based pagination for any record list (r13 compact) -------------------- */
  /* The row number of a list is a DISPLAY POSITION in the current sorted + filtered result: displayIndex =
     offset + visibleRowIndex + 1. It is never a database id, an official document number or a business sequence.
     MCPager.state(total, page, size) -> { page, pages, size, offset, from, to, total } (page clamped to a valid one)
     MCPager.html(st, { noun, sizes, label }) -> the footer: "Menampilkan 11–20 dari 34 dokumen" + Sebelumnya /
     Berikutnya (+ optional "Per halaman" select). Hidden when everything fits on one page of the smallest size.
     MCPager.bind(host, onChange(page, size)) wires the footer (delegated; call once per host). */
  var PAGER_SIZES = [10, 20, 50];
  function pagerState(total, page, size) {
    size = size > 0 ? size : 10;
    var pages = Math.max(1, Math.ceil(total / size));
    page = Math.min(Math.max(1, page || 1), pages);
    var offset = (page - 1) * size;
    return { page: page, pages: pages, size: size, offset: offset, from: total ? offset + 1 : 0, to: Math.min(total, offset + size), total: total };
  }
  function pagerHTML(st, o) {
    o = o || {};
    var sizes = o.sizes || PAGER_SIZES;
    if (st.total <= sizes[0] && st.pages <= 1) return '';
    var noun = o.noun || 'data';
    return '<nav class="pt-pager" aria-label="' + esc(o.label || 'Halaman daftar') + '">' +
      '<p class="pt-pager__range" aria-live="polite">Menampilkan <strong>' + st.from + '–' + st.to + '</strong> dari ' + st.total + ' ' + esc(noun) + '</p>' +
      '<div class="pt-pager__controls">' +
        (o.sizeSelect === false ? '' : '<label class="pt-pager__size"><span>Per halaman</span><select data-pager-size aria-label="Jumlah per halaman">' + sizes.map(function (n) { return '<option value="' + n + '"' + (n === st.size ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>') +
        '<span class="pt-pager__page">Hal. ' + st.page + ' / ' + st.pages + '</span>' +
        '<button type="button" class="mc-btn mc-btn--outline mc-btn--sm pt-pager__btn" data-pager-go="' + (st.page - 1) + '"' + (st.page <= 1 ? ' disabled' : '') + ' aria-label="Halaman sebelumnya">' + icon('chevron-left') + '<span class="mc-btn__label">Sebelumnya</span></button>' +
        '<button type="button" class="mc-btn mc-btn--outline mc-btn--sm pt-pager__btn" data-pager-go="' + (st.page + 1) + '"' + (st.page >= st.pages ? ' disabled' : '') + ' aria-label="Halaman berikutnya"><span class="mc-btn__label">Berikutnya</span>' + icon('chevron-right') + '</button>' +
      '</div></nav>';
  }
  function pagerBind(host, onChange) {
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pager-go]');
      if (!b || b.disabled || !host.contains(b)) return;
      onChange(+b.getAttribute('data-pager-go'), null, b);
    });
    host.addEventListener('change', function (e) {
      var sel = e.target.closest('[data-pager-size]');
      if (!sel || !host.contains(sel)) return;
      onChange(1, +sel.value, sel);
    });
  }
  /* the display number of a row (table cell / phone prefix): quiet tabular figures, never a link */
  function rowNo(n) { return '<span class="pt-no">' + n + '</span>'; }
  root.MCPager = { state: pagerState, html: pagerHTML, bind: pagerBind, no: rowNo, sizes: PAGER_SIZES };

  /* r13 refine - record timelines (.pt-timeline, rendered by seven modules) are numbered CHRONOLOGICALLY: 1 is the first
     event, whatever the display order. Activity feeds list the newest first, so the top item carries the highest
     number; a list that runs oldest first says <ol data-chrono="asc">. The position sits in the rail marker
     (li[data-no] + CSS), so the rail keeps its meaning (special / owner tones) and no module markup changes. */
  function numberTimelines() {
    tlRaf = 0;
    Array.prototype.forEach.call(doc.querySelectorAll('.pt-timeline'), function (ol) {
      var items = Array.prototype.filter.call(ol.children, function (li) { return li.classList && li.classList.contains('pt-timeline__item'); });
      var asc = ol.getAttribute('data-chrono') === 'asc', key = items.length + (asc ? 'a' : 'd');
      if (!items.length || (ol.getAttribute('data-tl') === key && items[0].hasAttribute('data-no'))) return;
      items.forEach(function (li, i) { li.setAttribute('data-no', String(asc ? i + 1 : items.length - i)); });
      ol.setAttribute('data-tl', key);
      ol.classList.add('pt-timeline--numbered');
    });
  }
  var tlRaf = 0;
  if (root.MutationObserver && doc.body) {
    new root.MutationObserver(function () { if (!tlRaf) tlRaf = root.requestAnimationFrame ? root.requestAnimationFrame(numberTimelines) : setTimeout(numberTimelines, 16); })
      .observe(doc.body, { childList: true, subtree: true });
  }
  root.MCTimeline = { number: numberTimelines };

  /* r13 remediation - PT-25 "Tanggal transaksi" (canon IP-07) for the command forms outside the composer (03, 32, 33,
     41, 65): ONE rule set. Prefilled today (MCTime); a date after today is refused (L-09) with the form's own sentence;
     an earlier chosen date shows the mark "Tanggal Mundur" and what the date drives; the audit keeps the real time.
     A chosen date is never changed by the screen. Records here carry no canonical number (display ids only), so no
     "Nomor mengikuti periode" line; numbered documents take their date at their own issue.
       state(iso) -> { value, today, back, future, chosen } · error(iso, label) -> '' | sentence · label(iso)
       watch(nativeDateInput, noteHost, { effect, label, onChange(iso, err) })   keeps max = today and the note in sync
       html({ id, value, effect })   the compact "Tanggal transaksi · Ubah" control for a task screen without a date */
  function bizToday() { return root.MCTime && root.MCTime.today ? root.MCTime.today() : new Date().toISOString().slice(0, 10); }
  function bizState(iso) { var t = bizToday(), v = iso || t; return { value: v, today: t, back: v < t, future: v > t, chosen: !!iso && iso !== t }; }
  function bizLabel(iso) { return fmt && fmt.date ? fmt.date(iso, 'long') : iso; }
  function bizError(iso, label) { return bizState(iso).future ? (label || 'Tanggal transaksi') + ' tidak boleh setelah hari ini.' : ''; }
  function bizNote(host, iso, o) {
    if (!host) return;
    var st = bizState(iso), err = bizError(iso, o.label);
    host.classList.toggle('is-error', !!err);
    host.innerHTML = err ? '<span class="pt-bdate__errtext">' + esc(err) + '</span>'
      : st.back ? '<span class="pt-bdate__mark">Tanggal Mundur</span><span class="pt-bdate__effect">' + esc(o.effect || 'Tanggal ini menjadi tanggal transaksi; waktu pencatatan tetap tercatat apa adanya.') + '</span>' : '';
    host.hidden = !(err || st.back);
  }
  function bizWatch(nat, host, o) {
    o = o || {};
    if (!nat) return null;
    nat.max = bizToday();
    var upd = function () { bizNote(host, nat.value, o); if (o.onChange) o.onChange(nat.value || null, bizError(nat.value, o.label)); };
    nat.addEventListener('change', upd);
    nat.addEventListener('input', upd);
    bizNote(host, nat.value, o);
    return upd;
  }
  function bizHTML(o) {
    var st = bizState(o.value), id = o.id;
    return '<div class="pt-bdate pt-bdate--task" data-bizdate="' + esc(id) + '"><p class="pt-bdate__line"><span class="pt-bdate__label">Tanggal transaksi</span>' +
      '<span class="pt-bdate__value" data-bizdate-value>' + esc(st.chosen ? bizLabel(st.value) + ' \u2014 dipilih' : 'Hari ini, ' + bizLabel(st.today)) + '</span>' +
      '<button type="button" class="pt-link pt-bdate__edit" data-bizdate-edit aria-expanded="' + (o.open ? 'true' : 'false') + '" aria-controls="' + esc(id) + '-f">Ubah</button></p>' +
      '<div class="pt-bdate__field" id="' + esc(id) + '-f" data-bizdate-field' + (o.open ? '' : ' hidden') + '>' +
      (root.MCDateField ? root.MCDateField.html({ id: id + '-d', value: st.value, max: st.today, label: 'tanggal transaksi' }) : '<input type="date" id="' + esc(id) + '-d" value="' + esc(st.value) + '" max="' + esc(st.today) + '" data-pt-date-native>') +
      '</div><p class="pt-bdate__note" data-bizdate-note role="status" hidden></p></div>';
  }
  /* binds one bizHTML control inside host: Ubah opens the field; a change updates the line, the note and onChange */
  function bizBind(host, o) {
    var box = host && host.querySelector('[data-bizdate="' + o.id + '"]');
    if (!box) return;
    var btn = box.querySelector('[data-bizdate-edit]'), field = box.querySelector('[data-bizdate-field]'), nat = box.querySelector('[data-pt-date-native]') || box.querySelector('input[type=date]');
    btn.addEventListener('click', function () { var open = field.hidden; field.hidden = !open; btn.setAttribute('aria-expanded', String(open)); if (open) { var i = field.querySelector('input'); if (i) i.focus(); } });
    bizWatch(nat, box.querySelector('[data-bizdate-note]'), { effect: o.effect, label: 'Tanggal transaksi', onChange: function (iso, err) {
      var st = bizState(iso), v = box.querySelector('[data-bizdate-value]');
      if (v) v.textContent = st.chosen ? bizLabel(st.value) + ' \u2014 dipilih' : 'Hari ini, ' + bizLabel(st.today);
      if (err) { field.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
      if (o.onChange) o.onChange(iso, err);
    } });
  }
  root.MCBizDate = { today: bizToday, state: bizState, label: bizLabel, error: bizError, note: bizNote, watch: bizWatch, html: bizHTML, bind: bizBind };

  /* ---- 4. MCList: one data set, two representations (table >= 768 px, rows below) --------- */
  /* spec: { columns: [{ key, label, cls: 'is-num'|'is-center'|..., width, render(row) -> html }],
             rows, rowHref(row), rowLabel(row), phone: { title(row) -> text, meta(row) -> html,
             end(row) -> html, lead(row) -> html (r13: leading thumb) }, pageSize (25), caption, empty: { title, text, action },
             emptyFiltered: {...}, filtered: bool, select(row) (list-detail), selectedId,
             rowId(row), framed, onRetry,
             r13 compact: number: true -> a leftmost "No." column (table) and a quiet position before the title (phone
             rows): the DISPLAY position in the current sorted + filtered result (offset + index + 1), never an id;
             paging: { size: 10, sizes: [10, 20, 50], noun: 'invoice' } -> page-based pagination (MCPager footer,
             "Menampilkan 1–10 dari 18 invoice") instead of "Muat Lagi"; update() returns to page 1 (a filter or a
             sort changed), a selected row opens on its own page } */
  /* fit (r10): applies to any host holding .pt-list__table + .pt-list__rows (MCList, and custom lists
     built with the same markup): tighter cells for a small overflow, rows when it still does not fit */
  function fitList(host) {
    if (!host) return;
    host.classList.add('pt-list');
    host.classList.remove('pt-list--tight', 'pt-list--auto-rows');
    var w = host.querySelector('.pt-list__table .pt-table-wrap');
    if (mqPhone.matches || !w || !host.querySelector('.pt-list__rows')) return;
    if (w.scrollWidth - w.clientWidth > 2) {
      host.classList.add('pt-list--tight');
      if (w.scrollWidth - w.clientWidth > 2) host.classList.add('pt-list--auto-rows');
    }
  }
  function watchFit(host, fn) {
    var t = 0;
    root.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fn || function () { fitList(host); }, 120); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fn || function () { fitList(host); });
  }
  var listsMounted = 0;
  function mountList(host, spec) {
    spec = spec || {};
    /* r13 harmony: EVERY record list is numbered by default (display position, D-54); a list opts out only with
       number: false and a documented usability reason (COMPONENT_RULES "Numbered lists") */
    spec.number = spec.number !== false;
    var rows = spec.rows || [];
    var size = spec.pageSize || 25;
    var shown = size;
    var paging = spec.paging || null, page = 1, psize = paging ? (paging.size || 10) : 0;
    var mode = 'ready';
    var selected = spec.selectedId || null;
    var idOf = spec.rowId || function (r) { return r.id; };
    /* review hook: ?state=loading|empty|error shows that state on the page's first list (app map,
       owner review). Never used by product logic. */
    var demo = !listsMounted++ && R ? R.param('state') : null;
    if (demo === 'loading' || demo === 'error') mode = demo;
    if (demo === 'empty') rows = [];
    host.classList.add('pt-list');
    if (spec.forceRows) host.classList.add('pt-list--rows');

    function rowAttrs(r) {
      var href = spec.rowHref ? spec.rowHref(r) : null;
      var id = idOf(r);
      return (href ? ' data-href="' + esc(href) + '"' : '') + ' data-row-id="' + esc(id) + '"' + (selected && id === selected ? ' class="is-selected" aria-current="true"' : '');
    }
    var base = 0;                                         /* display offset of the visible slice */
    function tableHTML(list) {
      var cols = spec.columns;
      return '<div class="pt-table-wrap' + (spec.framed ? ' pt-table-wrap--framed' : '') + '"><table class="pt-table">' +
        (spec.caption ? '<caption class="mc-visually-hidden">' + esc(spec.caption) + '</caption>' : '') +
        '<thead><tr>' + (spec.number ? '<th scope="col" class="pt-col-no">No.</th>' : '') + cols.map(function (c) {
          return '<th scope="col" class="' + (c.cls || '') + '"' + (c.width ? ' style="width:' + c.width + '"' : '') + '>' + (c.labelHTML || esc(c.label || '')) + '</th>';
        }).join('') + (spec.chevron ? '<th scope="col" class="pt-col-chev"><span class="mc-visually-hidden">Buka</span></th>' : '') + '</tr></thead><tbody>' +
        list.map(function (r, i) {
          return '<tr' + rowAttrs(r) + '>' + (spec.number ? '<td class="pt-col-no">' + rowNo(base + i + 1) + '</td>' : '') + cols.map(function (c) {
            var v = c.render ? c.render(r) : esc(r[c.key] == null ? '—' : r[c.key]);
            return '<td class="' + (c.cls || '') + '">' + v + '</td>';
          }).join('') + (spec.chevron ? '<td class="pt-col-chev">' + (spec.rowHref && spec.rowHref(r) ? icon('chevron-right') : '') + '</td>' : '') + '</tr>';
        }).join('') + '</tbody>' + (spec.foot ? '<tfoot>' + spec.foot(rows) + '</tfoot>' : '') + '</table></div>';
    }
    function rowsHTML(list) {
      var ph = spec.phone || {};
      return '<ul class="pt-rows' + (ph.wrap ? ' pt-rows--wrap' : '') + (spec.number ? ' pt-rows--numbered' : '') + '" role="list">' + list.map(function (r, i) {
        var href = spec.rowHref ? spec.rowHref(r) : null;
        var tag = href ? 'a' : 'div';
        var title = ph.title ? ph.title(r) : (r.title || r.name || idOf(r));
        var meta = ph.meta ? ph.meta(r) : '';
        var end = ph.end ? ph.end(r) : '';
        var lead = ph.lead ? ph.lead(r) : '';   /* r13: an optional leading slot (a 40 px MCMedia thumb) */
        var sel = selected && String(idOf(r)) === String(selected);
        return '<li><' + tag + ' class="pt-row' + (href ? ' has-chevron' : '') + (lead ? ' has-lead' : '') + (sel ? ' is-selected' : '') + '"' + (href ? ' href="' + esc(href) + '"' : '') + (ph.wrap ? ' title="' + esc(title) + '"' : '') + ' data-row-id="' + esc(idOf(r)) + '"' + (sel ? ' aria-current="true"' : '') + ' title="' + esc(title) + '">' +
          (lead ? '<span class="pt-row__lead">' + lead + '</span>' : '') +
          '<span class="pt-row__main"><span class="pt-row__title">' + (spec.number ? '<span class="pt-row__no">' + (base + i + 1) + '</span>' : '') + esc(title) + '</span>' + (meta ? '<span class="pt-row__meta">' + meta + '</span>' : '') + '</span>' +
          '<span class="pt-row__end">' + end + '</span>' +
          (href ? icon('chevron-right', 'pt-row__chev') : '') + '</' + tag + '></li>';
      }).join('') + '</ul>';
    }
    function moreHTML() {
      if (rows.length <= size) return '';
      if (shown >= rows.length) return '<div class="pt-more"><p class="pt-more__end">Semua data sudah ditampilkan.</p></div>';
      return '<div class="pt-more">' + btn({ label: 'Muat Lagi', variant: 'outline', size: 'md', attrs: ' data-list-more' }) + '</div>';
    }
    function render(focusFrom) {
      if (mode === 'loading') { host.innerHTML = state('loading'); return; }
      if (mode === 'error') {
        host.innerHTML = state('error', { title: 'Bagian ini belum bisa dimuat', text: 'Data lain di halaman ini tetap bisa dipakai. Coba muat ulang bagian ini.', action: { label: 'Muat Ulang Bagian Ini', icon: 'refresh', action: '' } });
        var b = host.querySelector('.pt-state .mc-btn');
        if (b) { b.removeAttribute('data-action'); b.setAttribute('data-list-retry', ''); }
        return;
      }
      if (!rows.length) {
        var e = spec.filtered && spec.emptyFiltered ? spec.emptyFiltered : (spec.empty || { title: 'Belum ada data' });
        host.innerHTML = state('empty', e);
        return;
      }
      var list, foot;
      if (paging) {
        var st = pagerState(rows.length, page, psize);
        page = st.page; base = st.offset;
        list = rows.slice(st.offset, st.to);
        foot = pagerHTML(st, { noun: paging.noun, sizes: paging.sizes, sizeSelect: paging.sizeSelect });
      } else { base = 0; list = rows.slice(0, shown); foot = moreHTML(); }
      host.innerHTML = '<div class="pt-list__table">' + tableHTML(list) + '</div><div class="pt-list__rows">' + rowsHTML(list) + '</div>' + foot;
      fit();
      if (focusFrom != null) {                 /* after "Muat Lagi": focus the first new record */
        var vis = mqPhone.matches || spec.forceRows ? '.pt-list__rows .pt-row' : '.pt-list__table tbody tr a, .pt-list__table tbody tr button';
        var targets = host.querySelectorAll(vis);
        var t = targets[focusFrom];
        if (!t) { var trs = host.querySelectorAll('.pt-list__table tbody tr'); if (trs[focusFrom]) { trs[focusFrom].setAttribute('tabindex', '-1'); t = trs[focusFrom]; } }
        if (t) t.focus({ preventScroll: false });
      }
    }
    /* r10 fit: a table never hides columns behind a sideways scroll. A small overflow tightens the
       cells; if it still does not fit (narrow content column, tablet portrait), the list shows the
       same data as rows (its phone representation) until the space returns. */
    function fit() { if (!spec.forceRows) fitList(host); }
    watchFit(host, fit);
    function pageOfSelected() {
      if (!paging || !selected) return;
      var i = -1; rows.forEach(function (r, k) { if (i < 0 && String(idOf(r)) === String(selected)) i = k; });
      if (i >= 0) page = Math.floor(i / psize) + 1;
    }
    if (paging) {
      pagerBind(host, function (p, sz, trigger) {
        if (sz) { psize = sz; page = 1; } else page = p;
        render();
        /* keep the reader in the list: the first record of the new page takes the focus (the range is announced) */
        var first = host.querySelector(mqPhone.matches || spec.forceRows || host.classList.contains('pt-list--auto-rows') ? '.pt-list__rows .pt-row' : '.pt-list__table tbody tr a, .pt-list__table tbody tr');
        if (first && trigger && trigger.tagName !== 'SELECT') { if (first.tagName === 'TR') first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
        var top = host.getBoundingClientRect().top;
        if (top < 0) host.scrollIntoView({ block: 'start', behavior: mqReduce.matches ? 'auto' : 'smooth' });
        if (spec.onPage) spec.onPage(page, psize);
      });
    }
    host.addEventListener('click', function (e) {
      if (e.target.closest('[data-list-more]')) {
        var b = e.target.closest('[data-list-more]');
        if (b.classList.contains('is-pending')) return;
        b.classList.add('is-pending'); b.setAttribute('aria-busy', 'true');
        b.querySelector('.mc-btn__label').textContent = 'Memuat…';
        var from = shown;
        setTimeout(function () { shown += size; render(from); }, mqReduce.matches ? 150 : 420);
        return;
      }
      if (e.target.closest('[data-list-retry]')) { mode = 'loading'; render(); setTimeout(function () { mode = 'ready'; render(); if (spec.onRetry) spec.onRetry(); }, 500); return; }
      var tr = e.target.closest('tr[data-row-id], .pt-row[data-row-id]');
      if (!tr || !host.contains(tr)) return;
      if (spec.select) {
        var interactive = e.target.closest('a, button, input, select, label');
        if (interactive && interactive !== tr && !interactive.classList.contains('pt-cell__title') && !interactive.classList.contains('pt-row')) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        var id = tr.getAttribute('data-row-id');
        var r = rows.filter(function (x) { return String(idOf(x)) === id; })[0];
        if (r) { api.select(id); spec.select(r, tr); }
        return;
      }
      if (tr.tagName === 'TR' && tr.hasAttribute('data-href') && !e.target.closest('a, button, input, select, label')) {
        if (e.metaKey || e.ctrlKey) root.open(tr.getAttribute('data-href'), '_blank');
        else go(tr.getAttribute('data-href'), { source: 'link', trigger: tr });   /* r13: router-aware (guard asks first) */
      }
    });
    var api = {
      el: host,
      update: function (next, o) { rows = next || []; shown = size; page = o && o.keepPage ? page : 1; pageOfSelected(); spec.filtered = !!(o && o.filtered); mode = 'ready'; render(); },
      page: function () { return paging ? pagerState(rows.length, page, psize) : null; },
      goPage: function (p) { if (paging) { page = p; render(); } },
      setState: function (k) { mode = k; render(); },
      rows: function () { return rows.slice(); },
      select: function (id) {
        selected = id;
        qa('[data-row-id]', host).forEach(function (el) {
          var on = el.getAttribute('data-row-id') === String(id);
          el.classList.toggle('is-selected', on);
          if (on) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
        });
      }
    };
    pageOfSelected();
    render();
    return api;
  }
  root.MCList = { mount: mountList, fit: fitList, watchFit: watchFit };

  /* ---- 5. MCFilter: search + filters + company view --------------------------------------- */
  /* spec: { search: { placeholder, label }, selects: [{ key, label, options: [{ value, label }],
             value, allLabel }], company: true, onChange(state), chips: true } */
  function mountFilter(host, spec) {
    spec = spec || {};
    var st = { q: '' }, init = { company: 'all' };
    /* baseline = the page's normal view (s.default, e.g. Status: Aktif on Data Master), else 'all'. A value
       seeded from the address (?filter=7hari) differs from it, so it COUNTS on the Filter button. */
    (spec.selects || []).forEach(function (s) { st[s.key] = s.value || s.default || 'all'; init[s.key] = s.default || 'all'; });
    var showCompany = spec.company !== false && root.MCCompany.multi();
    if (showCompany) st.company = root.MCCompany.get();
    var sid = uid('flt');
    var html = '';
    if (spec.search) {
      html += '<div class="pt-toolbar__search"><label class="mc-input mc-input--sm">' + icon('search', 'mc-input__icon') +
        '<input class="mc-input__control" type="search" id="' + sid + '-q" placeholder="' + esc(spec.search.placeholder || 'Cari…') + '" aria-label="' + esc(spec.search.label || spec.search.placeholder || 'Cari') + '" autocomplete="off" spellcheck="false"></label></div>';
    }
    html += '<div class="pt-toolbar__filters">';
    if (showCompany) {
      html += '<label class="pt-filter pt-filter--company"><span class="pt-filter__label">Tampilkan:</span><select data-flt="company" aria-label="Tampilkan perusahaan">' +
        '<option value="all">Semua perusahaan</option>' + root.MCCompany.options().map(function (c) {
          return '<option value="' + esc(c.code) + '"' + (st.company === c.code ? ' selected' : '') + '>' + esc(c.name) + '</option>';
        }).join('') + '</select>' + icon('chevron-down') + '</label>';
    }
    (spec.selects || []).forEach(function (s) {
      html += '<label class="pt-filter"><span class="pt-filter__label">' + esc(s.label) + ':</span><select data-flt="' + esc(s.key) + '" aria-label="' + esc(s.label) + '">' +
        '<option value="all">' + esc(s.allLabel || 'Semua') + '</option>' +
        s.options.map(function (o) { return '<option value="' + esc(o.value) + '"' + (st[s.key] === o.value ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('') +
        '</select>' + icon('chevron-down') + '</label>';
    });
    html += '</div>';
    /* r11: the most used filters stay visible (company view + `visible` selects, default 2); the rest
       live behind ONE "Filter" button (desktop popover, phone sheet). Phones show the search + the
       Filter button only; the sheet then holds every filter. */
    var nSel = (spec.selects || []).length;
    var visibleN = spec.visible == null ? (showCompany ? 1 : 2) : spec.visible;   /* company view + 1 (or 2) promoted filters */
    var hasFilters = nSel > 0 || showCompany;
    if (hasFilters) {
      html += '<div class="pt-toolbar__more"><button class="mc-btn mc-btn--outline mc-btn--md pt-filterbtn" type="button" data-filter-toggle aria-expanded="false" aria-controls="' + sid + '-panel">' +
        icon('sliders') + '<span class="mc-btn__label">' + esc(spec.filterLabel || 'Filter') + '</span><span class="pt-filterbtn__count" hidden></span></button>' +
        '<div class="pt-filterpanel" id="' + sid + '-panel" role="dialog" aria-label="' + esc(spec.filterLabel || 'Filter') + '" hidden>' +
        '<div class="pt-filterpanel__scrim" data-filter-close></div><div class="pt-filterpanel__box">' +
        '<p class="pt-filterpanel__title">' + esc(spec.filterLabel || 'Filter') + '</p><div class="pt-filterpanel__body"></div>' +
        '<div class="pt-filterpanel__foot"><button class="mc-btn mc-btn--ghost mc-btn--md" type="button" data-filter-reset>Atur ulang</button>' +
        '<button class="mc-btn mc-btn--primary mc-btn--md" type="button" data-filter-close>Tampilkan hasil</button></div></div></div></div>';
    }
    if (spec.end || spec.count != null) html += '<div class="pt-toolbar__end">' + (spec.end || '') + (spec.count != null ? '<span class="pt-result-note" data-result-note>' + esc(spec.count) + '</span>' : '') + '</div>';
    host.classList.add('pt-toolbar');
    host.setAttribute('role', 'search');
    host.innerHTML = html;
    var inline = host.querySelector('.pt-toolbar__filters');
    var more = host.querySelector('.pt-toolbar__more');
    var panel = host.querySelector('.pt-filterpanel'), pbody = host.querySelector('.pt-filterpanel__body');
    var fbtn = host.querySelector('[data-filter-toggle]');
    var allF = qa('.pt-filter', inline);
    function arrange() {
      if (!more) return;
      var phone = mqPhone.matches, inPanel = 0;
      allF.forEach(function (f, i) {
        var idx = showCompany ? i - 1 : i;                /* the company view is never "extra" on wide screens */
        var extra = phone || (idx >= visibleN);   /* phones: every filter (also a lone company view) lives in the sheet; a long select never overflows the row */
        (extra ? pbody : inline).appendChild(f);
        if (extra) inPanel++;
      });
      more.hidden = inPanel === 0;
      var fnote = pbody.querySelector('.pt-filterpanel__note'); if (fnote) pbody.appendChild(fnote);   /* the note stays under the selects */
      /* the toolbar never wraps: while it takes two rows, the last promoted select moves into the panel
         (the company view stays) */
      if (!phone) {
        var guard = 8;
        var searchBox = host.querySelector('.pt-toolbar__search');
        var narrow = function () { return searchBox && searchBox.offsetWidth > 0 && searchBox.offsetWidth < 280; };
        while (guard-- > 0 && (wraps() || narrow())) {
          var promoted = qa('.pt-filter:not(.pt-filter--company)', inline);
          if (!promoted.length) break;
          more.hidden = false;
          pbody.insertBefore(promoted[promoted.length - 1], pbody.firstChild);
          inPanel++;
        }
      }
      host.classList.toggle('has-more-filters', inPanel > 0);
      /* a result note that would sit alone on a second row is dropped (the list head can carry the count) */
      var endBox = host.querySelector('.pt-toolbar__end');
      if (endBox && !endBox.querySelector(':not(.pt-result-note)')) {
        endBox.classList.remove('is-wrapped');
        var first = host.querySelector('.pt-toolbar__search') || host.firstElementChild;
        if (first && endBox.offsetWidth && endBox.getBoundingClientRect().top >= first.getBoundingClientRect().bottom - 2) endBox.classList.add('is-wrapped');
      }
      count();
    }
    function wraps() {
      var items = qa('.pt-toolbar__search, .pt-toolbar__filters > .pt-filter, .pt-toolbar__more:not([hidden]), .pt-toolbar__end', host).filter(function (e) {
        return e.offsetWidth > 0 && !(e.classList.contains('pt-toolbar__end') && !e.querySelector(':not(.pt-result-note)'));   /* a result note never forces a filter away */
      });
      if (items.length < 2) return false;
      /* two rows = some item lies entirely below another (vertical overlap, robust to mixed control heights) */
      var rs = items.map(function (e) { return e.getBoundingClientRect(); });
      var minBottom = Math.min.apply(null, rs.map(function (r) { return r.bottom; }));
      return rs.some(function (r) { return r.top >= minBottom - 2; });
    }
    function count() {
      if (!fbtn) return;
      var n = qa('select[data-flt]', pbody).filter(function (s) { var k = s.getAttribute('data-flt'); return !s.disabled && s.value !== (init[k] || 'all'); }).length;
      var c = fbtn.querySelector('.pt-filterbtn__count');
      c.hidden = !n; c.textContent = n || '';
      var coSel = pbody.querySelector('select[data-flt="company"]'), lab = fbtn.querySelector('.mc-btn__label');
      if (lab) lab.textContent = (spec.filterLabel || 'Filter') + (coSel && coSel.value !== 'all' ? ' · ' + coSel.value : '');
      fbtn.setAttribute('aria-label', (spec.filterLabel || 'Filter') + (n ? ' (' + n + ' aktif)' : ''));
    }
    var popOpen = false;
    function onOut(e) { if (!panel.contains(e.target) && !fbtn.contains(e.target)) setPanel(false); }
    function setPanel(on, focus) {
      if (!panel || on === popOpen) return;
      popOpen = on;
      panel.hidden = !on;
      fbtn.setAttribute('aria-expanded', String(on));
      panel.classList.toggle('is-sheet', on && mqPhone.matches);
      if (on && !mqPhone.matches) {            /* fixed under the button: a card (overflow hidden) never clips it */
        var r = fbtn.getBoundingClientRect();
        panel.style.position = 'fixed';
        panel.style.top = Math.round(r.bottom + 6) + 'px';
        panel.style.right = Math.round(Math.max(8, root.innerWidth - r.right)) + 'px';
      } else { panel.style.position = ''; panel.style.top = ''; panel.style.right = ''; }
      doc.documentElement.classList.toggle('pt-filter-sheet-open', on && mqPhone.matches);
      if (on) {
        doc.addEventListener('pointerdown', onOut, true);
        var first = panel.querySelector('select, button'); if (first) first.focus({ preventScroll: true });
        if (!mqReduce.matches && panel.animate) panel.querySelector('.pt-filterpanel__box').animate(mqPhone.matches ? [{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'none', opacity: 1 }] : [{ transform: 'translateY(-4px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 180, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' });
      } else {
        doc.removeEventListener('pointerdown', onOut, true);
        if (focus !== false) fbtn.focus({ preventScroll: true });
      }
    }
    if (more) {
      arrange();
      if (mqPhone.addEventListener) mqPhone.addEventListener('change', function () { setPanel(false, false); arrange(); });
      var arrT = 0;
      root.addEventListener('resize', function () { if (popOpen) return; clearTimeout(arrT); arrT = setTimeout(arrange, 120); });
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { if (!popOpen) arrange(); });
      fbtn.addEventListener('click', function () { setPanel(!popOpen); });
      root.addEventListener('scroll', function () { if (popOpen && !mqPhone.matches) setPanel(false, false); }, { passive: true });
      panel.addEventListener('click', function (e) {
        if (e.target.closest('[data-filter-close]')) setPanel(false);
        else if (e.target.closest('[data-filter-reset]')) {
          qa('select[data-flt]', pbody).forEach(function (s) { var base = init[s.getAttribute('data-flt')] || 'all'; if (!s.disabled && s.value !== base) { s.value = base; s.dispatchEvent(new Event('change', { bubbles: true })); } });
        }
      });
      panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setPanel(false); } });
      host.addEventListener('change', count);
    }
    var t = 0;
    function emit() { if (spec.onChange) spec.onChange(api.state()); }
    host.addEventListener('input', function (e) {
      if (e.target.type === 'search') { st.q = e.target.value; clearTimeout(t); t = setTimeout(emit, 140); }
    });
    host.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-flt');
      if (!k) return;
      st[k] = e.target.value;
      if (k === 'company') root.MCCompany.set(st.company);
      emit();
    });
    var api = {
      /* r11: disable(keys, note): selects that do not apply to the current view (e.g. a tab) are disabled
         with one note in the panel; enable() restores them. Disabled selects never count as active. */
      disable: function (keys, note) {
        qa('select[data-flt]', host).forEach(function (s) { s.disabled = keys.indexOf(s.getAttribute('data-flt')) >= 0; });
        var old = host.querySelector('.pt-filterpanel__note'); if (old) old.remove();
        if (keys.length && note && pbody) pbody.insertAdjacentHTML('beforeend', '<p class="pt-filterpanel__note">' + esc(note) + '</p>');
        count();
      },
      enable: function () { api.disable([], null); },
      /* r11: the quiet result note in the toolbar end ("10 proyek") */
      count: function (text) { var n = host.querySelector('[data-result-note]'); if (n) n.textContent = text; },
      state: function () { var o = {}; Object.keys(st).forEach(function (k) { o[k] = st[k]; }); o.active = !!(st.q || Object.keys(st).some(function (k) { return k !== 'q' && k !== 'company' && st[k] !== 'all'; })); return o; },
      reset: function () {
        st.q = '';
        var inp = host.querySelector('input[type=search]'); if (inp) inp.value = '';
        (spec.selects || []).forEach(function (s) { st[s.key] = 'all'; var el = host.querySelector('[data-flt="' + s.key + '"]'); if (el) el.value = 'all'; });
        emit();
      }
    };
    return api;
  }
  root.MCFilter = { mount: mountFilter };
  /* text match helper for client-side filtering (accent / case insensitive) */
  root.MCFilter.match = function (text, query) {
    if (!query) return true;
    function n(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    return n(text).indexOf(n(query).trim()) >= 0;
  };

  /* ---- 6. MCTabs: the parts of a record ---------------------------------------------------- */
  /* spec: { tabs: [{ id, label, count, attention, fact, render(panel) }], label, param ('tab'),
             initial, onChange(id), drill: { title, back } }
     drill (detail-hub archetype, canonical phone pattern): below 768 px the first part renders
     inline and the other parts become a list of rows (label + derived fact) that open the part in
     a full-height sheet (MCSheet) with a "Kembali ke ..." control. Tablet / desktop: real tabs. */
  /* r12 (D-49) VIEW mode: a tab row whose every tab is its OWN entry of the role's navigation
     (MCProject.navCovers(route, param, tab ids)) is module navigation, not parts of one object. Then
     the address selects the view: only that panel shows (no tablist, no role=tabpanel pointing at a
     missing tab), its render + onChange run, h1 and document.title come from ROUTES[route].views, and
     the address is never rewritten (each view is its own page load). Projects whose navigation does
     not list the views keep the real tab row; pages need no change either way. Panels keep the
     .pt-tabpanel class (hidden when not selected) so page code may still address them by index. */
  function viewParam(spec, tabs) {
    var param = spec.param === false ? null : (spec.param || 'tab');
    var here = R ? R.current() : null;
    if (!param || !here || !P || !P.navCovers) return null;
    return P.navCovers(here.id, param, tabs.map(function (t) { return t.id; })) ? param : null;
  }
  function mountView(host, spec, param) {
    var tabs = spec.tabs.filter(Boolean), base = uid('view'), here = R.current(), rendered = {};
    function pick(v) { return v != null && tabs.some(function (t) { return t.id === v; }) ? v : null; }
    var current = pick(R.param(param)) || pick((here.defaults || {})[param]) || pick(spec.initial) || tabs[0].id;
    host.classList.add('pt-views');
    host.innerHTML = tabs.map(function (t) {
      return '<div class="pt-tabpanel pt-viewpanel" id="' + base + '-p-' + esc(t.id) + '" data-view="' + esc(t.id) + '" hidden></div>';
    }).join('');
    if (spec.toolbar && spec.toolbar.nodeType === 1) host.insertAdjacentElement('afterbegin', spec.toolbar);
    function select(id) {
      var t = tabs.filter(function (x) { return x.id === id; })[0];
      if (!t) return;
      current = id;
      qa('.pt-viewpanel', host).forEach(function (p) {
        var on = p.getAttribute('data-view') === id;
        if (on && !rendered[id]) { rendered[id] = true; if (t.render) t.render(p); }
        p.hidden = !on;
      });
      var v = R.view ? R.view(here.id, id) : null, label = v ? v.title : t.label;
      var h = q('[data-page-title]'), tt = q('title[data-page]');
      if (h && label) h.textContent = label;
      if (tt && label) { tt.setAttribute('data-page', label); doc.title = root.MCBrand ? root.MCBrand.title(label) : label; }
      if (spec.onChange) spec.onChange(id);
    }
    select(current);
    return { select: select, current: function () { return current; }, el: host, mode: function () { return 'view'; } };
  }
  function mountTabs(host, spec) {
    var vp = spec.tabs ? viewParam(spec, spec.tabs.filter(Boolean)) : null;
    if (vp) return mountView(host, spec, vp);
    if (spec.drill) {
      var api = null, mode = null;
      var build = function () {
        var next = mqPhone.matches ? 'drill' : 'tabs';
        if (next === mode) return;
        mode = next;
        api = next === 'drill' ? mountDrill(host, spec) : mountTabsReal(host, spec);
      };
      build();
      if (mqPhone.addEventListener) mqPhone.addEventListener('change', build);
      return { select: function (id) { api.select(id); }, current: function () { return api.current(); }, el: host, mode: function () { return mode; } };
    }
    return mountTabsReal(host, spec);
  }
  function mountDrill(host, spec) {
    var tabs = spec.tabs.filter(Boolean), first = tabs[0], rest = tabs.slice(1);
    var base = uid('drill');
    /* parts list first (one tap to any part), then the first part's content */
    host.innerHTML = '<section class="mc-card pt-section pt-parts" aria-labelledby="' + base + '-t"><div class="pt-section__head"><h2 class="pt-section__title" id="' + base + '-t">' + esc(spec.drill.title || 'Bagian') + '</h2></div>' +
      '<ul class="pt-rows" role="list">' + rest.map(function (t) {
        return '<li><button type="button" class="pt-row has-chevron pt-part" data-part="' + esc(t.id) + '"><span class="pt-row__main"><span class="pt-row__title">' + esc(t.label) + '</span>' +
          (t.fact ? '<span class="pt-row__meta"><span>' + esc(t.fact) + '</span></span>' : '') + '</span><span class="pt-row__end">' +
          (t.count != null && t.count !== '' ? '<span class="pt-tab__count' + (t.attention ? ' is-attention' : '') + '">' + esc(t.count) + '</span>' : '') + '</span>' +
          icon('chevron-right', 'pt-row__chev') + '</button></li>';
      }).join('') + '</ul></section><div class="pt-drill__first" id="' + base + '-first"></div>';
    var firstHost = host.querySelector('.pt-drill__first');
    firstHost.dataset.drill = 'first';               /* r11: the part knows it renders inline under the parts list */
    if (first.render) first.render(firstHost);
    var current = first.id;
    function open(id) {
      var t = tabs.filter(function (x) { return x.id === id; })[0];
      if (!t || t === first) return;
      current = id;
      var sh = openSheet({ title: t.label, back: spec.drill.back || 'Kembali', html: '<h2 class="pt-sheet__title">' + esc(t.label) + '</h2><div class="pt-sheet__part"></div>', onClose: function () { current = first.id; } });
      if (t.render) t.render(sh.body.querySelector('.pt-sheet__part'));
      if (spec.onChange) spec.onChange(id);
    }
    host.addEventListener('click', function (e) { var b = e.target.closest('[data-part]'); if (b && host.contains(b)) open(b.getAttribute('data-part')); });
    /* a deep link (?tab=<part>) opens that part's sheet on phones too (r10, B2) */
    var deep = spec.param === false ? null : (R ? R.param(spec.param || 'tab') : null);
    if (deep && deep !== first.id && rest.some(function (t) { return t.id === deep; })) setTimeout(function () { open(deep); }, 0);
    return { select: open, current: function () { return current; }, el: host };
  }
  function mountTabsReal(host, spec) {
    var base = uid('tab');
    var param = spec.param === false ? null : (spec.param || 'tab');
    var fromUrl = param && R ? R.param(param) : null;
    var tabs = spec.tabs.filter(Boolean);
    var current = tabs.some(function (t) { return t.id === fromUrl; }) ? fromUrl : (spec.initial || tabs[0].id);
    var rendered = {};
    host.innerHTML = '<div class="pt-tabbar"><div class="pt-tabs" role="tablist" aria-label="' + esc(spec.label || 'Bagian') + '">' + tabs.map(function (t) {
      return '<button class="pt-tab" type="button" role="tab" id="' + base + '-' + t.id + '" aria-controls="' + base + '-p-' + t.id + '" aria-selected="false" tabindex="-1" data-tab="' + esc(t.id) + '">' +
        (t.shortLabel ? '<span class="pt-tab__long">' + esc(t.label) + '</span><span class="pt-tab__short">' + esc(t.shortLabel) + '</span>' : esc(t.label)) +
        (t.count != null && t.count !== '' ? '<span class="pt-tab__count' + (t.attention ? ' is-attention' : '') + '">' + esc(t.count) + '</span>' : '') + '</button>';
    }).join('') + '</div><div class="pt-tabmore" hidden></div></div>' + tabs.map(function (t) {
      return '<div class="pt-tabpanel" role="tabpanel" id="' + base + '-p-' + t.id + '" aria-labelledby="' + base + '-' + t.id + '" tabindex="0" hidden></div>';
    }).join('');
    var list = host.querySelector('.pt-tabs');
    var more = host.querySelector('.pt-tabmore');
    /* r11: a toolbar that filters the selected tab sits right under the tab row (spec.toolbar: element) */
    if (spec.toolbar && spec.toolbar.nodeType === 1) host.querySelector('.pt-tabbar').insertAdjacentElement('afterend', spec.toolbar);
    /* overflow cue (phones): the row fades at the edge that has more tabs */
    function edges() {
      list.classList.toggle('has-more-end', list.scrollLeft + list.clientWidth < list.scrollWidth - 2);
      list.classList.toggle('has-more-start', list.scrollLeft > 2);
    }
    /* r11 (D-29): on tablet / desktop the tabs that do not fit collapse into ONE "Bagian Lain" menu at
       the end of the row (glossary GL-188) (the selected tab always stays visible, natural order kept); phones keep the
       swipeable row with the edge fade. */
    function fit() {
      var bs = qa('.pt-tab', list);
      bs.forEach(function (b) { b.hidden = false; });
      more.hidden = true; more.innerHTML = '';
      if (mqPhone.matches || list.scrollWidth <= list.clientWidth + 1) { edges(); return; }
      more.hidden = false;
      more.innerHTML = menuHTML({ text: 'Bagian Lain', label: 'Bagian lain', variant: 'ghost', size: 'md', items: [] });
      var hiddenTabs = [];
      for (var i = bs.length - 1; i > 0 && list.scrollWidth > list.clientWidth + 1; i--) {
        if (bs[i].getAttribute('data-tab') === current) continue;
        bs[i].hidden = true; hiddenTabs.unshift(bs[i]);
      }
      var tpl = more.querySelector('template');
      tpl.innerHTML = menuItemsHTML(hiddenTabs.map(function (b) {
        var t = tabs.filter(function (x) { return x.id === b.getAttribute('data-tab'); })[0];
        return { label: t.label + (t.count != null && t.count !== '' ? ' (' + t.count + ')' : ''), attrs: ' data-tab-pick="' + esc(t.id) + '" data-tab-host="' + base + '"' };
      }));
      edges();
    }
    doc.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab-pick]');
      if (!b || b.getAttribute('data-tab-host') !== base) return;
      select(b.getAttribute('data-tab-pick'), { animate: true });
      fit();
      var on = list.querySelector('.pt-tab[aria-selected="true"]'); if (on) setTimeout(function () { on.focus({ preventScroll: true }); }, 0);
    });
    list.addEventListener('scroll', edges, { passive: true });
    var fitT = 0;
    root.addEventListener('resize', function () { clearTimeout(fitT); fitT = setTimeout(fit, 80); });
    setTimeout(fit, 0);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fit);
    function select(id, o) {
      o = o || {};
      var t = tabs.filter(function (x) { return x.id === id; })[0];
      if (!t) return;
      current = id;
      qa('.pt-tab', list).forEach(function (b) {
        var on = b.getAttribute('data-tab') === id;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        if (on && o.scroll !== false) {
          var lr = list.getBoundingClientRect(), br = b.getBoundingClientRect();
          if (br.left < lr.left || br.right > lr.right) list.scrollLeft += br.left - lr.left - 24;
        }
      });
      qa('.pt-tabpanel', host).forEach(function (p) {
        var on = p.id === base + '-p-' + id;
        if (on && !rendered[id]) { rendered[id] = true; if (t.render) t.render(p); }
        if (on && p.hidden && o.animate) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
        p.hidden = !on;
      });
      if (param && o.push !== false) {
        try {
          var u = new URL(root.location.href);
          if (id === tabs[0].id) u.searchParams.delete(param); else u.searchParams.set(param, id);
          root.history.replaceState(root.history.state, '', u.pathname.split('/').pop() + u.search + u.hash);
        } catch (e) { /* file:// history may refuse */ }
      }
      if (spec.onChange) spec.onChange(id);
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('.pt-tab');
      if (b) select(b.getAttribute('data-tab'), { animate: true });
    });
    list.addEventListener('keydown', function (e) {
      var bs = qa('.pt-tab', list).filter(function (x) { return !x.hidden; }), i = bs.indexOf(doc.activeElement), n = bs.length, j = -1;
      if (i < 0) return;
      if (e.key === 'ArrowRight') j = (i + 1) % n;
      else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = n - 1;
      if (j < 0) return;
      e.preventDefault();
      bs[j].focus();
      select(bs[j].getAttribute('data-tab'), { animate: true });
    });
    select(current, { push: false });
    return { select: function (id) { select(id, { animate: true }); }, current: function () { return current; }, el: host };
  }
  root.MCTabs = { mount: mountTabs };

  /* MCSeg: a segmented switch (aria-pressed buttons) for views inside one section. */
  root.MCSeg = {
    mount: function (host, spec) {
      var cur = spec.value || spec.options[0].value;
      host.innerHTML = '<div class="pt-seg" role="group" aria-label="' + esc(spec.label || 'Tampilan') + '">' + spec.options.map(function (o) {
        return '<button type="button" data-seg="' + esc(o.value) + '" aria-pressed="' + (o.value === cur) + '">' + esc(o.label) +
          (o.count != null ? ' <span class="pt-muted">(' + esc(o.count) + ')</span>' : '') + '</button>';
      }).join('') + '</div>';
      host.addEventListener('click', function (e) {
        var b = e.target.closest('[data-seg]');
        if (!b) return;
        cur = b.getAttribute('data-seg');
        qa('[data-seg]', host).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        if (spec.onChange) spec.onChange(cur);
      });
      return {
        value: function () { return cur; },
        /* r11: update without re-mounting (no duplicate listeners) */
        set: function (v) { cur = v; qa('[data-seg]', host).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-seg') === v)); }); },
        counts: function (map) {
          qa('[data-seg]', host).forEach(function (x) {
            var o = spec.options.filter(function (op) { return op.value === x.getAttribute('data-seg'); })[0];
            if (!o || !(o.value in map)) return;
            x.innerHTML = esc(o.label) + (map[o.value] != null ? ' <span class="pt-muted">(' + esc(map[o.value]) + ')</span>' : '');
          });
        }
      };
    }
  };

  /* ---- 7. MCSheet: phone / narrow detail sheet (application layer) --------------------------- */
  /* Non-critical layer: scrim, Esc, the "Kembali ke daftar" control and browser Back all close it
     (overlay contract). Focus moves in, is trapped, and returns to the opener. */
  var sheetOpen = null;
  var sheetEntry = false;                     /* our pushed history entry is on top */
  function openSheet(o) {
    if (sheetOpen) sheetOpen.close(true, 'replace');
    var opener = doc.activeElement;
    var id = uid('sheet');
    var layer = doc.createElement('div');
    layer.className = 'pt-sheet-layer';
    layer.innerHTML = '<div class="pt-sheet-layer__scrim" data-sheet-close></div>' +
      '<div class="pt-sheet" role="dialog" aria-modal="true" aria-labelledby="' + id + '-t">' +
      '<div class="pt-sheet__head"><button class="pt-sheet__back' + (o.close === 'x' ? ' pt-sheet__back--close' : '') + '" type="button" data-sheet-close>' +
      (o.close === 'x' ? icon('x', 'mc-icon--20') + '<span>' + esc(o.back || 'Tutup') + '</span>' : icon('arrow-left', 'mc-icon--20') + '<span>' + esc(o.back || 'Kembali ke daftar') + '</span>') + '</button>' +
      '<h2 class="mc-visually-hidden" id="' + id + '-t">' + esc(o.title || '') + '</h2></div>' +
      '<div class="pt-sheet__body">' + (o.html || '') + '</div></div>';
    var inert = [];
    Array.prototype.forEach.call(doc.body.children, function (el) {
      if (el.id === 'mc-icon-sprite' || el.tagName === 'SCRIPT' || el.inert || el.classList.contains('mc-toasts')) return;
      el.inert = true; inert.push(el);
    });
    doc.body.appendChild(layer);
    doc.documentElement.classList.add('pt-sheet-open');
    var sheet = layer.querySelector('.pt-sheet');
    if (!mqReduce.matches) {
      sheet.animate([{ transform: 'translateX(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 240, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' });
      layer.firstChild.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'linear' });
    }
    if (!sheetEntry) { try { root.history.pushState({ ptSheet: id }, ''); sheetEntry = true; } catch (e) { /* file:// may refuse */ } }
    function onPop(e) {
      if (e && e.state && e.state.ptSheet) { sheetEntry = true; return; }   /* a late back() landed on a sheet entry */
      sheetEntry = false;
      close(true, 'pop');
    }
    root.addEventListener('popstate', onPop);
    var done = false;
    function close(quick, mode) {
      if (done) return;
      done = true;
      sheetOpen = null;
      root.removeEventListener('popstate', onPop);
      inert.forEach(function (el) { el.inert = false; });
      doc.documentElement.classList.remove('pt-sheet-open');
      var a = layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: quick || mqReduce.matches ? 120 : 180, easing: 'linear', fill: 'forwards' });
      a.onfinish = a.oncancel = function () { layer.remove(); };
      if (mode !== 'pop' && mode !== 'replace' && sheetEntry) { sheetEntry = false; try { root.history.back(); } catch (e) { /* ignore */ } }
      if (mode !== 'replace' && opener && doc.contains(opener)) opener.focus({ preventScroll: true });
      if (o.onClose) o.onClose();
    }
    layer.addEventListener('click', function (e) { if (e.target.closest('[data-sheet-close]')) close(false); });
    layer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(false); return; }
      if (e.key !== 'Tab') return;
      var f = qa('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]', sheet).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var i = f.indexOf(doc.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    try { layer.querySelector('.pt-sheet__back').focus({ preventScroll: true, focusVisible: o.fromKeyboard === true }); } catch (x) { layer.querySelector('.pt-sheet__back').focus({ preventScroll: true }); }
    sheetOpen = { close: close, body: layer.querySelector('.pt-sheet__body'), layer: layer };
    return sheetOpen;
  }
  root.MCSheet = { open: openSheet, close: function () { if (sheetOpen) sheetOpen.close(false); }, get isOpen() { return !!sheetOpen; } };

  /* ---- 8. MCRisk: risk-based confirmation + double-execution protection ----------------------- */
  /* LOW          reversible, local, no money or stock: execute at once (still guarded).
     COMMIT       creates a business record or a lasting state (save a purchase, record a
                  payment, issue an invoice): validate FIRST; invalid -> no dialog, the caller
                  shows the field errors; valid -> one confirmation that summarises what will be
                  recorded and its consequence -> execute with a pending state.
     DESTRUCTIVE  discards input or cancels / voids a record: explains the consequence, the safe
                  choice (Kembali / Batal) has the focus, the scrim does not answer.
     CRITICAL     (very high risk: void an issued document, write off a receivable, force-complete
                  a project, change access): DESTRUCTIVE + a required reason and/or a typed
                  confirmation word; the confirm button stays disabled until both are valid.
                  Production adds step-up re-authentication (documented; not simulated).
     Guard: one in-flight execution per key; the trigger is disabled + aria-busy while pending, a
     second click or Enter is ignored. Backend idempotency (command id per submission) is an
     EXTERNAL responsibility, documented in docs/APP_ARCHITECTURE.md. */
  var inflight = {};
  function summaryHTML(rows) {
    if (!rows || !rows.length) return '';
    return '<dl class="pt-kv mc-modal__summary">' + rows.map(function (r) {
      return '<dt>' + esc(r[0]) + '</dt><dd>' + (r[2] ? r[1] : esc(r[1])) + '</dd>';
    }).join('') + '</dl>';
  }
  function setPending(el, on, label) {
    if (!el) return;
    if (on) {
      el.classList.add('is-pending');
      el.setAttribute('aria-busy', 'true');
      el.setAttribute('aria-disabled', 'true');
      var lab = el.querySelector('.mc-btn__label');
      if (lab) { el.setAttribute('data-label', lab.textContent); if (label) lab.textContent = label; }
      if (!el.querySelector('.mc-btn__spin')) el.insertAdjacentHTML('afterbegin', icon('loader', 'mc-btn__spin'));
    } else {
      el.classList.remove('is-pending');
      el.removeAttribute('aria-busy');
      el.removeAttribute('aria-disabled');
      var l2 = el.querySelector('.mc-btn__label');
      if (l2 && el.hasAttribute('data-label')) l2.textContent = el.getAttribute('data-label');
      el.removeAttribute('data-label');
    }
  }
  function run(spec) {
    spec = spec || {};
    var key = spec.key || 'risk';
    if (inflight[key]) return Promise.resolve(false);
    /* r13 (persistent shell): the page that asked. When it is swapped out (or already leaving because the user
       chose another destination) while the command runs, the command's session write and its toast stand, but
       the page's own follow-up (navigate to the new record, re-render, focus) never runs on the next page. */
    var S = root.MCScope, gen0 = S && S.active ? S.gen : null;
    function gone() { return gen0 !== null && typeof S.alive === 'function' && !S.alive(gen0); }
    var level = spec.level || 'low';
    if ((level === 'commit' || level === 'critical' || level === 'destructive') && spec.validate && spec.validate() === false) return Promise.resolve(false);
    var c = spec.confirm || {};
    var ask;
    if (level === 'low' || !root.MCDialog) ask = Promise.resolve(true);
    else {
      var extra = '';
      var needReason = level === 'critical' ? c.reason !== false : c.reason === true;
      /* r13 phase 5b: vouching statements shown in full + ONE required tick before the confirm button activates
         (canonical SCR-55 "Mulai Penomoran": statements (a)-(d), "Saya menyatakan hal di atas benar") */
      var stmts = (c.statements || []).filter(Boolean);
      if (stmts.length || c.ack) {
        extra += (stmts.length ? '<ol class="pt-risk-statements" role="list">' + stmts.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' : '') +
          '<label class="pt-risk-ack"><input type="checkbox" data-risk-ack><span>' + esc(c.ack || 'Saya menyatakan hal di atas benar') + '</span></label>';
      }
      if (needReason || c.typed) {
        extra += (needReason ? '<label class="mc-field pt-risk-field"><span class="mc-field__label">' + esc(c.reasonLabel || 'Alasan (wajib, tercatat di Riwayat Aktivitas)') + '</span>' +
          '<textarea class="mc-input__control pt-risk-reason" rows="3" data-risk-reason' + (c.reasonPlaceholder ? ' placeholder="' + esc(c.reasonPlaceholder) + '"' : '') + '></textarea></label>' : '') +
          (c.typed ? '<label class="mc-field pt-risk-field"><span class="mc-field__label">Ketik <strong>' + esc(c.typed) + '</strong> untuk melanjutkan</span>' +
          '<input class="mc-input__control pt-risk-typed" type="text" autocomplete="off" spellcheck="false" data-risk-typed></label>' : '');
      }
      ask = root.MCDialog.confirm({
        title: c.title || 'Lanjutkan?',
        message: c.message || '',
        html: summaryHTML(c.summary) + (c.consequence ? '<p class="mc-modal__consequence">' + esc(c.consequence) + '</p>' : '') + extra,
        confirm: c.ok || 'Lanjutkan',
        cancel: c.cancel || 'Kembali',
        tone: level === 'commit' ? null : 'danger',
        returnFocus: spec.trigger || doc.activeElement
      });
      if (needReason || c.typed || stmts.length || c.ack) {
        var layer = qa('.mc-modal-layer').pop();
        var ok = layer && layer.querySelector('[data-modal-ok]');
        var reason = layer && layer.querySelector('[data-risk-reason]');
        var typed = layer && layer.querySelector('[data-risk-typed]');
        var ack = layer && layer.querySelector('[data-risk-ack]');
        var check = function () {
          var valid = (!reason || reason.value.trim().length >= (c.minReason || 10)) && (!typed || typed.value.trim().toUpperCase() === String(c.typed).toUpperCase()) && (!ack || ack.checked);
          if (ok) ok.disabled = !valid;
        };
        if (layer) { layer.addEventListener('input', check); layer.addEventListener('change', check); check(); }
        ask = ask.then(function (yes) { spec.reasonValue = reason ? reason.value.trim() : ''; return yes; });
      }
    }
    return ask.then(function (yes) {
      if (!yes || gone()) return false;
      inflight[key] = true;
      setPending(spec.trigger, true, spec.pendingLabel);
      var exec = spec.execute ? spec.execute(spec.reasonValue) : null;
      var wait = new Promise(function (res) { setTimeout(res, spec.latency != null ? spec.latency : (mqReduce.matches ? 300 : 700)); });
      return Promise.all([Promise.resolve(exec), wait]).then(function (out) {
        inflight[key] = false;
        setPending(spec.trigger, false);
        var result = out[0];
        var s = typeof spec.success === 'function' ? spec.success(result) : spec.success;
        if (s) toast(s.type || 'success', s.title, s.message);
        if (gone()) return new Promise(function () { /* never settles: no follow-up for a page that is gone */ });
        return result === undefined ? true : result;
      }, function (err) {
        inflight[key] = false;
        setPending(spec.trigger, false);
        toast('error', (spec.failure && spec.failure.title) || 'Belum berhasil disimpan', (spec.failure && spec.failure.message) || 'Tidak ada yang berubah. Periksa koneksi lalu coba lagi.');
        return false;
      });
    });
  }
  root.MCRisk = { run: run, pending: function (key) { return !!inflight[key]; }, setPending: setPending, summary: summaryHTML };

  /* ---- 9. MCAction: delegated [data-action] handlers and [data-demo] demo actions ------------ */
  /* <button data-action="issue-invoice"> -> MCAction.on('issue-invoice', fn(el, event)).
     <button data-demo="Unduhan PDF disimulasikan" data-demo-meta="..."> -> an info toast that
     says what the real product does (DEMO ACTION class of the no-dead-control rule). */
  var handlers = {};
  /* r13 (persistent shell): a handler registered by PAGE code (MCScope.owner() === 'page': a page module,
     or anything after the shell booted) belongs to that page; the router drops it when the page is
     swapped out and restores a shell handler of the same name. pageActions: name -> shell handler | null */
  var pageActions = {};
  function scopeOwner() { var S = root.MCScope; return S && S.owner ? S.owner() : 'shell'; }
  doc.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action], [data-demo]');
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    if (el.hasAttribute('data-action')) {
      var name = el.getAttribute('data-action');
      if (!name) return;
      if (handlers[name]) { e.preventDefault(); handlers[name](el, e); }
      else if (root.console) root.console.warn('[MCAction] no handler for', name);
      return;
    }
    e.preventDefault();
    toast('info', el.getAttribute('data-demo'), el.getAttribute('data-demo-meta') || 'Contoh di prototipe: tidak ada data yang dikirim.');
  });
  root.MCAction = {
    on: function (name, fn) {
      if (scopeOwner() === 'page') { if (!Object.prototype.hasOwnProperty.call(pageActions, name)) pageActions[name] = handlers[name] || null; }
      else if (Object.prototype.hasOwnProperty.call(pageActions, name)) { pageActions[name] = fn; return; }   /* shell handler under a page one */
      handlers[name] = fn;
    },
    has: function (name) { return !!handlers[name]; },
    names: function () { return Object.keys(handlers); }
  };

  /* ---- 9b. MCDateField (r11): the MC single-date field --------------------------------------------
     First built on 03 Buat Pembelian, then copied on 41 and 65; promoted here so every form uses one
     field. A read-only "14 Okt 2026" text field with the calendar addon on the left carries the label,
     hint, errors and keyboard hint; a hidden native date input holds the ISO value (name, min, max) and
     opens the browser picker. Without showPicker the field becomes editable and "14 Okt 2026",
     "14/10/2026" or "2026-10-14" is parsed back. Delegated: any rendered field works.
       MCDateField.html({ id, name, value, min, max, label, describedby, required, hintId, placeholder, attrs })
       MCDateField.value(el) -> ISO ('' when empty) · MCDateField.set(el, iso) · MCDateField.parse(text) */
  var DMON = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];
  function dpad(n) { return (n < 10 ? '0' : '') + n; }
  function dparse(txt) {
    var t = String(txt || '').trim().toLowerCase(), m;
    if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t))) return m[1] + '-' + dpad(+m[2]) + '-' + dpad(+m[3]);
    if ((m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(t))) return m[3] + '-' + dpad(+m[2]) + '-' + dpad(+m[1]);
    if ((m = /^(\d{1,2})\s+([a-z]{3})[a-z]*\.?\s+(\d{4})$/.exec(t)) && DMON.indexOf(m[2]) >= 0) return m[3] + '-' + dpad(DMON.indexOf(m[2]) + 1) + '-' + dpad(+m[1]);
    return '';
  }
  function dateFieldHTML(o) {
    o = o || {};
    var id = o.id, v = o.value || '', kbd = o.hintId || (id + '-kbd');
    var desc = ((o.describedby || '') + ' ' + kbd).trim().split(/\s+/).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(' ');
    return '<span class="mc-input mc-input--addon pt-datefield" data-pt-datefield>' +
      '<button class="mc-input__addon pt-datefield__btn" type="button" tabindex="-1" aria-label="Pilih ' + esc(o.label || 'tanggal') + '" data-pt-date-open>' + icon('calendar') + '</button>' +
      '<input class="mc-input__control" id="' + esc(id) + '" type="text" readonly value="' + esc(v ? fmt.date(v) : '') + '" autocomplete="off" spellcheck="false"' +
        (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + (o.attrs ? ' ' + o.attrs : '') +
        (o.required ? ' required aria-required="true"' : '') + ' aria-describedby="' + esc(desc) + '" data-pt-date>' +
      '<input class="pt-datefield__native" type="date"' + (o.name ? ' name="' + esc(o.name) + '"' : '') + ' value="' + esc(v) + '"' + (o.min ? ' min="' + esc(o.min) + '"' : '') + (o.max ? ' max="' + esc(o.max) + '"' : '') +
        ' tabindex="-1" aria-hidden="true" data-pt-date-native>' +
      '<span class="mc-visually-hidden" id="' + esc(kbd) + '">Tekan Enter atau Spasi untuk membuka kalender</span></span>';
  }
  function dparts(el) {
    var wrap = el && el.closest ? el.closest('[data-pt-datefield]') : null;
    return wrap ? { wrap: wrap, text: wrap.querySelector('[data-pt-date]'), nat: wrap.querySelector('[data-pt-date-native]') } : null;
  }
  function dopen(d) {
    if (doc.activeElement !== d.text) d.text.focus({ preventScroll: true });   /* the field is the picker's context (keyboard return point) */
    try { if (typeof d.nat.showPicker === 'function') { d.nat.showPicker(); return; } } catch (e) { /* fall through */ }
    d.text.removeAttribute('readonly'); d.text.select();
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-pt-date-open], [data-pt-date]');
    if (!t) return;
    var d = dparts(t);
    if (d && (t.hasAttribute('data-pt-date-open') || d.text.hasAttribute('readonly'))) dopen(d);
  });
  doc.addEventListener('keydown', function (e) {
    if (!e.target.matches || !e.target.matches('[data-pt-date][readonly]')) return;
    if (e.key === 'Enter' || e.key === ' ' || (e.altKey && e.key === 'ArrowDown')) { e.preventDefault(); dopen(dparts(e.target)); }
  });
  doc.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches && t.matches('[data-pt-date-native]')) { var d = dparts(t); if (d) d.text.value = t.value ? fmt.date(t.value) : ''; }
    else if (e.isTrusted && t.matches && t.matches('[data-pt-date]:not([readonly])')) {      /* typed (fallback) value; re-dispatched events are ignored */
      var d2 = dparts(t);
      d2.nat.value = dparse(t.value);
      d2.nat.dispatchEvent(new Event('input', { bubbles: true }));
      d2.nat.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, true);
  doc.addEventListener('focusout', function (e) {
    var t = e.target;
    if (t.matches && t.matches('[data-pt-date]:not([readonly])')) { t.setAttribute('readonly', ''); var d = dparts(t); if (d && d.nat.value) t.value = fmt.date(d.nat.value); }
  });
  doc.addEventListener('click', function (e) {          /* time field (same anatomy): the clock addon opens the picker */
    var t = e.target.closest && e.target.closest('[data-pt-time-open]');
    var inp = t && t.parentNode.querySelector('input[type="time"]');
    if (!inp) return;
    inp.focus({ preventScroll: true });
    try { if (typeof inp.showPicker === 'function') inp.showPicker(); } catch (x) { /* focus is enough: type the time */ }
  });
  root.MCDateField = {
    html: dateFieldHTML, parse: dparse,
    value: function (el) { var d = dparts(el); return d ? d.nat.value : ''; },
    native: function (el) { var d = dparts(el); return d ? d.nat : null; },
    set: function (el, iso) { var d = dparts(el); if (d) { d.nat.value = iso || ''; d.text.value = iso ? fmt.date(iso) : ''; } }
  };

  /* ---- 10. MCPage: route-aware page helpers -------------------------------------------------- */
  /* r13 (persistent shell): the route is read live (the router changes the address in place), never
     captured once per document. curRoute() is cheap (a registry walk). */
  function curRoute() { return R ? R.current() : null; }
  /* r11 (D-30): page container modes. The archetype decides how wide a page may grow on large
     screens (a route may override with `container`); 1366-class laptops are not affected.
       data      index lists, list-detail, reports, dashboards, review   (max 1680 px)
       standard  detail, detail hub, hub, document, task, checklist        (max 1440 px)
       settings  settings                                                 (max 1280 px)
       form      create / edit forms                                      (max 1120 px)
       focused   search, system                                           (max 960 px) */
  var CONTAINERS = { list: 'data', 'list-detail': 'data', report: 'data', dashboard: 'data', review: 'data',
    detail: 'standard', 'detail-hub': 'standard', hub: 'standard', document: 'standard', task: 'standard', checklist: 'standard',
    settings: 'settings', form: 'form', search: 'focused', system: 'focused' };
  /* set once per page if absent (a host may set it itself); the router removes it before mounting the
     next page and calls MCPage.applyContainer() again */
  function applyContainer() {
    var route = curRoute(), el = doc.documentElement;
    if (!route || !el || el.hasAttribute('data-container')) return;
    var cmode = route.container || CONTAINERS[route.archetype];
    if (cmode) el.setAttribute('data-container', cmode);
  }
  applyContainer();
  function crumbs(map) {
    /* map: { routeId: { label, href } } overrides for dynamic records (e.g. the project name) */
    map = map || {};
    var host = q('[data-crumbs]'), route = curRoute();
    if (!host || !route || !R) return;
    /* r11 (D-27): the trail shows the ANCESTORS only. The page title already names the current page,
       and the former "Kembali" link pointed at the same place as the parent crumb (two controls, one
       destination). A top-level page (no ancestor) shows no breadcrumb at all. */
    var trail = R.trail(route.id).slice(0, -1);
    if (!trail.length) { host.innerHTML = ''; host.hidden = true; return; }
    host.hidden = false;
    var items = trail.map(function (r) {
      var o = map[r.id] || {};
      return '<li class="mc-crumbs__item' + (o.fill ? ' mc-crumbs__item--fill' : '') + '"><a class="mc-crumbs__link" href="' + esc(o.href || R.href(r.id)) + '">' + esc(o.label || r.label) + '</a></li>';
    });
    host.innerHTML = icon('arrow-left', 'mc-crumbs__arrow mc-crumbs__lead') + '<ol class="mc-crumbs__list" role="list">' + items.join('') + '</ol>';
    /* r12: no sub-navigation workaround here any more: ROUTES.parent is a TRUE ancestor only, so a
       navigation destination has no sibling crumb to hide (D-39 superseded by the navigation tree) */
  }
  /* MSG-10 (IP-21): the capability is missing - the canonical sentence, a reference code, the way home; nothing of the record */
  function forbidden() {
    var main = q('[data-region="content"]');
    if (!main) return;
    var home = P && P.home ? P.home() : null, ref = 'RF-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    main.innerHTML = '<div class="pt-system" data-forbidden><p class="pt-system__code">403</p>' +
      '<h1 class="pt-system__title">Tidak ada kewenangan</h1>' +
      '<p class="pt-system__text">Anda tidak memiliki kewenangan untuk tindakan ini.</p>' +
      '<p class="pt-system__ref">Kode rujukan: <span class="pt-num">' + ref + '</span></p>' +
      '<div class="pt-system__actions">' + (home && home.href ? btn({ label: 'Ke Beranda', href: home.href, variant: 'primary', size: 'lg' }) : '') + '</div></div>';
    var t = q('title[data-page]');
    if (t) { t.setAttribute('data-page', 'Tidak ada kewenangan'); if (root.MCBrand) doc.title = root.MCBrand.title('Tidak ada kewenangan'); }
  }
  function notFound() {
    var main = q('[data-region="content"]');
    if (!main) return;
    var home = P && P.home ? P.home() : null;                       /* r12: the project's Beranda (navigation.home) */
    main.innerHTML = '<div class="pt-system" data-not-found><p class="pt-system__code">404</p>' +
      '<h1 class="pt-system__title">Halaman tidak ditemukan</h1>' +
      '<p class="pt-system__text">Alamat ini tidak ada atau tidak tersedia untuk akun Anda. Periksa alamatnya, atau kembali ke Beranda.</p>' +
      '<div class="pt-system__actions">' + (home && home.href ? btn({ label: 'Ke Beranda', href: home.href, variant: 'primary', size: 'lg' }) : '') +
      btn({ label: 'Cari', variant: 'outline', size: 'lg', icon: 'search', attrs: ' data-open-search' }) + '</div></div>';
    var t = q('title[data-page]');
    if (t) { t.setAttribute('data-page', 'Halaman tidak ditemukan'); if (root.MCBrand) doc.title = root.MCBrand.title('Halaman tidak ditemukan'); }
  }
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-open-search]')) return;
    e.preventDefault();
    if (root.mcMotion && root.mcMotion.open) root.mcMotion.open('palette');
    else if (root.MCShell) root.MCShell.focusSearch();
  });
  /* r11 (D-39): module sub-navigation. A module whose sibling screens have no sidebar entry gets ONE
     quiet row of links under the page header instead of header buttons to its siblings. Items:
     [{ route, params, label, cap }]; a route the role cannot open (or whose cap it lacks) is left out;
     the current route is marked aria-current. Rendered into [data-subnav] (or the given host).
     r12 (D-47): generic duplicate suppression: an item the role's navigation already provides
     (MCProject.navProvides) is left out too, so with a hierarchical tree that lists the siblings the
     row renders NOTHING; a project with a flat navigation keeps it. */
  function subnav(items, host) {
    if (!R) return;
    var route = curRoute();
    var list = (items || []).filter(function (it) {
      return R.allowed(it.route) && (!it.cap || !P || !P.can || P.can(it.cap)) && !(P && P.navProvides && P.navProvides(it.route, it.params));
    });
    host = host || q('[data-subnav]');
    if (list.length < 2) { if (host) { host.hidden = true; host.innerHTML = ''; } return; }
    if (!host && route) {
      var head = q('.mc-page-head');
      if (head) { host = doc.createElement('nav'); host.setAttribute('data-subnav', ''); head.appendChild(host); }
    }
    if (!host) return;
    host.hidden = false;
    host.className = 'pt-subnav';
    host.setAttribute('aria-label', 'Bagian ' + ((route && route.module) || 'modul'));
    host.innerHTML = list.map(function (it) {
      var on = route && route.id === it.route;
      return '<a class="pt-subnav__link" href="' + esc(it.href || R.href(it.route, it.params)) + '"' + (on ? ' aria-current="page"' : '') + '>' + esc(it.label) + '</a>';
    }).join('');
  }
  root.MCPage = {
    subnav: subnav,
    get route() { return curRoute(); },                              /* r13: live */
    allowed: function () { var route = curRoute(); return !route || !R || R.allowed(route.id); },
    /* guard(): a role outside the route's roles gets the canonical not-found page in place */
    /* r13 Phase 7: direct load, in-shell navigation and Back/Forward all mount the module, which calls guard() FIRST - the
       refused page renders before any record is read. Forbidden (MSG-10) vs not found (MSG-09): MCRoutes.denial. */
    guard: function () {
      var route = curRoute();
      if (route && R && !R.allowed(route.id)) { if (R.denial && R.denial(route.id) === 'forbidden') forbidden(); else notFound(); return false; }
      return true;
    },
    crumbs: crumbs,
    notFound: notFound,
    dirtyGuard: function (fn) { dirtyFn = typeof fn === 'function' ? fn : null; },
    /* r13: the unsaved-changes question is asked for EVERY in-app navigation (router, popstate) */
    isDirty: function () { return isDirty(); },
    askLeave: function (href, from, o) { return askLeave(href, from, o); },
    /* r13: in-app navigation from page code. Over HTTP the router swaps the page in place (sidebar,
       account and top bar stay); on file:// (router off) it is today's full document load. */
    go: function (href, o) { return go(href, o); },
    /* r13: the page container mode for the current route (router: after each page swap) */
    applyContainer: applyContainer,
    /* r13: a new page starts clean (router: on dispose of the previous page) */
    reset: function () { resetPage(); },
    param: function (n) { return R ? R.param(n) : null; },
    href: function (id, params) { return R ? R.href(id, params) : '#'; },
    title: function (text, o) {
      var h = q('[data-page-title]');
      if (!h || !text) return;
      /* record numbers (ARJ/INV/2026/10/0031) never break mid-token: with { number } the number stays on one
         line (nowrap); otherwise it may break only after a '/' */
      if (o && o.number && String(text).indexOf(o.number) >= 0) {
        var parts = String(text).split(o.number);
        h.innerHTML = parts.map(esc).join('<span class="pt-nowrap">' + esc(o.number) + '</span>');
      } else h.innerHTML = esc(text).split('/').join('/<wbr>');
    },
    ready: function (fn) { if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', fn); else fn(); }
  };

  /* r11: unsaved-changes guard for FORM pages. MCPage.dirtyGuard(isDirty) intercepts same-tab links
     while isDirty() is true and asks first (DESTRUCTIVE wording: the input is lost). One shared
     guard instead of one per module.
     r12: it also guards PROGRAMMATIC shell navigation (the cancelable 'mc:navigate' of MCShell.navigate:
     command palette, account menu), and a link chosen in the navigation drawer: the drawer leaves an
     intercepted click alone (defaultPrevented) and stays open under the question. "Kembali" returns
     focus to the control that asked; "Tinggalkan" leaves without the drawer's history entry. */
  var dirtyFn = null;
  function isDirty() { var d = false; try { d = !!(dirtyFn && dirtyFn()); } catch (x) { d = false; } return d; }
  /* r13: the one way page code leaves the page. Router active (HTTP): an in-place page swap (it asks
     the unsaved-changes question itself through 'mc:navigate' unless o.force); router off (file://):
     the full document load of r12. */
  function go(href, o) {
    o = o || {};
    var Rt = root.MCRouter;
    if (Rt && Rt.active) return Rt.navigate(href, o);
    if (o.replace) root.location.replace(href); else root.location.href = href;
    return null;
  }
  /* o: { replace, source, traverse } of the navigation that asked (r13: a Back / Forward step asks too) */
  function askLeave(href, from, o) {
    o = o || {};
    return root.MCConfirm({ tone: 'danger', title: 'Tinggalkan halaman ini?', message: 'Isian yang belum disimpan akan hilang.', confirm: 'Tinggalkan', cancel: 'Kembali', returnFocus: from || null })
      .then(function (ok) {
        if (!ok) return;
        dirtyFn = null;
        var Rt = root.MCRouter;
        /* r13: the router closes an open drawer (its history entry) itself before the swap. A Back / Forward step
           (the router undid it to ask) is replayed (traverse): the browser's own entry, never a navigation "as a
           pop", which writes no history entry and would leave the dirty page's address on the next page */
        if (Rt && Rt.active) {
          Rt.navigate(href, { force: true, replace: !!o.replace, source: o.source && o.source !== 'pop' ? o.source : 'guard', traverse: o.traverse || 0 });
          return;
        }
        var st = root.history.state;
        if (st && st.mcNavDrawer) root.location.replace(href);    /* the open drawer's pushed entry is not kept */
        else root.location.href = href;
      });
  }
  /* r13: one shared browser leave prompt while a page is dirty (reload, close, typed address), canon
     ADMIN_FLOW §6: the app's own question for in-app navigation AND the browser's prompt for leaving */
  root.addEventListener('beforeunload', function (e) {
    if (!dirtyFn || !isDirty()) return;
    e.preventDefault();
    e.returnValue = '';
  });
  /* r13: what a page leaves behind when the router swaps it out (MCScope.dispose -> hook) */
  function resetPage() {
    dirtyFn = null;
    listsMounted = 0;
  }
  doc.addEventListener('click', function (e) {
    if (!dirtyFn || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.closest('[role="menu"], .pt-menu-layer')) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || typeof a.href !== 'string') return;
    /* r13: judged on the browser's resolution of the link (any spelling of javascript:, mailto:, tel: … is not a
       page to leave for) */
    if (!/^(https?|file):/.test(a.href)) return;
    if (!isDirty() || !root.MCConfirm) return;
    e.preventDefault();
    askLeave(a.href, a);
  }, true);
  doc.addEventListener('mc:navigate', function (e) {
    if (!dirtyFn || e.defaultPrevented || !e.detail || !e.detail.href || !isDirty() || !root.MCConfirm) return;
    e.preventDefault();
    askLeave(e.detail.href, doc.activeElement && doc.activeElement !== doc.body ? doc.activeElement : null, e.detail);
  });

  /* r11: list-detail split. The SHORTER column sticks (a tall sticky panel would hide its own end; a
     short list next to a tall detail would leave an empty column). */
  function splitSticky() {
    qa('.pt-split').forEach(function (sp) {
      var kids = qa(':scope > *', sp).filter(function (k) { return k.offsetHeight > 0; });
      kids.forEach(function (k) { k.classList.remove('is-sticky'); });
      if (kids.length !== 2 || root.innerWidth <= 1100) return;
      var a = kids[0], b = kids[1], short = a.offsetHeight <= b.offsetHeight ? a : b;
      if (short.offsetHeight < root.innerHeight - 32 && Math.abs(a.offsetHeight - b.offsetHeight) > 40) short.classList.add('is-sticky');
    });
  }
  if (root.ResizeObserver) {
    var ro = new root.ResizeObserver(function () { root.requestAnimationFrame(splitSticky); });
    var watchSplits = function () { qa('.pt-split > *').forEach(function (k) { if (!k.__ptRo) { k.__ptRo = true; ro.observe(k); } }); };
    if (root.MutationObserver) new root.MutationObserver(watchSplits).observe(doc.documentElement, { childList: true, subtree: true });
    watchSplits();
  }
  root.addEventListener('resize', splitSticky);

  /* ---- 11. MCPalette: command-palette providers (interactions.js renders the palette) -------- */
  var providers = [];
  root.MCPalette = {
    /* r13: a provider registered by page code is dropped when the router swaps the page out */
    register: function (fn) { if (typeof fn === 'function') { fn.mcPage = scopeOwner() === 'page'; providers.push(fn); } },
    count: function () { return providers.length; },
    groups: function (query) {
      var out = [];
      providers.forEach(function (fn) {
        try { (fn(query || '') || []).forEach(function (g) { if (g && g.items && g.items.length) out.push(g); }); } catch (e) { if (root.console) root.console.warn(e); }
      });
      return out;
    }
  };

  /* r13: when the router disposes a page: its actions, palette providers, dirty guard and list counter go */
  if (root.MCScope && root.MCScope.hook) root.MCScope.hook(function () {
    Object.keys(pageActions).forEach(function (n) { if (pageActions[n]) handlers[n] = pageActions[n]; else delete handlers[n]; });
    pageActions = {};
    providers = providers.filter(function (fn) { return !fn.mcPage; });
    if (ro) qa('.pt-split > *').forEach(function (k) { if (k.__ptRo) { ro.unobserve(k); k.__ptRo = false; } });   /* the page's split columns leave */
    resetPage();
  });

  /* ---- 12. MCMenu: overflow / row menus (r11) ------------------------------------------------- */
  /* Markup (MCMenu.html / MCActions): a trigger + a <template> holding the items.
       <span class="pt-menu" data-pt-menu>
         <button class="mc-btn … pt-menu__toggle" aria-haspopup="menu" aria-expanded="false" data-pt-menu-toggle>
         <template data-pt-menu-items> a / button role="menuitem" … | div role="separator" </template>
       </span>
     The open menu lives at body level, so a card never clips it: a popover under the trigger on
     desktop / tablet, a bottom action sheet on phones (scrim, Esc, "Batal"). Items are CLONES of the
     template, so their behaviour must be delegated: href, [data-action] (MCAction) or [data-demo];
     put the record id an item needs in its own data-* attributes. Items with
     data-menu-phone="only" appear only in the phone sheet (secondary actions that are visible
     buttons on wider screens). Keyboard: Enter / Space / ArrowDown open on the first item, ArrowUp
     on the last; arrows / Home / End move; Esc closes and returns focus; Tab closes. */
  var menuOpen = null;
  function menuItemsHTML(items) {
    return (items || []).map(function (it) {
      if (!it) return '';
      if (it.sep) return '<div class="pt-menu__sep" role="separator"></div>';
      var cls = 'pt-menu__item' + (it.danger ? ' pt-menu__item--danger' : '');
      var inner = (it.icon ? icon(it.icon) : '') + '<span class="pt-menu__label">' + esc(it.label) +
        (it.hint ? '<span class="pt-menu__hint">' + esc(it.hint) + '</span>' : '') + '</span>';
      var extra = (it.phoneOnly ? ' data-menu-phone="only"' : it.narrowOnly ? ' data-menu-phone="narrow"' : '') + (it.attrs || '');
      if (it.disabled) {
        return '<button class="' + cls + ' is-disabled" type="button" role="menuitem" aria-disabled="true"' + extra + '>' + inner +
          (it.reason ? '<span class="pt-menu__reason">' + esc(it.reason) + '</span>' : '') + '</button>';
      }
      if (it.href) return '<a class="' + cls + '" role="menuitem" href="' + esc(it.href) + '"' + extra + '>' + inner + '</a>';
      return '<button class="' + cls + '" type="button" role="menuitem"' + (it.action ? ' data-action="' + esc(it.action) + '"' : '') +
        (it.demo ? ' data-demo="' + esc(it.demo) + '"' + (it.demoMeta ? ' data-demo-meta="' + esc(it.demoMeta) + '"' : '') : '') + extra + '>' + inner + '</button>';
    }).join('');
  }
  /* MCMenu.html({ label, title, text, icon, variant, size, items, cls })
     label = accessible name of the trigger; text = visible trigger text ("Tindakan Lain"); without text the
     trigger is an icon button (more-horizontal). title = the phone sheet heading (default: label). */
  function menuHTML(o) {
    var kebab = !o.text;
    var cls = 'mc-btn mc-btn--' + (o.variant || (kebab ? 'ghost' : 'outline')) + ' mc-btn--' + (o.size || 'md') + (kebab ? ' mc-btn--icon' : '') + ' pt-menu__toggle';
    return '<span class="pt-menu' + (o.cls ? ' ' + o.cls : '') + '" data-pt-menu>' +
      '<button class="' + cls + '" type="button" aria-haspopup="menu" aria-expanded="false" data-pt-menu-toggle aria-label="' + esc(o.label || 'Tindakan lain') + '" data-menu-title="' + esc(o.title || o.label || 'Tindakan lain') + '"' + (o.attrs || '') + '>' +
      (kebab ? icon(o.icon || 'more-horizontal') : (o.compactIcon ? icon(o.compactIcon, 'pt-menu__compact') : '') + '<span class="mc-btn__label">' + esc(o.text) + '</span>' + icon('chevron-down', 'pt-menu__chev')) + '</button>' +
      '<template data-pt-menu-items>' + menuItemsHTML(o.items) + '</template></span>';
  }
  function openMenu(toggle, at) {
    if (menuOpen) menuOpen.close(false);
    var wrap = toggle.closest('[data-pt-menu]');
    var tpl = wrap && wrap.querySelector('template[data-pt-menu-items]');
    if (!tpl) return;
    var phone = mqPhone.matches;
    var id = uid('menu');
    var title = toggle.getAttribute('data-menu-title') || toggle.getAttribute('aria-label') || '';
    var layer = doc.createElement('div');
    layer.className = 'pt-menu-layer' + (phone ? ' is-sheet' : '');
    layer.innerHTML = (phone ? '<div class="pt-menu-layer__scrim" data-menu-close></div>' : '') +
      '<div class="pt-menu__panel" role="menu" id="' + id + '" aria-label="' + esc(title) + '">' +
      (phone ? '<p class="pt-menu__title" aria-hidden="true">' + esc(title) + '</p>' : '') + '</div>';
    var panel = layer.querySelector('.pt-menu__panel');
    panel.appendChild(tpl.content.cloneNode(true));
    var narrow = root.matchMedia ? root.matchMedia('(max-width: 1024px)').matches : false;
    if (!phone) qa('[data-menu-phone="only"]', panel).forEach(function (n) { n.remove(); });
    if (!narrow) qa('[data-menu-phone="narrow"]', panel).forEach(function (n) { n.remove(); });
    if (phone) qa('[data-menu-hide-phone]', panel).forEach(function (n) { n.remove(); });
    /* no leading, trailing or doubled separators after the phone-only filter */
    qa('.pt-menu__sep', panel).forEach(function (s) {
      var p = s.previousElementSibling, n = s.nextElementSibling;
      if (!p || !n || p.classList.contains('pt-menu__sep') || p.classList.contains('pt-menu__title')) s.remove();
    });
    if (phone) panel.insertAdjacentHTML('beforeend', '<button class="pt-menu__cancel" type="button" data-menu-close>Batal</button>');
    doc.body.appendChild(layer);
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-controls', id);
    function items() { return qa('[role="menuitem"]', panel).filter(function (i) { return i.getAttribute('aria-disabled') !== 'true'; }); }
    function focusAt(i) { var l = items(); if (l.length) l[(i + l.length) % l.length].focus(); }
    function place() {
      if (phone) return;
      var r = toggle.getBoundingClientRect(), pw = panel.offsetWidth, ph = panel.offsetHeight;
      var left = Math.min(Math.max(8, r.right - pw), root.innerWidth - pw - 8);
      var top = r.bottom + 6;
      if (top + ph > root.innerHeight - 8 && r.top - ph - 6 > 8) top = r.top - ph - 6;
      panel.style.left = Math.round(left) + 'px';
      panel.style.top = Math.round(top) + 'px';
    }
    place();
    if (!mqReduce.matches && panel.animate) {
      panel.animate(phone ? [{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'none', opacity: 1 }] : [{ transform: 'translateY(-4px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: phone ? 220 : 150, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' });
      var sc = layer.querySelector('.pt-menu-layer__scrim');
      if (sc) sc.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'linear' });
    }
    function onOutside(e) { if (!panel.contains(e.target) && !toggle.contains(e.target)) close(false); }
    function onScroll(e) { if (!panel.contains(e.target)) place(); }
    function onResize() { close(false); }
    var done = false;
    function close(returnFocus) {
      if (done) return;
      done = true;
      if (menuOpen && menuOpen.layer === layer) menuOpen = null;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.removeAttribute('aria-controls');
      doc.removeEventListener('pointerdown', onOutside, true);
      root.removeEventListener('scroll', onScroll, true);
      root.removeEventListener('resize', onResize);
      layer.remove();
      if (returnFocus && doc.contains(toggle)) toggle.focus({ preventScroll: true });
    }
    if (!phone) doc.addEventListener('pointerdown', onOutside, true);
    root.addEventListener('scroll', onScroll, true);
    root.addEventListener('resize', onResize);
    layer.addEventListener('click', function (e) {
      if (e.target.closest('[data-menu-close]')) { close(true); return; }
      var it = e.target.closest('[role="menuitem"]');
      if (!it) return;
      if (it.getAttribute('aria-disabled') === 'true') { e.preventDefault(); e.stopPropagation(); return; }
      /* the item's delegated action runs in this same click (MCAction / data-demo / href); focus
         moves to the trigger first so a dialog opened by the action returns focus there */
      toggle.focus({ preventScroll: true });
      setTimeout(function () { close(false); }, 0);
    });
    panel.addEventListener('keydown', function (e) {
      var l = items(), i = l.indexOf(doc.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusAt(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusAt(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusAt(0); }
      else if (e.key === 'End') { e.preventDefault(); focusAt(-1); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (e.key === 'Tab') { e.preventDefault(); close(true); }
    });
    layer.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); close(true); } });
    layer.__ptToggle = toggle;
    menuOpen = { close: close, layer: layer, toggle: toggle };
    focusAt(at === 'last' ? -1 : 0);
    return menuOpen;
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pt-menu-toggle]');
    if (!t || t.disabled) return;
    e.preventDefault();
    if (menuOpen && menuOpen.toggle === t) menuOpen.close(true); else openMenu(t, 'first');
  });
  doc.addEventListener('keydown', function (e) {
    var t = e.target.closest && e.target.closest('[data-pt-menu-toggle]');
    if (!t || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault();
    openMenu(t, e.key === 'ArrowUp' ? 'last' : 'first');
  });
  root.MCMenu = {
    /* trigger(el): for an element inside an open menu (a cloned item) the menu's toggle, else el itself;
       pass it as MCRisk `trigger` so pending state and focus return land on a live control */
    trigger: function (el) { var l = el && el.closest && el.closest('.pt-menu-layer'); return (l && l.__ptToggle) || el; },
    html: menuHTML,
    items: menuItemsHTML,
    open: openMenu,
    close: function () { if (menuOpen) menuOpen.close(false); },
    get isOpen() { return !!menuOpen; }
  };

  /* ---- 13. MCActions: one action model, rendered by priority (r11) --------------------------- */
  /* defs: [{ id, label, icon, priority: 'primary' | 'secondary' | 'overflow', href | action | demo,
             danger, disabled, reason, capability, roles, hidden, attrs, variant }]
     Rendering rule (docs/UX_PRINCIPLES.md, D-26): at most ONE primary (the first def marked primary);
     up to `maxSecondary` (2) quiet secondary buttons; everything else, every destructive action
     (last, after a separator) and every disabled action with its reason goes into ONE overflow
     menu ("Tindakan Lain ▾" text trigger, glossary GL-187; ⋯ on phones). Tablet (768-1024): 1 secondary, the second one
     moves into the menu. Phones: the primary plus the overflow menu (secondary buttons move into
     the sheet; with no primary the first secondary stays visible). Capability / role filtering hides what a role cannot
     use (MCProject.can / role) — the project config decides capability, this renderer only decides
     presentation. Order on wide screens: [⋯] [secondary] [primary]. */
  function allowedDef(d) {
    if (!d || d.hidden) return false;
    if (d.capability && P && P.can && !P.can(d.capability)) return false;
    if (d.roles && P && d.roles.indexOf(P.role) < 0) return false;   /* P.role = the signed-in user's role ('owner' | 'admin'); roleKey is only the preview override */
    return true;
  }
  function actionBtn(d, variant, cls) {
    var attrs = (d.demo ? ' data-demo="' + esc(d.demo) + '"' + (d.demoMeta ? ' data-demo-meta="' + esc(d.demoMeta) + '"' : '') : '') +
      (d.id ? ' data-action-id="' + esc(d.id) + '"' : '') + (d.disabled && d.reason ? ' title="' + esc(d.reason) + '"' : '') + (d.attrs || '');
    return btn({ label: d.label, icon: d.icon, href: d.disabled ? null : d.href, action: d.disabled ? null : d.action, variant: d.variant || (d.quiet ? 'outline' : variant), size: d.size || 'md', cls: cls, attrs: attrs, disabled: d.disabled, pending: d.pending });
  }
  function actionsHTML(defs, o) {
    o = o || {};
    /* priorityByRole: { owner: 'overflow', admin: 'primary' } (presentation only; capability stays in config) */
    var list = (defs || []).filter(allowedDef).map(function (d) {
      if (d.desk && !d.phone) { var dc = {}; Object.keys(d).forEach(function (k) { dc[k] = d[k]; }); dc.phone = 'hide'; d = dc; }   /* desk: true = a desktop-only task */
      if (!d.priorityByRole || !P) return d;
      var pr = d.priorityByRole[P.role];
      if (!pr) return d;
      var c = {}; Object.keys(d).forEach(function (k) { c[k] = d[k]; }); c.priority = pr; return c;
    });
    var primary = list.filter(function (d) { return d.priority === 'primary' && !d.danger; })[0] || null;
    var rest = list.filter(function (d) { return d !== primary; });
    var maxSec = o.maxSecondary == null ? 2 : o.maxSecondary;
    var secondary = rest.filter(function (d) { return d.priority === 'secondary' && !d.danger && !d.disabled; }).slice(0, maxSec);
    var over = rest.filter(function (d) { return secondary.indexOf(d) < 0; });
    /* a lone, harmless overflow action with nothing else beside it is shown as the quiet button it is: a
       one-item "Tindakan Lain" menu only adds a click (destructive and disabled ones stay behind the menu) */
    if (!primary && !secondary.length && over.length === 1 && !over[0].danger && !over[0].disabled && !o.menuText) { secondary = over; over = []; }
    var keep = !primary && secondary.length ? secondary[0] : null;     /* phones: never only a lone ⋯ */
    var normal = over.filter(function (d) { return !d.danger; }), danger = over.filter(function (d) { return d.danger; });
    var items = secondary.filter(function (d) { return d !== keep && d.phone !== 'hide'; }).map(function (d, i) { var narrowOnly = secondary.indexOf(d) === 1; return { label: d.label, icon: d.icon, hint: d.hint, href: d.href, action: d.action, demo: d.demo, demoMeta: d.demoMeta, attrs: d.attrs, phoneOnly: !narrowOnly, narrowOnly: narrowOnly }; })
      .concat(normal.map(function (d) { return { label: d.label, icon: d.icon, hint: d.hint, href: d.href, action: d.action, demo: d.demo, demoMeta: d.demoMeta, attrs: (d.attrs || '') + (d.phone === 'hide' ? ' data-menu-hide-phone' : ''), disabled: d.disabled, reason: d.reason }; }));
    if (danger.length) {
      items.push({ sep: true });
      items = items.concat(danger.map(function (d) { return { label: d.label, icon: d.icon, hint: d.hint, href: d.href, action: d.action, demo: d.demo, demoMeta: d.demoMeta, attrs: d.attrs, danger: true, disabled: d.disabled, reason: d.reason }; }));
    }
    if (!primary && !secondary.length && !items.length) return '';      /* nothing this account can do here: no empty group */
    var wideItems = normal.length + danger.length;
    var tabletItems = wideItems + (secondary.length > 1 ? 1 : 0);
    /* a group whose every control is desktop-only disappears on phones (no empty header slot) */
    var phoneVisible = (primary && primary.phone !== 'hide') || secondary.some(function (d) { return d.phone !== 'hide'; }) ||
      items.some(function (it) { return !it.sep && !/data-menu-hide-phone/.test(it.attrs || ''); });
    var html = '<div class="pt-actions' + (o.cls ? ' ' + o.cls : '') + (phoneVisible ? '' : ' pt-actions--desk') + '">';
    if (items.length) html += menuHTML({ text: o.menuText || 'Tindakan Lain', compactIcon: 'more-horizontal', label: o.menuLabel || 'Tindakan lain', title: o.menuTitle, items: items, attrs: o.menuAttrs,
      cls: 'pt-actions__more' + (wideItems ? '' : tabletItems ? ' pt-menu--narrow' : ' pt-menu--phone') });
    secondary.forEach(function (d, i) { html += actionBtn(d, 'outline', 'pt-actions__secondary' + (i === 1 ? ' pt-actions__secondary--2' : '') + (d === keep ? ' pt-actions__keep' : '') + (d.phone === 'hide' ? ' pt-phone-hide' : '')); });
    if (primary) html += actionBtn(primary, 'primary', 'pt-actions__primary' + (primary.phone === 'hide' ? ' pt-phone-hide' : ''));
    return html + '</div>';
  }
  var actionHosts = [];
  if (mqPhone.addEventListener) mqPhone.addEventListener('change', function () {
    actionHosts = actionHosts.filter(function (h) { return doc.contains(h); });
    actionHosts.forEach(function (h) { if (h.__ptActions) h.innerHTML = actionsHTML(h.__ptActions.defs, h.__ptActions.o); });
  });
  /* r13 fix (persistent shell): the hosts a page rendered leave with it. When the router disposes the page,
     its hosts (page-owned, MCScope.owner() === 'page' at render) and any host no longer in the document are
     forgotten, so a long in-place session keeps no detached action groups alive */
  if (root.MCScope && root.MCScope.hook) root.MCScope.hook(function () {
    actionHosts = actionHosts.filter(function (h) { return !h.__ptActionsPage && doc.contains(h); });
  });
  root.MCActions = {
    html: actionsHTML,
    /* render(host, defs, o): renders and remembers the defs, so the group re-renders by itself when the
       phone breakpoint changes (desk-only defs need no module listener) */
    render: function (host, defs, o) {
      if (!host) return host;
      host.__ptActions = { defs: defs, o: o };
      host.__ptActionsPage = scopeOwner() === 'page';
      if (actionHosts.indexOf(host) < 0) actionHosts.push(host);
      host.innerHTML = actionsHTML(defs, o);
      return host;
    },
    allowed: allowedDef,
    /* QA (tools/router_check.py): the action groups remembered for the breakpoint re-render */
    count: function () { return actionHosts.length; }
  };
})(typeof window !== 'undefined' ? window : this);
