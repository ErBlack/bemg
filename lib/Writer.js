const path = require('path');
const fs = require('fs');
const bemNaming = require('bem-naming');
const bemTemplates = require('./Templates');
const camelCase = require('lodash.camelcase');

const templateAliases = {
    stories: 'stories.tsx',
    const: 'const.ts'
}

const user = require('username').sync();

const capitalize = string => string && string.slice(0, 1).toUpperCase() + camelCase(string.slice(1));

/**
 * Генерирует bem файлы внутри переданной папки
 * @module Writer
 * @author ertema
 */
module.exports = class Writer {
    constructor(root) {
        this._root = root;
    }
    /**
     * Генерирует файлы переданного типа
     * @param {String} bemString
     * @param {Array} types
     * @param {Boolean} [simulate]
     */
    write(bemString, types, simulate) {
        if (!bemNaming.validate(bemString)) {
            console.error(`Skip "${bemString}". Not valid bem name.`)

            return;
        }

        const bemEntity = bemNaming.parse(bemString);
        const directoryPath = this._bemPath(bemEntity);

        if (!fs.existsSync(directoryPath)) {
            try {
                if (!simulate) {
                    fs.mkdirSync(directoryPath);
                }

                console.log(`folder creation ${directoryPath} done`);
            } catch (e) {
                console.error(`folder creation ${directoryPath} failed`, e);

                throw e;
            }
        }

        types.forEach((type) => {
            if (templateAliases[type]) {
                type = templateAliases[type];
            }

            if (!bemTemplates[type]) {
                console.error(`No templates for "${type}" file type`);

                return;
            }

            const filePath = path.join(directoryPath, `${bemString}.${type}`);

            if (!fs.existsSync(filePath)) {
                if (!simulate) {
                    fs.writeFileSync(filePath, this._generateFileContent(bemEntity, type));
                }
                console.log(`file creation ${path.basename(filePath)} done`);
            }
        });
    }
    /**
     * Генерирует содержимое файла переданного типа
     * @param {Object} entity bem
     * @param {String} type тип файла
     */
    _generateFileContent(entity, type) {
        const entityType = bemNaming.typeOf(entity);
        const template = bemTemplates[type][entityType] || bemTemplates[type].default;

        if (!template) {
            console.error(`No templates for "${entityType}" in "${type}" file type`);
            return '';
        }

        return template(this._buildTemplateContext(entity));
    }
    /**
     * Возвращает контекст запуска шаблонов
     * @param {Object} entity bem
     */
    _buildTemplateContext(entity) {
        return Object.assign({
            user: user,
            Block: capitalize(entity.block),
            Elem: capitalize(entity.elem),
            ModName: capitalize(entity.modName),
            ModVal: capitalize(entity.modVal)
        }, entity);
    }
    /**
     * Путь к папке цели
     * @param {Object} entity bem
     */
    _bemPath(entity) {
        switch (bemNaming.typeOf(entity)) {
            case 'block':
                return this._root;
            case 'blockMod':
                return path.join(this._root, `_${entity.modName}`);
            case 'elem':
                return path.join(this._root, `__${entity.elem}`);
            case 'elemMod':
                return path.join(this._root, `__${entity.elem}`, `_${entity.modName}`);
        }
    }
}
