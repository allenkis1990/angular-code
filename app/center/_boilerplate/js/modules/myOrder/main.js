define([
    'angular',
    '@systemUrl@/js/modules/myOrder/controllers/myOrder-ctrl',
    '@systemUrl@/js/modules/myOrder/services/myOrder-service',
    '@systemUrl@/js/modules/myOrder/directives/myOrder-directive',
    '@systemUrl@/js/modules/signUpTraining/services/signUpTraining-service',
    '@systemUrl@/js/common/zh-cn',
    'restangular'
], function (angular, myOrderCtrl, myOrderService, myOrderDirective, signUpTrainingService) {
    'use strict';
    return angular.module('app.myOrder', ['ngLocale'])


        .controller('app.myOrder.myOrderCtrl', myOrderCtrl)

        .factory('myOrderService', myOrderService)

        .factory('signUpTrainingService', signUpTrainingService)

        .directive('invoiceDialog', myOrderDirective);
});
