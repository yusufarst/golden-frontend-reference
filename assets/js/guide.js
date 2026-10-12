/* =============================================================================
   MULTIPLECORP Golden Reference: GUIDED WORK primitives (r13, Layer A: Golden Design System)

   Config-driven building blocks for guided work (R13_SPEC §4, §9; DISC §2.3). No business data here: pages pass
   steps, checks, numbers and links in. Pairs with assets/css/patterns.css §12b. Load deferred AFTER patterns.js.

   MCProgress  a DERIVED step indicator (never stored progress). Semantic <ol class="mc-stepper">, aria-current="step"
               on the current step, states complete · current · upcoming · attention, symmetrical geometry (the
               shared .mc-stepper of components.css), wraps on phones (o.wrap).
                 html(steps, o) -> markup     steps: [{ label, state }] | MCProgress.derive(list)
                 derive([{ label, done, attention }]) -> steps (the first step not done is current)
                 set(ol, states) updates an existing list in place (markers, aria-current, screen-reader text)
   MCChecks    the validation summary "Pemeriksaan": items { id, severity: 'BLOCKING' | 'WARNING' | 'OK', text,
               field, link } in business sentences; a BLOCKING / WARNING item with a field has "Perbaiki" (jumps to the
               field: reveals it — collapsed disclosures, hidden panes via the cancelable 'mc:reveal' event — then focuses
               it); an item fixed on another screen carries link { href, label } instead (r13 phase 5b).
               Warnings use the warning tone, never the error tone.
                 mount(host, o) -> { update(items), counts(), first() } · html(items, o) · summary(counts) · reveal(el)
   MCResult    ONE result surface for a durable answer: the title states what was recorded with its number (MSG-01
               "{Objek} diterbitkan dengan nomor {nomor}."), the facts, the PDF state (PENDING -> READY, automatic
               retries "percobaan n dari 5", FAILED after 5), ONE recommended next action (MCNext) + contextual links.
                 html(o) · mount(host, o) -> { el, setPdf(pdf), focus() } · issued(objek, nomor) -> MSG-01 sentence
   MCNext      one recommended next action: verb + object, an optional why-line, quiet contextual links; without the
               capability the step is named with "Perlu kewenangan …" and nothing to press (MCPrereq).
   MCPrereq    a prerequisite notice: kind 'missing' (what is missing + who fixes it + link), 'capability'
               ("Perlu kewenangan {nama}", nothing to press), 'owner' (an Owner-only blocker in MSG-17 style for Admins:
               no counters, batches or other companies).
   ============================================================================= */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var doc = document;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(name, cls) { return '<svg class="mc-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + esc(name) + '"></use></svg>'; }
  var uidN = 0;
  function uid(p) { uidN += 1; return (p || 'gd') + '-' + uidN; }
  function reduced() { return root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)').matches : false; }

  /* ---- MCProgress ------------------------------------------------------------------------------ */
  var STATES = { complete: 1, current: 1, upcoming: 1, attention: 1 };
  var CHECK = '<svg class="mc-icon mc-icon--16" aria-hidden="true"><use href="#i-check"></use></svg>';
  function srText(state, i, n) {
    return '(' + (state === 'complete' ? 'selesai, ' : state === 'current' ? 'langkah saat ini, ' : state === 'attention' ? 'perlu perhatian, ' : '') + 'langkah ' + (i + 1) + ' dari ' + n + ')';
  }
  function markerOf(state, i) { return state === 'complete' ? CHECK : state === 'attention' ? '!' : String(i + 1); }
  function derive(list) {
    var cur = -1;
    return (list || []).map(function (s, i) {
      var st = s.done ? 'complete' : 'upcoming';
      if (!s.done && cur < 0) { cur = i; st = s.attention ? 'attention' : 'current'; }
      else if (!s.done && s.attention) st = 'attention';
      return { label: s.label, state: st };
    });
  }
  function progressHTML(steps, o) {
    o = o || {};
    var n = steps.length;
    return '<ol class="mc-stepper' + (o.wrap ? ' mc-stepper--wrap' : '') + (o.cls ? ' ' + esc(o.cls) : '') + '" role="list"' + (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + ' data-progress>' +
      steps.map(function (s, i) {
        var st = STATES[s.state] ? s.state : 'upcoming';
        var cls = st === 'complete' ? ' is-complete' : st === 'current' ? ' is-current' : st === 'attention' ? ' is-attention' : '';
        var here = st === 'current' || (st === 'attention' && !steps.some(function (x) { return x.state === 'current'; }) && steps.indexOf(s) === steps.map(function (x) { return x.state; }).indexOf('attention'));
        return '<li class="mc-step' + cls + '"' + (here ? ' aria-current="step"' : '') + '><span class="mc-step__marker" aria-hidden="true">' + markerOf(st, i) + '</span>' +
          '<span class="mc-step__label">' + esc(s.label) + '</span><span class="mc-visually-hidden">' + esc(srText(st, i, n)) + '</span></li>';
      }).join('') + '</ol>';
  }
  /* set(ol, states): states = ['complete', 'current', 'upcoming'] (or a current index) */
  function progressSet(ol, states) {
    if (!ol) return;
    var lis = Array.prototype.slice.call(ol.querySelectorAll(':scope > .mc-step'));
    if (typeof states === 'number') { var c = states; states = lis.map(function (x, i) { return i < c ? 'complete' : i === c ? 'current' : 'upcoming'; }); }
    lis.forEach(function (li, i) {
      var st = states[i] || 'upcoming';
      li.classList.toggle('is-complete', st === 'complete');
      li.classList.toggle('is-current', st === 'current');
      li.classList.toggle('is-attention', st === 'attention');
      if (st === 'current') li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      var mk = li.querySelector('.mc-step__marker');
      if (mk) mk.innerHTML = markerOf(st, i);
      var sr = li.querySelector('.mc-visually-hidden');
      if (sr) sr.textContent = srText(st, i, lis.length);
    });
  }
  root.MCProgress = {
    html: progressHTML, derive: derive, set: progressSet,
    mount: function (host, steps, o) { if (host) host.innerHTML = progressHTML(steps, o); return host && host.firstChild; }
  };

  /* ---- MCStepper (r13 visual harmony) ----------------------------------------------------------
     The INTERACTIVE workflow navigator: the same .mc-stepper anatomy and state colours as MCProgress (one marker
     language), laid out inline (marker beside label + optional note) on equal columns inside a quiet band
     (.mc-flow). Step position is NOT document status: "current" = where the user works, "complete" = genuinely
     finished, "attention" / "blocked" = needs a fix, "locked" = the final lifecycle step (done by the bar's
     primary action, never by clicking the step). No labels are hard-coded here.
       html(steps, o)   steps: [{ id, label, note, noteTone: 'blocking'|'warning'|'clear', state:
                        'complete'|'current'|'upcoming'|'attention'|'blocked', locked, srHint }]; o: { label, cls }
       bind(host, onSelect(id, btn))   click + ArrowLeft/ArrowRight/Home/End between the interactive steps */
  var FLOW_SR = { complete: 'selesai', current: 'tahap saat ini', attention: 'perlu diperbaiki', blocked: 'perlu diperbaiki', upcoming: '' };
  function stepperHTML(steps, o) {
    o = o || {};
    var n = steps.length;
    return '<nav class="mc-flow' + (o.cls ? ' ' + esc(o.cls) : '') + '"' + (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + ' data-flow>' +
      /* equal columns; a locked final step (a lifecycle end, usually short) takes only its own width at the end */
      '<ol class="mc-stepper mc-stepper--inline" role="list" style="--flow-cols:' + (n > 1 && steps[n - 1].locked ? 'repeat(' + (n - 1) + ', minmax(0, 1fr)) max-content' : 'repeat(' + n + ', minmax(0, 1fr))') + '">' +
      steps.map(function (s, i) {
        var st = s.state === 'blocked' ? 'attention' : (STATES[s.state] ? s.state : 'upcoming');
        var cls = st === 'complete' ? ' is-complete' : st === 'current' ? ' is-current' : st === 'attention' ? ' is-attention' : '';
        if (s.state === 'blocked') cls += ' is-blocked';
        if (s.locked) cls += ' is-locked';
        var here = s.state === 'current' || (s.current === true);
        var sr = [FLOW_SR[s.state] || '', 'langkah ' + (i + 1) + ' dari ' + n, s.srHint || ''].filter(Boolean).join(', ');
        var inner = '<span class="mc-step__marker" aria-hidden="true">' + markerOf(st, i) + '</span>' +
          '<span class="mc-step__text"><span class="mc-step__label">' + esc(s.label) + '</span>' +
          (s.note ? '<span class="mc-step__note mc-step__note--' + esc(s.noteTone || 'neutral') + '">' + esc(s.note) + '</span>' : '') + '</span>' +
          '<span class="mc-visually-hidden"> (' + esc(sr) + ')</span>';
        var ctl = s.locked
          ? '<span class="mc-step__btn" aria-disabled="true">' + inner + '</span>'
          : '<button type="button" class="mc-step__btn" data-flow-step="' + esc(s.id) + '"' + (o.attr ? ' ' + o.attr + '="' + esc(s.id) + '"' : '') + (here ? ' aria-current="step"' : '') + '>' + inner + '</button>';
        return '<li class="mc-step' + cls + '">' + ctl + '</li>';
      }).join('') + '</ol></nav>';
  }
  function stepperBind(host, onSelect) {
    if (!host || host.__mcFlow) return;
    host.__mcFlow = true;
    host.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button[data-flow-step]');
      if (b && host.contains(b) && onSelect) onSelect(b.getAttribute('data-flow-step'), b);
    });
    host.addEventListener('keydown', function (e) {
      var b = e.target.closest && e.target.closest('button[data-flow-step]');
      if (!b || ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) < 0) return;
      var all = Array.prototype.slice.call(host.querySelectorAll('button[data-flow-step]'));
      var i = all.indexOf(b), j = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : i + (e.key === 'ArrowRight' ? 1 : -1);
      if (j < 0 || j >= all.length || j === i) return;
      e.preventDefault();
      all[j].focus();
    });
  }
  root.MCStepper = { html: stepperHTML, bind: stepperBind };

  /* ---- MCChecks -------------------------------------------------------------------------------- */
  var SEV = { BLOCKING: { cls: 'blocking', icon: 'alert-circle', rank: 0 }, WARNING: { cls: 'warning', icon: 'alert-triangle', rank: 1 }, OK: { cls: 'ok', icon: 'check-circle', rank: 2 } };
  function countsOf(items) {
    var c = { blocking: 0, warning: 0, ok: 0 };
    (items || []).forEach(function (it) { var s = SEV[it.severity] || SEV.OK; c[s.cls]++; });
    return c;
  }
  /* "2 perlu diperbaiki · 1 perlu diperhatikan" — the count for the sticky action region */
  function summary(c) {
    var parts = [];
    if (c.blocking) parts.push(c.blocking + ' perlu diperbaiki');
    if (c.warning) parts.push(c.warning + ' perlu diperhatikan');
    return parts.length ? parts.join(' · ') : 'Semua pemeriksaan terpenuhi';
  }
  function checksHTML(items, o) {
    o = o || {};
    var list = (items || []).slice().sort(function (a, b) { return (SEV[a.severity] || SEV.OK).rank - (SEV[b.severity] || SEV.OK).rank; });
    if (o.hideOk) list = list.filter(function (it) { return it.severity !== 'OK'; });
    var c = countsOf(items);
    return '<div class="pt-checks' + (c.blocking ? ' has-blocking' : c.warning ? ' has-warning' : ' is-clear') + '" data-checks>' +
      '<p class="pt-checks__summary" data-checks-summary>' + esc(summary(c)) + '</p>' +
      (list.length ? '<ul class="pt-checks__list" role="list">' + list.map(function (it) {
        var s = SEV[it.severity] || SEV.OK;
        /* r13 phase 5b: a check fixed elsewhere (another screen: the project, Penomoran Dokumen) carries a link instead */
        var fix = it.link && it.link.href && it.severity !== 'OK' ? '<a class="pt-link pt-checkitem__fix" href="' + esc(it.link.href) + '">' + esc(it.link.label || 'Perbaiki') + '</a>'
          : it.field && it.severity !== 'OK' ? '<button type="button" class="pt-link pt-checkitem__fix" data-check-fix="' + esc(it.field) + '"' + (it.fixLabel ? '' : ' aria-label="Perbaiki: ' + esc(it.text) + '"') + '>' + esc(it.fixLabel || 'Perbaiki') + '</button>' : '';
        return '<li class="pt-checkitem pt-checkitem--' + s.cls + '" data-check="' + esc(it.id || '') + '">' + icon(s.icon, 'pt-checkitem__icon') +
          '<span class="pt-checkitem__text"><span class="mc-visually-hidden">' + (s.cls === 'blocking' ? 'Perlu diperbaiki: ' : s.cls === 'warning' ? 'Perlu diperhatikan: ' : 'Terpenuhi: ') + '</span>' + esc(it.text) + '</span>' + fix + '</li>';
      }).join('') + '</ul>' : '') + '</div>';
  }
  /* the field a check points at: [data-field="key"], [data-bind="key"], #key or a CSS selector */
  function fieldEl(key, scope) {
    scope = scope || doc;
    if (!key) return null;
    var el = null;
    try { el = scope.querySelector('[data-field="' + key + '"], [data-bind="' + key + '"]'); } catch (e) { el = null; }
    if (!el) el = doc.getElementById(key);
    if (!el) { try { el = scope.querySelector(key); } catch (e2) { el = null; } }
    return el;
  }
  /* reveal(el): open what hides it (closed <details>, a phone disclosure, a hidden pane — the pane's owner listens to
     the bubbling 'mc:reveal' and shows itself), then focus the control (a custom select's trigger) and centre it */
  function reveal(el) {
    if (!el) return false;
    el.dispatchEvent(new CustomEvent('mc:reveal', { bubbles: true, detail: { target: el } }));
    for (var p = el.parentElement; p; p = p.parentElement) { if (p.tagName === 'DETAILS' && !p.open) p.open = true; }
    if (root.MCDisclosure && root.MCDisclosure.reveal) { try { root.MCDisclosure.reveal(el); } catch (e) { /* optional */ } }
    var target = el.matches('input, select, textarea, button, [tabindex]') ? el : el.querySelector('input:not([type=hidden]), select, textarea, button, [tabindex]') || el;
    var trig = target.tagName === 'SELECT' && target.parentNode ? target.parentNode.querySelector('.mc-select__trigger') : null;
    var f = trig || target;
    if (!f.matches('input, select, textarea, button, a[href], [tabindex]')) f.setAttribute('tabindex', '-1');
    f.focus({ preventScroll: true });
    f.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    return true;
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-check-fix]');
    if (!b) return;
    e.preventDefault();
    var scope = b.closest('[data-compose]') || doc;
    reveal(fieldEl(b.getAttribute('data-check-fix'), scope));
  });
  root.MCChecks = {
    html: checksHTML, counts: countsOf, summary: summary, reveal: reveal, field: fieldEl,
    mount: function (host, o) {
      var items = [];
      var api = {
        update: function (list) { items = list || []; if (host) host.innerHTML = checksHTML(items, o); return api; },
        counts: function () { return countsOf(items); },
        items: function () { return items.slice(); },
        first: function (sev) { return items.filter(function (it) { return it.severity === (sev || 'BLOCKING'); })[0] || null; }
      };
      return api;
    }
  };

  /* ---- MCPrereq -------------------------------------------------------------------------------- */
  function prereqHTML(o) {
    o = o || {};
    var kind = o.kind || 'missing';
    var title = o.title || (kind === 'capability' ? 'Perlu kewenangan ' + (o.capability || '') : kind === 'owner' ? 'Perlu tindakan Owner' : 'Belum lengkap');
    var ic = kind === 'capability' ? 'lock' : kind === 'owner' ? 'shield-alert' : 'info';
    var link = kind !== 'capability' && kind !== 'owner' && o.link && o.link.href ? '<a class="pt-link pt-prereq__link" href="' + esc(o.link.href) + '">' + esc(o.link.label) + icon('chevron-right') + '</a>' : '';
    return '<div class="pt-prereq pt-prereq--' + esc(kind) + '" role="note"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + '>' + icon(ic, 'pt-prereq__icon') +
      '<div class="pt-prereq__body"><p class="pt-prereq__title">' + esc(title) + '</p>' + (o.text ? '<p class="pt-prereq__text">' + esc(o.text) + '</p>' : '') +
      (o.who ? '<p class="pt-prereq__who">' + esc(o.who) + '</p>' : '') + '</div>' + link + '</div>';
  }
  root.MCPrereq = { html: prereqHTML };

  /* ---- MCNext ---------------------------------------------------------------------------------- */
  /* { label, href | action, why, links: [{ label, href }], capability: { allowed, name } } */
  function nextHTML(o) {
    if (!o) return '';
    var cap = o.capability, blocked = cap && cap.allowed === false;
    var main = blocked ? prereqHTML({ kind: 'capability', capability: cap.name, title: (o.label ? o.label + ' · ' : '') + 'Perlu kewenangan ' + (cap.name || ''), text: cap.text || '' })
      : (o.label ? (o.href ? '<a class="mc-btn mc-btn--' + (o.variant || 'primary') + ' mc-btn--md pt-next__btn" href="' + esc(o.href) + '"' + (o.attrs || '') + '><span class="mc-btn__label">' + esc(o.label) + '</span>' + icon('arrow-right') + '</a>'
        : '<button type="button" class="mc-btn mc-btn--' + (o.variant || 'primary') + ' mc-btn--md pt-next__btn"' + (o.action ? ' data-action="' + esc(o.action) + '"' : '') + (o.attrs || '') + '><span class="mc-btn__label">' + esc(o.label) + '</span>' + icon('arrow-right') + '</button>') : '');
    var links = (o.links || []).filter(function (l) { return l && l.href; });
    return '<div class="pt-next">' + (o.title !== false ? '<p class="pt-next__label">' + esc(o.title || 'Langkah berikutnya') + '</p>' : '') +
      '<div class="pt-next__main">' + main + (o.why && !blocked ? '<p class="pt-next__why">' + esc(o.why) + '</p>' : '') + '</div>' +
      (links.length ? '<ul class="pt-next__links" role="list">' + links.map(function (l) { return '<li><a class="pt-link" href="' + esc(l.href) + '">' + esc(l.label) + icon('chevron-right') + '</a></li>'; }).join('') + '</ul>' : '') + '</div>';
  }
  root.MCNext = { html: nextHTML };

  /* ---- MCResult -------------------------------------------------------------------------------- */
  function issued(objek, nomor) { return objek + ' diterbitkan dengan nomor ' + nomor + '.'; }
  /* pdf: { state: 'PENDING' | 'READY' | 'FAILED', attempt, max, kind } -> the MSG-05 / MSG-08 sentence */
  function pdfText(p, o) {
    if (!p || !p.state) return '';
    var max = p.max || 5, kind = (o && o.kind) || 'Dokumen';
    if (p.state === 'READY') return 'PDF siap diunduh.';
    if (p.state === 'FAILED' && (p.attempt || 0) >= max) return 'PDF gagal dibuat setelah ' + max + ' percobaan; operator sudah diberi tahu. Nomor dan isi ' + kind.toLowerCase() + ' tidak berubah.';
    if (p.state === 'FAILED') return 'PDF gagal dibuat dan akan dicoba lagi otomatis (percobaan ' + (p.attempt || 1) + ' dari ' + max + ').';
    return 'PDF sedang dibuat. ' + kind + ' sudah terbit.';
  }
  function resultHTML(o) {
    o = o || {};
    var id = o.id || uid('pt-result');
    var title = o.title || (o.object && o.number ? issued(o.object, o.number) : '');
    var tone = o.tone || 'success';
    /* r13 harmony: the tone icon is part of the heading (a 20 px disc on the first line's centre), never a floating
       44 px column. With the number in the sentence the heading reads as two lines: the outcome ("Penawaran
       diterbitkan dengan nomor") and the official number as the headline; the sentence stays whole for assistive tech. */
    var ic = '<span class="pt-result__icon" aria-hidden="true">' + icon(tone === 'success' ? 'check' : tone === 'warning' ? 'alert-triangle' : 'info') + '</span>';
    var at = o.number ? title.indexOf(o.number) : -1, split = at > 0;
    var tHTML = split
      ? '<span class="pt-result__status">' + ic + '<span>' + esc(title.slice(0, at).replace(/\s+$/, '')) + ' </span></span>' +
        '<span class="pt-num pt-result__number">' + esc(o.number) + '<span class="pt-result__tail">' + esc(title.slice(at + o.number.length)) + '</span></span>'
      : '<span class="pt-result__status pt-result__status--plain">' + ic + '<span>' + esc(title) + '</span></span>';
    var facts = (o.facts || []).filter(Boolean);
    var pdf = o.pdf ? '<p class="pt-result__pdf pt-result__pdf--' + esc(String(o.pdf.state).toLowerCase()) + '" data-result-pdf aria-live="polite">' + icon(o.pdf.state === 'READY' ? 'check-circle' : o.pdf.state === 'FAILED' ? 'alert-triangle' : 'loader', 'pt-result__pdf-icon') + '<span>' + esc(pdfText(o.pdf, o)) + '</span></p>' : '';
    var copy = o.number && o.copy !== false ? '<button type="button" class="pt-link pt-result__copy" data-copy-text="' + esc(o.number) + '">' + icon('copy') + 'Salin nomor</button>' : '';
    return '<section class="mc-card pt-result pt-result--' + esc(tone) + (split ? ' pt-result--number' : '') + '" aria-labelledby="' + id + '-t" data-result>' +
      '<div class="pt-result__body"><div class="pt-result__head"><h2 class="pt-result__title" id="' + id + '-t" tabindex="-1">' + tHTML + '</h2>' + copy + '</div>' +
      (o.text ? '<p class="pt-result__text">' + esc(o.text) + '</p>' : '') +
      (facts.length ? '<dl class="pt-facts pt-result__facts">' + facts.map(function (f) { return '<div class="pt-fact"><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' : '') +
      pdf + (o.next ? nextHTML(o.next) : '') + '</div></section>';
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copy-text]');
    if (!b) return;
    e.preventDefault();
    var t = b.getAttribute('data-copy-text'), done = function () {
      var lab = b.lastChild; if (lab && lab.nodeType === 3) { var was = lab.nodeValue; lab.nodeValue = 'Nomor tersalin'; setTimeout(function () { lab.nodeValue = was; }, 1600); }
    };
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, done); else done(); } catch (x) { done(); }
  });
  root.MCResult = {
    html: resultHTML, issued: issued, pdfText: pdfText,
    mount: function (host, o) {
      if (!host) return null;
      host.innerHTML = resultHTML(o);
      host.hidden = false;
      var el = host.querySelector('[data-result]');
      return {
        el: el,
        setPdf: function (p) {
          var n = el && el.querySelector('[data-result-pdf]');
          if (!n) return;
          o.pdf = p;
          n.className = 'pt-result__pdf pt-result__pdf--' + String(p.state).toLowerCase();
          n.innerHTML = icon(p.state === 'READY' ? 'check-circle' : p.state === 'FAILED' ? 'alert-triangle' : 'loader', 'pt-result__pdf-icon') + '<span>' + esc(pdfText(p, o)) + '</span>';
        },
        focus: function () { var h = el && el.querySelector('.pt-result__title'); if (h) { el.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); h.focus({ preventScroll: true }); } }
      };
    }
  };
  /* =============================================================================================
     r13 Phase 6 — guided work for a first-time Admin (Layer A, config-driven; no business data here)
     MCGuide   per-viewer guidance level (localStorage, try/catch): 'terpandu' (default: context lines, "Cara kerja",
               stage hints, the tour offer) or 'ringkas' (the same functions, only canonical guidance: next step,
               warnings, errors, disabled-with-reason, outcomes). <html data-guidance> drives the CSS; never blocks work.
                 level() · setLevel(id) · openPanel(from)   (the account menu item "Panduan")
     MCHelp    "Cara kerja" disclosure (closed, 2-4 lines) from config help.screens[key]; hidden at 'ringkas'.
                 html(key)
     MCResume  "Lanjutkan" memory: the records this viewer opened last (kind, id, label, sub, href - never form data).
                 touch(rec) · list()
     MCTour    optional walkthrough on REAL controls, across pages: non-modal callout (role=dialog, labelled), highlight
               ring on the target, Esc = Lewati, Lanjut / Kembali / Selesai, "Langkah n dari m"; a step whose target is
               absent is skipped (never a dead pointer); state per viewer; never auto-forced (an offer card on the home,
               restart from "Panduan"). Config: help.tours[id] = { title, capability, steps: [{ route, href, target,
               title, body }] }.
                 offerHTML() · start(id) · skip() · state() · resume()
     ============================================================================================= */
  function store(key, val) {
    try {
      if (val === undefined) { var v = root.localStorage.getItem(key); return v ? JSON.parse(v) : null; }
      if (val === null) root.localStorage.removeItem(key); else root.localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
    return val;
  }
  function helpCfg() { return (root.MCProject && root.MCProject.config && root.MCProject.config.help) || {}; }
  function can(cap) { return !cap || !root.MCApp || !root.MCApp.can || root.MCApp.can(cap); }
  function routeNow() { var r = root.MCRoutes && root.MCRoutes.current ? root.MCRoutes.current() : null; return (r && r.id) || doc.body.getAttribute('data-route') || ''; }

  /* ---- MCGuide: guidance levels ---- */
  var LEVELS_DEF = [
    { id: 'terpandu', label: 'Terpandu', text: 'Penjelasan singkat, "Cara kerja", dan tawaran panduan di tempatnya.' },
    { id: 'ringkas', label: 'Ringkas', text: 'Hanya langkah berikutnya, peringatan, dan pesan hasil. Semua fungsi tetap sama.' }
  ];
  function levels() { return helpCfg().levels || LEVELS_DEF; }
  function level() {
    var v = store('mc.guide.level'), ids = levels().map(function (x) { return x.id; });
    return ids.indexOf(v) >= 0 ? v : (helpCfg().defaultLevel || ids[0]);
  }
  function applyLevel() { doc.documentElement.setAttribute('data-guidance', level()); }
  function setLevel(v) { store('mc.guide.level', v); applyLevel(); try { doc.dispatchEvent(new CustomEvent('mc:guidance', { detail: { level: level() } })); } catch (e) { /* old engines */ } }
  applyLevel();
  function panelHTML() {
    var t = tourFor();
    return '<div class="mc-guidepanel"><fieldset class="mc-guidepanel__set"><legend class="mc-guidepanel__legend">Tingkat panduan</legend>' +
      levels().map(function (l) {
        return '<label class="mc-guidepanel__opt"><input type="radio" name="mc-guide-level" value="' + esc(l.id) + '"' + (l.id === level() ? ' checked' : '') + ' data-guide-level>' +
          '<span><strong>' + esc(l.label) + '</strong><span class="mc-guidepanel__text">' + esc(l.text) + '</span></span></label>';
      }).join('') + '</fieldset>' +
      (t ? '<div class="mc-guidepanel__tour"><p class="mc-guidepanel__legend">Panduan langkah demi langkah</p><p class="mc-guidepanel__text">' + esc(t.title) + ' · ' + t.steps.length + ' langkah pada layar yang sebenarnya.</p>' +
        '<button type="button" class="mc-btn mc-btn--outline mc-btn--md" data-guide-tour-start="' + esc(t.id) + '">' + icon('arrow-right') + '<span class="mc-btn__label">Mulai panduan</span></button></div>' : '') + '</div>';
  }
  function openPanel(from) {
    if (!root.MCDialog) return;
    root.MCDialog.open({ kind: 'info', title: 'Panduan', html: panelHTML(), returnFocus: from || doc.activeElement });
  }
  doc.addEventListener('change', function (e) { var r = e.target.closest && e.target.closest('[data-guide-level]'); if (r && r.checked) setLevel(r.value); });

  /* ---- MCHelp ---- */
  function helpHTML(key) {
    var s = (helpCfg().screens || {})[key];
    if (!s || !s.howItWorks || !s.howItWorks.length) return '';
    return '<details class="mc-help" data-guide-hint><summary class="mc-help__sum">' + icon('info', 'mc-help__icon') + '<span>Cara kerja</span>' + icon('chevron-down', 'mc-help__chev') + '</summary>' +
      '<ul class="mc-help__list" role="list">' + s.howItWorks.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></details>';
  }

  /* ---- MCResume ---- */
  function resumeList() { var l = store('mc.guide.recent'); return Array.isArray(l) ? l : []; }
  function touch(rec) {
    if (!rec || !rec.id || !rec.href) return;
    var l = resumeList().filter(function (x) { return !(x.kind === rec.kind && x.id === rec.id); });
    l.unshift({ kind: rec.kind || '', id: rec.id, label: rec.label || '', sub: rec.sub || '', href: rec.href, co: rec.co || '' });
    store('mc.guide.recent', l.slice(0, 6));
  }

  /* ---- MCTour ---- */
  var TKEY = 'mc.guide.tour', tourEl = null, tourTarget = null, tourTimer = 0;
  function tourFor(id) {
    var all = helpCfg().tours || {}, ids = id ? [id] : Object.keys(all);
    for (var i = 0; i < ids.length; i++) {
      var t = all[ids[i]];
      if (t && t.steps && t.steps.length && can(t.capability)) return { id: ids[i], title: t.title || 'Panduan', steps: t.steps };
    }
    return null;
  }
  function tourState() { return store(TKEY) || null; }
  function offerHTML() {
    var t = tourFor(), st = tourState();
    if (!t || (st && st.status)) return '';
    return '<section class="mc-guide-offer" data-guide-hint data-guide-offer aria-labelledby="mc-guide-offer-t">' +
      '<div class="mc-guide-offer__text"><h2 class="mc-guide-offer__title" id="mc-guide-offer-t">Baru memakai MultipleCorp?</h2>' +
      '<p class="mc-guide-offer__body">Panduan singkat "' + esc(t.title) + '" menunjukkan alurnya pada layar yang sebenarnya (' + t.steps.length + ' langkah). Bisa dihentikan kapan saja.</p></div>' +
      '<div class="mc-guide-offer__actions"><button type="button" class="mc-btn mc-btn--outline mc-btn--md" data-guide-tour-start="' + esc(t.id) + '"><span class="mc-btn__label">Mulai panduan</span></button>' +
      '<button type="button" class="pt-link" data-guide-tour-dismiss>Nanti saja</button></div></section>';
  }
  function clearTour() {
    if (tourTimer) { root.clearTimeout(tourTimer); tourTimer = 0; }
    if (tourTarget) { tourTarget.classList.remove('mc-tour-target'); tourTarget = null; }
    if (tourEl) { tourEl.remove(); tourEl = null; }
  }
  function go(href) {
    if (root.MCShell && root.MCShell.navigate) root.MCShell.navigate(href); else root.location.href = href;
  }
  function finish(status) {
    var st = tourState() || {};
    st.status = status; st.at = null;
    store(TKEY, st);
    clearTour();
    var offer = doc.querySelector('[data-guide-offer]');
    if (offer) offer.remove();
  }
  function startTour(id) {
    var t = tourFor(id);
    if (!t) return;
    store(TKEY, { id: t.id, i: 0, status: null, at: 'active' });
    if (root.MCDialog && root.MCDialog.isOpen) root.MCDialog.close();
    var offer = doc.querySelector('[data-guide-offer]');
    if (offer) offer.remove();
    showStep(0);
  }
  function placeCallout() {
    if (!tourEl || !tourTarget) return;
    var phone = root.matchMedia && root.matchMedia('(max-width: 767px)').matches;
    tourEl.classList.toggle('mc-tour--sheet', !!phone);
    if (phone) { tourEl.style.left = ''; tourEl.style.top = ''; return; }
    var r = tourTarget.getBoundingClientRect(), w = Math.min(360, root.innerWidth - 32), h = tourEl.offsetHeight;
    var left = Math.min(Math.max(16, r.left), root.innerWidth - w - 16);
    var below = r.bottom + 12, above = r.top - h - 12;
    var top = below + h <= root.innerHeight - 16 ? below : (above >= 16 ? above : Math.max(16, root.innerHeight - h - 16));
    tourEl.style.width = w + 'px'; tourEl.style.left = Math.round(left) + 'px'; tourEl.style.top = Math.round(top) + 'px';
  }
  function showStep(i, tries) {
    clearTour();
    var st = tourState(), t = st && tourFor(st.id);
    if (!t || st.at !== 'active') return;
    if (i >= t.steps.length) { finish('done'); return; }
    st.i = i; store(TKEY, st);
    var s = t.steps[i];
    if (s.route && s.route !== routeNow()) { if (s.href) go(s.href); return; }   /* resumes on the step's page */
    var target = s.target ? Array.prototype.filter.call(doc.querySelectorAll(s.target), function (el) { return el.getClientRects().length > 0; })[0] || null : null;   /* the first VISIBLE match */
    if (!target || !target.getClientRects().length) {
      if ((tries || 0) < 4) { tourTimer = root.setTimeout(function () { showStep(i, (tries || 0) + 1); }, 250); return; }
      showStep(i + 1); return;                                                    /* absent target: skipped */
    }
    tourTarget = target;
    target.classList.add('mc-tour-target');
    target.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
    var last = i === t.steps.length - 1;
    tourEl = doc.createElement('div');
    tourEl.className = 'mc-tour';
    tourEl.setAttribute('role', 'dialog');
    tourEl.setAttribute('aria-modal', 'false');
    tourEl.setAttribute('aria-labelledby', 'mc-tour-t');
    tourEl.setAttribute('aria-describedby', 'mc-tour-b');
    tourEl.innerHTML = '<p class="mc-tour__count">Langkah ' + (i + 1) + ' dari ' + t.steps.length + ' · ' + esc(t.title) + '</p>' +
      '<h2 class="mc-tour__title" id="mc-tour-t" tabindex="-1">' + esc(s.title) + '</h2><p class="mc-tour__body" id="mc-tour-b">' + esc(s.body) + '</p>' +
      '<div class="mc-tour__actions"><button type="button" class="pt-link mc-tour__skip" data-tour="skip">Lewati panduan</button><span class="mc-tour__nav">' +
      (i > 0 ? '<button type="button" class="mc-btn mc-btn--ghost mc-btn--md" data-tour="back">Kembali</button>' : '') +
      '<button type="button" class="mc-btn mc-btn--primary mc-btn--md" data-tour="next">' + (last ? 'Selesai' : 'Lanjut') + '</button></span></div>';
    doc.body.appendChild(tourEl);
    placeCallout();
    root.setTimeout(placeCallout, reduced() ? 0 : 320);
    var h = tourEl.querySelector('#mc-tour-t');
    if (h) h.focus({ preventScroll: true });
  }
  doc.addEventListener('click', function (e) {
    var s = e.target.closest && e.target.closest('[data-guide-tour-start]');
    if (s) { e.preventDefault(); startTour(s.getAttribute('data-guide-tour-start')); return; }
    if (e.target.closest && e.target.closest('[data-guide-tour-dismiss]')) { e.preventDefault(); finish('dismissed'); return; }
    var b = e.target.closest && e.target.closest('.mc-tour [data-tour]');
    if (!b) return;
    var st = tourState(), act = b.getAttribute('data-tour');
    if (!st) return;
    if (act === 'skip') finish('skipped');
    else if (act === 'back') showStep(Math.max(0, st.i - 1));
    else showStep(st.i + 1);
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && tourEl && tourEl.contains(doc.activeElement)) { e.preventDefault(); finish('skipped'); } });
  root.addEventListener('resize', function () { placeCallout(); });
  function resumeTour() { var st = tourState(); if (st && st.at === 'active') { root.clearTimeout(tourTimer); tourTimer = root.setTimeout(function () { showStep(st.i || 0); }, 450); } }
  doc.addEventListener('mc:routechange', resumeTour);
  if (doc.readyState === 'complete') resumeTour(); else root.addEventListener('load', resumeTour);

  root.MCGuide = { level: level, setLevel: setLevel, levels: levels, openPanel: openPanel };
  root.MCHelp = { html: helpHTML };
  root.MCResume = { touch: touch, list: resumeList };
  root.MCTour = { offerHTML: offerHTML, start: startTour, skip: function () { finish('skipped'); }, state: tourState, resume: resumeTour, current: function () { return tourFor(); } };
})(typeof window !== 'undefined' ? window : this);
