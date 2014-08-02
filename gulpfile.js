var config  = require('./config/config.json')
  , gulp    = require('gulp')
  , sass    = require('gulp-sass')
  , uglify  = require('gulp-uglify')
  , rename  = require('gulp-rename')
  , replace = require('gulp-replace')
  , watch   = require('gulp-watch');

var paths = {
  js   : 'assets/js/*.js',
  scss : 'assets/scss/sherlog.scss'
};

gulp.task('scripts', function() {
  return gulp.src(paths.js)
             .pipe(replace('{{sherlog_url}}', config.server_url))
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

gulp.task('watch', function() {
    gulp.watch(paths.js,    ['scripts']);
    gulp.watch('assets/scss/*.scss',  ['sass']);
});

gulp.task('default', ['scripts', 'sass']);
