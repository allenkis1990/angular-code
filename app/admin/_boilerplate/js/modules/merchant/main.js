define([
    'angular',
    '@systemUrl@/js/const/global-constants',
    'directives/clearOperator-directive',
    '@systemUrl@/js/modules/merchant/controllers/merchant-ctrl',
    '@systemUrl@/js/modules/merchant/controllers/merchantAdd-ctrl',
    '@systemUrl@/js/modules/merchant/controllers/merchantEdit-ctrl',
    '@systemUrl@/js/modules/merchant/controllers/pushSolution-ctrl',
    '@systemUrl@/js/modules/merchant/controllers/merchantView-ctrl',
    '@systemUrl@/js/modules/merchant/services/merchant-service',
    '@systemUrl@/js/modules/solution/services/solution-service',
    '@systemUrl@/js/modules/merchant/controllers/solution-view',
    'directives/compare-to-directive',
    'directives/upload-image-directive',
    'directives/remote-validate-directive',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, global, clearOperatorDirective, merchantCtrl, merchantAddCtrl, merchantEditCtrl, pushSolutionCtrl, merchantViewCtrl, merchantService, solutionService, solutionViewCtrl, compareToDirective, uploadImage, validateDirective) {
    'use strict';
    return angular.module('app.merchant', [])

        .controller('app.merchant.merchantCtrl', merchantCtrl)//列表
        .controller('app.merchant.merchantAddCtrl', merchantAddCtrl)//添加
        .controller('app.merchant.merchantEditCtrl', merchantEditCtrl)//修改
        .controller('app.merchant.pushSolutionCtrl', pushSolutionCtrl)//推送解决方案
        .controller('app.merchant.merchantViewCtrl', merchantViewCtrl)//查看
        .controller('app.merchant.solutionViewCtrl', solutionViewCtrl)//查看解决方案详情
        .constant('global', global)
        .directive('uploadImage', uploadImage)
        .directive('clearOperator', clearOperatorDirective)
        .directive('compare', compareToDirective)//引入匹配校验指令
        .directive('ajaxValidate', validateDirective)//引入远程校验指令
        .factory('solutionService', solutionService)//引入解决方案管理服务层
        .factory('merchantService', merchantService);//实现对service层数据的引用，引用之后就可在相关的controller文件中使用service层所取回的数据
});
