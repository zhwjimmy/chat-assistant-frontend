import { apiRequest, buildQueryParams } from './api.js';

// 对话相关 API 服务
export const conversationService = {
    // 获取对话列表
    getConversations: async (userId, page = 1, limit = 10) => {
        const params = buildQueryParams({ user_id: userId, page, limit });
        return apiRequest(`/conversations?${params}`);
    },

    // 获取单个对话详情
    getConversation: async (conversationId) => {
        return apiRequest(`/conversations/${conversationId}`);
    },

    // 删除对话
    deleteConversation: async (conversationId) => {
        return apiRequest(`/conversations/${conversationId}`, {
            method: 'DELETE',
        });
    },

    // 获取对话中的消息列表
    getConversationMessages: async (conversationId, page = 1, limit = 10) => {
        const params = buildQueryParams({ page, limit });
        return apiRequest(`/conversations/${conversationId}/messages?${params}`);
    },
};
