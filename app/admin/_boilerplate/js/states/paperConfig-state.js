define(['angularUiRouter', '@systemUrl@/js/modules/paperConfig/main'], function () {
    'use strict';
    return angular.module('app.states.paperConfig', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.paperConfig', {
                url: '/paperConfig',
                sticky: true,
                views: {
                    'states.paperConfig@': {
                        templateUrl: '@systemUrl@/views/exam/paper-index.html',
                        controller: 'app.paperConfig.paperCtrl'
                    }
                }
            }).state('states.paperConfig.add', {
                url: '/add',
                templateUrl: '@systemUrl@/views/exam/paper-add-step1.html',
                controller: 'app.paperConfig.addCtrl'
            })
                .state('states.paperConfig.addStep3', {
                    url: '/addStep3/:id/:name/:totalScore/:passScore/:timeLength',
                    templateUrl: '@systemUrl@/views/exam/paper-add-step3.html',
                    controller: 'app.paperConfig.addStep3Ctrl'
                })
                .state('states.paperConfig.edit', {
                    url: '/edit/:id/:configType',
                    templateUrl: '@systemUrl@/views/exam/paper-edit.html',
                    controller: 'app.paperConfig.editCtrl'
                })
                .state('states.paperConfig.release', {
                    url: '/release/:id/:name/:totalScore/:passScore/:timeLength/:examRange/:comeForm',
                    templateUrl: '@systemUrl@/views/exam/paper-release.html',
                    controller: 'app.paperConfig.releaseCtrl'
                })
                .state('states.paperConfig.continue', {
                    url: '/continue/:comeForm',
                    templateUrl: '@systemUrl@/views/exam/paper-continue.html',
                    controller: 'app.paperConfig.continueCtrl'
                });
        });
});
