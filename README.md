# DeepInfer Illustrated

An unofficial, bilingual visual guide to a request's journey through DeepInfer.
Svelte + TypeScript + Vite, hand-authored SVG, and D3-powered teaching models.

[Open the website](https://elarazju.github.io/deepinfer-illustrated/) · [Verification report](REPORT.md)

Upstream evidence is pinned to `8b16149741a4935e1dec8cea27853f273b374c5b`.
Production-only cache and routing services are explicitly distinguished from released code.
No model inference or accelerator benchmark is performed by this project.

## Develop

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npm run build:full
npm run length
```

For local source-line verification:

```sh
git clone https://github.com/deepseek-ai/DeepInfer vendor/deepinfer
git -C vendor/deepinfer checkout 8b16149741a4935e1dec8cea27853f273b374c5b
```

Use `GIT_LFS_SKIP_SMUDGE=1` when cloning. The checkout is ignored and read-only to the site.

## Evidence and figures

`facts.yaml` is the canonical claim registry. Displayed claim paragraphs use source
badges; longer reading sections in both locale dictionaries reference registered facts.
Simulation parameters live separately under `demo_defaults`, explicitly marked
as authored teaching values. Source claims and demonstration results must not be conflated.

`npm run build` checks and bundles the app, reusing local exports. It warns if
`public/figures/manifest.json` is absent. Use `npm run build:full` to regenerate
all 112 SVG/PNG assets (14 figures × 2 languages × 2 themes × 2 formats) before
bundling. Install Chrome, or install Playwright Chromium and set
`BROWSER_CHANNEL=chromium`. CI runs this full build and fails if export fails.
The published manifest binds each image hash to the deployed commit. Generated
images are ignored by Git; run the full build once to populate downloads.

For focused iteration with the dev server already running, `npm run export` updates
`public/figures/`. `PREVIEW_URL` selects the server. PNG exports wait for the same
web fonts as the live diagrams; standalone SVG text uses its declared fonts with
system fallbacks when those fonts are unavailable.

The fourteen diagram components have named translation fields and share SVG primitives.
Chapter metadata is imported by both the app and validation scripts. Tutorial prose
is shown by default; exact source statements remain in each chapter's evidence drawer.

`npx tsx scripts/browser-qa.ts` checks Chrome and Playwright WebKit, keyboard
interaction, reduced motion, responsive overflow, and captures sections at desktop
and mobile widths. Install WebKit first with `npx playwright install webkit`.
Playwright WebKit is not certification on actual Safari or iOS hardware.

## Beginner learning layer

The basics chapter introduces generation, KV memory, Prefill/Decode, MoE,
parallelism and latency metrics, with two teaching interactions and three self-tests.
Choose a beginner, advanced or code route; `?path=beginner|advanced|code` overrides
saved preferences. Storage and media-query failures do not prevent reading.

`glossary.yaml` contains bilingual definitions and source references. Use
`[[term-id]]` or `[[term-id|label]]` in prose rendered by `RichText`; introduce a term
once per chapter. Definitions open with focus, hover or touch, and Escape restores
focus. The searchable glossary links back to actual appearances.

`background` facts have verified public source URLs and a separate badge. They
explain general concepts; **they do not establish DeepInfer implementation or
performance claims**. DeepInfer claims still require Q&A, README or locked code.
`CodeSnippet` uses exact excerpts of at most 20 lines, checked against the local
pinned checkout. Chapter metadata records prerequisites, difficulty and estimated
reading time; estimates are editorial, not measured user-study results.

`npm run length` reports visible prose separately from folded source details;
length is not a build gate. `node scripts/check-schema-negative.mjs` checks that
invalid references, unknown terms and malformed markup are rejected (run without
concurrent editing). `node scripts/routes-qa.mjs`, `node scripts/terms-qa.mjs`,
`npx tsx scripts/accessibility.ts` and `node scripts/contrast.mjs` exercise the
navigation, term controls and accessibility. These browser checks expect a local
dev server on port 5173. Full matrix screenshots are in `research/screenshots/`.

## Publish

The owner authorized the v2 release on 2026-10-20; deployed source is
`90df09cd96502e6504a909a2f648f21e16a15e73`. The GitHub Actions workflow builds and
deploys `main` to GitHub Pages. Deployment verification is recorded in REPORT.md.
Enable Pages with GitHub Actions as its source in the repository settings.
Static assets use a relative base so the project works under a repository subpath.
Update the public project URL in SEO, source links, and export attribution if moving it.

See [REPORT.md](REPORT.md) and [the tutorial review](research/TUTORIAL-REVIEW.md)
for current verification and limits. These are agent checks, not human certification.
Initial screenshots are preserved in the [v0.1.0 release](https://github.com/elarazju/deepinfer-illustrated/releases/tag/v0.1.0).
New screenshots and generated diagrams are kept out of source commits; history is not rewritten.
Code: MIT. Original content: CC BY 4.0. Upstream material retains its own licenses.
