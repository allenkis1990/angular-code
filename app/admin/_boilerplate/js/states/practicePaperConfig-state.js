define(['angularUiRouter', '@systemUrl@/js/modules/practicePaperConfig/main'], function () {
    'use strict';
    return angular.module('app.states.practicePaperConfig', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.practicePaperConfig', {
                url: '/practicePaperConfig',
                sticky: true,
                views: {
                    'states.practicePaperConfig@': {
                        templateUrl: '@systemUrl@/views/exam/practice-paper-index.html',
                        controller: 'app.practicePaperConfig.paperCtrl'
                    }
                }
            }).state('states.practicePaperConfig.add', {
                url: '/add',
                templateUrl: '@systemUrl@/views/exam/practice-paper-add-step1.html',
                controller: 'app.practicePaperConfig.addCtrl'
            })
                .state('states.practicePaperConfig.addStep3', {
                    url: '/addStep3/:id/:name/:totalScore/:passScore/:timeLength',
                    templateUrl: '@systemUrl@/views/exam/practice-paper-add-step3.html',
                    controller: 'app.practicePaperConfig.addStep3Ctrl'
                })
                .state('states.practicePaperConfig.edit', {
                    url: '/edit/:id/:configType',
                    templateUrl: '@systemUrl@/views/exam/practice-paper-edit.html',
                    controller: 'app.practicePaperConfig.editCtrl'
                })
                .state('states.practicePaperConfig.release', {
                    url: '/release/:id/:name/:totalScore/:passScore/:timeLength/:examRange/:comeForm',
                    templateUrl: '@systemUrl@/views/exam/practice-paper-release.html',
                    controller: 'app.practicePaperConfig.releaseCtrl'
                })
                .state('states.practicePaperConfig.continue', {
                    url: '/continue/:comeForm',
                    templateUrl: '@systemUrl@/views/exam/practice-paper-continue.html',
                    controller: 'app.practicePaperConfig.continueCtrl'
                });
        });
});
