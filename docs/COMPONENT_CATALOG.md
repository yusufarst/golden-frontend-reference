# MULTIPLECORP Golden Reference — Component catalog (v1.0 Freeze Candidate)

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL**.

What exists, where it lives, and when to use it. Layer A (Golden Design System) only: none of these
depend on MULTIPLECORP data. Rules for each primitive: `docs/COMPONENT_RULES.md`; tokens and visual
language: `docs/DESIGN_SYSTEM.md`; motion: `docs/MOTION_SYSTEM.md`.

| File | Contains |
|---|---|
| `assets/css/tokens.css` | every design token (colour, type, space, radius, shadow, motion, density units `--du/--dt/--tu/--iu`, brand slots `--brand-*`) |
| `assets/css/base.css` | reset, Inter, icon box (`.mc-icon`, sizes `--12 … --28`), focus ring, visually hidden |
| `assets/css/components.css` | primitives + the app shell + the four original pages (01–04) |
| `assets/css/patterns.css` | page archetypes and data patterns (`.pt-*`, r10) |
| `assets/css/motion.css` | entrance / exit / live / reduced-motion rules |
| `assets/js/icons.js` | inline SVG sprite (104 icons, 24-unit grid) |
| `assets/js/project-config.js` | Layer B: project, routes, modules, navigation, roles, time, brand |
| `assets/js/interactions.js` | shell, overlays, palette, select, upload, toasts, date range, account, dialogs, disclosure, split, long text, 01–04 page logic |
| `assets/js/patterns.js` | Layer A runtime for module pages (r10) |

---

## 1. Primitives (components.css)

| Component | Class / API | Use |
|---|---|---|
| Card | `.mc-card`, `--flush`, `--pad-16/24`, `.mc-card__title--sm/md/lg/bold` | every surface block |
| Button | `.mc-btn` + `--primary / --accent / --outline / --ghost / --sunken / --danger / --cta` + `--xs/sm/md/lg/xl`, `--icon`, `--round`, `--block` | one primary per region; `--cta` only on auth |
| Split action | `.mc-split` (`[data-split]`, `MCSplit`) | ONE primary + chevron menu of secondary actions (destructive last) |
| Field / input | `.mc-field`, `.mc-input` (`--sm/lg/xl/header/addon/invalid`) | form fields; labels always visible; the whole shell is the target (a tap outside the control focuses it / opens the select); 44 px on phones |
| Select | `.mc-input.mc-select` + native `<select>` (`MCSelect` enhances: listbox desktop, sheet phone) | choices > 5 or long labels |
| Status pill | `.mc-pill` + tone (`--success/pending/warning/danger/info/neutral`) + size (`--xs/sm/lg`) + `--live` | record states; text carries the meaning |
| Delta | `.mc-delta--up/down/warning` | period comparison |
| Attention badge | `.mc-attention` | count of derived signals |
| Disc | `.mc-disc--32/40/42/52/56` | icon tile in rows / KPI |
| Keycap | `.mc-kbd` | shortcuts |
| Progress | `.mc-progress` (`--value`) | progress / composition |
| Stepper | `.mc-stepper` > `.mc-step.is-complete/.is-current/.is-attention` | multi-step forms (equal columns, aligned markers) |
| Business date (forms) | r13 remediation: `MCBizDate.watch(nativeDate, noteHost, { label, effect, onChange })` · `.html({ id, value, effect })` + `.bind(host, { id, effect, onChange })` · `.state / .error / .label` | PT-25 outside the composer: max today, refusal sentence, "Tanggal Mundur" note; one rule set for 03 / 32 / 33 / 41 / 65 |
| Forbidden state | r13 Phase 7: `MCPage.guard()` → `MCRoutes.denial(id)` → `[data-forbidden]` (MSG-10 + "Kode rujukan") or `[data-not-found]` | route capability missing vs not part of the account's application; nothing of the record is rendered |
| Business date | r13 Phase 7: composer `tpl.businessDate = { today(), label(iso) }` → "Tanggal transaksi" line in "Saat diterbitkan" (`state.businessDate`, null = prefilled) | PT-25: picker max today, "dipilih" + "Tanggal Mundur" for earlier dates; the template validates, numbers by that period and never saves it into the draft |
| Guidance level | r13 Phase 6: `MCGuide.level()` / `.setLevel(id)` / `.openPanel(from)` → `<html data-guidance>`; account menu item `action: 'guide'` | per-viewer presentation (Terpandu / Ringkas); Ringkas hides `[data-guide-hint]`, `.mc-help`, stage hints - never warnings, errors, next steps or outcomes |
| Cara kerja | r13 Phase 6: `MCHelp.html(routeKey)` → `details.mc-help` from `help.screens[key].howItWorks` | 2-4 short lines, closed by default, Terpandu only |
| Resume memory | r13 Phase 6: `MCResume.touch({ kind, id, label, sub, href })` / `.list()` | the last 6 records this viewer opened (localStorage; never form data); a page shows only what the account may still open |
| Walkthrough | r13 Phase 6: `MCTour.offerHTML()` / `.start(id)` / `.skip()` / `.state()`; config `help.tours[id]` | non-modal callout on REAL controls across pages, ring on the target, Esc = skip, absent target = skipped; offered once (inline card), restart from "Panduan"; phones: a sheet above the bottom nav / action bar |
| Workflow navigator | r13 harmony: `MCStepper.html(steps, { label, attr })` + `.bind(host)` → `nav.mc-flow > ol.mc-stepper.mc-stepper--inline` | interactive stages on a tonal band (top band of the card it steers); states current · complete · upcoming · attention/blocked · locked; same markers as Stepper |
| Disclosure | `.mc-disclosure` (`[data-disclosure]`, `MCDisclosure`) | phone-only progressive sections |
| Page header | `.mc-page-head`, `.mc-crumbs`, `.mc-page-head__title/subtitle` | every app page |
| KPI tile | `.mc-kpi` | dashboard figures |
| Date range | `[data-daterange]` (`MCDateRange`) | report periods |
| Toast | `MCToast.success/info/warning/error(title, message)` | events without a field |
| Dialog | `MCDialog.open/confirm`, `MCConfirm` | decisions (application-level, scrim never answers) |
| Long text | `.mc-truncate`, `MCLongText` | single-line overflow with reveal |

## 2. Page patterns (patterns.css + patterns.js, r10)

| Pattern | Markup / API | Notes |
|---|---|---|
| Page stack | `.pt-page` | vertical rhythm `--pt-gap` |
| Header row | `.pt-head__row` > `.pt-head__text` + `.pt-head__actions`; `.pt-head__meta` | actions right on desktop, below the title on phones |
| Section | `.mc-card.pt-section` > `.pt-section__head` (`__title` text only, `__sub`, `__actions`) + `.pt-section__body` (`--flush`, `--flush-x`) + `.pt-section__foot` | text-first headings |
| Grids | `.pt-grid-2` (1.55 : 1), `.pt-grid-2--even`, `.pt-grid-3`, `.pt-stack` | collapse to one column ≤ 900 px |
| Filter toolbar | `MCFilter.mount(host, { search, selects, company, visible, filterLabel, onChange })` → `.pt-toolbar` | r11 (D-34): search + company view (2+ companies) + `visible` promoted selects (default 1 with company view, else 2); the rest behind ONE "Filter (n)" button (fixed popover on wide screens, sheet on phones); auto-collapses so it never wraps; phones = search + Filter only; sort is not a filter |
| Company view | `MCCompany.get/set/options/visible/multi` | session-wide "Tampilkan" choice |
| List | `MCList.mount(host, { columns, rows, rowHref, phone, pageSize, empty, emptyFiltered, select, foot })` | ONE data set → table (≥ 768 px) + rows (phone); "Muat Lagi" (25); states built in; **fit**: a table never clips columns: small overflow → tighter cells, still too wide → the rows representation (also `MCList.fit(host)` for custom lists with the same markup); column priority classes `pt-hide-lg` (≤ 1300 px), `pt-hide-md` (≤ 1100 px), `pt-show-lg` (inline replacement) |
| Table | `.pt-table` (`.is-num`, `.is-center`, `.is-shrink`, `tr[data-href]`, `tr.is-selected`) in `.pt-table-wrap` (`--framed`) | tabular numerals, row hover, captions |
| Cell | `MCUI.cell(title, sub, href)` → `.pt-cell__title / __sub` | ellipsis + full text in the record |
| Row list | `.pt-rows` > `.pt-row` (`__main`, `__title`, `__meta`, `__end`, `__value`, `has-chevron`) | ≥ 60 px rows, 44 px targets |
| Company tag | `MCUI.co(code, { name, other })` → `.pt-co` / `.pt-co--other` ("perusahaan lain") | |
| Status | `MCUI.status(registry, key, { size, live })`, `MCUI.pill(label, tone)` | `live` only if the registry marks the state live |
| States | `MCUI.state('loading' / 'empty' / 'error' / 'permission' / 'done', { title, text, action, ref })` | errors offer "Muat Ulang Bagian Ini"; one region never blanks the page |
| Tabs | `MCTabs.mount(host, { tabs: [{ id, label, count, attention, fact, render }], param: 'tab', drill, toolbar })` | real tabs + `?tab=`; r11 (D-29): tabs that do not fit collapse into a trailing "Bagian Lain" menu (selected tab stays visible); phones keep the swipe row; `drill` = phone drill-in parts (detail hub); `toolbar` = element placed under the tab row; r12 (D-49) VIEW mode: when the role's navigation lists every tab as its own entry (`MCProject.navCovers`) no tablist renders, only the URL-selected panel, and h1 / `<title>` come from `ROUTES.views` (85, 91) |
| Segmented | `MCSeg.mount(host, { options, value, onChange })` → `.pt-seg` | views inside one section |
| Facts | `.pt-facts` > `.pt-fact` (`dt/dd`, `__hint`) | header key facts |
| Key-value | `.pt-kv` (`dt/dd`) | detail attributes, confirmation summaries |
| Timeline | `.pt-timeline__item` (`.is-special`, `.is-owner`) | activity / history |
| Checklist | `.pt-checklist` > `.pt-check` (`.is-done/.is-blocked/.is-na`) | completion conditions, administration documents |
| Split view | `.pt-split` > list + `.pt-split__detail` | list-detail ≥ 1101 px; below: `MCSheet` |
| Sheet | `MCSheet.open({ title, html, back, onClose })` | non-critical; scrim / Esc / Back close; focus trap; one history entry (opening a second sheet replaces the first) |
| Form grid | `.pt-form-grid` (`--3`, `.is-wide`), `.pt-readonly`, `.pt-help` | one column on phones |
| Action bar | `.pt-actionbar` (+ `.pt-has-actionbar` on the content) | sticky page actions; above the bottom nav on phones |
| Document paper | r13: `MCDoc.paper(vm, { mode, mini, photos })` (string) / `MCDoc.mount(host, vm, { mode, scale })` → `.pt-paper-stage` > `.pt-paper` > `.pt-paper__page` (letterhead, title, meta, parties, refs, table with optional photo column, totals, validity, notes / terms marked "Contoh tata letak", text-only signatures, footer "Halaman n dari m", draft marking "DRAF — belum terbit"); `.pt-versions` | ONE renderer for every generated document (composer preview, 51, 52, 03 PO preview): A4 in em units scaled to fit, paginated; phones reflow the same pages. See `docs/DOCUMENT_SYSTEM.md` |
| Totals | r13: `MCDoc.totals(lines, { priceBasis, rounding, level })` | ONE calculation contract (integer rupiah, configured rounding, per-line tax components; the rate comes from the project's tax table) used by editor, preview, checks, confirmation and issued paper |
| Number entry | r13: `MCForm.num.parse(text, { decimals, unit })` / `.format` / `.value` | Indonesian separators ("1.250.000,50"); an explicit error sentence, never silent digit stripping |
| Progress | r13: `MCProgress.html(steps, { wrap })` / `.derive(list)` / `.set(ol, states)` on `.mc-stepper` | DERIVED steps (complete · current · upcoming · attention), `<ol>` + `aria-current="step"`; 03 uses it with identical markup |
| Checks | r13: `MCChecks.mount(host).update(items)` / `.html` / `.summary(counts)` / `.reveal(el)` → `.pt-checks` > `.pt-checkitem--blocking/warning/ok` | "Pemeriksaan": business sentences, "Perbaiki" reveals + focuses the field, the count for the sticky bar; warnings never in the error tone |
| Result | r13: `MCResult.mount(host, { object, number, title, facts, pdf, next })` → `.pt-result`; `MCResult.issued(objek, nomor)` | ONE result surface: MSG-01 "{Objek} diterbitkan dengan nomor {nomor}." (copyable number), PDF PENDING → READY / FAILED n dari 5, ONE next action (`MCNext`) + links; no toast for the same event |
| Next / prerequisite | r13: `MCNext.html({ label, href / action, why, links, capability })`, `MCPrereq.html({ kind: 'missing' / 'capability' / 'owner', title, text, link })` → `.pt-next`, `.pt-prereq` | missing capability = "Perlu kewenangan …" with nothing to press; Owner-only blockers in MSG-17 style for Admins |
| Composer | r13: `MCComposer.register(id, template)` + `MCComposer.mount(host, id, ctx)` → `.pt-compose` | the Live Document Composer: editor ‖ sticky preview rail ≥ 1280 px (46 % / 42 % ≥ 1600), "Rincian \| Pratinjau" below, one sticky action bar, explicit save, dirty guard, issue via `MCRisk` + `MCResult` |
| Notice | `MCUI.notice(tone, title, text, actionsHTML)` → `.pt-notice--info/warning/danger/success` | inline explanations |
| Metrics | `.pt-metrics` > `.pt-metric` (`__label`, `__value`, `__note`) | r11 (D-28): ONE surface with hairline dividers (no separate cards); numbers only (metadata → header meta); a cell is a link only when it drills somewhere else |
| Hub tiles | `.pt-tiles` > `a.mc-card.pt-tile` | r12: no prototype page uses it any more (95's tiles became conditional signals); a tile that only repeats a navigation entry is navigation dressed as content |
| System page | `.pt-system` (`MCPage.notFound()`) | not found / error |
| Progress cell | `.pt-progress` > `.mc-progress` + `.pt-progress__value` | |
| Risk | `MCRisk.run({ level, key, trigger, validate, confirm: { title, summary, consequence, ok, cancel, reason, typed }, execute, success, latency })` | LOW / COMMIT / DESTRUCTIVE / CRITICAL; `reason: true` adds a required reason to any level (corrections); CRITICAL also takes `typed`; the confirm button stays disabled until valid; one in-flight per key |
| Actions | `[data-action="name"]` + `MCAction.on(name, fn)`; `[data-demo="…"]` | delegated handlers; demo = toast explaining the real behaviour |
| Page | `MCPage.guard()`, `MCPage.crumbs(map)`, `MCPage.subnav(items)`, `MCPage.title(text)`, `MCPage.href(id, params)`, `MCPage.param(name)`, `MCPage.dirtyGuard(fn)` | route-aware helpers; r11: crumbs = ancestors only, none on top-level pages (D-27); `title` breaks record numbers only after "/"; `dirtyGuard(() => dirty)` asks before leaving a form with unsaved input; `<html data-container>` page width from the archetype (D-30) |
| Palette | `MCPalette.register(fn(query) → groups)` | command palette providers (records, page actions) |
| Format | `MCUI.fmt.rp(n, { short })`, `num`, `qty`, `pct`, `date(v, 'long'/'day'/'noyear'/'month')`, `time`, `datetime`, `rel`, `due`, `days` | id-ID formats; project time zone via `MCTime` |

## 3. Page archetypes

Every screen of the prototype is one of these (route field `archetype`). Copy the reference page.

| Archetype | Structure | Reference |
|---|---|---|
| `auth` | no shell; one card / column | `01-login.html`, `05-atur-kata-sandi.html` |
| `dashboard` | greeting, figures, derived signals (each routed), period filter | `02-owner-dashboard.html`, `06-antrean-tindakan.html` |
| `list` | header (title, subtitle, primary create action) → toolbar → section with `MCList` | `10-proyek.html` |
| `detail-hub` | header (title, number, company, live status, next action) → facts / metrics → signals → `MCTabs` (phone: drill-in parts) | `11-proyek-detail.html` |
| `detail` | header → position block / facts → parts → actions with `MCRisk` | `21-pembelian-detail.html`, `62-invoice-detail.html` |
| `list-detail` | `.pt-split`: list + selected record beside; phone: `MCSheet` | `63-piutang.html`, `70-kasus-koreksi.html` |
| `form` | `.pt-form-grid` sections → review (commit summary) → result; sticky action bar | `03-create-purchase.html`, `65-catat-pembayaran.html` |
| `task` | floor work: scan / search first, one line at a time on phones, summary → commit | `32-barang-masuk.html`, `33-barang-keluar.html` |
| `checklist` | conditions / requirements with state, reason and the link that fixes it | `15-penyelesaian-proyek.html`, `52-dokumen-administrasi.html` |
| `document` | preview sheet beside the version chain; issue / revise / void | `51-dokumen-detail.html` |
| `report` | report type → required company + date range → one section per company | `80-laporan.html` |
| `review` | derived conditions + activity tabs; never approval | `90-tinjauan-owner.html` |
| `settings` | a configuration list (r12: no hub tiles; conditional "Perlu tindakan" rows); preview before saving access | `95-pengaturan.html`, `96-pengguna-akses.html` |
| `hub` | figures + signals for the area (its screens are navigation children) | `60-keuangan.html` |
| `search` | grouped results, exact number first | `07-cari.html` |
| `system` | not found / error with reference code | `00-tidak-ditemukan.html` |

## 4. Control classes (no-dead-control rule)

Every visible enabled control is exactly one of: **NAVIGATION** (real `href` to a registered page),
**ACTION** (a handler that changes visible state), **UI CONTROL** (field, tab, filter, disclosure,
menu, sheet), **DEMO ACTION** (`data-demo`: a toast saying what the real product does), or **DISABLED**
(with the reason in `title` / `aria-describedby`). `tools/clickability.py` clicks everything and fails
on any control without an observable effect; `tools/route_check.py` fails on `href="#"`,
`javascript:`, `data-placeholder` and broken links.

## 2b. Action hierarchy and role-aware controls (r11)

How actions are presented (rules: `docs/UX_PRINCIPLES.md`, decisions D-26 … D-46; where each control of the
prototype lives: `docs/ACTION_ROUTE_MATRIX.md`).

| Component | Markup / API | Notes |
|---|---|---|
| Page action bar (header) | `MCActions.render(host, defs, { maxSecondary, menuText })`; defs `{ id, label, icon, priority: primary / secondary / overflow, href / action / demo, danger, disabled, reason, capability, roles, attrs }` | ONE primary, ≤ 2 quiet secondary (1 on tablets), the rest + destructive (last, separator) in ONE "Tindakan Lain ▾" menu; phones: a filled primary fills the row, a quiet action stays compact + "⋯"; a lone harmless overflow item renders as a quiet button (no one-item menu); defs the account cannot use (capability / roles) are not rendered; order [Tindakan Lain] [secondary] [primary] |
| Overflow / row menu | `MCMenu.html({ label, title, text, icon, variant, size, items: [{ label, icon, href / action / demo, danger, disabled, reason, hint, sep }] })` | trigger + `<template>`; the open menu is a body-level popover (never clipped by a card) and a bottom action sheet on phones (title, 48 px rows, "Batal"); keyboard: Enter / ↓ opens, arrows / Home / End move, Esc returns focus; items are delegated clones (href, `data-action`, `data-demo`) |
| Row actions | the row is the link (`rowHref`) + chevron; ≤ 1 visible next step in work queues; other actions via `MCMenu` kebab or the detail sheet | no "Buka …" button duplicating the row; no repeated disabled buttons |
| Signals ("Perlu tindakan") | `MCUI.signals(items, { title, sub, max: 3, flat })`; items `{ tone, title, meta, href, end }` | worst first, top 3 + "Lihat semua (n)" in place; condition strong, record numbers in the meta line; one link per row (D-31) |
| Detail section | `.mc-card.pt-section` > head (title text only, ≤ 1 text action) + body | a single list or a tab panel has no head repeating the page / tab title; no card inside a card |
| Container modes | `<html data-container="data / standard / settings / form / focused">` (from the route archetype; `container` in ROUTES overrides) | 1680 / 1440 / 1280 / 1120 / 960 px; header, body and sticky action bar share the column; 01–04 unaffected |
| Role-aware controls | `MCApp.can(cap)`, `MCApp.canGo(routeId)` (route + the task capability of that screen), MCActions `capability` / `roles` | hide what the capability disallows; disable + reason only for state-blocked actions (D-33); Owner surfaces quieter execution verbs (D-36) |
| Module sub-navigation | `MCPage.subnav([{ route, label, cap }])` | one quiet link row under the header for sibling screens without a sidebar entry (D-39); routes the role cannot open are left out; r12 (D-47): the portable fallback only — items the role's navigation provides (`MCProject.navProvides`) are left out, so MULTIPLECORP renders no row and a flat-tree project keeps it |
| Single-date field | `MCDateField.html({ id, name, value, min, max, label, describedby, required })`, `MCDateField.value(el)` / `.set(el, iso)` | read-only "14 Okt 2026" field + calendar addon; a hidden native date input holds the ISO value and opens the browser picker; typed fallback parses "14 Okt 2026", "14/10/2026", "2026-10-14" (D-45) |
| Command row | `<button type="button" class="pt-row has-chevron" data-action=…>` | a list row that runs a command (e.g. pick the project for "Buat Invoice") instead of navigating; same look as a link row |
| Action density report | `python tools/ux_density.py [--role admin] [--json f] [--md f]` | buttons / primaries / header controls / filters / cards above the fold, row buttons, duplicate destinations, phone fold %; a report for manual review |

## 5. Navigation components (r12)

One tree (`navigation.sidebar` → `MCProject.navTree()`) rendered by ONE shell renderer (`MCNavTree`) into the
sidebar, the icon rail and the drawer. Model, marking algorithm and schema: `docs/NAVIGATION_ARCHITECTURE.md`;
decisions D-47 … D-51.

| Component | Markup / API | Notes |
|---|---|---|
| Nav section | `[data-shell-nav]` > `<p class="shell-nav__group">` heading + `<ul class="shell-nav__list" role="list">`; `<hr class="shell-nav__divider">` between sections | a heading, not a level ("Khusus Owner"); a section with no visible entry is absent |
| Nav leaf (level 1) | `a.shell-nav__link[data-nav-key]` > icon + `.shell-nav__label` | a destination; current = the Golden pill + indicator + primary ink; long labels ellipsize with the full label as tooltip |
| Nav group | `li.shell-nav__item--group[.is-open][.has-current]` > `button.shell-nav__toggle#snav-g-<id>[data-nav-group][aria-expanded][aria-controls="snav-s-<id>"]` (icon, label, chevron) | disclosure only: Enter / Space toggles, focus stays, never navigates, never a flyout; semibold while it holds the current entry; takes `aria-current="true"` only while its current child is not visible; a group of one renders as a flat leaf |
| Nav child (level 2) | `ul.shell-nav__sub#snav-s-<id>[role="list"][aria-labelledby][hidden]` > `a.shell-nav__sublink[data-nav-key]` | no icon, no children, no box; current = primary ink + semibold + 2 px accent rule on the level-1 indicator axis; rows 36 × `--du` on fine pointers, 44 px on coarse pointers |
| Active state | `aria-current="page"` (the entry) or `"true"` (a detail / task inside it), from `MCProject.navCurrent()` | exactly one per landmark (sidebar, drawer, bottom bar); never on a control that is not a location; no badge, count, dot or pulse |
| Collapsed group | the child list `[hidden]`, chevron `>`; open = chevron rotated 90° | only the current group is open on load; groups toggle independently; nothing persisted; reveal `--mc-dur-base` / `--mc-ease-reveal`, collapse `--mc-dur-state` / `--mc-ease-exit`, chevron `--mc-dur-moderate` / `--mc-ease-standard`; instant under reduced motion |
| Icon rail | collapsed desktop (brand-row toggle, Ctrl / Cmd + B) and tablet 768–1024 px; `MCShell.railed()`, `syncRail()` | level-1 icons with tooltip + accessible name; leaf icons link; a group icon is the same button with `aria-haspopup="dialog" aria-controls="mc-navdrawer"` and opens the drawer at its group; the section label folds to a hairline; scrolls when taller than the viewport; avatar at the foot |
| Mobile drawer tree | `#mc-navdrawer`, `MCNav.open({ group })`; ids `dnav-g-` / `dnav-s-`; links `[data-drawer-link]` | the same tree from `navTree()` (never a sidebar DOM copy); current group open, current entry marked; account block last; 44 px rows on touch; every open starts with the target group's header in view; modal contract unchanged (focus trap, Esc / scrim / Back, focus return) |
| Bottom item | `a.mc-bottom-nav__link[data-nav-key][aria-current]` from `MCProject.bottomItems()` | the role's level-1 destinations (`navigation.bottom`, ≤ 5); a group opens its landing; `"page"` on its landing, `"true"` inside its area, nothing outside the bar; hidden while a focused task's action bar shows (D-38) |
| Scroll edges | `.shell-nav` / `.mc-navdrawer__body` + `.has-more-start` / `.has-more-end` | the nav list scrolls between the pinned brand row and account block; the current entry is revealed on load (row boundary, header first); a scroll shadow (never a fade) only while a row is hidden beyond an edge; lead / trail space inside the scroll area (`--nav-lead` / `--nav-trail`) |
| Static fallback | `tools/shell_sync.py` (`--check`) | the 2-level tree per page from `data-route`; group header = a link to its landing (no `aria-expanded`); every child list present; the page's group `.is-open`; `.mc-js .shell-nav__sub:not(.is-open){display:none}` until JS takes over |
| Palette "Navigasi" | `MCProject.navIndex()` | every entry the account may open ("Grup › Label"), entries hidden for the role included; the current address left out |

**Responsive transformation**

| Width | Level 1 | Groups | Children | Drawer | Bottom bar |
|---|---|---|---|---|---|
| ≥ 1025 px, expanded | sidebar rows (icon + label) | disclosure inline | inline, indented | only from the collapsed rail | — |
| ≥ 1025 px, collapsed | rail icons | the icon opens the drawer at the group | in the drawer | the full tree | — |
| 768–1024 px | rail icons (always) | the icon opens the drawer at the group | in the drawer | ≡ rail menu (current group) | — |
| < 768 px | in the drawer | disclosure in the drawer | in the drawer | app-bar Menu (≡) | the role's slots (MULTIPLECORP 4) |

**When NOT to nest** (full list: `docs/NAVIGATION_ARCHITECTURE.md` §12): a one-screen area (flat leaf); states,
filters, periods, report types or record parts (tabs / filters); records, create flows or actions (rows, links,
buttons); anything needing a third level; views sharing one toolbar or time window (one page with tabs); a shortcut
to a filtered list (a scoped contextual link); an overview that only repeats its children; a canonical screen
that is not built.

