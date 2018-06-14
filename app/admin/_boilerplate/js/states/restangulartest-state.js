/*** 作者: 翁鹏飞*            --- > 亡灵走秀* 日期: 2015/6/8**/
define(['angularUiRouter', '@systemUrl@/js/modules/restangulartest/main'], function () {
    'use strict';
    return angular.module('app.states.restangulartest', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider
                .state('states.restangulartest', {
                    url: '/restangulartest/:id',
                    sticky: true,
                    views: {
                        'states.restangulartest@': {
                            templateUrl: '@systemUrl@/views/restangulartest/restangulartest.html',
                            controller: 'app.restangulartest.restangulartestCtrl'
                        }
                    }
                });
        });
});
