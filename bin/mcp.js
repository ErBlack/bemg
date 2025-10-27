#!/usr/bin/env node

import { Command } from 'commander';
import { startMCPServer } from '../lib/mcp/server.js';

const program = new Command();

program
    .description('Start MCP (Model Context Protocol) server for AI agents. Exposes bemg capabilities to AI assistants.')
    .addHelpText(
        'after',
        `
Configuration:
    {
      "mcpServers": {
        "bemg": {
          "command": "npx",
          "args": ["bemg@latest", "mcp"]
        }
      }
    }`,
    )
    .action(() => {
        startMCPServer();
    });

program.parse(process.argv);
