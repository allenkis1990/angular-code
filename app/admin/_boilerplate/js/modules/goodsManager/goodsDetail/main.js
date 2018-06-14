define(['@systemUrl@/js/modules/goodsManager/goodsDetail/controllers/goodsDetail-ctrl', '@systemUrl@/js/modules/goodsManager/services/goodsManager-service', 'common/hbWebUploader'],
    function (controllers, goodsManagerService) {
        'use strict';
        angular.module('app.admin.states.goodsDetail.main', ['hb.webUploader'])

            .controller('app.admin.states.goodsDetail.indexCtrl', controllers.indexCtrl)

            .factory('goodsManagerService', goodsManagerService)

            .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
                hbBasicData.setResource();
            }]);
    });