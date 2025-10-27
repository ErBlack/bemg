import { getConfigs } from '../../getConfigs.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Tool} Tool
 * @typedef {import('@modelcontextprotocol/sdk/types.js').CallToolResult} CallToolResult
 */

/**
 * @typedef {Object} GetCurrentBemgConfigParams
 * @property {string} targetPath - Absolute path to the project directory
 */

/**
 * @type {Tool}
 */
const meta = {
    name: 'get_current_bemg_config',
    description: 'Get current bemg configuration including naming conventions',
    inputSchema: {
        type: 'object',
        properties: {
            targetPath: {
                type: 'string',
                description: 'Absolute path to the project directory',
            },
        },
        required: ['targetPath'],
    },
};

/**
 * Get current bemg configuration
 * @param {GetCurrentBemgConfigParams} params - Tool parameters
 * @returns {CallToolResult} Tool result with current configuration
 */
function tool({ targetPath }) {
    try {
        const { config } = getConfigs(targetPath);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: true,
                            config,
                        },
                        null,
                        2,
                    ),
                },
            ],
        };
    } catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: false,
                            error: error instanceof Error ? error.message : String(error),
                        },
                        null,
                        2,
                    ),
                },
            ],
            isError: true,
        };
    }
}

export const getCurrentBemgConfig = {
    meta,
    tool,
};
