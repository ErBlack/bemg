const { dirname, resolve } = require('path');
const { readFileSync, lstatSync } = require('fs');
const createBemNaming = require('bem-naming');

const getConfigPaths = require('../getConfigPaths');
const getBemRoot = require('./getBemRoot');
const getBemStringByPath = require('./getBemStringByPath');
const Write = require('./Write');

module.exports = function generate({ targetPath, types, items, dryRun }) {
    const absolutePath = resolve(targetPath);

    const { templatesPath, configPath } = getConfigPaths(absolutePath);

    const config = JSON.parse(readFileSync(configPath, { encoding: 'utf8' }));

    const bemNaming = createBemNaming(config.naming);

    const stats = lstatSync(absolutePath);
    const directoryPath = stats.isDirectory() ? absolutePath : dirname(absolutePath);

    const bemString = getBemStringByPath(directoryPath, config.naming);

    if (!bemNaming.validate(bemString)) {
        throw new Error(`${bemString} is not valid bem name`);
    }

    const write = new Write(getBemRoot(directoryPath, bemNaming.typeOf(bemString)), config, templatesPath);

    if (!Array.isArray(items)) {
        items = [''];
    }

    items.forEach((item) => {
        write.write(bemString + item, types, dryRun);
    });
};
