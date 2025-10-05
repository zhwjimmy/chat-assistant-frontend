import { apiRequest, buildQueryParams } from './api.js';

// 对话相关 API 服务
export const conversationService = {
    // 获取对话列表
    getConversations: async (userId, page = 1, limit = 20) => {
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


    // 获取可用的 provider 选项
    getProviderOptions: async () => {
        // 从对话列表中提取唯一的 provider 值
        try {
            const response = await conversationService.getConversations(
                '1e50f20b-bd2d-4c13-a276-43ae6415d393',
                1,
                1000 // 获取足够多的数据来提取所有 provider
            );

            if (response.success && response.data && response.data.conversations) {
                const providers = [...new Set(response.data.conversations.map(conv => conv.provider))];
                return {
                    success: true,
                    data: providers
                };
            }

            // 如果获取失败，返回默认选项
            return {
                success: true,
                data: ['openai', 'anthropic', 'google', 'azure', 'custom']
            };
        } catch (error) {
            console.warn('Failed to get provider options:', error);
            return {
                success: true,
                data: ['openai', 'anthropic', 'google', 'azure', 'custom']
            };
        }
    },
};
