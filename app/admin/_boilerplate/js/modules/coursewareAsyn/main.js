define(['angular',
    '@systemUrl@/js/modules/coursewareAsyn/controllers/coursewareAsynCtrl-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, coursewareAsynCtrl, questionService) {
    'use strict';
    return angular.module('app.asynJob', []).controller('app.asynJob.coursewareAsynCtrl', coursewareAsynCtrl)
        .factory('questionService', questionService);
});
