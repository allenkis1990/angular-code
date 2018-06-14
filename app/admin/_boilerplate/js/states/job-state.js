define(['angularUiRouter', '@systemUrl@/js/modules/job/main'], function () {
    'use strict';
    return angular.module('app.states.job', ['ui.router'])
        .config(function ($stateProvider) {
            $stateProvider
                .state('states.job', {
                    url: '/job',
                    sticky: true,
                    views: {
                        'states.job@': {
                            templateUrl: '@systemUrl@/views/job/job-index.html',
                            controller: 'app.job.index'
                        }
                    }
                })
                .state('states.job.editNew', {
                    url: '/editNew',
                    templateUrl: '@systemUrl@/views/job/job-edit-new.html',
                    controller: 'app.job.editNew'
                })
                .state('states.job.edit', {
                    url: '/edit/:jobId',
                    templateUrl: '@systemUrl@/views/job/job-edit.html',
                    controller: 'app.job.edit'
                });
        });
})
;
