define(['angular',
    '@systemUrl@/js/const/global-constants',
    'directives/clearOperator-directive',
    '@systemUrl@/js/modules/selectCourseCenter/controllers/selectCourseCenter-ctrl',
    '@systemUrl@/js/modules/selectCourseCenter/controllers/selectCourseCenterAdd-ctrl',
    '@systemUrl@/js/modules/selectCourseCenter/controllers/selectCourseCenterView-ctrl',
    '@systemUrl@/js/modules/selectCourseCenter/services/selectCourseCenter-service',
    '@systemUrl@/js/modules/lessonResourceManage/services/lesson-service',
    'directives/compare-to-directive',
    'directives/remote-validate-directive',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, global, clearOperatorDirective, selectCourseCenterCtrl, selectCourseCenterAddCtrl, selectCourseCenterViewCtrl, selectCourseCenterService, lessonResourceManageService, compareToDirective, validateDirective) {
    'use strict';
    return angular.module('app.selectCourseCenter', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
        .constant('global', global)
        .directive('clearOperator', clearOperatorDirective)
        .directive('compare', compareToDirective)//引入匹配校验指令
        .directive('ajaxValidate', validateDirective)//引入远程校验指令
        .controller('app.selectCourseCenter.selectCourseCenterCtrl', selectCourseCenterCtrl)//指定视图与controller绑定的名称，与state文件中配置一致
        .controller('app.selectCourseCenter.selectCourseCenterViewCtrl', selectCourseCenterViewCtrl)//
        .controller('app.selectCourseCenter.selectCourseCenterAddCtrl', selectCourseCenterAddCtrl)//
        .controller('app.selectCourseCenter.selectCourseCenterAddPageViewCtrl', selectCourseCenterViewCtrl)//
        .factory('selectCourseCenterService', selectCourseCenterService)//实现对service层数据的引用，引用之后就可在相关的controller文件中使用service层所取回的数据
        .factory('lessonResourceManageService', lessonResourceManageService);
});
