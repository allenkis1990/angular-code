define(['@systemUrl@/js/modules/classInformation/learningProcess/controllers/learningProcess-ctrl',
    '@systemUrl@/js/modules/classInformation/learningProcess/services/learningProcess-service'], function (controllers, learningProcesService) {
    'use strict';
    angular.module('app.admin.states.learningProcess.main', [])

        .controller('app.admin.states.learningProcess.indexCtrl', controllers.indexCtrl)
        .factory('learningProcesService', learningProcesService);
});