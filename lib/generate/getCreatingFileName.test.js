import { describe, expect, test } from 'vitest';
import { getCreatingFileName } from './getCreatingFileName.js';

describe('getCreatingFileName', () => {
    test('Builds file name for a bem entity', () => {
        expect(getCreatingFileName('css', 'button', 'button__icon')).toBe('button__icon.css');
    });

    test('Builds file name for a named item', () => {
        expect(getCreatingFileName('ts', 'button', 'longPress', true)).toBe('long-press.ts');
    });

    test('Substitutes block name in a nested template path', () => {
        expect(getCreatingFileName('block.i18n/block.en.json', 'button', 'button')).toBe('button.i18n/button.en.json');
    });

    test('Substitutes both placeholders in a nested named item template path', () => {
        expect(getCreatingFileName('block.hooks/use-namedItem.ts', 'button', 'longPress', true)).toBe(
            'button.hooks/use-long-press.ts',
        );
    });

    test('Does not substitute a named item into the block name', () => {
        expect(getCreatingFileName('block.hooks/use-namedItem.ts', 'namedItem', 'longPress', true)).toBe(
            'namedItem.hooks/use-long-press.ts',
        );
    });

    test('Does not substitute a block name into the named item', () => {
        expect(getCreatingFileName('block.hooks/use-namedItem.ts', 'button', 'blockList', true)).toBe(
            'button.hooks/use-block-list.ts',
        );
    });
});
