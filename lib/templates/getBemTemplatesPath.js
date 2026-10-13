import { join } from 'path';

const TEMPLATE_REGEXP = /template_(\w+)\.(.+)/;

/**
 * Paths to templates for bem files
 * @param {String} templatesDirectoryPath
 * @param {String} templateFileName
 * @param {import('./index.js').TemplatesPaths} result
 * @returns {import('./index.js').TemplatesPaths}
 * @module getTemplates
 */
export function getBemTemplatesPath(templatesDirectoryPath, templateFileName, result) {
    if (templateFileName.match(TEMPLATE_REGEXP)) {
        const [, templateType, fileType] = TEMPLATE_REGEXP.exec(templateFileName) || [];

        if (templateType && fileType) {
            result[fileType] = Object.assign(result[fileType] || {}, {
                [templateType]: join(templatesDirectoryPath, templateFileName),
            });
        }
    }

    return result;
}
