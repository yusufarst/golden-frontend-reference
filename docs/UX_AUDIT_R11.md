# MULTIPLECORP Golden Reference — UX audit R11 (page by page)

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL**.

Every route was inspected manually at 1366 × 768 and 390 × 844 (plus 1280 / 1024 / 768 / 440 / 360 / 1920 for the important or suspicious screens), as Owner and — where the page applies — as Admin (`?role=admin`). This file records, compactly, why layouts changed so a future agent does not undo them. Rules: `docs/UX_PRINCIPLES.md`; decisions: `docs/DESIGN_DECISIONS.md` D-26 … D-38; controls: `docs/ACTION_ROUTE_MATRIX.md`; journeys: `docs/ROLE_JOURNEYS.md`.

Columns of the summary: buttons above the fold (desktop / phone) from `tools/ux_density.py`, before → after.

| Route | Archetype | Role | Btn D before → after | Btn P before → after | Status |
|---|---|---|---|---|---|
| `01-login.html` Masuk | auth / focused form (split card with… | both | 7 → 6 | 7 → 6 | fixed |
| `05-atur-kata-sandi.html` Atur Kata Sandi | focused form (auth, no shell) | both | 3 → 3 | 3 → 3 | fixed (P2, P3 and the review polish) |
| `02-owner-dashboard.html` Beranda | overview / dashboard | owner | 11 → 5 | 3 → 1 | fixed |
| `06-antrean-tindakan.html` Beranda | task queue (work overview) | admin | 1 → 1 | 1 → 2 | fixed (P1, P2, P3; the Layer A regression is resolved and… |
| `07-cari.html` Cari | search / results list | both | 5 → 5 | 4 → 4 | fixed (module P2/P3 by its unit; P1 one search per screen… |
| `10-proyek.html` Proyek | list (WIDE-DATA) | both | 2 → 2 | 2 → 2 | fixed |
| `11-proyek-detail.html` Detail Proyek | detail-hub | both | 2 → 2 | 2 → 2 | fixed |
| `12-proyek-baru.html` Buat Proyek | create/edit form | admin | 4 → 4 | 2 → 2 | fixed |
| `13-penawaran.html` Penawaran | list | both | 1 → 1 | 0 → 1 | fixed |
| `14-penawaran-detail.html` Detail Penawaran | detail (document review) | both | 2 → 1 | 1 → 0 | fixed |
| `15-penyelesaian-proyek.html` Penyelesaian Proyek | review / checklist with decision | both | 6 → 1 | 1 → 0 | fixed |
| `20-pembelian.html` Pembelian | list (with QS-05 awaiting-goods notice) | both | 3 → 3 | 3 → 3 | fixed |
| `21-pembelian-detail.html` Detail Pembelian | detail-hub (tabs desktop, drill-in… | both | 2 → 2 | 2 → 5 | fixed |
| `03-create-purchase.html` Buat Pembelian | create form (3-step: input -> review… | admin | 8 → 8 | 5 → 4 | fixed |
| `30-stok.html` Stok | overview + list (beranda Gudang) | both | 4 → 5 | 5 → 6 | fixed |
| `31-stok-produk.html` Detail Stok Produk | detail (empat kuantitas +… | both | 2 → 1 | 2 → 1 | fixed |
| `32-barang-masuk.html` Barang Masuk | task (floor work: picker -> lines +… | admin | 1 → 0 | 1 → 1 | fixed |
| `33-barang-keluar.html` Barang Keluar | task (floor work, same frame as 32) | both | 1 → 0 | 1 → 1 | fixed |
| `34-riwayat-stok.html` Riwayat Stok | activity/audit ledger (list + detail… | both | 1 → 0 | 0 → 1 | fixed |
| `35-reservasi.html` Reservasi | task queue + list (Perlu direservasi +… | admin | 9 → 2 | 2 → 3 | fixed |
| `36-stok-opname.html` Stok Opname | task + review (session list ->… | both | 7 → 7 | 3 → 2 | fixed |
| `40-pengiriman.html` Pengiriman | list (tabbed queue + history… | both | 4 → 0 | 3 → 1 | fixed |
| `41-catat-pengiriman.html` Catat Pengiriman | create/edit form (+ record view of a… | admin | 6 → 10 | 4 → 5 | fixed |
| `50-dokumen.html` Dokumen | list (grouped by document type,… | both | 2 → 2 | 2 → 2 | fixed |
| `51-dokumen-detail.html` Detail Dokumen | document preview (paper beside a facts… | both | 2 → 2 | 0 → 1 | fixed |
| `52-dokumen-administrasi.html` Dokumen Administrasi | checklist (list-detail task) | admin | 7 → 7 | 3 → 4 | fixed |
| `60-keuangan.html` Keuangan | overview / hub | both | 2 → 1 | 2 → 1 | fixed |
| `61-invoice.html` Invoice | list | both | 2 → 2 | 2 → 2 | fixed |
| `62-invoice-detail.html` Detail Invoice | detail-hub | both | 3 → 2 | 5 → 5 | fixed |
| `63-piutang.html` Piutang | list-detail workspace (list archetype… | both | 4 → 3 | 2 → 1 | fixed |
| `64-pembayaran.html` Pembayaran | list-detail workspace | both | 3 → 4 | 3 → 3 | fixed |
| `65-catat-pembayaran.html` Catat Pembayaran | create form with summary aside and… | both | 2 → 3 | 2 → 3 | fixed |
| `66-pengeluaran.html` Pengeluaran & Kas Lain | list with tabs + sheet detail + sheet… | both | 4 → 1 | 2 → 2 | fixed |
| `70-kasus-koreksi.html` Kasus Koreksi | list-detail (review) | both | 2 → 2 | 0 → 1 | fixed |
| `80-laporan.html` Laporan | report | both | 5 → 3 | 4 → 3 | fixed |
| `81-laporan-gabungan.html` Laporan Gabungan | report (consolidated summary) | owner | 4 → 3 | 3 → 2 | fixed |
| `82-ekspor-saya.html` Ekspor Saya | activity / request list | both | 4 → 2 | 4 → 2 | fixed |
| `85-data-master.html` Data Master | list (tabbed master list) | both | 1 → 1 | 1 → 2 | fixed |
| `86-data-master-detail.html` Detail Data Master | detail-hub | both | 4 → 3 | 4 → 3 | fixed |
| `90-tinjauan-owner.html` Tinjauan Owner | review | owner | 7 → 1 | 1 → 1 | fixed (P1, P2 and the review's Pelaku scope + overdue tone) |
| `91-riwayat-aktivitas.html` Riwayat Aktivitas | activity/audit | owner | 2 → 3 | 1 → 2 | fixed (P1, P2, P3 and the review polish) |
| `95-pengaturan.html` Pengaturan | settings hub (overview + list-detail) | owner | 0 → 2 | 0 → 0 | fixed (P1, P2, P3; split seam and sheet edge from the… |
| `96-pengguna-akses.html` Pengguna & Akses | settings (directory list-detail) | owner | 2 → 2 | 1 → 1 | fixed (P2, P3) |
| `97-penomoran.html` Penomoran Dokumen | settings (task queue / reference list) | owner | 9 → 7 | 6 → 7 | fixed (P2 x2 + review polish) |
| `98-pajak.html` Pajak | settings (reference/config) | owner | 1 → 1 | 0 → 1 | fixed (P2 x2, P3, review polish) |
| `99-akun-saya.html` Akun Saya | settings (account) | both | 5 → 4 | 2 → 2 | fixed (P2 x2, P3, review polish) |
| `00-tidak-ditemukan.html` Halaman tidak ditemukan | system page | both | 2 → 2 | 2 → 2 | fixed (reference row by its unit; optical placement of the… |

## `01-login.html` — Masuk
- **Purpose**: Sign-in flow in one card: credentials -> two-step verification -> handoff to Beranda. Measured reference page (REF-M2).
- **Role / job**: both — Sign in with the account the Owner gave me, quickly, without wondering which control to press.
- **Primary action (before)**: Masuk (full-width olive CTA)
- **Secondary actions (before)**: Lanjutkan dengan Google (outline, under 'atau'); Lupa kata sandi? (inline text that expands help); ID / EN language switch; Password reveal: 'Tampilkan' text button AND an eye icon inside the field
- **Visible actions (before, desktop / phone)**: 7 / 7
- **Problems found**:
  - *hierarchy, polish* — ID/EN segmented switch, top right of the form: The selected 'ID' pill has an olive fill and a drop shadow. After the CTA it is the strongest colour on the screen, so a low-frequency preference reads like a primary control.
  - *redundancy, minor* — Password field: 'Tampilkan' text button on the label row and the eye icon inside the field: Two controls toggle the same thing (both carry data-reveal, aria-controls=login-password). 05 Atur Kata Sandi already uses the eye only (r10 'one reveal control per field'), so the two auth pages disagree.
  - *routing, polish* — Done step, 'Buka Beranda' (#login-home): The link is hard-coded to 02-owner-dashboard.html, so with ?role=admin it lands on the Owner dashboard instead of 06. Shell brand links already resolve MCProject.navItem('beranda').
  - *spacing, polish* — Form slot inside the card: The form is anchored to the top: about 48 px above the title and about 95 px of empty card under the Google helper. At 1366 it is balanced (about 86/85).
  - *alignment, polish* — Form panel, right column: Three right edges: the ID/EN switch ends about 12 px past the fields (about 1227 vs 1215), 'Tampilkan' ends at about 1213. The form sits 60 px from the panel's left edge but 48 px from its right edge.
- **Proposed simplification**:
  - (P2, module) Remove the 'Tampilkan' text button and keep the in-field eye (same control as 05), with the same aria-pressed and label swap. Then the label row is just the label.
  - (P3, module) Make the language switch quieter: neutral selected fill, no shadow, compact height. Align its right edge with the field column and use equal left and right form insets inside the panel. At 1024-1280, centre the form slot vertically so the space above and below matches.
  - (P3, module) Resolve the done-step 'Buka Beranda' href (and any auto-handoff) from MCProject.navItem('beranda') so each role lands on its own Beranda.
- **After R11**: fixed
  - r11 (kept): one reveal control (the in-field eye, as on 05). 'Buka Beranda' (#login-home) takes its href from MCProject.navItem('beranda'): Owner goes to 02, ?role=admin goes to 06. Quiet ID/EN switch whose right edge sits on the field column. The…
  - Review fix (polish): the done panel now promises only what the role's Beranda shows. Owner (02): lead 'Ringkasan kinerja dan tindakan hari ini sudah menunggu di Beranda.'; features 'Proyek berjalan' / 'Kinerja periode ini' ('Penjualan, kas masuk, piutang,…
  - Admin variant (Beranda = 06 Antrean Tindakan): 'Antrean tindakan untuk perusahaan yang Anda kelola sudah menunggu di Beranda.'; features 'Proyek & gudang' / 'Penagihan & kas' / 'Dokumen & kasus', matching the 06 queue groups. Mechanism: t() uses a…
  - visible actions desktop 7 → 6, phone 7 → 6
- **Kept on purpose**: Split card: calm brand visual on one side, focused form on the other; on phones the visual is dropped and the brand row sits above the form · One strong CTA (Masuk); Google is a quiet outline under the 'atau' divider · Forgot password stays an inline sentence with expandable help, not an extra page or button · Fields at 16 px or larger on touch, with clear labels and icons · Verify and done…

## `05-atur-kata-sandi.html` — Atur Kata Sandi
- **Purpose**: Set a password from the Owner's one-time link: form / saved / expired-link states, no app shell.
- **Role / job**: both — Create a password that passes the rules on the first try, then go to sign-in.
- **Primary action (before)**: Simpan Kata Sandi (full-width olive CTA)
- **Secondary actions (before)**: Linked eye reveal in both fields; Done state: Masuk; Expired state: Kembali ke halaman Masuk
- **Visible actions (before, desktop / phone)**: 3 / 3
- **Problems found**:
  - *hierarchy, minor* — Explanatory blocks around the two fields: Four text blocks compete with two fields: the lead, a grey token-note box (security plumbing about 58 px tall, above the first field), the strength meter plus three rules, and a three-line helper after the CTA that restates the rules ('Tidak ada aturan huruf…
  - *density, minor* — Whole card (about 770 px tall): The card is taller than the 768 viewport, so a two-field page scrolls and the helper paragraph under the CTA is cut off at the fold.
  - *alignment, polish* — .sys-input vs Login .login-input: The page claims the Login visual language, but its input geometry differs: icon inset about 31 vs 25 px, placeholder starts about 63 vs 52 px from the field edge (desktop).
  - *card, polish* — Expired state, 'Minta tautan baru kepada Owner' box: A bordered box sits inside the card, which reads as a nested card. A plain ordered list would do.
  - *copy, minor* — Rules list between 'Kata sandi baru' and 'Ulangi kata sandi baru': Rule 3, 'Kedua isian sama', describes the confirmation field below it but sits above that field, so the reading order is wrong.
- **Proposed simplification**:
  - (P2, module) Fit the form in 768: turn the token note into one muted line without a box (or move it to the foot of the card). Move 'Kedua isian sama' under the confirmation field as its live match state. Fold 'no composition rules, paste allowed' into the rules list as one muted line. Drop…
  - (P3, system) Use one auth field primitive with the Login metrics (height, icon inset, placeholder offset, eye position) for both 01 and 05.
  - (P3, module) Expired state: render the three steps as a plain ordered list (no inner border). Keep the single exit button.
- **After R11**: fixed (P2, P3 and the review polish)
  - r11 (earlier): removed the grey token box (now one muted foot line), moved the match state under the confirmation field, folded the no-composition rule into a muted line, made the expired state a plain heading plus ordered list. The card fits 1366x768.
  - This round: the 'Tanpa aturan huruf besar…' note is no longer indented under rule 2 (.sys-rule--note padding-left 0, margin-top 2px), so it reads as a note to the whole list.
  - This round: rule markers and copy now match 99 Ubah Kata Sandi. The rows use a check-mark disc (.sys-rule__mark): grey, then green check, then red cross on failure (setRule in core.js). Rule 2 now reads 'Bukan kata sandi umum atau mudah ditebak' on both pages.
  - Verified: still fits 1366x768 without scrolling.
  - visible actions desktop 3 → 3, phone 3 → 3
- **Kept on purpose**: No shell, one narrow column, one CTA · Live rule checks with icon plus screen-reader state text, and a strength meter · One linked reveal for both fields (they are compared) · The saved state replaces the form (no toast over it) · The expired state explains the human steps (ask the Owner, path Pengaturan > Pengguna & Akses) · The token is stripped from the address bar

## `02-owner-dashboard.html` — Beranda
- **Purpose**: Owner Beranda: performance for the selected period (4 KPI), today's exceptions (Tindakan hari ini), receivable ageing, recent activity, running projects, project value. Measured reference page (REF-M1).
- **Role / job**: owner — In seconds, see how the business is doing this period and which exceptions need my decision, then drill into one.
- **Primary action (before)**: No single primary. The 'Tindakan hari ini' rows are the main action, but each row shows its own 110 px outline button (5 equal buttons).
- **Secondary actions (before)**: Date range (topbar on desktop, hero chip on phone); 4 KPI drill-downs (small round chevron plus whole tile); Laporan piutang link and 'Dalam jutaan (Rp)' unit select; Lihat semua (activity), Lihat semua (projects), 'Lab Jaringan FT' header link; Project row chevrons, activity feed rows; Phone:…
- **Visible actions (before, desktop / phone)**: 15 / 2
- **Problems found**:
  - *hierarchy, polish* — '5 perlu perhatian' chip: The olive attention chip with its dark sprout square is louder than the only urgent signal ('Mendesak') and is not actionable.
  - *density, minor* — Umur piutang, 'Dalam jutaan (Rp)' 152 px select: A display preference rendered as a full outline control competes with 'Laporan piutang'. At 1280 it wraps under the figure and adds a row.
  - *redundancy, minor* — Tindakan hari ini, 5 x 110 px outline buttons: The row is already the stretched link (::after over the row), yet each row draws a bordered button. Five equal boxed buttons in one card is the densest action cluster in the first viewport.
  - *redundancy, polish* — Hero subtitle vs topbar date range: The period '1–31 Okt 2026' is printed twice about 60 px apart (topbar trigger and '· 1–31 Okt 2026' in the hero subtitle).
  - *role, major* — Whole page for Admin Operasional: Route 'home' is roles:['owner'], but 02 never runs MCPage.guard (no body data-route; the page is driven by interactions.js). The Admin therefore sees the Owner dashboard: 'Ringkasan kinerja MultipleCorp', 'Laba manajerial', the row '4 aktivitas untuk…
  - *role, major* — Tindakan hari ini, row actions: Owner-facing rows mix oversight verbs with floor-execution commands: 'Terima Barang' (-> 32-barang-masuk) and 'Lengkapi' (-> 52-dokumen-administrasi) next to 'Lihat Piutang' and 'Tinjau'. The Owner reads them as tasks he must perform.
  - *alignment, major* — KPI row / main row / three-up row: Three unrelated column systems and gaps: KPI 279/285/284/285fr with 8.5 px gap, main 686/462fr with 11 px gap, three-up 369/378/394fr with 9 px gap (hero gap 7, row gap 13). No vertical seam lines up between rows. At 1366, KPI seams are about 503/787/1070,…
  - *alignment, minor* — 'Mendesak' pill in Tindakan row 1: The pill floats in a 1fr status column: about x 578 at 1366, about 600 at 1920, and at 1024 it hugs the button. It has no fixed anchor, and only one row has a pill.
  - *typography, minor* — Aktivitas terbaru / Proyek berjalan rows: Titles are 11 px, meta 10 px and pills 9.6 px, next to 13.5 / 11.5 px Tindakan rows and 20 px card titles. Row 3 reads cramped, and at 1920 its text looks tiny in wide cards.
  - *mobile, minor* — Tindakan hari ini rows: Each row is about 130 px: title, 2-line meta, then a separate 'Lihat Piutang >' line. On phones the row is not the target: .dash-action__btn becomes position:relative, so its ::after hit area only surrounds the text link. That contradicts desktop, where the…
  - *mobile, polish* — Disclosures: Umur piutang, Proyek berjalan and Nilai proyek are collapsed but Aktivitas terbaru is open, so there is no visible rule. For the Owner, ageing matters more than the feed.
  - *copy, minor* — Nilai proyek card header: The donut shows ONE project's billing composition (Rp186,4 jt dari Rp379,5 jt), but the title reads company-wide. The project only appears as a link label in the action slot ('Lab Jaringan FT ->').
- **Proposed simplification**:
  - (P1, module) Guard 02 like every other route: add data-route="home" to the body, or call MCRoutes.allowed('home') in the dashboard wiring. For the Admin, location.replace() to home.admin (06), with the canonical not-found ('Ke Beranda' -> 06) as fallback.
  - (P1, module) Put the dashboard on ONE 12-column grid with one gap token for columns and rows (e.g. 12 px): KPI span 3/3/3/3, main row 8/4 (its seam coincides exactly with the second three-up seam), three-up 4/4/4. Drop the measured fr ratios (static analysis A1 already proposed this). Keep…
  - (P1, module) Tindakan rows: remove the boxed 110 px buttons on desktop and tablet. The whole row stays the link (already stretched), ending in a fixed status slot plus a short muted label and chevron, with Owner-oriented labels (Lihat piutang / Lihat barang masuk / Lihat pengiriman / Lihat…
  - (P2, module) Lift row-3 text to the shared row tokens (title 13, meta 12, project pill mc-pill--xs) and re-check the three-up container breakpoints. Nilai proyek header: title 'Nilai proyek' with the project name as a subtitle link ('Perangkat Lab Jaringan FT'), not as the action-slot label.
  - (P3, module) Quiet the secondary chrome: unit select becomes a compact 'jt / Rp' segmented control in the legend header; drop the range from the hero subtitle on desktop (the topbar shows it); render '5 perlu perhatian' as a plain muted count.
- **After R11**: fixed
  - r11 (kept): MCPage.guard() role guard. ?role=admin gets the canonical not-found ('Ke Beranda' goes to 06, plus 'Cari'), and the top-bar period and the false current nav are removed. One 12-column grid with one gap token: KPI 3/3/3/3, main 8/4, three-up…
  - Review fix (minor): tablets are composed on purpose. At 901-1024 Aktivitas and Proyek share a row (--dash-span-three: span 6), and Nilai proyek keeps the full width. The density layer's 407*du main-row height no longer applies at 1024 or below (a scoped…
  - Review fix (minor): record numbers never truncate. In 'Barang masuk gudang' and 'SPK dari klien diunggah' the number leads the meta ('ARJ/PB/2026/09/0396 · Kabel UTP Cat6 305 m'), so the description takes the ellipsis.
  - Review fix (polish): the 'Perangkat Lab Jaringan FT' project link under 'Nilai proyek' is underlined like the card's other links (touch devices have no hover).
  - Review fix (polish): on phones the Tindakan titles use text-wrap: pretty, so there is no one-word orphan ('3 piutang jatuh tempo dalam / 7 hari').
  - visible actions desktop 11 → 5, phone 3 → 1
  - remaining: The KPI tiles keep their round chevron links (they drill to a different destination each, so they comply with D-28; the ux_density flag 'cards above fold 9' is the KPI + three-up grid, by design for an overview).
- **Kept on purpose**: Calm greeting hero; the date range sits in the topbar on desktop and as a hero chip on phones · Four KPI tiles with sparkline and delta; the whole tile is the link (desktop and phone) · 'Tindakan hari ini' as the Owner exception list with real counts and real destinations · Ageing bar with legend: numbers right-aligned, shares in their own column · Phone order (greeting > KPI 2x2 > Tindakan >…

## `06-antrean-tindakan.html` — Beranda
- **Purpose**: Admin Beranda: derived work queue in four canonical groups (Proyek & Gudang, Dokumen & Kasus, Penagihan & Kas, Penyelesaian Proyek). Each row links to where the next step happens.
- **Role / job**: admin — See the most urgent next piece of work across the companies I manage and open the place where I finish it.
- **Primary action (before)**: Open a queue row (row link with chevron). No page-level primary; the most prominent control today is the outline 'Muat Ulang' button.
- **Secondary actions (before)**: Tampilkan: Semua perusahaan (company view); Muat Ulang + 'Diperbarui 09.00 WIB'; Summary tiles (jump to group); Group links: Buka Gudang / Buka Kasus Koreksi / Buka Piutang / Buka Proyek
- **Visible actions (before, desktop / phone)**: 8 / 7
- **Problems found**:
  - *hierarchy, minor* — Toolbar, 'Muat Ulang' outline button with icon: It is the heaviest control in the first viewport, although the queue is computed on load. It pulls the eye away from the rows, which are the real work.
  - *density, minor* — Queue rows in about 550 px columns: Titles and meta wrap to 3-4 lines (rows 80-115 px). At 1024, in a single column, the same rows are 2 lines (title, then tag · project · note) and far calmer.
  - *redundancy, minor* — Breadcrumb 'Beranda' and 4 summary cards: A single-crumb trail on a top-level page, and four separate metric cards repeating the group titles. Both are addressed by Layer A D-27 (ancestors-only crumbs) and D-28 (one metric strip) in the working copy; verify on this page.
  - *routing, polish* — Dokumen & Kasus group link: 'Buka Kasus Koreksi' covers only half the group; the PDF document rows have no module link.
  - *alignment, major* — Group grid (.atq-grid, 2x2 locked rows): Groups have 7 / 6 / 7 / 3 rows, so the row-locked grid leaves a hole of about 145 px under Dokumen & Kasus and about 340 px under Penyelesaian Proyek (about 350 px at 1920). Card bottoms never align: uneven section geometry.
  - *alignment, minor* — Page head vs toolbar, metric strip and cards: Greeting and subtitle start 9 px right of the toolbar, metric strip and group cards (mc-page-head padding-left 9px from REF-M3; pt-page starts at the content edge).
  - *status, minor* — Dokumen & Kasus PDF rows; Penagihan invoice rows: State is repeated: title 'PDF … gagal dibuat' + end pill 'PDF gagal dibuat' + note 'buat ulang PDF…'; 'Invoice … belum ditagihkan' + end sub 'Belum Ditagihkan'.
  - *status, polish* — Row tone dots: The warning (orange) and pending (ochre) dots are nearly indistinguishable and have no legend.
  - *mobile, minor* — Toolbar and group headers: The toolbar takes two rows (full-width company select; stamp plus a 44 px 'Muat Ulang'), and group subtitles wrap to 2 lines. The first queue row starts around y 500, so about 60% of the first viewport is header, toolbar and summary.
  - *tablet, polish* — Company view select: The short value is truncated ('Semua perusah…') even though the row has plenty of free width.
- **Proposed simplification**:
  - (P1, module) Replace the row-locked 2x2 .atq-grid with independent stacks: one column up to about 1599 px (full-width rows, one-line meta as at 1024), and two independent column stacks (G1+G3 / G2+G4) from about 1600 px. Group order and content stay unchanged.
  - (P2, module) Demote refresh to a freshness pattern: 'Diperbarui 09.00 WIB' plus a ghost icon button (aria-label 'Muat ulang antrean') at the toolbar end. On phones, show the company view chip and the refresh icon on ONE row and hide group subtitles.
  - (P3, module) State one fact once: QS-08 rows use the date end value like other G2 rows instead of the rendition pill (the title already says gagal / masih dibuat); QS-09 drops the end sub 'Belum Ditagihkan'. Give the warning and pending tones clearly different hues.
- **After R11**: fixed (P1, P2, P3; the Layer A regression is resolved and hardened)
  - r11 (earlier): independent stacks instead of the row-locked 2x2 grid. Calm one-line row meta. Refresh is a muted stamp plus a ghost icon. canGo-gated rows and group links. Hollow pending ring. QS-08/QS-09 state said once.
  - This round (regression hardening): the phone toolbar again shows the Filter button, then 'Diperbarui 09.00 WIB' and the refresh icon at the right edge. Layer A MCFilter (03:55) puts a lone company view back into the phone sheet. core.css now also covers an…
  - The stamp markup is split: <span class=atq-stamp__lbl>Diperbarui </span><span data-atq-time>HH.MM WIB</span>. The reload handler updates [data-atq-time] only.
  - QS-09 'Invoice … belum ditagihkan' no longer appends '· PDF gagal dibuat'. The failed PDF is its own red QS-08 row in Dokumen & Kasus (same grant). The note stays only for a document outside the grant (never in the fixture).
  - Verified 390x844, 768x1024, 1024x768, 1366x768.
  - visible actions desktop 1 → 1, phone 1 → 2
- **Kept on purpose**: Four canonical groups by kind of work, sorted by urgency · Rows are pure links with a chevron (no row buttons): company tag, project, note, right-aligned end value · Capability-aware destinations (act(): purchase form / receive / record delivery, or a read-only fallback) · Per-group error with 'Muat Ulang Bagian Ini', clear empty copy per group, signals derived and never 'marked read' · Summary…

## `07-cari.html` — Cari
- **Purpose**: Full search results for ?q=: exact number or code first, names from 3 characters, grouped by type, scoped to the account's companies.
- **Role / job**: both — Find a record from a number, code or name I know and open it in one click.
- **Primary action (before)**: Type in the page field + Cari (dark green primary)
- **Secondary actions (before)**: Example chips (4) in the empty state; Type segmented control (Semua / Proyek / Dokumen / Produk…); Tampilkan: perusahaan (company view; Filter button on phone); Clear ×, result rows
- **Visible actions (before, desktop / phone)**: 6 / 5
- **Problems found**:
  - *redundancy, major* — Topbar shell search vs page search field: Two search fields stacked about 130 px apart with different placeholders and different behaviour: the topbar opens the command palette, the page field runs this page. A first-time user cannot tell which to use. On phones the appbar search icon repeats it.
  - *redundancy, minor* — Counts: The count appears in the segmented control ('Proyek (1)'), the note ('4 hasil untuk "Laptop"') and every group subtitle ('1 hasil').
  - *redundancy, polish* — Breadcrumb 'Cari': A single crumb on a top-level page. Addressed by D-27 in the working copy.
  - *alignment, minor* — Search row vs results: Field and Cari end at about x 1038 while the intro card and results span to about 1349. In the exact-match state, 'Tampilkan: Semua perusahaan' sits alone on its own row at the far right (orphan row).
  - *table, minor* — Result groups: A 1-result group stacks card, section header, table header and one row. Column positions differ between stacked groups (Perusahaan at about x 799 vs 712), so the stack looks ragged.
  - *mobile, minor* — Results first viewport; empty-state chips: Title, subtitle, field, hint, segmented control (scrolls sideways, 'Produk' clipped), Filter button and count come first, so results start around y 420. The example chips wrap into a ragged centred 3-line cluster.
  - *copy, minor* — Subtitle, hint line, intro card: The same guidance appears three times before any result: the subtitle, the persistent hint under the field ('…nama dicari mulai 3 huruf'), and the intro text, whose title restates the subtitle.
- **Proposed simplification**:
  - (P1, system) One search per screen: on route 'search', hide the topbar search field (desktop) and the appbar search icon (phone), or make them focus #cari-q with the current query. The palette stays reachable via Ctrl K.
  - (P2, module) Compose the page as one column: field (flex 1) + Cari across the content width, then ONE toolbar line (type segmented left, result count, company view right). Show the guidance only in the intro empty state (drop the persistent hint), and give the intro a title that does not…
  - (P3, module) Drop the 'N hasil' group subtitles (counts live in the segmented control) and use one column template across groups (Catatan / Perusahaan / Konteks / Tanggal / Status/nilai right) so stacked tables align. On phones, hide subtitle and hint once a query exists, put Filter as an…
- **After R11**: fixed (module P2/P3 by its unit; P1 one search per screen by the shell unit: the top-bar search and app-bar icon are hidden on route search, Ctrl K stays)
  - r11 (earlier): field + Cari span the column. Persistent hint removed (guidance in the intro only). One toolbar line: types / count / company view. Group 'N hasil' subs dropped. Shared column template.
  - This round (regression hardening): on phones the type switch swipes next to a 44 px Filter icon (Layer A sheet). If the company select ever stays inline, it is compact (max 136 px, label hidden, ellipsis) instead of taking the row.
  - The type switch gets a right-edge fade (.cari-types.is-more, mask-image) only while more types sit off-screen. The fade clears at the scroll end (segFade on scroll and resize).
  - Exact-match phone row: the matched number or code is the row title ('ARJ/PRJ/2026/0142', never truncated). The record name moves into the truncatable meta after the kind chip and company tag, and is skipped when it equals the code.
  - Stacked groups share one representation. harmonize() runs after paint and on resize (220 ms, after the r10 fit). If any group fell back to rows (768 portrait), every group shows rows: no table/row mix.
  - First column labels no longer repeat the group title. Transactional groups use 'Catatan' (Proyek, Pembelian, Invoice, Dokumen, Pembayaran), master data uses 'Nama' (Produk, Klien, Pemasok).
  - 768–1023: the 'Tampilkan:' prefix folds away (the value says it), so types + company view keep one line.
  - Verified 390x844 (Owner + Admin, both queries), 768x1024, 1024x768, 1366x768, 1920x1080.
  - visible actions desktop 5 → 5, phone 4 → 4
  - remaining: Counts are for the intro state. With results the first viewport has 2 buttons on desktop and on phone (density tool, 0 flags).
- **Kept on purpose**: Exact-match group first, with 'pilih yang dimaksud' disambiguation · Type segmented control only when more than one type has hits; counts per type · Company scoping that never hints at records outside the account · Explicit states: intro, 'Ketik minimal 3 huruf', empty with 'Kosongkan pencarian' · Clear × in the field, q synced to the URL, keyboard dismissed on phone submit

## `10-proyek.html` — Proyek
- **Purpose**: Daftar Proyek: every project of the companies in scope, with deadline, value, derived attention count and status; the entry point to the project hub.
- **Role / job**: both — Owner: see at a glance which projects need attention (overdue, open signals, value at stake) and drill into one. Admin: find the project I am working on fast (search by name, number or client) and open its hub, or start a new project.
- **Primary action (before)**: Buat Proyek (header, primary green) -> 12-proyek-baru.html; gated by projects.manage (Owner + Admin both have it).
- **Secondary actions (before)**: Penawaran (header outline button) -> 13-penawaran.html (sibling list; no sidebar entry exists for it); Search + Tampilkan (company view) + Status + Klien + Urutkan in the toolbar; Row click -> 11-proyek-detail (project hub); Empty-filtered state: Hapus filter
- **Visible actions (before, desktop / phone)**: 7 / 5
- **Problems found**:
  - *hierarchy, minor* — Header actions: 'Penawaran' is plain navigation to a sibling list, but it is shown as an outlined button the same size as the primary 'Buat Proyek'. On the phone the two sit side by side as equal full-width buttons (y=161..205) and use a whole row of the first viewport, so…
  - *redundancy, minor* — Page subtitle, list card head, sort select: 'terbaru lebih dulu' is said three times: in the H1 subtitle ('…, terbaru lebih dulu.'), in the card sub 'Terbaru lebih dulu' under 'Daftar proyek', and in the select 'Urutkan: Terbaru'. The card title 'Daftar proyek' repeats the H1 'Proyek'. On the phone…
  - *redundancy, polish* — Breadcrumb above H1: A top-level list shows the breadcrumb 'Proyek' above the H1 'Proyek'. r11 D-27 (patterns.js crumbs) already hides the trail on top-level pages; confirm the change lands here.
  - *alignment, minor* — Page header vs toolbar/card: The H1 'Proyek' ink starts at x=245 while the search field and the list card start at x=236 and the card content at x=257. The header sits on a third edge (the REF-M3 9px .mc-page-head inset). The right side is flush (actions end at 1350 = card edge), so the…
  - *filters, major* — Toolbar under the page header: Search (420px) + Tampilkan + Status + Klien fill row 1 and 'Urutkan: Terbaru' wraps alone onto row 2 (x=236..435, y=199..229), while the Klien select on row 1 stretches to 255px. The orphan row is visibly unbalanced and adds 38px before the table. At…
  - *table, polish* — Table: Proyek + Perusahaan columns: The company code shows twice per row: as the tag column and as the 'ARJ/PRJ/…' prefix of the number. The column is only needed when several companies are shown; with 'Tampilkan' set to one company it is pure repetition.
  - *mobile, major* — Toolbar row under the search field: Phone filter chips scroll sideways: 'Tampilkan: Semua perusah…' is cut off and 'Status: Semu' runs off the right edge (density flag 'phone filter row scrolls sideways'). The brief forbids this. The r11 Layer A MCFilter now shows search + Filter only below…
  - *mobile, minor* — Phone list rows: Titles truncate early ('Laptop Guru dan Tenaga Kep…', 'Perangkat Lab Jaringan Faku…') because the status pill takes the end slot. The meta line 'ARJ ARJ/PRJ/2026/0163 · Yay…' loses the client name entirely, and the company code shows twice (tag + number…
- **Proposed simplification**:
  - (P1, module) Toolbar on one row at >=1024: keep search + Tampilkan + Status visible, move Klien into the Filter panel (MCFilter visible: 1). Take 'Urutkan' out of the filters and render it as a compact sort select on the right of the list card head, where it replaces the static sub 'Terbaru…
  - (P1, module) Header actions through MCActions: 'Buat Proyek' = the single primary. 'Penawaran' becomes a quiet secondary (ghost/text link with arrow) on desktop and moves into the phone overflow, so the phone first viewport shows one CTA. Alternative (system, shared with 13): a two-item…
  - (P2, module) Replace the card head 'Daftar proyek / Terbaru lebih dulu' with a result line ('10 proyek', updated by apply()) plus the sort control. Shorten the H1 subtitle to 'Semua proyek dari perusahaan yang Anda kelola.'
  - (P2, module) Phone row: meta = company tag + client name (drop the duplicated number prefix, or show the number only in the hub). End slot = status, plus either the deadline or the signal count in tone text ('6 tindakan') when signals exist, so attention is visible on phones.
  - (P3, module) Hide the Perusahaan column (and the inline tag) when the company view is set to a single company; keep it under 'Semua perusahaan'.
- **After R11**: fixed
  - Review minor (one-item navigation overflow): the 'Tindakan Lain ▸ Lihat Penawaran' def is gone. The sibling lists are now a module sub-nav, 'Proyek · Penawaran', placed under the header with Layer A MCPage.subnav (D-39, the same pattern as Gudang). The…
  - Review minor (role emphasis): 'Buat Proyek' is the primary for the Admin and a quiet secondary (outline) for the Owner. On phones the Owner's secondary is still the one visible header control. Capability projects.manage is unchanged.
  - Review polish (Status column): a running project shows a muted 'Aktif' text. Only exception states (Draf, Selesai, Selesai paksa, Dibatalkan) get a pill (D-32).
  - Polish: the 'Klien' column title uses Layer A .pt-cell__title--quiet, so the project name is the strongest text, as on 13.
  - The list head migrated to Layer A .pt-listhead, so '10 proyek' now starts on the table's text column. Before, it sat about 7 px to the left after the Layer A first-cell padding change. The whole head (count and sort) hides when no rows show.
  - The sort select sizes to the chosen option (field-sizing: content), so it is compact on phones.
  - Phone rows: long names wrap to two lines (MCList phone.wrap) and are no longer cut by the end slot.
  - The empty state no longer repeats the header's 'Buat Proyek' button (one control per destination).
  - visible actions desktop 2 → 1, phone 2 → 1
  - remaining: ux_density: no flags. The count covers header action controls only. Filters, sort and the sub-nav links are not counted.
- **Kept on purpose**: Company tag folding into the project cell below 1300px and the client column hiding below 1100px (column priority) · Right-aligned tabular 'Nilai' column; money column hidden without finance.view · Deadline cell with relative phrase ('23 hari lagi'), warning tone at 14 days or less · Perhatian count as text + tone dot (never colour only), with the signal list in the title tooltip · Empty and…

## `11-proyek-detail.html` — Detail Proyek
- **Purpose**: Project hub (detail-hub): header, key figures, derived 'Perlu tindakan' signals and 11 parts as tabs; every cross-module list leads back here.
- **Role / job**: both — Owner: understand the project's health (value, billing, fulfilment, deadline), see the exceptions and decide or drill down. Admin: see the next required step for this project and go to where it is recorded, or check a part (items, deliveries, documents).
- **Primary action (before)**: Derived header CTA: 'Buat Pembelian' (shortage && cost.view) or 'Catat Pengiriman' (undelivered dispatch), 'Penawaran' for Draf. Fixture: Buat Pembelian -> 03-create-purchase.html?proyek=prj-arj-0142.
- **Secondary actions (before)**: Penyelesaian (header outline) -> 15-penyelesaian-proyek; 6 signal rows -> dokumen.admin / pengiriman.catat / gudang.masuk / kasus.list / pembelian.form; 11 tabs (Ringkasan … Riwayat); Ringkasan: 'Lihat semua' (Syarat penyelesaian) -> 15, 'Semua riwayat' -> Riwayat tab, activity links; Tab-level:…
- **Visible actions (before, desktop / phone)**: 20 / 4
- **Problems found**:
  - *hierarchy, major* — First viewport: KPI row + 'Perlu tindakan' card: The six full-width signal rows (52px each, about 380px including the head) push the tab strip down to y=706 at 1366. At 1024x768 the tabs are not in the first viewport at all. After clicking a tab (e.g. Item) its content starts below the fold (notice at…
  - *hierarchy, minor* — Header actions: 'Penyelesaian' (outline) sits beside the primary although the gate is 2/10 and nothing can be completed. It is a rare, late-stage action that is also reachable from Ringkasan 'Syarat penyelesaian -> Lihat semua'. On the phone the two buttons split a full row…
  - *density, minor* — Tab strip: 11 tabs need ~1295px (measured at 1920). At 1366 'Dokumen Ad…' is clipped by the fade mask and 'Riwayat' is invisible. 'Dokumen' and 'Dokumen Administrasi' are two similar labels next to each other. Every tab carries a count badge, so 10 small numbers…
  - *redundancy, minor* — Signals vs header CTA vs Item tab notice vs Ringkasan 'Syarat penyelesaian': 'Kekurangan stok: 1 Laptop 14 inci' (signal -> pembelian.form), the header primary 'Buat Pembelian' and the Item-tab notice button 'Buat Pembelian' all go to the same form. The Ringkasan 'Syarat penyelesaian' mini list repeats the blockers already listed as…
  - *role, major* — Pemenuhan tab section 'Barang Keluar' + command palette: 'Catat Barang Keluar' (-> 33-barang-keluar.html?proyek=…) is rendered with no capability check. The Admin preview (Sari) has no stock.dispatch (project-config comment: 'Barang Keluar is Bagas's work'), so she is offered a floor task she cannot perform.…
  - *spacing, minor* — Ringkasan > Informasi proyek (pt-kv): The kv label column is 38% of the card, so at 1920 'Klien' sits at x=275 and its value at x=637 (362px gap). At 1366 the gap is 240px with 40px rows, which reads as a sparse two-column table rather than a fact list.
  - *card, polish* — KPI tiles: Tile 1 note wraps to two lines ('Termasuk PPN · dari penawaran yang disetujui'), tiles 2 and 4 have one line, tile 3 has a bar plus a note. The equal-height tiles leave Tenggat with ~30px dead space, giving four different text rhythms in one row.
  - *status, polish* — Header meta status pill 'Aktif': The project state is rendered with live: true (pulsing dot). A project being Aktif is not live state; the pulse draws the eye to the least informative element in the header.
  - *typography, minor* — 'Perlu tindakan' rows: Every signal is one semibold sentence; record numbers, verbs and dates share the same weight, so nothing anchors the scan. Rows are not ordered by tone (warning, pending, info, warning, warning, warning). At 1920 the chevron sits ~1600px from the text, so…
  - *typography, polish* — Ringkasan > Aktivitas terbaru: Each activity sentence is fully underlined as a link (four multi-line underlined blocks). The heavy underline noise is out of proportion to its secondary importance; two items also link to the same payment (density dupe '64-pembayaran … x2').
- **Proposed simplification**:
  - (P1, module) Recompose the hub fold: header -> compact KPI row -> tab strip directly. Move 'Perlu tindakan' into the Ringkasan tab as its first block (left column, above Informasi proyek), sorted danger > warning > pending > info, showing the top 3 with a 'Lihat semua (6)' expander. Record…
  - (P1, module) Header through MCActions: primary = the derived next step only, gated by the destination's capability (purchase.manage for Buat Pembelian, delivery.record for Catat Pengiriman). 'Penyelesaian' goes to the overflow ('Lainnya') while the gate is unmet and becomes the primary only…
  - (P1, module) Role fix: render 'Catat Barang Keluar' in the Pemenuhan tab and in the palette only with A.can('stock.dispatch'), same rule as gudang.js / pengiriman.js. For the Admin the section keeps its list without the button.
  - (P2, module) De-duplicate the Ringkasan tab: 'Informasi proyek' keeps PIC klien, Saluran, Konfirmasi, Dibuat and Penanggung jawab (Klien/Unit/Perusahaan/Tenggat are already in the header and KPI). 'Syarat penyelesaian' becomes a single progress row ('2 dari 10 terpenuhi · Lihat…
  - (P2, module) Make the tab strip fit at 1366: rename the tab 'Dokumen Administrasi' to 'Administrasi' (section title unchanged) and show Pembayaran as a second section inside the Penagihan tab (the two lists stay separate, so the finance concepts stay distinct). 10 tabs, about 1110px. Show…
  - (P3, module) Header status pill without the live pulse (A.st('project', state, { size: 'lg' })). Shorten the KPI notes to one line each ('Termasuk PPN · penawaran disetujui') so the four tiles share one text rhythm.
  - (P3, module) Role-aware signal routing (presentation only): for the Owner, signals open the record (purchase detail, dispatch record, case) instead of the floor-task form (gudang.masuk, pengiriman.catat). For the Admin they keep pointing at the task.
- **After R11**: fixed
  - Review minor (bar not rendered): .prj-metric__bar is display:block. The Ringkasan readiness line now shows its bar ('2 dari 10 terpenuhi' + bar) at every width.
  - Review minor (desk-only drafting): the Draf header adds 'Buat Penawaran' only when !UI.phone(). The header re-renders on the (max-width: 767px) breakpoint change, as 14 does.
  - Review note (single navigation item in the overflow): the completion page is never a header control. Ringkasan links it through 'Syarat penyelesaian › Lihat semua'. Projects without a stored gate (every fixture project except prj-arj-0142) get an 'Informasi…
  - Review polish (Penagihan): an unbilled invoice shows '—' under Jatuh tempo (the 'Belum Ditagihkan' pill says it).
  - Review polish (Administrasi): met requirements show only the check mark (the words are visually hidden for screen readers). Pills remain only for Disiapkan / Belum ada / Tidak berlaku.
  - Review polish (Draf hub): the 760 px cap on the single 'Informasi proyek' card is removed. The Tenggat tile shows the days-left phrase for Aktif and Draf; closed projects show the date only. Draf projects drop the 'Konfirmasi: Belum dikonfirmasi' fact (the…
  - Review polish (1024 px): the 2×2 metric breakpoint moved from 1100 to 900 px, so the four figures stay one row at 1024 and the tab row rises.
  - Signals use the Layer A UI.signals rowCls:'prj-signal' (no string replace). Part captions align with the table text column (card padding). The module :empty header rule is removed (Layer A has it).
  - visible actions desktop 2 → 1, phone 2 → 1
  - remaining: The Ringkasan columns end at different heights. This is deliberate: there are no forced equal heights.
  - remaining: The tab row sits flush on the panel card. That spacing comes from the Layer A MCTabs design.
- **Kept on purpose**: Derived signals that resolve themselves when the action is recorded, each linking to where the action happens · One derived header CTA chosen from project state (no static button set) · Komposisi nilai: five finance concepts as separate labelled bars with the explanatory help line · Phone drill-in 'Bagian proyek' list with a one-line fact per part (e.g. '7 item · kekurangan stok') · Permission…

## `12-proyek-baru.html` — Buat Proyek
- **Purpose**: Buat Proyek: record a client request as a Draf project (company, client/unit/PIC, name, channel, deadline, items with fulfilment mode and price) via a COMMIT confirmation.
- **Role / job**: admin — Admin (or Owner acting as one): enter a new client request quickly and correctly, see the proposed value, save it as Draf, and continue to the quotation.
- **Primary action (before)**: Simpan sebagai Draf (sticky action bar, COMMIT confirm) -> creates the Draf project and shows the success state.
- **Secondary actions (before)**: Batal (action bar; DESTRUCTIVE confirm only when dirty) -> 10-proyek; Tambah Item (Item section head; bottom of the list on phone); Hapus item (trash per line); Ganti (picked client); Tambahkan di Data Master (hint link) -> 85-data-master?jenis=klien; Success: Buka Proyek / Buat Penawaran / Buat…
- **Visible actions (before, desktop / phone)**: 7 / 3
- **Problems found**:
  - *hierarchy, minor* — Success state (after save): The copy says 'Langkah berikutnya: susun penawaran', but the primary is 'Buka Proyek' (navigation) while 'Buat Penawaran' and 'Buat Proyek Lain' are two equal large outline buttons, so three large buttons follow one save.
  - *density, minor* — Whole form: The form uses the full data width (1114px at 1366, ~1650px at 1920). The two top cards split 50/50 so the 'Nama proyek' input is 510px wide and the Perusahaan select 510px; at 1920 they would be ~800px. There is no FORM container mode, so the eye travels…
  - *redundancy, minor* — 'Setelah disimpan' card + 'Ringkasan nilai' card + sticky bar: Two of the five cards are not form input. 'Setelah disimpan' is a 3-step explainer whose step 3 repeats the page subtitle and the Ringkasan help line ('nilai menjadi terkonfirmasi setelah penawaran disetujui'), which makes three copies. 'Ringkasan nilai'…
  - *redundancy, polish* — Breadcrumb 'Kembali / Proyek / Buat Proyek': 'Kembali' and 'Proyek' go to the same list (density dupe '10-proyek.html x2'). D-27 removes 'Kembali' in Layer A.
  - *routing, minor* — Klien hint link 'Tambahkan di Data Master' (+ the same link in the no-result message): The link navigates away from a possibly dirty form with no guard (no beforeunload in proyek-x.js; Batal has a DESTRUCTIVE confirm, this link does not). When a search has no result the hint link and the empty-result link 'Tambahkan klien di Data Master' are…
  - *card, minor* — Top two cards: 'Perusahaan dan klien' ends at y=485 and 'Informasi proyek' at y=519, a 34px ragged bottom edge directly above the full-width 'Item proyek' card. The right card carries the channel radio cards and the deadline/owner pair, so the two halves never balance.
  - *mobile, minor* — Bottom of the phone viewport: The sticky action bar (Batal + Simpan, y=716..756) is stacked on top of the bottom nav (y=785..844). About 130px of permanent chrome on an 844px screen while filling a long form, and the bottom nav invites leaving a dirty form.
- **Proposed simplification**:
  - (P1, system) Introduce a FORM page mode (e.g. .pt-page--form, max-width ~1040px, left edge aligned with the header) and stack the sections in one column: Perusahaan & klien -> Informasi proyek -> Item proyek. The item grid keeps the container width. This removes the ragged 50/50 pair and…
  - (P1, module) Remove the 'Setelah disimpan' card (the subtitle and the success state already state the next steps). Fold 'Ringkasan nilai' into the Item section footer as DPP / PPN 11% / Nilai usulan rows (the same tfoot pattern as 14 Rincian penawaran), with the help line once. The sticky…
  - (P2, module) Success state: 'Buat Penawaran' primary when quotation.manage (it is the stated next step), 'Buka Proyek' secondary outline, 'Buat Proyek Lain' a text link.
  - (P2, system) On phones, routes with a pt-actionbar (FORM archetype) hide the bottom nav while the form is open; the action bar takes its place.
  - (P3, module) Guard the Data Master link when the form is dirty (open it in a new tab or reuse the 'Buang isian' DESTRUCTIVE confirm), and show only one 'Tambahkan klien' link (hide the hint while the no-result message is visible).
- **After R11**: fixed
  - The reviewer raised no defect for this page; the round 1 composition is kept (one column of sections, FORM 1120 container, dirty guard).
  - Feedback is now one channel: the MCRisk success toast is removed, and the inline result card (.prx-done, focused) reports the save.
  - On phones the success state promotes 'Buka Proyek' and does not offer 'Buat Penawaran', because quotation drafting is a desk task. Desktop keeps 'Buat Penawaran' primary + 'Buka Proyek' outline + 'Buat Proyek Lain' link.
  - The module :empty header rule is removed (Layer A .pt-head__actions:empty).
  - visible actions desktop 4 → 2, phone 2 → 2
- **Kept on purpose**: Search-first client combobox with keyboard support, then unit, then PIC (dependent selects with clear placeholder reasons) · Perusahaan never prefilled for multi-company accounts + live 'Nomor proyek berikutnya' hint · Inline validation with the error count in the action bar and focus on the first error (no dialog) · COMMIT confirm with a summary; DESTRUCTIVE discard confirm only when something…

## `13-penawaran.html` — Penawaran
- **Purpose**: Penawaran: list of quotation revisions across projects (state, validity, total), with the desk task 'Buat Penawaran' for Draf projects without a quotation.
- **Role / job**: both — Admin: find the quotation to issue, follow up or record the client answer; start the first quotation of a Draf project. Owner: see which quotations await the client or are about to expire.
- **Primary action (before)**: Buat Penawaran (header primary, desk only, quotation.manage) -> sheet of eligible Draf projects -> COMMIT draft revision 1.
- **Secondary actions (before)**: Search + Tampilkan + Status; Row click -> 14-penawaran-detail; In-row project link -> 11 project hub; Project chip 'Proyek: X x' when opened from a hub
- **Visible actions (before, desktop / phone)**: 14 / 3
- **Problems found**:
  - *redundancy, minor* — List card head: 'Revisi penawaran / Terbaru lebih dulu · revisi lama tetap tersimpan dalam rantai revisinya' repeats the subtitle ('…, terbaru lebih dulu') and wraps to three lines on the phone (y=303..360) before the first row.
  - *redundancy, polish* — Breadcrumb 'Kembali / Proyek / Penawaran': 'Kembali' and 'Proyek' share a destination (density dupe '10-proyek.html x2'); D-27 resolves it.
  - *routing, polish* — Rows: Each row has two destinations: the row goes to the quotation, and the underlined project name inside it goes to the project hub. Eight underlined links in the middle of the table add noise and make the row target ambiguous.
  - *table, minor* — Columns 'Penawaran' and 'Proyek dan klien': The strongest text in each row is the generic 'Revisi 1' / 'Revisi 2' (repeated eight times), and the identifying object, the project name, sits in the second column at the same weight. Scanning for 'which project's quote' means reading column 2. The phone…
  - *mobile, major* — Toolbar: Same sideways-scrolling chip row as 10 ('Tampilkan: Semua perusah…', 'Status: Semu' cut at the edge). The r11 MCFilter phone mode (search + Filter) should cover it.
- **Proposed simplification**:
  - (P2, module) Merge the first two columns: title = project short name (strongest, links to the quotation like the row), sub = 'Revisi N · BTN/PNW/2026/10/0017'. Client becomes its own quieter column (or the sub of the project). The in-row hub link goes, since the hub is one click away from…
  - (P2, module) Card head = result count ('8 revisi'); drop the long sub (the revision-chain rule lives on the detail page). Subtitle 'Semua revisi penawaran dari proyek yang Anda kelola.'
  - (P3, system) Share a quiet 'Proyek · Penawaran' module sub-nav with 10 (replaces 10's 'Penawaran' outline button and gives 13 a visible way back besides the crumb).
- **After R11**: fixed
  - Review major (two 'Buat Penawaran' CTAs): while the list is scoped to one project (?proyek=), the header stays empty. That project's create command is the one CTA, in the empty state. Header 'Buat Penawaran' (pick among eligible projects) returns when the…
  - Review minor (record numbers truncated): phone row meta puts the number first, and the number never truncates (.prx-row-num flex:none). 'Revisi N' takes the ellipsis. Drafts read 'Revisi N · belum bernomor'. Titles wrap to two lines (phone.wrap), so two…
  - Review minor (desk-only drafting): the scoped empty state on phones says 'Penawaran disusun dan diterbitkan dari layar komputer.' with no button. It is re-evaluated on breakpoint change.
  - Review minor (chip squeezes search): on phones the project chip is its own row (.prx-chiprow) under the toolbar; the empty end slot hides itself. Desktop keeps it in the toolbar end slot. The chip moves on breakpoint change and the row is removed when cleared.
  - Review optional: the result line ('0 revisi penawaran') hides while an empty state shows.
  - Bug fixed: after clearing the chip, a filtered-empty list showed the project-specific empty state. emptyForProject() now resets to the generic state.
  - Role emphasis: the Owner's scoped empty-state create is outline. The Admin keeps primary.
  - Feedback is one channel: no success toast after creating a draft. The flash's 'Buka Draf' is outline, never a second green CTA beside the header primary.
  - The module sub-nav 'Proyek · Penawaran' (D-39) gives a visible way back to 10 besides the crumb. The list head migrated to Layer A .pt-listhead, and 'Klien' uses .pt-cell__title--quiet.
  - visible actions desktop 1 → 1, phone 0 → 0
  - remaining: Scoped view (?proyek=prj-arj-0163, Admin), desktop: before = header primary + empty-state primary (2 identical CTAs); after = the empty-state CTA only.
  - remaining: ux_density flags 'same destination twice: 10-proyek.html' because the ancestor crumb 'Proyek' and the sub-nav 'Proyek' both lead to 10. This is the D-39 pattern as used on Gudang 34/35; see sharedRequests.
- **Kept on purpose**: Single-row desktop toolbar (search + company view + Status) · Buat Penawaran hidden on phones (desk task) with the sheet listing only eligible Draf projects · Project filter chip with a clear button when arriving from a hub, counted as a filter · Derived 'Kedaluwarsa' state and validity countdown with warning tone within 7 days · Totals right-aligned and tabular; phone end slot shows status +…

## `14-penawaran-detail.html` — Detail Penawaran
- **Purpose**: Detail Penawaran: one revision with its lines, totals, validity, client answer, revision chain and DOC-01 document. Draft: edit + preview + issue. Sent: record the client answer. Approved/rejected/expired: read + revise.
- **Role / job**: both — Admin: issue the draft after preview, record the client's answer on the latest sent revision, or start a revision. Owner: review what was offered at what price and whether the client approved.
- **Primary action (before)**: State-dependent: DRAFT 'Pratinjau & Terbitkan'; SENT 'Catat Jawaban Klien'; EXPIRED/REJECTED latest 'Buat Revisi'; APPROVED (sample) 'Buka Proyek' (navigation shown as primary).
- **Secondary actions (before)**: Buat Revisi (outline, desk only); Project link in header meta -> 11; Rantai revisi rows -> other revisions; Dokumen card: Lihat Dokumen (inline preview) + 'Buka di Dokumen' -> 51; Draft: Simpan Draf, Masa berlaku select; preview: Tutup Pratinjau / Terbitkan / Unduh PDF
- **Visible actions (before, desktop / phone)**: 6 / 2
- **Problems found**:
  - *density, minor* — Rincian penawaran table: Six columns spread over 1114px: 'Harga satuan' ends at x=1067 and 'Nilai' at x=1336, a ~270px empty band, and 'Mode' floats mid-table. The footer note 'Berlaku sampai 26 September 2026 · harga termasuk PPN 11%' repeats Ringkasan 'Berlaku sampai'.
  - *redundancy, polish* — Dokumen Penawaran card: 'Lihat Dokumen' (inline preview) and 'Buka di Dokumen' (module) are two ways to the same document side by side, plus two pills 'Terbit' + 'PDF siap'.
  - *redundancy, polish* — Breadcrumb 'Kembali / Proyek / Penawaran / Revisi 2 · ARJ/PNW/2026/09/0021': 'Kembali' duplicates the 'Penawaran' crumb (density dupe '13-penawaran.html x2'), and the current crumb repeats the H1 + meta number; D-27 addresses both.
  - *routing, minor* — Header actions (APPROVED revision): 'Buka Proyek' is the green primary but it is navigation, and the same hub is linked from the header meta ('Perangkat Lab Jaringan FT', underlined) and from Ringkasan > Proyek, so the same destination appears three times. On the phone it is a full-width green…
  - *card, minor* — Lower 50/50 grid (Ringkasan vs Rantai revisi + Dokumen): The left 'Ringkasan' card runs to y=1442 and the right stack ends at y=1260: a 180px ragged bottom. The project/client context sits below a 660px table, so a reviewer reads prices before knowing the PIC or validity.
  - *status, minor* — Head pill + green notice + Ringkasan + Rantai revisi: 'Disetujui klien' is stated four times in one screen: header pill, notice banner 'Disetujui klien 18 September 2026', Ringkasan row 'Jawaban klien: Disetujui klien · 18 September 2026' and the chain row pill. The banner adds no next step in this terminal…
  - *mobile, polish* — Header meta: The meta wraps into three lines (number + tag / project link alone / client + status pill), so the header takes 200px before the primary.
- **Proposed simplification**:
  - (P1, module) Header through MCActions per state. APPROVED: no primary; the project stays reachable through the meta link, and 'Buat Revisi' goes to 'Lainnya'. SENT: primary 'Catat Jawaban Klien', 'Buat Revisi' to the overflow. EXPIRED/REJECTED latest: primary 'Buat Revisi'. DRAFT: primary…
  - (P2, module) Desktop >=1280: two-column DETAIL layout. 'Rincian penawaran' is the main column (~65%, so the table tightens), with a right rail stacking Ringkasan, Rantai revisi and Dokumen Penawaran. The ragged lower grid goes away and the context sits next to the prices. Below 1280 keep…
  - (P2, module) One status voice. Keep the head pill. Show the notice banner only for actionable states (DRAFT, SENT, EXPIRED); for APPROVED/REJECTED the answer lives in Ringkasan. Drop the duplicate 'Berlaku sampai' footer when Ringkasan shows it.
  - (P3, module) Dokumen card: one inline action 'Lihat Dokumen' with 'Buka di Dokumen' as a quiet text link aligned right; show only the rendition pill when the document is Terbit.
- **After R11**: fixed
  - Review major (broken rail fact list): '.prx-qside .pt-kv { grid-template-columns … }' is deleted. Layer A has since removed the kv container query (patterns.css 04:16), so the rail uses the plain Layer A two-column kv. Labels and values now share a baseline,…
  - Review major (ragged 50/50 band at tablet widths): the 768–1279 px two-column band is removed. Below 1280 px, Ringkasan and Rantai revisi stack full width under the main column (verified at 1024 and 768).
  - Wide screens (≥1600 px) use a 380 px rail, so 'Berlaku sampai' stays on one line where type is larger.
  - Dokumen card: a READY PDF is the normal state, so it is quiet. Only a pending or failed rendition (or an unusual document state) gets a pill (D-32, as in the hub's Dokumen part).
  - Feedback is one channel: Terbitkan / Catat Jawaban / Buat Revisi no longer toast on top of their inline result. The flashes after issuing and after a rejection no longer repeat the header's next step ('Catat Jawaban Klien' / 'Buat Revisi'). The revise flash…
  - 'Buat Revisi' from the menu returns focus through Layer A MCMenu.trigger (the local fallback is kept).
  - visible actions desktop 2 → 1, phone 1 → 0
  - remaining: In the 300–340 px rail at 1366 the 'Unit · PIC' value wraps to 3 lines. The values are long; the layout is correct.
- **Kept on purpose**: One primary per state already computed in render() (only the APPROVED branch promotes navigation) · Nothing issued without its preview: issuing happens from the preview footer with the next number shown · Answer panel inline (no modal) with COMMIT confirm and required reason only for rejection · Revision chain with '(dibuka)' marker and old revisions kept read-only · Issued table fits by…

## `15-penyelesaian-proyek.html` — Penyelesaian Proyek
- **Purpose**: Penyelesaian Proyek: the ten completion conditions derived from facts, each unmet one linking to where it is fixed, and the explicit decision (Selesaikan Proyek; Owner-only Selesaikan Paksa, CRITICAL).
- **Role / job**: both — Admin: see what still blocks completion and go fix each blocker; complete normally when 10/10. Owner: judge readiness and, in exceptional cases, force-complete with a recorded reason while obligations stay visible.
- **Primary action (before)**: Selesaikan Proyek (decision section, COMMIT, projects.complete; disabled with reason until 10/10).
- **Secondary actions (before)**: Per-condition fix buttons (8): Catat Barang Keluar, Catat Pengiriman, Buka Kasus Koreksi, Buka Dokumen, Lengkapi Dokumen, Tagihkan Invoice, Lihat Piutang, Lihat Reservasi; 'Catatan terkait' record links (~22); Selesaikan Paksa (Owner, CRITICAL); Buka Proyek (header outline) + meta project link
- **Visible actions (before, desktop / phone)**: 20 / 3
- **Problems found**:
  - *hierarchy, major* — Keputusan penyelesaian: The decision sits at the very bottom (y=1230 at 1366, y=~3400 on the phone). Inside it, 'Selesaikan Paksa' (CRITICAL, Owner) is a pink-tinted card exactly as wide as the normal 'Selesaikan Proyek' card. While the normal button is disabled (greyed green), the…
  - *density, major* — Syarat penyelesaian list (8 unmet rows): Every unmet row carries a warning triangle, a red 'Belum terpenuhi' pill, an outline fix button and 1-4 underlined 'Catatan terkait' links. The first viewport alone has 4 buttons + 11 underlined links + 4 red pills, and the whole list has 8 buttons, ~22…
  - *redundancy, minor* — KPI tiles: 'Syarat terpenuhi 2 dari 10' and 'Belum terpenuhi 8 syarat' are the same fact twice (complements). 'Tenggat 6 Nov 2026' repeats the hub KPI. Four equal tiles where one progress statement + Piutang aktif would do.
  - *routing, minor* — Breadcrumb + header meta + 'Buka Proyek' button: Three controls go to the same hub in the header block: the crumb 'Perangkat Lab Jaringan FT', the underlined meta link 'Perangkat Lab Jaringan Fakultas Teknik' and the outline 'Buka Proyek' (plus 'Kembali'). On the phone 'Buka Proyek' is a full-width button…
  - *role, major* — Condition 1 Pemenuhan fix button: fixFor('FULFILLMENT') offers 'Catat Barang Keluar' to anyone with stock.view. The Admin preview has stock.view but not stock.dispatch, so Sari sees a floor-task button she cannot use (confirmed in the admin capture). For the Admin the decision section also…
  - *status, polish* — Header meta 'Aktif' pill: Same live pulse on a non-live project state as on 11.
  - *mobile, minor* — 'Catatan terkait' lines: On the phone each related link wraps onto its own line with orphan '·' separators at line ends ('ARJ/BK/2026/10/0012 ·' / 'Pengiriman ARJ/BK/…'), making each condition 6-8 lines tall. The page is 3800px long.
- **Proposed simplification**:
  - (P1, module) Decision: one 'Selesaikan Proyek' block (primary, disabled + reason until 10/10) placed right under a compact readiness line at the top ('2 dari 10 syarat terpenuhi', with an anchor to the list), and repeated at the end of the list if needed. Move 'Selesaikan Paksa' out of the…
  - (P1, module) Gate rows: one status signal per row (keep the icon mark, drop the 'Belum terpenuhi'/'Terpenuhi' pill or vice versa). One fix button per unmet row, gated by the destination capability: FULFILLMENT uses A.can('stock.dispatch'), else 'Lihat Item'. 'Catatan terkait' deduped by…
  - (P2, module) KPI row from 4 to 2: one progress tile ('2 dari 10 terpenuhi' with bar and 'Selesaikan Proyek menunggu semuanya terpenuhi') + Piutang aktif. Drop Belum terpenuhi and Tenggat.
  - (P2, module) Remove the header 'Buka Proyek' button; the crumb parent (desktop) and the meta project link (all sizes) remain. The status pill loses its live pulse.
- **After R11**: fixed
  - Review minor (Owner sees 8 execution buttons): condRow() renders the fix for the Owner as a quiet link with chevron (.pt-link.prx-cond__link). The Admin, whose task it is, keeps outline buttons. Same href, same capability gating. On the Owner's page the only…
  - Review minor (plain-text 'Catatan terkait'): only refs that render as links are kept: a new destination that is not reached by the fix and not shared. The 'Catatan terkait' line is omitted when nothing is left. For prj-arj-0142 that removes rows 1, 6 and 7,…
  - Review polish (readiness stated three times): the decision reason is now 'Tersedia setelah sepuluh syarat terpenuhi · 8 belum terpenuhi.' The list below names the conditions, and the button keeps aria-describedby.
  - Feedback is one channel: 'Selesaikan Proyek' no longer toasts on top of the inline flash. 'Selesaikan Paksa' keeps its toast, because its result is the re-rendered record that receives focus.
  - 'Selesaikan Paksa' from 'Tindakan Lain' returns focus through MCMenu.trigger.
  - visible actions desktop 6 → 1, phone 1 → 1
  - remaining: Admin, desktop: 4 visible buttons in the first viewport (the disabled primary + the outline fixes in view), 1 on phones. This is one fix per row, the expected next step.
  - remaining: The gate sub keeps the page's one policy sentence ('dihitung dari catatan proyek, tanpa centang manual').
- **Kept on purpose**: Completion gate derived from facts with 'tidak ada centang manual' (never a manual checklist) · Every unmet condition names its blocker in plain language and links to where it is fixed · Canonical numbering 1-10 of the conditions · Selesaikan Paksa Owner-only, CRITICAL with typed word + minimum reason, residual obligations kept visible · Disabled 'Selesaikan Proyek' with an explicit reason…

## `20-pembelian.html` — Pembelian
- **Purpose**: Daftar semua pembelian ke pemasok dari perusahaan yang dikelola: status header (Terbuka/Ditutup/Dibatalkan), kemajuan barang masuk, dan pembelian yang masih menunggu barang.
- **Role / job**: both — Owner: lihat sekilas pembelian mana yang masih terbuka/menunggu barang dan nilainya, lalu drill-down. Admin: membuat pembelian baru dan menemukan pembelian yang perlu ditindaklanjuti (barang masuk).
- **Primary action (before)**: Buat Pembelian (header, hijau, purchase.manage) -> 03-create-purchase.html
- **Secondary actions (before)**: Tampilkan saja (banner: toggle filter Penerimaan=menunggu); Barang Masuk (banner, outline) -> 32-barang-masuk.html; Search + Tampilkan perusahaan + Status + Penerimaan + Proyek; Row click / nomor -> 21 detail; link proyek di sel -> 11
- **Visible actions (before, desktop / phone)**: 3 / 3
- **Problems found**:
  - *redundancy, minor* — Banner '2 pembelian menunggu barang masuk' vs tabel: Status menunggu diulang 3x: banner (nomor + sisa 38 barang), pill Penerimaan 'Belum ada barang masuk/Diterima sebagian', lalu baris biru tebal 'Menunggu 14/24 barang' di sel yang sama. 'Tampilkan saja' persis sama dengan opsi filter Penerimaan 'Menunggu…
  - *role, minor* — Banner, tombol 'Barang Masuk': Banner punya dua tombol outline setara (Tampilkan saja / Barang Masuk). Untuk Owner, Barang Masuk adalah kerja lantai gudang (Owner punya kapabilitasnya, tapi bukan konteks tugasnya di daftar pembelian); untuk Admin tujuannya sudah ada di Gudang. Dua aksi +…
  - *filters, major* — Toolbar di bawah banner: Search + 4 select tidak muat satu baris: 'Proyek: Semua' jatuh sendirian ke baris kedua di kiri (y≈285), toolbar jadi dua baris compang-camping dan mendorong tabel turun ~40px. Di 390 baris filter geser ke samping: 'Tampilkan: Semua perusah…' terpotong dan…
  - *table, minor* — Kolom 'Perusahaan': Chip ARJ/BTN/CKP mengulang kode perusahaan yang sudah jadi awalan nomor (ARJ/PB/2026/10/0425) dan kolom Tanggal terpisah; di 1280 layout sudah berbeda (chip inline, tanggal di bawah Total) sehingga ada dua komposisi tabel untuk lebar yang hampir sama.
  - *table, polish* — Sel Penerimaan baris ARJ/PB/2026/10/0418: Pill + '60 %' + baris kedua 'Menunggu 24 barang' membuat tinggi baris tidak seragam (57 vs 52 px) dan ritme tabel bergelombang; '60 %' dengan spasi.
  - *mobile, minor* — Viewport pertama: Subtitle 2 baris + CTA lebar penuh + banner dengan dua tombol besar (~120px) + search + filter scroller: hanya 3 baris pembelian terlihat (fold 0.51). Banner memakan ruang lebih besar dari daftar yang dirangkumnya.
  - *copy, polish* — Kepala kartu 'Daftar pembelian / Terbaru lebih dulu': Judul kartu mengulang H1 'Pembelian' dan sub 'Terbaru lebih dulu' mengulang subtitle halaman '...terbaru lebih dulu'. Kartu hanya membungkus satu tabel.
- **Proposed simplification**:
  - (P1, module) Toolbar: tampilkan search + Status + Penerimaan saja; 'Proyek' (dan Tampilkan perusahaan bila Layer A memutuskan) masuk tombol 'Filter' (popover desktop, sheet phone). Pakai MCFilter visible:2 dari Layer A, jangan solusi lokal.
  - (P1, module) Banner QS-05 jadi satu notice ringkas dengan SATU aksi teks 'Tampilkan' (toggle filter). 'Barang Masuk' hanya untuk Admin sebagai link quiet di notice yang sama; untuk Owner disembunyikan di sini (tetap di Gudang dan palette). Di phone banner jadi satu baris tappable '2…
  - (P2, module) Satu komposisi tabel untuk semua lebar desktop: hapus kolom Perusahaan (chip inline di sub-baris pemasok seperti di 1280), tanggal di bawah Total; ruang dipakai kolom Proyek.
  - (P2, module) Hapus kepala kartu 'Daftar pembelian'; catatan dinamis 'pembelian baru dari sesi ini di atas' hanya muncul bila relevan (sebagai caption tabel).
  - (P3, module) Sel Penerimaan satu baris: pill status + 'sisa N' muted inline (penanda QS-05 tetap, tidak bertumpuk dua tingkat).
- **After R11**: fixed
  - (r11 round 1) Header via MCActions: 'Buat Pembelian' is the PRIMARY for the Admin and a quiet SECONDARY outline for the Owner (canGo pembelian.form). There is one compact QS-05 notice with one text toggle. MCFilter visible:1, with Penerimaan and Proyek…
  - (round 2) The notice toggle is relabelled so it no longer reads like the 'Tampilkan: Semua perusahaan' company view. Desktop shows 'Lihat yang menunggu' / 'Lihat semua'; phones show 'Lihat' / 'Lihat semua'. aria-pressed and the data-action=pb-await-toggle…
  - (round 2) Layer A batch 5 now puts every phone notice's actions on their own row. pembelian.css restores the one-row compact notice for this one-action case only: .pb-await gets a 3-column grid on phones. The Admin's two-action notice (with Barang Masuk)…
  - visible actions desktop 3 → 3, phone 3 → 3
- **Kept on purpose**: Satu CTA hijau 'Buat Pembelian' di header · Hierarki baris: nomor tebal, pemasok muted, total rata kanan tabular · 'Untuk stok / Tanpa proyek' sebagai pengganti proyek · Nominal pendek di phone (Rp224,9 jt) agar nomor tidak terpotong · Tag 'Baru' untuk pembelian sesi ini

## `21-pembelian-detail.html` — Detail Pembelian
- **Purpose**: Hub satu pembelian: total, kemajuan barang masuk, kas keluar, dokumen (PO/NTB), riwayat & kasus koreksi, serta langkah berikutnya.
- **Role / job**: both — Owner: cek eksposur (total vs dibayar vs diterima), lihat pengecualian (kasus koreksi), putuskan tutup sisa/batal. Admin: terima sisa barang, pratinjau/terbitkan PO, tindak lanjut.
- **Primary action (before)**: Terima Barang (hijau) -> 32-barang-masuk.html?pembelian=pur-arj-0418; bila belum ada barang & PO belum terbit: Pratinjau PO
- **Secondary actions (before)**: Lainnya ▾: Tutup Sisa Pembelian, Batalkan Pembelian (disabled + alasan), Koreksi Harga/Pajak/Biaya (demo), Retur ke Pemasok (demo); Perlu tindakan: baris 'Menunggu 24 barang' -> 32; baris kasus koreksi -> 71; Tabs Barang/Penerimaan/Pembayaran/Dokumen/Riwayat
- **Visible actions (before, desktop / phone)**: 7 / 5
- **Problems found**:
  - *redundancy, major* — Metrik Penerimaan + kartu 'Perlu tindakan' + tab + tabel Barang: Kemajuan barang masuk diulang 5x di atas fold: tile '60 % · 36 dari 60 diterima · sisa 24', baris 'Menunggu 24 barang dari pemasok…', badge oranye 'Penerimaan 2', sub 'Barang dan jasa 3 baris · 36 dari 60 diterima', kolom Diterima/Sisa. Baris sinyal…
  - *routing, minor* — Breadcrumb '← Kembali / Pembelian / ARJ/PB/…': 'Kembali' dan crumb 'Pembelian' menuju 20-pembelian yang sama.
  - *role, major* — Menu 'Lainnya': Admin Sari melihat Tutup Sisa Pembelian, Batalkan Pembelian, Koreksi Harga/Pajak/Biaya, dan Retur ke Pemasok. Semua di-gate hanya dengan purchase.manage, padahal kanonik butuh grant ADM+ masing-masing (purchase.close_remainder, purchase.cancel,…
  - *alignment, minor* — Tab Barang, blok 'Biaya tambahan': Nominal 'Rp450.000' Ongkos kirim melayang di tengah kartu (pb-sum__charges max-width 620px), tidak sejajar dengan kolom Subtotal maupun daftar Subtotal/PPN/Total di kanan; di 1920 jaraknya ~630px.
  - *card, minor* — Tile ke-4 'Tanggal pembelian 1 Okt 2026': Tanggal + ref. pemasok adalah metadata, bukan angka; diulang lagi di 'Informasi pembelian'. Phone sudah menyembunyikannya, desktop tidak (empat kartu setara padahal satu bukan metrik).
  - *table, minor* — Tabel Barang dan jasa: Kolom Jenis ('Gudang' x3) dan Pajak ('PPN 11%' x3) konstan, menambah lebar tanpa informasi; layout 768 sudah melipatnya ke sub-baris dan terbaca lebih baik.
  - *mobile, minor* — Aksi header: 'Terima Barang' lebar penuh lalu 'Lainnya' outline lebar penuh di bawahnya: ~100px untuk dua tombol, KPI dan Perlu tindakan terdorong; baris sinyal wrap 3–4 baris.
  - *mobile, polish* — Informasi pembelian (grid 2 kolom): Nomor PO patah di tengah token 'ARJ/PO/2026/10/001' + '2'; nama proyek 3 baris. Melanggar kontrak long-text (nomor bisnis tidak boleh patah).
  - *copy, minor* — Sub kartu 'Perlu tindakan': 'Dihitung dari data pembelian saat ini; selesai sendiri saat tindakannya dicatat.' menjelaskan sistem, bukan tugas; di phone 2 baris.
  - *other, polish* — Seluruh hub: Hub detail melebar ~1650px; tabel 8 kolom terserak, metrik sangat lebar.
- **Proposed simplification**:
  - (P1, module) Gate setiap item Lainnya dengan kapabilitas kanoniknya: Tutup Sisa -> purchase.close_remainder, Batalkan -> purchase.cancel, Koreksi -> purchase.correct_cost, Retur -> purchase_return.record. Sembunyikan bila tidak punya (untuk Sari menu Lainnya hilang). Owner tetap melihat…
  - (P1, module) 'Perlu tindakan' tidak boleh mengulang CTA header: buang sinyal 'Menunggu N barang' saat Terima Barang tampil, dan sinyal PO saat Pratinjau PO jadi primary. Sisa sinyal (kasus koreksi) jadi notice ringkas di bawah metrik tanpa subtitle penjelasan.
  - (P2, module) Strip metrik 3 angka (Total, Penerimaan, Dibayar); tanggal + ref. pemasok pindah ke baris meta header.
  - (P2, module) Tab Barang: lipat Jenis ke sub-baris SKU dan Pajak ke bawah harga di semua lebar; biaya tambahan jadi baris di daftar totals (satu tepi kanan untuk semua nominal), detail biaya di bawahnya.
  - (P2, system) Aksi header phone: primary + kebab ikon 44px dalam satu baris (pola Layer A untuk semua detail).
  - (P3, module) Facts di phone 1 kolom atau .pt-num nowrap+ellipsis untuk nomor PO/proyek.
- **After R11**: fixed
  - (r11 round 1) MCSplit 'Lainnya ▾' replaced by MCActions with overflow 'Tindakan Lain'. Each menu item is gated by its own canonical capability (close_remainder / correct_cost / purchase_return.record / cancel), so the Admin has no overflow. Role emphasis:…
  - (round 2, minor) Owner header hierarchy: MCActions maxSecondary is OWNER ? 1 : 2. When goods are awaited AND the PO is due (e.g. pur-arj-0421), the Owner now sees [Tindakan Lain ▾][Terima Barang] and Pratinjau PO moves to the top of the menu. The Admin keeps…
  - (round 2, minor) 'Tutup Sisa Pembelian' now has danger:true. It sits after the separator, next to 'Batalkan Pembelian' (last, disabled with its reason while goods are received); Koreksi and Retur come first.
  - (round 2, minor) Dokumen tab: no PDF column and no 'PDF siap' pill. A rendition that is not ready shows as a quiet note under the number ('PDF sedang dibuat', or 'PDF gagal dibuat' in danger text). The Status column (and the phone status pill) shows only…
  - (round 2, polish) Riwayat tab: the 'Kasus koreksi terkait' table lists only settled (non-OPEN) cases, has no system-explainer sub, and is skipped when every case is still open (open cases are already in Perlu tindakan and the timeline). The Riwayat tab…
  - (round 2, polish) Pembayaran tab: removed the 'Total pembelian' / 'Sudah dibayar' facts (they repeat the metric strip) and the explainer foot. The section sub now carries only 'Belum dibayar RpX' or 'Dibayar penuh'.
  - (round 2, polish) Barang tab: removed the 'Perlakuan menentukan…' help line under the charges; the treatment label already says it.
  - Removed the local route-scoped .pt-sep phone hide (Layer A now hides meta separators on phones everywhere) and the unused .pb-paid-facts / .pb-facts CSS.
  - visible actions desktop 2 → 2, phone 2 → 5
  - remaining: Phone 'after' = 2 header controls (Terima Barang + ⋯) plus 3 'Bagian pembelian' drill rows that the ux_density heuristic counts as buttons when they fall above the fold. Not extra actions.
- **Kept on purpose**: Satu CTA hijau yang berubah sesuai langkah (Terima Barang / Pratinjau PO) · 'Batalkan Pembelian' disabled dengan alasan tertulis (untuk Owner) · Konfirmasi MCRisk critical + alasan wajib untuk tutup sisa/batal · Tabs dengan count + titik perhatian; drill-in parts di phone · Progress bar di tile Penerimaan · Timeline Riwayat dengan kelas kewenangan khusus

## `03-create-purchase.html` — Buat Pembelian
- **Purpose**: Mencatat pembelian barang/jasa ke pemasok (tanpa draf), memeriksa ringkasan, lalu menyimpan sebagai Terbuka.
- **Role / job**: admin — Admin: isi pemasok, tanggal, ref, baris barang (katalog/sumber data), cek total, review, simpan. Owner sesekali melakukan hal yang sama.
- **Primary action (before)**: Lanjut ke review (langkah 1) -> Simpan pembelian (langkah 2)
- **Secondary actions (before)**: Split ▾ langkah 1: Pratinjau PO, Batalkan pengisian (danger); Gunakan data dari ▾ (Pembelian sebelumnya / Kebutuhan proyek); Tambah dari katalog, Tambah baris, hapus baris (trash); Lampiran upload; Langkah 2: Kembali ubah, Simpan ▾ (Simpan & pratinjau PO)
- **Visible actions (before, desktop / phone)**: 11 / 4
- **Problems found**:
  - *hierarchy, minor* — Footer split 'Lanjut ke review ▾': Chevron primary menyembunyikan 'Pratinjau PO' dan aksi destruktif 'Batalkan pengisian': destruktif menempel pada CTA utama. Pratinjau PO di langkah 1 juga tersedia lagi di langkah 2 (Simpan & pratinjau PO) dan di detail.
  - *redundancy, minor* — Breadcrumb 5 tingkat: 'Kembali' dan crumb 'Pembelian' sama-sama ke 11-proyek-detail…&tab=pengadaan; label 'Pembelian' menyiratkan daftar Pembelian global padahal tab proyek.
  - *routing, major* — Masuk dari 20-pembelian 'Buat Pembelian' (tanpa ?proyek): Form terikat ke proyek referensi 'Perangkat Lab Jaringan Fakultas Teknik' (kartu proyek), breadcrumb 'Kembali / Proyek / Perangkat Lab… / Pembelian / Buat Pembelian', dan 'Batalkan pengisian' kembali ke tab Pengadaan proyek itu, padahal pengguna datang dari…
  - *alignment, major* — Informasi Pembelian, field read-only 'Perusahaan': Nilai 'CV Arunika Jaya' patah 3 baris di track 156px dan hint nowrap 'mengikuti proyek' meluber keluar tepi kanan tile ke celah Catatan. Tile setinggi ~57px vs input 30px sehingga baris lima field tidak sejajar.
  - *card, minor* — Baris 1: kartu proyek (foto gedung) + kartu stepper: Dua kartu untuk konteks + 'langkah 1 dari 3'; foto thumbnail dekoratif. Di 1024 dan phone keduanya menumpuk jadi dua kartu penuh (stepper ~100px di phone) sebelum field pertama.
  - *mobile, minor* — Chrome bawah: Bottom nav + sticky bar (Total + Lanjut ke review) ≈160px tetap di layar saat entri data; viewport pertama hanya memuat 2 field.
  - *copy, polish* — Langkah 2 'Periksa sebelum disimpan': Paragraf pembuka dan kotak tiga poin efek menyatakan hal yang sama (Terbuka, stok belum berubah, PO nanti); kotak efek terpotong sticky footer di layar pertama.
  - *other, minor* — Seluruh form: Form melebar ~1640px: lima field tercecer dengan celah besar; Ringkasan Pembelian menaruh Subtotal di kiri dan Total pajak jauh di kanan.
- **Proposed simplification**:
  - (P1, module) Perbaiki field Perusahaan: nilai satu baris dengan ellipsis + title, 'mengikuti proyek' jadi hint di bawah field (pola hint field), tinggi tile = tinggi input.
  - (P1, module) Routing sesuai asal: tanpa ?proyek, breadcrumb 'Pembelian › Buat Pembelian', Kembali dan Batalkan -> 20-pembelian.html; dengan ?proyek tetap ke tab Pengadaan proyek. Hapus duplikat Kembali/crumb.
  - (P2, module) Footer langkah 1: primary polos 'Lanjut ke review' + tombol ghost 'Batal' di sisi kiri footer; buang split dan Pratinjau PO di langkah 1 (tetap di langkah 2 dan detail).
  - (P2, system) Mode container FORM (max ~1240px, rata kiri) untuk 03 dan form lain.
  - (P2, module) Stepper tanpa kartu, inline di bawah judul (desktop) / teks ringkas 'Langkah 1 dari 3 · Input pembelian' (phone); hapus foto proyek, identitas = nama + nomor + klien.
  - (P2, system) Phone: sembunyikan bottom nav pada rute FORM/task selama sticky action bar tampil.
  - (P3, module) Langkah 2: hapus paragraf pembuka, pertahankan kotak efek tiga poin.
- **After R11**: fixed
  - r11 (kept): the breadcrumb follows the origin, ancestors only. The footer is [Batal ghost][Lanjut ke review] (no split, no destructive item on the primary). Step 2 is Batal / Kembali ubah / Simpan pembelian. Step 3 is Buat pembelian lain / Lihat detail…
  - Review fix (major): without ?proyek the purchase has NO project. This follows canonical WF-PUR-02 / J-PUR-02, a replenishment purchase from SCR-15, and is now the page's markup state. Strip: 'Pembelian tanpa proyek' · 'Stok bersama' · 'Barang yang diterima…
  - ?proyek=<id>: fills the project, shows the read-only project company with the hint 'Mengikuti proyek', the 'Gunakan data dari' menu and the header 'Produk dan item proyek'. ?produk=<id>: the same no-project treatment ('Isi ulang <product>', one shortfall…
  - Review fix (polish, D-32): no 'Aktif' pill. A project state pill is inserted only for an exception (p.state !== 'ACTIVE').
  - Review fix (major): on phones the review table has no side scroll at the decision step. Jumlah, Harga satuan and Pajak step aside (.pur-review__opt) and become one quiet line under the product ('20 unit × Rp9.850.000 · PPN 11%'). Subtotal stays the visible…
  - Review fix (minor), done step. The status is said once (pill): the text is now '<number> tercatat untuk <company>. Barang menunggu dicatat di Barang Masuk.' The total is said once: the footer total is hidden on step 3, so the phone footer has no empty total…
  - Review fix (minor): the phone bottom nav is hidden on 03 while the purchase action bar shows (canonical IA §6.2, brief rule 13, the same rule as .pt-actionbar routes). The bar sits on the screen edge with the safe area. Navigation stays in the app-bar menu;…
  - Review fix (polish): field tracks follow what each field must show whole. Pemasok 255 / Perusahaan 210 (now a select) / date 180 / reference 190 / Catatan 195 (same 1030 total). The four REF gaps are one 18.5fr gutter. 'PT Contoh Sinar Komputindo' and 'CV…
  - Review fix (polish): Ringkasan Pembelian always stacks label-left / value-right per row. On a full-width card (1100 px or less) the totals are one right-aligned 460 px block instead of two pairs about 500 px apart.
  - Layer A pt-kv phone regression (major in the review): already fixed by the Layer A owner (patterns.css line 1328 is now inside @media (min-width: 768px)). Verified: the 'Periksa sebelum disimpan' facts stack label-over-value at 390.
  - visible actions desktop 8 → 8, phone 5 → 4
  - remaining: ux_density flags 'row buttons 4' on 03: these are the line editor's own controls (product / unit / tax selects + trash), not row actions. Kept by design (canonical PT-10 line editor).
  - remaining: 'Gunakan data dari › Pembelian sebelumnya' on 03?proyek=prj-arj-0142 answers 'Baris sumber tidak ada di katalog' (the previous purchase's products are not in the 03 catalog). This predates r11 and is a fixture/catalog…
  - remaining: With ?proyek the desktop count is 9 (the 'Gunakan data dari' menu shows); the phone count is 5.
- **Kept on purpose**: Sticky bar Total + aksi (penting untuk form panjang) · Rekalkulasi langsung, nominal rata kanan, id-ID grouping · Baris barang sebagai kartu 'BARANG 1/2/3' di phone · Disclosure phone: Lampiran dan Ringkasan tertutup · Layout review: fakta kiri, tabel barang kanan · Tanpa draf (kanonik D-07)

## `30-stok.html` — Stok
- **Purpose**: Stok gudang bersama per produk (fisik/direservasi/tidak layak/tersedia), pengecualian (di bawah minimum, karantina), dan pintu masuk tugas gudang.
- **Role / job**: both — Owner: adakah yang di bawah minimum, rusak, atau tertahan reservasi; drill ke produk. Admin: cari/pindai produk, cek ketersediaan, mulai Barang Masuk.
- **Primary action (before)**: Tidak ada primary: dua outline setara 'Barang Masuk' + 'Barang Keluar' (Owner); Admin hanya 'Barang Masuk' outline
- **Secondary actions (before)**: 4 tile KPI (2 toggle filter, 2 link: Reservasi -> 35, Menunggu barang masuk -> 32); Link 'Riwayat Stok ›' dan 'Stok Opname ›' di kepala kartu; Pindai (≤1024/touch); Search + Rak + Minimum + Kondisi
- **Visible actions (before, desktop / phone)**: 8 / 9
- **Problems found**:
  - *hierarchy, major* — Aksi header: Dua tombol outline setara 'Barang Masuk' / 'Barang Keluar' tanpa primary; bagi Owner keduanya kerja lantai gudang (Barang Keluar kanonik tugas admin gudang). Halaman tidak memberi tahu Owner apa yang perlu ia lakukan; di phone dua tombol besar jadi hal…
  - *routing, minor* — Navigasi antar halaman Gudang: Saudara modul tersebar: Reservasi hanya lewat tile KPI, Riwayat Stok dan Stok Opname lewat link kecil di kepala kartu tabel, Barang Masuk/Keluar lewat header. Reservasi (halaman kerja dengan antrean 'Perlu direservasi') praktis tersembunyi di balik angka.
  - *status, major* — Empat tile KPI: Tile tampak identik tapi perilakunya tiga macam: 'Di bawah minimum' dan 'Tidak layak pakai' = toggle filter, 'Reservasi aktif' = navigasi ke 35, 'Menunggu barang masuk' = navigasi ke 32 (inert bila tanpa stock.receive). Tile Menunggu menuju tujuan yang sama…
  - *filters, minor* — Toolbar: Di 1366 toolbar berhenti di x≈1277, tepi kanan tidak sejajar kartu (celah ~72px). Di 1024/768 'Kondisi' turun ke baris kedua dan 'Pindai' terlempar ke kanan. Phone: scroller samping, 'Minimum' terpotong, 'Kondisi' tak terlihat.
  - *table, polish* — Ujung baris daftar: Sub-label 'tersedia' di setiap baris (13x) — hanya pengecualian ('di bawah minimum') yang perlu label.
  - *mobile, minor* — Viewport pertama: Header 2 tombol + search/scan + scroller filter + grid KPI 2x2 (~170px, catatan tile hilang) -> hanya 2 baris produk terlihat.
  - *copy, minor* — Subtitle: Rumus 'Tersedia = stok fisik − direservasi − tidak layak pakai' membuat subtitle 3 baris di phone/tablet; rumus diulang di tile Tersedia di 31.
- **Proposed simplification**:
  - (P1, module) Aksi header per peran: Admin -> 'Barang Masuk' sebagai primary terisi (tugas hariannya); Owner -> satu outline 'Catat ▾' berisi Barang Masuk / Barang Keluar (OVERFLOW), tanpa CTA hijau.
  - (P1, module) Satu perilaku tile: tile filter punya state pressed yang jelas, tile tautan punya chevron. Tile 'Menunggu barang masuk' diarahkan ke 20-pembelian.html?penerimaan=menunggu (daftar pembelian yang ditunggu, cost.view) agar tidak menduplikasi tombol header.
  - (P2, system) Navigasi lokal Gudang yang tenang di bawah judul (Stok · Reservasi · Riwayat Stok · Stok Opname, ter-gate rute) dipakai bersama 30/34/35/36; hapus link di kepala kartu.
  - (P2, module) Subtitle satu baris pendek; rumus Tersedia jadi bantuan (title/tooltip) pada header kolom 'Tersedia'.
  - (P3, module) Phone: KPI jadi strip chip ringkas ('2 di bawah minimum', '2 tidak layak pakai') sebagai quick filter; sub-label baris hanya untuk pengecualian.
- **After R11**: fixed
  - (r11 round 1) Header via MCActions. Admin: Barang Masuk PRIMARY (Barang Keluar SECONDARY only with stock.dispatch). Owner: both inside 'Tindakan Lain' (⋯ on phones). Metric strip has one look per behaviour: filter toggles with a pressed state, link tiles…
  - (round 2, minor) The Gudang sibling navigation now uses Layer A D-39 MCPage.subnav (Stok · Reservasi · Riwayat Stok · Stok Opname[cap stock.count]) right after the crumbs. Removed the list-head sibling links 'Riwayat Stok ›' / 'Stok Opname ›' and the…
  - (round 2, minor) Phone strip: removed `.gd-metrics { gap: 10px }` so the 2x2 strip is one surface again with unbroken hairlines. Values stay on one line per strip row: the quick tiles use subgrid rows (label / value / note) at every width, spanning 2 rows on…
  - (round 2, polish) At ≤1240 px tile labels wrap instead of truncating ('Menunggu barang masuk' at 1024), and the subgrid keeps the four values on one baseline.
  - (round 2, polish) While the 'Di bawah minimum' filter is on, rows no longer repeat that state (D-32). The Stok minimum column shows the quiet 'Min. N unit', and the ≤1240 inline 'Di bawah minimum' and the phone 'di bawah minimum' sub are suppressed.
  - visible actions desktop 4 → 4, phone 5 → 5
- **Kept on purpose**: Search/pindai lebih dulu di phone, Enter pada kode persis membuka produk · Tersedia tebal dengan unit; nol berwarna muted · KARANTINA disorot amber di kolom Rak · Angka rata kanan tabular · Chip asal lot + 'perusahaan lain' untuk Admin · Barang Keluar tersembunyi untuk Admin tanpa stock.dispatch

## `31-stok-produk.html` — Detail Stok Produk
- **Purpose**: Stok satu produk di gudang bersama: fisik, direservasi, tidak layak, tersedia; lot (Ambil lebih dulu), reservasi per proyek, rak, pergerakan terbaru, perintah stok.
- **Role / job**: both — Owner: kenapa Tersedia sekian, siapa yang menahan, perlu isi ulang? -> Buat Pembelian. Admin: pilih lot yang benar, cek/kelola reservasi, tindak lanjut.
- **Primary action (before)**: Owner: 'Barang Keluar' (hijau) karena ada reservasi aktif; bila di bawah minimum: 'Buat Pembelian'. Admin (tanpa stock.dispatch): tidak ada primary.
- **Secondary actions (before)**: Riwayat Stok (header outline); Kelola reservasi ›; Semua pergerakan ›; Tindakan stok: Pindah Lokasi, Ubah Kondisi, Catat Penyesuaian Stok (demo), Mulai Hitungan; Link rak, link referensi pergerakan, baris kasus koreksi
- **Visible actions (before, desktop / phone)**: 12 / 2
- **Problems found**:
  - *hierarchy, minor* — Baris meta header: 'LPT-14-15 Barcode INT-260101 Gudang bersama Minimum 2 unit Nomor seri dilacak' menyatu tanpa pemisah; 'Gudang bersama' sama untuk semua produk (noise).
  - *hierarchy, minor* — Grid dua kolom: Kasus koreksi terbuka (pengecualian) ada di urutan ketiga kolom kiri, di bawah fold; perintah stok di dasar kolom kanan. Kolom kanan ~160px lebih panjang.
  - *density, polish* — Tile 'Tersedia' + catatan kaki Lot: Catatan rumus '6 fisik − 3 direservasi − 1 tidak layak pakai' membungkus 2 baris; catatan kaki 'Ambil lebih dulu = …' dua baris di bawah tabel Lot.
  - *redundancy, minor* — Header 'Riwayat Stok' vs 'Semua pergerakan ›'; breadcrumb: Keduanya ke 34-riwayat-stok.html?produk=prd-lpt14; di phone 'Riwayat Stok' bahkan memakan separuh lebar baris aksi. Breadcrumb 'Kembali' + 'Stok' sama-sama ke 30.
  - *role, major* — CTA header + kartu 'Tindakan stok': Owner mendapat CTA hijau 'Barang Keluar' (kerja lantai gudang) di layar pengawasan, dan kartu 'Tindakan stok' menawarkan 4 perintah lantai (Pindah Lokasi, Ubah Kondisi, Catat Penyesuaian Stok, Mulai Hitungan; 3 masih demo) yang tampil seperti baris navigasi…
  - *table, polish* — Tabel Lot dan Reservasi per proyek: Kolom Perusahaan berisi chip ARJ yang sama di semua baris dan mengulang awalan nomor proyek ARJ/PRJ/….
- **Proposed simplification**:
  - (P1, module) Header per peran: primary hanya 'Buat Pembelian' saat di bawah minimum (purchase.manage); 'Barang Keluar' primary hanya untuk pemegang stock.dispatch yang bukan Owner, untuk Owner masuk overflow. Hapus tombol header 'Riwayat Stok' (tetap 'Semua pergerakan ›').
  - (P1, module) Kartu 'Tindakan stok' diganti satu menu header 'Tindakan stok ▾' (OVERFLOW) berisi perintah ter-gate kapabilitas; tidak tampil bila kosong (Admin).
  - (P2, module) Kasus koreksi terbuka naik jadi notice di bawah metrik (slot yang sama dengan saran isi ulang).
  - (P2, module) Meta header pakai pemisah .pt-sep, buang 'Gudang bersama'.
  - (P3, module) Kolom Perusahaan di Lot/Reservasi hanya bila ada lebih dari satu perusahaan di tabel itu; 'Ambil lebih dulu' dijelaskan lewat title tag.
- **After R11**: fixed
  - (r11 round 1) Header via MCActions. 'Buat Pembelian' is PRIMARY only when below minimum. Barang Keluar is PRIMARY for a non-Owner dispatcher, OVERFLOW for the Owner. The 'Tindakan stok' card became 'Tindakan Lain' items (Pindah Lokasi, Ubah Kondisi, Mulai…
  - (round 2, minor) Below 1320 px the side column is a plain flex stack (gap --pt-gap). Rak and Pergerakan terbaru each take the full width, so there is no ragged 190 px hole beside the tall movements card. Removed the .gd-span2 rule and class.
  - (round 2, minor) Pergerakan terbaru: record numbers never truncate. The quantity column holds only the number (qtyHTML(m,false)). The rack path / condition joins the type line as a quiet ' · Rusak diterima · KARANTINA'. The meta leads with the reference…
  - (round 2, polish) Tersedia key tile warm tint restored: `.pt-metrics > .pt-metric.gd-metric--key` now matches the Layer A strip reset's specificity and loads later.
  - (round 2) 'Catat Penyesuaian Stok' now passes demoMeta directly; Layer A passes demoMeta for danger items now, so the attrs workaround is gone. Removed the route-scoped .pt-sep phone hide (now in Layer A).
  - visible actions desktop 2 → 1, phone 2 → 1
- **Kept on purpose**: Tile Tersedia ditonjolkan (tint) sebagai angka kunci · Tag 'Ambil lebih dulu' pada lot tertua layak pakai · Notice saran isi ulang 'hanya saran' · Kuantitas pergerakan bertanda (+ hijau) · 'Kelola reservasi' membawa ?produk · Perintah stok ter-gate kapabilitas (Admin tidak melihatnya)

## `32-barang-masuk.html` — Barang Masuk
- **Purpose**: Floor task: pick an open purchase with goods remaining, then record per line how many arrived Layak pakai / Rusak diterima / Ditolak, the rack and the new lot, optionally reserving for the project in the same commit (COMMIT 'Catat Barang Masuk').
- **Role / job**: admin — Barang datang dari pemasok: saya pilih pembelian, pindai/isi jumlah per baris, pilih rak, lalu catat sekali, tanpa melihat harga.
- **Primary action (before)**: Catat Barang Masuk (fixed action bar, COMMIT) after choosing a purchase
- **Secondary actions (before)**: Pilih pembelian (worklist row); Pindai / ketik kode barang; Isi semua sisa sebagai Layak pakai; Baris berikutnya / chevron prev-next; Ganti pembelian (phone only); Lihat pembelian (link); Riwayat Stok (header); Sisihkan untuk proyek (checkbox)
- **Visible actions (before, desktop / phone)**: 6 / 3
- **Problems found**:
  - *hierarchy, major* — Selected state (?pembelian=pur-arj-0418), 1366x768: After a purchase is chosen the full worklist table stays open above the task, followed by the context card. The selected purchase is shown twice (highlighted worklist row + context card, both with the 'Diterima sebagian 60 %' pill). The actual work…
  - *hierarchy, minor* — Result card (renderDone): The primary (green) CTA after commit is 'Pratinjau Nota Terima Barang', which the help text itself calls optional. 'Catat barang masuk lain' (the floor's real next step) is outline, and two more text links (Riwayat Stok, Detail proyek) plus an optional…
  - *density, polish* — Placeholder before selection: A large dashed placeholder card ('Pilih pembelian untuk mulai mencatat') repeats what the worklist subtitle already says. On a 2-row worklist it takes more height than the list itself.
  - *redundancy, minor* — Current-line panel (gdt-current): Three ways to move between lines in one region: chevron prev/next in the panel head, a 'Baris berikutnya ->' outline button in the panel foot, and clicking a row in the lines table/rows. The foot has two equal outline buttons ('Isi semua sisa sebagai Layak…
  - *spacing, minor* — .gdt-flow wrapper: context card -> 'Baris pembelian' / current-line cards: The context card and the task grid touch, about 3 px apart (context bottom ~512, lines card top ~515 at 1366), while every other card gap is --pt-gap 14 px. The [data-mount=flow] div has no flex/gap rule, so its two children stack with no rhythm. The same…
  - *alignment, minor* — Page head vs toolbar/cards: Title/crumb text starts at x≈246 (.mc-page-head padding-left 9px), but the company select and cards start at x≈237 and card content at x≈257. That gives three different left edges in the first 200 px. The company select also sits only ~10 px under the…
  - *mobile, major* — Phone header + context card: A full-width outline 'Riwayat Stok' (cross-module navigation) takes the first action slot under the title. The context card then stacks six meta lines (eyebrow, number, pill, ARJ+supplier, Ref. pemasok, Proyek, PO) plus 'Lihat pembelian' and 'Ganti…
  - *copy, polish* — Scan field: The scan icon appears both inside the input and on the 'Pindai' button next to it. On phones the button becomes icon-only, so the same glyph shows twice side by side.
- **Proposed simplification**:
  - (P1, module) Collapse the picker once a purchase is chosen at ALL widths. Drop the max-width:767px guard on `.gdt-page.is-chosen > .gdt-toolbar/.gdt-worklist {display:none}` and show `.gdt-switch` ('Ganti pembelian') on desktop too. On desktop it re-expands the worklist (or opens the…
  - (P1, module) Give the flow mount the page rhythm: `.gdt-flow:not(:empty){display:flex;flex-direction:column;gap:var(--pt-gap)}` (or add class pt-stack to [data-mount=flow] in 32/33 HTML).
  - (P2, module) Current-line panel: remove the head chevrons (row click + foot button already navigate). Turn the foot into one quiet row: 'Isi semua sisa sebagai Layak pakai' as a ghost/text action left-aligned under the outcomes, and 'Baris berikutnya ->' as the single outline button…
  - (P2, module) Phone context card: one meta line (ARJ · supplier · Ref) plus one line of links (Proyek, PO). Make the purchase number itself the 'Lihat pembelian' link (drop the separate link). Keep 'Ganti pembelian' as a compact outline button on the title row.
  - (P3, module) Result card: make 'Catat barang masuk lain' the primary and 'Pratinjau Nota Terima Barang' outline (it is optional). Keep the Riwayat Stok / Detail proyek text links.
  - (P3, module) Replace the dashed placeholder with a one-line hint inside the worklist section foot (or remove it). The worklist subtitle already says what to do.
- **After R11**: fixed
  - Removed the 'Riwayat Stok' header button. It is now a quiet link 'Riwayat barang masuk' (34-riwayat-stok.html?jenis=BARANG_MASUK) in the worklist section head. The page header has no buttons.
  - The company view moved from a toolbar floating on the canvas into the worklist head. On phones Layer A now puts every filter in the sheet (03:55 change), so the head reads [Filter] + link.
  - Round 2 fix (review major #2): the phone head rule now applies only to .gdt-sessions. For .gdt-worklist the tools row wraps, the toolbar shrinks (flex 1 1 auto, min-width 0), and the link is nowrap with margin-left auto. The link is never clipped. If a…
  - Removed the Perusahaan column and the phone company tag (the PB number carries the code). The sub now reads 'n pembelian dengan sisa barang · pilih satu untuk mulai mencatat'. Removed the dashed placeholder.
  - Removed the local copy of .pt-head__actions:empty (it is now in Layer A).
  - visible actions desktop 2 → 2, phone 2 → 2
- **Kept on purpose**: Lines table + current-line panel split with the fixed commit bar whose info line summarises entered totals and errors · Outcome rows with tone dots (Layak/Rusak/Ditolak) and inline hints; reason field appears only when Ditolak > 0 · Lot code preview ('Lot baru · dibuat otomatis') and no prices on the floor screen · COMMIT confirmation with a full summary and the 'tidak bisa dihapus' consequence…

## `33-barang-keluar.html` — Barang Keluar
- **Purpose**: Floor task: pick an active project with warehouse items still to dispatch, confirm lots per item (oldest-first aid, inter-company allocation with reason), then COMMIT 'Catat Barang Keluar' (the only stock subtraction), then Surat Jalan draft and Catat Pengiriman.
- **Role / job**: both — Barang untuk proyek siap keluar: saya pilih proyek, ambil lot yang benar per item, catat keluar, lalu lanjut ke serah terima.
- **Primary action (before)**: Catat Barang Keluar (fixed action bar, COMMIT); after commit: Catat Pengiriman
- **Secondary actions (before)**: Pilih proyek (worklist row); Pindai kode barang/lot; Ikuti saran urutan; Item berikutnya / chevrons; Detail proyek (link); Ganti proyek (phone); Pengiriman (header); Pratinjau Surat Jalan / Barang keluar lain (result)
- **Visible actions (before, desktop / phone)**: 7 / 5
- **Problems found**:
  - *hierarchy, major* — Selected state (?proyek=prj-arj-0142), Owner 1366x768: Same as 32: the 4-row worklist stays open above the context card, and the lot pickers (the actual task) start at ~y=860. The project is shown twice (selected row + context card).
  - *density, polish* — Result card (renderDone): After commit: info notice + 'Catat Pengiriman' (primary, correct) + 'Pratinjau Surat Jalan' + 'Barang keluar lain' (outline) + 'Detail proyek' + 'Riwayat Stok' links = 5 actions, plus the MCRisk success toast.
  - *redundancy, minor* — Current item panel: Chevrons in the head + 'Item berikutnya' in the foot + row click all do the same thing. The foot pairs 'Ikuti saran urutan' and 'Item berikutnya' as equal outline buttons.
  - *role, major* — Whole page as Admin (Sari: no stock.dispatch): The Admin sees the full actionable worklist (4 projects, row hover, selected-row bar) with no hint that she cannot dispatch. Choosing a row replaces the task with 'Mencatat Barang Keluar butuh kewenangan Keluarkan barang'. On phones the worklist and toolbar…
  - *spacing, minor* — .gdt-flow: context card -> 'Item yang perlu keluar': Context card and task grid touch (~3 px gap vs 14 px elsewhere). The flow wrapper has no gap.
  - *mobile, minor* — Phone header and lot rows: A full-width 'Pengiriman' outline button (cross-module) takes the first slot. The lot row meta wraps to 3 lines ('Rak A-01 · masuk 2 Okt · 1 / unit') and the 'Ambil lebih dulu' badge drops onto its own line, so each lot is ~90 px tall.
- **Proposed simplification**:
  - (P1, module) Role-aware entry for users without stock.dispatch. Above the worklist, show one info line ('Barang Keluar dicatat oleh admin gudang; Anda melihat antrean saja'). Make rows link to project detail (tab=pemenuhan) instead of opening the task, and never hide the worklist on phones…
  - (P1, module) Collapse the picker after a choice at all widths and fix the .gdt-flow gap (same change as 32; one shared CSS rule).
  - (P2, module) Current item panel: drop the head chevrons. Keep 'Item berikutnya ->' as the single outline button and turn 'Ikuti saran urutan' into a ghost/text action placed directly above the lot list (next to 'Pilih lot · paling lama di atas'), where it applies.
  - (P3, module) Phone lot rows: lot code + badge on line 1, 'A-01 · 2 Okt · 1 unit' on line 2 (shorter 'masuk' copy), so each row is 2 lines.
  - (P3, module) Result: keep 'Catat Pengiriman' primary and 'Pratinjau Surat Jalan' outline. Move 'Barang keluar lain' to a text link with the other two links (3 visible actions + links).
- **After R11**: fixed
  - Removed the 'Pengiriman' header button. It is now a quiet link in the worklist head. The company view lives in the list head (phones: in the Filter sheet). The phone head CSS fix from 32 applies here: 'Pengiriman' is no longer clipped.
  - Admin (no stock.dispatch): a read-only queue. Rows and title links open 11-proyek-detail?tab=pemenuhan, with one muted line in the sub. There is no permission dead end and .is-chosen is never set.
  - Removed the Perusahaan column and the phone company tag (the PRJ number carries the code).
  - visible actions desktop 2 → 2, phone 2 → 2
- **Kept on purpose**: 'Ambil lebih dulu' as an aid only, the user confirms lots · Inter-company allocation section appears only when another company's lot is picked, with required reason · Locked lots shown with reason when the user lacks allocate_intercompany · Fixed bar summarising items/units/lots/reservation vs free stock · Result step pointing to Catat Pengiriman as the canonical next step

## `34-riwayat-stok.html` — Riwayat Stok
- **Purpose**: Buku besar pergerakan stok yang tidak pernah dihapus; detail satu pergerakan; membalik pindah lokasi.
- **Role / job**: both — Owner: audit apa bergerak, oleh siapa, kenapa. Admin: telusuri lot/referensi, perbaiki salah rak.
- **Primary action (before)**: Tidak ada (benar untuk audit); aksi utama = klik baris -> sheet detail
- **Secondary actions (before)**: Balikkan (tombol baris, hanya pindah lokasi; disabled untuk tanpa stock.reverse); Search + Tampilkan perusahaan + Jenis; Link produk & referensi di sel; Muat Lagi
- **Visible actions (before, desktop / phone)**: 3 / 0
- **Problems found**:
  - *hierarchy, minor* — Kolom tanpa judul paling kanan, baris 'Pindah lokasi · Rak server 12U': Tombol 'Balikkan' (pembalikan level critical) berdiri telanjang di baris ledger, di samping tag 'Sudah dibalik'; aksi yang sama ada di sheet detail (blok Koreksi). Untuk Admin tanpa stock.reverse tombol tampil disabled di baris (clutter).
  - *redundancy, minor* — Kepala kartu 'Pergerakan stok / Terbaru lebih dulu' + breadcrumb: Mengulang H1 dan subtitle '…terbaru lebih dulu'. 'Kembali' + 'Stok' sama-sama ke 30.
  - *table, minor* — Kolom Referensi: ARJ/BK/2026/10/0012 + 'Perangkat Lab Jaringan FT' diulang di 5 baris berturut-turut (satu Barang Keluar, lima produk); mata tidak menangkap bahwa itu satu dokumen.
  - *table, polish* — Kolom Jumlah: Pergerakan net-0 menaruh jalur rak 'A-03 → C-01' / '→ Tidak layak pakai' rata kanan di bawah angka; teks deskriptif di kolom numerik terbaca janggal.
  - *mobile, minor* — Baris daftar + filter: Judul 'Barang Keluar · Switch 24 port …' terpotong karena jenis + produk satu baris; referensi 'ARJ/B…' terpotong. Filter geser ke samping ('Tampilkan: Semua perusah…', 'Jenis: Semu').
- **Proposed simplification**:
  - (P2, module) Hapus tombol 'Balikkan' (dan varian disabled) dari baris; tampilkan sub-teks muted 'bisa dibalik' seperti di phone; aksi hanya di sheet detail.
  - (P2, module) Hapus kepala kartu duplikat; tampilkan hitungan hanya saat ada filter.
  - (P2, module) Baris phone: judul = produk, meta = jenis · waktu · referensi (referensi yang terpotong terakhir).
  - (P3, module) Pengelompokan visual: referensi/tanggal yang sama pada baris berurutan ditulis sekali, baris lanjutan muted (tanpa ubah data).
- **After R11**: fixed
  - (r11 round 1) Removed the row 'Balikkan' button and its disabled variant. The row opens the detail sheet, which holds Balikkan (stock.reverse, MCRisk CRITICAL); without the capability the sheet shows one muted line. No card head; the count appears only when…
  - (round 2, minor) MCPage.subnav (Gudang) after the crumbs.
  - (round 2, polish) chevron:true. The desktop table now has the Layer A .pt-col-chev column, so the row reads as openable.
  - (round 2, minor) Phone meta drops the reference stub ('· A…'): kind (tone dot) · date and time. The detail sheet names the reference in full.
  - (round 2, polish) Subtitle shortened to one sentence: 'Semua pergerakan stok gudang bersama, terbaru lebih dulu; tidak pernah dihapus.' (2 lines on phones).
  - visible actions desktop 1 → 0, phone 0 → 1
  - remaining: Phone 'after' = the Filter button. Before, the phone toolbar was a sideways-scrolling row of selects, which the heuristic did not count as buttons.
- **Kept on purpose**: Framing append-only di subtitle · Titik warna jenis (masuk/keluar/penyesuaian/pembalikan) · +qty hijau, nol muted · Sheet detail dengan penjelasan Koreksi per jenis · Tag 'Sudah dibalik' · Chip filter dari alamat (produk/ref) dengan tombol hapus · Muat Lagi

## `35-reservasi.html` — Reservasi
- **Purpose**: Menyisihkan stok bersama untuk kebutuhan proyek terkonfirmasi dan memelihara reservasi (kurangi/lepas).
- **Role / job**: admin — Admin: kerjakan antrean 'Perlu direservasi', sesuaikan saat kebutuhan berubah. Owner: lihat apa yang ditahan untuk proyek mana.
- **Primary action (before)**: 'Reservasi' per baris antrean -> sheet form (COMMIT)
- **Secondary actions (before)**: Segmen Aktif/Dilepas/Terpakai/Semua; Kurangi (outline) + Lepas (teks merah) di setiap baris reservasi; Search + Tampilkan + Proyek; Klik baris -> sheet detail
- **Visible actions (before, desktop / phone)**: 17 / 7
- **Problems found**:
  - *density, major* — Daftar reservasi, kolom aksi: Setiap baris punya 'Kurangi' (pill outline) + 'Lepas' (teks merah): 9 baris = 18 kontrol inline; di viewport pertama ~15 tombol (3 Reservasi, 4 segmen, 4 Kurangi, 4 Lepas). Kolom 'Lepas' merah berulang terbaca seperti kolom alarm; 'Kurangi' disabled abu-abu…
  - *role, minor* — Aksi baris: Owner (pengawas) melihat pemeliharaan reservasi inline di setiap baris; bagi kedua peran aksi jarang ini sebaiknya kontekstual di sheet.
  - *status, minor* — Kolom Status saat segmen 'Aktif': Pill 'Aktif' di semua baris padahal segmen Aktif sudah dipilih (status diulang 9x, juga di phone).
  - *filters, minor* — Toolbar di antara dua kartu: Search + Tampilkan + Proyek mengapung di antara 'Perlu direservasi' dan 'Daftar reservasi' tetapi hanya menyaring daftar bawah; posisinya menyiratkan menyaring seluruh halaman.
  - *table, polish* — Kolom Perusahaan (kedua tabel): Chip ARJ/CKP/BTN mengulang awalan nomor proyek ARJ/PRJ/….
  - *mobile, minor* — Segmen + filter: Segmented control tidak selebar kartu (berhenti ~x317 dari 350, rata kiri) sehingga timpang; count hilang; filter geser ke samping.
- **Proposed simplification**:
  - (P1, module) Hapus Kurangi/Lepas inline dari Daftar reservasi; klik baris membuka sheet (sudah ada) dengan 'Kurangi Reservasi' dan 'Lepas Reservasi'. Desktop lalu hanya punya tombol 'Reservasi' di antrean.
  - (P2, module) Pindahkan toolbar ke dalam kartu 'Daftar reservasi' (di bawah kepala + segmen) agar cakupannya jelas.
  - (P2, module) Kolom Status hanya saat segmen 'Semua'; kolom Perusahaan dibuang (awalan nomor sudah memuat kode).
  - (P3, system) Segmented control phone selebar kontainer dengan item flex sama rata.
  - (P3, module) Baris antrean tanpa stok: ganti tombol 'Reservasi' disabled dengan teks muted 'Tunggu barang masuk'.
- **After R11**: fixed
  - (r11 round 1) Removed the 18 inline Kurangi/Lepas controls. The row opens the detail sheet, which holds Kurangi Reservasi (COMMIT) and Lepas Reservasi (CRITICAL, quiet danger). Queue rows without stock explain why instead of showing a greyed button. The…
  - (round 2, major) The sheet is now discoverable. The project cell in the list renders projCell(x.p) without the nav flag: its .pt-cell__title is MCList's select trigger and opens the sheet instead of going to 11. Barang is plain text (cellLink(name, sku,…
  - (round 2, polish) Both tables share column widths: Proyek 25% and Barang 25% in needSpec.columns and COLS. Barang starts at the same x in both cards (528/528 at 1366, 681/681 at 1920). 28% was clamped by the queue's numeric columns, hence 25%.
  - (round 2, minor) Queue phone meta leads with the deciding figure: 'tersedia N · <project short name>', so the project name truncates instead of the number.
  - (round 2, minor) MCPage.subnav (Gudang) after the crumbs. The in-card toolbar host now also carries the Layer A class .pt-section__toolbar (kept .gd-cardbar for the chips stack and the phone padding).
  - (round 2, polish) Subtitle is one sentence and two lines on phones: 'Stok yang disisihkan untuk proyek aktif; mengurangi Tersedia, bukan stok fisik.'
  - visible actions desktop 9 → 2, phone 2 → 3
  - remaining: At 1920 px the 4-column list still leaves a wide gap between Barang and Jumlah; the shared 25% grid was chosen over pulling the numbers in, so the two cards stay aligned.
- **Kept on purpose**: Antrean kerja di atas dengan satu aksi jelas per baris · Level konfirmasi COMMIT (reservasi/kurangi) dan CRITICAL + alasan (lepas) · Count per segmen di desktop · Sheet detail dengan fakta · Masking 'Proyek perusahaan lain' · Baris phone tanpa tombol inline

## `36-stok-opname.html` — Stok Opname
- **Purpose**: Count sessions per rack/zone. Open one, record counted vs system basis (autosaved), detect stale counts (movement after start), and apply the difference (CRITICAL, reason, Kewenangan khusus). Surplus becomes an Owner finding.
- **Role / job**: both — Floor: hitung rak dan isi jumlah. Owner: tinjau selisih dan terapkan dengan alasan bila hitungan sudah lengkap dan tidak basi.
- **Primary action (before)**: Owner: Terapkan Selisih (action bar, CRITICAL). Counter: record counts in the session (steppers/scan). Mulai Hitungan is the less frequent start action.
- **Secondary actions (before)**: Mulai Hitungan (header, sheet); Pilih sesi (row); Pindai; Hitung Ulang (stale notice); Cetak Lembar Hitung (demo); Status filter
- **Visible actions (before, desktop / phone)**: 12 / 5
- **Problems found**:
  - *hierarchy, major* — Owner view: header 'Mulai Hitungan' vs action bar 'Terapkan Selisih': There are two green primary CTAs in one viewport. On phones 'Mulai Hitungan' is a full-width green button at the top and 'Terapkan Selisih' a full-width green bar at the bottom. For the Owner the decision (apply) is the job and starting a count is floor…
  - *redundancy, minor* — Count section: The summary '4 dari 5 baris terhitung · kurang 1 (1 baris)' appears in the table foot AND in the action bar info. The session status pill 'Sedang dihitung' appears in the selected list row AND in the count section title.
  - *role, major* — Admin view (Sari: no stock.count, no stock.count_apply): For a read-only user the page shows: a disabled pale-green primary 'Mulai Hitungan' + lock note under it in the header, an info notice 'Hanya lihat' inside the count section, and a fixed action bar with a disabled primary 'Terapkan Selisih' + a two-line…
  - *status, polish* — Disabled 'Terapkan Selisih' reason text: For the Owner the reason '1 baris belum dihitung' floats grey to the left of the disabled button, detached from the info block on the left of the bar.
  - *mobile, minor* — Phone count rows: Lot codes (the identifier the counter checks on the label) are truncated ('B-01 · L-260712...'), and product names truncate ('Access point dual ba...') because the 140 px stepper takes the row end.
- **Proposed simplification**:
  - (P1, module) Role-adaptive actions. Without stock.count: hide 'Mulai Hitungan', the scan field and steppers (already hidden), and drop the header lock note; keep ONE 'Hanya lihat' line in the count section. Without stock.count_apply: do not render the action bar at all; show 'Menunggu Owner…
  - (P1, module) Demote 'Mulai Hitungan' to an outline button in the 'Sesi hitungan' section head (it creates a session in that list). On phones it becomes a compact button in that section head, not a full-width header CTA. The action bar 'Terapkan Selisih' stays the page's only primary.
  - (P3, module) Remove the duplicate summary from the table foot and keep only the autosave indicator there. Drop the status pill from the count title (the selected row already carries it), or keep the pill and drop the eyebrow 'Hitungan'.
  - (P2, module) Phone count rows: put the lot code on its own non-truncating line ('L-260712-01 · B-01'). Let only the product name ellipsize.
- **After R11**: fixed
  - 'Mulai Hitungan' moved from a green header primary to an outline button in the 'Sesi hitungan' list head, beside the Status filter. 'Terapkan Selisih' (action bar) is the page's only primary.
  - Without stock.count, 'Mulai Hitungan', 'Hitung Ulang', scan and steppers are absent. Without stock.count_apply there is no action bar. The Admin gets one muted foot line instead of lock notes and disabled primaries.
  - The Owner gets disabled + reason only when the state blocks applying. The reason is the strong line of the bar ('1 baris belum dihitung'). Phones show it as one line above the button.
  - Round 2 fix (review polish, judgement call): 'Cetak Lembar Hitung' now renders only for stock.count holders. The sheet collects counted quantities (a counting aid listed under SCR-24's counting actions). The Admin's count head now has no button at all.
  - The phone and tablet count-row layout keeps lot code + rack untruncated. Duplicate summary hidden when the bar carries it. Toasts removed (the page updates in place).
  - visible actions desktop 7 → 5, phone 5 → 5
  - remaining: Phone count stays 5 for the Owner. The change is hierarchy, not count: one primary, and the header primary became an outline in the list head. Admin: 1 control (Status filter) on desktop and phone.
- **Kept on purpose**: Basis = system quantity at count start, stale detection with 'Hitung Ulang' inside the warning notice · Kurang (red) / Lebih · temuan (Owner finding) wording; surplus never adds stock · Autosave indicator 'Tersimpan HH.MM' instead of a save button · Reservation-cut chooser only when a shortage dips below reservations · CRITICAL confirm with reason for Terapkan Selisih

## `40-pengiriman.html` — Pengiriman
- **Purpose**: Deliveries hub: tab 'Belum terkirim' (dispatched/shipped, handover not recorded), 'Serah terima jasa', 'Riwayat pengiriman' (list-detail ≥1101 px, sheet below). Pengiriman never changes stock.
- **Role / job**: both — Admin: lihat apa yang sudah keluar tapi belum dicatat diterima klien, lalu catat. Owner: pantau yang terlambat dan selisih yang masih terbuka.
- **Primary action (before)**: Row 'Catat' on a pending item (-> 41 with id). Header 'Catat Pengiriman' currently duplicates it via a chooser.
- **Secondary actions (before)**: Barang Keluar (header, Owner only); Tabs Belum/Jasa/Riwayat; Search + company + Cara pemenuhan filters; Buka Kasus Koreksi (notice); Riwayat row -> detail panel: Buka Pengiriman, Buka proyek, Kasus button, document link
- **Visible actions (before, desktop / phone)**: 9 / 6
- **Problems found**:
  - *hierarchy, minor* — Open-case notice inside 'Belum terkirim' card: A large orange notice ('1 selisih pengiriman masih terbuka' + 'Buka Kasus Koreksi') sits inside the pending card under a single row. It is about already-recorded deliveries (history), not pending ones, and visually outweighs the queue. On phones it is ~190…
  - *redundancy, polish* — Tab panel heading: Tab 'Belum terkirim' is followed by a card titled 'Belum terkirim'. The same happens for 'Serah terima jasa' and 'Riwayat pengiriman'.
  - *routing, minor* — Header 'Catat Pengiriman' vs row 'Catat': The header primary opens 41 without id, a chooser that re-lists exactly the rows already in the 'Belum terkirim' and 'Serah terima jasa' tabs. With 1 pending item, the header CTA, the row title link, the row click and the row 'Catat' button all lead to…
  - *role, minor* — Header 'Barang Keluar' (Owner): A cross-module floor shortcut sits beside the primary in the Owner's header (Admin does not get it: no stock.dispatch). On phones it becomes a half-width button equal in size to 'Catat Pengiriman'.
  - *card, minor* — Riwayat detail panel: The detail panel is ~930 px tall against a 6-row list (~410 px), leaving a 500 px empty left column. Inside the panel the project is linked twice (meta 'Perangkat Lab Jaringan FT' + foot 'Buka proyek'). 'Buka Pengiriman' opens 41, which re-renders the same…
  - *filters, major* — Toolbar: Search + 'Tampilkan' + 'Cara pemenuhan' scroll sideways on phones ('Cara pemenu...' clipped at the right edge), and the tab strip clips 'Riv...'. The 'Cara pemenuhan' select duplicates the tab split: JASA rows only live in the 'Serah terima jasa' tab, so…
  - *table, minor* — Riwayat tab, split mode ≥1101 px: In split mode the 'Selisih' column is hidden (.krm-wide), so ARJ/BK/2026/10/0011, which has an open shortage, looks like every other 'Terkirim' row. The phone list shows 'Ada selisih', and at 1024 the column shows '1 Mouse USB kurang'. The attention signal…
- **Proposed simplification**:
  - (P2, module) Remove the header 'Catat Pengiriman' (the tab list is the chooser; keep 41-without-id reachable from the palette 'Catat pengiriman' quick action). Make the row 'Catat' / 'Catat Serah Terima' the visible next action. Move header 'Barang Keluar' into an overflow ('Lainnya') or…
  - (P1, system) Toolbar: drop 'Cara pemenuhan' from the visible toolbar (tabs already separate Jasa; Gudang vs Kirim langsung is visible in the 'Cara' column). On phones: search + 'Filter' sheet (company inside), no sideways scroll. Make the tab strip fit 350 px (shorter labels 'Belum terkirim…
  - (P2, module) Move the open-case notice out of the pending card into a compact one-line attention strip above the tabs ('1 selisih pengiriman terbuka · Buka Kasus Koreksi' as a text link), or into the top of the Riwayat tab.
  - (P2, module) Riwayat split: keep a discrepancy signal visible when .krm-wide columns are hidden. Add the 'Ada selisih' warning sub-line under the Status pill (as the phone row already does). In the detail panel, remove the foot 'Buka proyek' link (project already linked in the meta) and…
  - (P3, system) Tab panels: drop the card title that repeats the tab label and keep the sentence as a quiet caption (MCTabs/section pattern).
- **After R11**: fixed
  - No header buttons. 'Catat Pengiriman' is gone (the tabs are the chooser; 41 without an id stays in the palette). 'Barang Keluar' is a quiet link in the 'Belum terkirim' caption, shown only with MCApp.canGo('gudang.keluar').
  - Review major #1 (phone toolbar clipped): resolved by the Layer A 03:55 change (phones put every filter, including a lone company view, in the sheet). Verified on all three tabs at 390x844: search + 'Filter', no clipping.
  - 'Perlu tindakan' (MCUI.signals) above the toolbar has one row per open SELISIH_PENGIRIMAN case → 70?sel=. Round 2 fix (review polish): it now renders into its own host [data-krm-signals], filters by the session company view (inViewCo), re-renders on…
  - Round 2 fix (review minor #3): 'Ada selisih' in the split-mode Status cell and in the phone row end now appears only for an open shortage (openShort: received < shipped and case OPEN, or unresolved without a case). CKP/BK/2026/09/0004, a condition-only…
  - Round 2 fix (review polish): the Riwayat detail meta drops the company tag when the title is a record number (kept for Kirim langsung / Serah Terima Jasa).
  - The Jasa tab now uses the Layer A MCTabs shortLabel ('Jasa' on phones) instead of injected spans. The local .krm-tab-long/.krm-tab-short CSS was removed.
  - Cara pemenuhan filter dropped (duplicated the Jasa tab). Tab panels open with a caption, not a title. Perusahaan columns and the constant Jasa Status column removed. The detail foot keeps only 'Buka Pengiriman'.
  - visible actions desktop 6 → 3, phone 5 → 2
  - remaining: Admin: desktop 2 (company view + row Catat), phone 1 (Filter).
- **Kept on purpose**: Three tabs with counts and the orange attention count on 'Belum terkirim' · Schedule cell with relative phrase ('16 hari lagi' / 'Lewat n hari' in warning) · Row 'Catat' with an aria-label naming the record · List-detail on wide desktop and sheet on smaller screens, with ?tab=riwayat&sel deep link · Subtitle stating Pengiriman never changes stock

## `41-catat-pengiriman.html` — Catat Pengiriman
- **Purpose**: Record form for one dispatch/jasa/dropship item: date, time, recipient, received qty per line (difference opens a Kasus Koreksi), proof upload, optional BAST draft. For a recorded delivery the same route is the record view with 'Tutup Pengiriman' (Kewenangan khusus).
- **Role / job**: admin — Saya mencatat apa yang benar-benar diterima klien dari Barang Keluar ini, siapa penerimanya, dan buktinya, lalu menyimpan sekali.
- **Primary action (before)**: Catat Pengiriman (fixed action bar, COMMIT)
- **Secondary actions (before)**: Batal (bar); Ada masalah? (per line note); Pratinjau Surat Jalan (notice); Upload bukti; Siapkan draf BAST (checkbox); Proyek link (aside) / project link in meta; Record view: Kirim Pengganti, Kasus button, Siapkan Draf BAST, Tutup Pengiriman, Buka proyek
- **Visible actions (before, desktop / phone)**: 10 / 3
- **Problems found**:
  - *hierarchy, minor* — 'Surat Jalan masih draf' notice: The draft-SJ warning + 'Pratinjau Surat Jalan' sits inside 'Barang diterima' under the quantity lines, but it is about the signed proof (Bukti kirim section). The draft status is also shown in the aside ('Draf Surat Jalan · Draf').
  - *density, minor* — Aside 'Saat dicatat': A real decision input (checkbox 'Siapkan draf BAST dari serah terima ini', checked by default) is buried at the bottom of an explanatory aside, half-hidden behind the fixed action bar at 1366x768 (y≈666-708) and the very last element on phones. 'Stok tidak…
  - *redundancy, polish* — Header meta, aside, subtitles: ARJ/BK/2026/10/0012 is printed five times above the fold (crumb, meta line, aside 'Nomor', 'Barang diterima' subtitle, effects text). The project is linked twice (meta link + aside 'Proyek >'). Before D-27, three controls led back to 40 (Kembali, crumb…
  - *role, major* — Record view (?id=dlv-01) as Admin: The Admin sees 'Kirim Pengganti' (-> 33 Barang Keluar), where she lacks stock.dispatch and hits the permission wall. She also sees a full 'Tutup Pengiriman' card with explanatory copy, a disabled pink danger button and a 'Butuh kewenangan khusus' note, for…
  - *alignment, minor* — 'Penerimaan' section fields: Ragged right edges: date field ends at x≈537, time at 707, recipient at 817, card at 905. The date hint wraps one orphan word ('…dijadwalkan 30 Okt / 2026'). Spacing comes from inline styles in pengiriman.js (margin-bottom:14px, margin-top:16px,…
  - *table, polish* — Lines grid 'Selisih' column: A right-aligned column of five '—' dashes is shown in the default (no difference) state. It reads as data and draws the eye to the far right edge.
  - *tablet, major* — Two-column form at 1024x768: The pt-grid-2 form + 330 px aside stays until 900 px. In the 545 px left column the lines grid breaks identifiers mid-code ('MSE-USB · Lot L-/261002-02', 'UTP-C6-305 · Lot L-/261012-01') and product names wrap ('Switch 24 port / gigabit'), making each line…
- **Proposed simplification**:
  - (P2, module) Dissolve the 'Saat dicatat' aside. Move the BAST checkbox into the 'Bukti kirim' section (it is a document decision next to the proof) and delete the effects list (the confirm dialog + action-bar info already carry it). The aside keeps only a compact 'Barang Keluar' context card.
  - (P2, module) Below 1180 px, render the form in one column (FORM container max ~760 px). The Barang Keluar context becomes a slim strip above 'Penerimaan'. Keep the aside layout only ≥1181 px so lot codes never break.
  - (P3, module) Move the 'Surat Jalan masih draf' notice into 'Bukti kirim' and keep the SJ status only there (remove from the aside kv).
  - (P1, module) Record view role gating: show 'Kirim Pengganti' only with hasCap('stock.dispatch') (as 40's header already does). For users without delivery.close, replace the 'Tutup Pengiriman' card with one muted line ('Penutupan dilakukan pemegang kewenangan khusus'). Remove the header…
  - (P3, module) Replace inline style spacing with tokens/classes and lay date+time on a 2-col grid whose right edge matches the recipient field. Shorten the date hint so it does not orphan. Hide the 'Selisih' cell content until a difference exists (empty, not '—').
- **After R11**: fixed
  - The 'Saat dicatat' aside and its effects list were removed. The stock consequence lives in the bar info and the COMMIT dialog. The intro is the Penerimaan sub. The BAST checkbox and the 'Surat Jalan masih draf' notice sit in 'Bukti kirim'. The aside is one…
  - One column below 1181 px (context first). Fields on a 560 px grid. The Selisih cell stays empty until there is a difference. Inline spacing uses classes.
  - MCPage.dirtyGuard covers Batal, the breadcrumb and navigation. Result: no toast; the card links only what the bar does not carry.
  - Round 2 fix (review polish): the head meta drops the company tag beside ARJ/BK/2026/10/0012. The tag is kept for item-based forms with no number.
  - Round 2 fix (review polish b): the line meta uses a non-breaking hyphen ('alokasi antar‑perusahaan', U+2011), so it no longer splits at the hyphen.
  - visible actions desktop 6 → 4, phone 4 → 4
  - remaining: Phone header is title + number + project/client (2 lines) + pill; the company tag line is gone.
- **Kept on purpose**: One clear primary in the fixed bar with a live summary ('16 dari 16 unit diterima · Belum ada selisih') · 'Ada masalah?' per-line disclosure that becomes a required note when qty < shipped · Stepper capped at shipped qty with a reason tooltip · Proof upload marked 'Disarankan; bisa ditambahkan nanti' · COMMIT confirm with full summary; discard-guard on Batal when dirty · Result card with next…

## `50-dokumen.html` — Dokumen
- **Purpose**: Find any document (generated by the company, prep draft, or client original) by number, type or project, see whether it is issued and whether its PDF is ready, and open it.
- **Role / job**: both — Admin: 'Which documents need my attention (failed or pending PDF, drafts), and open document X.' Owner: 'Look up a document by number.'
- **Primary action (before)**: Row click opens Detail Dokumen. The page has no page-level primary; the header holds one outline button, 'Dokumen Administrasi'.
- **Secondary actions (before)**: Dokumen Administrasi (outline button in the header, goes to 52); Filter (panel holding PDF, in the current build); '1 PDF gagal dibuat · 2 sedang dibuat' attention link in the section head; 'Coba buat ulang PDF' inline in a FAILED row; Muat Lagi
- **Visible actions (before, desktop / phone)**: 3 / 3
- **Problems found**:
  - *redundancy, minor* — Table column 'Asal': Every row on the first page prints 'Dibuat perusahaan'. For non-COMPANY issuers, docCell already appends the issuer to the sub-line (dok-sub-issuer), so the column carries no information on most rows and costs about 150 px of width.
  - *status, minor* — PDF and Status columns: The normal row shows two green pills side by side ('PDF siap' + 'Terbit'). The real exceptions ('PDF sedang dibuat', 'PDF gagal dibuat') get lost in a column of green. The phone layout already shows the PDF note only for PENDING/FAILED.
  - *filters, major* — Toolbar under the page head (current build, re-shot): Search, Tampilkan, Jenis and Status fill row 1 and the new 'Filter' button sits alone on row 2 (x 236-326, y 180-208). This leaves an orphan row and pushes the list down about 40 px. In the BEFORE shot the PDF select was orphaned the same way. At 1024 and…
  - *table, polish* — Row ARJ/INV/2026/10/0032 (PDF gagal): The inline 'Coba buat ulang PDF' button stacks under the pill and makes a two-line cell. That row becomes taller than its neighbours.
  - *mobile, minor* — Header on phone: The full-width outline 'Dokumen Administrasi' button (y 161-205) takes a whole row above search. The first document row starts at about y 455, so title, button, search, section head and attention link fill more than half the first screen.
  - *copy, polish* — Page subtitle vs section sub: The subtitle ends '...per jenis dokumen.' and the section sub repeats 'Per jenis dokumen, terbaru lebih dulu; versi lama menjorok...'. On phone the sub takes 2 lines.
- **Proposed simplification**:
  - (P1, system) MCFilter single-row fit rule for desktop/tablet: search (flex) plus as many selects as fit, plus a 'Filter' button that holds the rest. Never let the Filter button or a single select wrap alone. For Dokumen: search, Tampilkan, Jenis and Filter inline (Status + PDF inside the…
  - (P1, module) Remove the 'Asal' column (non-COMPANY issuers stay in the sub-line, which already renders them). Make the PDF column exceptions-only: show the pill only for PENDING/FAILED, with FAILED getting a short inline text button 'Buat ulang' on the same line. READY shows nothing, or a…
  - (P2, module) Phone: render 'Dokumen Administrasi' as a compact secondary (MCActions keep, or a text link in the section head) so search + Filter follow the title directly. Trim the section sub to 'Versi lama menjorok di bawah versi berlaku'.
- **After R11**: fixed
  - Round 1: 'Dokumen Administrasi' moved from a header button to a quiet subtitle link. The list card head became a quiet result line ('35 dokumen · versi lama di bawah versi berlaku'), with the PDF attention filter link on the right. The table went from 6 to 4…
  - Round 2, D-32 normal state stays quiet: the Status column (and the phone end slot) shows a muted 'Terbit' text (.dok-pdf-ok) for ISSUED. Pills are kept only for Draf, Direvisi, Dibatalkan and Diunggah.
  - Round 2, one strong title per row: the Proyek cell is regular weight (.dok-proj wrapper).
  - Round 2, record number never truncates on phones: the PDF exception moved out of .pt-row__end into the start of the meta as a short tone-coloured word ('PDF gagal' / 'PDF diproses'). The end slot holds the state only. Guard: .dok-list-section .pt-list__rows…
  - visible actions desktop 2 → 2, phone 2 → 2
  - remaining: Layer A: at 1366 the fixed-width filters stop about 260 px short of the card edge (shared request).
- **Kept on purpose**: Group header rows per document type · Version chains indented under the current version · Exact-number lookup with the 'Nomor persis ditemukan' note · Attention link that applies the PDF filter in place · Phone rows: number, company tag + title, status, PDF note only on exceptions · Muat Lagi with an end-of-list message

## `51-dokumen-detail.html` — Detail Dokumen
- **Purpose**: Preview one document version and take its lifecycle step: issue a draft, download or retry the PDF, revise or void, or upload a client original.
- **Role / job**: both — Admin: 'Check the draft is right, then issue it (the number gets locked).' Owner: 'Get the PDF of the issued version, or correct it (revise/void, documents.correct is ADM_PLUS).'
- **Primary action (before)**: Depends on state: Terbitkan (draft), the 'Unduh PDF' split button (issued), 'Coba Buat Ulang PDF' (PDF failed), 'Unggah Asli dari Klien' (prep draft).
- **Secondary actions (before)**: Cetak Draf (outline); Split menu: Revisi / Batalkan Dokumen; Rincian links: Proyek, Catatan sumber, Dokumen Administrasi; Version rows
- **Visible actions (before, desktop / phone)**: 5 / 0
- **Problems found**:
  - *redundancy, minor* — Head meta, notice, preview sub, paper, Rincian, Versi: The draft state is said 6-7 times on one screen: meta 'Belum bernomor' + 'Draf' pill; info notice 'Pratinjau sebelum terbit... Nomor diberikan saat Terbitkan'; preview sub 'Draf belum bernomor: ditandai PRATINJAU...'; paper 'Nomor diberikan saat terbit';…
  - *role, minor* — Split chevron menu on an issued document (doc-sj-d1): Admin does not hold documents.correct, so the chevron opens a menu whose two items are both disabled. Each carries the same 3-line reason ('Butuh kewenangan Koreksi dokumen; diatur Owner di Pengguna & Akses.'). The menu has nothing to do, and the reason is…
  - *card, minor* — Side column: Versi and Riwayat cards: For a simple document the side column becomes card soup. The 'Versi' card holds one row ('Satu versi'). 'Riwayat' holds one entry, or the empty line 'Belum ada aktivitas tercatat untuk dokumen ini' (doc-sj-d1). That is two near-empty cards with full headers.
  - *status, polish* — Head meta on an issued document: Two green pills sit side by side ('Terbit' lg + 'PDF siap'), and both repeat in the Rincian PDF row and the Versi row.
  - *mobile, minor* — Top of the phone page for a draft: Three explanations stack before the paper: the unstyled paragraph 'Terbitkan dari layar desktop atau tablet...' (dok-phone-note), the info notice, and the 2-line preview sub. Together they take about 250 px, the paper starts at about y 435, and the screen…
  - *tablet, polish* — Side column at wide desktop: The side column grows to about 630 px: Rincian labels sit at x 1295 and values at x 1518, leaving about 120 px of dead gap with long row rules. The preview stage shows about 180 px of grey on each side of the 640 px paper.
  - *tablet, polish* — Rincian key-value list: The 345 px card leaves a narrow label column: 'Catatan sumber', 'Tanggal dokumen' and 'Dokumen Administrasi' wrap to two lines, and values wrap too ('Barang Keluar / ARJ/BK/2026/10/0012').
- **Proposed simplification**:
  - (P2, module) Say each state once per screen. Keep the head pill(s). Use a notice only for consequence or exception (blockers, FAILED, PENDING, VOIDED, prep draft). For a plain draft, fold 'Pratinjau sebelum terbit' into the preview sub and drop the separate notice; on phone merge the…
  - (P2, module) When the chain has one version, drop the Versi card and add 'Versi 1' to Rincian. When Riwayat has 0-1 entries, render it as a light list (no full card header), or merge it into one 'Riwayat & versi' section.
  - (P2, system) Build the head with MCActions: the state primary; Cetak Draf as secondary; overflow holding Revisi and Batalkan (danger, last). For a role without documents.correct, show ONE disabled overflow item with the reason, not two. Phone: primary + menu.
  - (P3, system) Cap the side column at about 320-420 px (.dok-detail grid: minmax(0,1fr) clamp(320px,30vw,420px)). Make the kv list stack label over value when its card is under about 360 px (container query on .pt-kv).
- **After R11**: fixed
  - Round 1: the head renders through MCActions and the MCSplit 'Unduh PDF ▾' is migrated. The state decides the primary. Cetak Draf and Tautkan Kuitansi are quiet secondaries. Revisi and Batalkan Dokumen (danger, last) sit in 'Tindakan Lain' under…
  - Round 2: Terbitkan is now gated by its canonical capability, through the def's capability: issueCap(type), i.e. documents.issue or (invoice layouts DOC-06/DOC-04) invoice.issue (PERMISSIONS_MATRIX documents.issue, WF-DOC-01). An account without it never sees…
  - Round 2: the FAILED notice now states the consequence ('PDF belum bisa diunduh.') instead of repeating the head pill 'PDF gagal dibuat'.
  - Round 2: the kv container-query regression no longer applies. Layer A removed the .pt-kv container query at 04:16. My temporary padding override and the column widening were reverted, and Rincian is two columns at 1024, 1366 and 1920 again (verified).
  - visible actions desktop 2 → 2, phone 0 → 1
  - remaining: Layer A pt-kv on phones: two columns (global rule) while the ≤767 dt rule still shrinks the label and drops its divider. See sharedRequests.
- **Kept on purpose**: Paper preview with PRATINJAU / DIBATALKAN / VERSI LAMA watermark and the 'Nomor diberikan saat terbit' placeholder · Issued head 'Unduh PDF ▾' split with Revisi + Batalkan behind it: the model for other detail heads · Quotation guard ('Buat Revisi di Penawaran'; void disabled with reason) · Rincian cross-links to project, source record and Dokumen Administrasi with the requirement pill ·…

## `52-dokumen-administrasi.html` — Dokumen Administrasi
- **Purpose**: Per-project checklist of required administrative documents. Each item is resolved by preparing and issuing a draft, uploading evidence, linking, or marking it not applicable. A second tab lists unmet items across projects.
- **Role / job**: admin — Admin: 'Which required documents are still missing for this project, and what is the next step for each?' Owner (oversight): 'Is this project's paperwork complete enough to close?'
- **Primary action (before)**: The next step of the selected requirement, shown in the side panel or sheet: Pratinjau & Terbitkan, Siapkan Draf, Unggah Bukti or Tautkan Dokumen.
- **Secondary actions (before)**: Project picker; Tab 'Belum terpenuhi (7)'; Buka proyek; Tandai Tidak Berlaku; Ganti File; Buka Dokumen; Source routes (Catat Pengiriman, Lihat pengiriman proyek, Barang Keluar)
- **Visible actions (before, desktop / phone)**: 1 / 1
- **Problems found**:
  - *hierarchy, major* — Requirement side panel footer: The only next step for the selected requirement, 'Pratinjau & Terbitkan' (y about 889), sits in the panel footer below the fold. Above it come the explain text, a 240 px mini paper and a 5-row kv list. The first screen shows what is wrong but not what to…
  - *density, polish* — Panel preview placeholder; toolbar hint: Every BELUM_ADA requirement shows an empty dashed box 'Belum ada dokumen untuk dipratinjau.' (about 65 px). The hint 'Status syarat dihitung dari dokumen yang tertaut...' sits right-aligned far from the picker on desktop and as a 2-line block on phone.
  - *redundancy, minor* — Project picker vs checklist card head: The project's identity appears twice: the picker 'Perangkat Lab Jaringan FT · ARJ/PRJ/2026/0142' and the card head 'Perangkat Lab Jaringan FT / ARJ ARJ/PRJ/2026/0142 · Universitas Contoh Nusantara'. On phone the card head is 4 lines plus its own 'Buka…
  - *redundancy, minor* — Panel key-value list: 'Sifat: Wajib' and 'Dipenuhi dengan: Dokumen yang dihasilkan' repeat the panel sub 'Wajib · Dokumen yang dihasilkan'. The 'Proyek' kv link repeats 'Buka proyek' from the checklist head. The label 'Boleh ditandai tidak berlaku' wraps to 2 lines.
  - *routing, minor* — Panel footer when no candidate exists, and the waive button: A 'not possible yet' state is told with three elements: a source link ('Catat Pengiriman' / 'Lihat pengiriman proyek'), a disabled 'Tautkan Dokumen', and a reason paragraph. 'Tandai Tidak Berlaku' (CRITICAL, reason required) is a ghost button in the same…
  - *status, polish* — Checklist rows: Each row shows both a mark icon (check / clock / triangle) and a status pill meaning the same thing. On phone the pill becomes a third line, making rows 90-110 px tall.
  - *mobile, major* — Checklist order: The checklist keeps fixture order, so the four 'Terpenuhi' rows come first and the three actionable rows (Disiapkan + 2× Belum ada) start below y about 1050. The first screen is header, tabs, picker, hint and a 4-line card head (about 560 px) before even the…
- **Proposed simplification**:
  - (P1, module) Move the panel's next-step button(s) directly under the explain line, before the preview and kv: one primary plus at most one secondary. Put 'Tandai Tidak Berlaku' into a panel MCMenu as a danger item. Drop the disabled 'Tautkan Dokumen' when the reason + route link already…
  - (P2, module) Group the checklist: 'Perlu disiapkan' (BELUM_ADA, DISIAPKAN; lifecycle order kept inside the group) first, then 'Sudah beres' (TERPENUHI, TIDAK_BERLAKU), collapsed with a count on phone. Default selection already picks the first open required item.
  - (P2, module) Card head drops the project name and number (the picker says them) and keeps progress, client and 'Buka proyek'. Panel kv drops Sifat, Dipenuhi dengan and Proyek. Remove the empty preview placeholder. Phone row: show the icon plus the state word in the note, with no third-line…
- **After R11**: fixed
  - Round 1: the panel leads with the next step: explain line, reason, candidates, then one primary plus at most one secondary, then the mini preview and Catatan. 'Tandai Tidak Berlaku' moved into the panel kebab (danger + hint, requirements.waive). A step that…
  - Round 2, role emphasis (D-36): the panel primaries (Pratinjau & Terbitkan, Tautkan Dokumen, Unggah Bukti, Siapkan Draf) are green for the Admin and outline for the Owner's oversight view (vPrim).
  - Round 2, canonical gating: 'Siapkan Draf' and 'Pratinjau & Terbitkan' render only with documents.issue (invoice.issue for invoice layouts). Without it the draft gets a quiet 'Buka Dokumen' and no draft step. The dok-req-draft handler re-checks the capability.
  - Round 2, cross tab on phone: the end-slot pill is removed. The state word leads the meta (strong .dok-req-word · Wajib/Opsional · project), as on the checklist rows, so requirement names keep their width.
  - Round 2: the cross-tab Proyek column title is regular weight (.dok-proj).
  - visible actions desktop 7 → 7, phone 3 → 4
  - remaining: The desktop/phone button count is mostly requirement rows (row buttons). Phone 3→4 because the grouped checklist now puts the three actionable rows plus the disclosure on the first screen.
- **Kept on purpose**: Progress line '4 dari 7 syarat wajib terpenuhi' with the bar · Sticky side panel on wide screens and a sheet ('Kembali ke checklist') on narrower ones · 'Belum terpenuhi' tab with its attention count and the clean cross-project table · Per-mode explanations (asli dari klien vs dokumen yang dihasilkan; drafts never satisfy) · Confirmation summaries for Tautkan and Tandai Tidak Berlaku (reason…

## `60-keuangan.html` — Keuangan
- **Purpose**: Finance hub: the five separate period figures, derived follow-up signals, receivable ageing, and the latest cash in and out.
- **Role / job**: both — Owner: 'How is money this month, and what needs my attention?' Admin: 'Which receivable follow-ups are due per company, and record an incoming payment.'
- **Primary action (before)**: Catat Pembayaran (green head primary). Right for Admin; for the Owner the real primary is the 'Perlu tindakan' signal list.
- **Secondary actions (before)**: Pengeluaran (outline in the head); Five concept tiles (drill links); Laporan piutang; Ageing rows; Semua pembayaran; Semua pengeluaran
- **Visible actions (before, desktop / phone)**: 8 / 5
- **Problems found**:
  - *redundancy, minor* — Toolbar line, figures section head, tile notes: Period and scope are stated 3-4 times: toolbar 'Periode Oktober 2026 · angka per 14 Okt 2026'; title 'Angka keuangan Oktober 2026'; the 'Gabungan' pill plus sub 'Gabungan semua perusahaan...'; and '· Okt 2026' in four tile notes. The rule sentence 'Lima…
  - *routing, minor* — 'Pengeluaran' head button, 'Kas keluar' tile, 'Semua pengeluaran' link: All three go to 66-pengeluaran.html. The head button is the least specific of the three and adds a second head button without its own intent.
  - *role, minor* — Page head actions: The Owner's head leads with green 'Catat Pembayaran' (an Admin execution task, payment.record). It is the only strong CTA on an oversight page, while the Owner's real next step sits in 'Perlu tindakan'.
  - *spacing, minor* — Hub row cards (.keu-hub-row > .pt-section align-self: stretch): Equal-height stretching creates voids: the Owner's 'Umur piutang' has 40-70 px of air above its foot note, and the Admin's 'Perlu tindakan' (4 rows) has about 80 px of empty bottom.
  - *alignment, polish* — Admin ageing table; concept tile note: Admin ageing labels are underlined text links, while the Owner gets full-row links with chevrons. The tile note sits under the value for the Owner but under the company lines for the Admin.
  - *mobile, major* — Concept blocks before 'Perlu tindakan': Five concept blocks (label, value and a 3-column per-company grid each) take about 1.4 screens, so 'Perlu tindakan' starts at y about 1050: the Owner's attention list is on the third screen. Two full-size head buttons also take a row.
  - *tablet, minor* — Concept grid: The container query turns the 5 tiles into 2 wide + 3 narrow (span 3 / span 2), so tile widths differ between rows (about 455 px vs 300 px at 1024). This is exactly the 'cards not symmetrical' complaint.
- **Proposed simplification**:
  - (P1, module) Role-aware head through MCActions. Owner: no green primary; 'Catat Pembayaran' becomes a quiet secondary (capability unchanged). Admin: 'Catat Pembayaran' as the only primary. Drop the 'Pengeluaran' head button (the tile + 'Semua pengeluaran' cover it).
  - (P2, module) Phone: render the concepts as a compact 5-row list (label + value; per-company split behind one 'Per perusahaan' disclosure) so 'Perlu tindakan' follows within the first two screens.
  - (P2, module) Tablet: keep 5 equal tiles in one row (splits shortened), or render the figures as a symmetric concept × company table (plus a Gabungan column for the Owner) instead of the 2+3 span grid.
  - (P2, module) State period and scope once: keep the toolbar line and title 'Angka keuangan'; hide the 'Gabungan' pill when the filter already says Semua perusahaan; shorten fig-sub to one clause or an info tooltip; drop '· Okt 2026' from the tile notes.
  - (P3, system) Make .pt-grid-2 align cards to the start by default (stretch only for same-content tiles); foot notes follow the content.
- **After R11**: fixed
  - Round 1: role-aware MCActions head (Admin green / Owner quiet 'Catat Pembayaran'). The 'Pengeluaran' button is removed. Period and scope are stated once. Phone: a compact 5-row figure list with ONE 'Per perusahaan' toggle. Tablet: five equal tiles at ≤1040…
  - Round 2, the hub row is no longer ragged: fitSignals() renders as many signals as end level with the ageing card (within about 24 px, never fewer than 3) whenever the two cards sit side by side. It re-fits on width changes only and on fonts.ready. Measured:…
  - Round 2: 'Invoice Belum Ditagihkan tidak termasuk.' moved into the ageing sub as a one-line scope ('Gabungan · tanpa Belum Ditagihkan' / 'Per perusahaan · tanpa Belum Ditagihkan'). The foot keeps 'Sengketa tetap dihitung umurnya.'
  - Round 2, phone 'Kas masuk terbaru': the payment number is the row title (never truncated; same identity as desktop). Meta = client · date. The end slot is a short amount. The expense phone rows also use short amounts for consistency.
  - Round 2: the phone filter button for the lone company view is labelled 'Perusahaan' (filterLabel).
  - Round 2: the header def uses MCActions quiet: ownerRole() (D-36) instead of a hand-set variant.
  - visible actions desktop 2 → 1, phone 2 → 3
  - remaining: The 'Perlu tindakan' head still shows the count badge next to 'Lihat semua (n)' (Layer A shared request).
  - remaining: At 1024 the ageing sub wraps to two lines (tablet; acceptable).
- **Kept on purpose**: The five finance concepts kept visibly separate, each tile drilling into its list · Owner 'Gabungan' totals vs Admin per-company figures with no total (canonical) · Derived signals with tone dot and the right destination (one item opens the record, several open the filtered list) · Ageing bar + bucket rows linking to Piutang ?umur= · Latest cash in / cash out tables with 'Semua ...' links

## `61-invoice.html` — Invoice
- **Purpose**: Invoice list with exact-number lookup and a marker for issued-but-unbilled invoices.
- **Role / job**: both — Admin: 'Find invoice X / which issued invoices still need billing.' Owner: 'Look up an invoice and its state.'
- **Primary action (before)**: Buat Invoice (head primary). It opens a sheet of active projects that routes to the project's Penagihan tab.
- **Secondary actions (before)**: Piutang (outline in the head); Filters (search, Tampilkan, Status, Klien); Row opens 62; Project sub-link
- **Visible actions (before, desktop / phone)**: 2 / 3
- **Problems found**:
  - *role, polish* — Page head: The Owner sees green 'Buat Invoice' as the page primary, although it is an execution task and the sheet only routes to a project's Penagihan tab.
  - *status, minor* — Status column, BELUM_DITAGIHKAN rows (ARJ/INV/2026/10/0032, BTN/INV/2026/10/0066): These rows show a grey neutral pill 'Belum Ditagihkan' plus brown text 'Perlu ditagihkan' on a second line. The attention signal lands on line two, the rows grow taller than their neighbours, and the neutral pill undersells the state the marker shouts.…
  - *filters, minor* — Toolbar: The 'Klien' select wraps alone onto a second toolbar row (search, Tampilkan and Status fill row 1).
  - *typography, minor* — 'Klien · proyek' column: The client name is bold (same weight as the invoice number) and every row carries an underlined project link. Two strong titles plus 19 underlines compete with the invoice number, which should be the strongest text in the row.
  - *mobile, minor* — Head on phone: Two full-width head buttons (Piutang outline + Buat Invoice) take a whole row, and Piutang is only sibling navigation.
  - *copy, polish* — Page subtitle vs section sub: 'terbaru lebih dulu' appears in both. On phone the 3-line subtitle plus 2-line sub push the first row to y about 400.
- **Proposed simplification**:
  - (P2, module) Status cell = one pill. For BELUM_DITAGIHKAN use the attention/warning tone with label 'Belum Ditagihkan'. Move 'perlu ditagihkan' into the pill's accessible text or the Terbit cell sub, so rows stay single-line.
  - (P2, system) System rule for secondary in-row links: client in regular weight; the project sub-link muted with no underline until hover/focus. One strong title per row.
  - (P2, system) Apply the MCFilter single-row fit rule (same as 50) so Klien goes into Filter when it does not fit.
  - (P3, module) Head through MCActions. Admin: Buat Invoice primary + Piutang secondary. Owner: Buat Invoice as secondary (no green). Phone: primary + menu (Piutang inside). Trim the section sub to 'Cari dengan nomor invoice lengkap untuk langsung menemukannya'.
- **After R11**: fixed
  - Round 1: 'Buat Invoice' head through MCActions (Admin green / Owner quiet). The 'Piutang' button became a subtitle link. The list card head became a result line. One pill per row. The client is regular weight and the project a muted link. The Perusahaan…
  - Round 2: listPill() is removed. Belum Ditagihkan now uses the registry tone (warning since the 03:34 fixture change), so 61, 62 and 63 match. The header def uses quiet: ownerRole().
  - visible actions desktop 2 → 2, phone 2 → 2
  - remaining: Layer A: filters stop about 260 px short of the card edge at 1366 (shared request).
- **Kept on purpose**: Exact-number lookup sorted first · Company code inline beside the number at narrow widths · 'Buat Invoice' sheet explaining that an invoice always starts from a project (canonical; no free-form invoice) · Phone rows: number, company tag + client, short value + status · Filtered-empty state with reset

## `62-invoice-detail.html` — Detail Invoice
- **Purpose**: Show the invoice's position (value, paid, remaining, due date) and its parts, and carry the billing act, payment, dispute hold and Owner write-off.
- **Role / job**: both — Admin: 'Bill this invoice / record its payment / mark a dispute.' Owner: 'Where does this receivable stand, and does it need a decision (dispute, write-off)?'
- **Primary action (before)**: Depends on state: Catat Pembayaran (active receivable), Tagihkan (Belum Ditagihkan), Pratinjau & Terbitkan (draft).
- **Secondary actions (before)**: Lihat Dokumen (outline in the head); Tabs: Rincian / Pembayaran / Dokumen / Riwayat; Tandai Sengketa (card button); Hapuskan Piutang (Owner-only card); Project link in the meta
- **Visible actions (before, desktop / phone)**: 4 / 5
- **Problems found**:
  - *hierarchy, major* — Rincian tab, right column: Penagihan + Sengketa + Hapuskan Piutang cards: For a healthy, not-yet-due invoice the right column permanently stacks a 'Sengketa' card (with 'Tandai Sengketa') and a 'Hapuskan Piutang' card ('Khusus Owner', red-outline button, CRITICAL). Rare and destructive decisions are presented as page furniture, a…
  - *redundancy, minor* — Position tiles vs Penagihan card: Due date and ageing are told three times: the 'Jatuh tempo' tile ('12 Nov 2026 · 29 hari lagi · ditagihkan 13 Okt'); the 'Sisa tagihan' tile note ('Piutang aktif · Belum jatuh tempo'); and the Penagihan rows Ditagihkan / Jatuh tempo ('12 November 2026 · 29…
  - *redundancy, minor* — inv-arj-0032 (Belum Ditagihkan): head + Penagihan form + notice: Two green 'Tagihkan' buttons are on the page: the head one (it only scrolls to and focuses the form) and the inline form submit at the bottom of Penagihan. The PDF-failed warning notice adds a third button, 'Coba buat ulang PDF'.
  - *routing, minor* — PDF-failed notice: On 62, 'Coba buat ulang PDF' is a data-demo stub. The real retry (dok-rerender, no renumber) lives on 51 for the same document, so one intent has two behaviours.
  - *table, polish* — Line sub-text: The sub 'LPT-14-15 · 6 × Rp13.000.000' duplicates the Jumlah and Harga columns right beside it.
  - *mobile, major* — 'Baris invoice' table: The table keeps 3 columns with a name column of about 110 px. 'Laptop 14 inci / LPT-14-15 · 6 × Rp13.000.000' wraps into 4-5 lines per row, and the qty × price sub repeats the Jumlah column.
  - *mobile, minor* — Head on phone: Two full-width buttons stack, with the outline 'Lihat Dokumen' ABOVE the primary 'Catat Pembayaran'. 'Lihat Dokumen' duplicates the 'Dokumen 3' drill row just below, and the head block is about 330 px.
  - *tablet, major* — Page head: The title 'ARJ/INV/2026/10/0031' breaks inside the number ('ARJ/INV/2026/10/' / '0031') because the two head buttons keep their row beside it. The meta wraps to 3 lines (label · ARJ / client / project + pill). At 1024 the pill already drops to a second line.
- **Proposed simplification**:
  - (P1, module) Head through MCActions. Primary by state (Tagihkan / Catat Pembayaran / Pratinjau & Terbitkan); 'Lihat Dokumen' as secondary on desktop; overflow 'Lainnya' with 'Tandai Sengketa' (billing.record), a separator, then 'Hapuskan Piutang' (danger, roles: owner). Each item opens the…
  - (P2, module) One trigger for billing: the head 'Tagihkan' opens the bill form in a sheet; alternatively keep the inline form and drop the head button. Penagihan shows only facts not already in the tiles (Diterbitkan, Ditagihkan datetime) and drops Jatuh tempo / Umur piutang. The PDF-failed…
  - (P1, system) Detail head row: below about 900 px of content width, wrap the actions under the title block (right-aligned row). Titles that are record numbers must not break mid-token (break only at '/' boundaries, or nowrap + long-text reveal).
  - (P2, module) Phone: render lines as stacked rows (name, then SKU · qty × price in the sub, value on the right) and hide the Jumlah column. Desktop: drop qty × price from the sub because the columns show it.
- **After R11**: fixed
  - Round 1: one state-driven head command (Pratinjau & Terbitkan, then Tagihkan, then Catat Pembayaran). 'Tindakan Lain' holds Tandai Sengketa (receivables.dispute), then a separator and Hapuskan Piutang (danger, Owner, receivables.write_off). Dispute,…
  - Round 2, D-26 item 2: 'Lihat Dokumen' is never a header secondary any more. It rides in 'Tindakan Lain' only when that menu exists anyway (Owner on active invoices) and the PDF has not failed. Otherwise the Dokumen tab (phone: drill row) and the PDF-failed…
  - Round 2, Penagihan no longer repeats the tiles: no sub for active invoices. 'Umur piutang' only when the invoice is overdue (daysOverdue > 0).
  - Round 2: the phone line sub drops the dangling '· 1' for unit-less single service lines (e.g. BTN/INV/2026/07/0041).
  - Round 2, no empty parts: the Riwayat tab/drill row is omitted when activityOf() is empty. The Pembayaran tab is omitted for an unbilled invoice without payments (the tile already says Rp0).
  - Round 2: form sheets put the form directly on the sheet surface (no .mc-card inside the sheet). Head defs use quiet: ownerRole().
  - visible actions desktop 3 → 2, phone 5 → 5
  - remaining: The Admin cannot mark or clear a dispute until roleFixtures.admin / usr-sari receive receivables.dispute (shared request). The fixture notice on BTN/INV/2026/07/0041 says Sari recorded it.
  - remaining: Admin counts after: desktop 1, phone 4.
- **Kept on purpose**: Position tiles first (value, paid with progress, remaining as the key tile, due date) · Tabs with counts and attention on a failed PDF; phone 'Bagian invoice' drill rows · Inline bill form with a manually entered due date and validation (canonical: due date is not computed) · Owner-only write-off with typed HAPUSKAN, the 'credit first' warning, and no Cash-In · Dispute consequence copy: the…

## `63-piutang.html` — Piutang
- **Purpose**: Receivables workspace: billed invoices with remaining balance and due state in three tabs (Aktif / Belum Ditagihkan / Sengketa), per-company subtotals (Gabungan only for the Owner), and the selected invoice beside the list (sheet on phone/tablet). The Belum Ditagihkan detail also holds the billing…
- **Role / job**: both — Owner: see in seconds which receivables are late or disputed and how much is outstanding per company, then drill into one invoice. Admin: bill the issued invoices (set billing and due dates) and record incoming payments against the right invoice.
- **Primary action (before)**: Header 'Catat Pembayaran' (green, to 65). But the same green 'Catat Pembayaran' appears again in the detail panel (to 65?invoice=), and on the Belum Ditagihkan tab the panel adds a green 'Tagihkan'. That makes two…
- **Secondary actions (before)**: Header 'Invoice' outline (to 61 invoice list); Detail panel 'Buka Invoice' outline (to 62, same destination as the detail title link); Detail panel 'Tagihkan' form (Belum Ditagihkan tab, billing.record, COMMIT); Tabs Aktif / Belum Ditagihkan / Sengketa; Search plus 4 selects: Tampilkan, Klien,…
- **Visible actions (before, desktop / phone)**: 8 / 2
- **Problems found**:
  - *hierarchy, minor* — Toolbar placed above the tab row: The toolbar filters what the tab selects, yet it sits above the tabs. Laporan (80) uses the opposite order (tabs, then toolbar), so the module order is inconsistent and the filters read as page-level here.
  - *hierarchy, polish* — Header 'Invoice' outline button: This is a sibling-route button to the invoice list placed next to the primary. On phone it takes a third of the action row. The route is already reachable from Keuangan and from every invoice link.
  - *density, minor* — First viewport: Only 2 invoices are visible. Header with 2 buttons, search, the sideways filter row, tabs, card title and 2-line subtitle, plus a 4-row subtotal block (about 250px) all come before the list.
  - *redundancy, major* — Header actions (x1171,y132) and detail panel actions (x938,y742): Two green 'Catat Pembayaran' buttons are visible at the same time and both lead to 65. On the Belum Ditagihkan tab the header green button competes with the panel's green 'Tagihkan', which is the real next step for that tab. Either way there are two strong…
  - *routing, minor* — Detail panel: title link 'CKP/INV/2026/05/0005' and the 'Buka Invoice' button: The same destination (62 invoice detail) is offered twice in one card: as the underlined h2 link and as a full-width outline button. A third route to it is the number link in the selected row.
  - *role, minor* — Tab row (Aktif / Belum Ditagihkan / Sengketa) for Sari: The Admin's tabs show no counts and no attention marker (updateCounts returns early for a multi-company Admin). The 'Belum Ditagihkan' attention badge, which the Owner sees as an amber '2', disappears for the role that holds billing.record and does the…
  - *alignment, polish* — Toolbar right edge (x1705) against the header actions right edge (x1904): Fixed-width filters stop about 200px short of the content edge, so the right edge of the content area is ragged. The detail panel's 'Catat Pembayaran' stretches to 330px.
  - *alignment, polish* — Detail panel bill form: small right-aligned 'Tagihkan' (x1238-1328) above a full-width…: The button geometry does not match. The commit is a small right-aligned button and the less important link is full width. On phone both are full width and read correctly. The kv row 'Nilai invoice Rp22.248.000' repeats the big 'Nilai, belum piutang' figure.
  - *card, minor* — List card head: 'Piutang aktif' title + subtitle + 'Sisa tagihan per perusahaan' + 4…: Cards are nested inside a card: the bordered ARJ/BTN/CKP tiles and the grey Gabungan tile sit inside the list card. The card title repeats the selected tab label ('Aktif' becomes 'Piutang aktif', 'Belum Ditagihkan' is repeated as is). The list header block…
  - *status, minor* — Aktif table: Jatuh tempo column plus Status column; detail panel: The state is said three times per row. Under the date there is a red 'Lewat 106 hari', the Status column has a red 'Lewat jatuh tempo' pill, and the detail repeats the pill, 'Lewat 106 hari' and 'Umur piutang > 90 hari'. The pill adds nothing that the red…
  - *filters, major* — Toolbar under the header: On phone the filter selects sit in a sideways-scrolling row: 'Tampilkan: Semua perusah...' fits, but 'Klien: Semua' is cut off at the right edge. At 768 the toolbar takes 3 rows (search + Tampilkan / Klien + Jatuh tempo / Umur piutang), so roughly 130px of…
  - *filters, minor* — Toolbar, second row: 'Umur piutang: Semua' alone at x236,y214: Four selects plus search wrap into an orphan second row. 'Jatuh tempo' and 'Umur piutang' cover the same question (due/ageing). Both stay visible on the Belum Ditagihkan tab even though the code ignores them there (rowsFor: dueOn = key !== 'belum'). A user…
  - *mobile, major* — Phone rows: 'BTN/INV/2026/08/00...', 'BTN/INV/2026/09/00...': The invoice number, which is the identifier, is truncated with an ellipsis. The space goes to the full amount, the company chip (which repeats the number's own prefix) and a truncated client name. Two rows in a list cannot be told apart reliably.
- **Proposed simplification**:
  - (P1, module) One green per screen. Keep header 'Catat Pembayaran' as the page primary. In the detail panel, render the invoice-scoped action as an outline button 'Catat pembayaran invoice ini' (still prefilled ?invoice=). Remove the 'Buka Invoice' button because the h2 title already links…
  - (P1, module) Adopt MCFilter `visible` (r11 Layer A). Keep search, Tampilkan and Klien inline, and move 'Jatuh tempo' and 'Umur piutang' behind the 'Filter' button (popover on desktop, sheet on phone, so no sideways row). While the Belum Ditagihkan tab is active, disable both due filters in…
  - (P1, module) Phone rows: never ellipsize the invoice number (identifier contract). Title = full number. Meta = client (ellipsis allowed). End = short money ('Rp210,3 jt') plus due phrase. Either drop the company chip from the phone meta or place it so it never squeezes the number.
  - (P2, module) Put the tabs first and the toolbar after them. Insert the toolbar after the tablist, as laporan.js already does with tablist.insertAdjacentElement('afterend', bar). Drop the h2 card title that repeats the tab label and keep only its sort caption as a quiet line.
  - (P2, module) Replace the 4 bordered subtotal tiles with a single hairline strip in the D-28 metric-strip style: one surface with dividers, per-company cells, and the Gabungan cell last for the Owner. On phone, collapse it to one summary line ('11 invoice · Gabungan Rp1,21 M') with the…
  - (P2, module) One status carrier per row in the Aktif and Sengketa tables. Merge 'Jatuh tempo' and 'Status' into one column: the date plus a coloured phrase ('Lewat 106 hari', 'Jatuh tempo besok'), with a pill only for Sengketa, the state the date cannot express. In the detail panel drop the…
  - (P2, module) Admin: show an attention dot (no number, no cross-company figure) on the 'Belum Ditagihkan' tab when the Admin's view contains unbilled invoices, so the billing task stays discoverable for the role that executes it.
  - (P3, module) Belum Ditagihkan panel: render the bill form's action row like the phone layout, with 'Tagihkan' full width or left-aligned in the same column grid as the date fields, and drop the duplicate 'Nilai invoice' kv. Move the header 'Invoice' button into the MCActions overflow…
- **After R11**: fixed
  - Round 1: one strong action per view. The header is 'Catat Pembayaran', green for the Admin on Aktif/Sengketa, quiet on Belum and for the Owner. The 'Invoice' button is removed. 'Buka Invoice' is removed (the h2 links). The tabs come before the toolbar. Jatuh…
  - Round 2, role emphasis: on the Belum Ditagihkan tab the Owner gets an outline 'Tagihkan' (data-action=keu-bill-sheet) that opens the same bill form in a sheet, the one-trigger model of 62. After billing, the detail (panel, or sheet on phones) shows the…
  - Round 2, Layer A adoption: dueFilters uses MCFilter.disable(['due','umur'], note) / enable(). The local .keu-flt-note and .pt-filter.is-off CSS is deleted. The header def uses quiet: ownerRole() // curTab === 'belum'.
  - Round 2: the Belum result line no longer repeats the subtitle ('2 invoice · terbit terbaru lebih dulu').
  - visible actions desktop 4 → 3, phone 2 → 2
  - remaining: Phone 390: the tab row clips 'Sengketa' slightly (MCTabs scrolls). A canonical shortLabel for 'Belum Ditagihkan' would fix it (product decision, not invented here).
  - remaining: MCFilter.disable note: on phones it sits above the selects after arrange() re-runs (Layer A).
- **Kept on purpose**: List-detail split with the selected invoice beside the list (sheet below 1101px) and the selected-row green rail · Due phrase colouring: red overdue, amber within 7 days, muted otherwise · Per-company subtotals with Gabungan only for the Owner (canonical); the Admin sees ARJ/BTN only · Deep links from Beranda/Keuangan signals (?tab=, ?filter=7hari, ?umur=, ?sel=) · Phone sheet for Belum…

## `64-pembayaran.html` — Pembayaran
- **Purpose**: Payments received (immutable Cash-In), newest first, with their applications to invoices and the unapplied remainder (Kredit Pelanggan). The selected payment shows beside the list with proof, kuitansi, history and correction (contra).
- **Role / job**: both — Admin: find a payment, check where it was applied, apply leftover credit, attach missing proof, start a kuitansi. Owner: see this month's cash-in and whether anything is unapplied or without proof.
- **Primary action (before)**: Header 'Catat Pembayaran' (to 65). In the detail panel, 'Terapkan ke Invoice' becomes a second green button when the payment has credit.
- **Secondary actions (before)**: Header 'Piutang' outline (to 63); Kredit Pelanggan figure card that toggles the 'Ada Kredit Pelanggan' filter; Search plus 3 selects (Klien, Penerapan, Metode) and Tampilkan; Detail: 'Lampirkan bukti', 'Buat Kuitansi' (inline link), 'Pindahkan penerapan', 'Batalkan catatan (kontra)', invoice and…
- **Visible actions (before, desktop / phone)**: 5 / 3
- **Problems found**:
  - *hierarchy, polish* — Header 'Piutang' outline: A sibling-route button next to the primary. On phone it takes 35% of the action row.
  - *density, minor* — Figure row + toolbar: Two 550px cards use only the left 60% for content, and the toolbar wraps ('Metode' orphaned on row 2). The list starts at y≈395, so only 5 payments are in the first viewport. For the Admin the Kredit card is a full-size card showing 'ARJ Rp0 / BTN Rp0',…
  - *redundancy, minor* — 'Kredit Pelanggan' figure card (x799-1349, y162-304): The whole stat card is a toggle button (aria-pressed) and its note is underlined like a link ('Lihat 1 pembayaran yang belum diterapkan penuh'). It duplicates the 'Penerapan: Ada Kredit Pelanggan' filter 30px below. It reads as a statistic but behaves as a…
  - *role, minor* — Koreksi card: Rare, special-authority actions are always visible as two outline buttons ('Pindahkan penerapan', 'Batalkan catatan (kontra)'). The Admin (no finance.contra) gets a disabled button plus a help paragraph, which is a whole card for something they cannot do.
  - *card, minor* — Detail panel stack: payment card, Penerapan ke invoice, Riwayat, Koreksi: Four stacked cards make a 1590px panel next to a 1020px list. Riwayat comes before Koreksi here, while the 66 record sheet uses the opposite order. The header pill 'Diterapkan penuh', the full green bar and 'Kredit Pelanggan —' state the same fact three times.
  - *filters, major* — Toolbar: The Tampilkan / Klien selects scroll sideways ('Klien: Semua' cut off). The first viewport shows only 2 payments under the header, 2 figure cards, search and filters.
  - *table, minor* — List columns 'Perusahaan' + 'Jumlah': A separate Perusahaan chip column repeats the number prefix (ARJ/BYR/...) and spends about 90px in the narrow split column, while 63 puts the chip inline beside the number. 'Diterapkan penuh' is printed under every amount, so the normal state is noise and…
- **Proposed simplification**:
  - (P1, module) Adopt MCFilter `visible`: Tampilkan, Klien and Penerapan inline, Metode in the 'Filter' panel. On phone show search plus Filter only.
  - (P2, module) Turn kb-figs into one D-28 metric strip with two cells, Kas masuk and Kredit Pelanggan, and make the figures passive (no button, no underline). Expose the credit drill-down only when credit > 0, as one quiet text link 'Tampilkan 1 pembayaran' inside the cell. When credit is…
  - (P2, module) List row: put the company chip inline beside the number, as in 63's numCell, and drop the 'Perusahaan' column in the split. Under the amount show only exceptions ('Kredit Rp…', 'Tanpa bukti'), never 'Diterapkan penuh'.
  - (P2, module) Detail panel order and actions: payment summary, then Penerapan ke invoice (with 'Terapkan ke Invoice' as the panel's single primary when credit > 0), then Riwayat. 'Lampirkan bukti' stays a visible secondary only when proof is missing. 'Pindahkan penerapan' and 'Batalkan…
  - (P3, module) Move header 'Piutang' into the overflow (or drop it).
- **After R11**: fixed
  - r11 (earlier pass): header renders through MCActions. 'Catat Pembayaran' is primary for the Admin and an outline secondary for the Owner. The sibling 'Piutang' button is removed. The two figure cards became one passive D-28 strip, and the Kredit Pelanggan…
  - This pass: the credit block title is now 'Sisa belum diterapkan'. It no longer repeats the amount, which is already in the split and the header pill. In the narrow detail column (container query ≤460 px) the block stacks: the note sits on top and the…
  - This pass: zero figures use the Layer A quiet-zero cell class (pt-metric--zero). The module-only .kb-metric__zero is removed.
  - This pass, phone strip: the credit link has min-height 0 and a 16 px line, so 'Tampilkan 1 pembayaran' shares a baseline with '7 pembayaran'. The 44 px hit area is still provided by the ::before rule.
  - This pass: the Owner's Gabungan parts line stays one line at ≤1100 px (ellipsis, full text in title). Cell heights are even at 1024 and 768.
  - The 1024 px result-note wrap is now handled by Layer A (is-wrapped). Verified at 1024: one toolbar row and no stray note row.
  - visible actions desktop 3 → 4, phone 3 → 3
  - remaining: The desktop above-the-fold button count rose by 1 because the credit drill link and the Filter button are counted. Header controls went 2→1, and the Owner has no primary (Admin after: 3 desktop / 2 phone).
- **Kept on purpose**: Immutable-payment framing (contra only) and the apply form with per-invoice max, 'Isi' fill and a live total · Detail amount block with the applied/credit split bar · 'Buat Kuitansi' as an inline contextual link in the Kuitansi row · ?sel= deep link that opens the payment (sheet on phone) · Owner Gabungan figure with per-company parts; the Admin sees per-company only

## `65-catat-pembayaran.html` — Catat Pembayaran
- **Purpose**: Form to record a client payment (Cash-In) and apply it to that client's open invoices in the chosen company. A live Ringkasan shows the consequences; the save is a COMMIT confirm and the result appears in place (done card plus 'Lihat pembayaran').
- **Role / job**: both — Admin (mostly): copy the bank/VA/cash proof into the form, split the amount over the right invoices (or let the remainder become Kredit Pelanggan), save once and correctly. Owner: same form, rarely.
- **Primary action (before)**: Sticky action bar 'Catat Pembayaran' (green), next to 'Batal'.
- **Secondary actions (before)**: 'Batal' (discard confirm when touched); 'Bagi otomatis' in the Penerapan section head; Proof upload zone; Duplicate-warning acknowledgement and reason (warnings.override); Kuitansi link checkbox; Done state: 'Catat pembayaran lain' / 'Lihat pembayaran'
- **Visible actions (before, desktop / phone)**: 7 / 2
- **Problems found**:
  - *density, major* — Whole form (work/keu-lap/65-…-admin-1920x1080.png): The form stretches to the content width: the form card is about 1275px, inputs about 600px each, and the Penerapan table leaves an empty gap of about 700px between 'Invoice' and 'Status'. The prefilled context card spans 1650px with Sisa tagihan / Jatuh…
  - *redundancy, minor* — Action bar info (left) and Ringkasan aside: 'Jumlah diterima Rp30.850.000' is shown in the bar and in Ringkasan at the same time, and the value is also in the field. At idle, the 'Tanpa bukti' consequence appears twice: in the long upload label and as a Ringkasan bullet.
  - *redundancy, minor* — Context card 'Pembayaran untuk invoice' and Penerapan row: Sisa tagihan, due date and the 'Ditagihkan' pill appear in the context card and again in the single allocation row about 600px lower.
  - *mobile, polish* — Bottom of the viewport: The sticky action bar sits on top of the bottom tab bar: two stacked bars of about 140px during data entry, and the tab bar invites leaving a half-filled form.
  - *copy, polish* — Ringkasan rows: Empty values are inconsistent: 'Jumlah diterima —' but 'Rp0' for the two rows below.
  - *other, minor* — Invoice / project number links in the context card and the allocation rows: Plain anchors leave the form, and everything typed is lost without the discard confirmation that 'Batal' has (kb-pay-cancel checks `touched` only for Batal; there is no general dirty guard as on the purchase form).
- **Proposed simplification**:
  - (P1, system) Introduce a FORM page mode in Layer A, e.g. `.pt-page--form` with a max inline size of about 1180px (form column about 760px plus aside about 360px), applied to the context strip as well. Use it on 65 (and the other create forms). Data pages keep WIDE-DATA.
  - (P2, module) When prefilled, slim the context card to the identity only (invoice link, company chip, client · project). Drop the facts and status pill that the allocation row repeats, or fold the context into the Penerapan section head.
  - (P2, module) Show the action-bar amount only below 1101px, where the Ringkasan aside is not beside the form. On desktop use that slot for the validation status. Shorten the upload label to 'Bukti pembayaran (opsional)' and keep the 'Tanpa bukti' consequence only in Ringkasan. Use '—' for…
  - (P2, module) Inside the form, render invoice and project numbers as plain text (keep the links in the done state), or route them through the same discard confirmation as 'Batal'.
- **After R11**: fixed
  - r11 (earlier pass): FORM container (1120 px). The context card is slimmed to identity only. Allocation columns are rebalanced. The action-bar amount is hidden at ≥1101 px (Ringkasan is beside the form). Ringkasan empty values are '—'. The module Batal dialog…
  - This pass (D-32 status once): an allocation row shows the due-date sub only when the invoice has a dueDate. An unbilled invoice now shows only its 'Belum Ditagihkan' pill. invDue() itself is unchanged for its other callers. Verified on ?invoice=inv-arj-0031…
  - visible actions desktop 2 → 2, phone 2 → 2
- **Kept on purpose**: Two-section form (Data pembayaran / Penerapan ke invoice) with a live Ringkasan of consequences (Kas masuk, remaining per invoice, Kredit Pelanggan, not revenue) · Sticky action bar with a single green commit and an outline 'Batal' that confirms the discard only when touched · Method-aware fields (Tunai hides the bank account, reference becomes optional) · Duplicate-payment warning with an…

## `66-pengeluaran.html` — Pengeluaran & Kas Lain
- **Purpose**: Cash-out, cost (Beban) and other cash-in outside client payments, by transaction date, in three tabs. Each record opens in a sheet; new records are captured in a sheet form (COMMIT).
- **Role / job**: both — Admin: record a supplier payment, an expense (paid or unpaid) or another cash-in with the right type, so cost and cash stay separate. Owner: see what went out this month and how cost differs from cash-out.
- **Primary action (before)**: Tab-aware header primary: 'Catat Pengeluaran Kas' / 'Catat Beban' / 'Catat Kas Masuk Lain', which opens the sheet form.
- **Secondary actions (before)**: Three figure cards that switch the tab (kb-tab buttons); Tabs Pengeluaran Kas / Beban / Kas Masuk Lain; Search + Tampilkan + Proyek; Row click opens the record sheet ('Batalkan catatan (kontra)' inside); Project links in rows; 'Pembayaran klien' link on the Kas Masuk Lain tab; Empty-state 'Catat…
- **Visible actions (before, desktop / phone)**: 6 / 2
- **Problems found**:
  - *hierarchy, minor* — Section head inside each tab panel: The h2 'Pengeluaran Kas' repeats the selected tab label. The toolbar sits between the figures and the tabs, the opposite of 80's order.
  - *density, minor* — 'Kas masuk lain · Okt 2026 Rp0' card: A zero figure gets a full card (for the Admin, stacked 'ARJ Rp0 / BTN Rp0'), the same weight as the real cash-out.
  - *redundancy, major* — Three figure cards (y162-304) and the tab row (y377): The cards are buttons (aria-pressed, green border on the current one) that do exactly what the tab row 70px below does, so there are two switches for one state. Their notes are underlined like links ('Masuk ke Biaya; terpisah dari kas keluar', 'Belum ada;…
  - *redundancy, minor* — Create sheet: header '← Batal' and footer 'Batal': The same dismiss appears twice in one sheet. The half-width 'Untuk' select truncates 'Pembayaran ke pemasok (pemb…'.
  - *redundancy, polish* — Empty-state outline 'Catat Kas Masuk Lain' and header primary 'Catat Kas Masuk Lain': The same action appears twice in one view when the tab is empty.
  - *card, minor* — Record sheet: info notice 'Lima konsep keuangan dijaga terpisah', then the Koreksi card,…: An internal-concept heading is shown as an info alert on every record. Koreksi (one always-visible 'Batalkan catatan (kontra)', disabled plus a paragraph for the Admin) comes before Riwayat, while 64 uses the opposite order.
  - *mobile, minor* — Tabs and toolbar: The tab row is clipped ('Kas Masuk…') and the filter row scrolls sideways ('Proyek: Sem…' cut off). Showing only the current figure on phone is good.
- **Proposed simplification**:
  - (P1, module) Keep the tabs (URL ?tab=, counts, MCTabs) as the only switch. Render the three figures as one passive D-28 metric strip: no button, no aria-pressed, no underline, with the current tab's cell subtly marked. A Rp0 cell shows a muted 'Belum ada' instead of per-company zero rows.…
  - (P2, module) Tabs first, then the toolbar (as in 80). Drop the h2 that repeats the tab label and keep the caption.
  - (P2, module) Create sheet: the header back control becomes 'Tutup' (or the close icon), with 'Batal' only in the footer next to the commit. Make 'Untuk' full width, or shorten its option labels ('Bayar pemasok (pembelian)').
  - (P2, module) Record sheet: replace the notice with a one-line explanatory caption under the amount. Order the sheet as details, then Riwayat. Move 'Batalkan catatan (kontra)' into an overflow menu in the sheet head (danger, last); for the Admin show it disabled with its reason in that menu…
  - (P3, module) In an empty tab, show the empty-state text without the duplicate CTA, since the header primary is already tab-aware.
- **After R11**: fixed
  - r11 (earlier pass): each kind is gated by its canonical capability (disbursement.record / expense.record + cost.view / cashin.record). The header is tab-aware via MCActions (Admin with the capability: primary; Owner: outline secondary). The figure buttons…
  - This pass (double 'selected' indicator): the current tab's strip cell uses the module-only class .kb-metric--current (one quiet 2 px top rule, no fill). It no longer uses Layer A's is-current, which had the pressed-tile tint plus a bottom rule. aria-current…
  - This pass: zero figures use Layer A pt-metric--zero, and the parts line ellipsizes at ≤1100 px (title holds the full text). Verified at 1366, 1024 and 768.
  - This pass: the create sheet uses the Layer A close variant (MCSheet close:'x'): '× Tutup' at the right. The form footer keeps its own Batal + commit.
  - visible actions desktop 4 → 1, phone 2 → 2
  - remaining: Admin after: 0 desktop / 1 phone (Filter only), correct by canonical capability.
- **Kept on purpose**: Tab-aware single header primary (label follows the selected tab); a good model for 63's Belum Ditagihkan tab · Beban vs Pengeluaran Kas kept as separate facts, with the 'Sudah dibayar: catat juga sebagai Pengeluaran Kas' checkbox and a live consequence note · Phone shows only the current tab's figure · Record detail in a sheet, plus ?sel= deep link · 'Pembayaran klien' quiet link on the Kas…

## `70-kasus-koreksi.html` — Kasus Koreksi
- **Purpose**: List-detail of correction cases opened by corrections (delivery shortage, returns, cancellation): residual obligation, next step from the source record, linked records, correction timeline, and 'Tutup Kasus' only at zero residual (Kewenangan khusus, reason).
- **Role / job**: both — Owner: lihat kasus yang masih punya sisa kewajiban dan putuskan penutupan. Admin: tindak lanjuti sisa dari catatan asalnya sampai nol.
- **Primary action (before)**: Detail: the next-step button from the source record (Buka Pengiriman / Buka Pembelian) while residual > 0; Tutup Kasus when residual = 0
- **Secondary actions (before)**: Kirim Pengganti / Lihat stok; Linked record links; Search + company + Status + Jenis filters; Row select
- **Visible actions (before, desktop / phone)**: 9 / 4
- **Problems found**:
  - *hierarchy, minor* — Detail panel: next step vs Tutup Kasus: Two green primary buttons in one panel: 'Buka Pembelian' (primary) near the top and a disabled green 'Tutup Kasus' at the bottom, with a full 'Tutup Kasus' block and explanation shown while the residual is still open.
  - *redundancy, minor* — Detail 'Catatan terkait' + next-step buttons: For ARJ/KK/2026/10/0003 'Catatan terkait' lists 'Pengiriman ARJ/BK/2026/10/0011' and 'Barang Keluar ARJ/BK/2026/10/0011'. Both route to 41-catat-pengiriman (LINKED.dispatches -> pengiriman.catat), and so does the primary 'Buka Pengiriman': three links, one…
  - *redundancy, polish* — Detail 'Alasan' + 'Koreksi tertaut': 'Dibuka 9 Oktober 2026 oleh Sari Wulandari' under Alasan is repeated as the only timeline item 'Kasus dibuka · Sari Wulandari · 9 Okt', followed by an empty-state sentence.
  - *role, major* — 'Kirim Pengganti' for Admin: The SELISIH_PENGIRIMAN next step shows 'Kirim Pengganti' whenever R.allowed('gudang.keluar') is true. The route has no capability, so the Admin (no stock.dispatch) gets a button that lands on 33's permission wall.
  - *card, minor* — Split at 1366: The detail panel (~820 px) is twice the height of the 4-row list (~305 px), leaving a large empty left column. The Proyek and Dibuka columns are hidden in split mode, so the list loses the project context that the 1024 layout shows.
  - *status, minor* — List 'Sisa' + 'Status' columns: Closed cases show '• Tidak ada' with a grey dot (looks like a status pill) beside a 'Ditutup' pill, and open ones show '• 1 Laptop 14 inci' beside 'Terbuka'. On phones 'Terbuka' + 'Ada sisa' repeat it again. Status is encoded twice per row.
  - *filters, major* — Toolbar: Four controls (search, Tampilkan, Status, Jenis) for a 4-case list. At 1024 'Jenis' wraps alone onto a second toolbar row. On phones the row scrolls sideways ('Status: Semu' clipped at the edge).
- **Proposed simplification**:
  - (P1, module) Filters: replace the Status select with a 2-segment toggle 'Terbuka (n) / Semua' in the list section head, and move Jenis into a Filter panel/sheet. The toolbar becomes search + company; nothing scrolls sideways on phones or wraps at 1024.
  - (P2, module) List: show the 'Sisa' value only for open cases (muted '—' for closed, no dot), keep the Status pill once, and drop the phone 'Ada sisa' sub-line when the pill already says Terbuka (or replace the pill with the residual for open cases).
  - (P1, module) Detail: while residual > 0, hide the 'Tutup Kasus' block and add one line in the residual box ('Bisa ditutup setelah sisa nol'). When residual = 0, the next-step buttons disappear and 'Tutup Kasus' becomes the panel's single primary. One green button per state.
  - (P1, module) Gate 'Kirim Pengganti' (here and in 41 record view) by hasCap('stock.dispatch'). In 'Catatan terkait', merge delivery + dispatch rows that open the same 41 view into one row ('Pengiriman · Barang Keluar ARJ/BK/2026/10/0011').
  - (P3, module) Remove the 'Dibuka … oleh …' line under Alasan (the timeline carries it), and show the timeline empty-state sentence only when there is no item besides 'Kasus dibuka'.
- **After R11**: fixed
  - Status is a segmented switch with live counts (Terbuka / Ditutup / Semua). It now uses the Layer A MCSeg.set/counts API instead of patching the DOM by hand. 'Jenis' is behind Filter. The toolbar is search + company + Filter (phones: search + Filter).
  - Round 2 fix (review minor #5): in the Ditutup segment the 'Sisa kewajiban' cell reads quiet 'Ditutup 30 Sep' (span.pt-muted.ksk-closed, carries the closing date, no status dot). Open residuals keep the warning flag; zero shows 'Sisa nol'.
  - Round 2 fix (review minor #4): each destination appears once in the case panel. nextPrimary(c) returns the next step's {route, params}, and linkedRows(c, skip) leaves out that destination and the project already linked in the meta. KK/0004 shows only 'Barang…
  - Round 2 fix (review polish): 'Tutup Kasus' follows the same close pattern as 41. The block is one sentence + one primary, and the closure decision is typed in the MCRisk COMMIT dialog (reason: true, reasonLabel 'Keputusan penutupan…', placeholder, min. 10…
  - Round 2 fix (review polish): the case panel meta no longer shows the company tag (the KK number carries the code).
  - Kept from round 1: one green button per state; 'Kirim Pengganti' gated by canGo('gudang.keluar'); visually hidden list title; status once per row; Proyek column visible beside the detail.
  - visible actions desktop 8 → 6, phone 3 → 2
  - remaining: No zero-residual open case exists in the fixture, so 'Tutup Kasus' is only reachable after a session patch (verified that way).
- **Kept on purpose**: Residual box ('Sisa kewajiban') as the visual anchor of the detail, with value only for finance.view · Next-step guidance that routes to the source record (no correction from the case itself) · No header CTA: cases are opened from source records · Closed-case 'Penutupan' block with reason · Phone: list then sheet with 'Kembali ke daftar'

## `80-laporan.html` — Laporan
- **Purpose**: Report workspace: 7 report types as tabs (?jenis=). A toolbar holds the company view and the shared period, plus Cetak and Ekspor (Excel/PDF, async, delivered via Ekspor Saya). Below is one section per company with summary figures above its table.
- **Role / job**: both — Owner: read a period's numbers per company and export or print them for the accountant. Admin: pull an operational report (stock, payments) and export it.
- **Primary action (before)**: Toolbar 'Ekspor ▾' (green, menu Excel/PDF).
- **Secondary actions (before)**: Header 'Ekspor Saya' (outline, download icon, goes to 82); Header 'Laporan Gabungan' (outline, Owner only, goes to 81); Toolbar 'Cetak' (window.print, hidden on phone); 7 report-type tabs; Tampilkan + Periode; In-place export result 'Buka Ekspor Saya'; Row links to the source records; Kasus links
- **Visible actions (before, desktop / phone)**: 5 / 3
- **Problems found**:
  - *hierarchy, major* — Header 'Ekspor Saya' (x1049,y132) above toolbar 'Ekspor ▾' (x1224,y232): Two buttons with the same download icon and almost the same word are stacked 100px apart. 'Ekspor Saya' navigates to a list but reads and looks like the export action; 'Ekspor' actually requests a file. A first-time user hesitates over which one exports. On…
  - *density, minor* — Header cluster (Ekspor Saya, Laporan Gabungan) + toolbar cluster (Cetak, Ekspor): Two right-aligned button clusters are stacked over the tab row: 4 buttons plus 7 tabs and 2 filters before any number. The header actions are both navigation, the toolbar actions are both output.
  - *role, minor* — Page subtitle: The Admin reads 'Angka Gabungan seluruh perusahaan ada di Laporan Gabungan.' Laporan Gabungan is Owner-only (81 returns 404 for the Admin) and its header button is already removed for her, so the copy points to a page she cannot open.
  - *alignment, polish* — Intro row under the toolbar: The description (left, wraps to 2 lines at about 770px) and the snapshot meta (right, 1 line) are unequal text blocks with misaligned baselines, sitting between the toolbar and the first card.
  - *status, minor* — Columns 'Umur piutang' + 'Status' + the due sub-line: Two adjacent tinted pill columns ('61–90 hari' plus 'Sengketa' / 'Lewat jatuh tempo') next to a red 'Lewat 70 hari' make three status carriers per row.
  - *filters, minor* — Toolbar filter order: Opened with ?jenis=piutang, the toolbar shows 'Periode' before 'Tampilkan'; on the default tab the order is Tampilkan then Periode. The order is inconsistent between entry points.
  - *filters, minor* — Periode chip on the Piutang (and Stok) tabs: Position reports ignore the period entirely (Piutang) or use it only for one figure (Stok 'Pergerakan stok'). The chip stays as prominent as on period reports while the meta line says 'posisi, bukan jumlah periode'.
  - *mobile, minor* — First viewport: Report data starts at y≈620. Before it come the title, a 3-line subtitle, 2 full-width header buttons, a clipped tab row, 2 full-width filter rows, a full-width green 'Ekspor' (the loudest element on a reading screen) and a 4-line intro.
  - *tablet, minor* — Tabs and toolbar: Tabs are clipped ('Arus kas manaj…'; D-29 'Lainnya' now addresses this), and 'Cetak' + 'Ekspor' wrap onto their own right-aligned row under the filters.
- **Proposed simplification**:
  - (P1, module) Remove the header 'Ekspor Saya' button. Make it the last item of the Ekspor menu (separator, 'Lihat Ekspor Saya', no download icon) and keep the in-place result link 'Buka Ekspor Saya'. Owner keeps 'Laporan Gabungan' as the single quiet header secondary (MCActions, roles:…
  - (P1, module) Make the subtitle role-aware: for roles without laporan.gabungan, drop the second sentence ('Laporan per perusahaan untuk periode terpilih.').
  - (P2, module) Phone: show the Ekspor as outline (or inside an overflow with Cetak), not as a full-width green bar. Clamp the intro to the 1-line meta so the first company figures enter the first viewport.
  - (P2, module) Keep a stable toolbar order (Tampilkan, then Periode) regardless of ?jenis=. On position reports (Piutang) show the period chip as a static 'Posisi per 14 Okt 2026' (or disabled with that reason) instead of an active control.
  - (P3, module) Piutang report: render 'Umur piutang' as plain text and keep a single Status pill.
- **After R11**: fixed
  - r11 (earlier pass): the bar uses the MCTabs toolbar slot. Both header buttons are removed: 'Lihat Ekspor Saya' is the last item of the Ekspor MCMenu, and 'Laporan Gabungan' is a quiet meta link only for accounts that can open 81. Ekspor is a Layer A MCMenu…
  - This pass (major, phone toolbar regression): the phone bar is always 2 rows. Row 1 is Periode or 'Posisi per …'. Row 2 is [Filter / Ekspor], or [company select / Ekspor] if Layer A keeps the lone company select inline. Layer A switched between those two…
  - This pass (polish): the Piutang Status column shows a pill only for Lewat jatuh tempo / Sengketa. 'Ditagihkan' is quiet text (the export keeps the label). Summary figures equal to Rp0 / 0 get .lap-fig--zero (muted value, D-28 quiet zero) on every report.
  - visible actions desktop 5 → 3, phone 4 → 3
- **Kept on purpose**: Order: report-type tabs, then toolbar, then report (the right order; other modules should copy it) · One section per company with a 4-figure row divided by hairlines (no nested cards) above its table; fixed table layout so the same column sits at the same x across companies · Export menu (Excel / PDF with one-line notes), LOW risk with an in-place result notice and live state · Laba proyek 'per…

## `81-laporan-gabungan.html` — Laporan Gabungan
- **Purpose**: Owner-only consolidated report: four Gabungan figures (Nilai penjualan, Kas masuk, Piutang aktif, Laba manajerial), a per-company table with the Gabungan row last, and inter-company stock allocations for the period.
- **Role / job**: owner — See group-level performance at a glance, how it splits per company, and which inter-company lot allocations moved cost between companies; export or print for the accountant.
- **Primary action (before)**: Toolbar 'Ekspor ▾' (green).
- **Secondary actions (before)**: Header 'Ekspor Saya' (outline, download icon); 'Cetak'; Periode chip; Static 'Semua perusahaan (3)' label; Product / project / Barang Keluar links in allocations
- **Visible actions (before, desktop / phone)**: 5 / 2
- **Problems found**:
  - *hierarchy, minor* — Header 'Ekspor Saya' (x1209,y132) stacked above 'Ekspor ▾' (x1224,y175): The same two-download-icons ambiguity as on 80: navigation and file action are stacked at the right edge with the same icon.
  - *redundancy, minor* — Metric cards + 'Per perusahaan' table Gabungan row: The four headline figures (838.850.000 / 701.300.000 / 1.214.400.000 / 139.480.000) appear twice on one screen: as cards and as the bold Gabungan row 300px lower. Each card also carries a 'Gabungan' badge, a fourth repetition after the page title, the table…
  - *redundancy, polish* — Meta line 'Angka per 14 Okt 2026, 09.00 WIB · 3 perusahaan · periode 1–31 Okt 2026': It repeats the period chip and the 'Semua perusahaan (3)' label directly above it. 'Semua perusahaan (3)' with a building icon looks like a disabled filter but is static text.
  - *mobile, minor* — First viewport and scroll: 4 rows of controls (Ekspor Saya, Periode, Semua perusahaan, green Ekspor, about 240px) are followed by four full-width stacked metric cards (about 400px). The per-company cards then repeat the Gabungan figures again at the end.
  - *copy, polish* — Subtitle 'Khusus Owner.'; Laba note 'Oktober 2026' vs '1–31 Okt 2026': 'Khusus Owner' is only ever read by the Owner. The period labels are inconsistent between metric notes.
- **Proposed simplification**:
  - (P1, module) Same as 80: move 'Ekspor Saya' into the Ekspor menu (last item) and keep the result-notice link; no header button.
  - (P2, module) Let the summary use the D-28 metric strip (already .pt-metrics; phone becomes 2x2). Drop the per-card 'Gabungan' badge and state 'Gabungan · 3 perusahaan' once as the strip caption. Merge the meta line into it ('per 14 Okt 2026, 09.00 WIB') and remove the separate meta…
  - (P3, module) Copy: drop 'Khusus Owner.' from the subtitle and use one period label format in all metric notes. Render 'Semua perusahaan (3)' as plain caption text, not a chip-like control.
- **After R11**: fixed
  - r11 (earlier pass): the header 'Ekspor Saya' is now the last item of the Ekspor menu. The static company chip is removed. The meta became one strip caption, with one period format in the metric notes. Phone: 2x2 strip, and the period and Ekspor share one…
  - This pass: the 'Per perusahaan' sub wraps 'Baris Gabungan di bagian akhir; ' in .lap-desk-only, hidden ≤767 px. On phones it reads only 'Piutang aktif adalah posisi, bukan jumlah periode.'
  - visible actions desktop 4 → 3, phone 3 → 2
- **Kept on purpose**: Owner-only route guarded with the canonical 404 for the Admin · Per-company table with the Gabungan row last and right-aligned tabular numbers · Phone per-company cards with a 2x2 figure grid (no truncated row list) · Inter-company allocation table linking lot source to the consuming project and Barang Keluar · Shared period and the same Export/Cetak pattern as 80

## `82-ekspor-saya.html` — Ekspor Saya
- **Purpose**: The requester's own export requests, newest first, with a simulated background state (Diminta, Diproses, Siap diunduh / Gagal / Tidak tersedia). 'Unduh' appears when ready and 'Minta Lagi' when failed or expired.
- **Role / job**: both — Check whether my export is ready, download it, or re-request it if it failed or expired.
- **Primary action (before)**: Row-level 'Unduh' when ready (no page primary, which is correct for this archetype).
- **Secondary actions (before)**: Header 'Buka Laporan' (outline, to 80); Section 'Perbarui' (manual refresh); Row 'Minta Lagi'
- **Visible actions (before, desktop / phone)**: 6 / 4
- **Problems found**:
  - *redundancy, minor* — Section head 'Perbarui' (x1216,y191) and footer 'status diperbarui otomatis': A manual refresh button contradicts the footer copy and the 1-second auto tick. On phone it is a 44px button that pushes the section subtitle onto 2 lines.
  - *routing, minor* — Header 'Buka Laporan' + breadcrumb 'Laporan' (+ 'Kembali' in BEFORE): Up to three controls lead to 80 in one header block. D-27 removes 'Kembali', but the crumb and the button still duplicate on desktop.
  - *alignment, polish* — Tindakan column: Right-aligned buttons of different widths ('Unduh' 103px, 'Minta Lagi' 124px) and the muted text 'Sedang disiapkan' have no shared left edge.
  - *status, minor* — 'Laporan Gabungan' row: Status pill 'Diminta' + note 'Menunggu giliran dibuat' +…: Three phrases describe one state. In the Gagal row the note 'Belum diproses; Minta Lagi.' repeats the button label next to it.
  - *mobile, minor* — Rows: The report name is truncated ('Laporan Piutang (dengan …') because the pill plus the 44px action stack on the right. Row heights are uneven: the Diminta row has 2 lines, Unduh/Minta Lagi rows have 3, with the pill floating above the button.
  - *copy, polish* — Subtitle, section sub and footer: 'terbaru lebih dulu' appears in the subtitle and the section sub; 'File dibuat di latar belakang' appears in the subtitle and the footer.
- **Proposed simplification**:
  - (P2, module) Remove 'Perbarui' (the list auto-updates) and keep the quiet 'Diperbarui 09.00 WIB' meta. Drop the duplicated copy (subtitle keeps 'File dibuat di latar belakang', section sub keeps the count and update time, footer keeps 'Hanya Anda yang melihat permintaan ini').
  - (P2, module) Status carries the state once: pill plus an optional reason only for Gagal/Tidak tersedia. The Tindakan cell is empty when there is no action (no 'Sedang disiapkan'). Give the action column a fixed width with left-aligned buttons.
  - (P3, module) Demote header 'Buka Laporan' to a quiet text link, shown on phone, where there is no breadcrumb and Laporan is not in the bottom bar. On desktop the breadcrumb 'Laporan' suffices.
  - (P3, module) Phone row layout: report name on a full-width first line (wrap, no ellipsis), meta on the second line, then pill and action on one bottom row with a consistent height.
- **After R11**: fixed
  - r11 (earlier pass): the header 'Buka Laporan' and the manual 'Perbarui' are removed (the list re-checks every second). The card head is removed and replaced by a slim result line. Status once (pill + reason only for Gagal / Tidak tersedia). Fixed 148 px…
  - This pass: the footer uses the Layer A .pt-section__foot--text. The inner span wrapper is dropped, and the inline 'Laporan' link flows inside the sentence.
  - visible actions desktop 4 → 2, phone 4 → 2
  - remaining: Fixture exp-req-01 requestedAt (11.02) is later than the fixture clock 09.00 ('Hari ini, 11.02'). This is not a unit file; see sharedRequests.
- **Kept on purpose**: Only the requester's own exports (privacy) with 'Baru' marking session requests · Contextual row actions: Unduh only when ready, Minta Lagi only when failed or expired; no page-level primary · ?sel= from the export result scrolls to and highlights the new request; live region announces 'siap diunduh' · Empty state with 'Buka Laporan'

## `85-data-master.html` — Data Master
- **Purpose**: Search-first lists of the shared masters (Klien, Pemasok, Produk & Jasa, Lokasi Rak), with the option to add a record after checking it does not already exist.
- **Role / job**: both — Find an existing client, supplier, product or rack quickly and open it; add one only after confirming it does not already exist (Owner, or anyone holding parties.manage, products.edit or warehouse.manage).
- **Primary action (before)**: Tambah <jenis> (green, at the end of the toolbar; full-width on phone) opens the 'Pastikan belum ada' sheet, then a COMMIT confirmation
- **Secondary actions (before)**: Search; Jenis/Kategori/Zona select; Status select (default Aktif); Row click opens 86; Hapus filter (empty state)
- **Visible actions (before, desktop / phone)**: 1 / 1
- **Problems found**:
  - *hierarchy, polish* — Breadcrumb: A single crumb 'Data Master' sits directly above the H1 'Data Master' on a top-level page (a Layer A D-27 change removing this was already landing during the audit).
  - *density, polish* — Klien table: A 4-column table stretches to about 1650 px. 'Unit & PIC' starts at x=786 and 'Status' sits at x=1850, so the eye travels a long way for very little data.
  - *redundancy, minor* — Section card head inside each tab panel: 'Klien' plus '6 data · dipakai bersama semua perusahaan' repeats the active tab label, the tab count badge '6' and the page subtitle, all within the 120 px above it.
  - *role, minor* — Toolbar end / phone CTA: Admin (no parties.manage, products.edit or warehouse.manage) sees a faded filled-green 'Tambah Klien' on every tab plus a lock sentence. On phone the dead CTA and its 2-line note take about 95 px above the list and read as a broken primary.
  - *table, minor* — Status column (Klien, Pemasok, Produk): With the default filter 'Status: Aktif', every row reads a grey 'Aktif'. The column only carries information when archived rows are included.
  - *mobile, major* — Toolbar and the area above the list: The list does not start until y≈485, so about 58% of the first viewport is chrome: a 3-line subtitle, the tab row, search, a filter row that scrolls sideways ('Status: Aktif' is cut off at the right edge), a full-width green 'Tambah Klien' and a card head…
  - *tablet, minor* — Toolbar: The toolbar wraps: search and Jenis on row 1, then 'Status: Aktif' alone on row 2 next to the primary 'Tambah Klien'. The orphaned select and the CTA share an awkward second line.
- **Proposed simplification**:
  - (P2, module) Drop the titled section head in renderKind: render the MCList card without a heading, and move the count ('6 data' / '3 dari 6 data') into the toolbar as a quiet result note. Remove the repeated 'dipakai bersama semua perusahaan' because the page subtitle already says it.
  - (P2, module) statusPill: render nothing for active records and show only the 'Diarsipkan' pill. Hide the Status column while the filter is 'aktif' and show it only for 'arsip' (or an 'all' option).
  - (P1, module) Admin without the manage capability: do not render the disabled filled CTA. Show one quiet inline line under the tabs ('Penambahan klien diatur Owner'), and on phone hide the CTA entirely. Keep the note so they know whom to ask.
  - (P1, module) Phone: shorten the subtitle to one line ('Dipakai bersama semua perusahaan. Cari dulu sebelum menambah.'), put Jenis and Status behind the shared Filter sheet, and make 'Tambah' a compact button at the toolbar end beside search instead of a full-width bar, so the list starts in…
  - (P3, system) Use the STANDARD container (not WIDE-DATA) for master lists: cap the panel at about 1280–1360 px on 1920 so 4–6 column tables keep their columns close.
- **After R11**: fixed
  - r11 (earlier pass): one tab-aware MCActions header primary 'Tambah <jenis>', gated by the kind's capability (absent for the Admin; no lock sentence). The card head is removed and the result note sits at the toolbar end. Status columns are removed (an…
  - This pass: the subtitle is role-aware. An account that can add on no visible tab (no parties.manage / products.edit / warehouse.manage) reads only 'Dipakai bersama semua perusahaan.' The static HTML keeps the Owner/manager copy ('… Cari dulu sebelum…
  - visible actions desktop 1 → 1, phone 1 → 2
  - remaining: The phone count includes the Filter button (Jenis + Status moved into the sheet). Admin after: 0 desktop / 1 phone.
- **Kept on purpose**: 'Pastikan belum ada' two-step add sheet (search first, exact match blocks duplicates, 'Buka' links to the existing record) · Tabs with counts and ?jenis= deep link · Clean row hierarchy: name strong, kind and SKU quiet, numbers right-aligned · Permission-filtered columns (Unit & PIC, Harga jual, Tersedia) and the 'Lokasi rak butuh akses stok' state · Phone rows with a single end value + chevron

## `86-data-master-detail.html` — Detail Data Master
- **Purpose**: Hub for one master record (client, supplier, product/service, rack): identity, scope-filtered relations (units/PICs, projects, price history, purchases, stock, movements, usage), edit, and archive/reactivate.
- **Role / job**: both — Check the facts and relations of one client, supplier, product or rack, start the natural next transaction from it (Buat Proyek / Buat Pembelian), and occasionally correct or archive the master.
- **Primary action (before)**: Kind-dependent filled CTA in the header: 'Buat Proyek' (klien), 'Buat Pembelian' (pemasok), 'Lihat Stok' (produk/rak)
- **Secondary actions (before)**: Ubah (outline, header); Cetak Label (produk, outline header); Tambah Unit (in the Unit & PIC panel); Buat Barcode Internal (inline); Arsipkan <jenis> (full card at the bottom); Aktifkan Lagi (archived notice); Kembali + parent crumb
- **Visible actions (before, desktop / phone)**: 6 / 4
- **Problems found**:
  - *hierarchy, major* — Product header (jenis=produk): Three header buttons: 'Cetak Label' (a floor/printer task shown to the Owner), 'Ubah', and a green 'Lihat Stok'. The primary is plain navigation that duplicates the 'Stok' tab on the same page and that tab's 'Buka Detail Stok' link. The user cannot tell what…
  - *hierarchy, minor* — Bottom 'Arsipkan klien' card: On short records the destructive archive is a full-width card with a red-outlined button inside the first viewport (y≈600–710). That makes it the third most visible action, a peer of 'Buat Proyek', for a rare DESTRUCTIVE task.
  - *redundancy, minor* — Ringkasan card (klien, pemasok): Every klien fact is already on screen: Jenis is in the header meta 'Klien · Perguruan tinggi', Unit 2 and PIC 2 are in the tab count and section sub, and 'Proyek berjalan 2' matches the 'Proyek 2' tab. The card also opens with a permission-policy sentence…
  - *redundancy, minor* — Tab panel content: The active tab 'Unit & PIC 2' is followed immediately by a card titled 'Unit & PIC / 2 unit · 2 PIC …'. Likewise 'Proyek' leads to 'Proyek' and 'Riwayat harga' leads to per-company cards whose sub repeats 'Riwayat harga ARJ' plus a company tag (the company…
  - *routing, minor* — Breadcrumb + supplier price rows: '← Kembali' and the 'Data Master' crumb both go to 85?jenis=klien. Each supplier price-history row opens the purchase, and its 'Pembelian' column link goes to the same purchase.
  - *role, minor* — Header actions: Admin (no parties.manage) gets a disabled 'Ubah' beside 'Buat Proyek' plus a full-width lock sentence. On phone the dead 'Ubah' takes 50% of the action row.
  - *spacing, polish* — Product 'Harga default' kv: pt-kv puts the label column at 38%, so 'Harga beli' sits at x=257 and 'Rp9.850.000' at x=665: a 400 px gap that is hard to scan.
  - *alignment, minor* — Ringkasan facts grid: dm-facts uses auto-fill minmax(150px,1fr), so 4 facts occupy the left 60% and the right 40% of the card is empty. The hint '2 proyek di perusahaan Anda' wraps to two ragged lines inside a 150 px track.
  - *mobile, minor* — Drill block and Unit & PIC head: The 'Bagian klien' card (only 'Proyek / 2 proyek' with a '2' badge, so the count appears twice) sits between Ringkasan and the inline first part. The 'Unit & PIC' head squeezes a 3-line sub beside 'Tambah Unit', and the masked phone '08••-••••-2101' breaks…
- **Proposed simplification**:
  - (P1, module) Header contract per kind: one PRIMARY that is a real next transaction ('Buat Proyek' klien, 'Buat Pembelian' pemasok; none for produk; 'Lihat Stok' kept only for rak, which has no Stok tab), 'Ubah' as SECONDARY, and a 'Lainnya' overflow holding 'Arsipkan <jenis>' (same…
  - (P1, module) Drop the Ringkasan card for klien and pemasok. Fold the only non-duplicated fact into the header meta ('… · 2 proyek berjalan', 'Pembelian terakhir 5 Okt 2026') and move the policy sentence to a single pt-help line under the tabs. Keep Ringkasan for produk and rak (SKU,…
  - (P2, module) Inside single-section tab panels render the list or units without a repeated title: keep the sub info ('alamat unit dipakai di dokumen saat terbit') and the contextual action ('Tambah Unit') in a slim panel toolbar. Supplier price cards: name + company tag only, and drop the…
  - (P2, module) Admin without the manage capability: hide the disabled 'Ubah' (on desktop it may appear as a disabled item with its reason inside 'Lainnya'), and show the lock reason once as a quiet line. Phone: 'Buat Proyek' becomes the only full-width button.
  - (P2, system) Phone drill: render the first part first, then a 'Bagian lain' row list after it, show the count once (badge or fact, not both), and apply white-space:nowrap to dm-pic__pos phone numbers.
- **After R11**: fixed
  - r11 (earlier pass): header contract through MCActions. Admin: single primary 'Buat Proyek' (canGo('proyek.form')) / 'Buat Pembelian'. Owner: 'Ubah' visible plus 'Tindakan Lain' (Buat Proyek, Cetak Label for a product with barcode, Arsipkan <jenis> danger…
  - This pass (D-12): plain count badges are removed from the Unit & PIC, Proyek (klien) and Pembelian (pemasok) tabs (count: null). The phone drill keeps the fact ('2 berjalan'), and the Stok attention badge appears only below minimum.
  - This pass (D-32): the client Proyek tab shows a Status column only when the states differ. The phone row end shows a pill only for non-ACTIVE projects. cl-ucn (both Aktif) now shows Proyek / Unit / Tenggat.
  - This pass: the inline-first check uses the Layer A flag panel.dataset.drill === 'first' instead of sniffing .pt-drill__first.
  - visible actions desktop 4 → 3, phone 4 → 4
  - remaining: Phone owner 4 = Ubah, ⋯, the Proyek drill row and Tambah Unit. That is the canonical drill pattern; the header is just Ubah + ⋯. Admin after: 1 desktop / 2 phone.
- **Kept on purpose**: Scope-filtered relations with no out-of-scope counts · Per-company price history, never pooled · Archive as DESTRUCTIVE with plain consequence copy; archived notice with 'Aktifkan Lagi' · Edit sheet with a change summary (before → after) in the COMMIT confirm · Stock quantity tiles with Tersedia formula and the low-stock tint · Contextual 'Tambah Unit' inside Unit & PIC

## `90-tinjauan-owner.html` — Tinjauan Owner
- **Purpose**: Owner oversight: a derived list of open conditions plus ADM+/Owner activities to review (special authority, security, shared-warehouse evidence, import collisions). Each row opens its record, and there is no approval.
- **Role / job**: owner — See in seconds what is still open and which exceptional actions happened since the last sign-in, then jump to the record that needs a decision.
- **Primary action (before)**: None by design (no approve/reject). The implicit primary is opening a row ('Buka Catatan')
- **Secondary actions (before)**: Cetak (outline header); Riwayat Aktivitas (outline header); Tampilkan company filter; Window Hari ini/7/30/Rentang; Pelaku select; Tabs Aktivitas/Keamanan/Bukti/Impor; Footer 'Log Keamanan' link
- **Visible actions (before, desktop / phone)**: 7 / 1
- **Problems found**:
  - *hierarchy, major* — 'Kondisi yang Masih Terbuka' table: The strongest text in every row is the same 'Invoice bersisa setelah pembayaran' ×5. The identifying record (ARJ/INV/2026/10/0031 + project) sits in column 3, and the decision figure 'Sisa Rp55.926.000' is buried in grey sub text instead of a right-aligned…
  - *density, polish* — Both cards: The Kondisi columns spread over 1650 px. Feed time stamps and 'Buka Catatan' sit about 650 px right of the sentence they belong to.
  - *redundancy, minor* — Review feed items: Each item says the actor and class in the sentence ('… oleh Bagas Pratama (Kewenangan khusus) …'), again in the meta (name + orange 'Kewenangan khusus' pill) and again with an orange dot. A fourth line repeats the record ref, and each item carries its own…
  - *routing, minor* — Header 'Riwayat Aktivitas' + footer 'Log Keamanan': Two links to the same page 91 (different tabs) bracket the card, and the card already has a local 'Keamanan' tab.
  - *filters, minor* — 'Aktivitas untuk Ditinjau' tools: The window segmented control and 'Pelaku' sit above the tabs and are pushed to opposite card edges (seg at x=257, Pelaku at x=1150), so filters precede the category choice they filter.
  - *mobile, minor* — Above 'Kondisi': The first content element is a full-width outline 'Riwayat Aktivitas' button (navigation), followed by a 260 px select truncated to 'Semua perusah…' and a 'Masuk sebelumnya' line. That is three rows of chrome before the first condition. In the in-progress…
  - *copy, minor* — Subtitle, both section subs, footer: There are four explanatory sentences about how the page works ('bukan antrean persetujuan', 'Hilang sendiri setelah…', the list of review kinds, 'Tidak ada tombol setujui atau tolak…'). Policy copy outweighs the data at the top of each block.
- **Proposed simplification**:
  - (P1, module) Rebuild the Kondisi columns: 'Catatan' as the title column (record number strong, project quiet), condition type as a quiet sub (or a group header when all rows share it), a right-aligned tabular 'Sisa' column, then 'Sejak'. Remove the 'Buka Catatan' button column and rely on…
  - (P1, module) Feed item: drop the per-item 'Buka Catatan' button on desktop and show the chevron as the phone does. Meta shows company tag + record ref on one line and leaves out the actor name and class pill that the sentence already states (the coloured mark stays, with its visually-hidden…
  - (P2, module) Order inside 'Aktivitas untuk Ditinjau': tabs first, then one compact tool row (window seg left, Pelaku next to it, not pushed to the far edge). Cut the copy to one sentence in the page subtitle, remove the footer sentence and the footer 'Log Keamanan' link, and keep the header…
  - (P2, module) Header: 'Cetak' moves to a 'Lainnya' overflow (or an icon-only tertiary). Phone: 'Riwayat Aktivitas' becomes an overflow item or a text link at the bottom instead of a full-width button. Give the two phone filter triggers distinct labels/scopes or merge Pelaku and window into…
- **After R11**: fixed (P1, P2 and the review's Pelaku scope + overdue tone)
  - r11 (earlier): MCActions header with one quiet 'Cetak'. Riwayat Aktivitas is a section link. Kondisi leads with the record number, has a red 'Lewat n hari', a right-aligned Sisa and chevron rows (no 'Buka Catatan' buttons). Feed rows have one meta line. Tabs…
  - This round: Pelaku now sits where its scope is. On tablet and desktop it is a select at the right end of the feed's tool row (next to the time window), and the page toolbar holds only the company view (which applies to both parts). On phones it stays in the…
  - Kondisi phone and tablet-portrait rows keep the overdue tone: 'Lewat n hari' is pt-danger-text when the derived state is LEWAT_JATUH_TEMPO.
  - Kondisi chevron column uses Layer A MCList chevron:true (pt-col-chev). The local .tnj-col-chev column and CSS are removed.
  - Cetak is declared desk:true in MCActions (desktop-only task).
  - Verified 1366x768, 1920x1080 (standard container now from the Layer A route override), 1024x768, 768x1024, 390x844 + the phone Filter sheet.
  - visible actions desktop 7 → 1, phone 1 → 1
  - remaining: Pelaku is rendered twice (one per breakpoint, CSS-swapped and synced). This is a module-local composition until Layer A supports split filter placement (see sharedRequests).
- **Kept on purpose**: No approve/reject/mark-read controls (derived view) · 'Tercatat setelah Anda masuk sebelumnya' divider with time · Keamanan tab attention count · Company view applies to both parts; 'Gudang bersama' / 'Tanpa perusahaan' always visible · Phone Kondisi rows (record + amount + 'sejak') and chevron feed rows · Empty state offering 'Lihat 30 hari'

## `91-riwayat-aktivitas.html` — Riwayat Aktivitas
- **Purpose**: Owner workspace audit search (who did what, when recorded; class, backdating, project filter) plus the Log Keamanan tab.
- **Role / job**: owner — Answer 'who did this and when, and was it a special-authority action?' by searching and narrowing the audit trail, then open the record.
- **Primary action (before)**: Search and filter the audit list (no write action); open a row
- **Secondary actions (before)**: Cetak; Tabs Aktivitas / Log Keamanan; Periode; Tampilkan; Pelaku; Kelas tindakan; Tanggal mundur; Muat Lagi; Project chip with 'Buka proyek'
- **Visible actions (before, desktop / phone)**: 3 / 0
- **Problems found**:
  - *redundancy, polish* — Pelaku column, section sub, subtitle: 'Admin Operasional' is repeated under every actor. The section sub repeats the period already on the trigger ('Periode 1–31 Okt 2026'), and the subtitle points to Log Keamanan, which is the tab right below it.
  - *routing, minor* — Breadcrumb: '← Kembali' and 'Tinjauan Owner' both link to 90.
  - *filters, major* — Aktivitas toolbar: Six filters wrap to two rows on desktop, leaving 'Tanggal mundur' orphaned on row 2, and the search is squeezed to 250 px ('Cari aktivitas, nomor catata…'). On phone the row side-scrolls: only search, period and a truncated 'Tampilkan: Semua perusa' are…
  - *mobile, minor* — Phone rows with a non-Biasa class: The 'Kewenangan khusus' pill in the row end squeezes exactly the exception rows to 'Alokasi antar-perusahaan: 2…' / 'Peringatan kemungkinan…'. The rows the Owner cares about most are the least readable.
- **Proposed simplification**:
  - (P1, system) Toolbar: keep search (flex, wider), Periode and Tampilkan visible, and move Pelaku, Kelas tindakan and Tanggal mundur into the shared 'Filter' panel (desktop popover, phone sheet) with an active-count badge. One row on desktop, no side-scroll on phone.
  - (P2, module) Phone row: move the class into the meta line (short coloured text 'Khusus' after the actor) instead of the end slot, so the 2-line title clamp is kept for exception rows.
  - (P3, module) Trim: show the actor role sub only when it differs from 'Admin Operasional' (Owner or operator), drop the period from the section sub, and shorten the subtitle to its first clause.
- **After R11**: fixed (P1, P2, P3 and the review polish)
  - r11 (earlier): Cetak through MCActions. One toolbar row (search, Periode, Tampilkan; Pelaku / Kelas tindakan / Tanggal mundur behind ONE Filter). No tab-repeating card heads. Phone: search + Filter on one row, period below.
  - This round: phone row meta order is company tag, class word ('Khusus' / 'Owner', flex:none), actor name (the part that truncates), then time (.tnj-when, never truncates), separated by '·'. Exception rows now keep their timestamp ('ARJ Khusus · Bagas Pr… · 13…
  - Cetak is declared desk:true.
  - visible actions desktop 2 → 3, phone 1 → 2
  - remaining: The button count rose by one because three filters moved behind ONE 'Filter' button. Visible filter controls dropped from 5 to 3 (desktop) and from 5 to 2 (phone).
- **Kept on purpose**: 'Biasa' as quiet grey text and pills only for Kewenangan khusus / Owner · Reason line ('Alasan: …') under special actions · Date + time sub, tabular · Empty state offering the wider period instead of a dead end · ?proyek= chip with clear and 'Buka proyek' · Muat Lagi pagination

## `95-pengaturan.html` — Pengaturan
- **Purpose**: Owner settings hub: tiles to the four areas plus the Perusahaan list with derived readiness, identity assets and bank accounts (list → detail).
- **Role / job**: owner — See which company setup is incomplete (and what blocks document issuance), fix it, or go to users, numbering and tax settings.
- **Primary action (before)**: None in the header. The de-facto next action is 'Lengkapi' on the missing readiness item (→ 97)
- **Secondary actions (before)**: 4 area tiles; Company row select; Ubah Identitas (step-up demo); Tambah Rekening (step-up demo)
- **Visible actions (before, desktop / phone)**: 5 / 4
- **Problems found**:
  - *redundancy, minor* — 'Perusahaan' tile: The tile links to #perusahaan, the section directly below it, while the other three tiles open sub-pages, so the tiles mean different things. On phone the 'Perusahaan' tile and the 'Perusahaan' card are stacked one after the other.
  - *redundancy, minor* — Readiness checklist vs Identitas/Rekening cards: Five green-check rows each end with 'Lengkap' and repeat data shown again just below (NPWP, rekening + masked number, Direktur, 'berkas asli hanya untuk Owner'). The one actionable item (Penomoran) is visually diluted.
  - *alignment, major* — Perusahaan split: The left list (3 rows) ends at y≈580 while the right detail (readiness + Identitas + Rekening) runs to y≈1232. Scrolling to Identitas leaves a 650 px empty left column, which matches the owner's 'uneven section geometry' complaint. Only the detail is sticky;…
  - *table, polish* — Status column: All three companies show a green 'Aktif' pill; the readiness meter already carries the useful state.
  - *tablet, minor* — Company table and tiles: Below 1101 px a row click opens a sheet, but the table rows show no chevron or affordance and look static. Tile text is capped at 34ch, so descriptions wrap to 2 lines inside half-empty tiles.
- **Proposed simplification**:
  - (P1, module) Tiles: remove the 'Perusahaan' self-anchor tile and keep 3 equal tiles (Pengguna & Akses, Penomoran Dokumen, Pajak) in a 3-column row. Move the '2 belum lengkap' fact into the Perusahaan section sub, where it belongs.
  - (P1, module) Readiness: list missing items first as full rows with their action ('Lengkapi'), and collapse the completed items into one quiet disclosure row ('5 syarat lengkap') so the facts are not repeated above the Identitas and Rekening cards.
  - (P2, module) Split geometry: make the company list column sticky (as .set-dir__list already is on 96) instead of the taller detail, and narrow it (minmax(320px,0.8fr)). Drop the all-'Aktif' Status column and show 'Nonaktif' only when it occurs.
  - (P3, module) 768–1100 px: render the company list as rows with chevrons (the phone representation) because the detail opens in a sheet. Relax the .set-tile .pt-tile__text 34ch cap at 2-column widths.
- **After R11**: fixed (P1, P2, P3; split seam and sheet edge from the review)
  - r11 (earlier): three equal tiles. '2 belum lengkap' moved to the section data line. Readiness shows missing rows plus ONE '5 syarat lengkap' fold. No all-'Aktif' column. 768–1100 uses chevron rows + sheet.
  - This round: the split shares the tile grid. At ≥1101 px .set-split is repeat(3, minmax(0,1fr)) with the detail spanning 2 (same --pt-gap as .set-tiles), so the list ends exactly on the first tile seam. Verified at 1280 (list ends at 571, tile seam 571), 1366…
  - Phone company sheet: .set-detail__head padding is 16px var(--m-card-pad) 4px. Title, CKP tag, 'Kesiapan perusahaan' and the rows share one left edge inside the readiness card.
  - visible actions desktop 0 → 2, phone 0 → 0
  - remaining: The desktop count rose because the detail (Ubah Identitas, the '5 syarat lengkap' fold) now sits higher in the 1366 first viewport. No new controls.
- **Kept on purpose**: Derived readiness meter + 'n belum lengkap' with missing-first ordering · 'Perlu tindakan Owner' tag and the 'Lengkapi' deep link to 97?sel= · Tile facts with an attention dot (counts that matter) · Step-up (Konfirmasi Kata Sandi) explained as demo · ?sel= deep link opening the company on any width

## `96-pengguna-akses.html` — Pengguna & Akses
- **Purpose**: Owner account directory with a per-account detail: company access × capability matrix, the edit → Pratinjau Akses → Simpan Akses (CRITICAL) flow, sessions and credentials, and security events.
- **Role / job**: owner — Check what an account can do in which company, change grants safely with a preview and a reason, and end sessions or issue a set-password link when needed.
- **Primary action (before)**: Ubah Akses (green, in the matrix card head) → editor → Pratinjau Akses → Simpan Akses
- **Secondary actions (before)**: Buat Akun (outline header, demo); Account row select; Buat Tautan Atur Kata Sandi (demo); Akhiri Semua Sesi (DESTRUCTIVE); Log Keamanan link; Buka Akun Saya (own account)
- **Visible actions (before, desktop / phone)**: 4 / 1
- **Problems found**:
  - *density, minor* — Read-only matrix: Every granted cell prints '✓ Dapat' (about 50 times), and the not-granted CKP column is a full-height column of '—' over hatching. The column header already says 'Diberikan' / 'Tidak diberikan', so the repeated word adds noise without adding meaning.
  - *redundancy, minor* — Head facts vs 'Sesi dan kredensial': 'Verifikasi dua langkah: Aktif' and 'Masuk terakhir 14 Okt 07.35' appear in the head card and again in the Sesi card ('Aktif sejak masuk 14 Okt 2026, 07.35', 'Verifikasi dua langkah Aktif').
  - *routing, minor* — Breadcrumb: '← Kembali' and 'Pengaturan' both go to 95.
  - *alignment, polish* — Head facts grid + Sesi kv: The 3-column facts grid with 5 facts leaves the last slot empty. The Sesi kv puts values 285 px from their labels (pt-kv 38%).
  - *mobile, minor* — Account list: Sari's row shows the selected state (green bar) although no detail is visible on phone. The only and most prominent action is a full-width 'Buat Akun', a rare demo-only task.
- **Proposed simplification**:
  - (P2, module) Read mode matrix: render a check icon only (keep a visually-hidden 'Dapat') and keep the text chips for Baru / Dicabut / Nonaktif in the preview. For a not-granted company, show a slim column with a single centred 'Tidak diberikan' note instead of a dash in every row.
  - (P2, module) Remove 'Verifikasi dua langkah' and the sign-in time from the Sesi card (they stay in the head facts). The Sesi card then holds Sesi status + Tautan, with 'Akhiri Semua Sesi' right-aligned and spaced away from 'Buat Tautan Atur Kata Sandi'.
  - (P3, module) Phone: no selectedId in the list (no detail is visible), and 'Buat Akun' becomes a compact header button or overflow item rather than a full-width bar.
- **After R11**: fixed (P2, P3)
  - r11 (earlier): check-only read matrix with one hatched 'Tidak diberikan' column. Sesi card holds only what its commands act on, with 'Akhiri Semua Sesi' separated to the right. 4 head facts. 'Buat Akun' is a compact outline in the list head. No falsely…
  - This round: no change (no defects filed). Phone pt-kv label/value baseline in the Sesi sheet remains a Layer A request.
  - visible actions desktop 2 → 2, phone 1 → 1
  - remaining: Phone pt-kv label sits about 9 px below its value (Layer A).
- **Kept on purpose**: Edit → Pratinjau Akses → Simpan Akses with the stepper, sticky action bar, CRITICAL confirm and mandatory reason · Per-company sentences in the preview ('Akses Perusahaan baru: n kewenangan…') · Prerequisite logic (Nonaktif — prasyarat dicabut) and disabled options with 'Butuh …' · Discard confirm when switching account with unsaved changes · Phone: access change explicitly deferred to…

## `97-penomoran.html` — Penomoran Dokumen
- **Purpose**: Owner document-numbering control grouped by state: Perlu Tindakan Owner (start with a chosen first number), Tertahan (blocked by another condition), Sudah Dimulai (last/next number).
- **Role / job**: owner — Start the numbering that waits for me, understand why others are held, and verify the next number of the running ones.
- **Primary action (before)**: Mulai Penomoran (green, on the Perlu Tindakan row) → inline form with a first-number preview → COMMIT
- **Secondary actions (before)**: Rincian disclosure on every row (×18); Buka Barang Keluar; Buka Impor Data Awal (demo); Nomor terakhir links; Tampilkan + Jenis dokumen filters
- **Visible actions (before, desktop / phone)**: 14 / 4
- **Problems found**:
  - *density, minor* — 'Sudah Dimulai': 15 reference rows, each with an underlined last-number link and a 'Rincian ⌄' link, give 14 actions above the fold on desktop. The company tag repeats in every row, and on phone the non-actionable list is about 1150 px long.
  - *routing, minor* — Breadcrumb: '← Kembali' and 'Pengaturan' both go to 95.
  - *alignment, minor* — 'Rincian' disclosures: Because 'Rincian' sits before variable-width buttons, it lands at x=1119 (BAST), 1107 (Surat Jalan), 1094 (Nota Terima Barang) and 1275 (table rows). The same control appears at four ragged positions in one column of the page.
  - *mobile, minor* — Filter row: The row side-scrolls: 'Tampilkan: Semua perusah…' is truncated and 'Jenis dokumen' is cut off at the edge.
- **Proposed simplification**:
  - (P2, module) Row grammar: action button(s) first, then 'Rincian' as a fixed-width trailing control (same x in every group and in the table), or a trailing chevron-only disclosure button with an aria-label.
  - (P2, module) 'Sudah Dimulai': group rows under company sub-headers (ARJ / BTN / CKP) and drop the per-row company column. Render the last number as plain tabular text with the link on the number only on hover/focus. On phone the group starts collapsed (mobileDisclosure key) because nothing…
- **After R11**: fixed (P2 x2 + review polish)
  - r11 (earlier): row action first, then 'Rincian' on one right edge in every group and table. Held items route with quiet links. 'Sudah Dimulai' is grouped by company and folded on phones. The custom table follows the r10 fit.
  - This round: the start form's sequence input is bounded (.set-form[data-start-form] .mc-input max-width 180px), so the value '1' sits next to its label instead of 510 px away.
  - visible actions desktop 9 → 7, phone 6 → 6
- **Kept on purpose**: Grouping by state with Perlu Tindakan Owner first and a single green primary · Inline start form with a live 'Nomor pertama yang akan terbit' preview and COMMIT confirm · Held items with a reason sentence and a routed fix ('Buka Barang Keluar') · ?sel= deep link from the 95 readiness row with target highlight · 'Baru dimulai' tag after commit

## `98-pajak.html` — Pajak
- **Purpose**: Owner tax reference: tax types, how PPN is computed (worked example), PPN rate versions (add a version, never edit history), and per-company tax profiles.
- **Role / job**: owner — Confirm which tax rate applies, and on a legal rate change schedule a new PPN version that only affects transactions from its start date.
- **Primary action (before)**: Tambah Versi Tarif (green, in the Versi tarif PPN head) → inline form → COMMIT
- **Secondary actions (before)**: Buka invoice (example); Profil row → 95?sel=; Batal / Simpan Versi Tarif in the form
- **Visible actions (before, desktop / phone)**: 4 / 1
- **Problems found**:
  - *spacing, polish* — Top two cards: pt-grid-2--even stretches 'Jenis pajak' to match 'Cara pajak dihitung', leaving a blank band between its two rows and its foot note.
  - *table, minor* — Profil pajak perusahaan: 'Pajak penjualan: PPN 11%' and 'Harga jual: Termasuk PPN' are identical in all rows, and a separate 'Kode' column repeats the company. Rows link to 95?sel= but show no chevron or affordance on desktop.
  - *mobile, minor* — Versi tarif PPN: A full-width filled green 'Tambah Versi Tarif' is the dominant phone control for a rare, legally driven, high-consequence change.
  - *copy, minor* — Subtitle, Versi sub, three card feet: 'Tarif berubah lewat versi baru; riwayat tidak pernah diedit' appears in the subtitle and almost verbatim in the Versi tarif sub. Three more explanatory foot notes (sample data, the inclusive-PPN explanation, 'memakai versi yang berlaku…') make five policy…
- **Proposed simplification**:
  - (P2, module) Copy: keep the versioning rule once (Versi tarif sub) and shorten the subtitle to 'Jenis pajak, versi tarif, dan profil pajak perusahaan.'. Merge the sample-data note and the 'versi yang berlaku' note into one page-level foot.
  - (P2, module) Profil table: company name + inline code tag in one cell, NPWP, Pajak penjualan, and a chevron (rowHref already exists). Drop the constant 'Harga jual: Termasuk PPN' column because 'Cara pajak dihitung' states it.
  - (P3, module) Phone: 'Tambah Versi Tarif' as an outline/compact button in the section head instead of a full-width filled bar. Desktop: let the top cards keep their natural height (align-start) rather than forcing equal height.
- **After R11**: fixed (P2 x2, P3, review polish)
  - r11 (earlier): shorter subtitle. Profil table is name+tag / NPWP / Pajak penjualan / chevron. 'Tambah Versi Tarif' is a compact outline. Natural card heights.
  - This round: the 'Cara pajak dihitung' card has no foot. Its note (invoice price includes PPN; Beranda sales use DPP; purchases tax per line) is merged into the single page-level foot. The top pair now ends level: 1366 within 1 px, 1024 within 6 px, with no…
  - The Profil chevron column uses Layer A MCList chevron:true. The local .set-col-chev column and CSS are removed.
  - visible actions desktop 1 → 1, phone 0 → 1
  - remaining: The phone count is +1 because the compact 'Tambah Versi Tarif' now sits in the first viewport. It is the same single command.
- **Kept on purpose**: Worked example from a real invoice (value → DPP → PPN) with 'Buka invoice' · Rate versions never edited; the inline form previews which version ends and when; COMMIT confirm · Status pills Berlaku / Terjadwal / Riwayat · Single primary on the page

## `99-akun-saya.html` — Akun Saya
- **Purpose**: Own account for both roles: profile (read-only), company access and capabilities (read-only, set by the Owner), change password, sign-ins and ending other sessions, credential events.
- **Role / job**: both — Change my password or end sessions on other devices, and check what I am allowed to do and where (Admin: and whom to ask for more).
- **Primary action (before)**: Simpan Kata Sandi (green, at the end of the password form) → COMMIT
- **Secondary actions (before)**: Pengguna & Akses (Owner, outline header); Akhiri Sesi Lain (DESTRUCTIVE, red outline); Show/hide password toggles; Log Keamanan link (Owner)
- **Visible actions (before, desktop / phone)**: 2 / 1
- **Problems found**:
  - *redundancy, minor* — Profil card: The role appears as a pill beside the name and again as the 'Peran' row. 'Akses perusahaan' appears in the Profil kv and again as the company list below. For Admin, 'diatur oleh Owner' is said three times (subtitle, Profil sub, caps foot).
  - *routing, minor* — Header 'Pengguna & Akses' (Owner): The header action leaves the page for another module, and the subtitle repeats the same pointer ('Akun pengguna lain dikelola di Pengguna & Akses'). On phone it is a full-width button and the first thing above the Profil card.
  - *card, minor* — Kewenangan chips: 17 (Owner) or 25 (Admin) bordered rounded pills look like interactive filter or toggle chips but are static labels. The left card becomes chip soup about 600 px tall.
  - *mobile, polish* — Profil kv: Labels stack above short values ('Status akun / Aktif'), so Profil is about 450 px tall and pushes 'Ubah Kata Sandi', the actual task, below the fold.
- **Proposed simplification**:
  - (P2, module) Remove the header 'Pengguna & Akses' button. For the Owner, add one text link in the 'Perusahaan & kewenangan' section head ('Kelola akun lain') and shorten the subtitle to 'Profil, akses, dan keamanan akun Anda.'. Admin subtitle the same; keep only the caps foot 'Perlu…
  - (P2, module) Render capabilities as plain grouped lists (2–3 columns, like .set-capgroups on 96 phone) or borderless tags. Keep the warm highlight only on 'Kewenangan khusus'.
  - (P3, module) Profil: drop the 'Peran' row (the pill says it) and the 'Akses perusahaan' row (the list below says it). On phone use inline 2-column kv rows so the password card rises into the first viewport.
- **After R11**: fixed (P2 x2, P3, review polish)
  - r11 (earlier): no header navigation button. Owner-only 'Kelola akun lain' section link. Capabilities as grouped plain lists. Profil trimmed. The password task rises into the phone flow.
  - This round: password rules match 05. Rule 2 reads 'Bukan kata sandi umum atau mudah ditebak' (the check still covers the blocklist, name and email). A failed rule shows a red cross (#i-x) instead of a check in a red disc.
  - visible actions desktop 5 → 4, phone 2 → 3
  - remaining: Phone pt-kv label/value baseline offset in Profil ('Verifikasi dua langkah') is Layer A.
  - remaining: Phone count is +1 because the password task now sits in the first viewport (eye toggles counted).
- **Kept on purpose**: Password form: ≥15 chars, live rules, strength, show/hide, paste allowed, COMMIT confirm with session consequence · 'Akhiri Sesi Lain' isolated in its own card with a clear explanation (DESTRUCTIVE) · Credential events with 'tell the Owner' / Log Keamanan foot per role · Balanced two-column desktop layout (left and right end within about 10 px) · Role-aware copy (Owner-only capability list vs…

## `00-tidak-ditemukan.html` — Halaman tidak ditemukan
- **Purpose**: Canonical system page: unknown or role-restricted address (404). Variant ?jenis=error: 'Terjadi kesalahan' with Kode rujukan.
- **Role / job**: both — Understand that this address is not available to me and get back to work in one click.
- **Primary action (before)**: Ke Beranda (role-aware: 02 Owner / 06 Admin). Error variant: Muat Ulang.
- **Secondary actions (before)**: Cari (opens palette); Error variant: Ke Beranda (outline), Salin kode rujukan
- **Visible actions (before, desktop / phone)**: 2 / 2
- **Problems found**:
  - *redundancy, polish* — 'Cari' button vs topbar search: The button opens the same palette as the topbar field visible above it. Acceptable as the second exit, and genuinely useful on phones.
  - *spacing, polish* — Content block placement: The block sits high in a 560 px column (title y about 164) with about 500 px of empty canvas below, so it feels unanchored. Optical centring around 30% of the height would settle it.
  - *alignment, polish* — Text column / Kode rujukan box / button row: Three right edges (about 1045 / 879 / 804). The reference code is a bordered box (card) on an otherwise cardless page.
- **Proposed simplification**:
  - (P3, module) Place the system block optically (about 30% from the top of the content area) and make the Kode rujukan row match the text column width (or render it as inline code + a 'Salin' text button), so text, reference and buttons share one left and right edge.
- **After R11**: fixed (reference row by its unit; optical placement of the system block in Layer A .pt-system)
  - r11 (earlier): in the error variant, 'Kode rujukan' is one inline line in the text column (label, code chip, ghost 'Salin') instead of a bordered box. 'Salin' has no spinner (pending:false).
  - This round: no module change. The Layer A optical placement (.pt-system margin-top clamp(4vh, 22vh - 40px, 22vh)) now applies to both variants, so the block no longer floats at 8vh. The not-found variant stays identical to MCPage.notFound.
  - visible actions desktop 2 → 2, phone 2 → 2
- **Kept on purpose**: Exactly one primary and one secondary action · 'Ke Beranda' resolves the role's Beranda (06 for Admin) · Same component as MCPage.notFound for role-restricted routes, so role gating never shows a broken page · Error variant says nothing changed and offers a copyable reference code · No breadcrumb, no extra chrome

## Final adversarial review and fix pass

Four reviewers (Owner journeys, Admin journeys, desktop/tablet sweep, phone sweep) re-walked the R11 build; every major and minor defect they found was fixed by the owning unit or the orchestrator. What changed:

- Layer A / domain (orchestrator): fact-list (.pt-kv) dividers restored; Filter count = differences from the page default (a deep-linked filter counts, reset returns to the default); containers left-anchored; page tab rows on the common left edge; one-row signals without a count badge; the search keeps >= 280 px before a select moves into the panel; phone action bar [Batal][primary fills]; status pill first in a wrapping meta line.
- Record links are read-only (D-42): a Barang Keluar record opens its stock movements (34?ref=), never the Catat Pengiriman form.
- One way to start an invoice (D-44): 11 Penagihan and the 61 project picker run MCApp.startInvoice (COMMIT, then the draft opens on 62); the interim 62?id=baru entry that drafted on page load was removed.
- One single-date field (D-45): MCDateField in Layer A; 12, 14, 52, 62, 65 and 98 use it.
- Recovery-pass polish (D-46): no one-item Tindakan Lain menu (63 header empty, 14 Buat Revisi as a quiet button); 12 px tab-to-content step on every page; quiet phone actions compact; 76% written attached; 41 time field matches the date field; the Owner-only Beranda guard only for roles with their own Beranda.

### u3-reference-pages
- MAJOR 03 'Gunakan data dari' on phones: the hand-rolled in-card .pur-menu popover (it started at x≈-51 on a 390 px screen) is replaced by the shared MCMenu, rendered in projectContext() into [data-pur-source-wrap]. Title 'Gunakan data dari'; items 'Pembelian sebelumnya' [data-source=previous] and 'Kebutuhan proyek…
- MAJOR 03 with ?proyek kept the static 3×20 lines: a new explicit parameter 03-create-purchase.html?proyek=<id>&isi=kebutuhan opens the form already filled. prefillNeeds(p) loads the lines from the project shortage (same needLines() as the 'needs' menu item; prj-arj-0142 gives 1 × Laptop 14 inci, Rp10.933.500). It…
- 03 purchase date: now starts on MCTime.today() in the project time zone (14 Okt 2026 under the fixture clock; native value 2026-10-14) in every context, not the stale static 08 Okt 2026. The markup value stays only as the no-JS state. No behaviour_test assertion reads the 03 date.
- MINOR 03 page head inset: removed the REF-M3 9 px head inset ([data-page=purchase] .mc-content > .mc-page-head { padding-left: 0 }). Also removed the 03-only 20 px content gutter, so 03 uses the normalised 16 px like every other route. Measured at 1366: crumbs, H1, context card, Informasi card and footer total all at…
- POLISH 03 form bar: 'Batal' is now an outline button (mc-btn--outline, default ink) as on 12, 41 and 65, no longer a text/ghost button. On phones it is the shared [Batal 96][primary fills] pair (min-width 96 px). 03 already has no commit icon.
- POLISH 02 'Tindakan hari ini' row 4 meta now uses the same count as 52: '3 dari 7 syarat wajib belum terpenuhi' (was '3 dari 8 belum lengkap'). It fits on one line at 1366 and wraps cleanly at 390.
- Menu fills ('Gunakan data dari') now also show the items source line ('Dari kekurangan stok proyek' / 'Disalin dari <PB number>'); the existing success toast and qty focus are kept.
- *left to another unit or kept on purpose*: POLISH action-bar primaries use icons inconsistently on 12, 36 and 65 — The icons live in proyek-x.js, gudang-tugas.js and keuangan-kas.js (other units). 03 already has no icon on its primary, which is the target pattern.
- *left to another unit or kept on purpose*: MINOR native date inputs on 41 ('Tanggal diterima'), 65 ('Tanggal uang diterima') and 98 ('Berlaku mulai') vs the MC date field on 03 — These fields are in pengiriman.js, keuangan-kas.js and pengaturan.js (other units). The 03 field (.pur-date: formatted read-only text plus a hidden native picker) is page-local, not a shared component. Shared request…
- *left to another unit or kept on purpose*: POLISH 'Batal' styling and commit icon on 12, 32, 41 and 65 — Only the 03 part is mine; it is done (outline Batal, no icon). The rest is in other units' modules.
- *left to another unit or kept on purpose*: Dead selectors in motion.css (.pur-menu.is-entering, @keyframes pur-menu-in, .pur-source__chevron) — motion.css is not in my ownership. The selectors are harmless because nothing matches them any more. The motion.css owner can delete them.

### u2-pembelian-gudang
- #0 30 Stok (Owner): Barang Masuk and Barang Keluar are now two quiet outline secondaries, so there is no lone 'Tindakan Lain'. Admin keeps Barang Masuk as primary (Barang Keluar stays hidden because she lacks stock.dispatch). Tablet 768-1024 follows the Layer A rule: [Tindakan Lain ▾ (Barang Keluar)][Barang Masuk].…
- #1 Result count position: 20 and 34 now put the count in a .pt-listhead row inside the list card ('9 pembelian', 'x dari y pergerakan'). 34 now always shows the count, not only after filtering. 30's custom gd-listhead became the same .pt-listhead markup. The toolbar end now holds only Filter (MCFilter `end` note…
- #2 35 Reservasi: the in-card segmented control Aktif/Dilepas/Terpakai/Semua is gone. In its place is ONE page toolbar above both lists: search + Tampilkan + 'Status reservasi' select (default:'ACTIVE', allLabel 'Semua', live counts in the option labels, e.g. 'Aktif (3)'). The redundant Proyek select is dropped:…
- #3 21 detail hub anatomy: order is header → metrics → signals → tabs (unchanged). 'Informasi pembelian' is now ONE right-rail .pt-kv card beside the lines inside the Barang tab (from 1340 px; stacked below; label-over-value on phones). Catatan is a kv row. 'Tanggal pembelian' was shortened to 'Tanggal'.
- #4/#9 20 status: Terbuka and Ditutup are quiet text (desktop column and phone row end). Only Dibatalkan keeps its pill; the receipt pill + 'sisa N' still carries the open-row exception.
- #5 Link verbs in my files: 31 'Kelola reservasi' → 'Semua reservasi'; 21 receipt foot 'Riwayat stok' → 'Semua pergerakan'; 21 Pembayaran 'Pengeluaran & Kas Lain' → 'Semua pengeluaran'; 31 advice 'Lihat Pembelian' → 'Buka pembelian'.
- #7 34: the unlabelled trailing 'Pembalikan' column is removed. 'bisa dibalik' is dropped (desktop + phone). 'Sudah dibalik' is now quiet text in the Referensi sub-line; Balikkan stays in the row's detail sheet.
- #8 20 phone: the awaiting-goods notice meta no longer truncates record numbers. On phones it reads 'Sisa 38 barang' (numbers wrapped in .pb-await__nums, hidden ≤767). On wider screens the numbers wrap whole (no ellipsis).
- #10 Phone-safe search placeholders: a matchMedia swap keeps the full wording on desktop and in aria-label. Phone placeholders: 20 'Cari pembelian', 30 'Cari produk' (the field is narrower beside the scan button, so 'Cari produk / kode' still truncated), 34 'Cari produk / lot', 35 'Cari proyek / barang'.
- #11 35 ?proyek= (and ?produk=): both lists (Perlu direservasi + Daftar reservasi) are scoped and the scope shows as a chip. The constant Proyek column (or Barang column) is hidden in both tables, and phone meta and titles adapt.
- #12 31 Reservasi per proyek: lists only ACTIVE reservations, matching its sub. The constant Status column is removed. The empty state reads 'Tidak ada reservasi aktif'. The history is reached via 'Semua reservasi' (35?produk=).
- Cross-unit link rule: 31 header 'Buat Pembelian' and its palette item now carry isi=kebutuhan. The 35 queue gets a 'Buat Pembelian' text link (R.href('pembelian.form', { proyek, isi: 'kebutuhan' })) as the row's one action when Tersedia is 0, nothing is on order and the account canGo('pembelian.form'). No fixture row…
- Polish: 31 lots show 'Layak pakai' as quiet text (Rusak keeps its pill; phone row end shows only exceptions). 35 sheet forms on phones follow [Batal ≥96][primary fills]. Unused CSS removed (gd-listhead, gd-cardbar, gd-seg-host, pt-seg overrides, gd-result, pb-result, pb-info).
- *left to another unit or kept on purpose*: #6 62 menu icons / 'Lihat Dokumen' duplicate — Lives in keuangan.js (another unit's file).
- *left to another unit or kept on purpose*: #1 count placement on 64, 85, 66, 91 and #2 on 70, 32/33/36; #3 on 11/14/51/62; #4/#9 on 61/13; #10 placeholders on 40/63/91/07/10 — These parts live in other units' files; only the 20/21/30/31/34/35 parts were handled here.
- *left to another unit or kept on purpose*: 30 Owner at tablet 768-1024 shows [Tindakan Lain ▾][Barang Masuk] (Barang Keluar in the menu) — This is the Layer A MCActions tablet rule (1 secondary at 768-1024), the same on every page; it was not worked around locally.

### u1-proyek
- #12 (major) 11 Penagihan was a dead end: the Invoice section now has 'Buat Invoice' (outline, needs invoice.issue, ACTIVE project, uninvoiced value > 0). It opens a COMMIT confirmation (basis = delivered but not invoiced, otherwise the remaining confirmed value as the next termin), creates a session draft invoice…
- #18 11 Penagihan on phone: the record number is the whole title line and never truncates. Value + state moved to the meta line, and payments show date + amount in the meta. A drilled-in part sheet now starts with a context line 'Renovasi Gedung A · BTN/PRJ/2026/0087'.
- #2 11 hub anatomy: header → metric strip → 'Perlu tindakan' card above the tabs at every width. Ringkasan is now Komposisi nilai + Aktivitas on the left and Informasi proyek (.pt-kv) + Syarat penyelesaian in the right rail. Tablet one-column order is Syarat → Komposisi → Informasi → Aktivitas.
- #20 11 Pemenuhan tile: the note now names both bases ('Barang 204/204 terkirim · jasa 0/1 selesai'), so it no longer contradicts the percentage.
- #29 meta on 11, 14, 15: parts joined with .pt-sep. The ARJ/BTN chip is dropped where the number already carries the company code (14 keeps it only for an unnumbered draft). At ≤1024 px the client (11) or project (15) takes its own line, so no separator is left hanging at a wrap.
- #19 Draf project: the hub 'Buat Penawaran' (and the 12 result button) go to 13?proyek=…&buat=1. The confirmation opens right away, success goes to the 14 draft, and the flag is removed from the URL. The 13 subtitle follows the project scope, and the empty states use a document icon.
- #3/#10 D-32 quiet normal state: 13 'Disetujui klien' is now quiet text (table and phone). For consistency the same rule applies in the 11 parts: Disetujui klien, Terbuka (purchase), Terkirim, Terbit (document), Ditagihkan.
- #9/#21 13 phone rows: the title line is 'Project · Revisi N' (wraps), and the meta is the record number alone (no 'Revi…' / 'R' fragments).
- #11 phone-safe search placeholders: 10 'Cari proyek…' and 13 'Cari penawaran…'. The full wording moved to the aria-label.
- #15 14: while the answer panel is open, the header 'Catat Jawaban Klien' is not rendered; it comes back on Batal and focus returns to it.
- #7/#5/#6 14 document card: title is 'Dokumen penawaran', the button is 'Pratinjau' (eye) / 'Tutup Pratinjau', the link is 'Buka dokumen', and the issued preview card is titled 'Pratinjau dokumen'. 11 section links follow the convention: 'Semua syarat', 'Semua aktivitas', 'Buka Riwayat Aktivitas'.
- #4/#17 15 meta: the project name is plain text at ≥768 px (the breadcrumb already links it) and a link only at ≤767 px.
- #16/#28 15 conditions: every fix is either a task (Admin with the capability: outline 'Catat Pengiriman' / 'Lengkapi Dokumen' / 'Tagihkan Invoice' / 'Catat Barang Keluar') or a quiet 'Lihat …' link to an overview (hub part or list). The Owner always gets the 'Lihat …' form. Condition 3 with two open cases now lists…
- #27 15 Owner: 'Keadaan luar biasa: Selesaikan Paksa…' is now a muted danger text button in the decision card (same CRITICAL confirmation). The single-item header 'Tindakan Lain' is gone.
- #22 15 phone: while conditions are unmet, the decision card moves after the conditions list (CSS order); when everything is met it stays on top.
- #26 verified: 15 'Catat Pengiriman' and the 11 delivery task links call R.href('pengiriman.catat') explicitly. 11 Pengiriman rows: Admin with delivery.record goes to 41; the Owner (and anyone without that capability) goes to the read view 40?sel. The number link now matches the row target.
- Cross-unit isi=kebutuhan: links that start a purchase from a shortage now add isi=kebutuhan (11 header 'Buat Pembelian', the shortage signal, and the palette / Pengadaan button when a shortage exists). The header-vs-signal duplicate filter still works.
- #23 12 Klien error is now 'Pilih klien.'
- #24 12 'Saluran' legend gap is now the shared field gap (26 → 18 px).
- #8/#25 12 action bar: check icon removed from 'Simpan sebagai Draf'; Batal stays outline. The per-page phone proportion override (.prx-actionbar min-width 104 px / flex) was removed so Layer A's [Batal][primary fills] applies.
- Verified orchestrator Layer A fixes on my pages: kv dividers, tab row on the left edge, left-anchored columns, toolbar Filter on the card edge, signals with no count for a single row, status pill first at ≤1024, sub-nav placement.
- *left to another unit or kept on purpose*: #18: the drill sheet title itself ('Penagihan') still does not name the project — The title is rendered by Layer A MCTabs.mountDrill from tab.label, and I may not edit patterns.js. I added a context line in my own content instead. Shared request: add a drill.context option (or a per-tab drillTitle)…
- *left to another unit or kept on purpose*: #12: 61 'Buat Invoice' sheet copy and the 06 queue-row copy — These live in keuangan.js / core.js (other units). They are now accurate, because 11 Penagihan does offer 'Buat Invoice'.
- *left to another unit or kept on purpose*: #13 (70 next-step gating), #14 (03 prefill), #0 / #1 for 20/34/35/64/66/70/85/91/32/33/36, #3 / #10 for 20 and 61, #6 for 06/31/52/60/98, #5 for 90/97/99, #8… — Owned by other units. 10 and 13 already follow the count-in-list-head and toolbar Status-select rules.
- *left to another unit or kept on purpose*: #12 reviewer suggested 'Buat Invoice' as primary for the Admin — Kept outline for both roles, like the other in-part actions (Buat Pembelian, Catat Barang Keluar, Lengkapi). This avoids a second strong CTA next to the header primary (the ux_density 'two primaries' rule).

### u6-kas-laporan-master
- Defect 0, list count (64, 66, 85): the result count is now the first row inside the list card via MCUI.listHead, with a real noun: '10 pembayaran', '6 pengeluaran kas' / '4 beban' / 'penerimaan', '6 klien' / 'pemasok' / 'produk & jasa' / 'lokasi rak'. When filtered it reads 'n dari N …'. It is hidden over an empty…
- Defect 1 (80/81): Cetak and Ekspor moved out of the filter toolbar into .pt-head__actions through MCActions.render. I added a head-actions mount to pages 80 and 81. Cetak is a quiet secondary and is left out on phones. The export choices (Excel, PDF, Lihat Ekspor Saya) are one header menu labelled 'Ekspor' (sheet…
- Defect 8 (80 phone): Ekspor is now the ⋯ on the title row (Layer A lone-menu rule), and the toolbar is one row [Periode fills / Filter]. First report content moved from y≈387 to y≈335.
- Laba proyek outside a full month: instead of disabling the whole export toggle, the Excel/PDF items are disabled with the reason 'Pilih satu bulan penuh untuk mengekspor laba proyek'.
- Defect 15 (80/81): removed the MCRisk success toast from runExport. The inline result card (status + 'Buka Ekspor Saya') is now the only feedback. Checked on desktop and phone: no toast.
- Defects 2 + 10 (85): 'Tambah <jenis>' keeps priority 'primary' but is quiet (outline) for the Owner; the Admin keeps the filled primary. I applied the same D-36 rule (primary + quiet: owner) to 64 'Catat Pembayaran' and 66 'Catat …', which were 'secondary' for the Owner and stretched full width on phones; now they…
- Defect 3 (64 detail panel): the filled grey 'Jumlah diterima' box with progress bar is replaced by an unfilled two-cell hairline row: [Jumlah diterima + date / Diterapkan ke invoice + 'Kredit Pelanggan Rp…' in warning colour, or 'Seluruhnya diterapkan']. The duplicate 'Ada Kredit Pelanggan' pill is dropped; the…
- Defect 4: horizontal padding is now 0 on .lap-intro and .lap-caption (80/81), and also on .dm-intro (86), so they start on the 236 px edge. .set-page-foot (98) belongs to another unit.
- Defect 5 (82): the action column is right-aligned; Unduh and Minta Lagi share the card's right edge (both end at x=1328).
- Defects 6 + 13 (65): the check-circle icon is removed from the 'Catat Pembayaran' action-bar primary (and the arrow from 'Lihat pembayaran'). The page's own phone button-size overrides and the ≤400 px icon rule are removed, so Layer A's [Batal ~96][primary fills] applies. Batal stays outline.
- Defect 7 (66 phone rows): titles clamp to 2 lines (phone.wrap). The record number (purchase, else project) is its own non-shrinking .pt-num part of the meta ('5 Okt · ARJ/PB/2026/09/0396'), with no company tag beside it. 'Pembayaran beban …' is no longer repeated. The amount now shares the title line, so the meta has…
- Defect 11 (65 + the 66 record sheet): the native date inputs are replaced with an MC date field like the one on 03: calendar addon on the left, read-only '14 Okt 2026', and a hidden native input that keeps max=today and opens the browser picker. There is a keyboard hint (data-desc) that stays described when an error…
- Defect 12 (86): the phone drill is used only when the parts list would hold 2+ parts. Klien, pemasok and jasa (2 parts) now use a plain tab row with no one-row 'Bagian klien' card. Produk (4 parts) keeps the drill.
- Defect 14: checked that LINKS.dispatch (orchestrator) now opens 34?ref=…; the 81 'Barang Keluar' column uses A.link('dispatch') and needs no change.
- Defect 16 (82 phone): a just-requested export shows the 'Baru' tag in the phone row title, added after render (checked with a session export).
- Polish (D-32, same idea as defect 9 in my lists): normal states are quiet text in the 80 Pembelian report Status column (Terbuka/Ditutup) and in the 86 supplier purchases, lots/rack condition (Layak pakai) and product usage (Aktif). Only exceptions keep a pill.
- Polish (85): the Status select uses { default: 'aktif' } as the MCFilter baseline (not counted on the phone Filter button). 'Hapus filter' and the new-record refresh return to Status: Aktif instead of 'all'.
- Polish (86 pemasok phone): the price-history purchase number no longer truncates; it has the meta line to itself and the date sits under the price.
- *left to another unit or kept on purpose*: Defect 1: 'Ekspor' as a FILLED primary in the header — MCActions has no menu-type primary, and its overflow toggle is always outline. Defect 8 and D-26 also class Ekspor as an output action that belongs in the overflow. So on desktop/tablet the header is [Ekspor ▾ (outline…
- *left to another unit or kept on purpose*: Defect 0 for 20, 34, 91; defect 3 for 63; defect 7 for 60; defect 9 for 20/61/13; defect 11 for 41/98; defect 4 for 98 .set-page-foot; defect 13 for… — These parts are in other units' files; only my part was done.
- *left to another unit or kept on purpose*: Defect 8: 'move the as-of note under the tab strip as the panel caption' — The MCTabs toolbar slot puts the period/filter bar right under the tab row, and the as-of note is already the first line (caption) of the report panel just below it. I kept that order because the defect's goal (first…
- *left to another unit or kept on purpose*: Cross-unit link rule (append isi=kebutuhan to 'Buat Pembelian' links from a shortage) — None of my pages has a 'Buat Pembelian' link from a shortage. The 86 supplier 'Buat Pembelian' is a plain next transaction, so I left it unchanged.

### u7-core-tinjauan-setelan
- #0 (91): both Riwayat Aktivitas tabs now open their list card with MCUI.listHead and a noun count ('33 aktivitas', '4 kejadian'). The toolbar end no longer holds the period.
- #7 (91 phone): the date range trigger moved out of the toolbar into the Aktivitas list head (count on the left, period on the right) at every width. The phone toolbar is now one row: [search][Filter]. The old .tnj-acttools wrap CSS is removed. On Log Keamanan the single 'Jenis' filter also sits in the list head, so…
- #9: the 91 search placeholder is now 'Cari aktivitas'; the full wording stays as the field's aria-label. On phones the 07 placeholder switches to 'Nomor, kode, atau nama' through matchMedia; desktop keeps the longer example text.
- #10 (90 and 97 phone): the lone page Filter button moves into the first section head ('Kondisi yang masih terbuka' / 'Perlu tindakan Owner') below 768 px and returns to the toolbar row at 768 px and up. On 97 the three section shells are now built once and render() only fills their sub and body, so the filter is…
- #4/#12: section titles are now sentence case: 'Kondisi yang masih terbuka' and 'Aktivitas untuk ditinjau' (page 90 HTML), 'Perlu tindakan Owner' and 'Sudah dimulai' (97), 'Ubah kata sandi' (99). Glossary terms such as Akses Perusahaan, Kewenangan and Pratinjau Akses keep their capitals.
- #6 (90): '(Kewenangan khusus)' is removed from the activity sentence when the row is drawn (the fixture is unchanged). The class is now always the chip in the meta line, the same on all four rows.
- #5 (06): the group links now say 'Semua stok' or 'Semua proyek' (G1), 'Semua kasus koreksi', 'Semua piutang' and 'Semua proyek'. Destinations are unchanged. 98 'Buka invoice' already followed the convention.
- #17 (06 phone): MCFilter gets filterLabel 'Perusahaan', so the button reads 'Perusahaan' or 'Perusahaan · ARJ'.
- #14 (06): the G4 row meta no longer promises an invoice command. It now reads 'rincian di Penagihan proyek'; the link to 11?tab=penagihan is unchanged.
- Cross-unit rule (06): the 'Kekurangan stok' row now links to R.href('pembelian.form', { proyek, isi: 'kebutuhan' }). It is still gated by canGo, with the fallback to 11?tab=pemenuhan.
- #18 (90): checked only, no code change. Barang Keluar rows go through A.href('dispatches') and now open 34?ref=… (read-only), not 41.
- #2 (96): the matrix's first and last columns use the card padding (phones use --m-card-pad), so 'Kewenangan' and the group labels start on the card title's left edge.
- #3 (98): .set-page-foot horizontal padding is now 0.
- #1 (95): 'Identitas perusahaan' is now a single label / value list (.pt-kv), matching the hub fact anatomy. The 3-column label-over-value grid (.set-idfacts) is removed.
- #19 (96 phone sheet): one section order on every width (head, access, sessions, events). 'Akhiri Semua Sesi' is now a quiet ghost danger command in its own .set-card-foot__danger slot. On desktop it sits at the far end of the foot, aligned to the text edge; on phones it gets its own row under a divider, no longer a…
- #20 (96 editor): .set-capedit and .set-capgroups use CSS columns (2, gap 28 px, break-inside: avoid), with one column below 900 px. The ~340 px hole beside PROYEK is gone. Checked at 1366 and 1024.
- #21 (96 Pratinjau Akses): the duplicate 'Tidak ada yang tersimpan sebelum Simpan Akses.' note is removed (the sticky bar still says it). The 'Yang berubah / Semua' control only renders when the changed count is lower than the total.
- #22 (97 phone): when the start form is open, the lone 'Rincian' toggle has zero padding and starts on the row's text edge.
- #11 (97 and 98 inline forms, phone): the action row is now [Batal ~96 px][primary fills the rest], the same split as the sticky form bar.
- *left to another unit or kept on purpose*: #8 (98 'Berlaku mulai' date field, also 41/65): should use the MC single-date field — Layer A has no shared single-date component. The 03 field is page-specific (pur-* markup bound only in interactions.js). The hard rule says not to work around Layer A locally, and building three separate copies on…
- *left to another unit or kept on purpose*: #13, #15, #16 (70 count labels, 70 next-step gating, 03 prefill) — These are owned by other units (pengiriman.js, interactions.js / page 03). My only part was the cross-unit link: the 06 shortage row now sends isi=kebutuhan. The prefill itself depends on u3 honouring it on 03.
- *left to another unit or kept on purpose*: #1 for 11/14/21/51/62 (hub anatomy); #0 for 20/34/64/66/85; #3 for 80/81; #5 for 11/14/31/52/60; #9 for 30/35/40/63/10/61 — Owned by other units. Only my parts (95 facts, 91 list head, 98 foot, 06 links, 07/91 placeholders) were done.
- *left to another unit or kept on purpose*: #14 main fix (a 'Buat Invoice' section action in 11 renderBilling) — proyek.js is owned by u1. I only removed the promise from the 06 copy. 'rincian di Penagihan proyek' stays true whether or not u1 adds the action.

### u4-tugas-kirim-kasus
- #0 (minor) Filter consistency: on 32 and 33 the company view moved out of the card head into a page toolbar above the worklist (.gdt-wltools, MCFilter). It now has a phone-safe search ('Cari pembelian' / 'Cari proyek', full wording in aria-label) and hides together with the worklist once a record is picked. On 36 the…
- #1 (polish) 41 Penerimaan: one 2-column grid (Tanggal / Jam, equal 1fr) with Nama penerima spanning both, so all right edges align (phones: date 1fr / Jam 120 px). 'Barang diterima' has no Selisih column until a row has a difference or condition note (.krm-lineset.has-diff, toggled live), so product text no longer…
- #2 / #13 (polish) Action-bar primaries now show only the verb, no icon: 'Catat Barang Masuk' (32), 'Catat Barang Keluar' (33), 'Terapkan Selisih' (36). The 36 start-sheet primary lost its plus icon. 41 already had outline Batal + primary verb.
- #3 (major) 36 on phones (<=767) now has two states. Worklist (no ?sesi): toolbar + sessions + bottom nav, no action bar, no auto-selected session. Session (?sesi= or a row tap): context card ('Sesi hitungan', title + state pill, start/racks/progress meta, 'Ganti' back to the list); one-line step card ('Baris n dari…
- #4 / #12 (minor) 40: the filter toolbar is now mounted under the tab row (MCTabs toolbar), the 63 pattern. Signals stay above the tabs. Tab captions are cut to the order only ('Jadwal terdekat lebih dulu' / 'Tenggat terdekat lebih dulu' / 'Terbaru lebih dulu'). 'Barang Keluar' stays the section link, sharing the…
- #6 (minor) 41 'Tanggal diterima' / 'Tanggal serah terima' now uses the shared MC date field (03 markup: mc-input--addon pur-input--date, calendar addon on the left, read-only 'd MMM yyyy' value, hidden native date input with min/max kept, showPicker). Fallback: the field becomes editable and parses '14 Okt 2026',…
- #7 (minor) 70 detail block 'Koreksi tertaut' renamed 'Riwayat kasus' (the case timeline). 'Belum ada koreksi tertaut.' stays as the empty note.
- #8 (polish) Phone-safe search placeholders: 40 'Cari nomor', 70 'Cari kasus' (and new 32 / 33 / 36 ones), with the full wording in aria-label.
- #9 (polish) 70 counts are now .pt-tab__count badges (Terbuka count marked is-attention when > 0); the parenthesised counts are gone.
- #10 (major) 70 next step is now gated by the ACTION capability, not the view route. SELISIH_PENGIRIMAN: 'Buka Pengiriman' only with delivery.close and 'Kirim Pengganti' only with stock.dispatch (MCApp.canGo('gudang.keluar')), and the copy matches whichever the account holds. RETUR_KE_PEMASOK: 'Buka Pembelian' only…
- #11 (minor) 40 'Belum terkirim' and 'Serah terima jasa' rows: the 'Catat' row button that duplicated the record link is removed. The row link + chevron (MCList chevron: true) is the single control to 41. Unused actionLabel / pendingPill helpers removed.
- Extra polish: 41 head meta — the status pill (inside its live [data-krm-headpill] wrapper) now leads the wrapping meta at <=1024, matching the Layer A order for bare pills.
- *left to another unit or kept on purpose*: #0 part for 35 (Reservasi segmented control 'Aktif/Dilepas/Terpakai/Semua') — Lives in assets/js/modules/gudang.js, owned by u2-pembelian-gudang.
- *left to another unit or kept on purpose*: #2 part for 12 (proyek-x.js) and 65 (keuangan-kas.js) action-bar icons; #13 part for 03 / 12 / 65 Batal styling — Not my files (u1 / u5 / u6 and Layer A components.css). My bars (32, 33, 36, 41) now follow outline Batal + primary verb with no icon.
- *left to another unit or kept on purpose*: #5 Draf title duplication on 50 / 61 — dokumen.js / keuangan.js, owned by u5.
- *left to another unit or kept on purpose*: #6 date fields on 65 and 98 — keuangan-kas.js / pengaturan.js, owned by other units. 41 is done.
- *left to another unit or kept on purpose*: #8 placeholders on 30, 35, 63, 91, 07, 10 — Owned by other units. My pages (40, 70, plus the new 32 / 33 / 36 searches) are done.

### u5-dokumen-keuangan
- #20 (major, my part) 61 'Buat Invoice' no longer dead-ends on 11 Penagihan: each project row now links to 62-invoice-detail.html?id=baru&proyek=<id>, which starts the draft invoice (session invoice + unnumbered invoice document) and shows it on 62 with 'Pratinjau & Terbitkan' as the next step. Reopening reuses the…
- #21 61 sheet: the row value is 'Belum diinvoice'; 'Rp… sudah dikirim' appears in the meta only when > 0; projects with nothing left to invoice are not offered; the meta wraps on phones so the figure is not cut
- #3/#16/#25 61: the normal state Ditagihkan is quiet text in the desktop status column and the phone row; pills stay for Draf, Belum Ditagihkan, Lewat jatuh tempo, Sengketa, Lunas, Dihapuskan, Dibatalkan
- #15 50 + 61: unnumbered drafts are titled by their name ('Surat Jalan tahap 2', 'Termin 2 pengadaan server'), with 'Belum bernomor' first in the meta/sub line and one Draf pill. A draft's name drops the '(draf)' suffix in its 62 title and invoice line; 62 meta for a draft leads with 'Belum bernomor'
- #5/#29 62 header meta: parts joined with '·' separators; the project shows as 'Proyek <shortName>' with the number in the title attribute
- #2/#18/#22 62 Rincian: the 2-row Penagihan card is gone and 'Baris invoice' takes the full width. Issue date is in the lines sub, billing date on the Jatuh tempo tile ('29 hari lagi · ditagihkan 13 Okt 2026', one short date format, red only on the due phrase). Belum Ditagihkan now shows the pill plus one hint…
- #11 62 'Tindakan Lain': icons added (Tandai Sengketa = flag, Hapuskan Piutang = ban); 'Lihat Dokumen' dropped because the Dokumen tab is the same destination
- #30 62 write-off confirmation now says '…catat sebagai pembayaran; penghapusan ini lalu dapat dicabut lewat Terapkan dan Cabut Penghapusan.'
- #4/#27 63: the header 'Catat Pembayaran' moved to 'Tindakan Lain' (both roles). The panel's 'Catat pembayaran invoice ini' is the one visible next step (filled for Admin, outline for Owner). New panel / phone-sheet record menu 'Tindakan untuk <nomor>' with Tandai Sengketa and Hapuskan Piutang (each gated by its own…
- #8 63 panel (my part): the summary is now an unfilled 2-cell strip with hairlines, no grey box; the panel pill is dropped when the red due line, the dispute notice or the normal Ditagihkan state already says it
- #12 63: no count on the 'Aktif' tab (Belum Ditagihkan / Sengketa keep theirs; tab min-width 44 px). Phone rows: the end shows only the short amount, the due phrase or issue date leads the meta, the client name takes the ellipsis, so invoice numbers stay whole at 390 and 360
- #17 placeholders on phones: 61 'Cari invoice', 63 'Cari invoice', 50 'Cari dokumen'; the full wording stays in aria-label
- #6 60: both hub rows use the same even 2-column template (no gutter jump at 1366). At <= 1024 the per-company rows fold behind the one 'Per perusahaan' toggle; at 768 the five figures are a 3+2 strip, so 'Perlu tindakan' is in the first screen at 768x1024
- #14 60 phones: no toolbar row; the period / as-of text is header meta; the company choice is one 'Tampilan:' select in the 'Angka keuangan' head (Owner: Gabungan / Per perusahaan / each company; Admin: Semua perusahaan / each company; 16 px font) and stays in sync with the desktop company filter
- #13 60 (my part) 'Kas keluar terbaru' phone rows: title clamps to 2 lines; the linked record number (purchase or number in the label) is its own non-shrinking item in the meta instead of the category words
- #7 52 'Sudah beres': no 'Terpenuhi' pill (only a visually hidden word for screen readers); pills stay for Disiapkan, Belum ada, Tidak berlaku
- #23 52: optional open items sit in their own quiet 'Opsional' group (neutral mark, 'Opsional' pill); the progress legend counts required items plus 'n opsional'; the 'Belum terpenuhi' tab has no count badge and its result line says '7 syarat belum terpenuhi di semua proyek · wajib lebih dulu'; the panel 'Catatan' row…
- #24/#28 52 project select options are number-first ('ARJ/PRJ/2026/0142 · Perangkat Lab Jaringan FT')
- #26 follow-up in my file: 52 BAST next-step link 'Catat Pengiriman' now calls R.href('pengiriman.catat', { id }) explicitly, because A.href('dispatch') now opens the read-only history
- #10 (my pages) 60 aging section link renamed to 'Buka laporan piutang'; 'Semua pembayaran' / 'Semua pengeluaran' / 52 'Buka proyek' already follow the convention
- Layer A fixes checked on my pages: kv dividers stretch, left-anchored columns, Filter button on the card edge, search width >= 280, quiet primary not stretched on phones, status pill first in the meta at <= 1024
- *left to another unit or kept on purpose*: #20 parts in proyek.js renderBilling (no Invoice section action on 11 Penagihan) and the 06 queue copy in core.js — Owned by u1 (proyek.js) and u7 (core.js). Shared entry they can use: R.href('invoice.detail', { id: 'baru', proyek: p.id }), gated by invoice.issue, opens the started draft on 62
- *left to another unit or kept on purpose*: #0 count placement on 20, 64, 85, 34, 66, 91 — Not my files; 50/61/63 and the 52 cross-project list already use the in-card result line
- *left to another unit or kept on purpose*: #1 filter control per module (35, 70, 32, 33, 36) — Not my files; 63 already uses the tabs + toolbar pattern
- *left to another unit or kept on purpose*: #2 hub anatomy on 11/14/21/31/95 — Not my files; on 62 Penagihan was merged and the lines take the full width; 51 keeps its right-rail 'Rincian' kv card, which matches the target pattern
- *left to another unit or kept on purpose*: #8 64 payment detail panel nested box — keuangan-kas.js / u6
- *left to another unit or kept on purpose*: #13 66 expense rows — keuangan-kas.js / u6 (the 60 part is fixed)
- *left to another unit or kept on purpose*: #3/#16 normal-state pills on 20 and 13 — pembelian.js / proyek-x.js (other units); 61 fixed
- *left to another unit or kept on purpose*: #9 caption padding on 80/81/98 — laporan.css / pengaturan.css (other units)
- *left to another unit or kept on purpose*: #17 placeholders on 30, 35, 40, 91, 07, 10 — Other units' files; 61, 63 and 50 fixed
- *left to another unit or kept on purpose*: #19 70 segmented control counts — pengiriman.js (u4)
- *left to another unit or kept on purpose*: #31 02 dashboard '3 dari 8 belum lengkap' vs 52 — pages/02 is not mine; 52's denominator is the required, applicable items
- *left to another unit or kept on purpose*: #26 LINKS.dispatch — domain.js, already fixed by the orchestrator; my caller in dokumen.js now uses pengiriman.catat explicitly

