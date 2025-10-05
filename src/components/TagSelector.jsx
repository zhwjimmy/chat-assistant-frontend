import { useState, useEffect, useRef } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { TAG_STYLE } from '../utils/constants';
import { tagService } from '../services/tagService';

const TagSelector = ({
    isOpen,
    onClose,
    selectedTags = [],
    onSave,
    conversationId,
    loading = false,
    error = null
}) => {
    const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);
    const [availableTags, setAvailableTags] = useState([]);
    const [tagsLoading, setTagsLoading] = useState(false);
    const modalRef = useRef(null);

    // 当组件打开时，同步选中的标签并获取可用标签
    useEffect(() => {
        if (isOpen) {
            setLocalSelectedTags(selectedTags);
            fetchAvailableTags();
        }
    }, [isOpen, selectedTags]);

    // 获取可用标签列表
    const fetchAvailableTags = async () => {
        setTagsLoading(true);
        try {
            const response = await tagService.getTags();
            if (response.success) {
                setAvailableTags(response.data.tags || []);
            } else {
                console.error('获取标签列表失败:', response.error);
                // 如果API失败，使用mock数据作为后备
                setAvailableTags([]);
            }
        } catch (error) {
            console.error('获取标签列表时出错:', error);
            setAvailableTags([]);
        } finally {
            setTagsLoading(false);
        }
    };

    // 点击模态框外部关闭
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // 切换标签选择状态
    const toggleTag = (tag) => {
        setLocalSelectedTags(prev => {
            const isSelected = prev.some(selectedTag => selectedTag.id === tag.id);
            if (isSelected) {
                return prev.filter(selectedTag => selectedTag.id !== tag.id);
            } else {
                return [...prev, tag];
            }
        });
    };

    // 保存标签选择
    const handleSave = () => {
        onSave(conversationId, localSelectedTags);
        onClose();
    };

    // 取消选择
    const handleCancel = () => {
        setLocalSelectedTags(selectedTags); // 恢复到原始状态
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
            >
                {/* 头部 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        选择标签
                    </h3>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 内容区域 */}
                <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            点击标签进行选择或取消选择
                        </p>

                        {/* 错误提示 */}
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* 标签列表 */}
                        <div className="flex flex-wrap gap-2">
                            {tagsLoading ? (
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                                    加载标签中...
                                </div>
                            ) : availableTags.length > 0 ? (
                                availableTags.map((tag) => {
                                    const isSelected = localSelectedTags.some(selectedTag => selectedTag.id === tag.id);
                                    return (
                                        <button
                                            key={tag.id}
                                            onClick={() => toggleTag(tag)}
                                            className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isSelected
                                                ? `${TAG_STYLE} ring-2 ring-blue-500 ring-opacity-50`
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {tag.name}
                                            {isSelected && (
                                                <Check size={14} className="text-current" />
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    暂无可用标签
                                </div>
                            )}
                        </div>

                        {/* 当前选中标签预览 */}
                        {localSelectedTags.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    已选择标签 ({localSelectedTags.length}):
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {localSelectedTags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${TAG_STYLE}`}
                                        >
                                            {tag.name}
                                            <button
                                                onClick={() => toggleTag(tag)}
                                                className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                                            >
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 ${loading
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'text-white bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                保存中...
                            </>
                        ) : (
                            <>
                                <Check size={16} />
                                保存
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagSelector;
