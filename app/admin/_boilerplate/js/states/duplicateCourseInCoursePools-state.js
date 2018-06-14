define(['@systemUrl@/js/modules/duplicateCourseInCoursePools/main'], function (controllers) {
    'use strict';
    angular.module('app.states.duplicateCourseInCoursePools', []).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('states.duplicateCourseInCoursePools', {
            url: '/duplicateCourseInCoursePools?jsonObj',
            sticky: true,
            unListed: true,
            title: '重复课程清单',
            views: {
                'states.duplicateCourseInCoursePools@': {
                    templateUrl: '@systemUrl@/views/duplicateCourseInCoursePools/index.html',
                    controller: 'app.admin.states.duplicateCourseInCoursePools.indexCtrl'
                }
            }
        });
    }]);
});