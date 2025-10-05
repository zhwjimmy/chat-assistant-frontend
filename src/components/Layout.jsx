import { Outlet, useLocation, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useState, useEffect } from 'react'
import { conversationService } from '../services'
import { adaptConversationResponse } from '../utils/adapters'

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [headerTitle, setHeaderTitle] = useState("对话标题")
    const location = useLocation()
    const params = useParams()

    // 根据当前路由设置标题
    useEffect(() => {
        const updateTitle = async () => {
            if (location.pathname === '/conversations') {
                setHeaderTitle("对话列表")
            } else if (params.chatId) {
                // 如果是对话页面，获取对话标题
                try {
                    const response = await conversationService.getConversation(params.chatId)
                    const adapted = adaptConversationResponse(response)
                    if (adapted.success && adapted.data) {
                        setHeaderTitle(adapted.data.title || "对话标题")
                    } else {
                        setHeaderTitle("对话标题")
                    }
                } catch (error) {
                    console.warn('Failed to load conversation title:', error)
                    setHeaderTitle("对话标题")
                }
            } else {
                setHeaderTitle("对话标题")
            }
        }

        updateTitle()
    }, [location.pathname, params.chatId])

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            {/* 侧边栏 */}
            <div className={`${sidebarOpen ? 'w-72 md:w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
                <Sidebar />
            </div>

            {/* 主内容区域 */}
            <div className="flex-1 flex flex-col">
                {/* 顶部导航栏 */}
                <Header
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    title={headerTitle}
                />

                {/* 页面内容 */}
                <main className="flex-1 min-h-0">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout
