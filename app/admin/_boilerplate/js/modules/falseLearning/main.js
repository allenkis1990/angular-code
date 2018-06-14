define([
        'angular',
        '@systemUrl@/js/modules/falseLearning/controllers/falseLearning-ctrl',
        '@systemUrl@/js/modules/falseLearning/services/falseLearning-service'],
    function (angular, falseLearningCtrl, falseLearningService) {
        'use strict';
        return angular
            .module('app.falseLearning', [])
            .factory('falseLearningService', falseLearningService)
            .controller('app.falseLearning.falseLearningCtrl', falseLearningCtrl);

    }
);
