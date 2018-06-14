define([
    'angular',
    '@systemUrl@/js/modules/supplierResource/controllers/supplierResource-ctrl',
    '@systemUrl@/js/modules/supplierResource/services/supplierResource-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons',
    '@systemUrl@/js/modules/summary/class.common'
], function (angular, /* global, validateDirective,*/supplierResourceCtrl, supplierResourceService) {
    'use strict';
    return angular.module('app.supplierResource', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons', 'class.common'])
        .controller('app.supplierResource.supplierResourceCtrl', supplierResourceCtrl)
        .factory('supplierResourceService', supplierResourceService);
});
