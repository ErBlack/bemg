const {existsSync, lstatSync} = require('fs');
const {join, resolve} = require('path');

const findProjectRoot = require('./findProjectRoot');

const defaultRoot = resolve(__dirname, '..');

const getTemplatesDirPath = (root) => join(root, 'bemg', 'templates');
const getAliasesPath = (root) => join(root, 'bemg', 'aliases.json');

module.exports = function getConfigPaths(directory) {
    const projectRoot = findProjectRoot(directory);

    const paths = {
        templates: getTemplatesDirPath(defaultRoot),
        aliases: getAliasesPath(defaultRoot)
    }

    if (projectRoot) {
        const templatesDirPath = getTemplatesDirPath(projectRoot);

        if (existsSync(templatesDirPath) && lstatSync(templatesDirPath).isDirectory()) {
            paths.templates = templatesDirPath;
        }

        const aliasesPath = getAliasesPath(projectRoot);

        if (existsSync(aliasesPath) && lstatSync(aliasesPath).isFile()) {
            paths.aliases = aliasesPath;
        }
    }

    return paths;
}