const camelCase = require('lodash.camelcase');
const user = require('username').sync();
const capitalize = (string) => string.slice(0, 1).toUpperCase() + camelCase(string.slice(1));

/**
 * Возвращает контекст запуска шаблонов
 * @param {Object} entity bem
 */
module.exports = function buildTemplateContext(entity, bemNaming) {
    const context = Object.assign(
        {
            user,
            entity: bemNaming.stringify(entity),
        },
        entity,
    );

    if (entity.block) context.Block = capitalize(entity.block);
    if (entity.elem) context.Elem = capitalize(entity.elem);
    if (entity.modName) context.ModName = capitalize(entity.modName);
    if (entity.modVal) context.ModVal = typeof entity.modVal === 'string' ? capitalize(entity.modVal) : entity.modVal;

    return context;
};
