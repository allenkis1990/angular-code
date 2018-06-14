define(['angular',
    '@systemUrl@/js/modules/importOpenClassTask/controllers/importOpenClassTask-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, importOpenClassTask, questionService) {
    'use strict';
    return angular.module('app.importOpenClassTask', [])
        .controller('app.importOpenClassTask.importOpenClassTaskCtrl', importOpenClassTask)
        .factory('questionService', questionService);
});
