// Mock标签数据
export const mockTags = [
    { id: '1', name: '工作', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: '学习', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '3', name: '编程', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '4', name: 'AI', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '5', name: '设计', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '6', name: '产品', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '7', name: '技术', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '8', name: '生活', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '9', name: '娱乐', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    { id: '10', name: '健康', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
];

// 为对话分配标签的函数
export const assignTagsToConversations = (conversations) => {
    return conversations.map((conversation, index) => {
        // 根据对话索引和内容随机分配标签
        const tagCount = Math.floor(Math.random() * 3) + 1; // 1-3个标签
        const assignedTags = [];

        // 确保每个对话都有不同的标签组合
        const usedTagIds = new Set();

        for (let i = 0; i < tagCount; i++) {
            let randomTag;
            do {
                randomTag = mockTags[Math.floor(Math.random() * mockTags.length)];
            } while (usedTagIds.has(randomTag.id));

            usedTagIds.add(randomTag.id);
            assignedTags.push(randomTag);
        }

        return {
            ...conversation,
            tags: assignedTags
        };
    });
};

// 标签颜色映射
export const tagColors = {
    '工作': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    '学习': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    '编程': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'AI': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    '设计': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    '产品': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    '技术': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    '生活': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    '娱乐': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    '健康': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
};

// 获取标签样式的函数
export const getTagStyle = (tagName) => {
    return tagColors[tagName] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};
