define(['angularUiRouter', '@systemUrl@/js/modules/selling/main'], function (controllers) {
    'use strict';
    angular.module('app.states.selling', ['ui.router'])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.selling', {
                url: '/selling',
                views: {
                    'states.selling@': {
                        templateUrl: '@systemUrl@/views/selling/selling.html',
                        controller: 'app.selling.sellingCtrl'
                    }
                }
            });
        }]);
});