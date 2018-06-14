define(
    [
        'angular',
        '@systemUrl@/js/modules/logonStatistic/services/logon-statistic-service',
        '@systemUrl@/js/modules/logonStatistic/controllers/logon-statistic-index',
        'common/hb-angular-echarts',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, logonStatisticService, index) {
        'use strict';
        return angular.module('app.logonStatistic', ['chartModule'])
            .factory('logonStatisticService', logonStatisticService)

            .controller('app.logonStatistic.index', index);
    }
);
