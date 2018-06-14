define(['angularUiRouter', '@systemUrl@/js/modules/creditStatistics/main'], function () {
    'use strict';
    return angular.module('app.states.creditStatistics', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.creditStatistics', {
            url: '/creditStatistics',
            sticky: true,
            views: {
                'states.creditStatistics@': {
                    templateUrl: '@systemUrl@/views/creditStatistics/creditStatistics-index.html',
                    controller: 'app.creditStatistics.creditStatisticsCtrl'
                }
            }
        }).state('states.creditStatistics.detail', {
            url: '/detail/:organizationId/:organizationName/:startTime/:endTime/:statisticBeginTime/:statisticEndTime/:totalCredit',
            templateUrl: '@systemUrl@/views/creditStatistics/creditStatisticsDetail.html',
            controller: 'app.creditStatistics.creditStatisticsDetailCtrl'
        });
    });
});
