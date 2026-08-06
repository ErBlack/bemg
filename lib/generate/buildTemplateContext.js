import { camelCase } from '../camelCase.js';
import { kebabCase } from '../kebabCase.js';
import { pascalCase } from '../pascalCase.js';

/**
 * Returns the template context
 * @param {import('../createBemNaming.js').BemEntity} entity - BEM entity object
 * @param {import('../createBemNaming.js').BemNaming} bemNaming - BEM naming utility
 * @param {string} [namedItem] - Named item name, as passed by the user
 * @returns {Object} Template context with capitalized properties
 */
export function buildTemplateContext(entity, bemNaming, namedItem) {
    /** @type {Record<string, any>} */
    const context = Object.assign(
        {
            entity: bemNaming.stringify(entity),
        },
        entity,
    );

    if (entity.block) context.Block = pascalCase(entity.block);
    if (entity.elem) context.Elem = pascalCase(entity.elem);
    if (entity.modName) context.ModName = pascalCase(entity.modName);
    if (entity.modVal) context.ModVal = typeof entity.modVal === 'string' ? pascalCase(entity.modVal) : entity.modVal;

    if (namedItem) {
        context.camelNamedItem = camelCase(namedItem);
        context.pascalNamedItem = pascalCase(namedItem);
        context.kebabNamedItem = kebabCase(namedItem);
    }

    return context;
}
