define(['@systemUrl@/js/modules/importClassOpen/main'], function (controllers) {
    'use strict';
    angular.module('app.states.importClassOpen', [])
        .config(['$stateProvider', 'HB_WebUploaderProvider', function ($stateProvider, HB_WebUploaderProvider) {
            $stateProvider
                .state('states.importClassOpen', {
                    url: '/importClassOpen',
                    sticky: true,
                    resolve: {
                        setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUserInfo')
                    },
                    views: {
                        'states.importClassOpen@': {
                            templateUrl: '@systemUrl@/views/importClassOpen/index.html',
                            controller: 'app.importClassOpen.index'
                        }
                    }
                });
        }]);
});
