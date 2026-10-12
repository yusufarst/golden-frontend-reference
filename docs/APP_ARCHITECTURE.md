# MULTIPLECORP Golden Reference — App architecture (v1.0 Freeze Candidate)

How the prototype runs. What each layer means is in `docs/AGENT_START_HERE.md`; visual rules in
`docs/DESIGN_SYSTEM.md`; components in `docs/COMPONENT_CATALOG.md`.

## 1. Runtime model
- Static pages in `pages/`, one file per route; opened from disk (`file://`) or any static server.
- r13 (D-52 draft, `docs/PERSISTENT_SHELL.md`): served over HTTP (`serve.cmd` / `tools/serve.py`,
  http://127.0.0.1:8137/) the persistent-shell router `assets/js/router.js` (`MCRouter` + `MCScope`) swaps only
  the page in place (sidebar, account block, top-bar search and toasts stay mounted); on `file://`, or on any
  failure, every navigation is the full document load of r12 — D-04 "route registry without a router" is that
  fallback.
- No build, no network, no storage beyond the tab (`sessionStorage` for the project /
  role preview, the company view, and records created during the session).
- Each page carries the full app shell markup (sidebar, app bar, top bar, bottom bar) as a no-JS
  fallback; the JS shell rebuilds navigation from `project-config.js`. `tools/shell_sync.py` keeps the
  fallback identical to the configuration. r12: the fallback is the static two-level tree for the page's
  `data-route`; at runtime ONE renderer draws the role's tree (`MCProject.navTree()`) into the sidebar, the
  icon rail and the drawer (`docs/NAVIGATION_ARCHITECTURE.md`).

## 2. Load order (every module page)
```
<head>
  project-config.js           sync: project, routes, modules, roles, time, brand (before first paint)
  tokens.css base.css components.css patterns.css [modules/<m>.css] motion.css
<body>
  icons.js                    sync, first in <body>: SVG sprite + the html.mc-js flag
  …shell markup… <main data-region="content"> page body </main>
  router.js                       defer, FIRST (r13): MCScope + MCRouter (active over HTTP only)
  fixtures/multiplecorp-data.js   defer: window.MC_DATA + MCData (Layer C data)
  patterns.js                     defer: MCUI, MCList, MCFilter, MCCompany, MCTabs, MCSeg, MCSheet,
                                         MCRisk, MCAction, MCPage, MCPalette, MCForm.num (Layer A)
  docs.js · guide.js · composer.js  defer (r13 phase 5a, shared runtime): MCDoc (one paper renderer +
                                         MCDoc.totals), MCProgress / MCChecks / MCResult / MCNext / MCPrereq,
                                         MCComposer — docs/DOCUMENT_SYSTEM.md
  modules/domain.js               defer: MCApp (Layer C helpers: scope, links, statuses, session
                                         records, palette record provider)
  modules/<module>.js             defer: renders the page body from the data
  interactions.js                 defer, last: shell, palette, selects, disclosures, long text,
                                         toasts, dialogs, account menu, date range, entrance motion
```
Deferred scripts run in document order after parsing, so a page renders its content before
`interactions.js` enhances it — exactly like the static reference pages 01–04.

## 3. Global objects
| Global | Owner | Purpose |
|---|---|---|
| `MC_PROJECT`, `MCProject` | project-config.js | resolved configuration; `navItem`, `sidebarGroups`, `bottomKeys`, `accountMenu`, `can`, `role`; r12 navigation: `navTree`, `navCurrent`, `bottomItems`, `navIndex`, `navProvides`, `navCovers`, `home` (signatures: `docs/NAVIGATION_ARCHITECTURE.md` §9) |
| `MCRoutes` | project-config.js | `all`, `get`, `href(id, params)`, `allowed`, `current`, `param`, `trail`, `modules`; r12 `view(id, value)` |
| `MCTime` | project-config.js | the one clock (`now`, `today`, `parts`, `band`, `greeting`; injectable via `MC_TIME_NOW`) |
| `MCBrand`, `MC_BRAND` | project-config.js | brand slots |
| `MC_DATA`, `MCData` | fixture | demo data + status registry (`statuses`) |
| `MCApp` | modules/domain.js | `list/get` (fixture + session records), `company`, `scope`, `href(kind, id)`, `st(state)`, `session`; r13: `numbering` (the ONE numbering service: `state`, `cue`, `blocker`, `issue` idempotent per command, `lookup`, `peek` for 97, `recordId` for lab display identifiers; `nextNumber` = `recordId`), `taxProfile`, `docTotals`, `issuer`, `quotationPaper` |
| `MCDoc`, `MCComposer`, `MCProgress`, `MCChecks`, `MCResult`, `MCNext`, `MCPrereq`, `MCForm` | docs.js, composer.js, guide.js, patterns.js | r13 phase 5a document system (`docs/DOCUMENT_SYSTEM.md`) |
| `MCUI`, `MCList`, `MCFilter`, `MCCompany`, `MCTabs`, `MCSeg`, `MCSheet`, `MCRisk`, `MCAction`, `MCPage`, `MCPalette` | patterns.js | page patterns |
| `MCShell`, `MCNav`, `MCAccount`, `MCDialog`/`MCConfirm`, `MCToast`, `MCDateRange`, `MCSelect`, `MCUpload`, `MCDisclosure`, `MCSplit`, `MCLongText`, `MCGreeting`, `mcMotion` | interactions.js | shell and shared behaviour; r12: `MCNav.open({ group })` opens the drawer at a group, `MCShell.navigate` emits the cancelable `mc:navigate`, `MCNavTree` is the internal tree renderer |

## 4. Routes and navigation
`ROUTES` (project-config.js) is the single list of screens. Navigation, breadcrumbs (`MCPage.crumbs`
walks `parent`), the command palette (`MCRoutes.modules`), the role guard (`MCPage.guard`), the app map
(`tools/make_app_map.py`) and the integrity test (`tools/route_check.py`) all read it — no route is
defined twice. Detail routes read `?id=` (and open their default fixture record without it); parts use
`?tab=`; list filters may use `?state=…` (review hook for loading/empty/error) or module-specific
parameters documented on the route.

r12: `ROUTES.parent` is the TRUE ancestor only (`null` on a destination whose siblings are their own navigation
entries), so breadcrumbs show hierarchy and never a sibling. `ROUTES.defaults` and `ROUTES.views` let one route
serve several navigation entries (85 `?jenis=`, 91 `?tab=`); addresses compare after defaults. The navigation is a
separate layer over the registry: `navigation.sidebar` (one two-level tree per project) decides the entries,
`MCProject.navCurrent()` locates the current address in it (exact entry, else the parent walk, else the module),
and pages ask `MCProject.navProvides()` before offering an unscoped link the tree already provides. Model, trees,
the 48-route taxonomy and the APIs: `docs/NAVIGATION_ARCHITECTURE.md`.

## 5. Roles, companies and scope (prototype semantics)
- `?role=admin` merges `roleFixtures.admin` (Admin Operasional, two company grants, a capability
  list). Navigation hides modules/routes outside role or capability; opening one renders the
  not-found page (canonical behaviour). **Real authorization is a backend responsibility.**
- r12 (D-48): three meanings, never mixed — `ROUTES.roles` = access (not-found outside it); node `roles` /
  `hiddenForRoles` = presentation in the persistent navigation only (the palette still lists the entry; r13:
  MULTIPLECORP no longer hides any Owner entry, D-51 (r13));
  `capability` = a hint. The Admin's tree and bottom bar come from the same configuration as the Owner's
  (`navigation.bottom.admin`), never from a role-fixture navigation override.
- Company view (`MCCompany`) filters lists; it is a view, not a permission. Admin lists show only granted
  companies; pooled stock lots of other companies show "perusahaan lain".

## 6. Data flow
Fixture (read-only) → `MCApp.list/get` (adds session-created records and session patches) → page
module renders with `MCList` / `MCTabs` / `MCUI` → user commits via `MCRisk` → the module writes the
result with `MCApp.session.add/patch` → the change is visible on this page and on related pages during
the session (e.g. a purchase saved on 03 appears in 20 and opens in 21). Reloading keeps session
records; a new tab starts clean. Nothing leaves the browser.

## 7. Commands and outcomes
Prototype commands simulate latency (≈700 ms, 300 ms under reduced motion) and always succeed unless a
page demonstrates a failure state. Production contract (EXTERNAL / BACKEND RESPONSIBILITY): every
command carries a client-generated command id; the server is idempotent per id and answers COMMITTED,
REJECTED (validation / rule), CONFLICT (state changed meanwhile → reload the record), PENDING (accepted,
result later) or FAILED (nothing changed → retry). The UI maps them to: result in place + toast,
inline error, conflict notice with "Muat ulang", pending pill, error toast with retry.

## 8. Testing and tools
See `docs/AGENT_START_HERE.md` §16. All captures and tests inject `MC_TIME_NOW =
'2026-10-14T09:00:00+07:00'` so dates are deterministic.

## r13 Phase 7 — route-level capability guard and cross-module contracts
- **Route capability** (Layer B registry): a command screen declares the capability of its canonical audience,
  `ROUTES[id].capability` (MULTIPLECORP: 12 projects.manage · 03 purchase.manage · 32 stock.receive · 33 stock.dispatch ·
  36 stock.count · 41 delivery.record · 65 payment.record · 82 reports.export - the same names as the domain's task map).
  `MCRoutes.allowed(id)` checks role + module + route capability; `MCRoutes.denial(id)` says WHY:
  `'forbidden'` (the screen is part of this role's application, the capability is missing → MSG-10 with a reference
  code, nothing of the record) or `'notfound'` (unknown route, another role's screen, a module the account cannot open →
  MSG-09; AZ-11 keeps "exists" and "not yours" indistinguishable).
- **Where it runs**: every module calls `MCPage.guard()` FIRST, before reading a record; direct load, in-shell navigation
  (router mount) and Back/Forward all mount the module, so all three are covered. Links and buttons to a refused route are
  never offered (`MCApp.canGo` reads the same registry).
- **Not a security boundary**: the frontend guard is a courtesy and a design contract. Production APIs must enforce every
  capability, company scope, record ownership and state transition themselves, and answer 403 / 404 the same way.
- **One transition contract per business event**: an event that changes several views (an approval confirms the project,
  pins the lines and logs the activity) is ONE command handler in the module; pages re-derive their state (stage strip,
  next step, queue) from records - no page stores progress, no navigation mutates anything.
