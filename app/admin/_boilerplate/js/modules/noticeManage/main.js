define([
    'angular',
    '@systemUrl@/js/const/global-constants',
    'directives/clearOperator-directive',
    '@systemUrl@/js/modules/noticeManage/controllers/noticeManage-ctrl',
    '@systemUrl@/js/modules/noticeManage/controllers/noticeManageView-ctrl',
    '@systemUrl@/js/modules/noticeManage/services/noticeManage-service',
    'directives/compare-to-directive',
    'directives/remote-validate-directive',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, global, clearOperatorDirective, noticeManageCtrl, noticeManageViewCtrl, noticeManageService, compareToDirective, validateDirective) {
    'use strict';
    return angular.module('app.noticeManage', [])

        .controller('app.noticeManage.noticeManageCtrl', noticeManageCtrl)
        .controller('app.noticeManage.noticeManageViewCtrl', noticeManageViewCtrl)
        .constant('global', global)
        .directive('clearOperator', clearOperatorDirective)
        .directive('compare', compareToDirective)//引入匹配校验指令
        .directive('ajaxValidate', validateDirective)//引入远程校验指令
        .factory('noticeManageService', noticeManageService);//实现对service层数据的引用，引用之后就可在相关的controller文件中使用service层所取回的数据
});
