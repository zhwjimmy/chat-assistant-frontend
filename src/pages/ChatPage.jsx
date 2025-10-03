import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ChatWindow from '../components/ChatWindow'
import InputBox from '../components/InputBox'
import { mockChats, simulateAIResponse } from '../data/mockData'

function ChatPage() {
    const { chatId } = useParams()
    const [currentChat, setCurrentChat] = useState(null)
    const [chats, setChats] = useState([])
    const messagesEndRef = useRef(null)

    // 从 localStorage 加载聊天记录，如果没有则使用 mock 数据
    useEffect(() => {
        const savedChats = localStorage.getItem('chats')
        if (savedChats) {
            const parsedChats = JSON.parse(savedChats)
            setChats(parsedChats)

            if (chatId) {
                const chat = parsedChats.find(c => c.id === chatId)
                setCurrentChat(chat || null)
            } else {
                // 如果没有指定 chatId，使用最新的聊天或创建新聊天
                if (parsedChats.length > 0) {
                    setCurrentChat(parsedChats[0])
                } else {
                    createNewChat()
                }
            }
        } else {
            // 如果没有保存的聊天记录，使用 mock 数据
            setChats(mockChats)
            localStorage.setItem('chats', JSON.stringify(mockChats))

            if (chatId) {
                const chat = mockChats.find(c => c.id === chatId)
                setCurrentChat(chat || null)
            } else {
                // 默认显示第一个 mock 聊天
                setCurrentChat(mockChats[0])
            }
        }
    }, [chatId])

    // 创建新聊天
    const createNewChat = () => {
        const newChat = {
            id: Date.now().toString(),
            title: '新对话',
            messages: [],
            createdAt: new Date().toISOString()
        }
        setCurrentChat(newChat)
        setChats([newChat])
        localStorage.setItem('chats', JSON.stringify([newChat]))
    }

    // 发送消息
    const sendMessage = async (content) => {
        if (!content.trim() || !currentChat) return

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString()
        }

        // 更新当前聊天
        const updatedMessages = [...currentChat.messages, userMessage]
        const updatedChat = {
            ...currentChat,
            messages: updatedMessages,
            title: currentChat.messages.length === 0 ? content.slice(0, 30) : currentChat.title
        }

        setCurrentChat(updatedChat)

        // 更新聊天列表
        const updatedChats = chats.map(chat =>
            chat.id === currentChat.id ? updatedChat : chat
        )
        setChats(updatedChats)
        localStorage.setItem('chats', JSON.stringify(updatedChats))

        // 模拟 AI 回复
        simulateAIResponse(content, 1000).then(aiResponse => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            }

            const finalMessages = [...updatedMessages, aiMessage]
            const finalChat = {
                ...updatedChat,
                messages: finalMessages
            }

            setCurrentChat(finalChat)

            const finalChats = chats.map(chat =>
                chat.id === currentChat.id ? finalChat : chat
            )
            setChats(finalChats)
            localStorage.setItem('chats', JSON.stringify(finalChats))
        })
    }


    // 滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [currentChat?.messages])

    if (!currentChat) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                        正在加载聊天...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* 聊天窗口 */}
            <div className="flex-1 overflow-hidden">
                <ChatWindow messages={currentChat.messages} />
                <div ref={messagesEndRef} />
            </div>

            {/* 输入框 */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <InputBox onSendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default ChatPage
