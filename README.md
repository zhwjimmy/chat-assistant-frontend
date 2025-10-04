# 聊天助手前端

一个基于 React + TailwindCSS 构建的 ChatGPT 风格的聊天助手前端应用。

## 功能特性

- 🎨 **现代化 UI**: 参考 ChatGPT 网页设计，支持深色/浅色模式切换
- 💬 **多会话管理**: 支持创建、切换、删除多个聊天会话
- 📝 **Markdown 渲染**: 支持表格、代码块等 Markdown 语法
- 💾 **本地存储**: 聊天记录自动保存到 LocalStorage
- 📱 **响应式设计**: 适配不同屏幕尺寸
- ⚡ **快速响应**: 基于 Vite 构建，开发体验流畅

## 技术栈

- **React 18** - 前端框架
- **TailwindCSS** - 样式框架
- **React Router** - 路由管理
- **React Markdown** - Markdown 渲染
- **Lucide React** - 图标库
- **Vite** - 构建工具

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── Layout.jsx      # 主布局组件
│   ├── Sidebar.jsx     # 侧边栏组件
│   ├── Header.jsx      # 顶部导航栏
│   └── ChatWindow.jsx  # 聊天窗口
├── pages/              # 页面组件
│   ├── ChatPage.jsx    # 聊天页面
│   └── SettingsPage.jsx # 设置页面
├── App.jsx             # 主应用组件
├── main.jsx            # 应用入口
└── index.css           # 全局样式
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用说明

1. **新建对话**: 点击侧边栏的"新建对话"按钮
2. **切换会话**: 在侧边栏点击不同的聊天记录
3. **删除会话**: 鼠标悬停在聊天记录上，点击删除按钮
4. **搜索对话**: 点击搜索按钮查找特定对话
5. **深色模式**: 在侧边栏底部或设置页面切换深色/浅色模式
6. **设置**: 点击侧边栏底部的设置按钮进行个性化配置

## 主要功能

### 聊天功能
- 支持多行文本输入
- 实时消息显示
- 消息时间戳
- 复制消息内容
- 模拟 AI 回复

### 会话管理
- 自动保存聊天记录
- 会话标题自动生成
- 支持删除历史会话
- 本地存储持久化

### 界面特性
- 响应式侧边栏
- 深色/浅色主题
- 平滑动画效果
- 现代化 UI 设计

## 开发说明

项目使用 Vite 作为构建工具，支持热重载和快速构建。所有组件都采用函数式组件和 React Hooks。

样式使用 TailwindCSS 构建，支持深色模式，所有颜色和间距都经过精心设计。

## 许可证

MIT License
