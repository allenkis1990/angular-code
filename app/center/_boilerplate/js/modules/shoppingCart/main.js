define([
    'angular',
    '@systemUrl@/js/modules/shoppingCart/controllers/shoppingCart-ctrl',
    '@systemUrl@/js/modules/shoppingCart/services/shoppingCart-service',
    '@systemUrl@/js/modules/signUpTraining/services/signUpTraining-service',
    '@systemUrl@/js/modules/myOrder/services/myOrder-service',
    'restangular'
], function (angular, shoppingCartCtrl, shoppingCartService, signUpTrainingService, myOrderService) {
    'use strict';
    return angular.module('app.shoppingCart', [])


        .controller('app.shoppingCart.shoppingCartCtrl', shoppingCartCtrl)

        .factory('shoppingCartService', shoppingCartService)


        .factory('signUpTrainingService', signUpTrainingService)
        .factory('myOrderService', myOrderService);
});
