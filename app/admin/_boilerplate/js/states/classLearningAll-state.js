define(['@systemUrl@/js/modules/summary/classLearningAll/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.classLearningAll', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.classLearningAll', {
            url: '/classLearningAll',
            sticky: true,
            views: {
                'states.classLearningAll@': {
                    templateUrl: '@systemUrl@/views/summary/classLearningAll/index.html',
                    controller: 'app.admin.states.classLearningAll.indexCtrl'
                }
            }
        });
    }]);
});