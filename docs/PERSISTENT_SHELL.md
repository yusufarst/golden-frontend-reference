# Persistent shell (r13, D-52)

How the prototype changes pages without reloading the whole interface: the sidebar, its open groups, the account
block, the top-bar search and toasts stay mounted; only the page changes, with the Golden content exit and entrance.
Contract: `scratch/r13/R13_SPEC.md` §1 and `scratch/r13/R13_DISCOVERY.md` §5 (Option A). Runtime overview:
`docs/APP_ARCHITECTURE.md`; navigation model: `docs/NAVIGATION_ARCHITECTURE.md`; motion: `docs/MOTION_SYSTEM.md`.

## 1. How to open the prototype

| Way | What you get |
|---|---|
| **`serve.cmd`** (double-click in the lab root) | A read-only local server on **http://127.0.0.1:8137/** in its own window ("MultipleCorp Golden Reference - server lokal") and the Beranda opens in the default browser. Pages swap in place (persistent shell). |
| `python tools/serve.py [--port 8140] [--open]` | The same server from a terminal; `MC_PORT=8140` also changes the port (`--port` wins over `MC_PORT`). |
| A page opened from disk (`file://…/pages/10-proyek.html`) | Every navigation is a full document load (the r12 behaviour, D-04). Everything works; the sidebar simply reloads. The root `index.html` and `review/index.html` then show one quiet line: "Navigasi tanpa muat ulang aktif saat dibuka lewat serve.cmd". |

`serve.cmd` looks for Python in `%LOCALAPPDATA%\Python\bin\python.exe`, then `py -3`, then `python`, starts
`tools\serve.py --open --window` in a window of its own and ends (r13 fix pass 2). Port handling (`tools/serve.py`):
- the port is `--port`, else `MC_PORT`, else 8137, and must be a whole number 1–65535; anything else (text, spaces
  only, 0, negative, out of range) stops with a message naming the value and where it came from — never a traceback,
  never a silent fallback to another port. Only an empty `MC_PORT` counts as not set (`set MC_PORT=` removes it in
  cmd anyway); a value of spaces only is refused (r13 fix round 2). `serve.cmd` never splices `MC_PORT` into a
  command line; `serve.py` reads it;
- port taken by another program: the message names the port, how to find the program (`netstat -ano | findstr :8137`)
  and how to choose another port; a port Windows reserves or forbids says so and how to list the reserved ranges.
  (A program bound only to the wildcard address `0.0.0.0:<port>` does not block `127.0.0.1:<port>` on Windows: the
  lab server then starts without that message and answers at the 127.0.0.1 address it prints — r13 fix round 2 note);
- the lab server already runs there (double-clicked twice): it says so and opens the browser at the **running**
  server; that window closes by itself after 4 s;
- IPv6: the server listens on 127.0.0.1 only and prints / opens that address. When another program holds
  `[::1]:<port>`, `http://localhost:<port>/` may reach that program instead, so the server prints a note naming the
  127.0.0.1 address;
- stop: Ctrl+C in the server window (or close it): "Server dihentikan.", exit 0, the window closes — no
  "Terminate batch job (Y/N)?" (the batch has already ended) and no wait for an open browser connection. After a
  failure the window waits for Enter so the message can be read.

The server (`tools/serve.py`, stdlib only) binds **127.0.0.1** only, refuses non-loopback `Host` headers, answers
GET / HEAD only (other methods 405), never lists directories, sends `Cache-Control: no-cache` (an edited file shows on
the next navigation), serves correct types (`.js .css .svg .webp .json .woff2 …`), answers an unknown
`pages/*.html` with the app's own `00-tidak-ditemukan.html` and status 404, and prints no traceback when a browser
drops a connection.

Storage note: `http://127.0.0.1:8137` and `file://` are different browser origins, so the session records, company
view, period and sidebar collapse state of one mode do not appear in the other.

## 2. What persists and what is swapped

| Persists (shell, mounted once) | Swapped per page |
|---|---|
| Sidebar tree (groups keep their open state; the group of the new current entry opens), icon rail, drawer, top bar search, account block and menu, bottom bar, toasts (a toast survives the navigation after it), command palette, custom select / menu / sheet / dialog engines, the minute clock, the fixture, `MCApp` | `<main data-region="content">` children and attributes, `title[data-page]` + `document.title`, meta description, module CSS link(s), module script(s), every body `data-*` attribute (`data-page` / `data-route` / `data-nav-section` / `data-nav-parent` …; the old page's extras removed), the top-bar `.shell-topbar__actions` slot (02 period filter; with `features.dateFilter = false` its period control is removed exactly as on a direct load) |

The company working filter stays page content, never part of the shell [CANONICAL D-IA-02]; the shell carries no
badges or counts.

## 3. Navigation lifecycle (`assets/js/router.js`)

`MCRouter.navigate(href, { replace, force, source, trigger, remount, full })` → `'spa' | 'full' | 'cancelled' | 'noop' | 'queued'`
(`full: true` = always a document load, e.g. the sign-out). `MCRouter.cancel()` = the user chose the page on screen: an
in-place navigation still leaving it is cancelled and the page comes back (`true` when one was cancelled).

1. **Eligibility** — same origin and directory, a route registered in `MCRoutes` with `shell !== false`, not 04
   (motion study), no `project` / `brand` / `role` parameter (preview and auth boundaries). The scheme is judged on
   the URL parser's result, never on the raw attribute (the HTML parser has already decoded entities, and the URL
   parser strips whitespace / control characters and lowercases the scheme, so `href=" JaVa&#9;Script:…"` is
   `javascript:`): `navigate()` loads **http(s) only**
   (on `file://`, `file:` too) and answers `'cancelled'` for every other scheme (`javascript:`, `data:`,
   `vbscript:`, `blob:`, `about:`, `ftp:` …); a link click routes http(s) links only and leaves `mailto:` / `tel:` /
   others to the browser. Links with `target`, `download` or a modifier key, `#…` links, SVG links and anything inside
   `[data-router="off"]` are left to the browser. Any other http(s) target is a normal full load. **Every document load
   wins over an in-place navigation still in flight** (r13 fix pass 2; exact since r13 fix round 2): one the router
   starts (an ineligible target, `navigate(href, { full: true })` — the sign-out uses it), a link inside
   `[data-router="off"]` (the click handler), and one it does not start — code assigning `location`, a form,
   `location.reload()`, a Back step to another document (reported by the Navigation API's `navigate` event as it
   starts) and the address bar / reload button / engines without the Navigation API (`beforeunload`). The in-flight
   one is aborted: it resolves `'cancelled'`, swaps nothing in behind the new document (no history entry, `mc:prev`
   unchanged) and never falls back to a full load of its own target. During the swap (commit, the point of no return)
   a load that can still be stopped — a link click, code assigning `location` — is held and follows the swap (latest
   wins); one that cannot (a traversal, the address bar) goes ahead. A load that does not replace the document (it
   becomes a download or a 204 answer, or the browser's leave prompt is answered "stay"): the page, still leaving,
   comes back as it was 4 s later. Downloads, `#…`, same-document entries and `mailto:` / `tel:` never count.
   Same path + search = no-op (no reload) — the current sidebar entry, a link marked `aria-current`, `navigate()` to
   the page's own address; while a navigation elsewhere is still **leaving** the page, choosing it means "stay here"
   (r13 fix round 2): that navigation is cancelled and the page comes back at once (sidebar, bottom bar, phone drawer —
   its marks return —, palette, links; `MCRouter.cancel()`). Not while a Back / Forward step is in flight (its address
   is already the target: the step completes) and not during the swap (the address is the next page's: the old page
   is then a normal navigation, queued). Exception (r13 fix): a link to the page on screen that starts it again —
   inside `<main>` and not `aria-current`, or marked `data-router-remount` (03 "Buat pembelian lain", 65 "Catat
   pembayaran lain"), `navigate(href, { remount: true })`, or a confirmed "Tinggalkan" towards it — mounts the page
   afresh in place of its own entry (no new history entry, `mc:prev` kept), as a load of the same address does on
   `file://`. No prefetch.
2. **Unsaved changes** — a cancelable `mc:navigate { href, source }` for every in-place navigation (links, menu items,
   list rows, palette, account menu, page code). `MCPage.dirtyGuard` answers it: "Tinggalkan halaman ini?" →
   "Kembali" keeps everything, "Tinggalkan" navigates with `force`. Back / Forward asks too (r13 fix): every entry
   of the document carries its position (`history.state.mcIdx`, kept by the router's history wrapper), so the step
   is first undone exactly (`history.go(-delta)`: address, entry and Forward stack return; "Kembali" leaves it so),
   and "Tinggalkan" replays it (`history.go(delta)`): the target is mounted from its own entry with its scroll, the
   address, `MCRoutes.current()`, `MCPage.param()` and the current entry describe it, and no entry is added. Only the
   popstate handler navigates "as a pop" (no history write); any other caller passing `source: 'pop'` is treated as a
   replacing guard navigation. (Position unknown — never seen in practice — falls back to re-pushing the page's own
   entry and replacing it on "Tinggalkan".) An open decision dialog undoes a Back step the same way and stays.
   While dirty, one shared `beforeunload` arms the browser's own leave prompt (reload, close, typed address)
   [CANONICAL ADMIN_FLOW §6].
3. **Overlays** close first (menus, select, split, period, account menu, palette; the sheet and the drawer through
   their own history entries). An open decision dialog cancels the navigation.
4. **Race** — latest wins: a newer navigation aborts one still fetching; one that arrives during the swap is queued
   (a full load included, step 1); choosing the page on screen while another one is still leaving cancels it (step 1).
5. **Leave ∥ fetch** — the scroll of the leaving entry is saved in `history.state`; the content exit (240 ms; pill
   slide 400 ms) and `fetch` (8 s timeout, `cache: no-cache`) run in parallel. No artificial delay. Reduced motion =
   instant (R13_SPEC §1, r13 fix): no exit and no wait — the page stays fully visible but inert (`.is-swapping`,
   `aria-busy`) until the next page and its module CSS are ready (timeline under **Motion** below). From this point
   `MCScope.alive(gen)` of the leaving page is false.
6. **Validate** — `DOMParser` (inert); the page needs `<main data-region="content">`, `title[data-page]`, the shell
   and the same shared runtime this document already has; only whitelisted module CSS / JS URLs
   (`assets/css/modules/*.css`, `assets/js/modules/*.js`, never `domain.js`) are taken. Failure → full load.
   **Sanitize** (r13 fix pass 2, defense in depth; `<main>` itself and the top-bar slot included, and the contents of
   every `<template>`, which page code clones later): dropped elements — `<script>` (HTML or SVG) other than JSON
   data islands (`type="application/json"`), `base`, `meta`, `link`, `iframe`, `frame`, `frameset`, `object`,
   `embed`, `applet`, `portal` and the SVG animation elements `set`, `animate`, `animateMotion`, `animateTransform`,
   `discard` (they can rewrite an href); dropped attributes — every `on*` handler, `srcdoc`, and a URL attribute
   (`href` / `xlink:href`, `src`, `action`, `formaction`, `data`, `poster`, `background`, `cite`, `ping`, `codebase`,
   `longdesc`, `lowsrc`, `dynsrc`, `manifest`, `archive`, `classid`, `icon`, `profile`) unless the URL parser
   resolves it to http(s), `mailto:` or `tel:`. So nothing of a fetched page runs code, loads a frame, redirects the
   document or rebases its URLs — only the whitelisted module scripts execute.
7. **Commit** (point of no return) — `MCShell.pageDispose(main)`, `MCScope.dispose()` (phase `'swap'`: see §4),
   `html[data-container]` / `[data-fixture-period]` removed; `history.pushState` (never form data in history) so
   `location`, `MCRoutes.current()` and `MCPage.param()` already describe the target.
8. **Head / body / main / top bar** — title "{screen} · MultipleCorp", description; new module CSS inserted before
   `motion.css` and awaited (≤ 1.5 s) before the old one goes; body `data-*` attributes copied exactly (CSS depends on
   them); main keeps its element (skip link, focus target) and gets the fetched (sanitized) attributes and children;
   the top-bar slot is copied or removed.
9. **Mount** — the page scope opens (registrations the page that left made during the swap are dropped first, then
   `gen++`, phase `'page'`) → module scripts appended in document order → `MCShell.pageInit(main)` (current entry:
   sidebar group + mark, bottom bar, drawer; greeting; the `features` filter over everything the swap brought in —
   main and the top-bar slot; entrance indexing; selects; uploads; phone disclosures; split actions; period slots;
   phone Back link; current entry brought into the list's view only when it is out of view) → emulated
   `DOMContentLoaded` (`MCBrand.apply`, then the queued `MCScope.ready` / DOMContentLoaded callbacks) →
   `MCShell.pageReady(main)` (long-text scan).
10. **Reveal, focus, announce** — the content appears and the Golden entrance stagger replays on the real content (no
    fade of the region itself; the region is hidden at once while the new page renders, never half-faded). Focus
    (r13 fix pass 2, parity with a direct load): focus the page placed itself while mounting (a field it focuses on
    start, e.g. 07 Cari's search field on desktop; a dialog it opens) stays; else the first visible, enabled
    `[autofocus]` control of the page takes it (as the browser does on a load without a `#target`); else the page
    title (`[data-page-title]`, else the first h1, else main), all with `preventScroll`. The screen reader reads a
    focused heading, so the polite announcer (`[data-route-announcer]`) speaks the new title only when focus did not
    land on a heading (DISC §5.3 step 16, r13 fix). A new page starts at the top (or its `#hash` target), Back /
    Forward restores the saved scroll. `sessionStorage['mc:prev']` and `mc:routechange { href, route, prev, source }`
    name as `prev` the page that **was on screen** — also for Back / Forward (r13 fix pass 2: the browser has already
    moved the address to the target when popstate runs), exactly what `pagehide` writes on a full load; a page
    started again keeps `mc:prev`.
11. **Failure** — before commit: `location.assign(href)` (e.g. a 404 answer). After commit (a module script that
    throws, an exception in the mount): `sessionStorage['mc:router-fallback'] = href` (loop guard, read back as
    `window.__mcRouterFallback`) and `location.reload()` of the target. Never a half-mounted page.

Motion: the shell and the indicator never animate; the content exits (opacity + 3 px blur, 240 ms), the pill slides
between two visible rows of the same level (400 ms), the new content enters with the restrained stagger.
**Reduced motion, exactly** (measured: `scratch/r13/phase3fix2/reduced_timing.txt`): no exit animation and no
artificial wait. The old page stays fully visible — inert to the pointer and `aria-busy` — while the next page and
its module CSS load. At the swap the region is hidden in the same frame the old children leave and stays hidden only
while the page's module script(s) load and run: 1–2 painted frames, ≈ 60–90 ms from the last frame of the old page to
the first frame of the new one on the lab laptop (30 → 32, 30 → 34, 64 → 61). Then the region appears at full opacity
in one frame (its opacity is only ever 1 or 0, never partly faded) and its children play the reduced entrance of a
direct load: a 150 ms linear opacity fade, no stagger, blur or translate. Deviation recorded:
`docs/MOTION_SYSTEM.md` §5 keeps a 150 ms crossfade for every state change; for the in-place swap R13_SPEC §1
("reduced motion = instant") wins. The `file://` page exit keeps the Golden 150 ms crossfade.

## 4. Writing page modules for the persistent shell (`MCScope` rules)

A page module is one IIFE in `assets/js/modules/<module>.js` that reads `document.body.dataset.route` (or `data-page`)
and renders its route. Over HTTP the router executes it again for every mount, so each mount gets fresh closures. Rules:

- **Listeners on `window`, `document` and media queries are page-scoped automatically.** While the router is active,
  `MCScope` records every `addEventListener` (and `MediaQueryList.addListener`) made by page code — a module script,
  or anything that runs after the shell booted outside `MCScope.shell()` — with its exact capture flag and removes it
  when the page is swapped out. So are `MutationObserver` / `ResizeObserver` / `IntersectionObserver` instances and
  `setInterval` timers created by page code. Element listeners need nothing: the elements leave with the page.
  The swap itself is covered (r13 fix pass 2): between the dispose of one page and the mount of the next (phase
  `'swap'`, up to the 1.5 s module-CSS wait) code that runs is the page that left — a late timer or promise
  continuation — so whatever it registers is page-owned and dropped (with its `onDispose` callbacks and the shell
  hooks) right before the next page's module scripts run; nothing leaks into the shell
  (`MCScope.stats().gapDropped` counts them). The one exception is the user acting on the shell meanwhile: a
  registration made while a trusted event on an element outside `<main>` is handled (opening the account menu, a
  shell select) stays shell-owned.
- **`MCAction.on` handlers and `MCPalette.register` providers of a page are dropped** on swap (a shell handler of the
  same name comes back); `MCPage.dirtyGuard`, the `?state=` list demo counter and `html[data-container]` are reset;
  the action groups the page rendered with `MCActions.render` are forgotten (r13 fix pass 2: no detached host is kept
  for the breakpoint re-render; `MCActions.count()`).
- **DOMContentLoaded**: use `MCScope.ready(fn)` (direct load: at DOMContentLoaded; router mount: after the module
  scripts and `MCShell.pageInit`). A plain `document.addEventListener('DOMContentLoaded', fn)` from page code is
  queued the same way, so existing modules keep working. `MCPage.ready(fn)` runs at once when the DOM is parsed.
- **Cleanup that is not a listener** (a body attribute, a global you set): `MCScope.onDispose(fn)`.
- **Timeouts and promises are not tracked** (toasts and `MCRisk` need theirs). A timeout or promise continuation
  that writes, opens a dialog or navigates after a delay checks it is still current: `var g = MCScope.gen;
  setTimeout(function () { if (MCScope.active && !MCScope.alive(g)) return; … })`. `alive(g)` is false once the page
  is swapped out AND already while it is leaving (the user chose another destination), so a stale continuation never
  navigates over the user's own navigation. `MCRisk.run` does this for every caller: when the page that asked is
  gone or leaving, the command's session write and success toast stand, but the returned promise never settles (no
  follow-up navigation, re-render or focus on the next page). Explicit guards: 03 save → detail (600 ms), 11
  "Buat Invoice" (`MCApp.startInvoice`), 51 "Revisi", 13 `?buat=1` (120 ms), the system page's "Muat Ulang".
- **Navigate with `MCPage.go(href, { replace })`** (or `MCShell.navigate(href)` for a shell-style exit), never
  `location.href = …`: over HTTP it swaps in place and asks the unsaved-changes question; on `file://` it is the same
  full load as before. Links are plain `<a href>` — the router picks them up (no attribute needed). A "start again"
  link to the page's own address ("… lain") gets `data-router-remount` (documentation; a same-address link inside
  `<main>` without `aria-current` remounts anyway); a selected-item link that must stay a no-op carries
  `aria-current` or is handled by the page (`preventDefault`).
- **Shell code that must persist** across pages and registers listeners lazily (after boot) wraps that setup in
  `MCScope.shell(fn)` (the shared period filter does this). Page resources created by shell code on a direct load
  can be attributed with `MCScope.asPage(fn)` (the upload zones do this).
- **Never** write `window.*` globals other than an optional page API (`window.MCDashboard`, `window.MCPurchase`),
  never keep state in module-level variables outside the IIFE, never inject `<script>` elements yourself.

Adding a route: register it in `ROUTES` (`project-config.js`), create the page with
`python tools/shell_sync.py --new <route> --module <name>` (the skeleton already loads `router.js` first), put its
module CSS / JS under `assets/css/modules/` / `assets/js/modules/` and run `python tools/shell_sync.py --check`,
`python tools/route_check.py` and `python tools/router_check.py` (route parity covers the new page automatically).
A route that must always be a full load sets `spa: false` in `ROUTES`; a link that must leave the shell sits inside
`[data-router="off"]` (a document load: it wins over an in-place navigation in flight, step 1); code that must leave
the shell calls `MCRouter.navigate(href, { full: true })` (on `file://` the same plain load; a plain `location.href = …`
is caught too, through the Navigation API / `beforeunload`, but the call also holds the load during a swap in every engine).

## 5. The `file://` fallback and its limits

- `file://`: `fetch()` of files is refused and `pushState` to another path is forbidden there, so the router stays off
  (also with `?router=off` or `MC_PROJECT_PATCH.router === false`); `MCScope` is passive (no tracking). Every test and
  evidence tool still opens pages from disk and sees the r12 behaviour; `tools/router_check.py` covers HTTP.
- Full loads remain for: sign-in / set-password (01 / 05), logout, the motion study (04), `?role=` / `?project=` /
  `?brand=` previews, unknown pages, downloads, and every failure path.
- The router is a lab demonstration of the behaviour, not production code: production is Laravel + Inertia + React,
  where a persistent layout gives the same result [CANONICAL ARCHITECTURE §1] [BACKEND].
- Opening a page never mutates data: navigation fetches pages with GET; module scripts only render.
- QA: `python tools/router_check.py` (one browser through the shared lock; it also runs `tools/serve_check.py`, the
  browserless `serve.py` / `serve.cmd` port and Ctrl+C checks), `MCScope.stats()`, `MCActions.count()`,
  `window.__mcRouterNavs`.

## 6. D-52 (merged into docs/DESIGN_DECISIONS.md in r13 Phase 9; kept here as the shell's own record)

**D-52 Persistent shell over HTTP; D-04 stays the `file://` fallback**
- **Decision**: served over HTTP (`serve.cmd` / `tools/serve.py`, 127.0.0.1:8137) the prototype navigates in place:
  `assets/js/router.js` fetches the target page, keeps the shell mounted, swaps `<main>` and the per-page head / body /
  top-bar bits, re-runs the page module in a tracked scope (`MCScope`) and updates address, title, current entry, focus,
  scroll and one polite announcement. The 02 Beranda and 03 Buat Pembelian logic moved from `interactions.js` into page
  modules (`modules/beranda.js`, `modules/pembelian-baru.js`) so they can be mounted again. Sidebar groups persist
  across navigations; the group of the new current entry opens. On `file://` (or any failure) every navigation is the
  r12 full document load (D-04).
- **Why**: Owner R13 requirement — clicking another sidebar entry must not reload the whole interface; the cause
  (multi-page full document loads) is fixed, not hidden behind fades.
- **Considered and rejected**: converting every module to `MCPages.define` (too wide for one round; possible later on
  top of this scope); hash routing or a build step (every address changes); cross-document view transitions (still a
  reload); Turbo / htmx / Swup (re-execute body scripts → double initialisation); an iframe content host (forbidden).
- **Recorded deviation**: DEV-5 (R13_SPEC §12): the persistent shell needs the local server; `file://` keeps full loads.
  Motion: under reduced motion the in-place swap is instant (R13_SPEC §1) instead of the Golden 150 ms crossfade of
  MOTION_SYSTEM §5 (the reduced entrance stays; `file://` keeps the crossfade).
- **Layer**: GOLDEN FIXED (`router.js`, `MCScope` contract, lifecycle APIs in `interactions.js` / `patterns.js`);
  PROJECT CONFIGURABLE (`ROUTES[...].spa`, `MC_PROJECT_PATCH.router`); production shell persistence is the client
  framework's job [BACKEND].
- **Related (same phase)**: R13_SPEC §2 — the Owner's Gudang lists Barang Masuk and Barang Keluar (D-51(2) superseded,
  "(r13)" note): order Stok · Barang Masuk · Barang Keluar · Reservasi · Stok Opname · Riwayat Stok, capability-filtered
  for every role; the 30 Stok header pair disappears because the navigation provides both (D-50).
