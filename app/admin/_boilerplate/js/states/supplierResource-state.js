define(['angularUiRouter', '@systemUrl@/js/modules/supplierResource/main'], function () {
    'use strict';
    return angular.module('app.states.supplierResource', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.supplierResource', {
                url: '/supplierResource',
                sticky: true,
                views: {
                    'states.supplierResource@': {
                        templateUrl: '@systemUrl@/views/supplierResource/supplierResource.html',
                        controller: 'app.supplierResource.supplierResourceCtrl'
                    }
                }
            });


        });
});
