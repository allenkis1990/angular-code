define(['@systemUrl@/js/modules/invoiceExport/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.invoiceExport', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.invoiceExport', {
                url: '/invoiceExport',
                sticky: true,
                views: {
                    'states.invoiceExport@': {
                        templateUrl: '@systemUrl@/views/invoiceExport/index.html',
                        controller: 'app.admin.states.invoiceExport.indexCtrl'
                    }
                }
            });
        }]);
});