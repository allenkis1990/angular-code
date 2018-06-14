/**
 * Created by WDL on 2015/9/28.
 */
define(
    [
        'angular',
        '@systemUrl@/js/const/global-constants',
        'directives/remote-validate-directive',
        'directives/compare-to-directive',
        '@systemUrl@/js/modules/systemProcessTask/controllers/systemProcessTask-ctrl',
        '@systemUrl@/js/modules/systemProcessTask/controllers/view-ctrl',
        '@systemUrl@/js/modules/systemProcessTask/services/systemProcessTask-service',
        '@systemUrl@/js/services/kendoui-commons',
        '@systemUrl@/js/services/kendoui-constants'
    ], function (angular, global, validateDirective, compareToDirective, systemProcessTaskCtrl, viewCtrl, systemProcessTaskService) {
        'use strict';
        return angular.module('app.systemProcessTask', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons'])
            .constant('global', global)
            .directive('ajaxValidate', validateDirective)
            .directive('compare', compareToDirective)//引入匹配校验指令
            .controller('app.systemProcessTask.systemProcessTaskCtrl', systemProcessTaskCtrl)
            .controller('app.systemProcessTask.viewCtrl', viewCtrl)
            .factory('systemProcessTaskService', systemProcessTaskService);
    });
