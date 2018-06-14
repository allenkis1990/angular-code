define([
    'angular',
    'directives/clearOperator-directive',
    '@systemUrl@/js/modules/examStatistics/controllers/examStatistics-ctrl',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, clearOperatorDirective, examStatisticsCtrl) {
    'use strict';
    return angular.module('app.examStatistics', [])
        .directive('clearOperator', clearOperatorDirective)
        .controller('app.examStatistics.examStatisticsCtrl', examStatisticsCtrl);
});
