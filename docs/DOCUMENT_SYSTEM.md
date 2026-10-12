# Document system (r13 phase 5a + 5b, Layer A + Layer B + the MULTIPLECORP documents)

How the prototype draws, calculates, numbers, checks and issues documents. Contract: `scratch/r13/R13_SPEC.md` §4,
§6, §8, §9; `scratch/r13/R13_DISCOVERY.md` §2.1, §2.5, §3, §4. Component rows: `docs/COMPONENT_CATALOG.md` §2.
Phase 9 merges the decisions into `docs/DESIGN_DECISIONS.md`; this file is the working reference until then.

## 1. Files and layers

| Layer | File | Global | What it owns |
|---|---|---|---|
| A | `assets/js/docs.js` | `MCDoc` | the ONE paper renderer (`paper`, `mount`) and the ONE calculation contract (`totals`, `round`) |
| A | `assets/js/guide.js` | `MCProgress`, `MCChecks`, `MCResult`, `MCNext`, `MCPrereq` | derived steps, validation summary, result surface, next action, prerequisite notices |
| A | `assets/js/composer.js` | `MCComposer` | the generic Live Document Composer (template registry, state store, editor ‖ live preview, lifecycle) |
| A | `assets/js/patterns.js` | `MCForm.num` | Indonesian money / quantity parser and formatter |
| A | `assets/css/patterns.css` §12 / §12b / §12c | — | `.pt-paper*`, guide primitives, `.pt-compose*` |
| B/C | `assets/js/modules/domain.js` | `MCApp.numbering`, `MCApp.taxProfile`, `MCApp.docTotals`, `MCApp.issuer`, `MCApp.quotationPaper` | the numbering service, the company tax profile and letterhead from the fixture, the DOC-01 view model shared by 14 and 51 |

`docs.js`, `guide.js` and `composer.js` are SHARED runtime: every shell page loads them right after `patterns.js`
(`tools/shell_sync.py` inserts the tags; `template/page-skeleton.html` has them), so an in-place navigation of the
persistent shell never meets a page that needs a runtime the document lacks. Layer A holds no business data: pages
build a view model and pass it in. Generic proof: `scratch/r13/phase5a/harness.html` registers a template that knows
nothing about MULTIPLECORP.

## 2. Paper — `MCDoc.paper(vm, o)` / `MCDoc.mount(host, vm, o)`

- A4 sheet in em units: 640 × 905 css px at 100 % (11 px base). `mount` measures the blocks once at that reference
  size, breaks pages (a table continues on the next page with its head repeated; a page ≥ 2 has a running head) and
  then scales the sheets to the host (`scale: 'fit'` = up to 100 %, or a number; "Pas lebar / 100 %"). Phones
  (≤ 767 px) keep the SAME page breaks and reflow each page at reading size (8.5 px), so the page count never depends
  on the screen. The web font loading re-paginates once.
- Blocks: letterhead (fictitious mark, name, address, masked NPWP, phone · e-mail — F11), title, meta (number or
  "Nomor: Ditetapkan saat terbit", version, date), parties, references, body (paragraphs, key-value rows, amount box),
  item table (optional photo column from the image's `paper` derivative), totals (sales value · tax · total apart;
  a draft's total reads "(…, perkiraan)"), validity, notes / terms (marked "Contoh tata letak" when they are layout
  examples — GAP-019), signatures as text only (no stamp or signature imagery, DC-4), footer "Halaman n dari m".
- Modes: `draft` (diagonal, subtle "DRAF — belum terbit"), `issued`, `revised` ("VERSI LAMA"), `void`
  ("DIBATALKAN"), `scan` (an uploaded original, never re-created); `mini: true` = the 52 thumbnail.
- Every text is escaped by the renderer (view models carry text, never HTML); the paper is real text inside
  `role="document"` with a label, so screen readers read it.
- Consumers: 51 Detail Dokumen (`MCDoc.mount`), 52 Dokumen Administrasi (thumbnail), 03 "Pratinjau PO" (sheet),
  14 preview (`MCApp.quotationPaper` = the same DOC-01 view model as the 51 rendition), the composer.

## 3. Calculation — `MCDoc.totals(lines, profile)`

`lines: [{ qty, price, taxes: [{ id, label, rate }] }]`, `profile: { priceBasis: INCLUSIVE | EXCLUSIVE, rounding:
HALF_UP | HALF_EVEN | DOWN | UP, level: DOCUMENT | LINE }` → integer rupiah `{ lines, taxes, salesValue, tax, total,
count, incomplete }`. Inclusive prices: sales value = gross / (1 + rate) rounded once per document (or per line),
tax = gross − sales value. A line without a valid quantity (> 0) or price (≥ 0) is counted as incomplete and never
priced. The rate is never written in code: `MCApp.docTotals(lines, company)` resolves each line's tax components
against the fixture `taxes` table and the company `taxProfile` (F10); every fixture quotation revision reproduces its
stored `salesValue` / `taxSummary`. The 03 purchase uses the same function (prices before tax, per-line rounding).

## 4. Numbering — `MCApp.numbering` (Layer B)

| Call | Answer |
|---|---|
| `state(co, type, date)` | `{ ok, code: null / NO_SCHEME / NOT_STARTED / BEFORE_SCHEME, period: { key, label }, row, revisionFormat }` |
| `cue(co, type, date, { at })` | "Nomor ditetapkan saat terbit · periode Tahun 2026" (monthly series: "Okt 2026"; projects: "saat disimpan") |
| `blocker(co, type, date)` | C-10 notice for `MCPrereq`: the Owner gets "Penomoran Dokumen"; an Admin reads MSG-17 (type, period, company — no counter, batch or link) |
| `issue(co, type, date, commandId)` | `{ ok, number, seq, period }` — idempotent: the same command id answers the same number (double click, "Coba Lagi", "Periksa Status"); the series counter (fixture `lastNumber` for the fixture period, then this tab's counter) is the only source — never MAX+1 over records; a revision draws a NEW number of its own period (NEW_NUMBER) |
| `lookup(commandId)` | the committed answer of a command (unknown outcome) |
| `peek(co, type, date)` | counter + next — only for the Owner's own settings screen (97, canonical SCR-55 "counters shown, never edited") |
| `format(row, date, n)` | the row's format with a sequence (97's first-number preview) |
| `recordId(col, co, type, date)` | lab display identifiers of records canon does not number (PB, BM, BK, BYR, KK — DISC §7 C11) |

No document flow shows a number before issue: drafts show the cue (14 preview foot, 14 / 51 issue dialogs in MSG-39
wording, 51 preview line, 12 company hint). The number appears in the committed result (MSG-01), the page head and
the paper. Dev-only demo hooks on the page address, never visible: `?demo=num-fail` (allocation failed, MSG-06 "Aman
diulang"), `?demo=num-unknown` (committed but the answer lost, MSG-07 → "Periksa Status"), `?demo=num-conflict`
(already issued: CONFLICT with the issued number, MSG-04) — each acts once per command.
Production [BACKEND]: one transaction, (company, type, period) sequence row lock, UNIQUE formatted number,
idempotency key = issue command id, gaps allowed, audit; never MAX+1.

## 4b. Identity, versions, numbers, snapshots and dates (r13 Phase 9 consolidation; canon BR-DOC-02, NM-05..07, IP-07)
| Concept | Rule | Where in the lab |
|---|---|---|
| Document vs version | ONE numbered document = a chain of versions (`version`, `previousVersionId`; the older one REVISED, "Direvisi"); the document is listed once, its versions under it | 50 list ("2 versi", scoped n.k), 51 detail; `verify-fixture.js` chain check |
| Official number | drawn ONLY inside the issuing command, per (company, type, business-date period); every issued version has its own formatted number (NEW_NUMBER, or base + suffix under BASE_SUFFIX), never an identical string, never reused or renumbered | `MCApp.numbering.issue(co, type, businessDate, commandId)`; D-59 (the one legacy duplicate) |
| Display row number | a list position (offset + index + 1), never stored, never an official number | `MCList` / `MCPager.no` (D-54) |
| Draft vs issued | a draft shows the cue and the "DRAF - belum terbit" marking; preview never saves, never numbers; issue = MSG-39 confirmation, ONE execution per command id (double click once), then MSG-01 with the number | `MCComposer` + `MCRisk`; templates 14 / 62 / 51 / 97 |
| Snapshot vs live source | an issued version is an immutable snapshot (lines, prices, tax, photos, letterhead); later project or master edits never rewrite it; a draft reads its source live, shows "Dari proyek …" and warns when the source changed ("Terapkan Data Proyek" asks first over typed input) | 14 stale-source warning; issued paper = stored payload |
| Business date vs issue time | the command's "Tanggal transaksi" (prefilled today, no future date, earlier = "Tanggal Mundur") is the document date and selects the numbering period; the audit keeps the real time and names a backdate | composer `tpl.businessDate` (14); D-58 |
| Renditions | PDF state PENDING → READY / FAILED (5 automatic attempts); a render never touches the number or the payload | `MCResult.setPdf`, 51 "Muat Ulang Status" |
| Company scope | a document belongs to the company of its source record; numbering, letterhead and tax profile follow that company; a working filter never decides it | `coOf(state)`; route / record guards (D-58) |
Production [BACKEND]: allocation inside the issuing transaction (sequence row lock last), UNIQUE (company, type, period,
sequence, suffix) and UNIQUE (company, type, formatted number) as backstops, idempotency key = issue command id, immutable
issued payload + hash, stale-prefill CONFLICT (MSG-16), authorization and company scope on every command.
*(r13 remediation)* **Quarantine**: a pre-canon record that breaks the number identity (D-59, Owner option C) carries
`legacy.quarantined`; it is excluded from the valid set (strict uniqueness, zero exceptions), labelled where listed,
explained on its detail and read-only (no revision / void / issue continues from it).
*(r13 remediation)* **PT-25 on every command form**: the composer (`tpl.businessDate`) and the shared `MCBizDate` (03
Tanggal pembelian, 32 / 33 "Tanggal transaksi", 41 tanggal diterima / serah terima, 65 tanggal uang diterima): prefilled
today, a date after today refused with the form's own sentence (the chosen value is never changed by the screen), an
earlier date marked "Tanggal Mundur" with what it dates (32: receipt, new lots, Nota Terima Barang; 33: dispatch,
Surat Jalan); the audit time stays the real recording time. These records carry no canonical number (display ids), so
there is no period line; numbered documents take their date at their own issue.

## 5. Guided work primitives (`guide.js`)

- `MCProgress` — derived steps on the shared `.mc-stepper` (`<ol>`, `aria-current="step"`, complete · current ·
  upcoming · attention, `wrap` on phones). 03's measured 3-step stepper is driven by `MCProgress.set` (identical markup).
- `MCChecks` — "Pemeriksaan": BLOCKING / WARNING / OK in business sentences; "Perbaiki" dispatches the bubbling
  `mc:reveal` event (a hidden pane shows itself), opens closed disclosures and focuses the field; `summary(counts)`
  for the sticky bar ("2 perlu diperbaiki · 1 perlu diperhatikan"); warnings use the warning tone, never the error tone.
- `MCResult` — the one result surface: MSG-01 title with the copyable number, facts, PDF state (MSG-05 pending →
  "PDF siap"; MSG-08 "percobaan n dari 5", exhausted after 5), ONE next action (`MCNext`) + quiet links. Used by 51
  (replaces the success toast), 14 issue (replaces the flash), 12 project save (replaces `.prx-done`), the composer.
- `MCNext` / `MCPrereq` — one next action; without the capability the step is named "Perlu kewenangan …" with nothing
  to press; Owner-only blockers read MSG-17 style for Admins.

## 6. Live Document Composer — `MCComposer`

**Staged composer (r13 pilot).** A template that declares `stages` shows ONE active task stage beside the always-visible
preview — the left column answers "what am I doing now", the preview "what will the document look like", the stage hint
"what next". MULTIPLECORP quotation (14): `stages: [Rincian, Pemeriksaan]` + the final step "Terbit" (shown, reached by
the issue). Rules: a compact local stage navigator (numbered steps on one hairline, `aria-current="step"`, notes such as
"1 belum terpenuhi"), never a global sidebar entry; switching stages never saves, issues or loses input (the record and
the dirty state stay as they were; announced to screen readers only); the first stage's primary is "Lanjut ke
pemeriksaan", the last stage's primary is the issue command; "Terbitkan" with a blocking item opens no dialog and a
"Perbaiki" jump opens the field's stage and focuses it; sections of the active stage share ONE surface (bands with
hairlines, no stacked cards); the carried data sit in a one-line strip with a "Data dari proyek" disclosure (DC-5); the
check count and the numbering cue live in Pemeriksaan with the facts to compare (`reviewFacts`), so the sticky footer
keeps one figure, "Simpan Draf" and ONE primary. Templates without `stages` (62 invoice draft, 51 review workspace) keep
the single column — staging is opt-in. Preview share: 52 % at 1280, 55 % at 1366–1599, 50 % from 1600 (the paper text
reaches ≈ 9.6 px at 1366 and ≈ 10 px at 1440 at "Pas lebar"; "100 %" and "Layar penuh" stay the reading path).
Line items in a staged composer show ONE column head (Jumlah · Harga satuan · Pajak) instead of three labels per row
(labels stay for assistive tech); on phones each field keeps its visible label.
*(r13 compact)* Pemeriksaan leads with what still needs attention; passed checks fold into "Lihat n pemeriksaan yang
terpenuhi"; the review facts are the critical ones only (quotation: Klien · Total · Berlaku sampai); the step note
appears only for problems (no repeated "Siap terbit"). Right after the issue the composer shows the result (number,
facts, ONE next action) beside the issued paper; the identity strip and the completed stepper are not shown again and
the record's sections fold behind "Lihat rincian {objek}" (`keepOpen: true` keeps a section such as the answer form
visible when the next action opens it).
*(r13 harmony)* One composed workspace: identity once above both panels; the editor card's top band is the workflow
navigator (MCStepper, Terbit = locked final step, `tpl.finalStage` renames it), the preview card's top band is its
toolbar — same top line, same band height and tone; the Pemeriksaan stage does not repeat its own title (the stepper
names it; the heading stays for assistive tech and as the focus target after a refused issue).
*(r13 refine)* **Focused review**: Pemeriksaan is about the document, so the paper takes 60 % (58 % from 1600 px) and
reaches its 100 % document scale at 1366 (11 px body text); the review rail has three labelled parts — the readiness line
(20 px tone disc + "Semua pemeriksaan terpenuhi", passed checks folded) or the problems first, "Cocokkan dengan
pratinjau" (the critical facts), "Saat diterbitkan" (the numbering cue) — and the bar carries the one action (the total is
in the facts). Rincian keeps 55 % and the live total in the bar. **Preview sizing**: the sticky preview's height follows
its own top and the bar's real height, so the bar never covers the paper or its note. **Inspection**: "Pas lebar" is the
default; "100 %" is the document's own scale (640 px sheet, 11 px body), never a UI zoom; "Layar penuh" (labelled while
composing) opens the paper up to 140 % — the PDF typography never changes for the preview.

**Breathing-room contract (r13 pilot; tokens, never ad-hoc pixels).** Page gutters and the editor ↔ preview gutter =
`--pt-gap`; one surface per active stage with section bands (`--card-padding` inside, hairline `--pt-head-rule`
between); section head → content 12–14 px; label → input 4 px (phones: visible labels); row rhythm = one height per list
(statuses never change a row's height); toolbar → list `--pt-gap`; preview toolbar 8 px block padding, paper stage
12 px; sticky footer: figure left, actions right, one primary. Compact enough for work, spacious enough to think: add
space by REMOVING repeated information and chrome first, not by inflating every padding.

```js
MCComposer.register('my-doc', {
  object: 'Penawaran', photos: 'default',               // none | optional | default | required
  init: ctx => state,                                     // plain JSON
  sections: (state, api) => [{ id, title, sub, html }],   // fields: data-bind="lines.0.qty" data-parse="qty|money|int|date|text"
  onChange: (state, path, api) => {},                     // update derived editor text in place
  viewModel: (state, api) => vm, paper: state => ({ mode, photos }),
  validate: (state, api) => [{ id, severity, text, field, short }],
  readOnly: state => bool, cue: state => '…',
  save: state => {},                                      // explicit "Simpan Draf"
  issue: { label, confirm, execute: (state, api, commandId) => outcome, status, result, after }
});
var c = MCComposer.mount(host, 'my-doc', ctx);            // c.state, c.dirty(), c.flush(), c.checks(), c.pane()
```

- One state store: input → state → derived text (`onChange`) → checks + progress + bar → debounced rAF preview. The
  editor is rendered once (mount, after save, after issue) and never while typing: the caret never jumps.
- ≥ 1280 px: editor ‖ sticky preview rail (46 % of the row; 42 % ≥ 1600 px) with its own scroll, toolbar
  "Pas lebar / 100 %", "Halaman n dari m", "Layar penuh" (modal dialog, Esc, focus returns). Measured paper text at
  fit width: ≈ 7.7 px at 1280, 8.4 px at 1366, 9.0 px at 1440, 11 px (100 %) at 1920 — "100 %" and "Layar penuh"
  serve close reading. 768–1279 px and phones: sticky "Rincian | Pratinjau" switch (state kept, aria-pressed, a
  "Perbaiki" jump returns to Rincian); phones reflow the pages, hide the zoom and step the action bar aside while
  the on-screen keyboard is up. One sticky action bar (D-38): check count, numbering cue, "Simpan Draf", ONE primary.
- Issue: blocking checks → no dialog, the first field takes the focus with its sentence; valid → `MCRisk` COMMIT
  dialog ("Kembali" focused, one execution) → template `execute(state, api, commandId)` (the template calls the
  numbering service) → `MCResult`, read-only composer, issued paper. Outcomes stay in the action region, never a
  toast: unknown (inputs frozen, "Periksa Status"), failed ("Coba Lagi", "Aman diulang"), CONFLICT (result with the
  issued number), series not started (`MCPrereq`).
- Dirty tracking feeds `MCPage.dirtyGuard` (router + `beforeunload`); no form data in browser storage.
- The preview never saves, issues, numbers or mutates.
- Phase 5b (generic, no business data): `lead(state, api)` = the identity strip at the top of the editor
  (`MCComposer.ui.identity({ pill, title, chips, rows, source })` + `ui.source({ text, href, label })`: carried data
  read-only with ONE source tag and "Perbaiki di …", DC-5); sections may carry `after: true` (placed after
  Pemeriksaan: a revision history / versions disclosure, `.pt-compose__more`), `actions`, `foot`, `cls`, `raw`;
  `summary()` leads the sticky bar ("Rp92.318.700 · Total (perkiraan)"); `progress()` may answer `false` (no
  steps on a read-only issued document); `previewTitle()` / `issuedNote()`; a read-only composer shows no
  Pemeriksaan, options or action bar (`optionsReadOnly` / `checksReadOnly` keep them). While dirty the bar offers
  "Kembalikan isian" (asks first, restores the last saved draft). `api.view` holds template UI flags outside the
  state (never "dirty"); `api.preview()` renders now; `api.status(text)`; the instance is reachable as
  `[data-compose].__mcComposer`. `after()` also runs after a CONFLICT result. The visualViewport listener is dropped
  through `MCScope.onDispose` (the page scope does not track it). Line rows `.pt-cline` (40 px thumb · name / meta ·
  value; the defined inputs under it, one row from ~700 px of editor via a container query), totals `.pt-ctotals`,
  radio cards `.pt-compose__choice`.
- `MCChecks` items may carry `link: { href, label }` (a check fixed on another screen: the project, Penomoran
  Dokumen) instead of a field jump. `MCRisk` confirmations accept `statements: []` (shown in full) + `ack` (ONE
  required tick; the confirm button stays disabled until it is ticked).

## 6b. The MULTIPLECORP documents on this system (phase 5b, Layer C)

| Page | Template (registered in) | Archetype | What it is |
|---|---|---|---|
| 14 Detail Penawaran | `quotation` (`modules/proyek-x.js`) | A composer | every revision state in ONE workspace. DRAFT: identity strip (status, revision, company "mengikuti proyek", project, client, PIC; "Dari proyek …" + "Perbaiki di proyek") → progress → Rincian barang & jasa (thumb, qty + unit, unit price via MCForm.num, tax component from the tax table, line value) → Masa berlaku (date + 14/30/60, default 14) → Opsi dokumen ("Tampilkan foto produk", default on, locked at issue) → Pemeriksaan (lines, qty > 0, priced, validity ≥ today, numbering series (C-10: Owner link / Admin MSG-17), company, client/PIC; warnings: Rp0 price, goods without photo, stale project item) → revision history disclosure. SENT / Kedaluwarsa / Disetujui Klien / Ditolak Klien / older revision: read-only on the issued paper (notice, answer form, recorded answer, lines, document row with Unduh / Cetak once the PDF is ready) |
| 62 Detail Invoice (DRAFT) | `invoice-draft` (`modules/keuangan.js`) | A composer | carried data (client, PIC, project, confirmed value) + the defined inputs: basis (value — DP / termin — or all confirmed lines), layout (Invoice DOC-06 / Nota DOC-04, one record), the transaction date (today); Pemeriksaan: within the confirmed value not yet invoiced (blocking), above the delivered value (warning, never blocking), numbering, company; result next step "Tagihkan". An issued invoice keeps the record view (position block + parts) |
| 51 Detail Dokumen (draft of a generated type) | `document-review` (`modules/dokumen.js`) | C review workspace | identity strip ("Isi diambil dari Barang Keluar …" + "Perbaiki di …"), preconditions as MCChecks, the live paper, "Cetak Draf" + ONE "Terbitkan {jenis}"; no editable input beyond the business date (today). Invoice drafts send to 62 ("Susun di Detail Invoice"); a prep draft keeps print / upload-original |
| 51 Detail Dokumen (issued, revised, void, upload) | — | D viewer | paper beside Rincian (incl. "PDF" state), version chain, history; FAILED = MSG-08 "percobaan n dari 5" (exhausted after 5, operator alerted) + "Muat Ulang Status" — never a manual re-render (G9; also removed from the 50 list); "Unduh PDF" / "Cetak" (from the rendition) disabled with the reason until READY |
| 97 Penomoran Dokumen | — | settings | 15 sequence types per company; every series labelled by granularity ("Tahunan · Tahun 2026"); Rincian: format (example), period, revision format (NEW_NUMBER), effective date, seed boundary, go-live; "Mulai Penomoran" = statements (a)–(d) in full + "Saya menyatakan hal di atas benar" (MCRisk `statements` / `ack`) |
| 12 Proyek Baru · 13 Penawaran | — | form / list | the cue only (no predicted number); 12 handles the numbering outcomes: unknown (MSG-07: the form freezes, the one control becomes "Periksa Status", no blind retry), CONFLICT (MSG-04 result with the number, never a second record); 13 / 11 / the 12 result all land in the 14 composer |

Issue in every template: blocking checks → no dialog, the first field (or Pemeriksaan) takes the focus with its
sentence; valid → MCRisk COMMIT with MSG-39 wording (the period line, never a number; "Kembali" focused) → the
template's `execute` calls `MCApp.numbering.issue(company, type, today, commandId)` (idempotent: a double click,
"Coba Lagi" or "Periksa Status" never draws twice) → ONE `MCResult` (MSG-01, PDF PENDING → READY, ONE next action)
→ the composer turns read-only on the issued paper. DOC-01 issue writes one document per project with versions
(`previousVersionId`, the earlier version REVISED) and locks the photo choice + each goods line's photo into the
issued snapshot (`photos`, `lines[].photo`); 51 renders the same view model (`MCApp.quotationPaper`). The invoice
content is shared too (`MCApp.invoiceContent`, used by 62 and 51). Data reuse: carried data read-only with its source;
a project item changed after the draft took it shows "Item proyek kini …" under the line and "Terapkan Data Proyek"
(asks first over edited input); stale = keep input + show current + reapply. Approval copy no longer couples
"proyek menjadi Aktif" (the lab execution still activates a DRAFT project: Phase 7). Rejection reason: optional,
recommended. Tests: `tools/behaviour_test.py` block "r13 phase 5b" (28 checks); `scratch/r13/phase5b/run_block.py`
runs it alone.

## 7. Parser — `MCForm.num`

`parse('1.250.000')` → 1250000; `parse('Rp 1.250.000')` → 1250000; `parse('1.250.000,50', { decimals: 2 })` →
1250000.5; `parse('1.250.000,50', { unit: 'money' })` → error "Isi rupiah bulat tanpa sen, contoh 1.250.000.";
"1.25.000" / "1.5" / letters / negatives → error sentences. Replaces the digit-stripping `parseNum` helpers of 03,
12/14, 65/66 (`parseRp`), 61 write-off, 85/86 prices and the floor counts.

## 8. Tests

`tools/behaviour_test.py` block "r13 phase 5a" (20 checks): totals and rounding, parser, numbering idempotency /
cue / blocker / demo hooks, no predicted number (14, 51, 12), 51 and 14 issue results, one renderer on 51/52/03,
MCProgress on 03, and the composer harness (live preview sync with the caret kept, MCChecks severity, blocking → focus,
parser errors, issue once, escaping, zoom, full screen, explicit save, outcomes, panes at 1024 / 390). Before/after
screenshots: `scratch/r13/phase5a/shots.py` + `diffall.py`.
