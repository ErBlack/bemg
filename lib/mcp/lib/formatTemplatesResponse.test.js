import { describe, it, expect, vi } from 'vitest';
import { formatTemplatesResponse } from './formatTemplatesResponse.js';

vi.mock('fs');

const fs = await import('fs');

describe('formatTemplatesResponse', () => {
    it('should transform templates with output paths and examples', () => {
        const mockTemplates = {
            tsx: {
                block: '/templates/template_block.tsx',
                elem: '/templates/template_elem.tsx',
            },
        };

        const mockConfig = {
            naming: {
                delims: {
                    elem: '__',
                    mod: { name: '_', val: '_' },
                },
            },
        };

        fs.__setMockFiles({
            templates: {
                'template_block.tsx': 'export const ${Block} = () => <div className="${entity}"></div>;',
                'template_elem.tsx': 'export const ${Block}${Elem} = () => <div></div>;',
            },
        });

        const result = formatTemplatesResponse(mockTemplates, mockConfig);

        expect(result).toEqual({
            tsx: {
                block: {
                    outputPath: 'block.tsx',
                    outputExample: 'export const Block = () => <div className="block"></div>;',
                },
                elem: {
                    outputPath: '__elem/block__elem.tsx',
                    outputExample: 'export const BlockElem = () => <div></div>;',
                },
            },
        });
    });
});
