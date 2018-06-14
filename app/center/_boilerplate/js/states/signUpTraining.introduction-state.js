define(['angularUiRouter', '@systemUrl@/js/modules/signUpTraining/introduction/main'], function () {
    'use strict';
    return angular.module('app.states.introduction', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.signUpTraining.introduction', {
            url: '/introduction/:id',
            sticky: true,
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/signUpTraining/introduction/introduction.html',
                    controller: 'app.introduction.introductionCtrl'
                }
            }
        });
    });
});
