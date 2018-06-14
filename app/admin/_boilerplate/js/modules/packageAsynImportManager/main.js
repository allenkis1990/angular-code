define(['angular',
    '@systemUrl@/js/modules/packageAsynImportManager/controllers/packageAsynImport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    'restangular',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'

], function (angular, packageAsynImportCtrl, questionService) {
    'use strict';
    return angular.module('app.packageImportManager', [])
        .controller('app.packageAsynImport.packageAsynImportCtrl', packageAsynImportCtrl)
        .factory('questionService', questionService);
});
