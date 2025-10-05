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
    source_id: 'string',
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

// 对话列表响应（旧版本，已废弃）
export const ConversationListResponseOld = {
    conversations: 'Conversation[]'
};

// 消息列表响应
export const MessageListResponse = {
    messages: 'Message[]'
};

// 搜索消息响应
export const SearchMessage = {
    id: 'string',
    content: 'string',
    role: 'string',
    conversation_id: 'string',
    created_at: 'string',
    updated_at: 'string',
    matched_fields: 'string[]',
    source_content: 'string',
    source_id: 'string'
};

// 搜索对话响应
export const SearchConversation = {
    id: 'string',
    title: 'string',
    user_id: 'string',
    model: 'string',
    provider: 'string',
    created_at: 'string',
    updated_at: 'string',
    matched_fields: 'string[]',
    messages: 'SearchMessage[]',
    source_id: 'string',
    source_title: 'string'
};

// 搜索响应
export const SearchResponse = {
    conversations: 'SearchConversation[]',
    query: 'string'
};

// 对话列表查询参数
export const ConversationListQuery = {
    page: 'number',
    limit: 'number',
    search: 'string',
    provider: 'string',
    start_date: 'string',
    end_date: 'string',
    user_id: 'string'
};

// 对话列表响应
export const ConversationListResponse = {
    conversations: 'Conversation[]',
    pagination: 'PaginationInfo'
};

// 标签信息
export const Tag = {
    id: 'string',
    name: 'string',
    created_at: 'string',
    updated_at: 'string'
};

// 标签列表响应
export const TagListResponse = {
    tags: 'Tag[]'
};

// 创建标签请求
export const CreateTagRequest = {
    name: 'string'
};

// 更新标签请求
export const UpdateTagRequest = {
    name: 'string'
};
