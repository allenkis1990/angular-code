/*jshint unused: vars */
define([
        '@systemUrl@/js/common/stateMapper',
        'uiRouterExtras',
        'oclazyload',
        'css!' + require.local_config_data_for_cms.theme,
        'angularAnimate',
        'angularUiRouter'
    ],
    function (stateMapper) {
        'use strict'
        var frontModule = angular.module('app',
            [
                'oc.lazyLoad',
                'ct.ui.router.extras',
                'ui.router',
                'ngAnimate'
            ]
        )
        // hb.domainConfig

        frontModule.config([
            '$interpolateProvider', '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$locationProvider',
            '$futureStateProvider', '$httpProvider', 'hb.domainConfig',
            function ($interpolateProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider,
                      $futureStateProvider, $httpProvider, hb_domainConfig) {
                /////////////////////////////////////////////
                /////                                   /////
                $locationProvider.hashPrefix('!')
                $locationProvider.html5Mode(true)
                /////                                   /////
                /////////////////////////////////////////////
                $httpProvider.interceptors.push(['$q',
                    function ($q) {
                        var responseInterceptor = {
                            request: function (request) {
                                var now = +new Date()
                                if (request.url.indexOf('/web/') !== -1) {
                                    if (request.url.indexOf('?') !== -1) {
                                        request.url += ('&_q_=' + now)
                                    } else {
                                        request.url += ('?_q_=' + now)
                                    }
                                }
                                return request
                            },
                            responseError: function (rejection) {
                                return $q.reject(rejection)
                            }
                        }
                        return responseInterceptor
                    }])

                $ocLazyLoadProvider.config({
                    //debug: true,
                    jsLoader: requirejs,
                    //events: true,
                    loadedModules: ['states'],
                    modules: stateMapper.modules
                })
                var views = {
                    header: {
                        templateUrl: '@systemUrl@/views/header.html',
                        controller: ['$scope', 'hb.domainConfig', function ($scope, hb_domainConfig) {
                            $scope.name = hb_domainConfig.name
                        }]
                    },
                    footer: {
                        templateUrl: '@systemUrl@/views/footer.html'
                    }
                }
                // 如果有相应的额配置进来， 则用特殊的处理方式
                if (hb_domainConfig.units && hb_domainConfig.units.length) {
                    $urlRouterProvider
                        .otherwise('/' + hb_domainConfig.dir + '/index')
                    hb_domainConfig.units.push({
                        name: hb_domainConfig.name,
                        path: hb_domainConfig.dir,
                        dir: hb_domainConfig.dir
                    })
                    var limits = []
                    angular.forEach(hb_domainConfig.units, function (domain) {
                        $urlRouterProvider.when('/' + domain.path, '/' + domain.path + '/index')
                        limits.push(domain.path)
                    })
                    var urlLimit = '{unitPath: ' + limits.join('|') + '}'
                    $stateProvider.state('states', {
                        url: '/' + urlLimit,
                        abstract: true,
                        views: views,
                        resolve: {
                            getTitle: ['$stateParams', '$timeout','$rootScope', function ($stateParams, $timeout,$rootScope) {
                                // 将当前的unitPath替换成 参数上面的
                                require.unitPath = $stateParams.unitPath
                                return $timeout(function () {
                                    document.title = require.extUtil.getItem(hb_domainConfig.units, $stateParams.unitPath, 'path').name || hb_domainConfig.name;
                                    $rootScope.porTitleName=require.extUtil.getItem(hb_domainConfig.units, $stateParams.unitPath, 'path').name || hb_domainConfig.name;
                                })
                            }]
                        }
                    })
                } else {
                    $urlRouterProvider
                        .otherwise('index')
                    $stateProvider.state('states', {
                        url: '',
                        abstract: true,
                        views: views
                    })
                }

                var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
                    var deferred = $q.defer()
                    $ocLazyLoad.load(futureState.module).then(function (name) {
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
                    angular.forEach(stateMapper.futureStates, function (item) {
                        $futureStateProvider.futureState(item)
                    })
                    deferd.resolve(stateMapper.futureStates)
                    return promise
                }])
            }])
            .run(['$rootScope', '$state', '$stateParams',
                function ($rootScope, $state, $stateParams) {
                    $rootScope.$state = $state
                    $rootScope.$stateParams = $stateParams
                }
            ])

        return frontModule
    })