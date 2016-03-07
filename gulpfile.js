'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var reactify = require('reactify');
var minifyify = require('minifyify');
var processhtml = require('gulp-processhtml');
var del = require('del');

var gulpUglify = require('gulp-uglify/minifier');
var uglifyJS = require('uglify-js');

gulp.task('clean', function (cb) {
    del(['dist', 'release'], cb);
});

gulp.task('bundle', function () {
    var b = browserify({
        entries: './src/index.js',
        debug: false,
        node: true,
        bundleExternal: false,
        transform: [reactify]
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulpUglify({}, uglifyJS))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
    return gulp.src('./src/index.html')
        .pipe(processhtml())
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    return gulp.src('./assets/main.css')
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['html', 'css', 'bundle']);