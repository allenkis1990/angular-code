define([
    'angular',
    '@systemUrl@/js/modules/courseChooseStatistic/controllers/courseChooseStatistic-ctrl',
    '@systemUrl@/js/modules/courseChooseStatistic/services/courseChooseStatistic-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons',
    '@systemUrl@/js/modules/summary/class.common'
], function (angular, /* global, validateDirective,*/courseChooseStatisticCtrl, courseChooseStatisticService) {
    'use strict';
    return angular.module('app.courseChooseStatistic', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons', 'class.common'])
        .controller('app.courseChooseStatistic.courseChooseStatisticCtrl', courseChooseStatisticCtrl)
        .factory('courseChooseStatisticService', courseChooseStatisticService);
});
