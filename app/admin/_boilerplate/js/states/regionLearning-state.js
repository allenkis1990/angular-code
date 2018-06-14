define(['@systemUrl@/js/modules/summary/regionLearning/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.regionLearning', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.regionLearning', {
            url: '/regionLearning',
            sticky: true,
            views: {
                'states.regionLearning@': {
                    templateUrl: '@systemUrl@/views/summary/regionLearning/index.html',
                    controller: 'app.admin.states.regionLearning.indexCtrl'
                }
            }
        });
    }]);
});