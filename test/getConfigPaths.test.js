const { resolve } = require('path');
const getConfigPaths =  require('../lib/getConfigPaths');

jest.mock('fs');

describe('getConfigPaths', () => {
    beforeEach(() => {
        require('fs').__setMockFiles({
            with: {
                bemg: {
                    'config.json': '',
                    templates: {
                        'template_block.tsx': ''
                    }
                },
            },
            without: {
                bemg: {}
            }
        });
    });

    test('Путь к конфигу в папке с bemg', () => {
        expect(getConfigPaths('/with').configPath).toStrictEqual('/with/bemg/config.json');
    });
    
    test('Путь к конфигу в папке c пустым bemg', () => {
        expect(getConfigPaths('/without').configPath).toStrictEqual(resolve('bemg/config.json'));
    });

    test('Путь к шаблонам в папке с bemg', () => {
        expect(getConfigPaths('/with').templatesPath).toStrictEqual('/with/bemg/templates');
    });
    
    test('Путь к шаблонам в папке пустым bemg', () => {
        expect(getConfigPaths('/without').templatesPath).toStrictEqual(resolve('bemg/templates'));
    });
});
