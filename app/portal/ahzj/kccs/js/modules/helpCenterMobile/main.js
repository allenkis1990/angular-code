define(['ahzj/kccs/js/modules/helpCenterMobile/controllers/helpCenterMobile-ctrl',
    'ahzj/kccs/js/modules/helpCenterMobile/controllers/helpCenterMobileDetail-ctrl',
    'ahzj/kccs/js/modules/helpCenterMobile/services/helpCenterMobile-service'], function (helpCenterMobileCtrl, helpCenterMobileDetailCtrl, helpCenterMobileService) {
    'use strict';
    angular.module('app.portal.states.helpCenterMobile.main', [])
        .controller('helpCenterMobileCtrl', helpCenterMobileCtrl)
        .controller('helpCenterMobileDetailCtrl', helpCenterMobileDetailCtrl)
        .factory('helpCenterMobileService', helpCenterMobileService);
});