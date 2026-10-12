# AGENT START HERE — MULTIPLECORP Golden Reference (v1.0 Freeze Candidate)

Read this file first. It assumes you have never seen the conversations that produced this template.
Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL** (never call it Owner-approved until the
Owner says so). This lab is never integrated into `C:\Projects\MultipleCorp`.

---

## 1. What this template is
A static, clickable product prototype **and** a reusable application template. Plain HTML + CSS +
vanilla JS, opened from disk (`file://`), no build step, no framework, no backend. It contains:
- **Layer A — Golden Design System**: tokens, primitives, the app shell, page patterns, motion,
  accessibility rules (`assets/css/*`, `assets/js/icons.js`, `interactions.js`, `patterns.js`).
- **Layer B — Project configuration**: one file, `assets/js/project-config.js` (brand, locale, time,
  user/roles, routes, modules, navigation, account menu, date filter, features, brand tokens).
- **Layer C — Project fixture + implementation**: MULTIPLECORP demo data
  (`assets/js/fixtures/multiplecorp-data.js`), page modules (`assets/js/modules/*.js`,
  `assets/css/modules/*.css`) and the page files in `pages/`.
The default project is MULTIPLECORP (multi-company project operations: projects, purchasing, a shared
warehouse, deliveries, documents, finance, correction cases, reports, Owner review, settings).

## 2. What not to change casually (GOLDEN FIXED)
Visual language (Inter, ivory/white surfaces, dark hierarchy, restrained olive brand, radius family,
subtle borders/shadows), density units, the shell model (sidebar / rail / app bar + bottom nav +
drawer), account placement, text-first section headings, the overlay contract, the risk confirmation
policy, the long-text contract, live-status rules, the stepper geometry, motion tokens, 44 px touch
targets, accessibility semantics. Rationale for each: `docs/DESIGN_DECISIONS.md`. If you think a rule is
wrong, change it in the Golden Reference with a decision record — never per screen.

## 3. What is configurable (PROJECT CONFIGURABLE)
Everything in `project-config.js`: brand slots, name, logo/mark, `--brand-*` colours, locale, time
zone + greeting bands, user + roles (+ QA role fixtures), **routes** (`ROUTES`), **modules**
(`MODULES`: enabled, label, icon, route, roles, capability, bottomNav), the **navigation tree** (r12:
`navigation.sidebar` sections → level-1 entries → children), the bottom bar per role, account menu, logout,
date-filter presets/limits, feature flags. Full list and contract:
`docs/PORTABILITY_CONTRACT.md` and `template/TEMPLATE_MANIFEST.json`.

## 4. Files to inspect first
1. `template/TEMPLATE_MANIFEST.json` — the machine-readable map (layers, files, contracts).
2. `assets/js/project-config.js` — routes, modules, navigation, roles (the project's single file).
3. `docs/APP_ARCHITECTURE.md` — how the runtime fits together (load order, globals, data flow);
   `docs/NAVIGATION_ARCHITECTURE.md` — the navigation tree, the 48-route taxonomy and the marking rules (r12).
4. `docs/COMPONENT_CATALOG.md` — primitives, patterns and **page archetypes** with reference pages.
5. `pages/10-proyek.html` + `assets/js/modules/proyek.js` — the reference list and detail-hub pages.
6. `review/app-map.html` — every screen, generated from the route registry.

## 5. How to create a new project from it
Follow `docs/TEMPLATE_ADOPTION_GUIDE.md`. In short: copy the repository; keep Layer A untouched;
replace `project-config.js` content (start from `template/project-config.example.js`); replace the
fixture data and the page modules; scaffold pages for your routes; run the tools in §16.

## 6. How to add a module
1. Add its routes to `ROUTES` (id, file, title, module, group, archetype, parent, params, roles).
2. Add an entry to `MODULES` (key, label, icon, landing route, roles/capability, bottomNav).
3. Place it in `navigation.sidebar`: the module key (a flat leaf) for a one-screen area, or a node with
   `children` when the area has two or more persistent destinations (§19); detail and task routes are never
   entries. Add it to `navigation.bottom` (per role) only if it is a frequent phone destination; max 5, the
   app bar already holds search + menu.
4. Scaffold its pages (§7), add `assets/js/modules/<module>.js` + `assets/css/modules/<module>.css`.
5. `python tools/shell_sync.py` (navigation fallback) → `python tools/make_app_map.py` →
   `python tools/route_check.py` → `python tools/nav_audit.py`.

## 7. How to add a page
`python tools/shell_sync.py --new <route-id> --module <module>` creates `pages/<file>` from
`template/page-skeleton.html` with the full shell, breadcrumb host (`[data-crumbs]`), title, actions
slot and the scripts in the right order (fixture → `patterns.js` → `modules/domain.js` → your module →
`interactions.js`). Your module script runs one IIFE per page guarded by `body.dataset.route`, starts
with `if (!MCPage.guard()) return;` and `MCPage.crumbs({...})`, then renders into `[data-mount]` hosts.
Never write literal page paths: use `MCRoutes.href(id, params)` (or the domain helper).

## 8. How to select a page archetype
Pick from the table in `docs/COMPONENT_CATALOG.md` §3 (dashboard, list, detail-hub, detail,
list-detail, form, task, checklist, document, report, review, settings, hub, search, system, auth)
and copy its reference page. Do not force every screen into cards: lists are tables on desktop and rows
on phones (`MCList`), records are detail pages with parts (`MCTabs`), forms end in a review step.

## 9. How responsive behaviour works
Three classes: phone `< 768`, tablet `768–1024`, desktop `≥ 1025` (`docs/DESIGN_SYSTEM.md`).
Desktop density uses runtime units (`--du` geometry, `--tu` text, `--iu` icons) so browser zoom 100 % is
comfortable from 1280 × 720 to 1920 × 1080; content stops at 1680 px. Tablet uses the icon rail + the
full drawer. Phones are designed, not shrunk: app bar + bottom bar, lists become rows, page actions
go below the title or into a sticky action bar above the bottom bar, detail parts become drill-in rows
opening sheets, phone-only progressive disclosure (`mobileDisclosure`). No page-level sideways scroll.

## 10. How navigation works
r12: ONE two-level tree per project (`navigation.sidebar`) drives every surface. **Desktop sidebar** = the
complete tree (expanded; the toggle or Ctrl/Cmd+B collapses it to the icon rail); **tablet** = icon rail + the
drawer (a rail group icon opens the drawer at that group); **phone** = app bar (Menu, brand, search) + **bottom
bar** (the role's most frequent level-1 destinations, max 5; MULTIPLECORP 4) + **drawer** (the same tree);
**command palette** (Ctrl/Cmd+K, the search field, the phone search button) = every entry the account may open,
page actions and records (`MCPalette` providers); **account** = user-level actions only (Akun Saya, keyboard
reference, Keluar); **back** = browser/device Back (an explicit app-bar Back only with `navigation.mobileBack`).
The current entry comes from `MCProject.navCurrent()` (route + params, then the true-parent walk);
`body[data-nav-section]` is only the no-JS hint. A role outside a route's `roles` gets the standard not-found
page. Model, trees and rules: `docs/NAVIGATION_ARCHITECTURE.md`; what goes where: §19.

## 11. How action-risk confirmation works
`MCRisk.run({ level, ... })` (`docs/COMPONENT_CATALOG.md`): **LOW** (filter, tab, preview, add row:
no confirmation), **COMMIT** (creates a record or lasting state: validate first — invalid input never
opens a dialog — then one confirmation summarising what will be recorded and its consequence, then
execute with a pending state), **DESTRUCTIVE** (discard / cancel / void: consequence explained, safe
choice focused, scrim does not answer), **CRITICAL** (very high risk: reason and/or typed confirmation;
production adds re-authentication). A multi-step form's review step is its commit confirmation. Every
execution is guarded (one in flight per key, trigger disabled + `aria-busy`); server idempotency is a
backend responsibility.

## 12. How statuses work
Domain states and their labels/tones live in the project's status registry (MULTIPLECORP:
`MCData.statuses` in the fixture: `{ STATE: { label, tone, live } }`). Render with
`MCUI.status(registry, key, { size, live })`. Tones: success, info, pending, warning, danger, neutral.
Text always carries the meaning (never colour only). `live: true` is set only for genuinely ongoing
states; only the primary status of the record in view may breathe (`.mc-pill--live`, 2 s, static under
reduced motion). Derived signals are computed, never "marked read".

## 13. How long text works
Single-line cells ellipsize (`.pt-cell__title`, `.mc-truncate`); the full text stays reachable
(tooltip on pointer devices, the record detail, and `MCLongText`'s slow reveal that runs only when the
text actually overflows and pauses on leave). Never a marquee; under reduced motion nothing moves by
itself. Multi-line clamps (`.mc-clamp-2`) for descriptions. Brand names step down one size, then
ellipsize.

## 14. How motion works
Motion explains state change, hierarchy, feedback and continuity — never decoration. Tokens and recipes:
`docs/MOTION_SYSTEM.md` (`--mc-dur-*`, `--mc-ease-*`). Allowed: drawer, sheet, dialog, toast,
disclosure, tab panel entry, upload success, live status, overflow reveal, workflow progress, page exit.
No animation during normal scrolling. Reduced motion = 150 ms opacity fades. `pages/04-motion-study.html`
shows every recipe.

## 15. How branding works
`brand` in `project-config.js` fills `[data-brand]`, `[data-brand-mark]`, `[data-brand-name]`,
`[data-brand-company]`, `[data-brand-label]`, the title template and the favicon. Colours: only the
`--brand-*` tokens (via `tokens: {...}`); semantic colours never change. Preview other projects with
`?project=nusantara` / `?project=longname` (`?project=default` returns).

## 16. How tests should be extended
- `python tools/behaviour_test.py` — the regression suite (never delete checks; adapt them with a
  comment when a canonical or Owner decision changes behaviour).
- `python tools/route_check.py` — registry ↔ files ↔ links; no `#`, `javascript:`, `data-placeholder`.
- `python tools/clickability.py` — clicks every control of every page; 0 dead controls allowed.
- `python tools/page_check.py <pages> --shots` — errors, overflow, links + screenshots at 1366 × 768,
  1024 × 768 and 390 × 844 (add `--role admin` for the second role).
- `python tools/make_app_map.py` — regenerates `review/app-map.html`; fails when a route has no page.
- `python tools/ux_density.py` — action density per page (buttons above the fold, primaries per block,
  header controls, duplicate destinations, phone fold); a report for manual review (r11).
- `python tools/a11y_check.py` — one `h1`, heading order, accessible names, field labels, image alt,
  text contrast and 44 × 44 px phone targets on every registered screen (desktop + phone).
- `python tools/nav_audit.py [--pages]` — r12 navigation audit for Owner, Admin and the QA fixtures: dead,
  duplicate, hidden-route and role-invalid entries, active ancestry, depth, bottom bar; `--pages` lists page links
  that duplicate an entry of the role's navigation (a report, not a verdict).
- `node tools/export_config.js [project] [role]` — the resolved tree, current entries, bottom bar and palette
  index (what the pages render).
Add checks for every new rule you introduce; use the injected clock `window.MC_TIME_NOW` for
deterministic dates.

## 17. How to tell Golden rules from fixture business data
- Golden (Layer A) files never contain business names, numbers, routes or roles: `tools/behaviour_test.py`
  audits `interactions.js` and `patterns.js` for fixture strings.
- Business content lives only in `assets/js/fixtures/*`, `assets/js/modules/*`, `assets/css/modules/*`
  and the page bodies. MULTIPLECORP companies (CV Arunika Jaya, PT Bentara Niaga, CV Cakra Persada),
  suppliers ("… Contoh …"), clients, numbers (`ARJ/PRJ/2026/0142`) and figures are **fictitious demo
  fixtures**.
- `docs/DESIGN_DECISIONS.md` labels every decision GOLDEN FIXED / PROJECT CONFIGURABLE / BUSINESS FIXTURE
  / PROJECT IMPLEMENTATION RESPONSIBILITY / EXTERNAL-BACKEND RESPONSIBILITY, and says whether a
  business rule is CANONICAL (from the MULTIPLECORP documentation) or a DEMO assumption.

## 18. Action simplification (r11) — do NOT expose every valid action at once
A screen shows the actions its job needs, not every action the data allows. Read `docs/UX_PRINCIPLES.md`
(the rules), `docs/ACTION_ROUTE_MATRIX.md` (where every important control lives and why) and
`docs/DESIGN_DECISIONS.md` D-26 … D-46 before adding a button.

**Where an action goes**
| Placement | Use it for | Built with |
|---|---|---|
| **Primary** (one per region) | the step the account can take now and the page exists for: "Buat Pembelian", "Catat Pembayaran", "Terima Barang" | `MCActions` def `priority: 'primary'` |
| **Secondary** (≤ 2 desktop, 1 tablet, 0 phone) | a frequent alternative TASK on the same object (not navigation) | `priority: 'secondary'` (quiet outline) |
| **Overflow — "Tindakan Lain ▾"** | rare, administrative, output (Cetak, Unduh) and every destructive / corrective action (last, red, after a separator) | `priority: 'overflow'`, `danger: true` |
| **Row action** | the row is the link; at most ONE visible next-step in a work-queue list ("Reservasi", "Lengkapi"); other row actions in the detail sheet or a row menu | `MCMenu.html({ label: 'Tindakan untuk …', items })` (kebab) |
| **Context menu / detail panel** | actions on one selected record in a list-detail page | the panel's own `MCActions` render |
| **Section link** | "Lihat semua", "Ubah" for that section only (one per section head) | `MCUI.link` / `.pt-link` |
| **Command palette** | low-frequency navigation and keyboard shortcuts (everything in it also exists in the UI) | `MCPalette.register` |
| **Hidden by role** | anything the account's capability does not allow — absent, not disabled | `capability` on the def / `MCApp.canGo(route)` |

**Rules of thumb**
- One filled button per region; a page with no single job (dashboard, hub, review) has no header primary.
- A header button changes data or starts a task. Navigation (sibling list, parent record, another module)
  is a breadcrumb, meta link, section link, row, overflow item or palette entry.
- The same destination appears once per local block (no button + chevron + link to one place).
- Disabled + reason only when the action exists for this account but the record state blocks it.
- Owner surfaces lead with attention and figures (oversight verbs); Admin surfaces lead with the next
  executable step. Capability comes from `project-config.js`; never hard-code "role X has button Y" in
  shared CSS or patterns.
- Phones: primary + "⋯" on one row (only a filled primary fills the row; a quiet action stays compact);
  focused task/form screens hide the bottom bar while their sticky action bar is shown.
- Never a one-item "Tindakan Lain": a lone harmless action renders as a quiet button (MCActions does it).
- Dates are picked with `MCDateField` (no bare native date input); percentages are written attached ("76%").
- An action is reachable from one obvious place for whoever executes it; opening an address never creates a
  record (start drafts through a confirmed command, e.g. `MCApp.startInvoice`).
- Check yourself: `python tools/ux_density.py` lists buttons above the fold, primaries per block, header
  controls, duplicate destinations and the phone fold per page (a report for manual review, not a verdict);
  `python tools/clickability.py` also opens every overflow menu and clicks every item (0 dead allowed).

```js
MCActions.render(document.querySelector('[data-page-actions]'), [
  { id: 'receive', label: 'Terima Barang', icon: 'inbox-in', priority: 'primary', href: A.href('receive', id), capability: 'stock.receive' },
  { id: 'po',      label: 'Pratinjau PO', priority: 'secondary', action: 'po-preview' },
  { id: 'print',   label: 'Cetak', priority: 'overflow', demo: 'Cetak disimulasikan' },
  { id: 'close',   label: 'Tutup Sisa Pembelian', priority: 'overflow', danger: true, action: 'pur-close', capability: 'purchase.close_remainder' }
]);
```

## 19. NAVIGATION VS ACTION (r12) — do not mix
The sidebar / drawer answers **"ke fungsi mana saya ingin pergi?"**; the page answers **"apa yang harus saya
kerjakan di fungsi ini?"**. Every control is exactly ONE of these five. Read `docs/NAVIGATION_ARCHITECTURE.md`
and D-47 … D-51 before adding a menu entry, a tab row or a page link.

| Placement | It is for | Never use it for | Built with |
|---|---|---|---|
| **SIDEBAR / DRAWER** | persistent destinations: a module landing and its sibling destinations, max 2 levels | records, create flows, actions, account or system pages, counts | `navigation.sidebar` (one tree; the rail, drawer and palette read the same) |
| **TABS** | views of the SAME object or workspace: states, kinds of one list, record parts, report types | module navigation: siblings that are their own entries (that is MCTabs view mode, D-49) | `MCTabs` |
| **CONTEXTUAL LINK** | the related business object, scoped: Proyek → its purchases (`?proyek=`), Invoice → its payment, Pembelian → its Barang Masuk (`?pembelian=`) | an unscoped "go to module X" the navigation already provides | rows, `MCUI.link`, signals, `MCApp.href(kind, id)` |
| **BUTTON** | a task or action, verb + object: Buat Proyek, Catat Pembayaran, Terima Barang | going somewhere (D-35) | `MCActions` primary / secondary |
| **OVERFLOW** | rare, administrative, output and destructive actions | the primary; navigation | `MCActions` `priority: 'overflow'` ("Tindakan Lain") |

**Rules**
- Before adding a page link to a list or a module, ask `MCProject.navProvides(route, params)`: if the role's
  navigation already opens it, do not add it — or add it with the current record's scope. Never add a
  sub-navigation row, tiles to sibling screens, or a subtitle link to a sibling.
- Detail and task routes are never entries: set `ROUTES.parent` to the true ancestor so the right entry is marked
  (`aria-current="true"`). Sibling destinations get `parent: null` (no sibling breadcrumb).
- A group header never navigates (no `href`, no split target); the first child is the landing.
- Hide by capability (absent, never disabled), target an audience with `roles`, and use `hiddenForRoles` only for a
  deliberate presentation choice — it never removes access or the palette entry (D-48).
- Never add an entry for a screen that does not exist, and never a second tree per role.
- Whatever you remove from a page must stay reachable: write its reach path in `docs/ACTION_ROUTE_MATRIX.md`.

**Config how-to** (`assets/js/project-config.js`; full schema `docs/NAVIGATION_ARCHITECTURE.md` §8, a commented
example in `template/project-config.example.js`):
```js
navigation: {
  home: 'beranda',
  sidebar: [
    { items: [
      'beranda',                                              // flat leaf: a one-screen module (MODULES key)
      { id: 'gudang', module: 'gudang', children: [           // group: icon + label + capability from MODULES
        { id: 'stok', label: L('Stok', 'Stock'), route: 'gudang.stok' },            // first child = landing
        { id: 'barang-masuk', label: L('Barang Masuk', 'Goods receipt'), route: 'gudang.masuk',
          capability: 'stock.receive', hiddenForRoles: ['owner'] }                 // hint + presentation only (illustration of the field; r13: MULTIPLECORP no longer hides it)
      ] },
      { id: 'data-master', module: 'data-master', match: ['jenis'], children: [    // one entry per view (?jenis=)
        { id: 'klien', label: L('Klien', 'Clients'), route: 'master.home', params: { jenis: 'klien' } },
        { id: 'pemasok', label: L('Pemasok', 'Suppliers'), route: 'master.home', params: { jenis: 'pemasok' } }
      ] }
    ] },
    { id: 'owner', label: L('Khusus Owner', 'Owner only'), roles: ['owner'], items: ['tinjauan'] }
  ],
  bottom: { default: ['beranda', 'proyek', 'gudang', 'keuangan'], admin: ['beranda', 'proyek', 'gudang', 'pengiriman'] }
}
```
Then run `python tools/shell_sync.py` → `python tools/route_check.py` → `python tools/nav_audit.py` →
`python tools/make_app_map.py`, and read `node tools/export_config.js default <role>` (`tree`, `current`,
`bottomItems`) to confirm every role sees what you meant.

**r13 harmony (read before touching stages, results or lists):** stage navigation = `MCStepper` (guide.js; never a
page-specific stepper), results = `MCResult` (icon inside the heading, number as the headline), lists = `MCList`
numbered by default (`number: false` only with a reason written in COMPONENT_RULES "Numbered lists"). See D-55.

**r13 Phase 6 (guided work):** a new project configures guidance in `project-config.js` → `help`:
`defaultLevel` ('terpandu'), optional `levels` [{ id, label, text }], `tours[id] = { title, capability, steps: [{ route,
href, target, title, body }] }` (route = where the step lives, href = how the tour gets there, target = a CSS selector of a
REAL control; the first visible match is used, an absent one is skipped) and `screens[routeId].howItWorks` (2-4 lines).
Mark context lines `data-guide-hint` so the Ringkas level can hide them; never mark warnings, errors or next steps.
Workflow stages are domain logic (derive them in the module from records, e.g. 11 uses the completion gate) and are
drawn with `MCProgress`; next steps use `MCNext`, prerequisites `MCPrereq`. Business workflow content stays in Layer B/C.

**r13 Phase 7 (safety and handoffs):** give every COMMAND route its audience capability in the registry
(`capability: '…'`) - `MCPage.guard()` then answers MSG-10 for it, and `MCApp.canGo` stops offering links to it. Never
mutate on navigation; a context parameter (`?klien=`) preselects once and never overwrites. Commands with a business date
use the composer's `tpl.businessDate` (or the same PT-25 rules in a custom form). Frontend guards are not authorization -
document the backend rule beside every guard you add.

**r13 Phase 9:** the guided-work system has one entry page, `docs/GUIDED_WORKFLOW.md`; the document identity / number /
snapshot / date contract is `docs/DOCUMENT_SYSTEM.md` §4b; decisions D-52..D-59 are in DESIGN_DECISIONS in order.

**Golden Frontend Reference v1 (candidate):** the entry point for any new project is `docs/GOLDEN_FRONTEND_V1_START_HERE.md` (scope, component inventory, adoption steps, consumer demo `examples/consumer-demo/`, smoke test `tools/golden_consumer_smoke.py`).
