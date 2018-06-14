define(['angularUiRouter', '@systemUrl@/js/modules/logonStatistic/main'], function () {
    'use strict';
    return angular.module('app.states.logonStatistic', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider
            .state('states.logonStatistic', {
                url: '/logonStatistic',
                sticky: true,
                views: {
                    'states.logonStatistic@': {
                        templateUrl: '@systemUrl@/views/logonStatistic/logon-statistic-index.html',
                        controller: 'app.logonStatistic.index'
                    }
                }
            });
    });
});
