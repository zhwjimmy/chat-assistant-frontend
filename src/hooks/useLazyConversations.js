import { useState, useEffect, useCallback, useRef } from 'react';
import { conversationService } from '../services';
import { adaptConversationList } from '../utils/adapters';
import { FIXED_USER_ID, STORAGE_KEYS } from '../utils/constants';

const PAGE_SIZE = 20;
const CACHE_KEY = 'conversations_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟缓存

export function useLazyConversations() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const cacheRef = useRef(null);
    const abortControllerRef = useRef(null);

    // 防抖函数
    const debounce = useCallback((func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    }, []);

    // 从缓存加载数据
    const loadFromCache = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_EXPIRY) {
                    return data;
                }
            }
        } catch (error) {
            console.warn('Failed to load from cache:', error);
        }
        return null;
    }, []);

    // 保存到缓存
    const saveToCache = useCallback((data) => {
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to save to cache:', error);
        }
    }, []);

    // 加载对话列表
    const loadConversations = useCallback(async (page = 1, append = false) => {
        // 取消之前的请求
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const response = await conversationService.getConversations(
                FIXED_USER_ID,
                page,
                PAGE_SIZE
            );

            const adaptedResponse = adaptConversationList(response);

            if (adaptedResponse.success && adaptedResponse.data) {
                const newConversations = adaptedResponse.data.conversations || [];
                const pagination = adaptedResponse.pagination || {};
                const totalCount = pagination.total || 0;
                const totalPages = pagination.total_pages || 0;

                if (append) {
                    setConversations(prev => [...prev, ...newConversations]);
                } else {
                    setConversations(newConversations);
                    // 保存到缓存
                    saveToCache(newConversations);
                }

                // 检查是否还有更多数据
                // 方法1: 基于总页数判断
                const hasMorePages = page < totalPages;
                // 方法2: 基于返回的数据量判断
                const hasMoreData = newConversations.length === PAGE_SIZE;
                // 方法3: 基于总数判断
                const loadedCount = append ?
                    conversations.length + newConversations.length :
                    newConversations.length;
                const hasMoreByTotal = totalCount > 0 && loadedCount < totalCount;

                // 使用最保守的判断：只要满足任一条件就认为还有更多数据
                setHasMore(hasMorePages || (hasMoreData && hasMoreByTotal));

                setCurrentPage(page);
            } else {
                throw new Error(adaptedResponse.message || 'Failed to load conversations');
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                return; // 请求被取消，不处理错误
            }

            console.error('Error loading conversations:', err);
            setError(err.message || 'Failed to load conversations');

            // 如果是第一页且API失败，尝试从缓存加载
            if (page === 1 && !append) {
                const cachedData = loadFromCache();
                if (cachedData) {
                    setConversations(cachedData);
                    // 不设置 hasMore，因为缓存数据可能不完整
                } else {
                    // 尝试从本地存储加载
                    const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
                    if (savedChats) {
                        setConversations(JSON.parse(savedChats));
                    }
                }
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [saveToCache, loadFromCache]);

    // 加载更多对话
    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && !loading) {
            loadConversations(currentPage + 1, true);
        }
    }, [loadingMore, hasMore, loading, currentPage, loadConversations]);

    // 防抖的加载更多函数
    const debouncedLoadMore = useCallback(
        debounce(loadMore, 200),
        [loadMore]
    );

    // 刷新对话列表
    const refresh = useCallback(() => {
        setCurrentPage(1);
        setHasMore(true);
        loadConversations(1, false);
    }, [loadConversations]);

    // 删除对话
    const deleteConversation = useCallback((conversationId) => {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));

        // 更新缓存
        const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
        saveToCache(updatedConversations);

        // 更新本地存储
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(updatedConversations));
    }, [conversations, saveToCache]);

    // 初始化加载
    useEffect(() => {
        // 先尝试从缓存加载
        const cachedData = loadFromCache();
        if (cachedData && cachedData.length > 0) {
            setConversations(cachedData);
            setCurrentPage(1);
            // 不设置 hasMore，让 API 响应来决定
        }

        // 然后加载最新数据
        loadConversations(1, false);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        conversations,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore: debouncedLoadMore,
        refresh,
        deleteConversation
    };
}
