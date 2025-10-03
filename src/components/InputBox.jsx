import { useState, useRef, useEffect } from 'react'
import { Send, Square } from 'lucide-react'

function InputBox({ onSendMessage }) {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const textareaRef = useRef(null)

    // 自动调整输入框高度
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [input])

    // 发送消息
    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        setIsLoading(true)
        await onSendMessage(input)
        setInput('')
        setIsLoading(false)
    }

    // 处理键盘事件
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // 处理输入变化
    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    return (
        <div className="relative">
            <div className="flex items-end gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-3 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                {/* 输入框 */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="输入您的问题... (Enter 发送，Shift+Enter 换行)"
                    className="flex-1 resize-none border-none outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-[24px] max-h-32"
                    rows={1}
                    disabled={isLoading}
                />

                {/* 发送按钮 */}
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`p-2 rounded-lg transition-colors duration-200 ${input.trim() && !isLoading
                            ? 'bg-primary-600 hover:bg-primary-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isLoading ? (
                        <Square size={20} />
                    ) : (
                        <Send size={20} />
                    )}
                </button>
            </div>

            {/* 提示文字 */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                {isLoading ? 'AI 正在思考中...' : '按 Enter 发送，Shift+Enter 换行'}
            </div>
        </div>
    )
}

export default InputBox
