import { resolve } from 'path';
import { existsSync } from 'fs';

import { createBemNaming } from '../createBemNaming.js';
import { getConfigs } from '../getConfigs.js';
import { ensureDirectoryPath } from '../generate/ensureDirectoryPath.js';
import { getBemStringByPath } from '../generate/getBemStringByPath.js';

export function analyze(targetPath) {
    const resolvedPath = resolve(targetPath);

    if (!existsSync(resolvedPath)) {
        throw new Error(`Path does not exist: ${resolvedPath}`);
    }

    const targetFolderPath = ensureDirectoryPath(resolvedPath);

    const { config } = getConfigs(targetFolderPath);
    const naming = config.naming;

    const bemNaming = createBemNaming(naming);

    const { currentEntityString, currentBlockRoot } = getBemStringByPath(targetFolderPath, [
        bemNaming.elemDelim,
        bemNaming.modDelim,
        bemNaming.modValDelim,
    ]);

    if (!bemNaming.validate(currentEntityString)) {
        throw new Error(`Current path does not correspond to a valid BEM entity: ${currentEntityString}`);
    }

    const currentEntity = bemNaming.parse(currentEntityString);
    const currentEntityType = bemNaming.typeOf(currentEntity);

    const suggestions = [];

    if (currentEntityType === 'block') {
        suggestions.push({
            type: 'element',
            example: `${currentEntityString}__elem`,
            description: 'Add an element to the block',
        });
        suggestions.push({
            type: 'blockMod',
            example: `${currentEntityString}_mod`,
            description: 'Add a modifier to the block',
        });
    } else if (currentEntityType === 'elem') {
        suggestions.push({
            type: 'elemMod',
            example: `${currentEntityString}_mod`,
            description: 'Add a modifier to the element',
        });
    }

    return {
        path: targetFolderPath,
        currentEntity: {
            string: currentEntityString,
            type: currentEntityType,
            ...currentEntity,
        },
        blockRoot: currentBlockRoot,
        suggestions,
        naming,
    };
}
