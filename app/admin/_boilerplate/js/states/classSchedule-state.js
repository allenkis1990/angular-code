define(['angularUiRouter', '@systemUrl@/js/modules/classSchedule/main'], function () {
    'use strict';
    return angular.module('app.states.classSchedule', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, HB_WebUploaderProvider) {
        $stateProvider.state('states.classSchedule', {
            url: '/classSchedule',
            sticky: true,
            resolve: {
                setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
            },
            views: {
                'states.classSchedule@': {
                    templateUrl: '@systemUrl@/views/classSchedule/index.html',
                    controller: 'app.classSchedule.indexCtrl'
                }
            }
        }).state('states.classSchedule.detail', {
            url: '/detail/:id',
            views: {
                'states.classSchedule@': {
                    templateUrl: '@systemUrl@/views/classSchedule/detail.html',
                    controller: 'app.classSchedule.detailCtrl'
                }
            }
        }).state('states.classSchedule.add', {
            url: '/add',
            views: {
                'states.classSchedule@': {
                    templateUrl: '@systemUrl@/views/classSchedule/add.html',
                    controller: 'app.classSchedule.addCtrl'
                }
            }
        }).state('states.classSchedule.edit', {
            url: '/edit/:id',
            views: {
                'states.classSchedule@': {
                    templateUrl: '@systemUrl@/views/classSchedule/edit.html',
                    controller: 'app.classSchedule.editCtrl'
                }
            }
        });
    });
});