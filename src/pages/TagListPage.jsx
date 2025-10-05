import { useState, useEffect } from 'react'
import { Tag, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { tagService } from '../services/tagService'

function TagListPage() {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingTag, setEditingTag] = useState(null)
    const [newTagName, setNewTagName] = useState('')
    const [editTagName, setEditTagName] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)

    // 加载标签列表
    const loadTags = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await tagService.getTags()
            if (response.success) {
                setTags(response.data.tags || [])
            } else {
                setError(response.error?.message || '加载标签失败')
            }
        } catch (err) {
            console.error('Error loading tags:', err)
            setError('加载标签失败，请稍后重试')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadTags()
    }, [])

    // 创建标签
    const handleCreateTag = async () => {
        if (!newTagName.trim()) return

        try {
            setActionLoading(true)
            const response = await tagService.createTag({ name: newTagName.trim() })
            if (response.success) {
                setNewTagName('')
                setShowCreateModal(false)
                await loadTags() // 重新加载列表
            } else {
                setError(response.error?.message || '创建标签失败')
            }
        } catch (err) {
            console.error('Error creating tag:', err)
            setError('创建标签失败，请稍后重试')
        } finally {
            setActionLoading(false)
        }
    }

    // 编辑标签
    const handleEditTag = async () => {
        if (!editTagName.trim() || !editingTag) return

        try {
            setActionLoading(true)
            const response = await tagService.updateTag(editingTag.id, { name: editTagName.trim() })
            if (response.success) {
                setEditTagName('')
                setEditingTag(null)
                setShowEditModal(false)
                await loadTags() // 重新加载列表
            } else {
                setError(response.error?.message || '更新标签失败')
            }
        } catch (err) {
            console.error('Error updating tag:', err)
            setError('更新标签失败，请稍后重试')
        } finally {
            setActionLoading(false)
        }
    }

    // 删除标签
    const handleDeleteTag = async (tagId) => {
        try {
            setActionLoading(true)
            const response = await tagService.deleteTag(tagId)
            if (response.success) {
                setShowDeleteConfirm(null)
                await loadTags() // 重新加载列表
            } else {
                setError(response.error?.message || '删除标签失败')
            }
        } catch (err) {
            console.error('Error deleting tag:', err)
            setError('删除标签失败，请稍后重试')
        } finally {
            setActionLoading(false)
        }
    }

    // 打开编辑模态框
    const openEditModal = (tag) => {
        setEditingTag(tag)
        setEditTagName(tag.name)
        setShowEditModal(true)
    }

    // 关闭模态框
    const closeModals = () => {
        setShowCreateModal(false)
        setShowEditModal(false)
        setEditingTag(null)
        setNewTagName('')
        setEditTagName('')
        setError(null)
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            {/* 页面头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">标签管理</h1>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    <Plus size={16} />
                    新建标签
                </button>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="mx-6 mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                </div>
            )}

            {/* 标签列表 */}
            <div className="flex-1 overflow-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-500 dark:text-gray-400">正在加载标签列表...</div>
                    </div>
                ) : tags.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                        <Tag size={48} className="mb-4 opacity-50" />
                        <p className="text-lg mb-2">暂无标签</p>
                        <p className="text-sm">点击"新建标签"按钮创建第一个标签</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                                        {tag.name}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => openEditModal(tag)}
                                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                                            title="编辑标签"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(tag.id)}
                                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                                            title="删除标签"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 创建标签模态框 */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">新建标签</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                标签名称
                            </label>
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="请输入标签名称"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeModals}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                                disabled={actionLoading}
                            >
                                取消
                            </button>
                            <button
                                onClick={handleCreateTag}
                                disabled={!newTagName.trim() || actionLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {actionLoading ? '创建中...' : '创建'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 编辑标签模态框 */}
            {showEditModal && editingTag && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">编辑标签</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                标签名称
                            </label>
                            <input
                                type="text"
                                value={editTagName}
                                onChange={(e) => setEditTagName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="请输入标签名称"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeModals}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                                disabled={actionLoading}
                            >
                                取消
                            </button>
                            <button
                                onClick={handleEditTag}
                                disabled={!editTagName.trim() || actionLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {actionLoading ? '保存中...' : '保存'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 删除确认模态框 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">确认删除</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            确定要删除这个标签吗？此操作不可撤销。
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                                disabled={actionLoading}
                            >
                                取消
                            </button>
                            <button
                                onClick={() => handleDeleteTag(showDeleteConfirm)}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {actionLoading ? '删除中...' : '删除'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TagListPage
