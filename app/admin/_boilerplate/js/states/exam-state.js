define(['angularUiRouter', '@systemUrl@/js/modules/exam/main'], function () {
    'use strict';
    return angular.module('app.states.exam', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.exam', {
                url: '/exam',
                sticky: true,
                views: {
                    'states.exam@': {
                        templateUrl: '@systemUrl@/views/exam/exam.html',
                        controller: 'app.exam.examCtrl'
                    }
                }
            }).state('states.exam.answerPaper', {
                url: '/answerPaper/:id',
                templateUrl: '@systemUrl@/views/exam/answerPaper.html',
                controller: 'app.exam.answerPaperCtrl'
            }).state('states.exam.release', {
                url: '/release/:examRange/:comeForm',
                templateUrl: '@systemUrl@/views/exam/paper-release.html',
                controller: 'app.exam.releaseCtrl'
            })
                .state('states.exam.continue', {
                    url: '/continue/:comeForm',
                    templateUrl: '@systemUrl@/views/exam/paper-continue.html',
                    controller: 'app.exam.continueCtrl'
                });
        });
});
