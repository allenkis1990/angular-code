define(['@systemUrl@/js/modules/accountSetting/main'], function (controllers) {
    'use strict';
    angular.module('app.center.states.accountSetting', [])
        .config(['$stateProvider', 'HB_WebUploaderProvider', function ($stateProvider, HB_WebUploaderProvider) {
            $stateProvider.state('states.accountSetting', {
                url: '/accountSetting',
                resolve: {
                    setResource: HB_WebUploaderProvider.setResourceInfo('/web/login/login/getUploadPath')
                },
                views: {
                    'contentView@': {
                        templateUrl: '@systemUrl@/views/accountSetting/index.html',
                        controller: 'app.center.states.accountSetting.indexCtrl'
                    }
                }
            });

        }]);

});