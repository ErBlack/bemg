const { join } = require('path');

/**
 * Путь к папке цели
 * @param {Object} entity bem
 * @param {Object} bemNaming bem-naming
 * @returns {String}
 */
module.exports = function getBemDirectoryPath(entity, bemNaming) {
    switch (bemNaming.typeOf(entity)) {
        case 'blockMod':
            return `${bemNaming.modDelim}${entity.modName}`;
        case 'elem':
            return `${bemNaming.elemDelim}${entity.elem}`;
        case 'elemMod':
            return join(`${bemNaming.elemDelim}${entity.elem}`, `${bemNaming.modDelim}${entity.modName}`);
        case 'block':
        default:
            return '';
    }
};
