const { resolve } = require('path');
const { getConfigPath, getTemplatesDirPath } =  require('../lib/getConfigPaths');

const withBemg = `${__dirname}/with`;
const withoutBemg = `${__dirname}/without`;

describe('getConfigPaths', () => {
    describe('getConfigPath', () => {
        test('Конфиг в папке с bemg', () => {
            expect(getConfigPath(withBemg)).toStrictEqual(`${withBemg}/bemg/bemg.config.js`);
        });
        
        test('Конфиг в папке пустым bemg', () => {
            expect(getConfigPath(withoutBemg)).toStrictEqual(resolve('bemg/bemg.config.js'));
        });
    });
    
    describe('getTemplatesDirPath', () => {
        test('Конфиг в папке с bemg', () => {
            expect(getTemplatesDirPath(withBemg)).toStrictEqual(`${withBemg}/bemg/templates`);
        });
        
        test('Конфиг в папке пустым bemg', () => {
            expect(getTemplatesDirPath(withoutBemg)).toStrictEqual(resolve('bemg/templates'));
        });
    });
});