# MULTIPLECORP Golden Reference — Navigation architecture (r12; r13 notes)

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL**.

The single reference for how the application is navigated: what is a persistent destination, how the one
navigation tree is built and rendered (desktop sidebar, icon rail, drawer, phone bottom bar, command palette),
how the current place is marked, when a tab row is navigation, and how a project defines its own hierarchy.
Decisions: `docs/DESIGN_DECISIONS.md` D-47 … D-51. Contract (what a project configures, visibility meanings):
`docs/PORTABILITY_CONTRACT.md` §2.5. Components: `docs/COMPONENT_CATALOG.md` §5. Every removed page link with its
reach path: `docs/ACTION_ROUTE_MATRIX.md` "R12". Journeys re-walked with the new navigation:
`docs/ROLE_JOURNEYS.md` "R12 revalidation".

Facts in this file come from the resolved configuration, never from memory:
`node tools/export_config.js` (default project, Owner) and `node tools/export_config.js default admin` (Admin
Operasional). Keys: `tree`, `bottomItems`, `navIndex`, `current` (the marked entry of every route), `home`.

---

## 1. Principles

| Surface | Answers | Holds | Never holds |
|---|---|---|---|
| **Sidebar / drawer** | "Ke fungsi mana saya ingin pergi?" (which function) | persistent destinations: module landings and the module's sibling destinations, max 2 levels | records, create flows, actions, account or system pages, badges or counts |
| **Page** | "Apa yang harus saya kerjakan di fungsi ini?" (what to do here) | the job: its figures, attention rows, list or record, task actions, contextual links | a second copy of the menu (sibling sub-navigation, tiles or buttons to other modules) |
| **Tabs** | "Which view of this object or workspace?" | views of ONE object or workspace (states, kinds of one list, record parts, report types) | module navigation (siblings that each have their own entry) |
| **Contextual link** | "Where is the related business object?" | the record or filtered list this object leads to (Proyek → its purchases, Invoice → its payment, Pembelian → its Barang Masuk ?pembelian=) | an unscoped "go to module X" the navigation already provides |
| **Button** | "What can I do now?" | a task or action, verb + object (Buat Proyek, Catat Pembayaran, Terima Barang) | navigation dressed as a button (D-35) |
| **Overflow** ("Tindakan Lain") | "What else, rarely?" | rare, administrative, output and destructive actions (D-26) | the primary, or navigation |

- **One clear function = one clear entry**, not one route = one menu entry. A detail or task route is never an
  entry; it marks the entry it belongs to.
- **Breadcrumbs show hierarchy only** on details and deep flows (`ROUTES.parent` = a true ancestor, D-27). A
  navigation destination has no breadcrumb; a sibling is never a crumb; a group is never a crumb (it is not a place).
- **The command palette is the speed layer**: it lists every entry the account may open (§9 `navIndex`),
  including entries a role's persistent menu hides, so a removed page link is always one search away.
- **Simplify visibility, never capability**: anything removed from a page stays reachable through the
  navigation, a row, a contextual link, overflow, the palette or the workflow (`docs/ACTION_ROUTE_MATRIX.md` R12).
- Calm Golden visual language: icons on level 1 only, no per-item boxes or pills, no badge, count, dot or pulse
  on any entry (canonical D-IA-06).

## 2. Route taxonomy (all 48 routes)

Kinds:
- **PRIMARY MODULE** — a module's landing route (`MODULES[].route`, or `routeByRole`): a level-1 leaf, or the
  landing child of a level-1 group.
- **CHILD NAVIGATION** — a further persistent destination of a module: a level-2 child of a group (e.g. 91's two
  views in Tinjauan ▸), or an extra level-1 entry of a section.
- **DETAIL** — a record view; reached from rows and links; marks its list's entry with `aria-current="true"`.
- **TASK** — a create flow, a form or a record's deep flow; reached from a task button or a next-step link.
- **ACTION** — never a route: no address performs a command on load (D-44). Actions are buttons. *No route is of
  this kind.*
- **SYSTEM** — sign-in, search, account, not-found: their own placement (auth screens, top-bar search, account
  menu), never a navigation entry.
- **HIDDEN** — internal screens that are never listed (navigation, palette).

Columns: **Access** = `ROUTES.roles` (outside it: the canonical not-found page, D-05). **Sidebar** = the entry in
the expanded desktop tree; the tablet / collapsed rail shows only its level-1 icon (a group icon opens the drawer
at that group). **Drawer** = the phone / tablet drawer, rendered from the same tree ("same" = identical entry).
**Bottom** = the phone bottom bar (`slot n, page` = the slot's landing; `X, true` = that slot is lit as the area
ancestor; `eligible, no slot` = `MODULES.bottomNav` allows it but `navigation.bottom` does not place it; `not
eligible` = `bottomNav: false`). **Marked** = the element that carries `aria-current` and its value (§5).
O = Owner (Dimas), A = Admin Operasional (Sari, `?role=admin`); one value = both roles.

| Route (file) | Kind | Module · parent | Access | Sidebar | Drawer | Bottom | Marked |
|---|---|---|---|---|---|---|---|
| `auth.login` (01) | SYSTEM (auth, no shell) | — | signed out | — | — | — | — |
| `auth.password` (05) | SYSTEM (auth, no shell) | — | link holder | — | — | — | — |
| `home` (02) | PRIMARY MODULE | beranda | O (A: not-found) | O: Beranda | same | O: slot 1, page | O: Beranda · page |
| `home.admin` (06) | PRIMARY MODULE (routeByRole) | beranda | A (O: not-found) | A: Beranda | same | A: slot 1, page | A: Beranda · page |
| `search` (07) | SYSTEM (search) | — | both | — (top-bar field, app-bar search, palette) | — | — | — |
| `proyek.list` (10) | PRIMARY MODULE | proyek | both | Proyek ▸ Daftar Proyek | same | slot 2, page | Daftar Proyek · page |
| `proyek.detail` (11) | DETAIL | proyek · 10 | both | — | — | Proyek, true | Daftar Proyek · true |
| `proyek.form` (12) | TASK (create) | proyek · 10 | both | — | — | Proyek, true (bar hidden by the action bar, D-38) | Daftar Proyek · true |
| `penawaran.list` (13) | CHILD NAVIGATION | proyek · none | both | Proyek ▸ Penawaran | same | Proyek, true | Penawaran · page |
| `penawaran.detail` (14) | DETAIL | proyek · 13 | both | — | — | Proyek, true | Penawaran · true |
| `proyek.selesai` (15) | TASK (completion decision) | proyek · 11 | both | — | — | Proyek, true | Daftar Proyek · true |
| `pembelian.list` (20) | PRIMARY MODULE | pembelian (cost.view) | both | Pembelian | same | eligible, no slot | Pembelian · page |
| `pembelian.detail` (21) | DETAIL | pembelian · 20 | both | — | — | — | Pembelian · true |
| `pembelian.form` (03) | TASK (create) | pembelian · 20 | both | — | — | — (bar hidden) | Pembelian · true |
| `gudang.stok` (30) | PRIMARY MODULE | gudang (stock.view) | both | Gudang ▸ Stok | same | slot 3, page | Stok · page |
| `gudang.produk` (31) | DETAIL | gudang · 30 | both | — | — | Gudang, true | Stok · true |
| `gudang.masuk` (32) | CHILD NAVIGATION (task workspace) | gudang · none | both | Gudang ▸ Barang Masuk (stock.receive; r13: also the Owner, D-51 (r13)) | same | Gudang, true | Barang Masuk · page |
| `gudang.keluar` (33) | CHILD NAVIGATION (task workspace) | gudang · none | both (A: read-only by URL) | O: Gudang ▸ Barang Keluar (r13, D-51 (r13)) · A: absent (no stock.dispatch) | same | Gudang, true | O: Barang Keluar · page · A: Gudang header · true |
| `gudang.riwayat` (34) | CHILD NAVIGATION | gudang · none | both | Gudang ▸ Riwayat Stok | same | Gudang, true | Riwayat Stok · page |
| `gudang.reservasi` (35) | CHILD NAVIGATION | gudang · none | both | Gudang ▸ Reservasi | same | Gudang, true | Reservasi · page |
| `gudang.opname` (36) | CHILD NAVIGATION (task workspace) | gudang · none | both (A: read-only by URL) | O: Gudang ▸ Stok Opname · A: absent (no stock.count) | same | Gudang, true | O: Stok Opname · page · A: Gudang header · true |
| `pengiriman.list` (40) | PRIMARY MODULE | pengiriman | both | Pengiriman (flat: one screen) | same | A: slot 4, page · O: — | Pengiriman · page |
| `pengiriman.catat` (41) | TASK | pengiriman · 40 | both | — | — | A: Pengiriman, true (bar hidden) | Pengiriman · true |
| `dokumen.list` (50) | PRIMARY MODULE | dokumen | both | Dokumen ▸ Daftar Dokumen | same | eligible, no slot | Daftar Dokumen · page |
| `dokumen.detail` (51) | DETAIL | dokumen · 50 | both | — | — | — | Daftar Dokumen · true |
| `dokumen.admin` (52) | CHILD NAVIGATION | dokumen · none | both | Dokumen ▸ Dokumen Administrasi | same | — | Dokumen Administrasi · page |
| `keuangan.home` (60) | PRIMARY MODULE | keuangan (finance.view) | both | Keuangan ▸ Ringkasan | same | O: slot 4, page · A: — | Ringkasan · page |
| `invoice.list` (61) | CHILD NAVIGATION | keuangan · none | both | Keuangan ▸ Invoice | same | O: Keuangan, true | Invoice · page |
| `invoice.detail` (62) | DETAIL | keuangan · 61 | both | — | — | O: Keuangan, true | Invoice · true |
| `piutang` (63) | CHILD NAVIGATION | keuangan · none | both | Keuangan ▸ Piutang | same | O: Keuangan, true | Piutang · page |
| `pembayaran.list` (64) | CHILD NAVIGATION | keuangan · none | both | Keuangan ▸ Pembayaran | same | O: Keuangan, true | Pembayaran · page |
| `pembayaran.catat` (65) | TASK | keuangan · 64 | both | — | — | O: Keuangan, true (bar hidden) | Pembayaran · true |
| `pengeluaran` (66) | CHILD NAVIGATION | keuangan · none | both | Keuangan ▸ Pengeluaran & Kas Lain | same | O: Keuangan, true | Pengeluaran & Kas Lain · page |
| `kasus.list` (70) | PRIMARY MODULE | kasus | both | Kasus Koreksi | same | not eligible | Kasus Koreksi · page |
| `laporan.home` (80) | PRIMARY MODULE | laporan | both | Laporan ▸ Laporan per Perusahaan | same | eligible, no slot | Laporan per Perusahaan · page |
| `laporan.gabungan` (81) | CHILD NAVIGATION | laporan · none | O (A: not-found) | O: Laporan ▸ Laporan Gabungan | same | — | O: Laporan Gabungan · page |
| `laporan.ekspor` (82) | CHILD NAVIGATION | laporan · none | both | Laporan ▸ Ekspor Saya (reports.export) | same | — | Ekspor Saya · page |
| `master.home` (85) | PRIMARY MODULE (4 view entries, `?jenis=`) | data-master | both | Data Master ▸ Klien · Pemasok · Produk & Jasa · Lokasi Rak (stock.view) | same | not eligible | the view's entry · page (85 = Klien) |
| `master.detail` (86) | DETAIL | data-master · 85 (`match: ['jenis']`) | both | — | — | — | the record's kind · true (86?jenis=pemasok → Pemasok) |
| `tinjauan.home` (90) | PRIMARY MODULE | tinjauan | O (A: not-found) | O: Tinjauan ▸ Tinjauan Owner (Khusus Owner) | same | not eligible | O: Tinjauan Owner · page |
| `tinjauan.riwayat` (91) | CHILD NAVIGATION (2 view entries of Tinjauan ▸, `?tab=`) | tinjauan · none | O (A: not-found) | O: Tinjauan ▸ Riwayat Aktivitas · Log Keamanan | same | not eligible | O: the view's entry · page |
| `pengaturan.home` (95) | PRIMARY MODULE | pengaturan | O (A: not-found) | O: Pengaturan ▸ Perusahaan | same | not eligible | O: Perusahaan · page |
| `pengaturan.akses` (96) | CHILD NAVIGATION | pengaturan · none | O (A: not-found) | O: Pengaturan ▸ Pengguna & Akses | same | not eligible | O: Pengguna & Akses · page |
| `pengaturan.penomoran` (97) | CHILD NAVIGATION | pengaturan · none | O (A: not-found) | O: Pengaturan ▸ Penomoran Dokumen | same | not eligible | O: Penomoran Dokumen · page |
| `pengaturan.pajak` (98) | CHILD NAVIGATION | pengaturan · none | O (A: not-found) | O: Pengaturan ▸ Pajak | same | not eligible | O: Pajak · page |
| `akun` (99) | SYSTEM (account) | — | both | — (account menu; drawer account block) | — | — | — |
| `system.not-found` (00) | SYSTEM | — | both | — | — | — | — |
| `system.motion` (04) | HIDDEN (motion study) | — | both | — (never in navigation or palette) | — | — | — |

Totals: 13 PRIMARY MODULE · 17 CHILD NAVIGATION · 7 DETAIL · 5 TASK · 0 ACTION · 5 SYSTEM · 1 HIDDEN = 48. A role's
not-found pages mark nothing (Admin on 81 and 90–98, Owner on 06). Route access is unchanged by R12 (§8).

## 3. The trees

**Owner (Dimas)** — 12 level-1 rows, 8 groups, 33 entries on 29 routes (r13: + Gudang ▸ Barang Masuk / Barang Keluar):
```
Beranda                                                        02
Proyek ▸        Daftar Proyek · Penawaran                      10 · 13
Pembelian                                                      20
Gudang ▸        Stok · Barang Masuk · Barang Keluar ·          30 · 32 · 33 ·
                Reservasi · Stok Opname · Riwayat Stok         35 · 36 · 34
Pengiriman                                                     40
Dokumen ▸       Daftar Dokumen · Dokumen Administrasi          50 · 52
Keuangan ▸      Ringkasan · Invoice · Piutang · Pembayaran ·   60 · 61 · 63 · 64 ·
                Pengeluaran & Kas Lain                         66
Kasus Koreksi                                                  70
Laporan ▸       Laporan per Perusahaan · Laporan Gabungan ·    80 · 81 ·
                Ekspor Saya                                    82
Data Master ▸   Klien · Pemasok · Produk & Jasa · Lokasi Rak   85 · 85?jenis=pemasok · =produk · =rak
— Khusus Owner —
Tinjauan ▸      Tinjauan Owner · Riwayat Aktivitas ·           90 · 91 ·
                Log Keamanan                                   91?tab=keamanan
Pengaturan ▸    Perusahaan · Pengguna & Akses ·                95 · 96 ·
                Penomoran Dokumen · Pajak                      97 · 98
```
r13 (R13_SPEC §2, D-51 (r13)): nothing is hidden for the Owner any more — Barang Masuk (32) and Barang Keluar (33)
are in his Gudang (he holds every capability, RG-02); the 30 Stok header pair disappears because the tree provides
both (D-50). Bottom bar: Beranda · Proyek · Gudang · Keuangan. Palette "Navigasi": 33 entries (32 on a page that is
itself an entry, because the entry showing the current address is left out).

**Admin Operasional (Sari)** — 10 level-1 rows, 6 groups, 23 entries on 20 routes:
```
Beranda                                                        06
Proyek ▸        Daftar Proyek · Penawaran                      10 · 13
Pembelian                                                      20
Gudang ▸        Stok · Barang Masuk · Reservasi · Riwayat Stok 30 · 32 · 35 · 34
Pengiriman                                                     40
Dokumen ▸       Daftar Dokumen · Dokumen Administrasi          50 · 52
Keuangan ▸      Ringkasan · Invoice · Piutang · Pembayaran ·   60 · 61 · 63 · 64 ·
                Pengeluaran & Kas Lain                         66
Kasus Koreksi                                                  70
Laporan ▸       Laporan per Perusahaan · Ekspor Saya           80 · 82
Data Master ▸   Klien · Pemasok · Produk & Jasa · Lokasi Rak   85 · …
```
Absent for Sari: Barang Keluar (no `stock.dispatch`), Stok Opname (no `stock.count`), Laporan Gabungan
(`ROUTES.roles` owner) and the whole "Khusus Owner" section (`roles: ['owner']`). Bottom bar: Beranda · Proyek ·
Gudang · Pengiriman. Palette "Navigasi": 23 entries.

Both trees share one order (the canonical business flow, never re-sorted by frequency) and one configuration:
the Admin tree is the same `navigation.sidebar` filtered by role and capability (no `roleFixtures` navigation
override). Group landings = the first visible child: Proyek → Daftar Proyek, Gudang → Stok, Dokumen → Daftar
Dokumen, Keuangan → Ringkasan, Laporan → Laporan per Perusahaan, Data Master → Klien, Tinjauan → Tinjauan
Owner, Pengaturan → Perusahaan. Why the three review screens share one group: as four separate level-1 rows
the Owner's tree was 14 rows and the 1280 × 720 sidebar scrolled with every group closed; a group keeps each canonical
screen its own entry (the Log Keamanan view is not a tab) and the tree at 12 rows. The group label is "Tinjauan"
("Tinjauan & Aktivitas" ellipsized beside the chevron at 1280–1440); on 90 the review kinds read "Aktivitas khusus" /
"Kejadian keamanan", so they never echo the entries Riwayat Aktivitas / Log Keamanan in the same group.
Labels (Owner approval pending, D-47): a child never repeats its group label alone ("Daftar Proyek", "Daftar
Dokumen", "Laporan per Perusahaan", "Ringkasan"); page titles change only where the meaning changes (60
"Ringkasan Keuangan", 95 "Perusahaan", 85 / 91 the view's title).

## 4. Group headers

- A group header is **disclosure-only**: `<button type="button" aria-expanded aria-controls>` with the level-1
  icon, the label and a chevron (closed `>`, rotated 90° to `v` when open). It **never navigates**, never opens a
  flyout, never splits into "label navigates, chevron toggles", and stays a button in every presentation.
- Children: `<ul role="list" aria-labelledby="<header id>">` of plain links; a closed list is `[hidden]` (out of
  the tab order and the accessibility tree). WAI-ARIA disclosure-navigation pattern: normal Tab order,
  Enter / Space toggles, focus stays on the header; no `role=tree` / `role=menu`, no roving tabindex.
- A group's landing child is used by the bottom bar, the palette, the app map and the static no-JS fallback
  (where the header is a link to the landing because no disclosure exists without JS) — never by the runtime header.
- **Size rule**: a group with exactly one visible child renders as a flat link with the group's label and icon; a
  group with none is absent; a section with no entries is absent. This is why Pengiriman is flat, and why an Admin
  without `reports.export` would get a flat "Laporan".
- In the rail the same header button carries `aria-haspopup="dialog" aria-controls="mc-navdrawer"` and opens the
  drawer at its group (§7).

## 5. Open state and current marking

**Where the address sits** — `MCProject.navCurrent()`:
1. Exact: the leaf whose route and params match the address after `ROUTES[route].defaults` (85 = 85?jenis=klien;
   a view value the route does not offer counts as the default view); the most matching params wins →
   `aria-current="page"`.
2. Otherwise walk `ROUTES.parent` from the current route, carrying the URL params a node's `match` names
   (86?jenis=pemasok → Pemasok); the first leaf hit → `aria-current="true"`.
3. A leaf hidden for the role hands the mark to its visible group header (Owner on 32 / 33 → Gudang).
4. Otherwise the level-1 node of the route's module (`"true"`).
5. Otherwise nothing (system, account and not-found pages).

**Marking rules**
- Exactly ONE element per navigation landmark carries `aria-current` (sidebar, drawer, bottom bar): normally the
  leaf; the group header only while its current child is not visible (the user closed the group, the child is
  hidden for the role, or the icon rail shows level 1 only). Never both a header and its visible child.
- Visual: a current level-1 leaf gets the Golden pill + indicator + primary ink; a current child gets primary ink,
  semibold and a 2 px accent rule on the level-1 indicator axis (no fill); the header of the group holding the
  current entry is semibold. Detail and task pages look the same as the entry they belong to.
- **Open state**: on every load only the group holding the current entry is open; groups toggle independently (no
  auto-close); nothing is persisted (no session or local storage for groups). `body[data-nav-section]` remains
  only the static / no-JS hint. r13 (persistent shell over HTTP, D-52 draft in `docs/PERSISTENT_SHELL.md`): the
  sidebar element survives an in-place page swap, so the groups the user opened stay open, the group of the new
  current entry opens, the current marker moves with the pill and the list keeps its scroll unless the new current
  entry is out of view; on `file://` every navigation is a load and the rule above applies.
- The current entry is scrolled into view on load (row-boundary reveal, header first); the nav list scrolls on its
  own between the pinned brand row and the pinned account block. Its lead and trail space sit inside the scroll area,
  so a row is cut only at the brand row's foot or the account border; while a row is hidden beyond an edge, that edge
  carries a scroll shadow (a hairline + soft shadow), never a fade, so the last visible row keeps full ink (r12 review).

## 6. Tabs versus children

A tab row becomes navigation children only when ALL hold:
1. every tab is its own canonical entry or screen;
2. the tabs show different kinds of object or log — not states, filters, periods, report types, review sources or
   record parts;
3. they share no list, selection, toolbar or time window, and each has its own header action or capability;
4. the page is itself a navigation destination, not a record.

Promotion is all or nothing per row. The page hides its tab row only when the role's visible entries cover every
tab it would show (`MCProject.navCovers(route, param, tabIds)`); otherwise the row stays and the entries deep-link
into it, which keeps flat-tree projects correct. After promotion `MCTabs` runs in **view mode** (§9): the URL param
stays the address, only the selected panel renders, h1 and `<title>` come from `ROUTES[route].views`.

| Page | Verdict | Why |
|---|---|---|
| 85 Data Master (Klien · Pemasok · Produk & Jasa · Lokasi Rak) | **Children** (view mode) | four canonical screens, per-kind "Tambah <jenis>", Lokasi Rak needs stock.view |
| 91 Riwayat Aktivitas (Aktivitas · Log Keamanan) | **Children** (two entries of Tinjauan ▸, view mode) | two canonical screens; supersedes the D-01 merge |
| 40 Pengiriman (Belum terkirim · Serah terima jasa · Riwayat) | Local tabs | one workspace, one toolbar, one 41 form; revisit when the canonical delivery screens exist |
| 63 Piutang · 66 Pengeluaran & Kas Lain · 70 Kasus Koreksi | Local tabs | states / kinds of one list |
| 80 Laporan | Local tabs | report types share the company + period bar and Ekspor |
| 90 Tinjauan Owner | Local tabs | sources of one review window |
| 52 Dokumen Administrasi | Local tabs | two views of one checklist; opened from the navigation (no `?proyek`) it lands on "Belum terpenuhi" |
| 11, 21, 62, 86 record parts | Local tabs (phone drill-in on 11) | parts of one record (D-16) |
| 35 segment, 36 sessions, 96 segment, 07 kind filter | Local controls | states or filters |
| R11 sub-navigation on 10 / 13 / 30 / 34 / 35 / 36 | **Not tabs — removed** | sibling navigation the tree now provides (D-39 superseded) |
| 95 hub tiles | **Removed** | navigation dressed as content; facts became conditional signals |

## 7. Responsive behaviour

| Context | Navigation |
|---|---|
| Desktop ≥ 1025 px, expanded (default) | full 2-level sidebar; current group open; brand row toggle collapses |
| Desktop ≥ 1025 px, collapsed | the icon rail: brand-row toggle or **Ctrl / Cmd + B**; the preference stays in the existing per-browser store; expanding restores the tree with the current group open and the current entry scrolled into view |
| Tablet 768–1024 px | always the icon rail (no expand control); ≡ (rail menu) opens the drawer at the current group; no bottom bar |
| Phone < 768 px | app bar (≡ Menu, brand, search) + bottom bar (4 slots per role) + the drawer |

- **Rail** (collapsed desktop and tablet): level-1 icons only, each with a tooltip and an accessible name; leaf
  icons are links; a group icon opens the drawer AT its group (`MCNav.open({ group })`) — no flyouts, no hover
  menus; the "Khusus Owner" label folds to a hairline; the rail scrolls when taller than the viewport; the account
  avatar sits at the rail foot; the current area's icon carries the mark.
- **Drawer** (phone, tablet, collapsed desktop): ONE modal rendered from `navTree()` (not copied from the sidebar
  DOM; ids `dnav-g-` / `dnav-s-`), the same sections, order, labels, level-1 icons and disclosure groups, current
  group open, current entry marked, then the account block (Akun Saya, Pintasan keyboard on fine pointers,
  Keluar). Every open starts at the top and reveals the target group's header first; `MCNav.open({ group })`
  expands that group and focuses its current or first child. Choosing an entry closes the drawer and navigates
  (choosing the current address only closes it); an unsaved-changes guard keeps the drawer open under its question.
  Modal contract unchanged (focus trap, Esc / scrim / close / Back, inert page, focus return, 320 / 240 ms, 150 ms
  fade under reduced motion).
- **Bottom bar** (`bottomItems()`): Owner Beranda · Proyek · Gudang · Keuangan; Admin Beranda · Proyek · Gudang ·
  Pengiriman. A group slot opens its landing child. An item is lit when it is the level-1 ancestor of the current
  entry: `"page"` on its landing, `"true"` elsewhere in that area; areas outside the bar light nothing. Focused
  tasks hide the bar while their sticky action bar shows (D-38). The app-bar Menu (drawer) and search stay: the
  canonical "Lainnya" and "Cari" are those two controls (D-02, D-51).
- **Row size**: level-1 rows keep `--shell-nav-item-h`; child rows 36 × `--du` on fine pointers and 44 px on
  coarse pointers (both levels 44 px on touch screens ≥ 1025 px); drawer rows 44 px on touch; long labels
  ellipsize with the full label as tooltip.
- **Ctrl / Cmd + B** (canonical KB-03): desktop ≥ 1025 px only; `preventDefault`; ignored in editable fields,
  while any dialog, menu, listbox or expanded popup is visible, on the tablet rail, on key repeat and when
  `features.shortcuts` is false; listed in the "Pintasan keyboard" dialog.
- **Motion** (Golden tokens): child list reveal height + opacity at `--mc-dur-base` / `--mc-ease-reveal`, collapse
  at `--mc-dur-state` / `--mc-ease-exit`; chevron 90° at `--mc-dur-moderate` / `--mc-ease-standard`; the sliding
  pill moves only between two rows of the same level visible before and after (else it jumps); collapsing folds
  open child lists with the column. Reduced motion: instant (drawer 150 ms fade). No pulse anywhere in navigation.
- **No JS** (`tools/shell_sync.py`): every page carries a static 2-level tree from its `data-route`; every child
  list is present, the page's group is `.is-open` with its current child marked, group headers are links to their
  landing (`<a class="shell-nav__link shell-nav__toggle" data-nav-group href>`, no `aria-expanded`), chevrons show
  open; tablets without JS show the full sidebar. JS replaces the headers with the disclosure buttons.

## 8. Configuration schema

In `assets/js/project-config.js` (backward compatible: r6–r11 flat lists stay valid):

```
navigation.home     moduleKey | nodeId                    the brand / not-found "Beranda" entry
navigation.sidebar  Section[]
  Section = { id?, label?: L, roles?, capability?, enabled?, items: Item[] }   label = a heading, not a level
  Item    = 'moduleKey'                                   legacy flat leaf to the module landing (routeByRole honoured)
          | Node
  Node    = { id, module?, label?, icon?, route?, routeByRole?, params?, match?: [paramKey],
              children?: Child[], landing?: childId, roles?, hiddenForRoles?, capability?: cap | cap[], enabled? }
            module inherits label / icon / route / routeByRole / roles / capability / enabled from MODULES
            (explicit wins); route XOR children; icon only on level 1
  Child   = { id, label: L, route, params?, match?, roles?, hiddenForRoles?, capability?, enabled? }
            no icon, no children: at most two levels
navigation.bottom   nodeId[]  |  { default: nodeId[], <role>: nodeId[] }
            <= 5 visible level-1 node ids; a group opens its landing child, else its first visible child;
            MODULES[].bottomNav: false keeps a module out; an array = the same bar for every role
ROUTES[id].parent   the TRUE hierarchical parent only; null on a navigation destination whose siblings are
                    their own entries (no sibling breadcrumb)
ROUTES[id].defaults { param: value }   the address compares after defaults (85 = 85?jenis=klien)
ROUTES[id].views    { param, titles: { value: L } }   a param that selects views the navigation may list as
                    entries; h1 + <title> come from titles; a value outside titles = the default view
```

- `params` makes an entry address a view (`{ jenis: 'pemasok' }`); `match` lets detail routes carry a param up the
  parent walk so a record marks the entry of its kind (Data Master `match: ['jenis']`).
- **Visibility of a node** = `enabled !== false` and role in `roles` (if set) and role not in `hiddenForRoles`
  and `can(capability)` (a list = all of them) and (a leaf: `MCRoutes.allowed(route)`; a group: at least one
  visible child). A section with `roles` / `capability` filters all its items.
- **Meanings** (the contract, `docs/PORTABILITY_CONTRACT.md` §2.5; D-48): `ROUTES.roles` = ACCESS;
  node `roles` / `hiddenForRoles` = PRESENTATION in the persistent navigation only; `capability` = a hint, the
  server decides. Hidden means absent, never disabled.
- Never use a node key named `group` (it collides with `ROUTES.group`). Never put a detail, task or system route
  in the tree; never add an entry whose screen does not exist.

## 9. APIs

| API | Returns / does |
|---|---|
| `MCProject.navTree()` | the role-filtered tree to render: `[{ id, label, index, items }]`, each item a Leaf `{ id, kind: 'leaf', level, label, icon, module, route, params, href, child? }` or a Group `{ id, kind: 'group', label, icon, module, landing, route, params, href, children: Leaf[] }` |
| `MCProject.navCurrent(routeId?, params?)` | `{ id, kind, groupId, topId, entry, exact }` with `kind` = `'page'` or `'true'`, or `null` (§5); without arguments the current address |
| `MCProject.bottomItems()` | `[{ key, label, icon, href, route, params, landing }]` (none when `features.bottomNav` is false) |
| `MCProject.navIndex()` | every leaf the account may open (route allowed + capability, `hiddenForRoles` ignored) for the palette: `[{ id, label, group, title: 'Grup › Label', icon, route, params, href, here }]`; `here` = the entry shows the current address |
| `MCProject.navProvides(routeId, params?)` | true when a visible entry of the role opens exactly that route + params (generic duplicate suppression) |
| `MCProject.navCovers(routeId, param, values[])` | true when every value of a view param is its own visible entry |
| `MCProject.home()` | the role's Beranda entry `{ key, label, icon, href, route }` |
| legacy `navItem(key)`, `sidebarGroups()`, `bottomKeys()` | r6 shapes derived from the tree (a group's href = its landing) |
| `MCRoutes.view(routeId, value?)` | `{ param, value, title }` of a view, or `null` |
| `MCNav.open({ group?, trigger? })`, `close()`, `isOpen`, `provides()`, `covers()` | the drawer; `open({ group })` opens it at that group |
| `MCShell.navigate(href)`, `setCollapsed(bool)`, `railed()`, `syncRail()` | shell; `navigate` emits the cancelable `mc:navigate` (the unsaved-changes guard honours it) |
| `MCTabs.mount(host, spec)` view mode | when `navCovers(currentRoute, param, tabIds)` (`param` = `spec.param`, default `'tab'`): no tablist, only the URL-selected panel (`.pt-viewpanel[data-view]`), its render + `onChange` run, h1 + `<title>` from `ROUTES.views`, no `replaceState`; the return value's `mode()` is `'view'` |
| `MCPage.subnav(items, host?)` | items filtered through `navProvides`; renders nothing when fewer than two remain (a flat-tree project keeps its row) |
| palette "Navigasi" group | `navIndex()` entries, then every allowed module whose landing the tree does not list ("Buka <modul>"); the current address and `system.motion` are never listed |

Internal (shell only): `MCNavTree` — one renderer for sidebar, rail and drawer (`html`, `init`, `toggle`, `mark`,
`markBottom`, `reveal`, `edges`). Shared code never names a project route, label or module: the hierarchy comes
only from `navigation.sidebar` and `ROUTES`.

## 10. Defining a project's own hierarchy

1. Register every screen in `ROUTES` with a true `parent` (details and tasks under their list; sibling
   destinations `parent: null`); add `defaults` / `views` where one route shows several kinds.
2. Register the areas in `MODULES` (label, icon, landing `route`, `routeByRole`, `roles`, `capability`, `bottomNav`).
3. Write `navigation.sidebar` in the order of the work: a string for a one-screen area, a Node with `children`
   for an area with 2+ persistent destinations, a Section with `label` + `roles` for a role-only block.
4. Gate children with `capability` (the action capability of the screen, D-33), use `roles` for audience and
   `hiddenForRoles` only for a deliberate presentation choice (§8, D-48).
5. Put at most five frequent level-1 ids in `navigation.bottom`, keyed by role when roles differ.
6. Run `python tools/shell_sync.py` (static fallback), `python tools/route_check.py`, `python tools/nav_audit.py`
   and `python tools/make_app_map.py`.

The legacy flat form stays valid and is the right choice for a small product. The `nusantara` QA fixture is the
example: `sidebar: [{ items: ['beranda', 'penagihan', 'kas', 'pembelian', 'dokumen', 'laporan'] }, { id: 'owner',
…, roles: ['owner'], … }, { id: 'finance', label: 'Tim Keuangan', roles: ['finance'], items: ['keuangan',
'data-master'] }]`, `bottom: ['beranda', 'penagihan', 'pembelian', 'laporan']` — 8 flat entries for its role
"finance". Because its tree does not list the siblings, its pages keep the R11 sub-navigation and the 85 / 91 tab
rows, and its palette offers the module landings the tree lacks — with no page change. A commented hierarchical
example: `template/project-config.example.js`.

## 11. Validators and tools

| Tool | Checks |
|---|---|
| `python tools/route_check.py` | registry ↔ page files ↔ static links; every navigation entry of both levels (default Owner, Admin, `nusantara`, `longname`), bottom item and account entry points to a registered page; a rendered group has ≥ 2 children; parents exist without cycles; no `#`, `javascript:` or `data-placeholder` |
| `python tools/nav_audit.py` (r12) | per project + role (default Owner, default Admin, `nusantara`, `longname`); exit 1 on errors: an entry pointing to a missing route (child to missing route); a dead destination (page file missing); duplicate entries (same route + effective params) and duplicate node ids; depth > 2 or a group rendered with fewer than 2 children; a hidden route shown (an entry for a role outside `ROUTES.roles`); a role-invalid entry (rendered although its `roles`, section `roles`, `hiddenForRoles` or `capability` exclude the account); an active-ancestry mismatch (a route the role may open is not located on itself, one of its `ROUTES.parent` ancestors or its module's level-1 node); a bottom bar over five items or with a non-level-1 item. Notes (no failure): a routed screen without a module or parent outside the auth / core / system / account groups; a child carrying an icon |
| `python tools/nav_audit.py --pages` | page-duplication heuristic (headless Chromium, 1366 px): visible PAGE controls outside the sidebar, drawer, bottom bar, app bar and top bar whose address equals a visible entry of the role; an audit signal for manual review, not a failure (scoped continuations may be intended) |
| `python tools/shell_sync.py [--check]` | regenerates / verifies the static 2-level fallback of every shell page from `data-route` |
| `node tools/export_config.js [project] [role]` | the resolved configuration: `tree`, `bottomItems`, `navIndex`, `current`, `home` (+ the r6 flat `sidebar` / `bottom`), and for the auditor the raw `navConfig`, `modulesRaw` and the account `capabilities` |
| `python tools/a11y_check.py` | adds (r12) the navigation semantics: every group header is a `<button>` with `aria-controls` pointing at an existing list and `aria-expanded` (or, in the rail, `aria-haspopup="dialog"` to the drawer); at most one `aria-current` per landmark (sidebar, drawer, bottom bar); phone bottom-bar targets ≥ 44 px |
| `python tools/clickability.py` | disclosure headers count as actions (their `aria-expanded` flips); sidebar children and rail group icons are exercised like any control (0 dead) |
| `python tools/capture_evidence_r12.py` | renders `evidence/final/r12/` from `make_owner_review.R12_ITEMS`, with menu-state actions (drawer open, Ctrl+B collapse, a rail group opening the drawer); `before/` is never re-rendered |
| `python tools/make_app_map.py` | `review/app-map.html`, including the hierarchy view MODULE → NAV DESTINATIONS → DETAIL / TASK routes with per-role marks |

## 12. When NOT to use nested navigation

- The area has one persistent screen (Pembelian, Pengiriman, Kasus Koreksi): a flat leaf (the size rule renders a
  group of one flat anyway — do not author one).
- The candidates are states, filters, periods, report types, review sources or parts of a record: tabs, a
  segmented control or a filter (§6).
- The candidates are records, create flows or actions: rows, contextual links and buttons.
- A third level seems necessary: split the area or move the distinction into the page; the tree has two levels.
- The views share one toolbar, selection or time window: one page with tabs (40, 80, 90).
- An entry would only save a click to a filtered list: a contextual link carrying the scope (`?proyek=`, `?sel=`).
- An overview page would only repeat its children (tiles to its siblings): no overview; the first child is the
  landing (only 60 Ringkasan and 95 Perusahaan are overviews, because they show what no child shows).
- A role should see a different emphasis: filter the one tree (`roles`, `capability`, `hiddenForRoles`, bottom
  per role) — never a second tree per role.
- The canonical screen is not built yet: no entry (§13).

## 13. Canonical entries not built

The canonical product map lists these entries; the lab has no screen for them, so they are **not** in the tree
(no dead entries). Each becomes one configuration line when its screen exists; the validators reject an entry
without a page.

| Canonical area | Entry | What exists today |
|---|---|---|
| Gudang | Penyesuaian & Kondisi | adjustments appear in Riwayat Stok (34?jenis=PENYESUAIAN) |
| Gudang | Retur ke Pemasok | 21 overflow demo "Retur ke Pemasok"; 70 RETUR_KE_PEMASOK cases |
| Gudang | Selisih & Temuan (SCR-27) | none — the O8 gap (`docs/ROLE_JOURNEYS.md`) |
| Pengiriman | Kirim Langsung | none (canonical Pengiriman is a group; the lab has one screen, so it is flat) |
| Pengiriman | Serah Terima Jasa as its own entry | the 40 "Serah terima jasa" tab |
| Pengiriman | Retur dari Klien | none |
| Dokumen | Bukti | none |
| Keuangan | Potongan | none |
| Keuangan | Kredit Pelanggan | the 64 "Kredit Pelanggan" figure (filters payments with unapplied credit) and "Terapkan ke Invoice" |
| Keuangan | Mutasi Bank | none |
| Data Master | Impor Data Awal | the 97 held-row demo button "Buka Impor Data Awal" |
