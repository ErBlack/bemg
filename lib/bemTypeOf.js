/**
 * @param {BemEntityName}
 * @returns {String}
 */
module.exports = function bemTypeOf(entity) {
  if (!entity) {
    return undefined;
  }

  if (entity.elem) {
    return entity.mod ? 'elemMod' : 'elem';
  }

  return entity.mod ? 'blockMod' : 'block';
}
