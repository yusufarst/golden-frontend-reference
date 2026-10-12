/* =============================================================================
   MULTIPLECORP Golden Reference: LIVE DOCUMENT COMPOSER (r13, Layer A: Golden Design System) — MCComposer

   Generic editor + live paper preview for any document template (R13_SPEC §8, DISC §2.1). No business data and no
   project names: a project registers templates (Layer C) and mounts them on its pages. Pairs with
   assets/css/patterns.css §12c (".pt-compose"). Load deferred AFTER patterns.js, docs.js and guide.js.

   MCComposer.register(id, template)      MCComposer.mount(host, id, ctx) -> instance
   template = {
     object: 'Penawaran',                         the document's name in messages ("Terbitkan Penawaran", MSG-01)
     photos: 'none' | 'optional' | 'default' | 'required'   photo policy (optional/default: "Tampilkan foto produk")
     init(ctx) -> state                           plain JSON state (the draft being edited)
     sections(state, api) -> [{ id, title, sub, html }]   editor sections; fields carry data-bind="path"
                                                  (+ data-parse="money|qty|int|text|date", data-label) and are
                                                  rendered ONCE: typing never re-renders the editor (caret stays)
     onChange(state, path, api)                   update derived editor text (line value, totals) in place
     viewModel(state, api) -> MCDoc view model    paper(state, api) -> MCDoc options ({ mode, photos })
     validate(state, api) -> [{ id, severity: 'BLOCKING' | 'WARNING' | 'OK', text, field }]
     progress(state, checks, api) -> MCProgress steps (default: Rincian -> Pemeriksaan -> Terbit, derived)
     readOnly(state, api) -> bool                 cue(state, api) -> numbering cue for the action region
     save(state, api)                             explicit "Simpan Draf" (no autosave, no form data in storage)
     issue: { label, confirm(state, api) -> MCRisk confirm, execute(state, api, commandId) -> { ok, number } |
              { ok: false, code: 'CONFLICT' | 'UNKNOWN' | 'FAILED' | 'NOT_STARTED', number, message, prereq },
              status(state, api, commandId) -> outcome | null, result(state, api, outcome) -> MCResult options,
              after(state, api, outcome) }
   }
   r13 phase 5b (generic, still no business data):
     lead(state, api) -> HTML                     the identity strip at the top of the editor (MCComposer.ui.identity)
     sections: { after: true } places a section after "Pemeriksaan" (e.g. a revision history disclosure);
               { actions, foot, cls, raw } section head actions / foot / class / unwrapped markup
     summary(state, api, checks) -> { value, label }   the figure that leads the sticky action bar ("Total (perkiraan)")
     progress(...) -> false                       no step indicator (e.g. a read-only issued document)
     previewTitle(state, readOnly) / issuedNote(state)  the preview rail heading and its foot line when read-only
     optionsReadOnly / checksReadOnly             keep "Opsi dokumen" / "Pemeriksaan" on a read-only document
     checksSub                                    the Pemeriksaan sub line (e.g. a review without inputs)
   r13 pilot (staged composer, docs/DOCUMENT_SYSTEM.md "Stages"):
     stages: [{ id, label, hint }]               ONE active task stage at a time beside the always-visible preview, e.g.
                                                  Rincian -> Pemeriksaan (+ "Terbit" shown as the final step after the
                                                  issue). Sections carry stage: '<id>' (default the first stage); the
                                                  built-in "Opsi dokumen" joins the first stage, "Pemeriksaan" the last.
                                                  sections with after: true stay visible in every stage (history).
                                                  A compact local stage navigator replaces the step indicator; moving
                                                  between stages never saves, issues or loses input; a "Perbaiki" jump
                                                  opens the field's stage. Footer: the summary + "Simpan Draf" + ONE
                                                  primary per stage ("Lanjut ke pemeriksaan" -> "Terbitkan …").
     nextLabel                                    the first stage's primary ("Lanjut ke pemeriksaan")
     reviewFacts(state, api) -> [{ label, value }] the facts to verify in Pemeriksaan (client, total, validity …);
                                                  the numbering cue and the check count live there, not in the footer
   A read-only composer (issued document) shows no Pemeriksaan, no options and no action bar by default. While the
   draft is dirty the action bar offers "Kembalikan isian" (asks first, restores the last saved draft).
   MCComposer.ui.identity(o) / .source(o)         the identity strip + source tag markup ("Dari proyek …" + "Perbaiki di …")
   instance: { state, set(path, v), get(path), refresh(), flush(), dirty(), checks(), readOnly(), pane(name),
               preview (MCDoc controller), issue(), save(), revert(), destroy() }

   The result of an issue (MCResult) sits at the top of the editor column, beside the issued paper (r13 phase 5b).
   Layout: >= 1280 px two columns (editor | sticky preview rail with its own scroll, toolbar "Pas lebar / 100 %",
   page n/m, "Layar penuh" dialog); 768-1279 px and phones: a sticky segmented switch "Rincian | Pratinjau" (state kept,
   focus kept on the switch, a "Perbaiki" jump returns to Rincian). One sticky action bar (D-38): the check count, the
   numbering cue, "Simpan Draf" (secondary) and ONE primary. The preview never saves, issues, numbers or mutates.
   Outcome messages (CONFLICT / unknown / failed / series not started) stay in the action region, never a toast.
   ============================================================================= */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var doc = document;
  var TEMPLATES = {};
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(name, cls) { return '<svg class="mc-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + esc(name) + '"></use></svg>'; }
  function q(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function qa(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function reduced() { return root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)').matches : false; }
  var mqWide = root.matchMedia ? root.matchMedia('(min-width: 1280px)') : { matches: true };
  var seq = 0;
  function nextId(p) { seq += 1; return p + '-' + Date.now().toString(36) + '-' + seq.toString(36) + Math.random().toString(36).slice(2, 6); }

  /* path helpers: "lines.2.qty" */
  function getPath(o, path) {
    return String(path).split('.').reduce(function (a, k) { return a == null ? undefined : a[k]; }, o);
  }
  function setPath(o, path, v) {
    var ks = String(path).split('.'), cur = o;
    for (var i = 0; i < ks.length - 1; i++) { if (cur[ks[i]] == null) cur[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {}; cur = cur[ks[i]]; }
    cur[ks[ks.length - 1]] = v;
  }
  var PARSE = {
    money: { decimals: 0, unit: 'money' },
    int: { decimals: 0 },
    qty: { decimals: 2 }
  };
  /* read a bound field: { value, error } */
  function readField(el) {
    var kind = el.getAttribute('data-parse') || 'text';
    if (el.type === 'checkbox') return { value: !!el.checked, error: null };
    if (kind === 'date') {                                /* an MCDateField (the binding may sit on its wrapper) */
      var nat = el.matches('[data-pt-date-native]') ? el : el.querySelector('[data-pt-date-native]');
      var v = nat ? nat.value : (root.MCDateField ? root.MCDateField.value(el) : el.value);
      return { value: v || null, error: null };
    }
    if (PARSE[kind]) {
      var N = root.MCForm && root.MCForm.num;
      if (!N) return { value: +el.value || null, error: null };
      var r = N.parse(el.value, PARSE[kind]);
      return r.ok ? { value: r.empty ? null : r.value, error: null } : { value: null, error: r.error };
    }
    return { value: el.value, error: null };
  }

  function register(id, t) { TEMPLATES[id] = t; return t; }

  function mount(host, id, ctx) {
    var tpl = TEMPLATES[id];
    if (!host || !tpl) return null;
    ctx = ctx || {};
    var uid = 'cmp-' + id.replace(/[^a-z0-9-]/gi, '') + '-' + (++seq);
    var inst = { id: id, tpl: tpl, ctx: ctx };
    var state = tpl.init ? tpl.init(ctx) : {};
    var baseline = JSON.stringify(state);
    var parseErr = {}, touched = {}, attempted = false, issued = false, frozen = false, busy = false;
    var commandId = null, preview = null, pane = 'editor', lastChecks = [], timer = 0, frame = 0, fullLayer = null;
    var STAGES = (tpl.stages || []).filter(function (x) { return x && x.id; }), stage = STAGES.length ? STAGES[0].id : null;
    var detailsOpen = false;
    function staged() { return STAGES.length > 0 && !isReadOnly(); }
    function lastStage() { return STAGES.length ? STAGES[STAGES.length - 1].id : null; }
    var policy = tpl.photos || 'none';
    if (state.options == null) state.options = {};
    if (state.options.photos == null) state.options.photos = policy === 'default' || policy === 'required';
    baseline = JSON.stringify(state);

    var api = {
      ctx: ctx, id: id, uid: uid,
      get readOnly() { return isReadOnly(); },
      get attempted() { return attempted; },
      get dirty() { return inst.dirty(); },
      get root() { return root_; },
      view: ctx.view || {},                              /* template UI flags kept OUT of the state (never "dirty") */
      esc: esc,
      field: function (path) { return q('[data-bind="' + path + '"]', root_); },
      set: function (path, v) { setPath(state, path, v); changed(path); },
      refresh: function () { refresh(); },
      rerender: function () { renderEditor(); refresh(); },
      preview: function () { if (timer) { root.clearTimeout(timer); timer = 0; } renderPreview(); },
      status: function (text) { el.status.textContent = text || ''; },
      result: null
    };
    function isReadOnly() { return issued || !!(tpl.readOnly && tpl.readOnly(state, api)); }

    /* ---- markup (built once; the editor re-renders only on mount, after save and after issue) ---- */
    var root_ = doc.createElement('div');
    root_.className = 'pt-compose';
    root_.setAttribute('data-compose', id);
    root_.setAttribute('data-pane', 'editor');
    var obj = tpl.object || 'Dokumen';
    root_.innerHTML =
      '<div class="pt-compose__switch" data-compose-switch><div class="pt-seg pt-seg--fill pt-compose__seg" role="group" aria-label="Tampilan">' +
        '<button type="button" data-pane-btn="editor" aria-pressed="true" aria-controls="' + uid + '-editor">Rincian</button>' +
        '<button type="button" data-pane-btn="preview" aria-pressed="false" aria-controls="' + uid + '-preview">Pratinjau</button></div></div>' +
      '<div class="pt-compose__grid">' +
        '<div class="pt-compose__editor" id="' + uid + '-editor" role="region" aria-label="Rincian ' + esc(obj.toLowerCase()) + '" data-compose-editor>' +
          '<div class="pt-compose__result" data-compose-result hidden></div>' +
          '<div class="pt-compose__lead" data-compose-lead hidden></div>' +
          '<div class="pt-compose__work" data-compose-work><div class="pt-compose__progress" data-compose-progress></div><div class="pt-compose__sections" data-compose-sections></div></div></div>' +
        '<section class="pt-compose__preview" id="' + uid + '-preview" aria-labelledby="' + uid + '-pt" data-compose-preview>' +
          '<div class="pt-compose__toolbar"><h2 class="pt-compose__ptitle" id="' + uid + '-pt">Pratinjau</h2>' +
            '<div class="pt-seg pt-compose__zoom" role="group" aria-label="Ukuran pratinjau"><button type="button" data-zoom="fit" aria-pressed="true">Pas lebar</button><button type="button" data-zoom="1" aria-pressed="false">100 %</button></div>' +
            '<span class="pt-compose__page" data-compose-page>Halaman 1 dari 1</span>' +
            '<button type="button" class="mc-btn mc-btn--ghost mc-btn--sm pt-compose__full" aria-label="Layar penuh" title="Layar penuh" data-compose-full>' + icon('scan') + '<span class="mc-btn__label">Layar penuh</span></button></div>' +
          '<div class="pt-compose__paper" data-compose-paper></div>' +
          '<p class="pt-compose__pnote" data-compose-pnote>Pratinjau tidak menyimpan dan tidak menetapkan nomor.</p></section>' +
      '</div>' +
      '<div class="pt-actionbar pt-compose__bar" role="group" aria-label="Aksi ' + esc(obj.toLowerCase()) + '" data-compose-bar>' +
        '<p class="pt-compose__sum" data-compose-sum hidden></p>' +
        '<p class="pt-actionbar__info pt-compose__info"><strong data-compose-count></strong><span data-compose-cue></span></p>' +
        '<p class="pt-compose__status" data-compose-status role="status" aria-live="polite"></p>' +
        '<p class="mc-sr-only" data-compose-sr aria-live="polite"></p>' +
        '<div class="pt-compose__outcome" data-compose-outcome role="alert" hidden></div>' +
        '<button type="button" class="pt-link pt-compose__revert" data-compose-revert hidden>Kembalikan isian</button>' +
        '<button type="button" class="mc-btn mc-btn--outline mc-btn--lg" data-compose-save>' + icon('loader', 'mc-btn__spin') + '<span class="mc-btn__label">' + esc(tpl.saveLabel || 'Simpan Draf') + '</span></button>' +
        '<button type="button" class="mc-btn mc-btn--primary mc-btn--lg" data-compose-next hidden>' + esc(tpl.nextLabel || 'Lanjut ke pemeriksaan') + icon('chevron-right') + '</button>' +
        '<button type="button" class="mc-btn mc-btn--primary mc-btn--lg" data-compose-issue>' + icon('loader', 'mc-btn__spin') + '<span class="mc-btn__label">' + esc((tpl.issue && tpl.issue.label) || 'Terbitkan ' + obj) + '</span></button>' +
      '</div>';
    host.innerHTML = '';
    host.appendChild(root_);
    var el = {
      result: q('[data-compose-result]', root_), sections: q('[data-compose-sections]', root_), progress: q('[data-compose-progress]', root_),
      paper: q('[data-compose-paper]', root_), page: q('[data-compose-page]', root_), bar: q('[data-compose-bar]', root_),
      count: q('[data-compose-count]', root_), cue: q('[data-compose-cue]', root_), status: q('[data-compose-status]', root_),
      outcome: q('[data-compose-outcome]', root_), save: q('[data-compose-save]', root_), issue: q('[data-compose-issue]', root_),
      editor: q('[data-compose-editor]', root_), previewPane: q('[data-compose-preview]', root_),
      lead: q('[data-compose-lead]', root_), sum: q('[data-compose-sum]', root_), revert: q('[data-compose-revert]', root_),
      ptitle: q('#' + uid + '-pt', root_), pnote: q('[data-compose-pnote]', root_), next: q('[data-compose-next]', root_),
      info: q('.pt-compose__info', root_), sr: q('[data-compose-sr]', root_)
    };
    var main = root_.closest('[data-region="content"]') || doc.getElementById('main');
    if (main) main.classList.add('pt-has-actionbar');

    /* ---- editor ---- */
    function optionsSection() {
      if (policy !== 'optional' && policy !== 'default') return null;
      var on = !!state.options.photos;
      return { id: 'opsi', title: 'Opsi dokumen', html: '<label class="pt-compose__toggle"><input type="checkbox" data-bind="options.photos"' + (on ? ' checked' : '') + (isReadOnly() ? ' disabled' : '') + '>' +
        '<span><strong>' + esc(tpl.photoLabel || 'Tampilkan foto produk') + '</strong><span class="pt-compose__hint">' + esc(tpl.photoHint || 'Foto ikut tercetak pada dokumen dan dikunci saat terbit.') + '</span></span></label>' };
    }
    /* r13 compact: right after the issue the result card holds the number, the facts and ONE next action beside the
       issued paper; the record's details (lines, document row, history) fold behind "Lihat rincian …" */
    function moreAttr(s) { return issued && !s.keepOpen ? ' data-compose-more' + (detailsOpen ? '' : ' hidden') : ''; }
    function stageAttr(s) {
      if (!staged()) return '';
      var id = s.after ? '*' : (s.stage || (s.id === 'pemeriksaan' ? lastStage() : STAGES[0].id));
      return ' data-stage="' + esc(id) + '"';
    }
    function sectionHTML(s) {
      if (s.raw) return '<div class="pt-compose__raw" data-section="' + esc(s.id) + '"' + stageAttr(s) + moreAttr(s) + '>' + (s.html || '') + '</div>';
      var hid = uid + '-s-' + s.id;
      return '<section class="mc-card pt-section pt-compose__section' + (s.cls ? ' ' + esc(s.cls) : '') + '" data-section="' + esc(s.id) + '"' + stageAttr(s) + moreAttr(s) + ' aria-labelledby="' + hid + '">' +
        '<div class="pt-section__head"><div class="pt-section__titles"><h2 class="pt-section__title" id="' + hid + '" tabindex="-1">' + esc(s.title) + '</h2>' +
        (s.sub ? '<p class="pt-section__sub">' + esc(s.sub) + '</p>' : '') + '</div>' + (s.actions ? '<div class="pt-section__actions">' + s.actions + '</div>' : '') + '</div>' +
        '<div class="pt-section__body' + (s.flush ? ' pt-section__body--flush' : '') + '">' + (s.html || '') + '</div>' +
        (s.foot ? '<div class="pt-section__foot pt-compose__foot">' + s.foot + '</div>' : '') + '</section>';
    }
    function renderEditor() {
      var ro = isReadOnly();
      var lead = tpl.lead ? tpl.lead(state, api) || '' : '';
      el.lead.innerHTML = lead;
      el.lead.hidden = !lead;
      /* r13 harmony: a staged workspace states its identity ONCE, above both panels, so the editor card (stage band on
         top) and the preview card start on the same line; other composers keep the strip at the top of the editor */
      var grid = q('.pt-compose__grid', root_), work = q('[data-compose-work]', root_);
      if (staged()) { if (el.lead.parentNode !== root_) root_.insertBefore(el.lead, grid); }
      else if (el.lead.parentNode !== el.editor) el.editor.insertBefore(el.lead, work);
      var all = (tpl.sections ? tpl.sections(state, api) : []).filter(Boolean);
      var list = all.filter(function (s) { return !s.after; });
      var opt = !ro || tpl.optionsReadOnly ? optionsSection() : null;
      if (opt) list.push(opt);
      if (!ro || tpl.checksReadOnly) list.push({ id: 'pemeriksaan', title: 'Pemeriksaan', sub: ro || staged() ? null : (tpl.checksSub || 'Diperbarui saat Anda mengisi; semua harus terpenuhi sebelum terbit.'),
        html: (staged() ? '<div class="pt-compose__review" data-compose-review></div><div class="pt-compose__reviewinfo" data-compose-infohost><p class="pt-compose__subhead">Saat diterbitkan</p>' + bdateHTML() + '</div>' : '') + '<div data-compose-checks></div>' });
      list = list.concat(all.filter(function (s) { return s.after; }));
      var more = issued && list.some(function (x) { return !x.keepOpen; });
      el.sections.innerHTML = (more ? '<button type="button" class="pt-link pt-compose__detailsbtn" data-compose-details aria-expanded="' + String(detailsOpen) + '">' +
        icon('chevron-right', 'pt-compose__detailschev') + '<span>' + (detailsOpen ? 'Sembunyikan rincian ' : 'Lihat rincian ') + esc(obj.toLowerCase()) + '</span></button>' : '') + list.map(sectionHTML).join('');
      el.checks = q('[data-compose-checks]', el.sections);
      el.review = q('[data-compose-review]', el.sections);
      /* staged: the check count and the numbering cue belong to Pemeriksaan (the footer keeps one figure + one action) */
      var ih = q('[data-compose-infohost]', el.sections);
      if (ih && el.info) ih.appendChild(el.info);
      else if (el.info && el.info.parentNode !== el.bar) el.bar.insertBefore(el.info, el.status);
      root_.classList.toggle('is-readonly', ro);
      root_.classList.toggle('is-staged', staged());
      if (staged()) setStage(stage, { quiet: true });
      if (ro) qa('[data-bind]', el.sections).forEach(function (f) { f.disabled = true; });
    }

    /* ---- validation: template checks + entry errors (an unreadable number is never guessed) ---- */
    function checks() {
      var list = (tpl.validate ? tpl.validate(state, api) : []).slice();
      Object.keys(parseErr).forEach(function (path) {
        var f = q('[data-bind="' + path + '"]', root_);
        var lab = f ? (f.getAttribute('data-label') || f.getAttribute('aria-label') || '') : '';
        list = list.filter(function (c) { return c.field !== path; });
        list.unshift({ id: 'entry:' + path, severity: 'BLOCKING', field: path, text: (lab ? lab + ': ' : '') + parseErr[path] });
      });
      return list;
    }
    function fieldWrap(f) { return f.closest('[data-field-wrap], .mc-field, td, .pt-compose__field') || f.parentNode; }
    function showFieldErrors(list) {
      var bad = {};
      list.forEach(function (c) { if (c.severity === 'BLOCKING' && c.field && !bad[c.field]) bad[c.field] = c; });
      qa('[data-bind]', root_).forEach(function (f) {
        var path = f.getAttribute('data-bind'), c = bad[path], show = c && (attempted || touched[path] || parseErr[path]);
        var w = fieldWrap(f), err = w && w.querySelector(':scope > .pt-compose__err[data-for="' + path + '"]');
        if (show) {
          if (!err) { err = doc.createElement('p'); err.className = 'mc-field__error pt-compose__err'; err.setAttribute('data-for', path); err.id = uid + '-e-' + path.replace(/\W/g, '-'); w.appendChild(err); }
          var msg = parseErr[path] || c.short || c.text;
          if (err.textContent !== msg) err.textContent = msg;
          f.setAttribute('aria-invalid', 'true');
          var d = (f.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
          if (d.indexOf(err.id) < 0) { d.push(err.id); f.setAttribute('aria-describedby', d.join(' ')); }
        } else {
          if (err) { var d2 = (f.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && x !== err.id; }); if (d2.length) f.setAttribute('aria-describedby', d2.join(' ')); else f.removeAttribute('aria-describedby'); err.remove(); }
          f.removeAttribute('aria-invalid');
        }
      });
    }
    /* r13 harmony: the stage navigator is the shared MCStepper (guide.js) - the editor card's top band; Terbit is the
       locked final step (the bar's primary action does it). Step position never stands for the document status. */
    /* r13 Phase 7 - "Tanggal transaksi" (canonical PT-25 / IP-07), opt-in via tpl.businessDate = { today(), label(iso) }:
       prefilled "Hari ini, {tanggal}"; "Ubah" opens a date field that cannot go past today (L-09); a chosen earlier date
       reads "{tanggal} - dipilih" + the mark "Tanggal Mundur" (the template's cue then says "Nomor mengikuti periode ...").
       The value is a command parameter (state.businessDate, null = prefilled), never saved into the draft. */
    function bdateHTML() {
      if (!tpl.businessDate || !root.MCDateField) return '';
      var td = tpl.businessDate.today();
      return '<div class="pt-bdate" data-compose-bdate><p class="pt-bdate__line"><span class="pt-bdate__label">Tanggal transaksi</span><span class="pt-bdate__value" data-bdate-value></span>' +
        '<span class="pt-bdate__mark" data-bdate-mark hidden>Tanggal Mundur</span><button type="button" class="pt-link pt-bdate__edit" data-bdate-edit aria-expanded="false" aria-controls="' + uid + '-bdf">Ubah</button></p>' +
        '<div class="pt-bdate__field" id="' + uid + '-bdf" data-bdate-field hidden><span data-bind="businessDate" data-parse="date" data-label="Tanggal transaksi">' +
        root.MCDateField.html({ id: uid + '-bd', value: state.businessDate || td, max: td, label: 'tanggal transaksi' }) + '</span></div></div>';
    }
    function bdateSync(list) {
      var box = tpl.businessDate ? q('[data-compose-bdate]', root_) : null;
      if (!box) return;
      var td = tpl.businessDate.today(), bd = state.businessDate || td, chosen = !!state.businessDate && state.businessDate !== td;
      q('[data-bdate-value]', box).textContent = chosen ? tpl.businessDate.label(bd) + ' \u2014 dipilih' : 'Hari ini, ' + tpl.businessDate.label(td);
      q('[data-bdate-mark]', box).hidden = !(chosen && bd < td);
      if ((list || []).some(function (k) { return k.field === 'businessDate' && k.severity === 'BLOCKING'; })) { q('[data-bdate-field]', box).hidden = false; q('[data-bdate-edit]', box).setAttribute('aria-expanded', 'true'); }
    }
    root_.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-bdate-edit]');
      if (!b || !root_.contains(b)) return;
      var f = q('[data-bdate-field]', root_), open = f.hidden;
      f.hidden = !open; b.setAttribute('aria-expanded', String(open));
      if (open) { var i = f.querySelector('input'); if (i) i.focus(); }
    });
    function stageNav(list) {
      var c = root.MCChecks.counts(list), idx = 0;
      STAGES.forEach(function (x, i) { if (x.id === stage) idx = i; });
      var fieldBlock = list.filter(function (k) { return k.severity === 'BLOCKING' && k.field; }).length;
      var steps = STAGES.map(function (x, i) {
        var cur = x.id === stage, note = '', tone = '';
        if (i === 0 && fieldBlock && attempted) { note = fieldBlock + ' perlu diperbaiki'; tone = 'blocking'; }
        if (x.id === lastStage()) { note = c.blocking ? c.blocking + ' belum terpenuhi' : (c.warning ? c.warning + ' perlu dicek' : ''); tone = c.blocking ? 'blocking' : 'warning'; }
        var st = cur ? 'current' : i < idx ? (note && tone === 'blocking' ? 'attention' : 'complete') : 'upcoming';
        return { id: x.id, label: x.label, note: note, noteTone: tone, state: st, current: cur };
      });
      steps.push({ id: 'terbit', label: tpl.finalStage || 'Terbit', state: 'upcoming', locked: true, srHint: 'dilakukan dengan tombol ' + ((tpl.issue && tpl.issue.label) || 'Terbitkan ' + obj) });
      var cur = STAGES[idx] || {};
      return root.MCStepper.html(steps, { label: 'Tahap ' + obj.toLowerCase(), cls: 'pt-compose__flow', attr: 'data-stage-btn' }) +
        (cur.hint ? '<p class="pt-stages__hint" data-stage-hint>' + esc(typeof cur.hint === 'function' ? cur.hint(state, api) : cur.hint) + '</p>' : '');
    }
    function setStage(id, o) {
      o = o || {};
      if (!staged() || !STAGES.some(function (x) { return x.id === id; })) return;
      var changedStage = stage !== id;
      stage = id;
      root_.setAttribute('data-stage', id);
      qa('[data-stage]', el.sections).forEach(function (sec) { var v = sec.getAttribute('data-stage'); sec.hidden = !(v === '*' || v === id); });
      var last = id === lastStage();
      el.next.hidden = last;
      el.issue.hidden = !last;
      if (el.progress && !o.quiet) el.progress.innerHTML = stageNav(lastChecks);
      if (changedStage && o.focus) {
        var b = q('[data-stage-btn="' + id + '"]', root_);
        if (b) b.focus({ preventScroll: true });
        var top = el.editor.getBoundingClientRect().top;
        if (top < 0) el.editor.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
        el.sr.textContent = 'Tahap ' + ((STAGES.filter(function (x) { return x.id === id; })[0] || {}).label || '') + '.';   /* screen readers only */
      }
    }
    function progress(list) {
      if (staged()) { el.progress.hidden = false; el.progress.classList.add('pt-compose__progress--stages'); el.progress.innerHTML = stageNav(list); if (root.MCStepper) root.MCStepper.bind(el.progress, null); return; }
      el.progress.classList.remove('pt-compose__progress--stages');
      var steps = tpl.progress ? tpl.progress(state, list, api) : null;
      el.progress.hidden = steps === false;
      if (steps === false) { el.progress.innerHTML = ''; return; }
      if (!steps) {
        var fieldBlock = list.filter(function (c) { return c.severity === 'BLOCKING' && c.field; }).length;
        var block = list.filter(function (c) { return c.severity === 'BLOCKING'; }).length;
        steps = root.MCProgress.derive([
          { label: 'Rincian', done: !fieldBlock || issued, attention: attempted && fieldBlock > 0 },
          { label: 'Pemeriksaan', done: !block || issued, attention: attempted && block > 0 },
          { label: 'Terbit', done: issued }
        ]);
      }
      el.progress.innerHTML = root.MCProgress.html(steps, { label: 'Tahap ' + obj.toLowerCase(), cls: 'pt-compose__steps' });
    }
    function refresh() {
      lastChecks = checks();
      if (el.checks) {
        /* r13 compact: in a staged composer Pemeriksaan leads with what still needs attention; the checks that pass
           fold into one line ("Lihat 4 pemeriksaan yang terpenuhi") so a ready draft reads calm, not a wall of ticks */
        if (staged()) {
          var oks = lastChecks.filter(function (k) { return k.severity === 'OK'; });
          var okHTML = oks.length ? '<details class="pt-compose__okdetails"><summary class="pt-link">Lihat ' + oks.length + ' pemeriksaan yang terpenuhi</summary><ul class="pt-checks__list" role="list">' +
            oks.map(function (k) { return '<li class="pt-checkitem pt-checkitem--ok">' + icon('check-circle', 'pt-checkitem__icon') + '<span class="pt-checkitem__text"><span class="mc-visually-hidden">Terpenuhi: </span>' + esc(k.text) + '</span></li>'; }).join('') + '</ul></details>' : '';
          var openOk = el.checks.querySelector('.pt-compose__okdetails[open]');
          el.checks.innerHTML = root.MCChecks.html(lastChecks, { hideOk: true }) + okHTML;
          if (openOk) { var d = el.checks.querySelector('.pt-compose__okdetails'); if (d) d.open = true; }
        } else el.checks.innerHTML = root.MCChecks.html(lastChecks, { hideOk: false });
      }
      if (el.review) {
        var facts = tpl.reviewFacts ? tpl.reviewFacts(state, api) || [] : [];
        var fh = facts.length ? '<p class="pt-compose__subhead">Cocokkan dengan pratinjau</p><dl class="pt-compose__facts">' + facts.map(function (f) { return '<div><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>'; }).join('') + '</dl>' : '';
        if (el.review.innerHTML !== fh) el.review.innerHTML = fh;
        el.review.hidden = !fh;
      }
      showFieldErrors(lastChecks);
      bdateSync(lastChecks);
      progress(lastChecks);
      var c = root.MCChecks.counts(lastChecks);
      el.count.textContent = root.MCChecks.summary(c);
      el.count.className = c.blocking ? 'is-blocking' : c.warning ? 'is-warning' : 'is-clear';
      el.cue.textContent = tpl.cue ? tpl.cue(state, api) || '' : '';
      var ro = isReadOnly();
      el.bar.hidden = ro;
      if (main) main.classList.toggle('pt-has-actionbar', !ro);
      el.save.hidden = !tpl.save;
      if (staged()) { var lastS = stage === lastStage(); el.next.hidden = lastS; el.issue.hidden = !lastS; } else el.next.hidden = true;
      el.issue.setAttribute('aria-describedby', uid + '-count');
      el.count.id = uid + '-count';
      var sm = !ro && tpl.summary ? tpl.summary(state, api, lastChecks) : null;
      if (sm) {
        var html = '<strong>' + esc(sm.value) + '</strong><span>' + esc(sm.label || '') + '</span>';
        if (el.sum.innerHTML !== html) el.sum.innerHTML = html;
      }
      el.sum.hidden = !sm;
      el.revert.hidden = ro || frozen || !tpl.save || !inst.dirty();
      if (issued) { el.lead.hidden = true; el.progress.hidden = true; root_.classList.add('is-issued'); }
      var pt = tpl.previewTitle ? tpl.previewTitle(state, ro) : (ro ? 'Dokumen terbit' : 'Pratinjau');
      if (el.ptitle.textContent !== pt) el.ptitle.textContent = pt;
      var pn = ro ? (tpl.issuedNote ? tpl.issuedNote(state, api) || '' : '') : 'Pratinjau tidak menyimpan dan tidak menetapkan nomor.';
      if (el.pnote.textContent !== pn) el.pnote.textContent = pn;
      el.pnote.hidden = !pn;
      if (inst.fitPane) inst.fitPane();
    }

    /* ---- preview (debounced; the editor is never touched) ---- */
    function renderPreview() {
      timer = 0; frame = 0;
      var vm = tpl.viewModel(state, api);
      var po = tpl.paper ? tpl.paper(state, api) : {};
      var o = { mode: po.mode || (isReadOnly() ? 'issued' : 'draft'), photos: po.photos != null ? po.photos : !!state.options.photos, label: po.label,
        scale: preview ? preview.scale() : 'fit', stageCls: 'pt-paper-stage--rail', onRender: pageInfo };
      if (preview) preview.update(vm, o); else preview = root.MCDoc.mount(el.paper, vm, o);
      inst.preview = preview;
      if (fullLayer && fullLayer.ctl) fullLayer.ctl.update(vm, { mode: o.mode, photos: o.photos, scale: fullLayer.ctl.scale(), stageCls: 'pt-paper-stage--full', onRender: fullLayer.info });
    }
    function schedule() {
      if (timer) return;
      timer = root.setTimeout(function () { frame = root.requestAnimationFrame ? root.requestAnimationFrame(renderPreview) : (renderPreview(), 0); }, 90);
    }
    function pageInfo(ctl) {
      if (!ctl) return;
      el.page.textContent = 'Halaman ' + ctl.pageAt() + ' dari ' + ctl.pages();
    }

    /* ---- input: state first, then derived text, checks and the preview ---- */
    function changed(path) {
      if (tpl.onChange) tpl.onChange(state, path, api);
      refresh();
      schedule();
    }
    function onField(e) {
      var f = e.target.closest && e.target.closest('[data-bind]');
      if (!f || !root_.contains(f) || isReadOnly() || frozen) return;
      var path = f.getAttribute('data-bind'), r = readField(f);
      if (r.error) parseErr[path] = r.error; else delete parseErr[path];
      setPath(state, path, r.value);
      if (e.type === 'change') touched[path] = true;
      changed(path);
    }
    root_.addEventListener('input', onField);
    root_.addEventListener('change', onField);
    root_.addEventListener('focusout', function (e) {
      var f = e.target.closest && e.target.closest('[data-bind]');
      if (!f || isReadOnly()) return;
      var path = f.getAttribute('data-bind');
      touched[path] = true;
      var kind = f.getAttribute('data-parse');
      if (PARSE[kind] && !parseErr[path] && root.MCForm) { var v = getPath(state, path); if (v != null) f.value = root.MCForm.num.format(v, PARSE[kind]); }
      showFieldErrors(lastChecks);
    });

    /* ---- panes (768-1279 px and phones) ---- */
    function setPane(name, o) {
      pane = name;
      root_.setAttribute('data-pane', name);
      qa('[data-pane-btn]', root_).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pane-btn') === name)); });
      if (name === 'preview' && preview) root.requestAnimationFrame(function () { preview.setScale(preview.scale()); });
      if (o && o.focus) { var t = name === 'preview' ? q('#' + uid + '-pt', root_) : el.editor; if (t) { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } }
      if (!mqWide.matches && o && o.scroll !== false) { var sw = q('[data-compose-switch]', root_); var top = sw.getBoundingClientRect().top; if (top < 0) sw.scrollIntoView({ block: 'start', behavior: 'auto' }); }
    }
    root_.addEventListener('click', function (e) {
      var pb = e.target.closest('[data-pane-btn]');
      if (pb) { setPane(pb.getAttribute('data-pane-btn')); return; }
      var z = e.target.closest('[data-zoom]');
      if (z && preview) {
        var group = z.parentNode;
        qa('[data-zoom]', group).forEach(function (b) { b.setAttribute('aria-pressed', String(b === z)); });
        var v = z.getAttribute('data-zoom');
        if (z.closest('.pt-paper-full')) { if (fullLayer) fullLayer.ctl.setScale(v === 'fit' ? 'fit' : +v); }
        else preview.setScale(v === 'fit' ? 'fit' : +v);
        return;
      }
      if (e.target.closest('[data-compose-full]')) { openFull(e.target.closest('[data-compose-full]')); return; }
      if (e.target.closest('[data-compose-save]')) { save(); return; }
      if (e.target.closest('[data-compose-revert]')) { revert(e.target.closest('[data-compose-revert]')); return; }
      /* the primary changes role after an outcome: "Periksa Status" (unknown) is checked before "Terbitkan" */
      if (e.target.closest('[data-compose-status-check]')) { checkStatus(e.target.closest('[data-compose-status-check]')); return; }
      if (e.target.closest('[data-compose-issue]')) { issue(); return; }
      var db = e.target.closest('[data-compose-details]');
      if (db) {
        detailsOpen = !detailsOpen;
        qa('[data-compose-more]', el.sections).forEach(function (x) { x.hidden = !detailsOpen; });
        db.setAttribute('aria-expanded', String(detailsOpen));
        db.querySelector('span').textContent = (detailsOpen ? 'Sembunyikan rincian ' : 'Lihat rincian ') + obj.toLowerCase();
        return;
      }
      var sb = e.target.closest('[data-stage-btn]');
      if (sb) { setStage(sb.getAttribute('data-stage-btn'), { focus: true }); return; }
      if (e.target.closest('[data-compose-next]')) {
        var i = 0; STAGES.forEach(function (x, k) { if (x.id === stage) i = k; });
        if (STAGES[i + 1]) setStage(STAGES[i + 1].id, { focus: true });
        return;
      }
    });
    root_.addEventListener('mc:reveal', function (e) {
      if (!mqWide.matches && pane !== 'editor') setPane('editor', { scroll: false });
      /* staged: a "Perbaiki" jump opens the stage that holds the field (synchronous, before the focus moves) */
      var t = e.detail && e.detail.target, sec = t && t.closest ? t.closest('[data-stage]') : null;
      if (staged() && sec) { var v = sec.getAttribute('data-stage'); if (v !== '*' && v !== stage) setStage(v, {}); }
    });
    root_.addEventListener('keydown', function (e) {                /* arrow keys move between the two pane buttons */
      var b = e.target.closest && e.target.closest('[data-pane-btn]');
      if (!b || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
      e.preventDefault();
      var other = q('[data-pane-btn="' + (b.getAttribute('data-pane-btn') === 'editor' ? 'preview' : 'editor') + '"]', root_);
      other.focus(); setPane(other.getAttribute('data-pane-btn'));
    });
    /* phones: while the on-screen keyboard is up the action bar steps aside (never covers the field) */
    /* r13 refine: the sticky preview never runs under the action bar. Before it sticks it starts lower on the page, so
       a fixed calc() let the bar cover the bottom of the paper and the page note; its height now follows its own top
       and the bar's real height (rAF-throttled; constant once stuck). */
    var fitRaf = 0;
    function fitPane() {
      fitRaf = 0;
      var pv = el.previewPane;
      if (!pv || !doc.contains(pv)) return;
      if (!mqWide.matches) { pv.style.height = ''; return; }
      var top = Math.max(pv.getBoundingClientRect().top, 16);
      var barH = el.bar.hidden ? 0 : el.bar.getBoundingClientRect().height;
      pv.style.height = Math.max(360, Math.round(root.innerHeight - top - barH - 16)) + 'px';
    }
    function queueFit() { if (!fitRaf) fitRaf = root.requestAnimationFrame ? root.requestAnimationFrame(fitPane) : (fitPane(), 0); }
    root.addEventListener('scroll', queueFit, { passive: true });
    root.addEventListener('resize', queueFit);
    inst.fitPane = queueFit;
    var vv = root.visualViewport;
    function onViewport() { root_.classList.toggle('is-keyboard', !!vv && vv.height < root.innerHeight * 0.72); }
    if (vv && vv.addEventListener) vv.addEventListener('resize', onViewport);
    function onScrollPaper() {
      if (!preview) return;
      if (onScrollPaper.f) return;
      onScrollPaper.f = root.requestAnimationFrame(function () { onScrollPaper.f = 0; pageInfo(preview); });
    }

    /* ---- full screen preview (dialog; Esc closes; focus returns) ---- */
    function openFull(trigger) {
      if (fullLayer) return;
      var layer = doc.createElement('div');
      layer.className = 'pt-paper-full';
      layer.setAttribute('role', 'dialog');
      layer.setAttribute('aria-modal', 'true');
      layer.setAttribute('aria-labelledby', uid + '-ft');
      layer.innerHTML = '<div class="pt-paper-full__bar"><h2 class="pt-paper-full__title" id="' + uid + '-ft">Pratinjau ' + esc(obj.toLowerCase()) + '</h2>' +
        '<div class="pt-seg" role="group" aria-label="Ukuran pratinjau"><button type="button" data-full-zoom="fit" aria-pressed="true">Pas lebar</button><button type="button" data-full-zoom="1" aria-pressed="false">100 %</button></div>' +
        '<span class="pt-compose__page" data-full-page></span>' +
        '<button type="button" class="mc-btn mc-btn--outline mc-btn--md" data-full-close>' + icon('x') + '<span class="mc-btn__label">Tutup</span></button></div>' +
        '<div class="pt-paper-full__body" data-full-paper></div>';
      var inert = [];
      Array.prototype.forEach.call(doc.body.children, function (c) { if (c.tagName === 'SCRIPT' || c.inert || c.id === 'mc-icon-sprite' || c.classList.contains('mc-toasts')) return; c.inert = true; inert.push(c); });
      doc.body.appendChild(layer);
      doc.documentElement.classList.add('pt-sheet-open');
      var pageEl = q('[data-full-page]', layer);
      var info = function (ctl) { pageEl.textContent = 'Halaman ' + ctl.pageAt() + ' dari ' + ctl.pages(); };
      var po = tpl.paper ? tpl.paper(state, api) : {};
      var ctl = root.MCDoc.mount(q('[data-full-paper]', layer), tpl.viewModel(state, api), { mode: po.mode || (isReadOnly() ? 'issued' : 'draft'), photos: po.photos != null ? po.photos : !!state.options.photos, scale: 'fit', maxScale: 1.4, stageCls: 'pt-paper-stage--full', onRender: info });
      ctl.scroller().addEventListener('scroll', function () { info(ctl); });
      function close() {
        if (!fullLayer) return;
        ctl.destroy(); layer.remove(); inert.forEach(function (c) { c.inert = false; });
        doc.documentElement.classList.remove('pt-sheet-open');
        fullLayer = null;
        if (trigger && doc.contains(trigger)) trigger.focus({ preventScroll: true });
      }
      layer.addEventListener('click', function (e) {
        if (e.target.closest('[data-full-close]')) { close(); return; }
        var z = e.target.closest('[data-full-zoom]');
        if (z) { qa('[data-full-zoom]', layer).forEach(function (b) { b.setAttribute('aria-pressed', String(b === z)); }); var v = z.getAttribute('data-full-zoom'); ctl.setScale(v === 'fit' ? 'fit' : +v); }
      });
      layer.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); return; }
        if (e.key !== 'Tab') return;
        var f = qa('button:not([disabled]), a[href], [tabindex="0"]', layer).filter(function (x) { return x.offsetParent !== null; });
        var i = f.indexOf(doc.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      });
      if (!reduced() && layer.animate) layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'linear' });
      fullLayer = { ctl: ctl, info: info, close: close, layer: layer };
      q('[data-full-close]', layer).focus({ preventScroll: true });
    }

    /* ---- outcome region (sticky bar): CONFLICT / unknown / failed / not started ---- */
    function outcome(html, kind) {
      el.outcome.innerHTML = html || '';
      el.outcome.hidden = !html;
      el.outcome.className = 'pt-compose__outcome' + (kind ? ' pt-compose__outcome--' + kind : '');
      root_.classList.toggle('has-outcome', !!html);
    }
    function freeze(on) {
      frozen = on;
      el.editor.classList.toggle('is-frozen', on);
      el.editor.setAttribute('aria-busy', on ? 'true' : 'false');
      qa('[data-bind]', el.editor).forEach(function (f) { if (on) { f.setAttribute('data-was-disabled', f.disabled ? '1' : ''); f.disabled = true; } else if (f.getAttribute('data-was-disabled') !== '1') f.disabled = false; });
      el.save.disabled = on;
    }
    function setIssueButton(label, attr) {
      var b = el.issue;
      b.removeAttribute('data-compose-status-check'); b.removeAttribute('data-compose-retry');
      if (attr) b.setAttribute(attr, '');
      q('.mc-btn__label', b).textContent = label;
    }

    function success(res) {
      issued = true; frozen = false; commandId = null;
      outcome('');
      baseline = JSON.stringify(state);
      var spec = tpl.issue.result ? tpl.issue.result(state, api, res) : { object: obj, number: res.number };
      api.result = root.MCResult.mount(el.result, spec);
      if (pane !== 'editor') setPane('editor', { scroll: false });   /* the answer sits at the top of the editor, beside the issued paper */
      renderEditor(); refresh(); renderPreview();
      if (tpl.issue.after) tpl.issue.after(state, api, res);
      if (api.result) api.result.focus();
    }
    function handle(res) {
      if (!res || res === true) return;
      if (res.ok) { success(res); return; }
      if (res.code === 'CONFLICT') {
        issued = true; commandId = null; frozen = false;
        baseline = JSON.stringify(state);
        api.result = root.MCResult.mount(el.result, { tone: 'info', title: 'Sudah tercatat — periksa sebelum mengulang.', number: res.number,
          text: obj + ' ini sudah terbit dengan nomor ' + res.number + '. Tidak ada yang diterbitkan dua kali.', facts: res.facts || [], next: res.next || null });
        outcome('');
        renderEditor(); refresh(); renderPreview();
        if (tpl.issue.after) tpl.issue.after(state, api, res);
        api.result.focus();
        return;
      }
      if (res.code === 'UNKNOWN') {
        freeze(true);
        setIssueButton('Periksa Status', 'data-compose-status-check');
        outcome('<p class="pt-compose__otitle">Belum dapat dipastikan apakah ' + esc(obj.toLowerCase()) + ' ini sudah terbit.</p><p>Isian dikunci sementara. Periksa status lebih dulu — sistem tidak akan menerbitkan dua kali.</p>', 'unknown');
        el.issue.focus({ preventScroll: true });
        return;
      }
      if (res.code === 'NOT_STARTED') {
        outcome(root.MCPrereq.html(res.prereq || { kind: 'owner', text: res.message }), 'prereq');
        return;
      }
      /* FAILED (MSG-06): nothing was processed; the same command may run again */
      setIssueButton('Coba Lagi', 'data-compose-retry');
      outcome('<p class="pt-compose__otitle">' + esc(res.message || 'Sistem sedang sibuk sehingga tindakan ini belum diproses.') + '</p><p>Aman diulang: tidak ada yang tersimpan dan tidak ada nomor yang terpakai.</p>', 'failed');
    }
    function checkStatus(btn) {
      if (busy) return;
      busy = true;
      root.MCRisk.setPending(btn, true, 'Memeriksa…');
      root.setTimeout(function () {
        busy = false;
        root.MCRisk.setPending(btn, false);
        var res = tpl.issue.status ? tpl.issue.status(state, api, commandId) : null;
        if (res && res.ok) { setIssueButton((tpl.issue && tpl.issue.label) || 'Terbitkan ' + obj); success(res); return; }
        freeze(false);
        setIssueButton((tpl.issue && tpl.issue.label) || 'Terbitkan ' + obj);
        outcome('<p class="pt-compose__otitle">Belum tercatat terbit.</p><p>Tidak ada nomor yang terpakai. Aman diterbitkan lagi.</p>', 'clear');
      }, reduced() ? 200 : 500);
    }

    function issue() {
      if (isReadOnly() || frozen || !tpl.issue) return;
      attempted = true;
      refresh();
      var block = lastChecks.filter(function (c) { return c.severity === 'BLOCKING'; });
      if (block.length) {
        /* no dialog: the checks say what to fix and the first field takes the focus */
        var first = block.filter(function (c) { return c.field; })[0];
        var f = first ? root.MCChecks.field(first.field, root_) : null;
        if (f) root.MCChecks.reveal(f);
        else { if (!mqWide.matches) setPane('editor', { scroll: false }); if (staged()) setStage(lastStage(), {}); var h = q('[data-section="pemeriksaan"] .pt-section__title', root_); if (h) { h.focus({ preventScroll: true }); h.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); } }
        el.status.textContent = root.MCChecks.summary(root.MCChecks.counts(lastChecks)) + '. Perbaiki lalu terbitkan lagi.';
        return;
      }
      outcome('');
      commandId = commandId || nextId('cmd');
      var cid = commandId;
      root.MCRisk.run({
        key: 'compose-issue-' + uid, level: 'commit', trigger: el.issue, pendingLabel: 'Menerbitkan…',
        confirm: tpl.issue.confirm ? tpl.issue.confirm(state, api) : { title: 'Terbitkan ' + obj + '?', ok: 'Terbitkan ' + obj, cancel: 'Kembali' },
        execute: function () { return tpl.issue.execute(state, api, cid); }
      }).then(handle);
    }
    /* "Kembalikan isian": back to the last saved draft (asks first; typed input would be lost). The state object keeps
       its identity; the editor is rendered again (an explicit act, never while typing). */
    function restore(s) {
      Object.keys(state).forEach(function (k) { delete state[k]; });
      Object.keys(s).forEach(function (k) { state[k] = s[k]; });
      parseErr = {}; touched = {}; attempted = false;
      renderEditor(); refresh(); renderPreview();
    }
    function revert(btn) {
      if (isReadOnly() || frozen || !inst.dirty()) return;
      root.MCRisk.run({
        key: 'compose-revert-' + uid, level: 'destructive', trigger: btn, latency: 0,
        confirm: { title: 'Kembalikan isian?', message: 'Perubahan sejak draf terakhir disimpan akan hilang.', consequence: 'Draf yang tersimpan tidak berubah dan tetap belum bernomor.', ok: 'Kembalikan Isian', cancel: 'Kembali' },
        execute: function () { restore(JSON.parse(baseline)); }
      }).then(function (ok) {
        if (!ok) return;
        el.status.textContent = 'Isian dikembalikan ke draf tersimpan.';
        var h = q('.pt-compose__section .pt-section__title', root_);
        if (h) h.focus({ preventScroll: true });
      });
    }
    function save() {
      if (isReadOnly() || frozen || !tpl.save) return;
      if (!inst.dirty()) { el.status.textContent = 'Tidak ada perubahan untuk disimpan.'; return; }
      root.MCRisk.run({ key: 'compose-save-' + uid, level: 'low', trigger: el.save, latency: 350, pendingLabel: 'Menyimpan…',
        execute: function () { return tpl.save(state, api); } }).then(function (ok) {
        if (ok === false) return;
        baseline = JSON.stringify(state);
        var t = root.MCTime && root.MCTime.parts ? root.MCTime.parts() : null;
        el.status.textContent = 'Draf tersimpan' + (t ? ' pukul ' + String(t.hour).padStart(2, '0') + '.' + String(t.minute).padStart(2, '0') : '') + '. Belum bernomor.';
        refresh();
      });
    }

    inst.state = state;
    inst.get = function (path) { return getPath(state, path); };
    inst.set = api.set;
    inst.refresh = refresh;
    inst.flush = function () { if (timer) { root.clearTimeout(timer); timer = 0; } if (frame && root.cancelAnimationFrame) root.cancelAnimationFrame(frame); renderPreview(); };
    inst.dirty = function () { return !issued && JSON.stringify(state) !== baseline; };
    inst.checks = function () { return lastChecks.slice(); };
    inst.readOnly = isReadOnly;
    inst.pane = function (name) { if (name) setPane(name, { focus: true }); return pane; };
    inst.issue = issue;
    inst.save = save;
    inst.revert = function () { revert(el.revert); };
    inst.api = api;
    inst.root = root_;
    root_.__mcComposer = inst;                           /* the instance from its element (tests, page code) */
    inst.destroy = function () {
      if (fullLayer) fullLayer.close();
      if (preview) preview.destroy();
      if (vv && vv.removeEventListener) vv.removeEventListener('resize', onViewport);
      if (main) main.classList.remove('pt-has-actionbar');
      root_.remove();
    };

    renderEditor();
    refresh();
    renderPreview();
    if (preview) preview.scroller().addEventListener('scroll', onScrollPaper, { passive: true });
    if (ctx.guard !== false && root.MCPage && root.MCPage.dirtyGuard) root.MCPage.dirtyGuard(function () { return inst.dirty(); });
    /* the page leaves (persistent shell): close the full-screen layer and drop the visualViewport listener, which the
       page scope does not track (it is neither window, document nor a media query) */
    if (root.MCScope && root.MCScope.onDispose) { try { root.MCScope.onDispose(function () { if (fullLayer) fullLayer.close(); if (vv && vv.removeEventListener) vv.removeEventListener('resize', onViewport); }); } catch (e) { /* passive on file:// */ } }
    return inst;
  }

  /* ---- shared markup for templates (no business data: the page passes text) ---------------------- */
  /* identity strip: { label, pill (trusted status markup), title, chips: [trusted markup], rows: [{ label, value, sub, html }],
     source: { text, href, label } } — carried data read-only with its source and ONE way to correct it there (DC-5) */
  function identity(o) {
    o = o || {};
    var rows = (o.rows || []).filter(function (r) { return r && (r.value || r.html); });
    var head = (o.pill || '') + (o.title ? '<span class="pt-compose__idtitle">' + esc(o.title) + '</span>' : '') + (o.chips || []).filter(Boolean).join('');
    var body = (rows.length ? '<dl class="pt-compose__idrows">' + rows.map(function (r) {
        return '<div class="pt-compose__idrow' + (r.wide ? ' is-wide' : '') + '"><dt>' + esc(r.label) + '</dt><dd>' + (r.html != null ? r.html : esc(r.value)) + (r.sub ? '<span class="pt-compose__idsub">' + esc(r.sub) + '</span>' : '') + '</dd></div>';
      }).join('') + '</dl>' : '') +
      (o.note ? '<p class="pt-compose__idnote">' + esc(o.note) + '</p>' : '') +
      (o.source ? source(o.source) : '');
    /* r13 pilot: { collapse: 'Data dari proyek', summary } keeps the strip to ONE line; the carried rows and their
       source open on demand (a <details>, still read-only with its source — DC-5) */
    if (o.collapse && body) body = '<details class="pt-compose__iddetails"><summary class="pt-compose__idsummary"><span>' + esc(o.collapse) + '</span>' +
      (o.summary ? '<span class="pt-compose__idsumtext">' + esc(o.summary) + '</span>' : '') + icon('chevron-down', 'pt-compose__idchev') + '</summary>' + body + '</details>';
    return '<section class="mc-card pt-compose__id' + (o.collapse ? ' pt-compose__id--compact' : '') + '" aria-label="' + esc(o.label || 'Data dokumen') + '">' +
      (head ? '<div class="pt-compose__idhead">' + head + '</div>' : '') + body + '</section>';
  }
  function source(s) {
    if (!s || !s.text) return '';
    return '<p class="pt-compose__src"><span class="pt-compose__srctag">' + icon('link') + '<span>' + esc(s.text) + '</span></span>' +
      (s.href ? '<a class="pt-link pt-compose__srcfix" href="' + esc(s.href) + '">' + esc(s.label || 'Perbaiki') + icon('chevron-right') + '</a>' : '') + '</p>';
  }

  root.MCComposer = { register: register, mount: mount, get: function (id) { return TEMPLATES[id] || null; }, path: { get: getPath, set: setPath }, ui: { identity: identity, source: source } };
})(typeof window !== 'undefined' ? window : this);
