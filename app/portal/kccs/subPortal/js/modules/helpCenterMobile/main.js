define(['kccs/subPortal/js/modules/helpCenterMobile/controllers/helpCenterMobile-ctrl',
    'kccs/subPortal/js/modules/helpCenterMobile/controllers/helpCenterMobileDetail-ctrl',
    'kccs/subPortal/js/modules/helpCenterMobile/services/helpCenterMobile-service'], function (helpCenterMobileCtrl, helpCenterMobileDetailCtrl, helpCenterMobileService) {
    'use strict';
    angular.module('app.portal.states.helpCenterMobile.main', [])
        .controller('helpCenterMobileCtrl', helpCenterMobileCtrl)
        .controller('helpCenterMobileDetailCtrl', helpCenterMobileDetailCtrl)
        .factory('helpCenterMobileService', helpCenterMobileService);
});