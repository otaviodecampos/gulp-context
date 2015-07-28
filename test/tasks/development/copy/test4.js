var gulp = require('gulp');

function copy(sourceDir, targetDir, paths) {

    var input = [sourceDir + '**/*.html'];

    return gulp.src(this.watch(input))
        .pipe(gulp.dest(targetDir));
}

module.exports = copy;
