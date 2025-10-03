import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Settings, Moon, Sun, Trash2, AlertCircle } from 'lucide-react'
import { conversationService } from '../services'
import { adaptConversationList } from '../utils/adapters'
import { useApi } from '../hooks/useApi'
import { FIXED_USER_ID, STORAGE_KEYS } from '../utils/constants'

function Sidebar() {
    const [chats, setChats] = useState([])
    const [darkMode, setDarkMode] = useState(false)
    const navigate = useNavigate()
    const { loading, error, execute } = useApi()

    // 加载对话列表
    const loadConversations = async () => {
        try {
            const response = await execute(
                () => conversationService.getConversations(FIXED_USER_ID),
                { loadingMessage: '正在加载对话列表...' }
            );

            const adaptedResponse = adaptConversationList(response);
            if (adaptedResponse.success && adaptedResponse.data) {
                setChats(adaptedResponse.data.conversations);
            }
        } catch (err) {
            // 如果 API 失败，尝试从本地存储加载
            const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
            if (savedChats) {
                setChats(JSON.parse(savedChats));
            }
        }
    };

    // 初始化加载
    useEffect(() => {
        loadConversations();

        const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode));
            document.documentElement.classList.toggle('dark', JSON.parse(savedDarkMode));
        }
    }, [])

    // 新建聊天（暂时禁用）
    const createNewChat = () => {
        alert('创建新对话功能暂时不可用，因为后端 API 不支持创建对话');
    }

    // 删除聊天
    const deleteChat = async (chatId, e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            await execute(
                () => conversationService.deleteConversation(chatId),
                { loadingMessage: '正在删除对话...' }
            );

            // 删除成功后更新本地状态
            const updatedChats = chats.filter(chat => chat.id !== chatId)
            setChats(updatedChats)
            localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(updatedChats))

            // 如果删除的是当前聊天，跳转到首页
            if (window.location.pathname.includes(chatId)) {
                navigate('/')
            }
        } catch (err) {
            // 即使 API 失败，也更新本地状态（乐观更新）
            const updatedChats = chats.filter(chat => chat.id !== chatId)
            setChats(updatedChats)
            localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(updatedChats))
        }
    }

    // 切换深色模式
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(newDarkMode))
        document.documentElement.classList.toggle('dark', newDarkMode)
    }


    return (
        <div className="h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* 新建聊天按钮 */}
            <div className="p-4">
                <button
                    onClick={createNewChat}
                    className="w-full btn-primary flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                    disabled={true}
                >
                    <Plus size={20} />
                    新建对话（不可用）
                </button>
            </div>

            {/* 聊天列表 */}
            <div className="flex-1 overflow-y-auto px-4">
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            正在加载对话列表...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-3 mb-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                        <div className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {chats.map((chat) => (
                        <Link
                            key={chat.id}
                            to={`/chat/${chat.id}`}
                            className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <div className="min-w-0 flex-1">
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                    {chat.title}
                                </span>
                            </div>
                            <button
                                onClick={(e) => deleteChat(chat.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all duration-200"
                            >
                                <Trash2 size={14} className="text-red-500" />
                            </button>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 底部设置 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">

                    {/* 深色模式切换 */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {darkMode ? '浅色模式' : '深色模式'}
                        </span>
                    </button>


                    {/* 设置页面链接 */}
                    <Link
                        to="/settings"
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <Settings size={16} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">设置</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
