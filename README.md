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

Every `npm run build` starts a temporary Vite server, regenerates all 72 SVG/PNG
files from the current source, then bundles the site. Install Chrome locally, or run
`npx playwright install chromium` and set `BROWSER_CHANNEL=chromium`. CI installs
Chromium automatically. A failed export fails the build. The published
`figures/manifest.json` binds each image hash to the GitHub commit that built it.
Generated images are ignored by Git; run a build once to populate local downloads.

For focused iteration with the dev server already running, `npm run export` updates
`public/figures/`. `PREVIEW_URL` selects the server. PNG exports wait for the same
web fonts as the live diagrams; standalone SVG text uses its declared fonts with
system fallbacks when those fonts are unavailable.

The nine diagram components have named translation fields and share SVG primitives.
Chapter metadata is imported by both the app and validation scripts. Tutorial prose
is shown by default; exact source statements remain in each chapter's evidence drawer.

`npx tsx scripts/browser-qa.ts` checks Chrome and Playwright WebKit, keyboard
interaction, reduced motion, responsive overflow, and captures sections at desktop
and mobile widths. Install WebKit first with `npx playwright install webkit`.
Playwright WebKit is not certification on actual Safari or iOS hardware.

## Publish

The GitHub Actions workflow builds and deploys `main` to GitHub Pages.
Enable Pages with GitHub Actions as its source in the repository settings.
Static assets use a relative base so the project works under a repository subpath.
Update the public project URL in SEO, source links, and export attribution if moving it.

See [REPORT.md](REPORT.md) and [the tutorial review](research/TUTORIAL-REVIEW.md)
for current verification and limits. These are agent checks, not human certification.
Initial screenshots are preserved in the [v0.1.0 release](https://github.com/elarazju/deepinfer-illustrated/releases/tag/v0.1.0).
New screenshots and generated diagrams are kept out of source commits; history is not rewritten.
Code: MIT. Original content: CC BY 4.0. Upstream material retains its own licenses.
