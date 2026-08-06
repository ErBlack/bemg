import { readFileSync } from 'fs';
import { createTemplate } from '../createTemplate.js';
import { getTemplatesPaths } from './getTemplatesPaths.js';

/**
 * Type a template can be written for: a BEM entity or a named item.
 * Used as the key a template is registered under.
 * @typedef {import('../createBemNaming.js').BemEntityType | 'namedItem'} EntityType
 */

export function getTemplates(templatesDirectoryPath) {
    const templatesPaths = getTemplatesPaths(templatesDirectoryPath);

    return Object.entries(templatesPaths).reduce((types, [type, templates]) => {
        types[type] = Object.entries(templates).reduce((result, [entity, templatePath]) => {
            result[entity] = createTemplate(readFileSync(templatePath, 'utf8'));

            return result;
        }, {});

        return types;
    }, {});
}
