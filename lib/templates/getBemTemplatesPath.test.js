import { describe, expect, test, vi } from 'vitest';

import { getBemTemplatesPath } from './getBemTemplatesPath.js';

vi.mock('fs');

const fs = await import('fs');

const files = {
    templates: {
        'template_block.tsx': '',
    },
};

describe('getBemTemplatesPaths', () => {
    test('Returns object with templates', () => {
        fs.__setMockFiles(files);

        const templates = getBemTemplatesPath('/templates', 'template_block.tsx', {});

        expect(templates).toEqual({
            tsx: {
                block: '/templates/template_block.tsx',
            },
        });
    });
});
