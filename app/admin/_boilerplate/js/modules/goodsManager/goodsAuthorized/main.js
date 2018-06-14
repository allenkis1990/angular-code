define(['@systemUrl@/js/modules/goodsManager/goodsAuthorized/controllers/goodsAuthorized-ctrl',
    '@systemUrl@/js/modules/goodsManager/services/goodsManager-service', 'common/hbWebUploader'],
    function (controllers, goodsManagerService) {
        'use strict';
        angular.module('app.admin.states.goodsAuthorized.main', ['hb.webUploader'])

            .controller('app.admin.states.goodsAuthorized.indexCtrl', controllers.indexCtrl)

            .factory('goodsManagerService', goodsManagerService)

            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
                hbBasicData.setResource();
            }]);
    });