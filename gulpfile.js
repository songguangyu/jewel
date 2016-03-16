var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('uglify', function() {
	gulp.src('./jewel.js')
  		.pipe(uglify().on('error',function(e){ console.log(e)}))
  		.pipe(gulp.dest('build/jewel.js'));
});


gulp.task('default',['uglify']);