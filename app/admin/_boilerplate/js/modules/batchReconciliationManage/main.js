define ( ['@systemUrl@/js/modules/batchReconciliationManage/controllers/batchReconciliationManage-ctrl',
    '@systemUrl@/js/modules/batchReconciliationManage/services/batchReconciliationManage-services',
    '@systemUrl@/js/services/kendoui-commons', 'common/hbWebUploader'], function ( controllers, batchReconciliationManageServices ) {
    'use strict';
    angular.module ( 'app.admin.states.batchReconciliationManage.main', ['kendo.ui.commons', 'hb.webUploader'] )
        .controller ( 'app.admin.states.batchReconciliationManage.indexCtrl', controllers.indexCtrl )
        .factory ( 'batchReconciliationManageServices', batchReconciliationManageServices )

        .run ( ['$rootScope', '$http', 'hbBasicData', function ( $rootScope, $http, hbBasicData ) {
            hbBasicData.setResource ();
        }] )
} );