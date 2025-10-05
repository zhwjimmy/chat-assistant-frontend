import { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    Eye,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    AlertCircle,
    Loader2,
    Edit3
} from 'lucide-react';
import { useConversationList } from '../hooks/useConversationList';
import { formatDate } from '../utils/dateUtils';
import { TAG_STYLE } from '../utils/constants';
import TagSelector from '../components/TagSelector';
import { conversationService } from '../services/conversationService';

function ConversationListPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [tagSelectorOpen, setTagSelectorOpen] = useState(false);
    const [editingConversationId, setEditingConversationId] = useState(null);
    const [editingTags, setEditingTags] = useState([]);
    const [tagUpdateLoading, setTagUpdateLoading] = useState(false);
    const [tagUpdateError, setTagUpdateError] = useState(null);

    const {
        conversations,
        loading,
        error,
        pagination,
        filters,
        providerOptions,
        searchConversations,
        filterByProvider,
        filterByDateRange,
        changePage,
        changePageSize,
        resetFilters,
        updateFilters
    } = useConversationList();

    // 直接使用API返回的对话数据（已包含标签信息）
    const conversationsWithTags = conversations;

    // 打开标签选择器
    const handleEditTags = (conversationId, currentTags) => {
        setEditingConversationId(conversationId);
        setEditingTags(currentTags || []);
        setTagSelectorOpen(true);
    };

    // 保存标签修改
    const handleSaveTags = async (conversationId, newTags) => {
        setTagUpdateLoading(true);
        setTagUpdateError(null);

        try {
            // 转换标签格式为API要求的格式
            const tagsForApi = newTags.map(tag => ({
                id: tag.id,
                name: tag.name
            }));

            const response = await conversationService.updateConversationTags(conversationId, tagsForApi);

            if (response.success) {
                // 更新成功后，重新获取对话列表以刷新数据
                // 这里可以调用fetchConversations来刷新数据
                console.log('标签更新成功:', response);
                setTagSelectorOpen(false);
                setEditingConversationId(null);
                setEditingTags([]);

                // 可以添加成功提示
                // TODO: 添加成功提示组件
            } else {
                setTagUpdateError(response.error?.message || '更新标签失败');
            }
        } catch (error) {
            console.error('更新标签时出错:', error);
            setTagUpdateError(error.message || '网络错误，请稍后重试');
        } finally {
            setTagUpdateLoading(false);
        }
    };

    // 关闭标签选择器
    const handleCloseTagSelector = () => {
        setTagSelectorOpen(false);
        setEditingConversationId(null);
        setEditingTags([]);
    };

    // 处理搜索（包含筛选条件）
    const handleSearch = (e) => {
        e.preventDefault();
        // 更新筛选条件，包括搜索关键词和筛选参数
        updateFilters({
            search: searchInput,
            provider: filters.provider,
            start_date: dateRange.start,
            end_date: dateRange.end
        });
    };

    // 处理 provider 筛选
    const handleProviderChange = (provider) => {
        // 只更新本地状态，不触发搜索
        // 用户需要点击搜索按钮才会应用筛选
        filterByProvider(provider);
    };

    // 重置筛选条件
    const handleResetFilters = () => {
        setSearchInput('');
        setDateRange({ start: '', end: '' });
        resetFilters();
    };

    // 跳转到对话详情（新tab页打开）
    const handleViewConversation = (conversationId) => {
        window.open(`/chat/${conversationId}`, '_blank');
    };

    // 跳转到原始内容（新tab页打开）
    const handleViewOriginalContent = (sourceId) => {
        if (sourceId) {
            window.open(`https://claude.ai/chat/${sourceId}`, '_blank');
        }
    };

    // 分页处理
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            changePage(newPage);
        }
    };

    const handlePageSizeChange = (newSize) => {
        changePageSize(parseInt(newSize));
    };

    // 计算分页信息
    const paginationInfo = useMemo(() => {
        const start = (pagination.page - 1) * pagination.limit + 1;
        const end = Math.min(pagination.page * pagination.limit, pagination.total);
        return { start, end };
    }, [pagination]);

    // 生成页码数组
    const pageNumbers = useMemo(() => {
        const pages = [];
        const totalPages = pagination.total_pages;
        const currentPage = pagination.page;

        // 显示当前页前后各2页
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }, [pagination.page, pagination.total_pages]);

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            {/* 页面标题 */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    对话列表
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    管理和查看所有对话记录
                </p>
            </div>

            {/* 搜索和筛选区域 */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSearch} className="space-y-4">
                    {/* 搜索框 */}
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="搜索对话内容..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
                        >
                            <Filter size={16} />
                            {showFilters ? '隐藏筛选' : '显示筛选'}
                        </button>
                    </div>

                    {/* 筛选条件 */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            {/* Provider 筛选 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    来源
                                </label>
                                <select
                                    value={filters.provider}
                                    onChange={(e) => handleProviderChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">全部来源</option>
                                    {providerOptions.map((provider) => (
                                        <option key={provider} value={provider}>
                                            {provider}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 时间范围筛选 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    开始时间
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    结束时间
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={!searchInput.trim()}
                            className={`px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${searchInput.trim()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Search size={16} />
                            搜索
                        </button>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            重置
                        </button>
                    </div>
                </form>
            </div>

            {/* 表格区域 */}
            <div className="flex-1 overflow-hidden">
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Loader2 className="animate-spin" size={20} />
                            正在加载对话列表...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-4 m-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                        <div className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="h-full flex flex-col">
                        {/* 表格 */}
                        <div className="flex-1 overflow-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            标题
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            创建时间
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            标签
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            来源
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            原始内容
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {conversationsWithTags.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                暂无对话记录
                                            </td>
                                        </tr>
                                    ) : (
                                        conversationsWithTags.map((conversation) => (
                                            <tr
                                                key={conversation.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {conversation.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(conversation.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-wrap gap-1">
                                                            {conversation.tags && conversation.tags.length > 0 ? (
                                                                conversation.tags.map((tag) => (
                                                                    <span
                                                                        key={tag.id}
                                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${TAG_STYLE}`}
                                                                    >
                                                                        {tag.name}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-gray-400">-</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleEditTags(conversation.id, conversation.tags)}
                                                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-1"
                                                            title="编辑标签"
                                                        >
                                                            <Edit3 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {conversation.provider || '未知'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {conversation.source_id ? (
                                                        <button
                                                            onClick={() => handleViewOriginalContent(conversation.source_id)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1"
                                                        >
                                                            <ExternalLink size={16} />
                                                            查看原始内容
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleViewConversation(conversation.id)}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                                    >
                                                        <Eye size={16} />
                                                        查看详情
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 分页 */}
                        {conversationsWithTags.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    {/* 分页信息 */}
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            显示 {paginationInfo.start} - {paginationInfo.end} 条，共 {pagination.total} 条
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">每页</span>
                                            <select
                                                value={pagination.limit}
                                                onChange={(e) => handlePageSizeChange(e.target.value)}
                                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                            >
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                            </select>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">条</span>
                                        </div>
                                    </div>

                                    {/* 分页按钮 */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        {pageNumbers.map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-1 border rounded ${pageNum === pagination.page
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.total_pages}
                                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 标签选择器 */}
            <TagSelector
                isOpen={tagSelectorOpen}
                onClose={handleCloseTagSelector}
                selectedTags={editingTags}
                onSave={handleSaveTags}
                conversationId={editingConversationId}
                loading={tagUpdateLoading}
                error={tagUpdateError}
            />
        </div>
    );
}

export default ConversationListPage;
