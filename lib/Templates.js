const fs = require('fs');
const glob = require('glob');
const path = require('path');
const template = require('lodash.template');

const TEMPLATES_DIR = path.resolve(__dirname, '../templates');
const TEMPLATE_REGEXP = /template_(\w+)\.(.+)/

/**
 * Шаблоны для bem файлов
 * @module bemTemplates
 */
module.exports = glob.sync(path.join(TEMPLATES_DIR, 'template_*')).reduce((result, templatePath) => {
    const [, templateType, fileType] = TEMPLATE_REGEXP.exec(path.basename(templatePath));

    if (templateType && fileType) {
        result[fileType] = Object.assign(result[fileType] || {}, {
            [templateType]: template(fs.readFileSync(templatePath))
        })
    }

    return result;
}, {});
