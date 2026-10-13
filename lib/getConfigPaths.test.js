import { resolve } from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { getConfigPaths } from './getConfigPaths.js';

vi.mock('fs');

const fs = await import('fs');

const defaultBemgPath = resolve('bemg');

describe('getConfigPaths', () => {
    beforeEach(() => {
        fs.__setMockFiles({
            [defaultBemgPath.slice(1)]: {
                'config.json': '{}',
                templates: {
                    'template_block.tsx': '',
                },
            },
            with: {
                bemg: {
                    'config.json': '{}',
                    templates: {
                        'template_block.tsx': '',
                    },
                },
            },
            without: {
                bemg: {},
            },
            repo: {
                '.git': {},
                bemg: {
                    'config.json': '{}',
                    templates: {
                        'template_block.tsx': '',
                        'template_elem.tsx': '',
                    },
                },
                packages: {
                    inherits: {
                        bemg: {
                            'config.json': '{"inherits": true}',
                            templates: {
                                'template_block.tsx': '',
                                'template_block.css': '',
                            },
                        },
                    },
                    own: {
                        bemg: {
                            'config.json': '{}',
                        },
                    },
                },
            },
            'repo-without-bemg': {
                '.git': {},
                packages: {
                    inherits: {
                        bemg: {
                            'config.json': '{"inherits": true}',
                        },
                    },
                },
            },
        });
    });

    test('Paths in folder with bemg', () => {
        expect(getConfigPaths('/with')).toStrictEqual({
            configPaths: ['/with/bemg/config.json'],
            templatesPaths: {
                tsx: { block: '/with/bemg/templates/template_block.tsx' },
            },
        });
    });

    test('Default paths in folder with empty bemg', () => {
        expect(getConfigPaths('/without')).toStrictEqual({
            configPaths: [`${defaultBemgPath}/config.json`],
            templatesPaths: {
                tsx: { block: `${defaultBemgPath}/templates/template_block.tsx` },
            },
        });
    });

    test('Paths of parent bemg when inherits', () => {
        expect(getConfigPaths('/repo/packages/inherits')).toStrictEqual({
            configPaths: ['/repo/bemg/config.json', '/repo/packages/inherits/bemg/config.json'],
            templatesPaths: {
                tsx: {
                    block: '/repo/packages/inherits/bemg/templates/template_block.tsx',
                    elem: '/repo/bemg/templates/template_elem.tsx',
                },
                css: { block: '/repo/packages/inherits/bemg/templates/template_block.css' },
            },
        });
    });

    test('No parent bemg paths without inherits', () => {
        expect(getConfigPaths('/repo/packages/own')).toStrictEqual({
            configPaths: ['/repo/packages/own/bemg/config.json'],
            templatesPaths: {
                tsx: { block: `${defaultBemgPath}/templates/template_block.tsx` },
            },
        });
    });

    test('Default paths when parent has no bemg', () => {
        expect(getConfigPaths('/repo-without-bemg/packages/inherits')).toStrictEqual({
            configPaths: [`${defaultBemgPath}/config.json`, '/repo-without-bemg/packages/inherits/bemg/config.json'],
            templatesPaths: {
                tsx: { block: `${defaultBemgPath}/templates/template_block.tsx` },
            },
        });
    });
});
