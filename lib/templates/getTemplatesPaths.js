import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import { getBemTemplatesPath } from './getBemTemplatesPath.js';
import { getDirTemplatesPaths } from './getDirTemplatesPaths.js';

/**
 * Structure of templates with paths to files
 * @param {String} templatesDirectoryPath
 * @returns {Object}
 * @module getTemplates
 */
export function getTemplatesPaths(templatesDirectoryPath) {
    return readdirSync(templatesDirectoryPath).reduce((result, templateFileName) => {
        const fullPath = join(templatesDirectoryPath, templateFileName);

        if (lstatSync(fullPath).isDirectory()) {
            return getDirTemplatesPaths(templatesDirectoryPath, templateFileName, result);
        }

        return getBemTemplatesPath(templatesDirectoryPath, templateFileName, result);
    }, {});
}
