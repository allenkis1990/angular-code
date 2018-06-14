define(['@systemUrl@/js/modules/summary/courseSelect/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.courseSelect', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.courseSelect', {
            url: '/courseSelect',
            sticky: true,
            views: {
                'states.courseSelect@': {
                    templateUrl: '@systemUrl@/views/summary/courseSelect/index.html',
                    controller: 'app.admin.states.courseSelect.indexCtrl'
                }
            }
        });
    }]);
});