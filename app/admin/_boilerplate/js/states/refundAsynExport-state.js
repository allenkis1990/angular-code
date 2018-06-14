define(['@systemUrl@/js/modules/refundAsynExport/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.refundAsynExport', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.refundAsynExport', {
            url: '/refundAsynExport',
            views: {
                'states.refundAsynExport@': {
                    templateUrl: '@systemUrl@/views/refundAsynExport/index.html',
                    controller: 'app.admin.states.refundAsynExport.indexCtrl'
                }
            }
        });
    }]);
});