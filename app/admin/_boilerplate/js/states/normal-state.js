/*** 作者: 翁鹏飞*            --- > 亡灵走秀* 日期: 2015/6/8**/
define(['angularUiRouter', '@systemUrl@/js/modules/normal/main'], function () {
    'use strict';
    return angular.module('app.states.normal', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider

                .state('states.normal', {
                    url: '/normal',
                    sticky: true,
                    //deepStateRedirect: { default: "states.normal" },
                    views: {
                        'states.normal@': {
                            templateUrl: '@systemUrl@/views/normal/normal.html',
                            controller: 'app.normal.normalCtrl'
                        }
                    }
                });
        });
});
