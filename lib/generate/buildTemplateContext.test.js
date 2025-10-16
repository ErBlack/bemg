import { describe, expect, test } from 'vitest';
import { createBemNaming } from '../createBemNaming.js';
import { buildTemplateContext } from './buildTemplateContext.js';

const bemNaming = createBemNaming({ elem: '__', mod: { name: '_', val: '_' } });

describe('buildTemplateContext', () => {
    test('Returns correct templateContext for block', () => {
        const entity = bemNaming.parse('block');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            block: 'block',
            entity: 'block',
        });
    });

    test('Returns correct templateContext for modifier', () => {
        const entity = bemNaming.parse('block_mod_val');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            ModName: 'Mod',
            ModVal: 'Val',
            block: 'block',
            entity: 'block_mod_val',
            modName: 'mod',
            modVal: 'val',
        });
    });

    test('Returns correct templateContext for boolean modifier', () => {
        const entity = bemNaming.parse('block_mod');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            ModName: 'Mod',
            ModVal: true,
            block: 'block',
            entity: 'block_mod',
            modName: 'mod',
            modVal: true,
        });
    });

    test('Returns correct templateContext for element', () => {
        const entity = bemNaming.parse('block__elem');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            Elem: 'Elem',
            block: 'block',
            elem: 'elem',
            entity: 'block__elem',
        });
    });

    test('Returns correct templateContext for element modifier', () => {
        const entity = bemNaming.parse('block__elem_mod_val');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            Elem: 'Elem',
            ModName: 'Mod',
            ModVal: 'Val',
            block: 'block',
            elem: 'elem',
            entity: 'block__elem_mod_val',
            modName: 'mod',
            modVal: 'val',
        });
    });

    test('Returns correct templateContext for boolean element modifier', () => {
        const entity = bemNaming.parse('block__elem_mod');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            Elem: 'Elem',
            ModName: 'Mod',
            ModVal: true,
            block: 'block',
            elem: 'elem',
            entity: 'block__elem_mod',
            modName: 'mod',
            modVal: true,
        });
    });
});
