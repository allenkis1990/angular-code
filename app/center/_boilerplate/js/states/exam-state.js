define(['@systemUrl@/js/modules/exam/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.exam', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.exam', {
            url: '/exam/:trainClassId',
            views: {
                'contentView@': {
                    templateUrl: '@systemUrl@/views/exam/history-practice.html',
                    controller: 'app.center.states.exam.indexCtrl'
                }
            }
        });
    }]);
});