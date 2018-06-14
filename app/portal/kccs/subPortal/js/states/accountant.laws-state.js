define(['kccs/subPortal/js/modules/laws/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.laws', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.laws', {
                url: '/accountant.laws',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/subPortal/views/laws/index.html',
                        controller: 'lawsCtrl'
                    }
                }
            }).state('states.accountant.laws.lawDetail', {
                url: '/accountant.laws.lawDetail/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/subPortal/views/laws/lawDetail.html',
                        controller: 'lawsDetailCtrl'
                    }
                }
            });
        }]);
});
