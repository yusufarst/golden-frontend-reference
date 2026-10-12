# MULTIPLECORP Golden Reference — UX principles (r11, navigation r12)

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL**.

Practical rules for every screen built on this template. They come from the R11 manual audit of all
routes, the canonical MultipleCorp documents (roles, permissions, glossary) and a study of how mature
design systems handle actions, filters, tables and responsive simplification. They describe *how to
decide*, not how a component looks (that is `docs/DESIGN_SYSTEM.md` / `docs/COMPONENT_CATALOG.md`).
Decisions that apply them: `docs/DESIGN_DECISIONS.md` D-26 … D-33 (navigation, §16: D-47 … D-51). Per-route
evidence: `docs/UX_AUDIT_R11.md`; every important control: `docs/ACTION_ROUTE_MATRIX.md`; the navigation model:
`docs/NAVIGATION_ARCHITECTURE.md`.

## 1. A screen answers five questions in seconds
1. Where am I? (title = the object or list, a noun; ancestors-only breadcrumb on detail pages)
2. What am I looking at? (one quiet meta line; key figures in ONE metric strip)
3. What needs my attention? (derived "Perlu tindakan" rows, worst first, top 3)
4. What is the ONE most important next action? (the single primary)
5. Where are the less common actions? ("Tindakan Lain", row menu, detail sheet, command palette)

If a first-time user cannot answer these from a screenshot, the hierarchy is wrong — not the user.

## 2. Task before capability
A page shows the actions its job needs, not every action the data allows. Capability decides whether
an action EXISTS for an account; the page decides whether it is VISIBLE NOW. Simplify visibility,
never capability: an action moved into a menu still works, and a capability is never removed to make
a screen calmer.

## 3. One dominant next action
- At most one filled (primary) button per local region: page header, a panel, a dialog footer, the
  sticky action bar. Never two green CTAs competing in one view.
- A page that has no single job (dashboard, hub, review, audit) has **no** header primary; its rows
  are the actions.
- The primary is the step the account can actually take now (capability + state). When it is not
  available, the next quieter action leads; a disabled primary is shown only when the action exists
  for this account but is temporarily blocked by state (with the reason).

## 4. Progressive disclosure of secondary actions (action budget)
| Context | Visible | Everything else |
|---|---|---|
| Page header ≥ 1025 px | 1 primary + ≤ 2 quiet secondary | one **"Tindakan Lain ▾"** menu (glossary GL-187) |
| Page header 768–1024 px | 1 primary + ≤ 1 secondary | "Tindakan Lain ▾" |
| Page header ≤ 767 px | primary + "⋯" (44 × 44) on one row | bottom action sheet (≤ ~7 items + "Batal") |
| List row | the row is the link + chevron; ≤ 1 next-step action in a work queue | row menu "⋯" or the detail sheet |
| Section head | ≤ 1 text action ("Lihat semua", "Ubah") | — |
**Button soup is a defect**, not a style: five or more visible buttons in one local context means the
hierarchy needs review (`tools/ux_density.py` flags it). Menus order
items by frequency, then: output (Cetak, Unduh), administrative, separator, destructive last.
A lone harmless action is never wrapped in a one-item menu: it is shown as the quiet button it is.

## 5. A button changes data or starts a task — navigation is a place
Header buttons are verb + object ("Catat Pembayaran", "Buat Pembelian"). Going somewhere else (a
sibling list, the parent record, another module) is a breadcrumb, a meta link, a section link, a row,
an overflow item or the command palette — never a header button next to the primary. The same
destination is offered once per local block (button + chevron + text link + card click to one place
is a defect; keep the clearest). r12: a sibling list or another module is its navigation entry; a page
link to it stays only when it carries the current object's scope (§16).

## 6. Destructive actions are deliberate
Destructive and corrective actions (Batalkan, Hapuskan, Tutup Sisa, Lepas, Arsipkan) live last in
"Tindakan Lain" or in the record's detail panel, in red, with the specific verb, and keep their risk
level (MCRisk LOW / COMMIT / DESTRUCTIVE / CRITICAL). They are never a visible secondary beside the
primary, unless the page itself is that destructive task (e.g. a confirmation dialog). Simplifying a
layout never adds or removes a confirmation.

## 7. Role-aware visibility and emphasis
- **Owner = oversight + decision + review + business visibility.** Owner screens lead with what needs
  attention, the figures that explain it, and drill-down. Execution verbs the Owner is allowed to use
  (Terima Barang, Catat Barang Keluar, Lengkapi) are quieter on Owner surfaces (secondary or
  "Tindakan Lain"), and Owner surfaces use oversight verbs (Lihat, Tinjau).
- **Admin = execution + data entry + follow-up.** Admin screens lead with the current work and the
  one capability-valid next step as the primary.
- **Hide what the capability disallows** (canonical IP-21). A control the account can never use is
  absent — no disabled primary, no "only the Owner can…" card. Disable with a reason only when the
  action exists for this account and the record's state blocks it. Gate links by the capability of the
  ACTION the destination performs (`MCApp.canGo(route)`), not by a proxy capability.
- The project configuration decides capability; the Golden layer only decides how priority is
  presented. Never encode "role X always has button Y" in shared CSS or patterns.

## 8. Calm chrome, dense data, clear hierarchy
- One density per page; chrome (headers, toolbars, borders) is quieter than the content.
- Text hierarchy: object name strongest; ids, dates, metadata quieter; numbers right-aligned with
  tabular figures; filter values and secondary columns are not bold.
- Status appears once per context: the header pill for the record; one status column in rows; the
  normal state stays quiet and only exceptions get colour. Live pulse only for genuinely live state.
- No decorative section-heading icons; an icon must carry meaning (and file icons only on controls
  that produce a file).

## 9. Fewer surfaces, aligned edges, intentional negative space
- A card is for a distinct object, a group scanned as one unit, an actionable summary or a region with
  its own loading/error state. No card inside a card; a single list needs no card head that repeats the
  page title; a tab panel does not repeat the tab label as a heading.
- Key figures are ONE strip with hairline dividers, not a row of separate cards; metadata (dates,
  references) belongs in the header meta line, not in a figure tile.
- Symmetry means aligned structural edges and consistent gutters, not equal heights: content-driven
  height is fine, dead space created to equalise cards is not.
- Spacing comes from tokens (`--pt-gap`, `--card-padding`, `--space-*`); off-scale values need an optical
  reason written next to them.
- Page width follows the archetype (data 1680 / standard 1440 / settings 1280 / form 1120 / focused 960),
  so a form never stretches across a wide monitor.

## 10. Filters that never wrap
Search + the company view + 1–2 promoted filters stay visible; everything else sits behind one
"Filter (n)" button (popover on wide screens, a sheet on phones). The toolbar never wraps to a second row
and never scrolls sideways on a phone (phone toolbar = search + Filter). Sort is not a filter. Filters
that duplicate a tab or segmented control are removed. Only keys the screen inventory names are offered.

## 11. Lists and tables
A column earns its place by helping to identify, compare, decide or act. No "Perusahaan" column when the
record number already carries the company code; constant-value columns disappear. Index lists (open a
record) and analytical tables (compare and total) are different archetypes: analytical tables have no
row actions. Lists paginate with "Muat Lagi" (25) and say how many there are; never infinite scroll for
financial or operational lists.

## 12. Responsive simplification by priority, not by wrapping
Phones expose fewer simultaneous actions than desktop: primary + "⋯". The first 390 × 844 viewport shows
where the user is, what matters and the next action — not mostly header, filters and padding. Focused
task and form screens hide the bottom navigation while their sticky action bar is shown. Record numbers
never truncate (the meta truncates instead); titles break only after "/". Tablet is composed on purpose
(rail, one secondary, tables that tighten before turning into rows).

## 13. Context-driven routing
Every signal, row and next-step link goes to the screen where that action happens for a holder of its
capability, otherwise to the record's view. Avoid hops through unrelated modules for one task; do not
create duplicate screens to save one click. The command palette (Ctrl K) is the speed layer for rare
navigation and actions — every action in it also exists in the visible UI.

## 14. Minimal feedback
One channel per event, chosen by where the user is looking: inline near the control, a banner after
navigation, a toast only for background completion or undo. Never toast + inline + modal + badge for the
same action. Buttons keep their label while pending.

## 15. Copy says it once
At most one policy or explainer sentence per page (where it is acted on); section subtitles carry data
context only. Labels are specific outcomes ("Batalkan pembelian ARJ/PB/2026/10/0418"), not generic
("Proses", "OK").

## 16. Navigation: where to go versus what to do (r12)
- **The navigation answers "ke fungsi mana?"; the page answers "apa yang dikerjakan di sini?".** Persistent
  destinations live in ONE two-level tree (sidebar, rail, drawer); the page keeps its job, its task actions and
  the links that follow its business object. One clear function = one clear entry, not one route = one entry.
- **Never mix the five placements**: sidebar / drawer = persistent destination; tabs = views of one object or
  workspace; contextual link = a related business object (scoped: `?proyek=`, `?sel=`, `?pembelian=`);
  button = a task (verb + object); overflow = rare or secondary actions. A page never repeats an unscoped entry
  the role's navigation already provides (sub-nav row, header button, tile, subtitle link, sibling breadcrumb).
- **Two levels, disclosure only.** A group header opens and closes its group and never navigates; no flyouts,
  no hover menus, no third level. A group of one is a flat link. Records, create flows, actions and system pages
  are never entries; they mark the entry they belong to.
- **One current place.** Only the group holding the current entry is open on load (nothing remembered); exactly
  one element per navigation landmark carries `aria-current` ("page" on the entry, "true" on a detail or task
  inside it; the group header only while the child is not visible). No badge, count or pulse in navigation.
- **Same tree everywhere.** Desktop sidebar, collapsed rail, tablet rail, drawer and palette show the same
  entries in the same order; the phone bottom bar holds the four most frequent level-1 destinations of the role.
- **Role-aware by filtering, not by forking.** One tree filtered by role and capability; a role sees only what it
  can use (absent, never disabled); a deliberate presentation choice (`hiddenForRoles`) never removes access or the
  palette entry.
- **Removing a link never removes a path.** Every removed page link stays reachable through an entry, a row, a
  scoped contextual link, overflow or the palette (`docs/ACTION_ROUTE_MATRIX.md` R12).

## Principles considered and intentionally rejected
| Popular pattern | Why not here |
|---|---|
| Floating action button for the primary | It floats over rows and totals, competes with the header primary, and our primaries are often decisions, not "create". |
| Infinite scroll for operational / financial lists | Reconciling and auditing need a position, an end and a total; "Muat Lagi" with a count instead. |
| Icon-only toolbars | Domain verbs (Terima barang, Tagihkan) have no universal icon; icon-only only for universal utilities (search, close, ⋯, refresh) with a label for assistive tech. |
| Hover-only row actions | Invisible on touch, and the Owner often reviews on a tablet; persistent row menu + row click instead. |
| Optimistic UI for committing actions | A financial or stock command must not look done before it is recorded; pending state, then the confirmed result. |
| User-customisable toolbars | Support and training need every account to find an action in the same place; the role decides presentation. |
| Toast-first feedback | Easy to miss and usually duplicates the inline state; reserved for background completion. |
| Destructive item first in the phone action sheet | Same order as desktop (destructive last) keeps muscle memory and keeps it away from the first thumb position. |
| Flyout or hover sub-menus in the rail (r12) | Invisible on touch, fragile for keyboard and screen readers; a rail group icon opens the drawer at its group instead. |
| Group headers that navigate, or split "label navigates / chevron toggles" targets (r12) | One element must have one outcome for pointer, touch and assistive technology; the landing is the first child. |
| Remembering which groups were open (r12) | Every page starting from the same state (only the current group open) is predictable and keeps the sidebar short. |
| Badges or counts on navigation entries (r12) | Attention lives on Beranda and in "Perlu tindakan" rows where it can be acted on (canonical D-IA-06). |
| A separate menu per role (r12) | One tree filtered by role and capability keeps one order for training and support, and one test surface. |

## 17. One workspace, one reading order (r13 harmony)
A working screen answers, in this order: which document → its business status → which step I am in → what needs my
attention → what the result looks like → what to do next. Identity is stated once; the step navigator belongs to the
work it steers; the success result names the outcome, then the official number, then the single next action. Every list
shows the position of each record so people can say "nomor 7" to each other — the position is never an identifier.

## 18. Guided work without a wizard (r13 Phase 6)
A first-time Admin learns the real flow ON the real screens: where work waits (Antrean Tindakan + "Lanjutkan
pekerjaan"), which stage a project is in (derived from records, never ticked by a visit), the ONE next step, data reused
from its source, the live preview, problems with "Perbaiki", what issuance means, and what the next step depends on
(a client answer is never pretended). Guidance is optional and quiet: a walkthrough is offered once and can be restarted
from "Panduan"; the "Ringkas" level removes explanations but never a warning, an error, a next step or an outcome.
The screens must stay understandable without the walkthrough - it explains, it never unlocks.

## 19. Every next step is earned by the record (r13 Phase 7)
A recommended action must follow from the record's actual state and be open to this account: "Menunggu jawaban klien"
before a client answer exists, "Tagihkan" before "Catat Pembayaran", "Catat Barang Masuk saat barang tiba" after a
purchase - never an urgent primary for a fact that has not happened. A refused address answers plainly (MSG-10 or
not-found) and shows nothing of the record. A link may carry context (`?klien=`, `?pembelian=`, `?proyek=`); opening it
preselects, never executes, never overwrites a choice already made, and an invalid id is said plainly.
