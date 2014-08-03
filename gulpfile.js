var config  = require('./config/config.json')
  , gulp    = require('gulp')
  , sass    = require('gulp-sass')
  , uglify  = require('gulp-uglify')
  , rename  = require('gulp-rename')
  , replace = require('gulp-replace')
  , watch   = require('gulp-watch')
  , jshint = require('gulp-jshint');


var paths = {
  js : 'assets/js/*.js',
  scss : 'assets/scss/sherlog.scss',
  scssToWatch : 'assets/scss/**/*.scss'
};

gulp.task('scripts', function() {
  return gulp.src(paths.js)
             .pipe(replace('{{sherlog_url}}', config.server_url))
             .pipe(replace('{{pixel_name}}',  config.pixel_name))
             .pipe(uglify())
             .pipe(rename({suffix: '.min'}))
             .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function() {
  return gulp.src(paths.scss)
             .pipe(sass({outputStyle: 'compressed'}))
             .pipe(rename({suffix: '.min'}))
             .pipe(gulp.dest('public/css'));
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(paths.js,    ['scripts']);
    gulp.watch(paths.scssToWatch,  ['sass']);
});

gulp.task('default', ['scripts', 'sass']);
