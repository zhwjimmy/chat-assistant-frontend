# API 接口文档

## 聊天相关接口

### 1. 获取聊天列表
```
GET /api/chats
```
**返回**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "string",
      "title": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### 2. 获取聊天详情
```
GET /api/chats/{chatId}
```
**参数**:
- `chatId`: 聊天ID

**返回**:
```json
{
  "code": 200,
  "data": {
    "id": "string",
    "title": "string",
    "messages": [
      {
        "id": "string",
        "role": "user|assistant",
        "content": "string",
        "timestamp": "string"
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### 3. 创建新聊天
```
POST /api/chats
```
**参数**:
```json
{
  "title": "string"
}
```

**返回**:
```json
{
  "code": 200,
  "data": {
    "id": "string",
    "title": "string",
    "createdAt": "string"
  }
}
```

### 4. 删除聊天
```
DELETE /api/chats/{chatId}
```
**参数**:
- `chatId`: 聊天ID

**返回**:
```json
{
  "code": 200,
  "message": "删除成功"
}
```

### 5. 发送消息
```
POST /api/chats/{chatId}/messages
```
**参数**:
```json
{
  "content": "string"
}
```

**返回**:
```json
{
  "code": 200,
  "data": {
    "userMessage": {
      "id": "string",
      "role": "user",
      "content": "string",
      "timestamp": "string"
    },
    "aiMessage": {
      "id": "string",
      "role": "assistant",
      "content": "string",
      "timestamp": "string"
    }
  }
}
```

### 6. 流式发送消息 (SSE)
```
GET /api/chats/{chatId}/stream?message={content}
```
**参数**:
- `chatId`: 聊天ID
- `message`: 消息内容

**返回**: Server-Sent Events 流
```
data: {"id": "string", "content": "partial_content", "done": false}
data: {"id": "string", "content": "final_content", "done": true}
```

## 用户设置接口

### 7. 获取用户设置
```
GET /api/settings
```
**返回**:
```json
{
  "code": 200,
  "data": {
    "darkMode": "boolean",
    "autoSave": "boolean",
    "fontSize": "small|medium|large",
    "language": "zh-CN|en-US"
  }
}
```

### 8. 更新用户设置
```
PUT /api/settings
```
**参数**:
```json
{
  "darkMode": "boolean",
  "autoSave": "boolean",
  "fontSize": "small|medium|large",
  "language": "zh-CN|en-US"
}
```

**返回**:
```json
{
  "code": 200,
  "message": "设置已保存"
}
```

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "data": "any",
  "message": "string"
}
```

### 错误响应
```json
{
  "code": 400|401|403|404|500,
  "message": "string",
  "error": "string"
}
```

## 状态码说明
- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器内部错误
