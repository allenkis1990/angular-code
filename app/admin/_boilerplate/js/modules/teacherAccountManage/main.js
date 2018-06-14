define([
    'angular',
    '@systemUrl@/js/const/global-constants',
    'directives/clearOperator-directive',
    'directives/remote-validate-directive',
    'directives/compare-to-directive',
    '@systemUrl@/js/modules/teacherAccountManage/controllers/teacherAccountManage-ctrl',
    '@systemUrl@/js/modules/teacherAccountManage/services/teacherAccountManage-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-commons',
    '@systemUrl@/js/services/kendoui-constants'
], function (angular, global, clearOperatorDirective, validateDirective, compareToDirective, teacherAccountManageCtrl, teacherAccountManageService) {
    'use strict';
    return angular.module('app.teacherAccountManage', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
        .constant('global', global)
        .directive('clearOperator', clearOperatorDirective)
        .directive('ajaxValidate', validateDirective)
        .directive('compare', compareToDirective)//引入匹配校验指令
        .controller('app.teacherAccountManage.teacherAccountManageCtrl', teacherAccountManageCtrl)
        .factory('teacherAccountManageService', teacherAccountManageService);
});
