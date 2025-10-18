import { describe, it, expect } from 'vitest';
import { suggestNextSteps, IMPLEMENTATION_STEPS, ADD_SUGGESTIONS } from './suggestNextSteps.js';

const mockConfig = {
    config: {
        naming: {
            delims: {
                elem: '__',
                mod: { name: '_', val: '_' },
            },
        },
    },
    templates: {
        tsx: {
            block: () => '',
            elem: () => '',
            blockMod: () => '',
            elemMod: () => '',
        },
        css: {
            block: () => '',
            elem: () => '',
            blockMod: () => '',
            elemMod: () => '',
        },
        stories: {
            block: () => '',
        },
        test: {
            block: () => '',
        },
    },
};

describe('suggestNextSteps', () => {
    it('should suggest next steps for block', () => {
        const createdFiles = [
            {
                creatingEntityType: 'block',
                creatingEntityString: 'button',
                creatingEntity: { block: 'button' },
                templateType: 'tsx',
                creatingFilePath: '/button/button.tsx',
            },
            {
                creatingEntityType: 'block',
                creatingEntityString: 'button',
                creatingEntity: { block: 'button' },
                templateType: 'css',
                creatingFilePath: '/button/button.css',
            },
        ];

        const suggestions = suggestNextSteps(createdFiles, mockConfig);

        expect(suggestions).toEqual([
            {
                type: 'implement_block',
                entity: 'button',
                title: "Next steps for block 'button':",
                steps: IMPLEMENTATION_STEPS.block,
            },
            {
                type: 'also_available_types',
                entity: 'button',
                message: "You can also create file types for block 'button': stories, test",
                availableTypes: ['stories', 'test'],
            },
            ADD_SUGGESTIONS.element,
            ADD_SUGGESTIONS.modifier,
        ]);
    });

    it('should suggest next steps for elem', () => {
        const createdFiles = [
            {
                creatingEntityType: 'elem',
                creatingEntityString: 'button__icon',
                creatingEntity: { block: 'button', elem: 'icon' },
                templateType: 'tsx',
                creatingFilePath: '/button/__icon/button__icon.tsx',
            },
        ];

        const suggestions = suggestNextSteps(createdFiles, mockConfig);

        expect(suggestions).toEqual([
            {
                type: 'implement_elem',
                entity: 'button__icon',
                title: "Next steps for elem 'button__icon':",
                steps: IMPLEMENTATION_STEPS.elem,
            },
            {
                type: 'also_available_types',
                entity: 'button__icon',
                message: "You can also create file types for elem 'button__icon': css",
                availableTypes: ['css'],
            },
            ADD_SUGGESTIONS.modifier,
        ]);
    });

    it('should suggest next steps for blockMod', () => {
        const createdFiles = [
            {
                creatingEntityType: 'blockMod',
                creatingEntityString: 'button_primary',
                creatingEntity: { block: 'button', modName: 'primary', modVal: true },
                templateType: 'css',
                creatingFilePath: '/button/_primary/button_primary.css',
            },
        ];

        const suggestions = suggestNextSteps(createdFiles, mockConfig);

        expect(suggestions).toEqual([
            {
                type: 'implement_blockMod',
                entity: 'button_primary',
                title: "Next steps for blockMod 'button_primary':",
                steps: IMPLEMENTATION_STEPS.blockMod,
            },
            {
                type: 'also_available_types',
                entity: 'button_primary',
                message: "You can also create file types for blockMod 'button_primary': tsx",
                availableTypes: ['tsx'],
            },
            ADD_SUGGESTIONS.element,
            ADD_SUGGESTIONS.modifier,
        ]);
    });

    it('should suggest next steps for elemMod', () => {
        const createdFiles = [
            {
                creatingEntityType: 'elemMod',
                creatingEntityString: 'button__icon_disabled',
                creatingEntity: { block: 'button', elem: 'icon', modName: 'disabled', modVal: true },
                templateType: 'tsx',
                creatingFilePath: '/button/__icon/_disabled/button__icon_disabled.tsx',
            },
        ];

        const suggestions = suggestNextSteps(createdFiles, mockConfig);

        expect(suggestions).toEqual([
            {
                type: 'implement_elemMod',
                entity: 'button__icon_disabled',
                title: "Next steps for elemMod 'button__icon_disabled':",
                steps: IMPLEMENTATION_STEPS.elemMod,
            },
            {
                type: 'also_available_types',
                entity: 'button__icon_disabled',
                message: "You can also create file types for elemMod 'button__icon_disabled': css",
                availableTypes: ['css'],
            },
            ADD_SUGGESTIONS.element,
            ADD_SUGGESTIONS.modifier,
        ]);
    });

    it('should not suggest element when element was created', () => {
        const createdFiles = [
            {
                creatingEntityType: 'elem',
                creatingEntityString: 'button__icon',
                creatingEntity: { block: 'button', elem: 'icon' },
                templateType: 'tsx',
                creatingFilePath: '/button/__icon/button__icon.tsx',
            },
        ];

        const suggestions = suggestNextSteps(createdFiles, mockConfig);

        expect(suggestions).not.toContainEqual(expect.objectContaining({ type: 'add_element' }));
    });

    it('should not suggest modifier when both block and element modifiers were created', () => {
        const createdFiles = [
            {
                creatingEntityType: 'blockMod',
                creatingEntityString: 'button_size_large',
                creatingEntity: { block: 'button', modName: 'size', modVal: 'large' },
                templateType: 'tsx',
                creatingFilePath: '/button/_size/button_size_large.tsx',
            },
            {
                creatingEntityType: 'elemMod',
                creatingEntityString: 'button__icon_disabled',
                creatingEntity: { block: 'button', elem: 'icon', modName: 'disabled', modVal: true },
                templateType: 'tsx',
                creatingFilePath: '/button/__icon/_disabled/button__icon_disabled.tsx',
            },
        ];

        const suggestions = suggestNextSteps(createdFiles, mockConfig);

        expect(suggestions).not.toContainEqual(expect.objectContaining({ type: 'add_modifier' }));
    });
});
