define(['angularUiRouter', '@systemUrl@/js/modules/teacherAccountManage/main'], function () {
    'use strict';
    return angular.module('app.states.teacherAccountManage', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.teacherAccountManage', {
            url: '/teacherAccountManage',
            sticky: true,
            views: {
                'states.teacherAccountManage@': {
                    templateUrl: '@systemUrl@/views/teacherAccountManage/teacherAccountManage.html',
                    controller: 'app.teacherAccountManage.teacherAccountManageCtrl'
                }
            }
        });
    });
});
