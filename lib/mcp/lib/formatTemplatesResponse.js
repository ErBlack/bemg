import { readFileSync } from 'fs';
import { join } from 'path';
import { createTemplate } from '../../createTemplate.js';
import { getBemDirectoryPath } from '../../generate/getBemDirectoryPath.js';
import { createBemNaming } from '../../createBemNaming.js';
import { buildTemplateContext } from '../../generate/buildTemplateContext.js';

/**
 * @typedef {import('../../createBemNaming.js').BemEntityType} BemEntityType
 * @typedef {import('../../createBemNaming.js').BemNaming} BemNaming
 * @typedef {import('../../createBemNaming.js').BemEntity} BemEntity
 */

/**
 * @typedef {Object} TemplateOutput
 * @property {string} outputPath - The path where the file would be created
 * @property {string} outputExample - Example content of the generated file
 */

/**
 * @typedef {Record<string, Record<BemEntityType, TemplateOutput>>} FormattedTemplatesResponse
 */

const mockEntities = {
    block: { block: 'block' },
    elem: { block: 'block', elem: 'elem' },
    blockMod: { block: 'block', modName: 'mod', modVal: 'val' },
    elemMod: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
};

/**
 * Generate example output path for a BEM entity type
 * @param {BemEntityType} entityType
 * @param {string} templateType
 * @param {BemNaming} bemNaming
 * @returns {string}
 */
function generateOutputPath(entityType, templateType, bemNaming) {
    const entity = mockEntities[entityType];

    const entityString = bemNaming.stringify(entity);
    const directoryPath = getBemDirectoryPath(entity, bemNaming);
    const fileName = `${entityString}.${templateType}`;

    return directoryPath ? join(directoryPath, fileName) : fileName;
}

/**
 * Format templates response with output paths and examples
 * @param {Record<string, Record<BemEntityType, string>>} templates
 * @param {Object} config
 * @returns {FormattedTemplatesResponse}
 */
export function formatTemplatesResponse(templates, config) {
    /** @type {FormattedTemplatesResponse} */
    const result = {};
    const bemNaming = createBemNaming(config.naming);

    for (const [templateType, entityTypes] of Object.entries(templates)) {
        result[templateType] = /** @type {Record<BemEntityType, TemplateOutput>} */ ({});

        for (const [entityType, templatePath] of /** @type {[BemEntityType, string][]} */ (
            Object.entries(entityTypes)
        )) {
            const context = buildTemplateContext(mockEntities[entityType], bemNaming);
            const template = createTemplate(readFileSync(templatePath, 'utf8'));

            result[templateType][entityType] = {
                outputPath: generateOutputPath(entityType, templateType, bemNaming),
                outputExample: template(context),
            };
        }
    }
    return result;
}
