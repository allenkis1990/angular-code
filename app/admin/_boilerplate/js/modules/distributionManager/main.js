define([
        'angular',
        '@systemUrl@/js/modules/distributionManager/controllers/distributionManager-ctrl',
        '@systemUrl@/js/modules/distributionManager/services/distributionManager-service'],
    function (angular, distributionManagerCtrl, distributionManagerService) {
        'use strict';
        return angular
            .module('app.distributionManager', [])
            .factory('distributionManagerService', distributionManagerService)
            .controller('app.distributionManager.distributionManagerCtrl', distributionManagerCtrl);

    }
);
