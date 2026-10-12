# Golden Frontend Reference

**Release `v1.0.0`** · Golden Frontend Reference v1.0 · baseline `golden-frontend-v1.0` ·
**FROZEN — OWNER APPROVED** (2026-10-12)

A reusable **design system and frontend implementation reference** in plain HTML, CSS and JavaScript:
design tokens, components, responsive layouts, UX patterns, interaction and workflow conventions, and the
reference code that implements them.

> **Golden is not a production application.** It contains no backend, authentication, authorization,
> database, numbering service or business engine. Frontend route guards are a convenience, never security.
> See [What Golden is not](#what-golden-is-not).
>
> **No open-source license.** This repository is public for reference only; visibility does not grant
> permission to reuse it. See [License and third-party notices](#license-and-third-party-notices).

## Start here

| You need | Go to |
|---|---|
| A map of the whole package | [`PUBLIC_START_HERE.md`](PUBLIC_START_HERE.md) |
| Design tokens | [`assets/css/tokens.css`](assets/css/tokens.css) · [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) |
| Reusable components | [`docs/COMPONENT_CATALOG.md`](docs/COMPONENT_CATALOG.md) · [`docs/COMPONENT_RULES.md`](docs/COMPONENT_RULES.md) · [components and examples](#components-and-examples) |
| Frontend patterns | [`assets/js/patterns.js`](assets/js/patterns.js) · [`docs/UX_PRINCIPLES.md`](docs/UX_PRINCIPLES.md) · [`docs/NAVIGATION_ARCHITECTURE.md`](docs/NAVIGATION_ARCHITECTURE.md) |
| A working consumer demo | [`examples/consumer-demo/`](examples/consumer-demo/) · [quick start](#quick-start) |
| The machine-readable manifest | [`template/TEMPLATE_MANIFEST.json`](template/TEMPLATE_MANIFEST.json) (block `goldenFrontendV1`) |
| Adoption documentation | [adoption guide](#adoption-guide) · [`docs/GOLDEN_FRONTEND_V1_START_HERE.md`](docs/GOLDEN_FRONTEND_V1_START_HERE.md) · [`docs/PORTABILITY_CONTRACT.md`](docs/PORTABILITY_CONTRACT.md) |
| Adapting Golden to another framework (React, Next.js, Tailwind CSS, shadcn/ui, Vue, Laravel, …) | [framework adaptation](#framework-adaptation) |
| Using Golden for different product categories | [product categories](#using-golden-across-product-categories) · [design workflow](#design-and-implementation-workflow) · [project approvals and stages](#respecting-project-approvals-and-stages) |
| Instructions for AI agents (Planning Architect, Independent Second Reviewer, Coding Executor) | [`AGENTS.md`](AGENTS.md) |

## Ringkasan (Bahasa Indonesia)

Golden Frontend Reference adalah referensi desain dan frontend yang dapat dipakai ulang. Isinya design
tokens, komponen, pola UX, tata letak responsif, dan kode acuan HTML/CSS/JavaScript.

- **Status:** rilis publik **v1.0.0** sama dengan Golden Frontend Reference v1.0, **FROZEN — OWNER APPROVED**
  (2026-10-12). Berkas baseline disertakan tanpa perubahan dan dapat diverifikasi dengan SHA-256.
- **Bukan aplikasi produksi:** tidak ada backend, autentikasi, otorisasi, maupun basis data.
- **Kebijakan desain:** satu fondasi desain yang diadaptasi secara mandiri oleh setiap proyek. Golden tidak
  memaksakan UI, dashboard, navigasi, branding, fitur, alur kerja, atau aturan bisnis yang sama. Setiap
  proyek tetap memegang kendali atas kebutuhan, arsitektur, teknologi, keamanan, dan keputusan
  implementasinya.
- **Framework:** kode acuannya HTML/CSS/JavaScript murni. Untuk framework lain (React, Next.js, Tailwind CSS,
  shadcn/ui, Vue, Laravel, dan lainnya), token dan pola diterjemahkan ke stack proyek tanpa migrasi
  framework.
- **Tanpa layanan desain eksternal:** Golden tidak bergantung pada DesainPakeAI atau layanan pembuat desain
  berbasis AI lainnya.
- **Mulai dari:** [`PUBLIC_START_HERE.md`](PUBLIC_START_HERE.md) dan demo
  [`examples/consumer-demo/`](examples/consumer-demo/). Agen AI membaca [`AGENTS.md`](AGENTS.md).
- **Lisensi:** belum ada lisensi open-source. Repositori ini publik sebagai referensi, dan visibilitas publik
  tidak memberi izin penggunaan ulang secara umum. Logo dan merek pihak ketiga tidak termasuk materi yang
  dapat dipakai ulang.
- **Bahasa:** teks bawaan komponen berbahasa Indonesia; dokumentasi berbahasa Inggris.

## Contents

- [Start here](#start-here)
- [Purpose and design policy](#purpose-and-design-policy)
- [Status of v1.0](#status-of-v10)
- [Quick start](#quick-start)
- [Repository contents](#repository-contents)
- [Components and examples](#components-and-examples)
- [Adoption guide](#adoption-guide)
- [Framework adaptation](#framework-adaptation)
- [Design and implementation workflow](#design-and-implementation-workflow)
- [Using Golden across product categories](#using-golden-across-product-categories)
- [Respecting project approvals and stages](#respecting-project-approvals-and-stages)
- [Technical limitations](#technical-limitations)
- [For AI agents](#for-ai-agents)
- [What Golden is not](#what-golden-is-not)
- [Verifying the baseline](#verifying-the-baseline)
- [Versioning and change policy](#versioning-and-change-policy)
- [License and third-party notices](#license-and-third-party-notices)

## Purpose and design policy

**One design foundation — independently adapted to every project.** Golden is a global, reusable,
framework-agnostic and adaptive design system and frontend reference.

It gives every project a tested default answer to recurring frontend questions, so teams and AI agents
build consistent, accessible screens without re-deciding the basics. Those questions include:

- how a list is numbered and paged;
- how a form validates and recovers;
- how a risky action is confirmed;
- how a result is announced;
- how navigation adapts from desktop to tablet to phone.

Golden and each project divide the work like this:

- **What projects take from Golden:** design foundations (tokens, typography, spacing, colour roles,
  surfaces, motion), component anatomy and states, interaction and UX principles, accessibility rules and
  responsive behaviour.
- **What each project decides for itself:**
  - its users, tasks and product requirements;
  - its information architecture, navigation, dashboards and features;
  - its workflows, business rules and data;
  - its branding and copy;
  - its approved architecture, technology stack, security and implementation decisions.

Golden does not force identical UI, dashboards, navigation, branding, features, workflows or business rules
across different products. Where a project's approved requirements differ from a Golden default, the
project's decision governs that project and is recorded in its own decision records.

MULTIPLECORP (multi-company project operations: procurement, warehouse, documents, finance) is the
demonstration environment in which every pattern was exercised. Its full clickable prototype stays in the
private lab and is **not** part of this repository (see [Repository contents](#repository-contents)).

## Status of v1.0

| Field | Value |
|---|---|
| Public release | `v1.0.0` |
| Golden version | Golden Frontend Reference v1.0 (manifest version `1.0.0`) |
| Status | **FROZEN — OWNER APPROVED** |
| Freeze date | 2026-10-12 |
| Baseline identifier | `golden-frontend-v1.0` |
| Freeze record | [`release/golden-frontend-v1.0/FREEZE_RECORD.md`](release/golden-frontend-v1.0/FREEZE_RECORD.md) |
| Frozen file list | [`release/golden-frontend-v1.0/SHA256SUMS-scope.txt`](release/golden-frontend-v1.0/SHA256SUMS-scope.txt): 41 files, all included byte-identical |

**Approved scope:** the reusable design system, the frontend reference, the component library, the UX
patterns, the portability documentation and the independent consumer demo.

**Separate statuses, not covered by the freeze:**
- MULTIPLECORP FULL APPLICATION QA: **INCOMPLETE / VERIFICATION PENDING**.
- Backend security, authorization, transactional numbering and production readiness.

**Status precedence.** Fifteen frozen files were written during the freeze-candidate stage and still say
"FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL". Examples are `docs/AGENT_START_HERE.md`,
`docs/TEMPLATE_ADOPTION_GUIDE.md` and the `approval` block of `template/TEMPLATE_MANIFEST.json`. They stay
unchanged because the baseline is frozen. The authoritative status comes from these sources, in this order:

1. The freeze record.
2. [`docs/GOLDEN_FRONTEND_V1_START_HERE.md`](docs/GOLDEN_FRONTEND_V1_START_HERE.md).
3. The `goldenFrontendV1` block of [`template/TEMPLATE_MANIFEST.json`](template/TEMPLATE_MANIFEST.json).

## Quick start

Nothing to build or install. Open the consumer demo in either of two ways:

- Open [`examples/consumer-demo/index.html`](examples/consumer-demo/index.html) directly in a browser
  (`file://`).
- Or serve the repository root and open `http://127.0.0.1:8137/examples/consumer-demo/index.html`:

  ```bash
  python tools/serve.py
  ```

  `tools/serve.py` uses the Python standard library only, binds 127.0.0.1 and is read-only.
  `python -m http.server` also works.

The demo ("Toko Contoh", 23 generic sample orders) is built only from the shared Golden files. It shows:

- a numbered, paginated list;
- status text;
- a validation summary with field errors;
- the shared date rule;
- a confirmation dialog;
- a success result;
- a workflow stepper.

`serve.cmd` and `python tools/serve.py --open` open the MULTIPLECORP start page of the full lab, which is
not in this repository, so the browser shows "not found". Open the demo address above instead.

To check the demo automatically from any clone, run the public smoke test. It runs the frozen
consumer-demo checks and needs Playwright for Python and its Chromium (`python -m pip install playwright`,
then `python -m playwright install chromium`). The expected result is `13/13 checks passed`:

```bash
python tools/public_consumer_smoke.py
```

## Repository contents

```text
assets/css/          tokens.css, base.css, components.css, patterns.css, motion.css
assets/fonts/inter/  Inter variable font (SIL OFL 1.1) used by base.css
assets/js/           project-config.js (runtime + configuration), icons.js, patterns.js, guide.js,
                     interactions.js, router.js, docs.js, composer.js
docs/                18 documents (start here, design system, components, UX, navigation, documents, ...)
examples/consumer-demo/   independent consumer demo (generic data, no MULTIPLECORP file)
template/            page-skeleton.html, project-config.example.js, TEMPLATE_MANIFEST.json
tools/               serve.py (local read-only server), golden_consumer_smoke.py (frozen demo smoke test),
                     public_consumer_smoke.py (runs the frozen smoke test from any clone; distribution file)
release/golden-frontend-v1.0/   freeze record, frozen checksum list, list digests
serve.cmd            Windows launcher for tools/serve.py
PUBLIC_START_HERE.md public start guide: a map of the package (distribution file)
AGENTS.md            instructions for AI planning and coding agents (distribution file)
PUBLIC_RELEASE.md    this public package compared with the frozen baseline
SHA256SUMS-public.txt     SHA-256 of every file in this package
```

Files marked "distribution file", together with `README.md`, `PUBLIC_RELEASE.md`, `SHA256SUMS-public.txt`,
`.gitattributes` and `.gitignore`, belong to this public release only. They are not part of the frozen
baseline.

**Not included.** These stay in the private lab:

- the MULTIPLECORP pages, business modules, fixtures, module CSS, images and brand files (`pages/`,
  `assets/js/modules/`, `assets/js/fixtures/`, `assets/css/modules/`, `assets/img/`);
- the lab's QA tools and review pages;
- evidence, analysis, the reference mockups and working notes.

Documents written for the full lab still mention these paths. Read those references as background; they
are not files to recreate. Details are in [`PUBLIC_RELEASE.md`](PUBLIC_RELEASE.md).

## Components and examples

Each part carries one of four classes:

| Class | Meaning |
|---|---|
| **Reusable** | Use it unchanged on the reference stack; on another stack, reuse its values and specification. |
| **Configurable** | Reuse the code and supply project data and configuration (routes, navigation, labels, help content). |
| **Requires adaptation** | Copy it and rewrite the project-specific parts. |
| **Example only** | Shows a pattern in a concrete domain; never copy it into a product. Build the product's own version instead. |

On a stack other than plain HTML, CSS and JavaScript, every code file below **requires adaptation**: the
project translates it (see [Framework adaptation](#framework-adaptation)).

| Area | Files | Class |
|---|---|---|
| Design tokens: typography (Inter), colour, spacing, radius, surfaces, status tones, density units | `assets/css/tokens.css`, `assets/css/base.css` | Reusable (brand only through `--brand-*` tokens) |
| Component styles: buttons, fields, cards, pills/status, dialogs, sheets, toasts, shell, stepper, bottom nav | `assets/css/components.css` | Reusable |
| Pattern styles: page head, sections, lists + numbering + pager, composer, result, guidance | `assets/css/patterns.css` | Reusable |
| Motion and reduced motion | `assets/css/motion.css` | Reusable |
| Icon sprite (110 icons) | `assets/js/icons.js` | Reusable, except the brand marks below |
| Lists (`MCList`, `MCPager`), status (`MCUI.pill`, `MCUI.status`), filters, tabs, segments, sheets, risk confirmation (`MCRisk`), date fields, timelines, `MCBizDate` | `assets/js/patterns.js` | Configurable |
| Workflow stepper (`MCStepper`), `MCProgress`, `MCChecks`, `MCPrereq`, `MCNext`, `MCResult`, guidance (`MCGuide`, `MCHelp`, `MCResume`, `MCTour`) | `assets/js/guide.js` | Configurable |
| App shell, navigation tree, drawer, bottom nav, account menu, dialogs (`MCDialog`), command palette, toasts | `assets/js/interactions.js` (shared sections) | Configurable |
| Persistent shell router (HTTP only, optional) | `assets/js/router.js`, `tools/serve.py` | Configurable |
| Project runtime and configuration | `assets/js/project-config.js` | Requires adaptation (replace `ROUTES`, `MODULES`, `FIXTURES`) |
| Document paper and totals (`MCDoc`), live composer (`MCComposer`) | `assets/js/docs.js`, `assets/js/composer.js` | Requires adaptation (templates are written per project); optional |
| Page shell skeleton | `template/page-skeleton.html` | Requires adaptation (MULTIPLECORP brand text, account placeholder and scripts) |
| MULTIPLECORP reference pages 01–04 (sign-in, dashboard, purchase form, motion study) and the `.pur-*`, `.atq-*`, `.prj-*` blocks | sections inside `assets/css/components.css`, `assets/css/patterns.css`, `assets/js/interactions.js` | Example only |
| MULTIPLECORP identity, personas and QA fixtures | the `FIXTURES` block of `assets/js/project-config.js` | Example only |
| Worked MULTIPLECORP flows: roles, capabilities, document numbering formats, procurement and warehouse steps | `docs/ROLE_JOURNEYS.md`, `docs/ACTION_ROUTE_MATRIX.md`, `docs/UX_AUDIT_R11.md` | Example only |
| Generic consumer demo ("Toko Contoh") | `examples/consumer-demo/` | Example only: shows how adoption works |
| Brand marks (`i-logo-mark`, `i-google`) | `assets/js/icons.js` | Not reusable (see [License](#license-and-third-party-notices)) |

**Examples:**
- [`examples/consumer-demo/`](examples/consumer-demo/): the smallest working adoption. Read
  `index.html`, then `demo-config.js`, then `demo.js`.
- [`template/page-skeleton.html`](template/page-skeleton.html) and
  [`template/project-config.example.js`](template/project-config.example.js): the page shell and the shape
  of a project configuration.

**Specifications:**

| Topic | Documents |
|---|---|
| Components and their rules | [`COMPONENT_CATALOG`](docs/COMPONENT_CATALOG.md), [`COMPONENT_RULES`](docs/COMPONENT_RULES.md) |
| Visual system and UX | [`DESIGN_SYSTEM`](docs/DESIGN_SYSTEM.md), [`UX_PRINCIPLES`](docs/UX_PRINCIPLES.md), [`MOTION_SYSTEM`](docs/MOTION_SYSTEM.md) |
| Navigation and shell | [`NAVIGATION_ARCHITECTURE`](docs/NAVIGATION_ARCHITECTURE.md), [`PERSISTENT_SHELL`](docs/PERSISTENT_SHELL.md) |
| Documents and guided work | [`DOCUMENT_SYSTEM`](docs/DOCUMENT_SYSTEM.md), [`GUIDED_WORKFLOW`](docs/GUIDED_WORKFLOW.md) |
| Why each rule exists | [`DESIGN_DECISIONS`](docs/DESIGN_DECISIONS.md) |
| Adoption contract | [`PORTABILITY_CONTRACT`](docs/PORTABILITY_CONTRACT.md), [`APP_ARCHITECTURE`](docs/APP_ARCHITECTURE.md) |
| Worked MULTIPLECORP examples | [`ROLE_JOURNEYS`](docs/ROLE_JOURNEYS.md), [`ACTION_ROUTE_MATRIX`](docs/ACTION_ROUTE_MATRIX.md), [`UX_AUDIT_R11`](docs/UX_AUDIT_R11.md) |

## Adoption guide

The full guide is [`docs/GOLDEN_FRONTEND_V1_START_HERE.md`](docs/GOLDEN_FRONTEND_V1_START_HERE.md) §4–§6.
For a project on the same stack (plain HTML, CSS and JavaScript):

1. **Copy the shared files.**
   - Always: `assets/css/{tokens,base,components,patterns,motion}.css`, `assets/fonts/inter/` (keep
     `LICENSE.txt` with the fonts) and `assets/js/{icons,patterns,guide,interactions}.js`.
   - Only if you need them: `router.js`, `docs.js` and `composer.js`.
2. **Configure.** Copy `assets/js/project-config.js` and replace its `ROUTES`, `MODULES` and `FIXTURES`
   blocks; the shape is in `template/project-config.example.js`. Then set `brand`, `user`, `navigation`,
   `account`, `help`, `tokens` and `features`. For a quick prototype, the demo's `window.MC_PROJECT_PATCH`
   seam (set before `project-config.js`) is enough; see `examples/consumer-demo/demo-config.js`.
3. **Build pages from `template/page-skeleton.html`.** The skeleton is the MULTIPLECORP page shell.
   - Replace the brand text ("MultipleCorp"), the placeholder account ("Dimas, Owner"), the search
     placeholder and the favicon `../assets/img/brand/multiplecorp-mark.svg`.
   - Remove or replace the MULTIPLECORP scripts `../assets/js/fixtures/multiplecorp-data.js` and
     `../assets/js/modules/domain.js`. They are not in this repository.
   - Keep the script order: the configuration in `<head>`; `icons.js` first in `<body>`; then
     `patterns.js`, `guide.js`, your page code, and `interactions.js` last.
   - Keep the bottom-navigation container.
4. **Write page code** against the components with your own data. Keep business rules in your own
   modules, never inside Golden files.
5. **Protect command screens.** Give them `ROUTES[id].capability`, and enforce the same rules on the
   server.
6. **Check:**
   - no page errors;
   - `node --check` passes on your JavaScript;
   - numbering runs 1..n on every page;
   - validation focuses the first problem;
   - a dialog opens and Esc cancels it;
   - no sideways scroll at 1366 px and 390 px;
   - every control has a label.

**Other stacks:** follow [Framework adaptation](#framework-adaptation). The JavaScript here is the reference
implementation, not a drop-in library for other frameworks.

| Reuse | Replace |
|---|---|
| tokens, type scale, spacing, surfaces, status language | branding and logo |
| components and their states | routes and pages |
| layout and responsive rules | navigation, roles and capabilities |
| numbered lists and pagination | domain entities and data |
| validation and recovery, confirmation levels, result anatomy | workflows, transitions and numbering |
| workflow stepper, guidance levels, the date rule | permissions and integrations |
| accessibility and motion | domain-specific copy |

## Framework adaptation

Golden v1.0 is implemented in plain HTML, CSS and JavaScript. That code is the **reference implementation**.
It is not a component library for other frameworks, and no compatibility with React, Next.js, Vue or any
other framework is claimed. Adopting Golden never requires migrating a project to another framework.

The project's own agents translate four layers into the project's approved stack:

| Golden layer | What to carry over | How it usually translates |
|---|---|---|
| Design tokens (`assets/css/tokens.css`) | names, values, semantic roles, brand slots, density units, motion durations and curves | CSS custom properties (loaded or transcribed), theme values that point at those properties, typed constants where the stack needs them |
| Components ([`COMPONENT_CATALOG`](docs/COMPONENT_CATALOG.md), [`COMPONENT_RULES`](docs/COMPONENT_RULES.md)) | anatomy, states, sizes, keyboard and focus behaviour, accessibility | the stack's own components, built to the same anatomy and states |
| Patterns (`assets/css/patterns.css`, `assets/js/patterns.js`, page archetypes) | archetypes, numbered lists and pagination, validation and recovery, confirmation levels, result anatomy, guided work | the stack's routing, layouts and state handling |
| Principles ([`UX_PRINCIPLES`](docs/UX_PRINCIPLES.md), [`DESIGN_SYSTEM`](docs/DESIGN_SYSTEM.md), [`MOTION_SYSTEM`](docs/MOTION_SYSTEM.md)) | action budget, navigation versus action, responsive classes, reduced motion | design and review criteria for the project's screens |

**Notes per stack.** These are orientation, not adapters.

- **Plain HTML / CSS / JavaScript.** The direct path: see the [adoption guide](#adoption-guide).
- **React / TypeScript.** Typed components built to the Golden anatomy and states; tokens as CSS variables;
  business logic outside the components.
- **Next.js.** As for React. Shared layouts take the role of Golden's persistent shell (`router.js` and
  `tools/serve.py` are not used). Interactive pieces such as dialogs, menus and the palette are client
  components.
- **Tailwind CSS.** Express the Golden tokens in the Tailwind theme, pointing at the CSS variables.
  Utilities must not introduce colours, radii, spacing or shadows outside the token set.
- **shadcn/ui.** Map Golden's semantic tokens to the theme variables that the shadcn/ui components read.
  Adjust the copied component variants to Golden's anatomy, states and target sizes.
- **Vue.** Single-file components built to the same anatomy and states; tokens as CSS variables.
- **Laravel frontend.**
  - Blade (server-rendered HTML) is the closest match to the reference stack; the plain files may be
    evaluated for direct use within the project's approved architecture.
  - With Inertia, follow the React or Vue notes.
- **Other stacks.** Translate the same four layers.

## Design and implementation workflow

Golden supports planning, direct implementation and iterative visual refinement without a design-generation
step:

1. Golden provides the reusable design standards and patterns.
2. The project's Planning Architect analyses the requirements and decides how to adapt Golden.
3. The project's coding agent (for example Claude Code) implements the approved plan directly in the
   project's native frontend technology.
4. Visual quality is verified on actual rendered results, with responsive testing and Owner review.
5. Refinements are made directly in the project.

Golden has **no dependency on DesainPakeAI** or on any other external AI design-generation service. No
generated mockups are required before frontend work, and no such service replaces it as a mandatory step.

This does not remove any quality requirement: accessibility, responsive design, quality gates, rendered
visual verification and Owner approval all still apply. Historical reference mockups mentioned in the
frozen documents are provenance only.

## Using Golden across product categories

Golden is designed to be adapted by many kinds of web applications. The categories below are examples, not
restrictions.

| Product category | Golden parts that usually help | Stays with the product |
|---|---|---|
| **Enterprise management systems** | app shell and two-level navigation, dashboard / list / detail-hub archetypes, command palette, role-aware actions, risk confirmations | modules, roles, permissions, workflows, data, integrations |
| **Point of Sale and retail** | numbered lists and pager, status text, validation with confirmation (for example a void as DESTRUCTIVE), result anatomy, phone and tablet layouts; `MCDoc` may serve receipts after adaptation | pricing, tax, payments, receipts and printing, stock rules |
| **Computer-Based Testing platforms** | `MCStepper`, guidance levels and tour (`MCGuide`, `MCTour`), checks before submission (`MCChecks`), final-submission confirmation, `MCResult` | exam timer, question navigator, answer autosave, scoring, integrity controls (none of these are Golden components) |
| **University administration systems** | forms with validation and recovery, guided workflow, document paper and composer, status timelines, role-aware navigation | administrative rules, approvals, identity and data protection |
| **Asset and procurement management** | list / detail / form archetypes, document composer with the numbering and identity contract ([`DOCUMENT_SYSTEM`](docs/DOCUMENT_SYSTEM.md)), the transaction-date rule (`MCBizDate`), timelines, COMMIT and CRITICAL confirmations | regulations, approval chains, asset register, numbering sequences |
| **Warehouse and inventory systems** | task and checklist archetypes, numbered lists, phone-first layouts, risk confirmations, the transaction-date rule | stock logic, locations, counting rules, scanning hardware |
| **Other web applications** | tokens, typography, components, accessibility and motion rules | everything specific to the product |

**Product-specific customization.** Each product chooses which components and patterns it needs. It also
owns its information architecture, navigation, dashboards, workflows, copy and brand. It may add its own
components, built to Golden's rules.

**Domain examples are not requirements.** The MULTIPLECORP material (roles, capabilities, numbering formats,
procurement and warehouse steps, Indonesian business copy, sample data) shows how a pattern behaves in one
domain. Never copy it into another product as a requirement.

## Respecting project approvals and stages

- **A release is not an authorization.** Projects are at different stages. This release, or any
  announcement of Golden, does not authorize new implementation work, reopen completed planning or override
  approved decisions.
- **Adopt through the project's process.** Golden is adopted through each project's own planning and
  Owner-authorized change control. Existing approved requirements, architecture, acceptance criteria and
  documents stay in force until they are changed that way.
- **Project documents govern their project.** Where a project document and Golden disagree, the project
  document governs that project until its own process changes it.

## Technical limitations

**Documented and accepted with the Owner's approval:**

1. The runtime API and the MULTIPLECORP configuration share `assets/js/project-config.js`. To adopt, copy
   the file and replace `ROUTES`, `MODULES` and `FIXTURES`. The demo seam is `window.MC_PROJECT_PATCH`.
2. The Golden CSS carries a few example-page blocks (`.pur-*`, `.atq-*`, `.prj-*`) that other projects do
   not use.
3. Component micro-copy defaults are Indonesian; some strings have an English variant through `L(id, en)`.
4. Shell markup is written in each page (`template/page-skeleton.html`); the bottom-nav container is
   required.
5. Frontend guards are not authorization. Backend obligations (authorization, numbering transactions,
   MSG-16) are documented, not implemented. There is no build step, no package and no framework binding.

**Notes on this public package.** The frozen files are not edited here; any fix ships in a successor
version.

6. The frozen `tools/golden_consumer_smoke.py` hard-codes the lab path in `ROOT` (line 7), so it cannot run
   from a clone as is. Use `tools/public_consumer_smoke.py` instead. It first checks that the frozen file is
   the exact v1.0 file, then runs the same 13 checks, replacing the lab path with your clone's location in
   memory only.
7. `serve.cmd` and `tools/serve.py --open` start at a MULTIPLECORP page that is not included (not found).
8. Documents and the manifest refer to paths that exist only in the private lab: MULTIPLECORP pages,
   modules and fixtures, the lab tools, `review/`, `evidence/`, `scratch/` and `analysis/`. There are 242
   such references; `PUBLIC_RELEASE.md` lists them by area.
9. Fifteen frozen files carry the older freeze-candidate status line (see
   [Status precedence](#status-of-v10)).
10. `project-config.js` holds the MULTIPLECORP demonstration identity and two QA fixtures. That data is
    synthetic: fictitious companies, personas and e-mail addresses (`@multiplecorp.id` is not a registered
    domain). Replace all of it when you adopt.
11. The frozen files are byte-exact: most use LF line endings, and two use CRLF
    (`docs/NAVIGATION_ARCHITECTURE.md`, `serve.cmd`). `.gitattributes` turns off line-ending conversion so
    the checksums verify on every operating system, including Git for Windows, which converts line endings
    by default. Keep it when you mirror this repository.
12. Validation of this public package covers the consumer demo in Chromium at 1366 × 768 and 390 × 844,
    over `file://` and HTTP. The full application suites ran only in the private lab.

## For AI agents

AI agents follow [`AGENTS.md`](AGENTS.md). It defines three roles: Planning Architect, Independent Second
Reviewer and Coding Executor. The essentials:

- **Read first.** Start with [`PUBLIC_START_HERE.md`](PUBLIC_START_HERE.md). Take the status from the
  sources in [Status of v1.0](#status-of-v10), never from an older freeze-candidate header.
- **Stage and authority.** Golden is the default cross-project design reference. It never authorizes new
  work, and it never overrides a project's approved decisions (see
  [Respecting project approvals and stages](#respecting-project-approvals-and-stages)).
- **No external design generation.** Agents do not use DesainPakeAI. They adapt Golden to the project's
  approved stack and verify on rendered results.
- **Frozen files stay frozen.** Never edit the 41 frozen files. Copy them into your project, then configure;
  never fork component CSS for a single screen.
- **Business logic belongs to the project.** Business rules, data and permissions live in the adopting
  project. The reference-page sections inside `interactions.js` and `components.css` (MULTIPLECORP pages
  01–04) are examples, not part of a component.
- **No lab rebuilds, no security claims.** Do not recreate the lab files that the frozen documents mention,
  and never present Golden guards as security.
- **Permission.** Public visibility is not a license. Use Golden only in projects that its Owner has
  authorized.

## What Golden is not

Golden is not any of these:

- a production application, backend, authentication or authorization system;
- a database, numbering service or procurement engine;
- an npm package, a React or component-framework library, or a drop-in UI kit;
- a mandate for identical products: UI, dashboards, navigation, branding, features, workflows and business
  rules remain each product's decision;
- dependent on DesainPakeAI or on any other external design-generation service.

Business rules shown in the MULTIPLECORP examples belong to MULTIPLECORP. The adopting project remains
responsible for security, backend, data protection, its own accessibility review and its own QA.

## Verifying the baseline

From the repository root, with Git Bash or a Linux shell.

Check the 41 frozen files; every line must read `OK`:

```bash
sha256sum -c release/golden-frontend-v1.0/SHA256SUMS-scope.txt
```

Check the digest of the frozen list. It must be
`39fa879dc304275e55b1ffecda290ebd6b481a27d89bbda67011c26e0796eca4`:

```bash
sha256sum release/golden-frontend-v1.0/SHA256SUMS-scope.txt
```

Check every file of this public package:

```bash
sha256sum -c SHA256SUMS-public.txt
```

On macOS use `shasum -a 256` in place of `sha256sum`. In PowerShell, compare
`Get-FileHash -Algorithm SHA256 <file>` with the lists.

## Versioning and change policy

Golden v1.0 is immutable. Any change to a file in the frozen list, or to the meaning of a frozen contract,
ships as an explicitly versioned successor with its own freeze record and checksum list:

- **v1.1** for compatible additions;
- **v2.0** for breaking changes.

Public releases of this repository are tagged `vMAJOR.MINOR.PATCH`. `v1.0.0` corresponds to the Golden v1.0
baseline.

## License and third-party notices

- **No open-source license.** The Owner has not granted an open-source license or any other public
  license for this repository.
  - It is public so that it can be read as a reference. **Public visibility does not grant permission to
    use, copy, modify or redistribute its contents.**
  - All rights are reserved by the copyright holder; any reuse needs the Owner's permission.
  - GitHub's Terms of Service let GitHub users view and fork public repositories on GitHub. That is not a
    license to reuse the contents elsewhere.
- **Logos and trademarks are not reusable material.**
  - Third-party logos and trademarks are excluded from any reuse permission, now or later. One example is
    the Google "G" (`i-google`), a trademark of Google LLC, drawn for a "continue with Google" button. If
    your project shows such a button, follow Google's own sign-in branding guidelines.
  - The MultipleCorp name and mark (`i-logo-mark`) identify the demonstration project. Every adopter
    replaces them with its own brand.
- **Inter typeface:** © The Inter Project Authors, under the SIL Open Font License 1.1
  ([`assets/fonts/inter/LICENSE.txt`](assets/fonts/inter/LICENSE.txt)). That license covers the font files
  only.
- **Icons:** drawn as original geometry for this reference, according to the sprite header. The brand marks
  above are excluded.
- **Sample data:** names, companies, e-mail addresses and figures are fictitious.
