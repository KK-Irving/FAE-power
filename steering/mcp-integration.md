<!-- Part of FAE Power — Android TV FAE 工作流助手 -->

# MCP Integration Rules — MCP 服务器调用规则与降级策略

## 可用 MCP 服务器

| 服务器 | 用途 | Power 来源 |
|--------|------|-----------|
| zmind-mcp-server | Zmind 工单 CRUD 操作和状态管理 | whaletv-dev-power |
| opengrok-mcp-server | 源代码搜索，用于技术问题调查 | whaletv-dev-power |

## 内部文档查询（通过 whaletv-dev-power）

通过 whaletv-dev-power 的 `internal-docs` skill，使用 Confluence CQL 搜索内部技术文档、已知问题和解决方案。

**实现方式:** 直接 HTTP 调用 Confluence REST API（非独立 MCP 服务器）

```
# 搜索文档
GET https://docs.whaletv.com/rest/api/content/search?cql=text~"<keyword>"&limit=5
Auth: HTTP Basic Auth（用户 Confluence 凭据）

# 获取页面正文
GET https://docs.whaletv.com/rest/api/content/<page_id>?expand=body.view
```

**调用时机:**
- 当用户提出技术问题时 → 搜索内部文档查找相似历史问题和解决方案
- 当用户明确请求搜索文档/知识库时
- 当工作流进入"knowledge-query"阶段时
- 当用户说"搜索文档"、"查文档"、"历史问题"、"search docs"、"类似问题"、"有没有遇到过"时

**不调用时机:**
- 用户仅请求日志收集指导（纯内置知识）
- 用户请求生成沟通消息（纯模板逻辑）
- 用户请求完整性检查（纯字段验证逻辑）

**返回内容:**
- 页面标题（titles）
- 页面 ID
- 页面链接（links）
- 页面类型（types）
- 可通过 page_id 获取页面正文内容

## 调用条件（声明式规则）

### zmind-mcp-server

**调用时机:**
- 当用户明确请求创建工单时（且所有必填字段已验证通过）
- 当用户请求更新工单状态时
- 当用户请求查询工单信息时
- 当工作流进入"zmind-ticket-creation"阶段时

**不调用时机:**
- 字段验证未通过时（先完成验证，再调用）
- 用户仅在讨论工单内容但未确认提交时

### opengrok-mcp-server

**调用时机:**
- 当技术问题需要代码级别的调查时
- 当用户明确请求搜索源代码时
- 当需要定位特定模块的实现细节时

**不调用时机:**
- 问题可以通过日志分析或已知经验解决时
- 用户未涉及代码层面的讨论时

## 错误处理规则

### 超时处理（10秒阈值）

```
IF MCP 服务器响应时间 > 10秒:
  1. 终止等待
  2. 通知 FAE 工程师连接超时
  3. 根据服务器类型执行降级策略
```

**各服务器超时降级策略:**

| 服务器 | 超时后处理 |
|--------|-----------|
| zmind-mcp-server | 通知连接失败，提供工单内容的本地保存格式，供后续手动提交 |
| docs.whaletv.com (Confluence) | 通知服务状态，使用内置知识继续提供技术指导，跳过文档引用 |
| opengrok-mcp-server | 跳过代码搜索环节，基于内置子系统知识提供指导 |

### 服务不可用时的优雅降级

```
IF docs.whaletv.com (Confluence) 不可用:
  → 技术问答仅使用内置知识
  → 文档查询操作跳过（提示用户稍后重试）
  → 明确告知: "内部文档服务当前不可用，以下建议基于内置知识"

IF zmind-mcp-server 不可用:
  → 生成完整工单内容但不提交
  → 提供格式化的工单内容供手动复制
  → 明确告知: "Zmind 服务当前不可用，工单内容已生成，请手动提交"

IF opengrok-mcp-server 不可用:
  → 跳过代码级调查
  → 基于子系统专业知识提供指导
  → 明确告知: "代码搜索服务当前不可用，以下建议基于子系统知识"
```

### 通用错误处理原则

1. **透明性**: 始终告知用户服务状态，不隐藏错误
2. **连续性**: 服务故障不应阻断整体工作流，降级后继续提供可用的帮助
3. **可恢复性**: 提供重试建议或替代方案
4. **数据安全**: 超时或失败时确保用户输入的数据不丢失（提供本地保存选项）
