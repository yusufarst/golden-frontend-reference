/* =============================================================================
   MULTIPLECORP Golden Reference: PERSISTENT SHELL ROUTER (r13, D-52; Layer A)

   Load deferred, FIRST of the deferred scripts on every shell page (tools/shell_sync.py inserts it):
     <script src="../assets/js/router.js" defer></script>
     <script src="../assets/js/fixtures/<project>-data.js" defer></script>
     <script src="../assets/js/patterns.js" defer></script> … modules/<m>.js … interactions.js

   Over HTTP (tools/serve.py, serve.cmd) a click on an in-app link no longer loads a whole document:
   the router fetches the target page, keeps the shell (sidebar with its open groups, account block,
   top bar search, toasts) mounted, swaps only the page (<main data-region="content"> children and the
   per-page head / body / top-bar bits), re-runs the page module in a fresh scope and updates the address,
   the title, the current navigation entry, focus and scroll. On file:// (and whenever an API is missing,
   ?router=off, or MC_PROJECT_PATCH.router === false) it stays OFF and every navigation is the full
   document load of r12 (D-04 is the file:// fallback). Docs: docs/PERSISTENT_SHELL.md.

   MCScope (always defined; tracking only while the router is active)
     phase              'shell' | 'page' | 'swap'  gen   page generation (++ per mount)
                        ('swap' = between the dispose of a page and the mount of the next: code running
                        then is the page that left, its registrations are dropped before the next mount;
                        a handler of a trusted user event on the shell, outside <main>, stays shell)
     owner()            'page' | 'shell' for the code running now (MCScope.shell(fn) forces shell,
                        MCScope.asPage(fn) forces page; a page module script is page on first load)
     shell(fn) / asPage(fn)
     begin(o)           open the page generation (interactions.js at the end of its boot; router per mount)
     dispose()          LIFO: page onDispose callbacks -> tracked window / document / MediaQueryList
                        listeners -> page Mutation / Resize / Intersection observers -> page intervals ->
                        shell hooks (MCAction / MCPalette page entries, MCPage.reset)
     onDispose(fn)      page cleanup callback          hook(fn)  shell-level dispose hook (patterns.js)
     ready(fn)          page-level DOMContentLoaded: on a direct load at DOMContentLoaded, in a router
                        mount after the module scripts and MCShell.pageInit (page code may also keep
                        document.addEventListener('DOMContentLoaded', fn): it is queued the same way)
     alive(gen)         stale-async guard for timeouts that write or navigate (false once the page is swapped
                        out and already while it is leaving)
     stats()            counts for QA (tools/router_check.py)
   MCRouter
     active             true over HTTP with the APIs and an eligible current page
     navigate(href, o)  -> Promise<'spa' | 'full' | 'cancelled' | 'noop' | 'queued'>
                        o: { replace, force, source: 'link' | 'shell' | 'palette' | 'drawer' |
                        'account' | 'module' | 'guard', trigger, remount, traverse, full }
                        (only the popstate handler navigates as a 'pop'; remount = start the page on
                        screen again; traverse = replay a Back / Forward step the guard stopped;
                        full = always a document load, e.g. the sign-out)
     cancel()           the user chose the page on screen: an in-place navigation still leaving it is
                        cancelled and the page comes back (true when one was cancelled)
     eligible(href)     the target can be swapped in place
     state()            'idle' | 'leaving' | 'committing'      rendered / position   the page on screen
   Events: 'mc:navigate' { href, source } (cancelable, the unsaved-changes guard) for every in-place
   navigation; 'mc:routechange' { href, route, prev, source } after each swap (prev = the page that was on
   screen, also for Back / Forward).
   Security: only same-origin pages of this directory are fetched (GET, nothing is mutated); parsed
   inert with DOMParser; only <main>'s attributes and children, the top-bar slot, title / description,
   the body data-* attributes and whitelisted module CSS / JS URLs (assets/css/modules, assets/js/modules)
   are adopted, after sanitize() (scripts other than JSON islands, base / meta / link / iframe / object /
   embed / SVG animation elements, on* and srcdoc attributes, and URL attributes that do not resolve to
   http(s) / mailto: / tel: are dropped, <template> contents included); navigate() loads http(s) only.
   ============================================================================= */
(function () {
  'use strict';
  var W = window, D = document;
  if (!D || !D.documentElement) return;
  if (W.MCRouter) return;                                    /* loaded twice: keep the first */

  var LOC = W.location;
  var R = W.MCRoutes;
  var ET = W.EventTarget && W.EventTarget.prototype;
  var origAdd = ET ? ET.addEventListener : null, origRemove = ET ? ET.removeEventListener : null;
  var MQP = W.MediaQueryList && W.MediaQueryList.prototype;
  var origAddListener = MQP && MQP.addListener, origRemoveListener = MQP && MQP.removeListener;
  var origSetInterval = W.setInterval, origClearInterval = W.clearInterval;
  var PAGE_MODULE = /\/assets\/js\/modules\/([a-z0-9-]+)\.js(?:[?#].*)?$/;
  var MODULE_JS = /^(?:\.\.\/)?assets\/js\/modules\/[a-z0-9-]+\.js$/;
  var MODULE_CSS = /^(?:\.\.\/)?assets\/css\/modules\/[a-z0-9-]+\.css$/;
  var MODULE_CSS_PATH = /\/assets\/css\/modules\/[a-z0-9-]+\.css$/;     /* a loaded module stylesheet (resolved URL) */
  var SHARED_MODULE = { domain: 1 };                        /* modules/domain.js is shared runtime (MCApp) */

  function fileOf(path) { try { return decodeURIComponent(String(path).split('/').pop() || ''); } catch (e) { return ''; } }
  function dirOf(path) { return String(path).replace(/[^/]*$/, ''); }
  function isPageModule(src) { var m = PAGE_MODULE.exec(src || ''); return !!m && !SHARED_MODULE[m[1]]; }
  function routeOk(r) { return !!r && r.shell !== false && r.spa !== false && r.id !== 'system.motion'; }
  function warn(m, e) { if (W.console) W.console.warn('[MCRouter] ' + m, e || ''); }

  function supported() {
    return /^https?:$/.test(LOC.protocol) && !!(W.history && typeof W.history.pushState === 'function') &&
      typeof W.fetch === 'function' && typeof W.DOMParser === 'function' && typeof W.AbortController === 'function' &&
      typeof W.Promise === 'function' && !!ET && !!(D.body && D.body.replaceChildren);
  }
  var disabled = false;
  try { disabled = new URLSearchParams(LOC.search).get('router') === 'off'; } catch (e) { disabled = false; }
  if (W.MC_PROJECT && W.MC_PROJECT.router === false) disabled = true;
  var hereRoute = R && R.byFile ? R.byFile(fileOf(LOC.pathname)) : null;
  var active = supported() && !disabled && !!D.querySelector('[data-shell]') && !!D.querySelector('main[data-region="content"]') && routeOk(hereRoute);

  /* ==== MCScope ================================================================================ */
  /* phase: 'shell' until the shell booted; 'page' while a page is mounted; 'swap' between the dispose of one
     page and the mount of the next (r13 fix pass 2, finding 1: up to the 1.5 s module-CSS wait). Code running in 'swap' is the
     page that just left (a late timer or promise continuation) unless it handles a trusted user event on the
     shell (outside <main>): the page's registrations are page-owned and are dropped when the next page opens,
     before its module scripts run, so nothing leaks into the shell; the shell's own reaction stays shell-owned. */
  var phase = 'shell', gen = 0, shellDepth = 0, pageDepth = 0, mounting = false;
  var doomed = 0;                                            /* r13 fix: the page generation that is leaving */
  var gapDropped = 0;                                        /* QA: registrations made in 'swap' and dropped */
  var dclDone = D.readyState === 'complete', loadDone = D.readyState === 'complete';
  var hooks = [], readyQ = [];
  /* the end of the document load (registered before any patching: never tracked) */
  D.addEventListener('DOMContentLoaded', function () { dclDone = true; });
  W.addEventListener('load', function () { loadDone = true; dclDone = true; });
  function bucket() { return { listeners: [], observers: [], intervals: [], disposers: [] }; }
  var page = bucket();

  function owner() {
    if (shellDepth > 0) return 'shell';
    if (pageDepth > 0 || phase === 'page') return 'page';
    if (phase === 'swap') return shellEvent() ? 'shell' : 'page';
    var cs = D.currentScript;
    return cs && isPageModule(cs.src) ? 'page' : 'shell';
  }
  /* during the swap, the one thing that is not the page that left: the user acting on the persistent shell (a
     trusted event whose target lies outside <main>, e.g. opening the account menu while the next page loads) */
  function shellEvent() {
    var ev = W.event, t = ev && ev.isTrusted ? ev.target : null;
    return !!(t && t.nodeType === 1 && t.closest && !t.closest('main[data-region="content"]'));
  }
  function capOf(o) { return typeof o === 'boolean' ? o : !!(o && o.capture); }
  function findListener(t, type, fn, cap) {
    for (var i = 0; i < page.listeners.length; i++) {
      var l = page.listeners[i];
      if (l.t === t && l.type === type && l.fn === fn && l.cap === cap) return i;
    }
    return -1;
  }
  function callReady(fn) {
    var ev = null;
    try { ev = new Event('DOMContentLoaded'); } catch (e) { ev = null; }
    if (typeof fn === 'function') fn.call(D, ev);
    else if (fn && typeof fn.handleEvent === 'function') fn.handleEvent(ev);
  }

  if (active) {
    /* window / document / MediaQueryList listeners added by PAGE code are tracked (exact capture flag)
       and removed when the page is swapped out; shell code is untouched */
    var patch = function (t) {
      t.addEventListener = function (type, fn, opts) {
        if (fn && owner() === 'page') {
          if ((t === D && (type === 'DOMContentLoaded' || type === 'readystatechange') && dclDone) || (t === W && type === 'load' && loadDone)) {
            readyQ.push(fn);                                    /* the event already happened: page-level ready */
            return undefined;
          }
          var cap = capOf(opts);
          if (findListener(t, type, fn, cap) < 0) page.listeners.push({ t: t, type: type, fn: fn, cap: cap });
        }
        return origAdd.call(this, type, fn, opts);
      };
      t.removeEventListener = function (type, fn, opts) {
        var i = findListener(t, type, fn, capOf(opts));
        if (i >= 0) page.listeners.splice(i, 1);
        return origRemove.call(this, type, fn, opts);
      };
    };
    patch(W);
    patch(D);
    if (MQP) {
      MQP.addEventListener = function (type, fn, opts) {
        if (fn && owner() === 'page') { var cap = capOf(opts); if (findListener(this, type, fn, cap) < 0) page.listeners.push({ t: this, type: type, fn: fn, cap: cap }); }
        return origAdd.call(this, type, fn, opts);
      };
      MQP.removeEventListener = function (type, fn, opts) {
        var i = findListener(this, type, fn, capOf(opts));
        if (i >= 0) page.listeners.splice(i, 1);
        return origRemove.call(this, type, fn, opts);
      };
      if (origAddListener) {
        MQP.addListener = function (fn) {
          if (fn && owner() === 'page' && findListener(this, 'change', fn, false) < 0) page.listeners.push({ t: this, type: 'change', fn: fn, cap: false, legacy: true });
          return origAddListener.call(this, fn);
        };
        MQP.removeListener = function (fn) {
          var i = findListener(this, 'change', fn, false);
          if (i >= 0) page.listeners.splice(i, 1);
          return origRemoveListener.call(this, fn);
        };
      }
    }
    /* observers and intervals created by page code */
    ['MutationObserver', 'ResizeObserver', 'IntersectionObserver'].forEach(function (name) {
      var Orig = W[name];
      if (typeof Orig !== 'function') return;
      var Tracked = function (cb, o) {
        var obs = o === undefined ? new Orig(cb) : new Orig(cb, o);
        if (owner() === 'page') page.observers.push(obs);
        return obs;
      };
      Tracked.prototype = Orig.prototype;
      Tracked.mcOriginal = Orig;
      W[name] = Tracked;
    });
    W.setInterval = function () {
      var id = origSetInterval.apply(W, arguments);
      if (owner() === 'page') page.intervals.push(id);
      return id;
    };
    W.clearInterval = function (id) {
      var i = page.intervals.indexOf(id);
      if (i >= 0) page.intervals.splice(i, 1);
      return origClearInterval.call(W, id);
    };
  }

  function drop(b) {
    for (var i = b.disposers.length - 1; i >= 0; i--) { try { b.disposers[i](); } catch (e) { warn('onDispose failed', e); } }
    b.listeners.forEach(function (l) {
      try { if (l.legacy) origRemoveListener.call(l.t, l.fn); else origRemove.call(l.t, l.type, l.fn, l.cap); } catch (e) { /* gone */ }
    });
    b.observers.forEach(function (o) { try { o.disconnect(); } catch (e) { /* gone */ } });
    b.intervals.forEach(function (id) { origClearInterval.call(W, id); });
    hooks.forEach(function (h) { try { h(); } catch (e) { warn('dispose hook failed', e); } });
    return { listeners: b.listeners.length, observers: b.observers.length, intervals: b.intervals.length, disposers: b.disposers.length };
  }
  function dispose() {
    var b = page;
    page = bucket();
    phase = 'swap';                                           /* between pages: still page-owned (fix pass 2) */
    readyQ = [];
    return drop(b);
  }
  /* the next page opens (router, right before its module scripts): what the page that left registered while
     the swap ran (late timers, continuations) goes now; then the fresh page generation begins */
  function openPage() {
    var b = page;
    page = bucket();
    readyQ = [];
    var n = drop(b);
    gapDropped += n.listeners + n.observers + n.intervals + n.disposers;
    gen++;
    phase = 'page';
    return n;
  }
  function flushReady() {
    var q = readyQ;
    readyQ = [];
    q.forEach(callReady);                                     /* a throw reaches the router (full-load fallback) */
  }

  W.MCScope = {
    get active() { return active; },
    get phase() { return phase; },
    get gen() { return gen; },
    owner: owner,
    shell: function (fn) { shellDepth++; try { return fn(); } finally { shellDepth--; } },
    asPage: function (fn) { pageDepth++; try { return fn(); } finally { pageDepth--; } },
    begin: function (o) { phase = 'page'; if (o && o.first) { if (!gen) gen = 1; } else gen++; return gen; },
    dispose: dispose,
    onDispose: function (fn) { if (typeof fn === 'function') page.disposers.push(fn); },
    hook: function (fn) { if (typeof fn === 'function') hooks.push(fn); },
    ready: function (fn) {
      if (typeof fn !== 'function') return;
      if (mounting) { readyQ.push(fn); return; }
      if (!dclDone) { D.addEventListener('DOMContentLoaded', function () { fn(); }); return; }
      fn();
    },
    /* r13 fix: false too once the page is LEAVING (the user chose another destination): a stale continuation
       never navigates over the user's own navigation */
    alive: function (g) { return g === gen && phase === 'page' && doomed !== g; },
    isPageModule: isPageModule,
    stats: function () {
      return { phase: phase, gen: gen, listeners: page.listeners.length, observers: page.observers.length, intervals: page.intervals.length,
        disposers: page.disposers.length, hooks: hooks.length, gapDropped: gapDropped,
        actions: W.MCAction && W.MCAction.names ? W.MCAction.names().length : null,
        providers: W.MCPalette && W.MCPalette.count ? W.MCPalette.count() : null };
    }
  };

  /* ==== MCRouter ================================================================================ */
  var seq = 0, state = 'idle', inflight = null, pending = null, keySeq = 0;
  var rendered = LOC.pathname + LOC.search;                  /* path + search of the page on screen */
  var mountError = null;
  var announcer = null;
  /* r13 fix (Back / Forward on a dirty page): every entry of this document carries its position
     (history.state.mcIdx), so a step the unsaved-changes guard stops is undone with history.go(-delta)
     and, after "Tinggalkan", replayed with history.go(delta): the browser's own entries, scroll and
     Forward stack stay exactly as they were (no re-pushed or duplicated entry). */
  var curIdx = 0;                                            /* position of the entry on screen */
  var passPop = false;                                       /* the next page-changing popstate replays an allowed step */
  var popDone = null;                                        /* resolves the navigate() that replays it */
  var restoring = null;                                      /* { then, timer } while a stopped step is undone */
  var POP = {};                                              /* private: only the popstate handler navigates "as a pop" */

  function newKey() { return 'k' + Date.now().toString(36) + (++keySeq); }
  function idxOf(s) { return s && typeof s === 'object' && typeof s.mcIdx === 'number' ? s.mcIdx : null; }
  function withIdx(s, n) {
    if (s === null || s === undefined) return { mcIdx: n };
    if (typeof s !== 'object' || Array.isArray(s)) return s;   /* not ours to annotate */
    var o = {};
    Object.keys(s).forEach(function (k) { o[k] = s[k]; });
    o.mcIdx = n;
    return o;
  }
  function copy(o, extra) {
    var r = {};
    Object.keys(o || {}).forEach(function (k) { r[k] = o[k]; });
    Object.keys(extra || {}).forEach(function (k) { r[k] = extra[k]; });
    return r;
  }
  function stateWith(extra) {
    var s = W.history.state, o = {};
    if (s && typeof s === 'object') Object.keys(s).forEach(function (k) { o[k] = s[k]; });
    Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }
  function toUrl(href) { try { return new URL(href, LOC.href); } catch (e) { return null; } }
  function pathSearch(u) { return u.pathname + u.search; }
  function eligibleUrl(u) {
    if (!u || u.origin !== LOC.origin || !/^https?:$/.test(u.protocol)) return false;
    if (dirOf(u.pathname) !== dirOf(LOC.pathname)) return false;
    var r = R && R.byFile ? R.byFile(fileOf(u.pathname)) : null;
    if (!routeOk(r)) return false;
    var q = u.searchParams;
    if (q.has('project') || q.has('brand') || q.has('role') || q.get('router') === 'off') return false;   /* auth / preview boundaries */
    return true;
  }
  function full(href, replace) {
    try { if (replace) LOC.replace(href); else LOC.assign(href); } catch (e) { LOC.href = href; }
    return 'full';
  }
  /* r13 fix pass 2, finding 4: a full document load (an auth / preview boundary such as ?role=, a page outside the shell)
     wins over an in-place navigation still in flight: that one is aborted, so it can neither swap a page in
     behind the new document nor fall back to a full load of its own target. During the swap (commit, the
     point of no return) the full load waits its turn like any newer navigation (latest wins). */
  function supersede() {
    if (state !== 'leaving' && !inflight) return false;
    seq++;                                                    /* the in-flight navigation resolves 'cancelled' */
    if (inflight) { try { inflight.abort(); } catch (e) { /* done */ } }
    inflight = null;
    state = 'idle';
    pending = null;
    return true;
  }
  /* r13 fix round 2 (finding 4, rest): EVERY document load wins over an in-place navigation still in flight, not only
     the ones the router starts itself: a link inside [data-router="off"] (click handler), the sign-out and any
     other code assigning location, a form, the address bar, reload, a Back step to another document (the
     Navigation API's 'navigate' event and 'beforeunload', below). yieldToLoad() supersedes the in-flight one; the
     leaving page keeps its exit (the document is replaced shortly). If the document is STILL here RECOVER_MS
     later, the load did not replace it (it became a download or a 204 answer, or the browser's leave prompt was
     answered "stay"): the page comes back as it was (recover). pagehide = the document did go. */
  var RECOVER_MS = 4000, recoverT = 0;
  function restorePage() {
    if (W.MCShell && W.MCShell.resetLeave) W.MCShell.resetLeave();   /* exit classes, aria-busy, the moving pill */
    var main = D.querySelector('main[data-region="content"]');
    if (main) { main.classList.remove('is-leaving'); main.classList.remove('is-swapping'); main.removeAttribute('aria-busy'); }
  }
  function recover() {
    recoverT = 0;
    if (state !== 'idle') return;                             /* a newer in-place navigation runs: it owns the page */
    doomed = 0;                                               /* MCScope.alive(gen) is true again */
    restorePage();
  }
  function yieldToLoad() {
    if (!supersede()) return false;
    clearTimeout(recoverT);
    recoverT = setTimeout(recover, RECOVER_MS);
    return true;
  }
  /* r13 fix round 2 (finding "current entry"): choosing the page on screen (its current sidebar entry, a link marked
     aria-current, navigate() to its own address) while a navigation elsewhere is still LEAVING it means "stay
     here": that navigation is cancelled and the page comes back (latest wins, as for any other entry). Not while
     a Back / Forward step is in flight (the address already shows its target: the step completes) and not
     during the swap (the address is the next page's already: a link to the old page is a normal navigation). */
  function cancel() {
    if (state !== 'leaving' || LOC.pathname + LOC.search !== rendered) return false;
    supersede();
    clearTimeout(recoverT);
    recoverT = 0;
    doomed = 0;
    restorePage();
    return true;
  }
  function leaveFully(url, o) {
    if (state === 'committing') { pending = { href: url.href, o: copy(o, { full: true }) }; return 'queued'; }
    yieldToLoad();
    return full(url.href, o.replace);
  }

  /* close transient overlays before the swap; history-aware ones (sheet, drawer) are awaited */
  function closeOverlays() {
    var waits = [];
    function safe(fn) { try { fn(); } catch (e) { /* not on this page */ } }
    safe(function () { if (W.MCMenu && W.MCMenu.isOpen) W.MCMenu.close(); });
    safe(function () { if (W.MCSelect) W.MCSelect.close(); });
    safe(function () { if (W.MCSplit) W.MCSplit.close(); });
    safe(function () { if (W.MCDateRange && W.MCDateRange.isOpen) W.MCDateRange.close(); });
    safe(function () { if (W.MCAccount && W.MCAccount.isOpen) W.MCAccount.close(); });
    safe(function () { var m = W.mcMotion; if (m && m.close) m.close('palette'); });   /* closed: resolves at once */
    if (W.MCSheet && W.MCSheet.isOpen) {
      waits.push(new Promise(function (res) {
        var st = W.history.state, done = false;
        function fin() { if (done) return; done = true; origRemove.call(W, 'popstate', fin); res(); }
        if (st && st.ptSheet) { origAdd.call(W, 'popstate', fin); setTimeout(fin, 350); } else setTimeout(fin, 0);
        try { W.MCSheet.close(); } catch (e) { fin(); }
      }));
    }
    if (W.MCNav && W.MCNav.isOpen) {
      waits.push(new Promise(function (res) {
        var t = setTimeout(res, 400);
        try { W.MCNav.close({ returnFocus: false, then: function () { clearTimeout(t); res(); } }); } catch (e) { res(); }
      }));
    }
    return Promise.all(waits);
  }

  /* r13 fix pass 2, finding 5 (defense in depth): what a fetched page may bring into this document.
     - dropped elements: <script> (HTML or SVG) other than JSON data islands (type="application/json"), and
       everything that runs code, loads a document or redirects this one: base, meta, link, iframe, frame,
       frameset, object, embed, applet, portal, and the SVG animation elements (set, animate, animateMotion,
       animateTransform, discard) that can rewrite an href;
     - dropped attributes: every on* handler and srcdoc; a URL attribute (href / xlink:href, src, action,
       formaction, data, poster, background, cite, ping, codebase, longdesc, lowsrc, dynsrc, manifest,
       archive, classid, icon, profile) stays only when the URL parser resolves it to http(s), mailto: or tel:
       — entities are already decoded by the parser and the URL parser strips whitespace / control characters
       and lowercases the scheme, so no spelling of javascript: / data: / vbscript: / blob: survives;
     - the root itself (<main>, the top-bar slot: their attributes are copied) and <template> contents (page
       code clones them later, e.g. menu items) are sanitized too. */
  var DROP_EL = { base: 1, meta: 1, link: 1, iframe: 1, frame: 1, frameset: 1, object: 1, embed: 1, applet: 1, portal: 1,
    set: 1, animate: 1, animatemotion: 1, animatetransform: 1, discard: 1 };
  var URL_ATTR = { href: 1, src: 1, action: 1, formaction: 1, data: 1, poster: 1, background: 1, cite: 1, ping: 1, codebase: 1,
    longdesc: 1, lowsrc: 1, dynsrc: 1, manifest: 1, archive: 1, classid: 1, icon: 1, profile: 1 };
  function safeUrl(v, base) {
    var u;
    try { u = new URL(v, base); } catch (e) { return false; }
    return /^(https?|mailto|tel):$/.test(u.protocol);
  }
  function sanitize(root, base) {
    var all = [root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
    all.forEach(function (el) {
      if (el.nodeType !== 1) return;                          /* a template's content fragment */
      var n = String(el.localName || '').toLowerCase();
      if (n === 'script' ? (el.getAttribute('type') || '').trim().toLowerCase() !== 'application/json' : DROP_EL[n] === 1) { el.remove(); return; }
      Array.prototype.slice.call(el.attributes).forEach(function (a) {
        var an = String(a.localName || a.name).toLowerCase();
        if (an.indexOf('on') === 0 || an === 'srcdoc' || (URL_ATTR[an] === 1 && !safeUrl(a.value, base))) el.removeAttributeNode(a);
      });
      if (n === 'template' && el.content) sanitize(el.content, base);
    });
  }
  /* what the fetched page needs: its module CSS / JS (whitelisted) and the shared runtime (already here) */
  function plan(doc, url) {
    var main = doc.querySelector('main[data-region="content"]'), title = doc.querySelector('title[data-page]');
    if (!main || !title || !doc.body || !doc.querySelector('[data-shell]') || !doc.body.getAttribute('data-page')) return null;
    var css = [], js = [], ok = true, have = {};
    Array.prototype.forEach.call(D.scripts, function (s) { if (s.src) have[s.src] = 1; });
    Array.prototype.forEach.call(doc.querySelectorAll('head link[rel="stylesheet"][href]'), function (l) {
      var h = l.getAttribute('href');
      if (MODULE_CSS.test(h)) css.push(new URL(h, url).href);
    });
    Array.prototype.forEach.call(doc.querySelectorAll('script[src]'), function (s) {
      var h = s.getAttribute('src'), abs = new URL(h, url).href;
      if (MODULE_JS.test(h) && isPageModule(abs)) js.push(abs);
      else if (!have[abs]) ok = false;                         /* a runtime this document does not have: full load */
    });
    return ok ? { main: main, title: title, css: css, js: js } : null;
  }
  function loadCss(hrefs) {
    var anchor = D.head.querySelector('link[rel="stylesheet"][href$="motion.css"]');
    var current = Array.prototype.filter.call(D.head.querySelectorAll('link[rel="stylesheet"][href]'), function (l) {
      try { return MODULE_CSS_PATH.test(new URL(l.href).pathname); } catch (e) { return false; }
    });
    var keep = [], waits = [];
    hrefs.forEach(function (h) {
      var found = current.filter(function (l) { return l.href === h; })[0];
      if (found) { keep.push(found); return; }
      var l = D.createElement('link');
      l.rel = 'stylesheet';
      l.href = h;
      waits.push(new Promise(function (res) { var t = setTimeout(res, 1500); l.onload = l.onerror = function () { clearTimeout(t); res(); }; }));
      D.head.insertBefore(l, anchor || null);
      keep.push(l);
    });
    return Promise.all(waits).then(function () {
      return function removeOld() { current.forEach(function (l) { if (keep.indexOf(l) < 0) l.remove(); }); };
    });
  }
  function loadScripts(list) {
    Array.prototype.forEach.call(D.querySelectorAll('script[src]'), function (s) { if (isPageModule(s.src)) s.remove(); });
    return list.reduce(function (p, src) {
      return p.then(function () {
        return new Promise(function (res, rej) {
          var s = D.createElement('script');
          s.src = src;
          s.async = false;
          s.onload = function () { res(); };
          s.onerror = function () { rej(new Error('module script failed: ' + src)); };
          D.body.appendChild(s);
        }).then(function () { if (mountError) throw mountError; });
      });
    }, Promise.resolve());
  }
  function syncBody(doc) {
    var b = D.body, nb = doc.body;
    Array.prototype.slice.call(b.attributes).forEach(function (a) { if (a.name.indexOf('data-') === 0 && !nb.hasAttribute(a.name)) b.removeAttribute(a.name); });
    Array.prototype.forEach.call(nb.attributes, function (a) { if (a.name.indexOf('data-') === 0) b.setAttribute(a.name, a.value); });
  }
  function syncMain(main, nm) {
    Array.prototype.slice.call(main.attributes).forEach(function (a) { if (!nm.hasAttribute(a.name)) main.removeAttribute(a.name); });
    Array.prototype.forEach.call(nm.attributes, function (a) { main.setAttribute(a.name, a.value); });
    /* hidden until the page has rendered, AT ONCE: the not yet rendered page never shows, not even
       half-faded (reduced motion has no exit fade, and a superseded exit may still be running) */
    var tr = main.style.transition;
    main.style.transition = 'none';
    main.classList.add('is-leaving');
    main.setAttribute('aria-busy', 'true');
    void main.offsetWidth;
    main.style.transition = tr;
    var nodes = Array.prototype.map.call(nm.childNodes, function (n) { return D.importNode(n, true); });
    main.replaceChildren.apply(main, nodes);
  }
  function syncTopbar(doc) {
    var bar = D.querySelector('.shell-topbar');
    var cur = bar ? bar.querySelector('.shell-topbar__actions') : null, next = doc.querySelector('.shell-topbar .shell-topbar__actions');
    if (cur) cur.remove();
    if (!bar || !next) return;
    var node = D.importNode(next, true), search = bar.querySelector('[data-shell-search]');
    if (search && search.parentNode === bar) search.insertAdjacentElement('afterend', node); else bar.appendChild(node);
  }
  function syncHead(doc, title) {
    var t = D.querySelector('title[data-page]'), page = title.getAttribute('data-page');
    if (t) t.setAttribute('data-page', page);
    D.title = W.MCBrand && W.MCBrand.title ? W.MCBrand.title(page) : page;
    var md = D.querySelector('meta[name="description"]'), nd = doc.querySelector('meta[name="description"]');
    if (md && nd) md.setAttribute('content', nd.getAttribute('content') || '');
  }
  function announce(text) {
    if (!announcer) {
      announcer = D.createElement('p');
      announcer.className = 'mc-sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('data-route-announcer', '');
      D.body.appendChild(announcer);
    }
    announcer.textContent = '';
    setTimeout(function () { announcer.textContent = text; }, 60);
  }
  function isHeading(el) { return !!el && (/^H[1-6]$/.test(el.tagName) || el.getAttribute('role') === 'heading'); }
  function focusPage(main) {
    var t = main.querySelector('[data-page-title]') || main.querySelector('h1') || main;
    if (!t.hasAttribute('tabindex')) {
      t.setAttribute('tabindex', '-1');
      t.setAttribute('data-router-focus', '');
      t.addEventListener('blur', function off() { t.removeEventListener('blur', off); if (t.hasAttribute('data-router-focus')) { t.removeAttribute('tabindex'); t.removeAttribute('data-router-focus'); } });
    }
    try { t.focus({ preventScroll: true }); } catch (e) { t.focus(); }
    return t;
  }
  function focusable(el) {
    return !!el && !el.disabled && !el.closest('[hidden], [inert]') && el.getClientRects().length > 0;
  }
  /* before = the focused element right before the module scripts ran (main's old children are gone by then) */
  function placeFocus(main, before, url) {
    var a = D.activeElement;
    if (a && a !== before && a !== D.body && a !== main && a !== D.documentElement) return a;   /* the page placed it */
    if (!url.hash) {                                         /* a load with a #target skips autofocus, too */
      var af = Array.prototype.filter.call(main.querySelectorAll('[autofocus]'), focusable)[0];
      if (af) {
        try { af.focus({ preventScroll: true }); } catch (e) { af.focus(); }
        if (D.activeElement === af) return af;
      }
    }
    return focusPage(main);
  }
  /* the Golden entrance replays on the real content: no opacity transition on the region itself,
     every entrance animation restarts now (it began while the region was hidden) */
  function reveal(main) {
    var tr = main.style.transition;
    main.style.transition = 'none';
    if (W.MCShell && W.MCShell.resetLeave) W.MCShell.resetLeave();
    main.classList.remove('is-leaving');
    main.removeAttribute('aria-busy');
    void main.offsetWidth;
    main.style.transition = tr;
    if (main.getAnimations && W.CSSAnimation) main.getAnimations({ subtree: true }).forEach(function (a) { if (a instanceof W.CSSAnimation) { try { a.currentTime = 0; } catch (e) { /* ignore */ } } });
  }
  function restoreScroll(y) {
    W.scrollTo(0, y || 0);
    if (!y) return;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      var max = Math.max(0, D.documentElement.scrollHeight - W.innerHeight);
      W.scrollTo(0, Math.min(y, max));
    }); });
  }

  /* a Back / Forward step the unsaved-changes guard stopped (and undid), allowed now ("Tinggalkan"):
     the browser makes the same step again and the popstate handler swaps the page as a normal pop */
  function replay(url, o) {
    return new Promise(function (res) {
      var t = 0;
      function instead() { passPop = false; popDone = null; res(navigate(url.href, { source: 'guard', force: true, replace: true })); }
      passPop = true;
      popDone = function (p) { clearTimeout(t); res(p); };
      t = setTimeout(function () { if (passPop) instead(); }, 800);     /* the browser did not move: replace in place */
      try { W.history.go(o.traverse); } catch (e) { clearTimeout(t); instead(); }
    });
  }

  function navigate(href, o) {
    o = o || {};
    var fromPop = o.source === 'pop' && o.pop === POP;
    /* r13 fix: only the popstate handler navigates "as a pop" (a pop writes no history entry); any other caller
       passing source 'pop' (e.g. a guard confirming a Back step) is a replacing guard navigation */
    if (o.source === 'pop' && !fromPop) o = copy(o, { source: 'guard', replace: true });
    var url = toUrl(href);
    /* r13 fix pass 2, finding 5: only http(s) is ever loaded (on file://, file: as well). javascript:, data:, vbscript:, blob:,
       about:, ftp: … in any spelling (the URL parser lowercases the scheme and strips whitespace / control
       characters, so " JaVa\tScript:" is javascript:) are cancelled, never assigned to location */
    if (!url || !(/^https?:$/.test(url.protocol) || (!active && url.protocol === 'file:'))) return Promise.resolve('cancelled');
    if (!active) return Promise.resolve(full(url.href, o.replace));
    if (o.full && !fromPop) return Promise.resolve(leaveFully(url, o));   /* r13 fix round 2: a document load by request (sign-out) */
    if (o.traverse && o.force && !fromPop) return replay(url, o);
    if (!fromPop && pathSearch(url) === rendered) {
      /* the page on screen: a no-op (the current sidebar entry) unless asked to start it again ("Buat pembelian
         lain", a same-address link inside the page, or a confirmed "Tinggalkan" towards it): then it is mounted
         afresh in place of its own entry, as a full load of the same address would do on file:// */
      if (!o.remount && !o.force) {
        cancel();                                              /* r13 fix round 2: "stay here" wins over a navigation still leaving */
        if (url.hash && url.hash !== LOC.hash) LOC.hash = url.hash;
        return Promise.resolve('noop');
      }
      o = copy(o, { replace: true, remount: true });
    }
    if (!eligibleUrl(url)) return Promise.resolve(leaveFully(url, copy(o, { replace: o.replace || fromPop })));
    if (state === 'committing') { pending = { href: url.href, o: o }; return Promise.resolve('queued'); }
    if (!o.force && !fromPop) {
      var ev;
      try { ev = new CustomEvent('mc:navigate', { detail: { href: url.href, source: o.source || 'link', remount: !!o.remount }, bubbles: true, cancelable: true }); } catch (e) { ev = null; }
      if (ev && !D.dispatchEvent(ev)) return Promise.resolve('cancelled');
      if (W.MCDialog && W.MCDialog.isOpen) return Promise.resolve('cancelled');   /* a pending decision */
    }
    var token = ++seq;
    if (inflight) { try { inflight.abort(); } catch (e) { /* done */ } }
    clearTimeout(recoverT);                                    /* this navigation owns the page now */
    recoverT = 0;
    var ctrl = new AbortController();
    inflight = ctrl;
    var wasLeaving = state === 'leaving';
    state = 'leaving';
    doomed = gen;                                              /* MCScope.alive(gen) is false from now on */
    /* r13 fix pass 2, finding 2: "where I came from" is the page ON SCREEN (rendered), not the address: on Back / Forward the
       browser has already moved the address to the target when popstate runs */
    var prevHref = LOC.origin + rendered;
    var main = D.querySelector('main[data-region="content"]');
    var timer = 0;
    var fetched = W.fetch(url.href, { signal: ctrl.signal, credentials: 'same-origin', cache: 'no-cache', headers: { 'X-MC-Router': '1' } })
      .then(function (res) {
        if (!res.ok || res.redirected) throw new Error('HTTP ' + res.status);
        return res.text();
      });
    var timeout = new Promise(function (res, rej) { timer = setTimeout(function () { rej(new Error('timeout')); try { ctrl.abort(); } catch (e) { /* done */ } }, 8000); });
    fetched.catch(function () { /* consumed by the race below; a superseded navigation drops it */ });
    timeout.catch(function () { /* idem */ });
    return closeOverlays().then(function () {
      if (token !== seq) { clearTimeout(timer); return 'cancelled'; }
      if (!fromPop) { try { W.history.replaceState(stateWith({ mc: 1, scrollY: W.scrollY }), ''); } catch (e) { /* ignore */ } }
      var wait = 0;
      if (W.MCShell && W.MCShell.leave) wait = W.MCShell.leave(url.href, o.trigger && o.trigger.closest ? o.trigger : null, wasLeaving, { inPlace: true });
      return Promise.all([Promise.race([fetched, timeout]), new Promise(function (res) { setTimeout(res, wait); })]).then(function (r) {
        clearTimeout(timer);
        if (token !== seq) return 'cancelled';
        var doc = new DOMParser().parseFromString(r[0], 'text/html');
        var p = plan(doc, url);
        if (!p) throw new Error('not a swappable page');
        sanitize(p.main, url.href);
        var top = doc.querySelector('.shell-topbar .shell-topbar__actions');
        if (top) sanitize(top, url.href);
        return commit(url, doc, p, o, prevHref, main, token);
      });
    }).catch(function (e) {
      clearTimeout(timer);
      if (token !== seq) return 'cancelled';
      if (state === 'committing') return failAfterCommit(url, e);
      state = 'idle';
      inflight = null;
      doomed = 0;                                              /* the page stays (or comes back from the back/forward cache) */
      if (e && e.name === 'AbortError') return 'cancelled';
      warn('full load fallback (' + (e && e.message) + ')');
      return full(url.href, o.replace || fromPop);
    });
  }

  function failAfterCommit(url, e) {
    warn('page mount failed, reloading ' + url.href, e);
    try { sessionStorage.setItem('mc:router-fallback', url.href); } catch (x) { /* storage blocked */ }
    state = 'idle';
    mounting = false;
    try { LOC.reload(); } catch (x) { LOC.href = url.href; }
    return 'full';
  }

  function commit(url, doc, p, o, prevHref, main, token) {
    state = 'committing';
    inflight = null;
    var source = o.source || 'link';
    var focusBefore = null;
    /* 8. dispose the page on screen (point of no return) */
    try { if (W.MCShell && W.MCShell.pageDispose) W.MCShell.pageDispose(main); } catch (e) { warn('pageDispose failed', e); }
    dispose();
    D.documentElement.removeAttribute('data-container');
    D.documentElement.removeAttribute('data-fixture-period');
    /* 9. history before mounting, so location / MCRoutes.current() / R.param() describe the target */
    if (source === 'pop') { /* the entry exists already */ }
    else if (o.replace) W.history.replaceState({ mc: 1, key: newKey(), scrollY: 0 }, '', url.href);
    else W.history.pushState({ mc: 1, key: newKey(), scrollY: 0 }, '', url.href);
    rendered = LOC.pathname + LOC.search;
    /* 10-11. head, module CSS (awaited before the old one goes), body / main / top bar */
    syncHead(doc, p.title);
    return loadCss(p.css).then(function (removeOld) {
      syncBody(doc);
      syncMain(main, p.main);
      syncTopbar(doc);
      removeOld();
      if (W.MCPage && W.MCPage.applyContainer) W.MCPage.applyContainer();
      if (source !== 'pop') { if (url.hash) { /* scrolled after mount */ } else W.scrollTo(0, 0); }
      /* 13. a fresh page scope (late registrations of the page that left are dropped first); module scripts run
         in document order */
      openPage();
      focusBefore = D.activeElement;
      mounting = true;
      mountError = null;
      return loadScripts(p.js);
    }).then(function () {
      /* 14. per-page shell work, then the emulated DOMContentLoaded */
      if (W.MCShell && W.MCShell.pageInit) W.MCShell.pageInit(main);
      if (W.MCBrand && W.MCBrand.apply) W.MCBrand.apply(D);
      flushReady();
      if (W.MCShell && W.MCShell.pageReady) W.MCShell.pageReady(main);
      mounting = false;
      if (mountError) throw mountError;
      /* 15-16. reveal, focus, scroll, announce */
      reveal(main);
      var st = W.history.state;
      if (source === 'pop') restoreScroll(st && st.scrollY);
      else if (url.hash) { var t = D.getElementById(decodeURIComponent(url.hash.slice(1))); if (t) t.scrollIntoView(); }
      /* r13 fix pass 2, finding 3 (parity with a direct load): focus the page placed itself while mounting (a field it focuses
         on start, a dialog it opens) stays; else the first [autofocus] control of the page takes it, as the
         browser does on a load; else the page title. DISC §5.3 step 16: a focused heading is read out by the
         screen reader itself; the polite announcer speaks only when focus did not land on a heading */
      if (!isHeading(placeFocus(main, focusBefore, url))) announce(D.title);
      /* a page started again keeps the previous page as "where I came from" ([data-back], mc:prev) */
      if (prevHref !== LOC.href.split('#')[0]) { try { sessionStorage.setItem('mc:prev', prevHref); } catch (e) { /* storage blocked */ } }
      var route = R && R.current ? R.current() : null;
      try { D.dispatchEvent(new CustomEvent('mc:routechange', { detail: { href: LOC.href, route: route ? route.id : null, prev: prevHref, source: source } })); } catch (e) { /* old engines */ }
      W.__mcRouterNavs = (W.__mcRouterNavs || 0) + 1;
      state = 'idle';
      var next = pending;
      pending = null;
      if (next) navigate(next.href, next.o);
      return 'spa';
    }).catch(function (e) {
      mounting = false;
      return failAfterCommit(url, e);
    });
  }

  function eligible(href) { return active && eligibleUrl(toUrl(href)); }

  /* r13 fix: the guard stopped a Back / Forward step (dirty page, or a decision dialog is open): undo the
     step exactly (history.go(-delta); the address, entry and Forward stack return), then ask */
  function stay(target, delta, ask) {
    var back = rendered, d = delta;
    function then() { if (ask) askPop(target, d); }
    if (d) {
      restoring = {
        then: then,
        timer: setTimeout(function () {                        /* the undo never arrived: put the page's address back by hand */
          if (!restoring) return;
          restoring = null;
          if (LOC.pathname + LOC.search !== back) { d = 0; try { W.history.pushState({ mc: 1, key: newKey(), scrollY: W.scrollY }, '', back); } catch (x) { /* ignore */ } }
          then();
        }, 600)
      };
      try { W.history.go(-d); } catch (x) { clearTimeout(restoring.timer); restoring = null; d = 0; }
      if (d) return;
    }
    /* position unknown: a fresh entry for the page on screen (its own scroll, never the popped entry's state) */
    try { W.history.pushState({ mc: 1, key: newKey(), scrollY: W.scrollY }, '', back); } catch (x) { /* ignore */ }
    rendered = back;
    then();
  }
  /* the unsaved-changes question for a Back / Forward step; "Tinggalkan" replays the step (traverse) or,
     when the position was unknown, replaces the re-pushed entry with the target */
  function askPop(target, delta) {
    var ev = null;
    try { ev = new CustomEvent('mc:navigate', { detail: { href: target, source: 'pop', traverse: delta || 0, replace: !delta }, bubbles: true, cancelable: true }); } catch (e) { ev = null; }
    if (ev && !D.dispatchEvent(ev)) return;                  /* MCPage.dirtyGuard asks (patterns.js askLeave) */
    navigate(target, { source: 'guard', force: true, replace: !delta, traverse: delta || 0 });
  }

  if (active) {
    try { W.history.scrollRestoration = 'manual'; } catch (e) { /* old engines */ }
    curIdx = idxOf(W.history.state);
    if (curIdx === null) curIdx = 0;
    try { W.history.replaceState(stateWith({ mc: 1, key: (W.history.state && W.history.state.key) || newKey(), scrollY: W.scrollY, mcIdx: curIdx }), ''); } catch (e) { /* ignore */ }
    try {
      var fb = sessionStorage.getItem('mc:router-fallback');
      if (fb) { W.__mcRouterFallback = fb; sessionStorage.removeItem('mc:router-fallback'); }
    } catch (e) { /* storage blocked */ }
    /* every history write keeps "the page on screen" current (page code rewriting its own address: filters,
       ?tab=, ?sel=) and the entry's position (pushState = the next position, replaceState = the same one) */
    ['pushState', 'replaceState'].forEach(function (m) {
      var orig = W.history[m];
      W.history[m] = function () {
        var args = Array.prototype.slice.call(arguments);
        var n = m === 'pushState' ? curIdx + 1 : curIdx;
        args[0] = withIdx(args[0], n);
        var r = orig.apply(W.history, args);
        curIdx = n;
        rendered = LOC.pathname + LOC.search;
        return r;
      };
    });
    /* the scroll position of the entry on screen is remembered (debounced) so Back AND Forward restore it */
    var scrollT = 0;
    origAdd.call(W, 'scroll', function () {
      clearTimeout(scrollT);
      scrollT = setTimeout(function () {
        if (state !== 'idle' || restoring) return;
        try { W.history.replaceState(stateWith({ mc: 1, scrollY: W.scrollY }), ''); } catch (e) { /* rate-limited: ignore */ }
      }, 200);
    }, { passive: true });
    /* a module script that throws while the router mounts it: full-load fallback */
    origAdd.call(W, 'error', function (e) {
      if (mounting && e && e.filename && isPageModule(e.filename)) mountError = e.error || new Error(e.message || 'module error');
    });
    /* back / forward cache: a page left by a full load can come back alive */
    origAdd.call(W, 'pageshow', function (e) { if (e.persisted) { doomed = 0; passPop = false; restoring = null; clearTimeout(recoverT); recoverT = 0; } });
    /* r13 fix round 2 (finding 4, rest): document loads the router did not start win over an in-place navigation in
       flight too. The Navigation API reports each one as it starts (code assigning location — the sign-out —, a
       link the router leaves alone, a form, location.reload(), a Back step to another document); during the swap
       one that can still be stopped is held and follows the swap (latest wins, like a link click), one that cannot
       (a traversal) goes ahead. 'beforeunload' covers what the Navigation API does not report (the address bar,
       the reload button, engines without it). Same-document entries (pushState / replaceState, #hash, Back / Forward
       within this document), downloads and non-http(s) targets (mailto:, tel:) never unload the page: ignored. */
    var NAV_API = W.navigation;
    if (NAV_API && typeof NAV_API.addEventListener === 'function') {
      origAdd.call(NAV_API, 'navigate', function (e) {
        var d = e.destination;
        if (!d || d.sameDocument || e.hashChange || (e.downloadRequest !== null && e.downloadRequest !== undefined)) return;
        var u = toUrl(d.url);
        if (!u || !/^https?:$/.test(u.protocol)) return;
        if (state === 'committing') {
          if (e.cancelable && !e.formData && (e.navigationType === 'push' || e.navigationType === 'replace')) {
            e.preventDefault();
            pending = { href: u.href, o: { full: true, replace: e.navigationType === 'replace', source: 'load' } };
          }
          return;
        }
        yieldToLoad();
      });
    }
    origAdd.call(W, 'beforeunload', function () { if (state !== 'committing') yieldToLoad(); });
    origAdd.call(W, 'pagehide', function () { clearTimeout(recoverT); recoverT = 0; });   /* the document did go */
    /* Back / Forward between in-place pages */
    origAdd.call(W, 'popstate', function () {
      var ni = idxOf(W.history.state);
      var now = LOC.pathname + LOC.search;
      if (now === rendered) {                                  /* a sheet / drawer entry, a hash move, or a stopped step undone */
        if (ni !== null) curIdx = ni;
        if (restoring) { var r = restoring; restoring = null; clearTimeout(r.timer); r.then(); }
        return;
      }
      var delta = ni !== null ? ni - curIdx : 0;
      if (passPop) passPop = false;                            /* the step the guard allowed ("Tinggalkan") */
      else if (state !== 'committing') {
        var dialog = !!(W.MCDialog && W.MCDialog.isOpen);       /* a pending decision: stay */
        var dirty = !dialog && !!(W.MCPage && W.MCPage.isDirty && W.MCPage.isDirty());
        if (dialog || dirty) { stay(LOC.href, delta, dirty); return; }
      }
      if (ni !== null) curIdx = ni;
      var p;
      if (state === 'committing') { pending = { href: LOC.href, o: { source: 'pop', pop: POP } }; p = Promise.resolve('queued'); }
      else p = navigate(LOC.href, { source: 'pop', pop: POP });
      if (popDone) { var f = popDone; popDone = null; f(p); }
    });
    /* every eligible same-origin link (window, bubble phase: after page handlers, MCAction, menus and
       the shell's own link handler had their say; a handled click is defaultPrevented) */
    origAdd.call(W, 'click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      var h = a.getAttribute('href');
      if (!h || h.charAt(0) === '#' || typeof a.href !== 'string') return;      /* hash jumps; SVG links (animated href) */
      /* r13 fix pass 2, finding 5: the scheme is judged on the browser's own resolution of the link (entities decoded,
         whitespace / control characters stripped, scheme lowercased), never on the raw attribute: only http(s)
         is routed; mailto:, tel:, javascript: … are left to the browser */
      var u = toUrl(a.href);
      if (!u || !/^https?:$/.test(u.protocol)) return;
      if (pathSearch(u) === rendered && u.hash) return;        /* the browser moves to the target in place */
      /* r13 fix round 2: a link inside [data-router="off"] is left to the browser — a document load, so it is one of
         the full loads below (it wins over an in-place navigation in flight), never a swap */
      var off = !!a.closest('[data-router="off"]');
      if (!off && pathSearch(u) === rendered) {
        e.preventDefault();
        /* r13 fix: a link to the page on screen that is not its "current" marker ("Buat pembelian lain",
           "Catat pembayaran lain", data-router-remount) starts the page again, as a full load of the same
           address does on file://; the current sidebar entry (aria-current) stays a no-op — and (r13 fix round 2)
           cancels a navigation elsewhere that is still leaving the page ("stay here", latest wins) */
        if (a.hasAttribute('data-router-remount') || (!a.hasAttribute('aria-current') && a.closest('main[data-region="content"]'))) {
          navigate(u.href, { source: 'link', trigger: a, remount: true });
        } else cancel();
        return;
      }
      if (off || !eligibleUrl(u)) {                            /* the browser loads it (auth, previews, other pages) */
        /* r13 fix pass 2, finding 4: that document load wins over an in-place navigation still in flight; during the swap it
           is queued (the browser's own load would race the commit) and stays a document load (full) */
        if (state === 'committing') { e.preventDefault(); navigate(u.href, { source: 'link', trigger: a, full: true }); }
        else yieldToLoad();
        return;
      }
      e.preventDefault();
      navigate(u.href, { source: 'link', trigger: a });
    });
  }

  W.MCRouter = {
    get active() { return active; },
    navigate: navigate,
    cancel: function () { return active && cancel(); },
    eligible: eligible,
    state: function () { return state; },
    get rendered() { return rendered; },
    get position() { return curIdx; }
  };
})();
