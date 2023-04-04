const getDirTemplatesPaths = require('./getDirTemplatesPaths');

jest.mock('fs');

const files = {
    templates: {
        "block.i18n": {
            "block.en.json": '{}',
            dir2: {
                file: 'content'
            }
        }
    }
}

describe('getDirTemplatesPaths', () => {
    test('Возвращает объект с путями до шаблонов', () => {
        fs = require('fs');

        fs.__setMockFiles(files);
        
        const templates = getDirTemplatesPaths('/templates', 'block.i18n', {});
        
        expect(templates).toEqual({
            'block.i18n/block.en.json': {
                block: '/templates/block.i18n/block.en.json'
            },
            "block.i18n/dir2/file": {
                block: '/templates/block.i18n/dir2/file'
            }
        });
    });
});