define(['angularUiRouter', '@systemUrl@/js/modules/adminAccountManager/main'], function () {
    'use strict';
    return angular.module('app.states.adminAccountManager',
        ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.adminAccountManager', {
            url: '/adminAccountManager',
            sticky: true,
            views: {
                'states.adminAccountManager@': {
                    templateUrl: '@systemUrl@/views/adminAccountManager/adminAccountManager.html',
                    controller: 'app.adminAccountManager.adminAccountManagerCtrl'
                }
            }
        });
    });
});
