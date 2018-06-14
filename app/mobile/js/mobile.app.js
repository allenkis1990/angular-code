/*jshint unused: vars */
define([
        'angular',
        'restangular',
        'angularUiRouter',
        'common/hb-notification',
        'prometheus/modules/interceptor',
        'angularSanitize'
    ],
    function () {
        'use strict';


        angular.module('hb.util', [])

            .factory('hbUtil', [function () {
                var _hbUtil = {};
                _hbUtil.isIe = function () {
                    return (function (ua) {
                        var ie = ua.match(/MSIE\s([\d\.]+)/) ||
                            ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i);
                        return ie && parseFloat(ie[1]);
                    })(navigator.userAgent);
                };
                return _hbUtil;
            }])
            .filter('trustHtml', function ($sce) {
                return function (input) {
                    return $sce.trustAsHtml(input);
                };
            });


        var frontModule = angular.module('app',
            [
                'ui.router',
                'restangular',
                'HB_interceptor',
                'ngSanitize',
                'hb.util',
                'HB_notifications'
            ]
        );


        frontModule.config(
            function ($interpolateProvider, $stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider) {

                $urlRouterProvider
                    .otherwise('home');

                $stateProvider
                    .state('states', {
                        abstract: true, url: '',
                        views: {
                            'topView@': {
                                templateUrl: 'views/top.html',
                                controller: ['$scope', '$state', '$rootScope',
                                    function ($scope, $state, $rootScope) {
                                        $scope.events = {
                                            goback: function () {
                                                if ($state.current.name === 'states.detail') {
                                                    $state.go('states.list', {id: $rootScope.detailId});
                                                } else if ($state.current.name === 'states.list') {
                                                    $state.go('states.home');
                                                }
                                            }
                                        };
                                    }]
                            }
                        }
                    })
                    .state('states.home', {
                        url: '/home',
                        views: {
                            'contentView@': {
                                templateUrl: 'views/content.html',
                                controller: ['$scope', '$state', '$http', function ($scope, $state, $http) {
                                    $http.get('/web/portal/info/getCategory/?parentId=' + '402881bf5828f7170158290dc7fb0001').success(function (data) {
                                        $scope.list = data.info;
                                    });

                                    $scope.events = {
                                        goList: function (item) {
                                            $state.go('states.list', {id: item.id});
                                        }
                                    };

                                }]
                            }
                        }
                    })
                    .state('states.detail', {
                        url: '/detail/:type/:detailId/:title',
                        views: {
                            'contentView@': {
                                templateUrl: 'views/detail.html',
                                controller: ['$scope', '$http', '$stateParams', '$rootScope', function ($scope, $http, $stateParams, $rootScope) {
                                    $rootScope.detailId = $stateParams.type;
                                    $http.get('/web/portal/info/getInfoDetail/?id=' + $stateParams.detailId).success(function (data) {
                                        $scope.detail = data.info;
                                    });

                                }]
                            }
                        }
                    }).state('states.list', {
                    url: '/list/:id',
                    views: {
                        'contentView@': {
                            templateUrl: 'views/list.html',
                            controller: ['$scope', '$http', '$state', '$stateParams', function ($scope, $http, $state, $stateParams) {
                                $http.get('/web/portal/info/getSimpleInfoList/?categoryId=' + $stateParams.id + '&pageNo=1' + '&pageSize=10').success(function (data) {
                                    $scope.list = data.info;
                                });
                                $scope.events = {
                                    goDetail: function (item) {
                                        $state.go('states.detail', {
                                            type: $stateParams.id,
                                            detailId: item.id,
                                            title: item.title
                                        });
                                    }
                                };

                            }]
                        }
                    }
                });


                // 为了修复IE系列编译后dom的换行
                // 以'${{'替换默认的'{{'解析开始符 --choaklin.2015.9.10
                $interpolateProvider.startSymbol('b{{');

                //HBInterceptorProvider.app = 'front';

                /////////////////////////////
                //配置RestAngular			//
                /////////////////////////////

                RestangularProvider.addFullRequestInterceptor(function
                    (element, operation, route, url, headers, params, httpConfig) {
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
                                return request;
                            },
                            responseError: function (rejection) {
                                return $q.reject(rejection);
                            }
                        };
                        return responseInterceptor;
                    }]);

                RestangularProvider.setDefaultHttpFields({cache: false});

            })
            .run(['$rootScope', '$state', '$stateParams',
                function ($rootScope, $state, $stateParams) {
                    $rootScope.$state = $state;
                    $rootScope.$stateParams = $stateParams;
                }
            ]);

        return frontModule;
    });