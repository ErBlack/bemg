import { describe, it, expect } from 'vitest';
import { pascalCase } from './pascalCase.js';

describe('pascalCase', () => {
    it('should convert kebab-case to PascalCase', () => {
        expect(pascalCase('foo-bar')).toBe('FooBar');
        expect(pascalCase('foo-bar-baz')).toBe('FooBarBaz');
    });

    it('should convert snake_case to PascalCase', () => {
        expect(pascalCase('foo_bar')).toBe('FooBar');
        expect(pascalCase('foo_bar_baz')).toBe('FooBarBaz');
    });

    it('should convert space separated to PascalCase', () => {
        expect(pascalCase('foo bar')).toBe('FooBar');
        expect(pascalCase('foo bar baz')).toBe('FooBarBaz');
    });

    it('should handle mixed delimiters', () => {
        expect(pascalCase('foo-bar_baz qux')).toBe('FooBarBazQux');
    });

    it('should handle already PascalCase strings', () => {
        expect(pascalCase('FooBar')).toBe('FooBar');
        expect(pascalCase('FooBarBaz')).toBe('FooBarBaz');
    });

    it('should handle camelCase strings', () => {
        expect(pascalCase('fooBar')).toBe('FooBar');
        expect(pascalCase('fooBarBaz')).toBe('FooBarBaz');
    });

    it('should handle single word', () => {
        expect(pascalCase('foo')).toBe('Foo');
        expect(pascalCase('Foo')).toBe('Foo');
    });
});
