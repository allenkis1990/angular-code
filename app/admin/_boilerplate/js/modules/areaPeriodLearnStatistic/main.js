define([
    'angular',
    '@systemUrl@/js/modules/areaPeriodLearnStatistic/controllers/areaPeriodLearnStatistic-ctrl',
    '@systemUrl@/js/modules/areaPeriodLearnStatistic/services/areaPeriodLearnStatistic-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons',
    '@systemUrl@/js/modules/summary/class.common'
], function (angular, /* global, validateDirective,*/areaPeriodLearnStatisticCtrl, areaPeriodLearnStatisticService) {
    'use strict';
    return angular.module('app.areaPeriodLearnStatistic', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons', 'class.common'])
        .controller('app.areaPeriodLearnStatistic.areaPeriodLearnStatisticCtrl', areaPeriodLearnStatisticCtrl)
        .factory('areaPeriodLearnStatisticService', areaPeriodLearnStatisticService);
});
