import { Menu, X } from 'lucide-react'

function Header({ sidebarOpen, onToggleSidebar, title = "对话标题" }) {
    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
            <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h1>
            </div>
        </header>
    )
}

export default Header
