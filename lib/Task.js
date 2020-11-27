const path = require('path');
const fs = require('fs');
const bemNaming = require('bem-naming');
const Writer = require('./Writer');

module.exports = class Task {
    constructor(targetPath) {
        const absolutePath = path.resolve(targetPath);
        const stats = fs.lstatSync(absolutePath);

        this._bemString = stats.isDirectory() ?
            this._bemStringByDir(absolutePath) :
            this._bemStringByFile(absolutePath);

        if (!bemNaming.validate(this._bemString)) {
            throw new Error(`${this._bemString} is not valid bem name`);
        }

        this._writer = new Writer(
            this._bemRoot(
                stats.isDirectory() ? absolutePath : path.dirname(absolutePath),
                bemNaming.typeOf(this._bemString)
            )
        );
    }

    write(types, items, simulate) {
        if (!Array.isArray(items)) {
            items = [''];
        }

        items.forEach((item) => {
            this._writer.write(this._bemString + item, types, simulate);
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