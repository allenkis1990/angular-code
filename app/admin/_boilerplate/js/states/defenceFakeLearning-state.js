define(['@systemUrl@/js/modules/defenceFakeLearning/main'], function () {
    'use strict';
    return angular.module('app.states.defenceFakeLearning', []).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.defenceFakeLearning', {
            url: '/defenceFakeLearning',
            sticky: true,
            views: {
                'states.defenceFakeLearning@': {
                    templateUrl: '@systemUrl@/views/defenceFakeLearning/index.html',
                    controller: 'app.defenceFakeLearning.index'
                }
            }
        }).state('states.defenceFakeLearning.add', {
            url: '/add',
            views: {
                '': {
                    templateUrl: '@systemUrl@/views/defenceFakeLearning/add.html',
                    controller: 'app.defenceFakeLearning.add'
                }
            }
        }).state('states.defenceFakeLearning.edit', {
            url: '/edit/:id',
            views: {
                '': {
                    templateUrl: '@systemUrl@/views/defenceFakeLearning/edit.html',
                    controller: 'app.defenceFakeLearning.edit'
                }
            }
        }).state('states.defenceFakeLearning.detail', {
            url: '/detail/:id',
            views: {
                '': {
                    templateUrl: '@systemUrl@/views/defenceFakeLearning/detail.html',
                    controller: 'app.defenceFakeLearning.detail'
                }
            }
        });
    });
});
