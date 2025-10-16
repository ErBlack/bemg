/**
 * Converts a string to PascalCase
 * @param {string} str - String to convert (supports kebab-case, snake_case, space separated)
 * @returns {string} PascalCase string
 */
export function pascalCase(str) {
    if (typeof str !== 'string') {
        return '';
    }

    return str
        .replace(/[_\-\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
        .replace(/^[a-z]/, (char) => char.toUpperCase());
}
