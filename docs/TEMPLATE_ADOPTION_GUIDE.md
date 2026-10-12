# Template adoption guide (for product and development teams)

How to start a new application from the MULTIPLECORP Golden Reference. Practical steps; the reasons
behind the rules are in `docs/DESIGN_DECISIONS.md`.

Status of the template: **v1.0 Freeze Candidate — pending Owner visual approval**. Adopt from the
frozen, approved version when it exists.

## What you get
- A design system with a calm, premium operational look that works from 360 px phones to 1920 px
  desktops at browser zoom 100 %.
- An application shell (sidebar, tablet rail, phone app bar + bottom bar + drawer, account placement,
  command palette, toasts, dialogs, date range, custom selects, uploads).
- Page patterns for every common screen type (lists, record hubs, forms with review, floor tasks,
  checklists, document preview, reports, settings, search, system pages).
- Rules that keep a growing product consistent: no dead controls, risk-based confirmation, long text,
  live status, motion, accessibility.
- Tools that check routes, links, dead controls, layout and regressions.

## What you bring
Your brand, your modules and screens, your roles and permissions, your business states and labels,
your data — and later, your real backend.

## Step by step
1. **Copy** the repository into a new folder. Keep `assets/css/*`, `assets/js/icons.js`,
   `interactions.js`, `patterns.js` and `template/page-skeleton.html` unchanged (Layer A).
2. **Configure** `assets/js/project-config.js` (start from `template/project-config.example.js`):
   brand (name, logo or mark, favicon), `--brand-*` colours, locale and time zone, roles, account menu,
   date-filter rules, feature flags.
3. **Map your product**: list your screens as `ROUTES` and your areas as `MODULES`. Decide the sidebar
   order (follow the work, not the org chart) and at most four or five phone bottom-bar destinations.
   r12: one clear function = one clear entry — a flat leaf for a one-screen area, a group (max two levels) for
   an area with several persistent destinations; details, tasks and actions are never entries
   (`docs/NAVIGATION_ARCHITECTURE.md` §10, §12).
4. **Choose an archetype per screen** (`docs/COMPONENT_CATALOG.md` §3). Resist making everything a
   dashboard of cards.
5. **Scaffold pages**: `python tools/shell_sync.py --new <route-id> --module <module>` for each route.
6. **Replace the demo data**: write `assets/js/fixtures/<project>-data.js` with deterministic,
   coherent sample data and your status registry (`STATE: { label, tone, live }`); write a small domain
   helper like `assets/js/modules/domain.js` (record links, scope, numbering).
7. **Build the page modules** (`assets/js/modules/<module>.js`, `assets/css/modules/<module>.css`) with
   the patterns (`MCList`, `MCTabs`, `MCFilter`, `MCRisk`, `MCSheet` …). Classify every action by risk.
8. **Check**: `python tools/route_check.py`, `python tools/nav_audit.py`, `python tools/clickability.py`, `python tools/a11y_check.py`,
   `python tools/ux_density.py` (action budget: one primary, no button soup — `docs/UX_PRINCIPLES.md`),
   `python tools/page_check.py <pages> --shots`, `python tools/make_app_map.py`, and extend
   `tools/behaviour_test.py` with your own rules.
9. **Review** with the generated `review/app-map.html` and an owner review page listing the screens
   that need judgement first.
10. **Connect a backend** later: authentication, authorization, idempotent commands, numbering, PDF
    rendition, storage and audit are backend responsibilities (`docs/APP_ARCHITECTURE.md` §7).

## Do and don't
| Do | Don't |
|---|---|
| Change brand tokens and configuration | Fork component CSS for one screen |
| Add a pattern to Layer A when two modules need it | Copy-paste the same styles into module files |
| Link with `MCRoutes.href()` | Write literal page paths in components |
| Give every control a real effect, or disable it with a reason | Leave `href="#"` or buttons that do nothing |
| Validate before confirming; summarise the consequence | Ask "Apakah Anda yakin?" for everything |
| Design the phone screen deliberately | Shrink the desktop table |
| Keep business words in the fixture and modules | Put business names in shared JS/CSS |

## Proving portability
The default project is MULTIPLECORP. Open any page with `?project=nusantara` (another client: brand,
locale, time zone, role, navigation, colours, date rules, features) or `?project=longname` (very long
application name) to see the same pages adapt from configuration alone; `?project=default` returns.
`?role=admin` previews the second MULTIPLECORP role.

## r13 Phase 9 — what R13 added for an adopting project
Read `docs/GUIDED_WORKFLOW.md` (guided work), `docs/DOCUMENT_SYSTEM.md` (paper, totals, numbering, identity / version /
date contract, composer) and `docs/PERSISTENT_SHELL.md` (router over HTTP). Configure: `ROUTES[id].capability` on command
screens, `help` (levels, tours, "Cara kerja"), composer templates (`stages`, `reviewFacts`, `businessDate`). Keep business
transitions in your Layer C modules; the Golden components carry no business words.

**Golden Frontend Reference v1 (candidate):** the entry point for any new project is `docs/GOLDEN_FRONTEND_V1_START_HERE.md` (scope, component inventory, adoption steps, consumer demo `examples/consumer-demo/`, smoke test `tools/golden_consumer_smoke.py`).
