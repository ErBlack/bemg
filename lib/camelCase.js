import { pascalCase } from './pascalCase.js';

/**
 * Converts a string to camelCase
 * @param {string} str - String to convert (supports kebab-case, snake_case, PascalCase, space separated)
 * @returns {string} camelCase string
 */
export function camelCase(str) {
    return pascalCase(str).replace(/^[A-Z]/, (char) => char.toLowerCase());
}
