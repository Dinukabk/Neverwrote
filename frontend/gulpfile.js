// ## gulpfile.js ##
//
// This file contains all of the tasks for our build system, Gulp.
// We mainly use Gulp to bundle up our client-side scripts and styles, kind
// of like how you might compile code in Java or C. These bundles can then be
// sent to the user's web browser as a part of the web page.

// Require a bunch of modules that we will need when defining our tasks
const gulp = require('gulp');
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const envify = require('envify/custom');
const watchify = require('watchify');
const del = require('del');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const sourcemaps = require('gulp-sourcemaps');
const concatCss = require('gulp-concat-css');

// List of NPM modules to bundle separately from our application code. We refer
// to this collection of modules as "vendor scripts", since they come from
// third-party vendors, not our project.
const libs = [
  'lodash',
  'marked',
  'moment',
  'pinkie-promise',
  'react-dom',
  'react-redux',
  'react',
  'redux-thunk',
  'redux',
  'simplemde',
];

// List of npm modules required only in dev mode
const devLibs = [
  'redux-devtools',
  'redux-devtools-dock-monitor',
  'redux-devtools-log-monitor'
];

// List of npm modules only ever used on the server
const serverOnlyLibs = [
  'request'
];

// Information about where project files are located
const paths = {
  scriptEntryPoint: 'src/client.js',
  styles: 'src/styles/**/*.css',
  vendorScripts: [],
  vendorStyles: [
    require.resolve('bootstrap/dist/css/bootstrap.css'),
    require.resolve('font-awesome/css/font-awesome.css'),
    require.resolve('simplemde/dist/simplemde.min.css'),
  ]
};

// Are we building for development or production?
const isDevEnv = process.env.NODE_ENV === 'development';

// Tasks for removing build outputs
gulp.task('clean', () => del(['dist/']));
gulp.task('cleanStyles', () => del(['dist/css/']));
gulp.task('cleanScripts', () => del(['dist/js/app.*']));
gulp.task('cleanVendorScripts', () => del(['dist/js/vendor.*']));

// Error handler helper function
function onError(error) {
  gutil.log(gutil.colors.red(error.stack));
  this.emit('end');
}

// Task to bundle up styles
gulp.task('styles', ['cleanStyles'], () => {
  return gulp.src(paths.vendorStyles.concat(paths.styles))
    .pipe(concatCss('app.css'))
    .on('error', onError)
    .pipe(gulp.dest('dist/css/'));
});

// Task to bundle up vendor scripts (dependencies)
gulp.task('vendorScripts', ['cleanVendorScripts'], () => {
  const requiredLibs = isDevEnv ? libs.concat(devLibs) : libs;

  return browserify({ debug: true })
    .require(requiredLibs)
    .bundle()
    .on('error', onError)
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(!isDevEnv, uglify()))
    .pipe(sourcemaps.write('.', { sourceMappingURLPrefix: '/assets/js' }))
    .pipe(gulp.dest('dist/js'));
});

// Helper function for bundling application scripts
function bundleScripts(watch) {
  // Options for the browserify bundler
  const opts = {
    entries: [paths.scriptEntryPoint],
    debug: isDevEnv,
    plugin: [],
    // These properties are used by watchify for caching
    cache: {},
    packageCache: {}
  };

  // Use the watchify plugin when we want to watch for file changes
  if(watch) opts.plugin.push(watchify);

  // Create the bundler
  const bundler = browserify(opts)
    .transform([babelify, { sourceMap: true }])
    .transform(envify({ NODE_ENV: process.env.NODE_ENV, IN_BROWSER: true }))
    .external(libs.concat(devLibs).concat(serverOnlyLibs));

  // This function returns a stream which produces the final bundled output
  // from the bundler object
  function rebundle() {
    return bundler.bundle()
      .on('error', onError)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(gulpif(!isDevEnv, uglify()))
      .pipe(sourcemaps.write('.', { sourceMappingURLPrefix: '/assets/js' }))
      .pipe(gulp.dest('dist/js'));
  }

  // Rebundle when watchify detects a change
  bundler.on('update', () => {
    gutil.log('Rebundling...');
    rebundle();
  });

  bundler.on('log', (msg) => {
    gutil.log(`Finished bundling. ${msg}`);
  });

  // Return bundling stream (mostly for when `shouldWatch` is false)
  return rebundle();
}

// Task to bundle up application scripts
gulp.task('scripts', ['cleanScripts'], () => {
  return bundleScripts(false);
});

// Task to watch files and automatically bundle when changes occur
gulp.task('watch', () => {
  bundleScripts(true);
  gulp.watch(paths.styles, ['styles']);
});

// Task to perform a one-shot bundling of assets
gulp.task('build', ['styles', 'scripts', 'vendorScripts']);

// Default task bundles up everything and then starts watch
gulp.task('default', ['watch', 'build']);
