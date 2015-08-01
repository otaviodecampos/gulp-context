var gulp = require('gulp');

function copy() {

    var input = [this.source + '**/*.html'];

    return gulp.src(this.watch(input))
        .pipe(gulp.dest(this.target));
}

module.exports = copy;
