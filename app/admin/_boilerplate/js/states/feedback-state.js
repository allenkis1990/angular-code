define(['angularUiRouter', '@systemUrl@/js/modules/feedback/main'], function () {
    'use strict';
    return angular.module('app.states.feedback', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.feedback', {
                url: '/feedback',
                sticky: true,
                views: {
                    'states.feedback@': {
                        templateUrl: '@systemUrl@/views/feedback/feedback-index.html',
                        controller: 'app.feedback.feedbackCtrl'
                    }
                }
            })
                .state('states.feedback.feedbackReplied', {
                    url: '/feedbackReplied/:id',
                    templateUrl: '@systemUrl@/views/feedback/feedbackReplied.html',
                    controller: 'app.feedback.viewController'
                }).state('states.feedback.feedbackUnreply', {
                url: '/feedbackUnreply/:id',
                templateUrl: '@systemUrl@/views/feedback/feedbackUnreply.html',
                controller: 'app.feedback.editController'
            });
        });
});
