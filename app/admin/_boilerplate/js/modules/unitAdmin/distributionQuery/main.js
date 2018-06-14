define(['@systemUrl@/js/modules/unitAdmin/distributionQuery/controllers/distributionQuery-ctrl',
    '@systemUrl@/js/modules/unitAdmin/services/unitAdmin-services',
    '@systemUrl@/js/modules/unitAdmin/distributionQuery/services/distributionQuery-service',
    '../../../directives/copy-man'], function (controllers,unitAdminServices,distributionQueryService,copyMan) {
    'use strict';
    angular.module('app.admin.states.distributionQuery.main', [])
        .controller('app.admin.states.distributionQuery.indexCtrl', controllers.indexCtrl)
        .factory('unitAdminServices',unitAdminServices)
        .factory('distributionQueryService',distributionQueryService)
        .directive('copyMan',copyMan);
});