const { dirname, resolve } = require('path');
const { lstatSync } = require('fs');
const createBemNaming = require('bem-naming');

const getBemRoot = require('./getBemRoot');
const getBemStringByPath = require('./getBemStringByPath');
const Write = require('./Write');
const getConfigs = require('../getConfigs');

module.exports = function generate({ targetPath, types, items, dryRun }) {
    const absolutePath = resolve(targetPath);

    const { config, templates } = getConfigs(absolutePath);

    const bemNaming = createBemNaming(config.naming);

    const stats = lstatSync(absolutePath);
    const directoryPath = stats.isDirectory() ? absolutePath : dirname(absolutePath);

    const bemString = getBemStringByPath(directoryPath, config.naming);

    if (!bemNaming.validate(bemString)) {
        throw new Error(`${bemString} is not valid bem name`);
    }

    const write = new Write(getBemRoot(directoryPath, bemNaming.typeOf(bemString)), config, templates);

    if (!Array.isArray(items)) {
        items = [''];
    }

    items.forEach((item) => {
        write.write(bemString + item, types, dryRun);
    });
};
