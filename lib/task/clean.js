var del = require('del');

function clean(cb) {
    del([this.buildDir], cb);
}

module.exports = clean;
