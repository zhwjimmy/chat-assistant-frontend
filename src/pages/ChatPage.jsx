import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ChatWindow from '../components/ChatWindow'
import InputBox from '../components/InputBox'
import { conversationService, messageService } from '../services'
import { adaptConversationResponse, adaptMessageList } from '../utils/adapters'
import { useApi } from '../hooks/useApi'
import { STORAGE_KEYS } from '../utils/constants'

function ChatPage() {
    const { chatId } = useParams()
    const [currentChat, setCurrentChat] = useState(null)
    const [chats, setChats] = useState([])
    const messagesEndRef = useRef(null)
    const { loading, error, execute } = useApi()

    // 加载对话详情和消息
    const loadConversation = async (conversationId) => {
        try {
            // 加载对话详情
            const conversationResponse = await execute(
                () => conversationService.getConversation(conversationId),
                { loadingMessage: '正在加载对话...' }
            );

            const adaptedConversation = adaptConversationResponse(conversationResponse);
            if (adaptedConversation.success && adaptedConversation.data) {
                const conversation = adaptedConversation.data;

                // 加载对话中的消息
                const messagesResponse = await execute(
                    () => conversationService.getConversationMessages(conversationId),
                    { loadingMessage: '正在加载消息...' }
                );

                const adaptedMessages = adaptMessageList(messagesResponse);
                if (adaptedMessages.success && adaptedMessages.data) {
                    conversation.messages = adaptedMessages.data.messages;
                }

                setCurrentChat(conversation);
            }
        } catch (err) {
            // 如果 API 失败，尝试从本地存储加载
            const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
            if (savedChats) {
                const parsedChats = JSON.parse(savedChats);
                const chat = parsedChats.find(c => c.id === conversationId);
                if (chat) {
                    setCurrentChat(chat);
                }
            }
        }
    };

    // 初始化加载
    useEffect(() => {
        if (chatId) {
            loadConversation(chatId);
        } else {
            // 如果没有指定 chatId，尝试从本地存储加载最新对话
            const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
            if (savedChats) {
                const parsedChats = JSON.parse(savedChats);
                if (parsedChats.length > 0) {
                    setCurrentChat(parsedChats[0]);
                }
            }
        }
    }, [chatId])

    // 创建新聊天（暂时禁用，因为后端不支持创建对话）
    const createNewChat = () => {
        // 创建新对话功能暂时不可用，因为后端 API 不支持创建对话
    }

    // 发送消息（暂时禁用，因为后端不支持发送消息）
    const sendMessage = async (content) => {
        // 发送消息功能暂时不可用，因为后端 API 不支持发送消息
        alert('发送消息功能暂时不可用，因为后端 API 不支持发送消息');
    }


    // 滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [currentChat?.messages])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                        正在加载对话...
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-red-500 dark:text-red-400 mb-4">
                        加载失败: {error}
                    </div>
                    <button
                        onClick={() => chatId && loadConversation(chatId)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        重试
                    </button>
                </div>
            </div>
        )
    }

    if (!currentChat) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                        未找到对话
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
