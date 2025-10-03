// API 响应数据类型定义

// 基础响应结构
export const ApiResponse = {
    success: 'boolean',
    data: 'object',
    error: 'object',
    pagination: 'object'
};

// 分页信息
export const PaginationInfo = {
    page: 'number',
    limit: 'number',
    total: 'number',
    total_pages: 'number'
};

// 错误信息
export const ErrorInfo = {
    code: 'string',
    message: 'string',
    details: 'string'
};

// 用户信息
export const User = {
    id: 'string',
    username: 'string',
    avatar: 'string',
    created_at: 'string',
    updated_at: 'string'
};

// 对话信息
export const Conversation = {
    id: 'string',
    title: 'string',
    user_id: 'string',
    model: 'string',
    provider: 'string',
    created_at: 'string',
    updated_at: 'string'
};

// 消息信息
export const Message = {
    id: 'string',
    content: 'string',
    role: 'string', // 'user' | 'assistant'
    conversation_id: 'string',
    created_at: 'string',
    updated_at: 'string'
};

// 对话列表响应
export const ConversationListResponse = {
    conversations: 'Conversation[]'
};

// 消息列表响应
export const MessageListResponse = {
    messages: 'Message[]'
};
