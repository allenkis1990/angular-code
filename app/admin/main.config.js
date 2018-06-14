/**
 * Created by wengpengfei on 2016/8/8.
 */

var domain = window.location.href

domain = domain.replace(/http:\/\/|https:\/\//, '').split('/')[0].replace(/:\d{4}/, '')

require({
    paths: {
        controllers: 'controllers',
        services: 'services',
        kendo: '/bower_components/KendoUI/js',
        angularMocks: '/bower_components/angular-mocks/angular-mocks',
        angularResource: '/bower_components/angular-resource/angular-resource',
        angularRoute: '/bower_components/angular-route/angular-route',
        angularSanitize: '/bower_components/angular-sanitize/angular-sanitize',
        angularTouch: '/bower_components/angular-touch/angular-touch',
        cooper: '/bower_components/cooper/dist/cooper',
        d3: '/bower_components/d3/d3',
        'webuploader.flashonly': '/bower_components/webuploader_fex/dist/webuploader.flashonly',
        cropper: '/bower_components/cropper/dist/cropper',
        angularProgress: '/bower_components/ngprogress/build/ngProgress',
        'pathConst': '/bower_components/StudyLibrary/pathConst',
        'playLoader': '/bower_components/StudyLibrary/scripts/initialization',
        'echarts': '/bower_components/echarts/build/source/echarts-all',
        zeroCopy: '/bower_components/zeroclipboard/dist/ZeroClipboard',
        prometheus: '/bower_components/prometheus/dist',
        jqueryNiceScroll: '/bower_components/jquery.nicescroll/jquery.nicescroll',
        sweetAlert: '/bower_components/sweetalert/dist/sweetalert.min',
        'directives/remote-validate-directive': '/bower_components/prometheus/dist/directives/remote-validate',
        'directives/upload-files-directive': '/bower_components/prometheus/dist/directives/upload-files',
        'directives/upload-image-directive': '/bower_components/prometheus/dist/directives/upload-image',
        'common/hbWebUploader': '/bower_components/prometheus/dist/modules/uploader',
        angular: '/bower_components/angular/angular',
        jquery: '/bower_components/jquery/dist/jquery',
        angularUiRouter: '/bower_components/angular-ui-router/release/angular-ui-router',
        oclazyload: '/bower_components/oclazyload/dist/ocLazyLoad',
        restangular: '/bower_components/restangular/dist/restangular',
        'lodash': '/bower_components/lodash/lodash',
        uiRouterExtras: '/bower_components/ui-router-extras/release/ct-ui-router-extras',
        css: '/bower_components/require-css/css',
        cookie: '/bower_components/cookies-js/dist/cookies',
        liteValidate: '/bower_components/validation/lite-validate',
        artDialog: '/bower_components/artDialog/dist/dialog-plus-min',
        angularCookies: '/bower_components/angular-cookies/angular-cookies',
        bootstrap: '/bower_components/bootstrap/dist/js/bootstrap',
        webuploader: '/bower_components/webuploader_fex/dist/webuploader',
        'loader': '/bower_components/player/src/core/common/player',
        angularAnimate: '/bower_components/angular-animate/angular-animate'
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
        angularAnimate: {deps: ['angular'], exports: 'angularAnimate'},

        //  Restangular depends on either lodash or underscore{要使用这个必须依赖lodash或者underscore}
        cropper: {deps: ['jquery'], exports: 'cropper'},
        cooper: {
            deps: ['jquery'], exports: 'Cooper'
        },
        echarts: {exports: 'echarts'},
        uploadify: {deps: ['jquery', 'angular'], exports: 'uploadify'},
        angularResource: {deps: ['angular'], exports: 'angularResource'},
        angularSanitize: {deps: ['angular'], exports: 'angularSanitize'},
        angularRoute: {deps: ['angular'], exports: 'angularRoute'},
        angularTouch: {deps: ['angular'], exports: 'angularTouch'},
        angularMocks: {deps: ['angular'], exports: 'angularMock'},
        d3: {exports: 'd3'},
        lodash: {exports: '_'},
        sweetAlert: {deps: ['jquery'], exports: 'sweetAlert'},
        'kendo/kendo.web': {deps: ['angular']}
    },
    callback: function () {

        require.extUtil = {
            getItem: function (arras, dir, filed) {
                var i = 0
                var len = arras.length
                var item = {}
                for (i; i < len; i++) {
                    if (arras[i][filed || 'dir'] === dir) {
                        item = arras[i]
                        break
                    }
                }
                return item
            }
        }

        require(['angular', '_app_config_infos_', 'jquery'], function (angular, _app_config_infos_) {

            var invoker = angular.injector(['ng']),
                myInfo

            invoker.invoke(['$http', '$log', function ($http, $log) {

                /**
                 * 获取单位名称
                 * @returns {string}
                 */
                function getSubUnitNameFromLocation() {
                    var href = location.href,
                        baseDom = document.getElementsByTagName('base')[0],
                        path = href.replace(new RegExp(baseDom.href + '?'), ''),
                        index = path.indexOf('/')
                    if (index === -1) {
                        return path
                    }
                    return path.substring(0, path.indexOf('/'))
                }

                // 设置标头
                // document.title = remoteData.name;

                var solutions = angular.module('solutions', []),
                    getUserInfoPromise = $http.get('/web/login/login/getUserInfo.action', {
                            params: {
                                _q_: new Date().getTime()
                            }
                        })

                        .then(function (data) {
                            var appConfig = data.data.info
                            solutions.constant('appConfig', appConfig)

                            if (appConfig.userType !== 2 && appConfig.userType !== 0) {
                                $log.log('不是管理员的用户不能进入管理页面')
                                window.location.href = '/portal'
                                return false
                            }

                            if (appConfig.levelValue > 900000) {
                                $log.log('权限不够')
                                window.location.href = '/portal'
                                return false
                            }
                        })

                getUserInfoPromise.then(function () {
                    $http.get('/web/login/login/getProjectMainInfoList?_q_=' + (+new Date()), {
                            params: {
                                domain: domain,
                                type: 'admin'
                            }
                        })
                        .then(function (data) {

                            var remoteData = data.data.info,
                                deps = ['solutions', 'app'],
                                compare
                            if (remoteData && remoteData.units && remoteData.units.length) {
                                require.unitPath = getSubUnitNameFromLocation()
                                var item = require.extUtil.getItem(remoteData.units, require.unitPath, 'path')
                                compare = remoteData.baseDir + '\\' + (item.dir || remoteData.dir)
                            } else {
                                compare = remoteData.dir ? remoteData.baseDir + '\\' + remoteData.dir : remoteData.baseDir
                            }
                            for (var i = 0; i < _app_config_infos_.length; i++) {
                                if (compare === _app_config_infos_[i].name) {
                                    myInfo = _app_config_infos_[i]
                                    break
                                }
                            }

                            if (!myInfo) {
                                $log.log('无法找到匹配信息，系统加载失败!!')
                                // window.location.href = '404.html';
                                return false
                            }

                            // 域名相关配置， 主要处理多子项目多子单位的
                            solutions.constant('hb.domainConfig', remoteData)
                            angular.element('title').text(remoteData.name)
                            // 如果有units 说明是子项目访问
                            // 1. 如果路径只有域名， 则判定返回的数据中是否有 dir 跳转到 dir
                            // 2. 如果路径携带 /fz 或者其他的, 则判定返回的数据units中能否匹配到对应fz的元素，将其返回，并且路由到fz

                            if (remoteData && remoteData.units && remoteData.units.length) {

                                solutions.config(['$httpProvider', function ($httpProvider) {
                                    $httpProvider.interceptors.push([function () {
                                        return {
                                            request: function (config) {
                                                if (require.unitPath === remoteData.dir || '#' === require.unitPath) {
                                                } else {
                                                    config.headers['Hb-Domain-Path'] = require.unitPath
                                                }
                                                return config
                                            }
                                        }
                                    }])
                                }])
                            }

                            solutions.config(['$locationProvider', function ($locationProvider) {
                                /////////////////////////////////////////////
                                /////                                   /////
                                $locationProvider.hashPrefix('!')
                                $locationProvider.html5Mode(true)
                                /////                                   /////
                                /////////////////////////////////////////////
                            }])

                            require(['./' + myInfo.main.replace(/(^js\/)?(.*)\.js$/, '$2')], function () {

                                // require.config({
                                //     baseUrl: myInfo.name
                                // })
                                solutions.config(['$provide', function ($provide) {
                                    //解决ie10下面的placeholder导致$dirty为true
                                    $provide.decorator('$sniffer', ['$delegate', function ($sniffer) {
                                        var msie = parseInt((/msie (\d+)/.exec(angular.lowercase(navigator.userAgent)) || [])[1], 10),
                                            _hasEvent = $sniffer.hasEvent
                                        $sniffer.hasEvent = function (event) {
                                            if (event === 'input' && msie === 10) {
                                                return false
                                            }
                                            _hasEvent.call(this, event)
                                        }
                                        return $sniffer
                                    }])
                                }])

                                angular.bootstrap(document.getElementsByTagName('html')[0], deps)
                            })

                            require.config_data_for_cms = remoteData
                            require.local_config_data_for_cms = myInfo
                        })
                        .then(function (data) {
                            $http.get('/web/login/login/checkAdminDomain.action', {
                                params: {
                                    _q_: new Date().getTime()
                                },
                                headers: {
                                    'Hb-Domain-Path': require.unitPath
                                }
                            }).then(function(data){
                                if(data.data.info!==true){
                                    window.location.href = '/login';
                                }
                            });
                        });
                })
            }])
        })
    }
})
