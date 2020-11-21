const { src, dest } = require('gulp');
const gulp = require('gulp');
const del = require('del');

const ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

const chalk = require('chalk');

function progress(message) {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
    process.stdout.write(chalk`{dim.gray [gulp]} {reset ${message}}`)
}


gulp.task('ts', function() {
    progress(chalk`{dim Compiling {yellow TypeScript} ...}`);
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(dest('dist'));
});

gulp.task('copy', function() {
    progress(chalk`{dim Copying {yellow static files} ...}`);
    return src('src/main/resources/*.yaml')
        .pipe(dest('dist/main/resources'));
});

gulp.task('clean', function() {
    progress(chalk`{dim Cleaning {yellow ./dist/} ...}`);
    return del('dist/**');
});

gulp.task('done', function() {
    progress(chalk`{dim We're all done!}`);
    process.stdout.write('\n');
    return Promise.resolve();
})

gulp.task('default', gulp.series('clean', 'ts', 'copy', 'done'));