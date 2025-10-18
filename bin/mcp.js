#!/usr/bin/env node

import { Command } from 'commander';
import { startMCPServer } from '../lib/mcp/server.js';

const program = new Command();

program
    .description(
        'Start MCP (Model Context Protocol) server for AI agents. Exposes bemg capabilities to AI assistants like Claude Desktop via JSON-RPC 2.0 over stdio.',
    )
    .addHelpText(
        'after',
        `
Configuration:
    Add to Claude Desktop config (~/Library/Application Support/Claude/claude_desktop_config.json):
    {
      "mcpServers": {
        "bemg": {
          "command": "npx",
          "args": ["bemg", "mcp"],
          "cwd": "/path/to/your/project"
        }
      }
    }

Features:
    Tools: generate_bem_files, init_bemg_config, validate_bem_name, get_bem_structure
    Resources: bemg://config, bemg://templates, bemg://bem-naming-guide
    Prompts: create-bem-component, bem-best-practices
`,
    )
    .action(() => {
        startMCPServer();
    });

program.parse(process.argv);
