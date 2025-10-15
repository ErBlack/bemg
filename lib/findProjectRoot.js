import { existsSync } from 'fs';
import { resolve, join } from 'path';

const MARKERS = ['.git', '.hg', 'bemg'];

const markerExists = (directory) => MARKERS.some((mark) => existsSync(join(directory, mark)));

export function findProjectRoot(directory) {
    while (!markerExists(directory)) {
        const parentDirectory = resolve(directory, '..');

        if (parentDirectory === directory) break;

        directory = parentDirectory;
    }

    return directory;
}
