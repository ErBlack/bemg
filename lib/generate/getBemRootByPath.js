const { dirname } = require('path');
const fs = require('fs');
const createBemNaming = require('bem-naming');
const getBemRoot = require('./getBemRoot');
const getBemStringByPath = require('./getBemStringByPath');

module.exports = function getBemRootByPath(absolutePath, config) {
    const bemNaming = createBemNaming(config.naming);

    const stats = fs.lstatSync(absolutePath);
    const directoryPath = stats.isDirectory() ? absolutePath : dirname(absolutePath);

    const bemString = getBemStringByPath(directoryPath, config.naming);

    if (!bemNaming.validate(bemString)) {
        throw new Error(`${bemString} is not valid bem name`);
    }

    return getBemRoot(directoryPath, bemNaming.typeOf(bemString));
};
