---
name: "fae-power"
displayName: "FAE Workflow Assistant"
description: "面向 Android TV FAE 工程师的专业工作流助手。提供技术问答、问题完整性检查、日志收集指导、Zmind 工单管理、客户沟通生成、风险评估和文档/知识查询。"
keywords: ["fae", "android-tv", "zmind", "客户支持", "问题管理", "技术支持", "工单", "knowledge"]
author: "WhaleTV FAE Team"
---

# FAE Workflow Assistant

面向 Android TV 产品 FAE（Field Application Engineer）工程师的专业工作流助手 Power。帮助 FAE 按照标准流程推进客户问题，从接收到闭环的全流程。

## Overview

FAE Power 不是一个普通问答助手，而是 Android TV FAE 的问题处理副驾驶：
- 把客户反馈变成结构化问题
- 把零散信息变成闭环动作
- 把技术经验变成团队资产

### 核心能力（8 大模块）

| # | 能力 | 说明 |
|---|------|------|
| 1 | 技术问答 | 覆盖 13 个 Android TV 子系统的结构化诊断分析 |
| 2 | 完整性检查 | 自动验证客户问题报告是否包含必要信息 |
| 3 | 日志收集指导 | 按问题类型推荐具体日志和 ADB 命令 |
| 4 | Zmind 工单管理 | 自动生成工单标题/描述，跟踪状态变更 |
| 5 | 客户沟通生成 | 中英双语专业话术，覆盖 6 种沟通场景 |
| 6 | 风险评估 | P0-P4 标准化定级，含升级建议 |
| 7 | 工作流编排 | 12 阶段标准流程引导（从接收到闭环） |
| 8 | 知识/文档查询 | 内部文档搜索和相似问题检索 |

### 支持的 Android TV 子系统

开机/OTA/Recovery、Launcher/Settings/GMS、WiFi/BT/Ethernet、HDMI/CEC/HDCP/ARC、Display/PQ/HDR/Dolby Vision、Audio/Dolby/DTS、Video Playback/MediaCodec/DRM/Widevine、遥控器/IR/BT Remote、App 兼容性(Netflix/YouTube/Prime Video/Disney+)、性能/ANR/Crash、待机/唤醒、工厂模式/量产、客户定制

## Prerequisites

### 必须安装的 Power

本 Power 依赖以下 Power 提供 MCP 工具能力：

| Power | 提供的工具 | 用途 |
|-------|-----------|------|
| **whaletv-dev-power** | zmind-mcp-server (14 tools) | Zmind 工单 CRUD、状态管理、工时记录 |
| **whaletv-dev-power** | opengrok-mcp-server (2 tools) | 源代码搜索，技术问题代码级调查 |
| **whaletv-dev-power** | internal-docs skill (Confluence CQL) | 内部文档搜索，历史问题和解决方案查询 |

> ⚠️ **重要**: 请确保 `whaletv-dev-power` 已安装并正确配置 API 密钥和 Confluence 凭据，否则部分功能将以降级模式运行。

### 环境要求

- Kiro IDE
- whaletv-dev-power 已安装且 zmind-mcp-server 已启用
- Confluence 凭据已配置（用于内部文档查询）

## Available Steering Files

本 Power 包含以下工作流指南，按需加载：

| Steering File | 说明 | 触发示例 |
|---------------|------|----------|
| **fae-workflow.md** | 核心：AI 身份定义 + 能力路由 + 12 阶段工作流 | "开始工作流"、"新问题接入" |
| **technical-qa.md** | 技术问答引擎（13 子系统诊断分析） | "WiFi 频繁断连如何排查" |
| **log-advisor.md** | 日志收集指导（7 问题类型 + ADB 命令） | "播放问题需要什么日志" |
| **completeness-checker.md** | 问题完整性检查规则 | "检查这个问题描述是否完整" |
| **risk-assessor.md** | 风险评估 P0-P4 分级 | "评估这个问题的优先级" |
| **zmind-interface.md** | Zmind 工单管理（创建/状态/动作） | "帮我创建 Zmind 工单" |
| **communication-generator.md** | 客户沟通生成 + 文档/知识查询 | "生成进度更新邮件" |
| **mcp-integration.md** | MCP 服务器调用规则和降级策略 | （自动生效） |

### 使用方式

安装本 Power 后，在对话中直接描述客户问题或请求即可触发对应能力：

- **技术问答**: "客户反馈 WiFi 频繁断连，如何排查？"
- **完整性检查**: "帮我检查这个问题描述是否完整"
- **日志收集**: "播放类问题需要收集什么日志？"
- **创建工单**: "帮我创建 Zmind 工单"
- **客户沟通**: "生成一封进度更新邮件"
- **风险评估**: "评估这个问题的优先级"
- **工作流**: "开始工作流" / "新问题接入"
- **知识/文档查询**: "搜索类似的历史问题"

## MCP Tool Usage

### 通过 whaletv-dev-power 使用的工具

#### Zmind 工单操作

```
# 搜索相关工单
search_issues(query="YouTube 黑屏", project="android-tv")

# 创建工单
create_issue(project_id="android-tv", subject="[Xiaomi][AndroidTV][Playback] ...", description="...")

# 更新工单状态
update_issue(issue_id=12345, status_id=3, notes="FAE 已复现，提交研发分析")

# 添加评论
add_comment(issue_id=12345, comment="客户确认 workaround 有效")
```

#### 代码搜索

```
# 搜索相关代码
search_code(query="MediaCodec decode error")

# 搜索符号定义
search_symbol(symbol="VideoDecoderService")
```

#### 内部文档查询

通过 whaletv-dev-power 的 internal-docs skill，使用 Confluence CQL 搜索内部技术文档、已知问题和解决方案。

```
# 搜索内部文档
GET https://docs.whaletv.com/rest/api/content/search?cql=text~"<keyword>"&limit=5
Auth: HTTP Basic Auth

# 获取页面正文
GET /rest/api/content/<page_id>?expand=body.view
```

## Standard Workflow

FAE 标准问题处理流程（12 阶段）：

```
客户反馈问题
    ↓
1. 完整性检查 — 验证信息是否齐全
    ↓
2. 风险评估 — 判断优先级 P0-P4
    ↓
3. 日志收集 — 指导收集必要日志
    ↓
4. 知识库查询 — 搜索历史相似问题
    ↓
5. 本地复现 — FAE 实验室复现
    ↓
6. Zmind 工单创建 — 提交正式跟踪
    ↓
7. 研发分析跟踪 — 跟进 R&D 进展
    ↓
8. 进度沟通 — 同步客户进展
    ↓
9. 修复验证 — 验证修复版本
    ↓
10. 客户确认 — 请求客户确认
    ↓
11. 闭环 — 关闭工单
    ↓
12. 复盘总结 — 沉淀知识资产
```

## Graceful Degradation

当依赖的 MCP 服务不可用时，Power 会自动降级：

| 服务不可用 | 降级行为 |
|-----------|----------|
| zmind-mcp-server | 生成工单内容但不提交，提供本地保存格式 |
| docs.whaletv.com (Confluence) | 跳过文档查询，基于内置子系统知识提供指导 |
| opengrok-mcp-server | 跳过代码搜索，基于子系统知识提供指导 |

## Best Practices

1. **先检查完整性再建单** — 确保信息齐全后再提交 Zmind，避免反复补充
2. **善用内部文档** — 新问题先搜索历史案例，避免重复排查
3. **及时沉淀** — 问题闭环后立即生成复盘，趁记忆清晰
4. **风险前置** — 接到问题第一时间评估风险，P0/P1 立即升级
5. **双语沟通** — 对外客户沟通始终提供中英双语版本

## Troubleshooting

### 工单创建失败

**现象**: 调用 create_issue 时报错

**排查**:
1. 确认 whaletv-dev-power 已安装且 zmind-mcp-server 已启用
2. 确认 ZMIND_API_KEY 已正确配置
3. 确认网络可达 zmind.whaletv.com

### 文档搜索无结果

**现象**: 搜索内部文档始终返回空

**排查**:
1. 确认 Confluence 凭据已正确配置（HTTP Basic Auth）
2. 确认网络可达 docs.whaletv.com
3. 确认 Confluence 中已有相关文档数据
4. 尝试使用更宽泛的关键词搜索

### 代码搜索不可用

**现象**: opengrok-mcp-server 工具调用失败

**排查**:
1. 确认 whaletv-dev-power 中 opengrok-mcp-server 未被 disabled
2. 确认 OPENGROK_URL 环境变量已设置
3. 确认 OpenGrok 服务可达

## Roadmap

### Phase 2（计划中）
- 问题阶段自动判断与推进建议
- 时间线梳理和管理层汇报生成
- 客户画像与项目管理
- Release Note 解读助手
- 会议纪要自动生成
- 新人 FAE 培训模式

### Phase 3（远期）
- 自动识别重复问题
- 客户高频问题统计
- 基于历史数据预测问题风险
- FAE 团队能力地图
