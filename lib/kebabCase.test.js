import { describe, it, expect } from 'vitest';
import { kebabCase } from './kebabCase.js';

describe('kebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
        expect(kebabCase('useHookName')).toBe('use-hook-name');
        expect(kebabCase('fooBar')).toBe('foo-bar');
    });

    it('should convert PascalCase to kebab-case', () => {
        expect(kebabCase('UseHookName')).toBe('use-hook-name');
        expect(kebabCase('FooBar')).toBe('foo-bar');
    });

    it('should keep kebab-case strings as is', () => {
        expect(kebabCase('use-hook-name')).toBe('use-hook-name');
        expect(kebabCase('foo')).toBe('foo');
    });

    it('should convert snake_case and space separated to kebab-case', () => {
        expect(kebabCase('foo_bar_baz')).toBe('foo-bar-baz');
        expect(kebabCase('foo bar')).toBe('foo-bar');
    });

    it('should split acronyms on the last uppercase letter', () => {
        expect(kebabCase('useHTTPClient')).toBe('use-http-client');
    });

    it('should keep digits attached to the preceding word', () => {
        expect(kebabCase('useHook2')).toBe('use-hook2');
    });

    it('should return empty string for non string input', () => {
        expect(kebabCase(undefined)).toBe('');
        expect(kebabCase(null)).toBe('');
    });
});
