'use strict';

var gulp         = require('gulp'),
    babelify     = require('babelify'),
    browserify   = require('browserify'),
    streamqueue  = require('streamqueue'),
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
            'node_modules/Select2/dist/css/select2.min.css',
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

    var browserifiedBundle = browserify({
        entries: ['./lib/expose.js'],
        debug:   true
    })
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .pipe(source('fieldwork.js'))
        .pipe(buffer());

    var select2 = gulp.src([
        'node_modules/Select2/dist/js/select2.full.min.js'
    ]);

    return streamqueue({objectMode: true},
        browserifiedBundle,
        select2
    )
        .pipe(gulpif(dev, sourcemaps.init({loadMaps: true})))
        .pipe(concat('fieldwork.js'))
        .pipe(gulpif(!dev, uglify()))
        .pipe(gulpif(dev, sourcemaps.write()))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-select2-assets', function () {

    return gulp.src([
            'node_modules/Select2/*.png',
            'node_modules/Select2/*.gif'
        ])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
    gulp.watch('assets/**/*.scss', ['styles']);
    gulp.watch('lib/**/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'copy-select2-assets']);