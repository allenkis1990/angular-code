define(['@systemUrl@/js/modules/paymentAccount/main',
    '@systemUrl@/js/modules/paymentAccount/paymentAdd/main',
    '@systemUrl@/js/modules/paymentAccount/paymentUpdate/main',
    '@systemUrl@/js/modules/paymentAccount/paymentDetail/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.paymentAccount', [])
        .config(['$stateProvider', 'HB_WebUploaderProvider',
            function ($stateProvider, HB_WebUploaderProvider) {
            $stateProvider.state('states.paymentAccount', {
                url: '/paymentAccount',
                sticky: true,
                views: {
                    'states.paymentAccount@': {
                        templateUrl: '@systemUrl@/views/paymentAccount/index.html',
                        controller: 'app.admin.states.paymentAccount.indexCtrl'
                    }
                }
            }).state('states.paymentAccount.paymentAdd', {
                url: '/paymentAdd',
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                },
                views: {
                    'paymentAccountItem': {
                        templateUrl: '@systemUrl@/views/paymentAccount/paymentAdd/index.html',
                        controller: 'app.admin.states.paymentAdd.indexCtrl'
                    }
                }
            }).state('states.paymentAccount.paymentUpdate', {
                url: '/paymentUpdate',
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                },
                views: {
                    'paymentAccountItem': {
                        templateUrl: '@systemUrl@/views/paymentAccount/paymentUpdate/index.html',
                        controller: 'app.admin.states.paymentUpdate.indexCtrl'
                    }
                }
            }).state('states.paymentAccount.paymentDetail', {
                url: '/paymentDetail',
                views: {
                    'paymentAccountItem': {
                        templateUrl: '@systemUrl@/views/paymentAccount/paymentDetail/index.html',
                        controller: 'app.admin.states.paymentDetail.indexCtrl'
                    }
                }
            });
        }]);
});