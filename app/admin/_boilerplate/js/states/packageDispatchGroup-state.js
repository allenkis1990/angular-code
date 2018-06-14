define(['angularUiRouter', '@systemUrl@/js/modules/packageDispatchGroup/main'], function () {
    'use strict';
    return angular.module('app.states.packageDispatchGroup', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, HB_WebUploaderProvider) {
            $stateProvider.state('states.packageDispatchGroup', {
                url: '/packageDispatchGroup?type',
                reloadOnSearch: false,
                sticky: true,
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUserInfo'),
                    hasPermissionAll: ['authorize', '$state', '$stateParams', function (authorize, $state, $stateParams) {
                        return authorize.hasPermissionDo('packageDispatchGroup/all');
                    }],
                    hasPermissionExpress: ['authorize', '$state', '$stateParams', function (authorize, $state, $stateParams) {
                        return authorize.hasPermissionDo('packageDispatchGroup/express');
                    }],
                    hasPermissionPickUp: ['authorize', '$state', '$stateParams', function (authorize, $state, $stateParams) {
                        return authorize.hasPermissionDo('packageDispatchGroup/pickUp');
                    }],
                    getPermission: ['hasPermissionAll', 'hasPermissionExpress', 'hasPermissionPickUp', 'authorize', function (hasPermissionAll, hasPermissionExpress, hasPermissionPickUp, authorize) {
                        return !hasPermissionAll && !hasPermissionExpress && !hasPermissionPickUp && !authorize.DEV_MODE_FOR_PERMIT;
                    }]
                },
                onEnter: ['hasPermissionAll', 'hasPermissionExpress', 'hasPermissionPickUp', '$stateParams', 'authorize',
                    function (hasPermissionAll, hasPermissionExpress, hasPermissionPickUp, $stateParams, authorize) {
                        var initType = $stateParams.type || 'all';

                        var type =  $stateParams.type || 'all';

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
                    'states.packageDispatchGroup@': {
                        templateProvider: ['getPermission', 'authorize', '$http', function (getPermission, authorize, $http) {
                            var templateUrl = '@systemUrl@/views/packageDispatchGroup/index.html';
                            if (getPermission) {
                                templateUrl = '@systemUrl@/views/packageDispatchGroup/noPermission.html'
                            }
                            return $http.get(templateUrl, {cache: true})
                                .then(function (data) {
                                    return data.data;
                                })
                        }],
                        controllerProvider: ['getPermission', function (getPermission) {
                            if (getPermission) {
                                return angular.noop;
                            }
                            return 'app.packageDispatchGroup.index';

                        }]
                    }
                }
            })
                .state('states.packageDispatchGroup.noPermission', {
                    url: '/noPermission',
                    views: {
                        'states.packageDispatchGroup@': {
                            templateUrl: '@systemUrl@/views/packageDispatchGroup/noPermission.html'
                        }
                    }
                })
                .state('states.packageDispatchGroup.dispatch', {
                    url: '/dispatch/:invoiceId',
                    views: {
                        '': {
                            templateUrl: '@systemUrl@/views/packageDispatchGroup/dispatch.html',
                            controller: 'app.packageDispatchGroup.dispatch'
                        }
                    }
                })
        });
});

