const through2 = require('through2');
const gulp = require('gulp');
const less = require('gulp-less');

gulp.task('less:admin:center:portal:login', function () {
    return gulp
        .src('./app/@(center|admin|portal|login)/**/webstyle.less')

        .pipe(through2.obj(function (file, enc, next) {
            this.push(file);
            next();
        }))
        .pipe(less())
        .on('error', error => console.log(error))
        .pipe(gulp.dest(env.cssDest));
});
