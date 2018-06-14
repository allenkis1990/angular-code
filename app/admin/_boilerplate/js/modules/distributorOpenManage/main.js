define(
    [
        '@systemUrl@/js/modules/distributorOpenManage/controllers/distributorOpenManage-ctrl',
        '@systemUrl@/js/modules/distributorOpenManage/services/distributorOpenManage-services'
    ],
    function (controllers, openManageService) {
        'use strict';
        angular.module('app.admin.states.distributorOpenManage.main', [])
            .controller('app.admin.states.distributorOpenManage.indexCtrl', controllers.indexCtrl)
            .factory('openManageService', openManageService);
    }
);