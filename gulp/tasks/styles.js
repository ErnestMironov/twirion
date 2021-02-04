const gulp = require('gulp')
const gulpif = require('gulp-if')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const shorthand = require('gulp-shorthand')
const autoprefixer = require('gulp-autoprefixer')
const gulpStylelint = require('gulp-stylelint')
const rename = require("gulp-rename")

module.exports = function styles() {
  return gulp.src('src/styles/**/*.scss')
    .pipe(plumber())
    // .pipe(gulpStylelint({
    //   failAfterError: false,
    //   reporters: [
    //     {
    //       formatter: 'string',
    //       console: true
    //     }
    //   ]
    // }))
    .pipe(gulpif(process.env.NODE_ENV == `development`, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      debug: true,
      compatibility: '*'
    }, details => {
      console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
    }))
    .pipe(gulpif(process.env.NODE_ENV == `development`, sourcemaps.write()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/css'))
}

