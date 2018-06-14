define(['kccs/subPortal/js/modules/helpCenter/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.helpCenter', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.helpCenter', {
                url: '/accountant.helpCenter/:categoryType',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/subPortal/views/helpCenter/helpCenterIndex.html',
                        controller: 'helpCenterCtrl'
                    }
                }
            }).state('states.accountant.helpCenterDetail', {
                url: '/accountant.helpCenterDetail/:id/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/subPortal/views/helpCenter/helpCenterDetail.html',
                        controller: 'helpCenterDetailCtrl'
                    }
                }
            });
        }]);
});
