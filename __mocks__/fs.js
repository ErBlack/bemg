const { basename, dirname } = require('path');
const fs = jest.createMockFromModule('fs');

let folders = Object.create(null);
let files = Object.create(null);

function mapTree(path, tree) {
  const items = Object.keys(tree);

  folders[path] = items.map((subpath) => subpath);

  items.forEach(subpath => {
    const childPath = path + '/' + subpath;

    if (typeof tree[subpath] === 'object') {
        mapTree(childPath, tree[subpath]);
    } else {
        files[childPath] = tree[subpath];
    }
  });
}

fs.__setMockFiles = tree => {
  folders = Object.create(null);
  files = Object.create(null);

  mapTree('', tree);
};

fs.__getMockFiles = () => files;

fs.__getMockFolders = () => folders;

fs.readdirSync = function readdirSync(directoryPath) {
  return folders[directoryPath] || [];
};

fs.existsSync = function existsSync(path) {
  return folders[path] !== undefined || files[path] !== undefined;
}

fs.lstatSync = function lstatSync(path) {
  return {
    isDirectory: () => folders[path] !== undefined,
    isFile: () => files[path] !== undefined
  }
}

fs.readFileSync = function readFileSync(path) {
  return files[path]
}

fs.mkdirSync = function mkdirSync(path) {
  folders[path] = []
}

fs.writeFileSync = function(path, content) {
  const name = basename(path);

  files[path] = content;
  
  if (!folders[dirname(path)].indexOf(name) == -1) {
    folders[dirname(path)].push(name)
  }
}

module.exports = fs;