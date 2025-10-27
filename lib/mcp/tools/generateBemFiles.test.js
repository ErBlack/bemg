import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBemFiles } from './generateBemFiles.js';
import { generate } from '../../generate/index.js';
import { getConfigs } from '../../getConfigs.js';
import { suggestNextSteps } from '../lib/suggestNextSteps.js';

vi.mock('../../generate/index.js');
vi.mock('../../getConfigs.js');
vi.mock('../lib/suggestNextSteps.js');

describe('generateBemFiles', () => {
    describe('success cases', () => {
        it('should call generate with correct parameters and return success result', () => {
            const mockCreatedFiles = [
                { creatingEntity: { block: 'button' }, templateType: 'tsx', creatingFilePath: 'button/button.tsx' },
                { creatingEntity: { block: 'button' }, templateType: 'css', creatingFilePath: 'button/button.css' },
            ];
            vi.mocked(generate).mockReturnValue(mockCreatedFiles);

            const result = generateBemFiles.tool({
                targetPath: '/test/path',
                types: ['tsx', 'css'],
                name: 'button',
            });

            expect(generate).toHaveBeenCalledWith({
                targetPath: '/test/path',
                types: ['tsx', 'css'],
                items: undefined,
                name: 'button',
                dryRun: undefined,
            });

            const response = JSON.parse(result.content[0].text);

            console.log(response);

            expect(response).toHaveProperty('success', true);
            expect(response).toHaveProperty('createdFiles', mockCreatedFiles);
            expect(response.message).toBe('Successfully created 2 file(s)');
        });

        it('should handle dryRun mode correctly', () => {
            const mockCreatedFiles = [
                { creatingEntity: { block: 'button' }, templateType: 'tsx', creatingFilePath: 'button/button.tsx' },
                { creatingEntity: { block: 'button' }, templateType: 'css', creatingFilePath: 'button/button.css' },
            ];
            vi.mocked(generate).mockReturnValue(mockCreatedFiles);

            const result = generateBemFiles.tool({
                targetPath: '/test/path',
                types: ['tsx', 'css'],
                name: 'button',
                dryRun: true,
            });

            expect(generate).toHaveBeenCalledWith({
                targetPath: '/test/path',
                types: ['tsx', 'css'],
                items: undefined,
                name: 'button',
                dryRun: true,
            });

            const response = JSON.parse(result.content[0].text);
            expect(response.success).toBe(true);
            expect(response.message).toBe('Would create 2 file(s)');
        });
    });

    describe('error cases', () => {
        it('should return error result when generate throws', () => {
            const errorMessage = 'Invalid BEM name';
            vi.mocked(generate).mockImplementation(() => {
                throw new Error(errorMessage);
            });

            const result = generateBemFiles.tool({
                targetPath: '/test/path',
                types: ['tsx'],
                name: 'invalid--name',
            });

            expect(result).toHaveProperty('isError', true);

            const response = JSON.parse(result.content[0].text);

            expect(response).toHaveProperty('success', false);
            expect(response).toHaveProperty('error', errorMessage);
        });
    });
});
