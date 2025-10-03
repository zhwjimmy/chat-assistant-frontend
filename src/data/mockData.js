// Mock 数据 - 模拟聊天会话和消息
export const mockChats = [
    {
        id: '1',
        title: '如何学习 React？',
        messages: [
            {
                id: '1-1',
                role: 'user',
                content: '我想学习 React，应该从哪里开始？',
                timestamp: '2024-01-15T10:30:00.000Z'
            },
            {
                id: '1-2',
                role: 'assistant',
                content: `学习 React 是一个很好的选择！我建议你按照以下步骤开始：

## 1. 基础知识准备
- 确保你熟悉 **JavaScript ES6+** 语法
- 了解 **HTML** 和 **CSS** 基础
- 学习 **npm** 或 **yarn** 包管理工具

## 2. 学习路径
1. **React 基础概念**
   - 组件 (Components)
   - JSX 语法
   - Props 和 State
   - 事件处理

2. **进阶内容**
   - Hooks (useState, useEffect 等)
   - 组件生命周期
   - 状态管理 (Context API, Redux)
   - 路由 (React Router)

## 3. 实践项目
建议从简单的项目开始，比如：
- Todo 应用
- 天气查询应用
- 博客系统

你想从哪个方面开始深入学习？`,
                timestamp: '2024-01-15T10:31:00.000Z'
            },
            {
                id: '1-3',
                role: 'user',
                content: '能详细介绍一下 React Hooks 吗？',
                timestamp: '2024-01-15T10:35:00.000Z'
            },
            {
                id: '1-4',
                role: 'assistant',
                content: `当然！React Hooks 是 React 16.8 引入的重要特性，让函数组件也能使用状态和其他 React 特性。

## 常用 Hooks

### 1. useState
用于在函数组件中添加状态：

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
\`\`\`

### 2. useEffect
用于处理副作用，相当于类组件的生命周期：

\`\`\`javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // 组件挂载时执行
    fetchUser(userId).then(setUser);
    
    // 清理函数
    return () => {
      // 组件卸载时执行清理
    };
  }, [userId]); // 依赖数组
  
  return <div>{user?.name}</div>;
}
\`\`\`

### 3. useContext
用于在组件树中共享数据：

\`\`\`javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  return <div className={\`theme-\${theme}\`}>Header</div>;
}
\`\`\`

## Hooks 规则
1. 只在函数组件的顶层调用 Hooks
2. 不要在循环、条件或嵌套函数中调用 Hooks

你想了解哪个具体的 Hook？`,
                timestamp: '2024-01-15T10:36:00.000Z'
            }
        ],
        createdAt: '2024-01-15T10:30:00.000Z'
    },
    {
        id: '2',
        title: 'JavaScript 异步编程',
        messages: [
            {
                id: '2-1',
                role: 'user',
                content: 'Promise 和 async/await 有什么区别？',
                timestamp: '2024-01-15T11:00:00.000Z'
            },
            {
                id: '2-2',
                role: 'assistant',
                content: `很好的问题！Promise 和 async/await 都是处理异步操作的方式，但它们有不同的使用场景和语法。

## Promise
Promise 是 ES6 引入的异步编程解决方案：

\`\`\`javascript
// Promise 链式调用
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  })
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.error('错误:', error));
\`\`\`

## async/await
async/await 是 ES2017 引入的语法糖，让异步代码看起来像同步代码：

\`\`\`javascript
// async/await 写法
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    
    const processResponse = await fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    const result = await processResponse.json();
    console.log(result);
  } catch (error) {
    console.error('错误:', error);
  }
}
\`\`\`

## 主要区别

| 特性 | Promise | async/await |
|------|---------|-------------|
| 语法 | 链式调用 | 同步风格 |
| 错误处理 | .catch() | try/catch |
| 调试 | 较困难 | 更容易 |
| 可读性 | 回调地狱风险 | 更清晰 |

## 使用建议
- **简单异步操作**: 使用 Promise
- **复杂异步逻辑**: 使用 async/await
- **并行操作**: 结合 Promise.all() 使用

你更倾向于使用哪种方式？`,
                timestamp: '2024-01-15T11:01:00.000Z'
            }
        ],
        createdAt: '2024-01-15T11:00:00.000Z'
    },
    {
        id: '3',
        title: 'CSS 布局技巧',
        messages: [
            {
                id: '3-1',
                role: 'user',
                content: 'Flexbox 和 Grid 布局有什么区别？什么时候用哪个？',
                timestamp: '2024-01-15T14:20:00.000Z'
            },
            {
                id: '3-2',
                role: 'assistant',
                content: `Flexbox 和 Grid 是现代 CSS 布局的两大重要工具，它们各有优势：

## Flexbox (一维布局)
适合处理**一个方向**的布局：

\`\`\`css
.container {
  display: flex;
  justify-content: space-between; /* 主轴对齐 */
  align-items: center;           /* 交叉轴对齐 */
  gap: 20px;                     /* 间距 */
}

.item {
  flex: 1; /* 弹性增长 */
}
\`\`\`

**适用场景**：
- 导航栏
- 按钮组
- 卡片列表
- 垂直居中

## Grid (二维布局)
适合处理**行和列**的复杂布局：

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* 三列 */
  grid-template-rows: auto 1fr auto;   /* 三行 */
  gap: 20px;
  height: 100vh;
}

.header { grid-column: 1 / -1; }
.sidebar { grid-row: 2; }
.main { grid-row: 2; }
.footer { grid-column: 1 / -1; }
\`\`\`

**适用场景**：
- 页面整体布局
- 复杂表格
- 图片画廊
- 仪表板

## 选择建议

| 布局需求 | 推荐方案 |
|----------|----------|
| 单行/单列排列 | Flexbox |
| 复杂网格布局 | Grid |
| 响应式设计 | 两者结合 |
| 垂直居中 | Flexbox |
| 页面框架 | Grid |

## 实际应用
\`\`\`css
/* 页面布局用 Grid */
.page {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* 组件内部用 Flexbox */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

你目前主要在做哪种类型的布局？`,
                timestamp: '2024-01-15T14:21:00.000Z'
            }
        ],
        createdAt: '2024-01-15T14:20:00.000Z'
    },
    {
        id: '4',
        title: 'Vue vs React 对比',
        messages: [
            {
                id: '4-1',
                role: 'user',
                content: 'Vue 和 React 哪个更适合初学者？',
                timestamp: '2024-01-15T16:45:00.000Z'
            },
            {
                id: '4-2',
                role: 'assistant',
                content: `这是一个很常见的问题！Vue 和 React 都是优秀的前端框架，选择哪个主要看你的学习目标和项目需求。

## Vue 的优势
- **学习曲线平缓**: 模板语法更接近 HTML
- **官方工具链完整**: Vue CLI、Vue Router、Vuex 都是官方维护
- **文档友好**: 中文文档详细，社区活跃
- **渐进式框架**: 可以逐步引入，不需要重写整个项目

## React 的优势
- **生态系统庞大**: 第三方库和工具更多
- **就业机会多**: 大厂使用较多，市场需求大
- **灵活性高**: 可以与其他技术栈结合
- **社区活跃**: GitHub 星数多，更新频繁

## 学习建议

### 选择 Vue 如果你：
- 是前端新手
- 喜欢模板语法
- 需要快速上手
- 团队规模较小

### 选择 React 如果你：
- 有 JavaScript 基础
- 追求灵活性
- 考虑就业前景
- 需要处理复杂状态

## 实际对比

| 特性 | Vue | React |
|------|-----|-------|
| 学习难度 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 生态系统 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 性能 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 就业机会 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 我的建议
1. **先学 Vue**: 快速建立前端开发概念
2. **再学 React**: 提升技术深度和就业竞争力
3. **关注核心概念**: 组件化、状态管理、路由等

你目前更倾向于哪个方向？`,
                timestamp: '2024-01-15T16:46:00.000Z'
            }
        ],
        createdAt: '2024-01-15T16:45:00.000Z'
    },
    {
        id: '5',
        title: 'TypeScript 入门指南',
        messages: [
            {
                id: '5-1',
                role: 'user',
                content: 'TypeScript 真的有必要学吗？',
                timestamp: '2024-01-15T18:30:00.000Z'
            },
            {
                id: '5-2',
                role: 'assistant',
                content: `TypeScript 确实值得学习！虽然增加了学习成本，但带来的好处是显著的。

## TypeScript 的核心价值

### 1. 类型安全
\`\`\`typescript
// JavaScript - 运行时才发现错误
function calculateTotal(price, quantity) {
  return price * quantity; // 如果传入字符串会怎样？
}

// TypeScript - 编译时发现错误
function calculateTotal(price: number, quantity: number): number {
  return price * quantity; // 类型安全！
}
\`\`\`

### 2. 更好的开发体验
- **智能提示**: IDE 可以提供准确的代码补全
- **重构安全**: 重命名变量时不会遗漏
- **文档化**: 类型本身就是最好的文档

### 3. 团队协作
- **减少沟通成本**: 类型定义就是接口文档
- **降低 Bug 率**: 编译时发现类型错误
- **提高代码质量**: 强制思考数据结构

## 学习路径建议

### 阶段 1: 基础类型
\`\`\`typescript
// 基本类型
let name: string = "张三";
let age: number = 25;
let isActive: boolean = true;

// 数组和对象
let hobbies: string[] = ["编程", "阅读"];
let user: { name: string; age: number } = { name: "张三", age: 25 };
\`\`\`

### 阶段 2: 函数和接口
\`\`\`typescript
// 接口定义
interface User {
  id: number;
  name: string;
  email?: string; // 可选属性
}

// 函数类型
function createUser(userData: User): User {
  return { ...userData, id: Date.now() };
}
\`\`\`

### 阶段 3: 泛型和高级类型
\`\`\`typescript
// 泛型
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 使用泛型
const userResponse: ApiResponse<User> = await fetchUser();
\`\`\`

## 实际项目中的价值

| 项目规模 | TypeScript 价值 |
|----------|----------------|
| 个人项目 | 中等 - 提升代码质量 |
| 小团队 | 高 - 减少沟通成本 |
| 大项目 | 极高 - 架构稳定性 |

## 我的建议
1. **从现有项目开始**: 逐步添加类型定义
2. **不要追求完美**: 先解决主要类型问题
3. **利用工具**: 使用 ESLint + TypeScript 插件
4. **实践为主**: 在真实项目中学习

你觉得从哪个方面开始学习 TypeScript？`,
                timestamp: '2024-01-15T18:31:00.000Z'
            }
        ],
        createdAt: '2024-01-15T18:30:00.000Z'
    }
];

// 模拟 AI 回复生成器
export const generateMockAIResponse = (userInput) => {
    const responses = [
        `我理解您的问题："${userInput}"。这是一个很有趣的话题，让我来为您详细解答。`,
        `关于"${userInput}"，我可以为您提供以下信息和建议。`,
        `感谢您的提问！针对"${userInput}"这个问题，我的回答是...`,
        `这是一个很好的问题。关于"${userInput}"，我想分享一些想法。`,
        `我明白您想了解"${userInput}"。让我为您详细解释一下。`,
        `关于"${userInput}"，这是一个值得深入探讨的话题。让我从几个角度来分析：`,
        `您提到的"${userInput}"确实很重要。我来为您详细说明一下相关的概念和实践。`,
        `针对"${userInput}"这个问题，我建议从以下几个方面来考虑：`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
};

// 模拟延迟响应
export const simulateAIResponse = (userInput, delay = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(generateMockAIResponse(userInput));
        }, delay);
    });
};
