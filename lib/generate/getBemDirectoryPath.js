import { join } from 'path';

/**
 * Path to target folder
 * @param {import('../createBemNaming.js').BemEntity} entity - BEM entity object
 * @param {import('../createBemNaming.js').BemNaming} bemNaming - BEM naming utility
 * @returns {string} Directory path for the entity
 */
export function getBemDirectoryPath(entity, bemNaming) {
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
}
