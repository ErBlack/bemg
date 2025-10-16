import { pascalCase } from '../pascalCase.js';

/**
 * Returns the template context
 * @param {import('../createBemNaming.js').BemEntity} entity - BEM entity object
 * @param {import('../createBemNaming.js').BemNaming} bemNaming - BEM naming utility
 * @returns {Object} Template context with capitalized properties
 */
export function buildTemplateContext(entity, bemNaming) {
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

    return context;
}
