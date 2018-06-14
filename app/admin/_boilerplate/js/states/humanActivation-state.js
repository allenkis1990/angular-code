define(['@systemUrl@/js/modules/summary/humanActivation/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.humanActivation', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.humanActivation', {
            url: '/humanActivation',
            sticky: true,
            views: {
                'states.humanActivation@': {
                    templateUrl: '@systemUrl@/views/summary/humanActivation/index.html',
                    controller: 'app.admin.states.humanActivation.indexCtrl'
                }
            }
        });
    }]);
});