const getTemplatesPaths = require('./getTemplatesPaths');

jest.mock('fs');

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
    test('Возвращает объект с путями до шаблонов', () => {
        fs = require('fs');

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
