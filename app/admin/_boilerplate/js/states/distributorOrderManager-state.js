define(['@systemUrl@/js/modules/distributorOrderManager/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.distributorOrderManager', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.distributorOrderManager', {
            url: '/distributorOrderManager',
            sticky: true,
            views: {
                'states.distributorOrderManager@': {
                    templateUrl: '@systemUrl@/views/distributorOrderManager/index.html',
                    controller: 'app.admin.states.distributorOrderManager.indexCtrl'
                }
            }
        });
    }]);
});