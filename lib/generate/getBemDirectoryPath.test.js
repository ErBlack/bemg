import { describe, expect, test } from 'vitest';

import { getBemDirectoryPath } from './getBemDirectoryPath.js';
import { createBemNaming } from '../createBemNaming.js';

const bemNaming = createBemNaming({ elem: '__', mod: { name: '_', val: '_' } });

describe('getBemDirectoryPath', () => {
    test('Returns correct folder path for block', () => {
        const entity = bemNaming.parse('block');

        expect(getBemDirectoryPath(entity, bemNaming)).toStrictEqual('');
    });

    test('Returns correct folder path for modifier', () => {
        const entity = bemNaming.parse('block_mod_val');

        expect(getBemDirectoryPath(entity, bemNaming)).toStrictEqual('_mod');
    });

    test('Returns correct folder path for element', () => {
        const entity = bemNaming.parse('block__elem');

        expect(getBemDirectoryPath(entity, bemNaming)).toStrictEqual('__elem');
    });

    test('Returns correct folder path for element modifier', () => {
        const entity = bemNaming.parse('block__elem_mod_val');

        expect(getBemDirectoryPath(entity, bemNaming)).toStrictEqual('__elem/_mod');
    });
});
