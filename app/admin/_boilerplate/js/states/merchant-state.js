define(['angularUiRouter', '@systemUrl@/js/modules/merchant/main'], function () {
    'use strict';
    return angular.module('app.states.merchant', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.merchant', {
            url: '/merchant',
            sticky: true,
            views: {
                'states.merchant@': {
                    templateUrl: '@systemUrl@/views/merchant/merchant_list.html',
                    controller: 'app.merchant.merchantCtrl'
                }
            }
        }).state('states.merchant.add', {
            url: '/add',
            templateUrl: '@systemUrl@/views/merchant/merchant_add.html',
            controller: 'app.merchant.merchantAddCtrl'
        }).state('states.merchant.edit', {
            url: '/edit/:id',
            templateUrl: '@systemUrl@/views/merchant/merchant_edit.html',
            controller: 'app.merchant.merchantEditCtrl'
        }).state('states.merchant.pushSolution', {
            url: '/pushSolution/:projectId/:merchantId/:unitId/:serveTimeBegin/:serveTimeEnd/:merchantNature',
            templateUrl: '@systemUrl@/views/merchant/pushSolution.html',
            controller: 'app.merchant.pushSolutionCtrl'
        }).state('states.merchant.view', {
            url: '/view/:projectId/:merchantId',
            templateUrl: '@systemUrl@/views/merchant/view.html',
            controller: 'app.merchant.merchantViewCtrl'
        }).state('states.merchant.solutionView', {
            url: '/solutionView/:solutionId/:projectId/:merchantId',
            templateUrl: '@systemUrl@/views/merchant/solution-view.html',
            controller: 'app.merchant.solutionViewCtrl'
        });
    });
});
