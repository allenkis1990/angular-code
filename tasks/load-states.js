/**
 * Created by wengpengfei on 2016/8/25.
 */

var gulp = require('gulp'),
    fs = require('fs'),
    config = require('../things/config/config'),
    path = require('path');

gulp.task('loadStates', function () {
    var dirs = fs.readdirSync(config.getTemplateBase()),
        stateMap = {};
    // 获取文件夹
    // 将文件夹下面
    var stream = gulp.src(config.getTemplateBase('/**/*-state.js')),
        portalSub = fs.readdirSync(config.getTemplateBase(config.portal));

    stream.on('data', function (file) {
        /**
         * 获取子目录 admin/、portal/、login/、center/、等目录
         * ['admin','portal','login','center']
         */
        config.getSubDirectories(dirs, config.app + '/')

            .map(function (directory) {
                var reg = new RegExp('^' + directory + '\\\\', 'ig'),
                    filePath = path.relative('./app', file.path);

                // 判断是否是/admin/、/portal/、/center/、/login/开头的文件
                if (reg.test(filePath)) {

                    // portal文件目录下面的要特殊处理
                    if (directory === config.portal) {

                        // 获取portal下面的文件目录
                        config.getSubDirectories(portalSub, config.getTemplateBase(config.portal))
                            .forEach(function (item) {
                                var regSub = new RegExp('^portal\\\\' + item + '\\\\', 'ig');
                                if (regSub.test(filePath)) {
                                    var subThe = path.basename(file.path).replace(/(-state.js)$/, '');
                                    stateMap[directory] = stateMap[directory] || {};
                                    stateMap[directory] = stateMap[directory] || {};
                                    stateMap[directory][item] = stateMap[directory][item] || {};
                                    stateMap[directory][item].modules = stateMap[directory][item].modules || [];
                                    stateMap[directory][item].futureStates = stateMap[directory][item].futureStates || [];
                                    stateMap[directory][item].modules.push({
                                        'reconfig': true,
                                        'name': 'app.' + directory + '.states.' + subThe + '',
                                        'files': [item + '/js/states/' + subThe + '-state.js']
                                    });
                                    stateMap[directory][item].futureStates.push({
                                        'module': 'app.' + directory + '.states.' + subThe + '',
                                        'stateName': 'states.' + subThe + '',
                                        'url': '/' + subThe + '',
                                        'type': 'ocLazyLoad'
                                    });
                                }
                            });
                    } else {
                        writeModules_nd_futureStates(directory, file, '' + 'states/' + path.basename(file.path).replace(/(.js)$/, ''));
                    }
                }
            });
    });
    stream.on('end', function () {
        // fs.writeFileSync ( './inin.json', JSON.stringify ( stateMap ), config.utfEncoding );
        for (var state_map in stateMap) {
            if (state_map === config.portal) {
                // write ( state_map, '/' + item + '/js/common/si.js' );
                for (var pro in stateMap[state_map]) {
                    var portalModule = stateMap[state_map][pro],
                        contents = JSON.stringify(portalModule);
                    contents = 'define ( function () {"use strict"; return ' + contents + '} );';
                    fs.writeFileSync(config.getTemplateBase(state_map + '/' + pro + '/js/common/si.js' /*'/js/common/si.js' */), contents, config.utfEncoding);
                }
            } else {
                write(state_map, '/js/common/si.js');
            }
        }
    });

    function writeModules_nd_futureStates (directory, file, files) {

        var name = path.basename(file.path).replace(/(-state.js)$/, '');
        stateMap[directory] = stateMap[directory] || {};
        stateMap[directory] = stateMap[directory] || {};
        stateMap[directory].modules = stateMap[directory].modules || [];
        stateMap[directory].futureStates = stateMap[directory].futureStates || [];

        stateMap[directory].modules.push({
            'reconfig': true,
            'name': 'app.' + directory + '.states.' + name + '',
            'files': [files]
        });
        stateMap[directory].futureStates.push({
            'module': 'app.' + directory + '.states.' + name + '',
            'stateName': 'states.' + name + '',
            'url': '/' + name + '',
            'type': 'ocLazyLoad'
        });
    }

    /**
     *
     * @param dir
     * @param filePath
     */
    function write (dir, filePath) {
        var routInfo = stateMap[dir],
            contents = JSON.stringify(routInfo);
        contents = 'define ( function () {"use strict"; return ' + contents + '} );';
        fs.writeFileSync(config.getTemplateBase(dir + filePath /*'/js/common/si.js' */), contents, config.utfEncoding);
    }

    return stream;

});
