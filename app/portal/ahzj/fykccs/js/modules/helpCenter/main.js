define(['ahzj/fykccs/js/modules/helpCenter/controllers/helpCenter-ctrl',
    'ahzj/fykccs/js/modules/helpCenter/controllers/helpCenterDetail-ctrl',
    'ahzj/fykccs/js/modules/helpCenter/services/helpCenter-service'], function (helpCenterCtrl, helpCenterDetailCtrl, helpCenterService) {
    'use strict';
    angular.module('app.portal.states.helpCenter.main', [])
        .controller('helpCenterCtrl', helpCenterCtrl)
        .controller('helpCenterDetailCtrl', helpCenterDetailCtrl)
        .factory('helpCenterService', helpCenterService);
});