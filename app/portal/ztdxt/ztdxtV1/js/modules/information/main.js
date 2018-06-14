define(['kccs/kccsv2/js/modules/information/controllers/information-ctrl',
    'kccs/kccsv2/js/modules/information/services/information-service'], function (informationCtrl, informationService) {
    'use strict';
    angular.module('app.portal.states.information.main', [])
        .controller('informationCtrl', informationCtrl)
        .factory('informationService', informationService);
});