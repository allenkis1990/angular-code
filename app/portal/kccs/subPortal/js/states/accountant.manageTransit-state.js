define(['kccs/subPortal/js/modules/manageTransit/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.manageTransit', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.manageTransit', {
                url: '/accountant.manageTransit/:type/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/subPortal/views/manageTransit/index.html',
                        controller: 'manageTransitCtrl'
                    },
                    'topView@': {
                        templateUrl: 'kccs/subPortal/views/manageTransit/top.html'
                    },
                    'footerView@': {
                        templateUrl: 'kccs/subPortal/views/manageTransit/top.html'
                    }
                }
            });
        }]);
});
