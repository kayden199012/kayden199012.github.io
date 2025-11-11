const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')(require('sass'))
const plumber = require('gulp-plumber')
const concat = require('gulp-concat')
const pug = require('gulp-pug')
const babel = require('gulp-babel')
const minify = require('gulp-minify')
const autoprefixer = require('gulp-autoprefixer')
const include = require('gulp-include')
const md5 = require('gulp-md5')
const gulpif = require('gulp-if')

function js(type,hash=""){
  var minify_name = (hash!='')?'app.'+hash+".js":'app.js'
  return gulp.src('./src/js/app.js')
  .pipe(plumber())
  .pipe(include()).on('error', console.log)
  .pipe(concat(minify_name))
  .pipe(babel({
    presets: ['@babel/env'],
    plugins: [
      ["@babel/plugin-transform-template-literals", {
        "loose": true
      }]
    ]
  }))
  .pipe(gulpif(!type,md5({printOnly: type,separator: '.',size:20})))
  .pipe(minify({
    ext:{
      src: '-debug.js',
      min: '.js'
    },
  }))
  // 儲存路徑，overwrite路徑
  .pipe(gulpif(type,gulp.dest('./assets/js')))
  // 輸出上傳檔案
  .pipe(gulpif(!type,gulp.dest('./dist/js/'+Date.now())))
}

function scss(type,hash=""){
  var minify_name = (hash!='')?'app.'+hash+".css":'app.css'
  return gulp.src('./src/sass/app.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer("last 2 versions"," > 0.5%"))
  .pipe(concat(minify_name))
	.pipe(gulpif(!type,md5({printOnly: type,separator: '.',size:20})))
  .pipe(sourcemaps.write('./'))
  // 儲存路徑，overwrite路徑
  .pipe(gulpif(type,gulp.dest('./assets/css')))
  // 輸出上傳檔案
  .pipe(gulpif(!type,gulp.dest('./dist/css/'+Date.now())))
}

gulp.task('watch', function () {
  gulp.watch('./src/sass/**/*.s[ac]ss', gulp.series('sass'));
  gulp.watch('./src/js/**/*.js', gulp.series('js'));
  gulp.watch('./src/pug/*.pug', gulp.series('pug'));
});

gulp.task('js', function(){
  var develop = true
  var hash = ""
  return js(develop,hash)
});
gulp.task('js-build', function(){
  var develop = false
  return js(develop)
});

gulp.task('sass', function () {
  var develop = true
  var hash = ""
  return scss(develop,hash)
});
gulp.task('sass-build', function(){
  var develop = false
  return scss(develop)
});

gulp.task('pug', function () {
  return gulp.src('./src/pug/*.pug')
  .pipe(plumber())
  .pipe(pug({
  pretty: true
  }))
  .pipe(gulp.dest('./'));
});
