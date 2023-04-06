const getBemDirectoryPath = require('./getBemDirectoryPath');
const createBemNaming = require('bem-naming');
const bemNaming = createBemNaming({ elem: '__', mod: { name: '_', val: '_' } });

describe('getBemDirectoryPath', () => {
    test('Возвращает правильный путь папки для блока', () => {
        const entity = bemNaming.parse('block');

        expect(getBemDirectoryPath(entity, bemNaming)).toStrictEqual('');
    });

    test('Возвращает правильный путь папки для модификатора', () => {
        const entity = bemNaming.parse('block_mod_val');

        expect(getBemDirectoryPath(entity, bemNaming)).toStrictEqual('_mod');
    });

    test('Возвращает правильный путь папки для элемента', () => {
        const entity = bemNaming.parse('block__elem');

        expect(getBemDirectoryPath(entity, bemNaming)).toStrictEqual('__elem');
    });

    test('Возвращает правильный путь папки для модификатора элемента', () => {
        const entity = bemNaming.parse('block__elem_mod_val');

        expect(getBemDirectoryPath(entity, bemNaming)).toStrictEqual('__elem/_mod');
    });
});
