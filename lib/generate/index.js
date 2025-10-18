import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { createBemNaming } from '../createBemNaming.js';

import { ensureDirectoryPath } from './ensureDirectoryPath.js';
import { getConfigs } from '../getConfigs.js';
import { getBemStringByPath } from './getBemStringByPath.js';
import { getBemDirectoryPath } from './getBemDirectoryPath.js';
import { buildTemplateContext } from './buildTemplateContext.js';

const getBemFilePath = (type, bemString) => `${bemString}.${type}`;
/**
 * @returns {string}
 */
const getNestedFilePath = (type, block) => type.replace(/block/g, block);

/**
 * @typedef {Object} GenerateOptions
 * @property {string} targetPath - Path to the directory where files should be generated
 * @property {string[]} types - File types to generate (e.g., ['tsx', 'css']) or aliases (e.g., ['sb', 'const'])
 * @property {string[]} [items] - BEM entity items to create (e.g., ['__elem', '_mod']). Defaults to ['']
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

    /**
     * @type {Array<{
     * creatingEntityString: string,
     * creatingEntityType: import('../createBemNaming.js').BemEntityType
     * creatingEntity: import('../createBemNaming.js').BemEntity,
     * templateType: string,
     * creatingFilePath: string
     * }>}
     */
    const generationResult = [];

    items.forEach((item) => {
        if (item !== '' && !delimiters.some((delim) => item.startsWith(delim))) {
            console.error(`Skip "${item}". Item should start with one of the delimiters: ${delimiters.join(', ')}`);

            return;
        }

        const creatingEntityString = currentEntityString + item;

        if (!bemNaming.validate(creatingEntityString)) {
            console.error(`Skip "${creatingEntityString}". Not valid bem name.`);

            return;
        }

        const creatingEntity = bemNaming.parse(creatingEntityString);
        const creatingEntityType = bemNaming.typeOf(creatingEntity);

        const creatingEntityDirectoryPath = getBemDirectoryPath(creatingEntity, bemNaming);

        const templateContext = buildTemplateContext(creatingEntity, bemNaming);

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

            const creatingFileName = templateType.includes('/')
                ? getNestedFilePath(templateType, creatingEntity.block)
                : getBemFilePath(templateType, creatingEntityString);

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

    console.log(generationResult);

    return generationResult;
}
