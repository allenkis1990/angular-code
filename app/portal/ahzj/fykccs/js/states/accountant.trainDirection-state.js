define(['ahzj/fykccs/js/modules/trainDirection/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.trainDirection', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.accountant.trainDirection', {
                url: '/accountant.trainDirection/:type',
                views: {
                    'contentView@': {
                        templateUrl: 'ahzj/fykccs/views/trainDirection/index.html',
                        controller: 'trainDirectionCtrl'
                    }
                }
            });
        }]);
});
