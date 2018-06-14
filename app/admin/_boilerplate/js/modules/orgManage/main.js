define(['angular',
    '@systemUrl@/js/modules/orgManage/controllers/orgManage-ctrl',
    '@systemUrl@/js/modules/orgManage/services/orgManage-service',
    'directives/compare-to-directive',
    'directives/remote-validate-directive',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, orgManageCtrl, orgManageService, compareToDirective, validateDirective) {
    'use strict';
    return angular.module('app.orgManage', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
        .directive('compare', compareToDirective)//引入匹配校验指令
        .directive('ajaxValidate', validateDirective)//引入远程校验指令
        .controller('app.orgManage.orgManageCtrl', orgManageCtrl)//指定视图与controller绑定的名称，与state文件中配置一致
        .factory('orgManageService', orgManageService);//实现对service层数据的引用，引用之后就可在相关的controller文件中使用service层所取回的数据
});
