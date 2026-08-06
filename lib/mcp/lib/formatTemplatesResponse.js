import { readFileSync } from 'fs';
import { join } from 'path';
import { createTemplate } from '../../createTemplate.js';
import { getBemDirectoryPath } from '../../generate/getBemDirectoryPath.js';
import { createBemNaming } from '../../createBemNaming.js';

import { getCreatingFileName } from '../../generate/getCreatingFileName.js';
import { buildTemplateContext } from '../../generate/buildTemplateContext.js';

/**

 * @typedef {import('../../templates/index.js').EntityType} EntityType
 * @typedef {import('../../createBemNaming.js').BemNaming} BemNaming
 * @typedef {import('../../createBemNaming.js').BemEntity} BemEntity
 */

/**
 * @typedef {Object} TemplateOutput
 * @property {string} outputPath - The path where the file would be created
 * @property {string} outputExample - Example content of the generated file
 */

/**
 * @typedef {Record<string, Record<EntityType, TemplateOutput>>} FormattedTemplatesResponse
 */

const MOCK_NAMED_ITEM = 'namedItem';

const mockEntities = {
    block: { block: 'block' },
    elem: { block: 'block', elem: 'elem' },
    blockMod: { block: 'block', modName: 'mod', modVal: 'val' },
    elemMod: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
    namedItem: { block: 'block' },
};

/**
 * Generate example output path for an entity type
 * @param {EntityType} entityType
 * @param {string} templateType
 * @param {BemNaming} bemNaming
 * @returns {string}
 */
function generateOutputPath(entityType, templateType, bemNaming) {
    const entity = mockEntities[entityType];
    const isNamedItem = entityType === 'namedItem';
    const entityString = isNamedItem ? MOCK_NAMED_ITEM : bemNaming.stringify(entity);
    const fileName = getCreatingFileName(templateType, entity.block, entityString, isNamedItem);

    if (isNamedItem || templateType.includes('/')) {
        return fileName;
    }

    const directoryPath = getBemDirectoryPath(entity, bemNaming);

    return directoryPath ? join(directoryPath, fileName) : fileName;
}

/**
 * Format templates response with output paths and examples
 * @param {Record<string, Record<EntityType, string>>} templates
 * @param {Object} config
 * @returns {FormattedTemplatesResponse}
 */
export function formatTemplatesResponse(templates, config) {
    /** @type {FormattedTemplatesResponse} */
    const result = {};
    const bemNaming = createBemNaming(config.naming);

    for (const [templateType, entityTypes] of Object.entries(templates)) {
        result[templateType] = /** @type {Record<EntityType, TemplateOutput>} */ ({});

        for (const [entityType, templatePath] of /** @type {[EntityType, string][]} */ (Object.entries(entityTypes))) {
            const context = buildTemplateContext(
                mockEntities[entityType],
                bemNaming,
                entityType === 'namedItem' ? MOCK_NAMED_ITEM : undefined,
            );
            const template = createTemplate(readFileSync(templatePath, 'utf8'));

            result[templateType][entityType] = {
                outputPath: generateOutputPath(entityType, templateType, bemNaming),
                outputExample: template(context),
            };
        }
    }
    return result;
}
