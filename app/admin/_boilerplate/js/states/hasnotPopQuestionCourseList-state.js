define(['@systemUrl@/js/modules/hasnotPopQuestionCourseList/main'], function (controllers) {
    'use strict';
    angular.module('app.states.hasnotPopQuestionCourseList', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.hasnotPopQuestionCourseList', {
            url: '/hasnotPopQuestionCourseList/:ruleId/:poolId',
            sticky: true,
            unListed: true,
            title: '课程清单',
            views: {
                'states.hasnotPopQuestionCourseList@': {
                    templateUrl: '@systemUrl@/views/hasnotPopQuestionCourseList/index.html',
                    controller: 'app.admin.states.hasnotPopQuestionCourseList.indexCtrl'
                }
            }
        });
    }]);
});