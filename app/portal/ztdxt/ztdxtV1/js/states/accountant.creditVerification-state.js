define(['kccs/kccsv2/js/modules/creditVerification/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.creditVerification', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.creditVerification', {
                url: '/accountant.creditVerification/:idNum/:userName',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/creditVerification/creditVerification.html',
                        controller: 'creditVerificationCtrl'
                    }
                }
            });
        }]);
});
