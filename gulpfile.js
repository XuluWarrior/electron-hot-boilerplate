'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var reactify = require('reactify');
var processhtml = require('gulp-processhtml');

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
        .on('error', gutil.log)
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