import { describe, it, expect } from 'vitest';
import { createTemplate } from './createTemplate.js';

describe('template', () => {
    it('should replace single variable', () => {
        const template = createTemplate('Hello ${name}');
        expect(template({ name: 'World' })).toBe('Hello World');
    });

    it('should replace multiple variables', () => {
        const template = createTemplate('${greeting} ${name}!');
        expect(template({ greeting: 'Hello', name: 'World' })).toBe('Hello World!');
    });

    it('should handle repeated variables', () => {
        const template = createTemplate('${name} and ${name}');
        expect(template({ name: 'Alice' })).toBe('Alice and Alice');
    });

    it('should leave undefined variables unchanged', () => {
        const template = createTemplate('${foo} ${bar}');
        expect(template({ foo: 'test' })).toBe('test ${bar}');
    });

    it('should handle numbers', () => {
        const template = createTemplate('Count: ${count}');
        expect(template({ count: 42 })).toBe('Count: 42');
    });

    it('should handle booleans', () => {
        const template = createTemplate('Active: ${active}');
        expect(template({ active: true })).toBe('Active: true');
    });
});
