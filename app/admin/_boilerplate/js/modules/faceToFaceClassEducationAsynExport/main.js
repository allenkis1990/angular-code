define(['angular',
    '@systemUrl@/js/modules/faceToFaceClassEducationAsynExport/controllers/faceToFaceClassEducationAsynExport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, faceToFaceClassEducationAsynExportCtrl, questionService) {
    'use strict';
    return angular.module('app.faceToFaceClassEducationAsynExport', [])
        .controller('app.faceToFaceClassEducationAsynExport.faceToFaceClassEducationAsynExportCtrl', faceToFaceClassEducationAsynExportCtrl)
        .factory('questionService', questionService);
});
