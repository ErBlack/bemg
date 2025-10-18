import { getConfigs } from '../../getConfigs.js';
import { generateBemFiles } from '../tools/generateBemFiles.js';

/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Prompt} Prompt
 * @typedef {import('@modelcontextprotocol/sdk/types.js').GetPromptResult} GetPromptResult
 */

/**
 * @typedef {Object} CreateBlockParams
 * @property {string} componentName - Name of the component (required)
 * @property {string} [types] - File types to generate (comma-separated)
 * @property {string} [items] - BEM entities to create with block (comma-separated, e.g., "__icon,__text,_disabled")
 */

/**
 * @type {Prompt}
 */
const meta = {
    name: 'create-block',
    description: 'Guide me through creating a new block with the right structure',
    arguments: [
        {
            name: 'componentName',
            description: "The name of the block to create (e.g., 'button', 'user-card')",
            required: true,
        },
        {
            name: 'types',
            description:
                "Comma-separated list of file types to generate (e.g., 'tsx,css,stories' or use aliases like 'sb' for stories, 'const' for constants)",
            required: false,
        },
        {
            name: 'items',
            description:
                "Comma-separated list of BEM entities to create with the block (e.g., '__icon,__text,_size_large,_disabled'). Use this to create elements and modifiers in one shot.",
            required: false,
        },
    ],
};

/**
 * Generate prompt for creating a block
 * @param {CreateBlockParams} args - Prompt arguments
 * @returns {GetPromptResult} Prompt result
 */
function prompt({ componentName, types, items }) {
    const { config, templates } = getConfigs(process.cwd());

    const availableTemplates = Object.keys(templates);
    const aliases = config.aliases || {};

    const typesToCreate = (types ? types.split(',') : [])
        .map((type) => type.trim())
        .map((type) => aliases[type] ?? type)
        .filter((type) => availableTemplates.includes(type));

    // Parse items parameter
    const itemsToCreate = items
        ? items
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
        : [];

    // Build items array for tool call: always include empty string for block, plus any additional items
    const toolItems = ['', ...itemsToCreate];

    // Build file list for display
    const allFiles = toolItems
        .flatMap((item) => typesToCreate.map((type) => `  - ${componentName}${item}.${type}`))
        .join('\n');

    const promptText = `# Creating block: ${componentName}

I'll help you create a complete block called "${componentName}"${itemsToCreate.length > 0 ? ' with elements and modifiers' : ''}.

## What we'll create:

${allFiles}

## Implementation:

I'll use the \`${generateBemFiles.meta.name}\` tool with:
- name: "${componentName}" (creates a new block folder)
- types: ${JSON.stringify(typesToCreate)}
- items: ${JSON.stringify(toolItems)}${itemsToCreate.length > 0 ? ' (block + elements/modifiers in one call)' : ' (just the block)'}

${
    itemsToCreate.length === 0
        ? `## Need more?

After creating the basic block, you can:

1. **Add elements** using the same tool:
   Common examples: \`__icon\`, \`__label\`, \`__content\`
   
2. **Add modifiers** for variations:
   Common examples: \`_size_small\`, \`_disabled\`, \`_theme_dark\`

3. **Batch create multiple** elements/modifiers at once:
   Pass multiple items like: \`["__icon", "__text", "_disabled"]\`
`
        : ''
}
**Available templates:** ${availableTemplates.map((t) => `\`${t}\``).join(', ')}

Would you like me to proceed with creating the ${componentName} block?`;

    const typesDescription = typesToCreate.length > 0 ? ` with ${typesToCreate.join(', ')}` : '';
    const itemsDescription = itemsToCreate.length > 0 ? ` and ${itemsToCreate.length} additional entities` : '';

    return {
        description: `Create ${componentName} block`,
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Create a block named ${componentName}${typesDescription}${itemsDescription}`,
                },
            },
            {
                role: 'assistant',
                content: {
                    type: 'text',
                    text: promptText,
                },
            },
        ],
    };
}

export const createBlock = {
    meta,
    prompt,
};
