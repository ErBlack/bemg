const { resolve } = require('path');
const getConfigPaths =  require('../lib/getConfigPaths');

const withBemg = `${__dirname}/with`;
const withoutBemg = `${__dirname}/without`;

describe('getConfigPaths', () => {
    test('Конфиг в папке с bemg', () => {
        expect(getConfigPaths(withBemg)).toStrictEqual({
            aliases: `${withBemg}/bemg/aliases.json`,
            templates: `${withBemg}/bemg/templates`
        });
    });
    
    test('Конфиг в папке пустым bemg', () => {
        expect(getConfigPaths(withoutBemg)).toStrictEqual({
            aliases: resolve('bemg/aliases.json'),
            templates: resolve('bemg/templates')
        });
    });
});