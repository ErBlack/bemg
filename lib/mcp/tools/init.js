/**
 * MCP Tool: init_bemg_config
 *
 * Wrapper around lib/copy.js that initializes bemg configuration
 * in a directory by copying default config and templates.
 */

import { copy } from '../../copy.js';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Tool} Tool
 * @typedef {import('@modelcontextprotocol/sdk/types.js').CallToolResult} CallToolResult
 */

/**
 * @typedef {Object} InitParams
 * @property {string} targetPath - Path where to initialize bemg config
 * @property {boolean} [override] - Overwrite existing configuration
 * @property {boolean} [dryRun] - Preview changes without creating files
 */

/**
 * @type {Tool}
 */
export const meta = {
    name: 'init_bemg_config',
    description: 'Initialize bemg configuration in a directory. Creates config.json and template files.',
    inputSchema: {
        type: 'object',
        properties: {
            targetPath: {
                type: 'string',
                description: 'Path where to initialize bemg config (usually the project root)',
            },
            override: {
                type: 'boolean',
                description: 'Overwrite existing configuration',
                default: false,
            },
            dryRun: {
                type: 'boolean',
                description: 'Preview changes without creating files',
                default: false,
            },
        },
        required: ['targetPath'],
    },
};

/**
 * Initialize bemg configuration
 * @param {Record<string, unknown>} params - Initialization parameters
 * @returns {CallToolResult} Result with created files and messages
 */
export function tool(params) {
    const targetPath = /** @type {string} */ (params.targetPath);
    const override = /** @type {boolean} */ (params.override ?? false);
    const dryRun = /** @type {boolean} */ (params.dryRun ?? false);

    if (!targetPath || typeof targetPath !== 'string') {
        const error = new Error('targetPath is required and must be a string');
        error.name = 'ValidationError';
        throw error;
    }

    const templatesSource = resolve(__dirname, '../../../bemg');
    const bemgPath = join(resolve(targetPath), 'bemg');

    const logs = [];
    const errors = [];

    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => logs.push(args.join(' '));
    console.error = (...args) => errors.push(args.join(' '));

    try {
        copy(templatesSource, bemgPath, override, dryRun);

        console.log = originalLog;
        console.error = originalError;

        const hasErrors = errors.length > 0;

        if (hasErrors) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                success: false,
                                error: errors.join('\n'),
                                targetPath: bemgPath,
                            },
                            null,
                            2,
                        ),
                    },
                ],
                isError: true,
            };
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: true,
                            dryRun,
                            targetPath: bemgPath,
                            message: dryRun
                                ? 'Would copy default settings to ' + bemgPath
                                : logs.join('\n') || 'Default settings copied to ' + bemgPath,
                        },
                        null,
                        2,
                    ),
                },
            ],
        };
    } catch (error) {
        console.log = originalLog;
        console.error = originalError;

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: false,
                            error: error instanceof Error ? error.message : String(error),
                            targetPath: bemgPath,
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

export const initBemgConfig = { meta, tool };
