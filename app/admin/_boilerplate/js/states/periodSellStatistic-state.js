define(['angularUiRouter', '@systemUrl@/js/modules/periodSellStatistic/main'], function () {
    'use strict';
    return angular.module('app.states.periodSellStatistic', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.periodSellStatistic', {
                url: '/periodSellStatistic',
                sticky: true,
                views: {
                    'states.periodSellStatistic@': {
                        templateUrl: '@systemUrl@/views/periodSellStatistic/periodSellStatistic.html',
                        controller: 'app.periodSellStatistic.periodSellStatisticCtrl'
                    }
                }
            });


        });
});
