const fs = require('fs');
const gulp = require('gulp');
const _ = require('lodash');
const through2 = require('through2');
const path = require('path');
const File = require('vinyl');
//
const sign = '.hbrc';
const source = env.appPath;
const boilerplate = env.boilerplatePath;
const mapperName = 'js/common/stateMapper';
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
                        if (subDir !== boilerplate) {
                            if (getSubs(`${_path}/${dir}/${subDir}`).indexOf(sign) !== -1) {
                                father[dir][subDir] = {};
                                getSubDir(`${_path}/${dir}/${subDir}`)
                                    .forEach((grandDir) => {
                                        father[dir][subDir][grandDir] = {
                                            states: [],
                                            [mapperName]: [
                                                'define(function() {"use strict"; return ',
                                                {
                                                    modules: [],
                                                    futureStates: []
                                                },
                                                '   });'
                                            ]
                                        };
                                    });
                                father[dir][subDir][sign] = '# 标识';
                            } else {
                                father[dir][subDir] = {
                                    states: [],
                                    [mapperName]: [
                                        'define(function() {"use strict"; return ',
                                        {
                                            modules: [],
                                            futureStates: []
                                        },
                                        '   });'
                                    ]
                                };
                            }
                        }
                    });
            } else {
                father[dir] = {};
            }
        });
}

walkThrough(source, dirMapper);

const noop = () => {
};

function getBoilerPlateState (glob, bbbb, where) {

    let some = path.resolve(__dirname, `.${glob}`);
    // console.log(dirMapper)
    return new Promise((res, rej) => {

        gulp.src(`${glob}/**/*-state.js`)

            .on('error', (error) => {
                console.log(error);
            })

            .pipe(through2.obj(function (file, enc, next) {
                let thePath = file.path.replace(some + '\\js\\', '');
                if (where) {
                    bbbb[where].states.push(thePath);
                } else {
                    Object.keys(bbbb)
                        .forEach((app) => {
                            let keys = Object.keys(bbbb[app]);
                            if (bbbb[app][sign]) {
                                keys.forEach((key) => {
                                    if (key !== sign) {
                                        bbbb[app][key].states.push(thePath);
                                    }
                                    // bbbb[app][key][thePath] = ''
                                });
                            } else {
                                bbbb[app].states.push(thePath);
                                // bbbb[app][thePath] = ''
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

gulp.task('stateMapper', () => {
    let promisesOuter = [];
    Object.keys(dirMapper)

        .forEach((app) => {
            if (typeof dirMapper[app] === 'object') {
                promisesOuter.push(new Promise((resOuter, rej) => {
                    getBoilerPlateState(`${source}/${app}/${boilerplate}`, dirMapper[app])

                        .then(function () {

                            let promisesInner = [];
                            Object.keys(dirMapper[app])
                                .forEach((subProject) => {
                                    if (dirMapper[app][subProject][sign]) {
                                        Object.keys(dirMapper[app][subProject])

                                            .forEach((grandProject) => {
                                                promisesInner.push(getBoilerPlateState(`${source}/${app}/${subProject}/${grandProject}`, dirMapper[app][subProject], grandProject));
                                            });
                                    } else {
                                        promisesInner.push(getBoilerPlateState(`${source}/${app}/${subProject}`, dirMapper[app], subProject));
                                    }
                                });

                            Promise.all(promisesInner)

                                .then(function () {
                                    resOuter();
                                });
                        });
                }));
            } else {
                // promises.push(findStateFiles(dirMapper, app, `${source}/${app}`))
            }
        });


    return Promise.all(promisesOuter)

        .then(function () {
            // console.log(dirMapper)
            createStateFiles();
        });

});

function createStateFiles () {

    gulp.src('')

        .pipe(through2.obj(function (file, enc, next) {

            Object.keys(dirMapper)

                .forEach(app => {
                    Object.keys(dirMapper[app])
                        .forEach(subProject => {
                            if (dirMapper[app][subProject][sign]) {
                                if (subProject !== sign) {
                                    Object.keys(dirMapper[app][subProject])

                                        .forEach(grandProject => {
                                            stateMapperGen.call(this, dirMapper[app][subProject], grandProject, `${app}/${subProject}/${grandProject}`, `${subProject}/${grandProject}/`);
                                        });
                                }
                            } else {
                                stateMapperGen.call(this, dirMapper[app], subProject, `${app}/${subProject}`, `${subProject}/`);
                            }
                        });
                });
            next();
        }))

        .pipe(gulp.dest(env.appPath));

}

function stateMapperGen (obj, field, _path, statePath) {
    if (obj[field].states
        && obj[field].states.length) {
        let item1 = obj[field][mapperName][1];
        obj[field].states
            .forEach(state => {
                let stateName = state.replace(/states\\/g, '').replace(/-state\.js$/g, '');
                item1.modules.push({
                    'reconfig': true,
                    'name': 'app.' + field + '.states.' + stateName + '',
                    'files': [`${statePath}js/${state}`.replace(/\.js$/, '').replace(/\\/g, '/')]
                });

                item1.futureStates.push({
                    'module': 'app.' + field + '.states.' + stateName + '',
                    'stateName': 'states.' + stateName + '',
                    'url': '/' + stateName + '',
                    'type': 'ocLazyLoad'
                });
            });

        obj[field][mapperName][1] = JSON.stringify(item1);

        let $file = new File();
        $file.path = `${_path}/${mapperName}.js`;
        $file.contents = new Buffer(obj[field][mapperName].join(' '));

        this.push($file);
    }
}
