const { readFileSync } = require('fs');

const getConfigPaths = require('./getConfigPaths');
const getTemplates = require('./templates');

/**
 * Читает и возвращает config и templates
 * @param {string} directory
 */
module.exports = function getConfigs(directory) {
    const { configPath, templatesPath } = getConfigPaths(directory);

    return {
        config: JSON.parse(readFileSync(configPath, { encoding: 'utf8' })),
        templates: getTemplates(templatesPath),
    };
};
