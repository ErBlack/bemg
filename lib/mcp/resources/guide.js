/**
 * @typedef {import('@modelcontextprotocol/sdk/types.js').Resource} Resource
 * @typedef {import('@modelcontextprotocol/sdk/types.js').ReadResourceResult} ReadResourceResult
 */

/**
 * @type {Resource}
 */
const meta = {
    uri: 'bemg://bem-naming-guide',
    name: 'BEM naming guide',
    description: 'Documentation about BEM methodology and naming conventions',
    mimeType: 'text/markdown',
};

/**
 * BEM naming guide content
 */
const BEM_GUIDE = `# BEM Naming Guide

## What is BEM?

BEM (Block Element Modifier) is a naming methodology that helps you create reusable components and code sharing in front-end development.

## Core Concepts

### Block

A standalone entity that is meaningful on its own.

**Examples:** \`button\`, \`menu\`, \`header\`, \`input\`

**Naming:** Block names may consist of Latin letters, digits, and dashes.

\`\`\`
button
search-form
tab-panel
\`\`\`

### Element

A part of a block that has no standalone meaning and is semantically tied to its block.

**Naming:** Element names are separated from the block name with double underscores (\`__\`)

\`\`\`
button__icon
search-form__input
tab-panel__tab
\`\`\`

**Rules:**
- Elements are always part of a block, not another element
- Element names describe its purpose, not its state or structure
- Can't exist outside of their parent block

### Modifier

A flag on a block or element used to change appearance, behavior, or state.

**Naming:** Modifier names are separated from the block or element name with a single underscore (\`_\`)

**Boolean Modifiers** (presence indicates true):
\`\`\`
button_disabled
button_primary
\`\`\`

**Key-Value Modifiers:**
\`\`\`
button_size_large
button_theme_dark
menu_position_top
\`\`\`

**Rules:**
- Can't be used standalone—only together with block or element
- Multiple modifiers can be used on the same block/element

## Naming Patterns

### Default Configuration

bemg uses these delimiters by default:
- **Element delimiter:** \`__\` (double underscore)
- **Modifier delimiter:** \`_\` (single underscore)
- **Modifier value delimiter:** \`_\` (single underscore)

### Valid Examples

\`\`\`
Block                    → button
Block with modifier      → button_disabled
Block with key-value mod → button_size_large

Block__Element           → button__icon
Element with modifier    → button__icon_hidden

Block_mod/               → button_primary/
  Block_mod.css          → button_primary.css
  Block_mod.tsx          → button_primary.tsx
\`\`\`

## File Structure

BEM methodology extends to file organization:

\`\`\`
button/
├── button.tsx              # Block implementation
├── button.css              # Block styles
├── __icon/                 # Element folder
│   ├── button__icon.tsx    # Element implementation
│   └── button__icon.css    # Element styles
└── _disabled/              # Modifier folder
    ├── button_disabled.css # Modifier styles
    └── button_disabled.tsx # Modifier implementation (optional)
\`\`\`

## Best Practices

### When to Use Blocks

- Independent, reusable components
- Can be nested and reused
- Examples: buttons, forms, cards, headers

### When to Use Elements

- Parts that only make sense within their block
- Cannot be reused outside their block context
- Examples: menu item in a menu, tab in a tab panel

### When to Use Modifiers

- To change appearance: size, theme, color
- To change behavior: disabled, loading, active
- To change state: open, closed, selected

### Naming Guidelines

1. **Be descriptive:** Names should describe purpose, not appearance
   - ✅ Good: \`button_size_large\`, \`menu_position_top\`
   - ❌ Bad: \`button_big\`, \`menu_absolute\`

2. **Use consistent terminology:**
   - Choose one naming pattern for similar modifiers
   - \`_size_small\`, \`_size_medium\`, \`_size_large\`

3. **Avoid deep nesting:**
   - ✅ Good: \`block__element\`
   - ❌ Bad: \`block__element__subelement\` (use separate blocks)

4. **Keep it simple:**
   - Short, memorable names
   - Avoid abbreviations unless widely known

## Custom Naming Configuration

You can customize delimiters in \`bemg/config.json\`:

\`\`\`json
{
  "naming": {
    "elem": "__",
    "mod": {
      "name": "_",
      "val": "_"
    }
  }
}
\`\`\`

## Common Patterns

### Component Variations

\`\`\`
button                    # Primary button
button_secondary          # Secondary style
button_size_small         # Small size
button_disabled           # Disabled state
\`\`\`

### Complex Components

\`\`\`
search-form                        # Block
search-form__input                 # Element
search-form__button                # Element
search-form__button_disabled       # Element with modifier
search-form_theme_dark             # Block with modifier
\`\`\`

## Resources

- [BEM Official Website](https://en.bem.info/)
- [BEM Methodology](https://en.bem.info/methodology/)
- [bemg Documentation](https://github.com/ErBlack/bemg)
`;

/**
 * Get BEM naming guide resource
 * @returns {ReadResourceResult} Resource content
 */
function resource() {
    return {
        contents: [
            {
                mimeType: meta.mimeType,
                text: BEM_GUIDE,
                uri: meta.uri,
            },
        ],
    };
}

export const guide = {
    meta,
    resource,
};
