const { resolve } = require('path');

module.exports = function getBemRoot(directory, bemType) {
    switch (bemType) {
        case 'block':
            return directory;
        case 'elem':
        case 'blockMod':
            return resolve(directory, '../');
        case 'elemMod':
            return resolve(directory, '../../');
    }
};
