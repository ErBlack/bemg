import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import createBemNaming from 'bem-naming';

import { ensureDirectoryPath } from './ensureDirectoryPath.js';
import { getConfigs } from '../getConfigs.js';
import { getBemStringByPath } from './getBemStringByPath.js';
import { getBemDirectoryPath } from './getBemDirectoryPath.js';
import { buildTemplateContext } from './buildTemplateContext.js';

const getBemFilePath = (type, bemString) => `${bemString}.${type}`;
const getNestedFilePath = (type, block) => type.replace(/block/g, block);

export function generate({ targetPath, types, items, dryRun }) {
    const currentEntityPath = ensureDirectoryPath(targetPath);

    if (!Array.isArray(items)) items = [''];

    const {
        config: { naming, aliases },
        templates,
    } = getConfigs(currentEntityPath);

    const bemNaming = createBemNaming(naming);

    const { currentEntityString, currentBlockRoot } = getBemStringByPath(currentEntityPath, [
        bemNaming.elemDelim,
        bemNaming.modDelim,
        bemNaming.modValDelim,
    ]);

    if (!bemNaming.validate(currentEntityString)) {
        throw new Error(`${currentEntityString} is not valid bem name`);
    }

    items.forEach((item) => {
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

            if (!existsSync(creatingFilePath)) {
                if (!dryRun) {
                    mkdirSync(dirname(creatingFilePath), { recursive: true });
                    writeFileSync(creatingFilePath, templates[templateType][creatingEntityType](templateContext));
                }
                console.log(`file creation ${creatingFileName} done`);
            }
        });
    });
}
