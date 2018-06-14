define(['angularUiRouter', '@systemUrl@/js/modules/courseWareCategoryManager/main'], function () {
    'use strict';
    return angular
        .module('app.states.courseWareCategoryManager', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.courseWareCategoryManager', {
                url: '/courseWareCategoryManager',
                sticky: true,
                views: {
                    'states.courseWareCategoryManager@': {
                        templateUrl: '@systemUrl@/views/courseWareCategoryManager/courseWareCategoryManager.html',
                        controller: 'app.courseWareCategoryManager.courseWareCategoryManagerCtrl'
                    }
                }
            });
        });
});
