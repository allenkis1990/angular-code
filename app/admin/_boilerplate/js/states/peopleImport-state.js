define(['angularUiRouter', '@systemUrl@/js/modules/peopleImport/main'], function () {
    'use strict';
    return angular.module('app.states.peopleImport', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.peopleImport', {
            url: '/peopleImport',
            sticky: true,
            views: {
                'states.peopleImport@': {
                    templateUrl: '@systemUrl@/views/peopleImport/peopleImport.html',
                    controller: 'app.peopleImport.peopleImportCtrl'
                }
            }
        });
    });
});