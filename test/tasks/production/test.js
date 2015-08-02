var gulp = require('gulp');
var htmlify = require('gulp-angular-htmlify');

function copy() {

    var input = [this.sourceDir + '**/*.html'];

    return gulp.src(this.watch(input))
        .pipe(htmlify())
        .pipe(gulp.dest(this.targetDir));
}

module.exports = copy;
