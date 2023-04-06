const { basename, dirname } = require('path');

/**
 * Возвращает название bem сущности и путь до корня блока
 * @param {String} path
 * @param {[String, String, String]} delimiters
 */
module.exports = function getBemStringByPath(path, delimiters) {
    let currentEntityString = '';

    do {
        const slug = basename(path);
        currentEntityString = slug + currentEntityString;

        if (!delimiters.some((delimiter) => slug.includes(delimiter))) break;

        path = dirname(path);
    } while (path);

    return {
        currentEntityString,
        currentBlockRoot: path,
    };
};
