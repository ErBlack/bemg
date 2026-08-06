import { describe, it, expect } from 'vitest';
import { camelCase } from './camelCase.js';

describe('camelCase', () => {
    it('should convert kebab-case to camelCase', () => {
        expect(camelCase('long-press')).toBe('longPress');
        expect(camelCase('foo-bar-baz')).toBe('fooBarBaz');
    });

    it('should convert snake_case and space separated to camelCase', () => {
        expect(camelCase('foo_bar')).toBe('fooBar');
        expect(camelCase('foo bar')).toBe('fooBar');
    });

    it('should convert PascalCase to camelCase', () => {
        expect(camelCase('LongPress')).toBe('longPress');
    });

    it('should keep camelCase strings as is', () => {
        expect(camelCase('longPress')).toBe('longPress');
        expect(camelCase('foo')).toBe('foo');
    });

    it('should return empty string for non string input', () => {
        expect(camelCase(undefined)).toBe('');
    });
});
