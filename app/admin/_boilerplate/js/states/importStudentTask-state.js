define(['angularUiRouter', '@systemUrl@/js/modules/importStudentTask/main'], function () {
    'use strict';
    return angular.module('app.states.importStudentTask', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.importStudentTask', {
            url: '/importStudentTask:groupType',
            sticky: true,
            views: {
                'states.importStudentTask@': {
                    templateUrl: '@systemUrl@/views/importStudentTask/importStudentTask.html',
                    controller: 'app.importStudentTask.importStudentTaskCtrl'
                }
            }
        });
    });
});