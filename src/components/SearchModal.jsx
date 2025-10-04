import { useState, useEffect, useRef } from 'react'
import { X, Search as SearchIcon, Clock, MessageSquare } from 'lucide-react'
import { searchService } from '../services'
import { FIXED_USER_ID } from '../utils/constants'
import { formatTimeUTC8 } from '../utils/dateUtils'
import { highlightWithMatchedFields, generateMessageSummary } from '../utils/highlightUtils'

function SearchModal({ isOpen, onClose, onSelectConversation }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [error, setError] = useState(null)
    const inputRef = useRef(null)
    const resultsRef = useRef(null)

    // 当模态框打开时，聚焦输入框
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    // 搜索功能
    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([])
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await searchService.searchConversations(searchQuery, FIXED_USER_ID)
            if (response.success && response.data) {
                setResults(response.data.conversations || [])
            } else {
                setResults([])
            }
        } catch (err) {
            console.error('Search error:', err)
            setError('搜索失败，请稍后重试')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    // 防抖搜索
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            performSearch(query)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query])

    // 键盘事件处理
    const handleKeyDown = (e) => {
        if (!isOpen) return

        switch (e.key) {
            case 'Escape':
                onClose()
                break
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    handleSelectResult(results[selectedIndex])
                }
                break
        }
    }

    // 选择搜索结果
    const handleSelectResult = (conversation) => {
        onSelectConversation(conversation)
        onClose()
    }

    // 高亮匹配文本（使用新的高亮工具）
    const highlightText = (text, matchedFields, query) => {
        return highlightWithMatchedFields(text, matchedFields, query)
    }

    // 获取首条消息摘要
    const getFirstMessageSummary = (conversation) => {
        if (!conversation.messages || conversation.messages.length === 0) {
            return null
        }

        const firstMessage = conversation.messages[0]
        return generateMessageSummary(
            firstMessage.sourceContent || firstMessage.content,
            firstMessage.matchedFields,
            query,
            120
        )
    }


    // 重置状态
    const handleClose = () => {
        setQuery('')
        setResults([])
        setSelectedIndex(-1)
        setError(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
            {/* 背景遮罩 */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={handleClose}
            />

            {/* 模态框内容 */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative flex-1">
                        <SearchIcon
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search conversations..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                    <button
                        onClick={handleClose}
                        className="ml-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* 结果区域 */}
                <div className="max-h-96 overflow-y-auto">
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                搜索中...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 text-center text-red-500 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {!loading && !error && query.trim() && results.length === 0 && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <SearchIcon size={48} className="mx-auto mb-4 opacity-30" />
                            <div className="text-lg font-medium mb-2">未找到相关对话</div>
                            <div className="text-sm space-y-1">
                                <div>尝试使用不同的关键词</div>
                                <div className="text-xs opacity-75">或检查拼写是否正确</div>
                            </div>
                        </div>
                    )}

                    {!loading && !error && results.length > 0 && (
                        <div ref={resultsRef} className="p-2">
                            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-2">
                                找到 {results.length} 个相关对话
                            </div>
                            {results.map((conversation, index) => (
                                <div
                                    key={conversation.id}
                                    onClick={() => handleSelectResult(conversation)}
                                    className={`flex flex-col px-4 py-3 cursor-pointer rounded-md transition-all duration-200 border-l-2 ${
                                        index === selectedIndex
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-indigo-500'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-600'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                {highlightText(conversation.title || 'Untitled', conversation.matchedFields, query)}
                                            </div>
                                            
                                            {/* 显示首条消息摘要 */}
                                            {getFirstMessageSummary(conversation) && (
                                                <div className="text-xs text-gray-600 dark:text-gray-300 mb-1 flex items-start">
                                                    <MessageSquare size={10} className="mr-1 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">
                                                        {highlightText(
                                                            getFirstMessageSummary(conversation),
                                                            conversation.messages[0]?.matchedFields,
                                                            query
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {conversation.provider} • {conversation.model}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 ml-2">
                                            <Clock size={12} className="mr-1" />
                                            {formatTimeUTC8(conversation.updatedAt || conversation.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !error && !query.trim() && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
                            <div className="text-lg font-medium mb-2">搜索对话</div>
                            <div className="text-sm space-y-2">
                                <div>输入关键词搜索对话标题和内容</div>
                                <div className="text-xs opacity-75 space-y-1">
                                    <div>💡 支持多关键词搜索，用空格分隔</div>
                                    <div>💡 可以搜索对话标题或消息内容</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchModal
