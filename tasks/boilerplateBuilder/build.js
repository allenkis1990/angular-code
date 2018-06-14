/**
 * 构建思路
 *
 *      1. 定义 按目录编译的函数
 *      2. 优先将某个 app 下面的应用拆解构建
 *      3. 如： 先构建 app/portal
 *      4. 则： 有json = app/portal下面的目录结构
 *              let dirMapper = {
 *                  "boilerplate": {},
 *                  "fujian": {
 *                      "fuzhou": {},
 *                      "zhangzhou": {}
 *                  },
 *                  "guangdong": {}
 *              }
 *      5. 按目录互不干涉的情况下面依次循环将当前的json结构执行构建
 *
 *          ````javascript
 *              // 执行构建
 *              function build() {}
 *
 *              Object.keys(dirMapper)
 *
 *                  .forEach((subProject) => {
 *                      let keys = !Object.keys(dirMapper[subProject])
 *                      // 如果目录下面存在子目录则执行子目录构建
 *                      if(keys.length) {
 *                          keys.forEach((grandProject) => {
 *                              build()
 *                          })
 *                      } else {
 *                          build();
 *                      }
 *                  })
 *          ````
 *        6. 执行构建完成
 */


const fs = require('fs');
const gulp = require('gulp');
const through2 = require('through2');
const _ = require('lodash');
const path = require('path');
const File = require('vinyl');
const hashFile = require('./hash-file');
//
const UglifyJs = require('uglify-js');
const UglifyHtml = require('html-minifier');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const removeLogs = require('gulp-removelogs');
const ngAnnotate = require('gulp-ng-annotate');
const autoprefixer = require('gulp-autoprefixer'); // css前缀追加
const sign = '.hbrc';
const placeholder = env.placeholder;
const source = env.appPath;
const dist = env.deployPath;
const boilerplate = env.boilerplatePath;
const textFile = ['.js', '.html', '.txt', '.less', '.css'];
let noop = () => {
};

const dirMapper = {};

/**
 * 判断是否是js文件
 * @param ext
 * @returns {boolean}
 */
function isScript (ext) {
    return ext === '.js';
}

function getSubDir (_path) {
    let dirs = [];
    if (!fs.existsSync(_path)) {
        return dirs;
    }
    return _.remove(dirs = fs.readdirSync(_path), (dir) => {
        return !fs.statSync(`${_path }/${dir}`).isDirectory();
    }), dirs;
}

function getSubs (_path) {
    return fs.readdirSync(_path);
}

function walkThrough (_path, father) {
    getSubDir(_path)
        .forEach((dir) => {
            if (['center', 'portal', 'admin', 'login'].indexOf(dir) !== -1) {
                father[dir] = {};
                getSubDir(`${_path}/${dir}`)
                    .forEach((subDir) => {

                        if (subDir !== boilerplate) {
                            father[dir][subDir] = {};
                            if (getSubs(`${_path}/${dir}/${subDir}`).indexOf(sign) !== -1) {
                                getSubDir(`${_path}/${dir}/${subDir}`)
                                    .forEach((grandDir) => {
                                        father[dir][subDir][grandDir] = {};
                                    });
                                father[dir][subDir][sign] = '# 标识';
                            }
                        }
                    });
            }
        });
}

walkThrough(source, dirMapper);

function concat (fileType) {
    return new Promise((res, rej) => {
        concatAndCoverFiles(fileType)

            .then(function () {
                let promises = [];
                Object.keys(dirMapper)

                    .forEach((app) => {
                        Object.keys(dirMapper[app])

                            .forEach((subProject) => {
                                if (dirMapper[app][subProject][sign]) {
                                    delete dirMapper[app][subProject][sign];
                                    Object.keys(dirMapper[app][subProject])
                                        .forEach((grandProject) => {
                                            promises.push(new Promise((res, rej) => {
                                                deal(app, subProject, grandProject, res);
                                            }));
                                        });

                                } else {
                                    promises.push(new Promise((res, rej) => {
                                        deal(app, subProject, undefined, res);
                                    }));
                                }
                            });
                    });

                Promise.all(promises)
                    .then(res);
            });
    });
}

function deal (app, subProject, grandProject, res) {
    let dealPath = grandProject ? `${app}\\${subProject}\\${grandProject}` : `${app}\\${subProject}`;
    gulp.src('')
        .pipe(through2.obj(function (file, enc, next) {

            let keyObject = grandProject ? dirMapper[app][subProject][grandProject] : dirMapper[app][subProject];
            Object.keys(keyObject)

                .forEach((fileMapper) => {
                    let content = grandProject ? dirMapper[app][subProject][grandProject][fileMapper] : dirMapper[app][subProject][fileMapper];
                    // 替换占位符 @placeholder
                    let parsedPath = path.parse(fileMapper);
                    if (textFile.indexOf(parsedPath.ext) !== -1) {
                        if (content.indexOf(placeholder) !== -1) {
                            content = content.split(placeholder)
                                .join(dealPath.replace(`${app}\\`, '').replace(/\\/g, '/'));
                        }
                    }
                    this.push(createFile(`${dealPath}\\${fileMapper}`, content));
                });
            next();
        }))
        .on('error', error => console.log(error))
        .pipe(hashFile(dealPath))
        .pipe(gulp.dest(dist))
        .on('end', res);
}

function createFile (_path, content) {
    let parsePath = path.parse(_path);
    let $file = new File();
    let compiler = ({
        '.js': () => {
            // let min = UglifyJs.minify(content)
            // content = min.code
        },
        '.html': () => {
            content = UglifyHtml.minify(content, {
                // removeAttributeQuotes: true,
                removeComments: true,
                collapseWhitespace: true
            });
        }
    })[parsePath.ext];
    compiler && compiler();
    $file.contents = new Buffer(content);
    $file.path = _path;
    return $file;
}

function concatAndCoverFiles (fileType) {
    let promise_1 = [];
    Object.keys(dirMapper)

        .forEach((app) => {
            promise_1.push(new Promise((res_1, rej) => {
                getBoilerPlate(`${source}/${app}/${boilerplate}`, dirMapper[app], fileType)

                    .then(function () {
                        let promises = [];
                        Object.keys(dirMapper[app])
                            .forEach((subProject) => {
                                if (dirMapper[app][subProject][sign]) {
                                    Object.keys(dirMapper[app][subProject])

                                        .forEach((grandProject) => {
                                            promises.push(getBoilerPlate(`${source}/${app}/${subProject}/${grandProject}`, dirMapper[app][subProject], fileType, grandProject));
                                        });
                                } else {
                                    promises.push(getBoilerPlate(`${source}/${app}/${subProject}`, dirMapper[app], fileType, subProject));
                                }
                            });

                        Promise.all(promises)

                            .then(function () {
                                res_1();
                            });
                    });
            }));

        });
    return Promise.all(promise_1);

}

function getContent (file) {
    let parsedPath = path.parse(file.path);
    if (textFile.indexOf(parsedPath.ext) !== -1) {
        return file.contents.toString();
    }
    return file.contents;
}

function getBoilerPlate (glob, mapper, fileType, where) {

    let some = path.resolve(__dirname, `../.${glob}`);

    return new Promise((res, rej) => {

        gulp.src(`${glob}/**/*${fileType}`)

            .pipe(gulpif(function (file) {
                return path.parse(file.path).ext === '.less';
            }, less()))

            .pipe(gulpif(function (file) {
                return path.parse(file.path).ext === '.css';
            }, less()))

            // .pipe(__if(!env.dev, cssmin({
            //     //避免在清除的时候将文件路径重新定位
            //     rebase: false,
            //     compatibility: 'ie8'
            // })))

            // 删除logs
            .pipe(gulpif(function (file) {
                return path.parse(file.path).ext === '.js';
            }, removeLogs()))

            // 执行angular特殊化
            .pipe(gulpif(function (file) {
                return path.parse(file.path).ext === '.js';
            }, ngAnnotate()))

            // 压缩
            .pipe(gulpif(function (file) {
                return path.parse(file.path).ext === '.js';
            }, uglify({
                compress: {screw_ie8: false},
                mangle: {screw_ie8: false},
                output: {screw_ie8: false}
            })))

            .on('error', error => console.log(error))

            .pipe(through2.obj(function (file, enc, next) {
                let thePath = file.path.replace(some + '\\', '');
                if (where) {
                    mapper[where][thePath] = getContent(file);
                } else {
                    Object.keys(mapper)
                        .forEach((app) => {
                            let keys = Object.keys(mapper[app]);
                            if (mapper[app][sign]) {
                                keys.forEach((key) => {
                                    mapper[app][key][thePath] = getContent(file);
                                });
                            } else {
                                mapper[app][thePath] = getContent(file);
                            }
                        });
                }
                this.push(file);
                next();
            }), next => next())
            .on('error', error => console.log(error))
            .on('data', noop)
            .on('end', res);
    });
}

gulp.task('concat', () => {
    let reg = /(<script\s*id="app_config_info">)(.|\n|\t|\s)*?(<\/script>)/gi;
    // delete dirMapper.admin;
    // delete dirMapper.center;
    return new Promise((res, rej) => {
        concat('.*')

            .then(function () {
                let promises = [];

                Object.keys(dirMapper)

                    .forEach((app) => {

                        let infos = [];
                        promises.push(new Promise((res, rej) => {

                            let aPath = path.resolve(__dirname, `../.${dist}/${app}/`);
                            gulp.src(`${dist}/${app}/**/main.app*.js`)

                                .pipe(through2.obj(function (file, enc, next) {
                                    let replacedPath = file.path.replace(`${aPath}\\`, '');
                                    let info = {};
                                    let dir = replacedPath.substring(0, replacedPath.lastIndexOf('\\'));
                                    info.main = replacedPath;
                                    info.name = dir;
                                    info.nameddf = 'fuck 凸-。 - 凸';
                                    let resolvedPath = path.resolve(__dirname, `../../${dist}/${app}/${dir}/styles`);
                                    gulp.src(`${dist}/${app}/${dir}/styles/**/*webstyle*.css`)

                                        .pipe(through2.obj(function (file, enc, innerNext) {
                                            let replacedPath = file.path.replace(`${resolvedPath}\\`, '');
                                            info.theme = `${dir}/styles/${replacedPath}`;
                                            this.push(file);
                                            innerNext();
                                        }, () => {
                                            infos.push(info);
                                            next();
                                        }));
                                }, (next) => {
                                    gulp.src(`${source}/${app}/*.*`)

                                        .pipe(through2.obj(function (file, enc, next) {
                                            let parsedPath = path.parse(file.path);
                                            if (parsedPath.base === 'index.html') {
                                                file.contents = new Buffer(file.contents.toString()
                                                    .replace(reg, ('$1define("_app_config_infos_", function () {"use strict"; return ' + JSON.stringify(infos) + ' }) $3')));
                                            }
                                            let _path = file.path
                                                .replace(path.resolve(__dirname, `../.${source}/${app}/`), '');
                                            _path = _path.replace(/^\\/, '');
                                            let contents = file.contents.toString();

                                            // 是js文件才做替换动作
                                            if (isScript(parsedPath.ext)) {
                                                // 将文件内容中的$$dev$$替换成 false
                                                contents = contents.replace(/\$\$dev\$\$/g, 'false');
                                            }

                                            this.push(createFile(`${_path}`, contents));
                                            next();
                                        }))
                                        // 删除logs
                                        .pipe(gulpif(function (file) {
                                            return path.parse(file.path).ext === '.js';
                                        }, removeLogs()))

                                        // 执行angular特殊化
                                        .pipe(gulpif(function (file) {
                                            return path.parse(file.path).ext === '.js';
                                        }, ngAnnotate()))

                                        // 压缩
                                        .pipe(gulpif(function (file) {
                                            return path.parse(file.path).ext === '.js';
                                        }, uglify({
                                            compress: {screw_ie8: false},
                                            mangle: {screw_ie8: false},
                                            output: {screw_ie8: false}
                                        })))

                                        .on('error', error => console.log(error))
                                        .pipe(gulpif(function (file) {
                                            // 如果是index.html 以外的html页面则不进行hash
                                            return !(file.path !== 'index.html' && /\.html$/.test(file.path));
                                        }, hashFile(`${source.replace(/\.\//, '')}\\${app}`)))
                                        .pipe(gulp.dest(`${dist}/${app}`))
                                        .on('end', res);
                                    next();
                                }));
                        }));
                    });

                Promise.all(promises)

                    .then(res);
            });
    });
});