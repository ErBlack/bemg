import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import packageJson from '../../package.json' with { type: 'json' };
import {
    CallToolRequestSchema,
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { generateBemFiles } from './tools/generateBemFiles.js';
import { initBemgConfig } from './tools/init.js';
import { analyzeBemPath } from './tools/analyzeBemPath.js';
import { config } from './resources/config.js';
import { templates } from './resources/templates.js';
import { guide } from './resources/guide.js';
import { createBlock } from './prompts/createBlock.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').CallToolRequest} CallToolRequest
 * @typedef {import('@modelcontextprotocol/sdk/types.js').ReadResourceRequest} ReadResourceRequest
 * @typedef {import('@modelcontextprotocol/sdk/types.js').GetPromptRequest} GetPromptRequest
 * @typedef {import('./prompts/createBlock.js').CreateBlockParams} CreateBlockParams
 * @typedef {import('./tools/generateBemFiles.js').GenerateParams} GenerateParams
 * @typedef {import('./tools/init.js').InitParams} InitParams
 * @typedef {import('./tools/analyzeBemPath.js').AnalyzeBemPathParams} AnalyzeBemPathParams
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
                resources: {},
                prompts: {},
            },
        },
    );

    server.setRequestHandler(ListToolsRequestSchema, () => ({
        tools: [generateBemFiles.meta, initBemgConfig.meta, analyzeBemPath.meta],
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
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    });

    server.setRequestHandler(ListResourcesRequestSchema, () => ({
        resources: [config.meta, templates.meta, guide.meta],
    }));

    server.setRequestHandler(ReadResourceRequestSchema, (/** @type {ReadResourceRequest} */ request) => {
        const { uri } = request.params;

        switch (uri) {
            case config.meta.uri:
                return config.resource();
            case templates.meta.uri:
                return templates.resource();
            case guide.meta.uri:
                return guide.resource();
            default:
                throw new Error(`Unknown resource URI: ${uri}`);
        }
    });

    server.setRequestHandler(ListPromptsRequestSchema, () => ({
        prompts: [createBlock.meta],
    }));

    server.setRequestHandler(
        GetPromptRequestSchema,
        (/** @type {GetPromptRequest} */ { params: { name, arguments: args } }) => {
            switch (name) {
                case createBlock.meta.name:
                    return createBlock.prompt(/** @type {CreateBlockParams} */ (args));
                default:
                    throw new Error(`Unknown prompt: ${name}`);
            }
        },
    );

    const transport = new StdioServerTransport();

    await server.connect(transport);
}
