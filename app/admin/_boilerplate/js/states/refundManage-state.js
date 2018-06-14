/**
 * Created by hb on 2017/3/21.
 */
define(['@systemUrl@/js/modules/refundManage/main',
    '@systemUrl@/js/modules/refundManage/refundDetail/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.refundManage', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.refundManage', {
            url: '/refundManage',
            sticky: true,
            views: {
                'states.refundManage@': {
                    templateUrl: '@systemUrl@/views/refundManage/index.html',
                    controller: 'app.refundManage.index'
                }
            }
        }).state('states.refundManage.refundDetail', {
            url: '/refundDetail/:orderNo',
            views: {
                'refundManageItem': {
                    templateUrl: '@systemUrl@/views/refundManage/refundDetail/index.html',
                    controller: 'app.admin.states.refundDetail.indexCtrl'
                }
            }
        });
    }]);
});