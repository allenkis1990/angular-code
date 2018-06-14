define(['@systemUrl@/js/modules/home/main'], function () {
    'use strict'
    angular.module('app.states.index', [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('states.index', {
                url: '/index',
                views: {
                    'content@': {
                        templateUrl: '@systemUrl@/views/content.html'
                    },
                    'loginForm@states.index': {
                        templateUrl: '@systemUrl@/views/loginForm.html',
                        controller: 'app.index.loginCtrl'
                    }
                }
            })
        }])
})
