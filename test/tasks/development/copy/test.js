var gulp = require('gulp');

function copy(params) {

    var input = [params.source + '**/*.html'];

    return gulp.src(this.watch(input))
        .pipe(gulp.dest(params.target));
}

module.exports = copy;
