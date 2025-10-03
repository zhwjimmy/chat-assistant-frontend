import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MessageSquare, Settings, Moon, Sun, Trash2 } from 'lucide-react'
import { mockChats } from '../data/mockData'

function Sidebar() {
    const [chats, setChats] = useState([])
    const [darkMode, setDarkMode] = useState(false)
    const navigate = useNavigate()

    // 从 localStorage 加载聊天记录，如果没有则使用 mock 数据
    useEffect(() => {
        const savedChats = localStorage.getItem('chats')
        if (savedChats) {
            const parsedChats = JSON.parse(savedChats)
            // 如果本地存储的聊天记录为空，则使用 mock 数据
            if (parsedChats.length === 0) {
                setChats(mockChats)
                localStorage.setItem('chats', JSON.stringify(mockChats))
            } else {
                setChats(parsedChats)
            }
        } else {
            // 首次加载时使用 mock 数据
            setChats(mockChats)
            localStorage.setItem('chats', JSON.stringify(mockChats))
        }

        const savedDarkMode = localStorage.getItem('darkMode')
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode))
            document.documentElement.classList.toggle('dark', JSON.parse(savedDarkMode))
        }
    }, [])

    // 新建聊天
    const createNewChat = () => {
        const newChat = {
            id: Date.now().toString(),
            title: '新对话',
            messages: [],
            createdAt: new Date().toISOString()
        }
        const updatedChats = [newChat, ...chats]
        setChats(updatedChats)
        localStorage.setItem('chats', JSON.stringify(updatedChats))
        navigate(`/chat/${newChat.id}`)
    }

    // 删除聊天
    const deleteChat = (chatId, e) => {
        e.preventDefault()
        e.stopPropagation()
        const updatedChats = chats.filter(chat => chat.id !== chatId)
        setChats(updatedChats)
        localStorage.setItem('chats', JSON.stringify(updatedChats))

        // 如果删除的是当前聊天，跳转到首页
        if (window.location.pathname.includes(chatId)) {
            navigate('/')
        }
    }

    // 切换深色模式
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
        document.documentElement.classList.toggle('dark', newDarkMode)
    }

    // 加载示例数据
    const loadSampleData = () => {
        if (confirm('确定要加载示例数据吗？这将替换当前的聊天记录。')) {
            setChats(mockChats)
            localStorage.setItem('chats', JSON.stringify(mockChats))
            navigate('/')
        }
    }

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* 新建聊天按钮 */}
            <div className="p-4">
                <button
                    onClick={createNewChat}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    新建对话
                </button>
            </div>

            {/* 聊天列表 */}
            <div className="flex-1 overflow-y-auto px-4">
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
                    {/* 加载示例数据 */}
                    <button
                        onClick={loadSampleData}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <MessageSquare size={16} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">加载示例数据</span>
                    </button>

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
