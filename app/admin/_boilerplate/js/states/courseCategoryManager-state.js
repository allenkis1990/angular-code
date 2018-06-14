define(['angularUiRouter', '@systemUrl@/js/modules/courseCategoryManager/main'], function () {
    'use strict';

    return angular
        .module('app.states.courseCategoryManager', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.courseCategoryManager', {
                url: '/courseCategoryManager',
                sticky: true,
                views: {
                    'states.courseCategoryManager@': {
                        templateUrl: '@systemUrl@/views/courseCategoryManager/courseCategoryManager.html',
                        controller: 'app.courseCategoryManager.courseCategoryManagerCtrl'
                    }
                }
            });
        });
});
