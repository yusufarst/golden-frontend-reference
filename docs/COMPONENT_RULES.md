# MULTIPLECORP Component Rules — Golden Reference r9

Status: FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL. Project-specific values (brand, roles,
navigation, account entries, presets, features, tokens) come from `assets/js/project-config.js`
(`docs/PORTABILITY_CONTRACT.md`); the rules below are the fixed Golden layer.

Classes live in `assets/css/components.css` (section numbers in brackets); behaviour in
`assets/js/interactions.js`; tokens in `assets/css/tokens.css`. Sizes: **D** = desktop
(≥ 1200 px, REF geometry at the 1448 × 1086 canvas; runtime fit in the next section), **T** = tablet (768–1199), **P** = phone (≤ 767). Every phone target is
≥ 44 × 44 px. Motion details: `docs/MOTION_SYSTEM.md`.

---

## Viewport fit and desktop density (r4, r6 at browser zoom 100 %)

r6: every desktop length below carries `--density-scale` (.9) through `--du`; fixed text above 12 px
follows `--tu` (.92–.96) and icons `--iu`; phones keep 1 px units. Floors: `--control-header` ≥ 34,
`--control-lg` ≥ 32, `--control-md` ≥ 30, `--control-sm` ≥ 28, sidebar ≥ 220. Login card ≤ 1152 ×
792 with `clamp(24px, 8vh, 96px)` air and ≥ 480 px height (zero scroll from 1280 × 657).

REFERENCE FIDELITY != FIXED CSS PIXEL SIZE (see `docs/DESIGN_SYSTEM.md` § 5.1). Component rules below
quote canvas values (1448 × 1086); at runtime macro lengths are canvas px × `--du` (app pages,
section 24) or × `--lu` / `--lt` (Login, Login section 8). Both are exactly 1 px on the canvas.

| Component | Runtime rule (desktop ≥ 1025 px) |
|---|---|
| Login card `.login-card` | height `clamp(600px, 100vh − 2 × clamp(32px, 6vh, 72px), 880px)`; width `min(1280px, 100%, 1670 × lu)`; centred with visible outer space; never needs vertical scroll on 1280 × 720 and up (r5) |
| Login form column | spacing × `lu`; text × `lt` with floors (title 26, lead 14.5, labels 14, input 14.5, CTA 15, small 13); fields / CTA / Google / OTP cells `max(44px, 50 × lt)`; toggle 40 px fixed (r5: one step quieter than the canvas) |
| Login visual panel | copy column and photo art share the unit (art = scene unit `--login-s`); a card wider than the REF aspect shows more landscape (mirrored ridge / sky continuations, feathered seams), never a stretched photo |
| Sidebar `.shell-sidebar` | width `max(220px, 264 × du)` (r6); nav pitch 50 × du, insets × du; labels 15 × tu (verified unclipped); the navigation scrolls inside, the account block stays at the bottom; r8: nothing between the navigation and the account block (clean negative space, no promo / marketing card) |
| Top bar `.shell-topbar` | height 76 × du; controls `max(34px, 42 × du)`; r6: search + period only (no account, no "Pintasan") |
| Page header `.mc-page-head` | paddings × du; title `max(28px, 33 × du)` / `max(34px, 39 × du)`; crumbs and subtitle fixed |
| Hero `.dash-hero` | 120 × du tall; greeting `max(28px, 33 × du)`; scenery and building offsets × du (no quote, r5) |
| KPI tile `.mc-kpi` | min-height `43px + 122 × du` (the chart slot keeps 3 px under the trend row); disc, glyph, offsets and chart slot × du; value `clamp(16px, 100cqi / 7.9, 22 × dt)` |
| Rows and cards (02) | card min-heights, paddings and row pitches × du (actions 63.75, legend 33.25, feed 52.5, projects 65.5) |
| Purchase table `.pur-th` / `.pur-td` | header 38 × du; rows `max(61px, 68 × du)` so the 32–36 px control and its meta line always fit |
| Tablet (768–1024) | page header, KPI tiles, Dashboard blocks and Motion Study cards use the tablet `--du` (.86–.94); rail, tablet top bar and purchase item cards keep their own rules |
| Controls | `--control-md` `max(32px, 36 × du)`, `--control-lg` `max(34px, 40 × du)`; `--control-sm` 32 fixed |
| Sticky footer `.pur-footer` | height 63 × du (54 on 1366 × 768) with 34–40 px actions |
| Content column | `max-width: 1680px` per block (large screens stop growing) |
| Motion-study cards | card padding and gaps × du; demo stages keep their size (they host the animated mocks) |

Tablet (768–1024) and phone (≤ 767) keep the units at 1 px; their layouts are separate compositions.

## App shell

> **r12:** the sidebar is a two-level tree (group headers = disclosure buttons, child rows = `.shell-nav__sublink`);
> active state, the drawer, the rail and the bottom-bar contents below are superseded by
> `docs/NAVIGATION_ARCHITECTURE.md` and `docs/COMPONENT_CATALOG.md` §5. The anatomy and state tokens here still apply.

### Sidebar item `.shell-nav__link` [13]
- Anatomy: 24 px icon + label (15 / 500); active = lime-150 pill (44 tall, r 10) + 3 px olive
  indicator + primary ink 600.
- D: 264 px sidebar, 50 px pitch. T: 80 px icon rail (labels hidden, names kept). P: hidden — use
  the bottom navigation.
- States: hover tint `--shell-nav-hover`, press `--shell-nav-press`, focus outline; `aria-current="page"`.

### Top-bar control `.shell-topbar` [13]
- r6: search (`.mc-input--header`, Ctrl K keycap) on the left; on report pages the period filter
  (date range trigger) on the right; nothing else. Negative space is intended. Create Purchase: search
  only. T: same controls. P: replaced by the app bar (the period filter moves into the Dashboard
  greeting as a chip).

### Account `.shell-account` [13] + menu `.mc-account-menu` [29] (r6)
- D: bottom of the sidebar, separated by a hairline; trigger = avatar 34 + name (14 / 600) + role
  (12.5, tertiary) + up/down chevron; min-height 52 × du (≥ 44); hover = nav-pill tint; open = sunken.
  Stays visible when the navigation scrolls (short viewports). T rail / collapsed sidebar: the avatar
  alone (48 px target) at the bottom of the rail, menu opens to its right.
- P: not in the app bar, not in the bottom navigation — only at the bottom of the drawer (below).
- Menu: `role="menu"` with `menuitem`s, opens above the trigger; optional email header; entries from
  `account.menu` (default: Profil saya, Pengaturan akun, Pintasan keyboard [pointer devices only],
  separator, Keluar in danger tone). Keys: Up/Down/Home/End, Enter/Space, Esc closes and returns
  focus, Tab / outside click closes. 42 px rows with 22 px text inset (select geometry).
- Keluar → `MCConfirm` (see Overlays › Confirmation dialog). Never logs out directly.

### Search
- Opens the command palette on focus/typing or Ctrl/Cmd+K (`mc:command`). P: the app-bar search
  icon (44 px) opens the palette as a top sheet.
- Three distinct things, never merged (r7 audit): **Search** = the top-bar field, the entry point;
  **command palette** = the dialog it opens ("Palet perintah": find a page, project or document and
  run a command); **Pintasan keyboard** = a read-only reference dialog opened from the account menu
  or `?` (fine pointers only). There is no top-bar "Pintasan" button and no top-right avatar (r6);
  the Motion Study miniature follows the same top bar (search + period).

### Phone app bar `.mc-appbar` [18, 23] (P only)
- 56 px + safe-area top, translucent canvas with blur.
- Order (r9, every app page): **Menu** `.mc-appbar__menu` (≡, 44 px, fixed leading position) →
  brand (logo 28 × 21 + wordmark 17 / 700) → search (opens the palette). Nothing else: no account
  avatar (r6: the account lives at the bottom of the drawer), no decorative empty controls.
- **No explicit Back by default (r9).** Device / browser Back, the swipe gesture, the drawer and the
  bottom navigation already return. A project enables it with `navigation.mobileBack: true` (only when
  browser history cannot represent its workflow): JS then inserts a hairline `.mc-appbar__sep` + **Back**
  `.mc-appbar__back` ("← Kembali", 44 px, labelled so it is never confused with Menu) in place of the
  brand, pointing at the page's `body[data-nav-parent]` destination; it returns to the previous page
  of the tab when there is one. Desktop / tablet keep the breadcrumb trail.
- Menu: `aria-haspopup="dialog"`, `aria-controls="mc-navdrawer"`, `aria-expanded`.
- Hairline (`.is-scrolled`) when content scrolls under the bar.

### Bottom navigation `.mc-bottom-nav` [18, 23] (P only)
- 4 frequent destinations (Beranda, Pembelian, Keuangan, Laporan); icon 22 inside a 54 × 30 pill +
  label 11.5 / 500; 60 px + 1 px top border + safe-area bottom; translucent white.
- **Persistent** on every normal authenticated page, including task pages with a sticky action bar.
- Active from `body[data-nav-section]` via `data-nav-key` (nested pages inherit the parent section);
  sections outside the four keys activate nothing. Active: lime-150 pill + primary ink 600; inactive:
  tertiary ink.

### Navigation drawer `.mc-navdrawer` [23] (P + tablet rail)
- The complete navigation; built by JS from the page's sidebar navigation (same items, order, icons,
  group). Fixture only — production builds it from role / permission / navigation contracts.
- Layout: from the left, `min(86vw, 340px)`, full height, safe-area padding; header 64 (brand + close
  44), scrollable body with 48 px rows (icon 22 + label 15 / 500, 14 px gap, r 10), divider, subtle
  role-group label; r6 footer = the **account block** (avatar 38, name 15 / 600, role, chevron;
  60 px). Tapping it (`aria-expanded`, `aria-controls`) reveals the account actions above it (48 px
  rows; Keluar in danger tone). Esc collapses the account actions first, then closes the drawer.
  Keluar opens the confirmation dialog above the drawer; Batal returns to the drawer.
- Current location: `aria-current="page"` = lime-150 + 3 px olive indicator + 600 (same language as
  the desktop sidebar).
- Behaviour: modal dialog (`role="dialog"`, `aria-modal`, `aria-label="Menu aplikasi"`) containing a
  `nav` landmark; focus to the close button, trapped (Tab / Shift+Tab wrap); closes on the close
  button, scrim, Esc and browser Back (history entry); focus returns to the trigger; page behind is
  inert and scroll-locked (body pinned at its offset). Placeholder destinations just close it.
- Choosing a destination: drawer and bottom navigation mark it (primary keys only), the drawer closes,
  then the shell's page transition navigates.

### Tablet rail menu `.shell-railmenu` [23] (768–1024 px)
- 44 px ≡ button under the logo in the 80 px icon rail; opens the same drawer (labels for every
  destination). Hidden on desktop and phone.
### Navigation roles at a glance (r3)
| Control | Answers | Never does |
|---|---|---|
| Menu (≡) | "Where can I go?" — opens the complete drawer | go back, act on the page |
| Back (‹ Kembali) | "Return to where I came from / the parent" | open navigation |
| Bottom navigation | "Jump between the 4 frequent sections" | carry page actions |
| Contextual action bar | "Act on this page" (≤ 2 visible actions) | replace navigation |

Stacking at the phone bottom: content → contextual action bar → bottom navigation → safe area.
The Golden Reference fixture menu is NOT the final production authorization matrix. Production
MULTIPLECORP navigation must later be derived from canonical role/permission/navigation contracts.
Review: every page can be inspected at fixed viewports through `review/index.html` (wrappers frame
the canonical `pages/*.html`; no duplicated markup).

## Login

Desktop: see the viewport-fit table above (card, form column, visual panel). Editorial panel:
brand, three-line headline, lead and three feature rows; no quote (removed in r5, not replaced).

### Login on phones (≤ 767 px, r5)
- A calm form page, not the desktop stacked: brand row (30 × 22 mark + 19 px name) and the
  ID/EN toggle on top, a quiet sky band behind them (scene palette, no photo), title 25 / 31,
  lead, form (52 px fields and buttons), Google, helper. The marketing card that sat below the
  form is gone on phones (it competed with the task).

### Login card on tablet (768–1024 px, r4)
- One centred card, `min(680px, 100%)`, page padding `clamp(24px, 5vh, 56px) clamp(24px, 8vw, 88px)`.
- Editorial header 248 px: brand (37 × 28 mark, 24 px wordmark), the current step's headline
  (32 / 37, 700), REF-M2 building anchored to the right edge (scene unit .44, ground fades into the
  sky on the left). Lead, feature rows and quote are desktop-only.
- Form column: 36 px top / 40 px sides; language toggle on the title row (title keeps 116 px clear);
  52 px fields and buttons; Back on the toggle row in the verification step.
- Same states and copy swaps as desktop; compact step change (480 ms), reduced motion 150 ms fade.
- Applies to portrait tablets only (`orientation: portrait`).

### Login card on landscape tablets (768–1024 px wide, landscape; r5)
- 1024 × 768 is too short for the stacked card, so the card splits again as a tablet composition:
  `min(960px, 100%)`, two columns 42 : 58, min height `min(680px, 100vh − 2 × clamp(20px, 4.5vh, 44px))`.
- Left: brand (22 px), headline 29 / 34, lead 14.5 / 21, the REF-M2 building scaled to the panel
  height (scene unit = panel height / 936); the panel stays put between steps.
- Right: 32 / 40 px padding, toggle on the title row, title 27 / 34, 48 px fields and buttons.

## Actions

### Buttons `.mc-btn` [2] (r5 standard)
| Role | Class | Look | Use |
|---|---|---|---|
| Primary | `--primary` | dark green fill, white 600 label | the one main action per view ("Simpan dan lanjutkan") |
| Auth primary | `--cta` | lime/olive `#bdca88`, dark ink, 2 px band | Login only |
| Secondary | `--outline` | white, `--color-border-control`, primary ink | the second choice ("Simpan sebagai draf", row actions) |
| Tertiary | `--ghost` | no border, tint on hover | low-frequency or leaving actions ("Batal") |
| Additive | `--accent` | lime-100 fill | adding inside a card when it is the card's main act (sparingly) |
| Destructive | `--outline` + danger hover / icon `.pur-trash` | neutral at rest, danger tint on hover | remove a line (icon-only, labelled per row) |
| Icon-only | `--icon` (`--round`) | square or circle, ≥ 24 D / ≥ 44 P | must carry `aria-label` |
| Text link | `.mc-link` | underline 1 px, optional arrow | navigation inside cards ("Lihat semua", "Laporan piutang") |
| Overflow | `--icon` + `i-more-horizontal` | ghost | rarely used extra actions (none in the fixture) |
- Heights: `--control-sm` 32 (in-card), `--control-md` 36 (fields, default), `--control-lg` 40 (page
  actions, footer), `--control-header` 42 (top bar), xl 50–56 (auth). Desktop density lowers md/lg
  to ≥ 32/34 on short laptops. Phones ≥ 44; primary actions 48 (auth 52).
- Padding 16 (sm/md) / 25 (lg) / 24 (xl); icon gap 8–12; radius 6 (32–36), 8 (40–42), 10 (≥ 48).
- States: hover tint 140 ms; press scale .97 (rows tint instead); focus 2 px olive outline,
  offset 2; disabled 48 % opacity, no pointer; loading `aria-busy` (spinner replaces the label,
  width kept, label kept for AT); success = spinner → check morph (160 ms) on the button that saved.
- Never invent page-level geometry for these roles; pages only position buttons.

### Action hierarchy (every page)
- **Primary** one per view; **secondary** next to it; **tertiary** as ghost / text link; rarely
  used actions in an overflow menu. Create Purchase: primary "Simpan dan lanjutkan", secondary
  "Simpan sebagai draf", tertiary "Batal" (ghost). Dashboard: no page primary; each "Tindakan" row
  has one labelled action. Login: one CTA ("Masuk"), Google as secondary.

### Redundancy rules (r5 audit)
- One intent, one control in a context. A row or card has ONE target: either a labelled button or a
  stretched chevron link, never both to the same place.
- A badge states one dimension (state, severity, completion, attention) and never repeats the line
  next to it ("Jatuh tempo" pill + "Jatuh tempo 1–7 hari lagi" meta → pill says "Mendesak").
- One global period control per page (the top-bar date range); cards follow it instead of carrying
  their own period select.
- Back, Menu, bottom navigation and the contextual action bar are NOT duplicates (different jobs);
  a status and the action that resolves it are not duplicates either.

### Sticky action bar `.pur-footer` [3, 20, 23] — r9 split primary action
- D / T: left = "Total pembelian" + total (aria-hidden mirror of Ringkasan) and the status line;
  right = ONE split primary action `[ Simpan dan lanjutkan | ˅ ]` (`--control-lg`). The bar's content
  aligns with the card column (max 1680 px); ≤ 56 px tall. No row of unrelated buttons.
- P: full width **above the persistent bottom navigation** (`bottom = bottom-nav 60 + 1 + safe-area`);
  row 1 = "Total pembelian" + live total, row 2 = the split action at full width (48 px). Never draft
  + primary as two large buttons; nothing else in the form repeats these actions.
- Draft and cancel live in the split menu: "Simpan sebagai draf" (submits as draft; the chevron segment
  shows the busy spinner) · separator · "Batalkan pembelian" (destructive tone).
- Cancel leaves immediately while nothing changed; after an edit it asks **"Batalkan pembelian?"** —
  "Perubahan yang belum disimpan akan hilang." — `Kembali` (focused, safe) | `Batalkan pembelian`
  (danger). Dirty = any input / change / row add or removal since load.

### Split primary action `.mc-split` [29] — r9
- Markup: `[data-split]` > `.mc-split__main` (the primary action itself: submit, link or handler) +
  `[data-split-toggle]` (separate button, `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`,
  accessible name "Aksi lain") + `[data-split-menu]` (`role="menu"`, `role="menuitem"` buttons,
  `role="separator"`; `.mc-split__item--danger` for a destructive item). The primary action is never
  repeated inside the menu. Labels and items are page markup / copy: a project changes them without
  touching component CSS; the behaviour is `MCSplit` (interactions.js).
- Look: both segments in the primary colour, joined by a 1 px gap; chevron 18 px, turns 180° while open.
- Menu: the account-menu recipe (surface, 1 px border, menu shadow, 40 px rows D / 48 px rows P,
  icons only where they help recognition). It opens UPWARD from the action bar, anchored to the right
  edge (D/T) or across the full action width (P), so it never covers the bottom navigation.
- Keyboard: Enter / Space / ArrowDown open on the first item, ArrowUp on the last; Up / Down / Home /
  End move; Esc closes and returns focus to the chevron; Tab or an outside click closes; choosing an
  item closes the menu, then runs the item (a dialog it opens manages focus).
- The status slot shows only errors that need a fix (inline, persistent, `role=status`); a
  successful save is confirmed by a toast (r5), never by both.
- Content bottom padding = action bar (100) + bottom navigation (61) + safe area + 20, so the last
  card is always reachable. Toasts on phones sit below the app bar, never over the bars.

## Inputs and forms

### Text field `.mc-field` + `.mc-input` [3]
- Label above (13 / 400 secondary; auth 15–16 / 600 primary), 8 px gap, bordered box with optional
  leading icon/addon. D: 36 (app), 55–56 (auth). P: 48 (auth 52), font 15–16 (prevents zoom).
- States: hover border, focus halo, invalid (`aria-invalid` → danger border + halo + message
  `.mc-field__error`), disabled sunken.

### Custom select `.mc-select.is-enhanced` + `.mc-listbox` [16] — r2
- Markup stays a native `<select class="mc-input__control">` inside `.mc-select`; JS adds
  `button.mc-select__trigger[role=combobox][aria-haspopup=listbox][aria-expanded][aria-controls]`
  that reuses the select's classes (closed state identical to the reference control). Labels:
  `label[for]` is re-pointed to the trigger; otherwise the select's `aria-label` is copied.
- D popover: anchored to the field (min width = max(field, 200 px)), 8 px inner padding, rows 42 px
  with 14 px text inset (22 px from the menu border; r5: 18 read as cramped), 10 px vertical
  padding, r 10 menu / r 6 highlights, `--shadow-menu`, soft border,
  max height 320 with scroll, flips above when space is short. Selected = lime-50 + olive check +
  500 weight; active (keyboard/pointer) = `--color-row-press`; both = lime-150. Optional
  `data-meta` on `<option>` adds a secondary line (product SKU · price).
- P: modal bottom sheet (`.mc-sheet`, title = field label, close button, 52 px rows, safe area,
  background inert, focus inside, returns to the trigger on close).
- Keyboard: ↓/↑ open and move, Home/End, PageUp/PageDown, Enter/Space select, Esc close without
  change, Tab selects and moves on (popover), Alt+↓/↑, typeahead. Programmatic `select.value`
  updates the trigger; `select.focus()` focuses the trigger; `change`/`input` events fire on the
  native select. Opt out: `data-native-select`.
- Trigger heights: 32 in cards, 36 in forms and tables (REF-M3 density), 42–48 for standalone
  filters and phones. Other menus (e.g. "Gunakan data dari") use the same menu tokens
  (`--select-menu-pad`, `--select-row-h`, `--select-row-px`).

### Date range filter `.mc-daterange` [26] — r5, r6 true custom range
- r6 custom view: `.mc-dr__pane[data-edge="start|end"]`, each with `.mc-dr__cal-head` (previous ·
  month picker `[data-jump="months"]` · year picker `[data-jump="years"]` · next) and a day grid
  (`role="grid"`). Month / year pickers replace the grid inside the pane (3-column option grid, 44 px
  options; disabled outside min … max; Esc returns to the days). Desktop ≥ 1100 px: two panes side by
  side (`data-layout="dual"`), each with a "MULAI / SELESAI" header and its value. Tablet popover and
  phone sheet: `.mc-dr__edges` switch (Mulai | Selesai, `aria-pressed`) above one pane
  (`data-layout="single"`); picking Mulai moves to Selesai. Foot: range + day count or the next
  prompt, an amber notice when Selesai had to be cleared, Batal (ghost) + Terapkan (primary, disabled
  until valid). Selesai days before Mulai and days outside min … max carry `aria-disabled`.
- One reusable period filter; the top bar carries it on every app page (`[data-daterange]` slot),
  phones get a chip in the Dashboard greeting. All slots share one state (remembered for the tab);
  any `[data-range-label]` element shows the active period (e.g. the greeting subtitle).
- Presets: Hari ini · 7 hari terakhir · 1 bulan terakhir · Bulan ini · Bulan lalu · Rentang kustom
  (no near-duplicates). A preset applies at once; Rentang kustom opens the range picker.
- Trigger text = the active selection: "Hari ini", "7 hari terakhir", otherwise the dates
  ("1–31 Okt 2026", "15 Sep – 14 Okt 2026", "28 Des 2026 – 3 Jan 2027"); custom shows the applied
  dates. `aria-label` = "Periode laporan: <name> (<dates>)". English: Today, Last 7 days, Past month,
  This month, Previous month, Custom range; dates "1–31 Oct 2026".
- Desktop / tablet: popover (`role=dialog`) right-aligned under the trigger, presets column 272
  (232 beside the picker) with 48 px rows (label 14 + dates 12), check on the active preset.
  Custom: Mulai / Selesai fields (52 px; the pressed one receives the next pick), one month grid
  (two from 1100 px of viewport), 36 px day buttons (start/end lime CTA, range lime-50 band, today
  ringed, future days `aria-disabled`), footer hint + Batal (ghost) + Terapkan (primary, disabled
  until both dates exist). One Apply button only.
- Phone: modal bottom sheet (`.mc-dr-sheet`): 52 px preset rows; custom replaces the presets with
  "‹ Periode cepat", fields, one month of 40 px days and a sticky Batal / Terapkan row above the
  safe area. The sheet covers the bottom navigation while open (modal).
- Keyboard: presets ↑/↓, Home/End, Enter/Space; grid ←/→ day, ↑/↓ week, Home/End week,
  PageUp/PageDown month (+Shift year), Enter/Space pick; Esc closes without change; Tab stays
  inside; focus returns to the trigger. A polite live region announces the applied period.
- Semantics: see `docs/DESIGN_SYSTEM.md` § 10.4. Event `mc:daterange` lets pages refetch.
- r7: "today" (presets, today marker, limits) is `MCTime.today()`; limits may be relative
  (`startOfYear-2`, `endOfYear+1`, `today`, `±Nd|m|y`); relative presets follow `mc:timechange`. The
  dashboard visibly reacts to every committed range (DEMO / FIXTURE variant, § 10.4 of the design
  system); a page must never ignore the filter it shows.
- Validated ranges (r7): 14 Okt → 14 Okt 2026, 20 Jul → 12 Sep 2026 (cross-month), 15 Des 2025 →
  20 Feb 2026 (cross-year), 1 Jan 2025 → 31 Des 2026 (independent START / END year jumps), a range
  ending on the max limit; desktop popover, tablet popover and phone sheet.

### Forms (Create Purchase)
- D: five fields in one row (REF-M3). T: wraps. P: single column; "No. referensi" + "Mata uang"
  share a row from 430 px; required marker `*` in danger colour; validation focuses the first
  invalid control.

### Upload `.mc-upload` (drop root) [17] — r2
- States in `data-state`: `idle → hover → dragover → selected → processing → success | error`;
  remove → idle; replace reopens the picker; error offers retry (network) or "Pilih file lain".
- D: idle = the REF-M3 drop zone (78 px); every other state = a file panel of the same box: type
  tile (PDF red tint / image blue tint), file name (ellipsis + tooltip), "PDF · 2,4 MB · status",
  4 px progress bar, glyph cell (spinner / green check / alert), 36 px actions.
- P: 76 px zone, "Ketuk untuk memilih file" (tap wording; drag and drop remains on pointer
  devices), status on its own line, 44 px actions.
- Validation: PDF/JPG/PNG, ≤ 10 MB; simulated upload 1.6 s; names containing "gagal" simulate a
  dropped connection (retry demo).
- Announcements: polite live region (selected, 50 %, success, removed), `role="alert"` for errors.
- Never depend on drag and drop; the file input is always reachable by keyboard.

## Data display

### Section headings (r9: text first)
- Card and section titles are **text only**: no decorative leading icon (Tindakan hari ini, Umur
  piutang, Aktivitas terbaru, Proyek berjalan, Nilai proyek, Informasi Pembelian, Barang yang dibeli,
  Lampiran, Ringkasan, Motion Study specimens). The title sits on the card's content edge (aligned with
  the text below it), vertically centred with the header's right-hand control; no icon gap remains.
- Icon classification: **navigation** (sidebar, rail, drawer, bottom nav) keep · **action** (buttons,
  row actions, link arrows, split chevron, input affordances such as search / calendar) keep where they
  aid recognition · **status / semantic** (pills, attention badge, deltas, toast and upload states)
  keep · **identity / content markers** (KPI category discs, activity and action-row type discs, the
  account avatar) keep · **section decoration** remove.

### KPI card `.mc-kpi` [15]
- D: 279 × 165; 52 px tinted disc, label 12.5, value 22 / 700 (proportional figures), delta badge +
  "dari Sep 2026", sparkline bottom-right, round chevron = stretched link (whole card).
- P: 2 × 2 grid, padding 14, disc 36, value 17 (clamp 15–17), sparkline top-right 30 px tall,
  chevron hidden (card stays the target, ring shows on focus).
- P (r7): one layout per grid: below 400 px the comparison ("dari Sep 2026") always takes its own
  line under the delta, from 400 px it sits beside it (390 px used to mix both in one grid).

### Action row `.dash-action` [19]
- D: disc 42, title + meta, optional severity pill ("Mendesak"), ONE labelled outline action whose
  hit area is stretched over the row (r5: the extra chevron link to the same place was removed).
- P: disc 40, title 14.5 / 600 + meta 12.5 wrapping; second line = pill (left) + the same action as
  an olive text link with chevron (right); the whole row is still the target; min 60 px.
- Card head (r7): the "n perlu perhatian" badge sits beside the title when it fits; on a narrow card
  (container ≤ 360 px) it wraps under the title, aligned with the title text (it used to sit alone at
  the right of its own line because a phone rule overrode the narrow-card rule).
- Card height (r7, ≥ 768 px): when the ageing card beside it is taller, the list fills the card; an
  empty end spacer (basis 0, capped at 22.3 du) keeps a REF-sized gap and the rows share only the
  rest (1280 × 720: 33 px blank → 14 px, rows 49 → 53 px). 1366–1920 renders are unchanged.

### Chart card (`.dash-aging`, `.dash-value`, sparklines)
- Drawn from data; legends with 14–18 px dots, value + percentage columns; no axes.
- P: collapsed behind `.mc-disclosure` (header toggle showing the key figure, e.g. "Rp1.214,4 jt";
  `aria-expanded`, `aria-controls`); opening shows the chart and the header links/selects.

### Project / context strip `.pur-project` [20]
- D: thumbnail 66, name 15 / 600, code · client, status pill right.
- P: thumbnail 52 left, name and meta wrap, pill under the text.

### Stepper `.mc-stepper` (r10, shared)
- Equal columns; markers on one centre line (30 px discs: complete = done tint + check, current = lime
  signal, upcoming = neutral ring, attention = warning); connectors run between marker edges with equal
  gaps; labels centred under their marker and wrap without moving the markers; symmetric at 360 / 390 /
  430 / 440 and desktop. `aria-current="step"` + a visually hidden "(langkah n dari N)".

### Purchase line `.pur-row` [20]
- D: table row (No · product select + meta · qty · unit · price · tax · subtotal · trash).
- T/P (≤ 1023 px): item card — "BARANG n" label + 44 px trash; full-width product select (48) +
  meta; Jumlah | Satuan | Pajak (44, labelled); Harga satuan | Subtotal (bold, right). Controls keep
  their per-row `aria-label`s; the table header is visually removed.
- Phone item card (r5): two even columns so nothing truncates at 360 px — label + trash /
  product (full) / Jumlah | Satuan / Pajak | Harga satuan / Subtotal (label left, value right,
  hairline above); meta line wraps as text.
- Adding (r9): ONE item-action group in the card header: `[ Tambah dari katalog… ] [ + Tambah baris ]`.
  The catalog field adds an existing product (Enter, or picking a suggestion); "Tambah baris" adds an
  empty row. Distinct actions, never merged. The old add-row strip under the table and its "atau tekan
  Alt + N" row are gone; Alt+N still works and is exposed through the button's tooltip and
  `aria-keyshortcuts`, the command palette and the keyboard-shortcuts reference. Phones keep the same
  row (catalog flexes; 44 px button "+ Tambah" below 420 px, accessible name always "Tambah baris";
  the placeholder switches to "Cari katalog…" whenever the long one would not fit — measured, so it
  never truncates).
- **Alignment rule (r7).** Every header names its values and sits on their edge: text columns
  (No, Produk, Satuan, Pajak) align left with the field text, Jumlah centres on its centred field,
  money columns (Harga satuan, Subtotal) align right with the digits. Header paddings are derived
  from the field geometry (gap + border + inner padding), never tuned per viewport, so a header moves
  WITH its digits. Checked within 1 px at 1024, 1025–1046, 1100, 1280, 1366, 1920.
- **Compact frame (r7).** The column split follows the table frame, not the viewport: a container
  query (`.pur-table-wrap { container: pur-table }`, `max-width: 1039px`, table form ≥ 1024 px only)
  covers 1024 px tablets and the 1025–1329 px laptops where the 220 px sidebar replaces the 80 px rail.
  This removed the 1025–1045 px shift (the 754 px minimum table no longer exceeds a 735 px frame; no
  table scroll, no clipping, nothing hidden). Every label stays whole; "PPN 11%" keeps its width.
- **Field room (r7).** The quantity field uses 6 px inner padding (its digits are centred, so wide
  layouts are pixel-identical) and the compact split gives Jumlah 8.6 %: "20" and "1.000" show whole
  from 1024 px (it showed "2…" at 1025–1032); prices up to "99.999.999" fit everywhere.

### Summary card `.pur-summary`
- Warm surface; band with "Subtotal (sebelum pajak)" and "Total pajak (11 %)" values, divider,
  "Total pembelian" in primary-deep (D 20–21 / P 22), item count line. Values always computed.

### Status badge `.mc-pill` [5]
- Full radius, tint background, dark same-hue text ≥ 4.5:1, optional 8 px dot; sizes 24 (default),
  `--sm`/`--xs` for dense rows, `--lg` 28. Delta badge `.mc-delta--up/--down` (arrow glyph + sign).
- One dimension per badge: state (Aktif, Berjalan, Dalam proses), severity (Mendesak), attention
  count (5 perlu perhatian), trend (+12 %). Never colour alone: the word (and dot / arrow) carries
  the meaning. Labels 1–2 words. No badge that repeats the adjacent text.

### Status — one semantic component, two densities (r13 pilot, Layer A) [5]
`MCUI.pill(label, tone, o)` / `MCUI.status(registry, key, o)` (domain registries in project data: `A.st(domain, key, o)`).
- **Densities.** `variant: 'badge'` (default) = the filled pill `.mc-pill` for the status of the record IN VIEW (page or
  card head, `size: 'lg'`). `variant: 'text'` = `.mc-status` (7 px dot + label, no fill, no border) for list rows and
  table cells. Inside one column every state uses the SAME density — never pills for some states and plain words for
  others (the r11 "quiet normal state" mix, D-32, is superseded for lists).
- **Anatomy (text density).** 13 px / 500 / 20 px line, dot 7 px, 8 px dot → label, one line, `white-space: nowrap`;
  identical for every label so rows keep one rhythm. No motion (the live breathing dot is only for the badge of a
  genuinely live record).
- **Tones are semantic, not business words:** neutral · info · pending · attention · success · warning · danger ·
  inactive. Ink stays body text except attention / warning (amber ink), danger (red ink) and inactive (muted label,
  hollow dot). Strong colour = meaningful exception only. The project's registry maps its business states to tones
  (e.g. MULTIPLECORP: Lewat jatuh tempo → danger, Belum Ditagihkan → warning/attention, Lunas → success, Ditagihkan /
  Terbit → info, Draf → neutral, Dibatalkan / Direvisi → neutral or inactive). Generic CSS never names a business state.
- **Separate dimensions, separate columns.** Document lifecycle (Draf · Terbit · Direvisi · Dibatalkan), invoice
  collection (Belum Ditagihkan · Ditagihkan · Lewat jatuh tempo · Lunas), payment, PDF file (Siap · Sedang dibuat ·
  Gagal dibuat · Belum ada · Tidak berlaku), workflow progress (MCProgress / stage navigator) and live state never share
  one badge. They may share the component, never the meaning.
- **When plain text instead:** a fact that is not a state (a date, an amount, "Belum bernomor"), or the record's own
  label repeated nearby. On phones the status leads the meta line so a record number never truncates (D-38).

### Numbered lists and pagination (r13 compact, Layer A) — `MCList { number, paging }`, `MCPager`
- **Every operational record list on a module's list page is numbered**: a leftmost "No." column (table) and a quiet
  position before the title on phone cards (`.pt-row__no`, tabular figures, tertiary ink — never a badge, never a link).
- **The number is a DISPLAY POSITION**: `displayIndex = pageOffset + visibleRowIndex + 1`, computed on the CURRENT sorted
  and filtered result. It is not a database id, not an official document number, not a business sequence, never stored
  in fixtures. Sorting, filtering, a page change or a page-size change recompute it; a filter returns to page 1; a page
  past the end clamps to the last page. Cursor pagination: use the server's offset/position, never invent a global rank.
- **Pagination, not endless scroll**: default 10 per page (20 / 50 selectable), footer "Menampilkan 11–20 dari 34
  dokumen" + Sebelumnya / Berikutnya (44 px icon buttons on phones); hidden when everything fits on one page. The page
  works on the filtered + sorted data (no CSS hiding). After a page change the first record of the page takes the focus
  and the range is announced (`aria-live`). A selected record (list-detail) opens on its own page.
- **Grouped data**: category headings never take a number; prefer ONE list + a type filter over pre-expanded groups.
  *(r13 harmony)* Older versions opened under their document carry a SCOPED position `n.k` (k counts back from the newest
  older version: 2.1, 2.2) — orientation only, never the revision number, never a top-level position.
- *(r13 harmony)* **Numbering is the DEFAULT of `MCList`**: every MCList instance (primary lists, nested record lists,
  worklists, review queues, activity logs, master data) is numbered unless the spec says `number: false` — and that
  needs a written usability reason in this section. Custom lists use `MCPager.no(n)` + `.pt-col-no` / `.pt-row__no`.
  Paging stays opt-in per list: standard list screens page at 10; small nested lists stay unpaged (numbered anyway).
- **Do not number (documented exceptions, r13 harmony)**: navigation menus and option lists (choices, not records);
  workflow steps (their marker already IS the step number); validation checks (MCChecks) — the severity icon leads the
  row and the order changes as problems are fixed and passed checks fold, so a number would not be a stable reference
  (two leading markers, one meaning); KPI cards and dashboard snippets (≤ 5 signals, not a sequence to scan); document
  item tables (the paper's own line content).
- *(r13 refine)* **Timelines** (`.pt-timeline`, every module) are numbered CHRONOLOGICALLY by Layer A (`MCTimeline`,
  patterns.js): 1 = the first event whatever the display order; newest-first feeds count down n…1, an oldest-first list
  declares `<ol data-chrono="asc">` (40/70 case history). The position sits in the rail marker (tones kept).
- *(r13 refine)* **Grouped search results (07)** are numbered PER GROUP (each group is its own MCList with its own "Muat
  Lagi"): a global number would shift every later group whenever one group loads more, so "Proyek 2" is the stable
  reference. Group headings never take a number.
- *(r13 remediation)* **Search results (07)** use `phone.wrap` too (no clipped titles at 390 / 360; grouping and
  per-group numbering unchanged). **86 Unit & PIC** (a custom nested list) is numbered with `MCPager.no`: units 1..n, their
  PICs scoped n.k.
- *(r13 remediation)* **Replacing typed input**: a "fill from a source" action (03 "Gunakan data dari") asks first when
  the form holds input it would replace (MCConfirm: what is replaced, what is not; "Ganti Isian" / "Batal"); Batal keeps
  every value; an untouched form is filled without a question.
- *(r13 refine)* **Long titles on phones** (`phone.wrap`): the record name gets the full row width, up to three lines (the
  full name in the row tooltip and for assistive tech), company / client as the second line, the end slot (status,
  attention, date) as a quiet third line — never a right column that squeezes the name.

### Workflow navigator (r13 harmony, Layer A) — `MCStepper` (guide.js) on `.mc-flow` + `.mc-stepper--inline`
- ONE marker language with the progress stepper (`MCProgress`, `.mc-stepper`): the same disc, check, signal and
  attention colours. MCProgress = a read-only readout (stacked); MCStepper = the interactive stage navigator (inline).
- **Anatomy**: a quiet tonal band (`.mc-flow`, the TOP BAND of the card it steers — never loose on the canvas) holding
  equal columns; each step = marker + label (+ optional note); the connector fills the rest of the column, so a long
  label shortens a line but never moves a marker. A locked final step (a lifecycle end such as "Terbit") takes only its
  own width. Current = signal disc + semibold label + a 2 px olive rule on the band edge (it opens onto the content).
- **States**: current (where the user works, `aria-current="step"`) · complete (genuinely finished) · upcoming ·
  attention / blocked (needs a fix, with a short note) · locked (done by the bar's primary action, `aria-disabled`).
  Step position is NEVER the document status: "Pemeriksaan" active does not mean ready or issued.
- **Interaction**: native buttons; ArrowLeft / ArrowRight / Home / End move focus between interactive steps; Enter or
  click switches the stage (no save, no issue); the switch is announced to screen readers only.
- **Motion**: the marker colour eases (200 ms) and the current rule grows in (scale .55 → 1); nothing loops, bounces or
  slides; `prefers-reduced-motion` removes both. The active stage content fades in (4 px, 200 ms; none when reduced).
- **Phones**: same columns, connectors hidden (the numbers carry the sequence), whole labels at 13 px, notes move to
  the stage itself.

### Result surface (r13 harmony) — `MCResult`
The tone icon is part of the heading: a 20 px disc centred on the outcome line ("Penawaran diterbitkan dengan nomor");
the official number is the headline (24 px, its own line) with "Salin nomor" on the number's line, outside the
heading; the full MSG-01 sentence stays intact for assistive tech and copying; facts on equal columns; then the PDF
state and ONE next action, separated by hairlines. No floating 44 px circle, no hanging indent, no celebration.
*(r13 refine)* **One place for the official number**: while the result is on screen the page head names the record only
(the number returns under the title on every later visit); the printed paper keeps its number (document context).
**An honest next step**: when the next step depends on someone outside (the client answers a quotation), the step names
the wait ("Menunggu jawaban klien") and the record action stays a quiet outline — never a primary that suggests the
answer already exists.
- **API**: `MCList.mount(host, { …, number: true, paging: { size: 10, sizes: [10, 20, 50], noun: 'invoice' } })`;
  custom tables use `MCPager.state(total, page, size)`, `MCPager.html(st, { noun })`, `MCPager.bind(host, onChange)` and
  `MCPager.no(n)` (50 Dokumen does). Roles share the same list; capability decides actions, never the list architecture.

### Task-focused page header (r13 compact)
Title · ONE short context line (one sentence; explanations move to contextual help) · ONE primary action when the role
may act · one search + one or two filters visible (more behind "Filter") · the numbered list · the pager. No summary
cards without an operational decision behind them, no repeated toolbars.

## Overlays

### Dialog (motion study recipe)
- D: centred, ≤ 440 wide, r 12, `--shadow-modal`, scrim; focus trap, Esc, focus return.
- P: bottom sheet, full width, r 16 top corners, max 86 vh, safe-area padding.

### Drawer / side panel
- Modal drawer D: right edge, ≤ 420 wide; P: bottom sheet (max 88 vh).
- Non-modal side panel (in layout, REF-V2): no scrim; list stays usable; clip reveal from its centre.

### Bottom sheet `.mc-sheet` [16]
- Handle 36 × 4, title row 48, close 44, body scrolls, r 16 top, max 78 vh (640 px), safe area;
  scrim `--mc-scrim`; modal (`aria-modal`, background inert).

### Command palette
- D: centred, 640 × 520 max, input, grouped results, highlight, footer key hints. P: top sheet,
  full width minus 16 px.

### Confirmation / information dialog `.mc-modal` [29] — r6, r9 application-level
- `MCDialog.open({ kind, title, message, html, tone, confirm, cancel, returnFocus })` →
  Promise<boolean>; `MCConfirm(opts)` for confirmations.
- **Application-level (r9):** a full-viewport scrim and the card centred on the viewport (D / T / P,
  safe 16 px margins on phones). It never belongs to the control that opened it: started from the
  drawer, the account section and the drawer close first; started from the sidebar account menu, the
  menu closes first. Focus returns to a visible opener (the Menu button after a drawer flow).
- Card 400 px (info 460), radius 12, padding 24, modal shadow; no decorative icon; title 18 / 700;
  concise description 14 / 21 secondary; actions right (D/T); on phones 48 px buttons share the row
  while both labels fit and wrap instead of truncating. Safe action outline, confirming action solid
  (danger red for destructive / session-ending): never equal visual priority.
- Confirm: `role="alertdialog"`, `aria-modal`, labelled + described; the safe action (Batal) is
  focused; Esc and the scrim cancel; Tab is trapped; focus returns to the opener on cancel. The
  confirming button is `.mc-btn--danger` for destructive / session-ending actions.
- Info (keyboard shortcuts): `role="dialog"`, close button top-right, Esc closes.
- Use only for logout, destructive deletion, irreversible operations, likely data loss.

### Keyboard shortcuts `.mc-shortcuts` [29] — r6
- Reference list in an info dialog (Ctrl/⌘ K, Alt N on Create Purchase, Esc, ?); opened from the
  account menu or "?" (pointer devices, not while typing). The command palette remains the action
  surface; the two never duplicate each other's purpose.

### Toast `.mc-toast` [27] — r5
- API: `MCToast.show({ type, title, message, duration })`, `MCToast.success|info|warning|error(title,
  message)`, `MCToast.dismiss(el)`, `MCToast.clear()`.
- Look: white card, r 10, `--shadow-toast`, 3 px type edge, 32 px tinted icon disc (check-circle /
  info / alert-triangle / alert-circle), title 14 / 600, message 13 secondary, close 28 (P 44).
- Placement: D + T top-right, 10 px under the top bar, width min(380, 100 vw − 32); P below the app
  bar, full width inside the gutters (safe areas); Login 16 px from the top. Max 3, newest on top.
- Timing: success / info polite, 4.5 s, paused on hover / focus; warning / error assertive and
  sticky until closed.
- Use: events without a field (saved, synced, failed to sync, source applied). Errors that need a
  fix stay inline at their field / in the action bar. An inline confirmation (upload success)
  never gets a second toast.

## Feedback

### Success feedback
- Upload: green check (ring + mark stroke, 360 ms) + success wash that settles (no toast);
  save buttons: spinner → check, plus one success toast with the message; never inline text and a
  toast for the same event. Always announced (`aria-live`).

### Copy density (r5)
- Delete copy that explains an obvious control, repeats a heading or a visible status, or reads as
  marketing inside operational UI. Removed in r5: the Login / Dashboard quote, the "Tindakan hari
  ini" intro sentence, the "Barang yang dibeli" subtitle (it repeated the page subtitle), the phone
  greeting subtitle (it repeated the period chip and the brand), the phone Login marketing card.
- Keep copy that prevents mistakes, explains a constraint (Google linking, Owner-issued accounts,
  file types and size), supports a decision (period, totals) or warns about irreversible steps.
- Removed in r8 (owner decision): the sidebar promo / marketing card (product slogan, blurb and a
  round CTA). It was a REF-M1 / REF-M3 element, but marketing copy does not help
  anyone finish operational work. It is gone from every breakpoint and project (markup, CSS, the
  `features.promo` flag, the `--brand-promo-*` tokens and its crown icon), and nothing replaces it:
  the sidebar and the drawer end with the account block above clean space.

### Disclosure `.mc-disclosure` [18] (P only) — r9 reusable section pattern
- Markup: `.mc-disclosure[data-disclosure="key"]` > `[data-disclosure-head]` (text title, optional
  short summary, the ONE toggle) + `.mc-disclosure__body`. The toggle is a real `<button>`
  (`aria-expanded`, `aria-controls`, labelled by the title + summary, ≥ 44 px, visible focus ring) with
  the chevron on the RIGHT; no icon on the left. No-JS shows every section; tablet and desktop always
  show the body (no accordion there). Chevron rotates, body fades in (reduced motion: no movement).
- Defaults: `mobileDisclosure[key]` in project-config (`'open' | 'collapsed'`), else the markup.
  Create Purchase: Informasi Pembelian open (required fields of the current step), Barang open (the
  primary workflow), Lampiran collapsed (summary "Belum ada file" / "1 file"), Ringkasan collapsed
  (the total is in the action bar). Dashboard: Umur piutang, Proyek berjalan, Nilai proyek collapsed.
- **Never hides an invalid field:** validation (and Alt+N for Barang) opens the section first
  (`MCDisclosure.reveal(node)`, also on `invalid` events), focuses the field and announces the error.
- Use it when a section is substantial, may be temporarily irrelevant, and collapsing materially
  improves scanning. Do not collapse tiny blocks, essential immediate actions, or status / error
  messages. Secondary header controls (source menu, catalog tools, subtitles) hide while collapsed.
- **Hit area (r7).** The safe header row (`[data-disclosure-head]`: icon, title, empty header space)
  forwards a pointer click to that button, so the whole row toggles. Nested controls (the header
  link, any button, input, select, label or focusable element) keep their own action and never
  double-trigger; the card body never toggles. No invisible overlay: keyboard users have exactly one
  stop (the button, Enter / Space). The r6 `::after` stretch is gone (it could reach beyond the row).
  Checked with real pointer coordinates (button, title, icon, link, body) and the keyboard.

### Greeting `[data-greeting]` (02) — r6
- Text = `MCTime.greeting(lang, user.name)`; `data-band` = morning | midday | afternoon | evening;
  glyph `[data-greeting-icon]` = sun / sun / sunset (#e88b5c) / moon (#8e9bbb). Long names wrap.

### Brand slot `[data-brand]` [25] — r5, r7
- Filled from `assets/js/project-config.js` (r6; was `brand-config.js`; see `docs/DESIGN_SYSTEM.md` § 10.3). Mark + name by
  default; the client's full logo image when configured (`.has-logo`), compact mark in the icon rail.
- r7: logo / wordmark files are vector paths only (no SVG `<text>`, `<tspan>` or `font-family`); the
  name as text is the app's Inter (`[data-brand-name]`, `display: 'name' | 'short'`). A project mark
  replaces the default mark in every slot (rail, mark + name, app bar, drawer); it never inherits the
  default sprite.
- Logos: fixed slot height (sidebar 32, app bar 28, drawer / phone login 30, desktop login 38 × lt),
  width follows the artwork up to a cap, `object-fit: contain`, never stretched.
- Long names: one size step down (`.is-long`), then ellipsis + tooltip; the link keeps the full
  accessible name (`data-brand-label`).

## Accessibility checklist (all components)
Semantic landmarks; one `h1` per page; labels tied to controls; `aria-current` for navigation;
`aria-expanded`/`aria-controls` on toggles; listbox/combobox and dialog roles; focus visible and
returned after overlays; live regions for status; AA contrast; ≥ 44 px touch targets; reduced motion.
Overlays (select, date range, drawer, sheets, dialogs): `role` + accessible name, focus moves inside,
Tab stays inside modal surfaces, Esc closes, focus returns to the trigger; background inert for
modal ones. Toasts: polite / assertive announcements, close button with a name, never the only
place a fixable error appears. Safe areas (`env(safe-area-inset-*)`): app bar, drawer, bottom
navigation, action bar, bottom sheets (incl. the date range sheet), toasts.
