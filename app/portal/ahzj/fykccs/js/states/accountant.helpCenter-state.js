define(['ahzj/fykccs/js/modules/helpCenter/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.helpCenter', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.helpCenter', {
                url: '/accountant.helpCenter/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/helpCenter/helpCenterIndex.html',
                        controller: 'helpCenterCtrl'
                    }
                }
            }).state('states.accountant.helpCenterDetail', {
                url: '/accountant.helpCenterDetail/:id/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/helpCenter/helpCenterDetail.html',
                        controller: 'helpCenterDetailCtrl'
                    }
                }
            });
        }]);
});
