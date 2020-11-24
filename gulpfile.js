const { src, dest } = require('gulp');
const gulp = require('gulp');
const del = require('del');
const nodemon = require('gulp-nodemon');
const ts = require('gulp-typescript');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

/**
 * Compiles the entire TypeScript project.
 */
gulp.task('ts', function() {
    const tsProject = ts.createProject('tsconfig.json');
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(dest('dist'));
});
/**
 * Compiles all Sass files.
 */
gulp.task('sass', function() {
    return gulp.src('src/main/code/dashboard/public/sass/**/*.sass')
        .pipe(sass.sync({outputStyle: 'compressed', sourceMap: false}).on('error', sass.logError))
        .pipe(gulp.dest('dist/main/code/dashboard/public/css'));
});
/**
 * Copies static resources (except .ts and .sass files) into the dist directory.
 */
gulp.task('static', function() {
    return src(['src/**/*.*', '!src/**/*.ts', '!src/**/*.sass'])
        .pipe(dest('dist'));
});
/**
 * Cleans the dist directory.
 */
gulp.task('clean', function() {
    return del('dist/**');
});

/**
 * Compiles TypeScript and Sass files.
 */
gulp.task('compile', gulp.parallel('ts', 'sass'));
/**
 * Performs a full build of the project by cleaning, compiling and copying.
 */
gulp.task('fullbuild', gulp.series('clean', gulp.parallel('compile', 'static')));
/**
 * Alias for fullbuild.
 */
gulp.task('default', gulp.series('fullbuild'));
/**
 * Serves an instance of the dashboard.
 */
gulp.task('dashboard', gulp.series('fullbuild', function() {
    return nodemon({
        script: 'dist/main/code/dashboard/index.js',
        watch: 'src/main/code/dashboard/',
        tasks: ['compile', 'static'],
        ext: 'ts,sass,pug'
    });
}));
/**
 * Serves an instance of the bot.
 */
gulp.task('bot', gulp.series('fullbuild', function() {
    return nodemon({
        script: 'dist/main/code/bot/index.js',
        watch: 'src/main/code/bot/',
        tasks: ['compile', 'static'],
        ext: 'ts'
    });
}));