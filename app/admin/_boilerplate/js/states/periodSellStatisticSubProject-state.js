define(['angularUiRouter', '@systemUrl@/js/modules/periodSellStatisticSubProject/main'], function () {
    'use strict';
    return angular.module('app.states.periodSellStatisticSubProject', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.periodSellStatisticSubProject', {
                url: '/periodSellStatisticSubProject',
                sticky: true,
                views: {
                    'states.periodSellStatisticSubProject@': {
                        templateUrl: '@systemUrl@/views/periodSellStatisticSubProject/periodSellStatistic.html',
                        controller: 'app.periodSellStatisticSubProject.periodSellStatisticCtrl'
                    }
                }
            });


        });
});
