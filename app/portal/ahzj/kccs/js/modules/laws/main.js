define(['ahzj/kccs/js/modules/laws/controllers/laws-ctrl',
    'ahzj/kccs/js/modules/laws/controllers/lawsDetail-ctrl',
    'ahzj/kccs/js/modules/laws/services/laws-service'], function (lawsCtrl, lawsDetailCtrl, lawsService) {
    'use strict';
    angular.module('app.portal.states.laws.main', [])
        .controller('lawsCtrl', lawsCtrl)
        .controller('lawsDetailCtrl', lawsDetailCtrl)
        .factory('lawsService', lawsService);
});