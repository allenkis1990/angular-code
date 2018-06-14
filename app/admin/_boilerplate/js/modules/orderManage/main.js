define(['@systemUrl@/js/modules/orderManage/controllers/orderManage-ctrl',
        '@systemUrl@/js/modules/orderManage/services/orderManage-service',
        '@systemUrl@/js/modules/orderManage/directives/defence-fake-learning',
        '../../directives/copy-man'],
    function (controllers, orderManageService, defenceFakeLeaningDirective, copyMan) {
        'use strict';
        angular.module('app.admin.states.orderManage.main', [])
            .directive('copyManThree', copyMan)
            .controller('app.admin.states.orderManage.indexCtrl', controllers.indexCtrl)
            .directive('orderManageSelectScheme', defenceFakeLeaningDirective.selectClass)
            .factory('orderManageService', orderManageService);
    });