define(['angularUiRouter', '@systemUrl@/js/modules/userAsynExport/main'], function () {
    'use strict';
    return angular.module('app.states.userAsynExport', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.userAsynExport', {
            url: '/userAsynExport',
            sticky: true,
            views: {
                'states.userAsynExport@': {
                    templateUrl: '@systemUrl@/views/userAsynExport/userAsynExport.html',
                    controller: 'app.userAsynExport.userAsynExportCtrl'
                }
            }
        });
    });
});