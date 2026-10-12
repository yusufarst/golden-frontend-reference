/* =============================================================================
   MULTIPLECORP interactions (consolidated by c-merge from assets/js/parts/*.js).
   Load once per page, deferred, as the last element of <body>:
     <script src="../assets/js/interactions.js" defer></script>
   (icons.js stays the FIRST element of <body>, synchronous.)

   One strict IIFE per section, each guarded by body[data-page], in this order:
     0. Project shell      r6: navigation, account identity, greeting, features from
                           assets/js/project-config.js (window.MCProject)
     1. Shell              data-page dashboard | purchase | motion  (needs [data-shell])
     2. Page: Login        data-page login
     3. Page: Dashboard    data-page dashboard (helpers also export to Node via module.exports)
     4. Page: Purchase     data-page purchase
     5. Page: Motion Study data-page motion; its overlay engine also runs the command palette
                           on dashboard and purchase (markup built from JS, hidden until opened)
   Globals: window.MCShell, window.mcAuth, window.mcMotion (04: every pattern; app pages: the palette).
   r13 (persistent shell, D-52): the 02 Dashboard and 03 Purchase sections moved to page modules
   (assets/js/modules/beranda.js, pembelian-baru.js). Each section keeps its SHELL-ONCE work at load and
   exposes the PER-PAGE part, so over HTTP the router (assets/js/router.js) can swap a page in place and
   call MCShell.pageDispose(main) / MCShell.pageInit(main) / MCShell.pageReady(main) (last section).
   Direct loads (file:// or HTTP) boot exactly as before, then open the page scope (MCScope.begin).
   ============================================================================= */


/* ===== Project shell (r6): navigation, account identity, greeting and features ===== */
/* =============================================================================
   Runs first on every page with the app shell. Everything project-specific comes from
   assets/js/project-config.js (window.MCProject / MC_PROJECT), never from the page markup:
     - r12 navigation TREE (navigation.sidebar via MCProject.navTree()): ONE renderer for the
       sidebar, the icon rail and the drawer. Max two levels: a level-1 row is a link (icon +
       label) or a disclosure group (a <button>: icon + label + chevron, aria-expanded /
       aria-controls; WAI-ARIA disclosure navigation, never a flyout, no tree / menu role); its
       child rows are plain links (no icon). Section labels are headings, not a level.
     - current entry: MCProject.navCurrent() (route + params, then the true-parent walk). Exactly
       ONE element per navigation landmark carries aria-current ("page" on the entry itself,
       "true" on a detail / task inside it); the group header takes it only while its current
       child is not visible (group closed, child hidden for the role, icon rail). The group that
       holds the current entry is open on every load; groups toggle independently; nothing is
       remembered across pages. body[data-nav-section] is only the static (no-JS) hint now.
     - bottom navigation: MCProject.bottomItems() (navigation.bottom, per role; max 5; none when
       features.bottomNav is false). An item is lit when it is the level-1 ancestor of the
       current entry: "page" on its landing, "true" elsewhere in that area; areas outside the
       bar light nothing.
     - account identity: [data-account-name|role|initials], trigger aria-label
     - features: search (top-bar field + app-bar search), dateFilter ([data-daterange])
     - greeting: [data-greeting] = MCTime band + project user name; re-rendered on
       'mc:timechange' (the shared clock in project-config.js fires it when the band or the day changes)
   The page markup is the no-JS fallback (tools/shell_sync.py); it matches the default project.
   Internal API for the shell modules below: window.MCNavTree = { current, html(tree, o),
   init(host, o), toggle(host, li, open, animate), mark(host), markBottom(cur), groupOf(host, id),
   reveal(box, el, { head, start, smooth }), edges(box) (scroll-edge fades) }.
   ============================================================================= */
(function () {
  'use strict';
  var P = window.MCProject, doc = document;
  if (!P || !doc.body) return;
  var cfg = window.MC_PROJECT;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icon(name, cls) { return '<svg class="mc-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + name + '"></use></svg>'; }
  function each(sel, fn) { Array.prototype.forEach.call(doc.querySelectorAll(sel), fn); }
  function token(name, fallback) {
    var v = getComputedStyle(doc.documentElement).getPropertyValue(name).trim(), n = parseFloat(v);
    return isNaN(n) ? fallback : (/ms$/.test(v) ? n : n * 1000);
  }
  function ease(name, fallback) { return getComputedStyle(doc.documentElement).getPropertyValue(name).trim() || fallback; }

  /* Current entry. A page that answers "not found" in place (a role outside the route, a missing
     record) marks nothing, like 00. */
  var cur = P.navCurrent ? P.navCurrent() : null;
  if (doc.querySelector('[data-region="content"] [data-not-found]')) cur = null;

  /* 1. The tree renderer (sidebar + drawer) ---------------------------------------------- */
  /* o: { ns: class namespace, ids: id prefix (unique per host, aria-controls), sec: section-label id
     prefix, linkAttrs: extra attributes on every link, iconCls: level-1 icon classes } */
  function treeHTML(tree, o) {
    var ns = o.ns, html = '';
    function a(it, cls, inner) {
      return '<a class="' + cls + '" data-nav-key="' + esc(it.id) + '" href="' + esc(it.href) + '"' + (o.linkAttrs || '') + '>' + inner + '</a>';
    }
    tree.forEach(function (s, si) {
      var sid = s.label ? o.sec + (s.id || 'group-' + si) : '';
      if (html) html += '<hr class="' + ns + '__divider">';
      if (s.label) html += '<p class="' + ns + '__group" id="' + sid + '">' + esc(P.t(s.label)) + '</p>';
      html += '<ul class="' + ns + '__list" role="list"' + (sid ? ' aria-labelledby="' + sid + '"' : '') + '>' + s.items.map(function (it) {
        var head = icon(it.icon, o.iconCls) + '<span class="' + ns + '__label">' + esc(P.t(it.label)) + '</span>';
        if (it.kind !== 'group') return '<li>' + a(it, ns + '__link', head) + '</li>';
        var g = o.ids + '-g-' + it.id, sub = o.ids + '-s-' + it.id;
        return '<li class="' + ns + '__item--group">' +
          '<button type="button" class="' + ns + '__link ' + ns + '__toggle" id="' + g + '" data-nav-key="' + esc(it.id) + '" data-nav-group aria-expanded="false" aria-controls="' + sub + '">' +
            head + icon('chevron-right', 'mc-icon--16 ' + ns + '__chev') + '</button>' +
          '<ul class="' + ns + '__sub" id="' + sub + '" role="list" aria-labelledby="' + g + '" hidden>' + it.children.map(function (c) {
            return '<li>' + a(c, ns + '__sublink', '<span class="' + ns + '__label">' + esc(P.t(c.label)) + '</span>') + '</li>';
          }).join('') + '</ul></li>';
      }).join('') + '</ul>';
    });
    return html;
  }
  function groupOf(host, id) {
    var b = id ? host.querySelector('[data-nav-group][data-nav-key="' + id + '"]') : null;
    return b ? b.parentNode : null;
  }
  /* one aria-current per landmark: the entry, or its group header while the entry is not visible */
  function mark(host) {
    var o = host.mcTree || {}, cur = api.current;
    Array.prototype.forEach.call(host.querySelectorAll('[data-nav-key][aria-current]'), function (el) { el.removeAttribute('aria-current'); });
    Array.prototype.forEach.call(host.querySelectorAll('.has-current'), function (el) { el.classList.remove('has-current'); });
    if (!cur) return;
    var el = host.querySelector('[data-nav-key="' + cur.id + '"]');
    var li = groupOf(host, cur.groupId);
    if (li) li.classList.add('has-current');
    if (el && li && el !== li.firstElementChild && (!li.classList.contains('is-open') || (o.railed && o.railed()))) el = li.firstElementChild;
    if (el) el.setAttribute('aria-current', el === (li && li.firstElementChild) ? 'true' : cur.kind);
  }
  /* open / close a group in place: height + opacity (reveal --mc-dur-base / --mc-ease-reveal; collapse
     --mc-dur-state / --mc-ease-exit, [hidden] after the collapse); reduced motion: instant */
  function toggle(host, li, open, animate) {
    if (!li) return;
    var btn = li.firstElementChild, sub = li.lastElementChild, o = host.mcTree || {};
    var rail = !!(o.railed && o.railed());
    li.classList.toggle('is-open', open);
    if (!rail) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (sub.mcAnim) { var prev = sub.mcAnim; sub.mcAnim = null; prev.cancel(); }
    function settle() {
      sub.style.overflow = '';
      if (li.classList.contains('is-open')) return;
      sub.hidden = true;
      sub.classList.remove('is-open');
    }
    var motion = animate && !rail && sub.animate && !(mqReduce && mqReduce.matches) && li.offsetParent !== null;
    if (open) {
      sub.hidden = false;
      sub.classList.add('is-open');
      if (motion) {
        sub.style.overflow = 'hidden';
        sub.mcAnim = sub.animate([{ height: '0px', opacity: 0 }, { height: sub.scrollHeight + 'px', opacity: 1 }],
          { duration: token('--mc-dur-base', 240), easing: ease('--mc-ease-reveal', 'ease-out') });
        sub.mcAnim.onfinish = sub.mcAnim.oncancel = function () { sub.style.overflow = ''; };
      }
    } else if (motion && !sub.hidden) {
      sub.style.overflow = 'hidden';
      var out = sub.mcAnim = sub.animate([{ height: sub.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: token('--mc-dur-state', 200), easing: ease('--mc-ease-exit', 'ease-in-out'), fill: 'forwards' });
      out.oncancel = settle;
      out.onfinish = function () { settle(); out.oncancel = null; out.cancel(); if (sub.mcAnim === out) sub.mcAnim = null; };
    } else settle();
    mark(host);
  }
  /* initial state: only the group holding the current entry is open (no animation, nothing stored) */
  function init(host, o) {
    var cur = api.current;
    host.mcTree = o || {};
    Array.prototype.forEach.call(host.querySelectorAll('[data-nav-group]'), function (b) {
      toggle(host, b.parentNode, !!cur && b.getAttribute('data-nav-key') === cur.groupId, false);
    });
    mark(host);
  }
  /* r12: the list scrolls between a pinned head and foot. An edge beyond which a ROW is hidden carries a
     scroll shadow (.has-more-start / .has-more-end; r12 review: a shadow, no longer a fade, so the last
     visible row never reads as disabled); the list's own lead / trail space never counts. Kept current on
     scroll, resize and every change of the rows' height (group toggles, the rail). */
  var FADE = 8;                                                       /* px: breathing room a revealed row keeps from a shadowed edge */
  function rowsOf(box) {
    return Array.prototype.filter.call(box.querySelectorAll('[data-nav-key], .' + ((box.mcTree && box.mcTree.ns) || 'shell-nav') + '__group'),
      function (el) { return el.getClientRects().length > 0; });
  }
  function edges(box) {
    var rows = box.querySelectorAll('[data-nav-key]'), b = box.getBoundingClientRect(), first = null, last = null, i;
    for (i = 0; i < rows.length && !first; i++) if (rows[i].getClientRects().length) first = rows[i];
    for (i = rows.length - 1; i >= 0 && !last; i--) if (rows[i].getClientRects().length) last = rows[i];
    box.classList.toggle('has-more-start', !!first && first.getBoundingClientRect().top < b.top - 1);
    box.classList.toggle('has-more-end', !!last && last.getBoundingClientRect().bottom > b.bottom + 1);
  }
  function watchEdges(box) {
    var raf = 0;
    function later() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; edges(box); }); }
    box.addEventListener('scroll', later, { passive: true });
    window.addEventListener('resize', later);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(later);
      Array.prototype.forEach.call(box.children, function (k) { ro.observe(k); });
    }
    edges(box);
  }
  /* bring a row into its list's view without moving the window. o.head: keep this element (the group
     header) visible with the row (header first when both do not fit); o.start: put the range at the top
     instead of the nearest edge; o.smooth: scroll smoothly (never under reduced motion). The scroll lands
     on a row boundary (the first row at the top edge is never sliced under the head) and keeps the range
     clear of the shadowed edges; only when no boundary can show the whole range does it move the minimum. */
  function reveal(box, el, o) {
    o = o || {};
    if (!box || !el || !el.getClientRects().length) return;
    var b = box.getBoundingClientRect(), y0 = box.scrollTop, view = box.clientHeight, max = Math.max(0, box.scrollHeight - view);
    function off(v) { return v - b.top + y0; }
    var r = el.getBoundingClientRect(), h = o.head && o.head.getClientRects().length ? o.head.getBoundingClientRect() : null;
    var top = off(h ? Math.min(h.top, r.top) : r.top), bot = off(r.bottom);
    var rows = rowsOf(box), first = rows.length ? off(rows[0].getBoundingClientRect().top) : 0;
    var last = rows.length ? off(rows[rows.length - 1].getBoundingClientRect().bottom) : box.scrollHeight;
    function fits(c, clear) {
      var ft = clear && c > first + 1 ? FADE : 0, fb = clear && last > c + view + 1 ? FADE : 0;
      return top >= c + ft - 0.5 && bot <= c + view - fb + 0.5;
    }
    if (fits(y0, true)) return;
    var cands = [0];
    rows.forEach(function (x) { var c = off(x.getBoundingClientRect().top); if (c > 0.5 && c <= max + 0.5) cands.push(c); });
    function pick(clear) {
      var best = null;
      cands.forEach(function (c) {
        if (!fits(c, clear)) return;
        if (best === null || (o.start ? c > best : Math.abs(c - y0) < Math.abs(best - y0))) best = c;
      });
      return best;
    }
    var y = pick(true);
    if (y === null) y = pick(false);
    if (y === null) {                                                 /* taller than the view: the header first */
      if (top < y0 || bot - top > view) y = top - 8;
      else y = bot - view + 8;
    }
    y = Math.max(0, Math.min(y, max));
    if (Math.abs(y - y0) < 1) return;
    if (o.smooth && !(mqReduce && mqReduce.matches) && box.scrollTo) box.scrollTo({ top: y, behavior: 'smooth' });
    else box.scrollTop = y;
  }
  function markBottom(c) {
    var bn = doc.querySelector('.mc-bottom-nav');
    if (!bn) return;
    var land = {};
    (P.bottomItems ? P.bottomItems() : []).forEach(function (i) { land[i.key] = i.landing; });
    Array.prototype.forEach.call(bn.querySelectorAll('[data-nav-key]'), function (a) {
      var k = a.getAttribute('data-nav-key');
      if (c && c.topId === k) a.setAttribute('aria-current', c.kind === 'page' && c.id === land[k] ? 'page' : 'true');
      else a.removeAttribute('aria-current');
    });
  }
  /* r13 (persistent shell): after an in-place page swap the current entry is located again (none on a
     not-found answer); its group opens if it is closed (animated; groups the user opened stay open), the
     one mark moves and the bottom bar follows. Returns { current, opened }. */
  function refresh() {
    var c = P.navCurrent ? P.navCurrent() : null;
    if (doc.querySelector('[data-region="content"] [data-not-found]')) c = null;
    api.current = c;
    var n = doc.querySelector('[data-shell-nav]'), li = null;
    if (n && n.mcTree) {
      li = c && c.groupId ? groupOf(n, c.groupId) : null;
      if (li && !li.classList.contains('is-open')) toggle(n, li, true, !(n.mcTree.railed && n.mcTree.railed()));
      else { li = null; mark(n); }
    }
    markBottom(c);
    return { current: c, opened: !!li };
  }
  /* current: may be replaced (the drawer marks the chosen entry while the page changes) */
  var api = window.MCNavTree = { current: cur, html: treeHTML, init: init, toggle: toggle, mark: mark, markBottom: markBottom, groupOf: groupOf,
    reveal: reveal, edges: watchEdges, refresh: refresh };

  /* 1b. Sidebar navigation ------------------------------------------------------------------ */
  var nav = doc.querySelector('[data-shell-nav]');
  if (nav) {
    nav.innerHTML = treeHTML(P.navTree(), { ns: 'shell-nav', ids: 'snav', sec: 'shell-nav-', iconCls: 'mc-icon--24 shell-nav__icon' });
    init(nav, { ns: 'shell-nav' });                                   /* the Shell section adds the rail state */
    watchEdges(nav);
  }

  /* 2. Bottom navigation ---------------------------------------------------------------- */
  var bottom = doc.querySelector('.mc-bottom-nav');
  if (bottom) {
    var items = P.bottomItems();
    if (!items.length) { bottom.remove(); doc.documentElement.setAttribute('data-no-bottom-nav', ''); }
    else {
      bottom.querySelector('.mc-bottom-nav__list').innerHTML = items.map(function (it) {
        return '<li><a class="mc-bottom-nav__link" data-nav-key="' + esc(it.key) + '" href="' + esc(it.href) + '" data-shell-link>' + icon(it.icon, 'mc-icon--24') +
          '<span class="mc-bottom-nav__label">' + esc(P.t(it.label)) + '</span></a></li>';
      }).join('');
      markBottom(cur);
    }
  }

  /* 2b. Brand home links follow the role's Beranda (r10: the Admin's home is Antrean Tindakan) */
  var home = P.home ? P.home() : null;
  if (home && home.href) each('a.shell-brand__home, a.mc-appbar__brand', function (el) { el.setAttribute('href', home.href); });

  /* 3. Account identity ---------------------------------------------------------------- */
  var u = cfg.user || {}, roleText = P.t(u.roleLabel);
  each('[data-account-name]', function (el) { el.textContent = u.name || ''; });
  each('[data-account-role]', function (el) { el.textContent = roleText; });
  each('[data-account-initials]', function (el) { el.textContent = u.initials || String(u.name || '?').charAt(0); });
  each('[data-account-trigger]', function (el) {
    el.setAttribute('aria-label', (P.lang() === 'en' ? 'Account: ' : 'Akun: ') + (u.name || '') + (roleText ? ', ' + roleText : ''));
  });

  /* 4. Features ------------------------------------------------------------------------- */
  if (!P.feature('search')) each('[data-shell-search], [data-appbar-search]', function (el) { el.remove(); });
  if (!P.feature('dateFilter')) each('[data-daterange]', function (el) { el.remove(); });

  /* 5. Greeting -------------------------------------------------------------------------- */
  function renderGreeting() {
    if (!window.MCTime) return;
    var b = window.MCTime.band();
    each('[data-greeting]', function (h) {
      h.setAttribute('data-band', b.id);
      var text = h.querySelector('[data-greeting-text]');
      if (text) text.textContent = window.MCTime.greeting(P.lang(), u.name);
      var use = h.querySelector('[data-greeting-icon] use');
      if (use) use.setAttribute('href', '#i-' + (b.icon || 'sun'));
    });
  }
  if (doc.querySelector('[data-greeting]')) renderGreeting();
  /* the shared clock (project-config.js); r13: always registered (a page shown later may greet) */
  doc.addEventListener('mc:timechange', renderGreeting);
  window.MCGreeting = { render: renderGreeting };
})();


/* ===== Shell (02, 03, 04) ===== */
/* =============================================================================
   MULTIPLECORP app shell behaviour (label b-shell; verified by b-shell-verify). Runs only
   when body[data-page] is set AND the page contains [data-shell] (dashboard, purchase,
   motion study); the login page has no shell and is skipped.
   Grammar: REF-V2 (motion analysis 4.4). The sidebar and top bar never animate; the
   content region exits (opacity + 3 px blur, 240 ms, no transform) before a page change,
   and the active pill slides to the target on the standard curve.

   Public surface (documented in the shell report):
     document events  mc:command        {source: 'shortcut' | 'search' | 'appbar', query}
                      mc:sidebar        {collapsed}
                      mc:navigate       {href} (cancelable: preventDefault() keeps the page)
     window.MCShell   navigate(href, fromLink?) | setCollapsed(bool) | focusSearch()
                      | indexEnter(root?) | markFixed() | reducedMotion()
                      | lock(bool) | locked()   (c-merge: modal overlays make the shell inert)
                      | railed() | syncRail()   (r12: icon rail state of the navigation tree)
   r12 keyboard: Ctrl / Cmd + B collapses / expands the sidebar on desktop (KB-03).
   navigate(href) without a link slides the pill to the nav link of that href when there
   is one (c-merge: palette, Batal on 03).
   ============================================================================= */
(function () {
  'use strict';

  /* Runs on any app page (body[data-page]) that contains the shell markup: dashboard, purchase,
     the motion study (whatever data-page value it picks). Pages without [data-shell] (login)
     are left alone. */
  if (typeof document === 'undefined') return;
  var body = document.body;
  if (!body || !body.dataset.page) return;

  var doc = document;
  var shell = doc.querySelector('[data-shell]');
  if (!shell) return;

  var sidebar = shell.querySelector('.shell-sidebar');
  var nav = shell.querySelector('[data-shell-nav]');
  var content = doc.querySelector('[data-region="content"]');
  var toggle = shell.querySelector('[data-shell-toggle]');
  var searchForm = shell.querySelector('[data-shell-search]');
  var searchInput = searchForm ? searchForm.querySelector('input') : null;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var mqRail = window.matchMedia ? window.matchMedia('(max-width: 1024px)') : null;
  var STORE_KEY = 'mc-shell-sidebar';
  var leaving = false;
  var leaveTimer = 0;

  function reducedMotion() { return !!(mqReduce && mqReduce.matches); }

  function emit(name, detail, cancelable) {
    var ev;
    try {
      ev = new CustomEvent(name, { detail: detail || {}, bubbles: true, cancelable: !!cancelable });
    } catch (e) {
      ev = doc.createEvent('CustomEvent');
      ev.initCustomEvent(name, true, !!cancelable, detail || {});
    }
    return doc.dispatchEvent(ev);
  }

  function readStore() { try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
  function writeStore(v) { try { window.localStorage.setItem(STORE_KEY, v); } catch (e) { /* storage blocked */ } }

  /* ---------------------------------------------------------------------------
     1. Entrance indexing. Direct children of the content region animate from CSS
        alone. Elements marked [data-enter="card|item|title|content|fade|pop"] get
        --i (document order inside their nearest [data-enter-group] or the region)
        and the matching motion.css utility class. A group may set
        data-enter-group="cards|rows|tight" to pick the stagger interval.
     ------------------------------------------------------------------------- */
  var ENTER_CLASS = {
    card: 'mc-enter', item: 'mc-enter-item', title: 'mc-enter-title',
    content: 'mc-enter-content', fade: 'mc-enter-fade', pop: 'mc-pop'
  };
  var STAGGER_CLASS = { cards: 'mc-stagger-cards', rows: 'mc-stagger-rows', tight: 'mc-stagger-tight' };

  function indexEnter(root) {
    var scope = root || content;
    if (!scope) return 0;
    var groups = new Map();
    var els = scope.querySelectorAll('[data-enter]');
    for (var k = 0; k < els.length; k++) {
      var el = els[k];
      var type = el.getAttribute('data-enter') || 'card';
      if (type === 'none') continue;
      var group = el.parentElement ? el.parentElement.closest('[data-enter-group]') : null;
      if (!group || !scope.contains(group)) group = content || scope;
      var n = groups.has(group) ? groups.get(group) : 0;
      groups.set(group, n + 1);
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', String(n));
      var cls = ENTER_CLASS[type] || ENTER_CLASS.card;
      if (!el.classList.contains(cls)) el.classList.add(cls);
    }
    groups.forEach(function (count, group) {
      var interval = STAGGER_CLASS[group.getAttribute('data-enter-group')];
      if (interval) group.classList.add(interval);
    });
    return els.length;
  }

  /* ---------------------------------------------------------------------------
     2. Navigation: content exit + sliding pill, then the location change.
     r12: the pill lives inside the scrolling list (it scrolls and clips with the rows) and slides
     ONLY between two entries of the SAME level that are rendered and inside the list's visible box
     at that moment (measured now, so a toggled group is always re-measured); a move between a
     level-1 row (fill + rule) and a child row (rule only) or to a row out of view simply jumps on
     the next page, so the pill never changes its look mid-slide. Between child rows it is the child
     treatment (accent rule, no fill).
     ------------------------------------------------------------------------- */
  function shownInNav(el) {
    if (!el || !el.getClientRects().length) return false;
    var r = el.getBoundingClientRect(), n = nav.getBoundingClientRect();
    return r.height > 0 && r.top >= n.top - 1 && r.bottom <= n.bottom + 1;
  }
  function moveIndicator(link) {
    if (!sidebar || !nav || !link || reducedMotion()) return 0;
    var current = nav.querySelector('[data-nav-key][aria-current]');
    if (!current || current === link || !nav.contains(link) || !shownInNav(current) || !shownInNav(link)) return 0;
    var child = link.classList.contains('shell-nav__sublink');
    if (child !== current.classList.contains('shell-nav__sublink')) return 0;
    var host = nav.getBoundingClientRect();
    var r0 = current.getBoundingClientRect();
    var r1 = link.getBoundingClientRect();
    var pill = doc.createElement('span');
    pill.className = 'shell-nav__indicator' + (child ? ' shell-nav__indicator--child' : '');
    pill.setAttribute('aria-hidden', 'true');
    pill.style.top = (r0.top - host.top + nav.scrollTop) + 'px';
    pill.style.left = (r0.left - host.left) + 'px';
    pill.style.width = r0.width + 'px';
    pill.style.height = r0.height + 'px';
    nav.appendChild(pill);
    sidebar.classList.add('is-indicator-moving');
    void pill.offsetWidth;                                   /* commit the start position */
    pill.style.transform = 'translate(' + (r1.left - r0.left) + 'px, ' + (r1.top - r0.top) + 'px)';
    pill.style.width = r1.width + 'px';
    pill.style.height = r1.height + 'px';
    return parseFloat(getComputedStyle(pill).transitionDuration) * 1000 || 320;
  }

  function resetLeave() {
    leaving = false;
    clearTimeout(leaveTimer);
    if (content) {
      content.classList.remove('is-leaving');
      content.classList.remove('is-swapping');
      content.removeAttribute('aria-busy');
    }
    if (sidebar) {
      sidebar.classList.remove('is-indicator-moving');
      var pills = sidebar.querySelectorAll('.shell-nav__indicator');
      for (var i = 0; i < pills.length; i++) pills[i].remove();
    }
  }

  /* A transform or filter on an ancestor re-anchors position: fixed descendants. Direct
     children of the content region that contain one get data-shell-fixed: they enter and
     exit with opacity only (see the App shell section of components.css). */
  function markFixed() {
    if (!content) return;
    var kids = content.children;
    for (var i = 0; i < kids.length; i++) {
      var kid = kids[i];
      if (kid.hasAttribute('data-shell-fixed')) continue;
      if (getComputedStyle(kid).position === 'fixed') { kid.setAttribute('data-shell-fixed', ''); continue; }
      var all = kid.querySelectorAll('*');
      for (var j = 0; j < all.length; j++) {
        if (getComputedStyle(all[j]).position === 'fixed') { kid.setAttribute('data-shell-fixed', ''); break; }
      }
    }
  }

  /* Rendered nav link whose resolved href (query included) equals href: programmatic navigations
     (palette, Batal) get the pill slide too; a link inside a closed group is not a target. */
  function linkFor(href) {
    if (!nav) return null;
    var abs;
    try { abs = new URL(href, window.location.href).href.split('#')[0]; } catch (e) { return null; }
    var links = nav.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].href.split('#')[0] === abs && links[i].getClientRects().length) return links[i];
    }
    return null;
  }

  /* The content exit + pill slide. r13: shared by the full-load path below and the router (which runs it
     in parallel with fetching the next page); again = a newer navigation replaces one still leaving (the
     content is already out: only the pill restarts toward the new target). Returns the ms to wait. */
  function leave(href, link, again, o) {
    /* r13 fix (R13_SPEC §1 "reduced motion = instant"): an in-place swap (router, o.inPlace) under reduced
       motion has no exit at all: the page stays as it is (inert to the pointer, aria-busy) until the next one is
       ready, then the router swaps it in one frame; no wait. The file:// full load keeps the Golden 150 ms
       crossfade (it covers the document load). */
    if (o && o.inPlace && reducedMotion()) {
      leaving = true;
      if (content) {
        content.classList.add('is-swapping');
        content.setAttribute('aria-busy', 'true');
      }
      return 0;
    }
    var exitMs = reducedMotion() ? 150 : 240;               /* --mc-dur-reduced / --mc-dur-base */
    if (again && sidebar) {
      sidebar.classList.remove('is-indicator-moving');
      Array.prototype.forEach.call(sidebar.querySelectorAll('.shell-nav__indicator'), function (p) { p.remove(); });
    }
    leaving = true;
    markFixed();
    if (content) {
      content.classList.add('is-leaving');
      content.setAttribute('aria-busy', 'true');
    }
    var pillMs = moveIndicator(link);
    return Math.max(again ? 0 : exitMs, pillMs);
  }
  function navigate(href, fromLink) {
    if (!href) return undefined;
    /* r13: over HTTP the router swaps the page in place (it asks 'mc:navigate' itself; latest wins) */
    var Rt = window.MCRouter;
    if (Rt && Rt.active) return Rt.navigate(href, { source: 'shell', trigger: fromLink || null });
    if (leaving) return undefined;
    if (!emit('mc:navigate', { href: href }, true)) return undefined;
    var wait = leave(href, fromLink || linkFor(href));
    leaveTimer = setTimeout(function () { window.location.href = href; }, wait);
    return undefined;
  }

  function samePage(url) {
    return url.split('#')[0] === window.location.href.split('#')[0];
  }

  doc.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var inShellNav = !!a.closest('[data-shell-nav]') || a.hasAttribute('data-shell-link');
    var optIn = a.hasAttribute('data-shell-transition');
    if (a.hasAttribute('data-placeholder') || a.getAttribute('href') === '#') {
      if (inShellNav || a.closest('[data-shell]')) e.preventDefault();   /* no destination page yet */
      return;
    }
    if (!(inShellNav || optIn)) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    if (samePage(a.href)) {
      e.preventDefault();
      /* r13 fix round 2: the entry of the page on screen cancels an in-place navigation elsewhere that is still
         leaving it ("stay here", latest wins); otherwise nothing happens */
      if (window.MCRouter && window.MCRouter.cancel) window.MCRouter.cancel();
      return;
    }
    e.preventDefault();
    navigate(a.href, a);
  });

  /* Back / forward cache restores the page as it was when it left. */
  window.addEventListener('pageshow', function (e) { if (e.persisted) resetLeave(); });

  /* ---------------------------------------------------------------------------
     3. Ctrl / Cmd + K: focus the search and announce the command palette request.
     ------------------------------------------------------------------------- */
  /* r11: one search per screen. On the search route the page's own field is the search (the top-bar
     field and the app-bar button are hidden by CSS), so "focus the search" means that field. */
  function pageSearchField() {
    if (body.getAttribute('data-route') !== 'search' || !content) return null;
    return content.querySelector('[role="search"] input[type="search"]');
  }
  function focusSearch() {
    var target = pageSearchField() || searchInput;
    if (!target) return;
    target.focus({ preventScroll: true });
    target.select();
  }

  /* r12 (canonical KB-03): Ctrl / Cmd + B collapses or expands the sidebar on desktop (>= 1025 px).
     Ignored in editable fields, while ANY overlay is open (modal or not: dialogs, popovers such as the
     period filter, menus, listboxes, an expanded popup trigger), on the forced tablet rail, when the
     project turns shortcuts off, and on key repeat (holding the keys toggles once). */
  function editable(t) { return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
  function overlayOpen() {
    if (isLocked || (window.MCDialog && window.MCDialog.isOpen) || (window.MCNav && window.MCNav.isOpen) || (window.MCAccount && window.MCAccount.isOpen)) return true;
    return Array.prototype.some.call(doc.querySelectorAll('[aria-modal="true"], [role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [aria-haspopup]:not([aria-haspopup="false"])[aria-expanded="true"]'),
      function (el) { return el.getClientRects().length > 0; });
  }
  function shortcutsOn() { return !window.MCProject || window.MCProject.feature('shortcuts'); }

  doc.addEventListener('keydown', function (e) {
    var key = (e.key || '').toLowerCase();
    if (key === 'k' && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      focusSearch();
      emit('mc:command', { source: 'shortcut', query: searchInput ? searchInput.value : '' });
    } else if (key === 'b' && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
      if (!toggle || (mqRail && mqRail.matches) || !shortcutsOn() || editable(e.target) || overlayOpen()) return;
      if (e.repeat) { e.preventDefault(); return; }
      e.preventDefault();
      setCollapsed(shell.getAttribute('data-sidebar') !== 'collapsed');
    }
  });

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      emit('mc:command', { source: 'search', query: searchInput ? searchInput.value : '' });
    });
  }

  /* r6: the top-bar "Pintasan" button and top-right account are gone (shortcuts live in the account
     menu and on "?"; the account sits at the bottom of the sidebar: see "Account menu" below). */

  /* ---------------------------------------------------------------------------
     4. Collapse to an icon rail (width transition on the grid column).
     ------------------------------------------------------------------------- */
  function railed() { return shell.getAttribute('data-sidebar') === 'collapsed' || !!(mqRail && mqRail.matches); }
  var NT = window.MCNavTree;
  if (nav && nav.mcTree) nav.mcTree.railed = railed;

  /* Icon-only rail (toggle collapsed, or forced at <= 1024 px): each level-1 row gets its label as a
     tooltip (the label text stays in the accessibility tree either way: opacity only). Expanded, a
     label that does not fit ellipsizes and keeps its full text as the tooltip. r12: re-queried on
     every call (the tree changes; no NodeList captured once). */
  function syncTitles() {
    if (!nav) return;
    var rail = railed();
    Array.prototype.forEach.call(nav.querySelectorAll('.shell-nav__link, .shell-nav__sublink'), function (el) {
      var lab = el.querySelector('.shell-nav__label');
      if (!lab) return;
      var top = el.classList.contains('shell-nav__link');
      if ((rail && top) || (!rail && lab.clientWidth && lab.scrollWidth > lab.clientWidth + 1)) el.setAttribute('title', lab.textContent);
      else el.removeAttribute('title');
    });
  }
  /* r12 rail: a group icon is the SAME button, but it opens the drawer AT its group (never a flyout);
     its accessible popup relation follows. The mark moves to the group icon (children are not shown). */
  function syncRail() {
    if (!nav) return;
    var rail = railed();
    Array.prototype.forEach.call(nav.querySelectorAll('[data-nav-group]'), function (b) {
      var li = b.parentNode;
      if (rail) {
        b.setAttribute('aria-haspopup', 'dialog');
        b.setAttribute('aria-controls', 'mc-navdrawer');
        b.setAttribute('aria-expanded', b.mcDrawer ? 'true' : 'false');
      } else {
        b.removeAttribute('aria-haspopup');
        b.setAttribute('aria-controls', li.lastElementChild.id);
        b.setAttribute('aria-expanded', li.classList.contains('is-open') ? 'true' : 'false');
      }
    });
    /* focus never stays on a row the rail hides */
    var f = doc.activeElement;
    if (rail && f && f.closest && f.closest('.shell-nav__sub')) { var g = f.closest('.shell-nav__item--group'); if (g) g.firstElementChild.focus({ preventScroll: true }); }
    if (NT) NT.mark(nav);
    syncTitles();
  }
  if (mqRail) {
    if (mqRail.addEventListener) mqRail.addEventListener('change', syncRail);
    else if (mqRail.addListener) mqRail.addListener(syncRail);
  }

  /* the current entry is in view on load (instantly), with its group header; an opened group scrolls
     its rows into view (header first) once it has its height. MCNavTree.reveal snaps to a row
     boundary and keeps clear of the edge fades. */
  function revealInNav(el, smooth) {
    if (!nav || !el || !NT) return;
    var g = el.classList.contains('shell-nav__sublink') ? el.closest('.shell-nav__item--group') : null;
    NT.reveal(nav, el, { head: g ? g.firstElementChild : null, smooth: smooth });
  }
  function currentRow() { return nav ? nav.querySelector('[data-nav-key][aria-current]') : null; }
  if (nav && NT) {
    nav.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-nav-group]') : null;
      if (!b || !nav.contains(b)) return;
      if (railed()) {
        if (window.MCNav && window.MCNav.open) window.MCNav.open({ group: b.getAttribute('data-nav-key'), trigger: b });
        return;
      }
      var li = b.parentNode, open = b.getAttribute('aria-expanded') !== 'true';
      NT.toggle(nav, li, open, true);
      syncTitles();
      if (open) setTimeout(function () {
        if (li.classList.contains('is-open')) NT.reveal(nav, li.lastElementChild, { head: b, smooth: true });
      }, reducedMotion() ? 0 : token('--mc-dur-base', 240));
    });
  }

  /* r12: collapsing folds away what the rail does not show (the open child lists) WITH the column,
     and expanding unfolds them, instead of rows jumping at t = 0. While the width moves (.is-railing)
     the folding lists stay rendered and labels clip instead of ellipsizing; when it settles the
     tooltips are re-measured and, after an expand, the current entry is scrolled into view. A
     section label folds by CSS. Reduced motion / instant: no fold. */
  var railT = 0, railAnims = [];
  function token(name, fallback) {
    var v = getComputedStyle(doc.documentElement).getPropertyValue(name).trim(), n = parseFloat(v);
    return isNaN(n) ? fallback : (/ms$/.test(v) ? n : n * 1000);
  }
  function settleRail() {
    clearTimeout(railT);
    railT = 0;
    railAnims.forEach(function (a) { var sub = a.mcSub; a.cancel(); if (sub) { sub.style.overflow = ''; if (sub.mcAnim === a) sub.mcAnim = null; } });
    railAnims = [];
    shell.classList.remove('is-railing');
  }
  function foldRail(collapsed) {
    settleRail();
    if (!nav || reducedMotion() || !nav.animate) return false;
    var d = token('--mc-dur-moderate', 320), ease = getComputedStyle(doc.documentElement).getPropertyValue('--mc-ease-standard').trim() || 'ease-in-out';
    shell.classList.add('is-railing');
    Array.prototype.forEach.call(nav.querySelectorAll('.shell-nav__item--group.is-open > .shell-nav__sub'), function (sub) {
      if (sub.hidden) return;
      if (sub.mcAnim) { var prev = sub.mcAnim; sub.mcAnim = null; prev.cancel(); }
      var h = sub.scrollHeight;
      sub.style.overflow = 'hidden';
      var a = sub.animate(collapsed ? [{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }] : [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }],
        { duration: d, easing: ease, fill: 'both' });
      a.mcSub = sub;
      sub.mcAnim = a;
      railAnims.push(a);
    });
    railT = setTimeout(function () {
      settleRail();
      syncTitles();
      if (!collapsed) revealInNav(currentRow(), true);
    }, d);
    return true;
  }
  var titlesT = 0;
  window.addEventListener('resize', function () { clearTimeout(titlesT); titlesT = setTimeout(syncTitles, 120); });

  function setCollapsed(collapsed, opts) {
    opts = opts || {};
    if (opts.instant) shell.classList.add('is-instant');
    shell.setAttribute('data-sidebar', collapsed ? 'collapsed' : 'expanded');
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.setAttribute('aria-label', collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar');
    }
    /* expanding restores the tree with the current group open (and its entry in view) */
    if (!collapsed && nav && NT && NT.current && NT.current.groupId) {
      var cg = NT.groupOf(nav, NT.current.groupId);
      if (cg && !cg.classList.contains('is-open')) NT.toggle(nav, cg, true, false);
    }
    var folding = !opts.instant && foldRail(collapsed);
    if (opts.instant) settleRail();
    syncRail();
    if (!collapsed && !folding) revealInNav(currentRow(), false);
    if (opts.persist !== false) writeStore(collapsed ? 'collapsed' : 'expanded');
    if (opts.instant) {
      void shell.offsetWidth;
      requestAnimationFrame(function () { shell.classList.remove('is-instant'); });
    }
    if (!opts.silent) emit('mc:sidebar', { collapsed: collapsed });
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setCollapsed(shell.getAttribute('data-sidebar') !== 'collapsed');
    });
  }
  if (readStore() === 'collapsed' && !(mqRail && mqRail.matches)) {
    setCollapsed(true, { instant: true, persist: false, silent: true });
  }

  /* ---------------------------------------------------------------------------
     5. Boot.
     ------------------------------------------------------------------------- */
  markFixed();
  indexEnter();
  syncRail();
  if (toggle && shortcutsOn()) toggle.setAttribute('aria-keyshortcuts', 'Control+B Meta+B');
  if (nav) revealInNav(currentRow(), false);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(syncTitles);

  /* ---------------------------------------------------------------------------
     6. Lock (c-merge): while a modal overlay (command palette, dialog, drawer) is open the
        shell and the skip link are inert, and page shortcuts check locked() first.
     ------------------------------------------------------------------------- */
  var skipLink = doc.querySelector('.shell-skip');
  var isLocked = false;
  function lock(on) {
    isLocked = !!on;
    shell.inert = isLocked;
    if (skipLink) skipLink.inert = isLocked;
  }

  window.MCShell = {
    navigate: navigate,
    /* r13 router hooks: the exit (a nav link that is the trigger, else the rendered nav link of href),
       its reset after the swap, and bringing the new current entry into the list's view (only when it is
       out of view; after an opened group has its height) */
    leave: function (href, trigger, again, o) { return leave(href, trigger && nav && nav.contains(trigger) ? trigger : linkFor(href), again, o); },
    resetLeave: resetLeave,
    revealCurrent: function (delay) {
      if (!nav) return;
      if (delay) setTimeout(function () { revealInNav(currentRow(), true); }, delay);
      else revealInNav(currentRow(), true);
    },
    setCollapsed: function (v) { setCollapsed(!!v); },
    railed: railed,
    syncRail: syncRail,
    focusSearch: focusSearch,
    pageSearchField: pageSearchField,
    indexEnter: indexEnter,
    markFixed: markFixed,
    reducedMotion: reducedMotion,
    lock: lock,
    locked: function () { return isLocked; }
  };
})();


/* ===== Page: Login (01) ===== */
/* =============================================================================
   MULTIPLECORP login page behaviour (01-login.html), label b-login (x-login: review fixes).
   Runs only when <body data-page="login">. No network: the "server" is simulated.

   Flow: credentials -> verify (second factor) -> done (authenticated).
   Motion: one clock (--mc-dur-auth-step, 600 ms) on cubic-bezier(.42,0,.58,1).
     - The visual panel (REF-V1 overlay role) is a full-card layer clipped to the
       panel shape; the clip slides, the scene stays card-locked (fixed gradient).
     - The form slot moves the opposite way underneath; the step content swaps at
       eased progress 0.5 while it is fully covered (hidden swap).
     - Visual copy moves opposite to the clip at 2x its displacement (parallax):
       old copy gone by e ~0.265, new copy enters from e ~0.735.
     - The sheet's rounded inner corners ("ears" of the clip) morph on the same clock.
   Reduced motion / narrow screens: 150 ms linear fade-through (old content out over the first
   half, then the old layout fades to reveal the new state), no translate or morph.

   API (deterministic capture):
     mcAuth.show(step)               instant
     mcAuth.play(from, to)           animated; returns a Promise
     mcAuth.seek(from, to, p)        freeze at TIME progress p (0..1); easing applied
     mcAuth.step, mcAuth.duration, mcAuth.ease(p)
   URL: ?step=verify|done (static captures), ?lang=en.
   ============================================================================= */
(function () {
  'use strict';
  if (typeof document === 'undefined' || !document.body || document.body.dataset.page !== 'login') return;

  var STEPS = ['credentials', 'verify', 'done'];
  var card = document.getElementById('login-card');
  var visual = document.getElementById('login-visual');
  var slot = document.getElementById('login-slot');
  var live = document.getElementById('login-live');
  var langEl = slot.querySelector('.login-lang');
  if (!card || !visual || !slot) return;

  var stepEls = {};
  var copyEls = {};
  STEPS.forEach(function (s) {
    stepEls[s] = slot.querySelector('.login-step[data-step="' + s + '"]');
    copyEls[s] = visual.querySelector('.login-copy[data-copy="' + s + '"]');
  });

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqNarrow = window.matchMedia('(max-width: 1024px)');

  /* ---------------------------------------------------------------------------
     1. Copy (ID / EN)
     ------------------------------------------------------------------------- */
  var I18N = {
    id: {
      'lang.group': 'Bahasa',
      'cred.title': 'Masuk ke {brand}',
      'cred.lead': 'Gunakan akun yang diberikan {admin} perusahaan Anda untuk mengakses seluruh fitur {brand}.',
      'cred.email': 'E-mail',
      'cred.emailPh': 'nama@perusahaan.com',
      'cred.password': 'Kata sandi',
      'cred.show': 'Tampilkan',
      'cred.hide': 'Sembunyikan',
      'cred.showAria': 'Tampilkan kata sandi',
      'cred.hideAria': 'Sembunyikan kata sandi',
      'cred.passwordPh': 'Masukkan kata sandi',
      'cred.submit': 'Masuk',
      'cred.forgot': 'Lupa kata sandi?',
      'cred.forgotRest': 'Minta tautan atur ulang kepada {admin}.',
      'cred.forgotHelp': '{Admin} dapat mengirim tautan atur ulang dari Pengaturan › Pengguna. Tautan berlaku 30 menit.',
      'cred.or': 'atau',
      'cred.google': 'Lanjutkan dengan Google',
      'cred.helper': 'Hanya untuk akun yang sudah ditautkan ke Google. Di perangkat bersama, keluar dari Google setelah selesai.',
      'err.email': 'Masukkan alamat e-mail yang valid.',
      'err.password': 'Masukkan kata sandi Anda.',
      'err.otpIncomplete': 'Masukkan 6 digit kode verifikasi.',
      'err.otpWrong': 'Kode salah. Periksa kembali atau kirim ulang kode.',
      'verify.back': 'Kembali',
      'verify.title': 'Verifikasi dua langkah',
      'verify.lead': 'Masukkan 6 digit kode yang kami kirim ke',
      'verify.code': 'Kode verifikasi',
      'verify.digit1': 'Digit 1 dari 6', 'verify.digit2': 'Digit 2 dari 6', 'verify.digit3': 'Digit 3 dari 6',
      'verify.digit4': 'Digit 4 dari 6', 'verify.digit5': 'Digit 5 dari 6', 'verify.digit6': 'Digit 6 dari 6',
      'verify.noCode': 'Tidak menerima kode?',
      'verify.resend': 'Kirim ulang kode',
      'verify.trust': 'Percayai perangkat ini selama 30 hari',
      'verify.submit': 'Verifikasi',
      'verify.helper': 'Demi keamanan, jangan bagikan kode ini kepada siapa pun, termasuk tim {brand}.',
      'done.title': 'Berhasil masuk',
      'done.lead': 'Selamat datang kembali,',
      'done.lead2': 'Beranda Anda sedang disiapkan.',
      'done.preparing': 'Menyiapkan beranda…',
      'done.ready': 'Beranda siap',
      'done.open': 'Buka Beranda',
      'done.notYou': 'Bukan Anda?',
      'done.signout': 'Keluar dan masuk dengan akun lain',
      'live.sent': 'Kode verifikasi dikirim ke {email}.',
      'live.resent': 'Kode baru dikirim ke {email}.',
      'live.done': 'Berhasil masuk. Beranda sedang disiapkan.',
      'live.ready': 'Beranda siap. Pilih Buka Beranda untuk melanjutkan.',
      'live.back': 'Kembali ke halaman masuk.',
      'copy.cred.title': 'Satu platform<br>untuk pertumbuhan<br>bisnis Anda',
      'copy.cred.lead': 'Kelola proyek, keuangan, pembelian, dan operasional dalam satu ekosistem terintegrasi. Dirancang untuk membantu perusahaan Anda melangkah lebih jauh.',
      'copy.cred.f1': 'Kelola lebih efisien', 'copy.cred.f1s': 'Semua proses bisnis dalam satu platform.',
      'copy.cred.f2': 'Kolaborasi tanpa batas', 'copy.cred.f2s': 'Tim lebih terhubung dan produktif.',
      'copy.cred.f3': 'Data selalu aman', 'copy.cred.f3s': 'Keamanan tingkat enterprise untuk bisnis Anda.',
      'copy.verify.title': 'Satu langkah lagi<br>untuk melindungi<br>akun Anda',
      'copy.verify.lead': 'Kode verifikasi memastikan hanya Anda yang dapat membuka data proyek, keuangan, dan pembelian perusahaan.',
      'copy.verify.f1': 'Kode sekali pakai', 'copy.verify.f1s': 'Berlaku 5 menit, hanya untuk sesi ini.',
      'copy.verify.f2': 'Akses diatur {admin}', 'copy.verify.f2s': 'Hubungi {admin} jika Anda kehilangan akses.',
      'copy.verify.f3': 'Perangkat tepercaya', 'copy.verify.f3s': 'Lewati kode di perangkat ini selama 30 hari.',
      'copy.done.title': 'Ruang kerja<br>Anda sudah siap',
      /* r11 review: the done panel promises only what the role's Beranda shows. Owner (02): KPIs of the
         period, running projects, today's actions. A key@<route> variant is used when the signed-in
         role's Beranda is that route (the Admin's is Antrean Tindakan, 06). No approval step exists. */
      'copy.done.lead': 'Ringkasan kinerja dan tindakan hari ini sudah menunggu di Beranda.',
      'copy.done.f1': 'Proyek berjalan', 'copy.done.f1s': 'Progres dan tenggat terbaru setiap proyek.',
      'copy.done.f2': 'Kinerja periode ini', 'copy.done.f2s': 'Penjualan, kas masuk, piutang, dan laba.',
      'copy.done.f3': 'Perlu tindakan', 'copy.done.f3s': 'Hal yang menunggu tindak lanjut Anda hari ini.',
      'copy.done.lead@home.admin': 'Antrean tindakan untuk perusahaan yang Anda kelola sudah menunggu di Beranda.',
      'copy.done.f1@home.admin': 'Proyek & gudang', 'copy.done.f1s@home.admin': 'Reservasi, kekurangan stok, barang masuk dan keluar.',
      'copy.done.f2@home.admin': 'Penagihan & kas', 'copy.done.f2s@home.admin': 'Piutang dan invoice yang perlu ditindaklanjuti.',
      'copy.done.f3@home.admin': 'Dokumen & kasus', 'copy.done.f3s@home.admin': 'PDF yang belum tersedia dan kasus koreksi terbuka.'
    },
    en: {
      'lang.group': 'Language',
      'cred.title': 'Sign in to {brand}',
      'cred.lead': 'Use the account your company {admin} gave you to access every {brand} feature.',
      'cred.email': 'E-mail',
      'cred.emailPh': 'name@company.com',
      'cred.password': 'Password',
      'cred.show': 'Show',
      'cred.hide': 'Hide',
      'cred.showAria': 'Show password',
      'cred.hideAria': 'Hide password',
      'cred.passwordPh': 'Enter your password',
      'cred.submit': 'Sign in',
      'cred.forgot': 'Forgot password?',
      'cred.forgotRest': 'Ask the {admin} for a reset link.',
      'cred.forgotHelp': 'The {admin} can send a reset link from Settings › Users. The link is valid for 30 minutes.',
      'cred.or': 'or',
      'cred.google': 'Continue with Google',
      'cred.helper': 'Only for accounts already linked to Google. On a shared device, sign out of Google when you are done.',
      'err.email': 'Enter a valid e-mail address.',
      'err.password': 'Enter your password.',
      'err.otpIncomplete': 'Enter the 6-digit verification code.',
      'err.otpWrong': 'That code is not right. Check it or resend the code.',
      'verify.back': 'Back',
      'verify.title': 'Two-step verification',
      'verify.lead': 'Enter the 6-digit code we sent to',
      'verify.code': 'Verification code',
      'verify.digit1': 'Digit 1 of 6', 'verify.digit2': 'Digit 2 of 6', 'verify.digit3': 'Digit 3 of 6',
      'verify.digit4': 'Digit 4 of 6', 'verify.digit5': 'Digit 5 of 6', 'verify.digit6': 'Digit 6 of 6',
      'verify.noCode': 'Didn’t get the code?',
      'verify.resend': 'Resend code',
      'verify.trust': 'Trust this device for 30 days',
      'verify.submit': 'Verify',
      'verify.helper': 'For your security, never share this code with anyone, including the {brand} team.',
      'done.title': 'Signed in',
      'done.lead': 'Welcome back,',
      'done.lead2': 'Your home page is being prepared.',
      'done.preparing': 'Preparing home…',
      'done.ready': 'Home is ready',
      'done.open': 'Open Home',
      'done.notYou': 'Not you?',
      'done.signout': 'Sign out and use another account',
      'live.sent': 'A verification code was sent to {email}.',
      'live.resent': 'A new code was sent to {email}.',
      'live.done': 'Signed in. Your home page is being prepared.',
      'live.ready': 'Home is ready. Choose Open Home to continue.',
      'live.back': 'Back to sign in.',
      'copy.cred.title': 'One platform<br>for your<br>business growth',
      'copy.cred.lead': 'Manage projects, finance, purchasing and operations in one integrated ecosystem. Built to help your company go further.',
      'copy.cred.f1': 'Work more efficiently', 'copy.cred.f1s': 'Every business process in one platform.',
      'copy.cred.f2': 'Collaborate without limits', 'copy.cred.f2s': 'A more connected, productive team.',
      'copy.cred.f3': 'Data always secure', 'copy.cred.f3s': 'Enterprise-grade security for your business.',
      'copy.verify.title': 'One more step<br>to protect<br>your account',
      'copy.verify.lead': 'A verification code makes sure only you can open your company’s project, finance and purchasing data.',
      'copy.verify.f1': 'One-time code', 'copy.verify.f1s': 'Valid for 5 minutes, for this session only.',
      'copy.verify.f2': 'Access managed by the {admin}', 'copy.verify.f2s': 'Contact the {admin} if you lose access.',
      'copy.verify.f3': 'Trusted device', 'copy.verify.f3s': 'Skip the code on this device for 30 days.',
      'copy.done.title': 'Your workspace<br>is ready',
      'copy.done.lead': 'Your performance summary and today’s actions are waiting on your Home page.',
      'copy.done.f1': 'Running projects', 'copy.done.f1s': 'Latest progress and deadlines for every project.',
      'copy.done.f2': 'This period', 'copy.done.f2s': 'Sales, cash in, receivables and profit.',
      'copy.done.f3': 'Needs attention', 'copy.done.f3s': 'What is waiting for your follow-up today.',
      'copy.done.lead@home.admin': 'The action queue for the companies you manage is waiting on your Home page.',
      'copy.done.f1@home.admin': 'Projects & warehouse', 'copy.done.f1s@home.admin': 'Reservations, stock shortages, goods in and out.',
      'copy.done.f2@home.admin': 'Billing & cash', 'copy.done.f2s@home.admin': 'Receivables and invoices that need follow-up.',
      'copy.done.f3@home.admin': 'Documents & cases', 'copy.done.f3s@home.admin': 'PDFs not yet available and open correction cases.'
    }
  };
  var lang = 'id';
  /* the signed-in role's Beranda route (project-config navigation), for key@<route> copy variants */
  function homeRoute() {
    var it = window.MCProject && window.MCProject.home ? window.MCProject.home() : null;   /* r12: navigation.home */
    return it && it.route;
  }
  function t(key, vars) {
    var hr = key.indexOf('copy.done.') === 0 && homeRoute(), alt = hr ? key + '@' + hr : null;
    var s = (alt && ((I18N[lang] && I18N[lang][alt]) || I18N.id[alt])) || (I18N[lang] && I18N[lang][key]) || I18N.id[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    /* project values: {brand} etc. from the brand, {admin} / {Admin} from account.adminLabel */
    var adm = window.MCProject && window.MC_PROJECT.account && window.MC_PROJECT.account.adminLabel ? window.MCProject.t(window.MC_PROJECT.account.adminLabel) : 'admin';
    var extra = { admin: adm, Admin: adm.charAt(0).toUpperCase() + adm.slice(1) };
    return window.MCBrand ? window.MCBrand.fill(s, extra) : s.replace(/\{(admin|Admin)\}/g, function (m, k) { return extra[k]; });
  }
  function applyLang(next) {
    lang = I18N[next] ? next : 'id';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i > 0) el.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim()));
      });
    });
    document.querySelectorAll('.login-lang [data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    syncReveal();
    updateResend();
    if (handoffDone) setHandoff(100);
    var page = lang === 'en' ? 'Sign in' : 'Masuk';
    document.title = window.MCBrand ? window.MCBrand.title(page) : page;
  }

  /* ---------------------------------------------------------------------------
     2. Geometry, easing, frame renderer (single progress variable)
     ------------------------------------------------------------------------- */
  // cubic-bezier(.42, 0, .58, 1) (CSS ease-in-out; REF-V1 T1 fit 0.18 px RMS)
  function bezier(x1, y1, x2, y2) {
    function a(p1, p2) { return 1 - 3 * p2 + 3 * p1; }
    function b(p1, p2) { return 3 * p2 - 6 * p1; }
    function c(p1) { return 3 * p1; }
    function calc(tt, p1, p2) { return ((a(p1, p2) * tt + b(p1, p2)) * tt + c(p1)) * tt; }
    function slope(tt, p1, p2) { return 3 * a(p1, p2) * tt * tt + 2 * b(p1, p2) * tt + c(p1); }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var tt = x;
      for (var i = 0; i < 8; i++) {
        var s = slope(tt, x1, x2);
        if (Math.abs(s) < 1e-6) break;
        var e = calc(tt, x1, x2) - x;
        tt -= e / s;
      }
      var lo = 0, hi = 1;
      if (Math.abs(calc(tt, x1, x2) - x) > 1e-5) {
        tt = x;
        for (var j = 0; j < 30; j++) {
          var v = calc(tt, x1, x2);
          if (Math.abs(v - x) < 1e-6) break;
          if (v < x) lo = tt; else hi = tt;
          tt = (lo + hi) / 2;
        }
      }
      return calc(tt, y1, y2);
    };
  }
  var ease = bezier(0.42, 0, 0.58, 1);
  var PARALLAX = 2;      // owner decision 5: copy moves at 2x the panel displacement

  function cssMs(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var n = parseFloat(v);
    if (!isFinite(n)) return fallback;
    return /ms$/.test(v) ? n : (/s$/.test(v) ? n * 1000 : n);
  }
  var DURATION = cssMs('--mc-dur-auth-step', 600);
  var REDUCED = cssMs('--mc-dur-reduced', 150);

  var art = visual.querySelector('.login-scene__art');
  function geom() {
    var W = card.clientWidth, H = card.clientHeight;
    var cs = getComputedStyle(card);
    var split = W * 13 / 24;
    var ear = parseFloat(cs.getPropertyValue('--login-ear')) || 12;
    // r4: the scene is laid out in REF px x the scene unit (viewport fit), read from the art's width.
    var s = art ? (art.getBoundingClientRect().width / 1336 || 1) : 1;
    // The REF-M2 photo ends at the split line (narrower cards: up to 48 px past it, under the
    // sheet, see --login-art-shift); the verification panel starts after the band where the
    // building's edge fades into sky, so no photo fragment shows at rest.
    var dissolve = 66 * s;
    var colW = parseFloat(cs.getPropertyValue('--login-col-w')) || 487;
    var langR = (parseFloat(cs.getPropertyValue('--login-lang-r')) || 6.53) / 100;
    var shift = 0;
    if (art) shift = Math.max(0, art.getBoundingClientRect().left - card.getBoundingClientRect().left - (split - 723.67 * s));
    return { W: W, H: H, split: split, ear: ear, dissolve: dissolve, colW: colW, langR: langR, shift: shift };
  }
  // Rest geometry of each step: visual clip [L, R] + inner ears, form slot [x, x + w].
  function rest(step, g) {
    if (step === 'verify') {
      var vl = g.split + g.shift + g.dissolve;
      return { L: vl, R: g.W, rL: g.ear, rR: 0, x: 0, w: vl };
    }
    return { L: 0, R: g.split, rL: 0, rR: g.ear, x: g.split, w: g.W - g.split };
  }
  function n2(v) { return Math.round(v * 100) / 100; }
  function clipPath(L, R, rL, rR, H) {
    return 'path("M' + n2(L - rL) + ' 0H' + n2(R + rR) +
      'A' + n2(rR) + ' ' + n2(rR) + ' 0 0 0 ' + n2(R) + ' ' + n2(rR) +
      'V' + n2(H - rR) + 'A' + n2(rR) + ' ' + n2(rR) + ' 0 0 0 ' + n2(R + rR) + ' ' + n2(H) +
      'H' + n2(L - rL) + 'A' + n2(rL) + ' ' + n2(rL) + ' 0 0 0 ' + n2(L) + ' ' + n2(H - rL) +
      'V' + n2(rL) + 'A' + n2(rL) + ' ' + n2(rL) + ' 0 0 0 ' + n2(L - rL) + ' 0Z")';
  }

  var current = 'credentials';
  var running = null;     // { from, to, raf, resolve, start, p }

  function setHidden(el, hide) { if (el) { if (hide) el.setAttribute('hidden', ''); else el.removeAttribute('hidden'); } }
  function setInert(el, on) { if (el) { el.inert = !!on; if (on) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden'); } }

  // Rest state (no animation): CSS positions + the ear path.
  function applyRest(step) {
    compactClear();
    card.classList.remove('is-animating');
    card.dataset.step = step === 'done' ? 'done' : step;
    card.style.removeProperty('--login-p');
    card.style.removeProperty('--login-e');
    slot.style.transform = '';
    slot.style.width = '';
    if (langEl) { langEl.style.left = ''; langEl.style.right = ''; }
    STEPS.forEach(function (s) {
      setHidden(stepEls[s], s !== step);
      setInert(stepEls[s], s !== step);
      if (copyEls[s]) { setHidden(copyEls[s], s !== step); copyEls[s].style.transform = ''; }
    });
    restClip();
  }
  function restClip() {
    if (running) return;
    if (mqNarrow.matches) { visual.style.clipPath = ''; return; }
    var g = geom(), r = rest(current, g);
    visual.style.clipPath = clipPath(r.L, r.R, r.rL, r.rR, g.H);
  }

  /* r2: compact step change for the single-column layout (<= 1024 px; phones and tablets).
     REF-V1 principles without the split-panel geometry: the old step leaves (opacity + 24 px
     toward the exit side) over 0-45 %, both are hidden 45-55 % and the swap happens at 50 %,
     the new step enters from the other side over 55-100 %; the visual card's copy travels 2x
     (48 px, the V1 copy parallax); the card image never moves. One clock:
     --mc-dur-auth-compact (480 ms) on the standard curve. Reduced motion keeps the 150 ms
     fade-through. */
  var COMPACT_MS = cssMs('--mc-dur-auth-compact', 480);
  function compactStyle(step, q, side) {
    var tx = (1 - q) * side;
    if (stepEls[step]) { stepEls[step].style.opacity = String(q); stepEls[step].style.transform = 'translateX(' + (tx * 24).toFixed(2) + 'px)'; }
    if (copyEls[step]) { copyEls[step].style.opacity = String(q); copyEls[step].style.transform = 'translateX(' + (tx * 48).toFixed(2) + 'px)'; }
  }
  function compactClear() {
    STEPS.forEach(function (s) {
      [stepEls[s], copyEls[s]].forEach(function (el) { if (el) { el.style.opacity = ''; el.style.transform = ''; } });
    });
  }
  function compactFrame(from, to, p) {
    var dir = STEPS.indexOf(to) > STEPS.indexOf(from) ? 1 : -1;
    if (p < 0.5) {
      if (card.dataset.step !== from) applyRest(from);
      compactStyle(from, p >= 0.45 ? 0 : 1 - ease(p / 0.45), -dir);
    } else {
      if (card.dataset.step !== to) { current = to; applyRest(to); }
      compactStyle(to, p <= 0.55 ? 0 : ease((p - 0.55) / 0.45), dir);
    }
  }
  function compactPlay(from, to) {
    return new Promise(function (resolve) {
      var r = { from: from, to: to, resolve: resolve, start: null, raf: 0 };
      running = r;
      function tick(now) {
        if (running !== r) return;
        if (r.start === null) r.start = now;
        var p = Math.min(1, (now - r.start) / COMPACT_MS);
        compactFrame(from, to, p);
        if (p < 1) { r.raf = requestAnimationFrame(tick); return; }
        running = null;
        current = to;
        applyRest(to);
        afterStep(to);
        resolve(true);
      }
      r.raf = requestAnimationFrame(tick);
    });
  }

  // One frame of a step change at TIME progress p (0..1).
  function frame(from, to, p, gIn) {
    var g = gIn || geom(), A = rest(from, g), B = rest(to, g);
    var e = ease(p);
    function mix(k) { return A[k] + (B[k] - A[k]) * e; }
    var L = mix('L'), R = mix('R');
    card.classList.add('is-animating');
    card.style.setProperty('--login-p', p.toFixed(4));
    card.style.setProperty('--login-e', e.toFixed(4));
    visual.style.clipPath = clipPath(L, R, mix('rL'), mix('rR'), g.H);
    slot.style.transform = 'translateX(' + n2(mix('x')) + 'px)';
    slot.style.width = n2(mix('w')) + 'px';
    // The language toggle travels rigidly with the form content of the visible step (it is
    // repositioned at the hidden swap), so it is covered over the same window as the content.
    if (langEl) {
      var tw = langEl.offsetWidth || 98;
      var ts = e >= 0.5 ? to : from, Rt = e >= 0.5 ? B : A;
      var colW = Math.min(g.colW, Rt.w - 48);
      var tl = ts === 'verify' ? (Rt.w + colW) / 2 - tw : Rt.w * (1 - g.langR) - tw;
      langEl.style.right = 'auto';
      langEl.style.left = n2(tl) + 'px';
    }
    // Hidden swap: content changes at e = 0.5 while the slot is fully covered.
    var showTo = e >= 0.5;
    STEPS.forEach(function (s) {
      var on = showTo ? s === to : s === from;
      setHidden(stepEls[s], !on);
      setInert(stepEls[s], true);
    });
    // Copy parallax: opposite to the clip at 2x the panel's travel. The travel is read on the
    // panel's right edge, which always moves exactly one sheet width (612 px), the analogue of
    // REF-V1's half-container travel (the left edge also covers the 66 px dissolve band).
    STEPS.forEach(function (s) {
      var el = copyEls[s];
      if (!el) return;
      if (s === from || s === to) {
        var Rs = s === from ? A : B;
        setHidden(el, false);
        el.style.transform = 'translate3d(' + n2(-PARALLAX * (R - Rs.R)) + 'px,0,0)';
      } else {
        setHidden(el, true);
      }
    });
  }

  function slides(from, to) {
    var g = geom();
    return !mqNarrow.matches && rest(from, g).L !== rest(to, g).L;
  }

  function cancelRunning(finishTo) {
    if (!running) return;
    cancelAnimationFrame(running.raf);
    var r = running; running = null;
    if (finishTo) { current = r.to; applyRest(r.to); }
    if (r.resolve) r.resolve(false);
  }

  /* Fade-through (reduced motion, narrow layout, same-position steps), 150 ms linear in total:
     a static ghost of the old state covers the new one; its content (steps, copy, toggle, and the
     photo panel when the panel changes side) fades out over the first half, so the ghost becomes
     the bare sheet-coloured card; then the ghost fades out over the second half to reveal the new
     state. Text never sits on text or on the old photo (x-login: the plain crossfade double-exposed
     both layouts). */
  function ghostInner(ghost, withScene) {
    return ghost.querySelectorAll('.login-step, .login-copy, .login-lang' + (withScene ? ', .login-visual' : ''));
  }
  function sceneMoves(from, to) { var g = geom(); return !mqNarrow.matches && rest(from, g).L !== rest(to, g).L; }
  function setFade(ghost, p, withScene) {
    var inner = p < 0.5 ? 1 - 2 * p : 0;
    ghostInner(ghost, withScene).forEach(function (el) { el.style.opacity = String(inner); });
    ghost.style.opacity = String(p < 0.5 ? 1 : 2 - 2 * p);
  }
  var fading = 0;
  function makeGhost() {
    var ghost = card.cloneNode(true);
    ghost.classList.add('login-card--ghost');
    ghost.removeAttribute('id');
    ghost.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    ghost.setAttribute('aria-hidden', 'true');
    ghost.inert = true;
    // carry over typed values so the ghost matches what was on screen
    var srcInputs = card.querySelectorAll('input'), dstInputs = ghost.querySelectorAll('input');
    for (var i = 0; i < srcInputs.length && i < dstInputs.length; i++) {
      dstInputs[i].value = srcInputs[i].value;
      if (srcInputs[i].type === 'checkbox') dstInputs[i].checked = srcInputs[i].checked;
    }
    card.parentNode.appendChild(ghost);
    return ghost;
  }
  function removeGhosts() {
    document.querySelectorAll('.login-card--ghost').forEach(function (g) { g.remove(); });
  }
  function crossfade(from, to, ms) {
    var withScene = sceneMoves(from, to);
    fading++;
    return new Promise(function (resolve) {
      removeGhosts();
      var ghost = makeGhost();
      current = to;
      applyRest(to);
      ghostInner(ghost, withScene).forEach(function (el) {
        el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms / 2, easing: 'linear', fill: 'forwards' });
      });
      var anim = ghost.animate([{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: ms, easing: 'linear', fill: 'forwards' });
      anim.onfinish = function () { ghost.remove(); fading--; resolve(true); };
      anim.oncancel = function () { ghost.remove(); fading--; resolve(false); };
    });
  }

  function play(from, to) {
    from = STEPS.indexOf(from) >= 0 ? from : current;
    if (STEPS.indexOf(to) < 0 || from === to) return Promise.resolve(false);
    cancelRunning(false);
    if (current !== from) { current = from; applyRest(from); }
    preStep(to);
    if (!mqReduce.matches && mqNarrow.matches) return compactPlay(from, to);
    if (mqReduce.matches || !slides(from, to)) {
      var ms = mqReduce.matches || mqNarrow.matches ? REDUCED : cssMs('--mc-dur-base', 240);
      return crossfade(from, to, ms).then(function (ok) { afterStep(to); return ok; });
    }
    return new Promise(function (resolve) {
      var r = { from: from, to: to, resolve: resolve, start: null, raf: 0, g: geom() };   // geometry read once per transition
      running = r;
      function tick(now) {
        if (running !== r) return;
        if (r.start === null) r.start = now;
        var p = Math.min(1, (now - r.start) / DURATION);
        frame(from, to, p, r.g);
        if (p < 1) { r.raf = requestAnimationFrame(tick); return; }
        running = null;
        current = to;
        applyRest(to);
        afterStep(to);
        resolve(true);
      }
      r.raf = requestAnimationFrame(tick);
    });
  }

  function seek(from, to, p) {
    cancelRunning(false);
    if (STEPS.indexOf(from) < 0 || STEPS.indexOf(to) < 0) return;
    p = Math.max(0, Math.min(1, Number(p) || 0));
    removeGhosts();
    current = from;
    if (p >= 1) { current = to; applyRest(to); prepareStep(to, true); return; }
    applyRest(from);
    if (p <= 0) return;
    preStep(to);
    if (!mqReduce.matches && mqNarrow.matches) { compactFrame(from, to, p); return; }
    if (mqReduce.matches || !slides(from, to)) {
      // reduced motion: the 150 ms linear fade-through frozen at p
      var ghost = makeGhost();
      current = to;
      applyRest(to);
      setFade(ghost, p, sceneMoves(from, to));
      return;
    }
    frame(from, to, p);
  }

  function show(step) {
    if (STEPS.indexOf(step) < 0) return;
    cancelRunning(false);
    removeGhosts();
    current = step;
    applyRest(step);
    prepareStep(step, true);
  }

  /* ---------------------------------------------------------------------------
     3. Credentials step
     ------------------------------------------------------------------------- */
  var form = document.getElementById('login-form');
  var email = document.getElementById('login-email');
  var password = document.getElementById('login-password');
  var submit = document.getElementById('login-submit');
  var google = document.getElementById('login-google');
  var revealBtns = card.querySelectorAll('[data-reveal]');
  var forgotBtn = card.querySelector('.login-forgot__link[aria-controls="login-forgot-help"]');
  var forgotHelp = document.getElementById('login-forgot-help');
  var forgotRest = card.querySelector('.login-forgot__rest');

  // Clicking the field shell (icon, padding) focuses its input.
  card.querySelectorAll('.login-input').forEach(function (shell) {
    shell.addEventListener('mousedown', function (ev) {
      if (ev.target.closest('button, input')) return;
      var input = shell.querySelector('input');
      if (input) { ev.preventDefault(); input.focus(); }
    });
  });

  /* r11: ONE reveal control per field (the in-field eye, as on 05); its name and pressed state follow */
  var revealed = false;
  function syncReveal() {
    if (!password) return;
    password.type = revealed ? 'text' : 'password';
    revealBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', String(revealed));
      b.setAttribute('aria-label', t(revealed ? 'cred.hideAria' : 'cred.showAria'));
    });
  }
  revealBtns.forEach(function (b) {
    b.addEventListener('click', function () { revealed = !revealed; syncReveal(); });
  });

  if (forgotBtn && forgotHelp) {
    forgotBtn.addEventListener('click', function () {
      var open = forgotBtn.getAttribute('aria-expanded') === 'true';
      forgotBtn.setAttribute('aria-expanded', String(!open));
      setHidden(forgotHelp, open);
      setHidden(forgotRest, !open);      // the help replaces "Minta tautan..." in the same line box
      if (!open) { forgotHelp.classList.remove('mc-validation-in'); void forgotHelp.offsetWidth; forgotHelp.classList.add('mc-validation-in'); }
    });
  }

  function fieldError(input, errEl, key) {
    if (!input || !errEl) return;
    if (key) {
      errEl.textContent = t(key);
      setHidden(errEl, false);
      errEl.classList.remove('mc-validation-in'); void errEl.offsetWidth; errEl.classList.add('mc-validation-in');
      input.setAttribute('aria-invalid', 'true');
    } else {
      errEl.textContent = '';
      setHidden(errEl, true);
      input.removeAttribute('aria-invalid');
    }
  }
  var emailErr = document.getElementById('login-email-error');
  var passErr = document.getElementById('login-password-error');
  [email, password].forEach(function (inp) {
    if (inp) inp.addEventListener('input', function () { fieldError(inp, inp === email ? emailErr : passErr, null); });
  });

  function maskEmail(v) {
    v = (v || '').trim();
    var m = /^([^@\s])[^@\s]*@([^@\s]+)$/.exec(v);
    if (!m) return lang === 'en' ? 'n•••@company.com' : 'n•••@perusahaan.com';
    return m[1] + '•••@' + m[2];
  }
  function setMasked() {
    var masked = maskEmail(email && email.value);
    card.querySelectorAll('[data-masked-email]').forEach(function (el) { el.textContent = masked; });
    return masked;
  }

  function busy(btn, on) {
    if (!btn) return;
    if (on) { btn.setAttribute('aria-busy', 'true'); btn.setAttribute('aria-disabled', 'true'); }
    else { btn.removeAttribute('aria-busy'); btn.removeAttribute('aria-disabled'); }
  }
  // Simulated server: responds after ~400 ms; the panel transition starts on the response.
  function server(ms) { return new Promise(function (res) { setTimeout(res, ms || 400); }); }

  var pending = false;
  function toVerify(btn) {
    if (pending) return;
    pending = true;
    busy(btn, true);
    setMasked();
    server(400).then(function () { return play('credentials', 'verify'); })
      .then(function () { busy(btn, false); pending = false; });
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (pending) return;
      var okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((email.value || '').trim());
      var okPass = (password.value || '').length > 0;
      fieldError(email, emailErr, okEmail ? null : 'err.email');
      fieldError(password, passErr, okPass ? null : 'err.password');
      if (!okEmail) { email.focus(); return; }
      if (!okPass) { password.focus(); return; }
      toVerify(submit);
    });
  }
  if (google) google.addEventListener('click', function () { toVerify(google); });

  /* ---------------------------------------------------------------------------
     4. Verification step (OTP)
     ------------------------------------------------------------------------- */
  var vform = document.getElementById('verify-form');
  var otpWrap = document.getElementById('login-otp');
  var cells = otpWrap ? Array.prototype.slice.call(otpWrap.querySelectorAll('.login-otp__cell')) : [];
  var vErr = document.getElementById('verify-error');
  var vSubmit = document.getElementById('verify-submit');
  var resendBtn = document.getElementById('login-resend');
  var resendCount = document.getElementById('login-resend-count');

  function code() { return cells.map(function (c) { return c.value; }).join(''); }
  function markCells() { cells.forEach(function (c) { c.classList.toggle('is-filled', c.value !== ''); }); }
  function otpError(key) {
    if (!vErr || !otpWrap) return;
    if (key) {
      vErr.textContent = t(key); setHidden(vErr, false);
      vErr.classList.remove('mc-validation-in'); void vErr.offsetWidth; vErr.classList.add('mc-validation-in');
      otpWrap.dataset.invalid = 'true';
      cells.forEach(function (c) { c.setAttribute('aria-invalid', 'true'); });
    } else {
      vErr.textContent = ''; setHidden(vErr, true);
      delete otpWrap.dataset.invalid;
      cells.forEach(function (c) { c.removeAttribute('aria-invalid'); });
    }
  }
  function fillFrom(index, digits) {
    var i = index;
    for (var k = 0; k < digits.length && i < cells.length; k++, i++) cells[i].value = digits[k];
    markCells();
    cells[Math.min(i, cells.length - 1)].focus();
  }
  cells.forEach(function (cell, i) {
    cell.addEventListener('input', function () {
      var digits = cell.value.replace(/\D/g, '');
      otpError(null);
      if (digits.length > 1) { cell.value = ''; fillFrom(i, digits); return; }   // autofill / IME
      cell.value = digits;
      markCells();
      if (digits && i < cells.length - 1) cells[i + 1].focus();
    });
    cell.addEventListener('keydown', function (ev) {
      if (ev.key === 'Backspace' && !cell.value && i > 0) {
        ev.preventDefault(); cells[i - 1].value = ''; markCells(); cells[i - 1].focus();
      } else if (ev.key === 'ArrowLeft' && i > 0) { ev.preventDefault(); cells[i - 1].focus(); }
      else if (ev.key === 'ArrowRight' && i < cells.length - 1) { ev.preventDefault(); cells[i + 1].focus(); }
    });
    cell.addEventListener('focus', function () { cell.select(); });
    cell.addEventListener('paste', function (ev) {
      var text = (ev.clipboardData || window.clipboardData).getData('text') || '';
      var digits = text.replace(/\D/g, '').slice(0, cells.length);
      if (!digits) return;
      ev.preventDefault();
      otpError(null);
      fillFrom(i, digits);
    });
  });

  var resendLeft = 0, resendTimer = 0;
  function updateResend() {
    if (!resendBtn) return;
    resendBtn.disabled = resendLeft > 0;
    if (resendCount) resendCount.textContent = resendLeft > 0 ? '(0:' + String(resendLeft).padStart(2, '0') + ')' : '';
  }
  function startResend(sec) {
    clearInterval(resendTimer);
    resendLeft = sec;
    updateResend();
    resendTimer = setInterval(function () {
      resendLeft = Math.max(0, resendLeft - 1);
      updateResend();
      if (!resendLeft) clearInterval(resendTimer);
    }, 1000);
  }
  if (resendBtn) resendBtn.addEventListener('click', function () {
    if (resendLeft > 0) return;
    announce(t('live.resent', { email: setMasked() }));
    startResend(30);
    if (cells[0]) cells[0].focus();
  });

  function clearOtp(fade) {
    function wipe() { cells.forEach(function (c) { c.value = ''; }); markCells(); }
    if (!fade || mqReduce.matches) { wipe(); return; }
    var anims = cells.map(function (c) { return c.animate([{ color: getComputedStyle(c).color }, { color: 'transparent' }], { duration: 160, easing: 'linear' }); });
    anims[0].onfinish = wipe;
  }

  if (vform) {
    vform.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (pending) return;
      var c = code();
      if (c.length < cells.length) { otpError('err.otpIncomplete'); cells[Math.max(0, c.length)].focus(); return; }
      pending = true;
      busy(vSubmit, true);
      server(400).then(function () {
        if (c === '000000') {               // demo path for the error state
          busy(vSubmit, false); pending = false;
          otpError('err.otpWrong'); clearOtp(true);
          setTimeout(function () { cells[0].focus(); }, 170);
          return;
        }
        return play('verify', 'done').then(function () { busy(vSubmit, false); pending = false; });
      });
    });
  }

  card.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-action]');
    if (!b || pending) return;
    if (b.dataset.action === 'back') { play('verify', 'credentials'); }
    if (b.dataset.action === 'signout') { resetAll(); play('done', 'credentials'); }
  });

  /* ---------------------------------------------------------------------------
     5. Authenticated step
     ------------------------------------------------------------------------- */
  /* r11: "Buka Beranda" opens the signed-in role's Beranda (project-config navigation: the Admin's is
     Antrean Tindakan), never one fixed page; the markup href is only the no-JS fallback. */
  var homeLink = document.getElementById('login-home');
  var homeItem = window.MCProject && window.MCProject.home ? window.MCProject.home() : null;   /* r12: navigation.home */
  if (homeLink && homeItem && homeItem.href) homeLink.setAttribute('href', homeItem.href);

  var handoffBar = document.getElementById('login-handoff-bar');
  var handoffLabel = document.getElementById('login-handoff-label');
  var handoffValue = document.getElementById('login-handoff-value');
  var handoffTimer = 0, handoffDone = false;
  function setHandoff(v) {
    if (!handoffBar) return;
    handoffBar.style.setProperty('--value', v + '%');
    handoffBar.setAttribute('aria-valuenow', String(v));
    if (handoffValue) handoffValue.textContent = v + '%';
    if (handoffLabel) handoffLabel.textContent = t(v >= 100 ? 'done.ready' : 'done.preparing');
  }
  function runHandoff(instant) {
    clearInterval(handoffTimer);
    handoffDone = false;
    if (instant) { handoffDone = true; setHandoff(100); return; }
    var v = 0;
    setHandoff(0);
    handoffTimer = setInterval(function () {
      v = Math.min(100, v + (v < 60 ? 9 : v < 90 ? 6 : 4));
      setHandoff(v);
      if (v >= 100) { clearInterval(handoffTimer); handoffDone = true; announce(t('live.ready')); }
    }, 90);
  }

  function resetAll() {
    clearInterval(handoffTimer); clearInterval(resendTimer);
    cells.forEach(function (c) { c.value = ''; }); markCells(); otpError(null);
    if (password) password.value = '';
    revealed = false; syncReveal();
  }

  /* ---------------------------------------------------------------------------
     6. Step lifecycle: focus, announcements, timers
     ------------------------------------------------------------------------- */
  function announce(msg) {
    if (!live) return;
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 30);
  }
  // Content set-up before the step becomes visible (runs before the first frame).
  function preStep(step) {
    if (step === 'verify') { setMasked(); if (!resendLeft) startResend(30); }
    if (step === 'done') {
      setMasked();
      clearInterval(handoffTimer); handoffDone = false; setHandoff(0);
      var disc = card.querySelector('.login-done__disc');
      if (disc) { disc.classList.remove('is-entering'); disc.classList.add('is-waiting'); }
    }
  }
  // Instant show (?step=, mcAuth.show) or the end of a transition.
  function prepareStep(step, instant) {
    preStep(step);
    if (step === 'done') {
      var disc = card.querySelector('.login-done__disc');
      if (disc) {
        disc.classList.remove('is-waiting');
        if (!instant) { void disc.offsetWidth; disc.classList.add('is-entering'); }
      }
      runHandoff(instant);
    }
  }
  function afterStep(step) {
    prepareStep(step, false);
    if (step === 'verify') { if (cells[0]) cells[0].focus(); announce(t('live.sent', { email: setMasked() })); }
    if (step === 'done') { var h = document.getElementById('done-title'); if (h) h.focus(); announce(t('live.done')); }
    if (step === 'credentials') { clearInterval(resendTimer); resendLeft = 0; updateResend(); if (email) email.focus(); }
  }

  /* ---------------------------------------------------------------------------
     7. Language toggle, resize, init
     ------------------------------------------------------------------------- */
  card.querySelectorAll('.login-lang [data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });

  if (window.ResizeObserver) new ResizeObserver(function () { restClip(); }).observe(card);
  else window.addEventListener('resize', restClip);
  mqNarrow.addEventListener && mqNarrow.addEventListener('change', restClip);

  window.mcAuth = {
    steps: STEPS.slice(),
    duration: DURATION,
    ease: ease,
    get step() { return current; },
    get busy() { return !!running || fading > 0 || pending; },
    show: show,
    play: play,
    seek: seek
  };

  var params = new URLSearchParams(location.search);
  /* r6: the first language is the project default (project-config.js locale.default); ?lang= wins */
  var qLang = params.get('lang');
  var defLang = (window.MC_PROJECT && window.MC_PROJECT.locale && window.MC_PROJECT.locale.default) || 'id';
  applyLang(qLang === 'en' || qLang === 'id' ? qLang : defLang);
  /* r6: after a confirmed sign-out the Login says so once (polite toast; nothing to act on) */
  if (params.get('signedout')) setTimeout(function () {
    if (window.MCToast) window.MCToast.info(lang === 'en' ? 'You have signed out' : 'Anda telah keluar', lang === 'en' ? 'Sign in again to continue.' : 'Masuk lagi untuk melanjutkan.');
  }, 400);
  var initial = params.get('step');
  show(STEPS.indexOf(initial) >= 0 ? initial : 'credentials');
})();


/* ===== Pages: Owner Dashboard (02) and Create Purchase (03) ===== */
/* r13 (persistent shell): moved to page modules so the router can mount them again after an in-place
   page swap: assets/js/modules/beranda.js (02, window.MCDashboard; its pure chart helpers still export
   to Node) and assets/js/modules/pembelian-baru.js (03, window.MCPurchase). */


/* ===== Page: Motion Study (04) + command palette (02, 03) ===== */
/* =============================================================================
   MULTIPLECORP motion study (pages/04-motion-study.html), label b-motion.
   Runs on <body data-page="motion"> (every pattern) and, since c-merge, on
   data-page="dashboard" | "purchase" for the command palette only (STUDY = false):
     - the palette template is built from PALETTE_TPL (same markup as the
       <template id="ms-tpl-palette"> in 04) and its results come from appPalette(page):
       page actions, the cards on the page, 02 <-> 03 navigation and sign-out (01);
     - the page layer and the toast region are appended to <body> on first use, so a page
       that never opens the palette renders exactly as before;
     - triggers: Ctrl/Cmd+K and search submit (shell 'mc:command'), typing in or clicking
       the top-bar search; the stage patterns (sections 7-10) find no markup and stay idle.

   Engine: every pattern is a list of WAAPI specs {el, kf, opt} built from the motion
   tokens in tokens.css (read at run time, so the page follows any token change).
   A Timeline plays, reverses (interrupt) or seeks those specs on one clock.
   Reduced motion (prefers-reduced-motion, or the page's "Mode gerak" toggle) swaps every
   recipe for a 150 ms linear opacity crossfade with no stagger, no transform, no clip.

   Public API (frame capture and wiring into pages 02 / 03):
     mcMotion.open(name)                    open (overlays: interactive page instance)
     mcMotion.close(name)                   close / reverse
     mcMotion.seek(name, p, {where})        freeze the open timeline at progress p (0..1)
     mcMotion.seekTime(name, ms, {where})   same, at an elapsed time in ms
     mcMotion.play(name)                    replay the stage demo
     mcMotion.duration(name)                total ms of the open timeline (current mode)
     mcMotion.rest()                        every demo back to its rest state
     mcMotion.setReduced(true|false|null)   force reduced / full / follow the system
     mcMotion.toast(title, meta, {region})  status toast (page region by default)
   names: palette, dialog, drawer, panel, tabs, feedback, stagger, status, auth.
   where: 'stage' (default when the card has a stage instance) or 'page'.
   ============================================================================= */
(function () {
  'use strict';
  if (typeof document === 'undefined' || !document.body) return;
  var PAGE = document.body.dataset.page;
  if (!PAGE || PAGE === 'login') return;
  var STUDY = PAGE === 'motion';           /* false: command palette only (every app page with the shell, r10) */
  if (!STUDY && !document.querySelector('[data-shell]')) return;

  var doc = document;
  var html = doc.documentElement;

  /* ---------------------------------------------------------------------------
     0. Extra icons (namespace i-ms-), injected into the shared sprite.
     ------------------------------------------------------------------------- */
  var ICONS = {
    'ms-rotate': '<path d="M4 4.75v4.5h4.5"/><path d="M4.4 9.25A8 8 0 1 1 4.6 15"/>',
    'ms-curve': '<path d="M3.75 3.75v16.5h16.5"/><path d="M6.5 17.5c5.5 0 6-11 13-11"/>',
    'ms-list': '<path d="M4 6h8.5"/><path d="M7.5 12h9"/><path d="M11 18h9"/>',
    'ms-reduce': '<circle cx="12" cy="12" r="8.25"/><path d="M12 3.75v16.5"/><path d="M12 8h5.6"/><path d="M12 12h8.25"/><path d="M12 16h5.6"/>',
    'ms-layers': '<rect x="2.75" y="4.25" width="18.5" height="15.5" rx="2.5"/><rect x="7.25" y="8.5" width="9.5" height="7" rx="1.5"/>',
    'ms-panel-right': '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M14.25 3.5v17"/>',
    'ms-tabs': '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9.5h18"/><path d="M9 4.5v5"/><path d="M15 4.5v5"/>',
    'ms-pointer': '<path d="M5.25 3.75l13 6.9-5.9 1.6-2.7 5.9z"/><path d="M13.6 13.6l4.65 4.65"/>',
    'ms-minus': '<path d="M5 12h14"/>',
    'ms-return': '<path d="M19.25 5.5v6a3 3 0 0 1-3 3H5.75"/><path d="M9.75 10.25l-4.25 4.25 4.25 4.25"/>'
  };
  (function injectIcons() {
    var sprite = doc.getElementById('mc-icon-sprite');
    if (!sprite) return;
    var defs = sprite.querySelector('defs') || sprite;
    var out = '';
    Object.keys(ICONS).forEach(function (id) {
      if (doc.getElementById('i-' + id)) return;
      out += '<symbol id="i-' + id + '" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' + ICONS[id] + '</g></symbol>';
    });
    if (out) {
      var tmp = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      tmp.innerHTML = out;
      while (tmp.firstChild) defs.appendChild(tmp.firstChild);
    }
  })();

  function icon(name, cls) {
    return '<svg class="mc-icon ' + (cls || 'mc-icon--16') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function who() { return (window.MC_PROJECT && window.MC_PROJECT.user && window.MC_PROJECT.user.name) || ''; }   /* r7: the project user */

  /* ---------------------------------------------------------------------------
     1. Tokens (tokens.css) -> numbers and easing strings
     ------------------------------------------------------------------------- */
  var cs = getComputedStyle(html);
  function tok(name) { return cs.getPropertyValue(name).trim(); }
  function msTok(name, fb) {
    var v = tok(name), n = parseFloat(v);
    if (isNaN(n)) return fb;
    return /ms$/.test(v) ? n : (/s$/.test(v) ? n * 1000 : n);
  }
  function numTok(name, fb) { var n = parseFloat(tok(name)); return isNaN(n) ? fb : n; }
  function easeTok(name, fb) { return tok(name) || fb; }

  var T = {
    instant: msTok('--mc-dur-instant', 80),
    fast: msTok('--mc-dur-fast', 160),
    base: msTok('--mc-dur-base', 240),
    moderate: msTok('--mc-dur-moderate', 320),
    slow: msTok('--mc-dur-slow', 400),
    auth: msTok('--mc-dur-auth-step', 600),
    reduced: msTok('--mc-dur-reduced', 150),
    standard: easeTok('--mc-ease-standard', 'cubic-bezier(0.42, 0, 0.58, 1)'),
    enter: easeTok('--mc-ease-enter', 'cubic-bezier(0, 0, 0.2, 1)'),
    reveal: easeTok('--mc-ease-reveal', 'cubic-bezier(0.25, 1, 0.5, 1)'),
    exit: easeTok('--mc-ease-exit', 'cubic-bezier(0.37, 0, 0.63, 1)'),
    linear: 'linear',
    tight: msTok('--mc-stagger-tight', 30),
    row: msTok('--mc-stagger-row', 40),
    card: msTok('--mc-stagger-card', 60),
    steps: numTok('--mc-stagger-max-steps', 8),
    contentOffset: msTok('--mc-content-offset', 120),
    enterScale: numTok('--mc-enter-scale', 0.97),
    exitScale: numTok('--mc-exit-scale', 0.98),
    rise: numTok('--mc-enter-rise', 8),
    itemRise: numTok('--mc-item-rise', 4),
    blur: numTok('--mc-item-blur', 3),
    press: numTok('--mc-press-scale', 0.97),
    lime150: tok('--color-lime-150') || '#ecf1d2',
    olive: tok('--color-accent-olive') || '#545e21'
  };
  /* Proposal-level numbers that have no token yet (documented in the report). */
  var P = {
    panelDelay: 90,          /* side panel starts 90 ms after the selection ring (V2-U35: 92 ms) */
    panelContent: 160,       /* panel content starts 160 ms after the click (motion analysis 4.4) */
    paletteChrome: 160,      /* input chrome after the container is ~87 % open */
    paletteHighlight: 200,   /* highlight leads the first row (V2-U13: ~85 ms before row ink) */
    paletteRows: 240,        /* first result row */
    tabsEnter: 200,          /* new tab content starts while the old one is ~93 % gone */
    tabStretch: 0.08,        /* +8 % pill stretch at mid travel (V2: +20-25 %, reduced) */
    toastHold: 4500          /* >= 4 s (motion analysis 5.14) */
  };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function step(i) { return Math.min(i, T.steps - 1); }      /* 8 steps = indices 0..7; item 9+ shares step 8 */

  /* Cubic-bezier evaluator (for the curve thumbnails and the auth timing diagram). */
  function parseBezier(s) {
    var m = /cubic-bezier\(([^)]+)\)/.exec(s || '');
    if (!m) return [0, 0, 1, 1];
    return m[1].split(',').map(function (v) { return parseFloat(v); });
  }
  function bezier(p) {
    var x1 = p[0], y1 = p[1], x2 = p[2], y2 = p[3];
    function bx(t) { return 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t; }
    function by(t) { return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t; }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 30; i++) { t = (lo + hi) / 2; if (bx(t) < x) lo = t; else hi = t; }
      return by(t);
    };
  }
  var easeStd = bezier(parseBezier(T.standard));
  function invert(f, y) { var lo = 0, hi = 1; for (var i = 0; i < 40; i++) { var m = (lo + hi) / 2; if (f(m) < y) lo = m; else hi = m; } return (lo + hi) / 2; }

  /* ---------------------------------------------------------------------------
     2. Reduced motion: system preference, optionally overridden by the page toggle.
     ------------------------------------------------------------------------- */
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var forced = null;
  function reduced() { return forced === null ? !!mq.matches : forced; }

  /* ---------------------------------------------------------------------------
     3. Timeline: WAAPI specs on one clock.
     ------------------------------------------------------------------------- */
  function Timeline(specs) {
    var self = this;
    this.specs = [];
    (specs || []).forEach(function (s) {
      if (!s || !s.el) return;
      if (s.el.length !== undefined && !s.el.animate) {           /* list of elements */
        Array.prototype.forEach.call(s.el, function (e) { self.specs.push({ el: e, kf: s.kf, opt: s.opt }); });
      } else self.specs.push(s);
    });
    this.anims = this.specs.map(function (s) {
      var a = s.el.animate(s.kf, Object.assign({ fill: 'both' }, s.opt));
      a.pause();
      return a;
    });
    this.total = this.specs.reduce(function (m, s) { return Math.max(m, (s.opt.delay || 0) + (s.opt.duration || 0) + (s.opt.endDelay || 0)); }, 0);
    this.state = 'idle';
  }
  Timeline.prototype.play = function () {
    var self = this;
    this.state = 'running';
    this.anims.forEach(function (a) { a.play(); });
    return Promise.all(this.anims.map(function (a) { return a.finished.catch(function () { return null; }); }))
      .then(function () { if (self.state === 'running') self.state = 'finished'; return self.state; });
  };
  Timeline.prototype.reverse = function (rate) {
    var self = this;
    this.state = 'reversing';
    this.anims.forEach(function (a) { a.playbackRate = -(rate || 1); a.play(); });
    return Promise.all(this.anims.map(function (a) { return a.finished.catch(function () { return null; }); }))
      .then(function () { if (self.state === 'reversing') self.state = 'reversed'; return self.state; });
  };
  Timeline.prototype.seekTime = function (t) {
    this.state = 'seeking';
    t = clamp(t, 0, this.total);
    this.anims.forEach(function (a) { a.pause(); a.currentTime = t; });
  };
  Timeline.prototype.seek = function (p) { this.seekTime(clamp(p, 0, 1) * this.total); };
  Timeline.prototype.time = function () {
    var t = 0;
    this.anims.forEach(function (a) { var c = a.currentTime || 0; if (c > t) t = c; });
    return Math.min(t, this.total);
  };
  Timeline.prototype.cancel = function () {
    this.state = 'cancelled';
    this.anims.forEach(function (a) { a.cancel(); });
  };

  /* Spec helpers ------------------------------------------------------------ */
  function fade(el, from, to, duration, delay, easing) {
    return { el: el, kf: [{ opacity: from }, { opacity: to }], opt: { duration: duration, delay: delay || 0, easing: easing || 'linear' } };
  }
  /* Item reveal (V2 rows / labels): fade + 4 px rise (+ optional 3 px blur). */
  function itemIn(el, delay, withBlur, duration) {
    var f = { opacity: 0, transform: 'translateY(' + T.itemRise + 'px)' };
    var t = { opacity: 1, transform: 'none' };
    if (withBlur) { f.filter = 'blur(' + T.blur + 'px)'; t.filter = 'blur(0px)'; }
    return { el: el, kf: [f, t], opt: { duration: duration || T.base, delay: delay || 0, easing: T.enter } };
  }
  /* Container entrance: opacity 240 + rise 8 / scale .97 over 320 (two specs). */
  function containerIn(el, delay) {
    return [
      fade(el, 0, 1, T.base, delay, T.enter),
      { el: el, kf: [{ transform: 'translateY(' + T.rise + 'px) scale(' + T.enterScale + ')' }, { transform: 'none' }], opt: { duration: T.moderate, delay: delay, easing: T.enter } }
    ];
  }
  function flat(list) { return [].concat.apply([], list); }
  function nextFrame() { return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); }); }

  /* ---------------------------------------------------------------------------
     4. Page layer, toasts, focus helpers
     ------------------------------------------------------------------------- */
  var layer = doc.createElement('div');
  layer.className = 'ms-layer';


  /* 04 mounts both at load (as before). 02 / 03 mount them on first use (palette open or
     seek, toast), so their static render is untouched; the live region then exists before
     any toast is added to it. */
  function mountLayer() {
    if (!layer.parentNode) doc.body.appendChild(layer);
  }
  if (STUDY) mountLayer();
  var stageToasts = doc.querySelector('[data-ms-toasts="stage"]');
  if (stageToasts) stageToasts.setAttribute('aria-live', 'polite');

  var shellEl = doc.querySelector('[data-shell]');
  var skipEl = doc.querySelector('.shell-skip');
  var uid = 0;
  function nextId(p) { uid += 1; return 'ms-' + p + '-' + uid; }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function focusables(root) {
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (e) {
      return e.offsetParent !== null || e === doc.activeElement;
    });
  }

  /* ---------------------------------------------------------------------------
     5. Overlay patterns (palette, dialog, drawer): a stage preview + a page instance
     ------------------------------------------------------------------------- */
  var openStack = [];                         /* page overlays currently open (top = last) */

  /* Overlay templates: 04 has them in its markup. 02 / 03 get the palette from PALETTE_TPL
     (keep in sync with <template id="ms-tpl-palette"> in 04-motion-study.html); the template
     element is never inserted into the document. */
  var PALETTE_TPL =
    '<div class="ms-ov ms-ov--palette" data-ms-ov="palette">' +
      '<div class="ms-backdrop" data-part="backdrop"></div>' +
      '<div class="ms-scrim" data-part="scrim"></div>' +
      '<div class="ms-palette" data-part="box" role="dialog" aria-modal="true" aria-label="Palet perintah">' +
        '<div class="ms-palette__panel" data-part="panel">' +
          '<div class="ms-palette__head">' +
            '<svg class="mc-icon mc-icon--20 ms-palette__icon" data-part="chrome" aria-hidden="true"><use href="#i-search"></use></svg>' +
            '<input class="ms-palette__input" data-part="input" type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Ketik perintah, proyek atau nomor dokumen…" aria-label="Cari perintah">' +
            '<button class="mc-kbd ms-palette__esc" data-part="chrome" type="button" data-ms-close aria-label="Tutup palet">esc</button>' +
          '</div>' +
          '<div class="ms-palette__divider" data-part="chrome"></div>' +
          '<div class="ms-palette__list" data-part="list" role="listbox" aria-label="Hasil"></div>' +
          '<div class="ms-palette__foot" data-part="foot" aria-hidden="true">' +
            '<span><kbd class="mc-kbd mc-kbd--sm">↑</kbd><kbd class="mc-kbd mc-kbd--sm">↓</kbd>navigasi</span>' +
            '<span><kbd class="mc-kbd mc-kbd--sm ms-kbd-ico"><svg class="mc-icon mc-icon--12" aria-hidden="true"><use href="#i-ms-return"></use></svg></kbd>buka</span>' +
            '<span><kbd class="mc-kbd mc-kbd--sm">esc</kbd>tutup</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  var TPL_SRC = { 'ms-tpl-palette': PALETTE_TPL };
  var tplCache = {};
  function template(id) {
    var t = doc.getElementById(id);
    if (t) return t;
    if (!tplCache[id] && TPL_SRC[id]) { t = doc.createElement('template'); t.innerHTML = TPL_SRC[id]; tplCache[id] = t; }
    return tplCache[id] || null;
  }

  function instantiate(tplId, where, mount) {
    var tpl = template(tplId);
    var root = tpl.content.firstElementChild.cloneNode(true);
    var parts = {};
    root.querySelectorAll('[data-part]').forEach(function (el) {
      var k = el.getAttribute('data-part');
      if (parts[k]) { if (!Array.isArray(parts[k])) parts[k] = [parts[k]]; parts[k].push(el); }
      else parts[k] = el;
    });
    var inst = { root: root, parts: parts, where: where, state: 'closed', tl: null };
    if (where === 'stage') {
      root.classList.add('ms-ov--contained');
      root.setAttribute('aria-hidden', 'true');
      root.inert = true;
      mount.appendChild(root);
      inst.state = 'open';
    } else {
      root.hidden = true;
      layer.appendChild(root);
    }
    var box = parts.box;
    if (box && parts.title) { parts.title.id = nextId('title'); box.setAttribute('aria-labelledby', parts.title.id); }
    if (box && parts.desc) { parts.desc.id = nextId('desc'); box.setAttribute('aria-describedby', parts.desc.id); }
    return inst;
  }

  function setLocked(on) {
    if (window.MCShell && window.MCShell.lock) { window.MCShell.lock(on); return; }   /* same elements, plus MCShell.locked() */
    if (shellEl) shellEl.inert = on;
    if (skipEl) skipEl.inert = on;
  }

  function Overlay(name, cfg) {
    this.name = name;
    this.cfg = cfg;
    this.inst = {};
    var mount = doc.querySelector('[data-ms-mount="' + name + '"]');
    if (mount) this.inst.stage = instantiate(cfg.tpl, 'stage', mount);
    this.inst.page = instantiate(cfg.tpl, 'page');
    if (cfg.init) { var self = this; Object.keys(this.inst).forEach(function (k) { cfg.init.call(self, self.inst[k]); }); }
  }
  Overlay.prototype.build = function (inst, phase) {
    return this.cfg[phase].call(this, inst, reduced());
  };
  Overlay.prototype.clearTl = function (inst) { if (inst.tl) { inst.tl.cancel(); inst.tl = null; } };
  Overlay.prototype.show = function (inst, opts) {
    this.clearTl(inst);
    if (inst.where === 'page') mountLayer();                 /* no-op on 04 (mounted at load) */
    inst.root.hidden = false;
    if (this.cfg.prepare) this.cfg.prepare.call(this, inst, opts || {});
  };
  Overlay.prototype.open = function (where, opts) {
    var inst = this.inst[where || 'page'];
    var self = this;
    if (!inst) return Promise.resolve();
    opts = opts || {};
    if (inst.state === 'open' || inst.state === 'opening') {
      if (this.cfg.reopen) this.cfg.reopen.call(this, inst, opts);
      return Promise.resolve();
    }
    if (inst.state === 'closing' && inst.tl && inst.tl.state === 'running' && inst.tlPhase === 'close') {
      /* retarget: a close in flight is turned around from its current values */
      inst.tl.cancel();
    }
    if (inst.where === 'page') {
      openStack.slice().forEach(function (o) { if (o !== self) o.close('page', { instant: true }); });
      inst.returnFocus = opts.returnFocus || doc.activeElement;
      setLocked(true);
      openStack.push(this);
    }
    this.show(inst, opts);
    inst.tl = new Timeline(this.build(inst, 'open'));
    inst.tlPhase = 'open';
    inst.state = 'opening';
    if (inst.where === 'page') this.focusIn(inst);
    var tl = inst.tl;
    syncScrub(this.name, inst);
    return tl.play().then(function (st) {
      if (st === 'finished' && inst.tl === tl) { tl.cancel(); inst.tl = null; inst.state = 'open'; }
    });
  };
  Overlay.prototype.focusIn = function (inst) {
    var target = inst.root.querySelector('[data-autofocus]') || focusables(inst.parts.box || inst.root)[0];
    if (target) {
      target.focus({ preventScroll: true });
      try {
        if (target.classList.contains('ms-palette__input')) { var n = target.value.length; target.setSelectionRange(n, n); }
        else if (target.select && target.type === 'text') target.select();
      } catch (e) { /* not selectable */ }
    }
  };
  Overlay.prototype.close = function (where, opts) {
    var inst = this.inst[where || 'page'];
    var self = this;
    opts = opts || {};
    if (!inst || inst.state === 'closed') return Promise.resolve();
    if (inst.state === 'closing' && !opts.instant) return Promise.resolve();
    var finish = function () {
      self.clearTl(inst);
      inst.state = 'closed';
      if (inst.where === 'page') {
        inst.root.hidden = true;
        var i = openStack.indexOf(self);
        if (i >= 0) openStack.splice(i, 1);
        if (!openStack.length) setLocked(false);
        var rf = inst.returnFocus;
        inst.returnFocus = null;
        if (rf && rf.focus && doc.contains(rf) && !opts.noReturn) rf.focus({ preventScroll: true });
      } else {
        inst.root.hidden = true;
      }
      if (opts.after) opts.after();
    };
    if (opts.instant) { finish(); return Promise.resolve(); }
    if (inst.state === 'opening' && inst.tl && inst.tl.state === 'running') {
      /* interrupt: reverse the running open from where it is, 1.6x faster */
      inst.state = 'closing';
      inst.tlPhase = 'reverse';
      var rtl = inst.tl;
      return rtl.reverse(1.6).then(function (st) { if (inst.tl === rtl && st === 'reversed') finish(); });
    }
    this.clearTl(inst);
    inst.tl = new Timeline(this.build(inst, 'close'));
    inst.tlPhase = 'close';
    inst.state = 'closing';
    var tl = inst.tl;
    return tl.play().then(function (st) { if (inst.tl === tl && st === 'finished') finish(); });
  };
  Overlay.prototype.seek = function (where, t, isMs) {
    var inst = this.inst[where];
    if (!inst) return 0;
    this.show(inst, { seek: true });
    inst.tl = new Timeline(this.build(inst, 'open'));
    inst.tlPhase = 'open';
    inst.state = 'seeking';
    if (isMs) inst.tl.seekTime(t); else inst.tl.seek(t);
    return inst.tl.total;
  };
  Overlay.prototype.replay = function () {
    var inst = this.inst.stage;
    if (!inst) return Promise.resolve();
    var tl;
    this.show(inst, { seek: true });
    tl = inst.tl = new Timeline(this.build(inst, 'open'));
    inst.tlPhase = 'open';
    inst.state = 'opening';
    syncScrub(this.name, inst);
    return tl.play().then(function (st) {
      if (st === 'finished' && inst.tl === tl) { tl.cancel(); inst.tl = null; inst.state = 'open'; }
    });
  };
  Overlay.prototype.rest = function () {
    if (this.inst.stage) { this.show(this.inst.stage, { seek: true }); this.inst.stage.state = 'open'; }
    var pg = this.inst.page;
    if (pg.state === 'seeking') { this.clearTl(pg); pg.state = 'closed'; pg.root.hidden = true; }
    else if (pg.state !== 'closed') this.close('page', { instant: true });
  };
  Overlay.prototype.duration = function (where) {
    var inst = this.inst[where] || this.inst.page;
    var specs = this.build(inst, 'open');
    var tl = new Timeline(specs);
    var d = tl.total;
    tl.cancel();
    return d;
  };

  /* Trap Tab inside the top page overlay; Esc closes it. */
  doc.addEventListener('keydown', function (e) {
    var top = openStack[openStack.length - 1];
    if (!top) return;
    var inst = top.inst.page;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      top.close('page');
      return;
    }
    if (e.key === 'Tab') {
      var f = focusables(inst.parts.box || inst.root);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (!inst.root.contains(doc.activeElement)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, true);

  /* ---- 5a. Command palette ------------------------------------------------- */
  /* 04: the specimen data below (unchanged). 02 / 03: appPalette(PAGE), built per render. */
  var PALETTE = [
    { group: 'Tindakan cepat', items: [
      { icon: 'cart', title: 'Buat pembelian baru', meta: 'Pembelian · formulir 3 langkah', kbd: ['Alt', 'N'], href: navHref('pembelian') },
      { icon: 'receipt', title: 'Lihat piutang jatuh tempo', meta: '3 invoice · Total Rp186.250.000', kbd: ['G', 'P'] },
      { icon: 'home', title: 'Buka Beranda', meta: 'Ringkasan kinerja periode aktif', href: navHref('beranda') }
    ] },
    { group: 'Proyek', items: [
      { icon: 'folder', title: 'Perangkat Lab Jaringan Fakultas Teknik', meta: 'ARJ/PRJ/2026/0142 · Universitas Contoh Nusantara' },
      { icon: 'folder', title: 'Renovasi Gedung A', meta: 'PT Maju Sejahtera · progres 52 %' },
      { icon: 'folder', title: 'Pengadaan Server 12U', meta: 'Dalam proses · progres 30 %' }
    ] },
    { group: 'Dokumen', items: [
      { icon: 'invoice', title: 'INV/2026/1028', meta: 'Invoice · Proyek Renovasi Gedung A · Rp48.750.000' },
      { icon: 'archive', title: 'PO/2026/0281', meta: 'Barang masuk gudang · Kabel UTP Cat6 305m' },
      { icon: 'note', title: 'Kontrak dan SPK', meta: 'Dokumen dikonfirmasi · ARJ/PRJ/2026/0142' }
    ] }
  ];
  /* r7: destinations come from the project navigation (project-config.js), never from literals */
  function navHref(key, fallback) {
    var it = window.MCProject && window.MCProject.navItem(key);
    return (it && it.href) || fallback || '#';
  }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  /* Command palette on the app pages (c-merge). Results relevant to the page: its actions,
     the cards on it (jump + focus), navigation between Beranda (02) and Buat Pembelian (03)
     with the shell's page transition, and sign-out to the login page (01). Items carry
     href (MCShell.navigate) or run (called after the palette has closed). */
  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function jumpTo(sec) {
    if (!sec.hasAttribute('tabindex')) sec.setAttribute('tabindex', '-1');
    sec.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
    sec.focus({ preventScroll: true });
  }
  function focusEl(sel) {
    return function () { var el = doc.querySelector(sel); if (el) { el.focus(); if (el.select && el.type === 'text') el.select(); } };
  }
  function clickEl(sel) {
    return function () { var el = doc.querySelector(sel); if (el) el.click(); };
  }
  /* Meta line of a card result, read from the card at render time (live figures). */
  var CARD_META = {
    'dash-actions': function (sec) { return txt(sec.querySelector('.dash-actions__count')); },
    'dash-aging': function (sec) { var v = txt(sec.querySelector('.dash-aging__value')); return v && 'Total piutang ' + v; },
    'dash-activity': function (sec) { var n = sec.querySelectorAll('.dash-feed__item').length; return n && n + ' aktivitas terakhir'; },
    'dash-projects': function (sec) { var n = sec.querySelectorAll('.dash-project').length; return n && n + ' proyek berjalan'; },
    'dash-value': function () { return window.MCDateRange ? 'Periode ' + window.MCDateRange.label() : ''; },
    'pur-summary': function (sec) { var v = txt(sec.querySelector('[data-pur-sum-total]')); return v && 'Total pembelian ' + v; }
  };
  function metaFor(sec) {
    for (var k in CARD_META) if (sec.classList.contains(k)) { var m = CARD_META[k](sec); if (m) return m; }
    var sub = txt(sec.querySelector('[class*="subtitle"], [class*="__intro"]'));
    if (sub) return sub;
    return Array.prototype.slice.call(sec.querySelectorAll('.mc-field__label'), 0, 4)
      .map(function (l) { return txt(l).replace(/\s*\(opsional\)$/i, '').replace(/\s*\*/g, ''); }).filter(Boolean).join(', ');
  }
  function cardItems(fallbackMeta) {
    var region = doc.querySelector('[data-region="content"]');
    if (!region) return [];
    return Array.prototype.map.call(region.querySelectorAll('section.mc-card[aria-labelledby]'), function (sec) {
      var use = sec.querySelector('svg.mc-icon use');
      return {
        icon: use ? (use.getAttribute('href') || '').replace('#i-', '') : 'chevron-right',
        title: txt(doc.getElementById(sec.getAttribute('aria-labelledby'))).replace(/\s*\(opsional\)$/i, ''),
        meta: metaFor(sec) || fallbackMeta,
        run: function () { jumpTo(sec); }
      };
    }).filter(function (it) { return it.title; });
  }
  /* r10: destinations come from the route + module registry (project-config.js) and from the
     providers pages register with MCPalette (patterns.js): page actions, records by number or
     name. Nothing in the palette is a dead end: every item navigates or runs.
     r12: "Navigasi" lists EVERY entry the account may open (MCProject.navIndex(): route allowed +
     capability, "Grup › Label"), including entries the persistent menu hides for the role, so a
     page-level link that was removed stays one search away. Then every allowed module whose landing
     the navigation does not list (a flat or partial project tree: "Buka <modul>", as in r10-r11), so a
     project's palette never offers less than its modules. The entry showing the current address is
     left out (navIndex here); duplicate addresses once. */
  function routeHref(id, params) { return window.MCRoutes ? window.MCRoutes.href(id, params) : null; }
  function navGroup() {
    var P0 = window.MCProject, R0 = window.MCRoutes;
    if (!P0 || !P0.navIndex) return null;
    var seen = {}, listed = {}, items = [], here = R0 && R0.current();
    function key(href) { try { return new URL(href, window.location.href).href.split('#')[0]; } catch (e) { return href; } }
    P0.navIndex().forEach(function (e) {
      if (e.route) listed[e.route] = 1;
      if (!e.href || e.here || seen[key(e.href)]) return;
      seen[key(e.href)] = 1;
      items.push({ icon: e.icon || 'chevron-right', title: 'Buka ' + e.title, meta: e.group ? 'Modul ' + P0.t(e.group) : 'Modul', href: e.href });
    });
    if (R0) R0.modules().forEach(function (m) {
      var r = !m.extra && !listed[m.route] && R0.allowed(m.route) ? R0.get(m.route) : null;
      if (!r || (here && here.id === r.id) || seen[key(r.file)]) return;
      seen[key(r.file)] = 1;
      items.push({ icon: m.icon, title: 'Buka ' + m.label, meta: r.label === m.label ? 'Modul' : 'Modul · ' + r.label, href: r.file });
    });
    return { group: 'Navigasi', items: items };
  }
  function appPalette(page, query) {
    var groups = [];
    var who = (window.MC_PROJECT && window.MC_PROJECT.user && window.MC_PROJECT.user.name) || 'Anda';
    if (page === 'dashboard' && !(window.MCPage && !window.MCPage.allowed())) {   /* r11: not on the Admin's not-found */
      groups.push({ group: 'Tindakan cepat', items: [
        { icon: 'cart', title: 'Buat pembelian baru', meta: 'Pembelian · formulir 3 langkah', href: routeHref('pembelian.form') || navHref('pembelian') },
        { icon: 'calendar', title: 'Ganti periode laporan', meta: 'Periode aktif: ' + (window.MCDateRange ? window.MCDateRange.label() : '—'), run: function () { if (window.MCDateRange) window.MCDateRange.open(); } }
      ] });
      groups.push({ group: 'Di halaman ini', items: cardItems('Kartu di Beranda') });
    } else if (page === 'purchase') {
      groups.push({ group: 'Tindakan cepat', items: [
        { icon: 'plus', title: 'Tambah baris barang', meta: 'Barang yang dibeli · baris kosong baru', kbd: ['Alt', 'N'], run: clickEl('[data-pur-add-row]') },
        { icon: 'search', title: 'Cari produk di katalog', meta: 'Tambahkan barang dari katalog ke tabel', run: focusEl('[data-pur-search]') },
        { icon: 'eye', title: 'Pratinjau PO', meta: 'Lihat PO sebelum pembelian disimpan · tidak menyimpan apa pun', run: clickEl('[data-pur-preview]') }
      ] });
      groups.push({ group: 'Di halaman ini', items: cardItems('Bagian formulir pembelian') });
    } else {
      var here = cardItems('Bagian di halaman ini');
      if (here.length) groups.push({ group: 'Di halaman ini', items: here });
    }
    if (window.MCPalette) groups = window.MCPalette.groups(query || '').concat(groups);
    var nav = navGroup();
    if (nav && nav.items.length) groups.push(nav);
    groups.push({ group: 'Akun', items: [
      { icon: 'user', title: 'Akun Saya', meta: 'Profil, peran, perusahaan, kata sandi', href: routeHref('akun') },
      /* r6: the palette is the universal command layer; Keluar still goes through the confirmation */
      { icon: 'logout', title: 'Keluar', meta: 'Akhiri sesi ' + who + ' · dengan konfirmasi', run: function () { if (window.MCAccount) window.MCAccount.logout(null); } }
    ].filter(function (it) { return it.href !== null; }) });
    if (query && routeHref('search')) groups.push({ group: 'Cari', always: true, items: [
      { icon: 'search', title: 'Lihat semua hasil untuk “' + query + '”', meta: 'Halaman Cari · dikelompokkan per jenis data', href: routeHref('search', { q: query }), always: true }
    ] });
    return groups.filter(function (g) { return g.items.length; });
  }
  function paletteGroups(query) { return STUDY ? PALETTE : appPalette(document.body.dataset.page, query); }   /* r13: live page */

  function paletteRender(inst, query) {
    var list = inst.parts.list;
    var q = norm(query || '').trim();
    var rows = [];
    var htmlOut = '';
    var base = inst.idBase || (inst.idBase = nextId('pal'));
    paletteGroups(String(query || '').trim()).forEach(function (g, gi) {
      var items = g.items.filter(function (it) { return !q || it.always || norm(it.title + ' ' + it.meta + ' ' + g.group).indexOf(q) >= 0; });
      if (!items.length) return;
      var gid = base + '-g' + gi;
      htmlOut += '<div role="group" aria-labelledby="' + gid + '"><div class="ms-palette__group" id="' + gid + '" data-pal-anim>' + esc(g.group) + '</div>';
      items.forEach(function (it) {
        var idx = rows.length;
        rows.push(it);
        var title = esc(it.title);
        if (q) {
          var at = norm(it.title).indexOf(q);
          if (at >= 0) title = esc(it.title.slice(0, at)) + '<mark>' + esc(it.title.slice(at, at + q.length)) + '</mark>' + esc(it.title.slice(at + q.length));
        }
        htmlOut += '<div class="ms-palette__item" role="option" id="' + base + '-o' + idx + '" data-index="' + idx + '" aria-selected="false">' +
          '<span class="ms-palette__tile" data-pal-anim>' + icon(it.icon, 'mc-icon--18') + '</span>' +
          '<span class="ms-palette__text" data-pal-anim><span class="ms-palette__title">' + title + '</span><span class="ms-palette__meta">' + esc(it.meta) + '</span></span>' +
          '<span class="ms-palette__end" data-pal-anim>' +
            (it.kbd ? '<span class="ms-palette__trail mc-kbd-combo" aria-hidden="true">' + it.kbd.map(function (k) { return '<kbd class="mc-kbd mc-kbd--sm">' + esc(k) + '</kbd>'; }).join('') + '</span>' : '') +
            '<span class="ms-palette__go" aria-hidden="true">Buka<kbd class="mc-kbd ms-kbd-ico">' + icon('ms-return', 'mc-icon--12') + '</kbd></span>' +
          '</span></div>';
      });
      htmlOut += '</div>';
    });
    if (!rows.length) htmlOut = '<p class="ms-palette__empty" data-pal-anim>Tidak ada hasil untuk “' + esc(query) + '”.</p>';
    list.innerHTML = htmlOut;
    list.id = list.id || base + '-list';
    paletteEnd(inst);
    inst.parts.input.setAttribute('aria-controls', list.id);
    inst.rows = rows;
    paletteSelect(inst, rows.length ? 0 : -1, false);
  }
  /* The list fades out at the bottom while more results are below (mask in CSS); at the end
     of the list the fade is removed so the last row reads in full. */
  function paletteEnd(inst) {
    var l = inst.parts.list;
    l.classList.toggle('is-end', l.scrollHeight > 0 && l.scrollTop + l.clientHeight >= l.scrollHeight - 1);
  }
  function paletteSelect(inst, i, scroll) {
    var items = inst.parts.list.querySelectorAll('.ms-palette__item');
    inst.sel = i;
    items.forEach(function (el, k) { el.setAttribute('aria-selected', String(k === i)); });
    var cur = items[i];
    if (cur) {
      inst.parts.input.setAttribute('aria-activedescendant', cur.id);
      if (scroll) cur.scrollIntoView({ block: 'nearest' });
    } else inst.parts.input.removeAttribute('aria-activedescendant');
  }
  function paletteActivate(inst, i) {
    var it = inst.rows && inst.rows[i];
    if (!it) return;
    palette.close('page', {
      noReturn: !!(it.href || it.run),
      after: function () {
        if (it.href) {
          if (window.MCShell && window.MCShell.navigate) window.MCShell.navigate(it.href);
          else window.location.href = it.href;
        } else if (it.run) {
          it.run();
        } else {
          toast('Perintah dijalankan', it.title + ' · contoh, halaman tujuan belum tersedia.');
        }
      }
    });
  }

  var palette = new Overlay('palette', {
    tpl: 'ms-tpl-palette',
    init: function (inst) {
      paletteRender(inst, '');
      if (inst.where !== 'page') return;
      var input = inst.parts.input;
      input.addEventListener('input', function () {
        paletteRender(inst, input.value);
        if (reduced()) return;
        inst.parts.list.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 120, easing: 'linear' });  /* re-query: no stagger */
      });
      input.addEventListener('keydown', function (e) {
        var n = inst.rows ? inst.rows.length : 0;
        if (e.key === 'ArrowDown') { e.preventDefault(); if (n) paletteSelect(inst, (inst.sel + 1) % n, true); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (n) paletteSelect(inst, (inst.sel - 1 + n) % n, true); }
        else if (e.key === 'Home' && n && !input.value) { e.preventDefault(); paletteSelect(inst, 0, true); }
        else if (e.key === 'End' && n && !input.value) { e.preventDefault(); paletteSelect(inst, n - 1, true); }
        else if (e.key === 'Enter') { e.preventDefault(); paletteActivate(inst, inst.sel); }
      });
      inst.parts.list.addEventListener('pointermove', function (e) {
        var it = e.target.closest('.ms-palette__item');
        if (it) { var i = +it.getAttribute('data-index'); if (i !== inst.sel) paletteSelect(inst, i, false); }
      });
      inst.parts.list.addEventListener('click', function (e) {
        var it = e.target.closest('.ms-palette__item');
        if (it) paletteActivate(inst, +it.getAttribute('data-index'));
      });
      inst.parts.list.addEventListener('mousedown', function (e) { e.preventDefault(); });   /* keep focus in the input */
      inst.parts.list.addEventListener('scroll', function () { paletteEnd(inst); }, { passive: true });
      inst.root.addEventListener('click', function (e) {
        if (e.target.closest('[data-ms-close]')) palette.close('page');
        else if (e.target === inst.parts.scrim || e.target === inst.parts.backdrop) palette.close('page');
      });
    },
    prepare: function (inst, opts) {
      var q = opts.query || '';
      if (inst.where === 'page') inst.parts.input.value = q;
      paletteRender(inst, q);
      inst.parts.list.scrollTop = 0;
      paletteEnd(inst);
    },
    reopen: function (inst, opts) {
      if (opts.query) { inst.parts.input.value = opts.query; paletteRender(inst, opts.query); }
      inst.parts.input.focus({ preventScroll: true });
      if (opts.query) { var n = inst.parts.input.value.length; inst.parts.input.setSelectionRange(n, n); } else inst.parts.input.select();
    },
    open: function (inst, red) {
      var p = inst.parts;
      if (red) {
        return [fade(p.backdrop, 0, 1, T.reduced), fade(p.scrim, 0, 1, T.reduced), fade(p.box, 0, 1, T.reduced)];
      }
      var H = p.panel.offsetHeight || 452;
      var startH = parseFloat(getComputedStyle(p.box).getPropertyValue('--ms-pal-start')) || 56;
      var inset = Math.max(0, (H - startH) / 2);
      var specs = [
        fade(p.backdrop, 0, 1, T.fast, 0, T.enter),                   /* blur leads the dim (V2-U10) */
        fade(p.scrim, 0, 1, T.base, 0, 'linear'),
        fade(p.box, 0, 1, T.instant, 0, T.enter),                     /* panel opacity first, 80 ms */
        { el: p.panel, kf: [{ clipPath: 'inset(' + inset + 'px 0px ' + inset + 'px 0px round 12px)' }, { clipPath: 'inset(0px 0px 0px 0px round 12px)' }],
          opt: { duration: T.slow, easing: T.reveal } }               /* height from the fixed centre */
      ];
      var chrome = [].concat(p.chrome).slice();
      chrome.splice(1, 0, p.input);                                  /* icon, input, esc, divider */
      chrome.forEach(function (el, i) {
        specs.push({ el: el, kf: [{ opacity: 0, filter: 'blur(' + T.blur + 'px)' }, { opacity: 1, filter: 'blur(0px)' }],
          opt: { duration: T.fast, delay: P.paletteChrome + i * T.tight, easing: T.enter } });
      });
      var sel = p.list.querySelector('.ms-palette__item[aria-selected="true"]');
      if (sel) specs.push({ el: sel, kf: [{ backgroundColor: 'rgba(236, 241, 210, 0)' }, { backgroundColor: T.lime150 }],
        opt: { duration: 120, delay: P.paletteHighlight, easing: T.enter } });
      /* results (motion analysis 4.4): group label or row = one step; fade + rise 4 px over
         160 ms, 30 ms apart, 8 steps (last start 240 + 7 x 30 = 450, settled at 610).
         Blur only on text (4.5): never on the icon tiles or keycaps. */
      var stepIndex = 0;
      Array.prototype.forEach.call(p.list.querySelectorAll('.ms-palette__group, .ms-palette__item, .ms-palette__empty'), function (el) {
        var d = P.paletteRows + step(stepIndex) * T.tight;
        if (el.classList.contains('ms-palette__item')) {
          Array.prototype.forEach.call(el.querySelectorAll('[data-pal-anim]'), function (t) {
            specs.push(itemIn(t, d, t.classList.contains('ms-palette__text'), T.fast));
          });
        } else specs.push(itemIn(el, d, true, T.fast));
        stepIndex += 1;
      });
      specs.push(itemIn(p.foot, P.paletteRows + step(stepIndex) * T.tight, false, T.fast));
      return specs;
    },
    close: function (inst, red) {
      var p = inst.parts;
      if (red) return [fade(p.box, 1, 0, T.reduced), fade(p.scrim, 1, 0, T.reduced), fade(p.backdrop, 1, 0, T.reduced)];
      var H = p.panel.offsetHeight || 452;
      var inset = Math.round(H * 0.14);
      return [
        { el: [p.list, p.foot].concat(p.chrome, p.input), kf: [{ opacity: 1 }, { opacity: 0 }], opt: { duration: 120, easing: T.exit } },
        { el: p.panel, kf: [{ clipPath: 'inset(0px 0px 0px 0px round 12px)' }, { clipPath: 'inset(' + inset + 'px 0px ' + inset + 'px 0px round 12px)' }], opt: { duration: T.base, easing: T.exit } },
        fade(p.box, 1, 0, T.fast, T.instant, T.exit),
        fade(p.scrim, 1, 0, T.base, 0, 'linear'),
        fade(p.backdrop, 1, 0, T.fast, 0, T.exit)
      ];
    }
  });

  /* r2: on phones the page-level dialog and drawer open as bottom sheets (translate + fade). */
  var MS_PHONE = window.matchMedia('(max-width: 767px)');
  function sheetIn(p) {
    return [
      fade(p.scrim, 0, 1, T.base, 0, 'linear'),
      { el: p.box, kf: [{ transform: 'translateY(100%)' }, { transform: 'none' }], opt: { duration: T.moderate, easing: T.reveal } }
    ];
  }
  function sheetOut(p) {
    return [
      { el: p.box, kf: [{ transform: 'none' }, { transform: 'translateY(100%)' }], opt: { duration: T.base, easing: T.exit } },
      fade(p.scrim, 1, 0, T.base, 0, 'linear')
    ];
  }

  /* ---- 5b. Dialog ---------------------------------------------------------- */
  var dialog = !template('ms-tpl-dialog') ? null : new Overlay('dialog', {
    tpl: 'ms-tpl-dialog',
    init: function (inst) {
      if (inst.where !== 'page') return;
      inst.root.addEventListener('click', function (e) {
        if (e.target.closest('[data-ms-confirm]')) {
          dialog.close('page', { after: function () { toast('Pembelian disimpan', 'PB/2026/0418 diteruskan ke Tinjau & konfirmasi.'); } });
        } else if (e.target.closest('[data-ms-close]')) dialog.close('page');
        else if (e.target === inst.parts.scrim || e.target.classList.contains('ms-dialog-wrap')) dialog.close('page');
      });
    },
    open: function (inst, red) {
      var p = inst.parts;
      if (red) return [fade(p.scrim, 0, 1, T.reduced), fade(p.box, 0, 1, T.reduced)];
      if (inst.where === 'page' && MS_PHONE.matches) return sheetIn(p);
      return [
        fade(p.scrim, 0, 1, T.base, 0, 'linear'),
        fade(p.box, 0, 1, T.instant, 0, T.enter),
        { el: p.box, kf: [{ transform: 'translateY(' + T.rise + 'px) scale(' + T.enterScale + ')' }, { transform: 'none' }], opt: { duration: T.moderate, easing: T.enter } }
      ];
    },
    close: function (inst, red) {
      var p = inst.parts;
      if (red) return [fade(p.box, 1, 0, T.reduced), fade(p.scrim, 1, 0, T.reduced)];
      if (inst.where === 'page' && MS_PHONE.matches) return sheetOut(p);
      return [
        { el: p.box, kf: [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(' + T.exitScale + ')' }], opt: { duration: T.fast, easing: T.exit } },
        fade(p.scrim, 1, 0, T.base, 0, 'linear')
      ];
    }
  });

  /* ---- 5c. Modal drawer (variant B) ------------------------------------------ */
  var drawer = !template('ms-tpl-drawer') ? null : new Overlay('drawer', {
    tpl: 'ms-tpl-drawer',
    init: function (inst) {
      var p = inst.parts;
      ['name', 'mail', 'term', 'note'].forEach(function (k) {
        var lbl = p['lbl-' + k], input = p['in-' + k];
        if (lbl && input) { lbl.id = nextId('lbl'); input.setAttribute('aria-labelledby', lbl.id); }
      });
      inst.root.addEventListener('click', function (e) {
        if (e.target.closest('[data-ms-confirm]')) {
          drawer.close('page', { after: function () { toast('Pemasok diperbarui', 'CV Arunika Jaya · termin 30 hari.'); } });
        } else if (e.target.closest('[data-ms-close]') || e.target === p.scrim) drawer.close('page');
      });
    },
    open: function (inst, red) {
      var p = inst.parts;
      if (red) return [fade(p.scrim, 0, 1, T.reduced), fade(p.box, 0, 1, T.reduced)];
      if (inst.where === 'page' && MS_PHONE.matches) return sheetIn(p);
      return [
        fade(p.scrim, 0, 1, T.base, 0, 'linear'),
        { el: p.box, kf: [{ transform: 'translateX(100%)' }, { transform: 'none' }], opt: { duration: T.moderate, easing: T.enter } }
      ];
    },
    close: function (inst, red) {
      var p = inst.parts;
      if (red) return [fade(p.box, 1, 0, T.reduced), fade(p.scrim, 1, 0, T.reduced)];
      if (inst.where === 'page' && MS_PHONE.matches) return sheetOut(p);
      return [
        { el: p.box, kf: [{ transform: 'none' }, { transform: 'translateX(100%)' }], opt: { duration: T.base, easing: T.exit } },
        fade(p.scrim, 1, 0, T.base, 0, 'linear')
      ];
    }
  });

  var OVERLAYS = { palette: palette };          /* 02 / 03: the palette only */
  if (dialog) OVERLAYS.dialog = dialog;
  if (drawer) OVERLAYS.drawer = drawer;

  /* ---------------------------------------------------------------------------
     6. Toasts (enter: opacity 160 + rise 8 over 240; hold >= 4 s; exit: opacity only)
     ------------------------------------------------------------------------- */
  function toastEl(title, meta) {
    var el = doc.createElement('div');
    el.className = 'mc-toast mc-toast--success';     /* the shared toast component (section 27) */
    el.setAttribute('role', 'status');
    el.innerHTML = '<span class="mc-toast__icon" aria-hidden="true">' + icon('check-circle', 'mc-icon--18') + '</span>' +
      '<div class="mc-toast__text"><p class="mc-toast__title">' + esc(title) + '</p>' + (meta ? '<p class="mc-toast__msg">' + esc(meta) + '</p>' : '') + '</div>' +
      '<button class="mc-toast__close" type="button" aria-label="Tutup notifikasi">' + icon('x', 'mc-icon--16') + '</button>';
    return el;
  }
  function toastInSpecs(el) {
    if (reduced()) return [fade(el, 0, 1, T.reduced)];
    return [fade(el, 0, 1, T.fast, 0, T.enter), { el: el, kf: [{ transform: 'translateY(' + T.rise + 'px)' }, { transform: 'none' }], opt: { duration: T.base, easing: T.enter } }];
  }
  function toastOut(el) {
    if (el._leaving) return;
    el._leaving = true;
    clearTimeout(el._timer);
    var a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced() ? T.reduced : T.base, easing: reduced() ? 'linear' : T.exit, fill: 'forwards' });
    a.finished.then(function () { el.remove(); }, function () { el.remove(); });
  }
  function toast(title, meta, opts) {
    opts = opts || {};
    if (opts.region !== 'stage') return window.MCToast ? window.MCToast.success(title, meta) : null;   /* page toasts: shared system */
    var region = stageToasts;
    var el = toastEl(title, meta);
    region.appendChild(el);
    var tl = new Timeline(toastInSpecs(el));
    tl.play().then(function () { tl.cancel(); });
    var arm = function () { clearTimeout(el._timer); el._timer = setTimeout(function () { toastOut(el); }, P.toastHold); };
    el.addEventListener('mouseenter', function () { clearTimeout(el._timer); });
    el.addEventListener('mouseleave', arm);
    el.addEventListener('focusin', function () { clearTimeout(el._timer); });
    el.addEventListener('focusout', arm);
    el.querySelector('.mc-toast__close').addEventListener('click', function () { toastOut(el); });
    arm();
    while (region.children.length > 3) region.firstElementChild.remove();
    return el;
  }

  /* ---------------------------------------------------------------------------
     7. In-stage patterns
     ------------------------------------------------------------------------- */
  var stages = {};

  /* ---- 7a. Side panel (variant A, non-modal) --------------------------------- */
  (function () {
    var list = doc.querySelector('[data-ms-plist]');
    var detail = doc.querySelector('[data-ms-detail]');
    var col = doc.querySelector('[data-ms-pcol]');
    if (!list || !detail) return;
    /* Row copy fits the list column without ellipsis (x-motion-study): event as the title,
       document or party as the meta line, age in a right-aligned 11 px column. */
    var DATA = [
      { icon: 'invoice', tone: 'blue', title: 'Invoice diterbitkan', meta: 'INV/2026/1028', time: '2 jam', head: 'INV/2026/1028', pill: ['pending', 'Menunggu pembayaran'], kv: [['Nilai', 'Rp48.750.000'], ['Proyek', 'Renovasi Gedung A'], ['Pelanggan', 'PT Maju Sejahtera'], ['Jatuh tempo', '07 Nov 2026'], ['Dibuat oleh', who()]], when: 'Sel, 06 Okt 2026 · 09.12' },
      { icon: 'archive', tone: 'mint', title: 'Barang masuk gudang', meta: 'Kabel UTP Cat6 305m', time: '1 hari', head: 'PO/2026/0281', pill: ['success', 'Diterima'], kv: [['Barang', 'Kabel UTP Cat6 305m'], ['Jumlah', '4 rol'], ['Gudang', 'Gudang Utama'], ['Pembelian', 'PB/2026/0402'], ['Diterima oleh', who()]], when: 'Sen, 05 Okt 2026 · 15.40' },
      { icon: 'cart', tone: 'olive', title: 'Pembelian dibuat', meta: 'PB/2026/0418', time: '1 hari', head: 'PB/2026/0418', pill: ['neutral', 'Draf'], kv: [['Total', 'Rp224.442.000'], ['Pemasok', 'CV Arunika Jaya'], ['Proyek', 'Lab Jaringan FT'], ['Barang', '3 item'], ['Dibuat oleh', who()]], when: 'Sen, 05 Okt 2026 · 10.05' },
      { icon: 'credit-card', tone: 'peach', title: 'Pembayaran diterima', meta: 'PT Maju Sejahtera', time: '2 hari', head: 'Pembayaran INV/2026/0996', pill: ['success', 'Lunas'], kv: [['Nilai', 'Rp55.926.000'], ['Invoice', 'INV/2026/0996'], ['Metode', 'Transfer bank'], ['Proyek', 'Renovasi Gedung A'], ['Dicatat oleh', who()]], when: 'Min, 04 Okt 2026 · 11.30' },
      { icon: 'box', tone: 'blue', title: 'Barang divalidasi', meta: 'Dari 2 pembelian', time: '2 hari', head: 'PO/2026/0277', pill: ['success', 'Tervalidasi'], kv: [['Dokumen', 'PO/2026/0277'], ['Barang', '2 item'], ['Gudang', 'Gudang Utama'], ['Selisih', 'Tidak ada'], ['Divalidasi oleh', who()]], when: 'Min, 04 Okt 2026 · 08.45' },
      { icon: 'note', tone: 'lavender', title: 'Kontrak dan SPK', meta: 'ARJ/PRJ/2026/0142', time: '3 hari', head: 'Kontrak dan SPK', pill: ['info', 'Terkonfirmasi'], kv: [['Proyek', 'Lab Jaringan FT'], ['Halaman', '12'], ['Versi', '2'], ['Ditandatangani', '03 Okt 2026'], ['Oleh', who()]], when: 'Sab, 03 Okt 2026 · 16.20' }
    ];
    var base = nextId('prow');
    list.innerHTML = '<p class="ms-plist__title" aria-hidden="true">Aktivitas pembelian</p>' + DATA.map(function (d, i) {
      return '<div class="ms-prow" role="option" id="' + base + '-' + i + '" data-index="' + i + '" aria-selected="false">' +
        '<span class="mc-disc mc-disc--32 mc-disc--' + d.tone + '" aria-hidden="true">' + icon(d.icon, 'mc-icon--16') + '</span>' +
        '<span class="ms-prow__text"><b>' + esc(d.title) + '</b><span>' + esc(d.meta) + '</span></span>' +
        '<span class="ms-prow__time"><span class="mc-sr-only">, </span>' + esc(d.time) + '<span class="mc-sr-only"> lalu</span></span></div>';
    }).join('');
    var empty = doc.createElement('p');
    empty.className = 'ms-pcol__empty';
    empty.textContent = 'Kolom detail dipesan. Pilih baris untuk membuka panel.';
    col.insertBefore(empty, detail);
    var rows = list.querySelectorAll('.ms-prow');
    var state = { sel: -1, active: 0, tl: null, open: false };

    function renderDetail(i) {
      var d = DATA[i];
      detail.innerHTML =
        '<div class="ms-detail__top" data-pblock><span class="mc-pill mc-pill--' + d.pill[0] + '"><span class="mc-pill__dot"></span>' + esc(d.pill[1]) + '</span>' +
          '<button class="mc-btn mc-btn--ghost mc-btn--icon mc-btn--sm ms-detail__x" type="button" data-ms-detail-close aria-label="Tutup panel detail">' + icon('x', 'mc-icon--16') + '</button></div>' +
        '<div data-pblock><h3 class="ms-detail__title">' + esc(d.head) + '</h3><p class="ms-detail__meta">' + icon('clock', 'mc-icon--14') + esc(d.when) + '</p></div>' +
        '<dl class="ms-detail__kv" data-pblock>' + d.kv.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="ms-detail__actions" data-pblock><a class="mc-btn mc-btn--outline mc-btn--sm" href="' + esc((window.MCRoutes && window.MCRoutes.href('dokumen.list')) || '') + '">Buka dokumen</a></div>';
    }
    function mark(i) {
      rows.forEach(function (r, k) { r.setAttribute('aria-selected', String(k === i)); });
      state.sel = i;
    }
    function activeDesc(i) {
      state.active = i;
      rows.forEach(function (r, k) { r.classList.toggle('is-active-desc', k === i && doc.activeElement === list); });
      if (rows[i]) list.setAttribute('aria-activedescendant', rows[i].id);
    }
    function clearTl() { if (state.tl) { state.tl.cancel(); state.tl = null; } }
    var ringFrom = '0 0 0 6px rgba(84, 94, 33, 0)';
    var ringTo = '0 0 0 2px ' + T.olive;

    function openSpecs(i, red) {
      var blocks = detail.querySelectorAll('[data-pblock]');
      if (red) return [fade(detail, 0, 1, T.reduced), fade(empty, 1, 0, T.reduced)];
      var specs = [
        { el: rows[i], kf: [{ boxShadow: ringFrom }, { boxShadow: ringTo }], opt: { duration: T.fast, easing: T.enter } },
        fade(detail, 0, 1, T.instant, P.panelDelay, T.enter),
        { el: detail, kf: [{ clipPath: 'inset(0px calc(50% - ' + 'var(--ms-panel-start) / 2) round 10px)' }, { clipPath: 'inset(0px 0px round 10px)' }], opt: { duration: T.slow, delay: P.panelDelay, easing: T.reveal } }
      ];
      /* WAAPI cannot resolve var() inside keyframes: compute the 3 % start in px */
      var w = detail.offsetWidth || 252;
      var startPx = w * parseFloat(getComputedStyle(doc.body).getPropertyValue('--ms-panel-start') || '3') / 100;
      var side = Math.max(0, (w - startPx) / 2);
      specs[2].kf = [{ clipPath: 'inset(0px ' + side + 'px round 10px)' }, { clipPath: 'inset(0px 0px round 10px)' }];
      Array.prototype.forEach.call(blocks, function (b, k) { specs.push(itemIn(b, P.panelContent + step(k) * T.card, true)); });
      specs.push(fade(empty, 1, 0, T.instant, 0, 'linear'));     /* no placeholder fragments beside the growing clip */
      return specs;
    }
    function closeSpecs(i, red) {
      if (red) return [fade(detail, 1, 0, T.reduced), fade(empty, 0, 1, T.reduced)];
      var w = detail.offsetWidth || 252;
      var side = Math.max(0, (w - w * 0.03) / 2);
      var specs = [
        { el: detail.querySelectorAll('[data-pblock]'), kf: [{ opacity: 1 }, { opacity: 0 }], opt: { duration: 120, easing: T.exit } },
        { el: detail, kf: [{ clipPath: 'inset(0px 0px round 10px)' }, { clipPath: 'inset(0px ' + side + 'px round 10px)' }], opt: { duration: T.base, easing: T.exit } },
        fade(detail, 1, 0, T.fast, T.instant, T.exit),
        fade(empty, 0, 1, T.instant, T.base, 'linear')           /* after the clip is back at 3 % */
      ];
      if (rows[i]) specs.push({ el: rows[i], kf: [{ boxShadow: ringTo }, { boxShadow: ringFrom }], opt: { duration: T.fast, easing: T.exit } });
      return specs;
    }

    function open(i, seekTo) {
      clearTl();
      renderDetail(i);
      detail.hidden = false;
      mark(i);
      state.open = true;
      state.tl = new Timeline(openSpecs(i, reduced()));
      if (seekTo !== undefined) { state.tl.seek(seekTo.p); if (seekTo.ms !== undefined) state.tl.seekTime(seekTo.ms); return state.tl.total; }
      var tl = state.tl;
      syncScrubTl('panel', tl);
      return tl.play().then(function (st) { if (st === 'finished' && state.tl === tl) { tl.cancel(); state.tl = null; } });
    }
    function switchTo(i) {
      if (i === state.sel) return Promise.resolve();
      clearTl();
      var old = state.sel;
      mark(i);
      if (reduced()) {
        var a = detail.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.reduced / 2, easing: 'linear' });
        return a.finished.then(function () { renderDetail(i); detail.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T.reduced / 2, easing: 'linear' }); });
      }
      var specs = [{ el: rows[i], kf: [{ boxShadow: ringFrom }, { boxShadow: ringTo }], opt: { duration: T.fast, easing: T.enter } }];
      if (rows[old]) specs.push({ el: rows[old], kf: [{ boxShadow: ringTo }, { boxShadow: ringFrom }], opt: { duration: T.fast, easing: T.exit } });
      specs.push({ el: detail.querySelectorAll('[data-pblock]'), kf: [{ opacity: 1 }, { opacity: 0 }], opt: { duration: T.instant, easing: T.exit } });
      var tl = state.tl = new Timeline(specs);
      return tl.play().then(function (st) {
        if (state.tl !== tl) return;
        tl.cancel();
        renderDetail(i);
        var tl2 = state.tl = new Timeline(Array.prototype.map.call(detail.querySelectorAll('[data-pblock]'), function (b, k) {
          return { el: b, kf: [{ opacity: 0, transform: 'translateY(' + T.itemRise + 'px)' }, { opacity: 1, transform: 'none' }], opt: { duration: T.fast, delay: step(k) * T.tight, easing: T.enter } };
        }));
        return tl2.play().then(function (s2) { if (s2 === 'finished' && state.tl === tl2) { tl2.cancel(); state.tl = null; } });
      });
    }
    function close() {
      if (!state.open) return Promise.resolve();
      clearTl();
      var i = state.sel;
      var tl = state.tl = new Timeline(closeSpecs(i, reduced()));
      state.open = false;
      return tl.play().then(function (st) {
        if (state.tl !== tl) return;
        tl.cancel(); state.tl = null;
        detail.hidden = true;
        mark(-1);
      });
    }
    function select(i) {
      if (!state.open) return open(i);
      return switchTo(i);
    }
    function rest() {
      clearTl();
      renderDetail(0);
      detail.hidden = false;
      mark(0);
      state.open = true;
    }

    list.addEventListener('click', function (e) {
      var r = e.target.closest('.ms-prow');
      if (!r) return;
      var i = +r.getAttribute('data-index');
      activeDesc(i);
      select(i);
    });
    list.addEventListener('focus', function () { activeDesc(state.sel >= 0 ? state.sel : state.active); });
    list.addEventListener('blur', function () { rows.forEach(function (r) { r.classList.remove('is-active-desc'); }); });
    list.addEventListener('keydown', function (e) {
      var n = rows.length, i = state.active;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeDesc((i + 1) % n); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeDesc((i - 1 + n) % n); }
      else if (e.key === 'Home') { e.preventDefault(); activeDesc(0); }
      else if (e.key === 'End') { e.preventDefault(); activeDesc(n - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(state.active); }
      else if (e.key === 'Escape' && state.open) { e.preventDefault(); close(); }
    });
    detail.addEventListener('click', function (e) { if (e.target.closest('[data-ms-detail-close]')) { close().then(function () { list.focus(); }); } });
    detail.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); close().then(function () { list.focus(); }); } });

    rest();
    stages.panel = {
      play: function () { clearTl(); detail.hidden = true; mark(-1); state.open = false; return open(0); },
      open: function () { return state.open ? Promise.resolve() : open(state.active || 0); },
      close: close,
      seek: function (p, ms) { detail.hidden = true; mark(-1); state.open = false; return open(0, { p: p, ms: ms }); },
      duration: function () { var tl = new Timeline(openSpecs(0, reduced())); var d = tl.total; tl.cancel(); return d; },
      rest: rest,
      tl: function () { return state.tl; }
    };
  })();

  /* ---- 7b. Tabs: page-state transition --------------------------------------- */
  (function () {
    var host = doc.querySelector('[data-ms-tabs]');
    if (!host) return;
    var TABS = [
      { id: 'ringkasan', label: 'Ringkasan', html:
        '<div class="ms-tp-stats"><div class="ms-tp-stat" data-ti><span>Subtotal</span><b>Rp202.200.000</b></div><div class="ms-tp-stat" data-ti><span>Total pajak (11%)</span><b>Rp22.242.000</b></div><div class="ms-tp-stat ms-tp-stat--total" data-ti><span>Total pembelian</span><b>Rp224.442.000</b></div></div>' +
        '<div class="ms-tp-line" data-ti style="margin-top:12px"><span class="ms-tp-ico">' + icon('user', 'mc-icon--16') + '</span><span><b>CV Arunika Jaya</b><small>Pemasok · termin 30 hari</small></span><em>08 Okt 2026</em></div>' +
        '<p class="ms-tp-note" data-ti>Angka dihitung dari baris barang: 20 × Rp9.850.000 + 20 × Rp85.000 + 20 × Rp175.000.</p>' },
      { id: 'barang', label: 'Barang', n: 3, html:
        '<div class="ms-tp-line" data-ti><span class="ms-tp-ico">' + icon('box', 'mc-icon--16') + '</span><span><b>Laptop 14 inci</b><small>LPT-14-15 · 20 unit × Rp9.850.000</small></span><em>Rp197.000.000</em></div>' +
        '<div class="ms-tp-line" data-ti><span class="ms-tp-ico">' + icon('box', 'mc-icon--16') + '</span><span><b>Mouse USB</b><small>MSE-USB · 20 pcs × Rp85.000</small></span><em>Rp1.700.000</em></div>' +
        '<div class="ms-tp-line" data-ti><span class="ms-tp-ico">' + icon('box', 'mc-icon--16') + '</span><span><b>Tas Laptop 14 inci</b><small>TAS-LPT-14 · 20 pcs × Rp175.000</small></span><em>Rp3.500.000</em></div>' },
      { id: 'lampiran', label: 'Lampiran', n: 2, html:
        '<div class="ms-tp-line" data-ti><span class="ms-tp-ico">' + icon('paperclip', 'mc-icon--16') + '</span><span><b>invoice-INV-2026-1028.pdf</b><small>PDF · 1,2 MB · diunggah ' + esc(who()) + '</small></span><em>08 Okt</em></div>' +
        '<div class="ms-tp-line" data-ti><span class="ms-tp-ico">' + icon('paperclip', 'mc-icon--16') + '</span><span><b>penawaran-arunika.pdf</b><small>PDF · 860 KB · diunggah ' + esc(who()) + '</small></span><em>07 Okt</em></div>' +
        '<p class="ms-tp-note" data-ti>PDF, JPG, atau PNG, maks. 10 MB per file.</p>' },
      { id: 'riwayat', label: 'Riwayat', html:
        '<div class="ms-tp-line" data-ti><span class="ms-tp-ico">' + icon('file-text', 'mc-icon--16') + '</span><span><b>Draf dibuat</b><small>' + esc(who()) + ' · 08 Okt 2026, 09.12</small></span><em></em></div>' +
        '<div class="ms-tp-line" data-ti><span class="ms-tp-ico">' + icon('plus', 'mc-icon--16') + '</span><span><b>3 barang ditambahkan</b><small>' + esc(who()) + ' · 08 Okt 2026, 09.20</small></span><em></em></div>' +
        '<div class="ms-tp-line" data-ti><span class="ms-tp-ico">' + icon('clock', 'mc-icon--16') + '</span><span><b>Menunggu tinjauan</b><small>Tahap 2 dari 3</small></span><em></em></div>' }
    ];
    var base = nextId('tab');
    host.innerHTML =
      '<div class="ms-tabs__head"><div><p class="ms-tabs__title">Pembelian PB/2026/0418</p><p class="ms-tabs__sub">Perangkat Lab Jaringan FT · CV Arunika Jaya</p></div><span class="mc-pill mc-pill--neutral mc-pill--sm"><span class="mc-pill__dot"></span>Draf</span></div>' +
      /* r6: the bar scrolls inside its own track on narrow cards (labels stay whole; page never scrolls) */
      '<div class="ms-tabbar-scroll"><div class="ms-tabbar" role="tablist" aria-label="Bagian pembelian"><span class="ms-tabbar__pill" aria-hidden="true"></span>' +
      TABS.map(function (t, i) {
        return '<button class="ms-tab" type="button" role="tab" id="' + base + '-t' + i + '" aria-controls="' + base + '-p' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + esc(t.label) + (t.n ? '<span class="ms-tab__n">' + t.n + '</span>' : '') + '</button>';
      }).join('') + '</div></div>' +
      '<div class="ms-tabpanels">' + TABS.map(function (t, i) {
        return '<div class="ms-tabpanel" role="tabpanel" id="' + base + '-p' + i + '" aria-labelledby="' + base + '-t' + i + '" tabindex="0"' + (i ? ' hidden' : '') + '>' + t.html + '</div>';
      }).join('') + '</div>';
    var bar = host.querySelector('.ms-tabbar');
    var pill = host.querySelector('.ms-tabbar__pill');
    var tabs = host.querySelectorAll('.ms-tab');
    var panels = host.querySelectorAll('.ms-tabpanel');
    var state = { cur: 0, tl: null, from: -1 };

    function rect(i) {
      var t = tabs[i], W = pill.offsetWidth;
      var L = t.offsetLeft - pill.offsetLeft, R = W - (L + t.offsetWidth);
      return { L: L, R: R, w: t.offsetWidth };
    }
    function clip(r) { return 'inset(0px ' + r.R.toFixed(2) + 'px 0px ' + r.L.toFixed(2) + 'px round 7px)'; }
    function place(i) { pill.style.clipPath = clip(rect(i)); }
    function aria(i) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    }
    function settle(i) {
      panels.forEach(function (p, k) { p.hidden = k !== i; });
      place(i);
    }
    function specs(from, to, red, startClip) {
      var oldP = panels[from], newP = panels[to];
      var items = newP.querySelectorAll('[data-ti]');
      var A = rect(from), B = rect(to);
      if (red) {
        return [
          fade(oldP, 1, 0, T.reduced), fade(newP, 0, 1, T.reduced),
          { el: pill, kf: [{ clipPath: clip(A), offset: 0 }, { clipPath: clip(A), offset: 0.5 }, { clipPath: clip(B), offset: 0.5 }, { clipPath: clip(B), offset: 1 }], opt: { duration: T.reduced, easing: 'linear' } }
        ];
      }
      var right = B.L > A.L;
      var s = P.tabStretch * (A.w + B.w) / 2;
      var mid = { L: (A.L + B.L) / 2, R: (A.R + B.R) / 2 };
      if (right) mid.R -= s; else mid.L -= s;                      /* leading edge runs ahead */
      var out = [
        { el: oldP, kf: [{ opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(' + T.blur + 'px)' }], opt: { duration: T.base, easing: T.exit } },
        { el: pill, kf: [{ clipPath: startClip || clip(A) }, { clipPath: clip(mid) }, { clipPath: clip(B) }], opt: { duration: T.slow, easing: T.standard } }
      ];
      Array.prototype.forEach.call(items, function (el, k) { out.push(itemIn(el, P.tabsEnter + step(k) * T.row, false)); });
      return out;
    }
    function go(to, opts) {
      opts = opts || {};
      if (to === state.cur && !opts.force) return Promise.resolve();
      var startClip = null;
      if (state.tl) { startClip = getComputedStyle(pill).clipPath; state.tl.cancel(); state.tl = null; settle(state.cur); }
      var from = opts.from !== undefined ? opts.from : state.cur;
      if (opts.from !== undefined) { settle(from); startClip = null; }
      state.from = from;
      state.cur = to;
      aria(to);
      panels.forEach(function (p, k) { p.hidden = !(k === from || k === to); });
      pill.style.clipPath = clip(rect(to));
      var tl = state.tl = new Timeline(specs(from, to, reduced(), startClip && startClip !== 'none' ? startClip : null));
      if (opts.seek !== undefined) { if (opts.ms !== undefined) tl.seekTime(opts.ms); else tl.seek(opts.seek); return tl.total; }
      syncScrubTl('tabs', tl);
      return tl.play().then(function (st) {
        if (st === 'finished' && state.tl === tl) { tl.cancel(); state.tl = null; settle(to); }
      });
    }
    bar.addEventListener('click', function (e) {
      var t = e.target.closest('.ms-tab');
      if (t) go(Array.prototype.indexOf.call(tabs, t));
    });
    bar.addEventListener('keydown', function (e) {
      var n = tabs.length, i = state.cur, to = -1;
      if (e.key === 'ArrowRight') to = (i + 1) % n;
      else if (e.key === 'ArrowLeft') to = (i - 1 + n) % n;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = n - 1;
      if (to < 0) return;
      e.preventDefault();
      tabs[to].focus();
      go(to);
    });
    function rest() { if (state.tl) { state.tl.cancel(); state.tl = null; } state.cur = 0; aria(0); settle(0); }
    rest();
    if (window.ResizeObserver) new ResizeObserver(function () { if (!state.tl) place(state.cur); }).observe(bar);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { if (!state.tl) place(state.cur); });
    stages.tabs = {
      play: function () { return go(2, { from: 0, force: true }); },
      open: function () { return go((state.cur + 1) % tabs.length); },
      close: function () { return go(0); },
      seek: function (p, ms) { return go(2, { from: 0, force: true, seek: p, ms: ms }); },
      duration: function () { var tl = new Timeline(specs(0, 2, reduced())); var d = tl.total; tl.cancel(); return d; },
      rest: rest,
      tl: function () { return state.tl; }
    };
  })();

  /* ---- 7c. Feedback specimens (scripted demo of hover -> press -> focus) -------- */
  (function () {
    var stage = doc.querySelector('[data-ms-stage="feedback"]');
    if (!stage) return;
    var q = function (s) { return stage.querySelector(s); };
    var btn = q('[data-ms-fb="press"]'), row = q('[data-ms-fb="row"]'), input = q('[data-ms-fb="input"]');
    var link = q('[data-ms-fb="link"] .ms-nudge'), chev = q('[data-ms-fb="chev"]'), chevIcon = chev && chev.querySelector('.ms-nudge');
    var rowChev = row && row.querySelector('.ms-fb__chev');
    var state = { tl: null, holdTimer: 0 };
    var hover = getComputedStyle(html).getPropertyValue('--color-row-hover').trim() || '#f8f9f4';
    var ring = getComputedStyle(html).getPropertyValue('--focus-ring').trim() || '0 0 0 3px rgba(84, 94, 33, .35)';

    function specs(red) {
      if (red) {
        return [
          { el: row, kf: [{ backgroundColor: 'rgba(245, 246, 240, 0)' }, { backgroundColor: hover }], opt: { duration: T.reduced, easing: 'linear' } },
          { el: input, kf: [{ borderColor: '#e4e4e2' }, { borderColor: T.olive, boxShadow: ring }], opt: { duration: T.reduced, easing: 'linear' } }
        ];
      }
      return [
        /* hover tints in (80 ms) */
        { el: row, kf: [{ backgroundColor: 'rgba(245, 246, 240, 0)' }, { backgroundColor: hover }], opt: { duration: T.instant, easing: T.enter } },
        { el: rowChev, kf: [{ transform: 'none' }, { transform: 'translateX(2px)' }], opt: { duration: T.fast, easing: T.enter } },
        { el: link, kf: [{ transform: 'none' }, { transform: 'translateX(2px)' }], opt: { duration: T.fast, delay: 40, easing: T.enter } },
        { el: chev, kf: [{ backgroundColor: '#f2f3ee' }, { backgroundColor: '#e9eae4' }], opt: { duration: T.instant, delay: 40, easing: T.enter } },
        { el: chevIcon, kf: [{ transform: 'none' }, { transform: 'translateX(2px)' }], opt: { duration: T.fast, delay: 40, easing: T.enter } },
        /* press: 0.97 in 80 ms, release 160 ms */
        { el: btn, kf: [{ transform: 'none', offset: 0 }, { transform: 'scale(' + T.press + ')', offset: 1 / 3 }, { transform: 'none', offset: 1 }], opt: { duration: T.instant + T.fast, delay: 120, easing: 'linear' } },
        /* keyboard focus: instant ring + border (step at 240 ms) */
        { el: input, kf: [{ borderColor: '#e4e4e2', boxShadow: 'none', offset: 0 }, { borderColor: '#e4e4e2', boxShadow: 'none', offset: 0.6 }, { borderColor: T.olive, boxShadow: ring, offset: 0.6001 }, { borderColor: T.olive, boxShadow: ring, offset: 1 }], opt: { duration: 400, easing: 'linear' } }
      ];
    }
    function clear() { clearTimeout(state.holdTimer); if (state.tl) { state.tl.cancel(); state.tl = null; } }
    function play() {
      clear();
      var tl = state.tl = new Timeline(specs(reduced()));
      syncScrubTl('feedback', tl);
      return tl.play().then(function (st) {
        if (st !== 'finished' || state.tl !== tl) return;
        state.holdTimer = setTimeout(function () {                 /* hold, then release (reverse, 1.5x) */
          if (state.tl !== tl) return;
          tl.reverse(1.5).then(function (s2) { if (state.tl === tl && s2 === 'reversed') { tl.cancel(); state.tl = null; } });
        }, 700);
      });
    }
    /* Inline validation: message drops 4 px in (160 ms), border colour 160 ms, no shake. */
    var vInput = stage.querySelector('[data-ms-validate]'), vErr = stage.querySelector('[data-ms-fb-error]');
    function validate() {
      var bad = /^\s*(rp)?\s*0*\s*$/i.test(vInput.value.replace(/\./g, ''));
      vInput.setAttribute('aria-invalid', String(bad));
      if (bad && vErr.hidden) {
        vErr.hidden = false;
        vErr.animate(reduced() ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: reduced() ? T.reduced : T.fast, easing: reduced() ? 'linear' : T.enter });
      } else if (!bad) vErr.hidden = true;
    }
    if (vInput) { vInput.addEventListener('blur', validate); vInput.addEventListener('input', function () { if (vInput.getAttribute('aria-invalid') === 'true') validate(); }); validate(); }

    stages.feedback = {
      play: play,
      open: play,
      close: function () { clear(); return Promise.resolve(); },
      seek: function (p, ms) { clear(); var tl = state.tl = new Timeline(specs(reduced())); if (ms !== undefined) tl.seekTime(ms); else tl.seek(p); return tl.total; },
      duration: function () { var tl = new Timeline(specs(reduced())); var d = tl.total; tl.cancel(); return d; },
      rest: clear,
      tl: function () { return state.tl; }
    };
  })();

  /* ---- 7d. Stagger ------------------------------------------------------------ */
  (function () {
    var stg = doc.querySelector('[data-ms-stg]');
    var rowsHost = doc.querySelector('[data-ms-stg-rows]');
    var gantt = doc.querySelector('[data-ms-gantt]');
    if (!stg || !rowsHost) return;
    var ROWS = [
      ['invoice', 'Invoice INV/2026/1028 diterbitkan', '2 jam'], ['credit-card', 'Pembayaran diterima', '5 jam'],
      ['archive', 'Barang masuk gudang', '1 hari'], ['note', 'Dokumen dikonfirmasi', '1 hari'],
      ['box', 'Penerimaan barang divalidasi', '2 hari'], ['truck', 'Pengiriman proyek dijadwalkan', '2 hari'],
      ['check', 'Anggaran perangkat disetujui', '3 hari'], ['cart', 'Pembelian PB/2026/0418 dibuat', '3 hari'],
      ['receipt', 'Termin 2 ditagihkan', '4 hari'], ['file-text', 'Laporan September diekspor', '5 hari']
    ];
    rowsHost.innerHTML = ROWS.map(function (r) {
      return '<li data-stg="row"><i>' + icon(r[0], 'mc-icon--12') + '</i><span>' + esc(r[1]) + '</span><small>' + esc(r[2]) + '</small></li>';
    }).join('');
    var cards = stg.querySelectorAll('[data-stg="card"]');
    var rows = rowsHost.querySelectorAll('[data-stg="row"]');
    var state = { tl: null };

    /* One schedule feeds both the animation and the Gantt chart. */
    function schedule() {
      var out = [];
      cards.forEach(function (c, i) {
        var d = step(i) * T.card;
        out.push({ kind: 'card', el: c, delay: d, dur: T.moderate, label: i < 3 ? 'K' + (i + 1) : 'Daftar' });
        c.querySelectorAll(':scope > [data-stg="content"]').forEach(function (ct) {
          out.push({ kind: 'content', el: ct, delay: d + T.contentOffset, dur: T.base, hidden: true });
        });
      });
      var listDelay = step(cards.length - 1) * T.card + T.contentOffset;
      rows.forEach(function (r, j) {                                   /* rows from list card + 120 (4.4); 9 and 10 share step 8 */
        out.push({ kind: j >= T.steps ? 'shared' : 'row', el: r, delay: listDelay + step(j) * T.row, dur: T.base, label: 'B' + (j + 1) });
      });
      return out;
    }
    function specs(red) {
      var sc = schedule();
      if (red) return sc.map(function (s) { return fade(s.el, 0, 1, T.reduced); });
      return flat(sc.map(function (s) {
        if (s.kind === 'card') return containerIn(s.el, s.delay);
        if (s.kind === 'content') return [itemIn(s.el, s.delay, true)];
        return [itemIn(s.el, s.delay, false)];
      }));
    }
    function drawGantt() {
      if (!gantt) return;
      var sc = schedule().filter(function (s) { return !s.hidden; });
      var max = 900;
      gantt.innerHTML = '<p class="ms-gantt__title">Jadwal</p><p class="ms-gantt__sub">kartu 60 ms · baris 40 ms · maks 8</p>' +
        '<div class="ms-gantt__plot">' + sc.map(function (s) {
          return '<div class="ms-gantt__row"><span>' + s.label + '</span><span class="ms-gantt__track"><i class="ms-gantt__bar is-' + s.kind + '" style="left:' + (s.delay / max * 100).toFixed(2) + '%;width:' + (s.dur / max * 100).toFixed(2) + '%"></i></span></div>';
        }).join('') + '<i class="ms-gantt__head" data-ms-gantt-head style="--t:1"></i></div>' +
        '<div class="ms-gantt__axis">' + [0, 300, 600, 900].map(function (v) { return '<span style="left:' + (v / max * 100) + '%">' + v + '</span>'; }).join('') + '</div>';
      var all = schedule();
      var cardsAt = all.filter(function (s) { return s.kind === 'card'; }).map(function (s) { return s.delay; });
      var rowsAt = all.filter(function (s) { return s.kind === 'row' || s.kind === 'shared'; }).map(function (s) { return s.delay; });
      var end = Math.round(all.reduce(function (m, s) { return Math.max(m, s.delay + s.dur); }, 0));
      gantt.setAttribute('aria-label', 'Jadwal masuk bertahap. Label K1 sampai K3 adalah kartu KPI 1 sampai 3, B1 sampai B' + rowsAt.length + ' adalah baris daftar. ' +
        'Kartu KPI 1 sampai 3 dan kartu Daftar mulai pada ' + cardsAt.join(', ') + ' milidetik; isi tiap kartu 120 milidetik setelah kartunya. ' +
        'Baris 1 sampai ' + T.steps + ' mulai tiap ' + T.row + ' milidetik dari ' + rowsAt[0] + ' sampai ' + rowsAt[T.steps - 1] + ' milidetik; baris berikutnya berbagi langkah ke-' + T.steps + '. Selesai dalam ' + end + ' milidetik.');
    }
    drawGantt();
    var head = gantt && gantt.querySelector('[data-ms-gantt-head]');
    function setHead(t) { if (head) head.style.setProperty('--t', String(clamp(t / 900, 0, 1))); }
    function clear() { if (state.tl) { state.tl.cancel(); state.tl = null; } }
    function play() {
      clear();
      var tl = state.tl = new Timeline(specs(reduced()));
      syncScrubTl('stagger', tl, setHead);
      return tl.play().then(function (st) { if (st === 'finished' && state.tl === tl) { tl.cancel(); state.tl = null; } });
    }
    stages.stagger = {
      play: play, open: play,
      close: function () { clear(); return Promise.resolve(); },
      seek: function (p, ms) { clear(); var tl = state.tl = new Timeline(specs(reduced())); if (ms !== undefined) tl.seekTime(ms); else tl.seek(p); setHead(tl.time()); return tl.total; },
      duration: function () { var tl = new Timeline(specs(reduced())); var d = tl.total; tl.cancel(); return d; },
      rest: function () { clear(); setHead(900); },
      tl: function () { return state.tl; },
      onTime: setHead
    };
  })();

  /* ---- 7e. Status feedback ------------------------------------------------------ */
  (function () {
    var stage = doc.querySelector('[data-ms-stage="status"]');
    if (!stage) return;
    var save = stage.querySelector('[data-ms-save]');
    var saveLive = stage.querySelector('[data-ms-save-live]');
    var morph = stage.querySelector('[data-ms-morph]');
    var STATUSES = [['pending', 'Menunggu'], ['success', 'Disetujui'], ['danger', 'Ditolak']];
    var state = { tl: null, status: 0, counts: { a: 5, b: 42, c: 3 }, saveTimer: 0, specimen: null };
    var layers = {};
    ['idle', 'busy', 'done'].forEach(function (k) { layers[k] = save.querySelector('.ms-save__' + k); });

    /* Save button: idle -> busy (spinner at a fixed width) -> done (success morph). */
    function setSave(to, animate) {
      var from = save.getAttribute('data-state');
      if (from === to) return;
      save.setAttribute('data-state', to);
      Object.keys(layers).forEach(function (k) { layers[k].setAttribute('aria-hidden', String(k !== to)); });
      saveLive.textContent = to === 'busy' ? 'Menyimpan…' : (to === 'done' ? 'Tersimpan' : '');
      if (!animate) return;
      var d = reduced() ? T.reduced : T.fast;
      layers[from].animate([{ opacity: 1 }, { opacity: 0 }], { duration: d, easing: 'linear' });
      layers[to].animate([{ opacity: 0 }, { opacity: 1 }], { duration: d, easing: 'linear' });
    }
    save.addEventListener('click', function () {
      var s = save.getAttribute('data-state');
      clearTimeout(state.saveTimer);
      if (s === 'idle') {
        setSave('busy', true);
        state.saveTimer = setTimeout(function () { setSave('done', true); }, 1100);
      } else if (s === 'done') setSave('idle', true);
    });

    /* Status pill morph: label crossfade 160 ms; the background clip walks between widths. */
    function face(i) {
      var f = doc.createElement('span');
      f.className = 'ms-morph__face mc-pill--' + STATUSES[i][0];
      f.innerHTML = '<span class="mc-pill__dot"></span>' + esc(STATUSES[i][1]);
      return f;
    }
    morph.innerHTML = '<span class="ms-morph__bg"></span>';
    var bg = morph.firstChild;
    var curFace = face(0);
    morph.appendChild(curFace);
    function paintBg(f) { var c = getComputedStyle(f); bg.style.background = c.getPropertyValue('--pill-bg'); }
    paintBg(curFace);
    function morphSpecs(to) {
      var oldF = curFace, newF = face(to);
      morph.appendChild(newF);
      var wA = oldF.offsetWidth, wB = newF.offsetWidth, W = Math.max(wA, wB);
      morph.style.width = W + 'px';
      newF.style.justifySelf = oldF.style.justifySelf = 'start';
      var cA = getComputedStyle(oldF).getPropertyValue('--pill-bg').trim(), cB = getComputedStyle(newF).getPropertyValue('--pill-bg').trim();
      bg.style.background = cB;
      var red = reduced(), d = red ? T.reduced : T.fast;
      var specs = [fade(oldF, 1, 0, d), fade(newF, 0, 1, d), { el: bg, kf: [{ backgroundColor: cA }, { backgroundColor: cB }], opt: { duration: d, easing: 'linear' } }];
      if (!red) specs.push({ el: bg, kf: [{ clipPath: 'inset(0px ' + (W - wA) + 'px 0px 0px round 999px)' }, { clipPath: 'inset(0px ' + (W - wB) + 'px 0px 0px round 999px)' }], opt: { duration: d, easing: T.standard } });
      else bg.style.clipPath = 'inset(0px ' + (W - wB) + 'px 0px 0px round 999px)';
      return { specs: specs, commit: function () { oldF.remove(); curFace = newF; morph.style.width = ''; bg.style.clipPath = ''; newF.style.justifySelf = ''; state.status = to; } };
    }
    function morphTo(to) {
      var m = morphSpecs(to);
      var tl = new Timeline(m.specs);
      return tl.play().then(function () { tl.cancel(); m.commit(); });
    }
    stage.querySelector('[data-ms-morph-next]').addEventListener('click', function () {
      if (morph.children.length > 2) return;                   /* a morph is running */
      morphTo((state.status + 1) % STATUSES.length);
    });

    /* Rolling digits: changed digit columns roll upward (old out, new in), 160 ms. */
    var rolls = {};
    stage.querySelectorAll('[data-ms-roll]').forEach(function (el) { rolls[el.getAttribute('data-ms-roll')] = el; setDigits(el, el.textContent.trim()); });
    function setDigits(el, str) {
      el.innerHTML = str.split('').map(function (ch) { return '<span class="ms-roll__col"><span>' + ch + '</span></span>'; }).join('');
      el.setAttribute('data-value', str);
    }
    function rollSpecs(el, to, delay) {
      var from = el.getAttribute('data-value'), str = String(to);
      var specs = [], commits = [];
      if (from === str) return { specs: specs, commit: function () {} };
      if (from.length !== str.length) {
        setDigits(el, str);
        return { specs: [fade(el, 0, 1, reduced() ? T.reduced : T.fast, delay)], commit: function () {} };
      }
      var cols = el.querySelectorAll('.ms-roll__col');
      var red = reduced(), d = red ? T.reduced : T.fast;
      str.split('').forEach(function (ch, i) {
        if (from[i] === ch) return;
        var col = cols[i];
        var oldS = col.firstElementChild;
        var newS = doc.createElement('span');
        newS.textContent = ch;
        col.appendChild(newS);
        if (red) specs.push(fade(oldS, 1, 0, d, delay), fade(newS, 0, 1, d, delay));
        else specs.push(
          { el: oldS, kf: [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }], opt: { duration: d, delay: delay, easing: T.enter } },
          { el: newS, kf: [{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'none', opacity: 1 }], opt: { duration: d, delay: delay, easing: T.enter } }
        );
        commits.push(function () { oldS.remove(); });
      });
      el.setAttribute('data-value', str);
      return { specs: specs, commit: function () { commits.forEach(function (f) { f(); }); } };
    }
    function countSpecs(delta) {
      var c = state.counts;
      if (c.a + delta < 0) return null;
      c.a += delta; c.b += delta; c.c = Math.max(0, c.c + delta);
      var cascade = reduced() ? 0 : T.card;                   /* dependent counters 60 ms apart */
      var parts = [rollSpecs(rolls.a, c.a, 0), rollSpecs(rolls.b, c.b, cascade), rollSpecs(rolls.c, c.c, cascade * 2)];
      return { specs: flat(parts.map(function (x) { return x.specs; })), commit: function () { parts.forEach(function (x) { x.commit(); }); } };
    }
    stage.querySelectorAll('[data-ms-count]').forEach(function (b) {
      b.addEventListener('click', function () {
        var r = countSpecs(+b.getAttribute('data-ms-count'));
        if (!r) return;
        var tl = new Timeline(r.specs);
        tl.play().then(function () { tl.cancel(); r.commit(); });
      });
    });

    /* Toast demo + the static specimen shown at rest. */
    function specimen() {
      if (state.specimen && state.specimen.isConnected) return state.specimen;
      var el = toastEl('Draf pembelian disimpan', 'PB/2026/0418 · Lab Jaringan FT');
      el.setAttribute('role', 'presentation');
      el.setAttribute('aria-hidden', 'true');
      el.querySelector('.mc-toast__close').tabIndex = -1;
      el.querySelector('.mc-toast__close').addEventListener('click', function () { toastOut(el); });
      el.classList.add('is-specimen');
      stageToasts.appendChild(el);
      state.specimen = el;
      return el;
    }
    stage.querySelector('[data-ms-toast-demo]').addEventListener('click', function () {
      if (state.specimen && state.specimen.isConnected) toastOut(state.specimen);
      toast('Draf pembelian disimpan', 'PB/2026/0418 · Lab Jaringan FT', { region: 'stage' });
    });

    /* Scripted composite for replay / seek: toast in, save busy -> done, pill
       Menunggu -> Disetujui, counts 5 / 42 / 3 roll down by one, cascading. */
    var pending = null;
    function resetState() {
      if (state.tl) { state.tl.cancel(); state.tl = null; }
      if (pending) { pending.forEach(function (f) { f(); }); pending = null; }
      clearTimeout(state.saveTimer);
      save.style.transitionProperty = '';
      Array.prototype.forEach.call(stageToasts.querySelectorAll('.mc-toast:not(.is-specimen)'), function (t) { t.remove(); });
      setSave('idle', false);
      Array.prototype.forEach.call(morph.querySelectorAll('.ms-morph__face'), function (f) { f.remove(); });
      curFace = face(0); morph.appendChild(curFace); paintBg(curFace); state.status = 0; morph.style.width = ''; bg.style.clipPath = '';
      state.counts = { a: 5, b: 42, c: 3 };
      setDigits(rolls.a, '5'); setDigits(rolls.b, '42'); setDigits(rolls.c, '3');
    }
    function composite() {
      resetState();
      var t = specimen();
      var specs = toastInSpecs(t);
      /* save: busy -> done at +80 ms */
      save.style.transitionProperty = 'transform';            /* WAAPI owns the colours while scripted */
      setSave('busy', false);
      save.setAttribute('data-state', 'done');
      Object.keys(layers).forEach(function (k) { layers[k].setAttribute('aria-hidden', String(k !== 'done')); });
      var red = reduced(), d = red ? T.reduced : T.fast;
      var btnFrom = getComputedStyle(doc.body).getPropertyValue('--color-primary').trim() || '#1a5035';
      var btnTo = getComputedStyle(doc.body).getPropertyValue('--color-success-bg').trim() || '#e3f4e9';
      specs.push(
        { el: layers.busy, kf: [{ opacity: 1 }, { opacity: 0 }], opt: { duration: d, delay: red ? 0 : 80, easing: 'linear' } },
        { el: layers.done, kf: [{ opacity: 0 }, { opacity: 1 }], opt: { duration: d, delay: red ? 0 : 80, easing: 'linear' } },
        { el: save, kf: [{ backgroundColor: btnFrom, color: '#ffffff' }, { backgroundColor: btnTo, color: getComputedStyle(doc.body).getPropertyValue('--color-success-fg').trim() || '#236b49' }], opt: { duration: d, delay: red ? 0 : 80, easing: 'linear' } }
      );
      var m = morphSpecs(1);
      m.specs.forEach(function (s) { s.opt.delay = (s.opt.delay || 0) + (red ? 0 : 120); specs.push(s); });
      var c = countSpecs(-1);
      if (c) c.specs.forEach(function (s) { s.opt.delay = (s.opt.delay || 0) + (red ? 0 : 160); specs.push(s); });
      pending = [m.commit, c ? c.commit : function () {}];
      return specs;
    }
    function commitPending() { if (pending) { pending.forEach(function (f) { f(); }); pending = null; } save.style.transitionProperty = ''; }
    function play() {
      var tl = state.tl = new Timeline(composite());
      syncScrubTl('status', tl);
      return tl.play().then(function (st) { if (st === 'finished' && state.tl === tl) { tl.cancel(); state.tl = null; commitPending(); } });
    }
    specimen();
    stages.status = {
      play: play, open: play,
      close: function () { resetState(); specimen(); return Promise.resolve(); },
      seek: function (p, ms) { var tl = state.tl = new Timeline(composite()); if (ms !== undefined) tl.seekTime(ms); else tl.seek(p); return tl.total; },
      duration: function () { return reduced() ? T.reduced : Math.max(T.base, 80 + T.fast, 120 + T.fast, 160 + 2 * T.card + T.fast); },
      rest: function () { resetState(); specimen(); },
      tl: function () { return state.tl; }
    };
  })();

  /* ---- 7f. Auth panel summary: schematic + timing diagram ------------------------- */
  (function () {
    var host = doc.querySelector('[data-ms-auth]');
    var timing = doc.querySelector('[data-ms-timing]');
    if (!host || !timing) return;
    var q = function (k) { return host.querySelector('[data-auth="' + k + '"]'); };
    var card = host.querySelector('.ms-auth__card');
    var visual = q('visual'), copyA = q('copyA'), copyB = q('copyB'), formA = q('formA'), formB = q('formB');
    var state = { tl: null };
    var SPLIT = 13 / 24;                  /* REF-M2 13 : 11 split */
    var DISSOLVE = 66 / 1336;             /* login: verify panel starts after the 66 px dissolve band */
    function clipA() { return 'inset(0% ' + ((1 - SPLIT) * 100).toFixed(3) + '% 0% 0% round 0px 7px 7px 0px)'; }
    function clipB() { return 'inset(0% 0% 0% ' + ((SPLIT + DISSOLVE) * 100).toFixed(3) + '% round 7px 0px 0px 7px)'; }
    function rest(which) {
      var b = which === 'B';
      visual.style.clipPath = b ? clipB() : clipA();
      formA.style.opacity = b ? '0' : ''; formB.style.opacity = b ? '' : '0';
      copyA.style.opacity = b ? '0' : ''; copyB.style.opacity = b ? '' : '0';
    }
    function specs(red) {
      var W = card.offsetWidth || 260;
      var travel = W * (1 - SPLIT);                 /* right edge travels one sheet width */
      var slot = W * SPLIT;                          /* form slot moves from x = split to 0 */
      var D = T.auth;
      if (red) {
        return [
          { el: visual, kf: [{ clipPath: clipA(), opacity: 1, offset: 0 }, { clipPath: clipA(), opacity: 0, offset: 0.5 }, { clipPath: clipB(), opacity: 0, offset: 0.5001 }, { clipPath: clipB(), opacity: 1, offset: 1 }], opt: { duration: T.reduced, easing: 'linear' } },
          fade(formA, 1, 0, T.reduced), fade(formB, 0, 1, T.reduced), fade(copyA, 1, 0, T.reduced), fade(copyB, 0, 1, T.reduced)
        ];
      }
      var swap = function (from, to) { return [{ opacity: from, offset: 0 }, { opacity: from, offset: 0.5 }, { opacity: to, offset: 0.5001 }, { opacity: to, offset: 1 }]; };
      return [
        { el: visual, kf: [{ clipPath: clipA() }, { clipPath: clipB() }], opt: { duration: D, easing: T.standard } },
        { el: copyA, kf: [{ transform: 'none', opacity: 1 }, { transform: 'translateX(' + (-2 * travel).toFixed(1) + 'px)', opacity: 1 }], opt: { duration: D, easing: T.standard } },
        { el: copyB, kf: [{ transform: 'translateX(' + (2 * travel).toFixed(1) + 'px)', opacity: 1 }, { transform: 'none', opacity: 1 }], opt: { duration: D, easing: T.standard } },
        { el: formA, kf: [{ transform: 'none' }, { transform: 'translateX(' + (-slot).toFixed(1) + 'px)' }], opt: { duration: D, easing: T.standard } },
        { el: formB, kf: [{ transform: 'translateX(' + slot.toFixed(1) + 'px)' }, { transform: 'none' }], opt: { duration: D, easing: T.standard } },
        { el: formA, kf: swap(1, 0), opt: { duration: D, easing: T.standard } },
        { el: formB, kf: swap(0, 1), opt: { duration: D, easing: T.standard } }
      ];
    }
    /* Timing diagram (SVG, drawn from the same curve and constants). */
    function drawTiming() {
      /* drawn at the box's real pixel size so the labels stay at 10.5-11.5 px */
      var cst = getComputedStyle(timing);
      var W = Math.max(280, Math.round(timing.clientWidth - parseFloat(cst.paddingLeft) - parseFloat(cst.paddingRight)));
      var H = Math.max(220, Math.round(timing.clientHeight - parseFloat(cst.paddingTop) - parseFloat(cst.paddingBottom)));
      var x0 = 172, x1 = W - 6, top = 4;
      var X = function (t) { return x0 + (x1 - x0) * t; };
      var pitch = Math.floor((H - 30 - top) / 6);
      var rowsY = [0, 1, 2, 3, 4, 5].map(function (k) { return top + k * pitch; });
      var rh = Math.min(26, pitch - 10);
      var tCopyOut = invert(easeStd, 0.265), tCopyIn = invert(easeStd, 0.735);
      var curve = function (y, inv) {
        var d = '';
        for (var i = 0; i <= 40; i++) { var t = i / 40, e = easeStd(t); var yy = inv ? y + rh * e : y + rh * (1 - e); d += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + yy.toFixed(1); }
        return d;
      };
      var labels = ['Klip panel visual', 'Slot formulir', 'Konten langkah', 'Teks visual (2×)', 'Gambar latar', 'Gerak dikurangi'];
      var notes = ['geser satu lebar lembar', 'arah berlawanan', 'tukar tersembunyi, e = 0,5', 'keluar e 0,27 · masuk e 0,73', 'tetap pada kartu', 'crossfade 150 ms'];
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '">';
      [0, 0.25, 0.5, 0.75, 1].forEach(function (t) { s += '<line class="t-grid" x1="' + X(t) + '" y1="' + top + '" x2="' + X(t) + '" y2="' + (H - 20) + '"/>'; });
      s += '<rect class="t-hidden" x="' + X(0.47) + '" y="' + top + '" width="' + (X(0.53) - X(0.47)) + '" height="' + (rowsY[4] - top - 4) + '"/>';
      labels.forEach(function (l, i) {
        s += '<text class="t-label" x="0" y="' + (rowsY[i] + 11) + '">' + l + '</text><text class="t-note" x="0" y="' + (rowsY[i] + 24) + '">' + notes[i] + '</text>';
      });
      var mid = function (i) { return rowsY[i] + rh / 2 - 5; };
      s += '<path class="t-curve" d="' + curve(rowsY[0], false) + '"/>';
      s += '<path class="t-curve t-curve--b" d="' + curve(rowsY[1], true) + '"/>';
      s += '<rect class="t-bar" x="' + X(0) + '" y="' + mid(2) + '" width="' + (X(0.5) - X(0)) + '" height="10" rx="2"/>';
      s += '<rect class="t-bar t-bar--new" x="' + X(0.5) + '" y="' + mid(2) + '" width="' + (X(1) - X(0.5)) + '" height="10" rx="2"/>';
      s += '<line class="t-swap" x1="' + X(0.5) + '" y1="' + top + '" x2="' + X(0.5) + '" y2="' + (rowsY[4] - 4) + '"/>';
      s += '<rect class="t-bar t-bar--copy" x="' + X(0) + '" y="' + mid(3) + '" width="' + (X(tCopyOut) - X(0)) + '" height="10" rx="2"/>';
      s += '<rect class="t-bar t-bar--copynew" x="' + X(tCopyIn) + '" y="' + mid(3) + '" width="' + (X(1) - X(tCopyIn)) + '" height="10" rx="2"/>';
      s += '<line class="t-flat" x1="' + X(0) + '" y1="' + (mid(4) + 5) + '" x2="' + X(1) + '" y2="' + (mid(4) + 5) + '"/>';
      s += '<rect class="t-reduced" x="' + X(0) + '" y="' + mid(5) + '" width="' + (X(T.reduced / T.auth) - X(0)) + '" height="10" rx="2"/>';
      s += '<line class="t-axis" x1="' + x0 + '" y1="' + (H - 20) + '" x2="' + x1 + '" y2="' + (H - 20) + '"/>';
      [0, 150, 300, 450, 600].forEach(function (v) {
        var t = v / T.auth;
        if (t > 1) return;
        var anchor = v === 0 ? 'start' : (t === 1 ? 'end' : 'middle');
        s += '<text x="' + X(t) + '" y="' + (H - 6) + '" text-anchor="' + anchor + '">' + v + (t === 1 ? ' ms' : '') + '</text>';
      });
      s += '<line class="t-head" data-ms-auth-head x1="' + X(0) + '" y1="' + top + '" x2="' + X(0) + '" y2="' + (H - 20) + '" style="display:none"/>';
      s += '</svg>';
      timing.innerHTML = s;
      timing.setAttribute('aria-label', 'Diagram waktu 600 milidetik pada kurva standard: klip panel visual dan slot formulir bergerak berlawanan arah; konten langkah ditukar saat tersembunyi di tengah; teks visual paralaks dua kali, keluar sekitar ' + Math.round(tCopyOut * T.auth) + ' ms dan masuk dari ' + Math.round(tCopyIn * T.auth) + ' ms; gambar latar tetap; gerak dikurangi memakai crossfade 150 ms.');
      state.X = X;
    }
    drawTiming();
    var headLine = timing.querySelector('[data-ms-auth-head]');
    var lastHead = null;
    if (window.ResizeObserver) new ResizeObserver(function () {
      drawTiming();
      headLine = timing.querySelector('[data-ms-auth-head]');
      if (lastHead !== null) setHead(lastHead);
    }).observe(timing);
    function setHead(t) {
      if (!headLine) return;
      lastHead = t;
      var p = clamp(t / T.auth, 0, 1);
      var x = state.X(p);
      headLine.setAttribute('x1', x); headLine.setAttribute('x2', x);
      headLine.style.display = '';
    }
    function clear() { if (state.tl) { state.tl.cancel(); state.tl = null; } }
    function build() { clear(); rest('A'); visual.style.clipPath = ''; formA.style.opacity = formB.style.opacity = copyA.style.opacity = copyB.style.opacity = ''; return new Timeline(specs(reduced())); }
    function play() {
      var tl = state.tl = build();
      syncScrubTl('auth', tl, setHead);
      return tl.play().then(function (st) { if (st === 'finished' && state.tl === tl) { tl.cancel(); state.tl = null; rest('B'); setHead(T.auth); } });
    }
    rest('B');
    stages.auth = {
      play: play, open: play,
      close: function () { clear(); rest('A'); if (headLine) headLine.style.display = 'none'; return Promise.resolve(); },
      seek: function (p, ms) { var tl = state.tl = build(); if (ms !== undefined) tl.seekTime(ms); else tl.seek(p); setHead(tl.time()); return tl.total; },
      duration: function () { return reduced() ? T.reduced : T.auth; },
      rest: function () { clear(); rest('B'); setHead(T.auth); },
      tl: function () { return state.tl; },
      onTime: setHead
    };
  })();

  /* ---------------------------------------------------------------------------
     8. Scrub bars (replay + seek slider + time readout) per demo card
     ------------------------------------------------------------------------- */
  var LABELS = {
    palette: 'palet perintah', dialog: 'dialog', panel: 'panel samping', tabs: 'transisi tab',
    feedback: 'umpan balik', stagger: 'masuk bertahap', status: 'umpan balik status', auth: 'panel autentikasi'
  };
  var scrubs = {};
  function scrubFor(name) { return scrubs[name]; }
  function durationOf(name) {
    if (name === 'palette' || name === 'dialog') return OVERLAYS[name].duration('stage');
    if (name === 'drawer') return OVERLAYS.drawer.duration('page');
    return stages[name] ? stages[name].duration() : 0;
  }
  function updateReadout(name, t) {
    var s = scrubs[name];
    if (!s) return;
    var total = s.total || durationOf(name);
    s.total = total;
    var p = total ? clamp(t / total, 0, 1) : 1;
    s.range.value = String(Math.round(p * 1000));
    s.range.style.setProperty('--p', (p * 100).toFixed(1) + '%');
    s.range.setAttribute('aria-valuetext', Math.round(t) + ' dari ' + Math.round(total) + ' milidetik');
    s.time.innerHTML = '<b>' + Math.round(t) + '</b> / ' + Math.round(total) + ' ms';
    if (stages[name] && stages[name].onTime) stages[name].onTime(t);
  }
  function loop(name, tl, extra) {
    var s = scrubs[name];
    if (!s) return;
    s.total = tl.total;
    cancelAnimationFrame(s.raf);
    var tick = function () {
      var t = tl.time();
      updateReadout(name, t);
      if (extra) extra(t);
      if (tl.state === 'running') s.raf = requestAnimationFrame(tick);
      else updateReadout(name, tl.state === 'cancelled' || tl.state === 'finished' ? tl.total : t);
    };
    s.raf = requestAnimationFrame(tick);
  }
  function syncScrub(name, inst) { if (inst.where === 'stage' && inst.tl) loop(name, inst.tl); }
  function syncScrubTl(name, tl, extra) { loop(name, tl, extra); }

  document.querySelectorAll('[data-ms-scrub]').forEach(function (el) {
    var name = el.getAttribute('data-ms-scrub');
    var id = nextId('scrub');
    el.innerHTML =
      '<button class="mc-btn mc-btn--outline mc-btn--sm ms-scrub__replay" type="button">' + icon('ms-rotate', 'mc-icon--16') + '<span class="mc-btn__label">Putar ulang</span></button>' +
      '<label class="mc-sr-only" for="' + id + '">Posisi animasi ' + LABELS[name] + '</label>' +
      '<input class="ms-scrub__range" id="' + id + '" type="range" min="0" max="1000" step="10" value="1000">' +
      '<output class="ms-scrub__time" for="' + id + '" aria-live="off"></output>';
    var s = scrubs[name] = { el: el, range: el.querySelector('input'), time: el.querySelector('output'), raf: 0, total: 0 };
    el.querySelector('.ms-scrub__replay').addEventListener('click', function () { api.play(name); });
    s.range.addEventListener('input', function () {
      var p = +s.range.value / 1000;
      api.seek(name, p);
      s.total = durationOf(name);
      updateReadout(name, p * s.total);
    });
    s.total = durationOf(name);
    updateReadout(name, s.total);
  });

  /* ---------------------------------------------------------------------------
     9. Spec tables: property (+ source as a muted suffix), duration, easing,
        distance / scale, delay. Five columns written to fit one line per row; the
        REF episode ids of the whole card are also in the header's source chip.
     ------------------------------------------------------------------------- */
  function c(n) { return '<span class="ms-spec__curve">' + n + '</span>'; }
  var R = 'Gerak dikurangi';
  /* [property, duration, curve(s), distance / scale, delay, source, reduced-row?] */
  var SPECS = {
    palette: [
      ['Scrim', '240 ms', c('linear'), '0 → 32 %', '—', 'V2-U10'],
      ['Blur latar', '160 ms', c('enter'), '0 → 4 px', 'memimpin', 'V2-U10'],
      ['Opasitas panel', '80 ms', c('enter'), '0 → 1', '—', 'V2-U10'],
      ['Tinggi dari tengah', '400 ms', c('reveal'), '56 px → 100 %', '—', 'V2-U10'],
      ['Kerangka input', '160 ms', c('enter'), 'blur 3 px', '+160 · 30', 'V2-U11'],
      ['Sorotan aktif', '120 ms', c('enter'), 'lime 150', '+200 ms', 'V2-U13'],
      ['Label dan baris', '160 ms', c('enter'), 'naik 4 px', '+240 · 30', 'V2-U13'],
      ['Ketik ulang', '120 ms', c('linear'), 'crossfade', '0', '§4.4'],
      ['Tutup (Esc)', '240 ms', c('exit'), 'klip → 72 %', '—', 'V2-U15'],
      [R, '150 ms', c('linear'), 'opasitas', '0', '§4.5', true]
    ],
    dialog: [
      ['Scrim masuk, keluar', '240 ms', c('linear'), '0 ↔ 32 %', '—', 'V2-U10'],
      ['Opasitas dialog', '80 ms', c('enter'), '0 → 1', '—', 'V2-U10'],
      ['Skala dan naik', '320 ms', c('enter'), '0,97 · 8 px', '—', 'V2-U30'],
      ['Tutup', '160 ms', c('exit'), '→ 0,98', '—', '§4.4'],
      ['grp', 'Laci modal (§4.4 varian B): scrim, inert dan kunci fokus seperti dialog'],
      ['Laci masuk', '320 ms', c('enter'), '100 % → 0', '—', 'baru'],
      ['Laci keluar', '240 ms', c('exit'), '0 → 100 %', '—', 'baru'],
      [R, '150 ms', c('linear'), 'opasitas', '0', '§4.5', true]
    ],
    panel: [
      ['Cincin pilihan', '160 ms', c('enter'), '6 → 2 px', '0', 'V2-U34'],
      ['Opasitas panel', '80 ms', c('enter'), '0 → 1', '+90 ms', 'V2-U35'],
      ['Lebar dari tengah', '400 ms', c('reveal'), '3 → 100 %', '+90 ms', 'V2-U35'],
      ['Isi panel', '240 ms', c('enter'), 'naik 4 px', '+160 · 60', 'V2-U36'],
      ['Ganti baris', '80+160 ms', c('enter'), 'crossfade', '30 ms', '§4.4'],
      ['Tutup', '240 ms', c('exit'), 'klip → 3 %', '—', '§4.4'],
      [R, '150 ms', c('linear'), 'opasitas', '0', '§4.5', true]
    ],
    tabs: [
      ['Konten lama keluar', '240 ms', c('exit'), 'blur 3 px', '—', 'V2-U6'],
      ['Pil aktif bergeser', '400 ms', c('standard'), 'regang 8 %', '—', 'V2-U7'],
      ['Konten baru masuk', '240 ms', c('enter'), 'naik 4 px', '+200 · 40', 'V2-U8'],
      ['Navigasi (shell)', '240 ms', c('exit'), 'blur 3 px', '—', 'V2-U6'],
      [R, '150 ms', c('linear'), 'pil melompat', '0', '§4.5', true]
    ],
    feedback: [
      ['Hover', '80 / 160 ms', c('enter') + c('exit'), 'warna saja', '—', 'baru'],
      ['Tekan tombol', '80 / 160 ms', c('enter'), 'skala 0,97', '—', 'V2-U5'],
      ['Tekan baris', '80 / 160 ms', c('enter'), 'warna saja', '—', 'V2-U5'],
      ['Cincin fokus', 'seketika', '—', '2 px olive', '—', '§4.4'],
      ['Fokus isian', 'seketika', '—', 'halo 3 px', '—', '§4.4'],
      ['Panah, chevron', '160 ms', c('enter'), 'geser 2 px', '—', 'baru'],
      ['Pesan validasi', '160 ms', c('enter'), 'turun 4 px', '—', '§4.4'],
      [R, '—', '—', 'warna saja', '—', '§4.5', true]
    ],
    stagger: [
      ['Kartu', '240+320 ms', c('enter'), '0,97 · 8 px', '60 ms', 'V2-U3'],
      ['Isi kartu', '240 ms', c('enter'), 'naik 4 px', '+120 ms', 'V2-U3'],
      ['Baris daftar', '240 ms', c('enter'), 'naik 4 px', '+120 · 40', 'V2-U20'],
      ['Chip dan bar', '160 ms', c('enter'), '—', '30 ms', 'V2-U3'],
      ['Jendela kartu, baris', '≤ 300 ms', '—', '180 / 280 ms', '—', '§4.4'],
      ['Anggaran halaman', '≤ 900 ms', '—', 'selesai 820 ms', '—', '§4.1'],
      ['Blok data > 400 ms', '—', '—', 'tanpa shimmer', '—', '§4.4'],
      [R, '150 ms', c('linear'), 'sekaligus', '0', '§4.5', true]
    ],
    status: [
      ['Toast masuk', '160+240 ms', c('enter'), 'naik 8 px', '—', 'baru'],
      ['Toast tahan', '4,5 dtk', '—', 'jeda saat hover', '—', '§5.14'],
      ['Toast keluar', '240 ms', c('exit'), 'opasitas', '—', 'V2-U24'],
      ['Tombol memuat', '160 ms', c('linear'), 'lebar tetap', '—', '§4.3'],
      ['Morf berhasil', '160 ms', c('linear'), 'label, warna', '+80 ms', 'V2-U22'],
      ['Morf pil status', '160 ms', c('standard'), 'klip lebar', '+120 ms', 'V2-U22'],
      ['Angka bergulir', '160 ms', c('enter'), 'digit 100 %', '60 ms', 'V2-U27'],
      [R, '150 ms', c('linear'), 'tanpa gulir', '0', '§4.5', true]
    ],
    auth: [
      ['Klip panel visual', '600 ms', c('standard'), 'satu lebar lembar', '—', 'V1-U3, U6'],
      ['Slot formulir', '600 ms', c('standard'), 'arah berlawanan', '—', 'V1-U3'],
      ['Tukar konten', 't = 300 ms', '—', 'tersembunyi, e = 0,5', '—', 'V1 §2.11'],
      ['Teks visual', '600 ms', c('standard'), 'paralaks 2×', 'keluar e ≈ 0,27 · masuk e ≈ 0,73', 'V1 §2.5'],
      ['Gambar dan gradien', '—', '—', 'tetap pada kartu', '—', 'V1 §2.12'],
      ['Ujung lembar', '600 ms', c('standard'), 'radius pada jam yang sama', '—', 'V1 §2.2'],
      [R, '150 ms', c('linear'), 'crossfade blok', '—', '§4.5', true]
    ]
  };
  var CURVE_TITLES = {
    standard: T.standard, enter: T.enter, reveal: T.reveal, exit: T.exit, linear: 'linear', emphasis: tok('--mc-ease-emphasis')
  };
  /* Keep numbers with their units and arrows with both operands (no orphaned glyphs). */
  var NB = ' ';
  function glue(s) {
    return String(s)
      .replace(/(\d) (ms|px|%|dtk)/g, '$1' + NB + '$2')
      .replace(/ (→|↔|≈|=) /g, NB + '$1' + NB)
      .replace(/^(→|≤|t) /, '$1' + NB);
  }
  /* Column widths: Properti, Durasi, Kurva, Jarak / skala, Jeda. */
  var COLW = {
    aside: ['36.5%', '12.5%', '12.5%', '22.5%', '16%'],
    half: ['34.5%', '16.5%', '15%', '19.5%', '14.5%'],
    wide: ['24%', '12%', '13%', '22%', '29%']
  };
  document.querySelectorAll('[data-ms-spec]').forEach(function (el) {
    var name = el.getAttribute('data-ms-spec');
    var rows = SPECS[name] || [];
    var colw = el.closest('.ms-demo__aside') ? COLW.aside : (el.closest('.ms-demo--wide') ? COLW.wide : COLW.half);
    var out = '<table><caption class="mc-sr-only">Spesifikasi gerak ' + LABELS[name] + '</caption><colgroup>' + colw.map(function (w) { return '<col style="width:' + w + '">'; }).join('') + '</colgroup>' +
      '<thead><tr><th scope="col">Properti</th><th scope="col">Durasi</th><th scope="col">Kurva</th><th scope="col">Jarak / skala</th><th scope="col">Jeda</th></tr></thead><tbody>';
    rows.forEach(function (r) {
      if (r[0] === 'grp') { out += '<tr class="ms-spec__group"><td colspan="5">' + esc(r[1]) + '</td></tr>'; return; }
      var src = String(r[5] || '').replace(/(V[12])-/g, '$1‑');
      var cells = r.slice(1, 5).map(function (v) { return v.indexOf('<') < 0 ? glue(v) : v; });
      out += '<tr' + (r[6] ? ' class="ms-spec__reduced"' : '') + '>' +
        '<th scope="row">' + esc(r[0]) + (src ? ' <span class="ms-spec__src"><span class="mc-sr-only">sumber </span>' + esc(src) + '</span>' : '') + '</th>' +
        cells.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr>';
    });
    out += '</tbody></table>';
    el.innerHTML = out;
    el.querySelectorAll('.ms-spec__curve').forEach(function (s) { var t = CURVE_TITLES[s.textContent]; if (t) s.title = t; });
  });

  /* Curve thumbnails in the token strip. */
  (function () {
    var host = doc.querySelector('[data-ms-curves]');
    if (!host) return;
    host.innerHTML = ['standard', 'enter', 'reveal', 'exit'].map(function (n) {
      var f = n === 'linear' ? function (x) { return x; } : bezier(parseBezier(CURVE_TITLES[n]));
      var d = '';
      for (var i = 0; i <= 24; i++) { var x = i / 24; d += (i ? 'L' : 'M') + (x * 30).toFixed(1) + ' ' + (20 - f(x) * 18).toFixed(1); }
      return '<figure><svg viewBox="0 0 30 22" preserveAspectRatio="none" aria-hidden="true"><path class="ms-curves__base" d="M0 20.5H30"/><path d="' + d + '"/></svg><figcaption>' + n + '</figcaption></figure>';
    }).join('');
  })();

  /* ---------------------------------------------------------------------------
     10. Mode toggle (full / reduced) and system preference
     ------------------------------------------------------------------------- */
  var modeBtns = doc.querySelectorAll('[data-ms-mode-value]');
  var modeHint = doc.querySelector('[data-ms-mode-hint]');
  var modePill = doc.querySelector('[data-ms-mode-pill]');
  function syncMode() {
    var red = reduced();
    if (STUDY) html.classList.toggle('ms-reduced', red);
    modeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-ms-mode-value') === 'reduced') === red)); });
    if (modeHint) modeHint.textContent = forced === null || forced === !!mq.matches ? 'Mengikuti pengaturan sistem' : 'Pratinjau; sistem memakai gerak ' + (mq.matches ? 'dikurangi' : 'penuh');
    if (modePill) {
      modePill.className = 'mc-pill ms-token__chip ' + (red ? 'mc-pill--info' : 'mc-pill--success');
      modePill.lastChild.textContent = red ? 'Dikurangi aktif' : 'Penuh aktif';
    }
    var modeMeta = doc.querySelector('[data-ms-mode-meta]');
    if (modeMeta) modeMeta.textContent = forced === null || forced === !!mq.matches ? 'mengikuti sistem' : 'pratinjau halaman';
    Object.keys(scrubs).forEach(function (n) { scrubs[n].total = durationOf(n); updateReadout(n, scrubs[n].total); });
  }
  modeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var want = b.getAttribute('data-ms-mode-value') === 'reduced';
      forced = want === !!mq.matches ? null : want;
      syncMode();
    });
  });
  if (mq.addEventListener) mq.addEventListener('change', syncMode);

  /* ---------------------------------------------------------------------------
     11. Triggers: card buttons, the shell's mc:command (Ctrl/Cmd+K, search submit),
         and typing in the shell search field.
     ------------------------------------------------------------------------- */
  doc.querySelectorAll('[data-ms-open]').forEach(function (b) {
    b.addEventListener('click', function () { api.open(b.getAttribute('data-ms-open'), { returnFocus: b }); });
  });
  /* The shell focuses its search field before it emits mc:command, so the element that had
     focus before Ctrl/Cmd+K is captured here first (window, capture phase) and used as the
     return target when the palette closes. */
  var preShortcut = null;
  window.addEventListener('keydown', function (e) {
    var key = (e.key || '').toLowerCase();
    if (key !== 'k' || !(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
    var a = doc.activeElement;
    preShortcut = a && a !== doc.body && a !== html ? a : null;
  }, true);
  doc.addEventListener('mc:command', function (e) {
    var d = e.detail || {};
    var search = doc.querySelector('.shell-search__input');
    /* r11: on the search route the top-bar field is hidden; focus returns to the page's own field */
    var pageField = window.MCShell && window.MCShell.pageSearchField ? window.MCShell.pageSearchField() : null;
    var back = d.source === 'shortcut' && preShortcut && doc.contains(preShortcut) ? preShortcut : (pageField || search);
    preShortcut = null;
    api.open('palette', { query: d.query || '', returnFocus: back });
    if (search) search.value = '';
  });
  var shellSearch = doc.querySelector('.shell-search__input');
  if (shellSearch) {
    shellSearch.addEventListener('input', function () {
      if (!shellSearch.value) return;
      var q = shellSearch.value;
      shellSearch.value = '';
      api.open('palette', { query: q, returnFocus: shellSearch });
    });
    /* Pointer on the search field (input, icon or keycap) opens the palette too (c-merge).
       Keyboard focus alone does not: Tab moves through the top bar as before. */
    var shellSearchForm = shellSearch.closest('[data-shell-search]') || shellSearch;
    shellSearchForm.addEventListener('click', function (e) {
      if (e.button !== 0) return;
      api.open('palette', { query: shellSearch.value, returnFocus: shellSearch });
      shellSearch.value = '';
    });
  }

  /* ---------------------------------------------------------------------------
     12. Public API
     ------------------------------------------------------------------------- */
  var NAMES = ['palette', 'dialog', 'drawer', 'panel', 'tabs', 'feedback', 'stagger', 'status', 'auth'];
  var api = {
    names: STUDY ? NAMES.slice() : ['palette'],
    open: function (name, opts) {
      if (OVERLAYS[name]) return OVERLAYS[name].open('page', opts || {});
      if (stages[name]) return stages[name].open();
      return Promise.resolve();
    },
    close: function (name) {
      if (OVERLAYS[name]) return OVERLAYS[name].close('page');
      if (stages[name]) return stages[name].close();
      return Promise.resolve();
    },
    play: function (name) {
      if ((name === 'palette' || name === 'dialog') && OVERLAYS[name]) return OVERLAYS[name].replay();
      if (name === 'drawer' && OVERLAYS.drawer) return OVERLAYS.drawer.open('page');
      if (stages[name]) return stages[name].play();
      return Promise.resolve();
    },
    seek: function (name, p, opts) {
      opts = opts || {};
      if (OVERLAYS[name]) {
        var where = opts.where || (OVERLAYS[name].inst.stage ? 'stage' : 'page');
        return OVERLAYS[name].seek(where, clamp(p, 0, 1), false);
      }
      if (stages[name]) return stages[name].seek(clamp(p, 0, 1));
      return 0;
    },
    seekTime: function (name, ms, opts) {
      opts = opts || {};
      if (OVERLAYS[name]) {
        var where = opts.where || (OVERLAYS[name].inst.stage ? 'stage' : 'page');
        return OVERLAYS[name].seek(where, ms, true);
      }
      if (stages[name]) return stages[name].seek(0, ms);
      return 0;
    },
    duration: function (name, opts) {
      opts = opts || {};
      if (OVERLAYS[name]) return OVERLAYS[name].duration(opts.where || (OVERLAYS[name].inst.stage ? 'stage' : 'page'));
      return stages[name] ? stages[name].duration() : 0;
    },
    rest: function () {
      Object.keys(OVERLAYS).forEach(function (k) { OVERLAYS[k].rest(); });
      Object.keys(stages).forEach(function (k) { stages[k].rest(); });
      Object.keys(scrubs).forEach(function (n) { scrubs[n].total = durationOf(n); updateReadout(n, scrubs[n].total); });
    },
    setReduced: function (v) { forced = v === null || v === undefined ? null : !!v; syncMode(); },
    get reduced() { return reduced(); },
    toast: function (title, meta, opts) { return toast(title, meta, opts); },
    tokens: T
  };
  window.mcMotion = api;
  syncMode();
})();


/* ===== Shared: custom select (02, 03, 04 and any page with .mc-select) ===== */
/* =============================================================================
   r2 polish. Progressive enhancement of every .mc-select (WAI-ARIA select-only combobox):
   - the native <select> stays in the DOM: it holds the form value, fires the change/input
     events the page scripts already listen to, and is the no-JS fallback;
   - a <button role="combobox"> replaces it visually (it reuses the select's classes, so the
     closed state matches the reference control exactly);
   - desktop: an anchored popover listbox (focus stays on the combobox, aria-activedescendant);
   - phone (<= 767 px): a modal bottom sheet (focus moves into the sheet, background inert).
   Keys: Down/Up, Home/End, PageDown/PageUp, Enter/Space, Escape, Tab, Alt+Down/Up, typeahead.
   Programmatic select.value / selectedIndex writes keep the trigger in sync; select.focus()
   focuses the trigger. Opt out per control with data-native-select.
   API: window.MCSelect = { enhance(root), open(select, index), close() }.
   ========================================================================== */
(function () {
  'use strict';
  var doc = document;
  var mqPhone = window.matchMedia('(max-width: 767px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var VALUE = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  var INDEX = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');
  var registry = new WeakMap();
  var uid = 0;
  var open = null;

  function token(name, fallback) {
    var v = getComputedStyle(doc.documentElement).getPropertyValue(name).trim();
    if (!v) return fallback;
    var n = parseFloat(v);
    if (isNaN(n)) return fallback;
    return /ms$/.test(v) ? n : (/s$/.test(v) ? n * 1000 : n);
  }
  function ease(name, fallback) { return getComputedStyle(doc.documentElement).getPropertyValue(name).trim() || fallback; }

  function findLabel(select) {
    if (select.id) {
      var l = doc.querySelector('label[for="' + select.id + '"]');
      if (l) { if (!l.id) l.id = select.id + '-label'; return l; }
    }
    var by = select.getAttribute('aria-labelledby');
    return by ? doc.getElementById(by.split(/\s+/)[0]) : null;
  }

  function enhance(select) {
    if (!select || registry.has(select) || select.multiple || select.hasAttribute('data-native-select')) return;
    var wrap = select.closest('.mc-select');
    if (!wrap) return;
    Array.prototype.forEach.call(wrap.querySelectorAll('.mc-select__trigger'), function (t) { t.remove(); }); // stale clone
    var id = 'mcsel-' + (++uid);
    var trigger = doc.createElement('button');
    trigger.type = 'button';
    trigger.className = select.className + ' mc-select__trigger';
    trigger.id = id;
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', id + '-list');
    var label = findLabel(select);
    if (label) {
      trigger.setAttribute('aria-labelledby', label.id);
      if (label.tagName === 'LABEL' && label.htmlFor === select.id) label.htmlFor = id;
    } else if (select.getAttribute('aria-label')) {
      trigger.setAttribute('aria-label', select.getAttribute('aria-label'));
    }
    var value = doc.createElement('span');
    value.className = 'mc-select__value';
    trigger.appendChild(value);
    select.parentNode.insertBefore(trigger, select);
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    wrap.classList.add('is-enhanced');

    var inst = { select: select, wrap: wrap, trigger: trigger, value: value, id: id, active: -1, list: null, layer: null, mode: '' };
    registry.set(select, inst);
    Object.defineProperty(select, 'value', { configurable: true,
      get: function () { return VALUE.get.call(select); },
      set: function (v) { VALUE.set.call(select, v); sync(inst); } });
    Object.defineProperty(select, 'selectedIndex', { configurable: true,
      get: function () { return INDEX.get.call(select); },
      set: function (v) { INDEX.set.call(select, v); sync(inst); } });
    select.focus = function (o) { trigger.focus(o); };
    select.addEventListener('change', function () { sync(inst); });
    new MutationObserver(function () { mirror(inst); sync(inst); if (open === inst) render(inst); })
      .observe(select, { attributes: true, attributeFilter: ['disabled', 'aria-invalid', 'required', 'aria-label'], childList: true, subtree: true, characterData: true });
    trigger.addEventListener('click', function (e) { e.preventDefault(); if (open === inst) close(inst, true); else openList(inst); });
    trigger.addEventListener('keydown', function (e) { onKey(inst, e); });
    mirror(inst);
    sync(inst);
  }

  function mirror(inst) {
    var s = inst.select;
    inst.trigger.disabled = s.disabled;
    var inv = s.getAttribute('aria-invalid');
    if (inv) inst.trigger.setAttribute('aria-invalid', inv); else inst.trigger.removeAttribute('aria-invalid');
    if (s.required) inst.trigger.setAttribute('aria-required', 'true'); else inst.trigger.removeAttribute('aria-required');
    if (!inst.trigger.getAttribute('aria-labelledby') && s.getAttribute('aria-label')) inst.trigger.setAttribute('aria-label', s.getAttribute('aria-label'));
  }

  function sync(inst) {
    var idx = INDEX.get.call(inst.select), o = inst.select.options[idx];
    inst.value.textContent = o ? o.textContent.trim() : '';
    inst.trigger.classList.toggle('is-placeholder', !o || o.value === '');
    if (open === inst && inst.list) {
      Array.prototype.forEach.call(inst.list.querySelectorAll('[role="option"]'), function (el) {
        el.setAttribute('aria-selected', +el.dataset.index === idx ? 'true' : 'false');
      });
    }
  }

  function render(inst) {
    var list = inst.list, sel = INDEX.get.call(inst.select), group = null;
    list.textContent = '';
    Array.prototype.forEach.call(inst.select.options, function (o, i) {
      if (o.hidden) return;
      if (o.parentNode.tagName === 'OPTGROUP' && o.parentNode !== group) {
        group = o.parentNode;
        var g = doc.createElement('div');
        g.className = 'mc-listbox__group';
        g.setAttribute('role', 'presentation');
        g.textContent = group.label;
        list.appendChild(g);
      }
      var el = doc.createElement('div');
      el.className = 'mc-listbox__option';
      el.id = inst.id + '-opt-' + i;
      el.dataset.index = i;
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', i === sel ? 'true' : 'false');
      if (o.disabled) el.setAttribute('aria-disabled', 'true');
      var text = doc.createElement('span'); text.className = 'mc-listbox__text';
      var lab = doc.createElement('span'); lab.className = 'mc-listbox__label'; lab.textContent = o.textContent.trim();
      text.appendChild(lab);
      if (o.getAttribute('data-meta')) {
        var meta = doc.createElement('span'); meta.className = 'mc-listbox__meta'; meta.textContent = o.getAttribute('data-meta');
        text.appendChild(meta);
      }
      el.appendChild(text);
      el.insertAdjacentHTML('beforeend', '<svg class="mc-icon mc-listbox__check" aria-hidden="true" focusable="false"><use href="#i-check"></use></svg>');
      list.appendChild(el);
    });
    setActive(inst, inst.active >= 0 ? inst.active : sel, false);
  }

  function enabled(inst, i) { var o = inst.select.options[i]; return !!o && !o.disabled && !o.hidden; }
  function stepFrom(inst, i, d) {
    var n = inst.select.options.length, j = i, last = i, steps = Math.abs(d), dir = d > 0 ? 1 : -1;
    while (steps > 0) {
      j += dir;
      if (j < 0 || j >= n) break;
      if (enabled(inst, j)) { last = j; steps--; }
    }
    return last;
  }
  function firstIndex(inst) { for (var i = 0; i < inst.select.options.length; i++) if (enabled(inst, i)) return i; return -1; }
  function lastIndex(inst) { for (var i = inst.select.options.length - 1; i >= 0; i--) if (enabled(inst, i)) return i; return -1; }

  function setActive(inst, i, scroll) {
    if (i < 0 || !inst.list) return;
    inst.active = i;
    var target = null;
    Array.prototype.forEach.call(inst.list.querySelectorAll('[role="option"]'), function (el) {
      var on = +el.dataset.index === i;
      el.classList.toggle('is-active', on);
      if (on) target = el;
    });
    var host = inst.mode === 'sheet' ? inst.list : inst.trigger;
    if (target) host.setAttribute('aria-activedescendant', target.id); else host.removeAttribute('aria-activedescendant');
    if (target && scroll !== false) target.scrollIntoView({ block: 'nearest' });
  }

  function choose(inst, i) {
    if (i < 0 || !enabled(inst, i)) return;
    if (i !== INDEX.get.call(inst.select)) {
      INDEX.set.call(inst.select, i);
      inst.select.dispatchEvent(new Event('input', { bubbles: true }));
      inst.select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    sync(inst);
  }

  var buffer = '', bufferTimer = 0;
  function typeahead(inst, ch) {
    clearTimeout(bufferTimer);
    bufferTimer = setTimeout(function () { buffer = ''; }, 600);
    buffer += ch.toLowerCase();
    var n = inst.select.options.length, start = inst.active >= 0 ? inst.active : INDEX.get.call(inst.select);
    var from = buffer.length === 1 ? start + 1 : start;
    for (var k = 0; k < n; k++) {
      var i = (from + k) % n;
      if (enabled(inst, i) && inst.select.options[i].textContent.trim().toLowerCase().indexOf(buffer) === 0) return i;
    }
    return -1;
  }

  function onKey(inst, e) {
    var k = e.key, isOpen = open === inst;
    var printable = k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (!isOpen) {
      if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); openList(inst); return; }
      if (k === 'Home') { e.preventDefault(); openList(inst, firstIndex(inst)); return; }
      if (k === 'End') { e.preventDefault(); openList(inst, lastIndex(inst)); return; }
      if (printable) { var t0 = typeahead(inst, k); if (t0 >= 0) { e.preventDefault(); openList(inst, t0); } }
      return;
    }
    if (k === ' ' && buffer) { e.preventDefault(); var ts = typeahead(inst, ' '); if (ts >= 0) setActive(inst, ts, true); return; }
    switch (k) {
      case 'ArrowDown': e.preventDefault(); if (!e.altKey) setActive(inst, stepFrom(inst, inst.active, 1), true); break;
      case 'ArrowUp':
        e.preventDefault();
        if (e.altKey) { choose(inst, inst.active); close(inst, true); } else setActive(inst, stepFrom(inst, inst.active, -1), true);
        break;
      case 'Home': e.preventDefault(); setActive(inst, firstIndex(inst), true); break;
      case 'End': e.preventDefault(); setActive(inst, lastIndex(inst), true); break;
      case 'PageDown': e.preventDefault(); setActive(inst, stepFrom(inst, inst.active, 10), true); break;
      case 'PageUp': e.preventDefault(); setActive(inst, stepFrom(inst, inst.active, -10), true); break;
      case 'Enter': case ' ': e.preventDefault(); choose(inst, inst.active); close(inst, true); break;
      case 'Escape': e.preventDefault(); e.stopPropagation(); close(inst, true); break;
      case 'Tab':
        if (inst.mode === 'popover') { choose(inst, inst.active); close(inst, false); }
        else { e.preventDefault(); var c = inst.layer.querySelector('.mc-sheet__close'); (doc.activeElement === c ? inst.list : c).focus(); }
        break;
      default:
        if (printable) { var t = typeahead(inst, k); if (t >= 0) { e.preventDefault(); setActive(inst, t, true); } }
    }
  }

  function place(inst) {
    var r = inst.wrap.getBoundingClientRect(), list = inst.list;
    list.style.minWidth = Math.round(r.width) + 'px';
    list.style.maxHeight = '';
    var cap = parseFloat(getComputedStyle(list).maxHeight) || 320;
    var h = Math.min(list.scrollHeight + 2, cap);
    var below = innerHeight - r.bottom - 12, above = r.top - 12;
    var side = below >= Math.min(h, 220) || below >= above ? 'bottom' : 'top';
    var room = Math.max(120, (side === 'bottom' ? below : above) - 6);
    var finalH = Math.min(h, room);
    list.style.maxHeight = finalH + 'px';
    var w = list.offsetWidth;
    list.style.left = Math.round(Math.min(Math.max(12, r.left), innerWidth - w - 12)) + 'px';
    list.style.top = Math.round(side === 'bottom' ? r.bottom + 6 : r.top - 6 - finalH) + 'px';
    list.dataset.side = side;
  }

  var inertList = [];
  function setInert(except, on) {
    if (on) {
      Array.prototype.forEach.call(doc.body.children, function (el) {
        if (el === except || el.id === 'mc-icon-sprite' || el.tagName === 'SCRIPT' || el.inert) return;
        el.inert = true; inertList.push(el);
      });
    } else {
      inertList.forEach(function (el) { el.inert = false; });
      inertList = [];
    }
  }

  function buildSheet(inst) {
    var layer = doc.createElement('div');
    layer.className = 'mc-sheet-layer';
    var titleId = inst.id + '-sheet-title';
    var by = inst.trigger.getAttribute('aria-labelledby');
    var title = ((by && doc.getElementById(by) ? doc.getElementById(by).textContent : inst.trigger.getAttribute('aria-label')) || 'Pilih opsi')
      .replace(/\*/g, '').replace(/\s+/g, ' ').trim();
    layer.innerHTML =
      '<div class="mc-sheet-layer__scrim" data-close></div>' +
      '<div class="mc-sheet" role="dialog" aria-modal="true" aria-labelledby="' + titleId + '">' +
        '<div class="mc-sheet__handle" aria-hidden="true"></div>' +
        '<div class="mc-sheet__head"><h2 class="mc-sheet__title" id="' + titleId + '"></h2>' +
        '<button type="button" class="mc-sheet__close" data-close aria-label="Tutup"><svg class="mc-icon mc-icon--20" aria-hidden="true"><use href="#i-x"></use></svg></button></div>' +
        '<div class="mc-sheet__body"></div>' +
      '</div>';
    layer.querySelector('.mc-sheet__title').textContent = title;
    layer.querySelector('.mc-sheet__body').appendChild(inst.list);
    layer.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(inst, true); });
    layer.querySelector('.mc-sheet__close').addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(inst, true); }
      if (e.key === 'Tab') { e.preventDefault(); inst.list.focus(); }
    });
    doc.body.appendChild(layer);
    inst.layer = layer;
    setInert(layer, true);
  }

  function animateIn(inst) {
    var reduce = mqReduce.matches;
    if (inst.mode === 'sheet') {
      var sheet = inst.layer.querySelector('.mc-sheet'), scrim = inst.layer.querySelector('.mc-sheet-layer__scrim');
      if (reduce) { inst.layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: token('--mc-dur-reduced', 150), easing: 'linear' }); return; }
      scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: token('--mc-dur-base', 240), easing: 'linear' });
      sheet.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: token('--mc-dur-sheet', 320), easing: ease('--mc-ease-reveal', 'ease-out') });
      return;
    }
    var dy = inst.list.dataset.side === 'top' ? 4 : -4;
    inst.list.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] :
      [{ opacity: 0, transform: 'translateY(' + dy + 'px) scale(.98)' }, { opacity: 1, transform: 'none' }],
      { duration: reduce ? token('--mc-dur-reduced', 150) : token('--mc-dur-fast', 160), easing: reduce ? 'linear' : ease('--mc-ease-enter', 'ease-out') });
  }
  function animateOut(state, done) {
    var reduce = mqReduce.matches, a;
    if (state.mode === 'sheet') {
      var sheet = state.layer.querySelector('.mc-sheet'), scrim = state.layer.querySelector('.mc-sheet-layer__scrim');
      if (reduce) a = state.layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: token('--mc-dur-reduced', 150), easing: 'linear', fill: 'forwards' });
      else {
        scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: token('--mc-dur-base', 240), easing: 'linear', fill: 'forwards' });
        a = sheet.animate([{ transform: 'none' }, { transform: 'translateY(100%)' }], { duration: token('--mc-dur-base', 240), easing: ease('--mc-ease-exit', 'ease-in'), fill: 'forwards' });
      }
    } else {
      a = state.list.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduce ? token('--mc-dur-reduced', 150) : 120, easing: 'linear', fill: 'forwards' });
    }
    a.onfinish = done; a.oncancel = done;
  }

  function onOutside(e) {
    if (!open || open.mode !== 'popover') return;
    if (open.list.contains(e.target) || open.wrap.contains(e.target)) return;
    close(open, false);
  }
  function onReflow() {
    if (!open || open.mode !== 'popover') return;
    var r = open.wrap.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { close(open, false); return; }
    place(open);
  }
  if (mqPhone.addEventListener) mqPhone.addEventListener('change', function () { if (open) close(open, false); });

  function openList(inst, activeIndex) {
    if (inst.trigger.disabled) return;
    if (open && open !== inst) close(open, false);
    open = inst;
    inst.mode = mqPhone.matches ? 'sheet' : 'popover';
    var list = doc.createElement('div');
    list.className = 'mc-listbox';
    list.id = inst.id + '-list';
    list.setAttribute('role', 'listbox');
    var by = inst.trigger.getAttribute('aria-labelledby');
    if (by) list.setAttribute('aria-labelledby', by); else list.setAttribute('aria-label', inst.trigger.getAttribute('aria-label') || 'Pilihan');
    list.tabIndex = inst.mode === 'sheet' ? 0 : -1;
    inst.list = list;
    inst.active = typeof activeIndex === 'number' && activeIndex >= 0 ? activeIndex : INDEX.get.call(inst.select);
    if (inst.mode === 'sheet') buildSheet(inst); else doc.body.appendChild(list);
    render(inst);
    inst.trigger.setAttribute('aria-expanded', 'true');
    inst.wrap.classList.add('is-open');
    list.addEventListener('mousedown', function (e) { if (inst.mode === 'popover') e.preventDefault(); });
    list.addEventListener('pointermove', function (e) {
      var o = e.target.closest('[role="option"]');
      if (o && o.getAttribute('aria-disabled') !== 'true' && +o.dataset.index !== inst.active) setActive(inst, +o.dataset.index, false);
    });
    list.addEventListener('click', function (e) {
      var o = e.target.closest('[role="option"]');
      if (!o || o.getAttribute('aria-disabled') === 'true') return;
      choose(inst, +o.dataset.index);
      close(inst, true);
    });
    if (inst.mode === 'sheet') {
      list.addEventListener('keydown', function (e) { onKey(inst, e); });
      list.focus({ preventScroll: true });
    } else {
      place(inst);
      doc.addEventListener('pointerdown', onOutside, true);
      window.addEventListener('resize', onReflow);
      window.addEventListener('scroll', onReflow, true);
    }
    setActive(inst, inst.active, true);
    animateIn(inst);
  }

  function close(inst, returnFocus) {
    if (!inst || open !== inst) return;
    open = null;
    var list = inst.list, layer = inst.layer, mode = inst.mode;
    inst.trigger.setAttribute('aria-expanded', 'false');
    inst.trigger.removeAttribute('aria-activedescendant');
    inst.wrap.classList.remove('is-open');
    doc.removeEventListener('pointerdown', onOutside, true);
    window.removeEventListener('resize', onReflow);
    window.removeEventListener('scroll', onReflow, true);
    if (mode === 'sheet') setInert(null, false);
    if (returnFocus) inst.trigger.focus({ preventScroll: true });
    inst.list = null; inst.layer = null;
    animateOut({ mode: mode, list: list, layer: layer }, function () { (layer || list).remove(); });
  }

  function enhanceAll(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll('.mc-select select'), enhance);
  }

  enhanceAll(doc);
  var pending = false;
  new MutationObserver(function (records) {
    if (pending) return;
    for (var r = 0; r < records.length; r++) {
      for (var i = 0; i < records[r].addedNodes.length; i++) {
        var n = records[r].addedNodes[i];
        if (n.nodeType === 1 && (n.matches('.mc-select, .mc-select select') || n.querySelector('.mc-select select'))) {
          pending = true;
          Promise.resolve().then(function () { pending = false; enhanceAll(doc); });
          return;
        }
      }
    }
  }).observe(doc.body, { childList: true, subtree: true });

  /* r10 a11y: the whole field shell is the target. A tap on its padding or border (outside the control)
     opens an enhanced select or focuses the control, so a 44 px field is a 44 px target. */
  doc.addEventListener('click', function (e) {
    var shell = e.target.closest && e.target.closest('.mc-input');
    if (!shell || e.target.closest('input, select, button, textarea, a, label')) return;
    var ctl = shell.querySelector('.mc-select__trigger') || shell.querySelector('.mc-input__control');
    if (!ctl || ctl.disabled) return;
    if (ctl.classList.contains('mc-select__trigger')) ctl.click(); else ctl.focus();
  });

  window.MCSelect = {
    enhance: function (root) { enhanceAll(root || doc); },
    open: function (select, index) { var inst = registry.get(select); if (inst) openList(inst, index); },
    close: function () { if (open) close(open, false); }
  };
})();


/* ===== Shared: upload state machine (03 Lampiran; any [data-upload]) ===== */
/* =============================================================================
   r2 polish. States (data-state on the root):
     idle -> (hover: CSS) -> dragover -> selected -> processing -> success | error
     success/error -> replace (file picker) | remove (back to idle); error -> retry.
   Upload is simulated locally (no network): ~1.6 s eased progress. Validation: PDF/JPG/PNG,
   size <= data-upload-max (10 MB). A file name containing "gagal" simulates a dropped
   connection at ~55 % (retry demo). Tap/click to choose always works; drag and drop is an
   extra on pointer devices.
   Announcements: polite live region for progress milestones and success, role="alert" for
   errors. Focus: after remove the zone's input gets focus; after success the remove button
   stays reachable in tab order.
   API (captures/tests): window.MCUpload.demo(state, { name, size, progress }) and .reset().
   ========================================================================== */
(function () {
  'use strict';
  var doc = document;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var OK_EXT = /\.(pdf|jpe?g|png)$/i;
  var OK_TYPE = /^(application\/pdf|image\/jpeg|image\/png)$/;

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
    return (bytes / (1024 * 1024)).toLocaleString('id-ID', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + ' MB';
  }
  function kindOf(name, type) {
    if (/\.pdf$/i.test(name) || type === 'application/pdf') return { kind: 'pdf', label: 'PDF', icon: 'file-text' };
    if (/\.png$/i.test(name) || type === 'image/png') return { kind: 'image', label: 'PNG', icon: 'image' };
    if (/\.jpe?g$/i.test(name) || type === 'image/jpeg') return { kind: 'image', label: 'JPG', icon: 'image' };
    return { kind: 'other', label: ((name.split('.').pop() || 'file') + '').toUpperCase(), icon: 'file-text' };
  }

  function Upload(root) {
    var u = this;
    u.root = root;
    u.input = root.querySelector('[data-upload-input]');
    u.zone = root.querySelector('[data-upload-zone]');
    u.panel = root.querySelector('[data-upload-file]');
    u.type = root.querySelector('[data-upload-type]');
    u.name = root.querySelector('[data-upload-name]');
    u.info = root.querySelector('[data-upload-info]');
    u.status = root.querySelector('[data-upload-status]');
    u.bar = root.querySelector('.mc-upload__bar');
    u.live = root.querySelector('[data-upload-live]');
    u.alert = root.querySelector('[data-upload-alert]');
    u.retry = root.querySelector('[data-upload-retry]');
    u.replace = root.querySelector('[data-upload-replace]');
    u.remove = root.querySelector('[data-upload-remove]');
    u.max = +root.getAttribute('data-upload-max') || 10 * 1024 * 1024;
    u.file = null; u.timer = 0; u.raf = 0; u.freshTimer = 0;
    var depth = 0;

    root.addEventListener('dragenter', function (e) { e.preventDefault(); depth++; if (u.state() === 'idle' || u.state() === 'dragover') u.set('dragover'); });
    root.addEventListener('dragover', function (e) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; });
    root.addEventListener('dragleave', function () { depth = Math.max(0, depth - 1); if (!depth && u.state() === 'dragover') u.set('idle'); });
    root.addEventListener('drop', function (e) {
      e.preventDefault(); depth = 0;
      if (u.state() === 'dragover') u.set('idle');
      if (e.dataTransfer && e.dataTransfer.files.length) u.take(e.dataTransfer.files[0], e.dataTransfer.files.length);
    });
    ['dragover', 'drop'].forEach(function (type) {   // a file dropped next to the zone must not navigate away
      window.addEventListener(type, function (e) { if (!e.target.closest || !e.target.closest('[data-upload]')) e.preventDefault(); });
    });
    u.input.addEventListener('change', function () { if (u.input.files && u.input.files.length) u.take(u.input.files[0], u.input.files.length); });
    u.replace.addEventListener('click', function () { u.input.click(); });
    u.retry.addEventListener('click', function () { if (u.file) u.process(u.file, true); });
    u.remove.addEventListener('click', function () { u.reset(true); });
  }

  Upload.prototype.state = function () { return this.root.getAttribute('data-state'); };

  Upload.prototype.set = function (state, fresh) {
    var u = this, prev = u.state();
    u.root.setAttribute('data-state', state);
    var showPanel = state !== 'idle' && state !== 'dragover';
    if (showPanel && u.panel.hidden) {
      u.panel.hidden = false;
      u.panel.classList.remove('is-entering');
      void u.panel.offsetWidth;
      u.panel.classList.add('is-entering');
    }
    if (!showPanel) u.panel.hidden = true;
    clearTimeout(u.freshTimer);
    u.root.classList.toggle('is-fresh', !!fresh);
    if (fresh && state === 'success') u.freshTimer = setTimeout(function () { u.root.classList.remove('is-fresh'); }, mqReduce.matches ? 300 : 1100);
    u.retry.hidden = state !== 'error' || !u.retryable;
    u.replace.setAttribute('aria-label', state === 'error' ? 'Pilih file lain' : 'Ganti file');
    u.remove.setAttribute('aria-label', state === 'processing' || state === 'selected' ? 'Batalkan unggahan' : 'Hapus file');
    return prev;
  };

  Upload.prototype.say = function (msg, assertive) {
    var el = assertive ? this.alert : this.live;
    el.textContent = '';
    setTimeout(function () { el.textContent = msg; }, 30);
  };

  Upload.prototype.paint = function (file) {
    var k = kindOf(file.name, file.type);
    this.type.setAttribute('data-kind', k.kind);
    this.type.innerHTML = '<svg class="mc-icon" aria-hidden="true"><use href="#i-' + k.icon + '"></use></svg>';
    this.name.textContent = file.name;
    this.name.title = file.name;
    this.info.textContent = k.label + ' · ' + fmtSize(file.size);
  };

  Upload.prototype.progress = function (p) {
    this.root.style.setProperty('--upload-progress', String(Math.max(0, Math.min(1, p))));
  };

  Upload.prototype.take = function (file, count) {
    var u = this;
    u.stop();
    u.file = { name: file.name, size: file.size, type: file.type };
    u.paint(u.file);
    var badType = !(OK_EXT.test(file.name) || OK_TYPE.test(file.type || ''));
    if (badType || file.size > u.max) {
      u.retryable = false;
      u.status.textContent = badType ? 'Format tidak didukung. Gunakan PDF, JPG, atau PNG.' : 'Ukuran file melebihi 10 MB.';
      u.set('error', true);
      u.say(file.name + ': ' + u.status.textContent, true);
      return;
    }
    u.process(u.file, false, count > 1);
  };

  Upload.prototype.process = function (file, isRetry, extraIgnored) {
    var u = this;
    u.stop();
    u.retryable = true;
    u.progress(0);
    u.status.textContent = 'Siap diunggah';
    u.set('selected', true);
    u.say(file.name + ' dipilih. Mengunggah.' + (extraIgnored ? ' Satu lampiran per unggahan pada prototipe ini; file lain diabaikan.' : ''));
    var fail = /gagal/i.test(file.name) && !isRetry;
    var duration = 1600, start = 0, announced = 0;
    u.timer = setTimeout(function () {
      u.set('processing');
      function tick(now) {
        if (!start) start = now;
        var t = Math.min(1, (now - start) / duration);
        var p = 1 - Math.pow(1 - t, 2.2);                       // eased: fast start, gentle finish
        if (fail && p >= 0.55) {
          u.progress(0.55);
          u.status.textContent = 'Unggahan terputus. Periksa koneksi lalu coba lagi.';
          u.set('error', true);
          u.say(file.name + ': unggahan terputus. Coba lagi.', true);
          return;
        }
        u.progress(p);
        u.status.textContent = 'Mengunggah… ' + Math.round(p * 100) + '%';
        var milestone = Math.floor(p * 2);                       // announce at 50 %
        if (milestone > announced && p < 1) { announced = milestone; u.say('Mengunggah ' + Math.round(p * 100) + ' persen'); }
        if (t < 1) { u.raf = requestAnimationFrame(tick); return; }
        u.progress(1);
        u.status.textContent = 'Berhasil diunggah';
        u.set('success', true);
        u.say(file.name + ' berhasil diunggah.');
      }
      u.raf = requestAnimationFrame(tick);
    }, mqReduce.matches ? 120 : 260);
  };

  Upload.prototype.stop = function () { clearTimeout(this.timer); cancelAnimationFrame(this.raf); };

  Upload.prototype.reset = function (focus) {
    var u = this, name = u.file && u.file.name;
    u.stop();
    u.file = null;
    u.input.value = '';
    u.progress(0);
    u.set('idle');
    if (name) u.say(name + ' dihapus dari lampiran.');
    if (focus) u.input.focus();
  };

  /* Deterministic states for captures and tests */
  Upload.prototype.demo = function (state, o) {
    var u = this;
    o = o || {};
    u.stop();
    var file = { name: o.name || 'Invoice-INV-2026-1028.pdf', size: o.size || 2516582, type: o.type || '' };
    if (state === 'idle' || state === 'dragover' || state === 'hover') {
      u.reset(false);
      if (state === 'dragover') u.set('dragover');
      u.root.classList.toggle('is-hover', state === 'hover');
      return;
    }
    u.root.classList.remove('is-hover');
    u.file = file; u.paint(file);
    if (state === 'selected') { u.progress(0); u.status.textContent = 'Siap diunggah'; u.set('selected'); }
    if (state === 'processing') { var p = o.progress == null ? 0.62 : o.progress; u.progress(p); u.status.textContent = 'Mengunggah… ' + Math.round(p * 100) + '%'; u.set('processing'); }
    if (state === 'success') { u.progress(1); u.status.textContent = 'Berhasil diunggah'; u.set('success', !!o.fresh); }
    if (state === 'error') {
      u.retryable = o.retryable !== false;
      u.status.textContent = o.message || (u.retryable ? 'Unggahan terputus. Periksa koneksi lalu coba lagi.' : 'Ukuran file melebihi 10 MB.');
      u.set('error', !!o.fresh);
    }
  };

  /* r13: scan(root) enhances the zones of a page shown later (router); release(root) stops the zones of
     a page being swapped out. On a direct load the zones are page resources too (MCScope.asPage), so
     their window drop guards leave with the page. */
  var all = [];
  function scan(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll('[data-upload]'), function (r) {
      if (r.mcUpload) return;
      r.mcUpload = new Upload(r);
      all.push(r.mcUpload);
    });
    return all;
  }
  function release(root) {
    all = all.filter(function (u) {
      if (doc.contains(u.root) && !(root && root.contains(u.root))) return true;
      clearTimeout(u.timer); clearTimeout(u.freshTimer);
      if (u.raf) cancelAnimationFrame(u.raf);
      return false;
    });
  }
  if (window.MCScope && window.MCScope.asPage) window.MCScope.asPage(function () { scan(doc); }); else scan(doc);
  window.MCUpload = {
    get items() { return all; },
    scan: scan,
    release: release,
    demo: function (state, o) { if (all[0]) all[0].demo(state, o); },
    reset: function () { if (all[0]) all[0].reset(false); }
  };
})();


/* ===== Shared: responsive shell (02, 03, 04 phone) ===== */
/* =============================================================================
   r2. Phone app bar + bottom navigation behaviour and the phone-only disclosures.
   - App bar search opens the same command palette as Ctrl/Cmd+K (event 'mc:command').
   - App bar gains a hairline once content scrolls under it (no animation on scroll itself).
   - [data-collapse-toggle] buttons open/close their card on phones (the toggle is hidden on
     tablet/desktop, where the body is always shown). Height animates with the standard
     curve (320 ms); reduced motion: no height animation.
   - The purchase sticky bar mirrors the summary total (aria-hidden copy; the summary card
     stays the announced source).
   ========================================================================== */
(function () {
  'use strict';
  var doc = document;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function token(name, fallback) {
    var v = getComputedStyle(doc.documentElement).getPropertyValue(name).trim();
    var n = parseFloat(v);
    return isNaN(n) ? fallback : (/ms$/.test(v) ? n : n * 1000);
  }

  /* App bar */
  var appbar = doc.querySelector('[data-appbar]');
  /* r9: no explicit Back in the phone app bar by default. A project that needs one sets
     navigation.mobileBack (project-config.js); it then replaces the brand and returns to the page's
     body[data-nav-parent] destination (history first, see section 3 of the navigation module). */
  var navCfg = window.MC_PROJECT && window.MC_PROJECT.navigation;
  /* r13: re-evaluated for every page (router), from the page's body[data-nav-parent] */
  function syncBack() {
    if (!appbar || !navCfg || !navCfg.mobileBack) return;
    Array.prototype.forEach.call(appbar.querySelectorAll('.mc-appbar__back, .mc-appbar__sep'), function (el) { el.remove(); });
    appbar.classList.remove('has-back');
    var parentKey = doc.body.getAttribute('data-nav-parent');
    var parentItem = parentKey && window.MCProject ? window.MCProject.navItem(parentKey) : null;
    var menuBtn = appbar.querySelector('.mc-appbar__menu');
    if (parentItem && parentItem.href && menuBtn) {
      var sep = doc.createElement('span');
      sep.className = 'mc-appbar__sep';
      sep.setAttribute('aria-hidden', 'true');
      var backLink = doc.createElement('a');
      backLink.className = 'mc-appbar__back';
      backLink.href = parentItem.href;
      backLink.setAttribute('data-back', '');
      backLink.setAttribute('data-shell-link', '');
      backLink.innerHTML = '<svg class="mc-icon mc-icon--20" aria-hidden="true"><use href="#i-arrow-left"></use></svg><span class="mc-appbar__back-label">' +
        ((doc.documentElement.lang || 'id').slice(0, 2) === 'en' ? 'Back' : 'Kembali') + '</span>';
      menuBtn.insertAdjacentElement('afterend', backLink);
      menuBtn.insertAdjacentElement('afterend', sep);
      appbar.classList.add('has-back');
    }
  }
  syncBack();
  if (appbar) {
    var search = appbar.querySelector('[data-appbar-search]');
    if (search) search.addEventListener('click', function () {
      doc.dispatchEvent(new CustomEvent('mc:command', { detail: { source: 'appbar', query: '' } }));
    });
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; appbar.classList.toggle('is-scrolled', window.scrollY > 4); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Phone section disclosures (r2; r9: one reusable pattern for any page section).
     Markup: .mc-disclosure[data-disclosure="key"] > [data-disclosure-head] (title, optional summary,
     the ONE toggle button: aria-expanded / aria-controls) + .mc-disclosure__body. Tablet and desktop
     always show the body (the toggle is hidden there). Defaults: project-config mobileDisclosure[key]
     ('open' | 'collapsed'), else the markup's aria-expanded. A section never hides an invalid field:
     MCDisclosure.reveal(node) opens the section holding it (validation, Alt+N, 'invalid' events). */
  var DISCLOSURE = (window.MC_PROJECT && window.MC_PROJECT.mobileDisclosure) || {};
  function setOpen(card, open, animate) {
    var btn = card.mcToggle, body = card.mcBody;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    card.classList.toggle('is-open', open);
    if (!animate || !open || mqReduce.matches || !body.animate || btn.offsetParent === null) return;
    body.animate([{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }],
      { duration: token('--mc-dur-base', 240), easing: getComputedStyle(doc.documentElement).getPropertyValue('--mc-ease-enter').trim() || 'ease-out' });
  }
  /* r13: scan(root) for a page shown later (router); a toggle is bound once */
  function scanDisclosures(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll('[data-collapse-toggle]'), function (btn) {
      var card = btn.closest('.mc-disclosure');
      var body = doc.getElementById(btn.getAttribute('aria-controls'));
      if (!card || !body || card.mcToggle === btn) return;
      card.mcToggle = btn;
      card.mcBody = body;
      var key = card.getAttribute('data-disclosure');
      setOpen(card, key && DISCLOSURE[key] ? DISCLOSURE[key] === 'open' : btn.getAttribute('aria-expanded') === 'true', false);
      btn.addEventListener('click', function () { setOpen(card, btn.getAttribute('aria-expanded') !== 'true', true); });
      /* r7 hit-area contract: on phones the whole header row (title, summary, chevron, empty space) is
         the target. Taps on nested controls (a link, a menu button, a field, the toggle itself) keep
         their own behaviour and never toggle twice; the body is never a target. Keyboard users have the
         one button (no duplicate tab stop); aria-expanded lives on that button. */
      var head = btn.closest('[data-disclosure-head], .dash-card__head');
      if (head) {
        head.setAttribute('data-disclosure-head', '');
        head.addEventListener('click', function (e) {
          if (btn.offsetParent === null) return;                         /* tablet / desktop: no disclosure */
          if (e.target.closest('a, button, select, input, textarea, label, [role="button"], [role="link"], [role="menu"], [tabindex]:not([tabindex="-1"])')) return;
          btn.click();
        });
      }
    });
  }
  scanDisclosures(doc);
  function reveal(node) {
    var card = node && node.closest ? node.closest('.mc-disclosure') : null;
    if (!card || !card.mcToggle || card.classList.contains('is-open')) return false;
    setOpen(card, true, false);
    return true;
  }
  doc.addEventListener('invalid', function (e) { reveal(e.target); }, true);
  window.MCDisclosure = {
    reveal: reveal,
    scan: scanDisclosures,
    open: function (card) { if (card && card.mcToggle) setOpen(card, true, false); },
    close: function (card) { if (card && card.mcToggle) setOpen(card, false, false); },
    isOpen: function (card) { return !!card && card.classList.contains('is-open'); }
  };

  /* r13: the purchase summaries / sticky-total mirrors moved to assets/js/modules/pembelian-baru.js */
  if (window.MCShell) window.MCShell.syncMobileBack = syncBack;
})();


/* ===== Shared: split primary action (r9) ===== */
/* =============================================================================
   [data-split]: ONE primary action + a chevron that opens the secondary actions.
     .mc-split__main     the primary button (its own action: submit, link, handler)
     [data-split-toggle] separate button: aria-haspopup="menu", aria-expanded, aria-controls
     [data-split-menu]   role="menu" with role="menuitem" buttons (any action; a destructive one
                         carries .mc-split__item--danger); role="separator" between groups
   Labels and items live in the page markup (or the page's i18n), so a project changes them without
   touching component CSS. Keyboard: Enter / Space / ArrowDown open on the first item, ArrowUp on
   the last; Up / Down / Home / End move; Esc closes and returns focus to the chevron; Tab or a click
   outside closes. Choosing an item closes the menu, then the item runs. API: window.MCSplit.close().
   ============================================================================= */
(function () {
  'use strict';
  var doc = document, openOne = null;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function init(root) {
    var toggle = root.querySelector('[data-split-toggle]'), menu = root.querySelector('[data-split-menu]');
    if (!toggle || !menu) return;
    function items() { return Array.prototype.filter.call(menu.querySelectorAll('[role="menuitem"]'), function (i) { return !i.disabled && i.getAttribute('aria-disabled') !== 'true'; }); }
    function focusAt(i) { var list = items(); if (list.length) list[(i + list.length) % list.length].focus(); }
    function onOutside(e) { if (!root.contains(e.target)) close(false); }
    function open(at) {
      if (openOne && openOne !== api) openOne.close(false);
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      root.classList.add('is-open');
      openOne = api;
      if (!mqReduce.matches && menu.animate) menu.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 160, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' });
      focusAt(at === 'last' ? -1 : 0);
      doc.addEventListener('pointerdown', onOutside, true);
    }
    function close(returnFocus) {
      if (menu.hidden) return;
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      root.classList.remove('is-open');
      if (openOne === api) openOne = null;
      doc.removeEventListener('pointerdown', onOutside, true);
      if (returnFocus) toggle.focus({ preventScroll: true });
    }
    var api = { open: open, close: close };
    toggle.addEventListener('click', function () { if (menu.hidden) open('first'); else close(true); });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(e.key === 'ArrowUp' ? 'last' : 'first'); }
    });
    menu.addEventListener('keydown', function (e) {
      var list = items(), i = list.indexOf(doc.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusAt(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusAt(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusAt(0); }
      else if (e.key === 'End') { e.preventDefault(); focusAt(-1); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (e.key === 'Tab') close(false);
    });
    menu.addEventListener('click', function (e) {
      var it = e.target.closest('[role="menuitem"]');
      if (!it) return;
      /* the item's own action runs in this click (submit, handler); the menu closes right after and
         focus returns to the chevron unless that action opened a dialog (which manages focus) */
      setTimeout(function () { close(!(window.MCDialog && window.MCDialog.isOpen)); }, 0);
    });
  }
  /* r13: scan(root) for a page shown later (router); a split is bound once */
  function scan(root) { Array.prototype.forEach.call((root || doc).querySelectorAll('[data-split]'), function (r) { if (r.mcSplit) return; r.mcSplit = true; init(r); }); }
  scan(doc);
  window.MCSplit = { init: init, scan: scan, close: function () { if (openOne) openOne.close(false); } };
})();


/* ===== Shared: long-text contract (r10) ===== */
/* =============================================================================
   .mc-truncate elements (one line, ellipsis) and .mc-clamp-2 (two lines):
     - is-overflowing + title (the full text) are set only when the text really overflows
       (ResizeObserver keeps it current; MCLongText.scan(root) for content rendered later);
     - data-long-text="reveal": hovering / focusing the row that holds the text (a, button, tr, li,
       [data-long-text-host]) scrolls the line into view once, slowly (32 px/s after 500 ms), and
       resets on leave. Never under prefers-reduced-motion; never automatic; never a marquee;
     - data-long-text="expand": click / Enter / Space toggles the full text in place (is-expanded).
   API: window.MCLongText = { scan(root), sync(el) }.
   ============================================================================= */
(function () {
  'use strict';
  var doc = document;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var SPEED = 32, DELAY = 500, HOST = 'a, button, tr, li, [data-long-text-host]';
  var ro = window.ResizeObserver ? new ResizeObserver(function (list) { list.forEach(function (e) { sync(e.target); }); }) : null;
  function sync(el) {
    if (el.classList.contains('is-revealing') || el.classList.contains('is-expanded')) return;
    var over = el.classList.contains('mc-clamp-2') ? el.scrollHeight > el.clientHeight + 1 : el.scrollWidth > el.clientWidth + 1;
    el.classList.toggle('is-overflowing', over);
    var full = el.textContent.replace(/\s+/g, ' ').trim();
    if (over && (!el.hasAttribute('title') || el.hasAttribute('data-lt-title'))) { el.setAttribute('title', full); el.setAttribute('data-lt-title', ''); }
    else if (!over && el.hasAttribute('data-lt-title')) { el.removeAttribute('title'); el.removeAttribute('data-lt-title'); }
    if (el.getAttribute('data-long-text') === 'expand') {
      if (over && !el.hasAttribute('tabindex') && !el.closest('a, button')) { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); el.setAttribute('aria-expanded', 'false'); }
    }
  }
  function scan(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll('.mc-truncate, .mc-clamp-2'), function (el) {
      if (!el.hasAttribute('data-lt-seen')) { el.setAttribute('data-lt-seen', ''); if (ro) ro.observe(el); }
      sync(el);
    });
  }
  function reveal(el) {
    if (mqReduce.matches || doc.documentElement.classList.contains('ms-reduced-root')) return;
    if (!el.classList.contains('is-overflowing') || el.mcReveal) return;
    var dist = el.scrollWidth - el.clientWidth;
    if (dist <= 1) return;
    var start = null;
    el.classList.add('is-revealing');
    function step(ts) {
      if (!el.mcReveal) return;
      if (start === null) start = ts;
      var t = ts - start - DELAY;
      el.scrollLeft = t <= 0 ? 0 : Math.min(dist, t / 1000 * SPEED);
      if (el.scrollLeft < dist) el.mcReveal = requestAnimationFrame(step);
    }
    el.mcReveal = requestAnimationFrame(step);
  }
  function settle(el) {
    if (!el.mcReveal) return;
    cancelAnimationFrame(el.mcReveal);
    el.mcReveal = 0;
    el.scrollLeft = 0;
    el.classList.remove('is-revealing');
  }
  function targets(host) { return Array.prototype.filter.call(host.querySelectorAll('[data-long-text="reveal"]'), function (el) { return el.closest(HOST) === host || host.matches('[data-long-text-host]'); }); }
  function enter(e) { var host = e.target.closest && e.target.closest(HOST); if (host) targets(host).forEach(reveal); if (e.target.matches && e.target.matches('[data-long-text="reveal"]')) reveal(e.target); }
  function leave(e) {
    var host = e.target.closest && e.target.closest(HOST);
    if (!host || (e.relatedTarget && host.contains(e.relatedTarget))) return;
    targets(host).forEach(settle);
  }
  doc.addEventListener('pointerover', enter);
  doc.addEventListener('pointerout', leave);
  doc.addEventListener('focusin', enter);
  doc.addEventListener('focusout', leave);
  function toggle(el) {
    if (!el.classList.contains('is-overflowing') && !el.classList.contains('is-expanded')) return;
    var on = !el.classList.contains('is-expanded');
    el.classList.toggle('is-expanded', on);
    if (el.hasAttribute('aria-expanded')) el.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (!on) sync(el);
  }
  doc.addEventListener('click', function (e) { var el = e.target.closest && e.target.closest('[data-long-text="expand"]'); if (el && !e.target.closest('a, button')) toggle(el); });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target.matches && e.target.matches('[data-long-text="expand"][role="button"]') ? e.target : null;
    if (el) { e.preventDefault(); toggle(el); }
  });
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { scan(doc); }); else scan(doc);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { scan(doc); });
  /* r13: a page being swapped out stops being observed (no detached nodes kept by the observer) */
  function release(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll('[data-lt-seen]'), function (el) { if (ro) ro.unobserve(el); settle(el); });
  }
  window.MCLongText = { scan: scan, sync: sync, release: release };
})();


/* ===== Motion Study (04): phone spec disclosures (r2) ===== */
/* Each demo's spec table, rules and key list fold behind one "Spesifikasi & kontrol" toggle on
   phones (the toggle is hidden on tablet/desktop, where everything is always shown). The DOM is
   not moved: the toggle controls the existing elements (aria-controls lists their ids). */
(function () {
  'use strict';
  if (document.body.dataset.page !== 'motion') return;
  var n = 0;
  Array.prototype.forEach.call(document.querySelectorAll('.ms-demo'), function (demo) {
    var aside = demo.querySelector('.ms-demo__aside');
    var parts = aside ? [aside] : Array.prototype.filter.call(demo.querySelectorAll('.ms-rules, .ms-spec, .ms-keys'), function (el) {
      return !el.closest('.ms-stage');
    });
    if (!parts.length) return;
    parts.forEach(function (el) { if (!el.id) el.id = 'ms-spec-part-' + (++n); });
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ms-spec-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', parts.map(function (el) { return el.id; }).join(' '));
    btn.innerHTML = '<span>Spesifikasi &amp; kontrol</span><svg class="mc-icon mc-icon--20" aria-hidden="true"><use href="#i-chevron-down"></use></svg>';
    parts[0].parentNode.insertBefore(btn, parts[0]);
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      demo.classList.toggle('is-spec-open', open);
    });
  });
})();


/* ===== Shared: navigation model on phone + tablet (r3) ===== */
/* =============================================================================
   Bottom navigation = frequent destinations; navigation drawer = the complete navigation;
   back = hierarchical return; sticky action bar = page actions. This module:
   1. Current entry: MCNavTree.current (Project shell, from MCProject.navCurrent()); the bottom
      navigation is lit there (level-1 ancestor; areas outside the bar light nothing).
   2. Drawer: r12 rendered from MCProject.navTree() by the shared tree renderer (NOT copied from
      the sidebar DOM; its own ids, so every aria-controls is unique): the same sections, order,
      labels, level-1 icons and disclosure groups as the desktop sidebar, the current group open
      and the current entry marked, then the account block. Opened by every [data-nav-open]
      (phone app-bar Menu, tablet rail button) and by a rail group icon (MCNav.open({ group })
      opens the drawer AT that group: expanded, scrolled into view, focus on its current or first
      child). Every open starts at the top of the list and brings the group in header first. A
      group header toggles in place; choosing an entry closes the drawer and navigates (Golden
      content exit); the entry of the current address only closes it; a link that a page's
      unsaved-changes guard intercepted leaves the drawer open under the question. Modal dialog:
      focus moves in and is trapped, Esc / scrim / close button / browser Back close it, focus
      returns to the trigger, the page behind is inert and scroll-locked. Motion: open 320 ms
      (reveal), close 240 ms (exit), scrim fades with it; reduced motion = 150 ms fade.
   3. Back ([data-back]): returns to the previous page of this tab when there is one, otherwise
      follows its fallback href (the parent section).
   API: window.MCNav = { open({ group?, trigger? }?), close(), account(open), isOpen, section,
        current, provides(route, params), covers(route, param, values) }.
   ========================================================================== */
(function () {
  'use strict';
  var doc = document, body = doc.body;
  var shell = doc.querySelector('[data-shell]');
  if (!shell) return;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var P = window.MCProject, NT = window.MCNavTree;
  var cur = NT ? NT.current : null;
  var section = cur ? cur.topId : 'none';

  function token(name, fallback) {
    var v = getComputedStyle(doc.documentElement).getPropertyValue(name).trim();
    var n = parseFloat(v);
    return isNaN(n) ? fallback : (/ms$/.test(v) ? n : n * 1000);
  }
  function ease(name, fallback) { return getComputedStyle(doc.documentElement).getPropertyValue(name).trim() || fallback; }

  /* 1. Bottom navigation: lit by the Project shell (MCNavTree.markBottom) ------------- */
  var bottomNav = doc.querySelector('.mc-bottom-nav');

  /* 2. Drawer --------------------------------------------------------------------- */
  var triggers = doc.querySelectorAll('[data-nav-open]');
  if (!P || !NT || !P.navTree || !triggers.length) return;

  var layer = doc.createElement('div');
  layer.className = 'mc-navdrawer-layer';
  layer.hidden = true;
  layer.innerHTML =
    '<div class="mc-navdrawer-layer__scrim" data-nav-close></div>' +
    '<div class="mc-navdrawer" id="mc-navdrawer" role="dialog" aria-modal="true" aria-label="Menu aplikasi" tabindex="-1">' +
      '<div class="mc-navdrawer__head">' +
        '<p class="mc-navdrawer__brand" data-brand><svg class="mc-logo-mark" aria-hidden="true" data-brand-mark><use href="#i-logo-mark"></use></svg><span data-brand-name></span></p>' +
        '<button type="button" class="mc-navdrawer__close" data-nav-close aria-label="Tutup menu"><svg class="mc-icon mc-icon--20" aria-hidden="true"><use href="#i-x"></use></svg></button>' +
      '</div>' +
      '<nav class="mc-navdrawer__body" aria-label="Navigasi lengkap"></nav>' +
      /* r6: the account sits at the BOTTOM of the drawer (the only phone entry point); tapping it
         reveals the account actions above it. Identity + entries: project-config.js. */
      '<div class="mc-navdrawer__foot">' +
        '<div class="mc-navdrawer__account-menu" id="mc-navdrawer-account" role="group" aria-label="Akun" hidden><ul class="mc-navdrawer__account-list" role="list"></ul></div>' +
        '<button type="button" class="mc-navdrawer__account" aria-expanded="false" aria-controls="mc-navdrawer-account" data-drawer-account>' +
          '<span class="mc-avatar mc-navdrawer__avatar" aria-hidden="true" data-account-initials></span>' +
          '<span class="mc-navdrawer__who"><span class="mc-navdrawer__name" data-account-name></span><span class="mc-navdrawer__role" data-account-role></span></span>' +
          '<svg class="mc-icon mc-navdrawer__account-chev" aria-hidden="true"><use href="#i-chevron-up"></use></svg>' +
        '</button>' +
      '</div>' +
    '</div>';
  var panel = layer.querySelector('.mc-navdrawer');
  var scrim = layer.querySelector('.mc-navdrawer-layer__scrim');
  var navBody = layer.querySelector('.mc-navdrawer__body');
  var closeBtn = layer.querySelector('.mc-navdrawer__close');
  var accBtn = layer.querySelector('[data-drawer-account]');
  var accMenu = layer.querySelector('.mc-navdrawer__account-menu');
  var accList = layer.querySelector('.mc-navdrawer__account-list');
  (function identity() {
    var P = window.MCProject, u = window.MC_PROJECT && window.MC_PROJECT.user;
    if (!P || !u) return;
    var role = P.t(u.roleLabel);
    layer.querySelector('[data-account-name]').textContent = u.name || '';
    layer.querySelector('[data-account-role]').textContent = role;
    layer.querySelector('[data-account-initials]').textContent = u.initials || String(u.name || '?').charAt(0);
    accBtn.setAttribute('aria-label', (P.lang() === 'en' ? 'Account: ' : 'Akun: ') + (u.name || '') + (role ? ', ' + role : ''));
  })();

  /* r12: the same tree as the sidebar, from the same data (ids prefixed "dnav-"; section labels
     "mc-navdrawer-shell-nav-<id>") */
  navBody.innerHTML = NT.html(P.navTree(), { ns: 'mc-navdrawer', ids: 'dnav', sec: 'mc-navdrawer-shell-nav-', linkAttrs: ' data-drawer-link', iconCls: '' });
  NT.init(navBody, { ns: 'mc-navdrawer' });
  doc.body.appendChild(layer);
  NT.edges(navBody);

  var isOpen = false, lastTrigger = null, pushed = false, ignorePop = false, scrollY = 0, inertEls = [], extTrigger = null;

  function setExpanded(v) {
    Array.prototype.forEach.call(triggers, function (t) { t.setAttribute('aria-expanded', v ? 'true' : 'false'); });
    /* a rail group icon that opened the drawer reports it too (its popup is the drawer) */
    if (extTrigger) { extTrigger.mcDrawer = v; extTrigger.setAttribute('aria-expanded', v ? 'true' : 'false'); if (!v) extTrigger = null; }
  }
  /* bring a row (or a whole group) into the drawer body's view, no window scroll: MCNavTree.reveal
     (header first, row boundaries, clear of the edge fades) */
  function reveal(el, block) {
    if (!el) return;
    var g = el.classList.contains('mc-navdrawer__sublink') ? el.closest('.mc-navdrawer__item--group') : null;
    NT.reveal(navBody, el, { head: g ? g.firstElementChild : null, start: block === 'start' });
  }
  function lockScroll(on) {
    if (on) {
      scrollY = window.scrollY;
      doc.documentElement.classList.add('mc-scroll-locked');
      body.style.position = 'fixed';
      body.style.top = -scrollY + 'px';
      body.style.left = '0';
      body.style.right = '0';
    } else {
      doc.documentElement.classList.remove('mc-scroll-locked');
      body.style.position = ''; body.style.top = ''; body.style.left = ''; body.style.right = '';
      window.scrollTo(0, scrollY);
    }
  }
  function setInert(on) {
    if (on) {
      Array.prototype.forEach.call(body.children, function (el) {
        if (el === layer || el.id === 'mc-icon-sprite' || el.tagName === 'SCRIPT' || el.inert) return;
        el.inert = true; inertEls.push(el);
      });
    } else { inertEls.forEach(function (el) { el.inert = false; }); inertEls = []; }
  }
  function focusables() {
    return Array.prototype.filter.call(panel.querySelectorAll('a[href], button:not([disabled])'), function (el) { return el.offsetParent !== null && !el.closest('[hidden]'); });
  }

  /* o.group: open AT that group (expanded, in view, focus on its current or first child); without
     it the drawer opens at the current group with focus on the close button. r12: every open starts
     from the top of the list (the body keeps no scroll from an earlier open), then brings the group
     in as a unit, its header first, so child rows never show without their group. */
  function open(trigger, o) {
    o = o || {};
    var li = o.group ? NT.groupOf(navBody, o.group) : null;
    if (isOpen) {
      if (li) { NT.toggle(navBody, li, true, true); setTimeout(function () { reveal(li, 'start'); }, mqReduce.matches ? 0 : token('--mc-dur-base', 240)); }
      return;
    }
    isOpen = true;
    lastTrigger = trigger || lastTrigger || triggers[0];
    extTrigger = trigger && Array.prototype.indexOf.call(triggers, trigger) < 0 ? trigger : null;
    layer.hidden = false;
    setAccount(false);
    setExpanded(true);
    lockScroll(true);
    setInert(true);
    var cg = cur && cur.groupId ? NT.groupOf(navBody, cur.groupId) : null;
    if (cg && !cg.classList.contains('is-open')) NT.toggle(navBody, cg, true, false);
    if (li && !li.classList.contains('is-open')) NT.toggle(navBody, li, true, false);
    if (mqReduce.matches) layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: token('--mc-dur-reduced', 150), easing: 'linear' });
    else {
      var d = token('--mc-dur-moderate', 320);
      scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d, easing: 'linear' });
      panel.animate([{ transform: 'translateX(-100%)' }, { transform: 'none' }], { duration: d, easing: ease('--mc-ease-reveal', 'cubic-bezier(0.25, 1, 0.5, 1)') });
    }
    navBody.scrollTop = 0;
    if (li) {
      reveal(li, 'start');
      var first = li.querySelector('.mc-navdrawer__sub [aria-current]') || li.querySelector('.mc-navdrawer__sub a[href]');
      (first || closeBtn).focus({ preventScroll: true });
    } else {
      reveal(navBody.querySelector('[data-nav-key][aria-current]'));
      closeBtn.focus({ preventScroll: true });
    }
    try { history.pushState({ mcNavDrawer: true }, ''); pushed = true; } catch (e) { pushed = false; }
  }

  function close(opts) {
    opts = opts || {};
    if (!isOpen) { if (opts.then) opts.then(); return; }
    isOpen = false;
    setExpanded(false);
    var a;
    if (mqReduce.matches) a = layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: token('--mc-dur-reduced', 150), easing: 'linear', fill: 'forwards' });
    else {
      var d = token('--mc-dur-base', 240);
      scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: d, easing: 'linear', fill: 'forwards' });
      a = panel.animate([{ transform: 'none' }, { transform: 'translateX(-100%)' }], { duration: d, easing: ease('--mc-ease-exit', 'cubic-bezier(0.37, 0, 0.63, 1)'), fill: 'forwards' });
    }
    a.onfinish = a.oncancel = function () {
      if (isOpen) return;
      layer.hidden = true;
      layer.getAnimations({ subtree: true }).forEach(function (x) { x.cancel(); });
    };
    setInert(false);
    lockScroll(false);
    if (opts.returnFocus !== false && lastTrigger) lastTrigger.focus({ preventScroll: true });
    var then = opts.then;
    if (pushed && !opts.fromPop) {
      pushed = false;
      ignorePop = true;
      var done = false;
      var finish = function () { if (done) return; done = true; if (then) then(); };
      var onPop = function () { window.removeEventListener('popstate', onPop); finish(); };
      window.addEventListener('popstate', onPop);
      setTimeout(finish, 350);                 // file:// or blocked history: do not wait forever
      history.back();
    } else {
      pushed = false;
      if (then) then();
    }
  }

  /* Account section (r6): expands above the account block; Esc collapses it before the drawer. */
  var accOpen = false;
  function setAccount(open, focusFirst) {
    if (!window.MCAccount) return;
    accOpen = !!open;
    if (accOpen) {
      var phone = window.matchMedia('(max-width: 767px)').matches;
      accList.innerHTML = window.MCAccount.itemsHTML(window.MCAccount.entries(phone ? 'phone' : 'drawer'), 'mc-navdrawer-acc');
      accMenu.hidden = false;
      if (!mqReduce.matches && accMenu.animate) accMenu.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: token('--mc-dur-state', 200), easing: ease('--mc-ease-enter', 'ease-out') });
      if (focusFirst) { var f = accList.querySelector('[data-account-item]'); if (f) f.focus({ preventScroll: true }); }
    } else {
      accMenu.hidden = true;
    }
    accBtn.setAttribute('aria-expanded', accOpen ? 'true' : 'false');
    layer.classList.toggle('is-account-open', accOpen);
  }
  accBtn.addEventListener('click', function () { setAccount(!accOpen, true); });
  accList.addEventListener('click', function (e) {
    var it = e.target.closest('[data-account-item]');
    if (!it || !window.MCAccount || e.defaultPrevented) return;     /* r12: the unsaved-changes guard asks first */
    e.preventDefault();
    e.stopPropagation();
    var id = it.getAttribute('data-account-item');
    var m = (window.MCProject ? window.MCProject.accountMenu() : []).filter(function (x) { return x.id === id; })[0] || {};
    /* r9: logout / shortcuts open an APPLICATION dialog: the account section and the drawer close
       first, the dialog is centred on the viewport, focus returns to the Menu button afterwards */
    if (m.action === 'logout' || m.action === 'shortcuts') {
      setAccount(false);
      var back = lastTrigger;
      close({ returnFocus: false, then: function () { window.MCAccount.activate(id, back); } });
      return;
    }
    if (m.href) { close({ returnFocus: false, then: function () { window.MCAccount.activate(id, null); } }); return; }
    window.MCAccount.activate(id, it);                     /* lab placeholder: stays in the drawer */
  });

  window.addEventListener('popstate', function () {
    if (ignorePop) { ignorePop = false; return; }
    if (isOpen) close({ fromPop: true });     // browser Back closes the drawer first
  });

  Array.prototype.forEach.call(triggers, function (t) {
    t.addEventListener('click', function () { if (isOpen) close(); else open(t); });
  });
  layer.addEventListener('click', function (e) {
    if (e.target.closest('[data-nav-close]')) { close(); return; }
    /* a group header opens / closes in place; the drawer stays open */
    var tg = e.target.closest('[data-nav-group]');
    if (tg && navBody.contains(tg)) {
      var gli = tg.parentNode, opening = tg.getAttribute('aria-expanded') !== 'true';
      NT.toggle(navBody, gli, opening, true);
      if (opening) setTimeout(function () { reveal(gli); }, mqReduce.matches ? 0 : token('--mc-dur-base', 240));
      return;
    }
    var link = e.target.closest('a[data-drawer-link]');
    if (!link) return;
    /* r12: a page's unsaved-changes guard (MCPage.dirtyGuard) already took this click and asks first:
       nothing is marked, the drawer stays open under the question ("Kembali" returns to this row) */
    if (e.defaultPrevented) return;
    e.preventDefault();
    e.stopPropagation();
    if (link.hasAttribute('data-placeholder') || link.getAttribute('href') === '#') { close(); return; }
    /* the entry of the current address: just close (no reload that would drop filters and scroll) */
    if (link.href.split('#')[0] === window.location.href.split('#')[0]) {
      /* r13 fix round 2: it also cancels an in-place navigation elsewhere still leaving the page (latest wins); the
         marks the drawer moved to that destination come back to the page on screen */
      var kept = !!(window.MCRouter && window.MCRouter.cancel && window.MCRouter.cancel());
      close(kept ? { then: function () { if (NT.refresh) NT.refresh(); refresh(); } } : undefined);
      return;
    }
    var key = link.getAttribute('data-nav-key');
    if (key) {
      /* the chosen entry is current while the drawer closes and the page changes */
      var grp = link.closest('.mc-navdrawer__item--group'), top = grp ? grp.firstElementChild.getAttribute('data-nav-key') : key;
      cur = { id: key, kind: 'page', groupId: grp ? top : null, topId: top, entry: key, exact: true };
      NT.current = cur;
      NT.mark(navBody);
      NT.markBottom(cur);
    }
    var href = link.href;
    close({ returnFocus: false, then: function () {
      if (window.MCShell && window.MCShell.navigate) window.MCShell.navigate(href, null);
      else window.location.href = href;
    } });
  });
  layer.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && accOpen) { e.preventDefault(); e.stopPropagation(); setAccount(false); accBtn.focus({ preventScroll: true }); return; }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  // Leaving the phone/tablet layout while open (rotation, resize to desktop): close quietly, unless the
  // desktop sidebar is collapsed to the rail (r12: a rail group icon opens the drawer there too)
  window.matchMedia('(min-width: 1025px)').addEventListener('change', function (m) {
    if (m.matches && isOpen && shell.getAttribute('data-sidebar') !== 'collapsed') close({ returnFocus: false });
  });

  /* 3. Back ----------------------------------------------------------------------- */
  /* r13: one delegated handler (any [data-back], also on a page shown later); the previous page of this
     tab is read when Back is used (written at pagehide, and by the router on every in-place swap) */
  var KEY = 'mc:prev';
  window.addEventListener('pagehide', function () { try { sessionStorage.setItem(KEY, location.href.split('#')[0]); } catch (e) { /* storage blocked */ } });
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-back]');
    if (!a) return;
    var prev = null, here = location.href.split('#')[0];
    try { prev = sessionStorage.getItem(KEY); } catch (x) { prev = null; }
    if (prev && prev !== here && history.length > 1) {     // a previous page of this tab exists: go back to it
      e.preventDefault();
      e.stopPropagation();
      history.back();
    }                                                      // otherwise the shell follows the fallback href
  }, true);

  /* r13: after an in-place page swap the drawer follows the new current entry (re-initialised while
     closed: its current group open, the entry marked) */
  function refresh() {
    cur = NT.current;
    section = cur ? cur.topId : 'none';
    NT.init(navBody, navBody.mcTree);
  }

  window.MCNav = {
    open: function (o) { o = o || {}; open(o.trigger || triggers[0], o); },
    close: function (o) { close(o); },
    refresh: refresh,
    account: function (v) { if (isOpen) setAccount(v !== false, true); },
    get isOpen() { return isOpen; },
    get section() { return section; },
    get current() { return cur; },
    provides: function (route, params) { return !!P.navProvides && P.navProvides(route, params); },
    covers: function (route, param, values) { return !!P.navCovers && P.navCovers(route, param, values); }
  };
})();


/* ===== Toasts (r5) ===== */
/* =============================================================================
   Reusable notifications: MCToast.show({ type, title, message, duration }) or the shorthands
   MCToast.success / info / warning / error (title, message).
     placement  desktop + tablet: top-right, under the top bar (never over the bar's filters);
                phone: below the app bar, near full width, safe-area aware; pages without a
                bar: 16 px from the top
     types      success + info: polite announcement, auto-dismiss after 4.5 s (paused while
                hovered or focused); warning + error: assertive, stay until closed
     rules      one toast per event, max 3 stacked (newest on top). Errors that need an action
                stay inline next to their field; a toast reports events without a field
                (saved, sent, failed to sync). An inline confirmation (upload success) never
                gets a duplicate toast.
     motion     enter: opacity + 8 px drop on the enter curve (240 ms); exit: opacity (240 ms);
                reduced motion: 150 ms fades
   ============================================================================= */
(function () {
  'use strict';
  var doc = document;
  var ICON = { success: 'check-circle', info: 'info', warning: 'alert-triangle', error: 'alert-circle' };
  var HOLD = 4500, MAX = 3;
  var region = null, polite = null, assertive = null;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function dur(name, fb) { var v = parseFloat(getComputedStyle(doc.documentElement).getPropertyValue(name)); return isNaN(v) ? fb : v; }
  function curve(name, fb) { return getComputedStyle(doc.documentElement).getPropertyValue(name).trim() || fb; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function ensure() {
    if (region) return region;
    region = doc.createElement('section');
    region.className = 'mc-toasts';
    region.setAttribute('aria-label', 'Notifikasi');
    polite = doc.createElement('p'); polite.className = 'mc-sr-only'; polite.setAttribute('aria-live', 'polite');
    assertive = doc.createElement('p'); assertive.className = 'mc-sr-only'; assertive.setAttribute('aria-live', 'assertive');
    doc.body.appendChild(region); doc.body.appendChild(polite); doc.body.appendChild(assertive);
    return region;
  }
  function announce(type, text) {
    var r = type === 'error' || type === 'warning' ? assertive : polite;
    r.textContent = '';
    setTimeout(function () { r.textContent = text; }, 40);
  }

  /* Toast-safe offset: start below any visible [data-toast-avoid] element in the top-right column
     (date popover, page actions). Re-evaluated whenever a toast is shown. */
  function avoid() {
    if (!region) return;
    var colLeft = window.innerWidth - region.offsetWidth - 32, top = 0;
    Array.prototype.forEach.call(doc.querySelectorAll('[data-toast-avoid]'), function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height || r.right < colLeft || r.top > window.innerHeight * 0.6) return;
      top = Math.max(top, r.bottom + 12);
    });
    region.style.setProperty('--toast-avoid-top', top ? Math.round(top) + 'px' : '0px');
  }

  function dismiss(el) {
    if (!el || el._leaving) return;
    el._leaving = true;
    clearTimeout(el._timer);
    var a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: mqReduce.matches ? dur('--mc-dur-reduced', 150) : dur('--mc-dur-base', 240), easing: 'linear', fill: 'forwards' });
    a.onfinish = a.oncancel = function () { el.remove(); };
  }

  function show(o) {
    o = o || {};
    var type = ICON[o.type] ? o.type : 'info';
    var host = ensure();
    var el = doc.createElement('div');
    el.className = 'mc-toast mc-toast--' + type;
    el.innerHTML = '<span class="mc-toast__icon" aria-hidden="true"><svg class="mc-icon mc-icon--18" focusable="false"><use href="#i-' + ICON[type] + '"></use></svg></span>' +
      '<div class="mc-toast__text"><p class="mc-toast__title">' + esc(o.title) + '</p>' + (o.message ? '<p class="mc-toast__msg">' + esc(o.message) + '</p>' : '') + '</div>' +
      '<button class="mc-toast__close" type="button" aria-label="Tutup notifikasi"><svg class="mc-icon mc-icon--16" aria-hidden="true" focusable="false"><use href="#i-x"></use></svg></button>';
    host.insertBefore(el, host.firstChild);
    avoid();
    /* keep MAX visible: older toasts leave (dismiss removes them after their exit animation) */
    Array.prototype.filter.call(host.children, function (t) { return !t._leaving; })
      .slice(MAX).forEach(dismiss);
    announce(type, (o.title || '') + (o.message ? '. ' + o.message : ''));
    el.animate(mqReduce.matches ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }],
      { duration: mqReduce.matches ? dur('--mc-dur-reduced', 150) : dur('--mc-dur-base', 240), easing: mqReduce.matches ? 'linear' : curve('--mc-ease-enter', 'ease-out') });
    var sticky = type === 'error' || type === 'warning' || o.duration === 0;
    function arm() { if (sticky) return; clearTimeout(el._timer); el._timer = setTimeout(function () { dismiss(el); }, o.duration || HOLD); }
    el.addEventListener('mouseenter', function () { clearTimeout(el._timer); });
    el.addEventListener('mouseleave', arm);
    el.addEventListener('focusin', function () { clearTimeout(el._timer); });
    el.addEventListener('focusout', arm);
    el.querySelector('.mc-toast__close').addEventListener('click', function () { dismiss(el); });
    arm();
    return el;
  }
  function short(type) { return function (title, message, opts) { var o = opts || {}; o.type = type; o.title = title; o.message = message; return show(o); }; }

  window.MCToast = {
    show: show,
    success: short('success'), info: short('info'), warning: short('warning'), error: short('error'),
    dismiss: dismiss,
    clear: function () { if (region) Array.prototype.slice.call(region.children).forEach(dismiss); }
  };
})();


/* ===== Date range filter (r5, r6 true arbitrary range) ===== */
/* =============================================================================
   Reusable period filter: .mc-daterange (one trigger per [data-daterange] slot; every slot
   on a page shares one state, remembered for the tab). Elements marked [data-range-label]
   anywhere show the current period text.

   Presets (project-config dateFilter.presets): Hari ini · 7 hari terakhir · 1 bulan terakhir ·
   Bulan ini · Bulan lalu · Rentang kustom. A preset applies immediately.
   Rentang kustom (r6): START and END are chosen independently, with no implicit one-month
   window. Each edge has its own calendar with month and year pickers plus previous / next:
     desktop (>= 1100 px)  popover: presets | Mulai calendar | Selesai calendar (any two months,
                           e.g. Jul 2026 -> Dec 2026 or Dec 2026 -> Feb 2027)
     tablet popover, phone bottom sheet: Mulai / Selesai switch + one calendar (never the
                           desktop pair squeezed onto a phone)
   States: no start -> "Pilih tanggal mulai"; start only -> "Pilih tanggal selesai" (the other
   calendar previews the range on hover); both -> inclusive range highlighted + day count.
   Rules: end >= start (Selesai days before Mulai are unavailable; a new Mulai after the current
   Selesai clears Selesai and says so); days outside [min, max] are unavailable; Terapkan is
   enabled only for a complete valid range; Batal / Esc close without committing; reopening
   shows the committed state.

   Prototype semantics (projects bind these to their reporting contract later):
     today            MCTime.today(): the project timezone + the shared time provider (r7: no
                      separate fixture date; tests / evidence inject one time for everything)
     Hari ini         [today, today]
     7 hari terakhir  [today - 6 days, today]: rolling, today included
     1 bulan terakhir [same day last month + 1 day, today]: rolling month; the day clamps to
                      the shorter month (31 Mar -> 1-31 Mar)
     Bulan ini        [1st, last day of this month]: calendar month (data runs to today)
     Bulan lalu       the previous calendar month
     Rentang kustom   inclusive [start, end] inside [dateFilter.min, dateFilter.max]
   Trigger text: "Hari ini" and "7 hari terakhir" keep their name; other periods show dates
   (1-31 Okt 2026, 15 Sep - 14 Okt 2026, 15 Des 2026 - 20 Feb 2027).

   Keys: presets Up/Down + Enter/Space; day grid arrows (day / week), Home/End (week),
   PageUp/PageDown (month, +Shift year), Enter/Space picks; month/year pickers arrows + Enter,
   Esc returns to the days; Esc closes; Tab stays inside.
   Event: "mc:daterange" on document { preset, start, end, label }.
   API: window.MCDateRange = { get(), set(preset | {start, end}), open(root), close(),
        format(a, b), label(), refresh(), limits() }.
   ============================================================================= */
(function () {
  'use strict';
  var doc = document;
  /* r13 (persistent shell): the slots are read live. The shared state, panel and listeners are set up
     once, by the first page that has a slot (in the SHELL scope: they persist across in-place page
     swaps); scan() binds the slots of a page shown later and repaints them. */
  function liveSlots() { return doc.querySelectorAll('[data-daterange]'); }
  var booted = false, rebind = null;
  function scan() {
    if (!liveSlots().length) return;
    if (!booted) { booted = true; if (window.MCScope && window.MCScope.shell) window.MCScope.shell(boot); else boot(); return; }
    if (rebind) rebind();
  }
  if (window.MCShell) window.MCShell.dateRangeScan = scan;
  scan();

  function boot() {
    var mqPhone = window.matchMedia('(max-width: 767px)');
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var CFG = (window.MC_PROJECT && window.MC_PROJECT.dateFilter) || {};
    var ALL = ['today', 'last7', 'last1m', 'thisMonth', 'lastMonth', 'custom'];
    var PRESETS = (CFG.presets || ALL).filter(function (p) { return ALL.indexOf(p) >= 0; });
    if (PRESETS.indexOf('custom') < 0) PRESETS.push('custom');
    var DEFAULT = PRESETS.indexOf(CFG.default) >= 0 && CFG.default !== 'custom' ? CFG.default : (PRESETS.indexOf('thisMonth') >= 0 ? 'thisMonth' : PRESETS[0]);
    var uid = 0;

    var TEXT = {
      id: { title: 'Periode', presets: 'Periode cepat', today: 'Hari ini', last7: '7 hari terakhir', last1m: '1 bulan terakhir',
            thisMonth: 'Bulan ini', lastMonth: 'Bulan lalu', custom: 'Rentang kustom', start: 'Mulai', end: 'Selesai',
            apply: 'Terapkan', cancel: 'Batal', close: 'Tutup', prev: 'Bulan sebelumnya', next: 'Bulan berikutnya',
            back: 'Periode cepat', pickStart: 'Pilih tanggal mulai', pickEnd: 'Pilih tanggal selesai',
            applied: 'Periode diterapkan: ', field: 'Periode laporan', empty: 'Belum dipilih', unavailable: 'tidak tersedia',
            pickMonth: 'Pilih bulan', pickYear: 'Pilih tahun', days: 'hari', day: 'hari', range: 'Rentang tanggal',
            endCleared: 'Tanggal selesai dikosongkan karena lebih awal dari tanggal mulai yang baru.', selected: 'dipilih' },
      en: { title: 'Period', presets: 'Quick periods', today: 'Today', last7: 'Last 7 days', last1m: 'Past month',
            thisMonth: 'This month', lastMonth: 'Previous month', custom: 'Custom range', start: 'Start', end: 'End',
            apply: 'Apply', cancel: 'Cancel', close: 'Close', prev: 'Previous month', next: 'Next month',
            back: 'Quick periods', pickStart: 'Choose a start date', pickEnd: 'Choose an end date',
            applied: 'Period applied: ', field: 'Report period', empty: 'Not set', unavailable: 'unavailable',
            pickMonth: 'Choose month', pickYear: 'Choose year', days: 'days', day: 'day', range: 'Date range',
            endCleared: 'End date cleared: it was before the new start date.', selected: 'selected' }
    };
    function lang() { return (doc.documentElement.lang || 'id').slice(0, 2) === 'en' ? 'en' : 'id'; }
    function L(k) { return TEXT[lang()][k]; }
    function locale() { return lang() === 'en' ? 'en-GB' : 'id-ID'; }

    /* ---- dates (local midnight) ---------------------------------------------- */
    function D(y, m, d) { return new Date(y, m, d); }
    function parse(s) { var p = String(s).split('-'); return D(+p[0], +p[1] - 1, +p[2]); }
    function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
    function addDays(d, n) { return D(d.getFullYear(), d.getMonth(), d.getDate() + n); }
    function daysIn(y, m) { return D(y, m + 1, 0).getDate(); }
    function addMonths(d, n) {
      var t = D(d.getFullYear(), d.getMonth() + n, 1);
      return D(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), daysIn(t.getFullYear(), t.getMonth())));
    }
    function same(a, b) { return !!a && !!b && a.getTime() === b.getTime(); }
    /* r7: ONE time source. "Today" is MCTime.today() (project timezone + replaceable provider),
       the same clock as the greeting; tests and evidence inject a fixture time instead. */
    function today() {
      if (window.MCTime) return parse(window.MCTime.today());
      var n = new Date(); return D(n.getFullYear(), n.getMonth(), n.getDate());
    }
    /* Limits: an ISO date, 'today', 'startOfYear±N', 'endOfYear±N' or '±N' + d / m / y, from today. */
    function limit(spec, fallback) {
      if (!spec) return fallback;
      if (spec === 'today') return today();
      var m = /^(startOfYear|endOfYear)([+-]\d+)?$/.exec(spec);
      if (m) { var y = today().getFullYear() + (m[2] ? +m[2] : 0); return m[1] === 'startOfYear' ? D(y, 0, 1) : D(y, 11, 31); }
      m = /^([+-]\d+)([dmy])$/.exec(spec);
      if (m) { var n = +m[1], t = today(); return m[2] === 'd' ? addDays(t, n) : addMonths(t, m[2] === 'm' ? n : n * 12); }
      return parse(spec);
    }
    function minDate() { return limit(CFG.min, D(2000, 0, 1)); }
    function maxDate() { return limit(CFG.max, D(2099, 11, 31)); }
    function clamp(d) { var a = minDate(), b = maxDate(); return d < a ? a : d > b ? b : d; }
    function inLimits(d) { return d >= minDate() && d <= maxDate(); }
    function dayCount(a, b) { return Math.round((D(b.getFullYear(), b.getMonth(), b.getDate()) - D(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5) + 1; }
    function rangeFor(p) {
      var t = today();
      switch (p) {
        case 'today': return [t, t];
        case 'last7': return [addDays(t, -6), t];
        case 'last1m': return [addDays(addMonths(t, -1), 1), t];
        case 'thisMonth': return [D(t.getFullYear(), t.getMonth(), 1), D(t.getFullYear(), t.getMonth() + 1, 0)];
        case 'lastMonth': return [D(t.getFullYear(), t.getMonth() - 1, 1), D(t.getFullYear(), t.getMonth(), 0)];
      }
      return null;
    }

    /* ---- formatting ----------------------------------------------------------- */
    function mon(d) { return new Intl.DateTimeFormat(locale(), { month: 'short' }).format(d).replace(/\.$/, ''); }
    function day(d) { return d.getDate() + ' ' + mon(d) + ' ' + d.getFullYear(); }
    function fmtRange(a, b) {
      if (same(a, b)) return day(a);
      if (a.getFullYear() === b.getFullYear()) {
        if (a.getMonth() === b.getMonth()) return a.getDate() + '–' + b.getDate() + ' ' + mon(b) + ' ' + b.getFullYear();
        return a.getDate() + ' ' + mon(a) + ' – ' + b.getDate() + ' ' + mon(b) + ' ' + b.getFullYear();
      }
      return day(a) + ' – ' + day(b);
    }
    function longDay(d) { return new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d); }
    function monthName(m, style) { return new Intl.DateTimeFormat(locale(), { month: style || 'long' }).format(D(2026, m, 1)).replace(/\.$/, ''); }
    function weekdays() {
      var f = new Intl.DateTimeFormat(locale(), { weekday: 'short' }), g = new Intl.DateTimeFormat(locale(), { weekday: 'long' }), out = [];
      for (var i = 0; i < 7; i++) { var d = D(2026, 0, 5 + i); out.push([f.format(d).replace(/\.$/, ''), g.format(d)]); }   /* 5 Jan 2026 is a Monday */
      return out;
    }
    function labelOf(st) { return st.preset === 'today' || st.preset === 'last7' ? L(st.preset) : fmtRange(st.start, st.end); }
    function describe(st) { var r = fmtRange(st.start, st.end); return st.preset === 'custom' ? r : L(st.preset) + ' (' + r + ')'; }
    function countText(a, b) { var n = dayCount(a, b); return n + ' ' + (n === 1 ? L('day') : L('days')); }

    /* ---- shared state ---------------------------------------------------------- */
    function load() {
      try {
        var s = JSON.parse(sessionStorage.getItem('mc:range') || 'null');
        if (s && PRESETS.indexOf(s.preset) >= 0) {
          if (s.preset === 'custom' && s.start && s.end) return { preset: 'custom', start: parse(s.start), end: parse(s.end) };
          if (s.preset !== 'custom') { var r0 = rangeFor(s.preset); return { preset: s.preset, start: r0[0], end: r0[1] }; }
        }
      } catch (e) { /* storage blocked */ }
      var r = rangeFor(DEFAULT);
      return { preset: DEFAULT, start: r[0], end: r[1] };
    }
    var state = load();
    function save() { try { sessionStorage.setItem('mc:range', JSON.stringify({ preset: state.preset, start: iso(state.start), end: iso(state.end) })); } catch (e) { /* blocked */ } }

    var live = doc.createElement('p');
    live.className = 'mc-sr-only';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    doc.body.appendChild(live);

    function paint() {
      var text = labelOf(state), aria = L('field') + ': ' + describe(state);
      Array.prototype.forEach.call(doc.querySelectorAll('[data-range-label]'), function (el) { el.textContent = text; });
      Array.prototype.forEach.call(doc.querySelectorAll('.mc-daterange__trigger'), function (b) { b.setAttribute('aria-label', aria); });
    }
    function commit(next, announce) {
      state = next;
      save();
      paint();
      if (announce) { live.textContent = ''; setTimeout(function () { live.textContent = L('applied') + describe(state); }, 40); }
      doc.dispatchEvent(new CustomEvent('mc:daterange', { detail: { preset: state.preset, start: iso(state.start), end: iso(state.end), label: labelOf(state) } }));
    }

    /* ---- triggers ------------------------------------------------------------------ */
    function icon(name, cls) { return '<svg class="mc-icon ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>'; }
    /* r13: bound once per slot; slots of a page shown later are bound by scan() */
    function bindSlots() {
      Array.prototype.forEach.call(liveSlots(), function (slot) {
        if (slot.mcDrBound) return;
        slot.mcDrBound = true;
        var b = slot.querySelector('.mc-daterange__trigger');
        if (!b) {
          b = doc.createElement('button');
          b.type = 'button';
          b.className = 'mc-daterange__trigger';
          b.innerHTML = icon('calendar', 'mc-daterange__icon') + '<span class="mc-daterange__value" data-range-label></span>' + icon('chevron-down', 'mc-daterange__chev');
          slot.appendChild(b);
        }
        b.setAttribute('aria-haspopup', 'dialog');
        b.setAttribute('aria-expanded', 'false');
        b.addEventListener('click', function () { if (open && open.slot === slot) close(true); else openFor(slot); });
        b.addEventListener('keydown', function (e) {
          if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !open) { e.preventDefault(); openFor(slot); }
        });
      });
    }
    bindSlots();
    paint();
    rebind = function () { bindSlots(); paint(); };

    /* ---- panel ------------------------------------------------------------------------ */
    /* open = { slot, trigger, mode: 'popover'|'sheet', layout: 'dual'|'single', root, panel, view: 'presets'|'custom',
                draft: {start, end}, edge: 'start'|'end' (single layout), pane: {start: {y, m, view}, end: {...}},
                focus: {start: Date, end: Date}, notice } */
    var open = null;

    function presetDates(p) {
      if (p === 'custom') return state.preset === 'custom' ? fmtRange(state.start, state.end) : '';
      var r = rangeFor(p); return fmtRange(r[0], r[1]);
    }
    function presetsHTML(o) {
      var current = o.view === 'custom' ? 'custom' : state.preset;
      return '<div class="mc-dr__presets" role="radiogroup" aria-label="' + L('presets') + '">' +
        PRESETS.map(function (p) {
          var on = p === current, dates = presetDates(p);
          return '<button type="button" class="mc-dr__preset" role="radio" data-preset="' + p + '" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '">' +
            '<span class="mc-dr__preset-text"><span class="mc-dr__preset-label">' + L(p) + '</span>' +
            (dates ? '<span class="mc-dr__preset-dates">' + dates + '</span>' : '') + '</span>' +
            (p === 'custom' ? icon('chevron-right', 'mc-dr__preset-go') : icon('check', 'mc-dr__preset-check')) + '</button>';
        }).join('') + '</div>';
    }

    /* A day is pickable in a pane when it is inside the limits and, in the Selesai pane, not
       before Mulai. */
    function pickable(o, edge, d) {
      if (!inLimits(d)) return false;
      if (edge === 'end' && o.draft.start && d < o.draft.start) return false;
      return true;
    }
    function daysHTML(o, edge) {
      var pv = o.pane[edge], y = pv.y, m = pv.m, t = today(), first = D(y, m, 1), lead = (first.getDay() + 6) % 7, n = daysIn(y, m), wd = weekdays();
      var a = o.draft.start, b = o.draft.end, f = o.focus[edge];
      var html = '<table class="mc-dr__grid" role="grid" aria-label="' + L(edge) + ', ' + monthName(m) + ' ' + y + '"><thead><tr>' +
        wd.map(function (w) { return '<th scope="col" abbr="' + w[1] + '">' + w[0] + '</th>'; }).join('') + '</tr></thead><tbody><tr>';
      var cells = 0;
      for (var i = 0; i < lead; i++) { html += '<td class="mc-dr__cell is-out" role="gridcell"></td>'; cells++; }
      for (var dd = 1; dd <= n; dd++) {
        var d = D(y, m, dd), ok = pickable(o, edge, d);
        var inRange = a && b && d >= a && d <= b, isA = same(d, a), isB = same(d, b);
        var cls = 'mc-dr__cell' + (inRange ? ' is-in' : '') + (isA ? ' is-start' : '') + (isB ? ' is-end' : '') +
          (same(d, t) ? ' is-today' : '') + (cells % 7 === 0 ? ' is-row-start' : '') + (cells % 7 === 6 || dd === n ? ' is-row-end' : '') +
          (dd === 1 ? ' is-month-start' : '') + (a && b && same(a, b) && isA ? ' is-single' : '');
        html += '<td class="' + cls + '" role="gridcell" aria-selected="' + !!(inRange || isA || isB) + '">' +
          '<button type="button" class="mc-dr__day" data-date="' + iso(d) + '" tabindex="' + (same(d, f) ? 0 : -1) + '"' +
          (ok ? '' : ' aria-disabled="true"') + ' aria-label="' + longDay(d) + (ok ? '' : ', ' + L('unavailable')) + '">' + dd + '</button></td>';
        cells++;
        if (cells % 7 === 0 && dd < n) html += '</tr><tr>';
      }
      while (cells % 7) { html += '<td class="mc-dr__cell is-out" role="gridcell"></td>'; cells++; }
      return html + '</tr></tbody></table>';
    }
    function monthsHTML(o, edge) {
      var pv = o.pane[edge], lo = minDate(), hi = maxDate(), html = '<div class="mc-dr__picker mc-dr__picker--months" role="listbox" aria-label="' + L('pickMonth') + ' ' + pv.y + '">';
      for (var m = 0; m < 12; m++) {
        var ok = D(pv.y, m + 1, 0) >= lo && D(pv.y, m, 1) <= hi, on = m === pv.m;
        html += '<button type="button" class="mc-dr__opt" role="option" data-month="' + m + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '"' + (ok ? '' : ' aria-disabled="true"') + '>' + monthName(m, 'short') + '</button>';
      }
      return html + '</div>';
    }
    function yearsHTML(o, edge) {
      var pv = o.pane[edge], y0 = minDate().getFullYear(), y1 = maxDate().getFullYear(), html = '<div class="mc-dr__picker mc-dr__picker--years" role="listbox" aria-label="' + L('pickYear') + '">';
      for (var y = y0; y <= y1; y++) {
        var on = y === pv.y;
        html += '<button type="button" class="mc-dr__opt" role="option" data-year="' + y + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '">' + y + '</button>';
      }
      return html + '</div>';
    }
    function paneHTML(o, edge) {
      var pv = o.pane[edge], v = o.draft[edge], id = 'mcdr-pane-' + edge + '-' + o.uid;
      var canPrev = D(pv.y, pv.m, 1) > minDate(), canNext = D(pv.y, pv.m + 1, 0) < maxDate();
      var body = pv.view === 'months' ? monthsHTML(o, edge) : pv.view === 'years' ? yearsHTML(o, edge) : daysHTML(o, edge);
      return '<section class="mc-dr__pane" data-edge="' + edge + '" data-view="' + pv.view + '" aria-labelledby="' + id + '">' +
        '<header class="mc-dr__pane-head"><p class="mc-dr__pane-label" id="' + id + '">' + L(edge) + '</p>' +
          '<p class="mc-dr__pane-value' + (v ? '' : ' is-empty') + '">' + (v ? day(v) : L('empty')) + '</p></header>' +
        '<div class="mc-dr__cal-head">' +
          '<button type="button" class="mc-dr__navbtn" data-step="-1" aria-label="' + L('prev') + ' (' + L(edge) + ')"' + (canPrev && pv.view === 'days' ? '' : ' disabled') + '>' + icon('chevron-left') + '</button>' +
          '<div class="mc-dr__jump">' +
            '<button type="button" class="mc-dr__jumpbtn" data-jump="months" aria-expanded="' + (pv.view === 'months') + '" aria-label="' + L('pickMonth') + ', ' + monthName(pv.m) + '">' + monthName(pv.m) + icon('chevron-down', 'mc-dr__jumpchev') + '</button>' +
            '<button type="button" class="mc-dr__jumpbtn" data-jump="years" aria-expanded="' + (pv.view === 'years') + '" aria-label="' + L('pickYear') + ', ' + pv.y + '">' + pv.y + icon('chevron-down', 'mc-dr__jumpchev') + '</button>' +
          '</div>' +
          '<button type="button" class="mc-dr__navbtn" data-step="1" aria-label="' + L('next') + ' (' + L(edge) + ')"' + (canNext && pv.view === 'days' ? '' : ' disabled') + '>' + icon('chevron-right') + '</button>' +
        '</div>' +
        '<div class="mc-dr__view">' + body + '</div></section>';
    }
    function hintText(o) {
      var a = o.draft.start, b = o.draft.end;
      if (a && b) return '<strong>' + fmtRange(a, b) + '</strong> · ' + countText(a, b);
      return !a ? L('pickStart') : L('pickEnd');
    }
    function edgesHTML(o) {
      function edgeBtn(edge) {
        var v = o.draft[edge];
        return '<button type="button" class="mc-dr__edge" data-edge-select="' + edge + '" aria-pressed="' + (o.edge === edge) + '">' +
          '<span class="mc-dr__edge-label">' + L(edge) + '</span><span class="mc-dr__edge-value' + (v ? '' : ' is-empty') + '">' + (v ? day(v) : L('empty')) + '</span></button>';
      }
      return '<div class="mc-dr__edges" role="group" aria-label="' + L('range') + '">' + edgeBtn('start') +
        '<span class="mc-dr__arrow" aria-hidden="true">' + icon('arrow-right') + '</span>' + edgeBtn('end') + '</div>';
    }
    function customHTML(o) {
      var panes = o.layout === 'dual' ? paneHTML(o, 'start') + paneHTML(o, 'end') : paneHTML(o, o.edge);
      var valid = o.draft.start && o.draft.end && o.draft.end >= o.draft.start;
      return '<div class="mc-dr__custom" data-layout="' + o.layout + '">' +
        (o.mode === 'sheet' ? '<button type="button" class="mc-dr__back" data-dr-back>' + icon('chevron-left', 'mc-dr__back-icon') + L('back') + '</button>' : '') +
        (o.layout === 'single' ? edgesHTML(o) : '') +
        '<div class="mc-dr__panes">' + panes + '</div>' +
        '<div class="mc-dr__foot"><div class="mc-dr__status"><p class="mc-dr__hint" aria-live="polite">' + hintText(o) + '</p>' +
          (o.notice ? '<p class="mc-dr__notice" role="status">' + icon('info', 'mc-dr__notice-icon') + '<span>' + o.notice + '</span></p>' : '') + '</div>' +
          '<div class="mc-dr__actions">' +
          '<button type="button" class="mc-btn mc-btn--ghost mc-btn--md mc-dr__cancel" data-dr-cancel>' + L('cancel') + '</button>' +
          '<button type="button" class="mc-btn mc-btn--primary mc-btn--md mc-dr__apply" data-dr-apply' + (valid ? '' : ' disabled') + '>' + L('apply') + '</button>' +
        '</div></div></div>';
    }
    function render(o, focusSel) {
      var showPresets = !(o.mode === 'sheet' && o.view === 'custom');
      o.panel.setAttribute('data-view', o.view);
      o.panel.setAttribute('data-layout', o.view === 'custom' ? o.layout : '');
      o.panel.innerHTML = (showPresets ? presetsHTML(o) : '') + (o.view === 'custom' ? customHTML(o) : '');
      if (o.mode === 'popover') place(o);
      if (focusSel) { var f = o.panel.querySelector(focusSel); if (f) f.focus({ preventScroll: o.mode === 'popover' }); }
    }
    function daySel(edge) { return '.mc-dr__pane[data-edge="' + edge + '"] .mc-dr__day[tabindex="0"]'; }

    function layoutFor(mode) { return mode === 'popover' && window.innerWidth >= 1100 ? 'dual' : 'single'; }
    function setPane(o, edge, d) { o.pane[edge].y = d.getFullYear(); o.pane[edge].m = d.getMonth(); }
    /* Mulai shows the month of its date (else the committed start); Selesai shows the month of its
       date (else the committed end). In the dual layout two equal months show Selesai one month
       later, so the pair never repeats itself (the user can still bring them together). */
    function enterCustom(o, fromCommitted) {
      o.view = 'custom';
      o.layout = layoutFor(o.mode);
      o.notice = '';
      o.draft = fromCommitted && state.preset === 'custom' ? { start: state.start, end: state.end } : { start: null, end: null };
      var s0 = clamp(o.draft.start || state.start), e0 = clamp(o.draft.end || state.end);
      o.pane = { start: { y: 0, m: 0, view: 'days' }, end: { y: 0, m: 0, view: 'days' } };
      setPane(o, 'start', s0);
      setPane(o, 'end', e0);
      if (o.layout === 'dual' && o.pane.start.y === o.pane.end.y && o.pane.start.m === o.pane.end.m && D(e0.getFullYear(), e0.getMonth() + 1, 1) <= maxDate()) setPane(o, 'end', D(e0.getFullYear(), e0.getMonth() + 1, 1));
      o.focus = { start: s0, end: o.draft.end ? e0 : D(o.pane.end.y, o.pane.end.m, Math.min(e0.getDate(), daysIn(o.pane.end.y, o.pane.end.m))) };
      o.edge = 'start';
      render(o, daySel('start'));
    }

    function pick(o, edge, d) {
      if (!pickable(o, edge, d)) return;
      o.notice = '';
      if (edge === 'start') {
        o.draft.start = d;
        if (o.draft.end && d > o.draft.end) { o.draft.end = null; o.notice = L('endCleared'); }
        o.focus.start = d;
        if (o.layout === 'single' && !o.draft.end) {               /* next: Selesai, from the month of Mulai */
          o.edge = 'end';
          if (D(o.pane.end.y, o.pane.end.m + 1, 0) < d) setPane(o, 'end', d);
          o.focus.end = d;
          render(o, daySel('end'));
          return;
        }
        render(o, daySel('start'));
      } else {
        o.draft.end = d;
        o.focus.end = d;
        render(o, o.draft.start ? '[data-dr-apply]' : daySel('end'));
      }
    }

    function applyPreset(o, p) {
      if (p === 'custom') { enterCustom(o, false); return; }
      var r = rangeFor(p);
      commit({ preset: p, start: r[0], end: r[1] }, true);
      close(true);
    }

    function focusables(root) {
      return Array.prototype.filter.call(root.querySelectorAll('button:not([disabled]), [tabindex="0"]'), function (e) {
        return e.offsetParent !== null && e.getAttribute('tabindex') !== '-1';
      });
    }
    function moveFocus(o, edge, n) {
      n = clamp(n);
      o.focus[edge] = n;
      setPane(o, edge, n);
      render(o, daySel(edge));
    }

    function onKey(e) {
      var o = open;
      if (!o) return;
      var t = e.target;
      var pane = t.closest ? t.closest('.mc-dr__pane') : null, edge = pane ? pane.getAttribute('data-edge') : null;
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        if (edge && o.pane[edge].view !== 'days') { o.pane[edge].view = 'days'; render(o, '.mc-dr__pane[data-edge="' + edge + '"] [data-jump]'); return; }
        close(true);
        return;
      }
      if (e.key === 'Tab') {
        var f = focusables(o.root);
        if (!f.length) return;
        var i = f.indexOf(doc.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        return;
      }
      if (t.classList.contains('mc-dr__preset')) {
        var list = Array.prototype.slice.call(o.panel.querySelectorAll('.mc-dr__preset')), j = list.indexOf(t);
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          var next = list[(j + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length];
          list.forEach(function (x) { x.tabIndex = -1; }); next.tabIndex = 0; next.focus();
        } else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault(); var to = e.key === 'Home' ? list[0] : list[list.length - 1];
          list.forEach(function (x) { x.tabIndex = -1; }); to.tabIndex = 0; to.focus();
        }
        return;
      }
      if (t.classList.contains('mc-dr__opt')) {
        var opts = Array.prototype.slice.call(pane.querySelectorAll('.mc-dr__opt')), k = opts.indexOf(t), step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[e.key];
        if (step) { e.preventDefault(); var to2 = opts[Math.min(Math.max(0, k + step), opts.length - 1)]; opts.forEach(function (x) { x.tabIndex = -1; }); to2.tabIndex = 0; to2.focus(); }
        return;
      }
      if (t.classList.contains('mc-dr__day') && edge) {
        var d = parse(t.getAttribute('data-date')), n = null;
        switch (e.key) {
          case 'ArrowLeft': n = addDays(d, -1); break;
          case 'ArrowRight': n = addDays(d, 1); break;
          case 'ArrowUp': n = addDays(d, -7); break;
          case 'ArrowDown': n = addDays(d, 7); break;
          case 'Home': n = addDays(d, -((d.getDay() + 6) % 7)); break;
          case 'End': n = addDays(d, 6 - ((d.getDay() + 6) % 7)); break;
          case 'PageUp': n = addMonths(d, e.shiftKey ? -12 : -1); break;
          case 'PageDown': n = addMonths(d, e.shiftKey ? 12 : 1); break;
          case 'Enter': case ' ': e.preventDefault(); pick(o, edge, d); return;
        }
        if (n) { e.preventDefault(); moveFocus(o, edge, n); }
      }
    }

    function onClick(e) {
      var o = open;
      if (!o) return;
      /* r10 overlay contract: a non-critical sheet closes from its scrim; pending custom dates are
         discarded (close never commits), the committed range stays */
      if (e.target.closest('.mc-sheet-layer__scrim')) { close(true); return; }
      var el = e.target.closest('button');
      if (!el || !o.root.contains(el)) return;
      var pane = el.closest('.mc-dr__pane'), edge = pane ? pane.getAttribute('data-edge') : null;
      if (el.classList.contains('mc-dr__preset')) { applyPreset(o, el.getAttribute('data-preset')); return; }
      if (el.classList.contains('mc-dr__day')) { if (el.getAttribute('aria-disabled') !== 'true') pick(o, edge, parse(el.getAttribute('data-date'))); return; }
      if (el.hasAttribute('data-step')) {
        var pv = o.pane[edge], target = D(pv.y, pv.m + +el.getAttribute('data-step'), 1);
        setPane(o, edge, target);
        o.focus[edge] = clamp(D(target.getFullYear(), target.getMonth(), Math.min(o.focus[edge].getDate(), daysIn(target.getFullYear(), target.getMonth()))));
        render(o, '.mc-dr__pane[data-edge="' + edge + '"] [data-step="' + el.getAttribute('data-step') + '"]:not([disabled])') ;
        if (!o.panel.contains(doc.activeElement)) { var f = o.panel.querySelector(daySel(edge)); if (f) f.focus({ preventScroll: true }); }
        return;
      }
      if (el.hasAttribute('data-jump')) {
        var v = el.getAttribute('data-jump');
        o.pane[edge].view = o.pane[edge].view === v ? 'days' : v;
        render(o, o.pane[edge].view === 'days' ? daySel(edge) : '.mc-dr__pane[data-edge="' + edge + '"] .mc-dr__opt[tabindex="0"]');
        return;
      }
      if (el.hasAttribute('data-month') || el.hasAttribute('data-year')) {
        if (el.getAttribute('aria-disabled') === 'true') return;
        var p2 = o.pane[edge];
        if (el.hasAttribute('data-month')) p2.m = +el.getAttribute('data-month');
        else p2.y = +el.getAttribute('data-year');
        var cl = clamp(D(p2.y, p2.m, 1)), last = clamp(D(p2.y, p2.m + 1, 0));
        if (cl.getMonth() !== p2.m || cl.getFullYear() !== p2.y) { p2.y = cl.getFullYear(); p2.m = cl.getMonth(); }
        p2.view = 'days';
        var fd = o.focus[edge];
        o.focus[edge] = clamp(D(p2.y, p2.m, Math.min(fd.getDate(), daysIn(p2.y, p2.m))));
        if (o.focus[edge] > last) o.focus[edge] = last;
        render(o, daySel(edge));
        return;
      }
      if (el.hasAttribute('data-edge-select')) {
        o.edge = el.getAttribute('data-edge-select');
        var dv = o.draft[o.edge];
        if (dv) { setPane(o, o.edge, dv); o.focus[o.edge] = dv; }
        render(o, daySel(o.edge));
        return;
      }
      if (el.hasAttribute('data-dr-back')) { o.view = 'presets'; render(o, '.mc-dr__preset[tabindex="0"]'); return; }
      if (el.hasAttribute('data-dr-cancel') || el.hasAttribute('data-dr-close')) { close(true); return; }
      if (el.hasAttribute('data-dr-apply') && o.draft.start && o.draft.end && o.draft.end >= o.draft.start) {
        commit({ preset: 'custom', start: o.draft.start, end: o.draft.end }, true);
        close(true);
      }
    }
    /* Hover preview: with exactly one edge chosen, a day under the pointer previews the range. */
    function onHover(e) {
      var o = open;
      if (!o || o.view !== 'custom') return;
      var a = o.draft.start, b = o.draft.end;
      if ((a && b) || (!a && !b)) return;
      var btn = e.target.closest('.mc-dr__day');
      var h = btn && btn.getAttribute('aria-disabled') !== 'true' ? parse(btn.getAttribute('data-date')) : null;
      var fixed = a || b;
      Array.prototype.forEach.call(o.panel.querySelectorAll('.mc-dr__day'), function (x) {
        var d = parse(x.getAttribute('data-date'));
        var on = h && ((d >= fixed && d <= h) || (d <= fixed && d >= h));
        x.parentNode.classList.toggle('is-preview', !!on);
      });
    }

    function place(o) {
      var r = o.trigger.getBoundingClientRect(), el = o.root;
      el.style.maxHeight = '';
      var w = el.offsetWidth, h = el.offsetHeight;
      var left = Math.min(Math.max(12, r.right - w), innerWidth - w - 12);
      if (r.left + w <= innerWidth - 12 && r.right - w < 12) left = Math.max(12, r.left);
      var below = innerHeight - r.bottom - 18;
      el.style.left = Math.round(left) + 'px';
      el.style.top = Math.round(r.bottom + 6) + 'px';
      if (h > below) el.style.maxHeight = Math.max(240, below) + 'px';
    }

    var inertList = [];
    function setInert(except, on) {
      if (on) {
        Array.prototype.forEach.call(doc.body.children, function (el) {
          if (el === except || el.id === 'mc-icon-sprite' || el.tagName === 'SCRIPT' || el.inert) return;
          el.inert = true; inertList.push(el);
        });
      } else { inertList.forEach(function (el) { el.inert = false; }); inertList = []; }
    }
    function dur(name, fb) { var v = parseFloat(getComputedStyle(doc.documentElement).getPropertyValue(name)); return isNaN(v) ? fb : v; }
    function curve(name, fb) { return getComputedStyle(doc.documentElement).getPropertyValue(name).trim() || fb; }

    function openFor(slot) {
      if (open) close(false);
      var trigger = slot.querySelector('.mc-daterange__trigger');
      var mode = mqPhone.matches ? 'sheet' : 'popover';
      var o = { slot: slot, trigger: trigger, mode: mode, view: 'presets', uid: ++uid, draft: { start: state.start, end: state.end }, edge: 'start', notice: '' };
      var titleId = 'mcdr-title-' + o.uid;
      if (mode === 'sheet') {
        o.root = doc.createElement('div');
        o.root.className = 'mc-sheet-layer mc-dr-layer';
        o.root.innerHTML = '<div class="mc-sheet-layer__scrim" data-dr-close></div>' +
          '<div class="mc-sheet mc-dr-sheet" role="dialog" aria-modal="true" aria-labelledby="' + titleId + '">' +
            '<div class="mc-sheet__handle" aria-hidden="true"></div>' +
            '<div class="mc-sheet__head"><h2 class="mc-sheet__title" id="' + titleId + '">' + L('title') + '</h2>' +
            '<button type="button" class="mc-sheet__close" data-dr-close aria-label="' + L('close') + '">' + icon('x', 'mc-icon--20') + '</button></div>' +
            '<div class="mc-dr mc-sheet__body"></div></div>';
        o.panel = o.root.querySelector('.mc-dr');
        doc.body.appendChild(o.root);
        setInert(o.root, true);
      } else {
        o.root = doc.createElement('div');
        o.root.className = 'mc-dr mc-daterange-pop';
        o.root.setAttribute('role', 'dialog');
        o.root.setAttribute('aria-label', L('title'));
        o.root.setAttribute('data-toast-avoid', '');
        o.root.id = 'mcdr-pop-' + o.uid;
        o.panel = o.root;
        doc.body.appendChild(o.root);
        trigger.setAttribute('aria-controls', o.root.id);
      }
      open = o;
      trigger.setAttribute('aria-expanded', 'true');
      slot.classList.add('is-open');
      o.root.addEventListener('keydown', onKey);
      o.root.addEventListener('click', onClick);
      o.root.addEventListener('pointerover', onHover);
      if (state.preset === 'custom') enterCustom(o, true); else render(o, '.mc-dr__preset[tabindex="0"]');
      var reduce = mqReduce.matches;
      if (mode === 'sheet') {
        var sheet = o.root.querySelector('.mc-sheet'), scrim = o.root.querySelector('.mc-sheet-layer__scrim');
        if (reduce) o.root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur('--mc-dur-reduced', 150), easing: 'linear' });
        else {
          scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur('--mc-dur-base', 240), easing: 'linear' });
          sheet.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: dur('--mc-dur-sheet', 320), easing: curve('--mc-ease-reveal', 'ease-out') });
        }
      } else {
        o.root.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(-4px) scale(.985)' }, { opacity: 1, transform: 'none' }],
          { duration: reduce ? dur('--mc-dur-reduced', 150) : dur('--mc-dur-fast', 160), easing: reduce ? 'linear' : curve('--mc-ease-enter', 'ease-out') });
        doc.addEventListener('pointerdown', onOutside, true);
        window.addEventListener('resize', onReflow);
        window.addEventListener('scroll', onReflow, true);
      }
    }
    function onOutside(e) { if (open && open.mode === 'popover' && !open.root.contains(e.target) && !open.slot.contains(e.target)) close(false); }
    function onReflow(e) {
      if (!open || open.mode !== 'popover') return;
      if (e && e.type === 'scroll' && open.root.contains(e.target)) return;
      var r = open.trigger.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) { close(false); return; }
      var lay = layoutFor('popover');
      if (open.view === 'custom' && lay !== open.layout) { open.layout = lay; render(open); } else place(open);
    }
    function close(returnFocus) {
      var o = open;
      if (!o) return;
      open = null;
      o.trigger.setAttribute('aria-expanded', 'false');
      o.slot.classList.remove('is-open');
      doc.removeEventListener('pointerdown', onOutside, true);
      window.removeEventListener('resize', onReflow);
      window.removeEventListener('scroll', onReflow, true);
      if (o.mode === 'sheet') setInert(null, false);
      if (returnFocus) o.trigger.focus({ preventScroll: true });
      var reduce = mqReduce.matches, a;
      if (o.mode === 'sheet' && !reduce) {
        o.root.querySelector('.mc-sheet-layer__scrim').animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur('--mc-dur-base', 240), easing: 'linear', fill: 'forwards' });
        a = o.root.querySelector('.mc-sheet').animate([{ transform: 'none' }, { transform: 'translateY(100%)' }], { duration: dur('--mc-dur-base', 240), easing: curve('--mc-ease-exit', 'ease-in'), fill: 'forwards' });
      } else {
        a = o.root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduce ? dur('--mc-dur-reduced', 150) : 120, easing: 'linear', fill: 'forwards' });
      }
      a.onfinish = a.oncancel = function () { o.root.remove(); };
    }
    if (mqPhone.addEventListener) mqPhone.addEventListener('change', function () { if (open) close(false); });
    /* r7: relative presets follow the shared clock (a new day or a replaced provider moves "Hari ini",
       "Bulan ini", ... with the greeting); a custom range keeps its explicit dates. */
    doc.addEventListener('mc:timechange', function () {
      if (state.preset === 'custom') return;
      var r = rangeFor(state.preset);
      if (iso(r[0]) !== iso(state.start) || iso(r[1]) !== iso(state.end)) commit({ preset: state.preset, start: r[0], end: r[1] }, false);
    });

    window.MCDateRange = {
      get: function () { return { preset: state.preset, start: iso(state.start), end: iso(state.end), label: labelOf(state) }; },
      set: function (v) {
        if (typeof v === 'string' && v !== 'custom' && PRESETS.indexOf(v) >= 0) { var r = rangeFor(v); commit({ preset: v, start: r[0], end: r[1] }, false); }
        else if (v && v.start && v.end) { var a = parse(v.start), b = parse(v.end); commit({ preset: 'custom', start: a <= b ? a : b, end: a <= b ? b : a }, false); }
      },
      open: function (root) { var slots = liveSlots(); openFor(root || Array.prototype.filter.call(slots, function (s) { return s.offsetParent !== null; })[0] || slots[0]); },
      close: function () { close(true); },
      format: function (a, b) { return fmtRange(parse(a), parse(b || a)); },
      label: function () { return labelOf(state); },
      refresh: function () { paint(); },
      limits: function () { return { min: iso(minDate()), max: iso(maxDate()), today: iso(today()), presets: PRESETS.slice() }; },
      get isOpen() { return !!open; },
      /* QA: the open panel's draft (null when closed) */
      draft: function () { return open && open.view === 'custom' ? { start: open.draft.start && iso(open.draft.start), end: open.draft.end && iso(open.draft.end), layout: open.layout, edge: open.edge,
        panes: { start: open.pane.start.y + '-' + (open.pane.start.m + 1), end: open.pane.end.y + '-' + (open.pane.end.m + 1) } } : null; }
    };
  }
})();


/* ===== Account menu, dialogs, logout confirmation, keyboard shortcuts (r6) ===== */
/* =============================================================================
   Account placement (one entry point per context; never a permanent top-right control):
     desktop      bottom of the sidebar ([data-account-trigger]); stays visible while the
                  navigation scrolls on short viewports
     tablet rail  avatar at the bottom of the rail (same trigger, text hidden)
     phone        bottom of the navigation drawer only (built by the drawer module, which
                  calls MCAccount.entries() / MCAccount.activate())
   Menu entries come from project-config.js (account.menu; role-aware; 'pointer: fine' entries
   such as keyboard shortcuts are hidden on touch). Menu: role="menu", opens above the
   trigger (to the right of the rail), Up/Down/Home/End, Enter/Space, Esc returns focus,
   Tab or a click outside closes.
   Logout is never immediate: Keluar -> confirmation dialog (Batal focused, Esc / scrim cancel)
   -> event 'mc:logout' (cancelable; detail.redirect) -> the Login page. Rule (docs): confirm
   logout, destructive deletion, irreversible or data-losing actions only.
   MCDialog.open({ kind: 'confirm' | 'info', title, message, html, tone, confirm, cancel,
   returnFocus }) -> Promise<boolean>; MCConfirm(opts) is the confirm shorthand. r9: always an
   APPLICATION dialog (full-viewport scrim, centred, no decorative icon); callers inside the drawer
   close the drawer first.
   API: window.MCAccount = { open(trigger), close(), entries(context), activate(id, from),
        logout(from), shortcuts(from) }.
   ============================================================================= */
(function () {
  'use strict';
  var P = window.MCProject, doc = document;
  if (!P || !doc.body) return;
  var cfg = window.MC_PROJECT;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var uid = 0;
  function T(id, en) { return P.lang() === 'en' ? en : id; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icon(name, cls) { return '<svg class="mc-icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>'; }
  function dur(name, fb) { var v = parseFloat(getComputedStyle(doc.documentElement).getPropertyValue(name)); return isNaN(v) ? fb : v; }
  function curve(name, fb) { return getComputedStyle(doc.documentElement).getPropertyValue(name).trim() || fb; }
  function visible(el) { return !!el && el.offsetParent !== null; }

  /* ---- 1. Dialog ----------------------------------------------------------------------- */
  var active = null;
  function dialog(o) {
    o = o || {};
    if (active) active.finish(false, true);
    return new Promise(function (resolve) {
      var id = 'mc-modal-' + (++uid), kind = o.kind === 'info' ? 'info' : 'confirm';
      var layer = doc.createElement('div');
      layer.className = 'mc-modal-layer';
      /* r10 overlay contract: an info dialog closes from its scrim; a decision (confirm) dialog does
         not: the scrim only draws attention back to the dialog, the answer must be deliberate */
      layer.innerHTML = '<div class="mc-modal-layer__scrim"' + (kind === 'info' ? ' data-modal-cancel' : ' data-modal-scrim') + '></div>' +
        '<div class="mc-modal' + (o.tone ? ' mc-modal--' + o.tone : '') + (kind === 'info' ? ' mc-modal--info' : '') + '" role="' + (kind === 'confirm' ? 'alertdialog' : 'dialog') + '" aria-modal="true" aria-labelledby="' + id + '-t"' + (o.message ? ' aria-describedby="' + id + '-d"' : '') + '>' +
          (kind === 'info' ? '<button type="button" class="mc-modal__close" data-modal-cancel aria-label="' + T('Tutup', 'Close') + '">' + icon('x', 'mc-icon--20') + '</button>' : '') +
          '<h2 class="mc-modal__title" id="' + id + '-t">' + esc(o.title) + '</h2>' +
          (o.message ? '<p class="mc-modal__desc" id="' + id + '-d">' + esc(o.message) + '</p>' : '') +
          (o.html || '') +
          (kind === 'confirm' ? '<div class="mc-modal__actions">' +
            '<button type="button" class="mc-btn mc-btn--outline mc-btn--md mc-modal__cancel" data-modal-cancel>' + esc(o.cancel || T('Batal', 'Cancel')) + '</button>' +
            '<button type="button" class="mc-btn mc-btn--md ' + (o.tone === 'danger' ? 'mc-btn--danger' : 'mc-btn--primary') + ' mc-modal__ok" data-modal-ok>' + esc(o.confirm || T('Lanjutkan', 'Continue')) + '</button></div>' : '') +
        '</div>';
      var box = layer.querySelector('.mc-modal'), scrim = layer.querySelector('.mc-modal-layer__scrim');
      var inert = [];
      Array.prototype.forEach.call(doc.body.children, function (el) {
        if (el.id === 'mc-icon-sprite' || el.tagName === 'SCRIPT' || el.inert || el.classList.contains('mc-toasts')) return;
        el.inert = true; inert.push(el);
      });
      doc.body.appendChild(layer);
      doc.documentElement.classList.add('mc-modal-open');
      var reduce = mqReduce.matches;
      scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduce ? dur('--mc-dur-reduced', 150) : dur('--mc-dur-base', 240), easing: 'linear' });
      box.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(6px) scale(.98)' }, { opacity: 1, transform: 'none' }],
        { duration: reduce ? dur('--mc-dur-reduced', 150) : dur('--mc-dur-state', 200), easing: reduce ? 'linear' : curve('--mc-ease-enter', 'ease-out') });
      var first = box.querySelector(kind === 'confirm' ? '.mc-modal__cancel' : '.mc-modal__close');
      if (first) first.focus({ preventScroll: true });
      var done = false;
      function finish(result, quick) {
        if (done) return;
        done = true;
        active = null;
        inert.forEach(function (el) { el.inert = false; });
        doc.documentElement.classList.remove('mc-modal-open');
        var a = layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: quick || mqReduce.matches ? dur('--mc-dur-reduced', 150) : dur('--mc-dur-fast', 160), easing: 'linear', fill: 'forwards' });
        a.onfinish = a.oncancel = function () { layer.remove(); };
        if (!result && o.returnFocus && doc.contains(o.returnFocus)) o.returnFocus.focus({ preventScroll: true });
        resolve(!!result);
      }
      active = { finish: finish, layer: layer };
      layer.addEventListener('click', function (e) {
        if (e.target.closest('[data-modal-ok]')) finish(true);
        else if (e.target.closest('[data-modal-cancel]')) finish(false);
        else if (e.target.closest('[data-modal-scrim]')) {
          if (!mqReduce.matches) box.animate([{ transform: 'none' }, { transform: 'scale(1.012)' }, { transform: 'none' }], { duration: 220, easing: 'ease-out' });
          var safe = box.querySelector('.mc-modal__cancel'); if (safe) safe.focus({ preventScroll: true });
        }
      });
      layer.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); return; }
        if (e.key !== 'Tab') return;
        var f = Array.prototype.filter.call(box.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]'), visible);   /* r10: fields inside a dialog (MCRisk reason) are in the trap */
        if (!f.length) return;
        var i = f.indexOf(doc.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      });
    });
  }
  window.MCDialog = {
    open: dialog,
    confirm: function (o) { o = o || {}; o.kind = 'confirm'; return dialog(o); },
    close: function () { if (active) active.finish(false); },
    get isOpen() { return !!active; }
  };
  window.MCConfirm = window.MCDialog.confirm;

  /* ---- 2. Logout -------------------------------------------------------------------------- */
  function logout(from) {
    var lo = cfg.account.logout || {};
    if (lo.enabled === false) return Promise.resolve(false);
    var ask = lo.confirm === false ? Promise.resolve(true) : dialog({
      kind: 'confirm', tone: 'danger',
      title: T('Keluar dari akun?', 'Sign out of your account?'),
      message: T('Sesi aktif Anda akan diakhiri. Simpan dulu pekerjaan yang belum disimpan.',
        'Your active session will end. Save any unsaved work first.'),
      confirm: T('Keluar', 'Sign out'), cancel: T('Batal', 'Cancel'), returnFocus: from
    });
    return ask.then(function (ok) {
      if (!ok) return false;
      var go = doc.dispatchEvent(new CustomEvent('mc:logout', { cancelable: true, detail: { redirect: lo.redirect || null } }));
      doc.documentElement.setAttribute('data-session', 'ended');
      if (go && lo.redirect) {                                     /* the sign-in page is a project value */
        /* r13 fix round 2: over HTTP the sign-out is the router's document load (full), so it wins over an in-place
           navigation still in flight (nothing is swapped in behind the sign-out) and follows a swap in progress */
        var Rt = window.MCRouter;
        if (Rt && Rt.active) Rt.navigate(lo.redirect, { full: true, source: 'account' });
        else window.location.href = lo.redirect;
      }
      return true;
    });
  }

  /* ---- 3. Keyboard shortcuts (reference; the command palette is the action surface) ------- */
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  function shortcutList() {
    var rows = [
      [[mac ? '⌘' : 'Ctrl', 'K'], T('Cari dan jalankan perintah', 'Search and run a command')],
      [['Esc'], T('Tutup menu, panel, atau dialog', 'Close a menu, panel or dialog')],
      [['?'], T('Tampilkan pintasan keyboard', 'Show keyboard shortcuts')]
    ];
    /* r12 (KB-03): the sidebar collapse, where a desktop sidebar exists */
    if (doc.querySelector('[data-shell-toggle]') && window.matchMedia('(min-width: 1025px)').matches) rows.splice(1, 0, [[mac ? '⌘' : 'Ctrl', 'B'], T('Ciutkan atau perluas sidebar', 'Collapse or expand the sidebar')]);
    if (doc.body.dataset.page === 'purchase') rows.splice(1, 0, [['Alt', 'N'], T('Tambah baris barang', 'Add an item row')]);
    return '<ul class="mc-shortcuts" role="list">' + rows.map(function (r) {
      return '<li class="mc-shortcuts__row"><span class="mc-shortcuts__label">' + esc(r[1]) + '</span><span class="mc-shortcuts__keys">' +
        r[0].map(function (k) { return '<kbd class="mc-kbd mc-kbd--sans">' + esc(k) + '</kbd>'; }).join('') + '</span></li>';
    }).join('') + '</ul>';
  }
  function shortcuts(from) {
    return dialog({ kind: 'info', title: T('Pintasan keyboard', 'Keyboard shortcuts'), html: shortcutList(), returnFocus: from || doc.activeElement });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key !== '?' || e.ctrlKey || e.metaKey || e.altKey || active || !P.feature('shortcuts')) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (window.MCShell && window.MCShell.locked && window.MCShell.locked()) return;
    if (!mqFine.matches) return;
    e.preventDefault();
    shortcuts(t);
  });

  /* ---- 4. Account menu ---------------------------------------------------------------------- */
  function entries(context) {
    return P.accountMenu().filter(function (m) { return m.separator || m.pointer !== 'fine' || (mqFine.matches && context !== 'phone'); })
      .filter(function (m, i, all) {                       /* re-trim separators after the pointer filter */
        if (!m.separator) return true;
        var prev = all[i - 1], next = all[i + 1];
        return prev && next && !prev.separator && !next.separator;
      });
  }
  function itemsHTML(list, cls, role) {
    return list.map(function (m) {
      if (m.separator) return '<li class="' + cls + '__sep" role="separator"></li>';
      var tag = m.href ? 'a' : 'button';
      return '<li role="none"><' + tag + ' class="' + cls + '__item' + (m.tone === 'danger' ? ' is-danger' : '') + '"' + (role ? ' role="' + role + '" tabindex="-1"' : '') +
        (m.href ? ' href="' + esc(m.href) + '"' : ' type="button"') + ' data-account-item="' + esc(m.id) + '">' + icon(m.icon || 'dot') +
        '<span>' + esc(P.t(m.label)) + '</span></' + tag + '></li>';
    }).join('');
  }
  function activate(id, from) {
    var m = P.accountMenu().filter(function (x) { return x.id === id; })[0];
    if (!m) return;
    if (m.action === 'logout') { logout(from); return; }
    if (m.action === 'shortcuts') { shortcuts(from); return; }
    if (m.action === 'guide') { if (window.MCGuide) window.MCGuide.openPanel(from); return; }   /* r13 Phase 6 */
    /* r12: through the shell navigation (content exit; the cancelable mc:navigate lets a form page's
       unsaved-changes guard ask first) */
    if (m.href) { if (window.MCShell && window.MCShell.navigate) window.MCShell.navigate(m.href); else window.location.href = m.href; return; }
    if (from && doc.contains(from)) from.focus({ preventScroll: true });   /* lab placeholder: no destination yet */
  }

  var menu = null, menuTrigger = null;
  function menuItems() { return menu ? Array.prototype.slice.call(menu.querySelectorAll('[role="menuitem"]')) : []; }
  function focusItem(i) { var list = menuItems(); if (!list.length) return; list[(i + list.length) % list.length].focus(); }
  function place(trigger) {
    var r = trigger.getBoundingClientRect(), w, h, rail = r.width < 120, left, top;
    if (!rail) menu.style.minWidth = Math.round(Math.max(r.width, 224)) + 'px';
    w = menu.offsetWidth; h = menu.offsetHeight;
    if (rail) { left = r.right + 10; top = r.bottom - h; }
    else { left = r.left; top = r.top - h - 8; }
    left = Math.min(Math.max(12, left), innerWidth - w - 12);
    top = Math.min(Math.max(12, top), innerHeight - h - 12);
    menu.style.left = Math.round(left) + 'px';
    menu.style.top = Math.round(top) + 'px';
    menu.setAttribute('data-placement', rail ? 'right' : 'top');
  }
  function openMenu(trigger, focusLast) {
    if (menu) closeMenu(false);
    menuTrigger = trigger;
    menu = doc.createElement('div');
    menu.className = 'mc-account-menu';
    menu.id = 'mc-account-menu';
    var u = cfg.user || {};
    menu.innerHTML = (u.email ? '<p class="mc-account-menu__head">' + esc(u.email) + '</p>' : '') +
      '<ul class="mc-account-menu__list" role="menu" aria-label="' + T('Menu akun', 'Account menu') + '">' + itemsHTML(entries('menu'), 'mc-account-menu', 'menuitem') + '</ul>';
    doc.body.appendChild(menu);
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-controls', menu.id);
    place(trigger);
    var reduce = mqReduce.matches, rail = menu.getAttribute('data-placement') === 'right';
    menu.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: rail ? 'translateX(-4px)' : 'translateY(4px)' }, { opacity: 1, transform: 'none' }],
      { duration: reduce ? dur('--mc-dur-reduced', 150) : dur('--mc-dur-fast', 160), easing: reduce ? 'linear' : curve('--mc-ease-enter', 'ease-out') });
    focusItem(focusLast ? -1 : 0);
    menu.addEventListener('keydown', onMenuKey);
    menu.addEventListener('click', onMenuClick);
    doc.addEventListener('pointerdown', onOutside, true);
    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
  }
  function closeMenu(returnFocus) {
    if (!menu) return;
    var m = menu, t = menuTrigger;
    menu = null;
    menuTrigger = null;
    doc.removeEventListener('pointerdown', onOutside, true);
    window.removeEventListener('resize', onReflow);
    window.removeEventListener('scroll', onReflow, true);
    if (t) t.setAttribute('aria-expanded', 'false');
    var a = m.animate([{ opacity: 1 }, { opacity: 0 }], { duration: mqReduce.matches ? dur('--mc-dur-reduced', 150) : 120, easing: 'linear', fill: 'forwards' });
    a.onfinish = a.oncancel = function () { m.remove(); };
    if (returnFocus && t) t.focus({ preventScroll: true });
  }
  function onOutside(e) { if (menu && !menu.contains(e.target) && !(menuTrigger && menuTrigger.contains(e.target))) closeMenu(false); }
  function onReflow(e) { if (e && e.type === 'scroll' && menu && menu.contains(e.target)) return; closeMenu(false); }
  function onMenuKey(e) {
    var list = menuItems(), i = list.indexOf(doc.activeElement);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusItem(i + 1); break;
      case 'ArrowUp': e.preventDefault(); focusItem(i - 1); break;
      case 'Home': e.preventDefault(); focusItem(0); break;
      case 'End': e.preventDefault(); focusItem(-1); break;
      case 'Escape': e.preventDefault(); e.stopPropagation(); closeMenu(true); break;
      case 'Tab': closeMenu(false); break;
    }
  }
  function onMenuClick(e) {
    var it = e.target.closest('[data-account-item]');
    if (!it) return;
    e.preventDefault();
    var id = it.getAttribute('data-account-item'), t = menuTrigger;
    closeMenu(false);
    activate(id, t);
  }
  Array.prototype.forEach.call(doc.querySelectorAll('[data-account-trigger]'), function (t) {
    t.addEventListener('click', function () { if (menu && menuTrigger === t) closeMenu(true); else openMenu(t, false); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); openMenu(t, e.key === 'ArrowUp'); }
    });
  });

  window.MCAccount = {
    open: function (t) { var trig = t || Array.prototype.filter.call(doc.querySelectorAll('[data-account-trigger]'), visible)[0]; if (trig) openMenu(trig, false); },
    close: function () { closeMenu(true); },
    get isOpen() { return !!menu; },
    entries: entries,
    itemsHTML: itemsHTML,
    activate: activate,
    logout: logout,
    shortcuts: shortcuts
  };
})();


/* ===== Persistent shell: page lifecycle (r13, D-52) ===== */
/* =============================================================================
   The PER-PAGE part of the sections above, for a page the router (assets/js/router.js) swaps in place
   over HTTP. A direct load (file:// or HTTP) never calls these: every section boots its page as before.
     MCShell.pageDispose(main)  before the swap: long-text observation, upload zones and open popups of
                                the page on screen are released (MCScope.dispose drops its listeners)
     MCShell.pageInit(main)     after the new page's module scripts ran: current navigation entry (sidebar
                                group + mark, bottom bar, drawer), greeting, feature filter, entrance
                                indexing, selects, uploads, phone disclosures, split actions, date-range
                                slots (top bar + content), the phone Back link, the current entry in view
     MCShell.pageReady(main)    after the emulated DOMContentLoaded: the long-text scan (as on load)
   Then the page scope opens (MCScope.begin): code that runs from now on belongs to the page unless it
   runs inside MCScope.shell().
   ============================================================================= */
(function () {
  'use strict';
  var S = window.MCShell, doc = document;
  if (S) {
    var dur = function () {
      var v = getComputedStyle(doc.documentElement).getPropertyValue('--mc-dur-base').trim(), n = parseFloat(v);
      return isNaN(n) ? 240 : (/ms$/.test(v) ? n : n * 1000);
    };
    S.pageDispose = function (main) {
      main = main || doc.querySelector('[data-region="content"]');
      if (window.MCLongText && window.MCLongText.release) window.MCLongText.release(main);
      if (window.MCUpload && window.MCUpload.release) window.MCUpload.release(main);
      if (window.MCSelect) window.MCSelect.close();
      if (window.MCSplit) window.MCSplit.close();
      if (window.MCDateRange && window.MCDateRange.isOpen) window.MCDateRange.close();
    };
    S.pageInit = function (main) {
      main = main || doc.querySelector('[data-region="content"]');
      var NT = window.MCNavTree, P = window.MCProject;
      var r = NT && NT.refresh ? NT.refresh() : null;
      if (window.MCGreeting) window.MCGreeting.render();
      /* r13 fix: the feature filter covers everything the swap brought in — <main> AND the top-bar slot (02's
         period control) — exactly as the boot filter (section 4) does for a direct load */
      if (P && P.feature && !P.feature('dateFilter')) Array.prototype.forEach.call(doc.querySelectorAll('[data-daterange]'), function (el) { el.remove(); });
      S.markFixed();
      S.indexEnter(main);
      if (window.MCSelect) window.MCSelect.enhance(main);
      if (window.MCUpload && window.MCUpload.scan) window.MCUpload.scan(main);
      if (window.MCDisclosure && window.MCDisclosure.scan) window.MCDisclosure.scan(main);
      if (window.MCSplit && window.MCSplit.scan) window.MCSplit.scan(main);
      if (S.dateRangeScan) S.dateRangeScan();
      if (S.syncMobileBack) S.syncMobileBack();
      if (window.MCNav && window.MCNav.refresh) window.MCNav.refresh();
      S.syncRail();
      S.revealCurrent(r && r.opened ? dur() : 0);
    };
    S.pageReady = function (main) {
      main = main || doc.querySelector('[data-region="content"]');
      if (window.MCLongText) window.MCLongText.scan(main);
    };
  }
  if (window.MCScope && window.MCScope.begin) window.MCScope.begin({ first: true });
})();
