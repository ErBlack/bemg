import { readFileSync } from 'fs';

import { getConfigPaths } from './getConfigPaths.js';
import { getTemplates } from './templates/index.js';

/**
 * Reads and returns config and templates
 * @param {string} directory
 */
export function getConfigs(directory) {
    const { configPath, templatesPath } = getConfigPaths(directory);

    return {
        config: JSON.parse(readFileSync(configPath, { encoding: 'utf8' })),
        templates: getTemplates(templatesPath),
    };
}
