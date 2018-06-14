define(['angularUiRouter', '@systemUrl@/js/modules/administratorManage/main'], function () {
    'use strict';
    return angular.module('app.states.administratorManage', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.administratorManage', {
            url: '/administratorManage/:roleId/:unitId/:dimension',
            sticky: true,
            views: {
                'states.administratorManage@': {
                    templateUrl: '@systemUrl@/views/administratorManage/administratorManage-index.html',
                    controller: 'app.administratorManage.administratorManageCtrl'
                }
            }
        })
            .state('states.administratorManage.edit', {
                // params:{
                // 	'administratorId':'-1'
                // },
                url: '/edit/:administratorId',
                templateUrl: '@systemUrl@/views/administratorManage/administratorManage-edit.html',
                controller: 'app.administratorManage.administratorManageEditCtrl'
            }).state('states.administratorManage.add', {
            url: '/add',
            templateUrl: '@systemUrl@/views/administratorManage/administratorManage-add.html',
            controller: 'app.administratorManage.administratorManageAddCtrl'
        }).state('states.administratorManage.view', {
            url: '/view/:administratorId',
            templateUrl: '@systemUrl@/views/administratorManage/administratorManage-view.html',
            controller: 'app.administratorManage.administratorManageViewCtrl'
        });

    });
});
