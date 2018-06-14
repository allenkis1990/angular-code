define(['@systemUrl@/js/modules/classInformation/distributionQuery/controllers/distributionQuery-ctrl',
    '@systemUrl@/js/modules/classInformation/services/classInformation-services',
    '@systemUrl@/js/modules/classInformation/distributionQuery/services/distributionQuery-service',
    '../../../directives/copy-man'], function (controllers, classInfoService, distributionQueryService, copyMan) {
    'use strict';
    angular.module('app.admin.states.distributionQuery.main', [])
        .directive('copyManOne', copyMan)
        .controller('app.admin.states.distributionQuery.indexCtrl', controllers.indexCtrl)
        .factory('classInfoService', classInfoService)
        .factory('distributionQueryService', distributionQueryService);
});