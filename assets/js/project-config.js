/* =============================================================================
   MULTIPLECORP Golden Reference: PROJECT configuration (portability contract, r6).

   ONE file configures a project. Pages never need editing to rebrand, re-role or re-route:
     brand       app name, short name, client/company name, logo, mark, alt, favicon, title
     locale      default + secondary language (the Login toggle; app pages follow <html lang>)
     time        IANA timezone, greeting bands + strings, replaceable time provider
     user        fixture identity shown in the account block (production: the session)
     navigation  item catalogue, sidebar/drawer groups (role-aware), bottom-nav keys, mobileBack
     mobileDisclosure  phone section defaults ('open' | 'collapsed') by data-disclosure key
     account     account-menu entries (role-aware), logout availability + confirmation
     dateFilter  presets, default preset, min/max (ISO or relative to MCTime.today())
     features    search, shortcuts, authVisual, dateFilter, bottomNav
     tokens      approved brand-level CSS custom properties (no component CSS rewrite)
   docs/PORTABILITY_CONTRACT.md separates these PROJECT-CONFIGURABLE values from the FIXED
   GOLDEN RULES (geometry, motion, accessibility, component behaviour).

   Runtime (loaded synchronously in <head>, before the stylesheets apply):
     window.MC_PROJECT   the resolved configuration
     window.MCProject    { key, fixtures, config, lang(), t(label), feature(name), navItem(key),
                           sidebarGroups(), bottomKeys(), accountMenu(), allowed(entry), home(),
                           r12: navTree(), navCurrent(route?, params?), bottomItems(), navIndex()
                           (entries carry here: true on the current address), navProvides(route,
                           params), navCovers(route, param, values) }
     window.MCTime       { zone, now(), setNowProvider(fn|null), parts(date), band(hour),
                           greeting(lang, name), today() }
     window.MC_BRAND / window.MCBrand   brand slots (unchanged r5 API)
   Brand slots: [data-brand] [data-brand-mark] [data-brand-name] [data-brand-company]
   [data-brand-label] title[data-page] link[data-brand-favicon].

   QA only: ?project=<fixture> previews another project for this tab (?brand= is the r5 alias);
   ?project=default returns to the default. Lab hook, not a product feature.
   ============================================================================= */
(function () {
  'use strict';

  function L(id, en) { return { id: id, en: en || id }; }

  /* ---- Route registry (r10). One entry per screen of the prototype; no router framework: a
     route is a static page file plus optional query parameters (?id=, ?tab=, ?jenis=).
       file       page file inside pages/ (relative links keep working on file://)
       title      screen title (never business data, IA rule)
       module     owning module key (navigation section); null for system / auth screens
       group      app-map group (auth, core, projects, purchases, warehouse, delivery, documents,
                  finance, cases, reports, master, review, settings, account, system)
       archetype  page archetype (docs/COMPONENT_CATALOG.md § archetypes)
       container  optional page width mode (data | standard | settings | form | focused); default from the archetype (D-30)
       parent     route id of the TRUE hierarchical parent (breadcrumb, phone Back when enabled,
                  the navigation's "current" walk). r12: null on a navigation destination whose
                  module siblings are their own entries (no sibling breadcrumb)
       params     required query parameters (a detail route opened without them shows its
                  default fixture record, never a broken page)
       defaults   r12: { param: value } the route applies when the address omits the param (the
                  navigation compares addresses after defaults: 85 = 85?jenis=klien)
       views      r12: { param, titles: { value: L } } a route whose param selects VIEWS that the
                  navigation may list as entries (h1 + document.title come from titles); a value
                  outside titles is the default view (navigation and MCTabs agree)
       roles      roles that may open it (absent = every role). A role outside the list gets the
                  same "Halaman tidak ditemukan" page as an unknown address (canonical IA rule).
       shell      false for screens without the app shell (sign-in)
     Pages read their own entry through MCRoutes.current(); links use MCRoutes.href(id, params). */
  var ROUTES = {
    'auth.login':           { file: '01-login.html', title: L('Masuk', 'Sign in'), group: 'auth', archetype: 'auth', shell: false },
    'auth.password':        { file: '05-atur-kata-sandi.html', title: L('Atur Kata Sandi', 'Set password'), group: 'auth', archetype: 'auth', shell: false },
    'home':                 { file: '02-owner-dashboard.html', title: L('Beranda', 'Home'), module: 'beranda', group: 'core', archetype: 'dashboard', roles: ['owner'] },
    'home.admin':           { file: '06-antrean-tindakan.html', title: L('Beranda', 'Home'), module: 'beranda', group: 'core', archetype: 'dashboard', roles: ['admin'] },
    'search':               { file: '07-cari.html', title: L('Cari', 'Search'), group: 'core', archetype: 'search' },
    'proyek.list':          { file: '10-proyek.html', title: L('Proyek', 'Projects'), module: 'proyek', group: 'projects', archetype: 'list' },
    'proyek.detail':        { file: '11-proyek-detail.html', title: L('Detail Proyek', 'Project detail'), module: 'proyek', group: 'projects', archetype: 'detail-hub', parent: 'proyek.list', params: ['id'] },
    'proyek.form':          { file: '12-proyek-baru.html', title: L('Buat Proyek', 'New project'), module: 'proyek', group: 'projects', archetype: 'form', parent: 'proyek.list', capability: 'projects.manage' },
    'penawaran.list':       { file: '13-penawaran.html', title: L('Penawaran', 'Quotations'), module: 'proyek', group: 'projects', archetype: 'list', parent: null },
    'penawaran.detail':     { file: '14-penawaran-detail.html', title: L('Detail Penawaran', 'Quotation'), module: 'proyek', group: 'projects', archetype: 'detail', parent: 'penawaran.list', params: ['id'] },
    'proyek.selesai':       { file: '15-penyelesaian-proyek.html', title: L('Penyelesaian Proyek', 'Project completion'), module: 'proyek', group: 'projects', archetype: 'checklist', parent: 'proyek.detail', params: ['id'] },
    'pembelian.list':       { file: '20-pembelian.html', title: L('Pembelian', 'Purchases'), module: 'pembelian', group: 'purchases', archetype: 'list' },
    'pembelian.detail':     { file: '21-pembelian-detail.html', title: L('Detail Pembelian', 'Purchase detail'), module: 'pembelian', group: 'purchases', archetype: 'detail', parent: 'pembelian.list', params: ['id'] },
    'pembelian.form':       { file: '03-create-purchase.html', title: L('Buat Pembelian', 'New purchase'), module: 'pembelian', group: 'purchases', archetype: 'form', parent: 'pembelian.list', capability: 'purchase.manage' },
    'gudang.stok':          { file: '30-stok.html', title: L('Stok', 'Stock'), module: 'gudang', group: 'warehouse', archetype: 'list' },
    'gudang.produk':        { file: '31-stok-produk.html', title: L('Detail Stok Produk', 'Product stock'), module: 'gudang', group: 'warehouse', archetype: 'detail', parent: 'gudang.stok', params: ['id'] },
    'gudang.masuk':         { file: '32-barang-masuk.html', title: L('Barang Masuk', 'Goods receipt'), module: 'gudang', group: 'warehouse', archetype: 'task', parent: null, capability: 'stock.receive' },
    'gudang.keluar':        { file: '33-barang-keluar.html', title: L('Barang Keluar', 'Goods dispatch'), module: 'gudang', group: 'warehouse', archetype: 'task', parent: null, capability: 'stock.dispatch' },
    'gudang.riwayat':       { file: '34-riwayat-stok.html', title: L('Riwayat Stok', 'Stock history'), module: 'gudang', group: 'warehouse', archetype: 'list', parent: null },
    'gudang.reservasi':     { file: '35-reservasi.html', title: L('Reservasi', 'Reservations'), module: 'gudang', group: 'warehouse', archetype: 'list', parent: null },
    'gudang.opname':        { file: '36-stok-opname.html', title: L('Stok Opname', 'Stock count'), module: 'gudang', group: 'warehouse', archetype: 'task', parent: null, capability: 'stock.count' },
    'pengiriman.list':      { file: '40-pengiriman.html', title: L('Pengiriman', 'Deliveries'), module: 'pengiriman', group: 'delivery', archetype: 'list' },
    'pengiriman.catat':     { file: '41-catat-pengiriman.html', title: L('Catat Pengiriman', 'Record delivery'), module: 'pengiriman', group: 'delivery', archetype: 'form', parent: 'pengiriman.list', params: ['id'], capability: 'delivery.record' },
    'dokumen.list':         { file: '50-dokumen.html', title: L('Dokumen', 'Documents'), module: 'dokumen', group: 'documents', archetype: 'list' },
    'dokumen.detail':       { file: '51-dokumen-detail.html', title: L('Detail Dokumen', 'Document'), module: 'dokumen', group: 'documents', archetype: 'document', parent: 'dokumen.list', params: ['id'] },
    'dokumen.admin':        { file: '52-dokumen-administrasi.html', title: L('Dokumen Administrasi', 'Administrative documents'), module: 'dokumen', group: 'documents', archetype: 'checklist', parent: null },
    'keuangan.home':        { file: '60-keuangan.html', title: L('Ringkasan Keuangan', 'Finance summary'), module: 'keuangan', group: 'finance', archetype: 'hub' },
    'invoice.list':         { file: '61-invoice.html', title: L('Invoice', 'Invoices'), module: 'keuangan', group: 'finance', archetype: 'list', parent: null },
    'invoice.detail':       { file: '62-invoice-detail.html', title: L('Detail Invoice', 'Invoice'), module: 'keuangan', group: 'finance', archetype: 'detail', parent: 'invoice.list', params: ['id'] },
    'piutang':              { file: '63-piutang.html', title: L('Piutang', 'Receivables'), module: 'keuangan', group: 'finance', archetype: 'list-detail', parent: null },
    'pembayaran.list':      { file: '64-pembayaran.html', title: L('Pembayaran', 'Payments'), module: 'keuangan', group: 'finance', archetype: 'list-detail', parent: null },
    'pembayaran.catat':     { file: '65-catat-pembayaran.html', title: L('Catat Pembayaran', 'Record payment'), module: 'keuangan', group: 'finance', archetype: 'form', parent: 'pembayaran.list', capability: 'payment.record' },
    'pengeluaran':          { file: '66-pengeluaran.html', title: L('Pengeluaran & Kas Lain', 'Expenses & other cash'), module: 'keuangan', group: 'finance', archetype: 'list', parent: null },
    'kasus.list':           { file: '70-kasus-koreksi.html', title: L('Kasus Koreksi', 'Correction cases'), module: 'kasus', group: 'cases', archetype: 'list-detail' },
    'laporan.home':         { file: '80-laporan.html', title: L('Laporan per Perusahaan', 'Company reports'), module: 'laporan', group: 'reports', archetype: 'report' },
    'laporan.gabungan':     { file: '81-laporan-gabungan.html', title: L('Laporan Gabungan', 'Consolidated report'), module: 'laporan', group: 'reports', archetype: 'report', parent: null, roles: ['owner'] },
    'laporan.ekspor':       { file: '82-ekspor-saya.html', title: L('Ekspor Saya', 'My exports'), module: 'laporan', group: 'reports', archetype: 'list', parent: null, capability: 'reports.export' , container: 'standard' },
    'master.home':          { file: '85-data-master.html', title: L('Data Master', 'Master data'), module: 'data-master', group: 'master', archetype: 'list' , container: 'standard',
                              defaults: { jenis: 'klien' },
                              views: { param: 'jenis', titles: { klien: L('Klien', 'Clients'), pemasok: L('Pemasok', 'Suppliers'), produk: L('Produk & Jasa', 'Products & services'), rak: L('Lokasi Rak', 'Rack locations') } } },
    'master.detail':        { file: '86-data-master-detail.html', title: L('Detail Data Master', 'Master record'), module: 'data-master', group: 'master', archetype: 'detail', parent: 'master.home', params: ['jenis', 'id'] },
    'tinjauan.home':        { file: '90-tinjauan-owner.html', title: L('Tinjauan Owner', 'Owner review'), module: 'tinjauan', group: 'review', archetype: 'review', roles: ['owner'] , container: 'standard' },
    'tinjauan.riwayat':     { file: '91-riwayat-aktivitas.html', title: L('Riwayat Aktivitas', 'Activity history'), module: 'tinjauan', group: 'review', archetype: 'list', parent: null, roles: ['owner'] , container: 'standard',
                              defaults: { tab: 'aktivitas' },
                              views: { param: 'tab', titles: { aktivitas: L('Riwayat Aktivitas', 'Activity history'), keamanan: L('Log Keamanan', 'Security log') } } },
    'pengaturan.home':      { file: '95-pengaturan.html', title: L('Perusahaan', 'Company'), module: 'pengaturan', group: 'settings', archetype: 'settings', roles: ['owner'] },
    'pengaturan.akses':     { file: '96-pengguna-akses.html', title: L('Pengguna & Akses', 'Users & access'), module: 'pengaturan', group: 'settings', archetype: 'settings', parent: null, roles: ['owner'] },
    'pengaturan.penomoran': { file: '97-penomoran.html', title: L('Penomoran Dokumen', 'Document numbering'), module: 'pengaturan', group: 'settings', archetype: 'settings', parent: null, roles: ['owner'] },
    'pengaturan.pajak':     { file: '98-pajak.html', title: L('Pajak', 'Tax'), module: 'pengaturan', group: 'settings', archetype: 'settings', parent: null, roles: ['owner'] },
    'akun':                 { file: '99-akun-saya.html', title: L('Akun Saya', 'My account'), group: 'account', archetype: 'settings' },
    'system.not-found':     { file: '00-tidak-ditemukan.html', title: L('Halaman tidak ditemukan', 'Page not found'), group: 'system', archetype: 'system' },
    'system.motion':        { file: '04-motion-study.html', title: L('Motion Study', 'Motion study'), group: 'system', archetype: 'study' }
  };

  /* ---- Module registry (r10): the product areas a project offers. Navigation, the command
     palette, the app map and role filtering all read this list.
       key, label, icon, route (landing route id; routeByRole for a role-specific landing),
       enabled (default true; false removes the module everywhere, its routes included),
       roles (absent = every role), capability (an Admin capability the module needs; the Owner
       holds every capability), bottomNav (eligible for the phone bottom bar; default true),
       extra (an alternative entry a project may place in its navigation; not a module of its own). */
  var MODULES = [
    { key: 'beranda',     label: L('Beranda', 'Home'), icon: 'home', route: 'home', routeByRole: { admin: 'home.admin' } },
    { key: 'proyek',      label: L('Proyek', 'Projects'), icon: 'folder', route: 'proyek.list' },
    { key: 'pembelian',   label: L('Pembelian', 'Purchasing'), icon: 'cart', route: 'pembelian.list', capability: 'cost.view' },
    { key: 'gudang',      label: L('Gudang', 'Warehouse'), icon: 'warehouse', route: 'gudang.stok', capability: 'stock.view' },
    { key: 'pengiriman',  label: L('Pengiriman', 'Deliveries'), icon: 'truck', route: 'pengiriman.list' },
    { key: 'dokumen',     label: L('Dokumen', 'Documents'), icon: 'file-text', route: 'dokumen.list' },
    { key: 'keuangan',    label: L('Keuangan', 'Finance'), icon: 'wallet', route: 'keuangan.home', capability: 'finance.view' },
    { key: 'kasus',       label: L('Kasus Koreksi', 'Correction cases'), icon: 'file-warning', route: 'kasus.list', bottomNav: false },
    { key: 'laporan',     label: L('Laporan', 'Reports'), icon: 'bar-chart', route: 'laporan.home' },
    { key: 'data-master', label: L('Data Master', 'Master data'), icon: 'database', route: 'master.home', bottomNav: false },
    { key: 'tinjauan',    label: L('Tinjauan Owner', 'Owner review'), icon: 'shield-check', route: 'tinjauan.home', roles: ['owner'], bottomNav: false },
    { key: 'pengaturan',  label: L('Pengaturan', 'Settings'), icon: 'sliders', route: 'pengaturan.home', roles: ['owner'], bottomNav: false },
    /* extra entries a project may place in its navigation (the nusantara QA fixture uses them) */
    { key: 'penagihan',   label: L('Penagihan', 'Billing'), icon: 'receipt', route: 'invoice.list', extra: true },
    { key: 'kas',         label: L('Kas & Bank', 'Cash & bank'), icon: 'landmark', route: 'pembayaran.list', extra: true }
  ];

  /* Shared item catalogue (r6 API): every destination a project may place in its navigation,
     derived from the module registry (href = the landing route's file). */
  var CATALOGUE = {};
  MODULES.forEach(function (m) {
    CATALOGUE[m.key] = { label: m.label, icon: m.icon, href: ROUTES[m.route] ? ROUTES[m.route].file : null, route: m.route };
  });

  var FIXTURES = {
    /* Default project: the approved Golden Reference identity (MULTIPLECORP owner fixture). */
    multiplecorp: {
      brand: {
        name: 'MultipleCorp',
        short: 'MultipleCorp',
        company: 'MultipleCorp',
        logo: null,                                     /* full logo image; null = mark + name text */
        mark: { symbol: 'i-logo-mark', src: '../img/brand/multiplecorp-mark.svg' },
        alt: 'MultipleCorp',
        favicon: '../img/brand/multiplecorp-mark.svg',
        title: '{page} · {name}',
        display: 'name'                                 /* name text in brand slots: 'name' or 'short' */
      },
      locale: { default: 'id', secondary: 'en' },
      time: {
        zone: 'Asia/Jakarta',
        /* [from, to) in local hours of the zone; the last band wraps past midnight */
        bands: [
          { id: 'morning', from: 4, to: 11, icon: 'sun' },
          { id: 'midday', from: 11, to: 15, icon: 'sun' },
          { id: 'afternoon', from: 15, to: 18, icon: 'sunset' },
          { id: 'evening', from: 18, to: 4, icon: 'moon' }
        ],
        greetings: {
          id: { morning: 'Selamat pagi', midday: 'Selamat siang', afternoon: 'Selamat sore', evening: 'Selamat malam' },
          en: { morning: 'Good morning', midday: 'Good afternoon', afternoon: 'Good afternoon', evening: 'Good evening' }
        },
        now: null                                       /* null = device clock; production: server time */
      },
      /* fixture identity (production: the session). id links to the user record of the fixture data. */
      user: { id: 'usr-dimas', name: 'Dimas', initials: 'D', role: 'owner', roleLabel: L('Owner'), email: 'dimas@multiplecorp.id', companies: 'all', capabilities: 'all' },
      /* r12: the HIERARCHICAL business-flow navigation of the canonical IA (§6.1): one tree drives the
         desktop sidebar, the icon rail and the drawer. Schema (backward compatible, r6-r11 fixtures keep
         their flat module-key lists):
           sidebar  Section[]   Section = { id?, label?: L (a heading, not a level), roles?, capability?,
                                            enabled?, items: Item[] }
                    Item = 'moduleKey' (a flat leaf to the module landing; routeByRole honoured) | Node
                    Node = { id, module?, label?, icon?, route?, routeByRole?, params?, match?: [param],
                             children?: Child[], landing?: childId, roles?, hiddenForRoles?, capability?,
                             enabled? }   module inherits label / icon / route / routeByRole / roles /
                             capability / enabled from MODULES (explicit wins); route XOR children
                    Child = { id, label: L, route, params?, match?, roles?, hiddenForRoles?, capability?,
                              enabled? }   (no icon, no children: at most two levels)
           bottom   nodeId[] | { default: nodeId[], <role>: nodeId[] }   (<= 5 visible level-1 nodes; a
                    group opens its landing child, else its first visible child)
         Meanings: ROUTES.roles = ACCESS (not-found outside it); node roles / hiddenForRoles =
         PRESENTATION in the persistent navigation only (the command palette still lists every page
         the account may open); capability = a hint for the UI, the server decides. A group with one
         visible child renders as a flat link (group label + icon), with none it is absent.
         Phone bottom bar: the canonical first three (Beranda, Proyek, Gudang) + the most used fourth
         for the role; the canonical "Cari" and "Lainnya" are the app-bar search and menu (D-02). */
      navigation: {
        home: 'beranda',                                /* the brand / not-found "Beranda" entry (a module key) */
        sidebar: [
          { items: [
            'beranda',
            { id: 'proyek', module: 'proyek', children: [
              { id: 'proyek-daftar', label: L('Daftar Proyek', 'Projects'), route: 'proyek.list' },
              { id: 'penawaran', label: L('Penawaran', 'Quotations'), route: 'penawaran.list' }
            ] },
            'pembelian',
            /* r13 (R13_SPEC §2, supersedes D-51(2)): one Gudang order for every role, filtered by capability only:
               Stok · Barang Masuk · Barang Keluar · Reservasi · Stok Opname · Riwayat Stok. The Owner holds every
               capability (canon RG-02), so he finds the floor tasks in his menu (the 30 Stok header pair goes away,
               D-50 navProvides); an Admin sees what her capabilities allow (Sari: no Barang Keluar, no Stok Opname). */
            { id: 'gudang', module: 'gudang', children: [
              { id: 'stok', label: L('Stok', 'Stock'), route: 'gudang.stok' },
              { id: 'barang-masuk', label: L('Barang Masuk', 'Goods receipt'), route: 'gudang.masuk', capability: 'stock.receive' },
              { id: 'barang-keluar', label: L('Barang Keluar', 'Goods dispatch'), route: 'gudang.keluar', capability: 'stock.dispatch' },
              { id: 'reservasi', label: L('Reservasi', 'Reservations'), route: 'gudang.reservasi' },
              { id: 'stok-opname', label: L('Stok Opname', 'Stock count'), route: 'gudang.opname', capability: 'stock.count' },
              { id: 'riwayat-stok', label: L('Riwayat Stok', 'Stock history'), route: 'gudang.riwayat' }
            ] },
            'pengiriman',                               /* its tabs stay local views of one workspace */
            { id: 'dokumen', module: 'dokumen', children: [
              { id: 'dokumen-daftar', label: L('Daftar Dokumen', 'All documents'), route: 'dokumen.list' },
              { id: 'dokumen-admin', label: L('Dokumen Administrasi', 'Administrative documents'), route: 'dokumen.admin' }
            ] },
            { id: 'keuangan', module: 'keuangan', children: [
              { id: 'keuangan-ringkasan', label: L('Ringkasan', 'Summary'), route: 'keuangan.home' },
              { id: 'invoice', label: L('Invoice', 'Invoices'), route: 'invoice.list' },
              { id: 'piutang', label: L('Piutang', 'Receivables'), route: 'piutang' },
              { id: 'pembayaran', label: L('Pembayaran', 'Payments'), route: 'pembayaran.list' },
              { id: 'pengeluaran', label: L('Pengeluaran & Kas Lain', 'Expenses & other cash'), route: 'pengeluaran' }
            ] },
            'kasus',
            { id: 'laporan', module: 'laporan', children: [
              { id: 'laporan-perusahaan', label: L('Laporan per Perusahaan', 'Company reports'), route: 'laporan.home' },
              { id: 'laporan-gabungan', label: L('Laporan Gabungan', 'Consolidated report'), route: 'laporan.gabungan' },
              { id: 'ekspor-saya', label: L('Ekspor Saya', 'My exports'), route: 'laporan.ekspor', capability: 'reports.export' }
            ] },
            /* one entry per kind (ROUTES master.home views); match: a record of a kind (86?jenis=) marks its kind */
            { id: 'data-master', module: 'data-master', match: ['jenis'], children: [
              { id: 'klien', label: L('Klien', 'Clients'), route: 'master.home', params: { jenis: 'klien' } },
              { id: 'pemasok', label: L('Pemasok', 'Suppliers'), route: 'master.home', params: { jenis: 'pemasok' } },
              { id: 'produk', label: L('Produk & Jasa', 'Products & services'), route: 'master.home', params: { jenis: 'produk' } },
              { id: 'rak', label: L('Lokasi Rak', 'Rack locations'), route: 'master.home', params: { jenis: 'rak' }, capability: 'stock.view' }
            ] }
          ] },
          { id: 'owner', label: L('Khusus Owner', 'Owner only'), roles: ['owner'], items: [
            /* r12 review: the three canonical review screens are children of one group, so the Owner's tree is 12
               level-1 rows (it fits a 1280 x 720 sidebar with every group closed and the 1024 rail without scrolling).
               The group label is "Tinjauan": "Tinjauan & Aktivitas" ellipsizes beside a chevron at 1280-1440. */
            { id: 'tinjauan-aktivitas', label: L('Tinjauan', 'Review'), icon: 'shield-check', children: [
              { id: 'tinjauan', label: L('Tinjauan Owner', 'Owner review'), route: 'tinjauan.home' },
              { id: 'riwayat-aktivitas', label: L('Riwayat Aktivitas', 'Activity history'), route: 'tinjauan.riwayat', params: { tab: 'aktivitas' } },
              { id: 'log-keamanan', label: L('Log Keamanan', 'Security log'), route: 'tinjauan.riwayat', params: { tab: 'keamanan' } }
            ] },
            { id: 'pengaturan', module: 'pengaturan', children: [
              { id: 'perusahaan', label: L('Perusahaan', 'Company'), route: 'pengaturan.home' },
              { id: 'pengguna-akses', label: L('Pengguna & Akses', 'Users & access'), route: 'pengaturan.akses' },
              { id: 'penomoran', label: L('Penomoran Dokumen', 'Document numbering'), route: 'pengaturan.penomoran' },
              { id: 'pajak', label: L('Pajak', 'Tax'), route: 'pengaturan.pajak' }
            ] }
          ] }
        ],
        /* slots 1-3 shared, slot 4 per role: Owner Keuangan (receivables oversight), Admin Pengiriman (delivery) */
        bottom: { default: ['beranda', 'proyek', 'gudang', 'keuangan'], admin: ['beranda', 'proyek', 'gudang', 'pengiriman'] },
        /* r9: no explicit Back in the phone app bar. Device / browser Back, the swipe gesture, the
           drawer and the bottom navigation already return. A project turns it on only when browser
           history cannot represent its workflow (standalone app, deep task flows); the control then
           returns to the page's body[data-nav-parent] destination. */
        mobileBack: false
      },
      /* r9: phone section disclosures, by data-disclosure key: 'open' | 'collapsed'. Desktop and
         tablet always show every section. Sections with required fields of the current step start
         open; a section holding a validation error always opens (never hidden). */
      mobileDisclosure: {
        'dash-aging': 'collapsed', 'dash-projects': 'collapsed', 'dash-value': 'collapsed',
        'purchase-info': 'open', 'purchase-items': 'open', 'purchase-attach': 'collapsed', 'purchase-summary': 'collapsed'
      },
      account: {
        /* r10: canonical account menu = Akun Saya + Keluar (+ the keyboard reference on desktop).
           "Profil saya" and "Pengaturan akun" both meant the one Akun Saya page; merged. */
        menu: [
          { id: 'profile', label: L('Akun Saya', 'My account'), icon: 'user', route: 'akun' },
          { id: 'shortcuts', label: L('Pintasan keyboard', 'Keyboard shortcuts'), icon: 'keyboard', action: 'shortcuts', pointer: 'fine' },
          { id: 'guide', label: L('Panduan', 'Guidance'), icon: 'info', action: 'guide' },   /* r13 Phase 6: guidance level + walkthrough (non-canonical addition, DEV-2) */
          { separator: true },
          { id: 'logout', label: L('Keluar', 'Sign out'), icon: 'logout', action: 'logout', tone: 'danger' }
        ],
        logout: { enabled: true, confirm: true, redirect: '01-login.html?signedout=1' },
        adminLabel: L('Owner')                          /* who issues accounts / resets passwords (Login copy) */
      },
      /* r13 Phase 6 - guided work (Layer B: MULTIPLECORP content for the Layer A MCGuide / MCHelp / MCTour).
         levels: per-viewer presentation only (never blocks work, never hides warnings or errors).
         tours: steps on REAL controls; route = where the step lives, href = how the tour gets there (fixture records
         of the reference data set), target = the element it points at (absent -> the step is skipped).
         screens: "Cara kerja" lines per route (2-4 short lines, shown at the Terpandu level). */
      help: {
        defaultLevel: 'terpandu',
        tours: {
          'admin-penawaran': {
            title: 'Menyiapkan penawaran', capability: 'quotation.manage',
            steps: [
              { route: 'home.admin', href: '06-antrean-tindakan.html', target: '[data-guide="resume"]', title: 'Mulai dari sini',
                body: 'Draf yang belum selesai dan catatan yang terakhir Anda buka ada di "Lanjutkan pekerjaan". Antrean di bawahnya berisi yang menunggu tindakan, dikelompokkan per jenis pekerjaan.' },
              { route: 'home.admin', href: '06-antrean-tindakan.html', target: '.atq-group', title: 'Satu baris, satu tindakan',
                body: 'Setiap baris menyebut kondisinya, perusahaan, dan proyeknya. Klik baris untuk membuka tempat tindakan itu dikerjakan.' },
              { route: 'proyek.detail', href: '11-proyek-detail.html?id=prj-arj-0164', target: '[data-guide="project-flow"]', title: 'Tahap proyek dan langkah berikutnya',
                body: 'Halaman proyek menunjukkan tahap yang sudah tuntas dan yang sedang berjalan, dihitung dari catatan - bukan dicentang manual - beserta satu langkah berikutnya.' },
              { route: 'penawaran.detail', href: '14-penawaran-detail.html?id=q-arj-0164-r1', target: '.pt-compose > .pt-compose__lead', title: 'Data proyek dipakai ulang',
                body: 'Perusahaan, klien, PIC, dan item datang dari proyek - tidak perlu diketik ulang. Bila ada yang salah, perbaiki di proyek lewat "Data dari proyek".' },
              { route: 'penawaran.detail', href: '14-penawaran-detail.html?id=q-arj-0164-r1', target: '.pt-compose__work .mc-flow', title: 'Kerjakan per tahap',
                body: 'Rincian untuk jumlah, harga, dan masa berlaku. Pemeriksaan untuk mencocokkan isi sebelum terbit. Berpindah tahap tidak menyimpan dan tidak menerbitkan.' },
              { route: 'penawaran.detail', href: '14-penawaran-detail.html?id=q-arj-0164-r1', target: '.pt-compose__preview, .pt-compose__switch', title: 'Pratinjau langsung',
                body: 'Kertas di sini mengikuti isian Anda. Pratinjau tidak menyimpan dan tidak menetapkan nomor. "Layar penuh" membuka kertas lebih besar untuk dibaca.' },
              { route: 'penawaran.detail', href: '14-penawaran-detail.html?id=q-arj-0164-r1', target: '.pt-compose__bar', title: 'Periksa, perbaiki, terbitkan',
                body: 'Simpan Draf kapan saja. Di Pemeriksaan, hal yang belum benar tampil dengan "Perbaiki" yang membuka kolomnya. Terbitkan menetapkan nomor resmi dan mengunci isi; setelah itu kartu hasil menunjukkan langkah berikutnya - misalnya menunggu jawaban klien.' }
            ]
          }
        },
        screens: {
          'home.admin': { howItWorks: [
            'Antrean dihitung ulang dari catatan setiap kali halaman dibuka; tidak ada yang perlu ditandai selesai.',
            'Klik sebuah baris untuk membuka tempat tindakannya. Baris hilang sendiri setelah kondisinya teratasi.',
            '"Lanjutkan pekerjaan" berisi draf dan catatan yang terakhir Anda buka di perangkat ini.'] },
          'proyek.detail': { howItWorks: [
            'Tahap dihitung dari catatan proyek (penawaran, pembelian, barang keluar, invoice, pembayaran).',
            'Tahap bisa berjalan bersamaan; "Berikutnya" menyebut satu langkah yang paling dekat.',
            'Proyek aktif setelah klien menyetujui penawaran atau mengirim pesanan.'] }
        }
      },
      /* r7: no fixture "today" here. Every current-date concept (greeting, Hari ini, this month,
         presets, limits, the dashboard's period labels) comes from MCTime (time.zone + provider).
         min / max accept ISO dates or 'today', 'startOfYear±N', 'endOfYear±N', '±Nd|m|y'. */
      dateFilter: {
        presets: ['today', 'last7', 'last1m', 'thisMonth', 'lastMonth', 'custom'],
        default: 'thisMonth',
        min: 'startOfYear-2',                           /* 1 Jan two years back */
        max: 'endOfYear+1'                              /* 31 Dec next year (planned periods) */
      },
      features: { search: true, shortcuts: true, authVisual: true, dateFilter: true, bottomNav: true },
      tokens: {},
      /* QA only (lab hook, not a product feature): ?role=admin previews the Admin Operasional view in
         this tab (?role=owner returns). Merged over the resolved project like a fixture. The admin
         holds grants for two companies (ARJ, BTN); CKP records show as "perusahaan lain". */
      roleFixtures: {
        admin: {
          user: {
            id: 'usr-sari', name: 'Sari Wulandari', initials: 'SW', role: 'admin', roleLabel: L('Admin Operasional', 'Operations admin'),
            email: 'sari@multiplecorp.id', companies: ['ARJ', 'BTN'],
            /* r10: the same capability set as the fixture user usr-sari (kewenangan khusus: payment.reallocate,
               warnings.override, cases.close). No stock.dispatch: Barang Keluar is Bagas's work (warehouse admin). */
            capabilities: ['projects.view', 'stock.view', 'projects.manage', 'projects.confirm', 'projects.complete', 'quotation.manage',
              'purchase.manage', 'cost.view', 'finance.view', 'invoice.issue', 'billing.record', 'payment.record', 'payment.apply',
              'documents.issue', 'requirements.manage', 'requirements.waive', 'delivery.record', 'stock.receive', 'stock.reserve',
              'evidence.view', 'evidence.upload', 'reports.export', 'payment.reallocate', 'warnings.override', 'cases.close']
          }
          /* r12: no navigation override: the role's bottom bar is navigation.bottom.admin (production
             config), and the sidebar is the same tree filtered by role and capability */
        }
      }
    },

    /* QA fixture: a different client, role and navigation. Never the default. Proves that brand,
       locale, time, navigation, account, date filter, features and brand tokens are all project
       values (docs/PORTABILITY_CONTRACT.md). */
    nusantara: {
      brand: {
        name: 'Nusantara Konstruksi Digital',
        short: 'Nusantara',
        company: 'PT Nusantara Konstruksi Digital Sejahtera',
        logo: { src: '../img/brand/alt-logo-wide.svg', width: 212, height: 48 },   /* vector wordmark (no <text>) */
        mark: { src: '../img/brand/alt-mark.svg' },
        alt: 'Nusantara Konstruksi Digital',
        favicon: '../img/brand/alt-mark.svg',
        title: '{page} · {short}',
        display: 'short'
      },
      locale: { default: 'en', secondary: 'id' },
      time: { zone: 'Asia/Makassar' },
      user: { name: 'Rina', initials: 'RA', role: 'finance', roleLabel: L('Keuangan', 'Finance'), email: 'rina@nusantara.example' },
      navigation: {
        sidebar: [
          { items: ['beranda', 'penagihan', 'kas', 'pembelian', 'dokumen', 'laporan'] },
          { id: 'owner', label: L('Khusus Owner', 'Owner only'), roles: ['owner'], items: ['tinjauan', 'pengaturan'] },
          { id: 'finance', label: L('Tim Keuangan', 'Finance team'), roles: ['finance'], items: ['keuangan', 'data-master'] }
        ],
        bottom: ['beranda', 'penagihan', 'pembelian', 'laporan']
      },
      account: {
        menu: [
          { id: 'profile', label: L('Profil saya', 'My profile'), icon: 'user', route: 'akun' },
          { separator: true },
          { id: 'logout', label: L('Keluar', 'Sign out'), icon: 'logout', action: 'logout', tone: 'danger' }
        ],
        adminLabel: L('admin TI', 'IT admin')
      },
      dateFilter: { presets: ['today', 'last7', 'thisMonth', 'lastMonth', 'custom'], min: '2025-01-01' },
      features: { shortcuts: false, authVisual: false },
      /* PROJECT BRAND TOKENS only (tokens.css "--brand-*"); fixed semantic colours never change */
      tokens: {
        '--brand-primary': '#1d4f5c', '--brand-primary-rim': '#163f4a', '--brand-primary-hover': '#18434f',
        '--brand-primary-press': '#143a44', '--brand-primary-deep': '#123a44',
        '--brand-accent': '#2f6773', '--brand-accent-strong': '#1f4a54', '--brand-accent-link': '#2a5d68', '--brand-accent-soft': '#7fa3ab',
        '--brand-tint-50': '#eef6f7', '--brand-tint-100': '#e3eff1', '--brand-tint-100-hover': '#d6e7ea',
        '--brand-tint-150': '#e3eff1', '--brand-tint-200': '#d6e7ea', '--brand-on-tint': '#245a66', '--brand-signal': '#58b4c4',
        '--brand-nav-hover': '#f1f7f8', '--brand-nav-press': '#e6f0f2', '--brand-focus-halo': 'rgba(47, 103, 115, .35)',
        '--brand-cta': '#a9d3da', '--brand-cta-band': '#93c2ca', '--brand-cta-hover': '#9ccbd3', '--brand-cta-ink': '#06181c',
        '--brand-cta-glow': 'rgba(47, 103, 115, .28)', '--brand-cta-shadow': 'rgba(47, 103, 115, .22)', '--brand-cta-rim': '#84b5bd',
        '--brand-link-soft': '#2f6773', '--brand-link-strong': '#1f4a54', '--brand-link-rule': '#8fb1b8',
        '--brand-fill-rule': '#b9d3d8', '--brand-fill-wash': '#f7fbfb', '--brand-progress': '#5e9ea9',
        '--brand-step-done-line': '#d6e7ea', '--brand-step-done-dot': '#b5d6dc'
      }
    },

    /* QA fixture: a long application name without a logo image (mark + app-rendered name in Inter).
       Checks the step-down / ellipsis / tooltip rule of the brand slots. Never the default. */
    longname: {
      brand: {
        name: 'Perusahaan Konstruksi dan Pengadaan Nusantara Raya',
        short: 'PKP Nusantara Raya',
        company: 'PT Perusahaan Konstruksi dan Pengadaan Nusantara Raya',
        logo: null,
        mark: { src: '../img/brand/alt-mark.svg' },
        alt: 'Perusahaan Konstruksi dan Pengadaan Nusantara Raya',
        favicon: '../img/brand/alt-mark.svg',
        title: '{page} · {short}',
        display: 'name'
      }
    }
  };
  var DEFAULT = 'multiplecorp';
  var BASE = FIXTURES[DEFAULT];

  /* ---- resolve: fixture over the default (objects merge, arrays replace; brand logo / mark replace whole) */
  function merge(base, over) {
    if (!over) return base;
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    Object.keys(over).forEach(function (k) {
      var b = base[k], o = over[k];
      out[k] = b && o && typeof b === 'object' && typeof o === 'object' && !Array.isArray(b) && !Array.isArray(o) ? merge(b, o) : o;
    });
    return out;
  }
  function pick() {
    var key = null, q = null;
    try { q = new URLSearchParams(location.search); key = q.get('project') || q.get('brand'); } catch (e) { /* no URL API */ }
    try {
      if (key === 'default') { sessionStorage.removeItem('mc:project'); sessionStorage.removeItem('mc:brand'); key = null; }
      else if (key && FIXTURES[key]) sessionStorage.setItem('mc:project', key);
      else key = sessionStorage.getItem('mc:project') || sessionStorage.getItem('mc:brand');
    } catch (e) { /* storage blocked: the query alone decides */ }
    return key && FIXTURES[key] ? key : DEFAULT;
  }
  var current = pick();
  var cfg = current === DEFAULT ? BASE : merge(BASE, FIXTURES[current]);
  /* identity assets are atomic: a project's logo / mark replaces the default one whole. r7 fix: a
     project mark { src } used to inherit the default { symbol } and the MultipleCorp mark stayed. */
  if (current !== DEFAULT && FIXTURES[current].brand) ['logo', 'mark'].forEach(function (k) {
    if (k in FIXTURES[current].brand) cfg.brand[k] = FIXTURES[current].brand[k];
  });
  /* QA role preview (r10): ?role=<key> merges cfg.roleFixtures[key] for this tab; ?role=owner (or
     default) returns to the project's own user. Lab hook, not a product feature. */
  function pickRole() {
    var key = null, fx = cfg.roleFixtures || {};
    try { key = new URLSearchParams(location.search).get('role'); } catch (e) { /* no URL API */ }
    try {
      if (key && !fx[key]) { sessionStorage.removeItem('mc:role'); key = null; }
      else if (key) sessionStorage.setItem('mc:role', key);
      else key = sessionStorage.getItem('mc:role');
    } catch (e) { /* storage blocked */ }
    return key && fx[key] ? key : null;
  }
  var roleKey = pickRole();
  if (roleKey) cfg = merge(cfg, cfg.roleFixtures[roleKey]);
  /* Host / test seam (r9): window.MC_PROJECT_PATCH (an object set before this file) merges over the
     resolved project, e.g. { navigation: { mobileBack: true } }. Production configures FIXTURES. */
  if (window.MC_PROJECT_PATCH && typeof window.MC_PROJECT_PATCH === 'object') cfg = merge(cfg, window.MC_PROJECT_PATCH);
  cfg.key = current;
  cfg.roleKey = roleKey;

  var base = (document.currentScript && document.currentScript.src) || location.href;
  function asset(rel) { return rel ? new URL(rel, base).href : null; }

  /* ---- brand-level tokens: applied before first paint ----------------------------------- */
  var root = document.documentElement;
  Object.keys(cfg.tokens || {}).forEach(function (k) { root.style.setProperty(k, cfg.tokens[k]); });
  root.setAttribute('data-project', current);
  Object.keys(cfg.features).forEach(function (k) { if (!cfg.features[k]) root.setAttribute('data-no-' + k.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); }), ''); });

  /* ---- labels -------------------------------------------------------------------------- */
  function lang() { return (root.lang || cfg.locale.default || 'id').slice(0, 2) === 'en' ? 'en' : 'id'; }
  function t(label) {
    if (label == null) return '';
    if (typeof label === 'string') return label;
    return label[lang()] || label.id || label.en || '';
  }
  function role() { return cfg.user && cfg.user.role; }
  /* capability check: the Owner (capabilities 'all' or none listed) holds every capability. r12: a list
     means all of them. */
  function can(cap) {
    var caps = cfg.user && cfg.user.capabilities;
    if (Array.isArray(cap)) return cap.every(can);
    return !cap || !caps || caps === 'all' || caps.indexOf(cap) >= 0;
  }
  function allowed(entry) { return !entry || (entry.enabled !== false && (!entry.roles || entry.roles.indexOf(role()) >= 0) && can(entry.capability)); }
  function moduleOf(key) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].key === key) return MODULES[i]; return null; }
  function landing(m) { return (m.routeByRole && m.routeByRole[role()]) || m.route; }
  function navItem(key) {
    var it = CATALOGUE[key], m = moduleOf(key);
    if (!it) return treeItem(key);                                   /* r12: a tree node id (Log Keamanan, …) */
    if (m && !allowed(m)) return null;                                /* role / capability filter (r10) */
    var r = m && ROUTES[landing(m)];
    var extra = cfg.navigation.items && cfg.navigation.items[key];
    return merge({ key: key, label: m ? m.label : it.label, icon: m ? m.icon : it.icon, href: (r && r.file) || it.href || null, route: m ? landing(m) : null }, extra || null);
  }

  /* ---- navigation tree (r12) -------------------------------------------------------------------
     One resolved tree per page load (role, capabilities and route overrides are fixed by then). The
     FULL tree keeps every node with its visibility; navTree() is the rendered (role-filtered) form.
     Addresses compare after ROUTES[route].defaults, so 85 and 85?jenis=klien are the same entry. */
  var FULL = null;
  function has(list, v) { return !!list && list.indexOf(v) >= 0; }
  function presented(n) {                                             /* presentation + capability flags of one node */
    return n.enabled !== false && (!n.roles || has(n.roles, role())) && !has(n.hiddenForRoles, role()) && can(n.capability);
  }
  function openable(n) {                                              /* the account may open it (palette: hiddenForRoles ignored) */
    return n.enabled !== false && (!n.roles || has(n.roles, role())) && can(n.capability);
  }
  function eff(routeId, params) {                                     /* effective params: route defaults overlaid by the address */
    var r = ROUTES[routeId] || {}, d = r.defaults || {}, v = r.views, o = {};
    Object.keys(d).forEach(function (k) { o[k] = String(d[k]); });
    if (params) Object.keys(params).forEach(function (k) {
      if (params[k] == null || params[k] === '') return;
      /* a view value the route does not offer shows the default view (MCTabs does the same), so it marks,
         provides and covers like the default (91?tab=bukti = Riwayat Aktivitas, 86?jenis=bogus = Klien) */
      if (v && v.titles && k === v.param && !Object.prototype.hasOwnProperty.call(v.titles, String(params[k]))) return;
      o[k] = String(params[k]);
    });
    return o;
  }
  function canonical(routeId, params) {                               /* the shortest address: default values dropped */
    if (!params) return null;
    var d = (ROUTES[routeId] && ROUTES[routeId].defaults) || {}, o = {}, any = false;
    Object.keys(params).forEach(function (k) { if (params[k] != null && String(params[k]) !== String(d[k])) { o[k] = params[k]; any = true; } });
    return any ? o : null;
  }
  function nodeOf(item, level, group) {
    if (typeof item === 'string') {                                   /* legacy flat leaf: r6-r11 semantics (navItem) */
      var m0 = moduleOf(item), c = CATALOGUE[item];
      if (!c) return null;
      var over = (cfg.navigation.items && cfg.navigation.items[item]) || {};
      return { id: item, legacy: true, level: 1, module: m0 ? item : null, label: over.label || (m0 ? m0.label : c.label), icon: over.icon || (m0 ? m0.icon : c.icon),
        route: m0 ? landing(m0) : c.route, href: over.href || null, enabled: m0 ? m0.enabled : undefined, roles: m0 ? m0.roles : null, capability: m0 ? m0.capability : null };
    }
    if (!item || typeof item !== 'object') return null;
    var m = item.module ? moduleOf(item.module) : null;
    function pick(k) { return k in item ? item[k] : (m ? m[k] : undefined); }
    var n = { id: item.id || item.module, level: level, module: item.module || null, group: group ? group.id : null,
      label: item.label || (m && m.label) || null, icon: level === 1 ? (item.icon || (m && m.icon) || 'dot') : null,
      enabled: pick('enabled'), roles: pick('roles') || null, hiddenForRoles: item.hiddenForRoles || null, capability: pick('capability') || null,
      params: item.params || null, match: item.match || (group && group.match) || null };
    if (level === 1 && item.children) {
      n.children = item.children.map(function (c) { return nodeOf(c, 2, n); }).filter(Boolean);
      n.landing = item.landing || null;
    } else {
      var byRole = item.routeByRole || (!item.route && m && m.routeByRole);
      n.route = (byRole && byRole[role()]) || item.route || (m && m.route) || null;
      if (!n.label && n.route && ROUTES[n.route]) n.label = ROUTES[n.route].title;
    }
    return n;
  }
  function leafVisible(n) {
    return presented(n) && !!n.route && !!ROUTES[n.route] && (n.legacy || routeAllowed(n.route));
  }
  function full() {
    if (FULL) return FULL;
    FULL = (cfg.navigation.sidebar || []).map(function (s, si) {
      var sec = { id: s.id || null, label: s.label || null, index: si, ok: allowed(s), items: (s.items || []).map(function (it) { return nodeOf(it, 1, null); }).filter(Boolean) };
      sec.items.forEach(function (n) {
        if (n.children) {
          n.children.forEach(function (c) { c.visible = sec.ok && presented(n) && leafVisible(c); });
          n.visible = sec.ok && presented(n) && n.children.some(function (c) { return c.visible; });
        } else n.visible = sec.ok && leafVisible(n);
      });
      return sec;
    });
    return FULL;
  }
  function hrefOf(n) { return n.href || routeHref(n.route, canonical(n.route, n.params)); }
  function leafOut(n) { return { id: n.id, kind: 'leaf', level: n.level, label: n.label, icon: n.icon, module: n.module, route: n.route, params: n.params || null, href: hrefOf(n) }; }
  /* the rendered tree: [{ id, label, items: [leaf | { kind: 'group', …, landing, children: [leaf] }] }] */
  function navTree() {
    return full().map(function (s) {
      var items = s.items.filter(function (n) { return n.visible; }).map(function (n) {
        if (!n.children) return leafOut(n);
        var kids = n.children.filter(function (c) { return c.visible; });
        if (kids.length === 1) {                                     /* group of one: a flat link with the group's name */
          var one = leafOut(kids[0]);
          one.id = n.id; one.level = 1; one.label = n.label; one.icon = n.icon; one.module = n.module; one.child = kids[0].id;
          return one;
        }
        var land = kids.filter(function (c) { return c.id === n.landing; })[0] || kids[0];
        return { id: n.id, kind: 'group', level: 1, label: n.label, icon: n.icon, module: n.module, landing: land.id,
          route: land.route, params: land.params || null, href: hrefOf(land), children: kids.map(leafOut) };
      });
      return { id: s.id, label: s.label, index: s.index, items: items };
    }).filter(function (s) { return s.items.length; });
  }
  /* rendered position of every node id: { id (element that renders it), group, top } */
  function placement() {
    var map = {};
    navTree().forEach(function (s) {
      s.items.forEach(function (it) {
        map[it.id] = { id: it.id, group: it.kind === 'group' ? it.id : null, top: it.id };
        if (it.child) map[it.child] = { id: it.id, group: null, top: it.id };
        (it.children || []).forEach(function (c) { map[c.id] = { id: c.id, group: it.id, top: it.id }; });
      });
    });
    return map;
  }
  function leaves() {                                                 /* every leaf of the full tree, visible or not */
    var out = [];
    full().forEach(function (s) {
      s.items.forEach(function (n) {
        if (n.children) n.children.forEach(function (c) { out.push({ node: c, parent: n, section: s }); });
        else out.push({ node: n, parent: null, section: s });
      });
    });
    return out;
  }
  function hit(n, routeId, params) {                                  /* the node's effective params are a subset of the address */
    if (n.route !== routeId) return -1;
    if (n.legacy) return 0;                                           /* a module leaf stands for every view of its landing */
    var a = eff(routeId, n.params), b = eff(routeId, params), ks = Object.keys(a);
    for (var i = 0; i < ks.length; i++) if (a[ks[i]] !== b[ks[i]]) return -1;
    return ks.length;
  }
  function same(n, routeId, params) {                                 /* the node opens exactly this address */
    if (n.route !== routeId) return false;
    var a = eff(routeId, n.params), b = eff(routeId, params), ks = Object.keys(a).concat(Object.keys(b));
    return ks.every(function (k) { return a[k] === b[k]; });
  }
  function shows(n, routeId, params) {                                /* the node shows this address: its params (defaults included) agree; other keys (filters, QA) are ignored */
    if (n.route !== routeId) return false;
    var a = eff(routeId, n.params), b = eff(routeId, params);
    return Object.keys(a).every(function (k) { return a[k] === b[k]; });
  }
  function query() {
    var o = {};
    try { new URLSearchParams(location.search).forEach(function (v, k) { o[k] = v; }); } catch (e) { /* no URL API */ }
    return o;
  }
  /* Where the address sits in the role's navigation (canonical §6.1: the current entry is marked):
     1. exact: the leaf whose route + params match (most matching params wins)           kind 'page'
     2. else the first leaf on the ROUTES.parent walk, carrying the params its `match` names  kind 'true'
     3. a leaf hidden for the role hands the mark to its visible group header
     4. else the level-1 node of the route's module; 5. else nothing (system / account pages).
     A route the role cannot open is current only when its own navigation lists it (a role whose
     Beranda is an Owner-only page, the portability fixture). Returns { id (the element that carries the
     mark), kind, groupId, topId, entry (the matched node, visible or not), exact (step 1) }. */
  function navCurrent(routeId, params) {
    if (routeId === undefined) { var cr = currentRoute(); routeId = cr && cr.id; params = query(); }
    if (!routeId || !ROUTES[routeId]) return null;
    params = params || {};
    var all = leaves(), place = placement(), best = null, score = -1, kind = 'page', exact = false;
    all.forEach(function (l) { var s = hit(l.node, routeId, params); if (s > score) { best = l; score = s; } });
    if (best && !routeAllowed(routeId) && !best.node.visible) best = null;
    exact = !!best;
    if (!best) {
      if (!routeAllowed(routeId)) return null;
      kind = 'true';
      var seen = {}, id = ROUTES[routeId].parent;
      while (id && ROUTES[id] && !seen[id] && !best) {
        seen[id] = 1;
        all.forEach(function (l) {
          var carried = {};
          (l.node.match || []).forEach(function (k) { if (params[k] != null) carried[k] = params[k]; });
          var s = hit(l.node, id, carried); if (s > score) { best = l; score = s; }
        });
        id = ROUTES[id].parent;
      }
    }
    var at = best && (place[best.node.id] || (best.parent && place[best.parent.id]));
    if (at && !place[best.node.id]) kind = 'true';                   /* hidden for the role: its group header */
    if (!at) {
      var mod = ROUTES[routeId].module;
      Object.keys(place).forEach(function (k) { var p = place[k]; if (!at && p.id === p.top && (k === mod || moduleIdOf(k) === mod)) at = p; });
      kind = 'true';
    }
    return at ? { id: at.id, kind: kind, groupId: at.group, topId: at.top, entry: best ? best.node.id : null, exact: exact } : null;
  }
  function moduleIdOf(id) {
    var m = null;
    full().forEach(function (s) { s.items.forEach(function (n) { if (n.id === id) m = n.module; }); });
    return m;
  }
  function renderedLeaves() {
    var out = [];
    navTree().forEach(function (s) { s.items.forEach(function (it) { if (it.kind === 'group') out = out.concat(it.children); else out.push(it); }); });
    return out;
  }
  /* a visible entry of the role's navigation opens exactly this address (generic duplicate suppression) */
  function navProvides(routeId, params) {
    return renderedLeaves().some(function (l) { return same(l, routeId, params || {}); });
  }
  /* every value of a view param is its own visible entry (the tab row is module navigation then) */
  function navCovers(routeId, param, values) {
    return !!values && values.length > 0 && values.every(function (v) { var p = {}; p[param] = v; return navProvides(routeId, p); });
  }
  /* every leaf the account may open, for the command palette: "Grup › Label", hiddenForRoles ignored.
     here: the entry shows the current address (compared after defaults, so a module leaf on another
     view of its landing is NOT here and the palette still offers it) */
  function navIndex() {
    var out = [], cr = currentRoute(), q = cr ? query() : null;
    function entry(n, group) {
      return { id: n.id, label: n.label, group: group ? group.label : null, title: group ? t(group.label) + ' › ' + t(n.label) : t(n.label), icon: group ? group.icon : n.icon,
        route: n.route, params: n.params || null, href: hrefOf(n), here: !!cr && shows(n, cr.id, q) };
    }
    full().forEach(function (s) {
      if (!s.ok) return;
      s.items.forEach(function (n) {
        if (!n.children) {
          if (openable(n) && n.route && ROUTES[n.route] && (n.legacy || routeAllowed(n.route))) out.push(entry(n, null));
          return;
        }
        if (!openable(n)) return;
        n.children.forEach(function (c) {
          if (openable(c) && c.route && ROUTES[c.route] && routeAllowed(c.route)) out.push(entry(c, n));
        });
      });
    });
    return out;
  }
  /* phone bottom bar: navigation.bottom (one list, or keyed by role) of visible level-1 nodes */
  function bottomItems() {
    if (cfg.features.bottomNav === false) return [];
    var b = cfg.navigation.bottom || [], keys = Array.isArray(b) ? b : (b[role()] || b['default'] || []);
    var tops = {};
    navTree().forEach(function (s) { s.items.forEach(function (it) { tops[it.id] = it; }); });
    return keys.map(function (k) {
      var it = tops[k], m = moduleOf(k);
      if (m && m.bottomNav === false) return null;
      if (!it) {                                                      /* a module outside the sidebar (r6 fixtures) */
        var leg = m && navItem(k);
        return leg && leg.href ? { key: k, label: leg.label, icon: leg.icon, href: leg.href, route: leg.route, params: null, landing: k } : null;
      }
      return { key: it.id, label: it.label, icon: it.icon, href: it.href, route: it.route, params: it.params, landing: it.kind === 'group' ? it.landing : it.id };
    }).filter(Boolean).slice(0, 5);
  }
  function treeItem(id) {
    var found = null;
    navTree().forEach(function (s) {
      s.items.forEach(function (it) { [it].concat(it.children || []).forEach(function (x) { if (!found && x.id === id) found = x; }); });
    });
    return found ? { key: found.id, label: found.label, icon: found.icon || null, href: found.href, route: found.route } : null;
  }
  /* r6 API, derived from the tree: flat level-1 items (a group's href = its landing child) */
  function sidebarGroups() {
    return navTree().map(function (s) {
      return { id: s.id || null, label: s.label || null, items: s.items.map(function (it) { return { key: it.id, label: it.label, icon: it.icon, href: it.href, route: it.route }; }) };
    });
  }
  function bottomKeys() { return bottomItems().map(function (i) { return i.key; }); }
  /* the role's Beranda: navigation.home (a module key or node id), else the first level-1 leaf */
  function home() {
    var k = cfg.navigation.home, it = k ? navItem(k) : null;
    if (it) return it;
    var first = null;
    navTree().forEach(function (s) { s.items.forEach(function (x) { if (!first && x.kind !== 'group') first = x; }); });
    return first ? { key: first.id, label: first.label, icon: first.icon, href: first.href, route: first.route } : null;
  }
  function accountMenu() {
    var list = (cfg.account.menu || []).map(function (m) {
      if (!m.route || m.href || !ROUTES[m.route]) return m;
      var o = {}; Object.keys(m).forEach(function (k) { o[k] = m[k]; }); o.href = ROUTES[m.route].file; return o;
    }).filter(function (m) {
      if (!allowed(m)) return false;
      if (m.action === 'shortcuts' && !cfg.features.shortcuts) return false;
      if (m.action === 'logout' && cfg.account.logout && cfg.account.logout.enabled === false) return false;
      return true;
    });
    /* no leading, trailing or doubled separators after filtering */
    return list.filter(function (m, i) {
      if (!m.separator) return true;
      var prev = list[i - 1], next = list[i + 1];
      return prev && next && !prev.separator && !next.separator;
    });
  }

  /* ---- time ---------------------------------------------------------------------------- */
  /* Test / host seam: window.MC_TIME_NOW (a function or a date string) set before this file runs
     replaces the clock; MCTime.setNowProvider(fn) does the same at run time. */
  var injected = window.MC_TIME_NOW;
  var nowProvider = typeof cfg.time.now === 'function' ? cfg.time.now
    : typeof injected === 'function' ? injected
    : injected ? function () { return new Date(injected); } : null;
  var zone = cfg.time.zone || 'Asia/Jakarta';
  var partsFmt = null;
  function parts(date) {
    var d = date || now();
    try {
      partsFmt = partsFmt || new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
      var o = {};
      partsFmt.formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
      return { year: +o.year, month: +o.month, day: +o.day, hour: +o.hour % 24, minute: +o.minute };
    } catch (e) {
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: d.getHours(), minute: d.getMinutes() };
    }
  }
  function now() { var v = nowProvider ? nowProvider() : new Date(); return v instanceof Date ? v : new Date(v); }
  function band(hour) {
    var h = hour == null ? parts().hour : hour;
    var bands = cfg.time.bands;
    for (var i = 0; i < bands.length; i++) {
      var b = bands[i];
      if (b.from < b.to ? (h >= b.from && h < b.to) : (h >= b.from || h < b.to)) return b;
    }
    return bands[bands.length - 1];
  }
  function greeting(lng, name) {
    var b = band(), table = cfg.time.greetings[lng || lang()] || cfg.time.greetings.id;
    var word = table[b.id] || '';
    return name ? word + ', ' + name : word;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  window.MCTime = {
    get zone() { return zone; },
    get locale() { return lang() === 'en' ? 'en-GB' : 'id-ID'; },
    get injected() { return !!nowProvider; },
    now: now,
    setNowProvider: function (fn) {
      nowProvider = typeof fn === 'function' ? fn : null;
      try { document.dispatchEvent(new CustomEvent('mc:timechange')); } catch (e) { /* old engines */ }
    },
    parts: parts,
    band: band,
    greeting: greeting,
    today: function () { var p = parts(); return p.year + '-' + pad(p.month) + '-' + pad(p.day); }
  };

  /* One clock for the page (r7): at every minute boundary, if the greeting band or the calendar day
     changed, 'mc:timechange' tells every current-date concept (greeting, date presets, period labels)
     to follow. A fixed injected time never changes, so tests stay deterministic. */
  (function tick() {
    var key = function () { return band().id + '|' + window.MCTime.today(); }, last = null;
    function step() {
      var k = key();
      if (last !== null && k !== last) { try { document.dispatchEvent(new CustomEvent('mc:timechange')); } catch (e) { /* old engines */ } }
      last = k;
      setTimeout(step, 60000 - Date.now() % 60000 + 50);
    }
    step();
  })();

  /* ---- brand (r5 API, unchanged) ---------------------------------------------------------- */
  var b = cfg.brand;
  var brand = {
    key: current,
    name: b.name,
    short: b.short || b.name,
    company: b.company || b.name,
    logo: b.logo ? { src: asset(b.logo.src), width: b.logo.width, height: b.logo.height } : null,
    mark: { symbol: b.mark && b.mark.symbol, src: asset(b.mark && b.mark.src) },
    alt: b.alt || b.name,
    favicon: asset(b.favicon),
    title: b.title || '{page} · {name}',
    display: b.display === 'short' ? 'short' : 'name'
  };

  function fill(text, extra) {
    var map = { name: brand.name, short: brand.short, company: brand.company };
    if (extra) Object.keys(extra).forEach(function (k) { map[k] = extra[k]; });
    return String(text).replace(/\{([A-Za-z]+)\}/g, function (m, k) {   /* unknown placeholders stay as written */
      if (k === 'brand') k = 'name';
      return map[k] != null ? map[k] : m;
    });
  }
  function each(scope, sel, fn) { Array.prototype.forEach.call(scope.querySelectorAll(sel), fn); }

  /* A name that does not fit its slot first steps down one size, then ellipsises with the full
     name as a tooltip (the slot's link keeps the full accessible name). */
  function fit(scope) {
    each(scope, '[data-brand-name]', function (el) {
      el.classList.remove('is-long');
      el.removeAttribute('title');
      if (!el.clientWidth) return;
      if (el.scrollWidth > el.clientWidth + 1) el.classList.add('is-long');
      if (el.scrollWidth > el.clientWidth + 1) el.setAttribute('title', el.textContent);
    });
  }

  function apply(scope) {
    scope = scope || document;
    each(scope, '[data-brand-name]', function (el) { el.textContent = brand.display === 'short' ? brand.short : brand.name; });
    each(scope, '[data-brand-company]', function (el) { el.textContent = brand.company; });
    each(scope, '[data-brand-label]', function (el) { el.setAttribute('aria-label', fill(el.getAttribute('data-brand-label'))); });
    if (!brand.mark.symbol && brand.mark.src) {
      each(scope, 'svg[data-brand-mark]', function (svg) {
        var img = document.createElement('img');
        img.className = svg.getAttribute('class') || '';
        img.classList.add('is-image');
        img.setAttribute('data-brand-mark', '');
        img.src = brand.mark.src;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        svg.replaceWith(img);
      });
    }
    each(scope, '[data-brand]', function (slot) {
      var img = slot.querySelector(':scope > .mc-brand__logo');
      if (brand.logo) {
        if (!img) {
          img = document.createElement('img');
          img.className = 'mc-brand__logo';
          img.decoding = 'async';
          var mark = slot.querySelector(':scope > [data-brand-mark]');
          slot.insertBefore(img, mark ? mark.nextSibling : slot.firstChild);
        }
        img.src = brand.logo.src;
        if (brand.logo.width) { img.width = brand.logo.width; img.height = brand.logo.height; }
        img.alt = slot.closest('[aria-label]') ? '' : brand.alt;   /* a labelled slot already names the brand */
        slot.classList.add('has-logo');
      } else {
        if (img) img.remove();
        slot.classList.remove('has-logo');
      }
    });
    if (scope === document) {
      var title = document.querySelector('title[data-page]');
      if (title) document.title = fill(brand.title, { page: title.getAttribute('data-page') });
      each(document, 'link[data-brand-favicon]', function (l) { if (brand.favicon) l.href = brand.favicon; });
      root.setAttribute('data-brand-key', brand.key);
    }
    fit(scope);
  }

  /* ---- module + route overrides (r10): a project fixture may set modules: { key: { enabled: false } } */
  if (cfg.modules && !Array.isArray(cfg.modules)) MODULES = MODULES.map(function (m) { return cfg.modules[m.key] ? merge(m, cfg.modules[m.key]) : m; });
  /* ---- routes (r10) ------------------------------------------------------------------------ */
  if (cfg.routes) Object.keys(cfg.routes).forEach(function (id) { ROUTES[id] = cfg.routes[id] ? merge(ROUTES[id] || {}, cfg.routes[id]) : undefined; if (!ROUTES[id]) delete ROUTES[id]; });
  /* r13 (persistent shell, D-52): the current page file is read from the address on every call, never
     captured once per document. Over HTTP the router (assets/js/router.js) changes the address with
     history.pushState and swaps the page in place, so currentRoute(), MCRoutes.file, navCurrent() and the
     palette index must follow the live address. On file:// every page is its own document (same result). */
  function pageFile() {
    try { return decodeURIComponent(location.pathname.split('/').pop() || ''); } catch (e) { return ''; }   /* malformed path */
  }
  function routeEntry(id) {
    var r = ROUTES[id];
    if (!r) return null;
    var o = { id: id };
    Object.keys(r).forEach(function (k) { o[k] = r[k]; });
    o.label = t(r.title);
    return o;
  }
  function routeAllowed(id) { var r = ROUTES[id]; return !!r && allowed(r) && (!r.module || !moduleOf(r.module) || allowed(moduleOf(r.module))); }
  /* r13 Phase 7 (IP-21 / AZ-11): why a route is refused. 'forbidden' = the screen belongs to this role's application
     (role and module allowed) but the route's own capability is missing -> MSG-10, nothing of the record; anything
     else (unknown route, another role's screen, a module the account cannot open) -> 'notfound' (MSG-09), so an address
     never reveals what exists. A FRONTEND courtesy only: the backend enforces every capability, scope and transition. */
  function routeDenial(id) {
    var r = ROUTES[id];
    if (!r || routeAllowed(id)) return r ? null : 'notfound';
    var roleOk = r.enabled !== false && (!r.roles || r.roles.indexOf(role()) >= 0);
    var modOk = !r.module || !moduleOf(r.module) || allowed(moduleOf(r.module));
    return roleOk && modOk && r.capability && !can(r.capability) ? 'forbidden' : 'notfound';
  }
  function routeHref(id, params) {
    var r = ROUTES[id];
    if (!r) return null;
    var q = [];
    if (params) Object.keys(params).forEach(function (k) {
      if (params[k] != null && params[k] !== '') q.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
    });
    return r.file + (q.length ? '?' + q.join('&') : '');
  }
  function currentRoute() {
    var f = pageFile();
    for (var id in ROUTES) if (ROUTES[id].file === f) return routeEntry(id);
    return null;
  }
  function param(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }
  function trail(id) {
    var out = [], seen = {};
    while (id && ROUTES[id] && !seen[id]) { seen[id] = 1; out.unshift(routeEntry(id)); id = ROUTES[id].parent; }
    return out;
  }
  window.MCRoutes = {
    all: function () { return Object.keys(ROUTES).map(routeEntry); },
    get: routeEntry,
    href: routeHref,
    allowed: routeAllowed,
    denial: routeDenial,
    current: currentRoute,
    param: param,
    trail: trail,
    get file() { return pageFile(); },                               /* r13: live (persistent shell) */
    /* r13: the route registered for a page file (the router's eligibility check; null when unknown) */
    byFile: function (file) { for (var id in ROUTES) if (ROUTES[id].file === file) return routeEntry(id); return null; },
    modules: function () { return MODULES.filter(function (m) { return allowed(m); }).map(function (m) { return { key: m.key, label: t(m.label), icon: m.icon, route: landing(m), extra: !!m.extra }; }); },
    module: function (key) { var m = moduleOf(key); return m ? { key: m.key, label: t(m.label), icon: m.icon, route: landing(m) } : null; },
    /* r12: the title of a route view (ROUTES[id].views), e.g. view('master.home', 'pemasok') = 'Pemasok' */
    view: function (id, value) {
      var v = ROUTES[id] && ROUTES[id].views;
      if (!v || !v.titles) return null;
      if (value == null) value = (ROUTES[id].defaults || {})[v.param];
      return v.titles[value] ? { param: v.param, value: value, title: t(v.titles[value]) } : null;
    }
  };

  window.MC_PROJECT = cfg;
  window.MC_BRAND = brand;
  window.MCBrand = {
    get current() { return brand.key; },
    fixtures: Object.keys(FIXTURES),
    fill: fill,
    title: function (page) { return fill(brand.title, { page: page }); },
    apply: apply,
    fit: fit
  };
  window.MCProject = {
    get key() { return current; },
    fixtures: Object.keys(FIXTURES),
    config: cfg,
    catalogue: CATALOGUE,
    lang: lang,
    t: t,
    feature: function (name) { return cfg.features[name] !== false; },
    navItem: navItem,
    sidebarGroups: sidebarGroups,
    bottomKeys: bottomKeys,
    /* r12: the hierarchical navigation (one tree: sidebar, icon rail, drawer, bottom bar, palette) */
    navTree: navTree,
    navCurrent: navCurrent,
    bottomItems: bottomItems,
    navIndex: navIndex,
    navProvides: navProvides,
    navCovers: navCovers,
    home: home,
    accountMenu: accountMenu,
    allowed: allowed,
    can: can,
    get role() { return role(); },
    get roleKey() { return roleKey; },
    modules: MODULES,
    routes: ROUTES
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { apply(document); });
  else apply(document);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(document); });
})();
