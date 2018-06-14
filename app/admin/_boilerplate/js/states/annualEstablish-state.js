define(['@systemUrl@/js/modules/summary/annualEstablish/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.annualEstablish', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.annualEstablish', {
            url: '/annualEstablish',
            sticky: true,
            views: {
                'states.annualEstablish@': {
                    templateUrl: '@systemUrl@/views/summary/annualEstablish/index.html',
                    controller: 'app.admin.states.annualEstablish.indexCtrl'
                }
            }
        });
    }]);
});