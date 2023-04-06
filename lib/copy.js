const { join } = require('path');
const { copyFileSync, existsSync, mkdirSync, readdirSync } = require('fs');

/**
 * Рекурсивно копирует файлы из @src в @dest
 * @param {String} src
 * @param {String} dest
 * @author pushkinss
 */
function copyDirRecursive(src, dest) {
    if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
    }
    let entries = readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = join(src, entry.name);
        let destPath = join(dest, entry.name);

        entry.isDirectory() ? copyDirRecursive(srcPath, destPath) : copyFileSync(srcPath, destPath);
    }
}

/**
 * Копирует файлы из @src в @dest
 * @param {String} src
 * @param {String} dest
 * @param {Boolean} [override]
 * @param {Boolean} [simulate]
 * @author pushkinss
 */
module.exports = function copy(src, dest, override, simulate) {
    if (!existsSync(src)) {
        console.error(`Source path ${src} does not exist`);
        return;
    }
    if (!override && existsSync(dest)) {
        console.error(
            `Path ${dest} already exist.\nIf some bemg settings already exists, specify different destination path and then merge settings manually.`,
        );
        return;
    }

    try {
        if (!simulate) {
            copyDirRecursive(src, dest);
        }
        console.log(`Default settings copied to ${dest}`);
    } catch (error) {
        console.error(error);
    }
};
