define(['angularUiRouter', '@systemUrl@/js/modules/courseWareManager/main'], function () {
    'use strict';
    return angular.module('app.states.courseWareManager', ['ui.router'])
        .config(['$stateProvider', 'HB_WebUploaderProvider', function ($stateProvider, HB_WebUploaderProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.courseWareManager', {
                url: '/courseWareManager',
                sticky: true,
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                },
                views: {
                    'states.courseWareManager@': {
                        templateUrl: '@systemUrl@/views/courseWareManager/courseWareManager-index.html',
                        controller: 'app.courseWareManager.courseWareManagerCtrl'
                    }
                }
            })
                .state('states.courseWareManager.edit', {
                    url: '/edit/:courseWareId/:timeLength/:courseWareName',
                    templateUrl: '@systemUrl@/views/courseWareManager/courseWareManager-edit.html',
                    controller: 'app.courseWareManager.courseWareManagerEditCtrl'
                }).state('states.courseWareManager.add', {
                url: '/add',
                templateUrl: '@systemUrl@/views/courseWareManager/courseWareManager-add.html',
                controller: 'app.courseWareManager.courseWareManagerAddCtrl'
            }).state('states.courseWareManager.view', {
                url: '/view/:courseWareId',
                templateUrl: '@systemUrl@/views/courseWareManager/courseWareManager-view.html',
                controller: 'app.courseWareManager.courseWareManagerViewCtrl'
            }).state('states.courseWareManager.popAdd', {
                url: '/view/popQuestionAdd/:courseWareName/:timeLength/:courseWareId',
                templateUrl: '@systemUrl@/views/courseWareManager/courseWareManager-popAdd.html',
                controller: 'app.courseWareManager.courseWareManagerPopAddCtrl'
            });

        }]);
});
