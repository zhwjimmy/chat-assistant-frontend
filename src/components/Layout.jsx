import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useState } from 'react'

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            {/* 侧边栏 */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
                <Sidebar />
            </div>

            {/* 主内容区域 */}
            <div className="flex-1 flex flex-col">
                {/* 顶部导航栏 */}
                <Header
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                {/* 页面内容 */}
                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout
