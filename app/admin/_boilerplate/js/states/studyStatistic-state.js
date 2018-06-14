define(['angularUiRouter', '@systemUrl@/js/modules/studyStatistic/main'], function () {
    'use strict';
    return angular.module('app.states.studyStatistic', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider
            .state('states.studyStatistic', {
                url: '/studyStatistic',
                sticky: true,
                views: {
                    'states.studyStatistic@': {
                        templateUrl: '@systemUrl@/views/studyStatistic/studyStatistic.html',
                        controller: 'app.studyStatistic.index'
                    }
                }
            })
            .state('states.studyStatistic.lessonView', {
                url: '/view/:courseId',
                templateUrl: '@systemUrl@/views/studyStatistic/study-statistic-lesson-view.html',
                controller: 'app.studyStatistic.lessonView'
            });
    });
});
