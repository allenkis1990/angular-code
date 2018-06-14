define(['@systemUrl@/js/modules/siteOpening/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.siteOpening', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.siteOpening', {
            url: '/siteOpening',
            sticky: true,
            views: {
                'states.siteOpening@': {
                    templateUrl: '@systemUrl@/views/siteOpening/index.html',
                    controller: 'app.admin.states.siteOpening.indexCtrl'
                }
            }
        });
    }]);
});