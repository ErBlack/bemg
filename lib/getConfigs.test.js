import { describe, expect, test, vi } from 'vitest';

vi.mock('fs');

const fs = await import('fs');
const { readConfig } = await import('./getConfigs.js');

describe('readConfig', () => {
    test('Merges aliases and replaces other settings', () => {
        fs.__setMockFiles({
            parent: {
                'config.json': JSON.stringify({
                    aliases: { sb: 'stories.tsx', c: 'css' },
                    naming: { elem: '__', mod: '_' },
                }),
            },
            child: {
                'config.json': JSON.stringify({
                    inherits: true,
                    aliases: { c: 'module.css' },
                    naming: { elem: '-' },
                }),
            },
        });

        expect(readConfig(['/parent/config.json', '/child/config.json'])).toStrictEqual({
            inherits: true,
            aliases: { sb: 'stories.tsx', c: 'module.css' },
            naming: { elem: '-' },
        });
    });

    test('Adds empty aliases', () => {
        fs.__setMockFiles({
            bemg: {
                'config.json': JSON.stringify({ naming: { elem: '__' } }),
            },
        });

        expect(readConfig(['/bemg/config.json'])).toStrictEqual({
            aliases: {},
            naming: { elem: '__' },
        });
    });
});
