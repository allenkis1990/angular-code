define(['@systemUrl@/js/modules/orderAsynchExport/controllers/orderAsynchExport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'], function (controllers, questionService) {
    'use strict';
    angular.module('app.admin.states.orderAsynchExport.main', [])

        .controller('app.admin.states.orderAsynchExport.indexCtrl', controllers.indexCtrl)

        .factory('questionService', questionService);
});