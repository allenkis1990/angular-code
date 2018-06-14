define(['kccs/subPortal/js/modules/process/controllers/process-ctrl',
    'kccs/subPortal/js/modules/process/services/process-service'], function (processCtrl, processService) {
    'use strict';
    angular.module('app.portal.states.process.main', [])
        .controller('processCtrl', processCtrl)
        .factory('processService', processService);
});