# MULTIPLECORP Golden Reference — Role journeys (r11)

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL**.

The key recurring journeys of the two canonical roles, taken from the canonical MultipleCorp documents (`docs/07-ux-design/ADMIN_FLOW/s10-*-journeys.md`, `INFORMATION_ARCHITECTURE.md`, `05-security/PERMISSIONS_MATRIX.md`, `01-product/PRODUCT_OVERVIEW.md`; read-only) and mapped to the prototype routes. R11 used them to judge whether routing is intuitive: each step must land where the next action happens for a holder of its capability, with that action as the screen's obvious primary. Principles: `docs/UX_PRINCIPLES.md`; controls: `docs/ACTION_ROUTE_MATRIX.md`.

Shape of every journey: **ENTRY → TASK → DECISION/ACTION → RESULT → NEXT CONTEXT**.

## Roles in one paragraph each

- **Owner (Dimas)** — oversight, decisions, review, business visibility. Starts on Beranda (02), reads what needs attention and the period figures, drills into exceptions, decides what only the Owner may decide (Selesaikan Paksa, Hapuskan Piutang, access and company settings, numbering, attribution of stock discrepancies), reviews work done under special authority on Tinjauan Owner (90) without any approve step, and reads reports (80/81). Holds every capability, but execution work (receiving, dispatching, recording deliveries, issuing documents, billing, payments) is not the Owner's immediate task context — on Owner surfaces those verbs are quieter.

- **Admin Operasional (Sari, `?role=admin`, ARJ + BTN)** — execution, data entry and follow-up. Starts on Antrean Tindakan (06), works the queue by kind of work, and each row lands where the next step happens (or on the record view when she lacks that capability). Cannot see Owner-only screens (they answer as not-found), cross-company totals, CKP records, or controls her capabilities do not allow (hidden, not disabled). Kewenangan khusus she holds: payment.reallocate, warnings.override, cases.close; notably she has no stock.dispatch, stock.count, delivery.close, purchase.cancel, receivables.dispute, profit.view.

### Owner — recurring tasks (ranked)

- Daily oversight on Beranda (lab 02-owner-dashboard.html). The Owner reads the group position as Gabungan and per company, plus the derived signals, and follows links only.
- Review work already done under special authority on Tinjauan Owner (90-tinjauan-owner.html). This covers every ADM+ correction or closure, overridden duplicate warnings, pool-evidence uploads, out-of-scope import collisions and…
- Resolve the business exceptions only the Owner may decide: unexplained-loss attribution (QS-22, 'Tetapkan Perusahaan'), count-surplus attribution (QS-18, 'Tetapkan Surplus'), receivable write-off ('Hapuskan Piutang') and its…
- Oversee receivables and cash: overdue and disputed receivables, Belum Ditagihkan invoices and unapplied credit (G3), with ageing on the receivables report. Decide on a write-off when an amount cannot be collected.
- Oversee the project portfolio and completion: completion blockers per project (QS-15, G4), with drill-down into the project hub (11) and Penyelesaian Proyek (15). Normal completion is Admin work; Force Complete is the Owner's…
- Read the managerial reports: per-company reports (80), the consolidated Laporan Gabungan (81, including the inter-company allocation report), profit and managerial cash flow, and the export (82).
- Administer access and companies (low frequency, high consequence; 95–98): accounts, role, company grants, capabilities (including each ADM+ grant per account with a reason), ending sessions, credential links, company identity,…
- Monitor security and audit: Owner security notices at the head of G1, Log Keamanan, and Riwayat Aktivitas (workspace audit search, 91).
- One-off at go-live: sign off and commit the opening import after Admin preparation.

### Admin — recurring tasks (ranked)

- Start on Antrean Tindakan (06-antrean-tindakan.html?role=admin) and work the queue group by group: Proyek & Gudang, Dokumen & Kasus, Penagihan & Kas (only with finance.view) and Penyelesaian Proyek. Every row carries its company.
- Project setup and commercial work: 'Buat Proyek' with an explicit company, quotation draft and 'Terbitkan Penawaran', then 'Catat Jawaban Klien' (Disetujui = confirmation) or 'Konfirmasi Proyek' with evidence.
- Fulfilment planning per confirmed line: 'Reservasi' up to availability, and for a shortage 'Buat Pembelian' (QS-01, QS-02, QS-03).
- Receiving (Barang Masuk, 32): scan or choose the line, split the outcome, record serials and evidence, and use the optional 'Reservasi untuk Proyek Ini' in the same command. Then 'Catat Barang Masuk', one command per line.
- Dispatch (Barang Keluar, 33) and 'Terbitkan Surat Jalan'. This applies only to an Admin holding stock.dispatch: in the fixture that is Bagas, not Sari.
- Delivery: 'Catat Pengiriman' with recipient, condition and proof, opening a discrepancy case in the same form when needed, then the optional BAST or Berita Acara.
- Documents and administration: issue Surat Jalan, BAST, invoice and other layouts; on 52 link or upload what satisfies each requirement; 'Tandai Tidak Berlaku' on eligible items, with a reason.
- Invoice → 'Tagihkan' → follow up Piutang.
- 'Catat Pembayaran', with its applications in the same command; later 'Terapkan' for unapplied money and 'Tautkan Kuitansi' for an open pre-payment Kuitansi (QS-19).
- Normal completion: 'Selesaikan Proyek' once all ten conditions are met.
- Correct mistakes only through authorized paths, starting from the record being corrected. Each ADM+ capability is a separate grant and needs a reason.

## Owner journeys

### O1 Morning oversight: group position and Owner attention

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `01-login.html → 02-owner-dashboard.html` | After sign-in the Owner lands on Beranda, the consolidated and per-company overview. | Masuk |
| TASK | `02-owner-dashboard.html` | Read G1 'Perlu Perhatian Owner' first, then G2–G4 and the G5 period figures per company with Gabungan last; switch 'Tampilan: Gabungan' or one company. | None: links only (SCR-05). Optional: Muat Ulang |
| DECISION/ACTION | `02-owner-dashboard.html` | Choose the item that needs an Owner decision and open its row. | Row link, e.g. QS-14 → 90-tinjauan-owner.html, QS-15 → 15-penyelesaian-proyek.html, QS-10 → 63-piutang.html |
| RESULT | `90 / 15 / 63` | Lands on the screen where the next action happens for a holder of that capability (PJ-13). | The target screen's own primary action |
| NEXT CONTEXT | `02-owner-dashboard.html` | Back on Beranda the signals have been recomputed ('Diperbarui {waktu} WIB'); nothing is marked read. | Muat Ulang |

Canonical source: INFORMATION_ARCHITECTURE.md UXN-05, SCR-05, §9; ADMIN_FLOW/s10-a-journeys.md J-ACC-01; PRODUCT_OVERVIEW.md 'Primary users and goals'

**R11 evaluation:** PASS. Beranda (02) has no header primary: the "Tindakan hari ini" rows ARE the actions, each a whole-row link ending in a quiet Owner verb (Lihat piutang, Lihat barang masuk, Tinjau …), and they land where the fact is (63?filter=7hari, 32, 40, 52?proyek, 90). Fixed in the final pass: a filter set by the address now shows on the Filter button ("Filter (1)") and Atur ulang returns to the page default; the dashboard and 52 now count administration the same way (3 dari 7 syarat wajib). Phone: rows are full-width tap targets; the bottom bar stays (no task).

### O2 Review actions taken under special authority

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `02-owner-dashboard.html (G1, QS-14 row) → 90-tinjauan-owner.html` | New items since the Owner's previous sign-in. | Tinjau (link) |
| TASK | `90-tinjauan-owner.html` | Read the 'Kondisi yang Masih Terbuka' table, then the Aktivitas, Keamanan, Bukti Gudang Bersama and Impor tabs within the 7-day window. The divider 'Tercatat setelah Anda masuk sebelumnya' separates new from older items. | None: derived view (window, company and actor filters only) |
| DECISION/ACTION | `90-tinjauan-owner.html → record` | If something looks wrong, open the record. | Buka Catatan (e.g. 64-pembayaran.html?sel=…, 21-pembelian-detail.html?id=…, 34-riwayat-stok.html) |
| RESULT | `Record page` | The Owner acts only through the record's normal command or correction row, with a reason. No approve, reject or mark-read control exists. | The record's correction command, if needed |
| NEXT CONTEXT | `91-riwayat-aktivitas.html` | Deeper audit search (company, period, actor, action class, backdated gap) or the Log Keamanan tab. | None (read and print) |

Canonical source: PERMISSIONS_MATRIX.md §10, AZ-10; INFORMATION_ARCHITECTURE.md §9.2 (SCR-07), GL-003; WORKFLOWS/s01-04-foundations.md §4

**R11 evaluation:** PASS. Tinjauan Owner (90) is a derived read view: only Cetak in the header, open conditions first, then the activity feed with the 'since your last sign-in' divider; every row is a link to the record and there is no approve control. Fixed in the final pass: the inter-company allocation row opened the Catat Pengiriman commit form; record links are now read-only (D-42), so it opens the stock movements of that Barang Keluar (34?ref=).

### O3 Exceptional project completion (Selesaikan Paksa)

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `02 (G4, QS-15) or 11-proyek-detail.html?id=prj-arj-0142 → 15-penyelesaian-proyek.html?id=prj-arj-0142` | Open the completion conditions of a blocked project. | Penyelesaian (link) |
| TASK | `15-penyelesaian-proyek.html` | Review the ten conditions; each unmet one says what is missing and where to resolve it. | Links to fix (normally delegated to an Admin) |
| DECISION/ACTION | `15-penyelesaian-proyek.html` | Choose between the normal path and an exceptional business circumstance. The CRITICAL confirmation shows the blocker snapshot and residual obligations, takes a mandatory reason and states that nothing is fabricated; if… | Selesaikan Paksa (Owner only). 'Selesaikan Proyek' is used only when all ten conditions are met |
| RESULT | `15 → 11-proyek-detail.html` | The project is completed by force. Unmet conditions and residual obligations stay visible, and receivables are unchanged. | — |
| NEXT CONTEXT | `11-proyek-detail.html; 02-owner-dashboard.html (G1, QS-16)` | Only residual commands remain on the project; its residual obligations appear in G1. | Row link from QS-16 |

Canonical source: ADMIN_FLOW/s10-b-journeys.md J-PRJ-03; PERMISSIONS_MATRIX.md OD-12; V1_SCOPE.md 'Normal completion and exceptional override'; INFORMATION_ARCHITECTURE.md SCR-14

**R11 evaluation:** PASS. 11 → Syarat penyelesaian ("Semua syarat") → 15. The decision card holds both outcomes: Selesaikan Proyek (disabled with the count of unmet conditions) and, for the Owner only, the muted danger command "Keadaan luar biasa: Selesaikan Paksa…" (moved out of a one-item overflow menu, where reviewers could not find it). The CRITICAL confirmation (blocker snapshot, obligations, reason, typed SELESAIKAN) is unchanged. Condition fixes read as oversight for the Owner ("Lihat …" links); on phones the decision card follows the conditions while they are unmet.

### O4 Doubtful receivable: dispute or write-off

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `02 (G3, QS-10 or QS-11) → 63-piutang.html (Aktif / Sengketa tab)` | Overdue or disputed receivables, one row per invoice, labelled with the company. | Row link |
| TASK | `62-invoice-detail.html?id=inv-btn-0044` | Check the remainder, the due state, applications, settlements and dispute history. | None while reading |
| DECISION/ACTION | `62-invoice-detail.html` | Keep collecting, set a dispute hold, or write off. A write-off takes the amount and a reason; credit available for the same client and company must be applied first, or a reason given. | Hapuskan Piutang (Owner only, DESTRUCTIVE confirmation) |
| RESULT | `62-invoice-detail.html` | The invoice is Dihapuskan. No Cash-In is recorded and profit does not rise; the event goes to Riwayat Aktivitas. | — |
| NEXT CONTEXT | `63-piutang.html; 90-tinjauan-owner.html` | Money received later surfaces in QS-12 and QS-14 with the single action 'Terapkan dan Cabut Penghapusan'. | Buka Catatan |

Canonical source: ADMIN_FLOW/s10-b-journeys.md J-FIN-05, J-FIN-02; PERMISSIONS_MATRIX.md receivables.write_off, OD-07, OD-11; INFORMATION_ARCHITECTURE.md SCR-39, SCR-40

**R11 evaluation:** PASS. 63 → the invoice in the side panel (phone: sheet) → 62. The panel's one visible step is per invoice (Catat pembayaran invoice ini, quiet for the Owner); the generic Catat Pembayaran moved to Tindakan Lain, so the two no longer compete. On 62 Tindakan Lain holds Tandai Sengketa, a separator, then Hapuskan Piutang (Owner only, destructive, last) with amount, reason and typed confirmation. Product note (not changed): Sari has no receivables.dispute, so only the Owner can mark a dispute.

### O5 Consolidated performance and reports

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `02 (G5 period figures) → 81-laporan-gabungan.html` | Consolidated figures and the inter-company allocation report (Owner only). | Link |
| TASK | `81-laporan-gabungan.html` | Set the required date range, then compare per-company rows with the Gabungan row last. | Periode filter |
| DECISION/ACTION | `81 → 80-laporan.html` | Drill into one company's report (one section per company) or export. | Ekspor |
| RESULT | `82-ekspor-saya.html` | The export request shows the states Diminta, Diproses, Siap Diunduh, Gagal and Tidak Tersedia. | — |
| NEXT CONTEXT | `82-ekspor-saya.html` | Download when ready; a failed export can be requested again. | Unduh / Minta Lagi |

Canonical source: V1_SCOPE.md CAP-11, CAP-17; INFORMATION_ARCHITECTURE.md SCR-47..SCR-49, D-IA-12; PERMISSIONS_MATRIX.md reports.consolidated, RD-07

**R11 evaluation:** PASS. 80 → Laporan Gabungan (81) → Ekspor ▾ (Excel / PDF / Lihat Ekspor Saya) → the inline result card → 82, where the new request is first and marked Baru. Fixed in the final pass: Ekspor/Cetak left the filter toolbar for the header, one feedback per export (the toast is gone, D-43), fixture times no later than the 09.00 clock so 'terbaru lebih dulu' holds, and allocation links open the read-only record.

### O6 Grant access to a new Admin

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `95-pengaturan.html → 96-pengguna-akses.html` | Account list and detail. | Buat akun (create) |
| TASK | `96-pengguna-akses.html` | Set the role, company grants and capabilities by area, with prerequisites stated; each ADM+ capability is granted separately with a reason. OWNER_ONLY capabilities are never offered. | — |
| DECISION/ACTION | `96-pengguna-akses.html` | Check the 'Pratinjau Akses' matrix (capability × company) before saving. A step-up 'Konfirmasi Kata Sandi' follows. | Simpan Akses |
| RESULT | `96-pengguna-akses.html` | Account and grants are recorded with an audit entry; 'Buat Tautan Atur Kata Sandi' shows the link once, with its expiry. | Buat Tautan Atur Kata Sandi |
| NEXT CONTEXT | `02-owner-dashboard.html (G1)` | The link is delivered outside the app. When it is used, MSG-29's Owner variant heads G1. | — |

Canonical source: ADMIN_FLOW/s10-a-journeys.md J-ACC-02, s05-command-model.md IP-10; PERMISSIONS_MATRIX.md RG-05..RG-08, OD-01, OD-02; INFORMATION_ARCHITECTURE.md SCR-57, GL-191

**R11 evaluation:** PASS. 95 → Akses (96) → Ubah Akses → three-step editor with a sticky [Batal][Pratinjau Akses] bar → preview by company → Simpan Akses. Fixed in the final pass: the capability groups flow in two balanced columns (no hole), the duplicate 'nothing is saved yet' note is gone, the changed/all toggle only appears when it filters something, and Akhiri Semua Sesi is a quiet danger command in its own slot instead of a full-width button under the invitation link.

### O7 Start numbering so Admins can issue documents

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `Readiness line, or the notice on 51-dokumen-detail.html ('Penomoran … belum dimulai') → 97-penomoran.html` | A type or period has no numbering series, so an Admin's issue was refused (C-10). | Link |
| TASK | `97-penomoran.html` | Each company's numbered types are grouped as Perlu Tindakan Owner, Tertahan or Sudah Dimulai, with details under 'Rincian'. | — |
| DECISION/ACTION | `97-penomoran.html` | Confirm the start or the seed. The date is fixed as today. | Mulai Penomoran / Tetapkan Nomor Awal |
| RESULT | `97-penomoran.html` | The type is numbered from the start boundary. | — |
| NEXT CONTEXT | `51-dokumen-detail.html` | The Admin can now issue the document. | Terbitkan (Admin) |

Canonical source: ADMIN_FLOW/s11-13-corrections-numbering-import.md §12, s01-04 D-UX-08, s10-b J-DOC-01 (C-10); PERMISSIONS_MATRIX.md companies.manage, OD-03; INFORMATION_ARCHITECTURE.md SCR-55, D-IA-13

**R11 evaluation:** PASS. Penomoran (97) groups Perlu tindakan Owner / Tertahan / Sudah dimulai with one filled Mulai Penomoran; its inline form takes the first number and previews the result. The row reason now speaks to the Owner directly ("Nomor awal belum ditetapkan. Isi nomor pertama saat Mulai Penomoran.") and the phone form actions follow the [Batal][primary] split.

### O8 Attribute a stock discrepancy or count surplus (Owner only). UNCERTAIN: the lab has no landing screen

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `02 (G1, QS-22 / QS-18 row). The lab fixture has no such row; 36-stok-opname.html only notes 'temuan untuk Owner'` | A pending unexplained-loss case or an open surplus finding. | Row link |
| TASK | `SCR-27 Selisih & Temuan: NO lab route` | Recognition snapshot: each candidate company with its exposure and lots. | — |
| DECISION/ACTION | `SCR-27 (missing)` | Assign quantities to companies within their exposure. A shortfall from other lots needs 'Alasan alokasi antar-perusahaan'. | Tetapkan Perusahaan / Tetapkan Surplus |
| RESULT | `—` | The loss is recorded once, on the causal project or else on the company; a surplus gets a flagged cost basis. | — |
| NEXT CONTEXT | `30-stok.html / 31-stok-produk.html` | The pending line clears. Only the Owner can reverse it, once ('Balikkan Penetapan'). | — |

Canonical source: ADMIN_FLOW/s10-a-journeys.md §10.3 (SCR-27), J-INV-05; PERMISSIONS_MATRIX.md W4-06, W4-07, OD-08, OD-09, OD-15; INFORMATION_ARCHITECTURE.md §9.1 QS-18, QS-22, SCR-27

**R11 evaluation:** UNCHANGED (documented gap). The canonical attribution of a stock discrepancy has no dedicated landing screen in the lab; the Owner reaches it from the opname/case records. Recorded as a product recommendation, not invented.


## Admin journeys

### A1 Start the day from Antrean Tindakan

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `01-login.html → 06-antrean-tindakan.html?role=admin` | The Admin's Beranda is the action queue across granted companies (ARJ, BTN). | Masuk |
| TASK | `06-antrean-tindakan.html` | Scan the groups: Proyek & Gudang, Dokumen & Kasus, Penagihan & Kas (finance.view) and Penyelesaian Proyek. Every row is labelled with its company. | None: links only |
| DECISION/ACTION | `06-antrean-tindakan.html` | Pick the most urgent row by tone and age. | Row link (capability-aware) |
| RESULT | `e.g. 32-barang-masuk.html?pembelian=pur-arj-0418 or 41-catat-pengiriman.html?id=ds-arj-0012` | Lands where the next action happens; without the capability, on the record's view. | The target screen's primary action |
| NEXT CONTEXT | `06-antrean-tindakan.html` | After the command commits, the row disappears on refresh. There is no 'done' control. | Muat Ulang |

Canonical source: INFORMATION_ARCHITECTURE.md UXN-05, SCR-06, D-IA-08, §9; PERMISSIONS_MATRIX.md PJ-13, CS-08

**R11 evaluation:** PASS. Antrean Tindakan (06) groups the work by kind; every row is a link that lands where the next step happens for a holder of its capability, or on the read view otherwise (MCApp.canGo). Fixed in the final pass: the Kekurangan stok row opens Buat Pembelian already filled from the shortage (isi=kebutuhan); case rows (70) no longer offer Sari green 'Buka Pengiriman / Buka Pembelian' buttons to pages she cannot act on, which ended the 70 ↔ 41 loop; the 'belum diinvoice' row no longer promises a command (11 Penagihan now has one). Phone: the toolbar's only control is labelled 'Perusahaan'.

### A2 New project through to commercial confirmation

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `10-proyek.html → 12-proyek-baru.html` | Start a project. | Buat Proyek |
| TASK | `12-proyek-baru.html` | Choose the company explicitly (never prefilled from the filter), search for the client first, then unit, PIC, channel (Reguler/SIPLAH) and demand lines with their mode. | Simpan |
| DECISION/ACTION | `11-proyek-detail.html (Penawaran part) → 14-penawaran-detail.html` | Draft from the project's lines and issue it (irreversible; DOC-01). | Terbitkan Penawaran |
| RESULT | `14-penawaran-detail.html` | Record the client's answer: 'Disetujui' on the latest sent revision is the confirmation; 'Kedaluwarsa' offers only 'Buat Revisi'. | Catat Jawaban Klien |
| NEXT CONTEXT | `11-proyek-detail.html?tab=pemenuhan` | The proposed reservations follow as separate commands; a shortage leads to a purchase. | Reservasi / Buat Pembelian |

Canonical source: ADMIN_FLOW/s10-a-journeys.md J-PRJ-01, J-QUO-01, J-PRJ-02; PERMISSIONS_MATRIX.md projects.manage, quotation.manage, projects.confirm

**R11 evaluation:** PASS. 10 Buat Proyek (one filled primary) → 12 (sections, sticky [Batal][Simpan sebagai Draf], inline errors + count) → hub. Fixed in the final pass: on a Draf project 'Buat Penawaran' opens the draft confirmation at once (13?buat=1) instead of a second identical button; 14 hides the header primary while its answer panel is open, and 13 phone rows no longer clip the revision.

### A3 Shortage → purchase → goods receipt

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `06 (QS-02 row) → 03-create-purchase.html?proyek=prj-arj-0142` | The purchase form opens prefilled from the project; the company is the project's. | Row link |
| TASK | `03-create-purchase.html` | Enter the supplier (chosen directly), lines with actual price and tax, and charges with their source bill and classification. | Simpan Pembelian |
| DECISION/ACTION | `21-pembelian-detail.html?id=pur-arj-0418` | The purchase is Terbuka; the answer says no cash has left and no stock has arrived. Optionally issue the PO. | Terima Barang (when goods arrive) |
| RESULT | `32-barang-masuk.html?pembelian=pur-arj-0418` | For each line: scan, split into Layak pakai / Rusak diterima / Ditolak, record serials and the delivery reference, and use 'Reservasi untuk Proyek Ini' in the same command. | Catat Barang Masuk (per line) |
| NEXT CONTEXT | `06-antrean-tindakan.html; 11-proyek-detail.html?tab=pemenuhan` | QS-05 and QS-03 clear; next comes dispatch, by an Admin with stock.dispatch. | — |

Canonical source: ADMIN_FLOW/s10-a-journeys.md J-FUL-01, J-PUR-01, J-INV-01, D-UX-12; INFORMATION_ARCHITECTURE.md §9.1 QS-02, QS-05

**R11 evaluation:** PASS. Kekurangan stok (06 / 11 / 31 / 35) → 03?proyek=…&isi=kebutuhan: the lines are the project shortage (1 Laptop 14 inci), no supplier preselected, today's date; Batal returns to the project's Pengadaan. 'Gunakan data dari' is the shared menu (sheet on phones). → 21 (one primary Terima Barang) → 32 task with the project reservation in the same command.

### A4 Record a delivery with proof

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `06 (QS-06 row) → 41-catat-pengiriman.html?id=ds-arj-0012 (or 40-pengiriman.html)` | A dispatch that is not yet delivered. | Row link / Catat Pengiriman |
| TASK | `41-catat-pengiriman.html` | Delivered quantity per line, recipient, date, condition, and proof (signed Surat Jalan or a photo). | — |
| DECISION/ACTION | `41-catat-pengiriman.html` | A difference or a condition problem opens a discrepancy case in the same form. | Catat Pengiriman (confirmation) |
| RESULT | `40-pengiriman.html` | The delivery is recorded; stock never changes on delivery. | — |
| NEXT CONTEXT | `51-dokumen-detail.html; 15-penyelesaian-proyek.html` | Optional BAST or Berita Acara drafts; completion condition 2 updates. | Terbitkan (document) |

Canonical source: ADMIN_FLOW/s10-b-journeys.md J-FUL-02; INFORMATION_ARCHITECTURE.md SCR-28, SCR-29, D-IA-16; PERMISSIONS_MATRIX.md delivery.record

**R11 evaluation:** PASS. 40 rows are whole-row links (the duplicate 'Catat' row button is gone) → 41 with the MC date field, sticky [Batal][Catat Pengiriman] and 'Ada masalah?' for discrepancies; the tab row sits above the toolbar like every other module.

### A5 Invoice → billing → payment

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `06 (QS-15 'nilai terkonfirmasi belum diinvoice') → 11-proyek-detail.html?id=prj-arj-0142&tab=penagihan → 62-invoice-detail.html` | Draft from confirmed lines, or a value-only DP or termin. | Buat Invoice |
| TASK | `62-invoice-detail.html` | Tax components; the answer says no receivable is active and no cash is recorded yet. | Terbitkan Invoice |
| DECISION/ACTION | `62-invoice-detail.html (Belum Ditagihkan, QS-09)` | Enter the billing date and due date. | Tagihkan |
| RESULT | `63-piutang.html` | The remainder becomes an active receivable that ages from the due date. | Catat Pembayaran (when the money arrives) |
| NEXT CONTEXT | `65-catat-pembayaran.html → 64-pembayaran.html` | One command: company, client, amount, bank, proof and applications; the rest stays as Kredit Pelanggan. Then 'Tautkan Kuitansi' if QS-19 is open. | Catat Pembayaran |

Canonical source: ADMIN_FLOW/s10-b-journeys.md J-FIN-01, J-FIN-02, J-FIN-03, J-FIN-08; V1_SCOPE.md 'Financial concepts and billing'

**R11 evaluation:** PASS. Fixed in the final pass: 'Buat Invoice' is no longer a dead end. From 61 (project picker that shows only projects with something left to invoice, value = Belum diinvoice) or from 11 Penagihan, one command (MCApp.startInvoice, D-44) confirms the basis and value, starts the draft and opens it on 62, where 'Pratinjau & Terbitkan' is the primary → 51 Terbitkan → 62 Tagihkan → 63/65 Catat Pembayaran.

### A6 Complete the administrative documents

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `06 (G4 'dokumen administrasi wajib belum lengkap') → 52-dokumen-administrasi.html?proyek=prj-arj-0142` | The project's checklist. | Row link |
| TASK | `52-dokumen-administrasi.html` | Each requirement shows its derived status, linked documents and uploads, with a preview beside it. | — |
| DECISION/ACTION | `52 (→ 51-dokumen-detail.html for a company draft)` | Link the issued document, upload evidence, or mark an eligible item 'Tidak Berlaku' with a reason. | Unggah Bukti / Tautkan / Terbitkan |
| RESULT | `52-dokumen-administrasi.html` | The status becomes Terpenuhi. A draft never satisfies a requirement, and a reproduction never satisfies a client original. | — |
| NEXT CONTEXT | `15-penyelesaian-proyek.html` | Completion condition 5 updates. | — |

Canonical source: ADMIN_FLOW/s10-b-journeys.md J-ADM-01, J-DOC-01, J-DOC-02, s06-09 IP-16; INFORMATION_ARCHITECTURE.md SCR-37, D-IA-10; PERMISSIONS_MATRIX.md requirements.manage, requirements.waive, OD-05, OD-06

**R11 evaluation:** PASS. 52 shows one primary per selected requirement (Pratinjau & Terbitkan / Unggah Bukti) → 51 Terbitkan. Fixed in the final pass: met rows are quiet (no Terpenuhi pill), optional items sit in their own quiet group, the tab count no longer mixes all projects with this project, and the project select is number-first so the record number never clips on phones.

### A7 Normal project completion

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `06 (G4, QS-15) → 15-penyelesaian-proyek.html?id=prj-arj-0142` | The ten conditions of the project. | Row link |
| TASK | `15-penyelesaian-proyek.html` | Work through each unmet condition via its link; only links the account can act on should appear. | The per-condition link |
| DECISION/ACTION | `15-penyelesaian-proyek.html` | Complete when all ten conditions are met; a condition that has changed meanwhile returns REJECTED. | Selesaikan Proyek (confirmation) |
| RESULT | `11-proyek-detail.html` | The project is Selesai and only residual commands remain; a later material correction returns it to Aktif. | — |
| NEXT CONTEXT | `06-antrean-tindakan.html` | The QS-15 row clears. There is no Force Complete section for an Admin. | — |

Canonical source: ADMIN_FLOW/s10-b-journeys.md J-PRJ-03, s05 IP-08; PERMISSIONS_MATRIX.md projects.complete, OD-12

**R11 evaluation:** PASS. 15 for the Admin: Selesaikan Proyek disabled with the reason and the number of unmet conditions, no Selesaikan Paksa anywhere. Condition fixes are either one outline task button (when she holds that capability: Catat Barang Keluar is absent because she lacks stock.dispatch) or a quiet 'Lihat …' link, so navigation and work no longer look alike.

### A8 Confirm a duplicate-payment warning (kewenangan khusus)

| Stage | Route | What happens | Primary action |
|---|---|---|---|
| ENTRY | `63-piutang.html / 62-invoice-detail.html → 65-catat-pembayaran.html` | Record a client payment. | Catat Pembayaran |
| TASK | `65-catat-pembayaran.html` | The first submit is REJECTED with the likely duplicates the Admin may see (same bank account and amount within the window). | — |
| DECISION/ACTION | `65-catat-pembayaran.html` | Check each listed payment. If this is a different receipt, tick every match, give a reason and send again. Without warnings.override, MSG-15 says to ask an authorized account or the Owner. | Catat Pembayaran (override, second submission) |
| RESULT | `64-pembayaran.html?sel=…` | The payment is recorded as ADM_PLUS; it is listed in QS-21 (Dokumen & Kasus) and in the Owner's QS-14. | — |
| NEXT CONTEXT | `90-tinjauan-owner.html (Owner side)` | The Owner may review it and correct it through normal commands if needed. | Buka Catatan (Owner) |

Canonical source: ADMIN_FLOW/s05-command-model.md IP-05, s10-b J-FIN-03; PERMISSIONS_MATRIX.md warnings.override, §10, AZ-10; INFORMATION_ARCHITECTURE.md §9.1 QS-21

**R11 evaluation:** PASS (unchanged by R11). On 65 a possible duplicate names the earlier payment (link, date, amount, account ending); with warnings.override Sari ticks 'Sudah saya periksa: ini pembayaran yang berbeda' and gives a reason that goes to Riwayat Aktivitas, without it the form explains that the Owner must record it. R11 only aligned the form chrome (MC date field, [Batal][primary] action bar, no icon on the primary).

## Canonical screen emphasis used by R11

- Cross-cutting, canonical: confirm irreversible commands in a dialog with the action's own verb on the confirm button and 'Kembali' as the other, never 'Ya'/'OK', with focus never on the confirm button; on a phone it is a full-height sheet (ADMIN_FLOW/s05-command-model.md IP-08). Destructive styling only for actions that end or reverse something, with the reason in the confirming step (IP-09). Hide what the capability disallows; disable with a reason only when temporarily unavailable (IP-21). One answer per command, never a combined 'Tersimpan' (IP-19). No badge or count on navigation entries…
- 02-owner-dashboard (SCR-05): no command; every row is a link. Signal groups G1–G4 plus G5 period figures per company with Gabungan last, the 'Tampilan' switch, 'Muat Ulang' and 'Diperbarui {waktu} WIB'.
- 06-antrean-tindakan (SCR-06): links only; groups by kind of work, company label on every row; a group the account has no capability for is absent; counts per company.

Per-screen emphasis and capabilities are applied in `docs/ACTION_ROUTE_MATRIX.md`.

## R12 revalidation (hierarchical navigation)

Every journey re-walked against the R12 navigation (trees: `docs/NAVIGATION_ARCHITECTURE.md` §3; removals:
`docs/ACTION_ROUTE_MATRIX.md` R12). This is a desk revalidation from the resolved configuration
(`node tools/export_config.js`, `… default admin`) and the page changes; the browser walk-through belongs to the
R12 QA and the Owner's visual review. Counting rule: a level-1 entry is one click; a child is two from another
area (open the group, choose the child) and one when its group is already open (the current group opens on load).
Before R12 a sibling screen (Penawaran, Reservasi, Invoice, Piutang, Laporan Gabungan, Pengguna & Akses …) took the
same clicks plus an intermediate page load (module landing, then a sub-nav link, hub tile or subtitle link).
Phones: slot 4 is one tap (Owner Keuangan, Admin Pengiriman); other areas are Menu → group → entry in the drawer.

| Journey | Entry (desktop · phone) | What R12 changed on the path | Steps | Verdict (desk) |
|---|---|---|---|---|
| O1 Morning oversight | sign-in → 02; sidebar Beranda (`page`) · bottom slot 1 | rows unchanged; "Proyek berjalan › Lihat semua" opens 10?state=ACTIVE (Status preset, "Filter (1)"); the awaiting-goods row is "Lihat pembelian" → 20?penerimaan=menunggu (review: he oversees the purchases, the floor receives; 32 stays reachable from 21 "Terima Barang", marking the Gudang header) | 1 saved (no manual Status filter) | PASS |
| O2 Special-authority review | 02 G1 row → 90, or Khusus Owner ▸ Tinjauan ▸ Tinjauan Owner · drawer | the entry is "Tinjauan Owner" in the group "Tinjauan" (was one merged entry "Tinjauan & Aktivitas"); the unscoped 90 → 91 section link is gone: Riwayat Aktivitas and Log Keamanan are their own entries in the same group; 90 rows still open the record | 1 saved for Log Keamanan (was 91 + tab); 90 → 91 unchanged (link before, entry now) | PASS |
| O3 Selesaikan Paksa | 02 G4 row or 11 → 15; Proyek ▸ Daftar Proyek marked `true` · same rows | the 15 payment fix opens the project's Penagihan part (was the unfiltered Pembayaran list); with no open case there is no generic Kasus Koreksi link | none | PASS |
| O4 Doubtful receivable | 02 G3 row → 63, or Keuangan ▸ Piutang · bottom Keuangan → 60 → Piutang figure, or drawer Keuangan ▸ Piutang | the 63 subtitle "invoice" is text (Keuangan ▸ Invoice); 62 Riwayat continuation is "Riwayat proyek" → 91?proyek= (was unscoped) | menu path: no intermediate 60 load | PASS |
| O5 Consolidated reports | 02 G5 → 81, or Laporan ▸ Laporan Gabungan · drawer | the 80 subtitle "Lihat Laporan Gabungan" and the Ekspor item "Lihat Ekspor Saya" are gone; the export result card "Buka Ekspor Saya" (?sel=) stays; 82's footer "Laporan" is text (Laporan ▸ Laporan per Perusahaan) | menu path: no intermediate 80 load; export path unchanged | PASS |
| O6 Grant access | Pengaturan ▸ Pengguna & Akses · drawer | 95 has no tiles; "n akun tanpa verifikasi dua langkah" (→ 96?sel=) shows only when non-zero; 99 "Kelola akun lain" is gone | no intermediate 95 load | PASS |
| O7 Start numbering | 51 notice "Penomoran Dokumen" → 97?sel=<series>, 95 signal → 97?sel=, or Pengaturan ▸ Penomoran Dokumen | the 51 notice and the 95 signal select the blocking series (was the unselected list) | 1 saved (series preselected) | PASS |
| O8 Stock discrepancy attribution | Gudang ▸ Stok Opname (kept for the Owner, D-51) → 36 | Selisih & Temuan (SCR-27) is a canonical entry the lab does not build, so it has no entry (no dead link); the applied-selisih notice opens 34?jenis=PENYESUAIAN | — | UNCHANGED (documented gap) |
| A1 Antrean Tindakan | sign-in → 06; sidebar Beranda · bottom slot 1 | the group-head "Semua stok / proyek / kasus koreksi / piutang" links are absent (her navigation provides them: Gudang ▸ Stok, Proyek ▸ Daftar Proyek, Kasus Koreksi, Keuangan ▸ Piutang); rows unchanged | none | PASS |
| A2 New project → confirmation | Proyek ▸ Daftar Proyek (10) · bottom Proyek | the 10 / 13 sub-nav row is gone: Penawaran is Proyek ▸ Penawaran | none (no intermediate 10 load for 13) | PASS |
| A3 Shortage → purchase → receipt | 06 row → 03?proyek=…&isi=kebutuhan → 21 → 32?pembelian= · same rows | the 30 header "Barang Masuk" primary is gone for Sari because Gudang ▸ Barang Masuk is her own entry | row path unchanged; menu path to 32 without a 30 load | PASS |
| A4 Delivery with proof | 06 QS-06 row → 41, or bottom slot 4 Pengiriman → 40 → row → 41 | the 40 caption link "Barang Keluar" is gone (she has no stock.dispatch); 33's "Pengiriman" head link is gone, its done state keeps "Catat Pengiriman" for that Barang Keluar | none | PASS |
| A5 Invoice → billing → payment | 06 row → 11?tab=penagihan → 62 → 51 → 62 → 63 → 65; Keuangan ▸ Invoice / Piutang / Pembayaran | the 61 subtitle "piutang" and 63 subtitle "invoice" are text; 62's Riwayat continuation is scoped to the project and, as before, Owner-only (91) | none | PASS |
| A6 Administration documents | 06 G4 row → 52?proyek=, or Dokumen ▸ Dokumen Administrasi | opened from the menu, 52 lands on "Belum terpenuhi" (cross-project) instead of an arbitrary project; the 50 subtitle link is text | row path unchanged; the menu path lands on actionable rows | PASS |
| A7 Normal completion | 06 → 15; Proyek ▸ Daftar Proyek marked `true` | the 15 payment fix opens the project's Penagihan part; no unscoped Kasus Koreksi link | none | PASS |
| A8 Duplicate-payment warning | 63 / 62 → 65, or Keuangan ▸ Pembayaran → 64 → Catat Pembayaran | the 66 "Pembayaran klien" link is text (Keuangan ▸ Pembayaran) | none | PASS |

Outcome: no journey lost a path or gained a step; sibling screens are reached without an intermediate page; the
Owner's floor screens (32 / 33) stay reachable by context, the palette and the quiet pair on 30 while his menu shows
oversight entries only (D-51); every entry the Admin sees is one she can use.

## r13 Phase 7 — verified cross-module handoffs (canon: WF-QUO-01, WF-PRJ-02, J-QUO-01, J-PRJ-02, IP-07, IP-19, IP-21)
| Source · state | Prerequisite | Action (capability) | Result | Next context |
|---|---|---|---|---|
| Quotation DRAFT | lines complete, series started, business date ≤ today | Terbitkan Penawaran (quotation.manage) | SENT, number from the business date's period, PDF PENDING | "Menunggu jawaban klien" (outline Catat Jawaban Klien); project stays DRAFT |
| Quotation SENT (latest, valid) | client answered | Catat Jawaban Klien: Disetujui (projects.confirm) | APPROVED = the commercial confirmation: project ACTIVE, lines pinned (AX-13) | Buka Proyek → Pemenuhan (reservations / shortage purchase / service, separate commands) |
| Quotation SENT | client refused | Ditolak (quotation.manage) | REJECTED; project stays DRAFT | Buat Revisi (or cancel the project) |
| Quotation SENT past validity | — | — | presents EXPIRED | only Buat Revisi |
| Purchase saved (OPEN) | — | Simpan Pembelian (purchase.manage) | OPEN, stock unchanged | optional "Pratinjau PO"; "Catat Barang Masuk saat barang tiba" only with stock.receive |
| Purchase OPEN, goods arrive | stock.receive | Catat Barang Masuk | lots + stock; reservation for project needs in the SAME command | optional Nota Terima Barang; project detail |
| Reserved stock | stock.dispatch | Catat Barang Keluar | the only stock decrease; Surat Jalan draft | Catat Pengiriman (delivery.record) when the client receives |
| Invoice issued | billing.record | Tagihkan | receivable with due date (issued ≠ billed ≠ paid) | Catat Pembayaran only after billing |
| Project ACTIVE | completion gate all pass | Selesaikan Proyek (projects.complete) | COMPLETED | — |
A visit never completes a step; a missing capability hides the control (or names it "Perlu kewenangan …").
