import { generate } from '../../generate/index.js';
import { resolve } from 'path';
import { getConfigs } from '../../getConfigs.js';
import { suggestNextSteps } from '../lib/suggestNextSteps.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Tool} Tool
 * @typedef {import('@modelcontextprotocol/sdk/types.js').CallToolResult} CallToolResult
 */

/**
 * @typedef {Object} GenerateParams
 * @property {string} targetPath - Absolute path to target directory
 * @property {string[]} [types] - File types to generate or aliases
 * @property {string[]} [items] - BEM entities to create
 * @property {string} [name] - Block name to create a new block folder
 * @property {boolean} [dryRun] - Preview changes without creating files
 */

/**
 * @type {Tool}
 */
export const meta = {
    name: 'generate_bem_files',
    description: `Bunch generate BEM files based on entity names and types (see examples).

Examples:

1. CREATE NEW BLOCK:
   { targetPath: "/path/to/src", name: "button", types: ["tsx", "css"] }
   → Creates: button/button.tsx, button/button.css

2. ADD SINGLE ELEMENT:
   { targetPath: "/path/to/src/button", items: ["__icon"], types: ["tsx", "css"] }
   → Creates: button__icon.tsx, button__icon.css (in subdirectory)

3. ADD MULTIPLE ELEMENTS:
   { targetPath: "/path/to/src/button", items: ["__icon", "__text"], types: ["tsx", "css"] }
   → Creates multiple element files in separate subdirectories

4. ADD MODIFIERS:
   { targetPath: "/path/to/src/button", items: ["_size_large", "_disabled"], types: ["tsx", "css"] }

5. ADD ELEMENTS + MODIFIERS:
   { targetPath: "/path/to/src/button", items: ["", "__icon", "_primary"], types: ["tsx", "css"] }
   Note: "" represents the block entity itself

6. CREATE NEW BLOCK AND ADD ELEMENTS + MODIFIERS:
   { targetPath: "/path/to/src", name: "button", items: ["", "__icon", "__icon_close", "_primary", "_theme_default"], types: ["tsx", "css"] }
   Note: "" represents the block entity itself
`,
    inputSchema: {
        type: 'object',
        properties: {
            targetPath: {
                type: 'string',
                description:
                    'Absolute path to target directory. Points to block folder for elements/modifiers, or parent folder when using "name" parameter.',
            },
            types: {
                type: 'array',
                items: { type: 'string' },
                description:
                    'File types to generate (e.g., ["tsx", "css"]) or aliases (e.g., ["sb", "const"]). Aliases are project-specific - check bemg:///config resource.',
            },
            items: {
                type: 'array',
                items: { type: 'string' },
                description:
                    'BEM entities to create. Examples: ["__elem"] for element, ["_mod_val"] for modifier, ["__icon", "__text", "_mod_val"] for batch multiple elements or mods, [""] for current entity.',
            },
            name: {
                type: 'string',
                description:
                    'Block name - creates a new block folder with this name. Use this for new blocks, omit for adding files to existing blocks.',
            },
            dryRun: {
                type: 'boolean',
                description: 'Preview changes without creating files.',
                default: false,
            },
        },
        required: ['targetPath'],
    },
};

/**
 * Generate BEM files
 * @param {GenerateParams} params - Generation parameters
 * @returns {CallToolResult} Result with created files and messages
 */
export function tool({ targetPath, types = [''], items, name, dryRun }) {
    if (!targetPath) {
        const error = new Error('targetPath is required');
        error.name = 'ValidationError';
        throw error;
    }

    const resolvedPath = resolve(targetPath);

    const errors = [];

    const originalError = console.error;
    const originalLog = console.log;

    console.error = (...args) => errors.push(args.join(' '));
    console.log = () => {};

    try {
        const createdFiles = generate({
            targetPath: resolvedPath,
            types,
            items,
            name,
            dryRun,
        });

        console.error = originalError;
        console.log = originalLog;

        const configData = getConfigs(resolvedPath);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: true,
                            createdFiles,
                            nextSteps: suggestNextSteps(createdFiles, configData),
                            errors: errors.length > 0 ? errors : undefined,
                            message: `${dryRun ? 'Would create' : 'Successfully created'} ${createdFiles.length} file(s)`,
                        },
                        null,
                        2,
                    ),
                },
            ],
        };
    } catch (error) {
        console.error = originalError;
        console.log = originalLog;

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            success: false,
                            error: error instanceof Error ? error.message : String(error),
                            errors: errors.length > 0 ? errors : undefined,
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

export const generateBemFiles = { meta, tool };
