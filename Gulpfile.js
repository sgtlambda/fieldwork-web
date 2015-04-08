'use strict';

var gulp         = require('gulp'),
    browserify   = require('browserify'),
    buffer       = require('vinyl-buffer'),
    source       = require('vinyl-source-stream'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS    = require('gulp-minify-css'),
    sourcemaps   = require('gulp-sourcemaps'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    sass         = require('gulp-sass'),
    gulpif       = require('gulp-if'),
    chalk        = require('chalk'),
    argv         = require('yargs')
        .boolean('dist')
        .argv;

var dev = !argv.dist;

console.log(chalk.red(dev ? 'Building dev assets' : 'Building dist assets'));

var out = './dist';

gulp.task('styles', function () {

    gulp.src([
        'node_modules/jquery-datetimepicker/jquery.datetimepicker.css',
        'node_modules/select2/select2.css',
        'assets/styles/main.scss'
    ])
        .pipe(gulpif(dev, sourcemaps.init()))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat('fieldwork.css'))
        .pipe(gulpif(!dev, minifyCSS()))
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
        .pipe(gulpif(!dev, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(dev, sourcemaps.write()))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-select2-assets', function () {
    return gulp.src('node_modules/select2/*.png')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['styles', 'scripts', 'copy-select2-assets']);