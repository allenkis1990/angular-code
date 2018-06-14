define(['@systemUrl@/js/modules/accountSetting/controllers/accountSetting-ctrl',
    '@systemUrl@/js/modules/accountSetting/services/accountSetting-service',
    'prometheus/modules/uploader'], function (controllers, accountSettingService) {
    'use strict';
    angular.module('app.center.states.accountSetting.main', ['hb.webUploader'])
        .controller('app.center.states.accountSetting.indexCtrl', controllers.indexCtrl)
        .factory('accountSettingService', accountSettingService)
        .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
            if ($rootScope.uploadConfigOptions) {
                $rootScope.$broadcast('events:loadBasicDataSuccess', $rootScope.uploadConfigOptions);
            } else {
                hbBasicData.getUserInfo().then(function (data) {
                    $rootScope.$broadcast('events:loadBasicDataSuccess', data);
                });
            }
        }]);
});