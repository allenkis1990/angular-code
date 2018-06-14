define(['angularUiRouter', '@systemUrl@/js/modules/infoCategory/main'], function () {
    'use strict';
    return angular.module('app.states.infoCategory', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.infoCategory', {
            url: '/infoCategory',
            sticky: true,
            views: {
                'states.infoCategory@': {
                    templateUrl: '@systemUrl@/views/infoCategory/infoCategory.html',
                    controller: 'app.infoCategory.infoCategoryCtrl'
                }
            }
        });
    });
});