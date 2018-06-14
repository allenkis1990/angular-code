define(['kccs/kccsv2/js/modules/registration/main'], function () {
    'use strict';
    angular.module('app.front.states.accountant.registration', [])
        .config(['$stateProvider', 'HB_WebUploaderProvider', function ($stateProvider, HB_WebUploaderProvider) {
            $stateProvider.state('states.accountant.registration', {
                url: '/accountant.registration',
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                },
                views: {
                    'contentView@': {
                        templateUrl: 'kccs/kccsv2/views/registration/registration.html',
                        controller: 'registrationCtrl'
                    }
                }
            });
        }]);
});
