import { TYPES } from '../../createBemNaming.js';

export const IMPLEMENTATION_STEPS = {
    block: ['Verify imports', 'Write implementation logic', 'Add styles', 'Create stories', 'Import and use elements'],
    elem: ['Verify imports', 'Write implementation logic', 'Add styles', 'Import and use element in parent block'],
    blockMod: ['Add modifier styles', 'Apply modifier in block component', 'Add modifier prop to block types'],
    elemMod: ['Add modifier styles', 'Apply modifier in element component', 'Add modifier prop to element interface'],
};

export const ADD_SUGGESTIONS = {
    element: {
        type: 'add_element',
        message: 'Consider adding elements (e.g., __icon, __text, __label)',
        example: '__icon',
    },
    modifier: {
        type: 'add_modifier',
        message: 'Consider adding modifiers (e.g., _size_large, _disabled, _theme_dark)',
        example: '_size_large',
    },
};

const bemTypes = new Set(Object.values(TYPES));

/**
 * @typedef {Object} NamingDelims
 * @property {string} elem - Element delimiter (e.g., '__')
 * @property {Object} mod - Modifier delimiters
 * @property {string} mod.name - Modifier name delimiter (e.g., '_')
 * @property {string} mod.val - Modifier value delimiter (e.g., '_')
 */

/**
 * @typedef {() => string} TemplateFunction
 */

/**
 * @typedef {Object} TemplateTypeSupport
 * @property {TemplateFunction} [block] - Template function for blocks
 * @property {TemplateFunction} [elem] - Template function for elements
 * @property {TemplateFunction} [blockMod] - Template function for block modifiers
 * @property {TemplateFunction} [elemMod] - Template function for element modifiers
 */

/**
 * @typedef {Object.<string, TemplateTypeSupport>} Templates
 */

/**
 * @typedef {Object} Config
 * @property {Object} config - Configuration object
 * @property {import('../../createBemNaming.js').NamingOptions} config.naming - Naming conventions configuration
 * @property {Templates} templates - Template functions for different BEM entity types
 */

const createStatisticsRecord = () => ({
    availableTemplates: new Set(),
    usedTemplates: new Set(),
    entities: new Set(),
});

/**
 * Suggest next steps based on created files
 * @param {Array<{creatingEntityString: string, creatingEntityType: import('../../createBemNaming.js').BemEntityType, creatingEntity: import('../../createBemNaming.js').BemEntity, templateType: string, creatingFilePath: string}>} createdFiles
 * @param {Config} config - Config object with naming and templates
 * @returns {Array} Array of suggestion objects
 */
export function suggestNextSteps(createdFiles, { config, templates }) {
    const statistics = {
        [TYPES.block]: createStatisticsRecord(),
        [TYPES.elem]: createStatisticsRecord(),
        [TYPES.blockMod]: createStatisticsRecord(),
        [TYPES.elemMod]: createStatisticsRecord(),
    };

    Object.entries(templates).forEach(([template, functions]) => {
        if (!functions) return;
        Object.keys(functions).forEach((bemType) => {
            statistics[bemType].availableTemplates.add(template);
        });
    });

    const unusedBemTypes = new Set(bemTypes);

    createdFiles.forEach(({ creatingEntityType, creatingEntityString, templateType }) => {
        statistics[creatingEntityType].usedTemplates.add(templateType);
        statistics[creatingEntityType].entities.add(creatingEntityString);

        unusedBemTypes.delete(creatingEntityType);
    });

    const suggestions = [];

    for (const [bemType, { availableTemplates, usedTemplates, entities }] of Object.entries(statistics)) {
        if (usedTemplates.size === 0) continue;

        const additionalTypes = Array.from(availableTemplates.difference(usedTemplates));

        for (const entity of entities) {
            suggestions.push({
                type: `implement_${bemType}`,
                entity,
                title: `Next steps for ${bemType} '${entity}':`,
                steps: IMPLEMENTATION_STEPS[bemType],
            });

            if (additionalTypes.length > 0) {
                suggestions.push({
                    type: 'also_available_types',
                    entity,
                    message: `You can also create file types for ${bemType} '${entity}': ${additionalTypes.join(', ')}`,
                    availableTypes: additionalTypes,
                });
            }
        }
    }

    if (unusedBemTypes.has('elem')) {
        suggestions.push(ADD_SUGGESTIONS.element);
    }

    if (unusedBemTypes.has('blockMod') || unusedBemTypes.has('elemMod')) {
        suggestions.push(ADD_SUGGESTIONS.modifier);
    }

    return suggestions;
}
