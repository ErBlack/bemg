const { dirname, resolve } = require('path');
const { lstatSync } = require('fs');

/**
 * Возвращает абсолютный путь до папки
 * @param {String} targetPath
 * @returns {String}
 */
module.exports = function ensureDirectoryPath(targetPath) {
    const absolutePath = resolve(targetPath);
    const stats = lstatSync(absolutePath);

    return stats.isDirectory() ? absolutePath : dirname(absolutePath);
};
