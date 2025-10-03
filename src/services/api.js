// API 基础配置和工具函数
const API_BASE_URL = 'http://localhost:8080/api/v1';

// 通用 API 响应处理
const handleApiResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// 通用 API 请求函数
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        return await handleApiResponse(response);
    } catch (error) {
        throw error;
    }
};

// 构建查询参数
const buildQueryParams = (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, value);
        }
    });
    return searchParams.toString();
};

export { apiRequest, buildQueryParams };
