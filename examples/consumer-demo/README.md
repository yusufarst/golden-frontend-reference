# Consumer demo — Golden Frontend Reference v1 portability smoke test

A minimal, generic page ("Toko Contoh", 23 sample orders) built only from the shared Golden files:
`assets/css/{tokens,base,components,patterns,motion}.css`, `assets/js/{project-config,icons,patterns,guide,interactions}.js`.
It loads NO MULTIPLECORP fixture, domain helper or business module.

| File | Role |
|---|---|
| `index.html` | page shell (sidebar, app bar, bottom-nav container, main) + the three cards |
| `demo-config.js` | brand, user, route, navigation, account, help, tokens via `window.MC_PROJECT_PATCH` (set before `project-config.js`) |
| `demo.js` | sample data + `MCList`/`MCPager` (numbered, 10 per page), `MCUI.pill` (status), `MCStepper`, `MCChecks`, `MCBizDate`, `MCDialog`, `MCResult` |

Open `index.html` directly (file://). Smoke test: `python tools/golden_consumer_smoke.py evidence/final/r13/golden-v1`.
`MC_PROJECT_PATCH` is the demo shortcut; a real project copies `assets/js/project-config.js` and replaces its ROUTES /
MODULES / FIXTURES (see `docs/GOLDEN_FRONTEND_V1_START_HERE.md` §4).
