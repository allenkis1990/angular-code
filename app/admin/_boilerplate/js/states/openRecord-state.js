define(['@systemUrl@/js/modules/openRecord/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.openRecord', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.openRecord', {
            url: '/openRecord',
            sticky: true,
            views: {
                'states.openRecord@': {
                    templateUrl: '@systemUrl@/views/openRecord/index.html',
                    controller: 'app.admin.states.openRecord.indexCtrl'
                }
            }
        });
    }]);
});