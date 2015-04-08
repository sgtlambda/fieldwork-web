'use strict';

var gulp       = require('gulp'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    uglify     = require('gulp-uglify'),
    sass       = require('gulp-sass'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpif     = require('gulp-if'),
    chalk      = require('chalk'),
    argv       = require('yargs')
        .boolean('dist')
        .argv;

var dev = !argv.dist;

console.log(chalk.red(dev ? 'Building dev assets' : 'Building dist assets'));

var out = './dist';

gulp.task('styles', function () {

    gulp.src([
        'node_modules/jquery-datetimepicker/jquery.datetimepicker.css',
        'assets/styles/main.scss'
    ])
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(sass())
        .pipe(concat('fieldwork.css'))
        .pipe(gulpif(dev, sourcemaps.write()))
        .pipe(gulp.dest(out));
});


gulp.task('scripts', function () {

    return browserify({
        entries: ['./lib/fieldwork.js'],
        debug:   true
    })
        .bundle()
        .pipe(source('fieldwork.js'))
        .pipe(buffer())
        .pipe(gulpif(dev, sourcemaps.init({loadMaps: true})))
        .pipe(uglify())
        .pipe(gulpif(dev, sourcemaps.write()))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['styles', 'scripts']);