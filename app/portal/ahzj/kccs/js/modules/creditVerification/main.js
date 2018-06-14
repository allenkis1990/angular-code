define(['ahzj/kccs/js/modules/creditVerification/controllers/creditVerification-ctrl',
    'ahzj/kccs/js/modules/creditVerification/services/creditVerification-service'], function (creditVerificationCtrl, creditVerificationService) {
    'use strict';
    angular.module('app.portal.states.creditVerification.main', [])
        .controller('creditVerificationCtrl', creditVerificationCtrl)
        .factory('creditVerificationService', creditVerificationService);
});