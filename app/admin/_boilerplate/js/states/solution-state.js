define(['angularUiRouter', '@systemUrl@/js/modules/solution/main'], function () {
    'use strict';
    return angular.module('app.states.solution', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider
            .state('states.solution', {
                url: '/solution',
                sticky: true,
                views: {
                    'states.solution@': {
                        templateUrl: '@systemUrl@/views/solution/solution-index.html',
                        controller: 'app.solution.index'
                    }
                }
            })
            .state('states.solution.editNew', {
                url: '/editNew',
                templateUrl: '@systemUrl@/views/solution/solution-edit-new.html',
                controller: 'app.solution.editNew'
            })
            .state('states.solution.view', {
                url: '/view/:solutionId',
                templateUrl: '@systemUrl@/views/solution/solution-view.html',
                controller: 'app.solution.view'
            })
            .state('states.solution.send', {
                url: '/send/:solutionId/:appType',
                templateUrl: '@systemUrl@/views/solution/solution-send.html',
                controller: 'app.solution.send'
            });
    });
});
