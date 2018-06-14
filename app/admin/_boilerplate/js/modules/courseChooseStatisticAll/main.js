define([
    'angular',
    '@systemUrl@/js/modules/courseChooseStatisticAll/controllers/courseChooseStatisticAll-ctrl',
    '@systemUrl@/js/modules/courseChooseStatisticAll/services/courseChooseStatisticAll-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons',
    '@systemUrl@/js/modules/summary/class.common'
], function (angular, /* global, validateDirective,*/courseChooseStatisticAllCtrl, courseChooseStatisticAllService) {
    'use strict';
    return angular.module('app.courseChooseStatisticAll', ['restangular', 'kendo.ui.constants', 'kendo.ui.commons', 'class.common'])
        .controller('app.courseChooseStatisticAll.courseChooseStatisticAllCtrl', courseChooseStatisticAllCtrl)
        .factory('courseChooseStatisticAllService', courseChooseStatisticAllService);
});
