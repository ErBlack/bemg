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
import { getAvailableTemplates } from './tools/getAvailableTemplates.js';
import { getCurrentBemgConfig } from './tools/getCurrentBemgConfig.js';
import { startMCPServer } from './server.js';

vi.spyOn(generateBemFiles, 'tool');
vi.spyOn(initBemgConfig, 'tool');
vi.spyOn(analyzeBemPath, 'tool');
vi.spyOn(getAvailableTemplates, 'tool');
vi.spyOn(getCurrentBemgConfig, 'tool');

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
            const args = { targetPath: '/some/path' };

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

        it('should call getAvailableTemplates.tool when receiving get_available_templates request', async () => {
            const args = {
                targetPath: '/test/path',
            };

            const request = {
                jsonrpc: '2.0',
                id: 4,
                method: 'tools/call',
                params: {
                    name: 'get_available_templates',
                    arguments: args,
                },
            };

            await mockTransport.simulateMessage(request);

            expect(getAvailableTemplates.tool).toHaveBeenCalledWith(args);
        });

        it('should call getCurrentBemgConfig.tool when receiving get_current_bemg_config request', async () => {
            const args = {
                targetPath: '/test/path',
            };

            const request = {
                jsonrpc: '2.0',
                id: 5,
                method: 'tools/call',
                params: {
                    name: 'get_current_bemg_config',
                    arguments: args,
                },
            };

            await mockTransport.simulateMessage(request);

            expect(getCurrentBemgConfig.tool).toHaveBeenCalledWith(args);
        });
    });
});
