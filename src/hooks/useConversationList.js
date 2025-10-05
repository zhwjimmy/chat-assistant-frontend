import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../services/conversationService';
import { searchService } from '../services/searchService';
import { adaptConversationList, adaptSearchResponse } from '../utils/adapters';
import { FIXED_USER_ID } from '../utils/constants';

export const useConversationList = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        total_pages: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        provider: '',
        start_date: '',
        end_date: ''
    });
    const [providerOptions, setProviderOptions] = useState([]);

    // 获取对话列表
    const fetchConversations = useCallback(async (queryParams = {}) => {
        setLoading(true);
        setError(null);

        try {
            let response;

            // 如果有搜索条件，使用搜索接口
            if (queryParams.search && queryParams.search.trim()) {
                response = await searchService.searchConversations(
                    queryParams.search || '', // 如果没有搜索关键词，传递空字符串
                    FIXED_USER_ID,
                    queryParams.page || pagination.page,
                    queryParams.limit || pagination.limit,
                    {
                        provider: queryParams.provider,
                        start_date: queryParams.start_date,
                        end_date: queryParams.end_date
                    }
                );
                response = adaptSearchResponse(response);
            } else {
                // 否则使用对话列表接口
                response = await conversationService.getConversations(
                    FIXED_USER_ID,
                    queryParams.page || pagination.page,
                    queryParams.limit || pagination.limit
                );
                response = adaptConversationList(response);
            }

            if (response.success) {
                setConversations(response.data.conversations || []);
                setPagination(response.data.pagination || pagination);
            } else {
                setError(response.error?.message || '获取对话列表失败');
            }
        } catch (err) {
            setError(err.message || '网络错误');
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit]);

    // 获取 provider 选项
    const fetchProviderOptions = useCallback(async () => {
        try {
            const response = await conversationService.getProviderOptions();
            if (response.success) {
                setProviderOptions(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching provider options:', err);
        }
    }, []);

    // 更新筛选条件
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 1 })); // 重置到第一页
    }, []);

    // 更新分页
    const updatePagination = useCallback((newPagination) => {
        setPagination(prev => ({ ...prev, ...newPagination }));
    }, []);

    // 搜索对话
    const searchConversations = useCallback((searchTerm) => {
        updateFilters({ search: searchTerm });
    }, [updateFilters]);

    // 按 provider 筛选
    const filterByProvider = useCallback((provider) => {
        updateFilters({ provider });
    }, [updateFilters]);

    // 按时间范围筛选
    const filterByDateRange = useCallback((startDate, endDate) => {
        updateFilters({
            start_date: startDate || '',
            end_date: endDate || ''
        });
    }, [updateFilters]);

    // 切换页面
    const changePage = useCallback((page) => {
        updatePagination({ page });
    }, [updatePagination]);

    // 改变每页条数
    const changePageSize = useCallback((limit) => {
        updatePagination({ page: 1, limit });
    }, [updatePagination]);

    // 重置筛选条件
    const resetFilters = useCallback(() => {
        setFilters({
            search: '',
            provider: '',
            start_date: '',
            end_date: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // 当筛选条件或分页变化时重新获取数据
    useEffect(() => {
        fetchConversations(filters);
    }, [fetchConversations, filters, pagination.page, pagination.limit]);

    // 初始化时获取 provider 选项
    useEffect(() => {
        fetchProviderOptions();
    }, [fetchProviderOptions]);

    return {
        // 数据
        conversations,
        loading,
        error,
        pagination,
        filters,
        providerOptions,

        // 操作方法
        fetchConversations,
        searchConversations,
        filterByProvider,
        filterByDateRange,
        changePage,
        changePageSize,
        resetFilters,
        updateFilters
    };
};
