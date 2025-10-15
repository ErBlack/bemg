import { existsSync, lstatSync } from 'fs';
import { join, resolve } from 'path';

import { findProjectRoot } from './findProjectRoot.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const getTemplatesDirPath = (root) => join(root, 'bemg', 'templates');
const getConfigPath = (root) => join(root, 'bemg', 'config.json');

export function getConfigPaths(directory) {
    const projectRoot = findProjectRoot(directory);

    const paths = {
        templatesPath: getTemplatesDirPath(defaultRoot),
        configPath: getConfigPath(defaultRoot),
    };

    if (projectRoot) {
        const templatesDirPath = getTemplatesDirPath(projectRoot);

        if (existsSync(templatesDirPath) && lstatSync(templatesDirPath).isDirectory()) {
            paths.templatesPath = templatesDirPath;
        }

        const configPath = getConfigPath(projectRoot);

        if (existsSync(configPath) && lstatSync(configPath).isFile()) {
            paths.configPath = configPath;
        }
    }

    return paths;
}
