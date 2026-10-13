import { readFileSync } from 'fs';

import { getConfigPaths } from './getConfigPaths.js';
import { getTemplates } from './templates/index.js';

/**
 * @typedef {Object} Config
 * @property {Record<string, string>} aliases
 * @property {import('./createBemNaming.js').NamingOptions} naming
 * @property {boolean} [inherits]
 */

/**
 * @typedef {Object} Configs
 * @property {Config} config
 * @property {import('./templates/index.js').Templates} templates
 */

/**
 * @param {string[]} configPaths
 * @returns {Config}
 */
export function readConfig(configPaths) {
    return configPaths
        .map((configPath) => JSON.parse(readFileSync(configPath, { encoding: 'utf8' })))
        .reduce((parent, child) => ({ ...parent, ...child, aliases: { ...parent.aliases, ...child.aliases } }), {
            aliases: {},
        });
}

/**
 * Reads and returns config and templates
 * @param {string} directory
 * @returns {Configs}
 */
export function getConfigs(directory) {
    const { configPaths, templatesPaths } = getConfigPaths(directory);

    return {
        config: readConfig(configPaths),
        templates: getTemplates(templatesPaths),
    };
}
