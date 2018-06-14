define(['ahzj/kccs/js/modules/helpCenter/controllers/helpCenter-ctrl',
    'ahzj/kccs/js/modules/helpCenter/controllers/helpCenterDetail-ctrl',
    'ahzj/kccs/js/modules/helpCenter/services/helpCenter-service'], function (helpCenterCtrl, helpCenterDetailCtrl, helpCenterService) {
    'use strict';
    angular.module('app.portal.states.helpCenter.main', [])
        .controller('helpCenterCtrl', helpCenterCtrl)
        .controller('helpCenterDetailCtrl', helpCenterDetailCtrl)
        .factory('helpCenterService', helpCenterService);
});