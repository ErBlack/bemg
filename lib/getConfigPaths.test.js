import { resolve } from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { getConfigPaths } from './getConfigPaths.js';

vi.mock('fs');

const fs = await import('fs');

describe('getConfigPaths', () => {
    beforeEach(() => {
        fs.__setMockFiles({
            with: {
                bemg: {
                    'config.json': '',
                    templates: {
                        'template_block.tsx': '',
                    },
                },
            },
            without: {
                bemg: {},
            },
        });
    });

    test('Path to config in folder with bemg', () => {
        expect(getConfigPaths('/with').configPath).toStrictEqual('/with/bemg/config.json');
    });

    test('Path to config in folder with empty bemg', () => {
        expect(getConfigPaths('/without').configPath).toStrictEqual(resolve('bemg/config.json'));
    });

    test('Path to templates in folder with bemg', () => {
        expect(getConfigPaths('/with').templatesPath).toStrictEqual('/with/bemg/templates');
    });

    test('Path to templates in folder with empty bemg', () => {
        expect(getConfigPaths('/without').templatesPath).toStrictEqual(resolve('bemg/templates'));
    });
});
