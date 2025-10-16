import camelCase from 'lodash.camelcase';
import { usernameSync } from 'username';

const capitalize = (string) => string.slice(0, 1).toUpperCase() + camelCase(string.slice(1));
const user = usernameSync();

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
            user,
            entity: bemNaming.stringify(entity),
        },
        entity,
    );

    if (entity.block) context.Block = capitalize(entity.block);
    if (entity.elem) context.Elem = capitalize(entity.elem);
    if (entity.modName) context.ModName = capitalize(entity.modName);
    if (entity.modVal) context.ModVal = typeof entity.modVal === 'string' ? capitalize(entity.modVal) : entity.modVal;

    return context;
}
