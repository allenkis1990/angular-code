define(['angular',
        '@systemUrl@/js/modules/learningTimeStatistic/controllers/learningTimeStatistic-ctrl',
        '@systemUrl@/js/modules/learningTimeStatistic/services/learningTimeStatistic-service',
        '@systemUrl@/js/services/kendoui-constants',
        '@systemUrl@/js/services/kendoui-commons'
    ],
    function (angular, learningTimeStatisticCtrl, learningTimeStatisticService) {
        'use strict';
        return angular.module('app.learningTimeStatistic', ['kendo.ui.constants', 'kendo.ui.commons']).controller('app.learningTimeStatistic.learningTimeStatisticCtrl', learningTimeStatisticCtrl)
            .factory('learningTimeStatisticService', learningTimeStatisticService);
    });
