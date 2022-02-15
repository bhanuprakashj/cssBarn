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
const mergeStream = require('merge-stream');

// clears dist folder
gulp.task('clean', () => del('dist/**'));

// copy assets to dist
gulp.task('copyAssets', () => mergeStream(
	gulp.src('src/assets/**').pipe(gulp.dest('dist/assets/')),
	gulp.src('src/docsAssets/**').pipe(gulp.dest('dist/docsAssets/')),
));

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

// process css file main.css
gulp.task('processCss', () => gulp.src('src/css/main.css')
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(cssReplaceUrl({
		replace: ['../../assets', '../assets'],
	}))
	.pipe(rename('style.css'))
	.pipe(autoprefixer())
	.pipe(minifyCss())
	.pipe(rename('style.min.css'))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('dist/css')));

// process docs css file main.css
gulp.task('processDocsCss', () => gulp.src('src/docsCss/main.css')
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(cssReplaceUrl({
		replace: ['../../docsAssets', '../docsAssets'],
	}))
	.pipe(rename('docsStyle.css'))
	.pipe(autoprefixer())
	.pipe(minifyCss())
	.pipe(rename('docsStyle.min.css'))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('dist/docsCss')));

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
	.pipe(browserify())
	.pipe(uglify())
	.pipe(concat('bundle.min.js'))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('./dist/js/')));

// lints docs js files imported in index.js
gulp.task('lintDocsJs', () => gulp.src('./src/docsJs/*.js')
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError())
	.pipe(browserify())
	.pipe(uglify())
	.pipe(concat('docsJsBundle.min.js'))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('./dist/docsJs/')));

// lints html files
gulp.task('lintHtml', () => gulp.src('./src/**/*.html')
	.pipe(w3cjs())
	.pipe(w3cjs.reporter())
	.pipe(changeContent((content) => content.replaceAll('../dist', '.')))
	.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
	.pipe(gulp.dest('./dist/')));

// task to watch html/css/js files and reload browser
gulp.task('watchingFiles', () => {
	// gulp.watch('src/scss/**/*.scss', gulp.series('processSass')).on('change', browserSync.reload);
	gulp.watch('src/css/**/*.css', gulp.series('processCss')).on('change', browserSync.reload);
	gulp.watch('src/docsCss/**/*.css', gulp.series('processDocsCss')).on('change', browserSync.reload);
	gulp.watch('src/**/*.html', gulp.series('lintHtml')).on('change', browserSync.reload);
	gulp.watch('src/js/**/*.js', gulp.series('lintJs')).on('change', browserSync.reload);
});

// dev task
gulp.task('dev', gulp.series('clean', 'copyAssets', 'processDocsCss', 'processCss', 'lintHtml', 'lintDocsJs', 'lintJs', gulp.parallel('browserSync', 'watchingFiles')));
// build task
gulp.task('build', gulp.series('clean', 'copyAssets', 'processDocsCss', 'processCss', 'lintHtml', 'lintDocsJs', 'lintJs'));
