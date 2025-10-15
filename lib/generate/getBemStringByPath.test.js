import { describe, expect, test } from 'vitest';

import { getBemStringByPath } from './getBemStringByPath.js';

describe('getBemRoot', () => {
    test('Path to block folder for block', () => {
        expect(getBemStringByPath('/path/to/block', ['_', '_', '__'])).toStrictEqual({
            currentBlockRoot: '/path/to/block',
            currentEntityString: 'block',
        });
    });

    test('Path to block folder for element', () => {
        expect(getBemStringByPath('/path/to/block/__elem', ['_', '_', '__'])).toStrictEqual({
            currentBlockRoot: '/path/to/block',
            currentEntityString: 'block__elem',
        });
    });

    test('Path to block folder for modifier', () => {
        expect(getBemStringByPath('/path/to/block/_mod', ['_', '_', '__'])).toStrictEqual({
            currentBlockRoot: '/path/to/block',
            currentEntityString: 'block_mod',
        });
    });

    test('Path to block folder for element modifier', () => {
        expect(getBemStringByPath('/path/to/block/__elem/_mod', ['_', '_', '__'])).toStrictEqual({
            currentBlockRoot: '/path/to/block',
            currentEntityString: 'block__elem_mod',
        });
    });
});
