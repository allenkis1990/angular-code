define(['@systemUrl@/js/modules/invoiceManage/controllers/invoiceManage-ctrl',
    '@systemUrl@/js/modules/invoiceManage/services/invoiceManage-services',
    '@systemUrl@/js/services/kendoui-commons', 'common/hbWebUploader'], function (controllers, invoiceManageServices) {
    'use strict';
    angular.module('app.admin.states.invoiceManage.main', ['kendo.ui.commons', 'hb.webUploader'])
        .controller('app.admin.states.invoiceManage.indexCtrl', controllers.indexCtrl)
        .factory('invoiceManageServices', invoiceManageServices)

        .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
            hbBasicData.setResource();
        }]);
});