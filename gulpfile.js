var config  = require('./config/config.json')
  , gulp    = require('gulp')
  , sass    = require('gulp-sass')
  , uglify  = require('gulp-uglify')
  , rename  = require('gulp-rename')
  , replace = require('gulp-replace')
  , watch   = require('gulp-watch')
  , concat  = require('gulp-concat');

var paths = {
  js : {
    all       : 'assets/js/*.js',
    framework : 'assets/js/sherlog.js',
    dashboard : 'assets/js/dashboard.js'
  },
  scss : {
    all  : 'assets/scss/**/*.scss',
    main : 'assets/scss/sherlog.scss'
  }
};

gulp.task('dashboard-scripts', function() {
  // include all dependencies along with dashboard script
  var dependencies = [ 
    'bower_components/jquery/dist/jquery.js',
    'bower_components/datatables/media/js/jquery.dataTables.js',
    'bower_components/datatables-bootstrap3/BS3/assets/js/datatables.js',
    paths.js.dashboard
  ];

  return gulp.src(dependencies)
      .pipe(concat('dashboard.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('public/js/'));
});

gulp.task('framework-script', function() {
  return gulp.src(paths.js.framework)
             .pipe(replace('{{sherlog_url}}', config.server_url))
             .pipe(replace('{{pixel_name}}',  config.pixel_name))
             .pipe(uglify())
             .pipe(rename({suffix: '.min'}))
             .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function() {
  return gulp.src(paths.scss.main)
             .pipe(sass({outputStyle: 'compressed'}))
             .pipe(rename({suffix: '.min'}))
             .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
    gulp.watch(paths.js.all, ['dashboard-scripts', 'framework-script']);
    gulp.watch(paths.scss.all, ['sass']);
});

gulp.task('default', ['dashboard-scripts', 'framework-script', 'sass']);
