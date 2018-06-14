define(['@systemUrl@/js/modules/reconciliationManage/controllers/reconciliationManage-ctrl',
    '@systemUrl@/js/modules/reconciliationManage/services/reconciliationManage-services',
    '@systemUrl@/js/services/kendoui-commons', 'common/hbWebUploader'], function (controllers, reconciliationManageServices) {
    'use strict';
    angular.module('app.admin.states.reconciliationManage.main', ['kendo.ui.commons', 'hb.webUploader'])
        .controller('app.admin.states.reconciliationManage.indexCtrl', controllers.indexCtrl)
        .factory('reconciliationManageServices', reconciliationManageServices)

        .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
            hbBasicData.setResource();
        }]);
});