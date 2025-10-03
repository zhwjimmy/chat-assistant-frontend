import { useState, useEffect } from 'react'
import { mockChats } from '../data/mockData'

function DebugInfo() {
  const [localStorageData, setLocalStorageData] = useState(null)
  const [mockData, setMockData] = useState(null)

  useEffect(() => {
    // 检查 localStorage 中的数据
    const savedChats = localStorage.getItem('chats')
    setLocalStorageData(savedChats ? JSON.parse(savedChats) : null)
    
    // 显示 mock 数据
    setMockData(mockChats)
  }, [])

  const clearLocalStorage = () => {
    localStorage.removeItem('chats')
    setLocalStorageData(null)
    window.location.reload()
  }

  const loadMockData = () => {
    localStorage.setItem('chats', JSON.stringify(mockChats))
    setLocalStorageData(mockChats)
    window.location.reload()
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-md">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">调试信息</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>LocalStorage 数据:</strong>
          <div className="text-gray-600 dark:text-gray-400">
            {localStorageData ? `${localStorageData.length} 个聊天` : '无数据'}
          </div>
        </div>
        
        <div>
          <strong>Mock 数据:</strong>
          <div className="text-gray-600 dark:text-gray-400">
            {mockData ? `${mockData.length} 个聊天` : '无数据'}
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={clearLocalStorage}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            清除数据
          </button>
          <button
            onClick={loadMockData}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            加载 Mock
          </button>
        </div>
      </div>
    </div>
  )
}

export default DebugInfo
