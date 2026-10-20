# DeepInfer Illustrated — v2 新手化验收

日期：2026-10-20。上游证据锁定 `8b16149741a4935e1dec8cea27853f273b374c5b`。

**当前状态：本地验收完成后等待委托人确认发布。此报告的 v2 内容尚未推送到 main；下方历史报告中的线上成功记录仅适用于旧版。**

## v2 完成项

- 工程清理：浏览器存储与媒体查询降级、共用段落渲染、删除重复导航、修正多段路径箭头；Q&A 改为 GitHub blob 链接，徽章和提示明确页码。快构建与全导出构建分开，CI 使用 `build:full`，图数由清单计算。
- 来源：75 条事实，其中新增 31 条 `background` 和 9 条真实代码片段；54 个双语术语。背景知识只解释通识，不证明 DeepInfer 实现或性能。示意值留在 `demo_defaults`，没有运行模型或复现性能。
- 阅读：新增第 0 章、4 张基础图、KV 增长与自回归播放器、3 道折叠自测；内联术语支持悬停、聚焦、点击和 Escape，页尾可搜索术语及查看出现章节。
- 正文：8 个原章节与 Decode Lab 增加动机、场景、前置知识、难度、阅读分钟数、代码旁注和要点。按难度重排，原 URL 锚点保留。阅读时间是编辑估算。
- 图示：EPLB 展示负载统计、同权重副本与重排前后负载条；新增 SWA 静态窗口，全站 14 张图均有“如何读”图注。112 个 SVG/PNG 文件由当前源码生成并逐个写入哈希清单。
- 路线：新手、进阶、代码三条路径，URL 参数优先于本地保存；侧栏展示推荐顺序和文字难度，章末前后链接按路线计算。路线外章节仍可阅读；延伸阅读文案与路线导航分开。

## 验收与发现后修复

最终测试结果见本节对应文件；截图只在本地保留，不加入 Git 对象。

- `npm test`：8 项通过，覆盖原有 DSpark/SWA/调度模型、KV 零值/最大值/独立缩放、已采样 token 尚未缓存的时序，以及术语解析的畸形标记和 HTML 原样处理。
- `npm run check`：零 Svelte 错误/警告；75 条事实、双语结构、数字来源、代码片段逐行匹配、术语引用及短定义长度检查通过。负向检查确认不存在 ref、不存在术语和嵌套标记都会失败。
- `npm run build:full`：生成 56 对 SVG/PNG 共 112 文件，再打包站点；本地构建产物校验见 [v2 构建验证](research/v2-build-verification.json)，两种语言/主题/尺寸样本分别核对 28 个下载链接及内容哈希。这是本地发布包校验，不是线上部署验收。
- 浏览器：Chrome / Playwright WebKit × 中英 × 深浅 × 1280/375，共 16 组合；检查新章节、键盘术语浮层、三路线、交互模型、无横溢、无 JS 异常，见 [浏览器结果](research/browser-results.json)。另以 `routes-qa.mjs` 检查刷新持久化、URL 覆盖、无效路线和禁用 localStorage / matchMedia 的降级。
- 无障碍：4 种语言/主题组合分别在详情展开、术语浮层打开时运行 axe，共 8 次零 WCAG A/AA 违规，见 [axe 结果](research/accessibility-results.json)。14 对文字/背景 token 对比度均超过 4.5:1，包含新增背景知识徽章，见 [对比度](research/contrast-results.json)。初轮发现浅色灰色对比度 4.38:1，已加深修复；WebKit 默认 Tab 跳过术语详情链接，已用显式键盘焦点修复并复验。
- 图形：16 组合全图文本包围盒检查无越界、无文字相交，见 [图形检查](research/tutorial-audit/final-results.json)。实际查看 EPLB/SWA 导出及基础、交互页面样本；自动包围盒检查不能替代全部连线与语义审图。

## 独立审阅与真人验证边界

[背景来源独立审核](research/BACKGROUND-AUDIT.md)由未参与制作的 agent 逐条复核 31 条背景来源，并复查双语页面的来源使用。首轮指出 KV 公式适用范围、Sinkhorn 方阵假设、稀疏注意力定义过窄、FP8 引用位置；之后指出 KMP helper 身份和 DSpark 转折引用。六项均已修复并独立复核关闭。

[新手走读](research/BEGINNER-WALKTHROUGH.md)由另一位未参与制作的 agent，按七站新手路线阅读渲染页面。补齐 KV 控件术语、Block KV 入口、DSpark 累乘直觉与 rank、chunk/KMP、EPLB 全称、P/D/E 含义；修复一处嵌套标记和英文冠词。修后复走通过，三道自测能由正文推出，路线前后跳转与手机图内滚动可用。后续还压缩了英文调度/EPLB 末尾的重复引导。

这两份记录都是 **agent 模拟与复核，不等于真人可读性测试**。建议委托人再邀请 2–3 位真实新手，确认术语记忆、阅读时间和自测理解；未声称已经完成真人验证。WebKit 是引擎测试，不是真实 Safari/iOS 认证；自动 axe 也不是完整 WCAG 认证。

## 篇幅与本地截图

[篇幅报告](research/content-lengths.json)分别给出纯教程段落、默认可见文字、含折叠详情三个口径。默认文字包括章引言、问题、教程段落、代码旁注、要点及延伸阅读，不把代码行、图内文字和来源详情混入默认正文。术语标记按实际显示文字计数。

默认可见中文为 866–1296 个非空字符、英文为 463–659 词。调度中文及各章英文低于计划的参考篇幅；该项按计划只报告、不阻断。为去掉重复叙述，没有用折叠来源或重复引导凑足字数。

最终页面截图：`research/screenshots/{zh|en}-{light|dark}-{1280|375}-{home|basics|journey|system|scheduling|decode-lab|experts|recipe|routing|yoco|storage|model|glossary}.png`，共 104 张。另有新手走读样本及 `research/tutorial-audit/` 图形截图。目录已被 Git 忽略，当前仅本地保留；发布后可作为 Release 附件归档。

## 背景来源核对表

下面列出制作时实际打开的来源和核对位置，独立复核见上文报告。通识没有被用作 DeepInfer 专属参数或收益的替代证据。

| ID | Opened source and location | Result |
|---|---|---|
| bg.autoregressive | [Vaswani et al., Attention Is All You Need, §3](https://arxiv.org/html/1706.03762v7) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.sampling | [Leviathan et al., Speculative Decoding, §2.2](https://arxiv.org/html/2211.17192) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.token | [Hugging Face Transformers, Tokenization algorithms](https://huggingface.co/docs/transformers/main/en/tokenizer_summary) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.special_token | [Hugging Face Transformers, PreTrainedTokenizer, special tokens](https://huggingface.co/docs/transformers/main_classes/tokenizer) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.representation | [Vaswani et al., §3.1–3.4](https://arxiv.org/html/1706.03762v7) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.kv_cache | [Kwon et al., PagedAttention, §2.1–2.2, §3; generalized tensor-shape accounting](https://arxiv.org/html/2309.06180) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.prefix | [Zheng et al., SGLang, §3 RadixAttention](https://arxiv.org/html/2312.07104) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.prefill_decode | [Zhong et al., DistServe, §2–3](https://arxiv.org/html/2401.09670) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.batching | [Yu et al., Orca, abstract and iteration-level scheduling](https://www.usenix.org/conference/osdi22/presentation/yu) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.chunk | [Agrawal et al., Sarathi, §4.2](https://arxiv.org/html/2308.16369) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.moe | [Dai et al., DeepSeekMoE, §2, §3.2–3.3](https://arxiv.org/html/2401.06066) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.parallel | [Shoeybi et al., Megatron-LM, §3 and Appendix A](https://arxiv.org/html/1909.08053) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.ep | [DeepEP README, introduction](https://github.com/deepseek-ai/DeepEP) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.swa | [Jiang et al., Mistral 7B, §2](https://arxiv.org/html/2310.06825) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.yoco | [Sun et al., YOCO, §2, Figure 2](https://arxiv.org/html/2405.05254) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.speculative | [Leviathan et al., §2.1, §3.1, §3.3](https://arxiv.org/html/2211.17192) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.cuda | [NVIDIA CUDA Programming Guide, §2.5.1–2.5.3](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.graph | [NVIDIA CUDA Programming Guide, §4.2](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.constraints | [Dong et al., XGrammar, §2.1–2.2](https://arxiv.org/html/2411.15100) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.sse | [WHATWG HTML, §9.2 Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.fp8 | [Micikevicius et al., FP8 Formats for Deep Learning, §2–3](https://arxiv.org/html/2209.05433) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.mx | [OCP Microscaling Formats v1.0, §5.1–5.4, pp.9–14](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.erasure | [Ceph documentation, Erasure code profiles and glossary](https://docs.ceph.com/en/latest/rados/operations/erasure-code/) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.gdr | [NVIDIA GPUDirect RDMA, §1 Overview](https://docs.nvidia.com/cuda/gpudirect-rdma/) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.metrics | [Zhong et al., DistServe, §2.2, §3, evaluation](https://arxiv.org/html/2401.09670) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.sinkhorn | [Nathanson, Matrix scaling and explicit doubly stochastic limits, abstract](https://arxiv.org/abs/1905.09426) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.ngram | [DeepSeek V4.1 technical report, §2.4.2 p.13](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.sparse | [DeepSeek V4.1 technical report, §2.3 pp.9–11](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.pareto | [pymoo, Preface: Basics and Challenges](https://pymoo.org/getting_started/preface.html) | Definition inspected and paraphrased. |
| bg.utilization | [NVIDIA System Management Interface, Utilization](https://docs.nvidia.com/deploy/nvidia-smi/index.html) | Definition inspected and paraphrased. |
| bg.utf | [WHATWG Encoding Standard, §8.1](https://encoding.spec.whatwg.org/#utf-8-decoder) | Definition inspected and paraphrased. |

## 发布与遗留事项

- **待委托人确认后才能推送 main。** v2 计划 §3 将“准备推送到 main（即公开部署）之前”列为必须确认的节点，§9 再次要求“先停下向委托人确认”。确认后由 Actions 全量生成导出并部署，再执行更新后的 `scripts/verify-published.ts`；届时补记线上提交号与结果。
- 当前 `research/published-results.json` 仍保留旧版线上记录，没有把本地结果冒充线上验证。
- 未改写 Git 历史。旧截图与导出图约 30MB 的历史对象仍在，由委托人另行决定是否清理。
- 未开源的存储/路由服务仍以虚线和明确提示标注；C8 仍为带推断标记的代码导读。Q&A 的 blob 预览是否识别页码锚点取决于 GitHub，徽章页码始终可读。

---

## 历史记录：v0.2 教程改版（以下构建命令、图数和线上状态不适用于 v2）

### 旧版报告

日期：2026-10-20。源码证据仍锁定 `8b16149741a4935e1dec8cea27853f273b374c5b`。

[网站](https://elarazju.github.io/deepinfer-illustrated/) · [仓库](https://github.com/elarazju/deepinfer-illustrated) · [初版证据归档](https://github.com/elarazju/deepinfer-illustrated/releases/tag/v0.1.0)

## 这次改了什么

1. **阅读路径**：DSpark从专家负载均衡章移到异步调度之后的独立Decode Lab。侧栏、首页入口和总览Decode节点都能进入实验区。
2. **正文**：C1–C8默认展示连贯叙述，每段关联具体来源。精确来源条目及适用范围集中在章末“来源与适用范围”。未开源服务提示仍在章首可见；C8也按接口追踪顺序组织讲解，并保持显著推断标记和代码导读范围。
3. **图示**：时间线采用同一时间标尺与相同GPU任务时长，CPU提交用事件点表示；YOCO画出token、K/V块和Decoder的两条准备路径；SWA实验分开显示Block KV与Encoder恢复区，并逐token展示注意力可见范围。
4. **机制修正**：明确区分Encoder在前缀SWA缺失时恢复命中边界，与Decoder每次Prefill回放prompt尾部。时间线的CPU顺序保持调度、提交前向、后处理、提交采样。恢复与投影的连线避开标签。
5. **维护**：9个图组件独立，共用Frame/Box/Edge；图示文案使用具名键，总览阶段次序独立于翻译对象；样式表已展开格式化。字数脚本直接导入共享章节元数据。
6. **导出**：每次`npm run build`和GitHub Actions都启动隔离的导出服务，从当前源码生成36对SVG/PNG，再打包站点。生成失败则构建失败；`figures/manifest.json`记录提交号及每张图的SHA-256。线上验证会核对图片内容与构建清单。
7. **细节**：首次访问跟随系统主题，手动选择会保存；Q&A改为PDF原文件直链，徽章直接显示页码，避免依赖GitHub预览识别页码锚点。PDF阅读器是否自动跳页仍取决于浏览器。
8. **体积**：下载图、截图和拼图不再跟踪到当前源码树。初版截图及审查资料已归档到Release；历史提交没有重写，因此旧Git对象仍存在。

## 验收状态

- 构建与来源检查通过：35条事实、双语结构、数字引用、锁定文件行号检查。
- 算法测试：5项，覆盖DSpark累计概率和边界、SWA对齐与短输入、CPU瓶颈下的时间线。
- 浏览器：Chrome/WebKit × 中英 × 深浅 × 1280/375共16组合。新增检查DSpark位置、默认正文可见、来源区默认折叠、跟随系统主题和保存手动选择。见[浏览器结果](research/browser-results.json)。
- 自动无障碍四组合零违规：[axe结果](research/accessibility-results.json)。本轮新增的页码文字曾因透明度降低对比度，已修复并重新检查。
- 独立复核：[教程审查记录](research/TUTORIAL-REVIEW.md)。这是未参与制作的agent进行的来源、机制和浏览器审查，不能代替人工内容评审。记录区分了自动几何检查、生成截图和实际查看的样本。
- 发布与图片一致性：[本轮Actions](https://github.com/elarazju/deepinfer-illustrated/actions/runs/39418507455)构建和部署成功，包含模型章补充的最新部署提交为`47780c777929d563904a7e015389c28eb2f4b73a`。线上检查通过中文浅色桌面、英文深色手机，验证独立Decode Lab、36个可见下载链接的内容哈希及清单提交号，见[线上检查](research/published-results.json)。清单包含本轮全部72个导出文件；模型章默认讲解及4处可见推断标记也通过线上检查。

## 篇幅统计口径

[篇幅结果](research/content-lengths.json)统计“默认讲解 + 章末来源条目”，保持初版的同一口径。C1–C7总篇幅为中文1190–1497非空字符、英文802–842词。默认英文讲解本身约500–660词；没有把折叠来源算成默认展示的教程正文。独立审查另外列出仅默认讲解的统计。

## 证据归档与复查

初版80张页面截图和10张审核拼图见[v0.1.0证据压缩包](https://github.com/elarazju/deepinfer-illustrated/releases/download/v0.1.0/deepinfer-v0.1-evidence.zip)。本轮最终88张页面截图和96张独立审查截图在本地`research/screenshots/`及`research/tutorial-audit/`生成，归档于[v0.2.0教程改版Release](https://github.com/elarazju/deepinfer-illustrated/releases/tag/v0.2.0)，模型章后续补充的8张截图与审查记录放在同一Release的独立补充附件中；不再增加源码提交体积。当前网站的下载图由对应Actions构建生成。

推荐人工抽查的关键点是：异步调度的批次依赖、Encoder/Decoder两种有界回放、DSpark教学收益与官方观测的区别。相关原始证据分别见facts.yaml的`zos.overlap`、`yoco.replay`/`swa.hit`、`dspark.cumulative`/`dspark.results`。本轮没有声称已获得人工抽查结论。

仍保留原有边界：没有运行DeepInfer推理或复现硬件性能数据；WebKit不是Safari真机验证；自动无障碍检查不是完整WCAG认证；原始PDF不随本站分发。模型官方资料的对照见[模型来源记录](research/MODEL-SOURCES.md)。
