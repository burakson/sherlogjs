var config  = require('./config/config.json')
  , gulp    = require('gulp')
  , sass    = require('gulp-sass')
  , uglify  = require('gulp-uglify')
  , rename  = require('gulp-rename')
  , replace = require('gulp-replace');

gulp.task('scripts', function() {
  return gulp.src('assets/js/*.js')
             .pipe(replace('{{sherlog_url}}', config.server_url))
             .pipe(uglify())
             .pipe(rename({ suffix: '.min'}))
             .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function() {
  return gulp.src('assets/css/*.scss')
             .pipe(sass({ outputStyle: 'compressed' }))
             .pipe(rename({ suffix: '.min'}))
             .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['scripts', 'sass']);
