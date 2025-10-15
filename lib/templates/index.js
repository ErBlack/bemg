import { readFileSync } from 'fs';
import template from 'lodash.template';
import { getTemplatesPaths } from './getTemplatesPaths.js';

export function getTemplates(templatesDirectoryPath) {
    const templatesPaths = getTemplatesPaths(templatesDirectoryPath);

    return Object.entries(templatesPaths).reduce((types, [type, templates]) => {
        types[type] = Object.entries(templates).reduce((result, [entity, templatePath]) => {
            result[entity] = template(readFileSync(templatePath));

            return result;
        }, {});

        return types;
    }, {});
}
