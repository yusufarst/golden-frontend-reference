# Guided workflow (r13 Phase 6 + 7, consolidated in Phase 9)

One page that explains HOW the Golden guides work, so a future project agent does not need the R13 conversation.
Details live in the documents linked here; this page only connects them.

## 1. Principles (why)
- Guide on the real screens, never with a wizard across commits; nothing is stored as progress (UX_PRINCIPLES §17-§19).
- Every next step follows from the record's state and is open to the account (D-56, D-58).
- Guidance is optional and quiet: a walkthrough is offered once; the "Ringkas" level removes explanations, never a
  warning, an error, a next step or an outcome (D-57).

## 2. Components (Layer A, `assets/js/guide.js` + `patterns.css`)
| Need | Component | Notes |
|---|---|---|
| Where a sequence stands | `MCProgress` (read-only stepper) | derived steps only; the module computes them (e.g. 11 from the completion gate) |
| Moving between stages of one task | `MCStepper` (`.mc-flow`) | composer stages; Terbit = locked final step (D-55) |
| What to do next | `MCNext` | ONE action + why + quiet links; `variant: 'outline'` while waiting for someone else |
| What blocks it | `MCPrereq` | missing data / capability ("Perlu kewenangan") / Owner-only blocker (MSG-17) |
| Validation and recovery | `MCChecks` | BLOCKING / WARNING / OK in business sentences; "Perbaiki" reveals and focuses the field |
| The answer of a command | `MCResult` | outcome + number headline + PDF state + ONE next step (D-55, D-56) |
| Levels | `MCGuide` | Terpandu / Ringkas, `<html data-guidance>`, account menu "Panduan" |
| How a screen works | `MCHelp` | "Cara kerja" from `help.screens` |
| Where to resume | `MCResume` | records this viewer opened last (ids + labels only) |
| Walkthrough | `MCTour` | `help.tours`; real targets, cross-page, Esc = skip; tested: every step's target exists (Phase 9) |
| Refused address | `MCPage.guard` + `MCRoutes.denial` | MSG-10 forbidden vs not-found (D-58) |

## 3. Configuration (Layer B, `project-config.js`)
`help: { defaultLevel, levels?, tours: { id: { title, capability, steps: [{ route, href, target, title, body }] } },
screens: { routeId: { howItWorks: [...] } } }` · `ROUTES[id].capability` for command screens · composer templates:
`stages`, `reviewFacts`, `businessDate`, `issue.result(...).next`. See AGENT_START_HERE and PORTABILITY_CONTRACT.

## 4. MULTIPLECORP content (Layer C, not portable)
Admin home bands (06), the project stage derivation from the canonical completion gate (11), the quotation flow
(14: stages, Tanggal transaksi, "Menunggu jawaban klien", approval = confirmation AX-13), the handoff table in
ROLE_JOURNEYS ("verified cross-module handoffs").

## 5. Tests
`tools/behaviour_test.py` blocks "r13 Phase 6", "r13 Phase 7", "r13 Phase 9" (run them with
`scratch/r13/phase5b/run_block.py --with-5a`); the full suite and `tools/router_check.py` run once in Phase 10.
