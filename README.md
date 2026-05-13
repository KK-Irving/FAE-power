# FAE Power — Android TV FAE 工作流助手

> 让每一个 FAE 在面对客户问题时，都能像资深专家一样判断问题、推进闭环、管理风险、沟通客户、沉淀经验。

[![Kiro Power](https://img.shields.io/badge/Kiro-Power-purple)](https://kiro.dev)
[![Type](https://img.shields.io/badge/Type-Knowledge%20Base-blue)]()
[![License](https://img.shields.io/badge/License-UNLICENSED-red)]()

## 简介

FAE Power 是一个面向 Android TV 产品 FAE（Field Application Engineer）工程师的 [Kiro Power](https://kiro.dev)。它不是一个普通问答助手，而是 FAE 的**问题处理副驾驶**：

- 🔍 把客户反馈变成**结构化问题**
- ⚡ 把零散信息变成**闭环动作**
- 📚 把技术经验变成**团队资产**

## 项目结构

```
FAE-power/
├── POWER.md                          # Kiro Power 元数据 + 概览文档
├── README.md                         # 本文件
├── steering/
│   └── fae-skill.md                  # 核心 steering file（1046行 FAE 工作流指导）
├── src/
│   ├── types/
│   │   └── index.ts                  # 完整类型定义（接口 + 联合类型）
│   └── utils/
│       ├── completeness-checker.ts   # 问题完整性检查逻辑
│       ├── risk-assessor.ts          # 风险评估与 P0-P4 分级
│       ├── title-generator.ts        # Zmind 工单标题生成
│       ├── ticket-validator.ts       # 工单字段验证与描述生成
│       ├── workflow-state.ts         # 12 阶段工作流状态管理
│       └── response-validator.ts     # 响应结构验证
├── tests/
│   ├── unit/                         # 单元测试
│   ├── property/                     # 属性测试（fast-check）
│   └── integration/                  # 集成测试
├── .kiro/
│   ├── skills/fae-skill.md           # 本地开发用 skill 副本
│   └── specs/fae-skill/              # Spec 文档（需求/设计/任务）
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── .gitignore
```

## 核心能力

| # | 能力模块 | 说明 |
|---|---------|------|
| 1 | **技术问答** | 覆盖 13 个 Android TV 子系统的结构化诊断分析 |
| 2 | **完整性检查** | 自动验证客户问题报告是否包含必要信息，输出完整度评分 |
| 3 | **日志收集指导** | 按 7 种问题类型推荐具体日志和可复制的 ADB 命令 |
| 4 | **Zmind 工单管理** | 自动生成标准化标题/描述，9 种状态的下一步动作建议 |
| 5 | **客户沟通生成** | 中英双语专业话术，覆盖 6 种沟通场景 |
| 6 | **风险评估** | 7 维度评估 + P0-P4 标准化定级 + 升级建议 |
| 7 | **工作流编排** | 12 阶段标准流程引导（支持前进/跳过/回退） |
| 8 | **知识库集成** | 问题沉淀（8 字段结构化）和相似问题检索（Top 5） |

### 支持的 Android TV 子系统（13 个）

| 子系统 | 覆盖范围 |
|--------|---------|
| 开机/OTA/Recovery | 启动、升级、bootloader、brick |
| Launcher/Settings/GMS | 桌面、设置、Google Play |
| WiFi/BT/Ethernet | 网络连接、配对、断网 |
| HDMI/CEC/HDCP/ARC | 设备联动、认证、音频回传 |
| Display/PQ/HDR/Dolby Vision | 画质、分辨率、闪屏、花屏 |
| Audio/Dolby/DTS | 音频输出、杂音、无声 |
| Video Playback/MediaCodec/DRM | 播放、解码、Widevine |
| 遥控器/IR/BT Remote | 按键、配对、语音 |
| App 兼容性 | Netflix/YouTube/Prime Video/Disney+ |
| 性能/ANR/Crash | 卡顿、内存泄漏、崩溃 |
| 待机/唤醒 | 功耗、休眠、自动开机 |
| 工厂模式/量产 | 产线测试、烧录、自动化 |
| 客户定制 | UI 定制、功能裁剪、品牌 |

## 安装

### 前置条件

| 依赖 | 说明 |
|------|------|
| [Kiro IDE](https://kiro.dev) | AI 开发环境 |
| [whaletv-dev-power](https://github.com/KK-Irving/whaletv-dev-power) | 提供 zmind-mcp-server 和 opengrok-mcp-server |
| zmind-knowledge-manager | 提供知识库搜索和存储能力（可选） |

### 安装步骤

1. **确保 whaletv-dev-power 已安装并配置好 ZMIND_API_KEY**

2. **安装 FAE Power**
   - 打开 Kiro → Powers 面板 → 添加本仓库地址
   - 或手动克隆到本地 Powers 目录

3. **验证安装**
   - 在 Kiro 对话中输入："客户反馈 YouTube 播放黑屏"
   - 应触发 FAE 工作流，输出结构化诊断分析

## 使用方式

安装后在 Kiro 对话中直接使用自然语言触发：

```
# 技术问答
"客户反馈 WiFi 频繁断连，如何排查？"

# 完整性检查
"帮我检查这个问题描述是否完整：客户说 YouTube 黑屏"

# 日志收集
"播放类问题需要收集什么日志？"

# 创建工单
"帮我创建 Zmind 工单，客户是 Xiaomi，YouTube 4K HDR 播放黑屏"

# 客户沟通
"生成一封进度更新邮件，WiFi 问题已复现正在分析"

# 风险评估
"评估这个问题的优先级：重点客户，开机失败，100%必现，5天后出货"

# 工作流
"开始工作流" / "新问题接入"

# 知识库
"搜索类似的历史问题：HDMI CEC 唤醒失败"
```

## 与 whaletv-dev-power 的关系

```
┌─────────────────────────────────────────────────────┐
│  whaletv-dev-power                                   │
│  ├── zmind-mcp-server (14 tools) ← FAE Power 调用   │
│  ├── opengrok-mcp-server (2 tools) ← FAE Power 调用 │
│  └── steering/ (PR/CR/Cherry-Pick — 开发者用)        │
└─────────────────────────────────────────────────────┘
         ↑ 提供 MCP 工具能力
         │
┌─────────────────────────────────────────────────────┐
│  fae-power (本项目)                                   │
│  ├── POWER.md (Power 元数据)                         │
│  └── steering/fae-skill.md (FAE 行为指导)            │
│      - 技术问答、完整性检查、日志指导                   │
│      - 工单管理、客户沟通、风险评估                     │
│      - 工作流编排、知识库集成                          │
└─────────────────────────────────────────────────────┘
```

**分工：**
- `whaletv-dev-power` = 工具层（提供 Zmind API、代码搜索能力）
- `fae-power` = 行为层（指导 AI 如何为 FAE 工程师服务）

两者同时安装时，AI 自动组合：按 FAE 工作流行事，用 whaletv-dev-power 的工具执行操作。

## 开发

### 环境搭建

```bash
git clone <repo-url>
cd FAE-power
npm install
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行属性测试
npm run test:property

# 运行集成测试
npm run test:integration

# 监听模式
npm run test:watch
```

### 编译检查

```bash
npm run build
```

### 工具模块说明

| 模块 | 文件 | 功能 |
|------|------|------|
| 类型定义 | `src/types/index.ts` | 13 接口 + 7 联合类型，全项目共享 |
| 完整性检查 | `src/utils/completeness-checker.ts` | 字段验证、评分计算、缺失字段识别 |
| 风险评估 | `src/utils/risk-assessor.ts` | 7 因素评估、P0-P4 分级、规避方案调整 |
| 标题生成 | `src/utils/title-generator.ts` | Zmind 工单标题格式化（200 字符限制） |
| 工单验证 | `src/utils/ticket-validator.ts` | 7 必填字段验证、描述模板生成 |
| 工作流状态 | `src/utils/workflow-state.ts` | 12 阶段状态机（前进/跳过/回退） |
| 响应验证 | `src/utils/response-validator.ts` | 双语输出、Q&A 结构、知识条目验证 |

### 正确性属性（18 个）

项目定义了 18 个形式化正确性属性，覆盖：
- 完整性字段识别与评分计算（Property 1-2）
- 双语输出结构（Property 3）
- 工单标题格式与长度（Property 4-6）
- 沟通类型章节完整性（Property 7）
- 风险评估分级与调整（Property 8-11）
- 技术问答响应结构（Property 12-14）
- 工作流状态转换（Property 15-16）
- 知识条目结构与搜索限制（Property 17-18）

详见 `.kiro/specs/fae-skill/design.md` 中的 Correctness Properties 章节。

## 技术栈

| 技术 | 用途 |
|------|------|
| TypeScript | 工具模块实现 |
| Vitest | 测试框架 |
| fast-check | 属性测试（Property-Based Testing） |
| Kiro Steering | AI 行为定义 |
| MCP (Model Context Protocol) | 外部工具集成 |

## Roadmap

### ✅ Phase 1（MVP — 已完成）
- [x] 技术问答（13 子系统）
- [x] 问题完整性检查
- [x] 日志收集指导（7 问题类型）
- [x] Zmind 工单管理
- [x] 客户沟通生成（6 场景）
- [x] 风险评估（P0-P4）
- [x] 工作流编排（12 阶段）
- [x] 知识库集成

### 🔜 Phase 2（计划中）
- [ ] 问题阶段自动判断与推进建议
- [ ] 时间线梳理和管理层汇报生成
- [ ] 客户画像与项目管理
- [ ] Release Note 解读助手
- [ ] 会议纪要自动生成
- [ ] 新人 FAE 培训模式
- [ ] 多语言客户沟通支持

### 🔮 Phase 3（远期）
- [ ] 自动识别重复问题
- [ ] 客户高频问题统计
- [ ] 基于历史数据预测问题风险
- [ ] FAE 团队能力地图和效率分析

## 贡献

欢迎 FAE 团队成员贡献：
- 补充子系统的排查经验到 steering file
- 添加新的沟通模板
- 完善日志收集命令（适配不同平台）
- 提交 property-based tests

## License

UNLICENSED — WhaleTV 内部使用
