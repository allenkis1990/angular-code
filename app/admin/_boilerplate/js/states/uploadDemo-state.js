define(['angularUiRouter', '@systemUrl@/js/modules/uploadDemo/main'], function () {
    'use strict';
    return angular.module('app.states.uploadDemo', ['ui.router'])
        .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
            $stateProvider.state('states.uploadDemo', {
                url: '/uploadDemo',
                sticky: true,
                title: '例子',
                unListed: true,
                views: {
                    'states.uploadDemo@': {
                        templateUrl: '@systemUrl@/views/uploadDemo/uploadDemo.html',
                        controller: 'app.uploadDemo.uploadDemoCtrl'
                    }
                }
            });
        });
});
