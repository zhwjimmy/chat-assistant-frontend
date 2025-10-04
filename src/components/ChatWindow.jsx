import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { User, Bot, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { formatTimeUTC8 } from '../utils/dateUtils'

function ChatWindow({ messages, messagesEndRef }) {
    const [copiedMessageId, setCopiedMessageId] = useState(null)

    // 复制消息内容
    const copyMessage = async (content, messageId) => {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedMessageId(messageId)
            setTimeout(() => setCopiedMessageId(null), 2000)
        } catch (err) {
            // 复制失败，静默处理
        }
    }

    // 自动滚动逻辑已移至父组件 ChatPage


    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        暂无消息
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        此对话暂无消息记录
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full overflow-auto p-6">
            <div className="space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`transition-opacity duration-300 ${message.role === 'user' ? 'flex justify-end' : 'w-full flex justify-center'}`}
                        aria-label={`${message.role === 'user' ? '用户' : 'AI助手'}消息`}
                    >
                        {message.role === 'user' ? (
                            // 用户消息布局
                            <div className="max-w-[70%] ml-auto flex items-end">
                                <div className="flex flex-col items-end">
                                    <div className="inline-block px-4 py-2 rounded-2xl rounded-br-md bg-indigo-600 text-white break-words whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-300 ml-2">
                                            {formatTimeUTC8(message.timestamp)}
                                        </span>
                                        <button
                                            onClick={() => copyMessage(message.content, message.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200"
                                            title="复制消息"
                                        >
                                            {copiedMessageId === message.id ? (
                                                <Check size={12} className="text-green-500" />
                                            ) : (
                                                <Copy size={12} className="text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ml-2">
                                    <User size={14} className="text-gray-600 dark:text-gray-400" />
                                </div>
                            </div>
                        ) : (
                            // AI 消息布局
                            <div className="max-w-[68%] prose prose-sm">
                                <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <pre className="px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-sm overflow-auto">
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    </pre>
                                                ) : (
                                                    <code className="bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-1 py-0.5 rounded text-sm" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            table({ children }) {
                                                return (
                                                    <div className="table-auto overflow-auto">
                                                        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                                                            {children}
                                                        </table>
                                                    </div>
                                                )
                                            },
                                            th({ children }) {
                                                return (
                                                    <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left">
                                                        {children}
                                                    </th>
                                                )
                                            },
                                            td({ children }) {
                                                return (
                                                    <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                                                        {children}
                                                    </td>
                                                )
                                            }
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTimeUTC8(message.timestamp)}
                                    </span>
                                    <button
                                        onClick={() => copyMessage(message.content, message.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200"
                                        title="复制消息"
                                    >
                                        {copiedMessageId === message.id ? (
                                            <Check size={12} className="text-green-500" />
                                        ) : (
                                            <Copy size={12} className="text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}

export default ChatWindow
