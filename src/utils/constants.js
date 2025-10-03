// 应用常量配置

// 固定用户 ID
export const FIXED_USER_ID = '1e50f20b-bd2d-4c13-a276-43ae6415d393';

// API 配置
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api/v1',
    TIMEOUT: 10000, // 10秒超时
    RETRY_ATTEMPTS: 3
};

// 分页配置
export const PAGINATION_CONFIG = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

// 消息角色
export const MESSAGE_ROLES = {
    USER: 'user',
    ASSISTANT: 'assistant'
};

// 本地存储键名
export const STORAGE_KEYS = {
    CHATS: 'chats',
    DARK_MODE: 'darkMode',
    USER_PREFERENCES: 'userPreferences'
};

// 错误消息
export const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    SERVER_ERROR: '服务器错误，请稍后重试',
    NOT_FOUND: '请求的资源不存在',
    UNAUTHORIZED: '未授权访问',
    FORBIDDEN: '访问被拒绝',
    VALIDATION_ERROR: '数据验证失败',
    UNKNOWN_ERROR: '未知错误，请稍后重试'
};

// 加载状态消息
export const LOADING_MESSAGES = {
    LOADING_CONVERSATIONS: '正在加载对话列表...',
    LOADING_MESSAGES: '正在加载消息...',
    LOADING_USER: '正在加载用户信息...',
    DELETING_CONVERSATION: '正在删除对话...',
    DELETING_MESSAGE: '正在删除消息...'
};
