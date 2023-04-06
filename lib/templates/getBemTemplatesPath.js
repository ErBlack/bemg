const { join } = require('path');

const TEMPLATE_REGEXP = /template_(\w+)\.(.+)/;

/**
 * Пути до шаблонов для bem файлов
 * @param {String} templatesDirectoryPath
 * @returns {Object}
 * @module getTemplates
 */
module.exports = function getBemTemplatesPath(templatesDirectoryPath, templateFileName, result) {
    if (templateFileName.match(TEMPLATE_REGEXP)) {
        const [, templateType, fileType] = TEMPLATE_REGEXP.exec(templateFileName) || [];

        if (templateType && fileType) {
            result[fileType] = Object.assign(result[fileType] || {}, {
                [templateType]: join(templatesDirectoryPath, templateFileName),
            });
        }
    }

    return result;
};
