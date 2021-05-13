const Copy = require('./Copy');

module.exports = class TaskInit {
    constructor() {
        this._copy = new Copy();
    }

    copy(src, dest, override, simulate) {
        this._copy.copy(src, dest, override, simulate);
    }
}
