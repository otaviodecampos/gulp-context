var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');

function copy() {

    var input = this.input(this.srcDir, ['**/*.html']);

    return gulp.src(input)
        .pipe(minifyHtml())
        .pipe(gulp.dest(this.buildDir));
}

module.exports = copy;
