const path = require('path');
const fs = require('fs');
const camelCase = require('lodash.camelcase');

const getConfigPaths = require('./getConfigPaths');
const getTemplates = require('./getTemplates');
const bemTypeOf = require('./bemTypeOf');

const user = require('username').sync();

const capitalize = string => string && typeof string === 'string' && string.slice(0, 1).toUpperCase() + camelCase(string.slice(1));

/**
 * Генерирует bem файлы внутри переданной папки
 * @module Write
 * @author ertema
 */
module.exports = class Write {
    constructor(root, bemNaming, useElemDelim) {
        this._root = root;
        this._bemNaming = bemNaming;
        this._useElemDelim = useElemDelim;

        const {
            templates,
            aliases
        } = getConfigPaths(root);

        this._templates = getTemplates(templates);
        this._aliases = require(aliases);
    }
    /**
     * Генерирует файлы переданного типа
     * @param {String} bemString
     * @param {Array} types
     * @param {Boolean} [simulate]
     */
    write(bemString, types, simulate) {
        const bemEntity = this._bemNaming.parse(bemString);

        if (!bemEntity) {
            console.error(`Skip "${bemString}". Not valid bem name.`)

            return;
        }
        
        const directoryPath = this._bemPath(bemEntity);

        console.log(directoryPath)

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
            if (this._aliases[type]) {
                type = this._aliases[type];
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
        const entityType = bemTypeOf(entity);
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
        const mod = entity.mod;
        
        return {
            user: user,
            block: entity.block,
            elem: entity.elem,
            modName: mod && mod.name,
            modVal: mod && mod.val,
            Block: capitalize(entity.block),
            Elem: capitalize(entity.elem),
            ModName: capitalize(mod && mod.name),
            ModVal: capitalize(mod && mod.val)
        };
    }
    /**
     * Путь к папке цели
     * @param {Object} entity bem
     */
    _bemPath(entity) {
        const delims = this._bemNaming.delims;

        switch (bemTypeOf(entity)) {
            case 'block':
                return this._root;
            case 'blockMod':
                return path.join(this._root, delims.mod.name + entity.mod.name);
            case 'elem':
                return path.join(this._root, (this._useElemDelim ? delims.elem : '') + entity.elem);
            case 'elemMod':
                return path.join(this._root, (this._useElemDelim ? delims.elem : '') + entity.elem + delims.mod.name + entity.mod.name);
        }
    }
};
