/* =============================================================================
   EXAMPLE project configuration for a NEW project adopting the Golden Reference template.
   Copy the shape of assets/js/project-config.js and replace the parts below (no MULTIPLECORP
   business data here). Everything not listed keeps the Golden default.
   Steps: docs/TEMPLATE_ADOPTION_GUIDE.md. Contract: docs/PORTABILITY_CONTRACT.md.
   Navigation (r12): docs/NAVIGATION_ARCHITECTURE.md (schema §8, "when not to nest" §12).
   Golden Frontend Reference v1: start at docs/GOLDEN_FRONTEND_V1_START_HERE.md. A working generic consumer (brand, user,
   route, navigation, account, help, tokens set through the host seam window.MC_PROJECT_PATCH, no MULTIPLECORP data):
   examples/consumer-demo/ (demo-config.js). Production adoption copies assets/js/project-config.js and replaces the
   ROUTES / MODULES / FIXTURES blocks with the shapes below.
   ============================================================================= */

/* 1. Routes: one entry per screen. file = page in pages/; parent = the TRUE hierarchical parent
      (breadcrumbs, the navigation's "current" walk); roles = ACCESS (other roles get the not-found
      page). Scaffold each page with:
        python tools/shell_sync.py --new <route-id> --module <module>
      Route kinds (docs/NAVIGATION_ARCHITECTURE.md §2):
        module landing / sibling destination -> may be a navigation entry
        detail / task (create flow, form)    -> NEVER an entry; parent = the list it belongs to, so the
                                                list's entry is marked aria-current="true" there
        system / account                     -> never an entry (account menu, not-found, sign-in)      */
var ROUTES = {
  'auth.login':       { file: '01-login.html', title: L('Masuk', 'Sign in'), group: 'auth', archetype: 'auth', shell: false },
  'home':             { file: '02-home.html', title: L('Beranda', 'Home'), module: 'beranda', group: 'core', archetype: 'dashboard' },
  /* a module with two persistent destinations: Pesanan (landing) + Penawaran (a sibling: parent null,
     so it shows no breadcrumb to Pesanan; the open "Pesanan ▸" group already says where you are) */
  'orders.list':      { file: '10-orders.html', title: L('Pesanan', 'Orders'), module: 'orders', group: 'orders', archetype: 'list' },
  'orders.detail':    { file: '11-order-detail.html', title: L('Detail Pesanan', 'Order'), module: 'orders', group: 'orders', archetype: 'detail', parent: 'orders.list', params: ['id'] },
  'orders.form':      { file: '12-order-new.html', title: L('Buat Pesanan', 'New order'), module: 'orders', group: 'orders', archetype: 'form', parent: 'orders.list' },
  'quotes.list':      { file: '13-quotes.html', title: L('Penawaran', 'Quotations'), module: 'orders', group: 'orders', archetype: 'list', parent: null },
  'stock.list':       { file: '30-stock.html', title: L('Stok', 'Stock'), module: 'stock', group: 'warehouse', archetype: 'list' },
  /* r13 Phase 7: a COMMAND screen names its audience capability; without it MCPage.guard answers MSG-10 (forbidden) */
  'stock.receive':    { file: '32-receive.html', title: L('Barang Masuk', 'Goods receipt'), module: 'stock', group: 'warehouse', archetype: 'task', parent: null, capability: 'stock.receive' },
  'stock.history':    { file: '34-stock-history.html', title: L('Riwayat Stok', 'Stock history'), module: 'stock', group: 'warehouse', archetype: 'list', parent: null },
  /* one route, several navigation entries: ?jenis= selects a VIEW (defaults = the address without the
     param; views.titles = the h1 / <title> per view; MCTabs shows no tab row when every view is an entry) */
  'master.home':      { file: '85-master.html', title: L('Data Master', 'Master data'), module: 'master', group: 'master', archetype: 'list',
                        defaults: { jenis: 'customer' },
                        views: { param: 'jenis', titles: { customer: L('Pelanggan', 'Customers'), supplier: L('Pemasok', 'Suppliers') } } },
  'master.detail':    { file: '86-master-detail.html', title: L('Detail Data Master', 'Master record'), module: 'master', group: 'master', archetype: 'detail', parent: 'master.home', params: ['jenis', 'id'] },
  'review.home':      { file: '90-review.html', title: L('Tinjauan Owner', 'Owner review'), module: 'review', group: 'review', archetype: 'review', roles: ['owner'] },
  'settings.home':    { file: '95-settings.html', title: L('Perusahaan', 'Company'), module: 'settings', group: 'settings', archetype: 'settings', roles: ['owner'] },
  'settings.users':   { file: '96-users.html', title: L('Pengguna & Akses', 'Users & access'), module: 'settings', group: 'settings', archetype: 'settings', parent: null, roles: ['owner'] },
  'account':          { file: '99-account.html', title: L('Akun Saya', 'My account'), group: 'account', archetype: 'settings' },
  'system.not-found': { file: '00-not-found.html', title: L('Halaman tidak ditemukan', 'Page not found'), group: 'system', archetype: 'system' }
};

/* 2. Modules: the areas (label, icon from assets/js/icons.js, landing route). capability = a HINT for
      the UI (the server decides); roles = audience; bottomNav: false keeps a module off the phone bar. */
var MODULES = [
  { key: 'beranda',  label: L('Beranda', 'Home'), icon: 'home', route: 'home' },
  { key: 'orders',   label: L('Pesanan', 'Orders'), icon: 'cart', route: 'orders.list', capability: 'orders.view' },
  { key: 'stock',    label: L('Gudang', 'Warehouse'), icon: 'warehouse', route: 'stock.list', capability: 'stock.view' },
  { key: 'master',   label: L('Data Master', 'Master data'), icon: 'database', route: 'master.home', bottomNav: false },
  { key: 'review',   label: L('Tinjauan Owner', 'Owner review'), icon: 'shield-check', route: 'review.home', roles: ['owner'], bottomNav: false },
  { key: 'settings', label: L('Pengaturan', 'Settings'), icon: 'sliders', route: 'settings.home', roles: ['owner'], bottomNav: false }
];

/* 3. The project fixture (FIXTURES.<key>): brand, locale, time, user, navigation, account, ... */
var EXAMPLE_PROJECT = {
  brand: {
    name: 'Contoh Aplikasi', short: 'Contoh', company: 'PT Contoh Perusahaan',
    logo: null,                                         /* { src, width, height } for a full logo */
    mark: { src: '../img/brand/example-mark.svg' },
    alt: 'Contoh Aplikasi', favicon: '../img/brand/example-mark.svg',
    title: '{page} · {short}', display: 'name'
  },
  locale: { default: 'id', secondary: 'en' },
  time: { zone: 'Asia/Jakarta' },                       /* production: provide server time via time.now */
  user: { id: 'u-1', name: 'Nama Pengguna', initials: 'NP', role: 'owner', roleLabel: L('Owner'), email: 'nama@contoh.example', companies: 'all', capabilities: 'all' },
  roleFixtures: {                                       /* QA only: ?role=staff (never a navigation override) */
    staff: { user: { id: 'u-2', name: 'Staf Contoh', initials: 'SC', role: 'staff', roleLabel: L('Staf'), companies: ['C1'],
      capabilities: ['orders.view', 'stock.view', 'stock.receive'] } }
  },
  /* r12 navigation: ONE tree for the sidebar, the icon rail, the drawer and the palette; max two levels.
       Section = { id?, label? (a heading, not a level), roles?, items }
       item    = 'moduleKey' (a flat leaf, the r6-r11 form; enough for a one-screen area)
               | { id, module?, label?, icon?, route? | children?, params?, match?, roles?, hiddenForRoles?, capability? }
       child   = { id, label, route, params?, roles?, hiddenForRoles?, capability? }   (no icon, no children)
     A group header only opens / closes (never navigates); its first visible child is the landing; a group
     with one visible child renders as a flat link. Visibility (docs/PORTABILITY_CONTRACT.md §2.5):
       ROUTES.roles = ACCESS · roles / hiddenForRoles = PRESENTATION (palette keeps the entry) · capability = HINT
     Never add detail / task routes (orders.detail, orders.form, master.detail) or a screen that does not exist. */
  navigation: {
    home: 'beranda',                                    /* the brand / not-found "Beranda" entry */
    sidebar: [
      { items: [
        'beranda',
        { id: 'orders', module: 'orders', children: [   /* label, icon, capability from MODULES.orders */
          { id: 'orders-list', label: L('Daftar Pesanan', 'Orders'), route: 'orders.list' },   /* landing */
          { id: 'quotes', label: L('Penawaran', 'Quotations'), route: 'quotes.list' }
        ] },
        { id: 'stock', module: 'stock', children: [
          { id: 'stock-list', label: L('Stok', 'Stock'), route: 'stock.list' },
          /* capability: only accounts that can receive see it; hiddenForRoles: the Owner holds the
             capability but keeps an oversight menu (he still reaches it from context and the palette) */
          { id: 'stock-receive', label: L('Barang Masuk', 'Goods receipt'), route: 'stock.receive', capability: 'stock.receive', hiddenForRoles: ['owner'] },
          { id: 'stock-history', label: L('Riwayat Stok', 'Stock history'), route: 'stock.history' }
        ] },
        /* one entry per view of master.home; match: a record of a kind (86?jenis=supplier) marks its kind */
        { id: 'master', module: 'master', match: ['jenis'], children: [
          { id: 'customers', label: L('Pelanggan', 'Customers'), route: 'master.home', params: { jenis: 'customer' } },
          { id: 'suppliers', label: L('Pemasok', 'Suppliers'), route: 'master.home', params: { jenis: 'supplier' } }
        ] }
      ] },
      /* a role-only section: absent for other roles (their addresses answer not-found through ROUTES.roles) */
      { id: 'owner', label: L('Khusus Owner', 'Owner only'), roles: ['owner'], items: [
        'review',
        { id: 'settings', module: 'settings', children: [
          { id: 'company', label: L('Perusahaan', 'Company'), route: 'settings.home' },
          { id: 'users', label: L('Pengguna & Akses', 'Users & access'), route: 'settings.users' }
        ] }
      ] }
    ],
    /* phone bottom bar: <= 5 visible level-1 ids; a group opens its landing child. An array = the same
       bar for every role; keyed by role when the most frequent destination differs (default = the rest). */
    bottom: { default: ['beranda', 'orders', 'stock'], staff: ['beranda', 'stock', 'orders'] },
    mobileBack: false
  },
  mobileDisclosure: {},                                 /* data-disclosure key -> 'open' | 'collapsed' */
  account: {
    menu: [
      { id: 'profile', label: L('Akun Saya', 'My account'), icon: 'user', route: 'account' },
      { id: 'shortcuts', label: L('Pintasan keyboard', 'Keyboard shortcuts'), icon: 'keyboard', action: 'shortcuts', pointer: 'fine' },
      { separator: true },
      { id: 'logout', label: L('Keluar', 'Sign out'), icon: 'logout', action: 'logout', tone: 'danger' }
    ],
    logout: { enabled: true, confirm: true, redirect: '01-login.html?signedout=1' },
    adminLabel: L('Owner')
  },
  dateFilter: { presets: ['today', 'last7', 'thisMonth', 'lastMonth', 'custom'], default: 'thisMonth', min: 'startOfYear-1', max: 'endOfYear' },
  /* r13 Phase 6: guided work (docs/GUIDED_WORKFLOW.md). Steps point at REAL controls; an absent target is skipped. */
  help: {
    defaultLevel: 'terpandu',
    tours: {
      'first-order': { title: L('Membuat pesanan'), capability: 'orders.manage', steps: [
        { route: 'home', href: '02-home.html', target: '[data-guide="resume"]', title: 'Mulai dari sini', body: 'Pekerjaan yang bisa dilanjutkan ada di sini.' },
        { route: 'orders.form', href: '12-order-new.html', target: '.pt-compose__work .mc-flow', title: 'Kerjakan per tahap', body: 'Berpindah tahap tidak menyimpan dan tidak menerbitkan.' }
      ] }
    },
    screens: { 'orders.list': { howItWorks: ['Klik sebuah baris untuk membuka pesanannya.'] } }
  },
  features: { search: true, shortcuts: true, authVisual: true, dateFilter: true, bottomNav: true },
  tokens: {                                             /* ONLY --brand-* tokens (tokens.css) */
    '--brand-primary': '#1d4f5c', '--brand-accent': '#2f6773', '--brand-tint-100': '#e3eff1'
  }
};

/* 4. Business fixture (Layer C): window.MC_DATA-like data for the prototype, in
      assets/js/fixtures/<project>-data.js, plus a status registry { STATE: { label, tone, live } }.
      Module pages read it through a small domain helper (assets/js/modules/domain.js pattern).
   5. Check the navigation: python tools/shell_sync.py, python tools/route_check.py,
      python tools/nav_audit.py, and node tools/export_config.js <project> <role> (tree, current,
      bottomItems) for every role.                                                                    */

function L(id, en) { return { id: id, en: en || id }; }
