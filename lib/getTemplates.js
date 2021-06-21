const {readdirSync, readFileSync} = require('fs');
const path = require('path');
const template = require('lodash.template');

const TEMPLATE_REGEXP = /template_(\w+)\.(.+)/;

/**
 * Шаблоны для bem файлов
 * @param {String} templatesDirPath
 * @returns {Object}
 * @module getTemplates
 */
module.exports = function getTemplates(templatesDirPath) {
    return readdirSync(templatesDirPath).reduce((result, templateFileName) => {
        if (templateFileName.match(TEMPLATE_REGEXP)) {
            const [, templateType, fileType] = TEMPLATE_REGEXP.exec(templateFileName);

            if (templateType && fileType) {
                result[fileType] = Object.assign(result[fileType] || {}, {
                    [templateType]: template(readFileSync(path.join(templatesDirPath, templateFileName)))
                })
            }
        }

        return result;
    }, {});
}
