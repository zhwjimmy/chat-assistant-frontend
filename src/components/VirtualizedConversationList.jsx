import { Link, useLocation } from 'react-router-dom';
import { Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

function ConversationItem({
    chat,
    onDeleteClick,
    showDeleteConfirm,
    onConfirmDelete,
    onCancelDelete
}) {
    const location = useLocation();
    const isActive = location.pathname.includes(chat.id);

    return (
        <div className="relative">
            <Link
                to={`/chat/${chat.id}`}
                className={`group flex items-center justify-between px-3 py-2 h-10 transition-colors duration-200 ${isActive
                    ? 'bg-gray-100 dark:bg-gray-800 border-l-2 border-indigo-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
            >
                {/* 会话标题 */}
                <div className="flex-1 min-w-0">
                    <span
                        className={`text-sm truncate block ${isActive
                            ? 'text-gray-900 dark:text-gray-100 font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                            }`}
                        title={chat.title}
                    >
                        {chat.title}
                    </span>
                </div>

                {/* 删除按钮 */}
                <button
                    onClick={(e) => onDeleteClick(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all duration-200 flex-shrink-0 ml-2"
                >
                    <Trash2 size={14} className="text-red-500" />
                </button>
            </Link>

            {/* 删除确认对话框 */}
            {showDeleteConfirm === chat.id && (
                <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-10">
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        确定要删除这个对话吗？
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onConfirmDelete(chat.id)}
                            className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                            删除
                        </button>
                        <button
                            onClick={onCancelDelete}
                            className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function VirtualizedConversationList({
    chats,
    onDeleteClick,
    showDeleteConfirm,
    onConfirmDelete,
    onCancelDelete,
    height = 400,
    loadingMore = false,
    hasMore = true,
    onLoadMore,
    error = null,
    onRetry
}) {
    const scrollContainerRef = useRef(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [isNearBottom, setIsNearBottom] = useState(false);

    // 简化的虚拟滚动实现 - 只渲染可见的项
    const ITEM_HEIGHT = 40; // ChatGPT 风格的行高
    const CONTAINER_HEIGHT = height;
    const VISIBLE_ITEMS = Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 2; // 多渲染2个作为缓冲
    const TRIGGER_DISTANCE = 200; // 距离底部200px时触发加载

    // 处理滚动事件
    const handleScroll = useCallback((e) => {
        const container = e.target;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        setScrollTop(scrollTop);

        // 检查是否接近底部
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const nearBottom = distanceFromBottom < TRIGGER_DISTANCE;

        setIsNearBottom(nearBottom);

        // 如果接近底部且有更多数据且不在加载中，触发加载更多
        if (nearBottom && hasMore && !loadingMore && onLoadMore) {
            onLoadMore();
        }
    }, [hasMore, loadingMore, onLoadMore]);

    // 加载指示器组件
    const LoadingIndicator = () => {
        if (loadingMore) {
            return (
                <div className="flex items-center justify-center py-4 text-gray-500 dark:text-gray-400">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span className="text-sm">加载中...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-4 text-red-500 dark:text-red-400">
                    <AlertCircle size={16} className="mb-2" />
                    <span className="text-sm mb-2">加载失败</span>
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded transition-colors"
                    >
                        <RefreshCw size={12} />
                        重试
                    </button>
                </div>
            );
        }

        if (!hasMore && chats.length > 0) {
            return (
                <div className="flex items-center justify-center py-4 text-gray-400 dark:text-gray-500">
                    <span className="text-xs">已加载全部会话</span>
                </div>
            );
        }

        return null;
    };

    if (chats.length === 0 && !loadingMore) {
        return (
            <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                暂无对话记录
            </div>
        );
    }

    return (
        <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto"
            onScroll={handleScroll}
        >
            {/* 简化的列表渲染 - 暂时不使用虚拟滚动来测试懒加载 */}
            {chats.map((chat, index) => (
                <ConversationItem
                    key={chat.id}
                    chat={chat}
                    onDeleteClick={onDeleteClick}
                    showDeleteConfirm={showDeleteConfirm}
                    onConfirmDelete={onConfirmDelete}
                    onCancelDelete={onCancelDelete}
                />
            ))}

            {/* 底部加载指示器 */}
            <LoadingIndicator />
        </div>
    );
}

export default VirtualizedConversationList;