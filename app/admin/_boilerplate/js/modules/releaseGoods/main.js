define(['@systemUrl@/js/modules/releaseGoods/controllers/releaseGoods-ctrl',
    '@systemUrl@/js/modules/releaseGoods/services/releaseGoods-services',
    'common/hbWebUploader'], function (controllers, releaseGoodsServices) {
    'use strict';
    angular.module('app.admin.states.releaseGoods.main', ['hb.webUploader'])

        .controller('app.admin.states.releaseGoods.indexCtrl', controllers.indexCtrl)

        .factory('releaseGoodsServices', releaseGoodsServices)

        .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
            hbBasicData.setResource();
        }]);

});