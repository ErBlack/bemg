/**
 * Converts a string to kebab-case
 * @param {string} str - String to convert (supports camelCase, PascalCase, snake_case, space separated)
 * @returns {string} kebab-case string
 */
export function kebabCase(str) {
    if (typeof str !== 'string') {
        return '';
    }

    return str
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase();
}
