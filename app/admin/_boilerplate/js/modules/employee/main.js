define(
    [
        'angular',
        '@systemUrl@/js/const/global-constants',
        'directives/clearOperator-directive',
        'directives/remote-validate-directive',
        '@systemUrl@/js/modules/employee/controllers/employee-ctrl',
        '@systemUrl@/js/modules/employee/services/employee-service',
        '@systemUrl@/js/services/kendoui-commons'
    ], function (angular, global, clearOperator, validateDirective, employeeCtrl, employeeService) {
        'use strict';
        return angular.module('app.employee', ['kendo.ui.commons'])
            .constant('global', global)
            .directive('clearOperator', clearOperator)
            .directive('ajaxValidate', validateDirective)
            .controller('app.employee.employeeCtrl', employeeCtrl)
            .factory('employeeService', employeeService);
    }
);
