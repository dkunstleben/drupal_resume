var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var nano = require('gulp-cssnano');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var uncss = require('gulp-uncss');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Configuration
var siteRoot = 'http://localhost/resume_drupal';
var bsyncPort = 5000;

// Development css compiler
gulp.task('compileDev', function(){
	return gulp.src('less/style.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Production css compiler
gulp.task('compile', function(){
	//Manifest for site pages, uncss will remove any styling NOT in these pages
	var pagesManifest = ['index.html'];
	pagesManifest = pagesManifest.map(function(e){ return devHost + '/' + e });

	return gulp.src('less/style.less')
		.pipe(less())
		.pipe(uncss({html: pagesManifest,
			ignore: [".fade",
					 ".fade.in",
					".collapse",
					".collapse.in",
					".collapsing",
					".alert-danger",
					".open",
					"/open+/",
					"h1","h2","h3","h4","h5","h6","body","p","html","ul","li","ol","br","footer","div"]}))
		.pipe(nano())
		.pipe(gulp.dest('css/'));
});

gulp.task('watch', ['browserSync', 'compileDev'/*, 'compileScripts'*/], function(){
	gulp.watch('less/**/*.less', ['compileDev']);
	/*gulp.watch(['gulpfile.js', 'src/js/*.js'], ['compileScripts']);*/
});

gulp.task('browserSync', function(){
	var files = [
		'**/*.html.twig',
		'**/*.{png,jpg,gif}'
	];
	browserSync.init(files, {
		proxy: siteRoot,
		port: bsyncPort,
		injectChanges: true
	});
});
