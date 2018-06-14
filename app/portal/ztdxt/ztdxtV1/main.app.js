/**
 * Created by wengpengfei on 2016/8/8.
 */
define([
    'kccs/kccsv2/js/common/stateMapper',
    'kccs/kccsv2/js/common/hbFrontCommon',
    'kccs/kccsv2/js/common/hbSkuModule',
    'prometheus/modules/interceptor',
    'prometheus/modules/hb-artdialog',
    'kccs/kccsv2/js/common/hb-notification',
    'kccs/kccsv2/js/common/hbBootstrap',
    'css!' + require.local_config_data_for_cms.theme,
    'angular',
    'uiRouterExtras',
    'oclazyload',
    'angularUiRouter',
    'restangular',
    'angularAnimate'
], function (lazyLoad) {
    'use strict';
    angular.module('app', [
        'ui.router',
        'oc.lazyLoad',
        'ct.ui.router.extras',
        'restangular',
        'ngArtDialog',
        'hb.frontCommon',
        'HB_interceptor',
        'HB_notifications',
        'ui.bootstrap',
        'ngAnimate',
        'skuCommon'
    ])
        .constant('modules', lazyLoad.modules)
        .constant('futureStates', lazyLoad.futureStates)
        .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
            '$futureStateProvider', 'modules', 'futureStates', '$locationProvider',
            'RestangularProvider', '$httpProvider', 'hb.domainConfig',
            function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider,
                      $futureStateProvider, modules, futureStates,
                      $locationProvider, RestangularProvider, $httpProvider, hb_domainConfig) {
                $ocLazyLoadProvider.config({
                    //debug: true,
                    jsLoader: requirejs,
                    //events: true,
                    loadedModules: ['states'],
                    modules: modules
                });

                var ocLazyLoadStateFactory = ['$q', '$ocLazyLoad', 'futureState',
                    function ($q, $ocLazyLoad, futureState) {
                        var deferred = $q.defer();
                        $ocLazyLoad.load(futureState.module).then(function () {
                            deferred.resolve();
                        }, function () {
                            deferred.reject();
                        });
                        return deferred.promise;
                    }];

                $futureStateProvider.stateFactory('ocLazyLoad', ocLazyLoadStateFactory);

                // 随便一个注解
                $futureStateProvider.addResolve(['$q', '$injector', '$http', function ($q) {
                    var deferd = $q.defer(),
                        promise = deferd.promise;
                    angular.forEach(futureStates, function (futureState) {
                        $futureStateProvider.futureState(futureState);
                    });
                    deferd.resolve(futureStates);
                    return promise;
                }]);

                // 如果有相应的额配置进来， 则用特殊的处理方式
                if (hb_domainConfig.units && hb_domainConfig.units.length) {
                    $urlRouterProvider
                        .otherwise('/' + hb_domainConfig.dir + '/accountant');
                    hb_domainConfig.units.push({
                        name: hb_domainConfig.name,
                        path: hb_domainConfig.dir,
                        dir: hb_domainConfig.dir
                    });
                    var limits = [];
                    angular.forEach(hb_domainConfig.units, function (domain) {
                        $urlRouterProvider.when('/' + domain.path, '/' + domain.path + '/accountant');
                        limits.push(domain.path);
                    });
                    var urlLimit = '{unitPath: ' + limits.join('|') + '}';
                    $stateProvider.state('states', {
                        url: '/' + urlLimit,
                        abstract: true,
                        resolve: {
                            getTitle: ['$stateParams', '$timeout', function ($stateParams, $timeout) {
                                // 将当前的unitPath替换成 参数上面的
                                require.unitPath = $stateParams.unitPath;
                                return $timeout(function () {
                                    document.title = require.extUtil.getItem(hb_domainConfig.units, $stateParams.unitPath, 'path').name || hb_domainConfig.name;
                                });
                            }]
                        }
                    });
                } else {
                    $urlRouterProvider
                        .otherwise('accountant');
                    $stateProvider.state('states', {
                        url: '',
                        abstract: true
                    });
                }

                /////////////////////////////
                //配置RestAngular			//
                /////////////////////////////

                RestangularProvider.addFullRequestInterceptor(
                    function (element, operation, route, url, headers, params, httpConfig) {
                        if (operation === 'post') {
                            if (headers['Content-Type'] && angular.isObject(element)) {
                                if (headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1) {
                                    element = $.param(element);
                                }
                            }
                        }
                        return {
                            element: element,
                            params: params,
                            headers: headers,
                            httpConfig: httpConfig
                        };
                    });
                $httpProvider.interceptors.push(['$q',
                    function ($q) {
                        var responseInterceptor = {
                            request: function (request) {
                                var now = +new Date();
                                if (request.url.indexOf('/web/') !== -1) {
                                    if (request.url.indexOf('?') !== -1) {
                                        request.url += ('&_q_=' + now);
                                    } else {
                                        request.url += ('?_q_=' + now);
                                    }
                                }
                                //
                                // if (/\.html$/.test(request.url)) {
                                //     request.url = require.local_config_data_for_cms.name + '/' + request.url
                                //
                                // }
                                return request;
                            },
                            responseError: function (rejection) {
                                return $q.reject(rejection);
                            }
                        };
                        return responseInterceptor;
                    }]);
                RestangularProvider.setDefaultHttpFields({cache: false});
            }])

        .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);
});
