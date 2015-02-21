'use strict';

var gulp       = require('gulp'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    uglify     = require('gulp-uglify'),
    sass       = require('gulp-sass'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');

var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
};

var out = './dist';

gulp.task('styles', function () {
    gulp.src([
        'node_modules/jquery-datetimepicker/jquery.datetimepicker.css',
        'assets/styles/main.scss'
    ])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('fieldwork.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(out));
});


gulp.task('scripts', function () {

    var bundler = browserify({
        entries: ['./src/fieldwork.js'],
        debug:   true
    });

    var bundle = function () {
        return bundler
            .bundle()
            .pipe(source(getBundleName() + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js/'));
    };

    return bundle();
});

gulp.task('default', ['styles', 'scripts']);