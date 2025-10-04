// 高亮工具函数
import React from 'react';

/**
 * 基于匹配字段和查询关键词进行高亮
 * @param {string} text - 要高亮的文本
 * @param {string[]} matchedFields - 匹配的字段信息
 * @param {string} query - 搜索查询
 * @param {string} className - 高亮样式类名
 * @returns {JSX.Element[]} 高亮后的文本片段
 */
export const highlightWithMatchedFields = (text, matchedFields = [], query = '', className = 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded') => {
    if (!text || !query.trim()) return text;

    // 解析查询关键词（支持多个关键词）
    const keywords = parseKeywords(query);

    // 使用简单的高亮方式，但支持多关键词
    return highlightMultipleKeywords(text, keywords, className);
};

/**
 * 多关键词高亮
 * @param {string} text - 要高亮的文本
 * @param {string[]} keywords - 关键词数组
 * @param {string} className - 高亮样式类名
 * @returns {JSX.Element[]} 高亮后的文本片段
 */
export const highlightMultipleKeywords = (text, keywords, className = 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded') => {
    if (!text || !keywords || keywords.length === 0) return text;

    // 创建所有关键词的正则表达式
    const regexPattern = keywords.map(keyword => escapeRegExp(keyword)).join('|');
    const regex = new RegExp(`(${regexPattern})`, 'gi');

    // 分割文本
    const parts = text.split(regex);

    return parts.map((part, index) => {
        // 检查这个部分是否是关键词
        const isKeyword = keywords.some(keyword =>
            part.toLowerCase() === keyword.toLowerCase()
        );

        if (isKeyword) {
            return React.createElement('mark', {
                key: index,
                className: className
            }, part);
        }
        return part;
    });
};

/**
 * 简单的高亮方式（用于向后兼容）
 * @param {string} text - 要高亮的文本
 * @param {string} query - 搜索查询
 * @param {string} className - 高亮样式类名
 * @returns {JSX.Element[]} 高亮后的文本片段
 */
export const highlightSimple = (text, query, className = 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded') => {
    if (!text || !query.trim()) return text;

    const keywords = parseKeywords(query);
    return highlightMultipleKeywords(text, keywords, className);
};

/**
 * 解析查询关键词（支持空格分隔的多个关键词）
 * @param {string} query - 搜索查询
 * @returns {string[]} 关键词数组
 */
export const parseKeywords = (query) => {
    if (!query || !query.trim()) return [];

    return query.trim()
        .split(/\s+/)
        .filter(keyword => keyword.length > 0)
        .map(keyword => keyword.trim());
};

/**
 * 转义正则表达式特殊字符
 * @param {string} string - 要转义的字符串
 * @returns {string} 转义后的字符串
 */
export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * 生成消息摘要
 * @param {string} content - 消息内容
 * @param {string[]} matchedFields - 匹配字段
 * @param {string} query - 搜索查询
 * @param {number} maxLength - 最大长度
 * @returns {string} 摘要文本
 */
export const generateMessageSummary = (content, matchedFields = [], query = '', maxLength = 150) => {
    if (!content) return '';

    // 如果内容较短，直接返回
    if (content.length <= maxLength) {
        return content;
    }

    // 如果有匹配字段信息，尝试找到包含关键词的片段
    if (matchedFields.length > 0 && query.trim()) {
        const keywords = parseKeywords(query);
        const lowerContent = content.toLowerCase();

        // 查找包含关键词的位置
        for (const keyword of keywords) {
            const index = lowerContent.indexOf(keyword.toLowerCase());
            if (index !== -1) {
                // 以关键词为中心提取摘要
                const start = Math.max(0, index - maxLength / 2);
                const end = Math.min(content.length, start + maxLength);

                let summary = content.substring(start, end);

                // 确保摘要以完整单词开始和结束
                if (start > 0) {
                    const firstSpace = summary.indexOf(' ');
                    if (firstSpace > 0) {
                        summary = '...' + summary.substring(firstSpace + 1);
                    }
                }

                if (end < content.length) {
                    const lastSpace = summary.lastIndexOf(' ');
                    if (lastSpace > 0) {
                        summary = summary.substring(0, lastSpace) + '...';
                    }
                }

                return summary;
            }
        }
    }

    // 如果没有找到关键词或没有匹配字段，返回开头部分
    return content.substring(0, maxLength) + '...';
};

/**
 * 检查文本是否包含关键词
 * @param {string} text - 要检查的文本
 * @param {string} query - 搜索查询
 * @returns {boolean} 是否包含关键词
 */
export const containsKeywords = (text, query) => {
    if (!text || !query.trim()) return false;

    const keywords = parseKeywords(query);
    const lowerText = text.toLowerCase();

    return keywords.some(keyword =>
        lowerText.includes(keyword.toLowerCase())
    );
};
