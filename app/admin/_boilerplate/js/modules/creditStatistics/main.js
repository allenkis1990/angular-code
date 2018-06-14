define([
    'angular',
    'directives/clearOperator-directive',
    '@systemUrl@/js/modules/creditStatistics/controllers/creditStatistics-ctrl',
    '@systemUrl@/js/modules/creditStatistics/controllers/creditStatisticsDetail-ctrl',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'
], function (angular, clearOperatorDirective, creditStatisticsCtrl, creditStatisticsDetailCtrl, creditStatisticsService) {
    'use strict';
    return angular.module('app.creditStatistics', [])
        .directive('clearOperator', clearOperatorDirective)
        .controller('app.creditStatistics.creditStatisticsCtrl', creditStatisticsCtrl)
        .controller('app.creditStatistics.creditStatisticsDetailCtrl', creditStatisticsDetailCtrl);
});
