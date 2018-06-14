define([
    'angular',
    '@systemUrl@/js/modules/supplierResourceAll/controllers/supplierResourceAll-ctrl',
    '@systemUrl@/js/modules/supplierResourceAll/services/supplierResourceAll-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons',
    '@systemUrl@/js/modules/summary/class.common'
], function (angular, /* global, validateDirective,*/supplierResourceAllCtrl, supplierResourceAllService) {
    'use strict';
    return angular.module('app.supplierResourceAll', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons', 'class.common'])
        .controller('app.supplierResourceAll.supplierResourceAllCtrl', supplierResourceAllCtrl)
        .factory('supplierResourceAllService', supplierResourceAllService);
});
