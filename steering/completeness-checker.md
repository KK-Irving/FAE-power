<!-- Part of FAE Power — Android TV FAE 工作流助手 -->

# Completeness Checker — 问题完整性检查规则

当用户提交问题报告（Problem Report）进行完整性检查时，按以下规则评估并输出结果。

## 字段定义

### 必须字段（Mandatory Fields）— 所有问题类型均需

| 字段名 | 英文标识 | 说明 |
|--------|----------|------|
| 产品型号 | productModel | 设备具体型号 |
| 软件版本 | softwareVersion | 当前运行的固件/软件版本号 |
| 复现步骤 | reproductionSteps | 详细的问题复现操作步骤 |
| 复现概率 | reproductionRate | 100% / >50% / <50% / 不可复现 |
| 日志 | logs | 相关系统日志或错误日志 |

### 条件字段（Conditional Fields）— 根据问题类型决定是否必须

| 字段名 | 英文标识 | 适用条件 | 说明 |
|--------|----------|----------|------|
| 网络环境 | networkEnvironment | 网络类问题必须 | WiFi/有线/运营商等网络环境信息 |
| 视频源 | videoSource | 播放类问题必须 | 视频格式、来源、DRM 类型等 |
| App 版本 | appVersion | App 相关问题必须 | 具体应用的版本号 |
| 对比信息 | comparisonInfo | 回归类问题必须 | 正常版本与异常版本的对比信息 |

## 评估规则

1. **字段存在性判定**: 字段必须包含至少一个有意义的描述性 token，以下情况视为"缺失"：
   - 字段为空（empty string）
   - 字段仅包含空白字符（whitespace only）
   - 字段为占位符值（如 "N/A"、"无"、"TBD"、"-"）

2. **条件字段适用性判定**: 根据问题类型（issueType / SubsystemType）确定哪些条件字段适用：
   - 网络类问题（WiFi/BT/Ethernet）→ networkEnvironment 必须
   - 播放类问题（Video playback/MediaCodec/DRM/Widevine）→ videoSource 必须
   - App 相关问题（App compatibility）→ appVersion 必须
   - 回归类问题（用户明确标注为回归）→ comparisonInfo 必须

3. **适用字段集合**: totalApplicableFields = 所有必须字段 + 当前问题类型适用的条件字段

## 评分计算公式

```
completenessScore = round((presentApplicableFields / totalApplicableFields) × 100)
```

- `presentApplicableFields`: 适用字段中已填写且有意义内容的字段数量
- `totalApplicableFields`: 所有必须字段数量 + 当前问题类型适用的条件字段数量
- 结果四舍五入到最近整数

## 输出格式

```
## 完整性检查结果

**评分:** [X]% ([已有]/[应有] 字段)
**状态:** 完整 / 不完整

### 缺失字段
| 字段 | 类型 | 需要原因 |
|------|------|----------|
| [field] | 必须/条件 | [explanation] |

### 客户补充请求（如不完整）
**中文:**
[Chinese message requesting missing info]

**English:**
[English message requesting missing info]
```

## 输出规则

1. 当评分 = 100% 时，状态为"完整"，不输出"缺失字段"和"客户补充请求"部分
2. 当评分 < 100% 时，状态为"不完整"，输出所有缺失字段及客户补充请求
3. 客户补充请求使用礼貌、结构化的格式，逐项列出缺失信息及其需要原因
4. 缺失字段表中的"类型"列标注为"必须"或"条件"
5. "需要原因"列用一句话解释该字段对诊断的重要性

## 示例

**输入**: 一个网络问题报告，缺少 logs 和 networkEnvironment

**输出**:
```
## 完整性检查结果

**评分:** 57% (4/7 字段)
**状态:** 不完整

### 缺失字段
| 字段 | 类型 | 需要原因 |
|------|------|----------|
| 日志 | 必须 | 系统日志是定位网络连接问题根因的关键数据 |
| 网络环境 | 条件 | 网络类问题需要了解具体的网络环境配置以排查兼容性 |

### 客户补充请求（如不完整）
**中文:**
您好，为了更好地分析和解决您反馈的网络问题，我们还需要以下信息：

1. **日志**: 请提供系统日志（logcat），这是定位网络连接问题根因的关键数据
2. **网络环境**: 请描述您的网络环境配置（WiFi/有线、路由器型号、运营商等），网络类问题需要了解具体环境以排查兼容性

请在方便时提供以上信息，我们将尽快为您分析处理。谢谢！

**English:**
Hello, to better analyze and resolve the network issue you reported, we need the following additional information:

1. **Logs**: Please provide system logs (logcat), which are critical for identifying the root cause of network connectivity issues
2. **Network Environment**: Please describe your network environment configuration (WiFi/wired, router model, ISP, etc.), as network issues require understanding the specific environment to troubleshoot compatibility

Please provide the above information at your convenience, and we will analyze and address the issue promptly. Thank you!
```
