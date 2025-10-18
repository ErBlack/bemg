/**
 * @typedef {Object} BemEntity
 * @property {string} block - Block name
 * @property {string} [elem] - Element name
 * @property {string} [modName] - Modifier name
 * @property {string | boolean} [modVal] - Modifier value
 */

/**
 * @typedef {Object} ModDelims
 * @property {string} name - Modifier name delimiter
 * @property {string} val - Modifier value delimiter
 */

/**
 * @typedef {Object} NamingOptions
 * @property {string} [elem] - Element delimiter (e.g., '__')
 * @property {string | ModDelims} [mod] - Modifier delimiter(s)
 * @property {string} [wordPattern] - Word pattern regex
 */

/**
 * @typedef {'block' | 'blockMod' | 'elem' | 'elemMod'} BemEntityType
 */

/**
 * @typedef {Object} BemNaming
 * @property {(str: string) => boolean} validate - Validate a BEM entity string
 * @property {(str: string) => BemEntity} parse - Parse a BEM entity string
 * @property {(obj: BemEntity) => string} stringify - Stringify a BEM entity object
 * @property {(obj: BemEntity) => BemEntityType} typeOf - Get the type of a BEM entity
 * @property {string} elemDelim - Element delimiter
 * @property {string} modDelim - Modifier name delimiter
 * @property {string} modValDelim - Modifier value delimiter
 */

/**
 * @type {Record<'block' | 'blockMod' | 'elem' | 'elemMod', BemEntityType>}
 */
export const TYPES = {
    block: 'block',
    blockMod: 'blockMod',
    elem: 'elem',
    elemMod: 'elemMod',
};

const DEFAULT_OPTIONS = {
    delims: {
        elem: '__',
        mod: { name: '_', val: '_' },
    },
    wordPattern: '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*',
};

function normalizeOptions(options) {
    let delims = DEFAULT_OPTIONS.delims;
    let wordPattern = DEFAULT_OPTIONS.wordPattern;

    if (options) {
        wordPattern = options.wordPattern || wordPattern;

        if (options.elem || options.mod) {
            const mod = options.mod
                ? typeof options.mod === 'string'
                    ? { name: options.mod, val: options.mod }
                    : {
                          name: options.mod.name || DEFAULT_OPTIONS.delims.mod.name,
                          val: options.mod.val || DEFAULT_OPTIONS.delims.mod.val,
                      }
                : DEFAULT_OPTIONS.delims.mod;

            delims = {
                elem: options.elem || DEFAULT_OPTIONS.delims.elem,
                mod,
            };
        }
    }

    return { delims, wordPattern };
}

function buildRegex(delims, wordPattern) {
    const block = `(${wordPattern})`;
    const elem = `(?:${escapeRegex(delims.elem)}(${wordPattern}))?`;
    const modName = `(?:${escapeRegex(delims.mod.name)}(${wordPattern}))?`;
    const modVal = `(?:${escapeRegex(delims.mod.val)}(${wordPattern}))?`;
    const mod = modName + modVal;

    return new RegExp(`^${block}${mod}$|^${block}${elem}${mod}$`);
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a BEM naming utility with specified delimiters and rules
 * @param {NamingOptions} [options]
 * @returns {BemNaming}
 */
export function createBemNaming(options) {
    const { delims, wordPattern } = normalizeOptions(options);
    const regex = buildRegex(delims, wordPattern);

    return {
        validate(str) {
            return typeof str === 'string' && regex.test(str);
        },
        parse(str) {
            const match = regex.exec(str);
            if (!match) {
                throw new Error(`"${str}" is not a valid BEM entity name`);
            }

            const entity = {
                block: match[1] || match[4],
            };

            const elem = match[5];
            const modName = match[2] || match[6];

            if (elem) {
                entity.elem = elem;
            }

            if (modName) {
                const modVal = match[3] || match[7];
                entity.modName = modName;
                entity.modVal = modVal || true;
            }

            return entity;
        },
        stringify(entity) {
            if (!entity || !entity.block) {
                throw new Error('Invalid BEM entity: missing block name');
            }

            let result = entity.block;

            if (entity.elem) {
                result += delims.elem + entity.elem;
            }

            if (entity.modName) {
                const modVal = entity.modVal;
                const hasModVal = entity.hasOwnProperty('modVal');

                if (modVal || !hasModVal) {
                    result += delims.mod.name + entity.modName;
                }

                if (modVal && modVal !== true) {
                    result += delims.mod.val + modVal;
                }
            }

            return result;
        },
        typeOf(entity) {
            if (!entity || !entity.block) {
                throw new Error('Invalid BEM entity: missing block name');
            }

            const modName = entity.modName;
            const isMod = modName && (entity.modVal || !entity.hasOwnProperty('modVal'));

            if (entity.elem) {
                if (isMod) return TYPES.elemMod;
                if (!modName) return TYPES.elem;
            }

            if (isMod) return TYPES.blockMod;
            if (!modName) return TYPES.block;

            throw new Error('Unable to determine BEM entity type');
        },
        elemDelim: delims.elem,
        modDelim: delims.mod.name,
        modValDelim: delims.mod.val,
    };
}
