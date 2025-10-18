/**
 * MCP Tool: analyze_bem_path
 *
 * Analyzes a directory path to determine current BEM context,
 * including the current entity, block root, and possible entities.
 */

import { getBemStringByPath } from '../../generate/getBemStringByPath.js';
import { getConfigs } from '../../getConfigs.js';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { createBemNaming } from '../../createBemNaming.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Tool} Tool
 * @typedef {import('@modelcontextprotocol/sdk/types.js').CallToolResult} CallToolResult
 */

/**
 * @typedef {Object} AnalyzeBemPathParams
 * @property {string} path - Directory path to analyze
 */

/**
 * @type {Tool}
 */
export const meta = {
    name: 'analyze_bem_path',
    description:
        'Analyze a directory path to determine current BEM context. Returns current entity, block root, and suggestions.',
    inputSchema: {
        type: 'object',
        properties: {
            path: {
                type: 'string',
                description: 'Directory path to analyze',
            },
        },
        required: ['path'],
    },
};

/**
 * Get BEM structure information for a path
 * @param {Record<string, unknown>} params - Analysis parameters
 * @returns {CallToolResult} Structure information
 */
export function tool(params) {
    const path = /** @type {string} */ (params.path);

    if (!path || typeof path !== 'string') {
        const error = new Error('path is required and must be a string');
        error.name = 'ValidationError';
        throw error;
    }

    const resolvedPath = resolve(path);

    if (!existsSync(resolvedPath)) {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: false,
                            error: `Path does not exist: ${resolvedPath}`,
                        },
                        null,
                        2,
                    ),
                },
            ],
            isError: true,
        };
    }

    try {
        const { config } = getConfigs(resolvedPath);
        const naming = config.naming;

        const bemNaming = createBemNaming(naming);

        const { currentEntityString, currentBlockRoot } = getBemStringByPath(resolvedPath, [
            bemNaming.elemDelim,
            bemNaming.modDelim,
            bemNaming.modValDelim,
        ]);

        const isValid = bemNaming.validate(currentEntityString);

        if (!isValid) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                success: false,
                                path: resolvedPath,
                                error: `Current path does not correspond to a valid BEM entity: ${currentEntityString}`,
                            },
                            null,
                            2,
                        ),
                    },
                ],
                isError: true,
            };
        }

        const currentEntity = bemNaming.parse(currentEntityString);
        const currentEntityType = bemNaming.typeOf(currentEntity);

        const suggestions = [];

        if (currentEntityType === 'block') {
            suggestions.push({
                type: 'element',
                example: `${currentEntityString}__elem`,
                description: 'Add an element to the block',
            });
            suggestions.push({
                type: 'blockMod',
                example: `${currentEntityString}_mod`,
                description: 'Add a modifier to the block',
            });
        } else if (currentEntityType === 'elem') {
            suggestions.push({
                type: 'elemMod',
                example: `${currentEntityString}_mod`,
                description: 'Add a modifier to the element',
            });
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: true,
                            path: resolvedPath,
                            currentEntity: {
                                string: currentEntityString,
                                type: currentEntityType,
                                ...currentEntity,
                            },
                            blockRoot: currentBlockRoot,
                            suggestions,
                            naming,
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
