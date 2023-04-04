const { naming } = require('../../bemg/config');
const getBemStringByPath = require('./getBemStringByPath');

describe('getBemRoot', () => {
    test('Путь к папке блока для блока', () => {
        expect(getBemStringByPath('/path/to/block', naming)).toStrictEqual('block');
    });

    test('Путь к папке блока для элемента', () => {
        expect(getBemStringByPath('/path/to/block/__elem', naming)).toStrictEqual('block__elem');
    });

    test('Путь к папке блока для модификатора', () => {
        expect(getBemStringByPath('/path/to/block/_mod', naming)).toStrictEqual('block_mod');
    });

    test('Путь к папке блока для модификатора элемента', () => {
        expect(getBemStringByPath('/path/to/block/__elem/_mod', naming)).toStrictEqual('block__elem_mod');
    });
});
