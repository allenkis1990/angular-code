define(['angularUiRouter', '@systemUrl@/js/modules/trainClassManage/main'], function () {
    'use strict';
    return angular.module('app.states.trainClassManage', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.trainClassManage', {
                url: '/trainClassManage',
                sticky: true,
                views: {
                    'states.trainClassManage@': {
                        templateUrl: '@systemUrl@/views/trainClassManage/trainClassManage-index.html',
                        controller: 'app.trainClassManage.trainClassManagerCtrl'
                    }
                }
            }).state('states.trainClassManage.add', {
                url: '/add',
                templateUrl: '@systemUrl@/views/trainClassManage/trainClassManageAdd.html',
                controller: 'app.trainClassManage.trainClassManagerAddCtrl'
            }).state('states.trainClassManage.selectTrainingObject', {
                url: '/selectTrainingObject/:trnId',
                templateUrl: '@systemUrl@/views/trainClassManage/selectTrainingObject.html',
                controller: 'app.trainClassManage.trainClassManageSelectObjectCtrl'
            }).state('states.trainClassManage.view', {
                url: '/view/:trnId',
                templateUrl: '@systemUrl@/views/trainClassManage/trainClassManageView.html',
                controller: 'app.trainClassManage.trainClassManagerViewCtrl'
            }).state('states.trainClassManage.edit', {
                url: '/edit/:trnId',
                templateUrl: '@systemUrl@/views/trainClassManage/trainClassManageEdit.html',
                controller: 'app.trainClassManage.trainClassManagerEditCtrl'
            }).state('states.trainClassManage.manage', {
                url: '/manage/:id/:name',
                templateUrl: '@systemUrl@/views/trainClassManage/manage/manage.html',
                controller: 'app.trainClassManage.trainClassManageManageCtrl'
            });
        });
});
