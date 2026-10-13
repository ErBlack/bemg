import { existsSync, lstatSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { findProjectRoot } from './findProjectRoot.js';
import { getTemplatesPaths } from './templates/getTemplatesPaths.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * @typedef {Object} ConfigPaths
 * @property {string[]} configPaths
 * @property {import('./templates/index.js').TemplatesPaths} templatesPaths
 */

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const getTemplatesDirPath = (root) => join(root, 'bemg', 'templates');
const getConfigPath = (root) => join(root, 'bemg', 'config.json');

const isDirectory = (path) => existsSync(path) && lstatSync(path).isDirectory();
const isFile = (path) => existsSync(path) && lstatSync(path).isFile();
const inherits = (configPath) => JSON.parse(readFileSync(configPath, { encoding: 'utf8' })).inherits === true;

/**
 * @param {string} directory
 * @returns {string[]}
 */
function getProjectRoots(directory) {
    const projectRoot = findProjectRoot(directory);
    const configPath = getConfigPath(projectRoot);
    const parentDirectory = dirname(projectRoot);

    if (parentDirectory === projectRoot || !isFile(configPath) || !inherits(configPath)) return [projectRoot];

    return [...getProjectRoots(parentDirectory), projectRoot];
}

/**
 * @param {string} directory
 * @returns {ConfigPaths}
 */
export function getConfigPaths(directory) {
    const projectRoots = getProjectRoots(directory);

    const configPaths = projectRoots.map(getConfigPath);

    if (!isFile(configPaths[0])) configPaths[0] = getConfigPath(defaultRoot);

    const templatesDirPaths = projectRoots.map(getTemplatesDirPath).filter(isDirectory);

    if (templatesDirPaths.length === 0) templatesDirPaths.push(getTemplatesDirPath(defaultRoot));

    const templatesPaths = templatesDirPaths
        .map(getTemplatesPaths)
        .reduce((parent, child) =>
            Object.entries(child).reduce(
                (result, [type, entities]) => ({ ...result, [type]: { ...result[type], ...entities } }),
                parent,
            ),
        );

    return { configPaths, templatesPaths };
}
