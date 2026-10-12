/* Golden Frontend Reference v1 - consumer demo configuration (generic, NOT MULTIPLECORP).
   Set BEFORE assets/js/project-config.js: the supported host seam window.MC_PROJECT_PATCH merges over the Golden
   default project. A real adopting project copies assets/js/project-config.js and replaces its ROUTES / MODULES /
   FIXTURES (docs/TEMPLATE_ADOPTION_GUIDE.md); this demo proves the shared runtime works with a foreign brand, user,
   routes and navigation WITHOUT any MULTIPLECORP fixture or business module. */
window.MC_PROJECT_PATCH = {
  brand: { name: 'Toko Contoh', short: 'Toko Contoh', company: 'Toko Contoh', logo: null, mark: { symbol: 'i-box', src: null }, alt: 'Toko Contoh', favicon: null, title: '{page} · {name}', display: 'name' },
  user: { id: 'u-demo', name: 'Rina', initials: 'R', role: 'owner', roleLabel: 'Pemilik', email: 'rina@toko-contoh.example', companies: 'all', capabilities: 'all' },
  roleFixtures: {},
  tokens: { '--brand-primary': '#1d4f5c', '--brand-accent': '#2f6773', '--brand-tint-100': '#e3eff1' },
  routes: {
    'demo.home': { file: 'index.html', title: 'Pesanan', module: 'beranda', group: 'core', archetype: 'list' }
  },
  /* the Golden module catalogue is reused by key; a project relabels / re-routes what it needs */
  modules: { beranda: { label: 'Pesanan', icon: 'cart', route: 'demo.home' } },
  navigation: {
    home: 'beranda',
    sidebar: [{ items: ['beranda'] }],
    bottom: ['beranda']
  },
  account: {
    menu: [{ id: 'logout', label: 'Keluar', icon: 'logout', action: 'logout', tone: 'danger' }],
    logout: { enabled: true, confirm: true, redirect: 'index.html' },
    adminLabel: 'Pemilik'
  },
  help: { defaultLevel: 'terpandu', tours: {}, screens: {} },
  features: { search: false, shortcuts: false, authVisual: false, dateFilter: false, bottomNav: true }
};
