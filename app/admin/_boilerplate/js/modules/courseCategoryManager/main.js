define([
    'angular',
    '@systemUrl@/js/const/global-constants',
    'directives/remote-validate-directive',
    '@systemUrl@/js/modules/courseCategoryManager/controllers/courseCategoryManager-ctrl',
    '@systemUrl@/js/modules/courseCategoryManager/services/courseCategoryManager-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, global, validateDirective, courseCategoryManagerCtrl, courseCategoryManagerService) {
    'use strict';
    return angular.module('app.courseResourcesManager', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
        .constant('global', global)
        .directive('ajaxValidate', validateDirective)
        .controller('app.courseCategoryManager.courseCategoryManagerCtrl', courseCategoryManagerCtrl)
        .factory('courseCategoryManagerService', courseCategoryManagerService);
});
