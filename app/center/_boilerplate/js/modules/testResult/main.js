define(['@systemUrl@/js/modules/testResult/controllers/testResult-ctrl',
    '@systemUrl@/js/modules/testResult/services/testResult-service'], function (controllers, testResultService) {
    'use strict';
    angular.module('app.center.states.testResult.main', [])
        .controller('app.center.states.testResult.indexCtrl', controllers.indexCtrl)
        .factory('testResultService', testResultService);
});