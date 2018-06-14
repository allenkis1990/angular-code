define(['@systemUrl@/js/modules/goodsManager/authorizedView/controllers/authorizedView-ctrl',
    '@systemUrl@/js/modules/goodsManager/services/goodsManager-service', 'common/hbWebUploader'],
    function (controllers, goodsManagerService) {
        'use strict';
        angular.module('app.admin.states.authorizedView.main', ['hb.webUploader'])

            .controller('app.admin.states.authorizedView.indexCtrl', controllers.indexCtrl)

            .factory('goodsManagerService', goodsManagerService)

            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
                hbBasicData.setResource();
            }]);
    });