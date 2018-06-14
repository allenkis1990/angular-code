define(['angularUiRouter', '@systemUrl@/js/modules/toBeSales/main'], function (controllers) {
    'use strict';
    angular.module('app.states.toBeSales', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.toBeSales', {
                url: '/toBeSales',
                views: {
                    'states.toBeSales@': {
                        templateUrl: '@systemUrl@/views/toBeSales/toBeSales.html',
                        controller: 'app.toBeSales.toBeSalesCtrl'
                    }
                }
            });
        }]);
});