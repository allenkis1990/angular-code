define(['@systemUrl@/js/modules/summary/classLearning/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classLearning', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.classLearning', {
            url: '/classLearning',
            sticky: true,
            views: {
                'states.classLearning@': {
                    templateUrl: '@systemUrl@/views/summary/classLearning/index.html',
                    controller: 'app.admin.states.classLearning.indexCtrl'
                }
            }
        });
    }]);
});