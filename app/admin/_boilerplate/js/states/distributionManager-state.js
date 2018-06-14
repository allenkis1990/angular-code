define(['angularUiRouter', '@systemUrl@/js/modules/distributionManager/main'], function () {
    'use strict';
    return angular.module('app.states.distributionManager', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.distributionManager', {
            url: '/distributionManager',
            sticky: true,
            views: {
                'states.distributionManager@': {
                    templateUrl: '@systemUrl@/views/distributionManager/distributionManager-index.html',
                    controller: 'app.distributionManager.distributionManagerCtrl'
                }
            }
        });
    });
});
