# MULTIPLECORP Design System — Golden Reference r9

Status: **FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL.** The visual identity and the
mobile/tablet navigation model were approved earlier; the r6 owner-audit corrections (100 % zoom
density, account placement, logout confirmation, true date range, dynamic greeting, action footer,
card proportionality, portability) and the r7 zero-residual polish await the Owner's visual review.
Lab only, not integrated.

**What this is:** a reusable design-system baseline for MULTIPLECORP and future client projects.
The HTML fixtures show how a product looks and behaves; their roles, menus, workflows, documents
and copy are sample content that real projects replace with their canonical contracts.
Source of truth: `assets/css/tokens.css` (values), `assets/css/base.css`, `assets/css/components.css`,
`assets/css/motion.css`, `assets/js/interactions.js`. Evidence: `evidence/final/`.
Derived from the approved mockups REF-M1 (Owner Dashboard), REF-M2 (Login), REF-M3 (Create Purchase)
— measured in `analysis/static-reference-analysis.md` — and, for motion, REF-V1/REF-V2
(`analysis/motion-analysis.md`, `docs/MOTION_SYSTEM.md`). Component-level rules: `docs/COMPONENT_RULES.md`.

r2 adds: one responsive system (tablet + phone) derived from the same tokens, the custom select /
listbox, the upload state machine, the phone app shell and bottom sheets.
r3 adds: the complete mobile/tablet navigation model (persistent bottom navigation + global
navigation drawer + back + contextual action bar), and fixed-viewport review wrappers (`review/`).
r4 adds: reference canvas vs runtime viewport (§ 5.1): the desktop Login fits the viewport with no
scrolling, the app pages get one fluid desktop density, the tablet Login gets its own composition,
and the review matrix gains the real-world desktop sizes.
r5 adds: central brand configuration (§ 10.3), one reusable date range filter (§ 10.4), the toast
system and feedback rules (§ 10.5), the button / status / redundancy / copy-density rules (§ 10.6),
a calmer desktop Login (card ≤ 1280 × 880), a landscape-tablet Login, a phone breathing pass, the
removal of the motivational quote, and review frames for 1024 × 768 and 440 × 956.
r6 (owner visual audit) adds: browser-zoom-100 % density (§ 5.1, ~10 % lighter desktop), the iOS
focus-zoom fix behind the phone sideways scrolling (§ 14), the account at the bottom of the sidebar /
rail / drawer and the account menu (§ 10.7), logout confirmation and the confirmation rule (§ 10.7),
a true arbitrary date range with independent Mulai / Selesai calendars (§ 10.4), the time-based
greeting (§ 10.8), the refined action footer and card proportionality (§ 10.9), the calm top bar
(search + period only), one project configuration file (§ 10.3, `docs/PORTABILITY_CONTRACT.md`),
central layer (z-index) tokens and a destructive button, and a Desktop 1280 review frame.
r7 (zero-residual polish) adds: one time source for every current-date concept (§ 10.8), relative
date-filter limits and a visible DEMO period response on the dashboard (§ 10.4), the project brand
token layer `--brand-*` separate from fixed Golden tokens (§ 2), deterministic vector logos and a
mark that replaces the default whole (§ 10.3), the explicit disclosure hit-area contract and the
purchase table alignment rule through the 1025–1046 px band (`docs/COMPONENT_RULES.md`: Disclosure,
Purchase line),
no project values in reusable logic (`{admin}` copy placeholder, navigation targets from the project),
and tool-level fixture time for deterministic evidence.
r8 removes the sidebar promo / marketing card from the authenticated shell everywhere (§ 10.3):
operational UI carries no marketing copy; the space stays empty and the account block closes the
sidebar and the drawer.
r9 (owner visual polish: simplification) adds: text-first section headings with no decorative icons
(§ 9a), no explicit Back in the phone app bar by default (§ 10.1, `navigation.mobileBack`), phone
progressive disclosure for substantial sections with configured defaults and a never-hidden-error
rule (§ 10.10), application-level centred confirmation dialogs (§ 10.7), the item-action group
"Tambah dari katalog | Tambah baris" (no add-row strip) and ONE split primary action with a draft /
cancel menu on Create Purchase (§ 10.9), plus a compact phone project card.

---

## 1. Philosophy

MultipleCorp is an operations product for owners and staff who decide fast. The interface is
**calm, precise and spacious but productive**:

- **Surfaces, not decoration.** White cards on a warm canvas; elevation comes from a 1.07:1 surface
  step and a hairline border, not from shadow.
- **One action colour.** Dark green `#1a5035` is the primary action. Lime is a *signal* (selection,
  current step, attention), never a second brand colour. The auth CTA keeps the approved lime/olive
  `#bdca88` (owner decision 2).
- **Hierarchy by size and colour tier**, rarely by weight. Four weights only.
- **Macro breathing room, micro density.** Generous space between sections; related controls sit
  close together.
- **Data is truthful.** Charts are drawn from data; figures are computed, never copied (owner decision 4).
- **Same product on every width.** Desktop and phone share tokens, components and motion; only
  layout and sizes adapt.

## 2. Colour tokens

| Role | Token | Value | Notes |
|---|---|---|---|
| Canvas | `--color-canvas` | `#f7f8f3` | only warm neutral (+4 G / −4 B) |
| Surface | `--color-surface` | `#ffffff` | cards, sidebar, sheets, bars |
| Surface sunken | `--color-surface-sunken` | `#f2f3ee` | table header band, hover fills |
| Surface warm | `--color-surface-warm` | `#fdfcf4` | purchase summary |
| Border subtle | `--color-border-subtle` | `#f0f1ef` | card edges, dividers |
| Border | `--color-border` | `#e4e4e2` | inputs, selects |
| Border strong | `--color-border-strong` | `#d8d8d6` | outline buttons, sheet handle |
| Text primary | `--color-text-primary` | `#0f1014` | 19:1 |
| Text strong | `--color-text-strong` | `#3a3b42` | links, current crumb |
| Text secondary | `--color-text-secondary` | `#55565c` | labels, subtitles |
| Text tertiary | `--color-text-tertiary` | `#6b6d73` | meta (AA on white and canvas) |
| Text muted / placeholder | `--color-text-muted` | `#75767a` | AA on white; use tertiary on tinted surfaces |
| Primary | `--color-primary` | `#1a5035` | white label 9.4:1 |
| Primary deep | `--color-primary-deep` | `#0e3b25` | totals, money emphasis |
| Accent olive | `--color-accent-olive` | `#545e21` | nav indicator, focus, progress |
| Lime 50 / 100 / 150 / 200 | `--color-lime-*` | `#f5f9df` / `#f0f5ca` / `#ecf1d2` / `#e4ebc2` | attention, accent button, selected nav / option, segments |
| Lime signal | `--color-lime-signal` | `#bbdf06` | current stepper step only |
| Lime CTA (auth) | `--color-lime-cta` | `#bdca88` | login primary only |
| Success | `--color-success-bg/-fg/-dot` | `#e3f4e9` / `#236b49` / `#319664` | upload success, "Aktif" |
| Warning | `--color-warning-bg/-fg` | `#fff1e2` / `#8a4a0e` | negative trend |
| Pending | `--color-pending-bg/-fg` | `#fef1d8` / `#7a5a22` | "Dalam proses" |
| Danger | `--color-danger-bg/-fg` | `#fde7e8` / `#b4373f` | errors, "Jatuh tempo" |
| Info | `--color-info-bg/-fg` | `#e2ecf4` / `#0f2b4f` | neutral information |

Discipline: no saturated blue in chrome; strong colour fills ≤ 2 % of a screen; grey text only as
light as WCAG AA allows on its real background (owner decision 3).

**Brand vs fixed (r7).** Primary, accent, lime tints, the auth CTA and the brand-state colours (Login
text links, filled code cell, brand progress, completed stepper) are **project brand tokens**
(`--brand-*` in `tokens.css`); the `--color-*` names above are aliases that point to them, so the
values in this table are the MultipleCorp defaults. Text, surfaces, borders, success / warning /
pending / danger / info, chart categories and KPI tones are **fixed Golden tokens**: a project never
re-tints them. Component CSS names no brand hex (`docs/PORTABILITY_CONTRACT.md` § 2.9).

## 3. Typography

- **Family:** Inter 4 (variable, self-hosted `assets/fonts/inter/`, OFL), **text cut** at every size
  (`font-optical-sizing: none`). Fallback: Segoe UI Variable / Segoe UI with a size-adjusted face.
- **Weights:** 400 body · 500 controls/pills/nav · 600 card titles, buttons, active nav · 700 titles,
  figures, wordmark.
- **Figures:** proportional for hero/KPI/total figures (the mockups' narrow numerals); tabular inside
  table columns and live-updating values.

| Role | Desktop | Phone (≤ 767 px) |
|---|---|---|
| Display (auth headline) | 44 / 50, 700, −0.02em (r5 Login: 40 / 46 at full size) | — (phones show no editorial card, r5) |
| Page title | 32–33 / 40, 700, −0.02 to −0.038em | `--m-text-title` 25 / 31 (26 / 32 from 400 px) |
| Figure XL / LG | 28 / 36 · 22 / 28, 700 | 22 total · `--m-text-figure` 17 / 22 KPI |
| Section heading | 20 / 28, 600–700 | `--m-text-heading` 18 / 24 |
| Card / row title | 16.5–17 / 24, 600 | `--m-text-row` 15 / 20 (rows 14–14.5) |
| Body | 14 / 20 (15 / 22 large) | `--m-text-body` 15 / 22 |
| Label | 13 / 18 | 13 / 18 |
| Caption / meta | 12 / 16 · 11 / 16 | `--m-text-meta` 12.5 / 17 |
| Button | 13–15, 600 | `--m-text-button` 15 |

Desktop sizes are the canvas values; on real desktops display and heading roles follow the clamps
in § 5.1 and body/small text stays fixed.

Rules: a title and its body differ by ≥ 1.4× or +200 weight; body vs meta differ by colour tier plus
≥ 2 px; text under 13 px is never 700; long Indonesian strings wrap (titles, meta) — only file names
and single-line values truncate with an ellipsis and a full-text tooltip/announcement.

## 4. Spacing

4 px base with a 2 px hairline step: `2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 72`.

| Context | Desktop | Phone |
|---|---|---|
| Page gutter | 16 (per-page fidelity 9 / 20) | `--m-gutter` 18 (20 from 375 px) + safe areas (r5) |
| Card padding | 20 | `--m-card-pad` 18 (12–14 for compact cards) |
| Gap between cards | 12 | `--m-card-gap` 14 (12 inside KPI grids) |
| Between sections | 12–13 rows | `--m-section-gap` 28 |
| Label → control | 8 | 6–8 |
| List row height | 64 | `--m-row-min` 60 |

"Breathing room" = macro whitespace between sections and inside cards, never oversized controls.

## 5. Grid and layout

| Breakpoint | Shell | Content |
|---|---|---|
| Desktop ≥ 1200 px | sidebar 264 + top bar 76 at the canvas; × `--du` at runtime (§ 5.1) | per-row fr tracks (KPI 4-up, main 3fr/2fr, bottom 3-up); max 1680 px |
| Tablet 768–1199 px | icon rail 80 (≤ 1024) + top bar | KPI 2-up, main stacked; purchase lines as item cards ≤ 1023 |
| Phone ≤ 767 px | app bar 56 + bottom nav 60 (+ safe areas) | single column; KPI 2×2; DOM order = reading order |
| Minimum | 360 px | no horizontal page scroll anywhere |

Media queries use fixed numbers (767 / 1023 / 1024 / 1199); the tokens document them
(`tokens.css`, "Responsive tokens").

### 5.1 Reference canvas vs runtime viewport (r4)

**REFERENCE FIDELITY != FIXED CSS PIXEL SIZE.** REF-M1/M2/M3 are 1448 × 1086 *comparison canvases*.
They define relative geometry, silhouette, proportions, hierarchy, spacing relationships and rhythm,
not the size of the browser the product needs. r1–r3 rendered 1 canvas px as 1 CSS px everywhere,
which made the composition physically too large on ordinary laptops: the Login needed 892 px of
viewport height (scrolling on 1366 × 768 and 1536 × 864, 16 px margins on 1440 × 900) and the app
shell felt zoomed in. From r4 every macro length is written as **canvas px × a runtime unit**, and
that unit is exactly 1 px on the 1448 × 1086 canvas. The approved desktop renders are therefore
unchanged, pixel for pixel, while the runtime geometry adapts to the real screen. No `zoom`,
`transform: scale()`, rasterised UI or scaled iframe is used to fit a page.

**Viewport-fit philosophy.** Fit the composition to the viewport, then stop growing. Short screens
compress space first (gaps, paddings, block heights), type second and only down to its floor. Large
screens get more breathing room, not a bigger UI.

| Unit | Where | Value |
|---|---|---|
| `--du` | app pages (shell, 02, 03, 04), desktop ≥ 1025 px | r6: `clamp(.86px, min(.86px + (100vh − 768px) × .00047, .93px + (100vw − 1366px) × .0009), 1px) × --density-scale` (.9) |
| `--dt` | app display/heading type | `.5px + .5 × --du` (half the compression) |
| `--tu` | r6: every fixed text size above 12 px and line box above 16 px | desktop `clamp(.92px, .92px + (100vw − 1366px) × .00008, .96px)`; 1 px on tablet, phone and Login |
| `--iu` | r6: icon boxes | = `--tu` on desktop |
| `--lu` | Login geometry, desktop | fitted card height / 936 |
| `--lt` | Login text | `.45px + .55 × --lu` |
| `--login-s` | Login photo scene | `--lu` on desktop, `.44px` in the tablet header (phone keeps its r2 card) |

Tablet and phone keep `--du`/`--lu` = 1 px; their compositions are designed separately (§ 14).

**r6 — browser zoom 100 % is the target.** The owner found the r5 desktop most comfortable at about
90 % browser zoom. Instead of asking users to zoom (or zooming the app), the real geometry was reduced
systemically: `--density-scale: .9` multiplies `--du` (sidebar, top bar, hero, KPI, paddings, row
pitches, table rows, control heights, footer), fixed text above 12 px follows `--tu` (.92–.96) and
icons follow `--iu`; text of 12 px and less never shrinks, and phones keep 1 px units (44 px touch
targets, 15–16 px reading sizes). Control floors: `--control-header` ≥ 34, `--control-lg` ≥ 32,
`--control-md` ≥ 30, `--control-sm` ≥ 28; sidebar ≥ 220 px. Measured (100 % zoom):

| Viewport | `--du` | Sidebar · top bar | Hero · KPI tile | Nav label · row title |
|---|---|---|---|---|
| 1280 × 720 | .774 | 220 · 59 | 96 · 137 | 13.8 · 12.4 px |
| 1366 × 768 | .774 | 220 · 59 | 96 · 137 | 13.8 · 12.4 px |
| 1536 × 864 | .815 | 220 · 62 | 100 · 142 | 14.0 · 12.6 px |
| 1920 × 1080 | .9 | 238 · 68 | 109 · 153 | 14.4 · 13.0 px |

(r5 at 1366 × 768: sidebar 240, top bar 65, hero 106, KPI 148, nav 15 px, row title 13.5 px — r6 is 8–10 % lighter.)

Login (r6): card ≤ 1152 × 792 (`880 / 1280 × --density-scale`), vertical air `clamp(24px, 8vh, 96px)`,
card height ≥ 480 px; zero scroll from 1280 × 657 up (a 1366 × 768 laptop's real Chrome viewport).

**Desktop viewport classes** — one fluid system; the classes only describe where it lands:

| Class | Viewports | `--du` | Shell (sidebar · top bar) | Notes |
|---|---|---|---|---|
| Short laptop | 1366 × 768 · 1536 × 864 (1920 × 1080 at 125 %) | .86 · .905 | 240 · 65–69 | Login card 676 / 760 tall |
| Standard desktop | 1440 × 900 | .92 | 243 · 70 | Login card 792 tall |
| Canvas | 1448 × 1086 | 1 | 264 · 76 | app pages = the references; Login card 880 (r5 cap) |
| Large desktop | 1920 × 1080 and up | 1 | 264 · 76 | composition stops growing: Login card max 1280 × 880; app content max 1680 px |
| Tablet (r5) | 1024 × 768 · 768 × 1024 | .86 · .94 | rail 80 · 76 | page header, KPI tiles, Dashboard blocks and Motion Study cards only |

**What flexes:** outer gutter and vertical margins (Login), vertical gaps between rows, hero and KPI
heights, card and section paddings, row pitches (action rows, legend, feed, projects, purchase lines),
table header and row heights, control heights (`--control-md` 36 → ≥ 32, `--control-lg` 40 → ≥ 34,
`--control-header` 42 → ≥ 36), sticky footer, shell dimensions (sidebar ≥ 240, top bar, nav pitch),
display and heading sizes within clamps. **What never flexes:** Inter and its weights, colours, radius
family, borders, shadows, icon family and stroke ratios, button language, motion, and body/small text
(15 px and below).

**Responsive typography clamps (desktop)**

| Role | Canvas | Clamp (runtime) | 1366 × 768 |
|---|---|---|---|
| Login display (r5) | 40 / 46 | `max(32px, 40 × lu)` / `max(36.8px, 46 × lu)` | 32 / 36.8 |
| Login title (r5) | 32 / 40 | `max(26px, 32 × lu)` / `max(32px, 40 × lu)` | 26 / 32 |
| Login lead, copy lead (r5) | 16 / 24 | `max(14.5px, 16 × lt)` / `max(21px, 24 × lt)` | 14.5 / 21 |
| Login labels · input · CTA · Google (r5) | 15 · 15 · 17 · 16 | floors 14 · 14.5 · 15 · 14.5 (× lt) | 14 · 14.5 · 15 · 14.5 |
| Login helper · divider · feature sub (r5) | 14 | `max(13px, 14 × lt)` | 13 |
| Login controls (field, CTA, OTP cell) (r5) | 50 | `max(44px, 50 × lt)` | 44 |
| Page title (03, 04), hero greeting (02) | 33 / 39–40 | `max(28px, 33 × du)` / `max(34px, 39 × du)` | 28.4 / 34 |
| KPI value | 22 / 28 | `clamp(16px, 100cqi / 7.9, 22 × dt)` / `28 × du` | 20.5 / 24 |
| Ageing figure | 27 / 36 | `max(24px, 27 × du)` / `36 × du` | 24 / 31 |
| Body, labels, meta, nav labels | 11–15 | fixed | unchanged |

**Fluid Login composition (r5).** Card height = `clamp(600px, 100vh − 2 × clamp(32px, 6vh, 72px), 880px)`;
width = `min(1280px, 100%, 1.25 × the REF aspect)`; outer margins are what remains. Results:
1366 × 768 → 1206 × 676 card, margins 45 / 47 / 80 / 80; 1440 × 900 → 1280 × 792; 1536 × 864 →
1280 × 760; 1920 × 1080 → 1280 × 880 centred (≈ 100 px above and below). Credentials, verification,
success and EN fit with **zero vertical scroll** at all four (and 1280 × 720). r4 had the card at
1260 × 707 on 1366 × 768 with 30 px margins; the owner still found it too large, so r5 caps the card,
gives the page 32–72 px of vertical air and makes the form one step quieter (50 px controls). The copy column and the photo art share the same unit, so the
canopy keeps its place against the feature copy; when the card is wider than the REF aspect the
landscape continues behind the foreground bush (mirrored ridge crops, mirrored sky haze, feathered
seams). The split auth transition reads the fitted geometry (scene unit from the art's width).

**Tablet Login strategy (768–1024 px).** Not the desktop split (too narrow) and not the phone stack:
one centred card (≤ 680 px) with an **editorial header** (brand 24 px, the step's headline 32 / 37,
the REF-M2 building anchored to the right edge at scene unit .44, 248 px tall) above the single form
column (52 px controls, 40 px side padding); the language toggle shares the title row. Each step swaps
its headline in the header; step changes use the compact swap (480 ms). 768 × 1024: card 645 × 918,
no scroll. The r2 leftover 180 px banner is gone. **Landscape tablets (r5):** 1024 × 768 is too short
for the stacked card, so the card splits into an editorial column (42 %: brand, headline, lead, the
building scaled to the panel height) and a 48 px form column; 942 × 680, 44 px above and below.

**Phone Login (r5).** A calm form page: brand + language on a quiet sky band (scene palette, no photo),
title 25 / 31, lead, form, Google, helper. The marketing card that followed the form was removed on
phones; desktop and tablet keep the editorial panel because it never competes with the form there.

## 6. Radius

`--radius-xs 4 · sm 6 · md 8 · lg 10 · xl 12 · full`. Cards 10; controls ≈ 0.18 × height (6 for
32–36 px, 8 for 40–48 px, 10 for 56 px); menus 10 with 6 px row highlights; sheets 16 on the top
corners only; pills full.

## 7. Elevation and shadows

| Token | Use |
|---|---|
| `--shadow-xs` | inputs |
| `--shadow-card` | cards (barely visible; the border carries the edge) |
| `--shadow-pop` | small floating chips |
| `--shadow-menu` | select popovers, menus |
| `--shadow-toast` | toasts |
| `--shadow-modal` | dialogs; sheets use a soft upward shadow |
| `--focus-ring` | 3 px olive halo at 35 % (fields); 2 px `--color-focus` outline (buttons, links) |

Scrim: `--mc-scrim` rgba(15,16,20,.32), optional `--mc-backdrop-blur` 4 px (palette).

## 8. Controls

| Control | Desktop height | Phone height |
|---|---|---|
| Button sm / md / lg / xl | 32 / 36 / 40 / 56 | 44 minimum; primary actions 48 (auth 52) |
| Text field | 36 (app) · 55–56 (auth) | `--m-control-h` 48 (auth 52) |
| Custom select trigger | as the field it sits in (32 / 36 / 42) | 44–48 |
| Select option row | `--select-row-h` 40 | `--select-sheet-row-h` 52 |
| Icon button | 24–36 visual, 44 hit area on touch | 44 |
| Bottom-nav item | — | ≥ 60 × 60 |

Every touch target on phones is ≥ 44 × 44 CSS px (validated with `tools/layoutcheck.py --targets`).

## 9. Cards

White surface, 1 px `--color-border-subtle`, radius 10, `--shadow-card`. Header = icon (20–32 box)
+ title (+ subtitle) + one action slot. One primary purpose per card. Phone: padding 16, headings
18, secondary cards may collapse behind a disclosure that shows their key figure.

### 9a. Section headings are text first (r9)

Card and section titles are text only. A decorative icon beside "Tindakan hari ini", "Umur piutang",
"Informasi Pembelian" and the like made every card compete for attention; hierarchy now comes from
type, weight and position. The title sits on the card's content edge and centres with the header's
right-hand control (link, select, badge, disclosure chevron). Icons stay where they carry meaning:
navigation, actions (buttons, row actions, link arrows, input affordances), status (pills, badges,
deltas, toasts), identity / content markers (KPI category discs, activity and action-row type discs,
avatars). Decorative heading icons are removed, not hidden, and are not replaced by other decoration.

## 10. Navigation

> **r12:** the navigation structure, the active-state contract, the drawer, the rail and the bottom-bar contents
> below are superseded by `docs/NAVIGATION_ARCHITECTURE.md` (one two-level tree; `aria-current` from
> `MCProject.navCurrent()`, `body[data-nav-section]` only a no-JS hint; drawer rendered from the tree; bottom bar
> per role). The visual tokens of this section (pill, indicator, ink, motion) still apply.

- **Desktop sidebar:** 8 primary items + "Khusus Owner" group; active = lime-150 pill + olive
  indicator bar + primary ink; the shell never animates, only the indicator moves (400 ms).
- **Top bar (r6):** only global controls — search with Ctrl K (the single entry to the command
  palette) and, on report pages, the period filter (§ 10.4). The "Pintasan" button moved to the account
  menu (keyboard shortcuts are reference, also on "?"), the account moved to the bottom of the
  sidebar; the freed space stays calm. Create Purchase shows search only (a report period has no
  meaning on a form).
- **Account (r6):** bottom of the sidebar (avatar, name, role, ⇕); tablet rail: avatar at the rail's
  bottom; phone: bottom of the drawer only (§ 10.7).
### 10.1 Mobile and tablet navigation model (r3)

Four concepts with four separate controls — never merged:

| Concept | Control | Responsibility |
|---|---|---|
| Frequent destinations | **Bottom navigation** (phone) | Beranda · Pembelian · Keuangan · Laporan; persistent on every normal authenticated page |
| Complete navigation | **Navigation drawer** (phone + tablet rail) | every destination the role may open (fixture = the desktop sidebar: 8 main + "Khusus Owner") |
| Hierarchical return | **Device / browser Back** (r9; an explicit app-bar Back only when a project enables `navigation.mobileBack`) | returns to the previous page of the tab, or to the parent section |
| Page actions | **Contextual sticky action bar** | actions of the current page; sits ABOVE the bottom navigation |

- **Phone app bar (r9):** Menu (≡) at a fixed leading position, the brand, search (palette) — on
  every app page, nested ones included. No explicit "Kembali": device / browser Back, the swipe
  gesture, the drawer and the bottom navigation already return, so a permanent Back only added a
  control. A project whose workflow browser history cannot represent (standalone app, deep task flows)
  sets `navigation.mobileBack: true`; the app bar then shows a labelled "← Kembali" (hairline after
  Menu, in place of the brand) to `body[data-nav-parent]`. r6: no account avatar in the app bar (the
  account lives at the bottom of the drawer). Desktop / tablet keep the breadcrumb trail.
- **Bottom navigation:** icon 22 in a 54 × 30 pill + label 11.5 / 500; active = lime-150 pill +
  primary ink 600; 60 px + `env(safe-area-inset-bottom)`. It stays visible on task pages; Create
  Purchase stacks: content → action bar → bottom navigation → safe area.
- **Active state contract:** `body[data-nav-section]` names the canonical parent section (nested pages
  inherit it: Pembelian → Buat Pembelian → Detail Pembelian all = `pembelian`). Bottom navigation and
  drawer items carry `data-nav-key`; a section outside the four bottom-nav keys (Proyek, Gudang,
  Dokumen, Data Master, Tinjauan & Aktivitas, Pengaturan, or `none` for the motion study) activates
  no bottom-nav item. Choosing a primary destination in the drawer updates both before navigating.
- **Drawer:** enters from the left like the desktop sidebar; `min(86vw, 340px)` wide, full height,
  safe-area padding, white surface, 1 px subtle edge, soft 8/32 shadow; header (brand + close 44),
  48 px rows (icon 22 + label 15 / 500), active = lime-150 + 3 px olive indicator + 600, subtle
  role-group label (12.5 / 500 tertiary); r6: the account block (avatar 38, name, role, chevron)
  closes the drawer at the bottom and expands the account actions above itself; the old immediate
  "Keluar" link is gone. Internal scroll; page behind is inert and scroll-locked.
- **Tablet (768–1024 px):** the icon rail stays (no compressed desktop sidebar); a full-navigation
  button (≡, 44 px) under the logo opens the same drawer with labels. 1025–1199 px shows the full
  sidebar. Tablet has no bottom navigation.
- **Role-aware rule:** The Golden Reference fixture menu is **NOT** the final production authorization
  matrix. Production MULTIPLECORP navigation must later be derived from canonical role / permission /
  navigation contracts — the drawer, the bottom navigation and the section keys alike. The drawer is
  built from one navigation source (in the lab: the page's sidebar), never hand-maintained per screen;
  a role without access to a section simply does not receive that item.

### 10.2 Responsive review approach (r3–r5)

One responsive implementation (`pages/*.html`). `review/index.html` is a 4 pages × 11 viewports matrix
of wrappers (`review/<mode>/<page>.html`; modes `desktop-1280` 1280 × 720 (r6), `desktop-1366` 1366 × 768, `desktop-1440` 1440 × 900,
`desktop-1536` 1536 × 864, `desktop-1920` 1920 × 1080, `desktop` = the 1448 × 1086 reference canvas,
`tablet` 768 × 1024, `tablet-landscape` 1024 × 768, `mobile-390` 390 × 844, `mobile-430` 430 × 932,
`mobile-440` 440 × 956) that frame the canonical page in an iframe of that exact viewport: media
queries, `vh` units, safe areas and scrolling behave as on the device; nothing is duplicated. By
default a frame larger than the window is shown scaled to fit both width and height (fixed bottom
bars are visible at once); "Ukuran asli" shows it 1:1 for the current visit only. r6 (wrapper defect,
not an app defect): r3–r5 stored the 1:1 choice in `localStorage` forever, so phone frames could stand
taller than the window (the bottom navigation appeared only after scrolling the *wrapper*) and wide
frames needed sideways scrolling; legacy keys are cleared and the wrapper page never scrolls in fit
mode. On a phone the wrapper shows a note linking to the canonical page. The scaling only affects the preview; the page
inside always lays out at the stated size. The wrappers themselves never scroll sideways on a phone. Each wrapper names the page, viewport,
exact size, review status and source file, links to the source directly, switches viewport/page,
fits to the window and reloads. Regenerate with `python tools/make_review.py`.

### 10.3 Brand configuration (r5)

Identity is configuration, not markup. r6: `assets/js/project-config.js` (which replaced
`brand-config.js`) holds the whole project — brand, locale, time, user, navigation, account, date
filter, features, tokens (`docs/PORTABILITY_CONTRACT.md`). Brand fields; every page marks slots and
the file fills them on load:

| Field | Meaning | Slots |
|---|---|---|
| `name` | application name (wordmark, titles, copy `{brand}`) | `[data-brand-name]`, login copy, `title[data-page]` |
| `short` | short name for tight places (title template of the QA fixture) | `{short}` |
| `company` | client / company display name | `[data-brand-company]` (greeting subtitle) |
| `logo` | full logo image (symbol + wordmark) or `null` | `[data-brand]` slots get `.mc-brand__logo` |
| `mark` | compact mark: sprite symbol or image | `[data-brand-mark]` (icon rail, collapsed sidebar, favicon) |
| `alt` | logo alternative text | logo `alt` when no labelled ancestor |
| `favicon` | browser identity | `link[data-brand-favicon]` |
| `title` | page-title template (`{page} · {name}`) | `document.title` |

Rules: logos are contained in fixed-height slots (never stretched; width capped per slot); the icon
rail always shows the mark; a name that does not fit steps down one size, then ellipsises with a
tooltip while the link keeps the full accessible name. r7: a project `mark` / `logo` replaces the
default **whole** (a `{ src }` mark no longer inherits the default sprite symbol); `display: 'short'`
puts the short name in name slots; logo and wordmark assets are vector paths only (no SVG `<text>`,
no installed-font dependency) and the name as text is always rendered by the app in Inter.
Accessible labels are templates
(`data-brand-label="{name}, ke Beranda"`). UI built later (drawer, i18n copy) calls
`MCBrand.apply(root)` / `MCBrand.fill(text)`. QA: `?project=nusantara` (alias `?brand=`) previews the
alternate project (wide horizontal logo 5.5 : 1, square image mark, long names, Finance role with its
own navigation and bottom bar, teal brand tokens, Asia/Makassar, EN Login without the photo scene)
for the tab; `?project=longname` previews a long name without a logo (mark + name,
step-down, ellipsis + tooltip); `?project=default` returns. MultipleCorp stays the default project.

### 10.4 Date range filter and its semantics (r5)

One reusable period filter replaces the month-only select (top bar on every app page; a chip in the
phone greeting; cards follow it instead of carrying their own period select). Presets: **Hari ini ·
7 hari terakhir · 1 bulan terakhir · Bulan ini · Bulan lalu · Rentang kustom**. The trigger names the
active selection ("Hari ini", "7 hari terakhir", otherwise dates such as "1–31 Okt 2026" or
"15 Sep – 14 Okt 2026"); English: Today, Last 7 days, Past month, This month, Previous month, Custom
range with dates "1–31 Oct 2026". Prototype semantics (projects bind these to their reporting
contract later):

| Preset | Range |
|---|---|
| today | `MCTime.today()`: the project-timezone date from the shared time provider (r7; tests and evidence inject 14 Okt 2026 09:00 WIB) |
| Hari ini | [today, today] |
| 7 hari terakhir | [today − 6 days, today]: rolling, inclusive, today included |
| 1 bulan terakhir | [same day last month + 1 day, today]: rolling month; the day clamps to the shorter month (31 Mar → 1–31 Mar) |
| Bulan ini | [1st, last day of this month]: the calendar month; data naturally runs to today (month-to-date figures) |
| Bulan lalu | the previous calendar month |
| Rentang kustom | explicit inclusive [start, end] inside `dateFilter.min` … `dateFilter.max` (r7: relative, default `startOfYear-2` … `endOfYear+1`, so planned periods are allowed); end ≥ start |

**True custom range (r6).** The r5 picker behaved like two adjacent months. Now START and END are
independent: each has its own calendar with a month picker, a year picker (min … max) and previous /
next, so any pair works — 14 Okt → 14 Okt, 15 Sep → 14 Okt, 20 Jul → 12 Des 2026, 15 Des 2026 → 20 Feb
2027, 1 Jan 2025 → 31 Des 2026 — without stepping month by month. Desktop (≥ 1100 px): popover =
presets | Mulai calendar | Selesai calendar (two months that need not be adjacent; equal months show
Selesai one month later). Tablet popover and phone bottom sheet: a Mulai / Selesai switch above one
calendar (never the desktop pair squeezed). States: no start → "Pilih tanggal mulai"; one edge →
the other edge's prompt with a hover preview; both → inclusive highlight + day count ("20 Jul – 12 Des
2026 · 146 hari"). Selesai days before Mulai are unavailable; a new Mulai after Selesai clears Selesai
with a notice. Terapkan only for a complete valid range; Batal / Esc never commit; reopening shows the
committed state. Entering "Rentang kustom" from a preset starts empty (calendars positioned on the
current period).

**The page reacts (r7, DEMO / FIXTURE).** Committing any range re-renders the dashboard from a
deterministic sample variant: KPI values, deltas (tone and sr-only "Naik / Turun"), comparison labels
("dari Sep 2026", "dari 17 hari sebelumnya"), sparklines, the ageing total + bar + legend (always equal
to the receivable KPI) and the "per <date>" caption (the earlier of range end and today). The base
period restores the authored fixture exactly. No accounting meaning is implied; production replaces
the block with its query layer. Relative presets follow `mc:timechange` (a new day moves "Hari ini").

### 10.5 Feedback: toasts, inline status, live regions (r5)

- **Toast** (`MCToast`) for events that have no field to attach to: saved, synced, failed to sync,
  source applied. Desktop / tablet top-right under the top bar; phone below the app bar, full width
  inside the gutters. Success / info auto-dismiss (4.5 s, paused on hover / focus); warning / error
  stay until closed. Max three, newest on top. Never colour alone (icon + title).
- **Inline** for anything the user must fix: field errors, the purchase action-bar error summary,
  upload errors. Inline confirmations (upload success) are not repeated by a toast.
- **One event, one message:** a successful save shows its toast and the button's check morph; the
  action bar no longer prints "Draf tersimpan" as well.
- Every status change is announced (polite live region; errors assertive).

### 10.6 Buttons, statuses, redundancy and copy density (r5)

- **Action hierarchy:** one primary per view (dark green), one secondary (outline), tertiary as ghost
  or text link, destructive = solid red on the confirming button only (r6 `.mc-btn--danger`), rare
  actions in an overflow menu. Create Purchase: Simpan dan lanjutkan / Simpan sebagai draf / Batal
  (ghost) — layout in § 10.9.
- **Buttons:** one geometry per role and size (`docs/COMPONENT_RULES.md` › Buttons); pages only
  position them.
- **Statuses:** a badge carries one dimension (state, severity, completion, attention, trend), uses a
  word plus dot / arrow / tint, and never repeats the line beside it.
- **Redundancy:** one intent, one control in a context (r5 removed: the chevron that duplicated each
  "Tindakan hari ini" action, the "Tambah barang" button that duplicated "Tambah baris", the per-card
  period select). r6 removed: the top-bar "Pintasan" button (it emitted an event nobody handled; the
  shortcut reference now lives in the account menu and on "?"), the top-right account (it duplicated
  nothing but competed with the period filter; the account moved to the sidebar bottom), the phone
  app-bar avatar, the drawer's immediate "Keluar" link, and the report period on Create Purchase.
  The command palette keeps a "Keluar" command (it is the universal keyboard command layer) and it
  goes through the same confirmation. Back, Menu, bottom navigation and the action bar are four
  different jobs and stay.
- **Copy:** cut explanations of obvious controls, repeats of headings / statuses, and marketing inside
  operational screens (r5 removed the motivational quote everywhere, the "Tindakan" intro sentence,
  the "Barang yang dibeli" subtitle, the phone greeting subtitle and the phone Login marketing card).
  Keep text that prevents mistakes, explains a constraint, supports a decision or warns.

### 10.0 r10: page patterns, risk levels, long text, live status
Module screens are built from the page patterns in `assets/css/patterns.css` / `assets/js/patterns.js`
(catalogue + archetypes: `docs/COMPONENT_CATALOG.md`). The confirmation rule below is now the
four-level risk policy (LOW / COMMIT / DESTRUCTIVE / CRITICAL, `MCRisk`; rationale D-09 in
`docs/DESIGN_DECISIONS.md`); long text and live status rules are D-11 / D-12. The account menu entries
are "Akun Saya", "Pintasan keyboard" (pointer devices) and "Keluar" (D-03).

### 10.7 Account, logout and the confirmation rule (r6)

- **One account entry point per context:** desktop sidebar bottom (stays visible when the navigation
  scrolls on short screens); tablet rail bottom (avatar); phone drawer bottom (the only phone entry;
  never top-right, never in the bottom navigation, never floating).
- **Account menu** (`role="menu"`; opens above the sidebar trigger, to the right of the rail): personal
  and session actions only — Profil saya, Pengaturan akun, Pintasan keyboard (pointer devices),
  separator, Keluar (danger tone). Organisation destinations (r12: Tinjauan Owner, Riwayat Aktivitas, Log Keamanan, Pengaturan) stay in
  the role navigation so nothing has two homes. Entries are project- and role-configurable.
- **Logout** never happens on one click: Keluar → confirmation dialog "Keluar dari akun?" / "Sesi aktif
  Anda akan diakhiri. Simpan dulu pekerjaan yang belum disimpan." → Batal (outline, focused) | Keluar
  (solid danger). Esc and the scrim cancel and return focus. Confirming emits `mc:logout` (cancelable)
  and lands on the Login, which says "Anda telah keluar" once.
- **Application-level dialogs (r9):** a confirmation is a modal of the APPLICATION, not of the control
  that opened it: full-viewport scrim, card centred on the (visual) viewport on desktop, tablet and
  phone (safe 16 px margins), compact (400 px), strong title, one concise sentence, no decorative
  icon. From the drawer, the account section and the drawer close first; from the sidebar account
  menu, the menu closes first. Never anchored near the account block or inside the drawer.
- **Confirmation rule (reusable):** ask a second time only for logout / session termination,
  destructive deletion, meaningful irreversible operations and actions likely to lose data (Create
  Purchase "Batalkan pembelian" after an edit asks "Batalkan pembelian?" — "Perubahan yang belum
  disimpan akan hilang." — Kembali | Batalkan pembelian; without changes it simply leaves).
  Never for ordinary low-risk actions — confirmation fatigue erodes the warnings that matter.

### 10.8 Dynamic greeting and time (r6)

The greeting is data: `MCTime` band (project timezone, default Asia/Jakarta) + the project user's name.
Bands 04:00–10:59 Selamat pagi · 11:00–14:59 Selamat siang · 15:00–17:59 Selamat sore · 18:00–03:59
Selamat malam (EN Good morning / afternoon / afternoon / evening); the glyph follows (sun, sun, sunset,
moon). Built on `Date` + `Intl.DateTimeFormat` with the IANA zone. The time provider is replaceable
(`MCTime.setNowProvider`, `window.MC_TIME_NOW`) so production can bind server time and tests never
depend on the wall clock.

**One time source (r7).** The r6 split (greeting on the device clock, date filter on a fixed fixture
"today") is gone. Greeting, "Hari ini" and every relative preset, the calendar today marker, the
filter limits, the dashboard "per" caption and toast save times all read `MCTime`; one shared minute
clock in `project-config.js` fires `mc:timechange` when the band or the day changes, and each consumer
follows. At runtime the page shows the real date (`evidence/final/r7/today-runtime-provider-final.png`);
tests, captures and probes inject `2026-10-14T09:00:00+07:00`
(`today-fixture-provider-final.png`). Checked bands: 08 pagi, 12 siang, 16 sore, 20 malam, 02 malam.

### 10.9 Action footer and card proportionality (r6)

- **Create Purchase action region (r9):** desktop = "Total pembelian" + total (left) and ONE split
  primary action `[ Simpan dan lanjutkan | ˅ ]` (right), aligned with the card column (max 1680 px),
  ≤ 56 px tall. The chevron opens "Simpan sebagai draf" · separator · "Batalkan pembelian" (danger);
  the primary is never repeated in the menu. Phone = total row + the split action at full width above
  the bottom navigation; its menu opens upward (48 px rows) and never covers the bottom navigation.
  Fewer simultaneous actions: one obvious next step, secondary choices one tap away.
- **Item actions (r9):** "Tambah dari katalog…" (search an existing product) and "Tambah baris" (an empty
  row) sit together in the Barang header — two distinct actions in one group; the add-row strip under
  the table and its keyboard hint row are gone (Alt+N stays: tooltip, palette, shortcuts reference).
- **Cards take their height from the row, never from a filler:** Nilai proyek centres its donut +
  legend group in the free width and height (share next to its amount); list cards in the three-up row
  share extra height across their rows instead of leaving a blank band under the last row. Premium
  negative space is intentional; dead unexplained space is a defect. r7: "Tindakan hari ini" follows
  the same rule beside a taller ageing card, keeping a REF-sized gap under its last row (the r7 audit
  measured the space under the last content of every card at every desktop and tablet size; the
  remaining case, a 49 px end gap in a 1005 px Motion Study card paired with a taller one at 1920, is
  the equal-height row rule, not dead space).

### 10.10 Phone progressive disclosure (r9)

On phones a substantial section can fold behind its header row: text title, optional short summary,
chevron on the right; the whole safe header row is the target, the one real button carries
`aria-expanded` / `aria-controls`. Tablet and desktop never become accordions. Defaults are project
configuration (`mobileDisclosure` in project-config.js: 'open' | 'collapsed' per section key):
sections with the current step's required fields start open (Create Purchase: Informasi Pembelian,
Barang), secondary ones collapsed (Lampiran, Ringkasan — the total stays visible in the action bar;
Dashboard: Umur piutang, Proyek berjalan, Nilai proyek). An invalid required field is never left
hidden: validation opens its section, focuses the field and announces the error. Use disclosure when a
section is substantial, may be temporarily irrelevant and collapsing materially improves scanning;
never collapse tiny blocks, essential immediate actions or status / error messages.

## 11. Charts

Drawn from data (inline SVG). Palettes: ageing `#99b1a0 #edd798 #cbac8d #d56e5b #a9322e`; categorical
`#7e9e85 #82adc9 #e6d6c5 #dadee0`; progress `#94a469 #89b3cd #ccaf90` on `#e6e8eb`. 2 px white
segment gaps, 1.5 px sparkline with an area fill fading to 0, donut ring 16 % of the diameter, no
axes inside cards. Phone: sparklines move to the KPI tile's top-right (30 px tall); bar/donut charts
live inside disclosures and keep their legend.

## 12. Iconography

One original outline family (`assets/js/icons.js`, inline sprite, works from `file://`), 24 grid,
round caps/joins, stroke 1.75 at 20–24 px and 1.5 at 16 px, colour = `currentColor`. Tinted icon
discs 56 / 52 / 42 / 40 / 36 / 32 with the glyph at 0.4–0.5 × the disc. New in r2: `i-image`,
`i-refresh`; r3: `i-menu`.

## 13. Imagery

Photographic placeholders (login scene, dashboard hero building, project thumbnails) are crops of the
approved mockups (`assets/img/SOURCES-*.md`), blended with CSS gradients. Replace with licensed
photography in production; keep the fixed-image / moving-clip behaviour on login.

## 14. Responsive principles

1. **Same tokens, different composition.** Phone values are tokens (`--m-*`, `--touch-min`,
   `--safe-*`); no page-level magic numbers for shared behaviour.
2. **Prioritise, don't stack.** Phone pages reorder by importance through DOM order and disclose
   secondary detail (dashboard charts, motion-study specs) instead of printing the desktop page
   vertically.
3. **Tables become item cards** below 1024 px; each field keeps its label.
4. **Selects become bottom sheets** on phones; dialogs and drawers become bottom sheets; the command
   palette becomes a top sheet.
5. **One sticky action region** on task pages (summary total + two actions) that sits above the
   persistent bottom navigation; content bottom padding = action bar + bottom navigation + safe area.
6. **Touch:** ≥ 44 px targets, tap wording ("Ketuk untuk memilih file"), drag and drop only as an
   extra on pointer devices.
7. **Safe areas** (`--safe-top/right/bottom/left` from `env(safe-area-inset-*)`): app bar (top +
   sides), bottom navigation (bottom + sides), action bar (offset by the bottom navigation and the
   bottom inset), drawer (top, bottom, left), bottom sheets (bottom), toasts (above both bars).
8. **No horizontal page scroll** from 360 px up; only data tables may scroll horizontally within
   their own container (motion-study spec tables; the Create Purchase table only between 1025 and
   ~1045 px, by ≤ 4 px).
9. **Fit the viewport, not the canvas** (r4). Desktop geometry is canvas px × a runtime unit
   (§ 5.1); the Login never needs vertical scrolling on common desktops; long pages may scroll but
   show useful work above the fold. r6: browser zoom 100 % is the design target.
10. **Text fields are 16 px on touch devices (r6).** iOS Safari zooms the whole page when a focused
    field's text is smaller than 16 px and keeps it zoomed after blur: the visual viewport becomes
    narrower than the layout viewport, the page pans sideways and the fixed bottom navigation leaves
    the visible area. This, not a layout overflow, was the owner's "sideways scrolling / bottom nav
    missing" on a real phone (the Create Purchase fields were 15 px, the catalogue search 13.5 px).
    `viewport-fit=cover` is set so the safe-area insets are real on notched phones.

## 15. Do / Don't

**Do**
- Use tokens for every colour, size, radius, shadow, duration and easing.
- Keep one primary (dark green) action per view; secondary actions are outline/ghost.
- Use lime only for selection, attention and the current step.
- Compute figures from data; format with `id-ID` (Rp202.200.000, 42,2 %).
- Keep desktop REF-M1/M2/M3 geometry when adding features; extend through components.
- Collapse secondary information on phones behind a disclosure that still shows its key figure.
- Write new desktop geometry as canvas px × `--du` (or the Login units); check it on 1366 × 768 and
  on the 1448 × 1086 canvas (`review/`).

**Don't**
- Don't introduce a second theme (no REF-V2 black/yellow, no REF-V1 blue/teal, no bright blue phone theme).
- Don't add shadows to separate cards, or borders around every element.
- Don't make everything semibold or enlarge type to "fix" mobile.
- Don't squeeze desktop tables onto phones or depend on drag and drop.
- Don't let contextual actions replace the bottom navigation, or merge Back, Menu, bottom navigation
  and page actions into one control.
- Don't put decorative icons beside section titles, don't spread three unrelated buttons across an
  action bar (one split primary action), and don't add a permanent in-app Back on phones unless the
  project's workflow needs it (`navigation.mobileBack`).
- Don't anchor a confirmation dialog to the drawer or the account block; it is application-level.
- Don't hand-maintain navigation per screen; build it from one source (production: role/permission contracts).
- Don't treat a reference canvas as a runtime size, and don't fit pages with `zoom`,
  `transform: scale()`, rasterised UI or scaled iframes; don't shrink body text to make things fit.
- Don't hard-code a brand, a role menu or a timezone: they come from `project-config.js`
  (`docs/PORTABILITY_CONTRACT.md`).
- Don't put the account top-right, in the bottom navigation or floating; don't log out on one click.
- Don't confirm ordinary low-risk actions (confirmation fatigue).
- Don't give a text field less than 16 px on touch devices.
- Don't add quotes, slogans or marketing copy inside operational screens.
- Don't give one intent two controls (button + chevron, two add buttons, a card-level period select).
- Don't report a success twice (inline text and a toast), or put a fixable error only in a toast.
- Don't use raw browser `<select>` menus where a styled menu is visible (use the custom select).
- Don't animate on scroll, use parallax outside the auth step, or add bounce/confetti.

## r13 harmony — symmetry, bands and spacing rhythm
- **Panels side by side start on one line** and their header bands share one height and one tone (composer: stepper
  band ↔ preview toolbar, 52 px + hairline). Optical balance comes from shared edges, not equal heights.
- **Separation without weight**: a tonal band (sunken 62 % on white) + a hairline separates a navigator from its
  content; no extra card, no stronger shadow. Sections inside a working card are bands divided by hairlines.
- **Rhythm**: page head → 16 px → context line → 16 px → workspace; inside a card 16–20 px (`--card-padding`) sides,
  14–16 px between a band and the first content line. Icons that qualify a heading sit inside it, centred on its line.
- **Numbers**: sequence positions are quiet (tabular, tertiary ink), business numbers are content (primary ink).
