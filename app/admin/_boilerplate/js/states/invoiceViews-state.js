define(['@systemUrl@/js/modules/invoiceViews/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.invoiceViews', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.invoiceViews', {
            url: '/invoiceViews',
            sticky: true,
            views: {
                'states.invoiceViews@': {
                    templateUrl: '@systemUrl@/views/invoiceViews/index.html',
                    controller: 'app.admin.states.invoiceViews.indexCtrl'
                }
            }
        });
    }]);
});