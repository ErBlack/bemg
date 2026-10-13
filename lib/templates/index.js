import { readFileSync } from 'fs';
import { createTemplate } from '../createTemplate.js';

/**
 * Type a template can be written for: a BEM entity or a named item.
 * Used as the key a template is registered under.
 * @typedef {import('../createBemNaming.js').BemEntityType | 'namedItem'} EntityType
 */

/**
 * @typedef {Record<string, Partial<Record<EntityType, string>>>} TemplatesPaths
 * @typedef {ReturnType<typeof createTemplate>} Template
 * @typedef {Record<string, Partial<Record<EntityType, Template>>>} Templates
 */

/**
 * @param {TemplatesPaths} templatesPaths
 * @returns {Templates}
 */
export function getTemplates(templatesPaths) {
    return Object.entries(templatesPaths).reduce((types, [type, templates]) => {
        types[type] = Object.entries(templates).reduce((result, [entity, templatePath]) => {
            result[entity] = createTemplate(readFileSync(templatePath, 'utf8'));

            return result;
        }, {});

        return types;
    }, {});
}
