define(['angular',
    '@systemUrl@/js/modules/peopleImport/controllers/peopleImport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, peopleImportCtrl, questionService) {
    'use strict';
    return angular.module('app.peopleImport', [])
        .controller('app.peopleImport.peopleImportCtrl', peopleImportCtrl)
        .factory('questionService', questionService);
});
