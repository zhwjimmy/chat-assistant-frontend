import { apiRequest, buildQueryParams } from './api.js';

// 搜索对话服务
export const searchService = {
    /**
     * 搜索对话
     * @param {string} query - 搜索关键词
     * @param {string} userId - 用户ID
     * @param {number} page - 页码，默认为1
     * @param {number} limit - 每页数量，默认为10
     * @returns {Promise<Object>} 搜索结果
     */
    async searchConversations(query, userId, page = 1, limit = 10) {
        const params = {
            q: query,
            user_id: userId,
            page,
            limit
        };

        const queryString = buildQueryParams(params);
        const endpoint = `/search?${queryString}`;

        try {
            const response = await apiRequest(endpoint, {
                method: 'GET'
            });

            return response;
        } catch (error) {
            console.error('Search conversations error:', error);
            throw error;
        }
    }
};
