# API 设计文档

## 概述

本文档描述了 n8n 管理平台的 API 接口设计，包括认证、n8n 实例管理、工作流管理和执行控制等核心功能。

## 基础信息

- **基础 URL**: `https://api.example.com`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **API 版本**: v1

## 认证接口

### 用户注册

```http
POST /api/auth/local/register
```

**请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "jwt": "string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": {
      "id": 1,
      "name": "Authenticated"
    }
  }
}
```

### 用户登录

```http
POST /api/auth/local
```

**请求体**:
```json
{
  "identifier": "string", // email 或 username
  "password": "string"
}
```

**响应**:
```json
{
  "jwt": "string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": {
      "id": 1,
      "name": "Authenticated"
    }
  }
}
```

### 获取当前用户信息

```http
GET /api/users/me
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**响应**:
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "role": {
    "id": 1,
    "name": "Authenticated"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## n8n 实例管理

### 绑定 n8n 实例

```http
POST /api/my-n8n
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**请求体**:
```json
{
  "baseUrl": "https://my-n8n.example.com",
  "apiKey": "your-n8n-api-key"
}
```

**响应**:
```json
{
  "id": 1,
  "baseUrl": "https://my-n8n.example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 获取当前用户的 n8n 实例

```http
GET /api/my-n8n
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**响应**:
```json
{
  "id": 1,
  "baseUrl": "https://my-n8n.example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 更新 n8n 实例配置

```http
PUT /api/my-n8n
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**请求体**:
```json
{
  "baseUrl": "https://new-n8n.example.com",
  "apiKey": "new-api-key"
}
```

**响应**:
```json
{
  "id": 1,
  "baseUrl": "https://new-n8n.example.com",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 测试 n8n 实例连接

```http
POST /api/my-n8n/test
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**响应**:
```json
{
  "success": true,
  "message": "连接成功",
  "workflowCount": 10
}
```

## 工作流管理

### 获取工作流列表

```http
GET /api/workflows?active=true&limit=20&offset=0
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**查询参数**:
- `active`: 是否只获取激活的工作流 (boolean)
- `limit`: 每页数量 (number, 默认 20)
- `offset`: 偏移量 (number, 默认 0)
- `search`: 搜索关键词 (string)

**响应**:
```json
{
  "data": [
    {
      "id": "1",
      "name": "工作流名称",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### 获取工作流详情

```http
GET /api/workflows/{id}
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**响应**:
```json
{
  "id": "1",
  "name": "工作流名称",
  "active": true,
  "nodes": [
    {
      "id": "node-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 100]
    }
  ],
  "connections": {},
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 工作流执行

### 触发工作流执行

```http
POST /api/workflows/{id}/execute
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**请求体**:
```json
{
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**响应**:
```json
{
  "success": true,
  "executionId": "exec-123",
  "message": "工作流执行已触发",
  "status": "running"
}
```

### 获取执行历史

```http
GET /api/workflows/{id}/executions?limit=20&offset=0
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**查询参数**:
- `limit`: 每页数量 (number, 默认 20)
- `offset`: 偏移量 (number, 默认 0)
- `status`: 执行状态筛选 (string: "success", "error", "running")

**响应**:
```json
{
  "data": [
    {
      "id": "exec-123",
      "workflowId": "1",
      "status": "success",
      "startedAt": "2024-01-01T00:00:00.000Z",
      "finishedAt": "2024-01-01T00:01:00.000Z",
      "duration": 60000
    }
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### 获取执行详情

```http
GET /api/executions/{executionId}
```

**请求头**:
```
Authorization: Bearer <jwt_token>
```

**响应**:
```json
{
  "id": "exec-123",
  "workflowId": "1",
  "status": "success",
  "startedAt": "2024-01-01T00:00:00.000Z",
  "finishedAt": "2024-01-01T00:01:00.000Z",
  "duration": 60000,
  "data": [
    {
      "node": "node-1",
      "output": {
        "key1": "value1"
      }
    }
  ],
  "error": null
}
```

## 管理员接口

### 获取用户列表

```http
GET /api/admin/users?limit=20&offset=0
```

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**查询参数**:
- `limit`: 每页数量 (number, 默认 20)
- `offset`: 偏移量 (number, 默认 0)
- `search`: 搜索关键词 (string)
- `role`: 角色筛选 (string)

**响应**:
```json
{
  "data": [
    {
      "id": 1,
      "username": "string",
      "email": "string",
      "role": {
        "id": 1,
        "name": "Authenticated"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### 获取审计日志

```http
GET /api/admin/audit-logs?limit=20&offset=0
```

**请求头**:
```
Authorization: Bearer <admin_jwt_token>
```

**查询参数**:
- `limit`: 每页数量 (number, 默认 20)
- `offset`: 偏移量 (number, 默认 0)
- `userId`: 用户ID筛选 (number)
- `action`: 操作类型筛选 (string)
- `startDate`: 开始日期 (string)
- `endDate`: 结束日期 (string)

**响应**:
```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "action": "workflow_execute",
      "details": {
        "workflowId": "1",
        "executionId": "exec-123"
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

## 错误处理

### 错误响应格式

```json
{
  "error": {
    "status": 400,
    "name": "BadRequest",
    "message": "错误描述",
    "details": {
      "field": "具体错误信息"
    }
  }
}
```

### 常见错误码

- `400`: 请求参数错误
- `401`: 未认证
- `403`: 权限不足
- `404`: 资源不存在
- `422`: 数据验证失败
- `500`: 服务器内部错误

## 数据模型

### User (用户)
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "role": {
    "id": 1,
    "name": "string"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### N8nInstance (n8n实例)
```json
{
  "id": 1,
  "userId": 1,
  "baseUrl": "string",
  "apiKey": "string", // 加密存储
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### ExecutionLog (执行日志)
```json
{
  "id": 1,
  "userId": 1,
  "workflowId": "string",
  "executionId": "string",
  "status": "string",
  "startedAt": "2024-01-01T00:00:00.000Z",
  "finishedAt": "2024-01-01T00:00:00.000Z",
  "duration": 60000,
  "data": {},
  "error": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### AuditLog (审计日志)
```json
{
  "id": 1,
  "userId": 1,
  "action": "string",
  "details": {},
  "ipAddress": "string",
  "userAgent": "string",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 安全考虑

1. **JWT 认证**: 所有 API 请求都需要有效的 JWT Token
2. **权限控制**: 用户只能访问自己的数据
3. **数据加密**: 敏感信息如 API Key 需要加密存储
4. **输入验证**: 所有输入都需要验证和清理
5. **速率限制**: 对关键接口实施速率限制
6. **HTTPS**: 所有通信都使用 HTTPS
7. **审计日志**: 记录所有重要操作
