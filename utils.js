/**
 * 随机打乱数组
 * @param {Array} array 需要打乱的数组
 * @returns {Array} 打乱后的新数组
 */
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * 创建一对卡片
 * @param {string|number} value 卡片值
 * @param {number} index 索引
 * @returns {Array} 包含两个卡片对象的数组
 */
function createPair(value, index) {
    return [
        { id: index * 2, value, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, value, isFlipped: false, isMatched: false }
    ];
}

/**
 * 格式化时间（秒）为分:秒格式
 * @param {number} seconds 秒数
 * @returns {string} 格式化后的时间
 */
function formatTime(seconds) {
    return seconds;
} 