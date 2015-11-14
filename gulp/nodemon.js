var gulp = require('gulp'),
	nodemon = require('gulp-nodemon');

gulp.task('nodemon', function() {
	nodemon({
		script: 'index.js',
		ext: 'js html css',
		ignore: ['node_modules', 'gulp', 'test']
	}).on('restart', function(){
		console.log('server restart');
	})
})