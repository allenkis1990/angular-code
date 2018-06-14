define(['angularUiRouter', '@systemUrl@/js/modules/lecturerManage/main'], function () {
    'use strict';
    return angular.module('app.states.lecturerManage', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.lecturerManage', {
            url: '/lecturerManage/:roleId',
            sticky: true,
            views: {
                'states.lecturerManage@': {
                    templateUrl: '@systemUrl@/views/lecturerManage/lecturerManage-index.html',
                    controller: 'app.lecturerManage.lecturerManageCtrl'
                }
            }
        })
            .state('states.lecturerManage.edit', {
                // params:{
                // 	'lecturerId':'-1'
                // },
                url: '/edit/:administratorId',
                templateUrl: '@systemUrl@/views/lecturerManage/lecturerManage-edit.html',
                controller: 'app.lecturerManage.lecturerManageEditCtrl'
            }).state('states.lecturerManage.add', {
            url: '/add',
            templateUrl: '@systemUrl@/views/lecturerManage/lecturerManage-add.html',
            controller: 'app.lecturerManage.lecturerManageAddCtrl'
        }).state('states.lecturerManage.view', {
            url: '/view/:administratorId',
            templateUrl: '@systemUrl@/views/lecturerManage/lecturerManage-view.html',
            controller: 'app.lecturerManage.lecturerManageViewCtrl'
        });

    });
});
