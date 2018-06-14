define([
        'angular',
        '@systemUrl@/js/const/global-constants',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/traningOrganizationManager/controllers/traningOrganizationManager-ctrl',
        '@systemUrl@/js/modules/traningOrganizationManager/controllers/traningOrganizationManagerAdd-ctrl',
        '@systemUrl@/js/modules/traningOrganizationManager/services/traningOrganizationManager-service',
        '../../directives/copy-man', 'restangular',
        '@systemUrl@/js/services/kendoui-commons',
        '@systemUrl@/js/services/kendoui-constants'
    ],
    function (angular, global, validateDirective, traningOrganizationManagerCtrl,traningOrganizationManagerAdd,traningOrganizationManagerService,copyMan) {
        'use strict';
        return angular.module('app.traningOrganizationManager', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
            .constant('global', global)
            .directive('ajaxValidate', validateDirective)
            .directive('copyManTwo', copyMan)
            .controller('app.traningOrganizationManager.traningOrganizationManagerCtrl', traningOrganizationManagerCtrl)
            .controller('app.traningOrganizationManager.traningOrganizationManagerAddCtrl', traningOrganizationManagerAdd)
            .factory('traningOrganizationManagerService', traningOrganizationManagerService);
    });
