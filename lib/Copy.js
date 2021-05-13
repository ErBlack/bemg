const path = require('path');
const fs = require('fs');

/**
 * Управляет копированием файлов
 * @module Copy
 * @author pushkinss
 */
module.exports = class Copy {
    /**
     * Копирует файлы из @src в @dest
     * @param {String} src
     * @param {String} dest
     * @param {Boolean} [override]
     * @param {Boolean} [simulate]
     */
    copy(src, dest, override, simulate) {
        if (!fs.existsSync(src)) {
            console.error(`Source path ${from} does not exist`);
            return;
        }
        if (!override && fs.existsSync(dest)) {
            console.error(`Path ${dest} already exist.\nIf some bemg settings already exists, specify different destination path and then merge settings manually.`);
            return;
        }

        try {
            if (!simulate) {
                this._copyDirRecursive(src, dest, override);
            }
            console.log(`Default settings copied to ${dest}`);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Рекурсивно копирует файлы из @src в @dest
     * @param {String} src
     * @param {String} dest
     */
    _copyDirRecursive(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        let entries = fs.readdirSync(src, { withFileTypes: true });

        for (let entry of entries) {
            let srcPath = path.join(src, entry.name);
            let destPath = path.join(dest, entry.name);

            entry.isDirectory()
                ? this._copyDirRecursive(srcPath, destPath)
                : fs.copyFileSync(srcPath, destPath);
        }
    }
};
