define(['@systemUrl@/js/modules/refundAsynExport/controllers/refundAsynExport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'], function (controllers, questionService) {
    'use strict';
    angular.module('app.admin.states.refundAsynExport.main', [])

        .controller('app.admin.states.refundAsynExport.indexCtrl', controllers.indexCtrl)

        .factory('questionService', questionService);
});