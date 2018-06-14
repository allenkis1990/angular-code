define(['angularUiRouter', '@systemUrl@/js/modules/coursewareAsyn/main'], function () {
    'use strict';
    return angular.module('app.states.coursewareAsyn', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.coursewareAsyn', {
            url: '/coursewareAsyn',
            sticky: true,
            views: {
                'states.coursewareAsyn@': {
                    templateUrl: '@systemUrl@/views/coursewareAsyn/coursewareAsyn.html',
                    controller: 'app.asynJob.coursewareAsynCtrl'
                }
            }
        });
    });
});