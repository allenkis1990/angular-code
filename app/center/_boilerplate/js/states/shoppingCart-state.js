define(['angularUiRouter', '@systemUrl@/js/modules/shoppingCart/main'], function () {
    'use strict';
    return angular.module('app.states.shoppingCart', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.shoppingCart', {
            url: '/shoppingCart',
            //sticky: true,
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/shoppingCart/shoppingCart.html',
                    controller: 'app.shoppingCart.shoppingCartCtrl'
                }
            }
        });
    });
});
