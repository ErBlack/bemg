const fs = require('fs');
const glob = require('glob');
const path = require('path');
const template = require('lodash.template');

const TEMPLATE_REGEXP = /template_(\w+)\.(.+)/;

/**
 * Шаблоны для bem файлов
 * @param {String} templatesDirPath
 * @returns {Object}
 * @module getTemplates
 */
module.exports = function getTemplates(templatesDirPath = path.resolve(__dirname, '../templates')) {
    return glob.sync(path.join(DEFAULT_TEMPLATES_DIR, 'template_*')).reduce((result, templatePath) => {
        const [, templateType, fileType] = TEMPLATE_REGEXP.exec(path.basename(templatePath));

        if (templateType && fileType) {
            result[fileType] = Object.assign(result[fileType] || {}, {
                [templateType]: template(fs.readFileSync(templatePath))
            })
        }

        return result;
    }, {});
}
