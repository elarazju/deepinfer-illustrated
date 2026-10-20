# DeepInfer Illustrated

An unofficial, bilingual visual guide to a request's journey through DeepInfer.
Svelte + TypeScript + Vite, hand-authored SVG, and D3-powered teaching models.

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

With the dev server running, `npm run export` writes both languages and themes to
`public/figures/`. It uses installed Chrome by default; set `BROWSER_CHANNEL` for
another Playwright-supported Chromium channel. Each SVG is self-contained and
includes source/attribution metadata. PNGs are rendered from those same SVGs.

`npx tsx scripts/browser-qa.ts` checks Chrome and Playwright WebKit, keyboard
interaction, reduced motion, responsive overflow, and captures sections at desktop
and mobile widths. Install WebKit first with `npx playwright install webkit`.
Playwright WebKit is not certification on actual Safari or iOS hardware.

## Publish

The GitHub Actions workflow builds and deploys `main` to GitHub Pages.
Enable Pages with GitHub Actions as its source in the repository settings.
Static assets use a relative base so the project works under a repository subpath.
Update the public project URL in SEO, source links, and export attribution if moving it.

See REPORT.md and research/INDEPENDENT-AUDIT.md for verification and limitations.
Code: MIT. Original content: CC BY 4.0. Upstream material retains its own licenses.
