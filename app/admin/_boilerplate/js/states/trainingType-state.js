/**
 * Created by WDL on 2015/9/23.
 */
define(['angularUiRouter', '@systemUrl@/js/modules/trainingType/main'], function () {
    'use strict';
    return angular
        .module('app.states.trainingType', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.trainingType', {
                url: '/trainingType',
                sticky: true,
                views: {
                    'states.trainingType@': {
                        templateUrl: '@systemUrl@/views/trainingType/trainingType.html',
                        controller: 'app.trainingType.trainingTypeCtrl'
                    }
                }
            });
        });
});
