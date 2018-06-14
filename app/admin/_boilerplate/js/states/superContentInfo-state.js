define(['angularUiRouter', '@systemUrl@/js/modules/superContentInfo/main'], function () {
    'use strict';
    return angular.module('app.states.superContentInfo', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider,HB_WebUploaderProvider) {
        $stateProvider.state('states.superContentInfo', {
            url: '/superContentInfo/:categoryType/:categoryName',
            sticky: true,
            views: {
                'states.superContentInfo@': {
                    templateUrl: '@systemUrl@/views/superContentInfo/superContentInfo.html',
                    controller: 'app.superContentInfo.superContentInfoCtrl'
                }
            }
        }).state('states.superContentInfo.view', {
            url: '/view/:id',
            templateUrl: '@systemUrl@/views/superContentInfo/view.html',
            controller: 'app.superContentInfo.viewCtrl'
        }).state('states.superContentInfo.add', {
            url: '/add',
            resolve: {
                setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
            },
            templateUrl: '@systemUrl@/views/superContentInfo/add.html',
            controller: 'app.superContentInfo.addCtrl'
        }).state('states.superContentInfo.edit', {
            url: '/edit/:id',
            templateUrl: '@systemUrl@/views/superContentInfo/edit.html',
            controller: 'app.superContentInfo.editCtrl'
        }).state('states.superContentInfo.publish', {
            url: '/publish/:id',
            templateUrl: '@systemUrl@/views/superContentInfo/publish.html',
            controller: 'app.superContentInfo.publishCtrl'
        });
    });
});