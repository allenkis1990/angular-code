define(['angular',
    '@systemUrl@/js/modules/questionImport/controllers/questionImport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, questionImportCtrl, questionService) {
    'use strict';
    return angular.module('app.asynJob', []).controller('app.asynJob.questionImportCtrl', questionImportCtrl)
        .factory('questionService', questionService);
});
