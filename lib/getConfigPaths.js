const {existsSync, lstatSync} = require('fs');
const {join, resolve} = require('path');

const findProjectRoot = require('./findProjectRoot');

const defaultRoot = resolve(__dirname, '..');

const getConfigBasePath = (root) => join(root, 'bemg', 'bemg.config.js');

function getConfigPath(directory) {
    const projectRoot = findProjectRoot(directory);

    const path = getConfigBasePath(defaultRoot)

    if (projectRoot) {
        const configPath = getConfigBasePath(projectRoot);

        if (existsSync(configPath) && lstatSync(configPath).isFile()) {
            return configPath;
        }
    }

    return path;
}

const getTemplatesDirBasePath = (root) => join(root, 'bemg', 'templates');

function getTemplatesDirPath(directory) {
    const projectRoot = findProjectRoot(directory);

    const path = getTemplatesDirBasePath(defaultRoot)
    
    if (projectRoot) {
        const templatesDirPath = getTemplatesDirBasePath(projectRoot);

        if (existsSync(templatesDirPath) && lstatSync(templatesDirPath).isDirectory()) {
            return templatesDirPath;
        }
    }

    return path;
}


module.exports = { getConfigPath, getTemplatesDirPath }