import { basename, dirname } from 'node:path';

let folders = Object.create(null);
let files = Object.create(null);

function mapTree(path, tree) {
    const items = Object.keys(tree);

    folders[path] = items.map((subpath) => subpath);

    items.forEach((subpath) => {
        const childPath = `${path}/${subpath}`;

        if (typeof tree[subpath] === 'object' && tree[subpath] !== null) {
            mapTree(childPath, tree[subpath]);
        } else {
            files[childPath] = tree[subpath];
        }
    });
}

function resetMockState() {
    folders = Object.create(null);
    files = Object.create(null);
}

export function __setMockFiles(tree) {
    resetMockState();
    mapTree('', tree);
}

export function __getMockFiles() {
    return files;
}

export function __getMockFolders() {
    return folders;
}

export function readdirSync(directoryPath) {
    return folders[directoryPath] || [];
}

export function existsSync(path) {
    return folders[path] !== undefined || files[path] !== undefined;
}

export function lstatSync(path) {
    return {
        isDirectory: () => folders[path] !== undefined,
        isFile: () => files[path] !== undefined,
    };
}

export function readFileSync(path) {
    return files[path];
}

export function mkdirSync(path) {
    if (!folders[path]) {
        folders[path] = [];
    }

    const parent = dirname(path);
    const name = basename(path);

    if (parent && folders[parent] && !folders[parent].includes(name)) {
        folders[parent].push(name);
    }
}

export function writeFileSync(path, content) {
    files[path] = content;

    const parent = dirname(path);
    const name = basename(path);

    if (!folders[parent]) {
        folders[parent] = [];
    }

    if (!folders[parent].includes(name)) {
        folders[parent].push(name);
    }
}
