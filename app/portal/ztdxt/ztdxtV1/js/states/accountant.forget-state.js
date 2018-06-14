define(['kccs/kccsv2/js/modules/forget/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.forget', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.forget', {
                url: '/accountant.forget',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/forget/forget.html',
                        controller: 'forgetCtrl'
                    }
                }
            });
        }]);
});
