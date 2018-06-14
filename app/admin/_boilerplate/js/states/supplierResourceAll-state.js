define(['angularUiRouter', '@systemUrl@/js/modules/supplierResourceAll/main'], function () {
    'use strict';
    return angular.module('app.states.supplierResourceAll', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.supplierResourceAll', {
                url: '/supplierResourceAll',
                sticky: true,
                views: {
                    'states.supplierResourceAll@': {
                        templateUrl: '@systemUrl@/views/supplierResourceAll/supplierResourceAll.html',
                        controller: 'app.supplierResourceAll.supplierResourceAllCtrl'
                    }
                }
            });


        });
});
