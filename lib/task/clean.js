var del = require('del');

function clean(cb) {
    del([this.targetDir], cb);
}

module.exports = clean;
