# 独立审核记录

审核日期：2026-10-20（Asia/Shanghai）。审核者为没有参与制作的独立 agent。只读检查制作文件；本文件是唯一审核写入。

范围：`facts.yaml` 全部 31 个 confirmed 条目、3 个 inferred 条目，锁定源码、官方 Q&A 的本地全文提取、图示及交互源码、链接与上游提交。首轮结果基于实现仍在修改中的快照，待修项不代表制作方最后状态。

## 首轮结论

核心数字、缓存策略、DSpark 与异步调度的主要描述有来源支持。未发现需要运行模型才能解决的矛盾。发现一处明确错位的事实引用（`yoco.config`），若干引用覆盖不全与交付计划缺口；首次审查不判定全计划验收通过。

独立执行 `npx tsx scripts/check-facts.ts`：通过，34 条事实、34 个引用 ID、中英键一致，未引用 unverified。该检查不能替代来源审查：其当前数字扫描只覆盖 i18n 字符串，未扫描 Svelte 内的显示数字/插值，允许列表也采用子串匹配。

## 全量事实核验表

以下 PDF 页码按 `research/qa.txt` 的换页符核对；文档正文之外的架构图片尚需视觉验收。范围型来源包含跨页内容。

| ID | 状态 | 独立核对结果 |
|---|---|---|
| release.scope | confirmed | 通过。README L3、L7、L33–42 分别支持离线核心引擎、模型、硬件和服务缺项；L3 单锚点不能覆盖所有要点，但同文件明确给出。 |
| system.disaggregation | confirmed | 基本通过。PDF p.2 明确 E/P/D 与独立存储、Recipe 和 LB；逐站顺序需结合 p.2 架构图片，不把图当严格串行的说明合理。 |
| system.parallelism | confirmed | 通过。PDF p.2：Prefill EP2–8/DP2–8、Decode EP64–128/DP64–128、VE 单卡。正文没有错误地把生产的暂不使用 CP 当成开源不支持 CP。 |
| system.minimum | confirmed | 通过。PDF p.3：1P+1D 能部署、高效率 64P+64D。 |
| zos.serial | confirmed | 通过。PDF p.9 四阶段依赖与 CPU 导致 GPU 空闲。 |
| zos.overlap | confirmed | 通过。PDF p.9 完整 N/N+1/N−1 流水线。正文明确理想稳态，避免把无空闲当实测保证。 |
| zos.remap | confirmed | 通过。`csrc/engine/zos.cpp` L142 开始，seq_id 比对、旧序列映射、新序列 -1 路径明确。 |
| eplb.strategy | confirmed | 内容通过，补引用。热门副本与重排在 p.4；Wide-EP 降访存的说明在 p.3。 |
| eplb.prefill | confirmed | 通过。PDF p.4：4 冗余起步、100 步窗、1000 步重排；EP4DP4=1.074、EP2DP2=1.045。 |
| eplb.decode | confirmed | 通过。PDF p.4：1 冗余起步、1000/10000；EP64 取整后每卡 7 专家、moe_lb=1.090。 |
| eplb.code | confirmed | 通过。`policy.py` L73 的返回映射与贪心副本分配明确；同目录 `shuffle.py` 存在权重搬运实现。 |
| yoco.ced | confirmed | 通过。PDF p.7 支持 decoder Block KV 由 encoder 末层 hidden 投影、decoder SWA 自算。 |
| yoco.replay | confirmed | 通过。PDF p.7：128、截断区间、20 层/2560、总 prefill 计算近乎减半；近似恢复已注明。 |
| yoco.config | confirmed | 内容通过、锚点错误。KEEP_TOKENS=140 在 README **L25**；当前 L28 是 deterministic sampling。128/134/140 未被混为同一参数，处理正确。 |
| swa.hit | confirmed | 通过。PDF p.7：L−134 上限、128 对齐、SWA 缺失退一块、Block KV 复用。非负截断是清楚标记的教学边界处理。 |
| storage.block | confirmed | 通过。PDF pp.5–6：Main KV+Indexer K、独立 3FS、全局前缀复用、与计算故障/扩缩容解耦。 |
| storage.ec | confirmed | 通过。PDF p.4（小节起于 p.3）：10+2、向 11 节点请求任取 10 返回。 |
| storage.pipeline | confirmed | 通过。PDF p.6：路由前元数据匹配、独立取 KV 进程、shm→HBM、GDR、逐层 overlap。 |
| storage.swa | confirmed | 通过。PDF p.6 支持 slot、stored/dropped region、机器内存和 Entrypoint 目录；同 PD 链路在 p.7 开头，建议引用扩展为 pp.6–7。 |
| storage.ttl | confirmed | 通过。PDF p.6：agent 3 天、chatbot 7 天，GC 归 3FS，正文没有承诺服务 SLA。 |
| lb.prefill | confirmed | 通过。PDF p.4：4 桶阈值、上一轮 quota、组间/组内策略、无前缀亲和。 |
| lb.chunk | confirmed | 通过。PDF p.4：FIFO、二次模型、反解 q、32768 上限和时间预算。正文恰当地未把 FLOPs 估计器视为该生产时间模型。 |
| lb.decode | confirmed | 通过。PDF p.5：请求数×KV 总长均衡，VE 按 patch 数选卡；正文省略随机选机器细节，不构成相反陈述。 |
| recipe.encode | confirmed | 通过。PDF p.10：协议转换、显式 special-token ID、普通文本分段编码、按序拼接。 |
| recipe.stream | confirmed | 通过。PDF p.10：不完整 UTF-8 缓冲、状态机、KMP 跨 chunk 继续、参数流式片段。 |
| so.pipeline | confirmed | 通过。PDF pp.9–10：约束格式、异步编译、自动机、合法 token mask。 |
| dspark.method | confirmed | 通过。PDF p.8：5 draft、confidence head、profile 吞吐曲线和预算；单请求模型与生产批内分配已区分。 |
| dspark.cumulative | confirmed | 代码事实通过。kernel L26–81 累乘、全局排名、total_q−num_seqs 分配。E(k)/T(k) 是作者明示的教学模型，不能称为源码完整调度公式。建议将教学公式和 confirmed 代码描述拆项，便于状态追踪。 |
| dspark.results | confirmed | 通过。PDF p.9：5.00→3.2–4.4、3.29 vs 3.20、EP64/DP64、约60并发、+4–7%。 |
| dspark.zos | confirmed | 通过。PDF p.9 明确 CPU 总预算、GPU 逐请求重算、累乘、排名、remap scatter、pinned buffer。 |
| model.mhc | inferred | 标注正确。`mhc_ops.py` L95–99 是 Sinkhorn 调用；残差混合接口在同文件。官方模型卡的单独证据应保留在来源日志。 |
| model.engram | inferred | 标注正确。`engram.py` L108 类说明及文件头明确 n-gram 哈希、分片表、投影、gate。 |
| model.index | inferred | 标注正确。`index_attn.py` L57 类说明明确 top-k compressed KV；`cross_layer.py` L22–53 明确共享拓扑和候选块。 |
| model.precision | confirmed | 内容通过，补引用。p.8 支持 Main KV per-16/e4m3 和 Indexer/MoE per-32/ue8m0/MXFP4；SWA MXFP8 在 p.6，应一起引用。 |

## CodeRef 和外链

对初版全部 12 个去重 README/代码目标进行了真实 HTTP 获取，均返回 200；本地锚点均在文件行数内，仓库与提交统一为 `deepseek-ai/DeepInfer@8b16149741a4935e1dec8cea27853f273b374c5b`。

| 目标 | 内容定位 |
|---|---|
| README.md:3 | 离线核心引擎说明，合理 |
| README.md:28 | 错误：应为 :25（KEEP_TOKENS） |
| README.md:44 | C1 的 Getting started 标题过泛，建议 :33 或 :38 |
| csrc/engine/zos.cpp:142 | prepare_zos_inputs，正确 |
| deepinfer/model_executor/eplb/policy.py:73 | rebalance_experts_global，正确 |
| deepinfer/model_executor/models/v4_modules/yoco.py:14 | YOCO predicate，文件相关；共享 hidden 注释从 :24 更直接 |
| deepinfer/model_executor/layers/tilelang_ops/cuda/schedule_mtp_varlen.py:26 | 累乘 phase，正确 |
| deepinfer/structure_output/matcher.py:1 | 只是 import；建议 :58 类入口或 :134 accept_token |
| deepinfer/model_executor/models/v4_modules/mhc_ops.py:95 | Sinkhorn，正确 |
| deepinfer/model_executor/models/v4_modules/engram.py:108 | Engram 类说明，正确 |
| deepinfer/model_executor/models/v4_modules/index_attn.py:57 | Indexer 类说明，正确 |
| deepinfer/model_executor/models/v4_modules/cross_layer.py:22 | 拓扑类及说明，正确 |

HTTP 200 证明可获取，不证明定位语义正确。PDF 锚点的 GitHub 在线预览能否自动跳页没有据此宣称通过。

## 内容与图示的计划差距

按实际渲染事实段落统计，未含标题、图注及演示，中文为去空白字符数，英文为词数：

| 章节 | 中文字符 | 英文词 |
|---|---:|---:|
| C1 | 566 | 235 |
| C2 | 426 | 149 |
| C3 | 508 | 218 |
| C4 | 582 | 248 |
| C5 | 635 | 294 |
| C6 | 408 | 182 |
| C7 | 375 | 163 |
| C8 | 487 | 199 |

各章仍低于计划每语言 800–1500 的下限。C3 的 DSpark 补充段落、C2/C4 演示文字也不足以让这些章整体达到英文下限。若按最小发布版交付，应明确本轮范围未满足完整版，不可将 8 章短文称为已达篇幅要求。

静态图首次审查：

- 总览：8 站、锚点跳转和未开源虚线已实现。实际页面可点击及手机版需浏览器确认。
- C1：E/P/D、存储、EP 规模已画，64P+64D 高效最小单元尚仅在正文。
- C2：静态双泳道有 before/after；CPU 下一批/更早批只有自然语言缩写，没有完整 N+1/N−1 关系标签。
- C3：卡×专家和副本存在；统计窗/重排周期与 moe_lb 数值未入图。
- C4：当前是数据流框图，缺少计划要求的层堆叠；128 后缀也未在图中明确显示。
- C5：两种缓存路径已画；10+2/发11取10、TTL 只在正文。
- C6：三种路由依据已画；4 档阈值及二次模型仅在正文。
- C7：编码、异步编译、mask、解析路径存在；special-token 分段、UTF-8/KMP 在正文解释。
- C8：采用明确标注的代码关系示意，不将其声称为完整官方模型架构。

初次读取时，`scripts/export-svg.ts` 和实际 SVG/PNG 导出尚未完成，下载链接仅为约定路径；这是进行中的制作项，需最终复核。

## 交互实现的独立审查

- DSpark：累乘、包含 k=0 的预期输出、示意耗时比值、最大值选择、固定/动态模式均与教学描述相符。没有把示意 throughput 当生产 benchmark。真实数字独立框显示。默认值从事实库读取。
- SWA：安全余量、128 对齐、SWA 缺失回退一块、零命中截断及注意力窗口公式正确。`cached` 时没有无故执行回放。默认值从事实库读取。
- Timeline：模型是理想稳态占用示意，不是生产模拟。初版交互只画 Schedule 和 Post-process 两个 CPU 块，没有 launch_forward/launch_sample 和 N+1/N−1 标签，未完整复现 C2 的机制；需补全或明确简化。
- 源码使用原生按钮与 range，有可聚焦标签；Timeline 监听 reduced-motion 并禁用播放。源码层面支持不等于已验证所有浏览器和辅助技术。
- 本审核没有运行模型，也没有声称验证吞吐、GPU 空闲率、数值等价。

## 上游变化

独立执行 `git -C vendor/deepinfer rev-parse HEAD` 和 `git -C vendor/deepinfer ls-remote origin HEAD`，两者均为 `8b16149741a4935e1dec8cea27853f273b374c5b`。检查当时默认分支没有锁定提交后的更新，故没有因上游新版本受影响的章节。本结论不覆盖检查后的未来提交。

## 视觉与浏览器验收

待主制作方提供当前预览和截图后独立复核。首次报告**没有**声称截图验收、Chrome 运行、WebKit 运行或 Safari 真机通过。

## 二次复核（制作方修正后）

本节覆盖已修正的状态，前述初次问题保留为审计轨迹。

### 来源与文字

- 初次的 README 行号和 PDF 覆盖页码问题已修正；章节 CodeRef 的 README:33 与 matcher.py:58 已指向相关位置。
- 新增 `yoco.equivalence` 经独立读取 `examples/yoco/README.md` 验证：比较 mask/compact 的元数据与兼容 checkpoint 输出，限制为相同截断语义，表述准确。
- 独立重新执行事实检查：35 条事实、35 个引用 ID，通过。新版检查增加 Svelte Text 节点与展开段落的数字/refs 检查；仍需人工审查机制含义，数字集合匹配不能证明句子语义。
- 独立阅读官方报告已提取的 §2.2–2.4.4：CED 的 encoder hidden 投影、CSA2 的共享模式/候选池、Single-Pass mHC、Engram、DSpark 条件置信度与前缀存活率、Main KV 与 SWA 低精度格式，没有发现与现有正文相矛盾的科学性表述。没有用这些材料声称实际运行了模型。
- `MODEL-SOURCES.md` 的对应章节与提取正文吻合。C8 仍明确为代码导读；其规模不是阶段3的 C1–C7 篇幅验收对象。

重计“事实正文 + 可展开完整讲解”，中文按去空白字符、英文按词：

| 章节 | 中文字符 | 英文词 | 800–1500 |
|---|---:|---:|---|
| C1 | 1181 | 888 | 通过 |
| C2 | 982 | 842 | 通过 |
| C3 | 1071 | 829 | 通过 |
| C4 | 1277 | 897 | 通过 |
| C5 | 1201 | 886 | 通过 |
| C6 | 1017 | 833 | 通过 |
| C7 | 960 | 825 | 通过 |

### 独立浏览器执行

审核者编写并亲自运行 `research/audit-browser.mjs`，不是仅复述制作方测试结果。详细输出见 `research/independent-browser-results.json`。

Chrome 与 Playwright WebKit × 中/英 × 浅/深 × 1280/375，共16组合：

- 页面均无横向溢出，8章和展开长文均存在并可展开。
- 静态 SVG 文字边界未超出整体 viewBox（此项不自动排除卡片内部拥挤或文字相互重叠）。
- DSpark 首个概率滑块以键盘归零后选择变为零验证；SWA 短输入归零；reduced-motion 下播放按钮禁用。
- 无 pageerror；每组合18个图像下载链接均成功获取，覆盖全部72种 SVG/PNG 文件。
- 此结果是 Chrome 和 WebKit 引擎测试；**不等于 macOS/iOS Safari 真机验收**，也不覆盖所有屏幕阅读器。

### 视觉反馈与待复核项

已打开原始章节截图检查所有9种静态图的内容，并横跨中英、浅深和两种宽度抽检。新增 EPLB 数字/周期/指标、64P+64D、128 replay、EC/TTL 已进入图。交互时间线新增 N+1/N−1 与 launch 标记，核心机制缺口已补齐。

首次看到的80张截图中，章节截屏会把 sticky header 合成到章节中部，少数含焦点状态的 skip-link；审核者已反馈，待重新生成干净证据。旧截图不能当作无遮挡视觉验收依据。另反馈了静态时间线文字拥挤、375中文总览站名贴边、C1箭头穿过最小单元文字；需最终截图确认修复。

### 最终视觉复核

对19:05重新生成的80张截图制作10张对照拼图（`research/audit-montages/`），覆盖首页、总览、8章的中英/深浅/1280与375全部组合；逐张查看拼图，并对时间线、总览、路由等问题位置打开原始截图细看。确认：

- 首页截图回到顶部，章节截图没有 sticky header 或 skip-link 遮挡。
- 中文移动总览的 Entrypoint 站名已分行；静态时间线的轮次与操作名分行，没有此前碰撞。
- C1 的最小单元文字避开竖直箭头；C6 新增4档阈值及二次 cost(q,c) 反解说明；C7 新增 special-token 分段并行及 UTF-8/KMP 说明。
- 375宽度的总览完整自适应；其他静态图使用图内水平滚动保持字形大小。这不是整页水平溢出；建议将来加“横向滑动看完整图”提示，属于体验改进。
- C8 残差/mHC 原用 CPU 语义色，Indexer 与交互 Timeline sample 原用网络色。审核反馈后均统一为 GPU 色；最终重新打开 model/scheduling 原图与全部组合拼图确认，最新导出与截图已同步。

最终补充复核还覆盖了重新生成的 home/model/scheduling 共24张截图。语义色修复没有引入排版遮挡。制作方的自动 axe 四种语言/主题组合报告无违规，22组文字语义色对比度记录均至少4.5、最小4.71；审核已阅读这些结果，保留 incomplete 需要人工判断与非完整认证的边界。

本次来源、功能和视觉审查未发现阻断发布的问题。发布地址、线上部署状态和真实 Safari 设备不在本审核已验证范围，不能据此宣称完成。D5由制作方完成线上部署后另行核验。
