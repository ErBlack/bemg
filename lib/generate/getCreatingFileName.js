import { kebabCase } from '../kebabCase.js';

const getBemFilePath = (type, bemString) => `${bemString}.${type}`;
const getNestedFilePath = (type, block) => type.replace(/block/g, block);
const getNamedItemFilePath = (type, namedItem) => `${kebabCase(namedItem)}.${type}`;
/**
 * @returns {string}
 */
const getNestedNamedItemFilePath = (type, block, namedItem) =>
    type.replace(/block|namedItem/g, (placeholder) => (placeholder === 'block' ? block : kebabCase(namedItem)));

/**
 * Name of the file to create
 * @param {string} templateType
 * @param {string} block - Block name
 * @param {string} entityString - BEM entity string, or the named item name
 * @param {boolean} [isNamedItem]
 * @returns {string}
 */
export function getCreatingFileName(templateType, block, entityString, isNamedItem) {
    if (templateType.includes('/')) {
        return isNamedItem
            ? getNestedNamedItemFilePath(templateType, block, entityString)
            : getNestedFilePath(templateType, block);
    }

    return isNamedItem ? getNamedItemFilePath(templateType, entityString) : getBemFilePath(templateType, entityString);
}
