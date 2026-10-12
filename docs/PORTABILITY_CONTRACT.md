# MULTIPLECORP Golden Reference — Portability Contract (v1.0 Freeze Candidate, r10; navigation r12)

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL**. Lab only; nothing here is
integrated into the canonical MULTIPLECORP repository.

The Golden Reference defines **how** an application looks and behaves. A real project (MULTIPLECORP
or a future client) supplies **what** it contains: roles, permissions, navigation, business flows,
documents, actions, data, branding and copy. This contract draws that line so a project can adopt
the system without rewriting component CSS and without editing several HTML files.

- One configuration file: `assets/js/project-config.js` (loaded synchronously in `<head>`).
- One token file: `assets/css/tokens.css`: the **project brand tokens** (`--brand-*`, the only colours a
  project re-tints) and the fixed Golden tokens (everything else).
- Everything else (component CSS, page patterns, motion, interaction behaviour) is the **fixed Golden layer**.
- r10: the screens themselves are configuration too: `ROUTES` (every screen) and `MODULES` (navigation
  destinations) live in the same file; the business data is a separate fixture file
  (`assets/js/fixtures/<project>-data.js`) read through a small domain helper (`assets/js/modules/domain.js`).

### Responsibility classes (r10)
Every rule in the docs is one of:

| Class | Meaning | Examples |
|---|---|---|
| **GOLDEN FIXED** | design system; every project follows it | 44 px phone targets, density units, overlay contract, risk levels, long-text contract, live-status rule, text-first headings, stepper geometry |
| **PROJECT CONFIGURABLE** | `project-config.js` | brand, colours (`--brand-*`), locale, time zone, routes, modules, navigation, bottom bar, roles, account menu, date-filter rules, feature flags |
| **BUSINESS FIXTURE** | demo data / project contract | MULTIPLECORP companies, clients, numbers, status labels, figures |
| **PROJECT IMPLEMENTATION RESPONSIBILITY** | built per project on the patterns | page modules, authorization rules per screen, which actions are COMMIT / DESTRUCTIVE / CRITICAL |
| **EXTERNAL / BACKEND RESPONSIBILITY** | never simulated as real | authentication, authorization enforcement, idempotent commands, numbering, PDF rendition, storage, audit persistence, server time |

---

## 1. Fixed Golden rules (not project-configurable)

These are the design system. Projects follow them; they do not re-decide them per screen.

| Area | Fixed rule |
|---|---|
| Visual language | Inter; ivory / white surfaces; near-black text hierarchy; restrained semantic colours; one icon family (24-unit grid, stroke ratios); radius family 4 / 6 / 8 / 10 / 12; subtle borders and shadows. |
| Density | Runtime units, never zoom or `transform: scale()`: `--du` geometry, `--dt` display text, `--tu` fixed text above 12 px, `--iu` icons (`tokens.css`). Desktop has the browser-zoom-100 % comfort the owner validated near 90 %. Phones never compress touch targets (≥ 44 px) or reading sizes. |
| Layout | Desktop sidebar + calm top bar; tablet icon rail + drawer; phone app bar + bottom navigation + drawer. One responsive implementation per page. Content stops growing at 1680 px. |
| Navigation model | r12: ONE two-level tree per project (sections → level-1 leaf or disclosure group → child links) drives the sidebar, the icon rail, the drawer and the palette; group headers only open and close (never navigate, never a flyout); only the current group is open on load, nothing persisted; exactly one `aria-current` per landmark ("page" / "true"); bottom navigation = frequent level-1 destinations (max 5), lit for their whole area; drawer = the complete allowed tree; device / browser Back = hierarchical return (r9: no explicit app-bar Back unless `navigation.mobileBack`); Menu = global navigation; sticky action bar = page actions above the bottom navigation. Detail, task, account and system routes are never entries. `docs/NAVIGATION_ARCHITECTURE.md`. |
| Account placement | Desktop: bottom of the sidebar. Tablet rail: avatar at the bottom of the rail; drawer: account block at its bottom. Phone: inside the navigation drawer only, at its bottom. Never a permanent top-right control, never in the bottom navigation, never floating. |
| Account menu content | Personal and session actions only (profile, account settings, keyboard shortcuts, sign out). Organisation destinations stay in the role navigation so no destination has two homes. |
| Section headings | Text only (r9): no decorative heading icons; icons only for navigation, actions, status and identity / content markers. |
| Progressive disclosure | Phone only (r9): substantial sections fold behind a text title + right chevron; defaults are configuration; an invalid field is never hidden (its section opens). Tablet / desktop never become accordions. |
| Page actions | ONE split primary action per page action region (r9): primary segment + chevron menu with the secondary actions (destructive last, danger tone); the primary is never repeated in the menu. |
| Confirmation | Secondary confirmation only for: logout / session termination, destructive deletion, meaningful irreversible operations, actions likely to cause data loss (e.g. Batal on a form with changes). Never for ordinary low-risk actions. Styled dialog (`MCConfirm`), never `confirm()`; the safe choice is focused; Esc / scrim cancel. r9: application-level (full scrim, centred on the viewport, no decorative icon); drawer / menu flows close first. |
| Action hierarchy | One primary per context; secondary = outline; tertiary = ghost / text; destructive = solid red only on the confirming button. Desktop footers align with the content column; phones show at most two actions in the bar. |
| Date range | Presets + a true custom range: independent START and END calendars with month and year pickers, inclusive range, end ≥ start, Terapkan only for a valid range, Batal / Esc never commit, reopening shows the committed state. Desktop popover with two calendars; tablet popover and phone sheet with a Mulai / Selesai switch. |
| Feedback | Toasts for events without a field (top-right under the top bar, below the app bar on phones, max 3, success / info auto-dismiss, warning / error stay); inline errors stay inline; toast-safe offsets avoid `[data-toast-avoid]` controls. |
| Motion | Token durations and curves (`docs/MOTION_SYSTEM.md`); reduced motion = 150 ms fades. |
| Accessibility | WCAG AA contrast, visible focus, dialog / menu / listbox / grid semantics, focus trap + return, Esc, live regions, no colour-only status, ≥ 16 px text fields on touch devices (prevents the iOS focus zoom that once caused sideways scrolling). |

---

## 2. Project-configurable values

All in `assets/js/project-config.js` → `FIXTURES.<project>`. A fixture only lists what differs from
the default project (objects merge, arrays replace; `brand.logo` and `brand.mark` replace the default
**whole**: r7 fixed a merge that let a project mark `{ src }` inherit the default `{ symbol }`, so the
rail and the mark + name slots kept showing the MultipleCorp mark).

### 2.1 Branding — `brand`

| Key | Meaning | Default (MultipleCorp) |
|---|---|---|
| `name` / `short` | application name / short name (titles, tight slots) | MultipleCorp |
| `company` | client or company display name (greeting subtitle) | MultipleCorp |
| `logo` | full horizontal logo `{ src, width, height }` or `null` (mark + name text) | `null` |
| `mark` | compact mark `{ symbol }` (sprite) or `{ src }` (image) | sprite `i-logo-mark` |
| `alt` | logo alt text | MultipleCorp |
| `favicon` | favicon path | the mark SVG |
| `title` | document title template (`{page}`, `{name}`, `{short}`) | `{page} · {name}` |
| `display` | text in `[data-brand-name]` slots: `'name'` or `'short'` | `'name'` |

Brand slots in markup: `[data-brand]`, `[data-brand-mark]`, `[data-brand-name]`, `[data-brand-company]`,
`[data-brand-label]`, `title[data-page]`, `link[data-brand-favicon]`.

**Deterministic logo rule (r7).** A logo or wordmark asset is drawn with vector paths only: no SVG
`<text>` / `<tspan>` and no `font-family`, because SVG text falls back to whatever fonts the device
has and renders differently per OS. An application **name** shown as text is rendered by the app in
Inter (`[data-brand-name]`), never inside the image. Slot behaviour:

| Slot | Logo `{ src }` | No logo |
|---|---|---|
| Desktop sidebar, phone app bar, drawer header, Login | the wide logo, contained at its natural ratio (never stretched) | mark + name text |
| Tablet rail (80 px) | the mark only | the mark only |
| Name too long for the slot | — | steps down one size, then ellipsis; the full name becomes the tooltip; the slot link keeps the full accessible name |

QA fixtures: `?project=nusantara` (wide vector logo, teal tokens, `display: 'short'`) and
`?project=longname` (no logo, long name, alternate mark). Neither is ever the default.

### 2.2 Locale — `locale`

`default` (first language of the Login; app pages follow `<html lang>`), `secondary` (the Login
toggle). `?lang=` overrides for QA. Fixture content (dashboard data, form labels) is Indonesian
sample content; real projects bring their own copy tables.

### 2.3 Time — `time`

| Key | Meaning |
|---|---|
| `zone` | IANA timezone for greetings and "today" (default `Asia/Jakarta`) |
| `bands` | `[{ id, from, to, icon }]` local hours `[from, to)`; the last band may wrap past midnight |
| `greetings` | `{ id: { morning, midday, afternoon, evening }, en: {…} }` |
| `now` | time provider function; `null` = device clock. Production binds it to authoritative server time. |

Default bands: 04:00–10:59 Selamat pagi · 11:00–14:59 Selamat siang · 15:00–17:59 Selamat sore ·
18:00–03:59 Selamat malam (EN: Good morning / Good afternoon / Good afternoon / Good evening). Checked
points: 08 pagi · 12 siang · 16 sore · 20 malam · 02 malam (EN 02 = Good evening: "Good night" is a
farewell, not a greeting).

**One time source (r7).** `MCTime` is the only clock. Every current-date concept reads it: the
greeting, "Hari ini" and every relative preset, "Bulan ini", the date filter limits, the calendar's
today marker, the dashboard's "per <date>" label and the save time in toasts. Nothing hard-codes a
"today" any more (the r6 `dateFilter.today` fixture is gone).

| API | Use |
|---|---|
| `MCTime.now()` / `.today()` (ISO, project zone) / `.parts()` / `.band()` / `.greeting()` | read the clock |
| `MCTime.zone`, `.locale`, `.injected` | project timezone, formatting locale, whether a provider is injected |
| `MCTime.setNowProvider(fn)` | swap the provider at runtime (fires `mc:timechange`) |
| `window.MC_TIME_NOW` | function or ISO string set **before** `project-config.js` (tests, evidence, hosts) |
| `window.MC_PROJECT_PATCH` | r9: object merged over the resolved project before first paint (host / test seam, e.g. `{ navigation: { mobileBack: true } }`); production configures `FIXTURES` |
| `mc:timechange` | one shared minute clock fires it when the greeting band or the calendar day changes; greeting, presets and labels follow |

Runtime = the device clock in the project timezone (or the host's provider). Tests and evidence
always inject the fixture time `2026-10-14T09:00:00+07:00` (`tools/behaviour_test.py launch()`,
`tools/render.py --now`, `tools/layoutcheck.py --now`, `tools/domprobe.py --now`; `--now real` uses
the machine clock) so no result depends on the wall clock. Works offline.

### 2.4 User and role — `user`

`id`, `name`, `initials`, `role` (drives role-aware navigation, routes and menus), `roleLabel`, `email`
(shown at the top of the account menu), `companies` (`'all'` or company codes: the company view and the
Admin scope) and `capabilities` (`'all'` or a list: modules with a `capability` hide without it). In
production these come from the session. r10 QA hook: `roleFixtures.<key>` is merged for `?role=<key>`
(MULTIPLECORP: `?role=admin` = Admin Operasional with two company grants; `?role=owner` returns). Reusable markup carries no
person: the drawer identity and the Motion Study specimens ("diunggah …", history lines) read the
configured user.

### 2.5 Navigation — `navigation`

| Key | Meaning |
|---|---|
| `home` | r12: module key or node id of the brand / not-found "Beranda" entry (default: the first level-1 leaf). |
| `sidebar` | r12: `Section[]` — `{ id?, label?, roles?, capability?, enabled?, items }`; an item is a module key (the r6–r11 flat leaf, still valid) or a Node `{ id, module?, label?, icon?, route?, routeByRole?, params?, match?, children?, landing?, roles?, hiddenForRoles?, capability?, enabled? }` whose `children` are leaf links (max two levels). The sidebar, the rail, the drawer and the palette all render this one tree. Field rules: `docs/NAVIGATION_ARCHITECTURE.md` §8. |
| `bottom` | `nodeId[]` (one bar for every role) or r12 `{ default: nodeId[], <role>: nodeId[] }`; at most 5 visible level-1 ids; a group opens its landing child. |
| `mobileBack` | r9, default `false`: an explicit "Kembali" in the phone app bar (replaces the brand) to the page's `body[data-nav-parent]` destination. Enable only when browser history cannot represent the workflow (standalone app, deep task flows). |
| `items` | optional per-project overrides of catalogue entries `{ key: { label, icon, href } }`. |

Catalogue entries (`CATALOGUE`, r10: derived from `MODULES`): `label {id, en}`, `icon` (sprite id
without `i-`), `href` (the module's landing route file). Pages declare their route with `body[data-route]`;
r12: the navigation locates the page from it (`MCProject.navCurrent()`: exact entry, else the `ROUTES.parent`
walk, else the module), so `body[data-nav-section]` is only the static no-JS hint. `body[data-nav-parent]`
(r9) names the parent destination (the optional mobile Back and the "Batalkan pembelian" exit go there;
`tools/shell_sync.py` falls back to the exported `home`).

**Visibility meanings (r12 contract, D-48)** — never mixed:

| Field | Meaning | Effect |
|---|---|---|
| `ROUTES[id].roles` | ACCESS | outside it the route answers the not-found page; no entry, link or palette item offers it |
| node / section `roles` | PRESENTATION (audience) | the entry is absent from the persistent navigation for other roles (keep it consistent with `ROUTES.roles`) |
| node `hiddenForRoles` | PRESENTATION (a deliberate choice) | absent from sidebar, rail, drawer and bottom bar for those roles; access, capability and the palette entry stay |
| `capability` (module, node, child; a list = all of them) | HINT | the entry or control is absent without it; the server decides every request |

Hidden means absent, never disabled. Real authorization remains an EXTERNAL / BACKEND RESPONSIBILITY.

**Runtime API (r12)**: `MCProject.navTree()`, `navCurrent(route?, params?)`, `bottomItems()`, `navIndex()`,
`navProvides(route, params)`, `navCovers(route, param, values)`, `home()`; the r6 `navItem()`, `sidebarGroups()`
and `bottomKeys()` keep their shapes (derived from the tree); `MCRoutes.view(id, value)`; `MCNav.open({ group })`;
`MCTabs` view mode; `MCPage.subnav` filtering. Signatures: `docs/NAVIGATION_ARCHITECTURE.md` §9. Shared code
never names a project route, label or module.

**Static fallback**: `python tools/shell_sync.py` writes the two-level tree into every shell page from its
`data-route` (every child list present, the page's group open with its current child marked, group headers as
links to their landing); `--check` fails when a page is out of step with the configuration.

**Fixtures that prove the contract**: the default `multiplecorp` Owner (the hierarchical tree, 12 level-1 rows,
31 entries); `?role=admin` (the same tree filtered by role and capability, 10 rows and 23 entries, bottom bar from
`navigation.bottom.admin` — no navigation override in `roleFixtures`); `?project=nusantara` (the legacy flat form:
8 string entries in its own sections, a bottom array — its pages keep the sub-navigation and tab rows because its
tree does not list those siblings, and its palette re-adds the module landings its tree lacks); `?project=longname`
(the default tree under a long brand name).

### 2.5r Routes and modules — `ROUTES`, `MODULES` (r10)

`ROUTES` = `{ id: { file, title {id,en}, module, group, archetype, parent, params, roles, shell } }`, one
entry per screen (r12: `parent` is the true hierarchical parent only, `null` on a destination whose siblings are
their own navigation entries; optional `defaults: { param: value }` and `views: { param, titles }` let one route
serve several entries, e.g. 85 `?jenis=`, 91 `?tab=`); `MODULES` = `[{ key, label, icon, route, routeByRole?, enabled?, roles?, capability?,
bottomNav?, extra? }]`. A fixture may override with `routes: { id: {...} | null }` and
`modules: { key: { enabled: false, ... } }`. Read through `window.MCRoutes` (`href`, `current`, `trail`,
`allowed`, `modules`). The app map (`tools/make_app_map.py`), the command palette, breadcrumbs, the role
guard and `tools/route_check.py` read the same registry. Contract details: `template/TEMPLATE_MANIFEST.json`.

### 2.5a Phone section disclosures — `mobileDisclosure` (r9)

`{ <data-disclosure key>: 'open' | 'collapsed' }`. Defaults: `dash-aging`, `dash-projects`,
`dash-value` collapsed; `purchase-info`, `purchase-items` open (required fields / primary workflow);
`purchase-attach`, `purchase-summary` collapsed. A section holding a validation error always opens.
Markup contract: `.mc-disclosure[data-disclosure]` > `[data-disclosure-head]` (title, optional summary,
the `[data-collapse-toggle]` button with `aria-controls`) + `.mc-disclosure__body`. API:
`MCDisclosure.reveal(node) / open(card) / close(card) / isOpen(card)`.

### 2.5b Split primary action — page markup (r9)

`[data-split]` > `.mc-split__main` (the primary action) + `[data-split-toggle]` + `[data-split-menu]`
(`role="menuitem"` items, `role="separator"`, `.mc-split__item--danger`). Labels, items and their
actions are page markup / copy (Create Purchase: "Simpan dan lanjutkan" | "Simpan sebagai draf",
"Batalkan pembelian"); the component CSS and `MCSplit` behaviour are fixed Golden layer.

### 2.6 Account — `account`

`menu`: `[{ id, label, icon, href? | action?, tone?, roles?, pointer? } | { separator: true }]`.
Actions: `logout` (confirmation flow), `shortcuts` (reference dialog; `pointer: 'fine'` hides it on
touch). `logout`: `{ enabled, confirm, redirect }` (`redirect: null` = stay; the host ends the session).
Separators are trimmed automatically after role / feature filtering. Event `mc:logout` (cancelable,
`detail.redirect`) lets a host end the session itself. `adminLabel` (r7): who issues accounts and
resets passwords; Login copy uses it through the `{admin}` / `{Admin}` placeholders (default `Owner`,
`nusantara` = `admin TI` / `IT admin`).

### 2.7 Date filter — `dateFilter`

`presets` (subset and order of `today`, `last7`, `last1m`, `thisMonth`, `lastMonth`, `custom`; custom
is always available), `default`, `min`, `max`. Limits are an ISO date or relative to `MCTime.today()`:
`'today'`, `'startOfYear±N'`, `'endOfYear±N'`, `'±Nd'` / `'±Nm'` / `'±Ny'` (default `startOfYear-2` …
`endOfYear+1`, so planned periods stay selectable). Preset semantics: `docs/DESIGN_SYSTEM.md` § 10.4.

**Period response is DEMO / FIXTURE only (r7).** The lab has no ledger. `#dash-data` describes one base
period; when the filter commits another range the dashboard swaps in a deterministic sample variant
(same range = same figures; flows scale with the range length, the receivable snapshot and its ageing
total stay consistent, labels say what the figures cover) so the page visibly reacts. It implies no
accounting semantics. Production binds `mc:daterange` to its query layer and deletes the demo block
(`interactions.js` § 2.3).

### 2.8 Feature flags — `features`

| Flag | Effect when `false` |
|---|---|
| `search` | removes the top-bar search and the app-bar search (the palette stays on Ctrl K) |
| `shortcuts` | removes the keyboard-shortcut entry and the `?` key |
| `authVisual` | Login keeps its layout and motion but replaces the photographic scene with a calm brand-tinted panel |
| `dateFilter` | removes every `[data-daterange]` period filter |
| `bottomNav` | removes the phone bottom navigation (the drawer remains the navigation) |

Flags are mirrored as `html[data-no-<flag>]` for CSS. r8: the `promo` flag is gone with the sidebar
promo card it controlled; the authenticated shell never renders marketing content, so there is
nothing to switch.

### 2.9 Project brand tokens — `tokens`

A fixture's `tokens` override **project brand tokens only** (`tokens.css` → "PROJECT BRAND TOKENS",
applied on `:root` before first paint). The `--color-*` aliases that components read point to them.

| Group | Tokens |
|---|---|
| Primary | `--brand-primary`, `-rim`, `-hover`, `-press`, `-deep` |
| Accent | `--brand-accent` (nav indicator, focus), `-strong`, `-link`, `-soft`, `--brand-focus-halo` |
| Tints | `--brand-tint-50 / 100 / 100-hover / 150 / 200`, `--brand-on-tint`, `--brand-signal`, `--brand-nav-hover / -press` |
| Auth CTA | `--brand-cta`, `-band`, `-hover`, `-ink`, `-glow`, `-shadow`, `-rim` |
| Brand states (r7) | `--brand-link-soft / -strong / -rule` (Login text links), `--brand-fill-rule / -wash` (filled code cell), `--brand-progress`, `--brand-step-done-line / -dot` (stepper) |

**Fixed, never re-tinted by a project:** text, surfaces, borders, semantic success / warning / danger /
info, chart categories, KPI tones and category discs (data colours, not brand), shadows, motion,
density. Component CSS names no brand hex (checked by `behaviour_test.py`). Default values are
MultipleCorp: the r7 split rendered pixel-identical to r6. Density: `--density-scale` (desktop .9) is
the single knob for desktop geometry. Keep contrast AA when overriding.

---

## 3. Fixture and business-content boundary

| Belongs to the Golden Reference | Belongs to the project |
|---|---|
| Component anatomy, states, spacing, motion, accessibility behaviour | Which pages exist, their data and business rules |
| Navigation *model* (what goes where and why; r12: two levels, disclosure groups, marking, rail / drawer / bottom transformation) | The actual destinations, roles and permissions (r12: the tree, its order and labels, the bottom slots per role) |
| Account menu *placement and rules* | The actual account entries |
| Date range *behaviour and semantics* | Which presets apply to which report, min / max |
| Feedback rules (toast vs inline) | The messages |
| Risk levels LOW / COMMIT / DESTRUCTIVE / CRITICAL (`MCRisk`) | Which project actions belong to which level |
| Page archetypes and patterns (`patterns.css` / `patterns.js`) | The screens built from them (`assets/js/modules/*`) |

Fixture content (Dimas, Owner, sample KPIs, purchase lines, Indonesian copy, the `nusantara` and
`longname` QA projects, the dashboard's demo period variants) demonstrates the rules; it is not a
MULTIPLECORP product specification. Reusable logic carries no project value: navigation targets come
from the tree (`MCProject.navTree()` / `navItem()`), people from `user`, copy placeholders from `brand` / `account.adminLabel`,
dates from `MCTime` (`behaviour_test.py` § r7.9 audits it).

---

## 3a. Reference canvas ≠ runtime size

The reference mockups are 1448 × 1086 images. That is the **comparison canvas** (`evidence/final/desktop/`,
`tools/compare.py`), not a target device. The runtime contract is the real viewport at browser zoom
100 %: 1280 × 720, 1366 × 768, 1440 × 900, 1536 × 864, 1920 × 1080, 1024 × 768, 768 × 1024, and phones
360 / 390 / 430 / 440. Layout decisions are validated at those sizes (plus the 1025–1046 breakpoint
band); a match on the canvas is never a reason to accept a defect at a runtime size.

## 3b. Acceptance boundary: physical iOS

Software checks cover what a browser engine can prove: no sideways scroll at 360–440 px, ≥ 16 px text
fields on touch devices (no focus zoom), safe-area insets through `env()`, `100dvh` fallbacks, bottom
bars above the home indicator, geometry stable after input focus and after every overlay. They run in
headless Chromium with touch + mobile emulation. **No physical iPhone was used.** Final acceptance on a
real iPhone (Safari keyboard, rubber-band scrolling, the dynamic toolbar) is an owner check.

---

## 4. Adopting the system in a project

1. Copy `assets/` (tokens, base, components, motion, icons, interactions, project-config).
2. Add a fixture to `project-config.js` (brand, locale, time, user, navigation, account, dateFilter,
   features, tokens) and point `DEFAULT` at it.
3. Build pages from the shell markup (sidebar with `[data-shell-nav]` and `[data-account]`, app bar,
   top bar, bottom navigation); navigation and account entries render from the configuration.
4. Mark each page with `body[data-page]` and `body[data-route]` (`tools/shell_sync.py` writes the static
   navigation and the `data-nav-section` / `data-nav-parent` hints).
5. Validate with `tools/behaviour_test.py` (canonical first-load, overflow, density, account, logout,
   date range, greeting, configuration, brand tokens, time provider; fixture clock injected),
   `tools/route_check.py` and `tools/nav_audit.py` (r12 navigation tree), and review frames from
   `tools/make_review.py`.

QA preview of another fixture: `?project=nusantara` or `?project=longname` (remembered for the tab;
`?project=default` resets; `?brand=` is the r5 alias).

## r13 Phase 7 — portable safety contracts
- `ROUTES[id].capability` (optional) + `MCRoutes.denial(id)`; the forbidden state and its MSG-10 copy are Layer A;
  the capability names come from the project's permission matrix (Layer B), never invented by the Golden.
- Context links (`?{param}=id`): the receiving screen validates the id in scope, preselects once, keeps the form clean,
  explains an invalid id; production resolves the id server-side with the same scope rules.
- Business date (PT-25): Layer A control; the project decides which commands carry it and how its period maps to
  numbering. Backend: period derivation, uniqueness, idempotency (`command_id`) and the stale-prefill CONFLICT.
