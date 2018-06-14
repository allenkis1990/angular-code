define(['kccs/subPortal/js/modules/helpCenter/controllers/helpCenter-ctrl',
    'kccs/subPortal/js/modules/helpCenter/controllers/helpCenterDetail-ctrl',
    'kccs/subPortal/js/modules/helpCenter/services/helpCenter-service'], function (helpCenterCtrl, helpCenterDetailCtrl, helpCenterService) {
    'use strict';
    angular.module('app.portal.states.helpCenter.main', [])
        .controller('helpCenterCtrl', helpCenterCtrl)
        .controller('helpCenterDetailCtrl', helpCenterDetailCtrl)
        .factory('helpCenterService', helpCenterService);
});