define(['angularUiRouter', '@systemUrl@/js/modules/questionLibrary/main'], function () {
    'use strict';
    return angular.module('app.states.library', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $stateProvider.state('states.questionLibrary', {
            url: '/questionLibrary/:newlibray',
            sticky: true,
            views: {
                'states.questionLibrary@': {
                    templateUrl: '@systemUrl@/views/exam/question-library.html',
                    controller: 'app.library.questionLibraryCtrl'
                }
            }
        });
    });
});
