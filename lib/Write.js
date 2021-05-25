const path = require('path');
const fs = require('fs');
const camelCase = require('lodash.camelcase');

const getTemplates = require('./getTemplates');
const { getTemplatesDirPath } = require('./getConfigPaths');

const user = require('username').sync();

const capitalize = string => string && typeof string === 'string' && string.slice(0, 1).toUpperCase() + camelCase(string.slice(1));

/**
 * Генерирует bem файлы внутри переданной папки
 * @module Write
 * @author ertema
 */
module.exports = class Write {
    constructor(root, bemNaming, aliases, naming) {
        this._root = root;
        this._bemNaming = bemNaming;
        this._aliases = aliases;
        this._naming = naming;

        const templatesPath = getTemplatesDirPath(root);

        this._templates = getTemplates(templatesPath);
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
            if (this._aliases[type]) {
                type = this._aliases[type];
            }

            if (!this._templates[type]) {
                console.error(`No templates for "${type}" file type`);

                return;
            }

            const filename = (typeof this._naming.generateFilename === 'function'
                    && this._naming.generateFilename(bemString, type, bemEntity))
                || `${bemString}.${type}`;

            const filePath = path.join(directoryPath, filename);

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
        const naming = this._naming;

        const entityType = this._bemNaming.typeOf(entity);

        if (typeof naming.generateFolderName === 'function') {
            const folderName = naming.generateFolderName(entity, entityType);

            if (folderName) {
                return path.join(this._root, folderName);
            }
        }

        switch (entityType) {
            case 'block':
                return this._root;
            case 'blockMod':
                return path.join(this._root, naming.mod.name + entity.modName);
            case 'elem':
                return path.join(this._root, naming.elem + entity.elem);
            case 'elemMod':
                return path.join(this._root, naming.elem + entity.elem + naming.mod.name + entity.modName);
        }
    }
};
