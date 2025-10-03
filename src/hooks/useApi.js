import { useState, useCallback } from 'react';
import { ERROR_MESSAGES, LOADING_MESSAGES } from '../utils/constants';

// 自定义 Hook 用于处理 API 调用状态
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 执行 API 调用
    const execute = useCallback(async (apiCall, options = {}) => {
        const {
            showLoading = true,
            loadingMessage = LOADING_MESSAGES.LOADING_CONVERSATIONS,
            onSuccess,
            onError
        } = options;

        try {
            if (showLoading) {
                setLoading(true);
                setError(null);
            }

            const result = await apiCall();

            if (onSuccess) {
                onSuccess(result);
            }

            return result;
        } catch (err) {
            const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
            setError(errorMessage);

            if (onError) {
                onError(err);
            }

            throw err;
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }, []);

    // 清除错误
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // 重置状态
    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
    }, []);

    return {
        loading,
        error,
        execute,
        clearError,
        reset
    };
};
