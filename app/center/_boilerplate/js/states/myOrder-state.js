define(['angularUiRouter', '@systemUrl@/js/modules/myOrder/main',
    '@systemUrl@/js/modules/myOrder/creatOrder/main',
    '@systemUrl@/js/modules/myOrder/goPay/main',
    '@systemUrl@/js/modules/myOrder/detail/main',
    '@systemUrl@/js/modules/myOrder/paySuccess/main'], function () {
    'use strict';
    return angular.module('app.states.myOrder', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.myOrder', {
            url: '/myOrder',
            //sticky: true,
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/myOrder/myOrder.html',
                    controller: 'app.myOrder.myOrderCtrl'
                }
            }
        }).state('states.myOrder.creatOrder', {
            url: '/creatOrder/:paramsArr',
            //sticky: true,
            views: {

                /*'topView@': {
                    templateUrl: '@systemUrl@/views/myOrder/creatOrder/top.html'
                },*/

                'contentView@': {
                    templateUrl: '@systemUrl@/views/myOrder/creatOrder/index.html',
                    controller: 'app.center.states.creatOrder.indexCtrl'
                }
            }
        }).state('states.myOrder.goPay', {
            url: '/goPay/:orderNo',
            //sticky: true,
            views: {

                /*'topView@': {
                    templateUrl: '@systemUrl@/views/myOrder/creatOrder/top.html'
                },*/

                'contentView@': {
                    templateUrl: '@systemUrl@/views/myOrder/goPay/index.html',
                    controller: 'app.center.states.goPay.indexCtrl'
                }
            }
        }).state('states.myOrder.detail', {
            url: '/detail/:orderNo',
            //sticky: true,
            views: {

                /*'topView@': {
                    templateUrl: '@systemUrl@/views/myOrder/detail/top.html'
                },*/

                'contentView@': {
                    templateUrl: '@systemUrl@/views/myOrder/detail/index.html',
                    controller: 'app.center.states.detail.indexCtrl'
                }
            }
        }).state('states.myOrder.paySuccess', {
            url: '/paySuccess/:orderNo',
            //sticky: true,
            views: {

                /*'topView@': {
                 templateUrl: '@systemUrl@/views/myOrder/detail/top.html'
                 },*/

                'contentView@': {
                    templateUrl: '@systemUrl@/views/myOrder/paySuccess/index.html',
                    controller: 'app.center.states.paySuccess.indexCtrl'
                }
            }
        });
    });
});
