define (
    [
        '@systemUrl@/js/modules/batchInvoiceManage/controllers/index',
        '@systemUrl@/js/modules/batchInvoiceManage/services/invoiceManage-services',
        '@systemUrl@/js/services/kendoui-commons', 'common/hbWebUploader'
    ],
    function ( controllers, invoiceManageServices ) {
        'use strict';
        angular.module ( 'app.admin.states.batchInvoiceManage.main', ['kendo.ui.commons', 'hb.webUploader'] )
            .controller ( 'app.admin.states.batchInvoiceManage.indexCtrl', controllers.indexCtrl )
            .factory ( 'batchInvoiceManageServices', invoiceManageServices )

            .run (['$rootScope', '$http', 'hbBasicData', function ( $rootScope, $http, hbBasicData ) {
                hbBasicData.setResource ();
            }])
    }
);