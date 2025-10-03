import { useState, useEffect } from 'react'
import { Moon, Sun, Save, RotateCcw } from 'lucide-react'

function SettingsPage() {
    const [darkMode, setDarkMode] = useState(false)
    const [autoSave, setAutoSave] = useState(true)
    const [fontSize, setFontSize] = useState('medium')
    const [language, setLanguage] = useState('zh-CN')

    // 从 localStorage 加载设置
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode')
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode))
        }

        const savedAutoSave = localStorage.getItem('autoSave')
        if (savedAutoSave) {
            setAutoSave(JSON.parse(savedAutoSave))
        }

        const savedFontSize = localStorage.getItem('fontSize')
        if (savedFontSize) {
            setFontSize(savedFontSize)
        }

        const savedLanguage = localStorage.getItem('language')
        if (savedLanguage) {
            setLanguage(savedLanguage)
        }
    }, [])

    // 保存设置
    const saveSettings = () => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
        localStorage.setItem('autoSave', JSON.stringify(autoSave))
        localStorage.setItem('fontSize', fontSize)
        localStorage.setItem('language', language)

        // 应用深色模式
        document.documentElement.classList.toggle('dark', darkMode)

        alert('设置已保存！')
    }

    // 重置设置
    const resetSettings = () => {
        if (confirm('确定要重置所有设置吗？')) {
            setDarkMode(false)
            setAutoSave(true)
            setFontSize('medium')
            setLanguage('zh-CN')

            localStorage.removeItem('darkMode')
            localStorage.removeItem('autoSave')
            localStorage.removeItem('fontSize')
            localStorage.removeItem('language')

            document.documentElement.classList.remove('dark')

            alert('设置已重置！')
        }
    }

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                    设置
                </h1>

                <div className="space-y-8">
                    {/* 外观设置 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            外观设置
                        </h2>

                        <div className="space-y-4">
                            {/* 深色模式 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                                    <span className="text-gray-700 dark:text-gray-300">
                                        深色模式
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={darkMode}
                                        onChange={(e) => setDarkMode(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                </label>
                            </div>

                            {/* 字体大小 */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300">
                                    字体大小
                                </span>
                                <select
                                    value={fontSize}
                                    onChange={(e) => setFontSize(e.target.value)}
                                    className="input-field w-32"
                                >
                                    <option value="small">小</option>
                                    <option value="medium">中</option>
                                    <option value="large">大</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 功能设置 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            功能设置
                        </h2>

                        <div className="space-y-4">
                            {/* 自动保存 */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300">
                                    自动保存聊天记录
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoSave}
                                        onChange={(e) => setAutoSave(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                </label>
                            </div>

                            {/* 语言设置 */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 dark:text-gray-300">
                                    界面语言
                                </span>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="input-field w-32"
                                >
                                    <option value="zh-CN">简体中文</option>
                                    <option value="en-US">English</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-4">
                        <button
                            onClick={saveSettings}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save size={16} />
                            保存设置
                        </button>

                        <button
                            onClick={resetSettings}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            重置设置
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
