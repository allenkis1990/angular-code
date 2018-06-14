define(['@systemUrl@/js/modules/unitAdmin/main',
    '@systemUrl@/js/modules/unitAdmin/userInfo/main',
    '@systemUrl@/js/modules/unitAdmin/orderInfo/main',
    '@systemUrl@/js/modules/unitAdmin/invoiceInfo/main',
    '@systemUrl@/js/modules/unitAdmin/distributionQuery/main',
    '@systemUrl@/js/modules/unitAdmin/refundOrder/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.unitAdmin', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.unitAdmin', {
            url: '/unitAdmin',
            sticky: true,
            views: {
                'states.unitAdmin@': {
                    templateUrl: '@systemUrl@/views/unitAdmin/index.html',
                    controller: 'app.admin.states.unitAdmin.indexCtrl'
                }
            }
        }).state('states.unitAdmin.userInfo', {
            url: '/userInfo',
            sticky: true,
            views: {
                'states.unitAdmin.userInfo': {
                    templateUrl: '@systemUrl@/views/unitAdmin/userInfo/index.html',
                    controller: 'app.admin.states.userInfo.indexCtrl'
                }
            }
        }).state('states.unitAdmin.batchInfo', {
            url: '/batchInfo',
            sticky: true,
            views: {
                'states.unitAdmin.batchInfo': {
                    templateUrl: '@systemUrl@/views/unitAdmin/orderInfo/index.html',
                    controller: 'app.admin.states.batchInfo.indexCtrl'
                }
            }
        }).state('states.unitAdmin.invoiceInfo', {
            url: '/invoiceInfo',
            sticky: true,
            views: {
                'states.unitAdmin.invoiceInfo': {
                    templateUrl: '@systemUrl@/views/unitAdmin/invoiceInfo/index.html',
                    controller: 'app.admin.states.invoiceInfo.indexCtrl'
                }
            }
        }).state('states.unitAdmin.distributionQuery', {
            url: '/distributionQuery',
            sticky: true,
            views: {
                'states.unitAdmin.distributionQuery': {
                    templateUrl: '@systemUrl@/views/unitAdmin/distributionQuery/index.html',
                    controller: 'app.admin.states.distributionQuery.indexCtrl'
                }
            }
        }).state('states.unitAdmin.refundOrder', {
            url: '/refundOrder',
            sticky: true,
            views: {
                'states.unitAdmin.refundOrder': {
                    templateUrl: '@systemUrl@/views/unitAdmin/refundOrder/index.html',
                    controller: 'app.admin.states.refundOrder.indexCtrl'
                }
            }
        })
    }])
})