const getBemRoot = require('../lib/generate/getBemRoot');

describe('getBemRoot', () => {
    test('Путь к папке блока для блока', () => {
        expect(getBemRoot('/path/to/block', 'block')).toStrictEqual('/path/to/block');
    });

    test('Путь к папке блока для элемента', () => {
        expect(getBemRoot('/path/to/block/__elem', 'elem')).toStrictEqual('/path/to/block');
    });

    test('Путь к папке блока для модификатора', () => {
        expect(getBemRoot('/path/to/block/_mod', 'blockMod')).toStrictEqual('/path/to/block');
    });

    test('Путь к папке блока для модификатора элемента', () => {
        expect(getBemRoot('/path/to/block/__elem/_mod', 'elemMod')).toStrictEqual('/path/to/block');
    });
});
