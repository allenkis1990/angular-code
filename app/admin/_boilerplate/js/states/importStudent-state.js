define(['angularUiRouter', '@systemUrl@/js/modules/importStudent/main'], function () {
    'use strict';
    return angular.module('app.states.importStudent', ['ui.router']).config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, HB_WebUploaderProvider) {
        $stateProvider
            .state('states.importStudent', {
                url: '/importStudent',
                sticky: true,
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                },
                views: {
                    'states.importStudent@': {
                        templateUrl: '@systemUrl@/views/importStudent/importStudent-index.html',
                        controller: 'app.importStudent.importStudentCtrl'
                    }
                }
            });
    });
});
