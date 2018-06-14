define(['angularUiRouter', '@systemUrl@/js/modules/importOpenClassTask/main'], function () {
    'use strict';
    return angular.module('app.states.importOpenClassTask', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.importOpenClassTask', {
            url: '/importOpenClassTask',
            sticky: true,
            views: {
                'states.importOpenClassTask@': {
                    templateUrl: '@systemUrl@/views/importOpenClassTask/importOpenClassTask.html',
                    controller: 'app.importOpenClassTask.importOpenClassTaskCtrl'
                }
            }
        });
    });
});