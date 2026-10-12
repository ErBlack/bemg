import { resolve } from 'path';
import { analyze } from '../../analyze/index.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Tool} Tool
 * @typedef {import('@modelcontextprotocol/sdk/types.js').CallToolResult} CallToolResult
 */

/**
 * @typedef {Object} AnalyzeBemPathParams
 * @property {string} targetPath - Absolute path to the folder of the BEM entity to analyze
 */

/**
 * @type {Tool}
 */
export const meta = {
    name: 'analyze_bem_path',
    description:
        'Analyze a path to determine current BEM context. Returns current entity, block root, and suggestions.',
    inputSchema: {
        type: 'object',
        properties: {
            targetPath: {
                type: 'string',
                description: 'Absolute path to the folder of the BEM entity to analyze',
            },
        },
        required: ['targetPath'],
    },
};

/**
 * Get BEM structure information for a path
 * @param {{targetPath: string}} params - Analysis parameters
 * @returns {CallToolResult} Structure information
 */
export function tool({ targetPath }) {
    const resolvedPath = resolve(targetPath);

    try {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ success: true, ...analyze(resolvedPath) }, null, 2),
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
                            path: resolvedPath,
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

export const analyzeBemPath = { meta, tool };
