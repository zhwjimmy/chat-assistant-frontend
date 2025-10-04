# API 集成说明

## 项目更新概述

本项目已根据后端 Swagger API 文档进行了全面更新，实现了与后端 API 的集成。

## 主要更新内容

### 1. API 服务层 (`src/services/`)
- **`api.js`**: 基础 API 工具函数和配置
- **`conversationService.js`**: 对话相关 API 服务
- **`messageService.js`**: 消息相关 API 服务  
- **`userService.js`**: 用户相关 API 服务
- **`index.js`**: 统一导出文件

### 2. 数据模型和适配器 (`src/models/` 和 `src/utils/`)
- **`types.js`**: API 响应数据类型定义
- **`adapters.js`**: 数据适配器，将后端数据格式转换为前端格式
- **`constants.js`**: 应用常量配置

### 3. 自定义 Hooks (`src/hooks/`)
- **`useApi.js`**: API 调用状态管理 Hook

### 4. 组件更新
- **`Sidebar.jsx`**: 更新为使用真实 API 获取对话列表
- **`ChatPage.jsx`**: 更新为使用真实 API 获取对话详情和消息
- **`InputBox.jsx`**: 已移除（消息发送功能不可用）

## API 端点使用情况

### ✅ 已实现的端点
- `GET /api/v1/conversations` - 获取对话列表
- `GET /api/v1/conversations/{id}` - 获取对话详情
- `DELETE /api/v1/conversations/{id}` - 删除对话
- `GET /api/v1/conversations/{id}/messages` - 获取对话消息
- `GET /api/v1/messages` - 获取所有消息
- `GET /api/v1/messages/{id}` - 获取消息详情
- `DELETE /api/v1/messages/{id}` - 删除消息
- `GET /api/v1/users/{id}` - 获取用户信息

### ❌ 暂时禁用的功能
- 创建新对话（后端不支持 POST /conversations）
- 用户认证（项目使用固定用户 ID）

## 配置说明

### 固定用户 ID
项目使用固定的用户 ID: `1e50f20b-bd2d-4c13-a276-43ae6415d393`

### API 基础 URL
默认配置: `http://localhost:8080/api/v1`

## 数据适配

### 时间字段映射
- 后端: `created_at`, `updated_at`
- 前端: `createdAt`, `timestamp`, `updatedAt`

### 响应格式适配
后端响应格式:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "pagination": { ... }
}
```

前端适配后格式:
```json
{
  "id": "string",
  "title": "string",
  "createdAt": "string",
  "messages": [...]
}
```

## 错误处理

- 网络错误自动重试
- API 失败时回退到本地存储
- 用户友好的错误提示

## 开发说明

### 启动项目
```bash
npm run dev
```

### 验证 API 连接
1. 确保后端服务运行在 `http://localhost:8080`
2. 启动前端项目，查看侧边栏是否正常加载对话列表
3. 点击对话查看消息内容是否正常显示

### 添加新功能
1. 在 `src/services/` 中添加新的 API 服务
2. 在 `src/utils/adapters.js` 中添加数据适配器
3. 在组件中使用 `useApi` Hook 调用 API

## 注意事项

1. **创建和发送功能暂时不可用**：因为后端 API 不支持这些操作
2. **用户认证**：项目使用固定用户 ID，无需登录
3. **错误处理**：API 失败时会自动回退到本地存储
4. **数据同步**：删除操作会同时更新 API 和本地存储

## 后续开发建议

1. 等待后端实现创建对话的 API
2. 添加用户认证功能
3. 实现实时消息推送
4. 添加消息搜索功能
5. 优化分页和无限滚动
