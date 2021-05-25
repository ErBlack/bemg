const path = require('path');
const fs = require('fs');
const createBemNaming = require('bem-naming');
const Write = require('./Write');
const { getConfigPath } = require('./getConfigPaths');

module.exports = class TaskGenerate {
    constructor(targetPath) {
        const absolutePath = path.resolve(targetPath);
        const stats = fs.lstatSync(absolutePath);

        this._bemString = stats.isDirectory() ?
            this._bemStringByDir(absolutePath) :
            this._bemStringByFile(absolutePath);

        const configPath = getConfigPath(
            stats.isDirectory() ? absolutePath : path.dirname(absolutePath)
        );

        const { aliases, naming } = require(configPath)

        this._bemNaming = createBemNaming(naming);

        const bemEntity = this._bemNaming.parse(this._bemString)

        if (!bemEntity) {
            throw new Error(`${this._bemString} is not valid bem name`);
        }

        this._write = new Write(
            this._bemRoot(
                stats.isDirectory() ? absolutePath : path.dirname(absolutePath),
                this._bemNaming.typeOf(bemEntity)
            ),
            this._bemNaming,
            aliases,
            naming
        );
    }

    write(types, items, simulate) {
        if (!Array.isArray(items)) {
            items = [''];
        }

        items.forEach((item) => {
            this._write.write(this._bemString + item, types, simulate);
        });
    }

    _bemStringByDir(directory) {
        let bemString = '';

        do {
            bemString = path.basename(directory) + bemString;
            directory = path.dirname(directory);
        } while (bemString.indexOf('_') == 0 && directory);

        return bemString;
    }

    _bemStringByFile(filepath) {
        return path.basename(filepath).split('.')[0];
    }

    _bemRoot(directory, bemType) {
        switch (bemType) {
            case 'block':
                return directory;
            case 'elem':
            case 'blockMod':
                return path.resolve(directory, '../');
            case 'elemMod':
                return path.resolve(directory, '../../');
        }
    }
}