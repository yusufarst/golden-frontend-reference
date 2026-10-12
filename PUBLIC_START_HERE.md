# Public start guide — Golden Frontend Reference v1.0.0

This guide is the entry point of the public package. It links every part that a project or an AI agent
needs, and every link points to a file that exists in this repository.

**Status:** FROZEN — OWNER APPROVED (2026-10-12), baseline `golden-frontend-v1.0`, public release `v1.0.0`.

**Design policy: one design foundation, independently adapted to every project.**
- Golden is framework-agnostic: its plain HTML/CSS/JavaScript code is the reference implementation.
- It does not force identical UI, navigation, branding, features, workflows or business rules on different
  products.
- It has no dependency on DesainPakeAI or on any other external design-generation service.

See the [README purpose and design policy](README.md#purpose-and-design-policy).

Golden is **not a production application**, and it has **no open-source license**. Public visibility does
not grant permission to reuse it; see the [README](README.md#license-and-third-party-notices).

The frozen entry document, [`docs/GOLDEN_FRONTEND_V1_START_HERE.md`](docs/GOLDEN_FRONTEND_V1_START_HERE.md),
is unchanged. It was written in the private lab and also names lab paths that are not published; see
[Reading the frozen documents](#4-reading-the-frozen-documents).

## 1. Map of the package

| You need | Start with | Then |
|---|---|---|
| **Design tokens** | [`assets/css/tokens.css`](assets/css/tokens.css): every token, with the brand slots `--brand-*`. [`assets/css/base.css`](assets/css/base.css): the Inter `@font-face` and base elements | [`DESIGN_SYSTEM`](docs/DESIGN_SYSTEM.md) §2 colour, §3 typography, §4 spacing, §6 radius, §7 elevation · [`MOTION_SYSTEM`](docs/MOTION_SYSTEM.md) for motion tokens · [`PORTABILITY_CONTRACT`](docs/PORTABILITY_CONTRACT.md) §2.9 for brand tokens |
| **Reusable components** | [`COMPONENT_CATALOG`](docs/COMPONENT_CATALOG.md) §1 primitives and §5 navigation components. Code: [`components.css`](assets/css/components.css), [`interactions.js`](assets/js/interactions.js) (shell, navigation, dialogs, palette), [`guide.js`](assets/js/guide.js) (stepper, checks, result, guidance), [`icons.js`](assets/js/icons.js) | [`COMPONENT_RULES`](docs/COMPONENT_RULES.md): anatomy, states, sizes and the rules of each component |
| **Frontend patterns** | [`COMPONENT_CATALOG`](docs/COMPONENT_CATALOG.md) §2 page patterns and §3 page archetypes. Code: [`patterns.css`](assets/css/patterns.css), [`patterns.js`](assets/js/patterns.js) (`MCList`, `MCPager`, `MCFilter`, `MCTabs`, `MCRisk`, `MCSheet`, `MCBizDate`, …) | [`UX_PRINCIPLES`](docs/UX_PRINCIPLES.md) · [`NAVIGATION_ARCHITECTURE`](docs/NAVIGATION_ARCHITECTURE.md) · [`PERSISTENT_SHELL`](docs/PERSISTENT_SHELL.md) · [`DOCUMENT_SYSTEM`](docs/DOCUMENT_SYSTEM.md) · [`GUIDED_WORKFLOW`](docs/GUIDED_WORKFLOW.md) |
| **Consumer demo** | [`examples/consumer-demo/`](examples/consumer-demo/): read [`index.html`](examples/consumer-demo/index.html), then [`demo-config.js`](examples/consumer-demo/demo-config.js), then [`demo.js`](examples/consumer-demo/demo.js) | Check it with [`tools/public_consumer_smoke.py`](tools/public_consumer_smoke.py) (§3) |
| **Manifest** | [`template/TEMPLATE_MANIFEST.json`](template/TEMPLATE_MANIFEST.json), block `goldenFrontendV1`: `requiredRuntime`, `optionalRuntime`, `exampleOnly`, `classification`, `configSeams`, `limitations` | The blocks `layers`, `componentRegistry`, `configurableProjectFields` and `routeModuleContract`. Lab-only paths in the manifest are explained in §4 |
| **Adoption documentation** | [`docs/GOLDEN_FRONTEND_V1_START_HERE.md`](docs/GOLDEN_FRONTEND_V1_START_HERE.md) §3–§6 and the [README adoption guide](README.md#adoption-guide) | [`PORTABILITY_CONTRACT`](docs/PORTABILITY_CONTRACT.md) · [`template/page-skeleton.html`](template/page-skeleton.html) · [`template/project-config.example.js`](template/project-config.example.js) · [`APP_ARCHITECTURE`](docs/APP_ARCHITECTURE.md) · [`DESIGN_DECISIONS`](docs/DESIGN_DECISIONS.md) (why each rule exists) |
| **Component classes** | [README: components and examples](README.md#components-and-examples): Reusable, Configurable, Requires adaptation and Example only | the frozen START_HERE §3 inventory |
| **Framework adaptation** | [README: framework adaptation](README.md#framework-adaptation): translating tokens, components, patterns and principles to React / TypeScript, Next.js, Tailwind CSS, shadcn/ui, Vue, Laravel and other stacks | [`COMPONENT_RULES`](docs/COMPONENT_RULES.md) as the specification of each component |
| **Product categories and customization** | [README: product categories](README.md#using-golden-across-product-categories) | [README: design workflow](README.md#design-and-implementation-workflow) · [README: project approvals and stages](README.md#respecting-project-approvals-and-stages) |
| **Instructions for AI agents** (Planning Architect, Independent Second Reviewer, Coding Executor) | [`AGENTS.md`](AGENTS.md) | — |

## 2. Reading paths

- **Product or design review:** [README](README.md) → the [consumer demo](examples/consumer-demo/) →
  [`DESIGN_SYSTEM`](docs/DESIGN_SYSTEM.md) → [`UX_PRINCIPLES`](docs/UX_PRINCIPLES.md) →
  [`COMPONENT_CATALOG`](docs/COMPONENT_CATALOG.md).
- **Developer adopting Golden:**
  1. the [README adoption guide](README.md#adoption-guide);
  2. the demo source;
  3. [`GOLDEN_FRONTEND_V1_START_HERE`](docs/GOLDEN_FRONTEND_V1_START_HERE.md) §4;
  4. [`PORTABILITY_CONTRACT`](docs/PORTABILITY_CONTRACT.md);
  5. the [skeleton](template/page-skeleton.html) and the [example configuration](template/project-config.example.js);
  6. [`COMPONENT_RULES`](docs/COMPONENT_RULES.md) for each component you use.
- **Developer on another stack:** the [README framework adaptation](README.md#framework-adaptation) first,
  then the same documents as above.
- **AI agents:**
  - Planning Architect: [`AGENTS.md` §2](AGENTS.md#2-planning-architect).
  - Independent Second Reviewer: [`AGENTS.md` §3](AGENTS.md#3-independent-second-reviewer).
  - Coding Executor: [`AGENTS.md` §4](AGENTS.md#4-coding-executor).
  - Every role starts with [`AGENTS.md` §0–§1](AGENTS.md#1-rules-for-every-agent).

## 3. Run and verify

Open `examples/consumer-demo/index.html` directly, or serve the repository root and open
`http://127.0.0.1:8137/examples/consumer-demo/index.html`:

```bash
python tools/serve.py
```

The public smoke test runs the frozen consumer-demo checks from any clone. It needs Playwright for Python
and its Chromium (`python -m pip install playwright`, then `python -m playwright install chromium`). The
expected result is `13/13 checks passed`:

```bash
python tools/public_consumer_smoke.py
```

Integrity: 41 × `OK` for the frozen files, then every file of the package:

```bash
sha256sum -c release/golden-frontend-v1.0/SHA256SUMS-scope.txt
```

```bash
sha256sum -c SHA256SUMS-public.txt
```

## 4. Reading the frozen documents

The 18 documents in `docs/` and the manifest are frozen exactly as approved. They were written for the
complete private lab, so they also mention material that is not published:

- MULTIPLECORP pages (`pages/`);
- business modules and fixtures (`assets/js/modules/`, `assets/js/fixtures/`), module CSS and images;
- the lab QA tools (every `tools/*.py` except `serve.py`, `golden_consumer_smoke.py` and
  `public_consumer_smoke.py`);
- review pages, evidence, scratch notes and analysis.

There are 242 such mentions, listed by area in [`PUBLIC_RELEASE.md`](PUBLIC_RELEASE.md). They are plain path
names, not links. Treat them as context for how a pattern was exercised, and do not recreate them. In
particular:

- The smoke command in the frozen START_HERE §6 (`python tools/golden_consumer_smoke.py evidence/...`) works
  only inside the lab. From a clone, use `python tools/public_consumer_smoke.py`, which runs the same checks.
- "Full reference app: `pages/`" refers to the lab. The public working example is the consumer demo.
- Fifteen files still carry the historical header "FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL". The
  status comes from these sources, in this order:
  1. [`FREEZE_RECORD`](release/golden-frontend-v1.0/FREEZE_RECORD.md);
  2. the frozen START_HERE;
  3. the manifest's `goldenFrontendV1` block.
- The manifest blocks `tools`, `review` and `layers.C_project_fixture_and_implementation` list lab files. The
  second entry of `goldenFrontendV1.checksums` (the demo-baseline list) is not published.
- **"GOLDEN FIXED" and "copy as-is."**
  - These labels in the frozen documents and the manifest mark the shared default that every project
    starts from. On the reference stack, they also mean the files are used unchanged and never forked per
    screen.
  - Under the Owner's design policy, each project may still adapt a default to its approved requirements
    and technology, recording the deviation in its own decision records.
  - The labels do not require identical products, and the decision records themselves stay as frozen.
- **The "approved mockups"** (REF-M1 to REF-M3) are the historical references the visual baseline was
  calibrated against. They are provenance, not a step that new projects repeat: no mockup is required
  before frontend work.

The complete list of technical limitations is in the
[README technical limitations](README.md#technical-limitations).
