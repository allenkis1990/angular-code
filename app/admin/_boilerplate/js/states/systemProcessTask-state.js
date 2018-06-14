/**
 * Created by WDL on 2015/9/28.
 */
define(['angularUiRouter', '@systemUrl@/js/modules/systemProcessTask/main'], function () {
    'use strict';
    return angular.module('app.states.systemProcessTask', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.systemProcessTask', {
                url: '/systemProcessTask',
                sticky: true,
                views: {
                    'states.systemProcessTask@': {
                        templateUrl: '@systemUrl@/views/systemProcessTask/systemProcessTask.html',
                        controller: 'app.systemProcessTask.systemProcessTaskCtrl'
                    }
                }
            }).state('states.systemProcessTask.failInfo', {
                url: '/failInfo/:id',
                templateUrl: '@systemUrl@/views/systemProcessTask/failInfo.html',
                controller: 'app.systemProcessTask.viewCtrl'
            });
        });
});
