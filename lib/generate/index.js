import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { BEM_TYPES, createBemNaming } from '../createBemNaming.js';

import { ensureDirectoryPath } from './ensureDirectoryPath.js';
import { getConfigs } from '../getConfigs.js';
import { getBemStringByPath } from './getBemStringByPath.js';
import { getBemDirectoryPath } from './getBemDirectoryPath.js';
import { getCreatingFileName } from './getCreatingFileName.js';
import { buildTemplateContext } from './buildTemplateContext.js';

/**
 * @typedef {Object} GenerateOptions
 * @property {string} targetPath - Path to the directory where files should be generated
 * @property {string[]} types - File types to generate (e.g., ['tsx', 'css']) or aliases (e.g., ['sb', 'const'])
 * @property {string[]} [items] - Items to create: BEM suffixes (e.g., ['__elem', '_mod']), '' for the current
 * entity, or a bare name (e.g., ['useHookName']) for a named item. Defaults to ['']
 * @property {boolean} [dryRun] - If true, only logs what would be created without creating files
 * @property {string} [name] - If passed – generates new block folder with given name
 */

/**
 * Generate BEM files based on the provided options
 * @param {GenerateOptions} options - Generation options
 */
export function generate({ targetPath, types, items, dryRun, name }) {
    const targetFolderPath = ensureDirectoryPath(targetPath);

    if (!Array.isArray(items)) items = [''];

    const {
        config: { naming, aliases },
        templates,
    } = getConfigs(targetFolderPath);

    const bemNaming = createBemNaming(naming);

    if (name) {
        if (!bemNaming.validate(name)) {
            throw new Error(`Given name "${name}" is not valid bem name`);
        }

        const nameEntity = bemNaming.parse(name);
        if (bemNaming.typeOf(nameEntity) !== 'block') {
            throw new Error(`Given name "${name}" is not valid block name`);
        }
    }

    const currentEntityPath = name ? join(targetFolderPath, name) : targetFolderPath;
    /**
     * @type {[String, String, String]}
     */
    const delimiters = [bemNaming.elemDelim, bemNaming.modDelim, bemNaming.modValDelim];

    const { currentEntityString, currentBlockRoot } = getBemStringByPath(currentEntityPath, delimiters);

    if (!bemNaming.validate(currentEntityString)) {
        throw new Error(`${currentEntityString} is not valid bem name`);
    }

    const currentEntity = bemNaming.parse(currentEntityString);
    const currentEntityIsBlock = bemNaming.typeOf(currentEntity) === BEM_TYPES.block;
    const namedItemPattern = new RegExp(`^${bemNaming.wordPattern}$`);

    /**
     * @type {Array<{
     * creatingEntityString: string,
     * creatingEntityType: import('../templates/index.js').EntityType
     * creatingEntity: import('../createBemNaming.js').BemEntity,
     * templateType: string,
     * creatingFilePath: string
     * }>}
     */
    const generationResult = [];

    items.forEach((item) => {
        const isNamedItem = item !== '' && !delimiters.some((delim) => item.startsWith(delim));

        /** @type {string} */
        let creatingEntityString;
        /** @type {import('../templates/index.js').EntityType} */
        let creatingEntityType;
        /** @type {import('../createBemNaming.js').BemEntity} */
        let creatingEntity;
        /** @type {string} */
        let creatingEntityDirectoryPath;
        /** @type {Object} */
        let templateContext;

        if (isNamedItem) {
            if (!currentEntityIsBlock) {
                console.error(
                    `Skip "${item}". Named items can only be created for a block, but "${currentEntityString}" has type ${bemNaming.typeOf(currentEntity)}.`,
                );

                return;
            }

            if (!namedItemPattern.test(item)) {
                console.error(`Skip "${item}". Not valid named item name.`);

                return;
            }

            creatingEntityString = item;
            creatingEntityType = 'namedItem';
            creatingEntity = currentEntity;
            creatingEntityDirectoryPath = '';
            templateContext = buildTemplateContext(currentEntity, bemNaming, item);
        } else {
            creatingEntityString = currentEntityString + item;

            if (!bemNaming.validate(creatingEntityString)) {
                console.error(`Skip "${creatingEntityString}". Not valid bem name.`);

                return;
            }

            creatingEntity = bemNaming.parse(creatingEntityString);
            creatingEntityType = bemNaming.typeOf(creatingEntity);
            creatingEntityDirectoryPath = getBemDirectoryPath(creatingEntity, bemNaming);
            templateContext = buildTemplateContext(creatingEntity, bemNaming);
        }

        types.forEach((templateType) => {
            if (aliases[templateType]) templateType = aliases[templateType];

            if (!templates[templateType]) {
                console.error(`No templates for "${templateType}" file type`);

                return;
            }

            if (!templates[templateType][creatingEntityType]) {
                console.error(`No templates for "${creatingEntityType}" in "${templateType}" file type`);

                return;
            }

            const creatingFileName = getCreatingFileName(
                templateType,
                creatingEntity.block,
                creatingEntityString,
                isNamedItem,
            );

            const creatingFilePath = join(currentBlockRoot, creatingEntityDirectoryPath, creatingFileName);

            let exists = false;

            try {
                exists = existsSync(creatingFilePath); // can fail when folder in path does not exist
            } catch {}

            if (!exists) {
                if (!dryRun) {
                    mkdirSync(dirname(creatingFilePath), { recursive: true });
                    writeFileSync(creatingFilePath, templates[templateType][creatingEntityType](templateContext));
                }

                console.log(`file creation ${creatingFileName} done`);

                generationResult.push({
                    creatingEntityString,
                    creatingEntityType,
                    creatingEntity,
                    templateType,
                    creatingFilePath,
                });
            }
        });
    });

    return generationResult;
}
