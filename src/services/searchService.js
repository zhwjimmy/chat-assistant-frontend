import { apiRequest, buildQueryParams } from './api.js';
import { adaptSearchResponse } from '../utils/adapters.js';

// 搜索对话服务
export const searchService = {
    /**
     * 搜索对话
     * @param {string} query - 搜索关键词
     * @param {string} userId - 用户ID
     * @param {number} page - 页码，默认为1
     * @param {number} limit - 每页数量，默认为10
     * @param {Object} filters - 筛选条件
     * @returns {Promise<Object>} 搜索结果
     */
    async searchConversations(query, userId, page = 1, limit = 10, filters = {}) {
        const params = {
            q: query,
            user_id: userId,
            page,
            limit,
            ...(filters.provider && { provider_id: filters.provider }),
            ...(filters.start_date && { start_date: filters.start_date }),
            ...(filters.end_date && { end_date: filters.end_date })
        };

        const queryString = buildQueryParams(params);
        const endpoint = `/search?${queryString}`;

        try {
            const response = await apiRequest(endpoint, {
                method: 'GET'
            });

            // 使用适配器转换响应数据
            return adaptSearchResponse(response);
        } catch (error) {
            console.error('Search conversations error:', error);
            throw error;
        }
    }
};
