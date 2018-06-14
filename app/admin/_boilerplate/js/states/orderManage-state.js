define(['@systemUrl@/js/modules/orderManage/main',
    '@systemUrl@/js/modules/orderManage/orderDetail/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.orderManage', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.orderManage', {
                url: '/orderManage/:batchNo',
                sticky: true,
                views: {
                    'states.orderManage@': {
                        templateUrl: '@systemUrl@/views/orderManage/index.html',
                        controller: 'app.admin.states.orderManage.indexCtrl'
                    }
                }
            }).state('states.orderManage.orderDetail', {
                url: '/orderDetail/:orderNo/:from',//from 1订单管理 2其他地方
                views: {
                    'orderManageItem': {
                        templateUrl: '@systemUrl@/views/orderManage/orderDetail/index.html',
                        controller: 'app.admin.states.orderDetail.indexCtrl'
                    }
                }
            });
        }]);
});