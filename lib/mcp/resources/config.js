import { getConfigs } from '../../getConfigs.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Resource} Resource
 * @typedef {import('@modelcontextprotocol/sdk/types.js').ReadResourceResult} ReadResourceResult
 */

/**
 * @type {Resource}
 */
const meta = {
    uri: 'bemg://config',
    name: 'Current bemg configuration',
    description: 'Exposes current bemg configuration including naming conventions and template aliases',
    mimeType: 'application/json',
};

/**
 * Get configuration resource
 * @returns {ReadResourceResult} Resource content
 */
function resource() {
    try {
        const { config } = getConfigs(process.cwd());

        return {
            contents: [
                {
                    mimeType: meta.mimeType,
                    text: JSON.stringify(config, null, 2),
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

export const config = {
    meta,
    resource,
};
