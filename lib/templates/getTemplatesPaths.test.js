import { describe, expect, test, vi } from 'vitest';

import { getTemplatesPaths } from './getTemplatesPaths.js';

vi.mock('fs');

const fs = await import('fs');

const files = {
    templates: {
        'template_block.tsx': '',
        'template_elem.tsx': '',
        'template_blockMod.tsx': '',
        'template_elemMod.tsx': '',
        'block.i18n': {
            'block.en.json': '',
        },
    },
};

describe('getTemplatesPaths', () => {
    test('Returns object with paths to templates', () => {
        fs.__setMockFiles(files);

        const templates = getTemplatesPaths('/templates');

        expect(templates).toEqual({
            tsx: {
                block: '/templates/template_block.tsx',
                elem: '/templates/template_elem.tsx',
                blockMod: '/templates/template_blockMod.tsx',
                elemMod: '/templates/template_elemMod.tsx',
            },
            'block.i18n/block.en.json': {
                block: '/templates/block.i18n/block.en.json',
            },
        });
    });
});
