define(['angularUiRouter', '@systemUrl@/js/modules/certifiedTemplate/main'], function () {
    'use strict';
    return angular.module('app.states.certifiedTemplate', ['ui.router']).config(
        function ($stateProvider) {
            $stateProvider.state('states.certifiedTemplate', {
                url: '/certifiedTemplate',
                sticky: true,
                views: {
                    'states.certifiedTemplate@': {
                        templateUrl: '@systemUrl@/views/certifiedTemplate/certifiedTemplate.html',
                        controller: 'app.certifiedTemplate.certifiedTemplateCtrl'
                    }
                }
            });
        });
});
