define(['angularUiRouter', '@systemUrl@/js/modules/areaPeriodLearnStatistic/main'], function () {
    'use strict';
    return angular.module('app.states.areaPeriodLearnStatistic', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.areaPeriodLearnStatistic', {
                url: '/areaPeriodLearnStatistic',
                sticky: true,
                views: {
                    'states.areaPeriodLearnStatistic@': {
                        templateUrl: '@systemUrl@/views/areaPeriodLearnStatistic/areaPeriodLearnStatistic.html',
                        controller: 'app.areaPeriodLearnStatistic.areaPeriodLearnStatisticCtrl'
                    }
                }
            });


        });
});
