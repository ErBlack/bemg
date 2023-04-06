const buildTemplateContext = require('./buildTemplateContext');
const createBemNaming = require('bem-naming');
const bemNaming = createBemNaming({ elem: '__', mod: { name: '_', val: '_' } });

jest.mock('username', () => ({
    sync: () => 'user',
}));

describe('buildTemplateContext', () => {
    test('Возвращает правильный templateContext для блока', () => {
        const entity = bemNaming.parse('block');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            block: 'block',
            entity: 'block',
            user: 'user',
        });
    });

    test('Возвращает правильный templateContext для модификатора', () => {
        const entity = bemNaming.parse('block_mod_val');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            ModName: 'Mod',
            ModVal: 'Val',
            block: 'block',
            entity: 'block_mod_val',
            modName: 'mod',
            modVal: 'val',
            user: 'user',
        });
    });

    test('Возвращает правильный templateContext для boolean модификатора', () => {
        const entity = bemNaming.parse('block_mod');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            ModName: 'Mod',
            ModVal: true,
            block: 'block',
            entity: 'block_mod',
            modName: 'mod',
            modVal: true,
            user: 'user',
        });
    });

    test('Возвращает правильный templateContext для элемента', () => {
        const entity = bemNaming.parse('block__elem');

        expect(buildTemplateContext(entity, bemNaming)).toStrictEqual({
            Block: 'Block',
            Elem: 'Elem',
            block: 'block',
            elem: 'elem',
            entity: 'block__elem',
            user: 'user',
        });
    });

    test('Возвращает правильный templateContext для модификатора элемента', () => {
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
            user: 'user',
        });
    });

    test('Возвращает правильный templateContext для boolean модификатора элемента', () => {
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
            user: 'user',
        });
    });
});
