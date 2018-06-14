define(
    [
        'angular',
        'directives/clearOperator-directive',
        '@systemUrl@/js/modules/studyStatistic/services/study-statistic-service',
        '@systemUrl@/js/modules/studyStatistic/controllers/study-statistic-index',
        '@systemUrl@/js/modules/studyStatistic/controllers/study-statistic-lesson-view',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, clearOperator, studyStatisticService, index, lessonView) {
        'use strict';
        return angular.module('app.studyStatistic', [])
            .directive('clearOperator', clearOperator)
            .factory('studyStatisticService', studyStatisticService)

            .controller('app.studyStatistic.index', index)
            .controller('app.studyStatistic.lessonView', lessonView);
    }
);
