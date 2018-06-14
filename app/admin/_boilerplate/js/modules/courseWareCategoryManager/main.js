define([
    'angular',
    '@systemUrl@/js/const/global-constants',
    'directives/remote-validate-directive',
    '@systemUrl@/js/modules/courseWareCategoryManager/controllers/courseWareCategoryManager-ctrl',
    '@systemUrl@/js/modules/courseWareCategoryManager/services/courseWareCategoryManager-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, global, validateDirective, courseResourcesManagerCtrl, courseWareCategoryManagerService) {
    'use strict';
    return angular.module('app.courseWareCategoryManager',
        ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
        .constant('global', global)
        .directive('ajaxValidate', validateDirective)
        .controller('app.courseWareCategoryManager.courseWareCategoryManagerCtrl', courseResourcesManagerCtrl)
        .factory('courseWareCategoryManagerService', courseWareCategoryManagerService);
});
