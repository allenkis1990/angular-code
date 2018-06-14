define(['angularUiRouter', '@systemUrl@/js/modules/infoContent/main'], function () {
    'use strict';
    return angular.module('app.states.infoContent', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, HB_WebUploaderProvider) {
        $stateProvider.state('states.infoContent', {
            url: '/infoContent/:unitId/:categoryType/:categoryName',
            sticky: true,
            views: {
                'states.infoContent@': {
                    templateUrl: '@systemUrl@/views/infoContent/infoContent.html',
                    controller: 'app.infoContent.infoContentCtrl'
                }
            }
        }).state('states.infoContent.view', {
            url: '/view/:id',
            templateUrl: '@systemUrl@/views/infoContent/view.html',
            controller: 'app.infoContent.viewCtrl'
        }).state('states.infoContent.add', {
            url: '/add',
            resolve: {
                setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
            },
            templateUrl: '@systemUrl@/views/infoContent/add.html',
            controller: 'app.infoContent.addCtrl'
        }).state('states.infoContent.edit', {
            url: '/edit/:id',
            templateUrl: '@systemUrl@/views/infoContent/edit.html',
            controller: 'app.infoContent.editCtrl'
        }).state('states.infoContent.publish', {
            url: '/publish/:id',
            templateUrl: '@systemUrl@/views/infoContent/publish.html',
            controller: 'app.infoContent.publishCtrl'
        });
    });
});