import { apiRequest } from './api.js';

// 用户相关 API 服务
export const userService = {
    // 获取用户详情
    getUser: async (userId) => {
        return apiRequest(`/users/${userId}`);
    },
};
