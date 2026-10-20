export const chapters = [
  { id: 'system', facts: ['system.disaggregation', 'system.parallelism', 'system.minimum', 'release.scope'], code: 'README.md', line: 33 },
  { id: 'scheduling', figure: 'timeline', facts: ['zos.serial', 'zos.overlap', 'zos.remap'], code: 'csrc/engine/zos.cpp', line: 142 },
  { id: 'experts', facts: ['eplb.strategy', 'eplb.prefill', 'eplb.decode', 'eplb.code'], code: 'deepinfer/model_executor/eplb/policy.py', line: 73 },
  { id: 'yoco', facts: ['yoco.ced', 'yoco.replay', 'yoco.config', 'swa.hit', 'yoco.equivalence'], code: 'deepinfer/model_executor/models/v4_modules/yoco.py', line: 14 },
  { id: 'storage', facts: ['storage.block', 'storage.ec', 'storage.pipeline', 'storage.swa', 'storage.ttl'], closed: true },
  { id: 'routing', facts: ['lb.prefill', 'lb.chunk', 'lb.decode'], closed: true },
  { id: 'recipe', facts: ['recipe.encode', 'so.pipeline', 'recipe.stream'], code: 'deepinfer/structure_output/matcher.py', line: 58 },
  { id: 'model', facts: ['model.mhc', 'model.engram', 'model.index', 'model.precision'], code: 'deepinfer/model_executor/models/v4_modules/cross_layer.py', line: 22 },
];
