import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Settings, Moon, Sun, AlertCircle, Search, List, Tag, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useLazyConversations } from '../hooks/useLazyConversations'
import { STORAGE_KEYS } from '../utils/constants'
import VirtualizedConversationList from './VirtualizedConversationList'
import SearchModal from './SearchModal'

function Sidebar({ isOpen, onToggle }) {
    const [darkMode, setDarkMode] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    // 使用懒加载 Hook
    const {
        conversations: chats,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refresh,
        deleteConversation
    } = useLazyConversations()

    // 初始化深色模式
    useEffect(() => {
        const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
            document.documentElement.classList.toggle('dark', JSON.parse(savedDarkMode));
        }
    }, [])

    // 过滤聊天列表
    const filteredChats = useMemo(() => {
        if (!searchQuery.trim()) return chats;
        return chats.filter(chat =>
            chat.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [chats, searchQuery]);


    // 显示删除确认
    const showDeleteConfirmation = (chatId, e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowDeleteConfirm(chatId)
    }

    // 确认删除聊天
    const confirmDeleteChat = async (chatId) => {
        try {
            // 使用懒加载 Hook 的删除方法
            deleteConversation(chatId);

            // 如果删除的是当前聊天，跳转到首页
            if (location.pathname.includes(chatId)) {
                navigate('/')
            }
        } catch (err) {
            console.error('Error deleting conversation:', err);
        } finally {
            setShowDeleteConfirm(null)
        }
    }

    // 取消删除
    const cancelDelete = () => {
        setShowDeleteConfirm(null)
    }


    // 切换深色模式
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(newDarkMode))
        document.documentElement.classList.toggle('dark', newDarkMode)
    }

    // 打开搜索模态框
    const openSearchModal = () => {
        setShowSearchModal(true)
    }

    // 关闭搜索模态框
    const closeSearchModal = () => {
        setShowSearchModal(false)
    }

    // 选择搜索结果
    const handleSelectSearchResult = (conversation) => {
        navigate(`/chat/${conversation.id}`)
    }


    return (
        <div className="h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* 顶部区域：切换按钮和搜索 */}
            <div className="flex-shrink-0">
                {/* 切换按钮 */}
                <div className="px-4 py-2">
                    <button
                        onClick={onToggle}
                        className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${isOpen ? 'justify-end' : 'justify-center'}`}
                        title={isOpen ? '收起侧边栏' : '展开侧边栏'}
                    >
                        {isOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
                    </button>
                </div>

                {/* 搜索按钮 */}
                <div className="px-4 pt-2 pb-4">
                    <button
                        onClick={openSearchModal}
                        className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-200 dark:border-gray-600 ${isOpen ? 'gap-3' : 'justify-center'}`}
                        title={!isOpen ? '搜索对话' : ''}
                    >
                        <Search size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        {isOpen && <span className="text-sm text-gray-500 dark:text-gray-400">搜索对话...</span>}
                    </button>
                </div>
            </div>

            {/* 中间区域：聊天列表（仅在展开时显示） */}
            {isOpen && (
                <div className="flex-1 overflow-hidden">
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                正在加载对话列表...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-2 bg-red-50 dark:bg-red-900/20 rounded-lg mx-4">
                            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                            <div className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="h-full">
                            {filteredChats.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    {searchQuery ? '未找到匹配的对话' : '暂无对话记录'}
                                </div>
                            ) : (
                                <VirtualizedConversationList
                                    chats={filteredChats}
                                    onDeleteClick={showDeleteConfirmation}
                                    showDeleteConfirm={showDeleteConfirm}
                                    onConfirmDelete={confirmDeleteChat}
                                    onCancelDelete={cancelDelete}
                                    height={window.innerHeight - 200} // 动态高度
                                    loadingMore={loadingMore}
                                    hasMore={hasMore}
                                    onLoadMore={loadMore}
                                    error={error}
                                    onRetry={refresh}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 底部区域：设置按钮（始终显示在底部） */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                    {/* 对话列表页面链接 */}
                    <Link
                        to="/conversations"
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        title={!isOpen ? '对话列表' : ''}
                    >
                        <List size={16} className="flex-shrink-0" />
                        {isOpen && <span className="text-sm text-gray-700 dark:text-gray-300">对话列表</span>}
                    </Link>

                    {/* 标签列表页面链接 */}
                    <Link
                        to="/tags"
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        title={!isOpen ? '标签列表' : ''}
                    >
                        <Tag size={16} className="flex-shrink-0" />
                        {isOpen && <span className="text-sm text-gray-700 dark:text-gray-300">标签列表</span>}
                    </Link>

                    {/* 深色模式切换 */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        title={!isOpen ? (darkMode ? '浅色模式' : '深色模式') : ''}
                    >
                        {darkMode ? <Sun size={16} className="flex-shrink-0" /> : <Moon size={16} className="flex-shrink-0" />}
                        {isOpen && <span className="text-sm text-gray-700 dark:text-gray-300">
                            {darkMode ? '浅色模式' : '深色模式'}
                        </span>}
                    </button>

                    {/* 设置页面链接 */}
                    <Link
                        to="/settings"
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        title={!isOpen ? '设置' : ''}
                    >
                        <Settings size={16} className="flex-shrink-0" />
                        {isOpen && <span className="text-sm text-gray-700 dark:text-gray-300">设置</span>}
                    </Link>
                </div>
            </div>

            {/* 搜索模态框 */}
            <SearchModal
                isOpen={showSearchModal}
                onClose={closeSearchModal}
                onSelectConversation={handleSelectSearchResult}
            />
        </div>
    )
}

export default Sidebar
