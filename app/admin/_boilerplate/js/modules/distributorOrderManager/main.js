define(
    [
        '@systemUrl@/js/modules/distributorOrderManager/controllers/distributorOrderManager-ctrl',
        '@systemUrl@/js/modules/orderManage/services/orderManage-service'
    ],

    function (controllers, orderManageService) {
        'use strict';
        angular.module('app.admin.states.distributorOrderManager.main', [])
            .controller('app.admin.states.distributorOrderManager.indexCtrl', controllers.indexCtrl)
            .factory('orderManageService', orderManageService);
    }
);