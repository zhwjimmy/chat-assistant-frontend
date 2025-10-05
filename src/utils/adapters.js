// API 数据适配器 - 将后端数据格式转换为前端使用的格式

// 适配对话数据
export const adaptConversation = (apiConversation) => {
    return {
        id: apiConversation.id,
        title: apiConversation.title || '未命名对话', // 处理空标题
        user_id: apiConversation.user_id,
        model: apiConversation.model,
        provider: apiConversation.provider,
        source_id: apiConversation.source_id, // 添加 source_id 字段
        created_at: apiConversation.created_at, // 保持原始时间格式用于表格显示
        updated_at: apiConversation.updated_at,
        createdAt: apiConversation.created_at, // 兼容性字段
        updatedAt: apiConversation.updated_at,
        messages: [] // 消息需要单独获取
    };
};

// 适配消息数据
export const adaptMessage = (apiMessage) => {
    return {
        id: apiMessage.id,
        content: apiMessage.content,
        role: apiMessage.role,
        conversation_id: apiMessage.conversation_id,
        timestamp: apiMessage.created_at, // 映射时间字段
        createdAt: apiMessage.created_at,
        updatedAt: apiMessage.updated_at
    };
};

// 适配用户数据
export const adaptUser = (apiUser) => {
    return {
        id: apiUser.id,
        username: apiUser.username,
        avatar: apiUser.avatar,
        createdAt: apiUser.created_at,
        updatedAt: apiUser.updated_at
    };
};

// 适配分页响应
export const adaptPaginatedResponse = (apiResponse) => {
    return {
        success: apiResponse.success,
        data: apiResponse.data,
        error: apiResponse.error,
        pagination: apiResponse.pagination
    };
};

// 适配对话列表响应
export const adaptConversationList = (apiResponse) => {
    const adapted = adaptPaginatedResponse(apiResponse);
    if (adapted.data && adapted.data.conversations) {
        adapted.data.conversations = adapted.data.conversations.map(adaptConversation);
        // 确保分页信息在正确的位置
        adapted.data.pagination = adapted.pagination;
    }
    return adapted;
};

// 适配消息列表响应
export const adaptMessageList = (apiResponse) => {
    const adapted = adaptPaginatedResponse(apiResponse);
    if (adapted.data && adapted.data.messages) {
        adapted.data.messages = adapted.data.messages.map(adaptMessage);
    }
    return adapted;
};

// 适配单个对话响应
export const adaptConversationResponse = (apiResponse) => {
    const adapted = adaptPaginatedResponse(apiResponse);
    if (adapted.data) {
        adapted.data = adaptConversation(adapted.data);
    }
    return adapted;
};

// 适配单个消息响应
export const adaptMessageResponse = (apiResponse) => {
    const adapted = adaptPaginatedResponse(apiResponse);
    if (adapted.data) {
        adapted.data = adaptMessage(adapted.data);
    }
    return adapted;
};

// 适配用户响应
export const adaptUserResponse = (apiResponse) => {
    const adapted = adaptPaginatedResponse(apiResponse);
    if (adapted.data) {
        adapted.data = adaptUser(adapted.data);
    }
    return adapted;
};

// 适配搜索消息数据
export const adaptSearchMessage = (apiSearchMessage) => {
    return {
        id: apiSearchMessage.id,
        content: apiSearchMessage.content,
        role: apiSearchMessage.role,
        conversation_id: apiSearchMessage.conversation_id,
        timestamp: apiSearchMessage.created_at,
        createdAt: apiSearchMessage.created_at,
        updatedAt: apiSearchMessage.updated_at,
        matchedFields: apiSearchMessage.matched_fields || [],
        sourceContent: apiSearchMessage.source_content || apiSearchMessage.content,
        sourceId: apiSearchMessage.source_id
    };
};

// 适配搜索对话数据
export const adaptSearchConversation = (apiSearchConversation) => {
    return {
        id: apiSearchConversation.id,
        title: apiSearchConversation.title || '未命名对话',
        user_id: apiSearchConversation.user_id,
        model: apiSearchConversation.model,
        provider: apiSearchConversation.provider,
        source_id: apiSearchConversation.source_id, // 添加 source_id 字段
        created_at: apiSearchConversation.created_at, // 保持原始时间格式用于表格显示
        updated_at: apiSearchConversation.updated_at,
        createdAt: apiSearchConversation.created_at, // 兼容性字段
        updatedAt: apiSearchConversation.updated_at,
        matchedFields: apiSearchConversation.matched_fields || [],
        messages: (apiSearchConversation.messages || []).map(adaptSearchMessage),
        sourceId: apiSearchConversation.source_id, // 保持原有字段名
        sourceTitle: apiSearchConversation.source_title
    };
};

// 适配搜索响应
export const adaptSearchResponse = (apiResponse) => {
    const adapted = adaptPaginatedResponse(apiResponse);
    if (adapted.data) {
        adapted.data = {
            conversations: (adapted.data.conversations || []).map(adaptSearchConversation),
            query: adapted.data.query || '',
            // 确保分页信息在正确的位置
            pagination: adapted.pagination
        };
    }
    return adapted;
};
