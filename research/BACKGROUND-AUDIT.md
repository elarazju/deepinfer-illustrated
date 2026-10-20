# 背景来源独立审核（v2）

审核日期：2026-10-20。审核者：独立 agent `v2_background_audit`，未参与背景条目、术语和页面的制作。本报告不是人工审稿证明。

## 范围与方法

本轮逐条阅读 facts.yaml 的 31 个 `bg.*` 条目及 glossary.yaml 的 53 个术语（中英文），按链接实际打开论文、作者仓库、官方文档或标准，定位相关正文。制作方 BACKGROUND-SOURCES.md 仅用于找到线索，未将其自述当作核验证据。下表链接均由本审核者访问；多数用网页正文与定点搜索阅读。OCP 标准读取 PDF 文本；模型报告的网页阅读器失败后，另从 Hugging Face resolve 地址下载到内存，用 pypdf 提取第 9–11、13 页。也独立读取锁定提交的 Q&A PDF 第 4、5、7 页，核查 glossary 中三个 DeepInfer 专属条目。

首轮先完成数据与定义核验。第二轮已检查 Basics、reading、Decode Lab、FactBadge、Chapter、Term、CodeSnippet 的中英文文案与渲染源码，见文末复查。该检查不等于真实浏览器中的所有布局或首次出现行为验收，不从源码通过推断视觉通过。

## 首轮问题（历史记录；关闭状态见复查）

- **需修正：Sinkhorn 的适用矩阵。** 来源明确为所有元素为正的 n×n 方阵。bg.sinkhorn 与术语 long 只说“正矩阵”，会包含不能同时归一为每行每列和均为 1 的长方阵；需补“正方阵 / positive square matrix”。
- **需修正：稀疏注意力范围。** glossary 的 sparse-attention long 将 indexer/top-k 当作所有稀疏注意力的定义。应限定为本页解释的 top-k 路径；固定窗口也是一种稀疏模式。
- **完善公式边界与定位：** KV 字节公式是在单序列、各层相同 KV 头数、K/V 维度与元素宽度一致、各层独立缓存的普通未压缩布局下按张量元素数相乘。PagedAttention §3 的 OPT 实例直接展示类似乘积；当前 ref 只写 §2，应加入 §3。此式不是 CED/MLA/跨层共享缓存估算器，已有排除 CED 的边界应保留。
- **完善来源定位：** bg.fp8 的位字段与 E4M3/E5M2 对照位于论文 §3 / Table 1，缩放讨论在 §2 和 §3.2；ref 不宜只写 §2。

上述意见已发送制作方。首轮结论：来源均真实且可访问，未发现捏造论文或数值；两处定义边界需要收紧，两处定位/公式说明需要完善。尚不能写成无条件最终通过。

## bg.* 逐条核验

“通过”仅针对条目当前声明的背景范围，不支持据此声称 DeepInfer 实际实现或生产收益。

| ID | 实际核验的来源及位置 | 结果与支持范围 |
|---|---|---|
| bg.autoregressive | [Transformer §3](https://arxiv.org/html/1706.03762v7)，正文的生成反馈路径 | 通过；按已有序列逐步预测。未将翻译 encoder/decoder 直接套入 CED。 |
| bg.sampling | [Speculative Decoding §2.2](https://arxiv.org/html/2211.17192)，调整分布与 argmax 说明 | 通过；贪心可表示为退化分布，不等同一般随机采样行为。 |
| bg.token | [HF Tokenization algorithms](https://huggingface.co/docs/transformers/main/en/tokenizer_summary)，subword 和词表示例 | 通过；token 边界依赖算法和词表，不固定等于字或词。 |
| bg.special_token | [HF Tokenizer](https://huggingface.co/docs/transformers/main_classes/tokenizer)，bos/eos/sep 参数定义 | 通过；边界/控制角色有定义。 |
| bg.representation | [Transformer §3.1–3.4](https://arxiv.org/html/1706.03762v7)，残差式、attention 式、embedding 段 | 通过；中间表示、Q/K/V 与残差概念吻合。 |
| bg.kv_cache | [PagedAttention §2.1–2.2 与 §3](https://arxiv.org/html/2309.06180)，缓存语义及 OPT 存储实例 | 公式有条件成立；需补同质布局假设与 §3 定位，见首轮问题。 |
| bg.prefix | [SGLang §3](https://arxiv.org/html/2312.07104)，相同前缀与 token 序列到 KV 的映射 | 通过；是精确前缀兼容复用，不是语义检索。 |
| bg.prefill_decode | [DistServe §2.1、§3.1–3.2](https://arxiv.org/html/2401.09670)，长输入、批量与瓶颈段 | 通过；保留“较长输入”“小批量”“往往”限定，未绝对化瓶颈。 |
| bg.batching | [Orca 官方会议页摘要](https://www.usenix.org/conference/osdi22/presentation/yu)，iteration-level scheduling 段 | 通过；迭代粒度可改变 batch 成员。 |
| bg.chunk | [Sarathi §4.2–4.3](https://arxiv.org/html/2308.16369)，分块和混合批处理 | 通过；连续输入分块仍保留前序上下文依赖。 |
| bg.moe | [DeepSeekMoE §2、§3.2–3.3](https://arxiv.org/html/2401.06066)，shared expert 与 device balance | 通过；共享专家、路由专家与设备不均衡分开。 |
| bg.parallel | [Megatron-LM §2.3、§3、Appendix A](https://arxiv.org/html/1909.08053)，复制组与层内切分 | 通过；背景概念可用于推理解释，不把训练梯度通信说成推理必需。 |
| bg.ep | [DeepEP README](https://github.com/deepseek-ai/DeepEP)，all-to-all、dispatch/combine 说明及 API 示例 | 通过；分发表示、返回并合并输出。未声称每次每对设备均传非零数据。 |
| bg.swa | [Mistral §2](https://arxiv.org/html/2310.06825)，跨层感受野与 rolling cache | 通过；直接窗口有限与跨层信息传播并存。 |
| bg.yoco | [YOCO §2、Figure 2](https://arxiv.org/html/2405.05254)，两部分因果掩码及共享 KV 式 | 通过；明确 self-decoder/cross-decoder 是语言模型内部层组。 |
| bg.speculative | [Speculative Decoding §2.1、Algorithm 1、§3.1、§3.3](https://arxiv.org/html/2211.17192) | 通过；先草稿、并行验证、前缀接受；收益取决于接受与成本。未套用论文加速倍数到 DSpark。 |
| bg.cuda | [CUDA §2.5.1–2.5.3](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/asynchronous-execution.html)，异步返回、流与同步 | 通过；返回不等于开始/完成，流有序不保证跨流重叠。 |
| bg.graph | [CUDA Graphs §4.2.2](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cuda-graphs.html)，定义/实例化/执行阶段 | 通过；降低提交成本的表述有据，不取消依赖。 |
| bg.constraints | [XGrammar §2.1–2.2](https://arxiv.org/html/2411.15100)，logit mask 与 PDA | 通过；语法约束与内容真实性严格分开。 |
| bg.sse | [WHATWG HTML §9.2.5–9.2.6](https://html.spec.whatwg.org/multipage/server-sent-events.html)，UTF-8 与逐行事件解析 | 通过；网络读取块不必完整包含事件。 |
| bg.fp8 | [FP8 Formats §2–3 / Table 1](https://arxiv.org/html/2209.05433)，位域和缩放 | 内容通过；来源章节需更精确。 |
| bg.mx | [OCP MX v1.0 §5.1–5.4](https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf)，PDF 第 9–14 页 | 通过；块规模、元素格式与 scale 格式分别定义。 |
| bg.erasure | [Ceph Erasure code / Glossary](https://docs.ceph.com/en/latest/rados/operations/erasure-code/)，K、M、recovery | 通过；没有将任意编码都泛称为可由任意 k 块恢复。 |
| bg.gdr | [NVIDIA GPUDirect RDMA §1、§3.4](https://docs.nvidia.com/cuda/gpudirect-rdma/)，peer path 与 topology | 通过；保留硬件/驱动/拓扑条件。此来源本身不能证明 DeepInfer GDR 实现细节。 |
| bg.metrics | [DistServe §1–3](https://arxiv.org/html/2401.09670)，TTFT/TPOT 与 SLO attainment/goodput 定义 | 通过；goodput 在该来源是满足 SLO 达成率要求的服务能力，不能误读为简单删除超时样本的 token/s。 |
| bg.sinkhorn | [Nathanson 摘要](https://arxiv.org/abs/1905.09426)，正 n×n 方阵交替缩放 | 需补方阵条件；有限迭代近似的术语说明合理。 |
| bg.ngram | [DeepSeek V4.1 报告 §2.4.2](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/resolve/main/DeepSeek_V41_Tech_Report.pdf)，实际 PDF 第 13 页 | 通过；片段、哈希、有限表和向量查找。哈希可能碰撞是有限映射性质的推论，未声称每个片段都有唯一地址。 |
| bg.sparse | [同一报告 §2.3](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/resolve/main/DeepSeek_V41_Tech_Report.pdf)，实际 PDF 第 9–11 页、Figure 4 | 条目已限定 top-k，内容通过；术语 long 需同样限定。 |
| bg.pareto | [pymoo Preface](https://pymoo.org/getting_started/preface.html)，目标方向与 non-dominated solution set 段 | 通过；非支配集合定义与先认清坐标方向的阅读规则一致。 |
| bg.utilization | [nvidia-smi Utilization](https://docs.nvidia.com/deploy/nvidia-smi/index.html)，GPU 采样时间定义 | 通过；有 kernel 执行的时间比例不等于峰值算力比例。 |
| bg.utf | [WHATWG Encoding §8.1.1](https://encoding.spec.whatwg.org/#utf-8-decoder)，bytes needed/seen 状态机 | 通过；多字节字符与跨读取保留解码状态有据。非法序列会走错误处理，不应理解成永远等待。 |

## 术语逐条核验

以下针对术语 `short`、`long` 两种语言逐条核查。除明确指出的待修项外，引用与定义在上表范围内匹配。首现章节和 UI 行为不包含在本轮通过范围。

| 术语 ID | 引用 | 结果 |
|---|---|---|
| token | bg.token | 通过；定义与所引背景范围一致。 |
| tokenizer | bg.token | 通过；定义与所引背景范围一致。 |
| special-token | bg.special_token | 通过；定义与所引背景范围一致。 |
| autoregressive | bg.autoregressive | 通过；定义与所引背景范围一致。 |
| sampling | bg.sampling | 通过；定义与所引背景范围一致。 |
| embedding | bg.representation | 通过；定义与所引背景范围一致。 |
| hidden-state | bg.representation | 通过；定义与所引背景范围一致。 |
| attention | bg.representation | 通过；定义与所引背景范围一致。 |
| qkv | bg.representation | 通过；定义与所引背景范围一致。 |
| kv-cache | bg.kv_cache | 通过；定义与所引背景范围一致。 |
| prefix-cache | bg.prefix | 通过；定义与所引背景范围一致。 |
| prefill-decode | bg.prefill_decode | 通过；定义与所引背景范围一致。 |
| bandwidth | bg.prefill_decode | 通过；定义与所引背景范围一致。 |
| pd-separation | bg.prefill_decode | 通过；定义与所引背景范围一致。 |
| batching | bg.batching | 通过；定义与所引背景范围一致。 |
| continuous-batching | bg.batching | 通过；定义与所引背景范围一致。 |
| chunked-prefill | bg.chunk | 通过；定义与所引背景范围一致。 |
| moe | bg.moe | 通过；定义与所引背景范围一致。 |
| expert-routing | bg.moe | 通过；定义与所引背景范围一致。 |
| shared-expert | bg.moe | 通过；定义与所引背景范围一致。 |
| expert-replica | eplb.strategy | 通过；另核对 Q&A p.4 热门专家副本，不是新逻辑专家。 |
| dp | bg.parallel | 通过；定义与所引背景范围一致。 |
| tp | bg.parallel | 通过；定义与所引背景范围一致。 |
| ep | bg.ep | 通过；定义与所引背景范围一致。 |
| all-to-all | bg.ep | 通过；定义与所引背景范围一致。 |
| swa | bg.swa | 通过；定义与所引背景范围一致。 |
| yoco | bg.yoco | 通过；定义与所引背景范围一致。 |
| ced | yoco.ced | 通过；另核对 Q&A p.7 与模型报告 p.9，指内部因果层组。 |
| block-kv | storage.block | 通过；另核对 Q&A p.5 Main KV + Indexer K，与 SWA 分开。 |
| speculative-decoding | bg.speculative | 通过；定义与所引背景范围一致。 |
| acceptance | bg.speculative | 通过；定义与所引背景范围一致。 |
| kernel-launch | bg.cuda | 通过；定义与所引背景范围一致。 |
| cuda-stream | bg.cuda | 通过；定义与所引背景范围一致。 |
| cuda-graph | bg.graph | 通过；定义与所引背景范围一致。 |
| constrained-decoding | bg.constraints | 通过；定义与所引背景范围一致。 |
| token-mask | bg.constraints | 通过；定义与所引背景范围一致。 |
| automaton | bg.constraints | 通过；定义与所引背景范围一致。 |
| sse | bg.sse | 通过；定义与所引背景范围一致。 |
| fp8 | bg.fp8 | 通过；定义与所引背景范围一致。 |
| mx | bg.mx | 通过；定义与所引背景范围一致。 |
| erasure-code | bg.erasure | 通过；定义与所引背景范围一致。 |
| gpudirect-rdma | bg.gdr | 通过；定义与所引背景范围一致。 |
| ttft | bg.metrics | 通过；定义与所引背景范围一致。 |
| tpot | bg.metrics | 通过；定义与所引背景范围一致。 |
| throughput | bg.metrics | 通过；定义与所引背景范围一致。 |
| goodput | bg.metrics | 通过；定义与所引背景范围一致。 |
| residual | bg.representation | 通过；定义与所引背景范围一致。 |
| sinkhorn | bg.sinkhorn | 待修：补充严格正方阵条件，有限迭代近似说明保留。 |
| ngram-hash | bg.ngram | 通过；定义与所引背景范围一致。 |
| sparse-attention | bg.sparse | 待修：long 限定为本页 top-k 路径，不能泛指全部稀疏注意力。 |
| pareto | bg.pareto | 通过；定义与所引背景范围一致。 |
| gpu-utilization | bg.utilization | 通过；定义与所引背景范围一致。 |
| utf | bg.utf | 通过；定义与所引背景范围一致。 |

## 重点边界结论

1. KV 公式的系数 2 来自 K、V 两份等大小缓存；乘以 token、层、KV 头、每头维度、元素字节数得到数据负载字节。分页表、padding、scale、复制和共享规则不在公式内，不能据此算 CED 生产显存。
2. Prefill/Decode 的处理依赖与瓶颈分开：输入已知允许并行处理位置，普通自回归 Decode 有后继依赖；算力/带宽约束随批量、序列、硬件变化。
3. 原始 YOCO 两个部分都因果；DeepInfer CED 是具体模型布局。数据层用 bg.yoco 说明前者、yoco.ced 说明后者，引用没有互相替代。
4. 投机接受的前缀存活概率与单位置条件接受率不同。论文的 i.i.d. 简化公式不可自动套到 DSpark 的 confidence 累乘示意；当前背景条目没有这样做。
5. n-gram、Sinkhorn、top-k 是机制背景，不是模型能力、训练收益或锁定推理代码每条分支的证明。最终页面需要继续检查这一层隔离。

## 待续复查

- 制作方修正上述条目后，重新读取精确文本确认。
- 页面完成后核查 C0、背景卡、术语解释与 C8：背景标识可见，DeepInfer 专属行为使用 readme/code/qa_pdf 来源，教学数值明确属于示意参数。
- 不将这个 agent 报告写成人类初学者可理解性测试，也不宣称完整审阅所有外部论文结论。


## 第二轮复查：修复与页面引用边界

复查日期：2026-10-20。范围为当前工作区源文件，不声称已核验发布版本。逐字重新读取 facts.yaml、glossary.yaml，两语言的 basics、reading、decodeLab，以及相应 Svelte 渲染代码。

### 已复核关闭

| 首轮项 | 当前修复 | 结论 |
|---|---|---|
| Sinkhorn | bg.sinkhorn 与术语 long 均明确严格正元素的正方阵；英文为 strictly positive square matrix | 关闭；与已实际阅读的 Nathanson 假设一致。 |
| 稀疏注意力 | 术语 long 明确“本页介绍的 top-k 路径”，并说明固定窗口也可稀疏且不需要该 indexer | 关闭；不再把一个实现类别当作全部稀疏注意力。 |
| KV 公式 | 添加单序列、各层同 KV 头数、相同 K/V 维度；ref 加入 §3 与 generalized tensor-shape accounting；交互声明每层同布局、未压缩、示意、不估算 DeepInfer | 关闭；此处使用普通同质缓存模型，字节乘积与单位正确。 |
| FP8 定位 | ref 改为 §2–3 | 关闭；覆盖格式及缩放讨论。 |

### 当前文案的证据使用

- **C0 / Basics：** 生成、缓存、阶段、指标的基础解释使用 bg.*；专家段落介绍物理副本时另有 eplb.strategy；并行段落给出 DeepInfer attention DP / MoE EP 时另有 system.parallelism。KV 交互的每步读取是明确限定的一次完整历史读取理想值，未冒充生产流量。
- **系统与调度正文：** 一般 Prefill/Decode 瓶颈和 CUDA 异步语义由背景来源支持；官方并行区间和 ZOS/remap 行为分别引用 Q&A/代码。中英文都明确部署区间不能由通识直接推出。
- **EPLB 正文：** MoE 路由与 shared expert 是背景；physical replica、重排、shuffle 与生产统计使用 eplb.*。示意 E3′ 没有被说成新训练专家。
- **YOCO/CED 正文：** bg.swa 与 bg.yoco 只解释局部窗口与原始 YOCO；进入 DeepInfer CED 后使用 yoco.ced、yoco.replay 和 swa.hit，保留 Encoder/Decoder 回放触发与起点差异。
- **存储正文：** 明示 erasure-code / GPUDirect 背景不证明具体存储部署；服务未开源且依赖 Q&A；本地环形缓存代码不被冒充远端存储实现。没有把通用 GDR 定义用来省略共享主机内存阶段。
- **路由正文：** chunk 与 KV 是背景；分桶、预算、Decode 双维度使用 lb.*。明确普通 FLOPs 估算器不等于在线二次耗时模型，教学长度比不等于实测耗时比。
- **Recipe 正文：** tokenizer、UTF-8、SSE、语法 mask 使用背景；DeepInfer 流式解析与异步编译另引 recipe.stream、so.pipeline。背景语法正确不等于内容正确的边界明确。
- **模型正文：** 第一段明确背景定义不替代实现证据；n-gram/FP8/MX 的基础概念与 model.precision 分开，mHC/Engram/index 使用 model.*。Chapter.svelte 对含 inferred 引用的段落显示显式推断标记。未发现从 Sinkhorn 或哈希机制反推训练能力的断言。
- **Decode Lab：** 验证代价接近短 Decode 有“权重搬运主导、仍有空闲算力”的条件；采用 bg.speculative 解释一般机制，intro/演示分别引用 dspark.method、dspark.cumulative、dspark.zos。滑块曲线和官方结果分开，没有把论文的实验加速或 i.i.d. 公式移植为 DSpark 实测。
- **标识代码：** FactBadge 根据 source 显示“背景知识 / Background”，独立 data-source；模型推断由 Chapter 显式标识。这里核查了渲染条件，未在本轮宣称人工浏览器可见性测试。

上述读取未发现背景论文被当作 DeepInfer 专属部署参数、实现或性能收益的替代证据。

### 新增 KMP 与代码片段

术语总数现为 54，新增 `kmp`，refs 为 recipe.stream 与 snippet.recipe。

本审核者重新从锁定提交下载 `deepinfer/structure_output/matcher.py` 并核对第 24–33 行，和 snippet.recipe 的 text 完全一致；第 74–75 行表明该 helper 用于 trigger token 序列的匹配状态。逐行注释正确说明失败表初始化、失配回退及匹配扩展。另从锁定提交重新读取 Q&A PDF 第 10 页，确认 Recipe 跨 chunk 的 UTF-8 缓冲、状态机和 KMP 增量分隔符匹配描述。术语定义本身通过。

仍建议完善两处来源衔接（不影响上述定义核验结论）：

1. snippet.recipe 是结构化输出 trigger token 的 KMP 失败表构建，并不是 Recipe 输出字节流解析器源码。建议在片段注释中明确两者差别，避免读者将相邻的流式段落误认为该函数的全部调用场景。
2. Decode background 段末句转到 DSpark 验证候选数，紧随的 refs 仍只有 bg.*。下面 intro 已有 dspark.method，未形成无来源的整章断言，但在转折句处补该引用或把句子移到 intro 会更精确。

### 本轮剩余限制

源文本、引用关系与标识分支已复查；完整中英文主题/尺寸视觉验收、键盘和触控行为、初学者实际理解测试属于其他验收步骤。此报告仍为独立 agent 复核，不等于人工评审。


## 最终小项复核关闭

2026-10-20 再次直接读取当前 facts.yaml 与中英文字典：

- `snippet.recipe` 第 25 行对应注释，两语均明确该 helper 为结构化输出的 token 触发序列构建失败表，并将跨 chunk 流式解析行为指向本章 Q&A。代码身份与部署叙述现已分清，关闭第二轮建议 1。
- `decodeLab.background.refs` 两语均为 `bg.autoregressive`、`bg.speculative`、`dspark.method`。DSpark 转折句现在有专属 Q&A 引用，关闭第二轮建议 2。

本报告提出的四项首轮问题与两项第二轮建议均已复核关闭；截至本次源文件审查，无剩余来源/定义整改项。此结论保留前述范围：独立 agent 的数据、文案及引用分支审核，不替代完整浏览器视觉验收或真人阅读测试。
