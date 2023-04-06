const { existsSync, lstatSync } = require('fs');
const { join, resolve } = require('path');

const findProjectRoot = require('./findProjectRoot');

const defaultRoot = resolve(__dirname, '..');

const getTemplatesDirPath = (root) => join(root, 'bemg', 'templates');
const getConfigPath = (root) => join(root, 'bemg', 'config.json');

module.exports = function getConfigPaths(directory) {
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
};
