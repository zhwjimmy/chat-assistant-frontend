import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ChatPage from './pages/ChatPage'
import SettingsPage from './pages/SettingsPage'
import DebugInfo from './components/DebugInfo'

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ChatPage />} />
                    <Route path="chat/:chatId?" element={<ChatPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
            {/* 开发环境调试组件 */}
            {process.env.NODE_ENV === 'development' && <DebugInfo />}
        </div>
    )
}

export default App
