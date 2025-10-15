import { dirname, resolve } from 'path';
import { lstatSync } from 'fs';

/**
 * Returns the absolute path to the folder
 * @param {String} targetPath
 * @returns {String}
 */
export function ensureDirectoryPath(targetPath) {
    const absolutePath = resolve(targetPath);
    const stats = lstatSync(absolutePath);

    return stats.isDirectory() ? absolutePath : dirname(absolutePath);
}
