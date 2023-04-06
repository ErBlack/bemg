const { dirname, resolve, join } = require('path');
const { existsSync, mkdirSync, writeFileSync } = require('fs');

const createBemNaming = require('bem-naming');

const getConfigs = require('../getConfigs');
const getBemRoot = require('./getBemRoot');
const getBemStringByPath = require('./getBemStringByPath');
const ensureDirectoryPath = require('./ensureDirectoryPath');
const getBemDirectoryPath = require('./getBemDirectoryPath');
const buildTemplateContext = require('./buildTemplateContext');

const getBemFilePath = (type, bemString) => `${bemString}.${type}`;
const getNestedFilePath = (type, block) => type.replace(/block/g, block);

module.exports = function generate({ targetPath, types, items, dryRun }) {
    const currentEntityPath = ensureDirectoryPath(targetPath);

    if (!Array.isArray(items)) items = [''];

    const {
        config: { naming, aliases },
        templates,
    } = getConfigs(currentEntityPath);

    const bemNaming = createBemNaming(naming);

    const currentEntityString = getBemStringByPath(currentEntityPath, naming);

    const currentBlockPath = getBemRoot(currentEntityPath, bemNaming.typeOf(currentEntityString));

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

            const creatingFilePath = join(currentBlockPath, creatingEntityDirectoryPath, creatingFileName);

            if (!existsSync(creatingFilePath)) {
                if (!dryRun) {
                    mkdirSync(dirname(creatingFilePath), { recursive: true });
                    writeFileSync(creatingFilePath, templates[templateType][creatingEntityType](templateContext));
                }
                console.log(`file creation ${creatingFileName} done`);
            }
        });
    });
};
