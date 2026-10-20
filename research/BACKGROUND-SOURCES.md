# Background source verification

Checked 2026-10-20 by the implementation agent. Sources were opened and relevant sections inspected; this table is not the independent audit. Background explains general mechanisms only. Numerical examples belong to demo_defaults.

| ID | Opened source and location | Result |
|---|---|---|
| bg.autoregressive | [Vaswani et al., Attention Is All You Need, §3](https://arxiv.org/html/1706.03762v7) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.sampling | [Leviathan et al., Speculative Decoding, §2.2](https://arxiv.org/html/2211.17192) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.token | [Hugging Face Transformers, Tokenization algorithms](https://huggingface.co/docs/transformers/main/en/tokenizer_summary) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.special_token | [Hugging Face Transformers, PreTrainedTokenizer, special tokens](https://huggingface.co/docs/transformers/main_classes/tokenizer) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.representation | [Vaswani et al., §3.1–3.4](https://arxiv.org/html/1706.03762v7) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
| bg.kv_cache | [Kwon et al., PagedAttention, §2.1–2.2; tensor shapes](https://arxiv.org/html/2309.06180) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
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
| bg.fp8 | [Micikevicius et al., FP8 Formats for Deep Learning, §2](https://arxiv.org/html/2209.05433) | Supports the scoped paraphrase; no DeepInfer implementation claim. |
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
