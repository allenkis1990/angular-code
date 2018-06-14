define(['angularUiRouter', '@systemUrl@/js/modules/coursePackageManager/main'], function () {
    'use strict';
    return angular.module('app.states.coursePackageManager', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.coursePackageManager', {
            url: '/coursePackageManager',
            sticky: true,
            views: {
                'states.coursePackageManager@': {
                    templateUrl: '@systemUrl@/views/coursePackageManager/coursePackageManager-index.html',
                    controller: 'app.coursePackageManager.coursePackageManagerCtrl'
                }
            }
        }).state('states.coursePackageManager.edit', {
            url: '/edit/:packageId',
            templateUrl: '@systemUrl@/views/coursePackageManager/coursePackageManager-edit.html',
            controller: 'app.coursePackageManager.coursePackageManagerEditCtrl'
        }).state('states.coursePackageManager.requiredEdit', {
            url: '/requiredEdit/:packageId',
            templateUrl: '@systemUrl@/views/coursePackageManager/coursePackageManager-requiredEdit.html',
            controller: 'app.coursePackageManager.coursePackageManagerRequiredEditCtrl'
        }).state('states.coursePackageManager.add', {
            url: '/add/:hideReturn',
            templateUrl: '@systemUrl@/views/coursePackageManager/coursePackageManager-add.html',
            controller: 'app.coursePackageManager.coursePackageManagerAddCtrl'
        }).state('states.coursePackageManager.view', {
            url: '/view/:packageId',
            templateUrl: '@systemUrl@/views/coursePackageManager/coursePackageManager-view.html',
            controller: 'app.coursePackageManager.coursePackageManagerViewCtrl'
        });

    });
});
