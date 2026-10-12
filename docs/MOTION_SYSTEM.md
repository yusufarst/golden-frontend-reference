# MULTIPLECORP Motion System — Golden Reference r9

Status: FREEZE CANDIDATE — PENDING OWNER VISUAL APPROVAL. r6 adds the account menu, the drawer
account section, the confirmation dialog, the true date-range pickers and the greeting update. r7
adds no new animation: it fixes what moves when (disclosure hit area, period response, shared clock)
and keeps every existing duration and curve. r9 reuses existing recipes for the phone section
disclosures, the split-action menu and the application-level dialog sequence (drawer out, dialog in).

Tokens: `assets/css/tokens.css` (`--mc-dur-*`, `--mc-ease-*`, `--mc-stagger-*`, `--mc-*-scale`,
`--mc-scrim`). CSS motion: `assets/css/motion.css`. Timelines: `assets/js/interactions.js` (WAAPI,
reading the same tokens at run time). Live demonstrations: `pages/04-motion-study.html` (desktop and
phone). Decoding evidence: `analysis/motion-analysis.md`, `analysis/video-*-contact-sheet.png`.

Personality: **quiet, exact, never decorative.** Motion explains a change of state; it never
entertains. No camera-style zoom/pan, no dips to black, no speed ramps, no bounce, no confetti,
no animation tied to ordinary scrolling.

---

## 1. Provenance

| From REF-V1 (login video, decoded at ~2× playback) | From REF-V2 (application video) |
|---|---|
| Auth panel transition on one clock, `cubic-bezier(.42,0,.58,1)`, ≈ 600 ms real time | Page-state recipe: shell never moves, content exits by opacity + small blur, active indicator moves in a fixed 400 ms |
| Hidden content swap at progress 0.5 | Command palette: fast opacity, height reveal from a fixed centre, results stagger |
| 2× copy parallax (panel copy exits by ≈ 0.27, enters from ≈ 0.73) | Non-modal side panel: clip/width reveal from its centre (easeOutQuart family) |
| Image/gradient fixed to the card while only the clip moves | Container entrance: fade + scale 0.96–0.975 → 1 + rise, then contents |
| Inner-edge shape changes on the same clock | Feedback: press scale, cross-fade state morphs, opacity-only toast exit, count roll |
| — | Selection ring, row removal (fade + collapse) |

Not copied: REF-V1 palette, branding, registration flow, its 2× time compression, 25-fps judder;
REF-V2 camera moves, editing dips, black/yellow theme.

## 2. Duration tiers

| Token | Value | Use |
|---|---|---|
| `--mc-dur-instant` | 80 ms | press-in, hover tint in, overlay opacity-in |
| `--mc-dur-hover` | 140 ms | hover colour changes (r2, 120–180 ms brief) |
| `--mc-dur-fast` | 160 ms | release, state morphs, select menu open, selection ring |
| `--mc-dur-state` | 200 ms | component state change (upload panel, success acknowledgement) |
| `--mc-dur-base` | 240 ms | item reveal, page exit, toast exit, sheet close, scrim |
| `--mc-dur-moderate` | 320 ms | dialog open, container transform, disclosure chevron |
| `--mc-dur-sheet` | 320 ms | bottom sheet in (phone select, dialog, drawer) |
| `--mc-dur-check` | 360 ms | success check stroke (300–400 ms brief) |
| `--mc-dur-slow` | 400 ms | nav indicator, palette height, side-panel reveal, shared-element morph |
| `--mc-dur-auth-compact` | 480 ms | single-column auth step swap (phones/tablets) |
| `--mc-dur-auth-step` | 600 ms | desktop auth panel (REF-V1 real-time baseline, owner decision 5) |
| `--mc-dur-reduced` | 150 ms | reduced-motion crossfade |

Budget: data-ready → last element ≤ 900 ms; total stagger in one group ≤ 300 ms.

## 3. Easing

| Token | Curve | Use |
|---|---|---|
| `--mc-ease-standard` | `cubic-bezier(.42,0,.58,1)` | persistent moves: auth panel, nav indicator, morphs, disclosure chevron |
| `--mc-ease-enter` | `cubic-bezier(0,0,.2,1)` | entrances, popovers, toasts, success glyph |
| `--mc-ease-reveal` | `cubic-bezier(.25,1,.5,1)` | clip/height reveals: palette, side panel, bottom sheets |
| `--mc-ease-exit` | `cubic-bezier(.37,0,.63,1)` | opacity-out, sheet close |
| `--mc-ease-emphasis` | `cubic-bezier(.34,1.45,.64,1)` | one highlighted datum per view only (dashboard bar) |
| linear | — | scrims, progress bars, spinners, reduced motion |

## 4. Patterns

### Hover
Background/border tint only, `--mc-dur-hover` in, `--mc-dur-fast` out. Rows: `--color-row-hover`;
menu options: `--color-row-press`; never move layout on hover. Touch devices: no hover dependency.

### Press
Buttons scale to `--mc-press-scale` 0.97 in 80 ms and release in 160 ms (`--mc-ease-standard`); rows
and list items use a tint (`--color-row-press`), not a scale; stretched-link cards do not scale.

### Focus
Instant (0 ms). Fields: 3 px olive halo (`--focus-ring`) on the bordered box; buttons/links: 2 px
`--color-focus` outline with 2 px offset; bottom-nav: ring around the icon pill. Never animated.

### Custom select (r2)
Desktop popover: opacity 0 → 1 with translateY ∓4 px and scale .98 → 1, 160 ms `enter`
(origin at the trigger side); close: opacity 120 ms. Chevron rotates 180° in 160 ms. Options:
active tint 80 ms in. Phone sheet: scrim 240 ms linear, sheet translateY(100 %) → 0 in 320 ms
`reveal`; close 240 ms `exit`. Reduced motion: 150 ms fade only.

### Upload (r2)
| Transition | Motion |
|---|---|
| idle → hover | zone tint + border, 140 ms |
| → dragover | olive solid border + lime wash, 140 ms; lead text swaps to "Lepaskan untuk mengunggah" |
| → selected / processing | file panel enters (opacity + 4 px rise, 200 ms `enter`); spinner; progress bar width 120 ms linear steps |
| → success | ring stroke draws 360 ms `enter`, check mark follows (216 ms from 180 ms), glyph fades/scales .85 → 1 in 200 ms (no overshoot); panel washes to `--color-success-bg` then settles to a calm 38 % tint over 600 ms |
| → error | 6 px horizontal settle of the alert glyph (200 ms, once), danger tint |
| remove / replace | panel hides instantly; focus returns to the file input |
Reduced motion: no stroke drawing, 150 ms fades, slower spinner.

### Modal / dialog
Desktop: scrim fade 240 ms linear; panel opacity 80 ms + rise 8 px and scale .97 → 1 in 320 ms
`enter`; exit opacity + scale .98 in 160 ms. Focus trap, Esc, focus returns. **Phone:** bottom sheet
(translateY 100 % → 0, 320 ms `reveal`; exit 240 ms `exit`), full width, safe-area padding.

### Drawer / side panel
Modal drawer (desktop): translateX(100 %) → 0 in 320 ms `enter`, scrim; exit 240 ms. Non-modal side
panel (REF-V2): clip reveal from its centre (starts at 3 % width) in 400 ms `reveal`, opacity in
80 ms, content stagger ≈ 90 ms. **Phone:** a modal detail drawer becomes a bottom sheet (same recipe as the
dialog). The navigation drawer is the exception: it stays a left drawer (see below).

### Command palette
Ctrl/Cmd+K, the top-bar search or the phone app-bar search. Scrim ≈ 32 % + 4 px backdrop blur;
panel opacity 80 ms, height reveal from a fixed centre 400 ms `reveal`; input chrome after 160 ms;
results stagger 40 ms per row (max 8); highlight follows keyboard/pointer (80 ms in / 160 ms out);
Enter selects, Esc closes faster (reverse). **Phone:** top sheet (8 px from the safe top, full width).

### Page-state transition
Shell and indicator stay; old content exits by opacity + 3 px blur in 240 ms (no transform); the
active pill slides in a fixed 400 ms `standard`; new content enters with the restrained stagger.
Navigation between pages: exit plays, then location changes; entrance on load.
r13 (persistent shell over HTTP, `docs/PERSISTENT_SHELL.md`): **exit ∥ fetch → swap → entrance**. The same 240 ms
content exit (and pill slide) runs while the next page is fetched (no artificial delay: the swap waits only for the
longer of the two); the page is swapped while hidden and the Golden entrance stagger replays on the real content; the
shell (sidebar, groups, account, top bar) never animates and is never replaced. Reduced motion: the in-place swap is
instant (R13_SPEC §1) — no exit, no artificial wait: the old page stays fully visible (inert, `aria-busy`) until the
next page and its module CSS are ready; the region is then hidden only while the page module script(s) load and run
(1–2 painted frames, ≈ 60–90 ms from the last old frame to the first new one on the lab laptop) and appears at full
opacity in one frame, its children with the reduced entrance below (150 ms linear fade). Exact timeline:
`docs/PERSISTENT_SHELL.md` §3 Motion. On `file://` the r12 sequence above is unchanged.

### Auth panel (REF-V1)
**Desktop (≥ 1025 px):** the visual panel slides over the form on one 600 ms `standard` clock; forms
move opposite; content swaps hidden at p = 0.5; copy parallax 2× (out by 0.27, in from 0.73);
imagery fixed to the card (counter-translated); inner-edge radius flips at 0.5.
**Phone/tablet (≤ 1024 px, r2 compact):** old step opacity 1 → 0 and 0 → −24 px over 0–45 %, both hidden
45–55 % (swap at 50 %), new step from +24 px over 55–100 %; the information card's copy travels 48 px
(2× parallax) while its photo stays fixed; 480 ms `standard`; direction mirrors for "Kembali".
Authenticated: success check scale .8 → 1 in 200 ms, no overshoot. `mcAuth.seek(from, to, p)`
freezes any frame for review.

### Stagger
Containers first (fade + scale .975 → 1 + rise ≤ 8 px), then contents; 30 ms (tight), 40 ms (rows),
60 ms (cards); max 8 steps per group; phone keeps the same values (no extra entrance animation on
scroll).

### Loading
Spinner (`mc-spin`, 900 ms linear) only for waits > 300 ms; buttons keep their width (label swaps to
spinner); skeleton shimmer is not used.

### Success / status
Toast (r5, `MCToast`): placed at the top (desktop / tablet top-right under the top bar, phone below
the app bar), so it enters with opacity + an 8 px drop on the enter curve (240 ms) and exits
opacity-only (240 ms); success / info stay 4.5 s, warning / error until closed; reduced motion: 150 ms
fades; the timer pauses on hover / focus. The motion-study stage keeps its contained preview. Status pills cross-fade (160 ms). Save buttons: spinner → check morph (160 ms). Counts
roll per digit (60 ms stagger). Upload success as above.

### Phone shell
Bottom-nav state: colour + icon-pill tint, 160 ms, no movement. App-bar hairline appears when
content is under it (class switch, no scroll-linked animation). Disclosures: chevron rotates in 320 ms
`standard`, body fades in 240 ms `enter` (no height animation to keep layout calm). r7: hovering or
pressing anywhere on the header row shows the button's own row-hover / row-press tint (the row
forwards to that button); a click on the row plays the identical open / close (one state change,
never two). r9: the same recipe serves every phone section disclosure (Create Purchase included); a
section opened by validation or Alt+N opens without animation (the user is being taken to a field).

### Date range filter (r5)
Desktop / tablet popover: opacity 0 → 1 with translateY(−4 px) and scale .985 → 1 in 160 ms `enter`
(origin top-right, under its trigger); close 120 ms opacity. Switching to "Rentang kustom" widens the
popover without animation (the content changes in place). Chevron on the trigger rotates 180° in
160 ms. Day and preset tints 140 ms. Phone: the bottom-sheet recipe (scrim 240 ms linear, sheet
translateY(100 %) → 0 in 320 ms `reveal`, close 240 ms `exit`). Reduced motion: 150 ms fades.

Custom range (r6): picking a day, switching Mulai / Selesai and opening the month / year pickers
re-render the calendar in place (no slide, no crossfade): the user is reading dates, motion would
only delay them. Picker toggle chevrons rotate 180° in 160 ms. Hover preview of the range is an
instant tint (no transition) so it tracks the pointer.

### Account menu (r6)
Opens above the sidebar trigger (to the right of the rail): opacity 0 → 1 with translateY(4 px)
(rail: translateX(−4 px)) in 160 ms `enter`; closes with a 120 ms opacity fade; focus moves to the first
item at once (no delayed focus). Drawer account section: the actions fade in with translateY(6 px)
in 200 ms `enter`; the chevron rotates 180° in 320 ms `standard`. Reduced motion: 150 ms fades.

### Confirmation / information dialog (r6)
Scrim 0 → 1 in 240 ms linear; card opacity 0 → 1 with translateY(6 px) and scale .98 → 1 in 200 ms
`enter` (a short, settled entrance: the dialog asks a question, it should not perform). Close: 160 ms
opacity fade of the whole layer. No bounce. Reduced motion: 150 ms fades. r9: from the drawer the
sequence is sequential, never stacked: the drawer closes (240 ms `exit`), then the dialog enters,
centred on the viewport.

### Split action menu (r9)
Opens upward from the action bar: opacity 0 → 1 with translateY(4 px) in 160 ms `enter` (the account
menu recipe); closes at once. The chevron turns 180° in 160 ms `standard`. While a draft saves, the
chevron segment shows the shared spinner (`--mc-dur-spin`). Reduced motion: no translate, no chevron
turn; the spinner slows.

### Greeting (r6)
The band (pagi / siang / sore / malam) changes text and glyph without animation at the next minute
boundary: a time-of-day label is ambient information, not an event. r7: the boundary comes from the
one shared clock (`mc:timechange`, fired only when the band or the day changes); "Hari ini" and the
relative presets update in the same tick, also without animation.

### Period response (r7)
Committing a range swaps the dashboard figures, deltas, comparison labels, sparklines, ageing bar and
legend in place in one frame: no count-up, no crossfade, no skeleton. The filter is a deliberate
choice and the result must be readable at once; animating numbers would suggest live data that the
DEMO variant does not have. The ageing bar segments take their new `--v` without transition.

### Row actions (r5)
"Tindakan hari ini" rows: the row tint follows the one stretched action (80 ms in / 160 ms out); no
scale on rows. Phone rows show the action as a text link; the tint is the press feedback.

### Navigation drawer (r3)
Open: panel translateX(−100 %) → 0 in `--mc-dur-moderate` 320 ms on `--mc-ease-reveal`; scrim fades
0 → 1 over the same 320 ms (linear). Close: panel → −100 % in `--mc-dur-base` 240 ms on
`--mc-ease-exit`; scrim fades out with it. No bounce, no overshoot, no content stagger. Opening from
the rail (tablet) uses the same recipe. Reduced motion: 150 ms linear fade of the whole layer.
Navigating from the drawer: the drawer closes first, then the shell's page exit (240 ms) plays.

### Navigation tree (r12)
Group disclosure (child list height + opacity), chevron rotation, the sliding pill across two levels and the
sidebar collapse fold use the tokens listed in `docs/NAVIGATION_ARCHITECTURE.md` §7. No pulse, badge or count
animation anywhere in navigation; reduced motion = instant (drawer: the 150 ms fade above).

## 5. Reduced motion (`prefers-reduced-motion: reduce`)

Remove translate, scale, blur, clip, parallax, stagger, rolls and stroke drawing; keep a 150 ms
linear crossfade for every state change (auth steps, sheets, menus, panels, upload states); spinners
slow to 1.6 s; indicators jump. The motion study's "Dikurangi" switch previews the same behaviour.
r13: the one exception is the in-place page swap of the persistent shell (HTTP), which is instant — no 150 ms exit
crossfade and no artificial wait (R13_SPEC §1 "reduced motion = instant"; the region is hidden only while the page
module runs, 1–2 frames, never partly faded); the reduced entrance (150 ms linear fade of the content's children)
stays, so a page swapped in place looks like the same page loaded directly. The `file://` page exit keeps the 150 ms
crossfade (it covers the document load).

## 6. Verification

`tools/behaviour_test.py` checks the select keyboard model (desktop + phone sheet), purchase
recalculation through the select, the upload state machine (success, error, remove, announcements),
the compact login swap, the phone palette/dialog sheets, reduced motion, the drawer (open/close/
Esc/scrim/Back/focus trap/scroll lock/scroll), bottom-nav persistence and active states, the action bar
stacking, the review wrappers, (r5) brand switching, the date range filter, toasts, phone overflow
and first-screen navigation, and (r6) canonical first-load before any scroll, the iOS 16 px guard,
account placement and menu, logout confirmation, true arbitrary ranges, greeting bands with an
injected clock, project configuration override, 100 % zoom geometry, footer hierarchy, card
proportionality, wrapper scroll, and reduced-motion durations of the new overlays, and (r7) the
purchase table through 1024–1046 px, the disclosure hit area by pointer coordinates and keyboard, the
shared clock (injected, swapped, runtime), the dashboard's response to ranges, arbitrary ranges via
the UI, brand tokens / assets / slots, the hard-code audit and phone geometry after focus and
overlays (see the latest count in the report). Every check runs on the injected fixture clock.
