define(['angularUiRouter', '@systemUrl@/js/modules/coursePoolRuleManager/main'], function () {
    'use strict';
    return angular.module('app.states.coursePoolRuleManager', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.coursePoolRuleManager', {
            url: '/coursePoolRuleManager',
            sticky: true,
            views: {
                'states.coursePoolRuleManager@': {
                    templateUrl: '@systemUrl@/views/coursePoolRuleManager/coursePoolRuleManager-index.html',
                    controller: 'app.coursePoolRuleManager.coursePoolRuleManagerCtrl'
                }
            }
        }).state('states.coursePoolRuleManager.edit', {
            url: '/edit/:ruleId',
            templateUrl: '@systemUrl@/views/coursePoolRuleManager/coursePoolRuleManager-edit.html',
            controller: 'app.coursePoolRuleManager.coursePoolRuleManagerEditCtrl'
        }).state('states.coursePoolRuleManager.add', {
            url: '/add',
            templateUrl: '@systemUrl@/views/coursePoolRuleManager/coursePoolRuleManager-add.html',
            controller: 'app.coursePoolRuleManager.coursePoolRuleManagerAddCtrl'
        }).state('states.coursePoolRuleManager.view', {
            url: '/view/:ruleId',
            templateUrl: '@systemUrl@/views/coursePoolRuleManager/coursePoolRuleManager-view.html',
            controller: 'app.coursePoolRuleManager.coursePoolRuleManagerViewCtrl'
        });
    });
});
