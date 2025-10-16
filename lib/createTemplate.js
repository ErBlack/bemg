/**
 * Creates a template function that replaces ${variable} patterns with values from a data object
 * @param {string} templateString - Template string with ${variable} patterns
 * @returns {(data: Record<string, any>) => string} Function that accepts data and returns interpolated string
 */
export function createTemplate(templateString) {
    if (typeof templateString !== 'string') {
        throw new Error('Template must be a string');
    }

    /**
     * @param {Record<string, any>} data - Data object with values for template variables
     * @returns {string} Interpolated string
     */
    return function (data) {
        return templateString.replace(/\$\{([^}]+)\}/g, (match, key) => {
            const value = data[key];
            return value !== undefined ? String(value) : match;
        });
    };
}
