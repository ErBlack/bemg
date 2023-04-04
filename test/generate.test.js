const generate = require('../lib/generate');
const config = require('../bemg/config.json');

const bemg = {
    'config.json': JSON.stringify(config),
    templates: {
        'template_block.tsx': '${block} ${Block} ${entity}',
        'template_elem.tsx': '${block} ${Block} ${elem} ${Elem} ${entity}',
        'template_blockMod.tsx': '${block} ${Block} ${modName} ${ModName} ${modVal} ${ModVal} ${entity}',
        'template_elemMod.tsx': '${block} ${Block} ${elem} ${Elem} ${modName} ${ModName} ${modVal} ${ModVal} ${entity}'
    }
}

jest.mock('fs');

describe('generate', () => {
    test('Создаёт файл для блока', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {}
        });

        generate({
            targetPath: '/block',
            types: ['tsx']
        });

        expect(require('fs').__getMockFiles()['/block/block.tsx']).toEqual('block Block block');
    });

    test('Создаёт файл для элемента в папке блока', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {}
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
            items: ['__elem']
        });

        expect(require('fs').__getMockFiles()['/block/__elem/block__elem.tsx']).toEqual('block Block elem Elem block__elem');
    });

    test('Создаёт файл для модификатора блока в папке блока', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {}
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
            items: ['_mod_val']
        });

        expect(require('fs').__getMockFiles()['/block/_mod/block_mod_val.tsx']).toEqual('block Block mod Mod val Val block_mod_val');
    });

    test('Создаёт файл для модификатора элемента в папке блока', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {}
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
            items: ['__elem_mod_val']
        });

        expect(require('fs').__getMockFiles()['/block/__elem/_mod/block__elem_mod_val.tsx']).toEqual('block Block elem Elem mod Mod val Val block__elem_mod_val');
    });

    test('Создаёт файл для элемента в папке элемента', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {
                __elem: {}
            }
        });

        generate({
            targetPath: '/block/__elem',
            types: ['tsx']
        });

        expect(require('fs').__getMockFiles()['/block/__elem/block__elem.tsx']).toEqual('block Block elem Elem block__elem');
    });

    test('Создаёт файл для модификатора блока в папке модификатора', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {
                _mod: {}
            }
        });

        generate({
            targetPath: '/block/_mod',
            types: ['tsx'],
            items: ['_val']
        });

        expect(require('fs').__getMockFiles()['/block/_mod/block_mod_val.tsx']).toEqual('block Block mod Mod val Val block_mod_val');
    });

    test('Создаёт файл для модификатора элемента в папке элемента', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {
                __elem: {}
            }
        });

        generate({
            targetPath: '/block/__elem',
            types: ['tsx'],
            items: ['_mod_val']
        });

        expect(require('fs').__getMockFiles()['/block/__elem/_mod/block__elem_mod_val.tsx']).toEqual('block Block elem Elem mod Mod val Val block__elem_mod_val');
    });

    test('Создаёт файл для модификатора элемента в папке модификатора элемента', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {
                __elem: {
                    _mod: {}
                }
            }
        });

        generate({
            targetPath: '/block/__elem/_mod',
            types: ['tsx'],
            items: ['_val']
        });

        expect(require('fs').__getMockFiles()['/block/__elem/_mod/block__elem_mod_val.tsx']).toEqual('block Block elem Elem mod Mod val Val block__elem_mod_val');
    });

        test('Правильно создаёт boolean модификатор', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {
                __elem: {
                    _mod: {}
                }
            }
        });

        generate({
            targetPath: '/block/__elem',
            types: ['tsx'],
            items: ['_mod']
        });

        expect(require('fs').__getMockFiles()['/block/__elem/_mod/block__elem_mod.tsx']).toEqual('block Block elem Elem mod Mod true true block__elem_mod');
    });

    test('Не перетирает файл блока', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {
                'block.tsx': 'foo'
            }
        });

        generate({
            targetPath: '/block',
            types: ['tsx']
        });

        expect(require('fs').__getMockFiles()['/block/block.tsx']).toEqual('foo');
    });

    test('Не создаёт файл в режиме dryRun', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg,
            block: {}
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
            dryRun: true
        });

        expect(require('fs').__getMockFiles()['/block/block.tsx']).not.toBeDefined();
    });

    test('Применяет конфиг нейминга', () => {
        fs = require('fs');

        fs.__setMockFiles({
            bemg: {
                ...bemg,
                'config.json': JSON.stringify({
                    ...config,
                    naming: {
                        elem: '::',
                        mod: { name: ':', val: ':' }
                    }
                })
            },
            block: {
                '::elem': {
                    ':mod': {}
                }
            }
        });


        generate({
            targetPath: '/block/::elem/:mod',
            types: ['tsx'],
            items: [':val']
        });

        expect(require('fs').__getMockFiles()['/block/::elem/:mod/block::elem:mod:val.tsx']).toEqual('block Block elem Elem mod Mod val Val block::elem:mod:val');
    });
});
