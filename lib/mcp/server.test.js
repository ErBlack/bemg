import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

class MockTransport {
    constructor() {
        this.onclose = null;
        this.onerror = null;
        this.onmessage = null;
        this._connected = false;
        this._sentMessages = [];
    }

    async start() {
        this._connected = true;
    }

    async close() {
        this._connected = false;
        if (this.onclose) this.onclose();
    }

    async send(message) {
        this._sentMessages.push(message);
    }

    async simulateMessage(message) {
        if (this.onmessage) {
            await this.onmessage(message);
        }
    }
}

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
    StdioServerTransport: vi.fn(() => new MockTransport()),
}));

import { generateBemFiles } from './tools/generateBemFiles.js';
import { initBemgConfig } from './tools/init.js';
import { analyzeBemPath } from './tools/analyzeBemPath.js';
import { config } from './resources/config.js';
import { templates } from './resources/templates.js';
import { guide } from './resources/guide.js';
import { createBlock } from './prompts/createBlock.js';
import { startMCPServer } from './server.js';

vi.spyOn(generateBemFiles, 'tool');
vi.spyOn(initBemgConfig, 'tool');
vi.spyOn(analyzeBemPath, 'tool');
vi.spyOn(config, 'resource');
vi.spyOn(templates, 'resource');
vi.spyOn(guide, 'resource');
vi.spyOn(createBlock, 'prompt');

describe('mcp server', () => {
    let mockTransport;
    let serverInstance;

    beforeEach(async () => {
        vi.clearAllMocks();

        const originalConnect = Server.prototype.connect;

        vi.spyOn(Server.prototype, 'connect').mockImplementation(async function (transport) {
            serverInstance = this;
            mockTransport = transport;
            return originalConnect.call(this, transport);
        });

        await startMCPServer();

        Server.prototype.connect.mockRestore();
    });

    describe('Tools', () => {
        it('should call generateBemFiles.tool when receiving generate_bem_files request', async () => {
            const args = {
                targetPath: '/test/path',
                types: ['tsx', 'css'],
                name: 'Button',
            };

            const request = {
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/call',
                params: {
                    name: 'generate_bem_files',
                    arguments: args,
                },
            };

            await mockTransport.simulateMessage(request);

            expect(generateBemFiles.tool).toHaveBeenCalledWith(args);
        });

        it('should call analyzeBemPath.tool when receiving analyze_bem_path request', async () => {
            const args = { path: '/some/path' };

            const request = {
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/call',
                params: {
                    name: 'analyze_bem_path',
                    arguments: args,
                },
            };

            await mockTransport.simulateMessage(request);

            expect(analyzeBemPath.tool).toHaveBeenCalledWith(args);
        });

        it('should call initBemgConfig.tool when receiving init_bemg_config request', async () => {
            const args = {
                targetPath: '/project/path',
                dryRun: true,
            };

            const request = {
                jsonrpc: '2.0',
                id: 3,
                method: 'tools/call',
                params: {
                    name: 'init_bemg_config',
                    arguments: args,
                },
            };

            await mockTransport.simulateMessage(request);

            expect(initBemgConfig.tool).toHaveBeenCalledWith(args);
        });
    });

    describe('Resources', () => {
        it('should call config.resource when receiving bemg://config request', async () => {
            const request = {
                jsonrpc: '2.0',
                id: 4,
                method: 'resources/read',
                params: { uri: 'bemg://config' },
            };

            await mockTransport.simulateMessage(request);

            expect(config.resource).toHaveBeenCalled();
        });

        it('should call templates.resource when receiving bemg://templates request', async () => {
            const request = {
                jsonrpc: '2.0',
                id: 5,
                method: 'resources/read',
                params: { uri: 'bemg://templates' },
            };

            await mockTransport.simulateMessage(request);

            expect(templates.resource).toHaveBeenCalled();
        });

        it('should call guide.resource when receiving bemg://bem-naming-guide request', async () => {
            const request = {
                jsonrpc: '2.0',
                id: 6,
                method: 'resources/read',
                params: { uri: 'bemg://bem-naming-guide' },
            };

            await mockTransport.simulateMessage(request);

            expect(guide.resource).toHaveBeenCalled();
        });
    });

    describe('Prompts', () => {
        it('should call createBlock.prompt when receiving create-block request', async () => {
            const args = {
                componentName: 'Button',
                types: 'tsx,css',
                items: '__icon,__text',
            };

            const request = {
                jsonrpc: '2.0',
                id: 7,
                method: 'prompts/get',
                params: {
                    name: 'create-block',
                    arguments: args,
                },
            };

            await mockTransport.simulateMessage(request);

            expect(createBlock.prompt).toHaveBeenCalledWith(args);
        });
    });
});
