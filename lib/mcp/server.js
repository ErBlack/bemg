import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import packageJson from '../../package.json' with { type: 'json' };
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { generateBemFiles } from './tools/generateBemFiles.js';
import { initBemgConfig } from './tools/init.js';
import { analyzeBemPath } from './tools/analyzeBemPath.js';
import { getAvailableTemplates } from './tools/getAvailableTemplates.js';
import { getCurrentBemgConfig } from './tools/getCurrentBemgConfig.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').CallToolRequest} CallToolRequest
 * @typedef {import('./tools/generateBemFiles.js').GenerateParams} GenerateParams
 * @typedef {import('./tools/init.js').InitParams} InitParams
 * @typedef {import('./tools/analyzeBemPath.js').AnalyzeBemPathParams} AnalyzeBemPathParams
 * @typedef {import('./tools/getAvailableTemplates.js').GetAvailableTemplatesParams} GetAvailableTemplatesParams
 * @typedef {import('./tools/getCurrentBemgConfig.js').GetCurrentBemgConfigParams} GetCurrentBemgConfigParams
 */

export async function startMCPServer() {
    const server = new Server(
        {
            name: packageJson.name,
            version: packageJson.version,
        },
        {
            capabilities: {
                tools: {},
            },
        },
    );

    server.setRequestHandler(ListToolsRequestSchema, () => ({
        tools: [
            generateBemFiles.meta,
            initBemgConfig.meta,
            analyzeBemPath.meta,
            getAvailableTemplates.meta,
            getCurrentBemgConfig.meta,
        ],
    }));

    server.setRequestHandler(CallToolRequestSchema, async (/** @type {CallToolRequest} */ request) => {
        const { name, arguments: args = {} } = request.params;

        switch (name) {
            case generateBemFiles.meta.name:
                return generateBemFiles.tool(/** @type {GenerateParams} */ (args));
            case initBemgConfig.meta.name:
                return initBemgConfig.tool(/** @type {InitParams} */ (args));
            case analyzeBemPath.meta.name:
                return analyzeBemPath.tool(/** @type {AnalyzeBemPathParams} */ (args));
            case getAvailableTemplates.meta.name:
                return getAvailableTemplates.tool(/** @type {GetAvailableTemplatesParams} */ (args));
            case getCurrentBemgConfig.meta.name:
                return getCurrentBemgConfig.tool(/** @type {GetCurrentBemgConfigParams} */ (args));
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    });

    const transport = new StdioServerTransport();

    await server.connect(transport);
}
