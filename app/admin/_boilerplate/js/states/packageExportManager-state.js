define(['angularUiRouter', '@systemUrl@/js/modules/packageAsynExportManager/main'], function () {
    'use strict';
    return angular.module('app.states.packageExportManager', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.packageExportManager', {
            url: '/packageExportManager',
            sticky: true,
            views: {
                'states.packageExportManager@': {
                    templateUrl: '@systemUrl@/views/packageAsynExportManager/packageAsynExport.html',
                    controller: 'app.packageAsynExport.packageAsynExportCtrl'
                }
            }
        });
    });
});