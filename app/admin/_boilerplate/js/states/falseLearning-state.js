define(['angularUiRouter', '@systemUrl@/js/modules/falseLearning/main'], function () {
    'use strict';
    return angular.module('app.states.falseLearning', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.falseLearning', {
            url: '/falseLearning',
            sticky: true,
            views: {
                'states.falseLearning@': {
                    templateUrl: '@systemUrl@/views/falseLearning/falseLearning.html',
                    controller: 'app.falseLearning.falseLearningCtrl'
                }
            }
        });
    });
});
