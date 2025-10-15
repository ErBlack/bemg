import { basename, dirname } from 'path';

/**
 * Returns the name of the bem entity and the path to the block root
 * @param {String} path
 * @param {[String, String, String]} delimiters
 */
export function getBemStringByPath(path, delimiters) {
    let currentEntityString = '';

    do {
        const slug = basename(path);
        currentEntityString = slug + currentEntityString;

        if (!delimiters.some((delimiter) => slug.includes(delimiter))) break;

        path = dirname(path);
    } while (path);

    return {
        currentEntityString,
        currentBlockRoot: path,
    };
}
