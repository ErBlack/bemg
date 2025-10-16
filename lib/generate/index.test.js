import { describe, expect, test, vi } from 'vitest';
import config from '../../bemg/config.json' assert { type: 'json' };

vi.mock('fs');

const fs = await import('fs');
const { generate } = await import('./index.js');

const bemg = {
    'config.json': JSON.stringify(config),
    templates: {
        'template_block.tsx': '${block} ${Block} ${entity}',
        'template_elem.tsx': '${block} ${Block} ${elem} ${Elem} ${entity}',
        'template_blockMod.tsx': '${block} ${Block} ${modName} ${ModName} ${modVal} ${ModVal} ${entity}',
        'template_elemMod.tsx': '${block} ${Block} ${elem} ${Elem} ${modName} ${ModName} ${modVal} ${ModVal} ${entity}',
        'block.hooks': {
            'use.ts': '${block} ${Block} ${entity}',
        },
    },
};

describe('generate', () => {
    test('Creates file for block', () => {
        fs.__setMockFiles({
            bemg,
            block: {},
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
        });

        expect(fs.__getMockFiles()['/block/block.tsx']).toEqual('block Block block');
    });

    test('Creates file for element in block folder', () => {
        fs.__setMockFiles({
            bemg,
            block: {},
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
            items: ['__elem'],
        });

        expect(fs.__getMockFiles()['/block/__elem/block__elem.tsx']).toEqual('block Block elem Elem block__elem');
    });

    test('Creates file for block modifier in block folder', () => {
        fs.__setMockFiles({
            bemg,
            block: {},
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
            items: ['_mod_val'],
        });

        expect(fs.__getMockFiles()['/block/_mod/block_mod_val.tsx']).toEqual(
            'block Block mod Mod val Val block_mod_val',
        );
    });

    test('Creates file for element modifier in block folder', () => {
        fs.__setMockFiles({
            bemg,
            block: {},
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
            items: ['__elem_mod_val'],
        });

        expect(fs.__getMockFiles()['/block/__elem/_mod/block__elem_mod_val.tsx']).toEqual(
            'block Block elem Elem mod Mod val Val block__elem_mod_val',
        );
    });

    test('Creates file for element in element folder', () => {
        fs.__setMockFiles({
            bemg,
            block: {
                __elem: {},
            },
        });

        generate({
            targetPath: '/block/__elem',
            types: ['tsx'],
        });

        expect(fs.__getMockFiles()['/block/__elem/block__elem.tsx']).toEqual('block Block elem Elem block__elem');
    });

    test('Creates file for block modifier in modifier folder', () => {
        fs.__setMockFiles({
            bemg,
            block: {
                _mod: {},
            },
        });

        generate({
            targetPath: '/block/_mod',
            types: ['tsx'],
            items: ['_val'],
        });

        expect(fs.__getMockFiles()['/block/_mod/block_mod_val.tsx']).toEqual(
            'block Block mod Mod val Val block_mod_val',
        );
    });

    test('Creates file for element modifier in element folder', () => {
        fs.__setMockFiles({
            bemg,
            block: {
                __elem: {},
            },
        });

        generate({
            targetPath: '/block/__elem',
            types: ['tsx'],
            items: ['_mod_val'],
        });

        expect(fs.__getMockFiles()['/block/__elem/_mod/block__elem_mod_val.tsx']).toEqual(
            'block Block elem Elem mod Mod val Val block__elem_mod_val',
        );
    });

    test('Creates file for element modifier in element modifier folder', () => {
        fs.__setMockFiles({
            bemg,
            block: {
                __elem: {
                    _mod: {},
                },
            },
        });

        generate({
            targetPath: '/block/__elem/_mod',
            types: ['tsx'],
            items: ['_val'],
        });

        expect(fs.__getMockFiles()['/block/__elem/_mod/block__elem_mod_val.tsx']).toEqual(
            'block Block elem Elem mod Mod val Val block__elem_mod_val',
        );
    });

    test('Correctly creates boolean modifier', () => {
        fs.__setMockFiles({
            bemg,
            block: {
                __elem: {
                    _mod: {},
                },
            },
        });

        generate({
            targetPath: '/block/__elem',
            types: ['tsx'],
            items: ['_mod'],
        });

        expect(fs.__getMockFiles()['/block/__elem/_mod/block__elem_mod.tsx']).toEqual(
            'block Block elem Elem mod Mod true true block__elem_mod',
        );
    });

    test('Does not overwrite block file', () => {
        fs.__setMockFiles({
            bemg,
            block: {
                'block.tsx': 'foo',
            },
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
        });

        expect(fs.__getMockFiles()['/block/block.tsx']).toEqual('foo');
    });

    test('Does not create file in dryRun mode', () => {
        fs.__setMockFiles({
            bemg,
            block: {},
        });

        generate({
            targetPath: '/block',
            types: ['tsx'],
            dryRun: true,
        });

        expect(fs.__getMockFiles()['/block/block.tsx']).toBeUndefined();
    });

    test('Applies naming config', () => {
        fs.__setMockFiles({
            bemg: {
                ...bemg,
                'config.json': JSON.stringify({
                    ...config,
                    naming: {
                        elem: '::',
                        mod: { name: ':', val: ':' },
                    },
                }),
            },
            block: {
                '::elem': {
                    ':mod': {},
                },
            },
        });

        generate({
            targetPath: '/block/::elem/:mod',
            types: ['tsx'],
            items: [':val'],
        });

        expect(fs.__getMockFiles()['/block/::elem/:mod/block::elem:mod:val.tsx']).toEqual(
            'block Block elem Elem mod Mod val Val block::elem:mod:val',
        );
    });

    test('Creates nested folders', () => {
        fs.__setMockFiles({
            bemg,
            block: {},
        });

        generate({
            targetPath: '/block',
            types: ['block.hooks/use.ts'],
        });

        expect(fs.__getMockFiles()['/block/block.hooks/use.ts']).toEqual('block Block block');
    });

    test('Creates block in new folder when name is provided', () => {
        fs.__setMockFiles({
            bemg,
        });

        generate({
            targetPath: '/',
            types: ['tsx'],
            name: 'newblock',
        });

        expect(fs.__getMockFiles()['/newblock/newblock.tsx']).toEqual('newblock Newblock newblock');
    });

    test('Creates multiple items in new block folder when name is provided', () => {
        fs.__setMockFiles({
            bemg,
        });

        generate({
            targetPath: '/',
            types: ['tsx'],
            items: ['', '__elem', '_mod_val'],
            name: 'newblock',
        });

        expect(fs.__getMockFiles()['/newblock/newblock.tsx']).toEqual('newblock Newblock newblock');
        expect(fs.__getMockFiles()['/newblock/__elem/newblock__elem.tsx']).toEqual(
            'newblock Newblock elem Elem newblock__elem',
        );
        expect(fs.__getMockFiles()['/newblock/_mod/newblock_mod_val.tsx']).toEqual(
            'newblock Newblock mod Mod val Val newblock_mod_val',
        );
    });

    test('Creates nested folders in new block when name is provided', () => {
        fs.__setMockFiles({
            bemg,
        });

        generate({
            targetPath: '/',
            types: ['block.hooks/use.ts'],
            name: 'newblock',
        });

        expect(fs.__getMockFiles()['/newblock/newblock.hooks/use.ts']).toEqual('newblock Newblock newblock');
    });

    test('Throws error when name is not a valid block name', () => {
        fs.__setMockFiles({
            bemg,
        });

        expect(() => {
            generate({
                targetPath: '/',
                types: ['tsx'],
                name: 'block__elem',
            });
        }).toThrow('Given name "block__elem" is not valid block name');
    });

    test('Throws error when name is not a valid BEM name', () => {
        fs.__setMockFiles({
            bemg,
        });

        expect(() => {
            generate({
                targetPath: '/',
                types: ['tsx'],
                name: 'Invalid-Name!',
            });
        }).toThrow('Given name "Invalid-Name!" is not valid bem name');
    });
});
