define(['@systemUrl@/js/modules/testResult/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.testResult', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.testResult', {
            url: '/testResult/:id',
            views: {
                'topView@': {
                    template: ''
                },
                'contentView@': {
                    templateUrl: '@systemUrl@/views/testResult/index.html',
                    controller: 'app.center.states.testResult.indexCtrl'
                }
            }
        });
    }]);
});