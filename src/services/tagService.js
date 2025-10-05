import { apiRequest } from './api'

/**
 * 标签服务
 */
export const tagService = {
    /**
     * 获取所有标签
     * @returns {Promise<{success: boolean, data: {tags: Array}, error?: object}>}
     */
    async getTags() {
        try {
            const response = await apiRequest('/tags')
            return response
        } catch (error) {
            console.error('Error fetching tags:', error)
            throw error
        }
    },

    /**
     * 根据ID获取标签
     * @param {string} id - 标签ID
     * @returns {Promise<{success: boolean, data: {tag: object}, error?: object}>}
     */
    async getTagById(id) {
        try {
            const response = await apiRequest(`/tags/${id}`)
            return response
        } catch (error) {
            console.error('Error fetching tag:', error)
            throw error
        }
    },

    /**
     * 创建新标签
     * @param {object} tagData - 标签数据
     * @param {string} tagData.name - 标签名称
     * @returns {Promise<{success: boolean, data: {tag: object}, error?: object}>}
     */
    async createTag(tagData) {
        try {
            const response = await apiRequest('/tags', {
                method: 'POST',
                body: JSON.stringify(tagData)
            })
            return response
        } catch (error) {
            console.error('Error creating tag:', error)
            throw error
        }
    },

    /**
     * 更新标签
     * @param {string} id - 标签ID
     * @param {object} tagData - 标签数据
     * @param {string} tagData.name - 标签名称
     * @returns {Promise<{success: boolean, data: {tag: object}, error?: object}>}
     */
    async updateTag(id, tagData) {
        try {
            const response = await apiRequest(`/tags/${id}`, {
                method: 'PUT',
                body: JSON.stringify(tagData)
            })
            return response
        } catch (error) {
            console.error('Error updating tag:', error)
            throw error
        }
    },

    /**
     * 删除标签
     * @param {string} id - 标签ID
     * @returns {Promise<{success: boolean, error?: object}>}
     */
    async deleteTag(id) {
        try {
            const response = await apiRequest(`/tags/${id}`, {
                method: 'DELETE'
            })
            return response
        } catch (error) {
            console.error('Error deleting tag:', error)
            throw error
        }
    }
}
