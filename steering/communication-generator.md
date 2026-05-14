<!-- Part of FAE Power — Android TV FAE 工作流助手 -->

# Communication Generator — 客户沟通生成 + 文档/知识查询

## 客户沟通生成器

当 FAE 工程师请求生成客户沟通内容时，根据沟通类型和上下文信息生成专业的双语沟通消息。

### 支持的沟通类型（6 种）

| # | 类型 | 英文标识 | 必须包含的章节 |
|---|------|----------|---------------|
| 1 | 问题澄清请求 | problem-clarification | 问题摘要、需要的信息、需要原因、后续步骤 |
| 2 | 进度更新 | progress-update | 当前状态、已采取的行动、下一步计划、预计时间线 |
| 3 | 风险通知 | risk-notification | 风险描述、影响范围、当前缓解措施、建议客户行动 |
| 4 | 版本交付说明 | version-delivery | 版本标识、变更/修复内容、已知限制、建议验证步骤 |
| 5 | 延期说明 | delay-explanation | 原始时间线、延期原因、修订后时间线、正在采取的行动 |
| 6 | 升级处理 | escalation-handling | 确认收到、当前状态、行动计划、预计时间线 |

### 各类型必须章节详细说明

#### 1. 问题澄清请求 (problem-clarification)

```
必须章节:
- 问题摘要 (Summary): 简要概述已了解的问题情况
- 需要的信息 (Information Needed): 逐项列出需要客户补充的具体信息
- 需要原因 (Reason): 解释为什么需要这些信息（对诊断的帮助）
- 后续步骤 (Next Steps): 说明收到信息后的处理计划
```

#### 2. 进度更新 (progress-update)

```
必须章节:
- 当前状态 (Current Status): 问题当前处于什么阶段
- 已采取的行动 (Actions Taken): 已经完成的分析/测试/修复工作
- 下一步计划 (Next Steps): 接下来计划做什么
- 预计时间线 (Expected Timeline): 预计下一个里程碑的时间
```

#### 3. 风险通知 (risk-notification)

```
必须章节:
- 风险描述 (Risk Description): 具体的风险内容和性质
- 影响范围 (Impact Scope): 受影响的产品/功能/用户范围
- 当前缓解措施 (Current Mitigation): 已采取或可采取的临时措施
- 建议客户行动 (Recommended Actions): 建议客户采取的具体行动
```

#### 4. 版本交付说明 (version-delivery)

```
必须章节:
- 版本标识 (Version ID): 版本号和构建标识
- 变更/修复内容 (Changes/Fixes): 本版本包含的修复和变更列表
- 已知限制 (Known Limitations): 本版本的已知问题或限制
- 建议验证步骤 (Verification Steps): 建议客户执行的验证测试步骤
```

#### 5. 延期说明 (delay-explanation)

```
必须章节:
- 原始时间线 (Original Timeline): 之前承诺的时间节点
- 延期原因 (Reason for Delay): 导致延期的具体原因（技术性说明）
- 修订后时间线 (Revised Timeline): 新的预计完成时间
- 正在采取的行动 (Actions Being Taken): 为加速解决正在做的工作
```

#### 6. 升级处理 (escalation-handling)

```
必须章节:
- 确认收到 (Acknowledgment): 确认已收到客户的升级请求
- 当前状态 (Current Status): 问题的当前处理状态
- 行动计划 (Action Plan): 针对升级的具体行动计划
- 预计时间线 (Timeline): 预计响应和解决的时间节点
```

### 双语输出规则（Bilingual Output Rules）

1. **必须同时提供中文和英文版本**，两个版本传达相同的信息内容
2. **输出格式:**

```markdown
## [沟通类型名称]

### 中文
[完整的中文版本，包含所有必须章节]

### English
[完整的英文版本，包含所有必须章节]
```

3. **语言风格:**
   - 中文版本: 正式商务中文，使用"您"作为尊称
   - 英文版本: Professional business English
   - 技术术语保持英文原文（如 logcat、ANR、OTA 等）

### 内容约束规则（Content Constraints）

以下规则适用于所有沟通类型的内容生成：

| # | 约束 | 说明 |
|---|------|------|
| 1 | 事实导向 | 所有陈述必须基于已确认的事实，不做推测性表述 |
| 2 | 解决方案导向 | 聚焦于解决问题和推进进展，避免过多解释背景 |
| 3 | 不承诺未确认时间线 | 如时间线未经确认，使用"预计"/"tentatively"等限定词，或明确标注为初步估计 |
| 4 | 不承诺未确认结果 | 不保证修复效果，使用"预期可以解决"/"expected to resolve"等表述 |
| 5 | 禁止非正式语言 | 不使用口语化表达、网络用语、缩写（如 ASAP 可用，但 gonna/wanna 不可） |
| 6 | 禁止幽默和表情符号 | 不使用任何形式的幽默、玩笑、emoji 或颜文字 |
| 7 | 专业术语准确 | 技术术语使用准确，不简化或替换为非标准表述 |

### 示例

**输入**: 类型=progress-update, 上下文=WiFi断连问题已复现，正在分析日志

**输出**:
```markdown
## 进度更新

### 中文
您好，

关于您反馈的 WiFi 断连问题，以下是当前进展：

**当前状态:** 问题已在我方实验室环境中成功复现。

**已采取的行动:**
- 在相同网络环境下复现了 5G WiFi 频繁断连现象
- 已收集完整的 connectivity 日志和 Wi-Fi scan 结果
- 正在分析 wpa_supplicant 日志中的断连原因

**下一步计划:**
- 完成日志分析，确定断连的 root cause
- 如确认为固件问题，将提交研发团队修复
- 分析完成后提供详细的技术报告

**预计时间线:** 预计 2 个工作日内完成日志分析并提供初步结论。

如有任何问题，请随时联系。

### English
Hello,

Regarding the WiFi disconnection issue you reported, here is the current progress:

**Current Status:** The issue has been successfully reproduced in our lab environment.

**Actions Taken:**
- Reproduced the 5G WiFi frequent disconnection in the same network environment
- Collected complete connectivity logs and Wi-Fi scan results
- Currently analyzing wpa_supplicant logs for disconnection root cause

**Next Steps:**
- Complete log analysis to determine the root cause of disconnection
- If confirmed as a firmware issue, will submit to R&D team for fix
- Provide a detailed technical report after analysis is complete

**Expected Timeline:** Log analysis and preliminary conclusions are expected within 2 business days.

Please feel free to reach out if you have any questions.
```

---

## Knowledge Base Integration（文档/知识查询）

通过内部文档系统（Confluence）实现知识的查询，支持团队经验积累和历史问题复用。

### 知识库查询规则（Query Rules）

#### 查询时机

- 技术问答时搜索相似历史问题
- 工作流"knowledge-query"阶段
- 用户明确请求搜索文档/知识库
- 新问题接入时自动查询相关经验

#### 查询方式

```
1. 使用 Confluence CQL 搜索（通过 whaletv-dev-power 的 internal-docs skill）
   - 搜索接口: GET https://docs.whaletv.com/rest/api/content/search?cql=text~"<keyword>"&limit=5
   - 认证: HTTP Basic Auth（用户 Confluence 凭据）
   - 获取正文: GET /rest/api/content/<page_id>?expand=body.view
2. 搜索关键词来源:
   - 问题描述中的关键技术术语
   - 症状描述（error patterns）
   - 子系统/模块标识
3. 结果按相关度排序
4. 最多返回 5 条结果
```

#### 查询结果展示规则

```
IF 找到相关文档 (results > 0):
  展示 top 5 结果（按相关度排序），每条包含:
  - 文档/问题名称
  - 解决方案摘要
  - 适用性评估（直接适用 / 部分适用 / 仅供参考）

IF 未找到相关文档 (results == 0):
  1. 告知 FAE 工程师无匹配历史文档
  2. 建议替代诊断方法:
     - 基于子系统知识的排查路径
     - 建议收集更多信息后重新搜索
     - 建议咨询研发团队

IF docs.whaletv.com 不可用:
  1. 通知 FAE 工程师服务状态
  2. 使用内置知识继续提供帮助
  3. 不引用历史问题（避免误导）
```

#### 查询结果输出格式

```markdown
## 知识库查询结果

### 找到 [N] 条相关历史问题（最多显示5条）

| # | 问题名称 | 相关度 | 适用性 |
|---|---------|--------|--------|
| 1 | [问题标题] | 高/中/低 | 直接适用/部分适用/仅供参考 |
| 2 | ... | ... | ... |

### 详细信息

#### 1. [问题名称]
- **根本原因:** [root cause summary]
- **解决方案:** [solution summary]
- **适用性评估:** [为什么适用/不完全适用的说明]
- **建议:** [基于此历史案例的建议行动]
```

### 知识库存储规则（Storage Rules）

#### 存储时机

- 问题闭环且客户确认解决后
- 工作流进入"post-mortem"阶段
- FAE 工程师主动请求存储知识条目

#### 知识条目结构（Knowledge Entry Structure — 8 个必填字段）

| # | 字段 | 英文标识 | 说明 |
|---|------|----------|------|
| 1 | 问题名称 | problemName | 简洁描述问题本质（一句话） |
| 2 | 背景 | background | 问题发生的背景和上下文（客户、产品、场景） |
| 3 | 根本原因 | rootCause | 问题的根本原因分析 |
| 4 | 解决方案 | solution | 最终的修复方案和实施方法 |
| 5 | 规避方案 | workaround | 临时规避方案（如适用，无则标注"无"） |
| 6 | 影响范围 | impactScope | 受影响的产品/版本/客户范围 |
| 7 | 预防措施 | preventionMeasures | 避免类似问题再次发生的措施 |
| 8 | 经验教训 | lessonsLearned | 处理过程中的经验总结和改进建议 |

#### 存储流程

> **Phase 2 功能** — 当前版本仅支持查询，知识条目存储将在后续版本中通过 Confluence 页面实现。

```
1. 从复盘信息中提取/生成 8 个字段的内容
2. 验证所有字段非空且有意义
3. 生成知识条目内容并展示给 FAE 工程师
4. 当前版本: 知识条目记录在对话中，供 FAE 手动存档
5. 后续版本: 自动存储为 Confluence 页面
```

#### 知识条目输出格式（存储前预览）

```markdown
## 知识条目预览

请确认以下知识条目内容，确认后将记录在对话中（后续版本支持自动存储到 Confluence）：

| 字段 | 内容 |
|------|------|
| 问题名称 | [problemName] |
| 背景 | [background] |
| 根本原因 | [rootCause] |
| 解决方案 | [solution] |
| 规避方案 | [workaround] |
| 影响范围 | [impactScope] |
| 预防措施 | [preventionMeasures] |
| 经验教训 | [lessonsLearned] |

确认存储？(是/否)
```

### 搜索结果限制规则

1. **最多返回 5 条结果** — 即使匹配结果超过 5 条，也只展示相关度最高的前 5 条
2. **每条结果必须包含**: 问题名称、解决方案摘要、适用性评估
3. **排序依据**: 按与当前问题的相关度从高到低排列
4. **适用性评估标准**:
   - **直接适用**: 问题现象、环境、模块完全匹配
   - **部分适用**: 问题类似但环境/版本不同，方案需调整
   - **仅供参考**: 仅关键词相似，实际问题不同
