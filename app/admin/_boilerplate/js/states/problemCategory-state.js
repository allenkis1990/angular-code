define(['@systemUrl@/js/modules/problemCategory/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.problemCategory', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.problemCategory', {
            url: '/problemCategory',
            sticky: true,
            views: {
                'states.problemCategory@': {
                    templateUrl: '@systemUrl@/views/problemCategory/index.html',
                    controller: 'app.admin.states.problemCategory.indexCtrl'
                }
            }
        });
    }]);
});