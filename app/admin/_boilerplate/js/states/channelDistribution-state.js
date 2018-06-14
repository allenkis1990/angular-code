define(['angularUiRouter', '@systemUrl@/js/modules/channelDistribution/main'], function () {
    'use strict';
    return angular.module('app.states.channelDistribution', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.channelDistribution', {
                url: '/channelDistribution',
                sticky: true,
                views: {
                    'states.channelDistribution@': {
                        templateUrl: '@systemUrl@/views/channelDistribution/channelDistribution.html',
                        controller: 'app.channelDistribution.channelDistributionCtrl'
                    }
                }
            });
        });
});
