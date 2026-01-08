import { getConfigPaths } from '../../getConfigPaths.js';
import { getTemplatesPaths } from '../../templates/getTemplatesPaths.js';
import { getConfigs } from '../../getConfigs.js';
import { formatTemplatesResponse } from '../lib/formatTemplatesResponse.js';
import { buildResultFolderStructure } from '../lib/buildResultFolderStructure.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Tool} Tool
 * @typedef {import('@modelcontextprotocol/sdk/types.js').CallToolResult} CallToolResult
 */

/**
 * @typedef {Object} GetAvailableTemplatesParams
 * @property {string} targetPath - Absolute path to the project directory
 */

/**
 * @type {Tool}
 */
const meta = {
    name: 'get_available_templates',
    description: 'Get all available BEM templates in the current project',
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
 * Get available templates
 * @param {GetAvailableTemplatesParams} params - Tool parameters
 * @returns {CallToolResult} Tool result with available templates
 */
function tool({ targetPath }) {
    const configPath = targetPath;

    try {
        const { templatesPath } = getConfigPaths(configPath);
        const { config } = getConfigs(configPath);
        const templates = getTemplatesPaths(templatesPath);
        const formattedTemplates = formatTemplatesResponse(templates, config);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: true,
                            folderStructure: buildResultFolderStructure(formattedTemplates),
                            templates: formattedTemplates,
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

export const getAvailableTemplates = {
    meta,
    tool,
};
