import { readFileSync } from 'fs';
import { createTemplate } from '../createTemplate.js';
import { getTemplatesPaths } from './getTemplatesPaths.js';

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
