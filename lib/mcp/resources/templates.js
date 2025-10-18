import { readFileSync } from 'fs';
import { getConfigPaths } from '../../getConfigPaths.js';
import { getTemplatesPaths } from '../../templates/getTemplatesPaths.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Resource} Resource
 * @typedef {import('@modelcontextprotocol/sdk/types.js').ReadResourceResult} ReadResourceResult
 */

/**
 * @type {Resource}
 */
const meta = {
    uri: 'bemg://templates',
    name: 'Templates',
    description: 'List all available BEM templates and their aliases',
    mimeType: 'application/json',
};

/**
 * Get templates resource
 * @returns {ReadResourceResult} Resource content
 */
function resource() {
    const configPath = process.cwd();

    try {
        const { templatesPath, configPath: cfgPath } = getConfigPaths(configPath);
        const templates = getTemplatesPaths(templatesPath);
        const config = JSON.parse(readFileSync(cfgPath, { encoding: 'utf8' }));

        const result = {
            templates,
            aliases: config.aliases || {},
        };

        return {
            contents: [
                {
                    mimeType: meta.mimeType,
                    text: JSON.stringify(result, null, 2),
                    uri: meta.uri,
                },
            ],
        };
    } catch (error) {
        return {
            contents: [
                {
                    mimeType: meta.mimeType,
                    text: JSON.stringify(
                        {
                            error: error instanceof Error ? error.message : String(error),
                        },
                        null,
                        2,
                    ),
                    uri: meta.uri,
                },
            ],
        };
    }
}

export const templates = {
    meta,
    resource,
};
