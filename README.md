# FAE Power — Android TV FAE 工作流助手

> 让每一个 FAE 在面对客户问题时，都能像资深专家一样判断问题、推进闭环、管理风险、沟通客户、沉淀经验。

[![Kiro Power](https://img.shields.io/badge/Kiro-Power-purple)](https://kiro.dev)
[![Type](https://img.shields.io/badge/Type-Knowledge%20Base-blue)]()
[![License](https://img.shields.io/badge/License-UNLICENSED-red)]()

## 简介

FAE Power 是一个面向 Android TV 产品 FAE（Field Application Engineer）工程师的 [Kiro Power](https://kiro.dev/)。它将 FAE 团队已验证的工作流、技术知识和沟通模板打包为一个可直接导入使用的 Power：

- 🔍 把客户反馈变成**结构化问题**
- ⚡ 把零散信息变成**闭环动作**
- 💬 把技术结论变成**专业沟通**
- 📚 把处理经验变成**团队资产**

## 项目结构

```
FAE-power/
├── POWER.md                              # Kiro Power 元数据 + 概览文档
├── README.md                             # 本文件
├── LICENSE                               # 许可证声明
├── steering/
│   ├── fae-workflow.md                   # 核心：AI 身份 + 能力路由 + 工作流编排
│   ├── technical-qa.md                   # 技术问答引擎（13 子系统）
│   ├── log-advisor.md                    # 日志收集指导（7 问题类型）
│   ├── completeness-checker.md           # 问题完整性检查
│   ├── risk-assessor.md                  # 风险评估 P0-P4
│   ├── zmind-interface.md                # Zmind 工单管理
│   ├── communication-generator.md        # 客户沟通 + 文档/知识查询
│   └── mcp-integration.md               # MCP 调用规则与降级策略
├── dev/                                  # 开发参考（逻辑验证模块）
│   ├── src/types/index.ts                # 类型定义
│   ├── src/utils/                        # 工具模块（可测试逻辑）
│   ├── tests/                            # 测试套件
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
└── .kiro/specs/                          # Spec 文档（需求/设计/任务）
```

## 核心能力

| # | 能力模块 | 说明 | Steering File |
|---|---------|------|---------------|
| 1 | **技术问答** | 覆盖 13 个 Android TV 子系统的结构化诊断分析 | `technical-qa.md` |
| 2 | **完整性检查** | 自动验证客户问题报告是否包含必要信息，输出完整度评分 | `completeness-checker.md` |
| 3 | **日志收集指导** | 按 7 种问题类型推荐具体日志和可复制的 ADB 命令 | `log-advisor.md` |
| 4 | **Zmind 工单管理** | 自动生成标准化标题/描述，9 种状态的下一步动作建议 | `zmind-interface.md` |
| 5 | **客户沟通生成** | 中英双语专业话术，覆盖 6 种沟通场景 | `communication-generator.md` |
| 6 | **风险评估** | 7 维度评估 + P0-P4 标准化定级 + 升级建议 | `risk-assessor.md` |
| 7 | **工作流编排** | 12 阶段标准流程引导（支持前进/跳过/回退） | `fae-workflow.md` |
| 8 | **文档/知识查询** | 搜索内部文档（Confluence），查找历史问题和解决方案 | `communication-generator.md` |

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
| [whaletv-dev-power](https://github.com/KK-Irving/whaletv-dev-power) | 提供 zmind-mcp-server、opengrok-mcp-server 和内部文档查询（Confluence） |

### 安装步骤

#### Step 1：确保 whaletv-dev-power 已安装

FAE Power 依赖 whaletv-dev-power 提供的 MCP 工具。请先确认：
- whaletv-dev-power 已安装
- `ZMIND_API_KEY` 已配置
- zmind-mcp-server 状态为 enabled

#### Step 2：安装 FAE Power

1. 打开 Kiro IDE
2. 点击左侧边栏的 Powers 图标
3. 在 Powers 面板中点击 "Add Power"
4. 选择 "From GitHub URL"
5. 输入仓库地址：

```
https://github.com/KK-Irving/fae-power
```

6. 点击确认，等待安装完成

#### Step 3：验证安装

在 Kiro 对话中输入：

```
客户反馈 YouTube 播放黑屏
```

应触发 FAE 工作流，输出结构化诊断分析（包含可能原因、排查路径、需要收集的日志等）。

## 使用方式

安装配置完成后，在 Kiro 对话中直接使用自然语言触发：

```bash
# 技术问答
"客户反馈 WiFi 频繁断连，如何排查？"
"HDMI CEC 唤醒失败可能是什么原因？"

# 完整性检查
"帮我检查这个问题描述是否完整：客户说 YouTube 黑屏"
"检查完整性"

# 日志收集
"播放类问题需要收集什么日志？"
"开机故障需要抓什么 log？"

# 创建工单
"帮我创建 Zmind 工单，客户是 Xiaomi，YouTube 4K HDR 播放黑屏"
"生成工单内容"

# 客户沟通
"生成一封进度更新邮件，WiFi 问题已复现正在分析"
"帮我回复客户的升级投诉"

# 风险评估
"评估这个问题的优先级：重点客户，开机失败，100%必现，5天后出货"
"这个问题是什么等级？"

# 工作流
"开始工作流"
"新问题接入"
"下一步"

# 知识库/文档查询
"搜索类似的历史问题：HDMI CEC 唤醒失败"
"有没有遇到过类似问题？"
"搜索文档"
```

## 外部系统集成

```
┌─────────────────────────────────────────────────────────┐
│  fae-power (本项目)                                      │
│  └── steering/ (8 个模块化 steering files)               │
│      - 技术问答、完整性检查、日志指导                      │
│      - 工单管理、客户沟通、风险评估                        │
│      - 工作流编排、MCP 集成规则                           │
└─────────────────────────────────────────────────────────┘
         │
         ↓ 调用 MCP 工具 + 内部文档查询
┌─────────────────────────────────────────────────────────┐
│  whaletv-dev-power                                       │
│  ├── zmind-mcp-server (14 tools) ← FAE Power 调用       │
│  ├── opengrok-mcp-server (2 tools) ← FAE Power 调用     │
│  └── internal-docs skill (Confluence CQL) ← 文档查询    │
└─────────────────────────────────────────────────────────┘
```

## 技术栈

| 技术 | 用途 |
|------|------|
| Kiro Steering (Markdown) | AI 工作流定义（8 个模块化文件） |
| MCP (Model Context Protocol) | 外部工具集成协议 |
| TypeScript (ES2020) | 逻辑验证模块（dev/） |
| Vitest | 测试框架 |
| fast-check | 属性测试（Property-Based Testing） |

## 与 whaletv-dev-power 的关系

```
┌──────────────────────────────────────────────────────────────┐
│                        Kiro IDE                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐     ┌─────────────────────────┐    │
│  │  whaletv-dev-power  │     │  fae-power              │    │
│  │  ─────────────────  │     │  ─────────────────────  │    │
│  │  面向: 开发者        │     │  面向: FAE 工程师       │    │
│  │  能力:              │     │  能力:                  │    │
│  │  · Zmind 工单 CRUD  │◄────│  · 技术问答 (13子系统)  │    │
│  │  · OpenGrok 代码搜索│◄────│  · 完整性检查           │    │
│  │  · PR/CR 工作流     │     │  · 日志收集指导         │    │
│  │  · Cherry-Pick      │     │  · 风险评估 P0-P4      │    │
│  │  · 内部文档查询     │◄────│  · 客户沟通生成         │    │
│  │    (Confluence CQL) │     │  · 工作流编排 (12阶段)  │    │
│  │                     │     │  · 文档/知识查询        │    │
│  └─────────────────────┘     └─────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**分工：**
- `whaletv-dev-power` = **工具层 + 开发者工作流**（提供 Zmind/OpenGrok/Confluence 能力）
- `fae-power` = **FAE 行为层**（指导 AI 如何为 FAE 工程师服务）

两者同时安装时，AI 自动组合能力，实现从问题接收到知识查询的完整闭环。

## Roadmap

### ✅ Phase 1（MVP — 已完成）

- [x] 技术问答（13 子系统）
- [x] 问题完整性检查
- [x] 日志收集指导（7 问题类型）
- [x] Zmind 工单管理
- [x] 客户沟通生成（6 场景）
- [x] 风险评估（P0-P4）
- [x] 工作流编排（12 阶段）
- [x] 文档/知识查询
- [x] 模块化 Steering 架构（8 文件拆分）

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
- [ ] 与钉钉/企业微信集成

## 贡献

欢迎 FAE 团队成员贡献：

- 补充子系统的排查经验到对应 steering file
- 添加新的沟通模板到 `communication-generator.md`
- 完善日志收集命令（适配不同平台）到 `log-advisor.md`
- 提交 property-based tests 到 `dev/tests/`
- 沉淀已解决问题到内部文档（Confluence）

## License

> ⚠️ **UNLICENSED** — 本项目为 WhaleTV / Zeasn 内部专有软件，仅限内部使用。

未经授权，禁止复制、分发、修改或以任何形式对外使用本软件。详见 [LICENSE](./LICENSE) 文件。
