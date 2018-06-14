define(['@systemUrl@/js/modules/summary/faceToFaceClassLearning/main'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.faceToFaceClassLearning', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.faceToFaceClassLearning', {
            url: '/faceToFaceClassLearning',
            sticky: true,
            views: {
                'states.faceToFaceClassLearning@': {
                    templateUrl: '@systemUrl@/views/summary/faceToFaceClassLearning/index.html',
                    controller: 'app.admin.states.faceToFaceClassLearning.indexCtrl'
                }
            }
        });
    }]);
});