define(['angular',
    '@systemUrl@/js/modules/userAsynExport/controllers/userAsynExport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, userAsynExportCtrl, questionService) {
    'use strict';
    return angular.module('app.userAsynExport', [])
        .controller('app.userAsynExport.userAsynExportCtrl', userAsynExportCtrl)
        .factory('questionService', questionService);
});
