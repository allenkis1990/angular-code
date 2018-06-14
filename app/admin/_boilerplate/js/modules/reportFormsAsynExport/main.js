define(['angular',
    '@systemUrl@/js/modules/reportFormsAsynExport/controllers/reportFormsAsynExport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, reportFormsAsynExportCtrl, questionService) {
    'use strict';
    return angular.module('app.reportFormsAsynExport', [])
        .controller('app.reportFormsAsynExport.reportFormsAsynExportCtrl', reportFormsAsynExportCtrl)
        .factory('questionService', questionService);
});
