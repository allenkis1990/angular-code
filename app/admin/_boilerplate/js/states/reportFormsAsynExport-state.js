define(['angularUiRouter', '@systemUrl@/js/modules/reportFormsAsynExport/main'], function () {
    'use strict';
    return angular.module('app.states.reportFormsAsynExport', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.reportFormsAsynExport', {
            url: '/reportFormsAsynExport',
            sticky: true,
            views: {
                'states.reportFormsAsynExport@': {
                    templateUrl: '@systemUrl@/views/reportFormsAsynExport/reportFormsAsynExport.html',
                    controller: 'app.reportFormsAsynExport.reportFormsAsynExportCtrl'
                }
            }
        });
    });
});