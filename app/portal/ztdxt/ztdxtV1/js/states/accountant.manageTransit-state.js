define(['kccs/kccsv2/js/modules/manageTransit/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.manageTransit', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.manageTransit', {
                url: '/accountant.manageTransit/:type/:id',
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/manageTransit/index.html',
                        controller: 'manageTransitCtrl'
                    },
                    'topView@': {
                        templateUrl: 'kccs/kccsv2/views/manageTransit/top.html'
                    },
                    'footerView@': {
                        templateUrl: 'kccs/kccsv2/views/manageTransit/top.html'
                    }
                }
            });
        }]);
});
