# Public release record — v1.0.0

| Field | Value |
|---|---|
| Public release | `v1.0.0` |
| Source baseline | Golden Frontend Reference v1.0, baseline `golden-frontend-v1.0`, **FROZEN — OWNER APPROVED** on 2026-10-12 |
| Freeze record | [`release/golden-frontend-v1.0/FREEZE_RECORD.md`](release/golden-frontend-v1.0/FREEZE_RECORD.md) |
| Frozen files | 41 of 41 from `SHA256SUMS-scope.txt`, byte-identical (list digest `39fa879dc304275e55b1ffecda290ebd6b481a27d89bbda67011c26e0796eca4`) |
| Package | 56 files; every file except `SHA256SUMS-public.txt` itself is listed in [`SHA256SUMS-public.txt`](SHA256SUMS-public.txt) |
| Prepared | 2026-10-12 |

## 1. Contents compared with the frozen baseline

### Included unchanged (48 files)

| Group | Files | Note |
|---|---|---|
| Frozen scope | 41 | every file of `release/golden-frontend-v1.0/SHA256SUMS-scope.txt` |
| Freeze record | 3 | `FREEZE_RECORD.md`, `SHA256SUMS-scope.txt`, `digests.txt` (byte-identical to the lab record) |
| Inter font | 4 | see below |

The Inter font (`assets/fonts/inter/`: two `.woff2` files, `LICENSE.txt`, `README.md`) is referenced by
`assets/css/base.css` and by the manifest's Layer A. It is not listed in either frozen checksum list. It
was copied unchanged so the design renders with its intended typeface. It is licensed under SIL OFL 1.1,
and the license text is included.

### Added for the public release (8 files, not part of the frozen baseline)

| File | Purpose |
|---|---|
| `README.md` | the repository front page: design policy (one foundation, adapted per project), status, start-here map, component classes, adoption, framework adaptation, design workflow without external design generation, product categories, project approvals, limitations, license |
| `PUBLIC_START_HERE.md` | the public start guide: links to tokens, components, patterns, demo, manifest, adoption documentation, framework adaptation and agent instructions; how to read the frozen documents and their "GOLDEN FIXED" labels |
| `AGENTS.md` | the AI agent operating model: rules for every agent; Planning Architect, Independent Second Reviewer and Coding Executor |
| `tools/public_consumer_smoke.py` | public smoke test: checks that `tools/golden_consumer_smoke.py` is the frozen v1.0 file, then runs its 13 checks from any clone (the two lab-path literals are replaced in memory only) |
| `PUBLIC_RELEASE.md` | this record |
| `SHA256SUMS-public.txt` | SHA-256 of every file in the package |
| `.gitattributes` | `* -text`: no line-ending conversion, so every file stays byte-identical on every OS (most frozen files use LF; `docs/NAVIGATION_ARCHITECTURE.md` and `serve.cmd` use CRLF) |
| `.gitignore` | keeps local artefacts (`__pycache__/`, the smoke-test output folder `evidence/`) out of commits |

### Not published

These items remain in the private lab:

- **`release/golden-frontend-v1.0/SHA256SUMS-demo-baseline.txt`.** It lists the 239 MULTIPLECORP
  demonstration files. Its digest is still recorded in `digests.txt` and in the freeze record.
- **The 239 MULTIPLECORP demonstration files**, which are outside the approved scope:
  - pages, business modules, fixtures and module CSS;
  - images and brand files, including placeholder photographs that are not licensed for production;
  - review pages, the lab QA tools and the lab `index.html`.
- **Lab history and working material:** `scratch/`, `evidence/`, `analysis/`, `references/` (reference
  mockups and videos) and `review/`.

## 2. References to unpublished paths

The frozen documents were written for the full lab. They contain 242 references to paths that are not
in this package:

- 239 point to files that exist only in the private lab.
- 2 point to historical lab paths that no longer exist: `assets/js/parts/*.js` and `pages/02`.
- 1 points to a document of the canonical MULTIPLECORP repository:
  `docs/07-ux-design/ADMIN_FLOW/s10-*-journeys.md`.

| Area referenced | References |
|---|---|
| lab tools (`tools/*` files that are not in this package) | 118 |
| `assets/js/modules/` | 26 |
| `scratch/` | 17 |
| `pages/` | 15 |
| `evidence/` | 14 |
| `review/` | 14 |
| `assets/js/fixtures/` | 12 |
| `assets/css/modules/` | 10 |
| `analysis/` | 8 |
| lab `index.html` | 2 |
| `assets/img/` | 3 |
| `release/.../SHA256SUMS-demo-baseline.txt` | 1 |
| `assets/js/parts/` (historical) | 1 |
| canonical MULTIPLECORP repository | 1 |

These references are plain path names, not links. Every clickable link in the documentation resolves
inside this package. Treat the references as context; do not recreate the files from this package. An
adopting project builds its own equivalents.

## 3. Verification at preparation (2026-10-12)

| Check | Result |
|---|---|
| `sha256sum -c release/golden-frontend-v1.0/SHA256SUMS-scope.txt`, run inside this package | 41 OK |
| Digest of the frozen list | `39fa879d…6eca4`, as recorded in the freeze record |
| Public smoke test `python tools/public_consumer_smoke.py`, run from independent copies of the staged package | 13/13 |
| Package validation, see below | 20/20 |
| `node --check` on all 11 JavaScript files | OK |
| `template/TEMPLATE_MANIFEST.json` | valid JSON |
| Python tools | parse cleanly |
| Links in the public documents (README, public start guide, agent instructions, this record) | all resolve inside the package |

The independent copies were:

- a Git checkout of the staged content under a path that contains a space and a `modules` folder;
- a `git archive` export of the staged content.

The package validation loaded the demo over `file://` and over HTTP (through this package's own
`tools/serve.py`), at 1366 × 768 and 390 × 844. It confirmed that:

- all 14 requested files come from this package and load without error;
- no request leaves the package;
- the Inter font from this package is used;
- there are no page errors and no console errors.

## 4. Security, privacy and rights summary

- **Credentials:** no secrets, passwords, API keys, tokens, private keys, database URLs or backend endpoints.
- **Network:** no external resources (no CDN, web fonts, analytics or trackers). The only network call is
  the optional router's same-origin page fetch, and only over HTTP.
- **Browser storage:** `sessionStorage` and `localStorage` hold UI state only (navigation, guidance level,
  recently opened records, date range) and stay on the viewer's device.
- **Personal data:** none. All people, companies, e-mail addresses and figures are fictitious, either on
  reserved `.example` domains or on `multiplecorp.id`, which is not a registered domain. The MULTIPLECORP
  personas follow the synthetic data set of the canonical MULTIPLECORP documentation.
- **Hidden content:** no invisible or bidirectional-control characters, and no embedded binary data.
- **Local paths:** two historical Windows folder paths appear. The lab folder appears in the freeze record
  and the smoke test; the local folder of the canonical repository appears in two documents. Neither path
  contains a user name.
- **Assets:**
  - Inter, under SIL OFL 1.1, with its license included.
  - Icons drawn as original geometry, according to the sprite header.
  - No photographs or other images.
- **Logos and trademarks:** the Google "G" and the MultipleCorp mark are not reusable material (see the
  README).
- **License:** no open-source license. Public visibility does not grant permission to reuse the contents
  (see the README).
