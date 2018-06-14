define(['angularUiRouter', '@systemUrl@/js/modules/questionImport/main'], function () {
    'use strict';
    return angular.module('app.states.questionImport', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.questionImport', {
            url: '/questionImport',
            sticky: true,
            views: {
                'states.questionImport@': {
                    templateUrl: '@systemUrl@/views/questionImport/questionImport.html',
                    controller: 'app.asynJob.questionImportCtrl'
                }
            }
        });
    });
});