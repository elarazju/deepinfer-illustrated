# 图解 DeepInfer

跟着一个请求，看它怎样穿过 DeepSeek 开源的推理框架 [DeepInfer](https://github.com/deepseek-ai/DeepInfer)。

👉 **在线阅读：https://elarazju.github.io/deepinfer-illustrated/** （中文 / English）

## 为什么做这个

DeepInfer 开源时，官方材料主要是 README（含两张性能图）、一份中文部署 Q&A PDF、一篇介绍整体架构的知乎 Blog，以及模型卡和技术报告。它们讲清了设计思路，但要搞清楚"一个请求进来之后到底发生了什么"，还得在 C++、Python 和 TileLang kernel 之间来回翻代码。

这个网站是读代码时画的图整理出来的。首页的总览图按请求经过的顺序画出 8 站：协议编码 → 前缀匹配 → Prefill 路由 → 图像编码 → Prefill → PD 传输 → Decode → 流式返回，点击任一站会跳到相关章节。各章则按主题展开：系统与部署、异步调度、Decode 实验室（DSpark）、Wide-EP 与 EPLB、Recipe 与结构化输出、负载均衡、YOCO / CED、KVCache 存储，最后是模型代码导读。每章讲一个机制解决什么问题，以及 DeepInfer 是怎么做的。

## 怎么读

- **刚接触大模型推理？** 先看第 0 章"读前须知"。那里用几张小图讲了 KV Cache、Prefill 与 Decode、MoE、DP 与 EP 这些后面反复出现的概念。
- **首页标题下方可以选阅读路线**：新手、懂推理基础、只想看代码。选好之后，侧边栏会标出推荐顺序。
- **带虚线下划线的词可以点开看解释**，页尾还有一份可以搜索的术语表。
- **有几处可以动手的演示**：自回归生成播放器、KV 缓存增长、异步调度时间线、DSpark 投机验证、SWA 回放窗口。拖一拖滑块，比读一段文字直观得多。

## 关于准确性

我们尽量让每一句话都能找到出处，所以正文旁边会有一个小标签：

| 标签 | 含义 |
|---|---|
| 代码可查 | 能在锁定版本的源码里找到对应位置，点进去就是那几行 |
| 官方 Q&A | 来自官方部署 Q&A，标签上写着页码 |
| 据代码推断 | 代码里能看到这么做，但官方没有解释原因，是我们的理解 |
| 背景知识 | 通用概念（比如 KV Cache 是什么），链接到公开的论文或文档 |

另外几点需要说明：

- 内容基于 DeepInfer 的 commit [`8b16149`](https://github.com/deepseek-ai/DeepInfer/tree/8b16149741a4935e1dec8cea27853f273b374c5b)（0.1.0 版本）。之后仓库更新了，部分细节可能会对不上。
- 这次开源的是离线推理引擎。KVCache 存储、Vision Encoder / Prefill / Decode 分离部署，以及 Prefill / Decode 的数据并行负载均衡**没有开源**。这些部分只能依据官方 Q&A 来写，图里用灰色虚线框标出来。专家并行负载均衡（EPLB）是开源的，相关章节引用了代码。
- Recipe（协议转换与 tokenizer）作为独立组件 deepseek-recipe 开源，不在 DeepInfer 仓库里。Recipe 章依据官方 Q&A 写成，没有逐行核对 deepseek-recipe 的代码。
- 演示里可以拖动的数字都是示意值。我们没有在 SM100 或 Ascend 上跑过模型，也不声称复现了任何性能数据。
- 这是一个非官方项目，和 DeepSeek 没有关系。

看到写错的地方，欢迎开 issue。附上对应的代码行或 Q&A 页码会帮大忙。

## 本地运行

需要 Node.js 20.19 或 22.12 以上的版本（CI 用的是 24）。

```sh
npm ci
npm run dev          # 本地预览，默认 http://127.0.0.1:5173
npm test             # 交互演示背后几个小模型的单元测试
npm run check        # 类型检查 + 事实库检查
```

可下载的 SVG/PNG 图不放在仓库里，需要时自己生成：

```sh
npm run build:full   # 用浏览器导出全部图片，再打包网站
```

导出时默认用本机安装的 Chrome。没有装的话，先运行 `npx playwright install chromium`，再设置 `BROWSER_CHANNEL=chromium`。只改了文字、不需要重新出图时，用 `npm run build` 就够了。

想让检查脚本顺便核对代码行号，可以把上游仓库 clone 到 `vendor/`（这个目录不会提交）：

```sh
GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/deepseek-ai/DeepInfer vendor/deepinfer
git -C vendor/deepinfer checkout 8b16149741a4935e1dec8cea27853f273b374c5b
```

## 想改内容的话

几个关键文件：

- `facts.yaml`：网站上出现的每个数字和机制描述都登记在这里，并写明出处。`npm run check` 会拦下正文里没登记的数字，所以加新说法时请先在这里加一条。
- `glossary.yaml`：术语表。正文里写 `[[kv-cache]]` 或 `[[kv-cache|显示的文字]]`，就会变成可以点开的术语。
- `src/i18n/zh.json`、`src/i18n/en.json`：中英文文案，两边的结构必须一致。
- `src/figures/`：每张图一个 Svelte 组件，都是手写的 SVG。颜色统一走 `src/lib/tokens.css` 里的变量：棕色是 CPU，绿色是 GPU，紫色是存储，蓝色是网络，灰色虚线是未开源的部分。
- `src/interactive/`：交互演示。背后的计算放在 `src/lib/models.ts`，有对应的单元测试。

改完图之后，可以先开着 `npm run dev`，再跑这几个浏览器检查：

```sh
node scripts/figure-audit.mjs      # 图里的文字有没有越界或叠在一起
npx tsx scripts/browser-qa.ts      # 中英文、深浅色、桌面和手机宽度下的页面
npx tsx scripts/accessibility.ts   # axe 无障碍检查
```

检查结果和截图会写到 `research/` 目录。这个目录只留在本地，不会提交。

## 部署

推送到 `main` 分支后，GitHub Actions 会跑测试、导出图片，然后发布到 GitHub Pages。如果要部署到别的地址，记得同步修改几处写死的地址：`index.html` 里的分享图、`src/App.svelte` 里的仓库链接，以及 `scripts/export-svg.ts` 里写进导出图的链接。

## 许可

代码使用 [MIT](LICENSE)，原创的文字和插图使用 [CC BY 4.0](CONTENT-LICENSE.md)。DeepInfer 源码、官方文档、字体等第三方内容保留各自的许可。

---

## English

**DeepInfer Illustrated** is an unofficial, bilingual visual guide to [DeepInfer](https://github.com/deepseek-ai/DeepInfer), the inference framework DeepSeek open-sourced. It follows a single request from protocol encoding to the streamed response, with one chapter per stop, a beginner's primer, a searchable glossary and a few interactive demos. [Read it online](https://elarazju.github.io/deepinfer-illustrated/).

Every claim carries a small source label: a line in the pinned source code, a page in the official Q&A, our own reading of the code, or a public paper for general background. The cache store, E/P/D disaggregation and the data-parallel load balancers were not open-sourced, so those parts rely on the Q&A alone and appear as gray dashed boxes in the diagrams; expert-parallel load balancing (EPLB) is open source and cited from code. Numbers you can drag in the demos are illustrative, not measurements.

Run `npm ci && npm run dev` to preview locally. Corrections are very welcome. Please open an issue, ideally with the code line or Q&A page.
