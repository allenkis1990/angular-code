define([
    'angular',
    '@systemUrl@/js/modules/periodSellStatistic/controllers/periodSellStatistic-ctrl',
    '@systemUrl@/js/modules/periodSellStatistic/services/periodSellStatistic-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons',
    '@systemUrl@/js/modules/summary/class.common'
], function (angular, /* global, validateDirective,*/periodSellStatisticCtrl, periodSellStatisticService) {
    'use strict';
    return angular.module('app.periodSellStatistic', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons', 'class.common'])
        .controller('app.periodSellStatistic.periodSellStatisticCtrl', periodSellStatisticCtrl)
        .factory('periodSellStatisticService', periodSellStatisticService);
});
