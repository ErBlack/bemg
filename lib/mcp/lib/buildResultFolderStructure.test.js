import { describe, it, expect } from 'vitest';
import { buildResultFolderStructure } from './buildResultFolderStructure.js';

describe('buildResultFolderStructure', () => {
    it('should build correct folder structure', () => {
        const formattedTemplates = {
            tsx: {
                block: {
                    outputPath: 'block.tsx',
                    outputExample: '...',
                },
                elem: {
                    outputPath: '__elem/block__elem.tsx',
                    outputExample: '...',
                },
            },
            css: {
                block: {
                    outputPath: 'block.css',
                    outputExample: '...',
                },
                elem: {
                    outputPath: '__elem/block__elem.css',
                    outputExample: '...',
                },
                blockMod: {
                    outputPath: '_mod/block_mod_val.css',
                    outputExample: '...',
                },
            },
            json: {
                block: {
                    outputPath: 'block.i18n/en.json',
                    outputExample: '...',
                },
            },
            ts: {
                block: {
                    outputPath: 'block.i18n/hooks/use.ts',
                    outputExample: '...',
                },
            },
        };

        const result = buildResultFolderStructure(formattedTemplates);

        const expected = `__elem/
├── block__elem.css
└── block__elem.tsx
_mod/
└── block_mod_val.css
block.i18n/
├── hooks/
│   └── use.ts
└── en.json
block.css
block.tsx
`;

        expect(result).toBe(expected);
        expect(buildResultFolderStructure({})).toBe('');
    });
});
