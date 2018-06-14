define(['angularUiRouter', '@systemUrl@/js/modules/employee/main'], function () {
    'use strict';
    return angular.module('app.states.employee', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.employee', {
            url: '/employee',
            sticky: true,
            views: {
                'states.employee@': {
                    templateUrl: '@systemUrl@/views/employee/employee.html',
                    controller: 'app.employee.employeeCtrl'
                }
            }
        });
    });
});