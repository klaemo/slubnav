'use strict';
var gulp = require('gulp')
var fs = require('fs')
var awspublish = require('gulp-awspublish')
var rev = require('gulp-rev')
var source = require('vinyl-source-stream')
var browserify = require('browserify')
var myth = require('gulp-myth')
var rename = require('gulp-rename')
var del = require('del')

var aws = {
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: 'slub.klaemo.me',
  region: 'eu-west-1'
}

gulp.task('clean', function(cb) {
  del(['build/**'], cb)
})

gulp.task('copy', ['clean'], function() {
  return gulp.src(['public/**', '!**.js', '!**.css'])
    .pipe(gulp.dest('build'))
})

gulp.task('build-js', ['copy'], function() {
  return browserify('./index.js')
    .transform({ global: true }, 'uglifyify')
    .bundle()
    .pipe(source('app.built.js'))
    .pipe(gulp.dest('build'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('build'))
})

gulp.task('build-css', ['copy'], function() {
  return gulp.src('styles/index.css')
    .pipe(myth({ compress: true }))
    .pipe(rename('app.built.css'))
    .pipe(gulp.dest('build'))
})

gulp.task('rev', ['build-js', 'build-css'], function() {
  return gulp.src(['build/*.css', 'build/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('build'))  // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest('build')) // write manifest to build dir
})

gulp.task('compile index.html', ['rev'], function(cb) {
  // read in our manifest file
  var manifest = JSON.parse(fs.readFileSync('build/rev-manifest.json', 'utf8'))
  var html = fs.readFileSync('build/index.html', 'utf8')

  Object.keys(manifest).forEach(function(item) {
    html = html.replace(item, manifest[item])
  })
  fs.writeFile('build/index.html', html, cb)
})

gulp.task('deploy-images', ['copy'], function() {
  var publisher = awspublish.create(aws)
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  }

  return gulp.src('build/img/**')
    .pipe(rename(function(path) {
      path.dirname = 'img/' + path.dirname
    }))
    .pipe(publisher.publish(headers, { simulate: process.env.DRY_RUN }))
    .pipe(awspublish.reporter())
})

gulp.task('deploy-html', ['rev'], function() {
  var publisher = awspublish.create(aws)
  var headers = {
    'Cache-Control': 'max-age=3600, no-transform, public'
  }

  return gulp.src('build/index.html')
    .pipe(publisher.publish(headers, { simulate: process.env.DRY_RUN }))
    .pipe(awspublish.reporter())
})

gulp.task('deploy-assets', ['build'], function() {
  var publisher = awspublish.create(aws)
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  }

  return gulp.src(['build/**.js', 'build/**.css'])
    .pipe(awspublish.gzip({ ext: false }))
    .pipe(publisher.publish(headers, { simulate: process.env.DRY_RUN }))
    .pipe(awspublish.reporter())
})

gulp.task('build', ['compile index.html'])
gulp.task('deploy', ['deploy-assets', 'deploy-html', 'deploy-images'])
