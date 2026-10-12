# MULTIPLECORP Golden Reference — Design decisions (v1.0 Freeze Candidate)

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL**. Lab only; nothing here is integrated
into `C:\Projects\MultipleCorp` (read-only source for this work).

Each decision lists the **purpose** it serves, the **source** that decided it (canonical MULTIPLECORP
documentation > explicit Owner Golden requirement > Golden design system > current implementation >
designer judgement) and the **layer** it belongs to: GOLDEN FIXED (design system, every project),
PROJECT CONFIGURABLE (project-config.js), BUSINESS FIXTURE (demo data only), PROJECT IMPLEMENTATION
RESPONSIBILITY, EXTERNAL / BACKEND RESPONSIBILITY. "Canonical" = derived from the MULTIPLECORP
canonical documents (IA, DOMAIN, ADMIN_FLOW, PERMISSIONS, workflows); "fixture" = an assumption of the
prototype's demo data that a real project replaces.

---

## D-01 Navigation follows the canonical business flow
- **Decision**: sidebar = Beranda, Proyek, Pembelian, Gudang, Pengiriman, Dokumen, Keuangan, Kasus
  Koreksi, Laporan, Data Master; group "Khusus Owner" = Tinjauan & Aktivitas, Pengaturan.
- **Purpose**: the order follows the work (project → buy → store → deliver → document → bill →
  correct → report); no destination has two homes.
- **Source**: canonical IA (desktop sidebar). Simplification (designer): the canonical Owner items
  Tinjauan Owner, Riwayat Aktivitas and Log Keamanan share ONE entry "Tinjauan & Aktivitas" (Riwayat
  Aktivitas holds Log Keamanan as a tab) so the Owner group stays two lines.
- **Layer**: PROJECT CONFIGURABLE (`MODULES`, `navigation.sidebar`); the navigation model is GOLDEN FIXED.
- *R12 (D-47)*: the order stands; the sidebar is now a two-level tree and the merged single entry "Tinjauan &
  Aktivitas" became a disclosure group: "Khusus Owner" = Tinjauan ▸ (Tinjauan Owner · Riwayat Aktivitas · Log
  Keamanan, each its own canonical entry) · Pengaturan ▸. The group is labelled "Tinjauan": the longer label
  ellipsized beside its chevron at 1280–1440.

## D-02 Phone bottom bar = canonical first three + one role destination
- **Decision**: Owner: Beranda · Proyek · Gudang · Keuangan. Admin Operasional: Beranda · Proyek ·
  Gudang · Pengiriman. The canonical "Cari" and "Lainnya" slots are the app-bar search button and the
  app-bar Menu (full navigation drawer) that the Golden shell already has.
- **Purpose**: four large targets for the most frequent destinations; nothing duplicated between
  the app bar and the bottom bar.
- **Source**: canonical IA phone bar (Beranda, Proyek, Gudang, Cari, Lainnya) mapped onto the
  Owner-approved Golden shell (app bar + drawer + bottom bar).
- **Layer**: PROJECT CONFIGURABLE (`navigation.bottom`, role fixture).
- *R12 (D-51)*: the mapping stands (4 slots + app-bar Menu and search); the role's bar now comes from
  `navigation.bottom: { default, admin }` instead of the role fixture, and a slot lights for its whole area.

## D-03 Account menu = Akun Saya + Keluar (+ keyboard reference on desktop)
- **Decision**: "Profil saya" and "Pengaturan akun" both meant the one canonical SCR-03 Akun Saya page;
  they are merged into "Akun Saya".
- **Source**: canonical IA account menu. **Layer**: PROJECT CONFIGURABLE (`account.menu`).

## D-04 Route registry without a router
- **Decision**: every screen is a static page file registered in `ROUTES` (id, file, title, module,
  group, archetype, parent, params, roles). Links are plain `href`s built with `MCRoutes.href()`;
  detail pages read `?id=`; tabs write `?tab=` with `history.replaceState`.
- **Purpose**: works on `file://`, needs no build, keeps every address shareable, and feeds the app map,
  the command palette, breadcrumbs, the role guard and the route-integrity test from one list.
- **Layer**: GOLDEN FIXED mechanism (`MCRoutes` API), PROJECT CONFIGURABLE content (`ROUTES`, `MODULES`).
- *(r13)*: over HTTP the persistent-shell router swaps pages in place (D-52, draft in `docs/PERSISTENT_SHELL.md` §6;
  Phase 9 merges it here); this registry is unchanged and feeds it. D-04 stays exactly as written for `file://` and
  every router failure (full document loads).

## D-05 Role guard = canonical not-found page
- **Decision**: a role outside a route's `roles` sees "Halaman tidak ditemukan" in place (same page as
  an unknown address); navigation never shows such routes.
- **Source**: canonical IA/PERMISSIONS ("Owner-only addresses return the same not-found page").
- **Layer**: GOLDEN FIXED behaviour; PROJECT CONFIGURABLE roles; real authorization is an EXTERNAL /
  BACKEND RESPONSIBILITY (the prototype only hides).

## D-06 Company context is a view, not an authorization
- **Decision**: lists carry a company code tag per row and the header filter "Tampilkan: Semua
  perusahaan" (only for accounts with 2+ companies, remembered for the session). An Admin never sees
  records of companies outside the grants; pooled stock lots of such companies show "perusahaan lain".
  The Owner's cross-company figures say "Gabungan". No company switcher in the shell.
- **Source**: canonical IA company-context model. **Layer**: GOLDEN FIXED pattern (`MCCompany`,
  `MCFilter`), BUSINESS FIXTURE companies (ARJ, BTN, CKP are fictitious).

## D-07 Purchases have no draft and no currency (canonical correction of the Golden form)
- **Decision**: the r9 split menu item "Simpan sebagai draf" and the "Mata uang" field are removed.
  The form is a 3-step flow: 1 Input pembelian → "Lanjut ke review" (validates; invalid input never
  opens the next step) → 2 Review & konfirmasi ("Periksa sebelum disimpan": what will be recorded and
  its consequence: status Terbuka, stock unchanged until Barang Masuk, PO issued later after preview) →
  "Simpan pembelian" (pending + one execution) → 3 Selesai (number, status, next actions). The split
  menu holds "Pratinjau PO" (read-only preview, nothing saved; in step 2 "Simpan & pratinjau PO") and
  "Batalkan pengisian" (destructive, asks only after input). "Perusahaan" is shown read-only
  ("mengikuti proyek").
- **Purpose**: the Owner-approved visual form stays; the business meaning becomes correct.
- **Source**: canonical DOMAIN (Purchase header OPEN/CLOSED/CANCELLED; Rupiah only; one company per
  root) overrides the r9 Golden fixture assumption (draft + currency).
- **Layer**: BUSINESS rule (project), the 3-step pattern and split action are GOLDEN FIXED.

## D-08 Suppliers and companies are fictitious and never mixed
- **Decision**: own companies (CV Arunika Jaya, PT Bentara Niaga, CV Cakra Persada) are never offered
  as suppliers or clients; suppliers carry "Contoh" in their names.
- **Source**: canonical synthetic-data rule; corrects the r9 fixture ("CV Arunika Jaya" as supplier
  and as client of "Pengadaan Server 12U"). **Layer**: BUSINESS FIXTURE.

## D-09 Risk-based confirmation
- **Decision**: LOW (no confirmation: filters, tabs, previews), COMMIT (validate → one confirmation
  summarising the record + consequence → execute with a pending state; invalid input never opens a
  dialog), DESTRUCTIVE (consequence explained, safe choice focused, scrim does not answer), CRITICAL
  (void an issued document, write-off, force completion, access change: required reason and/or typed
  confirmation word; production adds step-up re-authentication). A multi-step form's review step IS
  its commit confirmation (no second dialog). Double execution: one in-flight execution per key; the
  trigger is disabled + `aria-busy`.
- **Source**: master brief; canonical IP-08 confirmation pattern + command outcomes. **Layer**:
  GOLDEN FIXED (`MCRisk`); idempotent command handling is an EXTERNAL / BACKEND RESPONSIBILITY.

## D-10 Overlay contract
- **Decision**: menus and popovers close on outside click and Esc (a date filter's unapplied custom
  range is discarded, never applied silently); non-critical sheets close via scrim, Esc, their Back
  control and browser Back; decision dialogs close only by a deliberate answer (scrim click nudges the
  dialog and focuses the safe choice; Esc = cancel); info dialogs close from the scrim.
- **Layer**: GOLDEN FIXED.

## D-11 Long text
- **Decision**: single-line cells ellipsize; the full text stays reachable (tooltip on pointer devices,
  the record detail, and a controlled slow reveal only when the text actually overflows, pausable, never
  a marquee; reduced motion: no automatic movement).
- **Layer**: GOLDEN FIXED (`MCLongText`, `.mc-truncate`, `.pt-cell__title`).

## D-12 Live status
- **Decision**: only the primary status of the record in view that is genuinely ongoing (a receipt in
  progress) breathes (2 s soft ring on the pill dot); lists never animate every pill; reduced motion =
  static. *R11 (D-32)*: an active project is a state, not an ongoing process — it no longer breathes.
- **Layer**: GOLDEN FIXED (`.mc-pill--live`); which states are live = PROJECT (status registry `live`).

## D-13 Stepper geometry
- **Decision**: equal columns, markers on one centre line, connectors drawn between marker edges with
  equal gaps, labels wrap under their marker; states complete / current / upcoming / attention;
  symmetric from 360 px to desktop.
- **Layer**: GOLDEN FIXED (`.mc-stepper`).

## D-14 Product metadata
- **Decision**: a product row shows the product name as the primary line and the SKU as the secondary
  line; the project-item mapping is shown only when it adds information (differs from the name).
- **Layer**: GOLDEN FIXED rule.

## D-15 Dashboard signals are canonical, derived and routed
- **Decision**: "Tindakan hari ini" lists derived signals only (receivables due within 7 days,
  purchases awaiting Barang Masuk, a dispatch not yet recorded as delivered, incomplete administration
  documents, activities for Owner review). The non-canonical "persetujuan anggaran" (approvals) item is
  removed: canonical review is a derived view, never an approval. Each row opens the screen where the
  next action happens; nothing is "marked read".
- **Source**: canonical IA signals (QS-xx) and Tinjauan Owner rule. **Layer**: BUSINESS (project).

## D-16 Detail hub on phones = drill-in parts
- **Decision**: the project hub shows tabs on tablet/desktop; on phones the parts become a list of rows
  (part name + its derived fact) that open the part in a full-height sheet with "Kembali ke proyek".
- **Source**: canonical IA SCR-10 phone pattern. **Layer**: GOLDEN FIXED archetype (detail-hub).

## D-17 Documents: preview before final generation
- **Decision**: every generated document is previewed (paper sheet with "PRATINJAU" watermark) before
  "Terbitkan"; issued documents are immutable (revise = new version, void keeps the number); external
  originals ("Asli dari klien") are uploaded, never generated.
- **Source**: canonical document lifecycle (DRAFT / ISSUED / REVISED / VOIDED). **Layer**: GOLDEN FIXED
  preview pattern, BUSINESS lifecycle.

## D-18 Finance keeps five concepts apart
- **Decision**: Nilai penjualan (issued invoices), Piutang aktif (billed, unpaid), Kas masuk
  (payments), Biaya / HPP and Kas keluar are never merged into one figure; an issued invoice is
  "Belum Ditagihkan" until the separate billing act sets the due date.
- **Source**: canonical DOMAIN finance model. **Layer**: BUSINESS.

## D-19 Browser titles name the screen, never the record
- **Decision**: `<title>` = route title ("Detail Dokumen · MultipleCorp"); the record (number, name) is the
  page heading and breadcrumb only.
- **Purpose**: titles leak into browser history, tab strips and screen shares.
- **Source**: canonical IA ("page titles never contain business data"). **Layer**: GOLDEN FIXED.

## D-20 Ageing lives with the figures, not above the receivables list
- **Decision**: the ageing composition (same buckets as Beranda) sits on the Keuangan hub and in the
  receivables report; Piutang is a list of invoices with remainder and due state (tabs Aktif / Belum
  Ditagihkan / Sengketa, per-company subtotals, selected invoice beside it).
- **Source**: canonical IA SCR-40 (no bucket counts above the list; ageing belongs to the report).
  **Layer**: BUSINESS (project).

## D-21 Corrections are recorded, with a reason, never deleted
- **Decision**: reversals, releases, cancellations and closures of business records use DESTRUCTIVE
  or CRITICAL confirmation with a required reason (`MCRisk` `confirm.reason: true`); the result is an
  appended correction (Riwayat Stok "Pembalikan", Kasus Koreksi), never a silent edit.
- **Source**: canonical correction model (CM-xx, ADM+ commands). **Layer**: GOLDEN FIXED pattern,
  PROJECT IMPLEMENTATION for which commands need it.

## D-22 Session records make the prototype feel connected
- **Decision**: records created or changed during a visit (a purchase saved on Buat Pembelian, a
  delivery recorded, a payment applied) are kept in `sessionStorage` (`MCApp.session`) and appear in
  every related list and detail for that tab; Beranda stays a fixture snapshot ("per 14 Okt 2026").
- **Purpose**: the Owner can follow one action across modules without a backend.
- **Layer**: PROJECT IMPLEMENTATION (prototype only); persistence is an EXTERNAL / BACKEND RESPONSIBILITY.

## D-23 Second role preview
- **Decision**: `?role=admin` previews the Admin Operasional (Sari Wulandari: ARJ + BTN, the fixture
  capability set, kewenangan khusus payment.reallocate / warnings.override / cases.close). Her Beranda
  is the canonical "Antrean Tindakan"; Owner-only screens answer with the not-found page; records of CKP
  never appear; pooled stock lots of CKP show "perusahaan lain".
- **Source**: canonical roles + PERMISSIONS. **Layer**: PROJECT CONFIGURABLE (`roleFixtures`).

## D-24 Floor tasks are one line at a time on phones
- **Decision**: Barang Masuk / Barang Keluar / Stok Opname show the worklist and a "current line" panel
  side by side on desktop and step through one line at a time on phones (scan field first, steppers
  with 44 px targets), ending in one summary before the commit.
- **Source**: canonical IA PT-20 (scan-led floor flows). **Layer**: GOLDEN FIXED archetype (task).

## D-25 Every phone target is at least 44 x 44 px
- **Decision**: in the content region on phones every control is at least 44 x 44 css px
  (`--touch-min`). Pattern pages get real 44 px buttons, filters, fields, links and date triggers
  (`patterns.css`, "touch targets"); the measured reference pages keep their visuals and add an
  invisible hit area (`::after`) where a control is smaller (Beranda action buttons). A field shell is
  one target: a tap on its padding or border opens the select / focuses the control. A Beranda KPI
  tile on phones is one tap target (the corner chevron used to be the only live area).
- **Source**: R10 accessibility requirement; WCAG 2.5.5 / 2.5.8. **Check**: `tools/a11y_check.py`
  (also headings, names, labels, alt, contrast). **Layer**: GOLDEN FIXED.

---

# R11 — principal UX audit: action simplification, visual harmony, role clarity

R11 audited every route manually (desktop 1366 × 768 and phone 390 × 844, plus tablet / 1920 for the
important screens) from the Owner and the Admin point of view, studied how mature design systems
handle actions, filters and density, and checked every role claim against the canonical documents.
Per-route findings: `docs/UX_AUDIT_R11.md`; principles: `docs/UX_PRINCIPLES.md`; journeys:
`docs/ROLE_JOURNEYS.md`; controls: `docs/ACTION_ROUTE_MATRIX.md`. The decisions below exist so a future
agent does not undo them.

## D-26 One action model per header, rendered by priority
- **Decision**: page and record headers declare their actions once (`MCActions.render(host, defs)`:
  `{ id, label, icon, priority: primary | secondary | overflow, href | action | demo, danger, disabled,
  reason, capability, roles }`). The renderer shows ONE primary, at most two quiet secondary buttons
  (one on tablets) and puts everything else (rare, administrative, output and every destructive action,
  last, after a separator) into ONE overflow menu labelled **"Tindakan Lain"**. Phones show the primary
  plus "⋯" (a bottom action sheet).
- **Why**: the Owner and the Admin hesitated in front of 3–6 equally weighted buttons; "button soup" made
  module pages feel like component showcases. The label follows the canonical glossary (GL-187 page-action
  overflow = "Tindakan Lain"; "Lainnya" is reserved for phone navigation, GL-030).
- **Rule kept**: capability decides whether an action exists, the renderer only decides where it shows; an
  action moved into the menu still works (items are delegated clones; `tools/clickability.py` opens every
  menu and clicks every item). **Layer**: GOLDEN FIXED (renderer), PROJECT IMPLEMENTATION (the defs).

## D-27 Breadcrumbs list the ancestors only
- **Decision**: `MCPage.crumbs` renders the ancestors of the current route (the title names the page);
  top-level pages show no breadcrumb. The former "← Kembali" was removed because it pointed to the same place
  as the parent crumb (two controls, one destination, on ~25 pages).
- **Layer**: GOLDEN FIXED.

## D-28 Key figures are one strip, not a row of cards
- **Decision**: `.pt-metrics` renders as ONE surface with hairline dividers; each cell draws its own
  left/top hairline so wrapped rows never show stray lines. Figure tiles hold numbers only (dates and
  references move to the header meta line); a figure is a link only when it drills to a different place.
- **Why**: four separate KPI cards + a signals card + two-column cards made detail pages read as card soup
  with uneven edges. **Layer**: GOLDEN FIXED.

## D-29 Tabs that do not fit collapse into "Bagian Lain"
- **Decision**: on tablet / desktop `MCTabs` keeps the tabs that fit and moves the rest, in order, into a
  trailing "Bagian Lain" menu (glossary GL-188); the selected tab always stays visible. Phones keep the
  swipeable row (detail hubs use the drill-in list). An optional `toolbar` sits right under the tab row.
- **Why**: the 11-part project hub hid "Riwayat" behind an edge fade at 1366 px. **Layer**: GOLDEN FIXED.

## D-30 Page container modes follow the archetype
- **Decision**: the route archetype sets `<html data-container>`: data (lists, list-detail, reports,
  dashboards, review) 1680 px; standard (detail, hub, document, task, checklist) 1440 px; settings 1280 px;
  form 1120 px; focused (search, system) 960 px. Header, body and the sticky action bar share one column,
  anchored LEFT on the top-bar edge (a centred column made the page edge jump between modules; only the right
  edge varies now). A route may override with `container` (85, 82, 90, 91 use standard).
- **Why**: forms and detail pages stretched to ~1650 px at 1920 (600 px inputs, numbers drifting apart).
  1366-class laptops are narrower than every cap. The measured pages 01–04 are excluded.
  **Layer**: GOLDEN FIXED (modes), PROJECT CONFIGURABLE (per-route override).

## D-31 "Perlu tindakan" is one pattern: worst first, top three
- **Decision**: derived attention blocks use `MCUI.signals(items, { max: 3 })`: rows sorted danger >
  warning > pending > info, the first three visible, the rest opened in place ("Lihat semua (n)"); the
  condition is the strong line and record numbers / dates sit in a quiet meta line; each row is ONE link to
  where the action happens. A signal never repeats the destination of the header primary, and the block
  carries no system-explanation subtitle.
- **Why**: hubs showed six full-width bold sentences above the tabs, pushing the work below the fold.
  **Layer**: GOLDEN FIXED.

## D-32 State is said once per context
- **Decision**: the header pill carries a record state; rows show one status column; notices appear only
  for a consequence, an exception or a next step; the normal state stays quiet and only exceptions get
  colour. The live pulse is reserved for genuinely live state (a project being "Aktif" is not live).
- **Why**: several screens repeated the same state 3–6 times (pill + banner + facts + sub-line + row).
  **Layer**: GOLDEN FIXED (rule), PROJECT IMPLEMENTATION (status registry `live` flags).

## D-33 Hide what the capability disallows; gate by the action capability
- **Decision**: a control the account can never use is absent (no disabled primary, no explanatory
  "only the Owner can…" card); disabled + reason is reserved for actions that exist for the account but are
  blocked by the record state. Links into task screens are gated by the capability of the ACTION that
  screen performs (`MCApp.canGo(route)`: gudang.masuk → stock.receive, gudang.keluar → stock.dispatch,
  gudang.opname → stock.count, pembelian.form → purchase.manage, pengiriman.catat → delivery.record,
  pembayaran.catat → payment.record, proyek.form → projects.manage); in-page commands use their own
  canonical capability (e.g. purchase.cancel, receivables.dispute, profit.view, delivery.close).
- **Source**: canonical ADMIN_FLOW IP-21 / IP-09, PERMISSIONS_MATRIX PJ-13. **Why**: the Admin preview was
  offered floor tasks and ADM+ corrections she cannot perform. **Layer**: GOLDEN FIXED (rule), PROJECT
  CONFIGURABLE (capabilities).

## D-34 Filters never wrap and never scroll sideways
- **Decision**: `MCFilter` shows search + the company view + one promoted filter (two without a company view;
  `visible: n` per page); the rest sit behind one "Filter (n)" button: a popover on wide screens (fixed, so a
  card never clips it), a sheet on phones. If the toolbar would still wrap, the last promoted filter moves into
  the panel automatically. Phone toolbar = search + Filter. Sort is not a filter; filters that duplicate a tab
  are removed.
- **Why**: toolbars wrapped a lone select onto a second row at 1366 px and scrolled sideways on 17 phone pages.
  The canonical inventory also names fewer filter keys than the prototype offered. **Layer**: GOLDEN FIXED.

## D-35 Navigation is never dressed as a header button
- **Decision**: a header button changes data or starts a task (verb + object). Sibling lists, the parent
  record, other modules and export-list links are breadcrumbs, meta links, section links, rows, overflow items
  or palette entries. One control per destination per local block.
- **Why**: "Penawaran", "Riwayat Stok", "Pengiriman", "Ekspor Saya", "Buka Proyek" sat beside the primary at
  the same weight and took a full row on phones. **Layer**: GOLDEN FIXED (rule).

## D-36 Owner and Admin emphasis
- **Decision**: on shared screens the Admin gets the capability-valid next step as the primary; the Owner gets
  facts and exceptions first, with execution verbs he is allowed to use quieter (secondary or "Tindakan Lain")
  unless the page is the Owner's own decision. Owner surfaces use oversight verbs (Lihat, Tinjau); Admin
  surfaces execution verbs (Catat, Terima, Lengkapi).
- **Source**: canonical PRODUCT_OVERVIEW primary users; IA SCR-05 "links only" for Beranda. **Layer**: PROJECT
  IMPLEMENTATION using the Golden priority levels (never hard-coded per role in shared CSS).

## D-37 Fewer surfaces, one left edge, a real header gap
- **Decision**: a single list has no card head repeating the page title (a quiet result count instead); a tab
  panel does not repeat the tab label; no card inside a card. Pattern pages align the header with the toolbar
  and card edges (the 9 px REF-M3 inset stays on 01–04); the header → body gap is at least 18 px on wide screens;
  the key-value label column stops at 200 px; filter values are not bold; metric values are semibold.
- **Why**: five different left edges within 21 px and header buttons reading as part of the toolbar were the core
  of the Owner's "not symmetrical / not aligned" complaint. **Layer**: GOLDEN FIXED.

## D-38 Phones: primary + ⋯, and focused tasks hide the bottom bar
- **Decision**: phone headers show title, one meta line and the action row [primary][⋯]; a header whose only
  control is the menu keeps it on the title row. Routes with a sticky `.pt-actionbar` (forms and floor tasks)
  hide the bottom navigation while the bar is shown (canonical IA §6.2); Buat Pembelian (03) does the same for
  its own footer, superseding the r6–r9 "footer above the bottom nav" contract.
- **Why**: header + toolbar used up to 64 % of the 390 × 844 fold, and form/task routes stacked ~130 px of
  fixed chrome. **Layer**: GOLDEN FIXED.

## D-39 Module sub-navigation instead of sibling buttons
- **Decision**: a module whose sibling screens have no sidebar entry gets ONE quiet row of links under the
  page header (`MCPage.subnav([{ route, label, cap }])`): Proyek · Penawaran (10, 13); Stok · Reservasi ·
  Riwayat Stok · Stok Opname (30, 34, 35, 36). A route the role cannot open, or whose capability it lacks, is
  left out; a breadcrumb that only points at sub-nav siblings is hidden. On phones the row is full-bleed and
  sits before the header actions, so its position is the same on every sibling page.
- **Why**: "Penawaran" was a header button and Reservasi was reachable only through a KPI tile; siblings were
  scattered across header buttons, card-head links and tiles. **Layer**: GOLDEN FIXED (pattern), PROJECT
  IMPLEMENTATION (which routes are siblings).
- *R12 (D-47)*: superseded. The siblings are children of their group in the navigation tree; `MCPage.subnav`
  remains only as the portable fallback (it leaves out what the role's tree provides, so MULTIPLECORP renders no
  row) and the crumb-hiding workaround is removed (`ROUTES.parent` is `null` on sibling destinations).

## D-40 Beranda Owner: one grid, rows are the actions
- **Decision**: the measured Beranda (02) uses one 12-column grid with one gap token for rows and columns (KPI
  3/3/3/3, main 8/4, three-up 4/4/4), so card seams line up across rows. "Tindakan hari ini" rows are whole-row
  links ending in a quiet Owner verb + chevron (Lihat piutang, Lihat barang masuk, Tinjau …) instead of five boxed
  buttons; the period is shown once (top bar); the attention count is a plain muted count. The Admin opening the
  Owner Beranda gets the canonical not-found (`MCPage.guard()`), like every Owner-only address.
- **Why**: three unrelated column systems and gaps were the clearest "not symmetrical" complaint; execution verbs
  on Owner oversight rows contradicted canonical SCR-05 ("links only"). Supersedes the REF-M1 measured ratios.
  **Layer**: PROJECT IMPLEMENTATION on the Golden grid rule.

## D-41 Buat Pembelian: origin-aware, one primary, no destructive item on the primary
- **Decision**: opened without a project (from the Pembelian list) Buat Pembelian (03) is the canonical
  no-project purchase (J-PUR-02: company select, "Pembelian tanpa proyek", Batal returns to the list); opened from a
  project (`?proyek=`) it keeps the project context (Batal returns to the project's Pengadaan); opened from a
  shortage (`?proyek=…&isi=kebutuhan`) the lines are filled from the project shortage. The footer is total + a quiet
  "Batal" + ONE primary ("Lanjut ke review", then "Simpan pembelian"); the r9 split menu that attached "Batalkan
  pengisian" (destructive) to the primary is gone; "Pratinjau PO" is a quiet link beside the summary it previews;
  context and steps share one strip; on phones the bottom navigation is hidden while the action bar shows.
- **Why**: the form silently bound every purchase to a reference project, a destructive item hung off the primary,
  and two cards were spent on "where am I". Old checks were adapted with an `r11` comment (they now open
  `03?proyek=prj-arj-0142`, the composition they were written for). **Layer**: PROJECT IMPLEMENTATION.

## D-42 Record links are read-only; task links are explicit
- **Decision**: a link to a record opens its read-only view (e.g. a Barang Keluar record → its stock movements,
  `A.href('dispatch')` → `34?ref=…`); a next-step link that starts a task names the task route explicitly
  (`R.href('pengiriman.catat', { id })`) and is shown only to a holder of that task capability (`MCApp.canGo`).
- **Why**: an Owner reviewing an inter-company allocation landed on a pre-filled "Catat Pengiriman" commit form.
  **Layer**: GOLDEN FIXED (rule), PROJECT IMPLEMENTATION (link map in `domain.js`).

## D-43 One feedback channel per event
- **Decision**: a commit that renders its own result (03 step 3, 12 success state, 14 flash, 32/33 result cards)
  shows no extra success toast (`MCRisk.run` without `success`); toasts are kept for background completion,
  demo actions and errors without a field.
- **Why**: toast + inline result + banner announced the same save two or three times. **Layer**: GOLDEN FIXED.

## D-44 One way to start an invoice
- **Decision**: every "Buat Invoice" (11 Penagihan › Invoice, the 61 project picker) runs ONE domain command,
  `MCApp.startInvoice(project, trigger)`: a COMMIT confirmation showing the basis (delivered and not yet invoiced,
  else the rest of the confirmed value as the next term), the value and DPP/PPN, then a session DRAFT invoice +
  its DOC-06 draft, opened on Detail Invoice (62) where "Pratinjau & Terbitkan" is the next step. A project with an
  open draft reopens it ("Buka Draf Invoice") instead of starting a second one. Opening an address never creates
  a record (the interim `62?id=baru` entry, which drafted on page load, was removed).
- **Why**: the final review found 11 Penagihan a dead end (no way to start an invoice); the two fixes that followed
  produced two different draft creators. **Layer**: PROJECT IMPLEMENTATION (`domain.js`).

## D-45 One single-date field
- **Decision**: forms pick a single date with `MCDateField` (Layer A): a read-only "14 Okt 2026" field with the
  calendar addon, a hidden native date input that holds the ISO value (name, min, max) and opens the browser
  picker, and a typed fallback. 12, 14, 52, 62, 65 and 98 use it; 03 (reference page) and 41 keep their
  equivalent page-local markup, which looks and behaves the same.
- **Why**: 03, 41 and 65 had grown three copies of the field and 98 still showed the bare native control.
  **Layer**: GOLDEN FIXED.

## D-46 Recovery-pass polish (manual visual review after the crash)
- **Decision**: (1) a page whose only action is ONE harmless overflow item shows it as a quiet button
  (`MCActions`); a one-item "Tindakan Lain" menu only adds a click (destructive / disabled items stay behind the
  menu). 63 Piutang has no header action at all: the selected invoice's own step in the panel is the action, and
  "Catat Pembayaran" lives on Keuangan, Pembayaran and the command palette. (2) A page-level tab row is followed by
  its content one 12 px step lower on every page (11, 21, 62 panels touched the tab rule). (3) On phones only a
  filled primary fills the header row (the Admin's next step); a quiet action (the Owner's execution verb, or the
  first secondary on a page without a primary) stays compact and right-aligned — 10, 11, 13, 21, 30 used to show
  a full-width outline while 60, 64, 66, 85 showed a compact one. (4) Percentages are written attached, "76%"
  (PUEBI), everywhere (`fmt.pct` used a thin space). (5) Every single-date field is `MCDateField` (12 Tenggat,
  14 Tanggal jawaban, 52 Tanggal dokumen, 62 Tagihkan, 65, 98; 03 and 41 keep equivalent page-local markup) and
  the one time field (41 Jam) takes the same anatomy (clock addon on the left, no native indicator). (6) The
  Owner-only Beranda guard answers not-found only for a role that has its own Beranda (Admin → 06); a project
  role without one (the portability fixture's "finance") keeps the dashboard.
- **Why**: found in the manual 1366 / 390 review of all 47 routes after the final fix pass; each was a visible
  inconsistency between modules rather than a single-page defect. **Layer**: GOLDEN FIXED (1–5), PROJECT
  IMPLEMENTATION (63 header, 6).

---

# R12 — hierarchical navigation and task-focused pages

R12 replaced the flat sidebar with ONE two-level navigation tree per project (the desktop sidebar, the icon rail,
the drawer, the phone bottom bar and the command palette all read it) and removed the page-level copies of that
navigation. The sidebar / drawer answers "ke fungsi mana saya ingin pergi?"; the page answers "apa yang harus saya
kerjakan di fungsi ini?". Architecture, trees and the 48-route taxonomy: `docs/NAVIGATION_ARCHITECTURE.md`; every
removed control with its reach path: `docs/ACTION_ROUTE_MATRIX.md` R12; journeys re-walked:
`docs/ROLE_JOURNEYS.md` R12 revalidation.

## D-47 Hierarchical navigation: one tree, two levels, disclosure groups
- **Decision**: `navigation.sidebar` is a tree: Sections (a heading, not a level) → level-1 Nodes (a leaf link, or
  a disclosure group; icons on level 1 only) → level-2 Child links (no icon, no children). One renderer draws the
  sidebar, the rail and the drawer from `MCProject.navTree()`. MULTIPLECORP: Beranda · Proyek ▸ · Pembelian ·
  Gudang ▸ · Pengiriman · Dokumen ▸ · Keuangan ▸ · Kasus Koreksi · Laporan ▸ · Data Master ▸, then "Khusus Owner":
  Tinjauan ▸ (Tinjauan Owner · Riwayat Aktivitas · Log Keamanan) · Pengaturan ▸ — 12 level-1 rows, so the
  Owner's tree fits a 1280 × 720 sidebar with every group closed and the 1024 rail without scrolling. A group header only opens and closes its group
  (never navigates, never a flyout); a group of one renders as a flat link; only the group holding the current entry
  is open on load and nothing is persisted; exactly one `aria-current` per navigation landmark (the header only while
  its current child is not visible). The current entry comes from route + params, then the true-parent walk
  (`MCProject.navCurrent`); `ROUTES.parent` means a true ancestor only (`null` on sibling destinations), so sibling
  breadcrumbs disappear. Canonical entries without a lab screen are not entries. Ctrl / Cmd + B collapses the desktop
  sidebar to the rail; a rail group icon opens the drawer at that group.
- **Supersedes**: D-01's merged single entry "Tinjauan & Aktivitas" (now a group whose three children are the
  canonical screens; Log Keamanan is no longer a tab behind Riwayat Aktivitas); D-39 (module sub-navigation is now only the portable fallback); D-02 in part (bottom bar per role from
  configuration, D-51). D-27 and D-35 are unchanged and now apply to the tree.
- **Why**: R12 Owner direction (MODULE → CHILD, max 2 levels; one clear function = one clear entry) and canonical IA
  §6.1 (a group opens in place, never a flyout; the group of the current page is open; icon rail on Ctrl+B and on
  tablets). Sibling screens (Penawaran, Reservasi, Riwayat Stok, Invoice, Piutang, Ekspor Saya …) had no persistent
  home and were scattered over sub-navigation rows, header buttons, tiles and subtitle links.
- **Owner approval pending**: the "Khusus Owner" grouping (Tinjauan ▸ with three children, Pengaturan ▸); retiring the sub-navigation; the labels Daftar Proyek,
  Daftar Dokumen, Laporan per Perusahaan (entry and 80's title), Ringkasan / Ringkasan Keuangan (60), Perusahaan (95),
  the group label Tinjauan, and 90's review kinds "Aktivitas khusus" / "Kejadian keamanan" (canonical: Aktivitas /
  Keamanan).
- **Layer**: GOLDEN FIXED (model, renderer, marking, disclosure, rail and drawer behaviour); PROJECT CONFIGURABLE (the
  tree, labels, order, `ROUTES.parent` / `defaults` / `views`).

## D-48 Three meanings of visibility
- **Decision**: `ROUTES.roles` = ACCESS (outside it: the not-found page, D-05). Node and section `roles` and
  `hiddenForRoles` = PRESENTATION in the persistent navigation only (sidebar, rail, drawer, bottom bar); the command
  palette ignores `hiddenForRoles` and lists every entry the account may open. `capability` = a hint that hides what
  the account cannot use; the server decides every request. Hidden means absent, never disabled. R12 changes no route
  access: Sari still opens 33 / 36 read-only by URL (a route-level capability guard is a separate follow-up).
- **Why**: the Owner wanted floor-execution entries out of his menu without losing the capability (the canonical
  OWNER holds every capability); mixing "not shown" with "not allowed" is how a prototype suggests false security.
  One field per meaning keeps both readable and checkable (`tools/nav_audit.py`: hidden route shown, role-invalid entry).
- **Source**: canonical IA §6.3 / UXN-09 ("an entry is a hint, the server decides"), UXN-18; D-05, D-33. **Layer**:
  GOLDEN FIXED (meanings), PROJECT CONFIGURABLE (values), EXTERNAL / BACKEND RESPONSIBILITY (authorization).

## D-49 Tabs versus children; MCTabs view mode
- **Decision**: a tab row becomes navigation children only when every tab is its own canonical screen, the tabs are
  different kinds of object (not states, filters, periods, report types, review sources or record parts), they share
  no list, selection, toolbar or time window, and the page is itself a destination — all or nothing per row.
  Promoted: 85 Data Master (Klien · Pemasok · Produk & Jasa · Lokasi Rak, `?jenis=`) and 91 (Riwayat Aktivitas · Log
  Keamanan, `?tab=`); every other row stays local (verdicts: `docs/NAVIGATION_ARCHITECTURE.md` §6). `MCTabs` enters
  VIEW mode when `MCProject.navCovers(route, param, tabIds)`: no tablist, only the URL-selected panel, h1 and
  `<title>` from `ROUTES.views`, the per-view header action, no `replaceState`. A project whose tree does not list the
  views keeps the tab row with no page change.
- **Why**: R12 "tabs are views of the same object or workspace, never module navigation". A promoted row left on the
  page would repeat the sidebar children (two controls, one destination), and a hidden tablist with live tab panels
  would leave dangling ARIA.
- **Layer**: GOLDEN FIXED (rule, view mode, `ROUTES.defaults` / `views`); PROJECT CONFIGURABLE (which views are entries).

## D-50 Page navigation duplicates go; contextual links stay
- **Decision**: once the role's navigation provides a destination, a page offers no unscoped copy of it (sub-nav row,
  header button, tile, subtitle / caption / section-head link, menu item, sibling breadcrumb). Removed: the 10 / 13
  and 30 / 34 / 35 / 36 sub-navigation; sibling breadcrumbs; the 30 header Barang Masuk / Barang Keluar where the
  navigation provides them; 33 "Pengiriman"; 40 "Barang Keluar"; the 50, 61 and 63 subtitle links and the 66
  "Pembayaran klien" link (plain text); 60 "Semua pembayaran" / "Semua pengeluaran"; 80 "Lihat Laporan Gabungan";
  the 80 / 81 Ekspor item "Lihat Ekspor Saya"; the 82 footer link "Laporan"; the 85 / 91 tab rows; the 95 tiles;
  the 06 group-head "Semua …" links; the unscoped 90 "Riwayat Aktivitas", 21 "Semua pengeluaran" and 62 "Riwayat
  Aktivitas"; 99 "Kelola akun lain"; the unscoped Kasus Koreksi / Pembayaran fixes on 15. Scoped instead: 02
  "Proyek berjalan › Lihat semua" → 10?state=ACTIVE (10 honours `?state=`); 62 "Riwayat proyek" → 91?proyek=; 52
  without `?proyek` lands on "Belum terpenuhi"; the 51 numbering notice → 97?sel=; the 36 applied notice →
  34?jenis=PENYESUAIAN; the 86 crumb names the record's kind; the 95 tile facts became conditional "Perlu tindakan"
  rows. Kept: record links, filtered drill-downs, signal and notice rows, figure tiles (D-28), scoped "Lihat semua"
  continuations, empty-state CTAs, header task actions, the 97 demo button and every palette entry.
- **Why**: R12 "remove page-level sibling-navigation duplicates once the nav provides the destination; keep contextual
  links that follow the current business object". The generic form is `MCProject.navProvides` (Layer A decides from
  the tree, never from project route ids), so a flat-tree project keeps its links.
- **Layer**: GOLDEN FIXED (rule, `navProvides`, `MCPage.subnav` filtering); PROJECT IMPLEMENTATION (the MULTIPLECORP
  page edits).

## D-51 Role-aware navigation: Owner oversight, Admin execution, bottom bar per role
- **Decision**: (1) The Admin tree is the shared tree filtered by role and capability: no Barang Keluar (no
  stock.dispatch), Stok Opname (no stock.count), Laporan Gabungan (Owner-only route) or "Khusus Owner" (Owner-only
  section). (2) The Owner's Gudang ▸ Barang Masuk and Barang
  Keluar carry `hiddenForRoles: ['owner']` — presentation only: access, capability and the palette entries stay; he
  reaches 32 / 33 through context (21 "Terima Barang", 11 Pemenuhan, the 30 header "Catat Barang Masuk / Keluar", the record links on
  11 / 21 / 31), the palette and the quiet pair on 30 Stok, which renders only while his navigation does not provide
  them; on 32 / 33 the Gudang header carries the mark. Stok Opname stays in his tree (Terapkan Selisih and surplus
  findings are his decisions). (3) The phone bottom bar keeps 4 destinations, now from `navigation.bottom: { default,
  admin }` instead of a role-fixture override: slots 1–3 shared (Beranda · Proyek · Gudang), slot 4 per role (Owner
  Keuangan: receivables and finance oversight, O1 / O4; Admin Pengiriman: delivery execution, A4); the app-bar Menu
  (drawer) and search stay as the canonical "Lainnya" / "Cari" (R12 §15: keep the bottom nav + hamburger drawer). A
  slot lights for its area (`"page"` on its landing, `"true"` elsewhere inside it).
- **Considered and rejected**: a "Lainnya" or "Cari" slot in the bar (canonical D-IA-03) — it duplicates the app-bar
  Menu and search that R12 §15 keeps; hiding Reservasi for the Owner — he uses that commitment oversight; a separate
  tree per role — one filtered tree keeps one order and one test surface.
- **Why**: R12 Owner direction ("the Owner should not feel like a warehouse clerk"; hide destinations a role cannot
  use; do not guess permissions). Canonical §6.3 lists the floor entries for every holder, so (2) is a documented,
  config-only deviation (delete `hiddenForRoles` to revert).
- **Owner approval pending**: the hidden Owner floor entries (Barang Masuk, Barang Keluar), with the D-47 items.
- *(r13)*: (2) is superseded by R13_SPEC §2 (Owner R13 direction; the approval above was still pending):
  `hiddenForRoles` is removed, the Owner's Gudang lists Stok · Barang Masuk · Barang Keluar · Reservasi · Stok Opname ·
  Riwayat Stok (capability-filtered for every role; Sari keeps no Barang Keluar / Stok Opname), and the 30 Stok
  header pair disappears because his navigation now provides both (D-50). (1) and (3) are unchanged.
- **Layer**: GOLDEN FIXED (role / capability filtering, bottom-bar lighting); PROJECT CONFIGURABLE (`hiddenForRoles`,
  capabilities, `navigation.bottom`); PROJECT IMPLEMENTATION (the 30 header pair).

**Open after R12 (not decided here)**: a route-level capability guard (canonical UXN-10; today Sari opens 33 / 36
read-only by URL); the chevron turning after its child list reveals (both follow R12 spec tokens; aligning them is a
spec decision).

## D-52 Persistent shell over HTTP; D-04 stays the `file://` fallback (r13 Phase 3)
- **Decision**: served over HTTP (`serve.cmd` / `tools/serve.py`, 127.0.0.1:8137) the prototype navigates in place:
  `assets/js/router.js` fetches the target page, keeps the shell mounted, swaps `<main>` and the per-page head / body /
  top-bar bits, re-runs the page module in a tracked scope (`MCScope`) and updates address, title, current entry, focus,
  scroll and one polite announcement. The 02 Beranda and 03 Buat Pembelian logic moved from `interactions.js` into page
  modules (`modules/beranda.js`, `modules/pembelian-baru.js`) so they can be mounted again. Sidebar groups persist
  across navigations; the group of the new current entry opens. On `file://` (or any failure) every navigation is the
  r12 full document load (D-04).
- **Why**: Owner R13 requirement — clicking another sidebar entry must not reload the whole interface; the cause
  (multi-page full document loads) is fixed, not hidden behind fades.
- **Considered and rejected**: converting every module to `MCPages.define` (too wide for one round; possible later on
  top of this scope); hash routing or a build step (every address changes); cross-document view transitions (still a
  reload); Turbo / htmx / Swup (re-execute body scripts → double initialisation); an iframe content host (forbidden).
- **Recorded deviation**: DEV-5 (R13_SPEC §12): the persistent shell needs the local server; `file://` keeps full loads.
  Motion: under reduced motion the in-place swap is instant (R13_SPEC §1) instead of the Golden 150 ms crossfade of
  MOTION_SYSTEM §5 (the reduced entrance stays; `file://` keeps the crossfade).
- **Layer**: GOLDEN FIXED (`router.js`, `MCScope` contract, lifecycle APIs in `interactions.js` / `patterns.js`);
  PROJECT CONFIGURABLE (`ROUTES[...].spa`, `MC_PROJECT_PATCH.router`); production shell persistence is the client
  framework's job [BACKEND].
- **Related (same phase)**: R13_SPEC §2 — the Owner's Gudang lists Barang Masuk and Barang Keluar (D-51(2) superseded,
  "(r13)" note): order Stok · Barang Masuk · Barang Keluar · Reservasi · Stok Opname · Riwayat Stok, capability-filtered
  for every role; the 30 Stok header pair disappears because the navigation provides both (D-50).
- **Source**: merged in r13 Phase 9 from `docs/PERSISTENT_SHELL.md` §6 (that file keeps the full contract).

## D-53 Status in two densities; staged document composer (r13 pilot)
- **Decision**: (1) one semantic status component in two densities — filled badge for the record in view, dot + label
  for every list row (same anatomy for every state in a column); document lifecycle and PDF state in separate columns.
  (2) Document composers may declare stages: one active task stage beside the live preview, a local stage navigator,
  stage switching without saving, validation-before-issue that returns to the field's stage; the footer keeps one
  figure and one primary; the preview gets the larger column (55 % at 1366).
- **Why**: Owner pilot review — mixed status shapes looked unprofessional; the quotation composer showed every
  section, the stepper, checks and the numbering note at once beside a cramped preview.
- **Supersedes**: D-32 for list rows (quiet text for the normal state), the R13 phase 5 preview share (46 %) and the
  "everything in one column" composer layout for staged templates. **Deviation**: the canonical composer direction
  (VD-07) suggests a 40–45 % preview; the Owner's R13 brief allows 40/60 and the pilot found 45 % too small to read —
  recorded for the Owner's visual review.
- **Layer**: GOLDEN FIXED (status component, densities, staged composer behaviour); PROJECT CONFIGURABLE (status
  registries/tones, template stages and hints, review facts).

## D-54 Numbered, paginated record lists; compact pilots (r13 compact)
- **Decision**: every operational record list on a list page shows a display position (No.) and pages of 10 (MCPager);
  50 Dokumen becomes ONE numbered list (newest first, type filter, older versions under their document, unnumbered);
  the staged composer's Pemeriksaan shows problems first and folds passed checks; right after an issue the result (number,
  facts, ONE next action) stands beside the issued paper while the identity strip, the completed stepper and the record
  details are folded ("Lihat rincian …").
- **Why**: Owner visual rejection of the R13 pilot — lists of 18 / 34 records with headings and revisions, a composer
  that repeated status, readiness and identity in several places. "Less information shown at once, not less available."
- **Supersedes**: "Muat Lagi" (load more) for numbered lists; the grouped 50 list (D-32 era); the pilot's five review facts.
- **Rollout**: batch 1 (20, 34, 35, 63, 64, 66, 70, 82, 96) + 61 + 50 done; batch 2 (10, 13, 30, 85, 91) next — see the
  inventory in `scratch/r13/R13_STOP_CHECKPOINT.md`.
- **Layer**: GOLDEN FIXED (numbering contract, pager, list behaviour); PROJECT CONFIGURABLE (page size, nouns, which
  lists are operational).

## D-55 Visual harmony: shared workflow navigator, one composed workspace, result anatomy, numbering by default (r13 harmony)
- **Decision**: (1) the stage navigator is a Layer A component (`MCStepper` / `.mc-flow` + `.mc-stepper--inline`) sharing
  the progress stepper's markers; it is the top band of the editor card. (2) A staged composer states its identity ONCE
  above both panels (status · company · "Data dari proyek" on demand); editor card and preview card start on one line and
  their top bands share one height and tone (`--compose-band-h`). (3) MCResult carries its icon inside the heading and
  makes the number the headline. (4) `MCList` numbers every list by default; `number: false` needs a documented reason.
  (5) The skip link is transparent at rest as well as translated away (a full-page capture of a scrolled page drew it).
- **Why**: Owner rejection of the compact pass — the steps looked like loose text on the canvas, the quotation page
  stacked unrelated boxes at different heights, the success check floated beside the content, numbering stopped at the
  first rollout batch.
- **Improved on the brief**: one marker language instead of a new stepper look; the band is a tonal header of the card,
  not an extra card or shadow; numbering as a component default instead of eleven more one-line opt-ins.
- **Supersedes**: the `.pt-stages` underline tabs (r13 pilot); the 44 px `.pt-result__mark` column; "number older
  versions not at all" (now scoped n.k); "Do not number … workflow steps, validation checklists" stays, with reasons.
- **Layer**: GOLDEN FIXED (navigator anatomy and states, workspace bands, result anatomy, numbering default);
  PROJECT CONFIGURABLE (stage ids, labels, hints, final-step label `finalStage`, page sizes, nouns).

## D-56 Final refinement: focused review, one place for the number, honest next step, long titles, timelines (r13 refine)
- **Decision**: stage-aware composer share (Rincian 55 %, Pemeriksaan 60 %) with a three-part review rail and no bar
  total in review; JS-sized sticky preview (never under the bar); labelled "Layar penuh" while composing; the stepper
  hides connectors when its CARD is narrower than 430 px (container query); after an issue the head drops the number
  (the result is its one place); the quotation's next step reads "Menunggu jawaban klien" with an outline "Catat Jawaban
  Klien"; `phone.wrap` rows put the end slot on a third line; timelines numbered chronologically; search numbered per group.
- **Why**: Owner review of the harmony pass — a short review column beside a dense paper, small preview text, the bar over
  the paper, the number twice, a primary for an answer that does not exist yet, truncated project names on phones.
- **Layer**: GOLDEN FIXED (all of the above as component behaviour); PROJECT CONFIGURABLE (stage shares via
  `--compose-preview`, next-step wording per template, `data-chrono`).

## D-57 Guided Operational Admin experience (r13 Phase 6)
- **Decision**: Layer A `MCGuide` (levels Terpandu / Ringkas), `MCHelp` ("Cara kerja"), `MCResume` (resume memory) and
  `MCTour` (optional walkthrough) in guide.js, configured by Layer B `help: { defaultLevel, levels?, tours, screens }`;
  06 gains the tour offer, "Cara kerja", "Lanjutkan pekerjaan" (drafts in scope + records opened last) above the queue and
  "Baru selesai" (the account's own last actions) after it; 11 gains "Tahap proyek" = MCProgress over stages derived from
  the agreement + the canonical completion gate, with ONE "Berikutnya" (MCNext; the header keeps its button, D-26);
  the account menu gains "Panduan".
- **Why**: Owner Phase 6 brief - a new Admin must find work, resume it, understand the stage and the next step.
- **Canon kept**: no cross-signal ranking on 06 (D-IA-08: the queue order stays; "what first" = the band + group
  order + tones); no wizard across commits; nothing stored as progress; no greeting change; capability decides
  controls (a missing capability names the step "Perlu kewenangan"); a sent quotation reads "Menunggu jawaban klien".
- **Deviations**: DEV-2 (walkthrough, canon silent), DEV-3 (resume band, records not signals), levels reduced from the
  discovery's three (Ringkas / Standar / Pemula) to two (Terpandu / Ringkas) - the Owner asked for a simple model and the
  Standar/Pemula difference was one disclosure.
- **Layer**: GOLDEN FIXED (components, level semantics, tour behaviour); PROJECT CONFIGURABLE (tour steps and
  copy, "Cara kerja" lines, default level, which records feed the resume band, derived stage mapping per domain).

## D-58 Cross-module coherence and safety (r13 Phase 7)
- **Decision**: route capabilities in the registry + `MCRoutes.denial` → MSG-10 forbidden state (`MCPage.guard`, Layer A)
  vs MSG-09 not-found; `?klien=` on 12 preselects a valid client once (clients are shared master data; the company stays
  an explicit choice; not dirty; invalid id said); the composer's opt-in "Tanggal transaksi" (PT-25 / IP-07): prefilled
  today, no future date (blocking check), earlier = "Tanggal Mundur" and the number follows that period, the document and
  quotation carry the business date while the audit keeps the real time; approval = commercial confirmation verified
  against canon (project ACTIVE, AX-13) and said in the result; the project flow never claims "all conditions met"
  without a gate.
- **Corrected record**: the R13 checkpoint listed "approval still turns a DRAFT project ACTIVE" as a defect - canon
  WF-PRJ-02 (A) says recording Disetujui IS the confirmation; the behaviour stays, the misleading code note is gone.
- **Not simulated**: MSG-16 (a prefilled date that went stale across midnight) - the prototype clock is fixed;
  production returns CONFLICT with both dates (ST-08).
- **Layer**: GOLDEN FIXED (guard semantics, forbidden state, business-date control behaviour, context-link rules);
  PROJECT CONFIGURABLE (route capabilities, which forms carry a business date, transitions per domain).

## D-59 Document identity and number identity; the doc-inv-0030 legacy pair (r13 Phase 9)
- **Decision**: one numbered DOCUMENT has a chain of VERSIONS (`previousVersionId`, `version`, the older one REVISED /
  "Direvisi"); every ISSUED version carries its own formatted number - canon BR-DOC-02 + DATABASE s07-10 (UNIQUE
  (company, type, formatted_number)) + NM-07 (a revision draws a NEW_NUMBER of its own business-date period, or keeps the
  base with an incremented suffix under BASE_SUFFIX; never an identical string). The lab's issue paths already comply
  (`MCApp.numbering.issue` per command id; revisions draw new numbers). Lists show the DOCUMENT once with its versions
  under it ("2 versi", scoped n.k); the display row number is never the official number.
- **Legacy exception (BLOCKED BY CANONICAL AMBIGUITY of the repair, not of the rule)**: fixture `doc-inv-0030-v1` and
  `-v2` both read ARJ/INV/2026/10/0030 (ARJ DOC-06 scheme = NEW_NUMBER). A canonical repair needs a number for v2, but the
  next numbers of the period (0031, 0032) belong to later invoices; renumbering them is forbidden (BR-DOC-02) and giving v2
  a later number (0033) implies a backdated issue the data does not record. Owner decision required, one of:
  (a) v2 = ARJ/INV/2026/10/0033 recorded as a backdated revision (DIR-018 allows order ≠ chronology) and the invoice /
  receivable follow v2's number; (b) ARJ DOC-06 uses BASE_SUFFIX (then the suffix format, GAP-019); (c) keep the pair as
  a labelled pre-canon example outside the numbering demonstration. Until then the fixture verifier allows exactly this one
  duplicate and fails on any other.
- **Owner decision (r13 remediation, 2026-10-12): OPTION C APPROVED** - the pair is QUARANTINED as pre-canon legacy data,
  NOT a permission for duplicate official numbers. Fixture marker `legacy: { quarantined: true, kind: 'PRE_CANON', reason:
  'DUPLICATE_OFFICIAL_NUMBER', decision: 'D-59 opsi C (Owner)' }` on both versions (identifiers and numbers kept as
  recorded; nothing renumbered, no history invented, DOC-06 strategy unchanged). The VALID document set is verified with
  ZERO duplicate exceptions; the quarantine is verified separately (exactly the pair, labelled, nothing points into it).
  In the app the pair is labelled "Data lama · terkarantina" (50) and explained on 51; it offers no Revisi / Batalkan, so no
  issue, revision, void or numbering continues from it. The invoice RECORD inv-arj-0030 keeps its own unique number and
  stays in finance (payments, receivable and project gates depend on it) - only the document versions are quarantined.
- **Production**: allocation in the issuing transaction (counter row lock last, LK-31), the two UNIQUE keys as backstop,
  idempotency by `issue_command_id`, immutable issued payload + hash, renditions never touch the number (JB-01).
- **Layer**: GOLDEN FIXED (identity / version / display-number semantics, preview never numbers); PROJECT CONFIGURABLE
  (schemes: format, granularity, revision format).
