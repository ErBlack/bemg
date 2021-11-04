const { basename, dirname } = require('path');

module.exports = function getBemStringByPath(path, {
    elem,
    mod: { name, val }
}) {
    const delimiters = [elem, name, val];
    let bemString = '';
    
    do {
        const slug = basename(path);
        bemString = slug + bemString;

        if (!delimiters.some(delimiter => slug.includes(delimiter))) break;

        path = dirname(path);
    } while (path);

    return bemString;
}