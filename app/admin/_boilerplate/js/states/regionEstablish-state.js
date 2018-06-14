define(['@systemUrl@/js/modules/summary/regionEstablish/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.regionEstablish', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.regionEstablish', {
            url: '/regionEstablish',
            sticky: true,
            views: {
                'states.regionEstablish@': {
                    templateUrl: '@systemUrl@/views/summary/regionEstablish/index.html',
                    controller: 'app.admin.states.regionEstablish.indexCtrl'
                }
            }
        });
    }]);
});