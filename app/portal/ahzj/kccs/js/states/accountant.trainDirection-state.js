define(['ahzj/kccs/js/modules/trainDirection/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.trainDirection', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.trainDirection', {
                url: '/accountant.trainDirection/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/kccs/views/trainDirection/index.html',
                        controller: 'trainDirectionCtrl'
                    }
                }
            }).state('states.accountant.trainDirection.detail', {
                url: '/detail/:id',
                views: {
                    'detail': {
                        templateUrl: 'ahzj/kccs/views/trainDirection/detail.html',
                        controller: 'trainDirectionDetailCtrl'
                    }
                }
            });
        }]);
});
