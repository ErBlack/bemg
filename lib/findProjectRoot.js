const { existsSync } = require('fs');
const { resolve, join } = require('path');

const MARKERS = ['.git', '.hg', 'bemg'];

const markerExists = (directory) => MARKERS.some((mark) => existsSync(join(directory, mark)));

module.exports = function findProjectRoot(directory) {
    while (!markerExists(directory)) {
        const parentDirectory = resolve(directory, '..');

        if (parentDirectory === directory) break;

        directory = parentDirectory;
    }

    return directory;
};
