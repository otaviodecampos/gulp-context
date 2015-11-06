var gulp = require('gulp');

function copy() {

    var input = [this.srcDir + '**/*.html'];

    return gulp.src(this.watch(input), {base: 'src'})
        .pipe(gulp.dest(this.buildDir));
}

module.exports = copy;
