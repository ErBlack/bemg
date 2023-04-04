const {readFileSync} = require('fs');
const template = require('lodash.template');
const getTemplatesPaths = require('./getTemplatesPaths');

module.exports = function getTemplates(templatesDirectoryPath) {
    const templatesPaths = getTemplatesPaths(templatesDirectoryPath);

    return Object.entries(templatesPaths).reduce((types, [type, templates]) => {
        types[type] = Object.entries(templates).reduce((result, [entity, templatePath]) => {
            result[entity] = template(readFileSync(templatePath));

            return result;
        }, {});

        return types;
    }, {});
}
