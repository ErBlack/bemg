import { describe, it, expect } from 'vitest';
import { createBemNaming } from './createBemNaming.js';

describe('createBemNaming', () => {
    describe('default naming (origin preset)', () => {
        const bemNaming = createBemNaming();

        describe('validate', () => {
            it('should validate block names', () => {
                expect(bemNaming.validate('block')).toBe(true);
                expect(bemNaming.validate('my-block')).toBe(true);
                expect(bemNaming.validate('block123')).toBe(true);
            });

            it('should validate element names', () => {
                expect(bemNaming.validate('block__elem')).toBe(true);
                expect(bemNaming.validate('block__my-elem')).toBe(true);
                expect(bemNaming.validate('my-block__elem123')).toBe(true);
            });

            it('should validate block modifiers', () => {
                expect(bemNaming.validate('block_mod')).toBe(true);
                expect(bemNaming.validate('block_mod_val')).toBe(true);
                expect(bemNaming.validate('my-block_my-mod')).toBe(true);
                expect(bemNaming.validate('block_mod_my-val')).toBe(true);
            });

            it('should validate element modifiers', () => {
                expect(bemNaming.validate('block__elem_mod')).toBe(true);
                expect(bemNaming.validate('block__elem_mod_val')).toBe(true);
                expect(bemNaming.validate('my-block__my-elem_my-mod')).toBe(true);
                expect(bemNaming.validate('block__elem_mod_my-val')).toBe(true);
            });

            it('should reject invalid names', () => {
                expect(bemNaming.validate('')).toBe(false);
                expect(bemNaming.validate('block__')).toBe(false);
                expect(bemNaming.validate('block_')).toBe(false);
                expect(bemNaming.validate('__elem')).toBe(false);
                expect(bemNaming.validate('_mod')).toBe(false);
                expect(bemNaming.validate('block__elem_')).toBe(false);
            });
        });

        describe('parse', () => {
            it('should parse block names', () => {
                expect(bemNaming.parse('block')).toEqual({ block: 'block' });
                expect(bemNaming.parse('my-block')).toEqual({ block: 'my-block' });
            });

            it('should parse element names', () => {
                expect(bemNaming.parse('block__elem')).toEqual({
                    block: 'block',
                    elem: 'elem',
                });
                expect(bemNaming.parse('my-block__my-elem')).toEqual({
                    block: 'my-block',
                    elem: 'my-elem',
                });
            });

            it('should parse block modifiers', () => {
                expect(bemNaming.parse('block_mod')).toEqual({
                    block: 'block',
                    modName: 'mod',
                    modVal: true,
                });
                expect(bemNaming.parse('block_mod_val')).toEqual({
                    block: 'block',
                    modName: 'mod',
                    modVal: 'val',
                });
            });

            it('should parse element modifiers', () => {
                expect(bemNaming.parse('block__elem_mod')).toEqual({
                    block: 'block',
                    elem: 'elem',
                    modName: 'mod',
                    modVal: true,
                });
                expect(bemNaming.parse('block__elem_mod_val')).toEqual({
                    block: 'block',
                    elem: 'elem',
                    modName: 'mod',
                    modVal: 'val',
                });
            });

            it('should throw error for invalid names', () => {
                expect(() => bemNaming.parse('')).toThrow('" is not a valid BEM entity name');
                expect(() => bemNaming.parse('__elem')).toThrow('"__elem" is not a valid BEM entity name');
                expect(() => bemNaming.parse('_mod')).toThrow('"_mod" is not a valid BEM entity name');
            });
        });

        describe('stringify', () => {
            it('should stringify block', () => {
                expect(bemNaming.stringify({ block: 'block' })).toBe('block');
            });

            it('should stringify element', () => {
                expect(bemNaming.stringify({ block: 'block', elem: 'elem' })).toBe('block__elem');
            });

            it('should stringify block modifier with boolean value', () => {
                expect(bemNaming.stringify({ block: 'block', modName: 'mod', modVal: true })).toBe('block_mod');
            });

            it('should stringify block modifier with string value', () => {
                expect(bemNaming.stringify({ block: 'block', modName: 'mod', modVal: 'val' })).toBe('block_mod_val');
            });

            it('should stringify element modifier', () => {
                expect(bemNaming.stringify({ block: 'block', elem: 'elem', modName: 'mod', modVal: true })).toBe(
                    'block__elem_mod',
                );
                expect(bemNaming.stringify({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' })).toBe(
                    'block__elem_mod_val',
                );
            });

            it('should throw error for invalid objects', () => {
                expect(() => bemNaming.stringify({})).toThrow('Invalid BEM entity: missing block name');
                expect(() => bemNaming.stringify(null)).toThrow('Invalid BEM entity: missing block name');
            });
        });

        describe('typeOf', () => {
            it('should return block type', () => {
                expect(bemNaming.typeOf({ block: 'block' })).toBe('block');
            });

            it('should return elem type', () => {
                expect(bemNaming.typeOf({ block: 'block', elem: 'elem' })).toBe('elem');
            });

            it('should return blockMod type', () => {
                expect(bemNaming.typeOf({ block: 'block', modName: 'mod', modVal: true })).toBe('blockMod');
                expect(bemNaming.typeOf({ block: 'block', modName: 'mod', modVal: 'val' })).toBe('blockMod');
            });

            it('should return elemMod type', () => {
                expect(bemNaming.typeOf({ block: 'block', elem: 'elem', modName: 'mod', modVal: true })).toBe(
                    'elemMod',
                );
                expect(bemNaming.typeOf({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' })).toBe(
                    'elemMod',
                );
            });

            it('should throw error for invalid input', () => {
                expect(() => bemNaming.typeOf({})).toThrow('Invalid BEM entity: missing block name');
                expect(() => bemNaming.typeOf(null)).toThrow('Invalid BEM entity: missing block name');
            });
        });

        describe('delimiters', () => {
            it('should expose delimiter properties', () => {
                expect(bemNaming.elemDelim).toBe('__');
                expect(bemNaming.modDelim).toBe('_');
                expect(bemNaming.modValDelim).toBe('_');
            });
        });
    });

    describe('custom naming options', () => {
        it('should support custom delimiters', () => {
            const naming = createBemNaming({
                elem: '__',
                mod: { name: '--', val: '---' },
            });

            expect(naming.validate('block--mod')).toBe(true);
            expect(naming.validate('block--mod---val')).toBe(true);
            expect(naming.parse('block--mod---val')).toEqual({
                block: 'block',
                modName: 'mod',
                modVal: 'val',
            });
            expect(naming.stringify({ block: 'block', modName: 'mod', modVal: 'val' })).toBe('block--mod---val');
        });

        it('should support string mod delimiter', () => {
            const naming = createBemNaming({
                elem: '__',
                mod: '--',
            });

            expect(naming.validate('block--mod')).toBe(true);
            expect(naming.validate('block--mod--val')).toBe(true);
            expect(naming.parse('block--mod--val')).toEqual({
                block: 'block',
                modName: 'mod',
                modVal: 'val',
            });
        });
    });

    describe('edge cases', () => {
        const naming = createBemNaming();

        it('should handle modifier without modVal property', () => {
            const entity = { block: 'block', modName: 'mod' };
            expect(naming.stringify(entity)).toBe('block_mod');
            expect(naming.typeOf(entity)).toBe('blockMod');
        });

        it('should work with parse then typeOf', () => {
            expect(naming.typeOf(naming.parse('block'))).toBe('block');
            expect(naming.typeOf(naming.parse('block__elem'))).toBe('elem');
            expect(naming.typeOf(naming.parse('block_mod'))).toBe('blockMod');
            expect(naming.typeOf(naming.parse('block__elem_mod'))).toBe('elemMod');
        });

        it('should handle complex block names with hyphens and numbers', () => {
            expect(naming.validate('my-block-123')).toBe(true);
            expect(naming.parse('my-block-123__elem-456')).toEqual({
                block: 'my-block-123',
                elem: 'elem-456',
            });
        });

        it('should handle special characters in delimiters', () => {
            const naming = createBemNaming({
                elem: '$$',
                mod: { name: '##', val: '@@' },
            });

            expect(naming.validate('block$$elem##mod@@val')).toBe(true);
            expect(naming.parse('block$$elem##mod@@val')).toEqual({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: 'val',
            });
        });
    });
});
