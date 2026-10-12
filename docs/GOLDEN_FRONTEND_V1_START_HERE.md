# Golden Frontend Reference v1.0 · START HERE

Status: **FROZEN — OWNER APPROVED** · frozen on **2026-10-12** · baseline **golden-frontend-v1.0**
(record + SHA-256 inventory: `release/golden-frontend-v1.0/FREEZE_RECORD.md`; no Git tag - the workspace is not a Git
repository). Visual baseline: the Owner-approved R13 Refine design.
Approved scope: the reusable design system, frontend reference, component library, UX patterns, portability
documentation and the independent consumer demo. NOT approved by this freeze: MULTIPLECORP application QA (separate
status **MULTIPLECORP FULL APPLICATION QA — INCOMPLETE / VERIFICATION PENDING**), backend security, production readiness.
**Change policy**: v1.0 does not change. A change to anything in the frozen scope is released as an explicitly
versioned successor (v1.1 / v2.0) with its own freeze record; the files of v1.0 are identified by the checksum list.

## 1. What it is
A reusable **design system + frontend implementation reference** for future projects (MULTIPLECORP, BantuKasir, …):
tokens, components, responsive layouts, UX patterns, interaction and workflow conventions, and the plain
HTML / CSS / JavaScript code that implements them. MULTIPLECORP (procurement, warehouse, documents, finance) is the
**demonstration environment** that exercises every pattern on real screens.

## 2. What it is not
Not a production application, backend, authentication or authorization system, database, numbering service,
procurement engine, npm package, React / component-framework library or drop-in UI kit. Frontend route guards are a
courtesy, never security. Every business rule shown by the MULTIPLECORP pages belongs to MULTIPLECORP.

## 3. Component inventory (code that exists here; classification checked against the actual dependencies)
| Area | Files | Class | Notes |
|---|---|---|---|
| Design tokens, typography, colour, spacing, radius, surfaces, status tones | `assets/css/tokens.css`, `base.css` | **PORTABLE AS-IS** | brand via `--brand-*` tokens only (config `tokens`) |
| Component styles (buttons, fields, cards, pills/status, dialogs, sheets, toasts, shell, stepper, bottom nav) | `assets/css/components.css` | **PORTABLE AS-IS** | also carries the 03 reference-page section (`.pur-*`): unused elsewhere, removable |
| Pattern styles (page head, sections, lists + numbering + pager, composer, result, guidance, PT-25 date note) | `assets/css/patterns.css` | **PORTABLE AS-IS** | a few MULTIPLECORP page blocks (`.atq-*`, `.prj-*`) are dead weight elsewhere |
| Motion + reduced motion | `assets/css/motion.css` | **PORTABLE AS-IS** | |
| Icon sprite | `assets/js/icons.js` | **PORTABLE AS-IS** | replace `i-logo-mark` with your mark |
| Lists (`MCList` numbered by default, `MCPager`), status (`MCUI.pill/status`), filters, tabs, segments, sheets, risk confirmation (`MCRisk`), date fields, timelines, `MCBizDate` (PT-25) | `assets/js/patterns.js` | **PORTABLE WITH CONFIGURATION** | needs the project runtime below (`MCProject`, `MCRoutes`) |
| Workflow stepper (`MCStepper`), progress (`MCProgress`), checks (`MCChecks`), prerequisite (`MCPrereq`), next step (`MCNext`), result (`MCResult`), guidance (`MCGuide`, `MCHelp`, `MCResume`, `MCTour`) | `assets/js/guide.js` | **PORTABLE WITH CONFIGURATION** | stage ids / labels / tours come from the project (`help` config) |
| App shell, navigation tree, drawer, bottom nav, account menu, dialogs (`MCDialog`), palette, toasts | `assets/js/interactions.js` | **PORTABLE WITH CONFIGURATION** | the page provides the shell markup (`template/page-skeleton.html`); navigation comes from config |
| Persistent shell router (over HTTP; `file://` = full loads) | `assets/js/router.js`, `tools/serve.py` | **PORTABLE WITH CONFIGURATION** | optional |
| Project runtime + configuration (brand, locale, time, user, routes, modules, navigation, account, help, tokens) | `assets/js/project-config.js` | **PORTABLE WITH ADAPTATION** | runtime API and MULTIPLECORP config live in ONE file: copy it, replace ROUTES / MODULES / FIXTURES (shape: `template/project-config.example.js`) |
| Document paper + totals (`MCDoc`), live composer (`MCComposer`) | `assets/js/docs.js`, `composer.js` | **PORTABLE WITH ADAPTATION** | generic engines; templates (content, stages, checks, issue) are written per project |
| Domain helpers, business modules, fixtures, pages, module CSS | `assets/js/modules/*`, `assets/js/fixtures/*`, `pages/*`, `assets/css/modules/*` | **MULTIPLECORP EXAMPLE ONLY** | procurement, quotation, warehouse, delivery, invoice, numbering, permissions, handoffs |
Details per component: `docs/COMPONENT_CATALOG.md`; rules and the reasons behind them: `docs/COMPONENT_RULES.md`,
`docs/DESIGN_SYSTEM.md`, `docs/UX_PRINCIPLES.md`, `docs/DESIGN_DECISIONS.md`; guided work: `docs/GUIDED_WORKFLOW.md`;
documents: `docs/DOCUMENT_SYSTEM.md`; shell: `docs/PERSISTENT_SHELL.md`, `docs/NAVIGATION_ARCHITECTURE.md`.

## 4. Adopt it (a new project, same stack)
1. Copy `assets/css/*` (minus `modules/`), `assets/js/{icons,patterns,guide,interactions}.js` (+ `router.js`, `docs.js`,
   `composer.js` only if you need them) and `template/page-skeleton.html`.
2. Copy `assets/js/project-config.js`; replace the ROUTES, MODULES and FIXTURES blocks with your own (shape and comments:
   `template/project-config.example.js`); set `brand`, `user`, `navigation`, `account`, `help`, `tokens`, `features`.
3. Build each page from the skeleton (shell markup incl. the bottom-nav container; scripts in the skeleton's order:
   config in `<head>`, `icons.js` first in `<body>`, then `patterns.js`, `guide.js`, your page code, `interactions.js`).
4. Write your page code against the components (lists, forms + `MCChecks`, `MCDialog`, `MCStepper`, `MCResult`) with
   your own data; keep business rules in YOUR modules (never inside the Golden files).
5. Give command screens `ROUTES[id].capability`; enforce the same rules on the server.
6. Validate (§6).
Other stacks (component frameworks): treat the CSS tokens / classes, the component anatomy, states and the rules in
COMPONENT_RULES as the specification and re-implement the behaviour; the JS here is the reference implementation, not
a drop-in library. No compatibility with any framework is promised.

## 5. Reuse vs replace
**Reuse**: tokens, type scale, spacing, surfaces, status language, components and their states, layout and responsive
rules (sidebar / rail / drawer / bottom nav, list ↔ phone cards), numbered lists + pagination, validation and recovery,
confirmation levels, result anatomy, workflow stepper, guidance levels / tour, PT-25 date rule, accessibility and motion.
**Replace**: branding and logo, routes and pages, navigation, roles and capabilities, domain entities and fixtures,
workflows and transitions, numbering, permissions, integrations, copy specific to the domain.

## 6. Examples and validation
- **Independent consumer demo** (generic shop data, no MULTIPLECORP file): `examples/consumer-demo/index.html` (open it
  directly; config `demo-config.js`, page code `demo.js`). Smoke test (one browser, ~20 s):
  `python tools/golden_consumer_smoke.py evidence/final/r13/golden-v1` → expect 13/13.
- Full reference app: `pages/` (open `index.html` or serve with `serve.cmd` for the persistent shell).
- Lightweight checks for an adopter: no page errors; `node --check` on your JS; numbering 1..n per page; validation
  focuses the first problem; dialog opens / Esc cancels; 1366 + 390 widths without sideways scroll; labels on controls.

## 7. Freeze status, evidence and limitations (frozen 2026-10-12, Owner approved with these limitations)
- Evidence: `evidence/final/r13/golden-v1/` (consumer demo), `evidence/final/r13/final-review/index.html` (MULTIPLECORP
  review package), R13 evidence folders under `evidence/final/r13/`.
- Golden v1 readiness (this document) is separate from **MULTIPLECORP full-application QA**, which stays
  "QA INCOMPLETE — VERIFICATION PENDING": one full behaviour run, one complete router_check (Admin parity) and
  clickability --role admin are still unrun after the last source changes (`scratch/r13/R13_FINAL_QA_REPORT.md`).
- Limitations: the runtime and the MULTIPLECORP configuration share `project-config.js`; Golden CSS files carry a few
  example-page blocks; component micro-copy defaults are Indonesian (some with `L(id, en)`); shell pages need the shell
  markup (no JS-generated shell); no build step, no package, no framework bindings; backend obligations (authorization,
  numbering transactions, MSG-16) are documented, not implemented.
- Next steps for adopters: start from the consumer demo, then the skeleton; read COMPONENT_RULES before changing a
  component; record project decisions in your own DESIGN_DECISIONS.
