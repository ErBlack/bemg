const {existsSync, lstatSync} = require('fs');
const {join, delimiter} = require('path');

const findProjectRoot = require('./findProjectRoot');

const TEMPLATES_DIR = join('bemg', 'templates');

module.exports = function findTemplatesDir(directory) {
    const templatesDirPath = join(findProjectRoot(directory), TEMPLATES_DIR);

    if (existsSync(templatesDirPath) && lstatSync(templatesDirPath).isDirectory()) {
        return templatesDirPath;
    }
}