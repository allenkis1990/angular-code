define(['ahzj/kccs/js/modules/helpCenter/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.helpCenter', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.helpCenter', {
                url: '/accountant.helpCenter/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/helpCenter/helpCenterIndex.html',
                        controller: 'helpCenterCtrl'
                    }
                }
            }).state('states.accountant.helpCenterDetail', {
                url: '/accountant.helpCenterDetail/:id/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/helpCenter/helpCenterDetail.html',
                        controller: 'helpCenterDetailCtrl'
                    }
                }
            });
        }]);
});
