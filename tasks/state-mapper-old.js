/**
 * Created by wengpengfei on 2016/8/25.
 */

var gulp = require('gulp'),
    fs = require('fs'),
    config = require('../things/config/config'),
    path = require('path'),
    File = require('vinyl'),
    through2 = require('through2');


var fileMap = {};

/**
 *
 * {
 *      center: {},
 *      portal: {},
 *
 * }
 *
 *
 *
 *
 *
 * @param path
 * @returns {boolean}
 */

gulp.task('stateMapper', function () {

    config.findSubDirectory('./app')
        .forEach(function (item, index) {
            fileMap[item] = {
                files: []
            };

            if (item === 'center') {
                fileMap[item].modules = {};
            }

            if (item === 'admin') {
                fileMap[item].modules = {};
            }

            if (item === 'portal') {
                fileMap[item].modules = {};
            }
        });

    // config.findSubDirectory('./app/admin/modules')
    //
    //     .forEach(function (item, index) {
    //         fileMap['admin']['modules'][item] = {
    //             files: []
    //         }
    //     })

    config.findSubDirectory('./app/portal')

        .forEach(function (item, index) {
            fileMap['portal']['modules'][item] = {
                files: []
            };
            var grand = config.findSubDirectory('./app/portal/' + item);
            if (grand.indexOf('views') === -1) {
                fileMap['portal']['modules'][item]
                    .modules = {};
                grand.forEach((theSub) => {
                    fileMap['portal']['modules'][item]
                        .modules[theSub] = {files: []};
                });
            }

        });

    // 登陆和播放没有状态配置， 不生成stateMapper
    delete fileMap.login;
    delete fileMap.play;

    return gulp.src('./app/**/*-state.js')

        .pipe(function () {
            return through2.obj(function (file, hex, next) {

                // 收集阶段
                collect(file);

                next();
            }, function (next) {

                // 将收集的信息分析， 生成文件流

                var stream = this;

                Object.keys(fileMap).forEach(function (dir, index) {
                    var item = fileMap[dir];

                    switch (dir) {
                        case 'admin':
                            makeOnlyOne(stream, dir, item, dir + '/js/common/stateMapper.js');
                            if (item.modules) {
                                makeWithSub(stream, dir, item, dir + '/modules/$$directory$$/js/common/stateMapper.js');
                            }
                            break;
                        case 'center':
                            makeOnlyOne(stream, dir, item, dir + '/js/common/stateMapper.js');
                            if (item.modules) {
                                makeWithSub(stream, dir, item, dir + '/modules/$$directory$$/js/common/stateMapper.js');
                            }
                            break;
                        case 'login':
                        case 'play':
                            break;
                        case 'portal':
                            makeWithSub(stream, dir, item, dir + '/$$directory$$/js/common/stateMapper.js', './');
                            break;
                        default:
                            makeOnlyOne(stream, dir, item, dir + '/js/common/stateMapper.js');
                            break;
                    }
                });

                next();
            });
        }())

        .pipe(gulp.dest('./app'));

});

function center (dir, file, app) {
    var filePath = path.relative('./app/' + app + '/', file.path);

    if (/^js/.test(filePath)) {
        fileMap[dir].files.push(file);
    }

    if (/^modules/.test(filePath)) {
        var myDir = getPreDir('./app/' + app + '/modules/', file.path);
        fileMap[dir]['modules'][myDir].files.push(file);
    }
}

function portal (dir, file) {
    var myDir = getPreDir('./app/portal/', file.path);
    if (fileMap[dir]['modules'][myDir].modules) {
        var subPath = getPreDir(`./app/portal/${myDir}/`, file.path);
        fileMap[dir]['modules'][myDir].modules[subPath].files.push(file);
    } else {
        fileMap[dir]['modules'][myDir].files.push(file);
    }
}

function normal (dir, file) {
    fileMap[dir].files.push(file);
}

function getPreDir (base, pth) {
    return path.relative(base, pth).split('\\')[0];
}

function collect (file) {
    var dir = getPreDir('./app/', file.path);
    switch (dir) {
        case 'admin':
            center(dir, file, 'admin');
            break;
        case 'center':
            center(dir, file, 'center');
            break;
        case 'portal':
            portal(dir, file);
            break;
        case 'login':
        case 'play':
            break;
        default:
            normal(dir, file);
            break;
    }
}

function makeWithSub (stream, dir, item, mapperPath, deep) {
    Object.keys(item.modules)
        .forEach(function (directory, index) {
            var portalSubItem = item.modules[directory];
            if (portalSubItem.modules) {
                makeWithSub(stream, directory, portalSubItem, `${dir}/${directory}/$$directory$$/js/common/stateMapper.js`, `./${directory}/`);
            } else {
                var stateMapper = 'define(function() {"use strict"; return ',
                    mapper = {
                        modules: [],
                        futureStates: []
                    };

                portalSubItem.files.forEach(function (subFile, subIndex) {
                    var stateName = path.basename(subFile.path).replace(/(-state.js)$/, '');
                    module(mapper, directory, stateName, deep);
                    futureState(mapper, directory, stateName, deep);
                });

                stateMapper += (JSON.stringify(mapper) + '});');

                stream.push(function () {
                    var file = new File();
                    file.path = mapperPath.replace('$$directory$$', directory);
                    file.contents = new Buffer(stateMapper);
                    return file;
                }());
            }
        });
}

function makeOnlyOne (stream, dir, item, mapperPath, deep) {
    var stateMapper = 'define(function() {"use strict"; return ',
        mapper = {
            modules: [],
            futureStates: []
        };

    item.files.forEach(function (subFile, subIndex) {
        var stateName = path.basename(subFile.path).replace(/(-state.js)$/, '');
        module(mapper, dir, stateName, deep);
        futureState(mapper, dir, stateName, deep);
    });

    stateMapper += (JSON.stringify(mapper) + '});');

    stream.push(function () {
        var file = new File();
        file.path = mapperPath;
        file.contents = new Buffer(stateMapper);
        return file;
    }());
}


function module (mapper, directory, stateName, deep) {
    mapper.modules.push({
        'reconfig': true,
        'name': 'app.' + directory + '.states.' + stateName + '',
        'files': [(deep ? deep + directory + '/js/' : '') + 'states/' + stateName + '-state']
    });
}

function futureState (mapper, directory, stateName) {
    mapper.futureStates.push({
        'module': 'app.' + directory + '.states.' + stateName + '',
        'stateName': 'states.' + stateName + '',
        'url': '/' + stateName + '',
        'type': 'ocLazyLoad'
    });
}
