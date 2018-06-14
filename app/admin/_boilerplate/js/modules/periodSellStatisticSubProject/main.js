define([
    'angular',
    '@systemUrl@/js/modules/periodSellStatisticSubProject/controllers/periodSellStatistic-ctrl',
    '@systemUrl@/js/modules/periodSellStatisticSubProject/services/periodSellStatistic-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons',
    '@systemUrl@/js/modules/summary/class.common'
], function (angular, /* global, validateDirective,*/periodSellStatisticCtrl, periodSellStatisticService) {
    'use strict';
    return angular.module('app.periodSellStatisticSubProject', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons', 'class.common'])
        .controller('app.periodSellStatisticSubProject.periodSellStatisticCtrl', periodSellStatisticCtrl)
        .factory('periodSellStatisticSubProject', periodSellStatisticService);
});
