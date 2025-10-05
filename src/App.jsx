import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'
import ConversationListPage from './pages/ConversationListPage'

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ChatPage />} />
                    <Route path="chat/:chatId?" element={<ChatPage />} />
                    <Route path="conversations" element={<ConversationListPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
