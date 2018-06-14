define(['@systemUrl@/js/modules/orderAsynchExport/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.orderAsynchExport', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.orderAsynchExport', {
            url: '/orderAsynchExport',
            views: {
                'states.orderAsynchExport@': {
                    templateUrl: '@systemUrl@/views/orderAsynchExport/index.html',
                    controller: 'app.admin.states.orderAsynchExport.indexCtrl'
                }
            }
        });
    }]);
});