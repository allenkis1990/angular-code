define(['@systemUrl@/js/modules/statisticTaskExport/controllers/statisticTaskExport-ctrl',
    '@systemUrl@/js/modules/questionManage/services/question-service',
    '@systemUrl@/js/services/kendoui-constants',
    '@systemUrl@/js/services/kendoui-commons'], function (controllers, questionService) {
    'use strict';
    angular.module('app.admin.states.statisticTaskExport.main', [])

        .controller('app.admin.states.statisticTaskExport.indexCtrl', controllers.indexCtrl)

        .factory('questionService', questionService);
});