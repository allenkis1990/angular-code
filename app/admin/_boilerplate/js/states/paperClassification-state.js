define(['angularUiRouter', '@systemUrl@/js/modules/paperClassification/main'], function () {
    'use strict';
    return angular.module('app.states.paperClassification', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.paperClassification', {
            url: '/paperClassification/:id',
            sticky: true,
            views: {
                'states.paperClassification@': {
                    templateUrl: '@systemUrl@/views/exam/paper-type.html',
                    controller: 'app.paperClassification.paperTypeCtrl'
                }
            }
        });
    });
});
