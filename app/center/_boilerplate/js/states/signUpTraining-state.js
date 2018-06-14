define(['angularUiRouter', '@systemUrl@/js/modules/signUpTraining/main', '@systemUrl@/js/modules/signUpTraining/introduction/main'], function () {
    'use strict';
    return angular.module('app.states.signUpTraining', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.signUpTraining', {
            url: '/signUpTraining',
            //sticky: true,
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/signUpTraining/signUpTraining.html',
                    controller: 'app.signUpTraining.signUpTrainingCtrl'
                }
            }
        }).state('states.signUpTraining.introduction', {
            url: '/introduction/:commoditySkuId/:coursePoolId/:courseId/:fromWhere',
            //sticky: true,
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/signUpTraining/introduction/introduction.html',
                    controller: 'app.introduction.introductionCtrl'
                }
            }
        });
    });
});
