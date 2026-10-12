import { describe, expect, test, vi } from 'vitest';
import config from '../../bemg/config.json' with { type: 'json' };

vi.mock('fs');

const fs = await import('fs');
const { analyze } = await import('./index.js');

const bemg = {
    'config.json': JSON.stringify(config),
    templates: {},
};

describe('analyze', () => {
    test('Block folder', () => {
        fs.__setMockFiles({ bemg, block: {} });

        expect(analyze('/block')).toMatchObject({
            path: '/block',
            currentEntity: { string: 'block', type: 'block', block: 'block' },
            blockRoot: '/block',
            suggestions: [{ type: 'element' }, { type: 'blockMod' }],
            naming: config.naming,
        });
    });

    test('Element folder', () => {
        fs.__setMockFiles({ bemg, block: { __elem: {} } });

        expect(analyze('/block/__elem')).toMatchObject({
            path: '/block/__elem',
            currentEntity: { string: 'block__elem', type: 'elem', block: 'block', elem: 'elem' },
            blockRoot: '/block',
            suggestions: [{ type: 'elemMod' }],
        });
    });

    test('File inside entity folder', () => {
        fs.__setMockFiles({ bemg, block: { __elem: { 'block__elem.tsx': '' } } });

        expect(analyze('/block/__elem/block__elem.tsx')).toMatchObject({
            path: '/block/__elem',
            currentEntity: { string: 'block__elem', type: 'elem' },
            blockRoot: '/block',
        });
    });

    test('Throws for missing path', () => {
        fs.__setMockFiles({ bemg });

        expect(() => analyze('/block')).toThrow('Path does not exist: /block');
    });

    test('Throws for invalid entity', () => {
        fs.__setMockFiles({ bemg, 'not.block': {} });

        expect(() => analyze('/not.block')).toThrow(
            'Current path does not correspond to a valid BEM entity: not.block',
        );
    });
});
