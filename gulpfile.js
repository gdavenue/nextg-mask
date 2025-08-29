const { src, dest, watch, series } = require('gulp');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const data = require('gulp-data');
const del = require('del');
const fs = require('fs');
const nunjucksRender = require('gulp-nunjucks-render');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

function cleanImages() {
  return del(['dist/images/**/*']);
}

function cleanStaticFolder() {
  return del(['dist/static/**/*']);
}

function images() {
  return src('src/images/**/*.{png,jpg,jpeg,svg,gif}', {
    encoding: false,
  }).pipe(dest('dist/images'));
}

function html() {
  return src('src/templates/pages/*.njk')
    .pipe(
      data(function (file) {
        return JSON.parse(fs.readFileSync('./src/data.json'));
      })
    )
    .pipe(
      nunjucksRender({
        path: ['src/templates'],
      })
    )
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: { baseDir: 'dist' },
    notify: false,
  });

  watch('src/scss/**/*.scss', styles);
  watch('src/**/*.njk', html);
  watch('src/data/**/*.json', html);
  watch('src/js/**/*.js', scripts);
  watch('src/images/**/*.{png,jpg,jpeg,svg,gif}', series(cleanImages, images));
  watch('src/static/**/*', series(cleanStaticFolder, staticFolder));
}

function staticFolder() {
  return src('src/static/**/*', { base: 'src', encoding: false }).pipe(
    dest('dist')
  );
}

exports.build = series(styles, html, images, staticFolder, scripts);
exports.default = series(exports.build, serve);
