define(['angularUiRouter', '@systemUrl@/js/modules/learningTimeStatistic/main'], function () {
    'use strict';
    return angular.module('app.states.learningTimeStatistic', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.learningTimeStatistic', {
            url: '/learningTimeStatistic',
            sticky: true,
            views: {
                'states.learningTimeStatistic@': {
                    templateUrl: '@systemUrl@/views/learningTimeStatistic/learningTimeStatistic.html',
                    controller: 'app.learningTimeStatistic.learningTimeStatisticCtrl'
                }
            }
        });
    });
});
