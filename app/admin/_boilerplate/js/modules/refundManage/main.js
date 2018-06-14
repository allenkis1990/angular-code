define([
        'angular',
        '@systemUrl@/js/modules/refundManage/controllers/refundManage-ctrl',
        '@systemUrl@/js/modules/refundManage/services/refundManage-service',
        '@systemUrl@/js/modules/orderManage/directives/defence-fake-learning'
    ],
    function (angular, refundManageCtrl, refundManageService, defenceFakeLeaningDirective/*,copyMan*/) {
        'use strict';
        return angular.module('app.refundManage', [])

        /*  .directive('copyMan', copyMan)*/

            .controller('app.refundManage.index', refundManageCtrl.index)
            .directive('refundManageSelectScheme', defenceFakeLeaningDirective.selectClass)
            .factory('refundManageService', refundManageService);
    });
