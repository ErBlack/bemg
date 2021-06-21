const path = require('path');
const fs = require('fs');
const createBemNaming = require('bem-naming');
const camelCase = require('lodash.camelcase');
const getTemplates = require('../getTemplates');

const user = require('username').sync();

const capitalize = string => string && typeof string === 'string' && string.slice(0, 1).toUpperCase() + camelCase(string.slice(1));

/**
 * Генерирует bem файлы внутри переданной папки
 * @module Write
 */
module.exports = class Write {
    constructor(root, config, templatesPath) {
        this._root = root;

        this._config = config;
        this._templates = getTemplates(templatesPath);
        this._bemNaming = createBemNaming(config.naming);
    }
    /**
     * Генерирует файлы переданного типа
     * @param {String} bemString
     * @param {Array} types
     * @param {Boolean} [simulate]
     */
    write(bemString, types, simulate) {
        if (!this._bemNaming.validate(bemString)) {
            console.error(`Skip "${bemString}". Not valid bem name.`)

            return;
        }

        const bemEntity = this._bemNaming.parse(bemString);
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
            if (this._config.aliases[type]) {
                type = this._config.aliases[type];
            }

            if (!this._templates[type]) {
                console.error(`No templates for "${type}" file type`);

                return;
            }

            const filePath = path.join(directoryPath, `${bemString}.${type}`);

            if (!fs.existsSync(filePath)) {
                if (!simulate) {
                    const content = this._generateFileContent(bemEntity, type);
                    if (content !== null) fs.writeFileSync(filePath, content);
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
        const entityType = this._bemNaming.typeOf(entity);
        const template = this._templates[type][entityType];

        if (!template) {
            console.error(`No templates for "${entityType}" in "${type}" file type`);
            return null;
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
        const {
            elem,
            mod: { name }
        } = this._config.naming;

        switch (this._bemNaming.typeOf(entity)) {
            case 'block':
                return this._root;
            case 'blockMod':
                return path.join(this._root, `${name}${entity.modName}`);
            case 'elem':
                return path.join(this._root, `${elem}${entity.elem}`);
            case 'elemMod':
                return path.join(this._root, `${elem}${entity.elem}`, `${name}${entity.modName}`);
        }
    }
};
