define(['angularUiRouter', '@systemUrl@/js/modules/courseChooseStatisticAll/main'], function () {
    'use strict';
    return angular.module('app.states.courseChooseStatisticAll', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.courseChooseStatisticAll', {
                url: '/courseChooseStatisticAll',
                sticky: true,
                views: {
                    'states.courseChooseStatisticAll@': {
                        templateUrl: '@systemUrl@/views/courseChooseStatisticAll/courseChooseStatisticAll.html',
                        controller: 'app.courseChooseStatisticAll.courseChooseStatisticAllCtrl'
                    }
                }
            });


        });
});
