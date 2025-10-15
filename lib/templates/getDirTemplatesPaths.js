import { readdirSync, lstatSync } from 'fs';
import { join, delimiter } from 'path';

/**
 * Paths to templates for files in folders
 * @param {String} templatesDirectoryPath
 * @param {String} directoryName
 * @param {Object} result
 * @returns {Object}
 * @module getTemplates
 */
export function getDirTemplatesPaths(templatesDirectoryPath, directoryName, result) {
    const directoryPath = join(templatesDirectoryPath, directoryName);

    return readdirSync(directoryPath).reduce((result, fileName) => {
        const fullPath = join(directoryPath, fileName);

        if (lstatSync(fullPath).isDirectory()) {
            return getDirTemplatesPaths(templatesDirectoryPath, join(directoryName, fileName), result);
        }

        result[`${directoryName.replace(new RegExp(delimiter, 'g'), '/')}/${fileName}`] = {
            block: fullPath,
        };

        return result;
    }, result);
}
