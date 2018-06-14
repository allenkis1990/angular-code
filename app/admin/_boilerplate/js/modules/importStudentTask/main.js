define(['angular',
    '@systemUrl@/js/modules/importStudentTask/controllers/importStudentTask-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, importStudentTaskCtrl, questionService) {
    'use strict';
    return angular.module('app.importStudentTask', [])
        .controller('app.importStudentTask.importStudentTaskCtrl', importStudentTaskCtrl)
        .factory('questionService', questionService);
});
