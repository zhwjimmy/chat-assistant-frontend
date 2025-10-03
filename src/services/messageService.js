import { apiRequest, buildQueryParams } from './api.js';

// 消息相关 API 服务
export const messageService = {
    // 获取所有消息列表
    getMessages: async (page = 1, limit = 10) => {
        const params = buildQueryParams({ page, limit });
        return apiRequest(`/messages?${params}`);
    },

    // 获取单个消息详情
    getMessage: async (messageId) => {
        return apiRequest(`/messages/${messageId}`);
    },

    // 删除消息
    deleteMessage: async (messageId) => {
        return apiRequest(`/messages/${messageId}`, {
            method: 'DELETE',
        });
    },
};
