/**
 * Created by temp on 2016/9/19.
 */
define(['angularUiRouter', '@systemUrl@/js/modules/player/main'], function () {
    'use strict';
    return angular
        .module('app.states.player', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.player', {}).state('states.player.courseWarePlayer', {
                url: '/courseWarePlayer/:courseWareId/:playType',
                sticky: true,
                views: {
                    'states.player@': {
                        templateUrl: '@systemUrl@/views/player/courseWarePlayer.html',
                        controller: 'app.player.courseWarePlayerCtrl'
                    }
                }
            }).state('states.player.coursePlayer', {
                url: '/coursePlayer/:courseId/:courseWareId/:playType',
                sticky: false,
                views: {
                    'states.player@': {
                        templateUrl: '@systemUrl@/views/player/coursePlayer.html',
                        controller: 'app.player.coursePlayerCtrl'
                    }
                }
            });
        });
});
