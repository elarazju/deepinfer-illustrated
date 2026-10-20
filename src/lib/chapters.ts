const originalChapters = [
  { id: 'system', facts: ['system.disaggregation', 'system.parallelism', 'system.minimum', 'release.scope'], code: 'README.md', line: 33 },
  { id: 'scheduling', figure: 'timeline', facts: ['zos.serial', 'zos.overlap', 'zos.remap'], code: 'csrc/engine/zos.cpp', line: 142 },
  { id: 'experts', facts: ['eplb.strategy', 'eplb.prefill', 'eplb.decode', 'eplb.code'], code: 'deepinfer/model_executor/eplb/policy.py', line: 73 },
  { id: 'yoco', facts: ['yoco.ced', 'yoco.replay', 'yoco.config', 'swa.hit', 'yoco.equivalence'], code: 'deepinfer/model_executor/models/v4_modules/yoco.py', line: 14 },
  { id: 'storage', facts: ['storage.block', 'storage.ec', 'storage.pipeline', 'storage.swa', 'storage.ttl'], closed: true },
  { id: 'routing', facts: ['lb.prefill', 'lb.chunk', 'lb.decode'], closed: true },
  { id: 'recipe', facts: ['recipe.encode', 'so.pipeline', 'recipe.stream'], code: 'deepinfer/structure_output/matcher.py', line: 58 },
  { id: 'model', facts: ['model.mhc', 'model.engram', 'model.index', 'model.precision'], code: 'deepinfer/model_executor/models/v4_modules/cross_layer.py', line: 22 },
];

export const chapterMetadata = [
 {prereqs:['prefill-decode','dp','ep'],level:'beginner',minutes:8},
 {prereqs:['kernel-launch','cuda-stream','continuous-batching'],level:'advanced',minutes:9},
 {prereqs:['moe','ep','all-to-all','expert-replica'],level:'advanced',minutes:9},
 {prereqs:['swa','yoco','hidden-state','kv-cache'],level:'advanced',minutes:12},
 {prereqs:['prefix-cache','block-kv','erasure-code','gpudirect-rdma'],level:'advanced',minutes:9},
 {prereqs:['prefill-decode','chunked-prefill','kv-cache'],level:'advanced',minutes:8},
 {prereqs:['tokenizer','special-token','constrained-decoding','utf'],level:'beginner',minutes:9},
 {prereqs:['residual','sparse-attention','sinkhorn','ngram-hash'],level:'expert',minutes:12},
] as const;
export const chapters=[0,1,2,6,5,3,4,7].map((copyIndex,index)=>({
 ...originalChapters[copyIndex],...chapterMetadata[copyIndex],copyIndex,
 number:String(index<2?index+2:index+3).padStart(2,'0'), snippet:`snippet.${originalChapters[copyIndex].id}`,
}));

export const decodeMetadata = {id:'decode-lab',number:'04',level:'advanced',minutes:8,prereqs:['speculative-decoding','acceptance']} as const;
