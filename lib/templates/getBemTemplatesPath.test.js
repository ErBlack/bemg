const getBemTemplatesPath = require('./getBemTemplatesPath');

jest.mock('fs');

const files = {
    templates: {
        'template_block.tsx': '',
    }
}

describe('getBemTemplatesPaths', () => {
    test('Возвращает объект с шаблонами', () => {
        fs = require('fs');

        fs.__setMockFiles(files);

        const templates = getBemTemplatesPath('/templates', 'template_block.tsx', {});

        expect(templates).toEqual({
            tsx: {
                "block": "/templates/template_block.tsx"
            }
        });
    });
});