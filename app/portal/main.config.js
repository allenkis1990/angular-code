/**
 * Created by wengpengfei on 2016/8/8.
 */

var domain = window.location.href;

domain = domain.replace(/http:\/\/|https:\/\//, '').split('/')[0].replace(/:\d{4}/, '');

require({
    paths: {
        angular: '../../bower_components/angular/angular',
        jquery: '../../bower_components/jquery/dist/jquery',
        angularUiRouter: '../../bower_components/angular-ui-router/release/angular-ui-router',
        oclazyload: '../../bower_components/oclazyload/dist/ocLazyLoad',
        restangular: '../../bower_components/restangular/dist/restangular',
        'lodash': '../../bower_components/lodash/lodash',
        uiRouterExtras: '../../bower_components/ui-router-extras/release/ct-ui-router-extras',
        css: '../../bower_components/require-css/css',
        cookie: '../../bower_components/cookies-js/dist/cookies',
        liteValidate: '../../bower_components/validation/lite-validate',
        jqueryNiceScroll: '../../bower_components/prometheus/dist/modules/hb-nice-scroll',
        artDialog: '../../bower_components/artDialog/dist/dialog-plus-min',
        angularCookies: '../../bower_components/angular-cookies/angular-cookies',
        prometheus: '../../bower_components/prometheus/dist',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
        webuploader: '../../../bower_components/webuploader_fex/dist/webuploader',
        'webuploader.flashonly': '../../../bower_components/webuploader_fex/dist/webuploader.flashonly',
        'loader': '../../bower_components/player/src/core/common/player',
        'directives/remote-validate-directive': '../../../bower_components/prometheus/dist/directives/remote-validate',
        'common/hbWebUploader': '../../../bower_components/prometheus/dist/modules/uploader',
        angularAnimate: '../../../bower_components/angular-animate/angular-animate'
    },
    shim: {
        angular: {exports: 'angular', deps: ['jquery']},
        webuploader: {deps: ['jquery'], exports: 'webuploader'},
        restangular: {deps: ['angular', 'lodash']},
        angularUiRouter: {deps: ['angular'], exports: 'angularUiRouter'},
        oclazyload: {deps: ['angular']},
        uiRouterExtras: {deps: ['angular'], exports: 'uiRouterExtras'},
        liteValidate: {deps: ['validateEngine', 'jquery'], exports: 'liteValidate'},
        jqueryNiceScroll: {deps: ['jquery', 'angular'], exports: 'jqueryNiceScroll'},
        artDialog: {deps: ['jquery'], exports: 'dialog'},
        angularCookies: {deps: ['angular']},
        loader: {exports: 'loader'},
        angularAnimate: {deps: ['angular'], exports: 'angularAnimate'}
    },
    callback: function () {

        require.extUtil = {
            getItem: function (arras, dir, filed) {
                var i = 0;
                var len = arras.length;
                var item = {};
                for (i; i < len; i++) {
                    if (arras[i][filed || 'dir'] === dir) {
                        item = arras[i];
                        break;
                    }
                }
                return item;
            },
            openWindow: function (windowInstance, href, target) {
                href = require.extUtil.analysisUrl(href);
                if (!windowInstance) {
                    window.open(href, target);
                } else {
                    windowInstance.location.href = href;
                }
            },
            analysisUrl: function (str) {
                if(!/^\/(center|portal|admin)/.test(str)) {
                    return str.replace(/^\/#/, '');
                }
                if (require.unitPath) {
                    str = str.replace(/\/#/, '/' + require.unitPath);
                } else {
                    str = str.replace(/\/#/, '');
                }
                return str;
            }
        };

        require.unitPath = '';

        require(['angular', '_app_config_infos_', 'jquery'], function (angular, _app_config_infos_) {

            var invoker = angular.injector(['ng']),
                myInfo;

            invoker.invoke(['$http', '$log', function ($http, $log) {

                /**
                 * 获取单位名称
                 * @returns {string}
                 */
                function getSubUnitNameFromLocation () {
                    var href = location.href,
                        baseDom = document.getElementsByTagName('base')[0],
                        path = href.replace(new RegExp(baseDom.href + '?'), ''),
                        index = path.indexOf('/');
                    if (index === -1) {
                        return path;
                    }
                    return path.substring(0, path.indexOf('/'));
                }

                $http.get('/web/login/login/getProjectMainInfoList?_q_=' + (+new Date()), {
                    params: {
                        domain: domain,
                        type: 'portal'
                    }
                })
                    .then(function (data) {

                        var remoteData = data.data.info,
                            deps = ['solutions', 'app'],
                            compare;
                        if (remoteData && remoteData.units && remoteData.units.length) {
                            require.unitPath = getSubUnitNameFromLocation();
                            var item = require.extUtil.getItem(remoteData.units, require.unitPath, 'path');
                            compare = remoteData.baseDir + '\\' + (item.dir || remoteData.dir);
                        } else {
                            compare = remoteData.dir ? remoteData.baseDir + '\\' + remoteData.dir : remoteData.baseDir;
                        }

                        for (var i = 0; i < _app_config_infos_.length; i++) {
                            if (compare === _app_config_infos_[i].name) {
                                myInfo = _app_config_infos_[i];
                                break;
                            }
                        }

                        if (!myInfo) {
                            $log.log('无法找到匹配信息，系统加载失败!!');
                            // window.location.href = '404.html';
                            return false;
                        }

                        // 设置标头
                        // document.title = remoteData.name;

                        var solutions = angular.module('solutions', []);

                        // 域名相关配置， 主要处理多子项目多子单位的
                        solutions.constant('hb.domainConfig', remoteData);
                        //angular.element('title').text(remoteData.name);
                        // 如果有units 说明是子项目访问
                        // 1. 如果路径只有域名， 则判定返回的数据中是否有 dir 跳转到 dir
                        // 2. 如果路径携带 /fz 或者其他的, 则判定返回的数据units中能否匹配到对应fz的元素，将其返回，并且路由到fz

                        if (remoteData && remoteData.units && remoteData.units.length) {

                            solutions.config(['$httpProvider', function ($httpProvider) {
                                $httpProvider.interceptors.push([function () {
                                    return {
                                        request: function (config) {
                                            if(require.unitPath===remoteData.dir||'#'===require.unitPath){
                                            }else{
                                                config.headers['Hb-Domain-Path'] = require.unitPath;
                                            }
                                            return config;
                                        }
                                    };
                                }]);
                            }]);
                        }

                        solutions.config(['$locationProvider', function ($locationProvider) {
                            /////////////////////////////////////////////
                            /////                                   /////
                            $locationProvider.hashPrefix('!');
                            $locationProvider.html5Mode(true);
                            /////                                   /////
                            /////////////////////////////////////////////
                        }]);

                        //// 当前处理主要是登录的时候要将后面的单位路径传输到center那边去
                        var windowOpen = window.open;
                        window.open = function () {
                            arguments[0] = require.extUtil.analysisUrl(arguments[0]);
                            return windowOpen.apply(this, arguments);
                        };

                        require(['./' + myInfo.main.replace(/(^js\/)?(.*)\.js$/, '$2')], function () {

                            // require.config({
                            //     baseUrl: myInfo.name
                            // })
                            solutions.config(['$provide', function ($provide) {
                                //解决ie10下面的placeholder导致$dirty为true
                                $provide.decorator('$sniffer', ['$delegate', function ($sniffer) {
                                    var msie = parseInt((/msie (\d+)/.exec(angular.lowercase(navigator.userAgent)) || [])[1], 10),
                                        _hasEvent = $sniffer.hasEvent;
                                    $sniffer.hasEvent = function (event) {
                                        if (event === 'input' && msie === 10) {
                                            return false;
                                        }
                                        _hasEvent.call(this, event);
                                    };
                                    return $sniffer;
                                }]);
                            }]);

                            angular.bootstrap(document.getElementsByTagName('html')[0], deps);
                        });

                        require.config_data_for_cms = remoteData;
                        require.local_config_data_for_cms = myInfo;
                    });
            }]);
        });
    }
});
