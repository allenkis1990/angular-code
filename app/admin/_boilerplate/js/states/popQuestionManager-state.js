define(['@systemUrl@/js/modules/popQuestionManager/main'], function (controllers) {
    'use strict';
    angular.module('app.states.popQuestionManager', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.popQuestionManager', {
            url: '/popQuestionManager/:courseWareId/:courseWareName',
            sticky: true,
            views: {
                'states.popQuestionManager@': {
                    templateUrl: '@systemUrl@/views/popQuestionManager/popQuestionManager-index.html',
                    controller: 'app.popQuestionManager.popQuestionManagerCtrl'
                }
            }
        }).state('states.popQuestionManager.edit', {
            url: '/edit/:questionId/:questionType/:popQuestionId',
            templateUrl: '@systemUrl@/views/popQuestionManager/popQuestionManager-edit.html',
            controller: 'app.popQuestionManager.popQuestionManagerEditCtrl'
        });
    }]);
});