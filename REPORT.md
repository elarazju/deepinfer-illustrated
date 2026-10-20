# DeepInfer Illustrated — 教程改版与验收

日期：2026-10-20。源码证据仍锁定 `8b16149741a4935e1dec8cea27853f273b374c5b`。

[网站](https://elarazju.github.io/deepinfer-illustrated/) · [仓库](https://github.com/elarazju/deepinfer-illustrated) · [初版证据归档](https://github.com/elarazju/deepinfer-illustrated/releases/tag/v0.1.0)

## 这次改了什么

1. **阅读路径**：DSpark从专家负载均衡章移到异步调度之后的独立Decode Lab。侧栏、首页入口和总览Decode节点都能进入实验区。
2. **正文**：C1–C7默认展示连贯叙述，每段关联具体来源。精确来源条目及适用范围集中在章末“来源与适用范围”。未开源服务提示仍在章首可见；C8仍为带推断标记的代码导读。
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
- 发布与图片一致性：[本轮Actions](https://github.com/elarazju/deepinfer-illustrated/actions/runs/39417747395)构建和部署成功，站点代码提交为`499f96d55a1e190ee9515ceab68d6d91fd6fba86`。线上检查通过中文浅色桌面、英文深色手机，验证独立Decode Lab、36个可见下载链接的内容哈希及清单提交号，见[线上检查](research/published-results.json)。清单包含本轮全部72个导出文件。

## 篇幅统计口径

[篇幅结果](research/content-lengths.json)统计“默认讲解 + 章末来源条目”，保持初版的同一口径。C1–C7总篇幅为中文1190–1497非空字符、英文802–842词。默认英文讲解本身约500–660词；没有把折叠来源算成默认展示的教程正文。独立审查另外列出仅默认讲解的统计。

## 证据归档与复查

初版80张页面截图和10张审核拼图见[v0.1.0证据压缩包](https://github.com/elarazju/deepinfer-illustrated/releases/download/v0.1.0/deepinfer-v0.1-evidence.zip)。本轮最终88张页面截图和96张独立审查截图在本地`research/screenshots/`及`research/tutorial-audit/`生成，归档于[v0.2.0教程改版Release](https://github.com/elarazju/deepinfer-illustrated/releases/tag/v0.2.0)，不再增加源码提交体积。当前网站的下载图由对应Actions构建生成。

推荐人工抽查的关键点是：异步调度的批次依赖、Encoder/Decoder两种有界回放、DSpark教学收益与官方观测的区别。相关原始证据分别见facts.yaml的`zos.overlap`、`yoco.replay`/`swa.hit`、`dspark.cumulative`/`dspark.results`。本轮没有声称已获得人工抽查结论。

仍保留原有边界：没有运行DeepInfer推理或复现硬件性能数据；WebKit不是Safari真机验证；自动无障碍检查不是完整WCAG认证；原始PDF不随本站分发。模型官方资料的对照见[模型来源记录](research/MODEL-SOURCES.md)。
