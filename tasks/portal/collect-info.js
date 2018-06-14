const gulp = require('gulp');
const through2 = require('through2');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const File = require('vinyl');
const dirMapper = {};

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

                        if (subDir !== env.boilerplatePath) {
                            father[dir][subDir] = {};
                            if (getSubs(`${_path}/${dir}/${subDir}`).indexOf(env.sign) !== -1) {
                                getSubDir(`${_path}/${dir}/${subDir}`)
                                    .forEach((grandDir) => {
                                        father[dir][subDir][grandDir] = {};
                                    });
                                father[dir][subDir][env.sign] = '# 标识';
                            }
                        }
                    });
            }
        });
}

walkThrough(env.appPath, dirMapper);

function getContent (file) {
    return file.contents.toString();
}

let noop = () => {
};

function getMainAppJs (glob, bbbb, where) {

    let some = path.resolve(__dirname, `../.${glob}`);

    return new Promise((res, rej) => {

        gulp.src(`${glob}/**/main.app.js`)

            .on('error', (error) => {
                console.log(error);
            })

            .pipe(through2.obj(function (file, enc, next) {
                let thePath = file.path.replace(some + '\\', '');
                if (where) {
                    bbbb[where][thePath] = getContent(file);
                } else {
                    Object.keys(bbbb)
                        .forEach((app) => {
                            let keys = Object.keys(bbbb[app]);
                            if (bbbb[app][env.sign]) {
                                keys.forEach((key) => {
                                    bbbb[app][key][thePath] = getContent(file);
                                });
                            } else {
                                bbbb[app][thePath] = getContent(file);
                            }
                        });
                }
                this.push(file);
                next();
            }), function (next) {
                next();
            })
            .on('error', (error) => {
                console.log(error);
            })
            .on('data', noop)
            .on('end', res);
    });
}

gulp.task('collectInfo', () => {

    let reg = /(<script\s*id="app_config_info">)(.|\n|\t|\s)*?(<\/script>)/gi;

    return new Promise((resOuter, rej) => {

        concatAndCoverFiles()

            .then(function () {
                let promises = [];
                Object.keys(dirMapper)

                    .forEach((app) => {
                        let infos = [];
                        Object.keys(dirMapper[app])

                            .forEach((subProject) => {
                                if (dirMapper[app][subProject][env.sign]) {
                                    Object.keys(dirMapper[app][subProject])
                                        .forEach((grandProject) => {
                                            if (grandProject !== env.sign) {
                                                Object.keys(dirMapper[app][subProject][grandProject])

                                                    .forEach((mainApp) => {
                                                        let info = {};
                                                        info.main = `${subProject}\\${grandProject}\\${mainApp}`;
                                                        info.name = `${subProject}\\${grandProject}`;
                                                        info.theme = `${subProject}/${grandProject}/styles/webstyle.css`;
                                                        infos.push(info);
                                                    });
                                            }
                                        });
                                } else {
                                    Object.keys(dirMapper[app][subProject])

                                        .forEach((mainApp) => {
                                            let info = {};
                                            info.main = `${subProject}\\${mainApp}`;
                                            info.name = subProject;
                                            info.theme = `${subProject}/styles/webstyle.css`;
                                            infos.push(info);
                                        });
                                }
                            });

                        promises.push(new Promise((resInner, rej) => {
                            gulp.src(`${env.appPath}/${app}/index.html`)

                                .pipe(through2.obj(function (file, enc, next) {
                                    file.contents = new Buffer(file.contents.toString()
                                        .replace(reg, ('$1define("_app_config_infos_", function () {"use strict"; return ' + JSON.stringify(infos) + ' }) $3')));
                                    let _path = file.path
                                        .replace(path.resolve(__dirname, `../.${env.appPath}/${app}/`), '');
                                    _path = _path.replace(/^\\/, '');
                                    let $file = new File();
                                    $file.path = _path;
                                    $file.contents = file.contents;
                                    this.push($file);
                                    next();
                                }))
                                .pipe(gulp.dest(`${env.appPath}/${app}`))
                                .on('end', resInner);
                        }));
                    });

                Promise.all(promises)
                    .then(resOuter);
            });
    });
});

function concatAndCoverFiles () {
    let promises = [];

    Object.keys(dirMapper)

        .forEach((app) => {
            promises.push(new Promise((res_1, rej) => {
                getMainAppJs(`${env.appPath}/${app}/${env.boilerplatePath}`, dirMapper[app])

                    .then(function () {
                        let promises = [];
                        Object.keys(dirMapper[app])
                            .forEach((subProject) => {
                                if (dirMapper[app][subProject][env.sign]) {
                                    Object.keys(dirMapper[app][subProject])

                                        .forEach((grandProject) => {
                                            promises.push(getMainAppJs(`${env.appPath}/${app}/${subProject}/${grandProject}`, dirMapper[app][subProject], grandProject));
                                        });
                                } else {
                                    promises.push(getMainAppJs(`${env.appPath}/${app}/${subProject}`, dirMapper[app], subProject));
                                }
                            });

                        Promise.all(promises)

                            .then(function () {
                                res_1();
                            });
                    });
            }));
        });

    return Promise.all(promises);
}