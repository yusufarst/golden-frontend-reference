# Instructions for AI agents

**Golden Frontend Reference v1.0.0** · baseline `golden-frontend-v1.0` · FROZEN — OWNER APPROVED (2026-10-12)

This file is for AI agents that plan, review or implement frontend work with Golden, in this repository or
in a project that adopts it. Human readers can start with [`README.md`](README.md) and
[`PUBLIC_START_HERE.md`](PUBLIC_START_HERE.md).

## 0. Facts to hold

- **What Golden is.** One design foundation, independently adapted to every project: a global, reusable,
  framework-agnostic design system and frontend reference.
  - The reference implementation is plain HTML, CSS and JavaScript (ES5), with no build step, no package and
    no framework bindings.
  - Component micro-copy defaults are Indonesian.
- **What it is not.**
  - It is not a production application: no backend, authentication, authorization, database or numbering
    service.
  - It is not a mandate for identical UI, dashboards, navigation, branding, features, workflows or business
    rules.
- **Status.** Read it from these sources, in this order:
  1. [`release/golden-frontend-v1.0/FREEZE_RECORD.md`](release/golden-frontend-v1.0/FREEZE_RECORD.md);
  2. [`docs/GOLDEN_FRONTEND_V1_START_HERE.md`](docs/GOLDEN_FRONTEND_V1_START_HERE.md);
  3. the `goldenFrontendV1` block of [`template/TEMPLATE_MANIFEST.json`](template/TEMPLATE_MANIFEST.json).

  Ignore the historical "FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL" headers in 15 frozen files.
- **Separate status.** MULTIPLECORP full application QA is INCOMPLETE / VERIFICATION PENDING. Never report it
  as passed.
- **Permission.** Public visibility is not a license. Use Golden only in projects that its Owner has
  authorized.
- **Brand assets are not reusable:** the MultipleCorp name and mark (`i-logo-mark`), and third-party logos
  and trademarks such as the Google "G" (`i-google`). The Inter font is covered by its own SIL OFL 1.1.

## 1. Rules for every agent

1. **Respect project stage and authority.**
   - Projects are at different stages of development. A Golden release or announcement does not authorize
     new implementation work, reopen completed planning or override approved decisions.
   - Each project's approved requirements, architecture, technology stack, security, acceptance criteria
     and change control govern that project.
2. **Use Golden as the default, then adapt.**
   - Golden is the default cross-project design reference. Adapt it to the product's real users, tasks and
     technology.
   - Never force identical UI, navigation, dashboards, branding, features, workflows or business rules
     across products.
   - Where a product's approved requirements differ from a Golden default, record the deviation in that
     project's decision records.
3. **No external design generation.**
   - Do not use DesainPakeAI. Do not introduce its CLI, MCP server, API keys or projects.
   - Do not require AI-generated mockups before frontend work, and do not replace DesainPakeAI with another
     mandatory external design service.
   - If a project document still mandates DesainPakeAI, raise the conflict for that project's
     Owner-authorized change control. Do not follow the mandate, and do not edit the document on your own.
4. **The frozen reference is read-only.** Never modify the 41 files listed in
   [`SHA256SUMS-scope.txt`](release/golden-frontend-v1.0/SHA256SUMS-scope.txt). Propose changes to the Owner
   as v1.1 (compatible additions) or v2.0 (breaking changes).
5. **Translate, do not migrate.**
   - Use the project's approved stack, and translate Golden's tokens, components, patterns and principles
     into it ([README: framework adaptation](README.md#framework-adaptation)).
   - Never claim that Golden code runs unchanged in another framework, and never require a framework
     migration just to adopt Golden.
6. **Domain examples are not requirements.** MULTIPLECORP roles, capabilities, numbering formats, procurement
   and warehouse steps, reference pages, Indonesian business copy and sample data show one domain. Do not copy
   them into another product as requirements.
7. **Business logic and security stay in the project.**
   - Business rules, data, roles, permissions and numbering live in the project's own modules, never in
     Golden files.
   - Every guarded command needs server-side enforcement. Never describe Golden guards as authorization.
8. **Do not recreate omitted lab files.** Documents mention `pages/`, `assets/js/modules/`,
   `assets/js/fixtures/`, `assets/css/modules/`, `assets/img/` and the lab tools; these are not in this
   package. Build project equivalents instead.
9. **Do not invent Golden components.** If Golden has nothing for a need (for example a countdown timer or a
   question navigator), it is project work that follows [`COMPONENT_RULES`](docs/COMPONENT_RULES.md) and
   [`DESIGN_SYSTEM`](docs/DESIGN_SYSTEM.md).
10. **Record the version.** Cite "Golden Frontend Reference v1.0 (`v1.0.0`, baseline `golden-frontend-v1.0`)"
    in the project's decision records.

## 2. Planning Architect

**Responsibilities:**

- Studies the project's existing repository and approved requirements before anything else.
- Uses Golden as the default cross-project design reference.
- Adapts the design to the product's actual users, tasks and technology.
- Does not require DesainPakeAI or any other external design-generation service.
- Preserves the project's approval and change-control rules, and plans only within the authorized scope.

**Working steps:**

1. **Read Golden** in this order:
   - [`PUBLIC_START_HERE`](PUBLIC_START_HERE.md) and the [freeze record](release/golden-frontend-v1.0/FREEZE_RECORD.md);
   - [`START_HERE`](docs/GOLDEN_FRONTEND_V1_START_HERE.md) §1–§5;
   - the manifest's `goldenFrontendV1` block.
2. **Shape each screen in scope.** Choose a page archetype ([`COMPONENT_CATALOG`](docs/COMPONENT_CATALOG.md) §3)
   and its page patterns (§2). Separate navigation entries from actions
   ([`NAVIGATION_ARCHITECTURE`](docs/NAVIGATION_ARCHITECTURE.md), [`UX_PRINCIPLES`](docs/UX_PRINCIPLES.md) §16).
3. **Classify each action by risk.** The levels are LOW, COMMIT, DESTRUCTIVE and CRITICAL. Choose the
   confirmation to match ([`UX_PRINCIPLES`](docs/UX_PRINCIPLES.md) §6).
4. **Plan the translation** into the approved stack: tokens, components, patterns and principles.
5. **Sort the work into three groups:** what Golden covers, what is configured, and what the project must
   build (domain logic, backend, widgets Golden does not have).
6. **Plan responsiveness, accessibility and verification.**
   - Responsive classes: phone below 768 px, tablet 768–1024 px, desktop from 1025 px.
   - Accessibility: the manifest's `accessibility` list.
   - Verification: rendered checks at the target widths, then Owner review.
7. **Write the plan.** Cite the Golden files and sections it relies on, and list deviations and
   project-owned work explicitly.

## 3. Independent Second Reviewer

**Responsibilities:**

- Reviews planning and implementation independently of their authors.
- Uses Golden only when it is relevant to the review scope (for example visual consistency, accessibility or
  interaction patterns).
- Does not automatically change existing acceptance criteria. Golden becomes an acceptance criterion only
  where the project adopted it through its own approval process.
- Does not treat Golden as proof that an implementation is correct. Requirements, behaviour, security and
  rendered results are verified on their own evidence.

**Working steps:**

1. Read the project's approved requirements and the change under review before consulting Golden.
2. Report each finding with its evidence.
   - Separate violations of approved requirements from deviations from a Golden default.
   - A deviation from a Golden default is advisory unless the project adopted that rule.
3. Check that the work stayed inside the authorized scope and did not reopen completed planning.

## 4. Coding Executor

**Responsibilities:**

- Implements only authorized work, in the project's approved stack.
- Adapts Golden components and patterns rather than copying them blindly.
- Performs targeted automated checks and rendered visual verification.
- Does not use DesainPakeAI.
- Does not modify the frozen Golden reference.

**Working steps:**

1. **Reference stack (plain HTML, CSS and JavaScript):**
   - Copy the manifest's `goldenFrontendV1.requiredRuntime` files plus `assets/fonts/inter/` (keep
     `LICENSE.txt`). Add `optionalRuntime` files only when used.
   - Configure by copying `assets/js/project-config.js` and replacing `ROUTES`, `MODULES` and `FIXTURES`; the
     shape is in [`project-config.example.js`](template/project-config.example.js). A quick prototype may
     use `window.MC_PROJECT_PATCH` instead, as [`demo-config.js`](examples/consumer-demo/demo-config.js)
     does.
   - Build pages from [`page-skeleton.html`](template/page-skeleton.html). Replace the MULTIPLECORP brand
     text, the placeholder account and the favicon. Remove the `fixtures/multiplecorp-data.js` and
     `modules/domain.js` script tags. Keep the script order and the bottom-navigation container.
2. **Any other approved stack:** implement stack-native components and styles to the same tokens, anatomy,
   states and behaviour ([README: framework adaptation](README.md#framework-adaptation)). Do not import the
   Golden JavaScript into a framework unless the project's approved architecture allows it.
3. **Using the components.**
   - [`demo.js`](examples/consumer-demo/demo.js) shows `MCList` and `MCPager`, `MCUI.pill`, `MCStepper`,
     `MCChecks`, `MCBizDate`, `MCDialog` and `MCResult`.
   - For the rest, see [`COMPONENT_CATALOG`](docs/COMPONENT_CATALOG.md),
     [`COMPONENT_RULES`](docs/COMPONENT_RULES.md) and the component source under `assets/js/`.
4. **Keep components generic.** No literal page paths inside components (use the project's routing), and no
   business words inside shared components.
5. **Verify before you finish:**
   - no page or console errors;
   - syntax and type checks of the stack pass;
   - numbering runs 1..n on every page;
   - validation focuses the first problem;
   - a dialog opens and Esc cancels it;
   - no sideways scroll at 1366 px and 390 px;
   - every control has a label;
   - rendered screenshots are inspected at the target widths.

   In this repository, `python tools/public_consumer_smoke.py` must report 13/13, and
   `sha256sum -c release/golden-frontend-v1.0/SHA256SUMS-scope.txt` must report 41 × OK.

## 5. Package boundaries

What is and is not published, how to read the frozen documents and their 242 lab-path mentions, and how to
read their "GOLDEN FIXED" labels: [`PUBLIC_START_HERE`](PUBLIC_START_HERE.md) §4 and
[`PUBLIC_RELEASE.md`](PUBLIC_RELEASE.md). The complete list of limitations is in the
[README technical limitations](README.md#technical-limitations).
