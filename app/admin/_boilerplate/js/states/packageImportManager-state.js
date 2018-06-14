define(['angularUiRouter', '@systemUrl@/js/modules/packageAsynImportManager/main'], function () {
    'use strict';
    return angular.module('app.states.packageImportManager', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.packageImportManager', {
            url: '/packageImportManager',
            sticky: true,

            views: {
                'states.packageImportManager@': {
                    templateUrl: '@systemUrl@/views/packageAsynImportManager/packageAsynImport.html',
                    controller: 'app.packageAsynImport.packageAsynImportCtrl'
                }
            }
        });
    });
});