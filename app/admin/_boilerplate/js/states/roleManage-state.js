define(['angularUiRouter', '@systemUrl@/js/modules/roleManage/main'], function () {
    'use strict';
    return angular.module('app.states.roleManage', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.roleManage', {
            url: '/roleManage/:roleId',
            sticky: true,
            views: {
                'states.roleManage@': {
                    templateUrl: '@systemUrl@/views/roleManage/roleManage-index.html',
                    controller: 'app.roleManage.roleManageCtrl'
                }
            }
        })
            .state('states.roleManage.edit', {
                url: '/edit/:roleId',
                templateUrl: '@systemUrl@/views/roleManage/roleManage-edit.html',
                controller: 'app.roleManage.roleManageEditCtrl'
            }).state('states.roleManage.add', {
            url: '/add',
            templateUrl: '@systemUrl@/views/roleManage/roleManage-add.html',
            controller: 'app.roleManage.roleManageAddCtrl'
        }).state('states.roleManage.view', {
            url: '/view/:roleId/:type',
            templateUrl: '@systemUrl@/views/roleManage/roleManage-view.html',
            controller: 'app.roleManage.roleManageViewCtrl'
        });

    });
});
