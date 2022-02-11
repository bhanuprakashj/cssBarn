const gulp = require('gulp');
const eslint = require('gulp-eslint-new');
const w3cjs = require('gulp-w3cjs');
const changeContent = require('gulp-change');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minifyCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserify = require('gulp-browserify');
const concat = require('gulp-concat');
const cssReplaceUrl = require('gulp-css-url-adjuster');
const browserSync = require('browser-sync').create();
const del = require('del');

// clears dist folder
gulp.task('clean', () => del('dist/**'));

// copy assets from dist
gulp.task('copyAssets', () => gulp.src('src/assets/**').pipe(gulp.dest('dist/assets/')));

// process scss file main.scss
gulp.task('processSass', () => gulp.src('src/scss/main.scss')
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(sass().on('error', sass.logError))
	.pipe(cssReplaceUrl({
		replace: ['../../assets', '../assets'],
	}))
	.pipe(rename('style.css'))
	.pipe(autoprefixer())
	.pipe(minifyCss())
	.pipe(rename('style.min.css'))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('dist/css')));

// starts server
gulp.task('browserSync', () => browserSync.init({
	server: {
		baseDir: './dist',
	},
}));

// lints js files imported in index.js
gulp.task('lintJs', () => gulp.src('./src/js/*.js')
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
	.pipe(browserify({ insertGlobals: true }))
	.pipe(uglify())
	.pipe(concat('bundle.min.js'))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('./dist/js/')));

// lints html files
gulp.task('lintHtml', () => gulp.src('./src/**/*.html')
	.pipe(w3cjs())
	.pipe(w3cjs.reporter())
	.pipe(changeContent((content) => content.replaceAll('../dist', '.')))
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest('./dist/')));

// task to watch html/css/js files and reload browser
gulp.task('watchingFiles', () => {
	gulp.watch('src/scss/**/*.scss', gulp.series('processSass')).on('change', browserSync.reload);
	gulp.watch('src/**/*.html', gulp.series('lintHtml')).on('change', browserSync.reload);
	gulp.watch('src/js/**/*.js', gulp.series('lintJs')).on('change', browserSync.reload);
});

// dev task
gulp.task('dev', gulp.series('clean', 'copyAssets', 'processSass', 'lintHtml', 'lintJs', gulp.parallel('browserSync', 'watchingFiles')));
// build task
gulp.task('build', gulp.series('clean', 'copyAssets', 'processSass', 'lintHtml', 'lintJs'));
