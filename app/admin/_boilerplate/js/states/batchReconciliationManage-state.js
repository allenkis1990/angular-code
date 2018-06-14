define ( ['@systemUrl@/js/modules/batchReconciliationManage/main'], function ( controllers ) {
    'use strict';
    angular.module ( 'app.admin.states.batchReconciliationManage', [] ).config ( ['$stateProvider', function ( $stateProvider ) {
        $stateProvider.state ( 'states.batchReconciliationManage', {
            url   : '/batchReconciliationManage',
            sticky: true,
            views : {
                'states.batchReconciliationManage@': {
                    templateUrl: '@systemUrl@/views/batchReconciliationManage/index.html',
                    controller : 'app.admin.states.batchReconciliationManage.indexCtrl'
                }
            }
        } )
    }] )
} )