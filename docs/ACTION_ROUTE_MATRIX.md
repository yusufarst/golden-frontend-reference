# MULTIPLECORP Golden Reference — Action / route matrix (r11)

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL**. R12 (hierarchical navigation): the "R12" section
at the end supersedes the rows below where they differ.

Where every important control lives after R11, for whom, what it does and how prominent it is. Priority levels (Golden, `docs/UX_PRINCIPLES.md` §4): **PRIMARY** (one per region) · **SECONDARY** (quiet, ≤ 2 desktop / 1 tablet / 0 phone) · **TERTIARY** (section or text link) · **OVERFLOW** ("Tindakan Lain" menu, destructive last) · **CONTEXTUAL** (row, row menu, detail panel, sheet) · **HIDDEN-BY-ROLE** (absent for an account without the capability). Risk = the MCRisk level the handler uses (LOW / COMMIT / DESTRUCTIVE / CRITICAL; navigation = NAV). Template rule: the project configuration decides capability; the Golden layer decides presentation (`MCActions`, `MCMenu`).

## `01-login.html` — Masuk

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| ID / EN language switch | Owner, Admin | Switch the interface language | In place (aria-pressed) | none | TERTIARY | Top right of the form column, right… | Top of the card |
| Show / hide password (in-field eye) | Owner, Admin | Reveal the typed password | In place (aria-pressed, label swaps Tampilkan/Sembunyikan) | none | CONTEXTUAL | Inside the password field | Inside the password field |
| Lupa kata sandi? | Owner, Admin | Learn how to reset a password | Inline help disclosure (no navigation) | none | TERTIARY | Under the password field | Under the password field |
| Masuk | Owner, Admin | Submit the credentials | Verification step (OTP) | LOW | PRIMARY | Full-width primary | Full-width primary |
| Lanjutkan dengan Google | Owner, Admin | Sign in with SSO (prototype) | Next sign-in step | none | SECONDARY | Outline, under Masuk | Outline, under Masuk |
| Kembali (verify step) | Owner, Admin | Return to the credentials | Credentials step | none | SECONDARY | Above the OTP form | Above the OTP form |
| Kirim ulang kode (verify step) | Owner, Admin | Resend the OTP | In place | none | TERTIARY | Disabled with a countdown until it is… | Same |
| Verifikasi (verify step) | Owner, Admin | Submit the OTP | Done step | LOW | PRIMARY | Full-width primary | Full-width primary |
| Buka Beranda (done step) | Owner, Admin | Open the role's Beranda | Owner: 02-owner-dashboard.html; Admin: 06-antrean-tindakan.html… | none | PRIMARY | Full-width primary | Full-width primary |
| Keluar dan masuk dengan akun lain (done step) | Owner, Admin | Switch account | Resets the form and returns to the credentials step | LOW | TERTIARY | Text link under the primary | Text link under the primary |

## `05-atur-kata-sandi.html` — Atur Kata Sandi

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tampilkan kata sandi (eye, x2 kept in step) | link holder (not… | check what was typed | data-sys-reveal toggles both fields | none | CONTEXTUAL | in field | in field |
| Simpan Kata Sandi | link holder | set the password from a one-time link | form submit -> done step | COMMIT… | PRIMARY | visible, full width | visible, full width |
| Masuk (done step) | link holder | sign in with the new password | 01-login.html | none | PRIMARY | visible | visible |
| Kembali ke halaman Masuk (expired step) | link holder | leave an expired link | 01-login.html | none | PRIMARY | visible (outline, the only action) | visible |

## `02-owner-dashboard.html` — Beranda

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Period (date range) 1-31 Okt 2026 | Owner | Change the period every figure follows | In place (MCDateRange popover / sheet) | none | SECONDARY | Top bar, right | Chip in the greeting |
| KPI tile chevron x4 (Nilai penjualan / Kas masuk / Piutang… | Owner | Drill into the figure | 61-invoice.html / 64-pembayaran.html / 63-piutang.html /… | none | CONTEXTUAL | Round icon link at the top right of… | Same |
| Tindakan row: Lihat piutang (3 piutang jatuh tempo dalam 7… | Owner | Review receivables due soon | 63-piutang.html?filter=7hari | none | PRIMARY | The whole row is the link; quiet verb… | The whole row is the link; chevron… |
| Tindakan row: Lihat pembelian (R12 review; was "Lihat barang masuk" → 32) | Owner | Review purchases waiting for goods | 20-pembelian.html?penerimaan=menunggu | none | SECONDARY | Row link | Row link |
| Tindakan row: Lihat pengiriman | Owner | Review a dispatch not yet recorded as delivered | 40-pengiriman.html | none | SECONDARY | Row link | Row link |
| Tindakan row: Lihat dokumen | Owner | Review incomplete admin documents | 52-dokumen-administrasi.html?proyek=prj-arj-0142 | none | SECONDARY | Row link | Row link |
| Tindakan row: Tinjau | Owner | Review special-authority activity | 90-tinjauan-owner.html | none | SECONDARY | Row link | Row link |
| Laporan piutang | Owner | Open the receivables report | 80-laporan.html?jenis=piutang | none | TERTIARY | Card head link | Inside the collapsed Umur piutang… |
| Satuan (Juta / Rupiah) select | Owner | Change the aging unit | In place | none | TERTIARY | On the value line | Inside the section |
| Aktivitas: Lihat semua + 4 activity row links | Owner | Open the activity log / the record | 91-riwayat-aktivitas.html; 64-pembayaran.html?sel=pay-arj-0019,… | none | CONTEXTUAL | Card head link + row links | Inside the collapsed section |
| Proyek berjalan: Lihat semua + 3 project row links | Owner | Open the project list / the project | 10-proyek.html; 11-proyek-detail.html?id=prj-arj-0142 / prj-btn-0087 /… | none | CONTEXTUAL | Card head link + rows (chevron) | Inside the collapsed section |
| Nilai proyek: project link 'Perangkat Lab Jaringan FT' | Owner | Open the project the donut describes | 11-proyek-detail.html?id=prj-arj-0142 | none | TERTIARY | Underlined under the title | Underlined in the disclosure header |
| Section disclosure toggles x4 (Umur piutang, Aktivitas,… | Owner | Expand a summary | In place | none | CONTEXTUAL | Not shown | Header toggle showing the figure |
| Not-found: Ke Beranda / Cari | Admin | Leave an Owner-only route | 06-antrean-tindakan.html / 07-cari.html | none | HIDDEN-BY-ROLE | The whole dashboard is replaced by the… | Same |

## `06-antrean-tindakan.html` — Beranda

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tampilkan: perusahaan (company view) | Admin (ARJ+BTN) | narrow the queue to one company | MCCompany view (re-renders through mc:company) | none | SECONDARY | inline select | Filter button -> sheet |
| Muat ulang antrean (icon) + 'Diperbarui HH.MM WIB' | Admin | recompute the queue | data-action atq-reload | none | TERTIARY | ghost icon at toolbar end | ghost icon at row end |
| Summary tiles x4 (Proyek & Gudang, Dokumen & Kasus,… | Admin | jump to a group | in-page focus to #atq-g1..g4 | none | CONTEXTUAL | metric strip | 2x2 compact tiles |
| Buka Gudang (or Buka Proyek without stock.view) | Admin | open the module behind the group | gudang.stok / proyek.list (canGo) | none | TERTIARY | section link | section link |
| Buka Kasus Koreksi | Admin | open the cases list | kasus.list (canGo) | none | TERTIARY | section link | section link |
| Buka Piutang | Admin with finance.view | open receivables | piutang (canGo); the group is absent without finance.view | none | TERTIARY | section link | section link |
| Buka Proyek (Penyelesaian Proyek) | Admin | open the projects list | proyek.list (canGo) | none | TERTIARY | section link | section link |
| Queue row (whole row + chevron) | Admin | do the next step | record or task route, canGo-gated (pembelian.form, gudang.reservasi +… | none… | CONTEXTUAL | row link | row link |
| Muat Ulang Bagian Ini | Admin | retry one failed group | data-action atq-retry | none | CONTEXTUAL | error state only | error state only |
| whole route | Owner | - | route home.admin is roles:['admin']; the Owner home is 02 | - | HIDDEN-BY-ROLE | - | - |

## `07-cari.html` — Cari

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Search field | Owner, Admin | find a record by number, code or name | live results (260 ms debounce) + ?q= in the URL | none | PRIMARY | full-width field | sticky field under the app bar |
| Cari (submit) | Owner, Admin | run the search | form submit | none | PRIMARY | visible | hidden (keyboard search key; results… |
| Kosongkan (x) | Owner, Admin | clear the query | data-cari-clear | none | TERTIARY | in field when filled | in field, 44px |
| Example chips x4 (ARJ/INV/2026/10/0031, Laptop, Fakultas… | Owner, Admin | try an example | data-action cari-example | none | CONTEXTUAL | intro state only | intro state only |
| Jenis data (Semua / per type with counts) | Owner, Admin | narrow to one result type | MCSeg, client-side | none | SECONDARY | segmented control | swipeable with an edge fade |
| Tampilkan: perusahaan | Owner (3 co), Admin… | company view | MCCompany view | none | SECONDARY | select at the toolbar end | 44px Filter icon -> sheet |
| Result row / table row | Owner, Admin | open the record | record detail (types gated by cost.view / finance.view) | none | CONTEXTUAL | table row link | row link + chevron |
| Muat Lagi (per group, >10 hits) | Owner, Admin | see more of a group | MCList pager | none | TERTIARY | when needed | when needed |
| Kosongkan pencarian (empty state) | Owner, Admin | start over | data-action cari-clear | none | CONTEXTUAL | empty state only | empty state only |

## `10-proyek.html` — Proyek

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buat Proyek | Admin | start project setup | 12-proyek-baru.html | none here… | PRIMARY | header button | full-width header button |
| Buat Proyek | Owner | start project setup (Admin work, so quieter) | 12-proyek-baru.html | none here | SECONDARY | outline header button | outline header button (kept visible as… |
| Sub-nav Proyek · Penawaran | Owner + Admin | switch to the sibling list | 10-proyek.html (current) / 13-penawaran.html | none | TERTIARY | quiet underline links under the header | same row |
| Search, Tampilkan (company view), Status, Filter (Klien) | Owner + Admin | narrow the list | in page | none | CONTEXTUAL | one toolbar row: search + Tampilkan +… | search + Filter sheet |
| Urutkan (Terbaru / Tenggat terdekat) | Owner + Admin | order the list | in page | none | CONTEXTUAL | list head, right | list head, right |
| Project row | Owner + Admin | open the project hub | 11-proyek-detail.html?id=… | none | CONTEXTUAL | row link (project name) | row + chevron |
| Hapus filter (filtered empty state) | Owner + Admin | reset filters | in page | none | CONTEXTUAL | empty state | empty state |
| Palette: Buat proyek baru | projects.manage | start project setup | 12-proyek-baru.html | none | TERTIARY | Ctrl K | search |

## `11-proyek-detail.html` — Detail Proyek

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buat Pembelian | Admin | buy the stock shortage (next step) | 03-create-purchase.html?proyek=prj-arj-0142 | none here… | PRIMARY | header button | full-width header button |
| Buat Pembelian | Owner | same, as oversight | 03-create-purchase.html?proyek=prj-arj-0142 | as above | SECONDARY | outline header button | outline full-width (only control) |
| Catat Pengiriman | Admin (Owner: SECONDARY) | next step when nothing is short but a dispatch is undelivered | 41-catat-pengiriman.html?id=… | COMMIT on… | PRIMARY | header (not shown for prj-arj-0142) | header |
| Selesaikan Proyek | projects.complete | complete once 10/10 are met | 15-penyelesaian-proyek.html?id=… | COMMIT on 15 | PRIMARY | header (only when ready) | header |
| Buat Penawaran (Draf project without a quotation) | Admin PRIMARY / Owner… | draft the first quotation | 13-penawaran.html?proyek=… | COMMIT on 13 | PRIMARY | header | hidden (desk task) |
| Perlu tindakan rows (top 3 + 'Lihat semua (5)') | Owner + Admin | go where the next step happens | task screens gated by canGo (gudang.masuk / pengiriman.catat /… | none | CONTEXTUAL | first block of Ringkasan | leads the page above the drill-in parts |
| Syarat penyelesaian › Lihat semua (or the 'Penyelesaian'… | Owner + Admin | review completion readiness | 15-penyelesaian-proyek.html?id=… | none | TERTIARY | Ringkasan, narrow column | Ringkasan (inline) |
| Semua riwayat | Owner + Admin | open the Riwayat part | tab riwayat | none | TERTIARY | Aktivitas terbaru head | same |
| Tabs: Ringkasan, Item, Penawaran, Pengadaan, Pemenuhan,… | Owner + Admin… | move between parts | ?tab=… | none | CONTEXTUAL | tab row | drill-in rows that open a sheet |
| Pengadaan › Buat Pembelian | purchase.manage +… | buy for the project | 03-create-purchase.html?proyek=… | COMMIT on… | SECONDARY | part caption, outline sm; hidden while… | same |
| Pemenuhan › Catat Barang Keluar | Owner (stock.dispatch) | floor work: dispatch | 33-barang-keluar.html?proyek=… | COMMIT on… | SECONDARY | section action, outline sm | same |
| Pemenuhan › Catat Barang Keluar | Admin (no… | — | — | — | HIDDEN-BY-ROLE | absent (also absent from the palette) | absent |
| Administrasi › Lengkapi | requirements.manage | complete the requirements | 52-dokumen-administrasi.html?proyek=… | none here | SECONDARY | part caption, outline sm | same |
| Riwayat › Riwayat Aktivitas | Owner (tinjauan.riwayat) | full audit trail | 91-riwayat-aktivitas.html?proyek=… | none | TERTIARY | part caption link | same |
| Record rows in parts | Owner + Admin | open the record | purchase / dispatch / delivery / document / invoice / payment / quotation detail | none | CONTEXTUAL | row links | rows + chevron |
| Palette: Buat pembelian, Catat Barang Keluar, Penyelesaian… | capability-gated as… | shortcuts | 03 / 33 / 15 | none | TERTIARY | Ctrl K | search |

## `12-proyek-baru.html` — Buat Proyek

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Simpan sebagai Draf | projects.manage | create the Draf project | session record → success card | COMMIT… | PRIMARY | sticky action bar | sticky action bar (replaces the bottom… |
| Batal | projects.manage | leave the form | 10-proyek.html | DESTRUCTIVE… | SECONDARY | action bar, outline | action bar, outline |
| Tambah Item / Hapus item / Ganti (klien) | projects.manage | edit the form | in page | none | CONTEXTUAL | in sections | in sections ('Tambah Item' full width) |
| Tambahkan di Data Master | projects.manage | add a missing client / product | 85-data-master.html | dirty guard… | TERTIARY | hint link (hidden while the no-result… | same |
| Success: Buat Penawaran | quotation.manage | next step: draft the quotation | 13-penawaran.html?proyek=<new> | COMMIT on 13 | PRIMARY | success card | not offered (desk task) |
| Success: Buka Proyek | projects.manage | open the new project | 11-proyek-detail.html?id=<new> | none | SECONDARY | outline (PRIMARY without… | PRIMARY |
| Success: Buat Proyek Lain | projects.manage | start another project | 12-proyek-baru.html | none | TERTIARY | text link | text link |

## `13-penawaran.html` — Penawaran

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buat Penawaran | Admin | draft a first quotation (pick an eligible Draf project in a sheet) | sheet → 'Buat Draf' per project → 14 draft | COMMIT (Buat… | PRIMARY | header button; hidden while ?proyek=… | hidden (desk task) |
| Buat Penawaran | Owner | same (Admin work, so quieter) | same | COMMIT | SECONDARY | outline header button; hidden while… | hidden |
| Sub-nav Proyek · Penawaran | Owner + Admin | switch to the sibling list | 10-proyek.html / 13 (current) | none | TERTIARY | under the header | under the header |
| Search, Tampilkan, Status (+ Filter on phones) | Owner + Admin | narrow the list | in page | none | CONTEXTUAL | one toolbar row | search + Filter sheet |
| Project chip ✕ | Owner + Admin | clear the project scope | in page (URL param removed) | none | CONTEXTUAL | toolbar end slot | own row under the toolbar |
| Quotation row | Owner + Admin | open the revision | 14-penawaran-detail.html?id=… | none | CONTEXTUAL | row link (project name) | row + chevron |
| Empty state (scoped, eligible): Buat Penawaran | Admin PRIMARY / Owner… | create this project's first draft | session draft → flash 'Buka Draf' → 14 | COMMIT | PRIMARY | empty state | text only: drafting happens on a… |
| Empty state (scoped, not eligible): Buka Proyek | Owner + Admin | go to the project | 11-proyek-detail.html?id=… | none | SECONDARY | empty state | empty state |
| Hapus filter | Owner + Admin | reset filters | in page | none | CONTEXTUAL | filtered empty state | same |
| Flash after create: Buka Draf | quotation.manage | open the new draft | 14-penawaran-detail.html?id=<draft> | none | SECONDARY | outline sm in the result notice | same |

## `14-penawaran-detail.html` — Detail Penawaran

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tindakan Lain ▸ Buat Revisi | quotation.manage… | revise an approved quotation (rare, consequential) | session draft → flash 'Buka Draf Revisi N' | COMMIT | OVERFLOW | 'Tindakan Lain ▾' (no primary in this… | absent (desk task); the phone header… |
| Project meta link | Owner + Admin | go to the project hub | 11-proyek-detail.html?id=prj-arj-0142&tab=penawaran | none | CONTEXTUAL | header meta | header meta |
| Lihat Dokumen / Tutup Pratinjau | Owner + Admin | view the issued document preview | in page | none | SECONDARY | Dokumen card, outline sm | same, 44 px |
| Buka di Dokumen | Owner + Admin | open the document record | 51-dokumen-detail.html?id=… | none | TERTIARY | Dokumen card, right-aligned link | same |
| Preview: Tutup, Unduh PDF (demo) | Owner + Admin | close / download | in page / demo toast | none | CONTEXTUAL | preview foot | preview foot |
| Rantai revisi rows | Owner + Admin | open another revision | 14-penawaran-detail.html?id=… | none | CONTEXTUAL | rail (≥1280) / stacked below | stacked |
| Palette: Buka proyek, Semua penawaran proyek ini, Buka… | Owner + Admin | shortcuts | 11 / 13?proyek= / 51 | none | TERTIARY | Ctrl K | search |
| Other states: DRAFT 'Pratinjau & Terbitkan' (PRIMARY,… | quotation.manage | state-dependent next step | in page / 14 | COMMIT / LOW | PRIMARY | header / preview foot | not offered (desk tasks) |

## `15-penyelesaian-proyek.html` — Penyelesaian Proyek

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Selesaikan Proyek | Owner + Admin… | complete the project | in page → completion record | COMMIT;… | PRIMARY | decision band, right | full-width in the decision band |
| Tindakan Lain ▸ Selesaikan Paksa | Owner only… | exceptional completion with unmet conditions | in page → forced record | CRITICAL… | OVERFLOW | 'Tindakan Lain ▾', danger item | ⋯ sheet on the title row |
| Selesaikan Paksa | Admin | — | — | — | HIDDEN-BY-ROLE | absent, with no explanatory card | absent |
| Gate fix per unmet row (Catat Barang Keluar, Catat… | Owner | oversight: see where each blocker is fixed | 33 / 41 / 71 case / 51 / 52 / 62 / 62 / 35 | none here | TERTIARY | quiet link with chevron, right of the… | link under the row text |
| Gate fix per unmet row (Admin labels: Lihat Item instead… | Admin | execution: fix the blocker | 11?tab=item / 41 / 71 / 51 / 52 / 62 / 62 / 35 | COMMIT on… | SECONDARY | outline sm button per row (one per row) | outline button under the row text, 44 px |
| Catatan terkait links | Owner + Admin | open a related record not reached by the fix | record detail pages | none | CONTEXTUAL | inside the row | inside the row |
| Project meta link / crumb | Owner + Admin | back to the hub | 11-proyek-detail.html?id=prj-arj-0142 | none | CONTEXTUAL | crumb + meta link | meta link |
| Palette: Buka proyek, Dokumen Administrasi proyek | Owner + Admin | shortcuts | 11 / 52 | none | TERTIARY | Ctrl K | search |

## `20-pembelian.html` — Pembelian

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buat Pembelian | Admin | Record a new purchase | 03-create-purchase.html (pembelian.form, purchase.manage via canGo) | none… | PRIMARY | filled button, header | full-width filled button under the title |
| Buat Pembelian | Owner | Record a new purchase (rare for the Owner) | 03-create-purchase.html | none | SECONDARY | outline button, header | full-width outline button |
| Lihat yang menunggu / Lihat semua (QS-05 notice toggle) | Owner, Admin | Narrow the list to purchases still awaiting goods, and back | in-page: sets the Penerimaan filter (Filter count 1, result line 'n dari 9… | none | CONTEXTUAL | text link at the right of the notice | 'Lihat' / 'Lihat semua' on the same… |
| Barang Masuk › | Admin | Receive the awaited goods (next step) | 32-barang-masuk.html (canGo gudang.masuk) | none | CONTEXTUAL | text link in the notice | text link on its own notice row |
| Barang Masuk › | Owner | Floor execution (not the Owner's task context) | 32-barang-masuk.html (reachable from Gudang) | none | HIDDEN-BY-ROLE | hidden | hidden |
| Search · Tampilkan (company view) · Status · Filter… | Owner, Admin | Find and narrow purchases | in-page MCFilter | none | TERTIARY | toolbar row + 'Filter (n)' panel;… | search + Filter sheet only |
| Purchase row (number link + chevron) | Owner, Admin | Open the purchase | 21-pembelian-detail.html?id=… | none | CONTEXTUAL | whole row | row with chevron |

## `21-pembelian-detail.html` — Detail Pembelian

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Terima Barang | Admin | Receive the remaining goods of this purchase | 32-barang-masuk.html?pembelian=<id> (canGo gudang.masuk, only while goods are… | none (opens… | PRIMARY | filled button | filled button + ⋯ only when there are… |
| Terima Barang | Owner | Receive goods (execution, quieter) | 32-barang-masuk.html?pembelian=<id> | none | SECONDARY | outline button beside 'Tindakan Lain ▾' | outline button + ⋯ (kept visible… |
| Pratinjau PO | Admin | Preview the PO before issuing (preview before final document) | document preview (documents.issue, only while the PO is due) | none… | PRIMARY | filled button when nothing awaits… | primary, or inside ⋯ when Terima… |
| Pratinjau PO | Owner | Preview the PO | document preview | none | OVERFLOW | first 'Tindakan Lain' item when Terima… | ⋯ sheet |
| Koreksi Harga, Pajak atau Biaya | Owner | Correct cost lines with a reason | data-demo (prototype explanation, no data change) | COMMIT in… | OVERFLOW | Tindakan Lain menu | ⋯ sheet |
| Retur ke Pemasok | Owner | Return received goods to the supplier | data-demo (opens a correction case in product) | COMMIT in… | OVERFLOW | Tindakan Lain menu (only when goods… | ⋯ sheet |
| Tutup Sisa Pembelian | Owner | Stop waiting for the rest of the goods | data-action=pb-close-rest → MCRisk CRITICAL (reason required); status becomes… | CRITICAL… | OVERFLOW | Tindakan Lain menu, after the… | ⋯ sheet, danger group |
| Batalkan Pembelian | Owner | Cancel a purchase with no goods received | data-action=pb-cancel → MCRisk CRITICAL; disabled with a reason once goods are… | CRITICAL… | OVERFLOW | last menu item, danger, disabled +… | ⋯ sheet, last |
| Tindakan Lain menu (all items) | Admin | Lacks close_remainder / correct_cost / purchase_return.record / cancel | — | none | HIDDEN-BY-ROLE | no overflow at all | no ⋯ unless Pratinjau PO is due |
| Perlu tindakan: open correction case | Owner, Admin | Follow up the open case for this purchase | case detail (70 module) | none | CONTEXTUAL | signal row with chevron under the… | same |
| Tabs Barang · Penerimaan · Pembayaran · Dokumen · Riwayat | Owner, Admin… | Read the parts of the purchase | in-page tabs (phone: drill rows 'Bagian pembelian') | none | TERTIARY | tab row | drill list rows |
| Pengeluaran & Kas Lain › | Owner (route-allowed) | Record or see supplier payments | pengeluaran route | none | TERTIARY | section link in the Pembayaran tab | same |
| Riwayat stok › (per receipt), document / project /… | Owner, Admin | Drill into related records | 34-riwayat-stok.html?ref=…, document detail, project, supplier | none | TERTIARY | links in the parts | same |

## `03-create-purchase.html` — Buat Pembelian

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Breadcrumb (ancestors only) | Owner, Admin | Return to where the purchase was started | No query: 20-pembelian.html; ?proyek: 10-proyek / 11-proyek-detail?id= /… | DESTRUCTIVE… | CONTEXTUAL | Above the title (asks first when input… | Hidden (no in-app back by default) |
| Gunakan data dari ▾ (Pembelian sebelumnya / Kebutuhan… | Owner, Admin | Prefill lines from the project | In place (replaces rows, toast with the source) | LOW | SECONDARY | Informasi Pembelian head, only with… | Informasi section, only with ?proyek |
| Perusahaan select (no project, account with 2+ companies)… | Owner, Admin | Choose the ordering company | In place (sets the number series and PO letterhead) | none | CONTEXTUAL | Field 4 | Field |
| Tambah dari katalog (search, Enter) + Tambah baris (Alt+N) | Owner, Admin | Add a line | In place | none | SECONDARY | Barang yang dibeli head | Section toolbar ('Tambah') |
| Hapus baris (trash) per row | Owner, Admin | Remove a line | In place | LOW | CONTEXTUAL | Last cell of each row | Top right of each item card |
| Lampiran: upload / remove file | Owner, Admin | Attach an invoice or offer | In place (upload state machine) | none | CONTEXTUAL | Lampiran card | Collapsed Lampiran section |
| Pratinjau PO | Owner, Admin | Preview the PO from the current input (nothing saved) | Read-only sheet (MCSheet) | LOW | TERTIARY | Ringkasan Pembelian head link | Inside the Ringkasan section when open |
| Batal | Owner, Admin | Leave without saving | Origin (20-pembelian / project Pengadaan / product) | DESTRUCTIVE… | SECONDARY | Ghost button in the footer (steps 1-2) | Ghost button in the action row (step 1) |
| Lanjut ke review | Owner, Admin | Validate and go to the review | Step 2 | none | PRIMARY | Footer right | Action row, remaining width |
| Kembali ubah (step 2) | Owner, Admin | Return to the input with every value kept | Step 1 | none | SECONDARY | Outline in the footer | Icon button |
| Simpan pembelian (step 2) | Owner, Admin | Record the purchase (state Terbuka) | Step 3 result (number, status, next steps) | COMMIT (the… | PRIMARY | Footer right | Action row |
| Pratinjau PO untuk pemasok (step 3) | Owner, Admin | Preview the real PO | 51-dokumen-detail.html?id=new-po&sumber=<id> | none | SECONDARY | Link in the result card | Link in the result card |
| Catat Barang Masuk saat barang tiba (step 3) | Owner, Admin… | Record receiving later | 32-barang-masuk.html?pembelian=<id> | none | TERTIARY | Link in the result card | Link in the result card |
| Buat pembelian lain (step 3) | Owner, Admin | Start another purchase | 03-create-purchase.html (keeps ?proyek) | none | SECONDARY | Outline in the footer | Half of the action row |
| Lihat detail pembelian (step 3) | Owner, Admin | Open the new purchase | 21-pembelian-detail.html?id=<id> | none | PRIMARY | Footer right | Half of the action row |
| Section disclosure toggles (Informasi, Barang, Lampiran,… | Owner, Admin | Expand a section | In place | none | CONTEXTUAL | Not shown | Header toggles |

## `30-stok.html` — Stok

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Barang Masuk | Admin | Record goods arriving from an open purchase (floor task) | 32-barang-masuk.html (canGo gudang.masuk) | none (task… | PRIMARY | filled header button | full-width filled button |
| Barang Masuk | Owner | Same task, quieter for oversight | 32-barang-masuk.html | none | OVERFLOW | 'Tindakan Lain' menu (title 'Catat di… | ⋯ on the title row |
| Barang Keluar | Owner | Dispatch stock to a project | 33-barang-keluar.html (canGo gudang.keluar) | none | OVERFLOW | 'Tindakan Lain' menu | ⋯ sheet |
| Barang Keluar | Admin (Sari, no… | Not permitted | — | none | HIDDEN-BY-ROLE | hidden (an Admin with stock.dispatch… | hidden |
| Tile 'Di bawah minimum' / 'Tidak layak pakai' | Owner, Admin | Filter the list to the exception | in-page toggle (aria-pressed; drives the Minimum / Kondisi selects; Filter… | none | CONTEXTUAL | pressable tiles in the strip | pressable tiles (scrolls to the list) |
| Tile 'Reservasi aktif ›' | Owner, Admin | Drill into reservations | 35-reservasi.html | none | TERTIARY | link tile with chevron | same |
| Tile 'Menunggu barang masuk ›' | Owner, Admin with… | See the purchases still awaiting goods | 20-pembelian.html?penerimaan=menunggu | none | TERTIARY | link tile (plain figure without… | same |
| Subnav Stok · Reservasi · Riwayat Stok · Stok Opname | Owner (all four);… | Move between the Gudang sibling screens | 30 / 35 / 34 / 36 | none | TERTIARY | one quiet underline row under the page… | same row, scrollable if needed |
| Search / scan (Enter opens the product) · Rak · Filter… | Owner, Admin | Find a product | in-page; Pindai is a data-demo on phones/touch | none | TERTIARY | search + Rak + Filter | [search][Filter][scan] |
| Product row | Owner, Admin | Open the product stock | 31-stok-produk.html?id=… | none | CONTEXTUAL | row link | row with chevron |

## `31-stok-produk.html` — Detail Stok Produk

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buat Pembelian | Owner, Admin with… | Restock a product below minimum (advice only) | 03-create-purchase.html?produk=<id> (canGo pembelian.form; only when below… | none | PRIMARY | filled header button (e.g. tas14) | filled button + ⋯ |
| Barang Keluar | Admin with… | Dispatch for the reserving project | 33-barang-keluar.html?proyek=<id> | none | PRIMARY | filled button when a visible project… | same |
| Barang Keluar | Owner | Same, quieter | 33-barang-keluar.html?proyek=<id> | none | OVERFLOW | Tindakan Lain | ⋯ sheet |
| Pindah Lokasi | Owner (stock.move) | Move a lot to another rack | data-demo | COMMIT in… | OVERFLOW | Tindakan Lain | ⋯ sheet |
| Ubah Kondisi | Owner (stock.condition) | Mark units damaged (to KARANTINA) | data-demo | COMMIT in… | OVERFLOW | Tindakan Lain | ⋯ sheet |
| Mulai Hitungan | Owner (canGo… | Count this product | 36-stok-opname.html?produk=<id> | none | OVERFLOW | Tindakan Lain | ⋯ sheet |
| Catat Penyesuaian Stok | Owner (stock.adjust) | Irreversible reduction (destroyed / lost) | data-demo (demoMeta explains the reason-required, irreversible flow) | DESTRUCTIVE… | OVERFLOW | last menu item after the separator,… | ⋯ sheet, danger group |
| Header controls (all) | Admin (Sari) | No stock.move / condition / count / adjust / dispatch; product not below minimum | — | none | HIDDEN-BY-ROLE | no header controls | none |
| Perlu tindakan: open correction case | Owner, Admin | Follow up the case about this product | case detail | none | CONTEXTUAL | signal row under the figures | same |
| Lihat Pembelian › | Owner, Admin with… | See the open purchase that restocks this product | 21-pembelian-detail.html?id=… | none | TERTIARY | quiet link in the below-minimum notice | same |
| Kelola reservasi › | Owner, Admin | Manage this product's reservations | 35-reservasi.html?produk=<id> | none | TERTIARY | section link | section link |
| Semua pergerakan › | Owner, Admin | Full movement history of the product | 34-riwayat-stok.html?produk=<id> | none | TERTIARY | section link | section link |
| Rack codes / movement references | Owner, Admin | Drill into the rack master or the receipt / dispatch | rack master, 34?ref=… | none | TERTIARY | inline links | inline links (14 px hit padding) |

## `32-barang-masuk.html` — Barang Masuk

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tampilkan: <perusahaan> (company view select) | Owner, Admin… | Limit the worklist to one company (session company view) | in-page filter (MCCompany, mc:company) | none | SECONDARY | inline in the worklist head | inside the 'Filter' sheet |
| Filter (phone) | Owner, Admin | Open the filter sheet that holds the company view | MCFilter sheet |  | SECONDARY | hidden | worklist head, left |
| Riwayat barang masuk (quiet link) | Owner, Admin | See past receipts | 34-riwayat-stok.html?jenis=BARANG_MASUK | none | TERTIARY | worklist head, right | worklist head, right (nowrap) |
| Purchase row (PB number + supplier · Untuk) + chevron | Owner, Admin… | Start recording goods for this purchase | in-page task mode (?pembelian=<id>) | none | CONTEXTUAL | table row | list row |

## `33-barang-keluar.html` — Barang Keluar

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tampilkan (company view) / Filter (phone) | Owner, Admin | Limit the queue to one company | in-page filter |  | SECONDARY | worklist head | Filter sheet |
| Pengiriman (quiet link) | Owner, Admin | Go to delivery records | 40-pengiriman.html |  | TERTIARY | worklist head, right | worklist head, right |
| Project row + chevron | Owner (stock.dispatch) | Start dispatching for this project | in-page task mode (?proyek=<id>) |  | CONTEXTUAL | table row | list row |
| Project row + chevron (read-only queue) | Admin (no… | See the project's fulfilment | 11-proyek-detail.html?id=<id>&tab=pemenuhan |  | CONTEXTUAL | table row | list row |

## `34-riwayat-stok.html` — Riwayat Stok

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Movement row (+ chevron) | Owner, Admin | See every fact of one movement and its correction path | MCSheet detail (row click / type title) | none | CONTEXTUAL | row + chevron column | row with chevron |
| Balikkan (in the detail sheet) | Owner (stock.reverse) | Reverse a wrong 'Pindah lokasi' (appends a reversal, never deletes) | data-action=gd-reverse → MCRisk CRITICAL with a mandatory reason | CRITICAL | CONTEXTUAL | outline button in the sheet; the row… | full-width button in the sheet |
| Balikkan | Admin (no stock.reverse) | Not permitted | — | none | HIDDEN-BY-ROLE | one muted line in the sheet, no… | same |
| Lihat pembalikan (in the sheet) | Owner, Admin | Open the reversal of an already reversed movement | movement detail of the reversal | none | CONTEXTUAL | outline button in the sheet | same |
| Produk / Referensi cell links | Owner, Admin | Drill into the product stock or the receipt / dispatch | 31-stok-produk.html, receipt / dispatch detail | none | TERTIARY | cell links | in the sheet |
| Subnav Stok · Reservasi · Riwayat Stok · Stok Opname | Owner; Admin without… | Gudang sibling screens | 30 / 35 / 34 / 36 | none | TERTIARY | underline row under the header | same |
| Search · Tampilkan (company view) · Jenis · address chips… | Owner, Admin | Narrow the history | in-page MCFilter; chips clear ?produk= / ?ref= | none | TERTIARY | toolbar | search + Filter sheet |

## `35-reservasi.html` — Reservasi

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Reservasi (queue row) | Owner, Admin with… | Reserve available stock for a project need (the one expected row step) | data-action=gd-reserve → sheet form → MCRisk COMMIT | COMMIT | CONTEXTUAL | outline sm button in the last column,… | button under the quantity; without… |
| Queue project / Barang links | Owner, Admin | Open the project or the product stock | 11-proyek-detail.html, 31-stok-produk.html | none | TERTIARY | cell links | — |
| Reservation row (project title, row, chevron) | Owner, Admin | Open the reservation detail | MCSheet detail | none | CONTEXTUAL | row + chevron column; the project… | row with chevron |
| Kurangi Reservasi (sheet) | Owner, Admin with… | Reduce an active reservation with a reason | data-action=gd-reduce → in-sheet form → MCRisk COMMIT | COMMIT | CONTEXTUAL | outline button in the sheet (only when… | full-width button in the sheet |
| Lepas Reservasi (sheet) | Owner, Admin with… | Release the whole reservation back to Tersedia | data-action=gd-release → MCRisk CRITICAL with reason | CRITICAL | CONTEXTUAL | quiet danger ghost button in the sheet | same, full width |
| Kurangi / Lepas for another company's project | Admin | Not visible (Proyek perusahaan lain) | — | none | HIDDEN-BY-ROLE | one muted line in the sheet | same |
| Segmented Aktif · Dilepas · Terpakai · Semua | Owner, Admin | Switch the status view | in-page | none | TERTIARY | segmented control in the card head | full-width segmented control |
| Search · Tampilkan (company view) · Proyek · address chip… | Owner, Admin | Narrow reservations | in-page MCFilter inside the list card | none | TERTIARY | in-card toolbar | search + Filter sheet |
| Subnav Stok · Reservasi · Riwayat Stok · Stok Opname | Owner; Admin without… | Gudang sibling screens | 30 / 35 / 34 / 36 | none | TERTIARY | underline row under the header | same |

## `36-stok-opname.html` — Stok Opname

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Status filter (select) / Filter (phone) | Owner, Admin | Filter sessions by state | in-page |  | SECONDARY | Sesi hitungan head | Filter in the list head |
| Mulai Hitungan (outline) | Owner (stock.count) | Start a count session (system basis snapshot) | start panel → MCRisk LOW | LOW | SECONDARY | Sesi hitungan head | list head, full width |
| Session row | Owner, Admin | Open a session's count | in-page (?sel=<id>) |  | CONTEXTUAL | table row | list row |
| Cetak Lembar Hitung (outline, demo) | Owner (stock.count) | Print the count sheet (no system quantities) | data-demo (PDF in the real product) | none | SECONDARY | count card head | count card head |
| Pindai + count steppers | Owner (stock.count),… | Record counted quantities | in-page (auto-saved) |  | SECONDARY | count card | count rows |
| Hitung Ulang (outline) | Owner (stock.count),… | Recount the rows with a cut-off | MCRisk DESTRUCTIVE | DESTRUCTIVE | CONTEXTUAL | recount notice | recount notice |
| Terapkan Selisih (primary, action bar; disabled + reason… | Owner… | Apply the count differences to stock | MCRisk CRITICAL | CRITICAL | PRIMARY | action bar | action bar + reason line |
| Mulai Hitungan, Cetak Lembar Hitung, Pindai, steppers,… | Admin (no stock.count… | n/a | one muted foot line ('Hanya lihat · penerapan selisih oleh pemegang kewenangan… |  | HIDDEN-BY-ROLE | hidden | hidden |

## `40-pengiriman.html` — Pengiriman

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Perlu tindakan row (open delivery difference) | Owner, Admin | Follow up an open difference | 70-kasus-koreksi.html?sel=<case> |  | CONTEXTUAL | signals block above the toolbar | signals block |
| Search | Owner, Admin | Find by BK number, project or recipient | in-page |  | SECONDARY | toolbar | toolbar |
| Tampilkan (company view) / Filter (phone) | Owner, Admin | Limit lists and signals to one company | in-page (mc:company) |  | SECONDARY | toolbar | Filter sheet |
| Tabs Belum terkirim / Serah terima jasa (phone 'Jasa') /… | Owner, Admin | Switch list | in-page (?tab=) |  | SECONDARY | tab row | tab row (fits 350 px) |
| Barang Keluar (quiet caption link) | Owner (stock.dispatch) | Go to dispatch | 33-barang-keluar.html |  | TERTIARY | Belum terkirim caption | Belum terkirim caption |
| Barang Keluar link | Admin (no… | n/a | hidden |  | HIDDEN-BY-ROLE | hidden | hidden |
| Row 'Catat' (outline sm) + row link | Owner, Admin… | Record this handover | 41-catat-pengiriman.html?id=<dispatch/item> |  | CONTEXTUAL | last column (one per row) | row tap only (no button) |
| Riwayat row | Owner, Admin | See a recorded delivery | detail beside the list (≥1101 px) / MCSheet; ?tab=riwayat&sel=<id> |  | CONTEXTUAL | split list | sheet |
| Buka Pengiriman (detail foot, outline) | Owner, Admin | Open the record view (its commands live there) | 41-catat-pengiriman.html?id=<delivery> |  | SECONDARY | detail foot | sheet foot |
| Project meta link (detail) | Owner, Admin | Open the project | 11-proyek-detail.html?id=<id> |  | CONTEXTUAL | detail meta | sheet meta |

## `41-catat-pengiriman.html` — Catat Pengiriman

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tanggal diterima / Jam / Nama penerima (fields) | Owner, Admin… | Handover facts | in-page |  | CONTEXTUAL | Penerimaan section | Penerimaan section |
| Diterima steppers (+/− capped at the shipped qty, disabled… | Owner, Admin | Received quantity per product | in-page |  | CONTEXTUAL | lines | line cards |
| Ada masalah? (per line text toggle) | Owner, Admin | Add a difference / condition note (forced when short) | in-page |  | TERTIARY | line | line |
| Pratinjau Surat Jalan (outline, in the draft notice) | Owner, Admin… | Preview/issue the delivery note used as proof | 51 document detail |  | CONTEXTUAL | Bukti kirim | Bukti kirim |
| Upload zone + Keterangan bukti + 'Siapkan draf BAST'… | Owner, Admin | Proof of delivery; prepare the BAST draft (never issued here) | in-page |  | SECONDARY | Bukti kirim | Bukti kirim |
| Batal (outline, action bar) | Owner, Admin | Leave without recording (dirtyGuard asks first) | 40-pengiriman.html | DESTRUCTIVE… | SECONDARY | action bar | action bar |
| Catat Pengiriman (primary, action bar) | Owner, Admin… | Record the handover (no stock change; a difference opens a Kasus Koreksi) | MCRisk COMMIT → result card | COMMIT | PRIMARY | action bar | action bar (bottom nav hidden) |
| Result: Ke daftar Pengiriman (outline) + Pratinjau Draf… | Owner, Admin | Next step after recording | 40?tab=riwayat&sel= · 51 BAST draft · 11?tab=pengiriman · 70?sel= |  | PRIMARY | action bar + result card | action bar + result card |
| Whole form | accounts without… | n/a | permission state with 'Ke daftar Pengiriman' |  | HIDDEN-BY-ROLE | state | state |

## `50-dokumen.html` — Dokumen

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Cari nomor dokumen, judul, atau proyek (search) | owner, admin | find a document / exact number lookup | filters the list in place | none | PRIMARY | toolbar, inline | toolbar, full width |
| Tampilkan: perusahaan (company view) | owner, admin | scope the list to one company | filters the list | none | SECONDARY | toolbar, inline | inside the Filter sheet |
| Jenis (select) | owner, admin | filter by document type | filters the list | none | SECONDARY | promoted inline select | Filter sheet |
| Filter (Status, PDF) | owner, admin | less used filters | popover (desktop) / sheet (phone) | none | TERTIARY | button at toolbar end | button beside the search |
| Dokumen Administrasi (subtitle link) | owner, admin | go to per-project document completeness | 52-dokumen-administrasi.html | none | CONTEXTUAL | quiet underlined link in the subtitle | same |
| PDF: n gagal dibuat · n sedang dibuat (result-line link) | owner, admin | show only documents whose PDF needs attention | sets the PDF filter to 'Perlu perhatian' | none | CONTEXTUAL | right end of the result line | second line of the result bar |
| Row / document number link | owner, admin | open the document | 51-dokumen-detail.html?id= | none | PRIMARY | row click + number link | whole row + chevron |
| Project link (Proyek column) | owner, admin | open the project | 11-proyek-detail.html?id= | none | CONTEXTUAL | regular-weight link in the Proyek column | not shown (project name in meta, no… |
| Buat ulang (inline, failed PDF rows) | owner, admin | re-request the PDF rendition (never re-issues or renumbers) | data-action=dok-retry (toast, then ready) | LOW | CONTEXTUAL | inline beside the 'Gagal dibuat' pill | not on rows (on 51 detail instead) |
| Muat Lagi | owner, admin | load the next 25 roots | appends rows | none | TERTIARY | list foot | list foot |

## `51-dokumen-detail.html` — Detail Dokumen

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Terbitkan (draft) | owner, admin… | issue the draft: number given, content locked, PDF in background | data-action=dok-issue, MCRisk confirm | COMMIT | PRIMARY | header primary (disabled + reason only… | hidden (issue from desktop/tablet… |
| Cetak Draf (draft, prep draft) | owner, admin | print the unnumbered draft with PRATINJAU | data-demo | none | SECONDARY | quiet outline secondary | full-width (only action on a draft) |
| Unggah Asli dari Klien (prep draft) | owner, admin | upload the client-signed original | data-demo | LOW | PRIMARY | header primary | primary + ⋯ |
| Unduh PDF (issued, ready) | owner, admin | download the issued PDF | data-demo | none | PRIMARY | header primary | primary + ⋯ |
| Unduh PDF (issued, pending) | owner, admin | download once ready | disabled with reason 'PDF sedang dibuat…' | none | PRIMARY | disabled primary + title reason | same |
| Coba Buat Ulang PDF (issued, failed) | owner, admin | re-request rendition (no re-issue, same number) | data-action=dok-rerender | LOW | PRIMARY | header primary | primary + ⋯ |
| Tautkan Kuitansi (pre-payment Kuitansi) | owner, admin… | link the Kuitansi to a real payment | data-demo; disabled + reason while no payment exists | COMMIT | SECONDARY | quiet secondary | in ⋯ sheet |
| Revisi (Tindakan Lain) | owner… | create a new draft version | data-action=dok-revise, confirm anchored on the menu trigger | COMMIT | OVERFLOW | Tindakan Lain ▾ | ⋯ sheet |
| Batalkan Dokumen (Tindakan Lain, danger, last) | owner… | void this version forever, number retained | data-action=dok-void, MCRisk typed BATALKAN + reason | CRITICAL | OVERFLOW | after separator in Tindakan Lain | ⋯ sheet, last |
| Buat Revisi di Penawaran (quotation document) | owner, admin | revise via the quotation (a quotation document is never voided) | quotation route | none | OVERFLOW | Tindakan Lain | ⋯ |
| Unduh PDF (revised / voided) | owner, admin | archive copy | data-demo | none | SECONDARY | lone secondary (kept) | kept visible |
| Unduh File Asli (uploaded original) | owner, admin | download the uploaded file | data-demo | none | PRIMARY | header primary | primary |
| Buka Versi Berlaku (revised notice) | owner, admin | open the current version | 51-dokumen-detail.html?id=<current> | none | CONTEXTUAL | notice action | notice action under the text |
| Penomoran Dokumen (numbering blocker notice) | owner (route allowed) | start numbering for the company/type | pengaturan.penomoran | none | CONTEXTUAL | notice action | notice action |
| Rincian links: Proyek, Sumber, Dokumen Administrasi | owner, admin | navigate to the project / source record / requirement | 11 / source route / 52?proyek&sel | none | CONTEXTUAL | inline links in the facts card | same (stacked) |
| Versi rows (chain of 2+) | owner, admin | open another version | 51?id=<version> | none | CONTEXTUAL | Versi card | same |
| Breadcrumb 'Dokumen' | owner, admin | back to the list | 50-dokumen.html | none | TERTIARY | crumb | hidden (no in-app back) |

## `52-dokumen-administrasi.html` — Dokumen Administrasi

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tabs: Checklist proyek / Belum terpenuhi (n) | owner, admin | switch between one project's checklist and all unmet items | MCTabs (?tab=lintas) | none | PRIMARY | tab row | tab row |
| Proyek: (picker) | owner, admin | choose the project | re-renders the checklist (?proyek=) | none | SECONDARY | toolbar select | full-width select |
| Buka proyek (section link) | owner, admin | open the project's Administrasi part | 11-proyek-detail.html?id=&tab=administrasi | none | CONTEXTUAL | card head link | under the card title |
| Requirement row | owner, admin | select the requirement | panel beside (≥1101) / sheet (narrower) (?sel=) | none | PRIMARY | row button | row button + chevron, opens a sheet |
| Sudah beres (n) disclosure | owner, admin | reveal settled requirements | details/summary | none | TERTIARY | open by default | folded unless the selection is inside |
| Pratinjau & Terbitkan (panel, draft prepared) | admin (green), owner… | open the draft to preview and issue | 51-dokumen-detail.html?id=<draft> | none (issue… | PRIMARY | panel primary | sheet, full width |
| Siapkan Draf (panel) | admin (green), owner… | prepare an unnumbered draft from the source record | data-action=dok-req-draft | LOW | PRIMARY | panel primary | sheet |
| Unggah Bukti (panel) | admin (green), owner… | upload evidence | data-action=dok-req-upload → inline form (Batal / Unggah) | LOW | PRIMARY | panel primary | sheet |
| Tautkan Dokumen (panel) | admin (green), owner… | link the chosen candidate / uploaded evidence | data-action=dok-req-link, MCRisk confirm | COMMIT | PRIMARY | panel primary (or quiet secondary… | sheet |
| Buka Dokumen / Ganti File (panel) | owner, admin (Ganti… | open the satisfying document / replace an unlinked upload | 51 / upload form | none / LOW | SECONDARY | outline beside the primary | sheet |
| Source link (Catat Pengiriman / Barang Keluar / Lihat… | capability-aware… | go where the source record is made | dispatch/delivery route, gudang.keluar, or the project part | none | SECONDARY | outline after the reason line | sheet |
| Tandai Tidak Berlaku (panel kebab, danger) | requirements.waive… | waive the requirement with a reason | data-action=dok-req-waive, MCRisk critical + reason | CRITICAL | OVERFLOW | panel kebab 'Tindakan lain untuk… | kebab in the sheet panel |
| Cross tab: search, Status, Filter (Sifat) | owner, admin | narrow the unmet list | filters in place | none | SECONDARY | toolbar | search + Filter sheet |
| Cross tab row | owner, admin | open the requirement in its project checklist | 52-dokumen-administrasi.html?proyek=&sel= | none | PRIMARY | row + requirement link; project link… | row + chevron, state word in meta |

## `60-keuangan.html` — Keuangan

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Catat Pembayaran (header) | admin: green primary;… | record a client payment | 64 pembayaran.catat form | none (form… | PRIMARY | header right | full-width header button |
| Tampilkan: perusahaan (company view) | owner (multi-company),… | change the company view | re-renders figures / signals / ageing / recent | none | SECONDARY | toolbar select (period line at the… | 'Perusahaan' sheet button |
| Five figure tiles (Nilai penjualan, Piutang aktif, Kas… | owner, admin | drill into each finance concept | 61 / 63 / 64 / 80?jenis=laba-proyek / 66 | none | CONTEXTUAL | tile link with chevron | compact row link |
| Per perusahaan (toggle) | owner (Gabungan view) | show the per-company split of all five figures | expands the split in place | none | TERTIARY | not shown (split always visible) | section head toggle |
| Perlu tindakan rows (signals) | owner, admin (Admin:… | act on overdue / due in 7 days / disputes / unbilled / credits / pre-payment… | 63?filter=lewat/7hari, 63?tab=sengketa/belum, 62, 64/65, 51/50 | none | CONTEXTUAL | row links, fitted count + 'Lihat semua… | top 3 + 'Lihat semua (n)' |
| Laporan piutang (section link) | owner, admin | open the receivables report | 80-laporan.html?jenis=piutang | none | CONTEXTUAL | ageing card head | same |
| Ageing bucket rows | owner (rows), admin… | open receivables in that bucket | 63-piutang.html?umur=<bucket> | none | CONTEXTUAL | row links | row links (44 px) |
| Semua pembayaran / payment rows | owner, admin | open payments | 64 / 65?id= | none | CONTEXTUAL | section link + rows | section link + rows (number title) |
| Semua pengeluaran / expense rows | owner, admin | open expenses | 66 / expense detail | none | CONTEXTUAL | section link + rows | section link + rows |

## `61-invoice.html` — Invoice

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buat Invoice (header) | admin: green primary;… | start an invoice from a project | data-action=keu-new-invoice → sheet listing active projects → 11?tab=penagihan | none | PRIMARY | header right | full-width header button |
| piutang (subtitle link) | owner, admin | go to receivables | 63-piutang.html | none | CONTEXTUAL | subtitle | subtitle |
| Search / Tampilkan / Status / Filter (Klien) | owner, admin | find invoices, exact number first | filters in place | none | SECONDARY | toolbar (search, company, Status… | search + Filter sheet |
| Row / invoice number | owner, admin | open the invoice | 62-invoice-detail.html?id= | none | PRIMARY | row + number link | row + chevron |
| Project sub-link | owner, admin | open the project | 11-proyek-detail.html?id= | none | CONTEXTUAL | muted link, underline on hover | not shown |
| Muat Lagi / Hapus filter | owner, admin | more rows / clear filters | in place | none | TERTIARY | list foot / empty state | same |

## `62-invoice-detail.html` — Detail Invoice

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Pratinjau & Terbitkan (draft invoice) | admin green / owner… | preview and issue the invoice document | 51-dokumen-detail.html?id=<draft doc> | none here… | PRIMARY | header primary slot | primary (full width) |
| Tagihkan (Belum Ditagihkan) | admin green / owner… | billing act: billing date + manually agreed due date | data-action=keu-bill → bill form sheet → MCRisk commit | COMMIT | PRIMARY | header primary slot | primary |
| Catat Pembayaran (active receivable) | admin green / owner… | record a payment for this invoice | 64 pembayaran.catat?invoice=<id> | none (form… | PRIMARY | header primary slot | primary + ⋯ (Owner) / primary only… |
| Lihat Dokumen (Tindakan Lain) | owner on active… | open the invoice document | 51-dokumen-detail.html?id= | none | OVERFLOW | first item of Tindakan Lain | ⋯ sheet |
| Tandai Sengketa (Tindakan Lain) | receivables.dispute… | put a dispute hold (receivable stays active and ageing) | data-action=keu-dispute → reason sheet → MCRisk commit | COMMIT | OVERFLOW | Tindakan Lain | ⋯ sheet |
| Hapuskan Piutang (Tindakan Lain, danger, last) | owner only… | write off an uncollectable remainder (no Cash-In, no profit) | data-action=keu-writeoff → amount sheet → MCRisk critical, typed HAPUSKAN +… | CRITICAL | OVERFLOW | after separator | ⋯ sheet, last |
| Cabut Sengketa (dispute notice) | receivables.dispute | clear the dispute hold | data-action=keu-undispute → reason sheet → MCRisk commit | COMMIT | CONTEXTUAL | notice action | notice action under the text |
| Buka Dokumen (PDF-failed notice) | owner, admin | re-make the PDF where the document lives | 51-dokumen-detail.html?id= | none | CONTEXTUAL | notice action | notice action |
| Project number (meta link) | owner, admin | open the project | 11-proyek-detail.html?id= | none | CONTEXTUAL | head meta | head meta |
| Tabs: Rincian / Pembayaran / Dokumen / Riwayat | owner, admin | the parts of the invoice (empty parts omitted) | MCTabs; phone drill rows | none | SECONDARY | tab row | 'Bagian invoice' drill list |
| Terapkan ke Invoice (credit notice, Pembayaran tab) | owner, admin | apply an unapplied customer credit | 65 payment detail | none | CONTEXTUAL | notice action | notice action |
| Payment rows / document rows | owner, admin | open payment / document | 65?id= / 51?id= | none | CONTEXTUAL | rows | rows |
| Riwayat Aktivitas (Riwayat tab foot) | owner (route allowed) | full audit trail | tinjauan.riwayat | none | TERTIARY | foot link | foot link |
| Breadcrumbs Keuangan / Invoice | owner, admin | ancestors | 60 / 61 | none | TERTIARY | crumbs | hidden |

## `63-piutang.html` — Piutang

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Catat Pembayaran (header) | admin: green on… | record a client payment | 64 pembayaran.catat | none | PRIMARY | header right | full-width header button |
| invoice (subtitle link) | owner, admin | go to the invoice list | 61-invoice.html | none | CONTEXTUAL | subtitle | subtitle |
| Tabs: Aktif / Belum Ditagihkan / Sengketa | owner (counts), admin… | choose the receivable view | MCTabs (?tab=) | none | PRIMARY | tab row above the toolbar | tab row |
| Search / Tampilkan / Klien / Filter (Jatuh tempo, Umur… | owner, admin | narrow the list; due/ageing disabled with a note on Belum | filters in place (?filter=, ?umur=) | none | SECONDARY | toolbar under the tabs | search + Filter sheet |
| Row | owner, admin | select the invoice | detail panel (≥1101) / sheet (narrower) (?sel=) | none | PRIMARY | row select; number link → 62 | row opens the detail sheet |
| Invoice number (detail h2 link) | owner, admin | open the invoice | 62-invoice-detail.html?id= | none | CONTEXTUAL | panel title | sheet title |
| Project link (detail) | owner, admin | open the project | 11-proyek-detail.html?id= | none | CONTEXTUAL | panel kv | sheet kv |
| Catat pembayaran invoice ini (detail, active) | owner, admin… | record a payment scoped to this invoice | 64 pembayaran.catat?invoice=<id> | none | SECONDARY | outline, full width in panel | outline in sheet |
| Tagihkan inline form (detail, Belum Ditagihkan) | admin (billing.record) | billing act in place | bill form submit → MCRisk commit; invoice moves to Aktif with a success notice | COMMIT | PRIMARY | panel form, green submit | sheet form |
| Tagihkan (detail, Belum Ditagihkan) | owner (billing.record) | open the bill form | data-action=keu-bill-sheet → sheet 'Tagihkan invoice' → MCRisk commit | COMMIT | SECONDARY | outline, full width in panel | outline in the detail sheet (replaced… |
| Hapus filter (empty state) | owner, admin | clear filters | in place | none | TERTIARY | empty state | empty state |

## `64-pembayaran.html` — Pembayaran

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Catat Pembayaran (header) | Admin | record a received payment | 65-catat-pembayaran.html | none (opens… | PRIMARY | header, filled | header, full-width filled |
| Catat Pembayaran (header) | Owner | record a payment (oversight; quieter) | 65-catat-pembayaran.html | none | SECONDARY | header, outline | header, full-width outline |
| Catat Pembayaran | account without… | - | - | - | HIDDEN-BY-ROLE | absent | absent |
| Search + Tampilkan (company) + Klien | both | narrow the list | in-page filter | none | TERTIARY | toolbar inline | search inline; selects in the Filter… |
| Filter (Penerapan, Metode) | both | less used filters | popover / phone sheet | none | TERTIARY | toolbar button | toolbar button (sheet holds every… |
| Tampilkan n pembayaran (credit drill link, aria-pressed) | both | show only payments with Kredit Pelanggan | in-page filter toggle | none | CONTEXTUAL | text link in the Kredit Pelanggan… | same, 44 px hit area |
| Payment row | both | open the payment | detail panel (?sel=) / phone sheet | none | PRIMARY | row click selects the detail | row + chevron opens the sheet |
| Record kebab 'Tindakan untuk <nomor>' > Pindahkan penerapan | Admin + Owner… | move an application (special authority) | demo (product: reason form) | COMMIT… | OVERFLOW | detail header kebab | sheet header kebab |
| Record kebab > Batalkan catatan (kontra) | Owner (finance.contra) | reverse the record | demo (product: contra form) | DESTRUCTIVE… | OVERFLOW | kebab | kebab |
| Terapkan ke Invoice | payment.apply holders | apply Kredit Pelanggan to open invoices | inline apply form | none (opener) | CONTEXTUAL | outline sm under the credit note (only… | full-width outline |
| Apply form: Isi / Batal / Terapkan | payment.apply holders | fill max, cancel, commit the application | in-page | Terapkan =… | CONTEXTUAL | inline in the detail | inline in the sheet |
| Invoice / project links in Penerapan, 'Buat Kuitansi' link | both | drill to the related record | invoice / project / kuitansi | none | CONTEXTUAL | text links | text links |
| Hapus filter (empty result) | both | reset filters | in-page | none | CONTEXTUAL | empty state | empty state |
| Kembali ke daftar | both | close the detail sheet | list | none | CONTEXTUAL | - | sheet head |

## `65-catat-pembayaran.html` — Catat Pembayaran

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Catat Pembayaran (action bar) | payment.record holders… | record the payment and its applications | in-page commit → result card | COMMIT | PRIMARY | sticky action bar, right | sticky action bar (bottom nav hidden) |
| Batal | both | leave the form | 64-pembayaran.html (dirtyGuard asks 'Tinggalkan halaman ini?' when typed) | LOW (discard… | SECONDARY | action bar, outline | action bar, outline |
| Bagi otomatis | both | distribute the amount over open invoices (oldest due first) | in-page | none | CONTEXTUAL | Penerapan section head, outline sm… | same |
| Form fields, upload, duplicate-check checkbox | both | enter payment data | in-page | none | CONTEXTUAL | form | form |
| Invoice link (context card, ?invoice=), project links in… | both | check the source record | invoice / project (guarded when dirty) | none | CONTEXTUAL | text links | text links |
| After save: Lihat pembayaran | both | open the new payment | 64-pembayaran.html?sel=<new> | none | PRIMARY | action bar, filled | action bar, filled |
| After save: Catat pembayaran lain | both | record another payment | fresh 65-catat-pembayaran.html | none | SECONDARY | action bar, outline | action bar, outline |

## `66-pengeluaran.html` — Pengeluaran & Kas Lain

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Catat Pengeluaran Kas / Catat Beban / Catat Kas Masuk Lain… | Admin holding the… | record the selected kind | create sheet | COMMIT on save | PRIMARY | header, filled | header, full width |
| same (tab-aware header) | Owner | record (oversight; quieter) | create sheet | COMMIT on save | SECONDARY | header, outline | header, full-width outline |
| same | Admin Operasional… | - | - | - | HIDDEN-BY-ROLE | absent (also absent in palette and… | absent |
| Tabs Pengeluaran Kas / Beban (cost.view) / Kas Masuk Lain | both | switch the cash concept | ?tab= | none | PRIMARY | tab row | tab row |
| Search + Tampilkan + Proyek | both | narrow the tab's list | in-page | none | TERTIARY | toolbar under the tabs | search + Filter sheet |
| Pembayaran klien (caption link, Kas Masuk Lain tab) | both | go to client payments (the other cash-in concept) | 64-pembayaran.html | none | CONTEXTUAL | caption row link | caption row link |
| Record row | both | open the record | record sheet | none | PRIMARY | row + chevron | row + chevron |
| Record sheet kebab > Batalkan catatan (kontra) | Owner (finance.contra) | reverse the record | demo (product: contra form) | DESTRUCTIVE… | OVERFLOW | sheet header kebab | sheet header kebab |
| Create sheet: × Tutup / Batal / Catat <jenis> | capability holders | close / cancel / save | in-page | save = COMMIT | CONTEXTUAL | side sheet | full sheet |
| Hapus filter (empty result) | both | reset | in-page | none | CONTEXTUAL | empty state | empty state |

## `70-kasus-koreksi.html` — Kasus Koreksi

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Search | Owner, Admin | Find a case | in-page |  | SECONDARY | toolbar | toolbar |
| Tampilkan (company view) | Owner, Admin | Limit to one company | in-page |  | SECONDARY | toolbar | Filter sheet |
| Filter (Jenis) | Owner, Admin | Filter by case kind | popover / sheet |  | SECONDARY | toolbar | toolbar (sheet holds Jenis + company) |
| Segment Terbuka (n) / Ditutup (n) / Semua (n) | Owner, Admin | Switch status view (default Terbuka) | in-page (?status=) |  | SECONDARY | list head | list head, full width |
| Case row | Owner, Admin | Open the case | detail beside the list / MCSheet (?sel=) |  | CONTEXTUAL | split list | sheet |
| Buka Pengiriman / Buka Pembelian (primary sm, open… | Owner, Admin | Correct from the source record | 41?id=<delivery> · 21-pembelian-detail?id=<purchase> |  | PRIMARY | case panel | sheet |
| Kirim Pengganti (outline, delivery difference) | Owner (stock.dispatch) | Dispatch replacement goods | 33-barang-keluar.html?proyek=<id> |  | SECONDARY | case panel | sheet |
| Lihat stok (outline, supplier return) | Owner, Admin | See the affected product's stock | 31 product stock ?id=<product> |  | SECONDARY | case panel | sheet |
| Project meta link / Catatan terkait links (other… | Owner, Admin | Open related records | 11-proyek-detail · 34 receipt · 51 document · invoice · purchase |  | CONTEXTUAL | case panel | sheet |
| Tutup Kasus (primary, zero residual only) | Owner, Admin with… | Close the case with a recorded decision | MCRisk COMMIT with the reason in the dialog | COMMIT… | PRIMARY | case panel | sheet, full width |
| Kirim Pengganti | Admin (no… | n/a | hidden |  | HIDDEN-BY-ROLE | hidden | hidden |
| Tutup Kasus | accounts without… | n/a | one muted line 'Penutupan oleh pemegang kewenangan khusus Tutup Kasus.' |  | HIDDEN-BY-ROLE | hidden | hidden |

## `80-laporan.html` — Laporan

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Report tabs (Stok, Pembelian, Penjualan, Piutang,… | both (Laba proyek… | pick a report | ?jenis= | none | PRIMARY | tab row (overflow → 'Bagian Lain') | scrolling tab row |
| Ekspor ▾ (MCMenu): Excel (.xlsx), PDF, separator, Lihat… | reports.export holders… | request an export / open the export list | in-place result notice / 82-ekspor-saya.html | LOW… | PRIMARY | bar end, filled, popover | row 2 right, outline, bottom action… |
| Cetak | both | print the report | window.print (print stylesheet) | none | SECONDARY | bar end, outline (icon-only 768–1024) | hidden (desktop action) |
| Periode (date range) / static 'Posisi per …' on Piutang | both | set the report period | shared period | none | TERTIARY | bar | row 1, full width |
| Tampilkan (company view) | multi-company accounts | limit the companies shown | in-page | none | TERTIARY | bar, inline | in the Filter sheet (row 2 'Filter'),… |
| Lihat Laporan Gabungan (meta link) | accounts that can open… | go to the consolidated report | 81-laporan-gabungan.html | none | CONTEXTUAL | subtitle meta link | meta link under the subtitle |
| Lihat Laporan Gabungan | Admin | - | - | - | HIDDEN-BY-ROLE | absent (subtitle reads 'Laporan per… | absent |
| Buka Ekspor Saya (in-place result after a request) | reports.export holders | follow the request | 82-ekspor-saya.html | none | CONTEXTUAL | result notice | result notice |
| Report rows / record links (product, purchase, invoice,… | both | drill to the record | record detail | none | CONTEXTUAL | row link | row + chevron |

## `81-laporan-gabungan.html` — Laporan Gabungan

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Ekspor ▾ (MCMenu): Excel, PDF, Lihat Ekspor Saya | Owner | export the consolidated report / open exports | in-place result / 82 | LOW | PRIMARY | bar end, filled | bar row with the period, outline,… |
| Cetak | Owner | print | window.print | none | SECONDARY | bar end, outline | hidden |
| Periode | Owner | set the period | shared period | none | TERTIARY | bar | bar, beside Ekspor |
| Company links in the per-company table / allocation rows | Owner | drill to the company report or the dispatch | 80?company / BK record | none | CONTEXTUAL | table links | card/row links |
| Route | Admin | - | canonical 404 (Owner-only route) | - | HIDDEN-BY-ROLE | 404 | 404 |

## `82-ekspor-saya.html` — Ekspor Saya

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Unduh (row, SIAP_DIUNDUH) | requester (Owner /… | download the file | demo download | none | CONTEXTUAL | Tindakan column, outline sm | row bottom right |
| Minta Lagi (row, GAGAL / TIDAK_TERSEDIA) | requester | request the export again | in-page (new request) | LOW | CONTEXTUAL | Tindakan column | row bottom right |
| Laporan (footer sentence link) | both | request a new export | 80-laporan.html | none | TERTIARY | footer text link | footer text link |
| Buka Laporan (empty state) | both | first export | 80-laporan.html | none | CONTEXTUAL | empty state only | empty state only |

## `85-data-master.html` — Data Master

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tambah Klien / Pemasok / Produk / Jasa / Lokasi Rak… | Owner (kind capability) | add a master record | create sheet | COMMIT on save | PRIMARY | header, filled | header, full width |
| Tambah <jenis> | Admin Operasional… | - | - | - | HIDDEN-BY-ROLE | absent; one helpful line appears only… | absent |
| Tabs Klien / Pemasok / Produk & Jasa / Lokasi Rak… | both | pick the master kind | ?jenis= | none | PRIMARY | tab row | tab row |
| Search + Jenis/Kategori/Zona + Status | both | narrow the list | in-page | none | TERTIARY | toolbar inline | search + Filter sheet |
| Record row | both | open the master record | 86-data-master-detail.html?jenis=&id= | none | PRIMARY | row link | row + chevron |
| Atur ulang (no-match state) | both | reset filters | in-page | none | CONTEXTUAL | empty state | empty state |

## `86-data-master-detail.html` — Detail Data Master

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buat Proyek (klien) / Buat Pembelian (pemasok) | Admin (canGo… | start the next transaction for this party | proyek form ?klien= / pembelian form ?pemasok= | none (opens… | PRIMARY | header, filled | header primary + ⋯ |
| Ubah | Owner (parties.manage… | edit the record | edit sheet | COMMIT on save | SECONDARY | header, outline | header, full-width outline |
| Tindakan Lain > Buat Proyek / Buat Pembelian | Owner | execution verb (quieter for the Owner) | task form | none | OVERFLOW | header menu | ⋯ sheet |
| Tindakan Lain > Cetak Label | Owner (products.edit,… | print the barcode label | demo | none | OVERFLOW | header menu | ⋯ sheet |
| Tindakan Lain > Arsipkan <jenis> | Owner (kind… | archive the record | risk dialog | DESTRUCTIVE… | OVERFLOW | header menu | ⋯ sheet |
| Ubah / Arsipkan / Tindakan Lain | Admin without… | - | - | - | HIDDEN-BY-ROLE | absent | absent |
| Aktifkan Lagi (archived notice) | kind capability holders | restore an archived record | in-page | COMMIT | CONTEXTUAL | notice | notice |
| Tabs Unit & PIC / Proyek (klien); Riwayat harga /… | both | switch section | ?tab= | none | PRIMARY | tab row | first part inline + 'Bagian <jenis>'… |
| Tambah Unit (Unit & PIC caption) | parties.manage holders | add a client unit | unit sheet | COMMIT on save | CONTEXTUAL | caption row, outline sm | part head, outline |
| Project / purchase rows, Riwayat Stok, Buka Detail Stok,… | both (by capability) | drill to related records | record detail / stock | none | CONTEXTUAL | row links / caption links | row links |

## `90-tinjauan-owner.html` — Tinjauan Owner

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Cetak | Owner | print the review | data-action tnj-print (window.print, announced) | none | SECONDARY | quiet outline in header | hidden (desk:true) |
| Tampilkan: perusahaan | Owner | narrow both parts to one company | MCCompany view | none | SECONDARY | page toolbar select | page Filter sheet |
| Pelaku (aktivitas) | Owner | narrow the review feed to one actor | feed filter (state.actor) | none | SECONDARY | select at the right of the feed tool row | page Filter sheet ('Pelaku aktivitas') |
| Kondisi row (record number link + chevron; accessible name… | Owner | review an open condition | invoice / record detail | none | CONTEXTUAL | table row link | row link |
| Riwayat Aktivitas | Owner | open the full audit trail | 91-riwayat-aktivitas.html | none | TERTIARY | section-head link | section-head link |
| Tabs: Aktivitas / Keamanan / Bukti Gudang Bersama / Impor… | Owner | switch review kind | MCTabs | none | SECONDARY | tab row | tab row (overflow per Layer A) |
| Jendela waktu: Hari ini / 7 hari / 30 hari / Rentang tanggal | Owner | time window of the selected tab | MCSeg + shared date range | none | SECONDARY | tool row under the tabs | full-width segmented control |
| Feed row (sentence + chevron) | Owner | open the recorded event | record / Log Keamanan | none | CONTEXTUAL | row link | row link |
| Lihat 30 hari | Owner | widen an empty window | data-action tnj-win30 | none | CONTEXTUAL | empty state only | empty state only |
| whole route | Admin | - | canonical not-found (route roles:['owner']) | - | HIDDEN-BY-ROLE | - | - |

## `91-riwayat-aktivitas.html` — Riwayat Aktivitas

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Cetak | Owner | print the audit list | data-action tnj-print | none | SECONDARY | quiet outline in header | hidden (desk:true) |
| Tabs: Aktivitas / Log Keamanan | Owner | switch log | MCTabs (?tab=keamanan) | none | SECONDARY | tab row | tab row |
| Cari aktivitas | Owner | text search | MCFilter search | none | SECONDARY | toolbar | toolbar row 1 |
| Periode (date range) | Owner | scope the whole list | shared MCDateRange | none | SECONDARY | toolbar | own row |
| Tampilkan: perusahaan | Owner | company view | MCCompany | none | SECONDARY | toolbar | Filter sheet |
| Filter (Pelaku, Kelas tindakan, Tanggal mundur) | Owner | less used filters | MCFilter popover / sheet | none | TERTIARY | popover | sheet |
| Activity row | Owner | open the record | record detail | none | CONTEXTUAL | table row link | row link |
| Muat Lagi | Owner | older entries | MCList pager | none | TERTIARY | list foot | list foot |
| Hapus filter / Semua jenis | Owner | reset an empty filtered view | tnj-reset / tnj-sec-reset | none | CONTEXTUAL | empty state only | empty state only |
| Jenis (Log Keamanan) | Owner | filter security events | MCFilter | none | SECONDARY | tab toolbar | Filter sheet |
| whole route | Admin | - | not-found (roles:['owner']) | - | HIDDEN-BY-ROLE | - | - |

## `95-pengaturan.html` — Pengaturan

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tiles x3: Pengguna & Akses / Penomoran Dokumen / Pajak | Owner | open a settings area | 96 / 97 / 98 | none | SECONDARY | 3 equal tiles | one column, compact |
| Company row | Owner | inspect one company's readiness | detail in the split (?sel=), sheet below 1101 | none | CONTEXTUAL | table row (selected marker) | row + chevron -> sheet |
| Lengkapi (missing readiness item) | Owner | resolve the missing item | route of that item (e.g. 97 Penomoran) | none | PRIMARY | row link | row link, 44px |
| N syarat lengkap (disclosure) | Owner | see completed items | [data-ready-more] toggle | none | TERTIARY | quiet row | quiet row |
| Ubah Identitas | Owner | change identity data | step-up demo (Konfirmasi Kata Sandi) | COMMIT… | SECONDARY | outline in section head | full-width outline in card |
| Tambah Rekening | Owner | add a bank account | step-up demo | COMMIT… | SECONDARY | outline in section head | full-width outline in card |
| whole route | Admin | - | canonical not-found (roles:['owner']) | - | HIDDEN-BY-ROLE | - | - |

## `96-pengguna-akses.html` — Pengguna & Akses

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buat Akun | Owner | create an Admin account | demo (data-demo) | COMMIT | SECONDARY | compact outline in list head | compact outline in list head |
| Account row | Owner | open an account | detail (split) / sheet | none | CONTEXTUAL | row | row + chevron |
| Ubah Akses | Owner | change company access and capabilities | data-action set-edit -> Pratinjau Akses -> Simpan Akses | COMMIT… | PRIMARY | section head | hidden (note: changed from tablet or… |
| Pratinjau Akses / Kembali Ubah / Simpan Akses / Batal | Owner | edit flow | in-card editor | COMMIT | CONTEXTUAL | editor only | - |
| Buat Tautan Atur Kata Sandi | Owner | issue a set-password link | demo | COMMIT… | SECONDARY | card foot left | card foot |
| Akhiri Semua Sesi | Owner | sign another account out everywhere | data-action set-end-sessions (disabled with reason when no session) | DESTRUCTIVE | SECONDARY | card foot right, danger outline | card foot |
| Buka Akun Saya (own account) | Owner | manage own credentials | 99-akun-saya.html | none | TERTIARY | outline in own-account card | same |
| whole route | Admin | - | not-found (roles:['owner']) | - | HIDDEN-BY-ROLE | - | - |

## `97-penomoran.html` — Penomoran Dokumen

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Tampilkan: perusahaan / Jenis dokumen | Owner | narrow the list | MCFilter | none | SECONDARY | toolbar | Filter sheet |
| Mulai Penomoran (row) | Owner | open the start form for a type awaiting the Owner | data-action set-start-open | none (opens… | PRIMARY | row action | row action, full width |
| Mulai Penomoran (form submit) / Batal | Owner | start the sequence at a first number | inline form submit / set-start-cancel | COMMIT… | PRIMARY | form foot | form foot, 44px |
| Rincian (per row) | Owner | show format and history | [data-disc] disclosure | none | TERTIARY | fixed trailing control | trailing |
| Buka Impor Data Awal (held row) | Owner | clear the import condition (r13: every held series is held by a pending import batch of seed rows, the canonical cause, NM-03; the former "Buka Barang Keluar" held-row link and its non-canonical reason are gone, DISC §6 F8) | demo link | none | TERTIARY | quiet link | quiet link |
| Last number link (Sudah Dimulai) | Owner | open the last numbered document | document detail | none | CONTEXTUAL | quiet tabular text | quiet text |
| Tampilkan / Sembunyikan (Sudah Dimulai) | Owner | unfold the reference list | [data-started-toggle] | none | TERTIARY | - | section head |
| whole route | Admin | - | not-found (roles:['owner']) | - | HIDDEN-BY-ROLE | - | - |

## `98-pajak.html` — Pajak

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Buka invoice (Cara pajak dihitung) | Owner | see the example invoice | invoice detail inv-arj-0031 | none | TERTIARY | section link | section link |
| Tambah Versi Tarif | Owner | schedule a new PPN rate version | data-action set-ver-open -> inline form (COMMIT confirm) | COMMIT | SECONDARY | compact outline in section head | compact outline |
| Version form: Simpan / Batal | Owner | record the version | inline form | COMMIT | CONTEXTUAL | form only | form only |
| Profil row (chevron) | Owner | open the company's settings | 95-pengaturan.html?sel=<company> | none | CONTEXTUAL | table row link | row link |
| whole route | Admin | - | not-found (roles:['owner']) | - | HIDDEN-BY-ROLE | - | - |

## `99-akun-saya.html` — Akun Saya

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Kelola akun lain | Owner | manage other accounts | 96-pengguna-akses.html | none | TERTIARY | section-head link | section-head link |
| Kelola akun lain | Admin | - | not rendered (no users.manage) | - | HIDDEN-BY-ROLE | - | - |
| Tampilkan kata sandi (eye x3) | Owner, Admin | check typing | field toggle | none | CONTEXTUAL | in field | in field |
| Simpan Kata Sandi | Owner, Admin | change own password (other sessions end) | form submit (demo result card) | COMMIT | PRIMARY | form foot | form foot |
| Akhiri Sesi Lain | Owner, Admin | sign out other devices | in-page action | DESTRUCTIVE… | SECONDARY | danger outline in Masuk & sesi | same |
| Log Keamanan | Owner | check unknown events | 91-riwayat-aktivitas.html?tab=keamanan | none | TERTIARY | card foot link | card foot link |

## `00-tidak-ditemukan.html` — Halaman tidak ditemukan

| Control | Role | Intent | Destination / action | Risk | Priority | Desktop | Phone |
|---|---|---|---|---|---|---|---|
| Ke Beranda | Owner, Admin | leave a dead address | role home (02 Owner / 06 Admin) | none | PRIMARY | visible | visible |
| Cari | Owner, Admin | find the record another way | opens the search palette (data-open-search) | none | SECONDARY | visible (outline) | visible (outline) |
| Muat Ulang (?jenis=error) | Owner, Admin | retry after a system error | data-action sys-reload | none | PRIMARY | visible | visible |
| Ke Beranda (?jenis=error) | Owner, Admin | leave | role home | none | SECONDARY | visible (outline) | visible (outline) |
| Salin (kode rujukan) | Owner, Admin | copy the reference for support | data-action sys-copy-ref (clipboard) | none | TERTIARY | inline ghost | inline ghost, 44px |

## Changes after the final review (they supersede the rows above where they differ)

- 03 'Gunakan data dari' (only with ?proyek, both roles with purchase.manage): now an MCMenu. Desktop/tablet: SECONDARY outline button in the Informasi Pembelian head that opens a body-level popover. Phone: the same button opens a bottom sheet titled 'Gunakan data dari' with 'Batal'. Items unchanged: 'Pembelian sebelumnya' (copies supplier and lines of the latest project purchase) and 'Kebutuhan proyek (kekurangan…
- 03 new entry point 03-create-purchase.html?proyek=<id>&isi=kebutuhan (R.href('pembelian.form', { proyek: id, isi: 'kebutuhan' })) for links that come FROM a shortage (06 queue 'Kekurangan stok', 11 Pengadaan/header, 35 queue, 31 refill notice; other units add the parameter). It opens step 1 prefilled with the shortage lines, empty supplier and reference, date today; the primary is still 'Lanjut ke review'. Without…
- 03 footer 'Batal': same place and behaviour (asks first only after an edit), but now an outline button: desktop SECONDARY before the primary; phone [Batal ~96][Lanjut ke review fills]; hidden in step 2 on phones as before.
- 02: no action change (only the meta copy of the 52 row).
- 30 Stok, Owner: 'Barang Masuk' moves from OVERFLOW to SECONDARY (quiet outline) and 'Barang Keluar' from OVERFLOW to SECONDARY. Desktop: 2 outline buttons. Tablet: Barang Masuk button + Barang Keluar in 'Tindakan Lain'. Phone: Barang Masuk + ⋯ (Barang Keluar). Admin unchanged: Barang Masuk PRIMARY; Barang Keluar HIDDEN-BY-ROLE (no stock.dispatch).
- 35 Reservasi: the status view moves from an in-card segmented control to a page-toolbar select 'Status reservasi' (Aktif default / Dilepas / Terpakai / Semua). The toolbar moves from inside the 'Daftar reservasi' card to page level, and search + Tampilkan now narrow both lists. The 'Proyek' filter select is removed; ?proyek= and ?produk= are address scopes shown as chips (× clears) and apply to both lists.
- 35 Perlu direservasi row: new CONTEXTUAL text link 'Buat Pembelian' → 03-create-purchase.html?proyek=<id>&isi=kebutuhan. It appears only when Tersedia = 0, nothing is on order and canGo('pembelian.form'); otherwise the row action stays 'Reservasi' (stock.reserve, Tersedia > 0) or a status text.
- 31 Detail Stok Produk: header 'Buat Pembelian' (PRIMARY, below minimum) and its palette item now go to pembelian.form?produk=<id>&isi=kebutuhan. Section link 'Kelola reservasi' is renamed 'Semua reservasi' (same destination 35?produk=). Advice link 'Lihat Pembelian' is renamed 'Buka pembelian' (same destination).
- 21 Detail Pembelian: the receipt section foot link 'Riwayat stok' is renamed 'Semua pergerakan' (same destination, the receipt's stock history). The Pembayaran section link 'Pengeluaran & Kas Lain' is renamed 'Semua pengeluaran' (same destination). The facts move to a right-rail 'Informasi pembelian' card inside the Barang tab; the inline 'Pratinjau PO' fact link is unchanged.
- 34 Riwayat Stok: the row-end status column is removed; 'Balikkan' stays only in the row detail sheet (unchanged).
- 11 Penagihan › Invoice section: NEW contextual 'Buat Invoice' (outline, invoice.issue, COMMIT) → session draft invoice + DOC-06 draft → 62?id=<draft>. When a draft already exists: 'Buka Draf Invoice' → 62?id=<draft>. Owner and Admin, desktop and phone (phone in the Penagihan drill sheet).
- 11 header 'Buat Pembelian' (shortage), the shortage signal, and the Pengadaan / palette 'Buat Pembelian' when a shortage exists → 03-create-purchase.html?proyek=<id>&isi=kebutuhan (was ?proyek=<id>).
- 11 header 'Buat Penawaran' (Draf project) and the 12 result 'Buat Penawaran' → 13-penawaran.html?proyek=<id>&buat=1, which opens the 'Buat draf penawaran?' COMMIT at once; success opens the 14 draft.
- 11 'Perlu tindakan' signals: now ABOVE the tab row at every width (was the first block of Ringkasan on tablet/desktop).
- 11 Pengiriman part rows / number link for an undelivered delivery: Admin with delivery.record → 41 (task); Owner and accounts without it → 40-pengiriman.html?sel=<delivery> (read view). Was 41 for any canGo and 34-history otherwise.
- 11 section links renamed: 'Lihat semua' → 'Semua syarat' (→ 15), 'Semua riwayat' → 'Semua aktivitas' (switches to the Riwayat tab), 'Riwayat Aktivitas' → 'Buka Riwayat Aktivitas' (→ 91?proyek).
- 15 'Selesaikan Paksa' (Owner only, CRITICAL): moved from the header 'Tindakan Lain' overflow to a muted danger text button in the 'Keuadaan penyelesaian' card ('Keadaan luar biasa: Selesaikan Paksa…'). The 15 header now has no actions.
- 15 condition fixes: Admin TASK buttons (outline) = Catat Barang Keluar (stock.dispatch → 33), Catat Pengiriman (delivery.record → 41?id), Lengkapi Dokumen (requirements.manage → 52?proyek), Tagihkan Invoice (billing.record → 62?id). Everything else is a quiet NAV link: Lihat item (11 item tab), Lihat pengiriman (11 pengiriman tab), Lihat kasus koreksi (70?sel when exactly one case; none when several, the cases are…
- 14 header 'Catat Jawaban Klien' is hidden while the answer panel is open (restored on Batal).
- 14 Dokumen card: 'Lihat Dokumen' → 'Pratinjau' (in-place preview toggle); 'Buka di Dokumen' → 'Buka dokumen' (→ 51).
- 80 Laporan / 81 Laporan Gabungan: 'Cetak' moved from the filter-toolbar end to the page header (MCActions, SECONDARY, desktop + tablet only; absent on phones). Before: outline button in the toolbar, an icon-only button on tablet.
- 80 / 81: the 'Ekspor' menu (Excel (.xlsx), PDF, Lihat Ekspor Saya) moved from a filled primary MCMenu at the toolbar end to the page header's single MCActions overflow menu labelled 'Ekspor' (OVERFLOW: outline text trigger on desktop/tablet; ⋯ on the title row on phones, sheet 'Ekspor laporan'). Shown only with reports.export.
- 80: laba proyek outside a full month now disables the Excel/PDF menu items with the reason; before, the whole Ekspor toggle was disabled.
- 80 / 81: an export request no longer raises a toast; the inline result card (with 'Buka Ekspor Saya') is the only feedback.
- 85 Data Master: 'Tambah Klien / Pemasok / Produk / Jasa / Lokasi Rak' stays PRIMARY but is drawn quiet (outline) for the Owner; the Admin keeps the filled primary when she holds the capability.
- 64 Pembayaran: 'Catat Pembayaran' changes for the Owner from SECONDARY (full width on phones) to PRIMARY quiet (outline, not stretched, right-aligned on phones). The Admin is unchanged (filled primary).
- 66 Pengeluaran & Kas Lain: the tab-aware 'Catat Pengeluaran Kas / Catat Beban / Catat Kas Masuk Lain' changes for the Owner from SECONDARY to PRIMARY quiet, same as 64. Capability gating is unchanged.
- 66 Kas Masuk Lain tab: the 'Pembayaran klien' route link moved from the card caption into the list head (right side). Same destination, CONTEXTUAL.
- 64 detail panel: the 'Ada Kredit Pelanggan' header pill is removed (the summary cell states the remainder). 'Terapkan ke Invoice' and the record kebab are unchanged.
- 86 Detail Data Master (klien, pemasok, jasa) on phones: parts are a tab row instead of the drill parts list + sheet. Produk keeps the drill. All parts are still reachable.
- 65 Catat Pembayaran: unchanged actions; the primary lost its icon and the done-bar 'Lihat pembayaran' lost its arrow.
- 06 (Admin): the 'Kekurangan stok' row now goes to 03-create-purchase.html?proyek=<id>&isi=kebutuhan (it was ?proyek=<id>). Same capability gate (canGo pembelian.form); the fallback 11?tab=pemenuhan is unchanged.
- 06: group section links renamed, destinations unchanged. 'Buka Gudang' becomes 'Semua stok' (gudang.stok); 'Buka Proyek' becomes 'Semua proyek' (proyek.list, used for G1 without stock.view and for G4); 'Buka Kasus Koreksi' becomes 'Semua kasus koreksi' (kasus.list); 'Buka Piutang' becomes 'Semua piutang' (piutang).
- 06 phone: the company-view filter button is labelled 'Perusahaan' (it was 'Filter'). It is the same sheet.
- 06: the G4 'nilai terkonfirmasi belum diinvoice' row copy now says 'rincian di Penagihan proyek'. The destination 11?tab=penagihan is unchanged.
- 90 phone: the page Filter (company view + Pelaku aktivitas) moved from its own row into the 'Kondisi yang masih terbuka' section head (CONTEXTUAL). Tablet and desktop are unchanged.
- 91 Aktivitas: the period (MCDateRange trigger) moved from the toolbar to the list head on every width. The toolbar is search + company view + Filter (Pelaku / Kelas tindakan / Tanggal mundur) on desktop, and search + Filter on phones.
- 91 Log Keamanan: the 'Jenis' filter moved from a toolbar row into the list head (desktop: inline select; phone: Filter button with sheet).
- 96: 'Akhiri Semua Sesi' (DESTRUCTIVE, same data-action set-end-sessions and data-user) changed from an outline danger button to a quiet ghost danger command in its own slot. Desktop: far end of the 'Sesi dan kredensial' foot. Phone: its own row under a divider, below 'Buat Tautan Atur Kata Sandi'. The phone sheet now lists 'Akses Perusahaan dan Kewenangan' before 'Sesi dan kredensial'.
- 96 Pratinjau Akses: the 'Yang berubah / Semua' segmented control is HIDDEN when every row changed. 'Kembali Ubah' and 'Simpan Akses' (CRITICAL) are unchanged.
- 97 phone: the page Filter (company view + Jenis dokumen) moved into the 'Perlu tindakan Owner' section head. Tablet and desktop are unchanged.
- 97 and 98 phone inline forms: the button order is unchanged (Batal, then primary); only the widths changed.
- 40 Pengiriman, Belum terkirim and Serah terima jasa rows: the desktop 'Catat' row button is removed. The row (record link + chevron) is the one CONTEXTUAL control to 41-catat-pengiriman.html?id=…, same as phones. The filter toolbar moved under the tab row.
- 70 Kasus Koreksi: the status switch is now page tabs Terbuka / Ditutup / Semua with counts (?status=CLOSED/all). Toolbar under the tabs: search + Tampilkan + result note + Filter (Jenis).
- 70 case panel, SELISIH_PENGIRIMAN: 'Buka Pengiriman' (outline, to 41 record view, where Tutup Pengiriman lives) is shown only with delivery.close; 'Kirim Pengganti' (outline, to 33?proyek=) only with stock.dispatch. Without either: HIDDEN-BY-ROLE, one muted line, and the source stays under 'Catatan terkait'. Owner sees both outline buttons; Sari sees neither.
- 70 case panel, RETUR_KE_PEMASOK: 'Buka Pembelian' (outline, to 21) is shown only with purchase_return.record, and 'Lihat stok' (to 31) is now a quiet text link. Without the capability: HIDDEN-BY-ROLE, one muted line. No green button remains in the next-step block; 'Tutup Kasus' at zero residual is the panel's only primary.
- 32 Barang Masuk / 33 Barang Keluar: the company view ('Tampilkan') moved from the worklist card head into a page toolbar above the list, plus a new search. 'Riwayat barang masuk' / 'Pengiriman' stay quiet section links in the card head. The toolbar hides with the worklist after a pick and returns with 'Ganti …'.
- 36 Stok Opname: the Status filter moved from the card head into the page toolbar (search + Status). 'Mulai Hitungan' stays a SECONDARY button in the sessions card head.
- 36 on phones: 'Terapkan Selisih' (action bar) appears only in the session state (?sesi=), never on the worklist. 'Cetak Lembar Hitung' moves on phones from the count-card head to the summary step foot as a quiet text link (desktop and tablet unchanged). 'Hitung Ulang' sits in the stale notice of the 'Hasil hitungan' summary. New phone-only controls: 'Ganti' (back to the session list), 'Sebelumnya' / 'Berikutnya' /…
- Action-bar primaries on 32 / 33 / 36 no longer carry an icon (label unchanged).
- 63 Piutang: header 'Catat Pembayaran' moved from PRIMARY (Admin) / quiet SECONDARY (Owner) to OVERFLOW in 'Tindakan Lain' for both roles (payment.record; phone: lone '⋯')
- 63 Piutang panel / phone detail sheet: 'Catat pembayaran invoice ini' (pembayaran.catat?invoice=id, payment.record) is the visible next step: Admin PRIMARY, Owner SECONDARY outline. Belum Ditagihkan tab unchanged: Admin inline bill form (primary submit 'Tagihkan'), Owner outline 'Tagihkan' opening the form in a sheet
- 63 Piutang panel: NEW record menu (kebab 'Tindakan untuk <nomor>'): 'Tandai Sengketa' (receivables.dispute, COMMIT, form in a sheet) and, after a separator, 'Hapuskan Piutang' (receivables.write_off, Owner only, CRITICAL, danger). Hidden for the Admin (lacks both capabilities)
- 62 Detail Invoice: 'Lihat Dokumen' removed from 'Tindakan Lain' (the Dokumen tab and the PDF-failed notice link the same document); 'Tandai Sengketa' / 'Hapuskan Piutang' now carry icons (flag / ban)
- 62 Detail Invoice: new entry ?id=baru&proyek=<projectId> (invoice.issue; unknown, out-of-scope or nothing-to-invoice shows not-found) starts or reuses the project's session draft invoice + invoice document and shows it; primary 'Pratinjau & Terbitkan' leads to 51
- 61 Invoice 'Buat Invoice' sheet: rows lead to 62?id=baru&proyek=<id> (start the draft) instead of 11?tab=penagihan; only projects with something left to invoice are listed
- 52 Dokumen Administrasi: BAST panel secondary 'Catat Pengiriman' now goes to 41 via R.href('pengiriman.catat', { id }) (unchanged destination, explicit task link); gated by MCApp.canGo('pengiriman.catat')
- 60 Keuangan phones: company view moved from the toolbar 'Perusahaan' filter sheet to ONE 'Tampilan:' select in the 'Angka keuangan' head; desktop keeps the toolbar 'Tampilan' select; tablet (768-1024) keeps the toolbar plus the 'Per perusahaan' fold toggle
- 60 Keuangan: aging section link label 'Laporan piutang' -> 'Buka laporan piutang' (same destination 80?jenis=piutang)

### Orchestrator and recovery pass (these supersede the unit lines above where they differ)

- Record links are read-only (D-42): a Barang Keluar record opens its stock movements (34?ref=), never the Catat Pengiriman form.
- One way to start an invoice (D-44): 11 Penagihan and the 61 project picker run MCApp.startInvoice (COMMIT, then the draft opens on 62); the interim 62?id=baru entry that drafted on page load was removed.
- One single-date field (D-45): MCDateField in Layer A; 12, 14, 52, 62, 65 and 98 use it.
- Recovery-pass polish (D-46): no one-item Tindakan Lain menu (63 header empty, 14 Buat Revisi as a quiet button); 12 px tab-to-content step on every page; quiet phone actions compact; 76% written attached; 41 time field matches the date field; the Owner-only Beranda guard only for roles with their own Beranda.
- 63 Piutang header: no action (was "Tindakan Lain" with only "Catat Pembayaran"); the per-invoice "Catat pembayaran invoice ini" in the panel is the step; generic "Catat Pembayaran" on 60 / 64 headers and in the command palette.
- 14 Penawaran (approved, latest): "Buat Revisi" is a quiet header button (was a one-item "Tindakan Lain" menu).

## R12 — navigation removals and changes (they supersede the rows above where they differ)

R12 (D-47 … D-51) moved every persistent destination into the two-level navigation tree and removed the page-level
copies of it. Every removed or changed control is listed with the path that still reaches its destination
("Still reachable via"); the trees are in `docs/NAVIGATION_ARCHITECTURE.md` §3. Entries in that column are the
sidebar / drawer path (the rail opens the drawer at the group); "palette" = the command palette "Navigasi" group,
which lists every entry the account may open, including the Owner's hidden Barang Masuk / Barang Keluar.

| Page | Control before R12 | Role | R12 | Still reachable via |
|---|---|---|---|---|
| 10, 13 | Sub-navigation row "Proyek · Penawaran" (D-39) | Owner, Admin | REMOVED (`MCPage.subnav` renders nothing: the tree provides both) | Proyek ▸ Daftar Proyek, Proyek ▸ Penawaran; bottom Proyek; palette |
| 30, 34, 35, 36 | Gudang sub-navigation row "Stok · Reservasi · Riwayat Stok · Stok Opname" | Owner, Admin | REMOVED (renders nothing) | Gudang ▸ Stok / Reservasi / Riwayat Stok / Stok Opname (Admin: no Stok Opname, she lacks stock.count — the row left it out too); bottom Gudang; palette |
| 13, 32–36, 52, 61, 63, 64, 66, 81, 82, 91, 96–98 | Breadcrumb to the module landing (Proyek, Stok, Dokumen, Keuangan, Laporan, Tinjauan Owner, Pengaturan); 13 / 34–36 already hid it (D-39 workaround) | both | REMOVED (`ROUTES.parent: null`; the workaround is gone) | the open group in the sidebar / drawer; details and tasks keep their trail to the nearest destination (62 "Invoice", 15 "Proyek › <nomor>", 31 "Stok", 65 "Pembayaran") |
| 30 Stok | Header "Barang Masuk" (Admin primary) | Admin | REMOVED while her navigation provides it (Barang Keluar was never hers: no stock.dispatch) | Gudang ▸ Barang Masuk; 06 QS-05 rows; 21 "Terima Barang" (?pembelian=) |
| 30 Stok | Header "Barang Masuk" + "Barang Keluar" (quiet pair) | Owner | KEPT: his navigation hides both entries, so the pair renders (`navProvides` false); relabelled "Catat …" (row below) | also 21 "Terima Barang", 11 Pemenuhan, record links on 11 / 21 / 31, palette "Gudang › Barang Masuk / Barang Keluar" |
| 33 Barang Keluar | Worklist-head link "Pengiriman" | stock.dispatch holders | REMOVED | Pengiriman (sidebar / drawer; Admin bottom slot 4); the done state's "Catat Pengiriman" for that Barang Keluar |
| 40 Pengiriman | "Belum terkirim" caption link "Barang Keluar" | both | REMOVED | Gudang ▸ Barang Keluar for stock.dispatch holders; Owner: the 30 header pair, 11 Pemenuhan "Catat Barang Keluar", palette |
| 50 Dokumen | Subtitle link "Dokumen Administrasi" | both | CHANGED to plain text | Dokumen ▸ Dokumen Administrasi |
| 61 Invoice | Subtitle link "piutang" | both | CHANGED to plain text | Keuangan ▸ Piutang |
| 63 Piutang | Subtitle link "invoice" | both | CHANGED to plain text | Keuangan ▸ Invoice |
| 66 Pengeluaran & Kas Lain | Kas Masuk Lain list-head link "Pembayaran klien" | both | CHANGED to a plain sentence | Keuangan ▸ Pembayaran |
| 60 Ringkasan Keuangan | Recent-list section links "Semua pembayaran" / "Semua pengeluaran" | both | REMOVED (the rows stay and open each record) | the Kas masuk / Kas keluar figure tiles on the same page; Keuangan ▸ Pembayaran / Pengeluaran & Kas Lain |
| 80 Laporan | Subtitle meta link "Lihat Laporan Gabungan" | Owner | REMOVED | Laporan ▸ Laporan Gabungan |
| 80, 81 | Ekspor menu item "Lihat Ekspor Saya" | reports.export holders | REMOVED (the menu holds Excel / PDF) | Laporan ▸ Ekspor Saya; after a request, the result card "Buka Ekspor Saya" (?sel=) |
| 82 Ekspor Saya | Footer link "Laporan" | both | CHANGED to plain text | Laporan ▸ Laporan per Perusahaan; the empty state "Buka Laporan" stays |
| 85 Data Master | Tab row Klien · Pemasok · Produk & Jasa · Lokasi Rak | both | REMOVED (MCTabs view mode): h1 = the view; "Tambah <jenis>" and the subtitle follow the view | Data Master ▸ Klien / Pemasok / Produk & Jasa / Lokasi Rak (stock.view); `?jenis=` addresses unchanged |
| 86 Detail Data Master | Breadcrumb "Data Master" | both | CHANGED: names the record's kind ("Pemasok" → 85?jenis=pemasok) | — |
| 91 Riwayat Aktivitas | Tab row Aktivitas · Log Keamanan | Owner | REMOVED (view mode): h1 "Riwayat Aktivitas" or "Log Keamanan", subtitle per view | Tinjauan ▸ Riwayat Aktivitas / Log Keamanan; the 96 / 99 links, now scoped to their account (`&akun=`, row below) |
| 90 Tinjauan Owner | "Aktivitas untuk Ditinjau" section-head link "Riwayat Aktivitas" (unscoped) | Owner | REMOVED | Tinjauan ▸ Riwayat Aktivitas; every row opens its record |
| 95 Perusahaan (h1 was "Pengaturan") | Three hub tiles: Pengguna & Akses, Penomoran Dokumen, Pajak | Owner | REMOVED; h1 / `<title>` "Perusahaan"; NEW conditional "Perlu tindakan" rows, absent when zero: "n akun tanpa verifikasi dua langkah" → 96?sel=, "n jenis dokumen perlu tindakan Owner" / "n jenis dokumen tertahan" → 97?sel= | Pengaturan ▸ Pengguna & Akses / Penomoran Dokumen / Pajak; the company readiness "Lengkapi" stays |
| 06 Antrean Tindakan | Group-head links "Semua stok", "Semua proyek", "Semua kasus koreksi", "Semua piutang" | Admin | REMOVED while her navigation provides the list (the default tree provides all four) | Gudang ▸ Stok, Proyek ▸ Daftar Proyek, Kasus Koreksi, Keuangan ▸ Piutang; bottom Proyek / Gudang |
| 21 Detail Pembelian | Pembayaran section link "Semua pengeluaran" (unscoped) | both | REMOVED (Pengeluaran & Kas Lain cannot filter by purchase) | the rows (each payment of this purchase); Keuangan ▸ Pengeluaran & Kas Lain |
| 62 Detail Invoice | Riwayat tab foot link "Riwayat Aktivitas" (unscoped) | Owner | CHANGED: "Riwayat proyek" → 91?proyek=<the invoice's project> | Tinjauan ▸ Riwayat Aktivitas (the unscoped trail) |
| 99 Akun Saya | Section-head link "Kelola akun lain" | Owner | REMOVED | Pengaturan ▸ Pengguna & Akses |
| 15 Penyelesaian Proyek | Condition fixes "Lihat pembayaran" (unfiltered list) and a Kasus Koreksi link when no case is open | both | CHANGED: "Lihat pembayaran" → the project's Penagihan part (11?tab=penagihan); no generic Kasus Koreksi link when no case is open (one open case: its record) | Keuangan ▸ Pembayaran; Kasus Koreksi |
| 02 Beranda | "Proyek berjalan › Lihat semua" → 10 | Owner | CHANGED: → 10?state=ACTIVE; 10 seeds its Status filter from `?state=` (counted on "Filter (n)") | Proyek ▸ Daftar Proyek (the full list) |
| 52 Dokumen Administrasi | Opened without `?proyek`: a fixture project | both | CHANGED: lands on "Belum terpenuhi" (cross-project); `?sel=` still opens that item's project | — |
| 51 Detail Dokumen | Numbering notice button "Penomoran Dokumen" → 97 | Owner (route allowed) | CHANGED: → 97?sel=<the blocking series> | Pengaturan ▸ Penomoran Dokumen |
| 36 Stok Opname | Applied-selisih notice link "Riwayat Stok" → 34 | both | CHANGED: → 34?jenis=PENYESUAIAN (the adjustments it wrote) | Gudang ▸ Riwayat Stok (the whole list) |
| 60, 95 | Page titles "Keuangan", "Pengaturan" | — | CHANGED: h1 + `<title>` "Ringkasan Keuangan" (60), "Perusahaan" (95) | — |
| Khusus Owner | Level-1 entries Tinjauan Owner · Riwayat Aktivitas · Log Keamanan | Owner | CHANGED (review): ONE group "Tinjauan ▸" holding the three (12 level-1 rows; fits 1280 × 720 with every group closed) | Tinjauan ▸ Tinjauan Owner / Riwayat Aktivitas / Log Keamanan; palette |
| 30 Stok | Header pair "Barang Masuk" + "Barang Keluar" | Owner | CHANGED (review): labelled as the task they start, "Catat Barang Masuk" / "Catat Barang Keluar" (quiet secondaries), so the pair never reads as a sibling-navigation row | 21 "Terima Barang", 11 Pemenuhan, record links on 11 / 21 / 31, palette |
| 20 Pembelian | Awaiting-goods notice link "Barang Masuk" (unscoped) | Admin | CHANGED (review): only scoped — "Terima barang" → 32?pembelian=<id> when exactly one purchase waits; the unscoped link only for a project whose navigation lacks the entry | Gudang ▸ Barang Masuk; the notice's filter toggle "Lihat yang menunggu" |
| 02 Beranda | Tindakan row "Lihat barang masuk" → 32 | Owner | CHANGED (review): "Lihat pembelian" → 20?penerimaan=menunggu (the purchases still awaiting goods: the Owner oversees, the floor receives) | 21 "Terima Barang" for one purchase; palette "Gudang › Barang Masuk" |
| 80 Laporan | h1 / `<title>` / ROUTES title "Laporan" | both | CHANGED (review): "Laporan per Perusahaan" (= its menu entry); subtitle "Pilih jenis laporan untuk perusahaan dan periode terpilih." | — |
| 90 Tinjauan Owner | Review tabs "Aktivitas" / "Keamanan" | Owner | CHANGED (review): "Aktivitas khusus" / "Kejadian keamanan" — never echoing the entries Riwayat Aktivitas / Log Keamanan beside 90 in the same group | — |
| 96 Pengguna & Akses | Account card "Peristiwa keamanan", link "Log Keamanan" (the whole log) | Owner | CHANGED (review): "Kejadian keamanan" (the term of 91 / 99); "Lihat di Log Keamanan" → 91?tab=keamanan&akun=<user>, only when the account has events | Tinjauan ▸ Log Keamanan (the whole log) |
| 99 Akun Saya | Riwayat kredensial foot link "Log Keamanan" (the whole log) | Owner | CHANGED (review): "Log Keamanan akun ini" → 91?tab=keamanan&akun=<me> | Tinjauan ▸ Log Keamanan |
| 91 Log Keamanan | — | Owner | NEW (review): `?akun=` scopes the log to one account; the chip "Akun: <nama>" (×) removes the scope | — |
| 36 Stok Opname | Session list newest first, newest open session opened | stock.count_apply holders (Owner) | CHANGED (review): decision first — a complete count ready for "Terapkan Selisih", then a count to redo, lead the list and open first ("n menunggu keputusan Anda, di atas"); a counter's list stays newest first | — |

**New or changed shell controls**

| Control | Role | Intent | Behaviour | Class |
|---|---|---|---|---|
| Navigation group headers (Proyek, Gudang, Dokumen, Keuangan, Laporan, Data Master, Tinjauan, Pengaturan) | both (Tinjauan, Pengaturan: Owner) | show / hide the group's entries | disclosure button (`aria-expanded`); never navigates | UI CONTROL |
| Navigation children | both (by role / capability) | open a sibling destination | link; marked `aria-current` | NAVIGATION |
| Ctrl / Cmd + B | both, desktop ≥ 1025 px | collapse / expand the sidebar | same as the brand-row toggle; ignored in fields and while an overlay is open | UI CONTROL |
| Rail group icon (collapsed desktop, tablet) | both | reach a group's entries | opens the drawer at that group (`aria-haspopup="dialog"`) | UI CONTROL |
| Phone bottom bar | Owner: Beranda · Proyek · Gudang · Keuangan; Admin: Beranda · Proyek · Gudang · Pengiriman | frequent destinations | from `navigation.bottom` per role; a slot lights for its whole area | NAVIGATION |
| Palette "Navigasi" | both | jump to any entry | every entry the account may open, "Grup › Label" | NAVIGATION |

**Kept (contextual, unchanged)**: record links, filtered drill-downs (`?proyek=`, `?ref=`, `?produk=`, `?sel=`,
`?filter=`), signal and notice next-step rows, figure tiles (D-28), scoped "Lihat semua" continuations, empty-state
CTAs, header task actions (Buat Proyek, Buat Pembelian, Catat Pembayaran …), the 97 demo button "Buka Impor Data
Awal", and every palette entry.

