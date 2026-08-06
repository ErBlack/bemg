import { readdirSync, lstatSync } from 'fs';
import { join, sep } from 'path';
const NAMED_ITEM = 'namedItem';

/**
 * Paths to templates for files in folders. A file whose name contains `namedItem`
 * is a template for a named item, any other file is a template for a block.
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

        const entityType = fileName.includes(NAMED_ITEM) ? NAMED_ITEM : 'block';

        result[`${directoryName.split(sep).join('/')}/${fileName}`] = {
            [entityType]: fullPath,
        };

        return result;
    }, result);
}
