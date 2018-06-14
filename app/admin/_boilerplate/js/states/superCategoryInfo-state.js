define(['angularUiRouter', '@systemUrl@/js/modules/superCategoryInfo/main'], function () {
    'use strict';
    return angular.module('app.states.superCategoryInfo', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.superCategoryInfo', {
            url: '/superCategoryInfo',
            sticky: true,
            views: {
                'states.superCategoryInfo@': {
                    templateUrl: '@systemUrl@/views/superCategoryInfo/superCategoryInfo.html',
                    controller: 'app.superCategoryInfo.superCategoryInfoCtrl'
                }
            }
        });
    });
});