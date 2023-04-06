const { readdirSync, lstatSync } = require('fs');
const { join, delimiter } = require('path');

/**
 * Пути до шаблонов для файлов в папках
 * @param {String} templatesDirectoryPath
 * @param {String} directoryName
 * @param {Object} result
 * @returns {Object}
 * @module getTemplates
 */
module.exports = function getDirTemplates(templatesDirectoryPath, directoryName, result) {
    const directoryPath = join(templatesDirectoryPath, directoryName);

    return readdirSync(directoryPath).reduce((result, fileName) => {
        const fullPath = join(directoryPath, fileName);

        if (lstatSync(fullPath).isDirectory()) {
            return getDirTemplates(templatesDirectoryPath, join(directoryName, fileName), result);
        }

        result[`${directoryName.replace(new RegExp(delimiter, 'g'), '/')}/${fileName}`] = {
            block: fullPath,
        };

        return result;
    }, result);
};
