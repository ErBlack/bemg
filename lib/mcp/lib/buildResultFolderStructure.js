/**
 * @typedef {import('./formatTemplatesResponse.js').FormattedTemplatesResponse} FormattedTemplatesResponse
 */

/**
 * Build folder structure from formatted templates response
 * @param {FormattedTemplatesResponse} formattedTemplates - Result from formatTemplatesResponse
 * @returns {string} ASCII tree structure
 */
export function buildResultFolderStructure(formattedTemplates) {
    const paths = [];

    for (const entityTypes of Object.values(formattedTemplates)) {
        for (const template of Object.values(entityTypes)) {
            if (template.outputPath) {
                paths.push(template.outputPath);
            }
        }
    }

    if (paths.length === 0) {
        return '';
    }

    const tree = {};

    for (const path of paths) {
        const parts = path.split('/');
        let current = tree;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLastPart = i === parts.length - 1;

            if (!current[part]) {
                current[part] = isLastPart ? null : {};
            }

            if (!isLastPart) {
                current = current[part];
            }
        }
    }

    return renderTree(tree, '', true);
}

/**
 * Render tree structure as ASCII
 * @param {Object} node - Tree node
 * @param {string} prefix - Current line prefix
 * @param {boolean} isRoot - Whether this is root level
 * @returns {string} ASCII tree string
 */
function renderTree(node, prefix, isRoot) {
    const entries = Object.entries(node).sort(([aName, aValue], [bName, bValue]) => {
        const aIsDir = aValue !== null;
        const bIsDir = bValue !== null;

        if (aIsDir !== bIsDir) {
            return bIsDir ? 1 : -1;
        }

        return aName.localeCompare(bName);
    });

    let result = '';
    const totalEntries = entries.length;

    for (let i = 0; i < totalEntries; i++) {
        const [name, value] = entries[i];
        const isLast = i === totalEntries - 1;
        const isDirectory = value !== null;

        const connector = isRoot ? '' : isLast ? '└── ' : '├── ';
        const extension = isRoot ? '' : isLast ? '    ' : '│   ';

        result += prefix + connector + name + (isDirectory ? '/' : '') + '\n';

        if (isDirectory) {
            result += renderTree(value, prefix + extension, false);
        }
    }

    return result;
}
