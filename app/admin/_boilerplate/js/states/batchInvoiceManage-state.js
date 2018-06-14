define ( ['@systemUrl@/js/modules/batchInvoiceManage/main'], function ( controllers ) {
    'use strict';
    angular.module ( 'app.admin.states.batchInvoiceManage', ['ui.router'] )
        .config ( ['$stateProvider','HB_WebUploaderProvider', function ( $stateProvider,HB_WebUploaderProvider ) {
            $stateProvider.state ( 'states.batchInvoiceManage', {
                url   : '/batchInvoiceManage',
                sticky: true,
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                },
                views : {
                    'states.batchInvoiceManage@': {
                        templateUrl: '@systemUrl@/views/batchInvoiceManage/index.html',
                        controller : 'app.admin.states.batchInvoiceManage.indexCtrl'
                    }
                }
            } )
        }] )
} )