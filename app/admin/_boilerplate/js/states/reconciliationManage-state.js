define(['@systemUrl@/js/modules/reconciliationManage/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.reconciliationManage', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.reconciliationManage', {
            url: '/reconciliationManage',
            sticky: true,
            views: {
                'states.reconciliationManage@': {
                    templateUrl: '@systemUrl@/views/reconciliationManage/index.html',
                    controller: 'app.admin.states.reconciliationManage.indexCtrl'
                }
            }
        });
    }]);
});