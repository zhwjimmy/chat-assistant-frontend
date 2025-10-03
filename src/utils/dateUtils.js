// 日期时间工具函数

/**
 * 将UTC时间转换为UTC+8时间并格式化为"月-日 时:分"
 * @param {string|Date} timestamp - UTC时间戳或日期对象
 * @returns {string} 格式化后的时间字符串，格式为"MM-DD HH:mm"
 */
export const formatTimeUTC8 = (timestamp) => {
    const date = new Date(timestamp)

    // 转换为UTC+8时间
    const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000)

    // 格式化为"月-日 时:分"
    const month = String(utc8Date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(utc8Date.getUTCDate()).padStart(2, '0')
    const hour = String(utc8Date.getUTCHours()).padStart(2, '0')
    const minute = String(utc8Date.getUTCMinutes()).padStart(2, '0')

    return `${month}/${day} ${hour}:${minute}`
}

/**
 * 将UTC时间转换为UTC+8时间并格式化为完整日期时间
 * @param {string|Date} timestamp - UTC时间戳或日期对象
 * @returns {string} 格式化后的完整日期时间字符串
 */
export const formatFullDateTimeUTC8 = (timestamp) => {
    const date = new Date(timestamp)

    // 转换为UTC+8时间
    const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000)

    // 格式化为"YYYY-MM-DD HH:mm:ss"
    const year = utc8Date.getUTCFullYear()
    const month = String(utc8Date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(utc8Date.getUTCDate()).padStart(2, '0')
    const hour = String(utc8Date.getUTCHours()).padStart(2, '0')
    const minute = String(utc8Date.getUTCMinutes()).padStart(2, '0')
    const second = String(utc8Date.getUTCSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

/**
 * 将UTC时间转换为UTC+8时间并格式化为相对时间
 * @param {string|Date} timestamp - UTC时间戳或日期对象
 * @returns {string} 相对时间字符串（如"刚刚"、"5分钟前"等）
 */
export const formatRelativeTimeUTC8 = (timestamp) => {
    const date = new Date(timestamp)
    const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000)
    const now = new Date()
    const nowUTC8 = new Date(now.getTime() + 8 * 60 * 60 * 1000)

    const diffMs = nowUTC8.getTime() - utc8Date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) {
        return '刚刚'
    } else if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`
    } else if (diffHours < 24) {
        return `${diffHours}小时前`
    } else if (diffDays < 7) {
        return `${diffDays}天前`
    } else {
        return formatTimeUTC8(timestamp)
    }
}
