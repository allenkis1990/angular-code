define(['angularUiRouter', '@systemUrl@/js/modules/courseManager/main'], function () {
    'use strict';
    return angular.module('app.states.courseManager', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.courseManager', {
            url: '/courseManager',
            sticky: true,
            views: {
                'states.courseManager@': {
                    templateUrl: '@systemUrl@/views/courseManager/courseManager-index.html',
                    controller: 'app.courseManager.courseManagerCtrl'
                }
            }
        })
            .state('states.courseManager.edit', {
                url: '/edit/:courseId',
                templateUrl: '@systemUrl@/views/courseManager/courseManager-edit.html',
                controller: 'app.courseManager.courseManagerEditCtrl'
            }).state('states.courseManager.add', {
            url: '/add',
            templateUrl: '@systemUrl@/views/courseManager/courseManager-add.html',
            controller: 'app.courseManager.courseManagerAddCtrl'
        }).state('states.courseManager.view', {
            url: '/view/:courseId',
            templateUrl: '@systemUrl@/views/courseManager/courseManager-view.html',
            controller: 'app.courseManager.courseManagerViewCtrl'
        });

    });
});
