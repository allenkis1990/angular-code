define(['angular',
    '@systemUrl@/js/modules/packageAsynExportManager/controllers/packageAsynExport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, packageAsynExportCtrl, questionService) {
    'use strict';
    return angular.module('app.packageExportManager', [])
        .controller('app.packageAsynExport.packageAsynExportCtrl', packageAsynExportCtrl)
        .factory('questionService', questionService);
});
