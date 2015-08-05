var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');

function copy() {

    var input = [this.sourceDir + '**/*.html'];

    return gulp.src(this.watch(input))
        .pipe(minifyHtml())
        .pipe(gulp.dest(this.targetDir));
}

module.exports = copy;
