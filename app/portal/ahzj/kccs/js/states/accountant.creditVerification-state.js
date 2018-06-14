define(['ahzj/kccs/js/modules/creditVerification/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.creditVerification', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.creditVerification', {
                url: '/accountant.creditVerification/:idNum/:userName',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/creditVerification/creditVerification.html',
                        controller: 'creditVerificationCtrl'
                    }
                }
            });
        }]);
});
