define(['angularUiRouter', '@systemUrl@/js/modules/courseChooseStatistic/main'], function () {
    'use strict';
    return angular.module('app.states.courseChooseStatistic', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.courseChooseStatistic', {
                url: '/courseChooseStatistic',
                sticky: true,
                views: {
                    'states.courseChooseStatistic@': {
                        templateUrl: '@systemUrl@/views/courseChooseStatistic/courseChooseStatistic.html',
                        controller: 'app.courseChooseStatistic.courseChooseStatisticCtrl'
                    }
                }
            });


        });
});
