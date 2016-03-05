'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var reactify = require('reactify');

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