# Golden Frontend Reference v1.0 — Freeze Record

| Field | Value |
|---|---|
| Version | **Golden Frontend Reference v1.0** (manifest version `1.0.0`) |
| Status | **FROZEN — OWNER APPROVED** |
| Freeze date | **2026-10-12** |
| Baseline identifier | **golden-frontend-v1.0** |
| Git tag | **none** — `C:\DesignLab\MultipleCorp-Golden-Reference` is not a Git repository; this record and its SHA-256 lists are the reproducible baseline |
| Scope checksum list | `SHA256SUMS-scope.txt` — 41 files, 2,285,546 bytes, list digest `39fa879dc304275e55b1ffecda290ebd6b481a27d89bbda67011c26e0796eca4` |
| Demo baseline list | `SHA256SUMS-demo-baseline.txt` — 239 files, 9,509,730 bytes, list digest `ec96c07aced8a4b3480ca63f387a32b566403c42dfbabd774c37d80e81d2e74d` (MULTIPLECORP demonstration files; recorded for traceability, NOT part of the approved scope) |
| Entry document | `docs/GOLDEN_FRONTEND_V1_START_HERE.md` |
| Consumer demo | `examples/consumer-demo/index.html` (smoke test `tools/golden_consumer_smoke.py`) |
| Visual baseline | the Owner-approved R13 Refine design |

## Approved scope
The reusable design system (tokens, typography, colour, spacing, surfaces, status language, motion), the frontend
reference (shell, navigation, lists + numbering + pagination, forms + validation, dialogs, results, workflow stepper,
guidance, document preview / composer engines), the component library code in the scope list, the UX patterns and rules,
the portability documentation (`docs/*.md`, `template/*`) and the independent consumer demo.

## Not approved by this freeze (separate statuses)
- **MULTIPLECORP FULL APPLICATION QA — INCOMPLETE / VERIFICATION PENDING**: one full behaviour run, one complete
  router_check (Admin parity) and clickability --role admin remain unrun after the last application changes
  (`scratch/r13/R13_FINAL_QA_REPORT.md`).
- Backend security, authorization, transactional numbering, production readiness.

## Verification at freeze (no lengthy application test rerun)
- Consumer smoke test **13/13** (2026-10-12 03:07, `scratch/r13/phase10/qa/golden_smoke_final.txt`), recorded after the
  last change to any runtime or demo file (no scoped runtime / demo file is newer than that log).
- `template/TEMPLATE_MANIFEST.json` valid JSON; 46 path references, 0 missing.
- Scope checksums self-verified: `sha256sum -c release/golden-frontend-v1.0/SHA256SUMS-scope.txt` → 41 OK.

## Documented limitations (accepted with the approval)
1. The runtime API and the MULTIPLECORP configuration share `assets/js/project-config.js` (adoption: copy and replace
   ROUTES / MODULES / FIXTURES; demo seam `window.MC_PROJECT_PATCH`).
2. Golden CSS carries a few example-page blocks (`.pur-*`, `.atq-*`, `.prj-*`), unused by other projects.
3. Component micro-copy defaults are Indonesian.
4. Shell markup is written in each page (`template/page-skeleton.html`); the bottom-nav container is required.
5. Frontend guards are not authorization; backend obligations (authorization, numbering transactions, MSG-16) are
   documented, not implemented. No build step, package or framework bindings.

## Change policy
v1.0 is immutable. Any change to a file in `SHA256SUMS-scope.txt` (or to the meaning of the frozen contracts) ships as
an explicitly versioned successor — v1.1 for compatible additions, v2.0 for breaking changes — with its own freeze record
and checksum list; v1.0 files are never modified silently. MULTIPLECORP demonstration work (pages, modules, fixtures) may
continue independently; a change there is recorded against the demo baseline, not against v1.0.

## How to verify the baseline
From the workspace root: `sha256sum -c release/golden-frontend-v1.0/SHA256SUMS-scope.txt` (every line must read OK).
History is preserved: R13 checkpoints and reports in `scratch/r13/`, evidence in `evidence/final/r13/`.
