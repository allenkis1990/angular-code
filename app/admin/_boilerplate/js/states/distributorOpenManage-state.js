define(['@systemUrl@/js/modules/distributorOpenManage/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.distributorOpenManage', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.distributorOpenManage', {
            url: '/distributorOpenManage',
            sticky: true,
            views: {
                'states.distributorOpenManage@': {
                    templateUrl: '@systemUrl@/views/distributorOpenManage/index.html',
                    controller: 'app.admin.states.distributorOpenManage.indexCtrl'
                }
            }
        });
    }]);
});