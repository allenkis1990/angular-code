define(['angularUiRouter', '@systemUrl@/js/modules/packageDispatch/main',
    '@systemUrl@/js/modules/packageDispatch/departPackage/main'], function () {
    'use strict';
    return angular.module('app.states.packageDispatch', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, HB_WebUploaderProvider) {
            $stateProvider.state('states.packageDispatch', {
                url: '/packageDispatch?type',
                reloadOnSearch: false,
                sticky: true,
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUserInfo'),
                    hasPermissionAll: ['authorize', '$state', '$stateParams', function (authorize, $state, $stateParams) {
                        return authorize.hasPermissionDo('packageDispatch/all');
                    }],
                    hasPermissionExpress: ['authorize', '$state', '$stateParams', function (authorize, $state, $stateParams) {
                        return authorize.hasPermissionDo('packageDispatch/express');
                    }],
                    hasPermissionPickUp: ['authorize', '$state', '$stateParams', function (authorize, $state, $stateParams) {
                        return authorize.hasPermissionDo('packageDispatch/pickUp');
                    }],
                    getPermission: ['hasPermissionAll', 'hasPermissionExpress', 'hasPermissionPickUp', 'authorize', function (hasPermissionAll, hasPermissionExpress, hasPermissionPickUp, authorize) {
                        return !hasPermissionAll && !hasPermissionExpress && !hasPermissionPickUp && !authorize.DEV_MODE_FOR_PERMIT;
                    }]
                },
                onEnter: ['hasPermissionAll', 'hasPermissionExpress', 'hasPermissionPickUp', '$stateParams', 'authorize',
                    function (hasPermissionAll, hasPermissionExpress, hasPermissionPickUp, $stateParams, authorize) {
                        var initType = $stateParams.type || 'all';

                        var type = $stateParams.type || 'all';

                        if (hasPermissionAll && !hasPermissionExpress && !hasPermissionPickUp) {
                            type = 'all';
                        }

                        if (hasPermissionAll && hasPermissionExpress && !hasPermissionPickUp) {
                            type = initType == 'pickUp' ? 'all' : initType;
                        }

                        if (!hasPermissionAll && hasPermissionExpress && hasPermissionPickUp) {
                            type = initType == 'all' ? 'express' : initType;
                        }

                        if (hasPermissionAll && !hasPermissionExpress && hasPermissionPickUp) {
                            type = initType == 'express' ? 'all' : initType;
                        }

                        if (!hasPermissionAll && hasPermissionExpress && !hasPermissionPickUp) {
                            type = 'express';
                        }

                        if (!hasPermissionAll && !hasPermissionExpress && hasPermissionPickUp) {
                            type = 'pickUp';
                        }

                        $stateParams.type = type;
                    }],
                views: {
                    'states.packageDispatch@': {
                        templateProvider: ['getPermission', 'authorize', '$http', function (getPermission, authorize, $http) {
                            var templateUrl = '@systemUrl@/views/packageDispatch/index.html';
                            if (getPermission) {
                                templateUrl = '@systemUrl@/views/packageDispatch/noPermission.html';
                            }
                            return $http.get(templateUrl, {cache: true})
                                .then(function (data) {
                                    return data.data;
                                });
                        }],
                        controllerProvider: ['getPermission', function (getPermission) {
                            if (getPermission) {
                                return angular.noop;
                            }
                            return 'app.packageDispatch.index';

                        }]
                    }
                }
            })
                .state('states.packageDispatch.noPermission', {
                    url: '/noPermission',
                    views: {
                        'states.packageDispatch@': {
                            templateUrl: '@systemUrl@/views/packageDispatch/noPermission.html'
                        }
                    }
                })
                .state('states.packageDispatch.dispatch', {
                    url: '/dispatch/:invoiceId',
                    views: {
                        '': {
                            templateUrl: '@systemUrl@/views/packageDispatch/dispatch.html',
                            controller: 'app.packageDispatch.dispatch'
                        }
                    }
                }).state('states.packageDispatch.departPackage', {
                url: '/departPackage/:invoiceShowId',//from 1订单管理 2其他地方
                views: {
                    'departPackageItem': {
                        templateUrl: '@systemUrl@/views/packageDispatch/departPackage/index.html',
                        controller: 'app.admin.states.departPackage.indexCtrl'
                    }
                }
            });
        });
});

