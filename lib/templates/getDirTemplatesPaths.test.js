import { describe, expect, test, vi } from 'vitest';

import { getDirTemplatesPaths } from './getDirTemplatesPaths.js';

vi.mock('fs');

const fs = await import('fs');

const files = {
    templates: {
        'block.i18n': {
            'block.en.json': '{}',
            dir2: {
                file: 'content',
            },
        },
    },
};

describe('getDirTemplatesPaths', () => {
    test('Returns object with paths to templates', () => {
        fs.__setMockFiles(files);

        const templates = getDirTemplatesPaths('/templates', 'block.i18n', {});

        expect(templates).toEqual({
            'block.i18n/block.en.json': {
                block: '/templates/block.i18n/block.en.json',
            },
            'block.i18n/dir2/file': {
                block: '/templates/block.i18n/dir2/file',
            },
        });
    });
});
