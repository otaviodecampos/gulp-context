var gulp = require('gulp');

function copy(cb) {

    var input = [this.sourceDir + '**/*.html'];

    return gulp.src(this.watch(input))
        .pipe(gulp.dest(this.targetDir));
}

module.exports = copy;
