define(['angularUiRouter', '@systemUrl@/js/modules/validator/main'], function () {
    'use strict';
    return angular.module('app.states.validator', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.validator', {
            url: '/validator',
            sticky: true,
            views: {
                'states.validator@': {
                    templateUrl: '@systemUrl@/views/validator/validator.html',
                    controller: 'app.validator.validatorCtrl'
                }
            }
        })
            .state('states.validator.edit', {
                url: '/edit',
                views: {
                    '': {
                        template: '<a ui-sref="^.validator">返回edit<input type="text"/></a>'
                    }
                }
            })
            .state('states.validator.release', {
                url: '/release',
                views: {
                    '': {
                        template: '<a ui-sref="states.validator">返回release</a>'
                    }
                }
            });
    });
});
