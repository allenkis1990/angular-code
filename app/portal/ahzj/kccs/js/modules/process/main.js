define(['ahzj/kccs/js/modules/process/controllers/process-ctrl',
    'ahzj/kccs/js/modules/process/services/process-service'], function (processCtrl, processService) {
    'use strict';
    angular.module('app.portal.states.process.main', [])
        .controller('processCtrl', processCtrl)
        .factory('processService', processService);
});