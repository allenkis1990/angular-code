define(['angularUiRouter', '@systemUrl@/js/modules/examStatistics/main'], function () {
    'use strict';
    return angular.module('app.states.examStatistics', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.examStatistics', {
            url: '/examStatistics',
            sticky: true,
            views: {
                'states.examStatistics@': {
                    templateUrl: '@systemUrl@/views/examStatistics/examStatistics.html',
                    controller: 'app.examStatistics.examStatisticsCtrl'
                }
            }
        });
    });
});
