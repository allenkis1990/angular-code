define(['angularUiRouter', '@systemUrl@/js/modules/selectCourseCenter/main'], function () {
    'use strict';
    return angular.module('app.states.selectCourseCenter', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.selectCourseCenter', {
            url: '/selectCourseCenter',
            sticky: true,
            views: {
                'states.selectCourseCenter@': {
                    templateUrl: '@systemUrl@/views/selectCourseCenter/selectCourseCenter-index.html',
                    controller: 'app.selectCourseCenter.selectCourseCenterCtrl'
                }
            }
        }).state('states.selectCourseCenter.view', {
            url: '/view/:courseId',
            templateUrl: '@systemUrl@/views/selectCourseCenter/selectCourseCenter-view.html',
            controller: 'app.selectCourseCenter.selectCourseCenterViewCtrl'
        })
            .state('states.selectCourseCenter.add', {
                url: '/add',
                templateUrl: '@systemUrl@/views/selectCourseCenter/addInfo.html',
                controller: 'app.selectCourseCenter.selectCourseCenterAddCtrl'
            }).state('states.selectCourseCenter.addPageView', {
            url: '/addPageView/:courseId',
            templateUrl: '@systemUrl@/views/selectCourseCenter/selectCourseCenterAddPage-view.html',
            controller: 'app.selectCourseCenter.selectCourseCenterAddPageViewCtrl'
        });
    });
});
