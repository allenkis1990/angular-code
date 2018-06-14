/*jshint unused: vars */

define('deps', [
    'prometheus/directives/compare',
    'prometheus/directives/clear-input',
    'prometheus/directives/date-arrange',
    '@systemUrl@/js/common/upload-head',
    'prometheus/modules/interceptor',
    'prometheus/modules/principal',
    'prometheus/modules/placeholder',
    'prometheus/modules/hb-nav'
], function (compareDirective, clearInputDirective, dateArrangeDirective, uploadHead) {

    angular.module('deps', ['hb.nav'])

        .config(['sideMenuProvider', function (sideMenuProvider) {
            sideMenuProvider.setScrollOptions({cursorcolor: '#989898'})
            sideMenuProvider.setOptions({
                menuUrl: '/web/sso/userMenuAuth?type=admin'
            })
        }])

        .directive('hbCompare', compareDirective)
        .directive('hbDateArrange', dateArrangeDirective)
        .directive('hbClearInput', clearInputDirective)


        .directive('uploadHead', uploadHead)
})


define([
        '@systemUrl@/js/common/stateMapper',
        'uiRouterExtras',
        'angular',
        'oclazyload',
        'css!' + require.local_config_data_for_cms.theme,
        'kendo/kendo.web',
        'angularSanitize',
        '@systemUrl@/js/admin.home',
        '@systemUrl@/js/common/hbCommon',
        'deps',
        '@systemUrl@/js/common/hb-notification',
        'angularAnimate',
        '@systemUrl@/js/common/easy-kendo-dialog',
        '@systemUrl@/js/common/hbSkuModule',
        '@systemUrl@/js/common/hbUnitSelect',
        '@systemUrl@/js/common/hbAuthorizedOption',
        '@systemUrl@/js/common/hbResource',
    ],

    function (stateMapper) {
        'use strict'
        /**
         * 加载后于kendo的all
         */
        require(['kendo/messages/kendo.messages.zh-CN', 'kendo/cultures/kendo.culture.zh-CN'])

        var app = angular.module('app',
            ['kendo.directives',
                'oc.lazyLoad',
                'ct.ui.router.extras',
                'app.home',
                'deps',
                'HB_notifications',
                'HB_interceptor',
                'AuthorizationSystem',
                'ui.router',
                'ngSanitize',
                'hbCommon',
                'Placeholder',
                'ngAnimate',
                'easy.kendo.dialog',
                'skuCommon',
                'unitCommon',
                'authorizedOption',
                'hbResourceCommon'
            ]
        )
        app.constant('futureStates', stateMapper.futureStates)
        app.constant('modules', stateMapper.modules)

        app.config(['$interpolateProvider', '$stateProvider', '$urlRouterProvider',
            '$ocLazyLoadProvider', '$futureStateProvider', 'HBInterceptorProvider', 'sideMenuProvider',
            '$httpProvider', /**restAngular配置项目的一个服务*/ 'RestangularProvider',
            'futureStates', 'modules', 'authorizeProvider', 'hb.domainConfig',
            function ($interpolateProvider, $stateProvider, $urlRouterProvider,
                      $ocLazyLoadProvider, $futureStateProvider, HBInterceptorProvider, sideMenuProvider,
                      $httpProvider, /**restAngular配置项目的一个服务*/ RestangularProvider,
                      futureStates, modules, authorizeProvider, hb_domainConfig) {
                sideMenuProvider.setTemplateUrl({
                    menuTemplateUrl: '@systemUrl@/templates/common/menu.html',
                    tabTemplateUrl: '@systemUrl@/templates/common/tab-directive.html'
                })
                authorizeProvider.DEV_MODE_FOR_PERMIT = false
                // 为了修复IE系列编译后dom的换行
                // 以'${{'替换默认的'{{'解析开始符 --choaklin.2015.9.10
                $interpolateProvider.startSymbol('b{{')
                HBInterceptorProvider.app = 'admin'
                //////////////////////////////
                //  请求响应拦截器            //
                //////////////////////////////
                $ocLazyLoadProvider.config({
                    jsLoader: requirejs,
                    loadedModules: ['states'],
                    modules: modules
                })

                var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
                    var deferred = $q.defer()
                    $ocLazyLoad.load(futureState.module)
                        .then(function (name) {
                            deferred.resolve()
                        }, function () {
                            deferred.reject()
                        })
                    return deferred.promise
                }]

                $futureStateProvider.stateFactory('ocLazyLoad', ocLazyLoadStateFactory)

                $futureStateProvider.addResolve(['$q', '$injector', '$http', function ($q, $injector, $http) {
                    var deferd = $q.defer(),
                        promise = deferd.promise
                    angular.forEach(futureStates, function (futureState) {
                        $futureStateProvider.futureState(futureState)
                    })
                    deferd.resolve(futureStates.futureStates)
                    return promise
                }])

                /////////////////////////////
                //配置RestAngular			//
                /////////////////////////////

                RestangularProvider.addFullRequestInterceptor(
                    function (element, operation, route, url, headers, params, httpConfig) {
                        if (operation === 'post') {
                            if (headers['Content-Type'] && angular.isObject(element)) {
                                if (headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1) {
                                    element = $.param(element)
                                }
                            }
                        }
                        return {
                            element: element,
                            params: params,
                            headers: headers,
                            httpConfig: httpConfig
                        }
                    })
                RestangularProvider.setDefaultHttpFields({cache: false})


                var stateConfig = {
                    url: '',
                    abstract: true,
                    resolve: {
                        appInit: ['$rootScope', 'hbBasicData', '$http', '$q', '$log', 'authorize', 'appConfig','hb.domainConfig',
                            function ($rootScope, hbBasicData, $http, $q, $log, authorize, appConfig,hb_domainConfig) {
                                var defer = $q.defer()
                                $rootScope.lwhSystemName = hb_domainConfig.name
                                $rootScope.showApp_$$ = false
                                if (appConfig.userId === null || appConfig.userId === '') {
                                    $rootScope.showApp_$$ = false
                                    window.location.href = '/login/index.html'
                                    defer.reject()
                                } else {
                                    authorize.setPermissions('/web/sso/userFrontAuth')

                                        .then(function () {
                                            $rootScope.showApp_$$ = true
                                            angular.element('body').find('.menu-loading-mark').remove()
                                            $rootScope.$$userInfo = appConfig
                                            $rootScope.uploadConfigOptions = {
                                                context: appConfig['context'],
                                                requestContext: appConfig['requestContext'],
                                                blockMd5CheckUrl: appConfig['blockMd5CheckPath'],
                                                uploadImageUrl: appConfig['resourceServicePath'],
                                                md5CheckUrl: appConfig['md5CheckPath']
                                            }
                                            if (appConfig['uploadBigFilePath']) {
                                                $rootScope.uploadConfigOptions.uploadBigImageUrl = appConfig['uploadBigFilePath'].replace('UploadBigFile', 'uploadBigFile')
                                            }
                                            $rootScope.$broadcast('events:loadBasicDataSuccess', $rootScope.uploadConfigOptions)
                                            defer.resolve()
                                        })
                                }
                                return defer.promise
                            }]
                    },
                    views: {
                        '': {
                            templateUrl: '@systemUrl@/views/index.html'
                        },
                        'topView@': {
                            templateUrl: '@systemUrl@/views/home/top.html',
                            controller: ['$scope', function ($scope) {
                                $scope.doLogOut = function () {
                                    var redirect = '/web/login/login/doLogout.action?unitPath=' + require.unitPath
                                    window.location.replace ? window.location.replace(redirect) : (window.location.href = redirect)
                                }
                            }]
                        }
                    }
                }

                if (hb_domainConfig.units && hb_domainConfig.units.length) {
                    $urlRouterProvider
                        .otherwise('/' + hb_domainConfig.dir + '/home')
                    hb_domainConfig.units.push({
                        name: hb_domainConfig.name,
                        path: hb_domainConfig.dir,
                        dir: hb_domainConfig.dir
                    })
                    var limits = []
                    angular.forEach(hb_domainConfig.units, function (domain) {
                        $urlRouterProvider.when('/' + domain.path, '/' + domain.path + '/home')
                        limits.push(domain.path)
                    })
                    var urlLimit = '{unitPath: ' + limits.join('|') + '}'
                    stateConfig.url = '/' + urlLimit
                    stateConfig.resolve['getTitle'] = ['$stateParams', '$timeout', 'appInit','$rootScope',
                        function ($stateParams, $timeout, appInit,$rootScope) {
                            return $timeout(function () {
                                document.title = require.extUtil.getItem(hb_domainConfig.units, $stateParams.unitPath, 'path').name || hb_domainConfig.name
                                $rootScope.porTitleName=require.extUtil.getItem(hb_domainConfig.units, $stateParams.unitPath, 'path').name || hb_domainConfig.name;
                            })
                        }]
                } else {
                    $urlRouterProvider
                        .otherwise('home')
                }

                $stateProvider
                    .state('states', stateConfig)
            }])
        app.factory('uploadFileCollections', [function () {
            return {
                deleteUf: function (index) {
                    this.ufCollections.splice(index)
                },
                addUf: function (file) {
                    var lth = this.ufCollections.length
                    this.ufCollections.push(file)
                    return lth
                },
                ufCollections: []
            }
        }])


        app.run(['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.aspectRatio = 16/9;
                $rootScope.$state = $state
                $rootScope.$stateParams = $stateParams
            }
        ])
        return app

    })
