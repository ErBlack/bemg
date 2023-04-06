const getBemStringByPath = require('./getBemStringByPath');

describe('getBemRoot', () => {
    test('Путь к папке блока для блока', () => {
        expect(getBemStringByPath('/path/to/block', ['_', '_', '__'])).toStrictEqual({
            currentBlockRoot: '/path/to/block',
            currentEntityString: 'block',
        });
    });

    test('Путь к папке блока для элемента', () => {
        expect(getBemStringByPath('/path/to/block/__elem', ['_', '_', '__'])).toStrictEqual({
            currentBlockRoot: '/path/to/block',
            currentEntityString: 'block__elem',
        });
    });

    test('Путь к папке блока для модификатора', () => {
        expect(getBemStringByPath('/path/to/block/_mod', ['_', '_', '__'])).toStrictEqual({
            currentBlockRoot: '/path/to/block',
            currentEntityString: 'block_mod',
        });
    });

    test('Путь к папке блока для модификатора элемента', () => {
        expect(getBemStringByPath('/path/to/block/__elem/_mod', ['_', '_', '__'])).toStrictEqual({
            currentBlockRoot: '/path/to/block',
            currentEntityString: 'block__elem_mod',
        });
    });
});
