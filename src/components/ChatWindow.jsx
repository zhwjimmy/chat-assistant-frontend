import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { User, Bot, Copy, Check } from 'lucide-react'
import { useState } from 'react'

function ChatWindow({ messages }) {
    const [copiedMessageId, setCopiedMessageId] = useState(null)

    // 复制消息内容
    const copyMessage = async (content, messageId) => {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedMessageId(messageId)
            setTimeout(() => setCopiedMessageId(null), 2000)
        } catch (err) {
            console.error('复制失败:', err)
        }
    }

    // 格式化时间
    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        开始新的对话
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        在下方输入框中输入您的问题，开始与 AI 助手对话
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    {/* AI 头像 */}
                    {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <Bot size={16} className="text-primary-600 dark:text-primary-400" />
                        </div>
                    )}

                    {/* 消息内容 */}
                    <div className={`max-w-3xl ${message.role === 'user' ? 'order-first' : ''}`}>
                        <div
                            className={`message-bubble ${message.role === 'user' ? 'message-user' : 'message-ai'
                                }`}
                        >
                            {message.role === 'assistant' ? (
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
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
                                                    <div className="overflow-x-auto">
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
                            ) : (
                                <div className="whitespace-pre-wrap">{message.content}</div>
                            )}
                        </div>

                        {/* 消息时间戳和操作按钮 */}
                        <div className={`flex items-center gap-2 mt-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(message.timestamp)}
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

                    {/* 用户头像 */}
                    {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <User size={16} className="text-gray-600 dark:text-gray-400" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ChatWindow
