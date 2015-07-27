function copy (source, target, paths) {

  var input = [
		source + '**/*.html'
	];

  return gulp.src(input)
    .pipe(gulp.dest(target));
}

module.exports = copy;
