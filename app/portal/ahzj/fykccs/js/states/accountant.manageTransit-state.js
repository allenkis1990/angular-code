define(['ahzj/fykccs/js/modules/manageTransit/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.manageTransit', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.manageTransit', {
                url: '/accountant.manageTransit/:type/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/manageTransit/index.html',
                        controller: 'manageTransitCtrl'
                    },
                    'topView@': {
                        templateUrl: 'ahzj/fykccs/views/manageTransit/top.html'
                    },
                    'footerView@': {
                        templateUrl: 'ahzj/fykccs/views/manageTransit/top.html'
                    }
                }
            });
        }]);
});
