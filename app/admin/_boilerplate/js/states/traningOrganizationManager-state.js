define(['angularUiRouter', '@systemUrl@/js/modules/traningOrganizationManager/main'], function () {
    'use strict';
    return angular.module('app.states.traningOrganizationManager',
        ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.traningOrganizationManager', {
            url: '/traningOrganizationManager',
            sticky: true,
            views: {
                'states.traningOrganizationManager@': {
                    templateUrl: '@systemUrl@/views/traningOrganizationManager/traningOrganizationManager.html',
                    controller: 'app.traningOrganizationManager.traningOrganizationManagerCtrl'
                }
            }
        }).state('states.traningOrganizationManager.add', {
                url: '/add',
                views: {
                    'states.traningOrganizationManager@': {
                        templateUrl: '@systemUrl@/views/traningOrganizationManager/traningOrganizationManager-add.html',
                        controller: 'app.traningOrganizationManager.traningOrganizationManagerAddCtrl'
                    }
                }

            });
    });
});
