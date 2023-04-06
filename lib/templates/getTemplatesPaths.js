const { readdirSync, lstatSync } = require('fs');
const path = require('path');
const getBemTemplatesPath = require('./getBemTemplatesPath');
const getDirTemplatesPaths = require('./getDirTemplatesPaths');

/**
 * Структура шаблонов с путями до файлов
 * @param {String} templatesDirectoryPath
 * @returns {Object}
 * @module getTemplates
 */
module.exports = function getTemplatesPaths(templatesDirectoryPath) {
    return readdirSync(templatesDirectoryPath).reduce((result, templateFileName) => {
        const fullPath = path.join(templatesDirectoryPath, templateFileName);

        if (lstatSync(fullPath).isDirectory()) {
            return getDirTemplatesPaths(templatesDirectoryPath, templateFileName, result);
        }

        return getBemTemplatesPath(templatesDirectoryPath, templateFileName, result);
    }, {});
};
