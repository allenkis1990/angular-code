define(['angularUiRouter', '@systemUrl@/js/modules/userManage/main'], function () {
    'use strict';
    return angular.module('app.states.userManage', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider
            .state('states.userManage', {
                url: '/userManage',
                sticky: true,
                views: {
                    'states.userManage@': {
                        templateUrl: '@systemUrl@/views/userManage/userManage-index.html',
                        controller: 'app.userManage.userManageCtrl'
                    }
                }
            }).state('states.userManage.view', {
            url: '/view/:userId',
            templateUrl: '@systemUrl@/views/userManage/userManage-view.html',
            controller: 'app.userManage.userManageViewCtrl'
        });
    });
});
