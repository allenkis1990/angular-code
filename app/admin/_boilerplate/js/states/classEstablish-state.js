define(['@systemUrl@/js/modules/summary/classEstablish/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classEstablish', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.classEstablish', {
            url: '/classEstablish',
            sticky: true,
            views: {
                'states.classEstablish@': {
                    templateUrl: '@systemUrl@/views/summary/classEstablish/index.html',
                    controller: 'app.admin.states.classEstablish.indexCtrl'
                }
            }
        });
    }]);
});