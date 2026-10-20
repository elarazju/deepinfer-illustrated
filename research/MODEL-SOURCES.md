# 模型章官方资料对照

核验日期：2026-10-20。仅阅读代码与材料；未运行模型。

官方模型卡：[DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)。

官方技术报告：[DeepSeek_V41_Tech_Report.pdf](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf)。已读取并对照以下章节，原始 PDF 仅在忽略的本地 research 目录保留：

| 内容 | 官方报告 | 锁定代码 | 本站处理 |
|---|---|---|---|
| CED、decoder global KV 来自 encoder hidden | §2.2，p.9 | `v4_modules/yoco.py`, `cross_layer.py` | 与 Q&A 的 C4 表述一致 |
| KV、indexer K、top-k 共享 | §2.3.1，pp.10–11 | `cross_layer.py`, `index_attn.py` | 描述接口与共享关系；不猜测每个 checkpoint 的分支 |
| 分层候选池 | §2.3.2，pp.11–12 | `index_attn.py` | 只说明后续 indexer 限定候选范围 |
| Single-Pass mHC | §2.4.1，pp.12–13 | `hc.py`, `mhc_ops.py` | 报告明确组件设计；具体调用关系继续保守标为 inferred |
| Engram n-gram 哈希、门控 | §2.4.2，p.13 | `engram.py` | 描述 lookup、projection、gate；不引入外部文档检索比喻 |
| DSpark confidence 与前缀概率 | §2.4.3，pp.13–14 | `schedule_mtp_varlen.py`, `mtp_varlen.hpp` | 单请求演示显著标注简化，不冒充全局生产调度 |
| Main KV E2M1 / E4M3 per-16；SWA FP8 | §2.4.4，p.14 | Q&A 低精度与 SWA 存储段；`compress.py` | 对象区分，不统称全部缓存为 MXFP4 |

官方材料并非严重不足，因此没有因缺少论文而删除 C8。C8 保持代码导读的表达方式，保守标注推断，没有从推理实现倒推出未经核验的设计动机或训练结果。
