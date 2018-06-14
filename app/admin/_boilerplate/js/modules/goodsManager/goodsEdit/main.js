define(['@systemUrl@/js/modules/goodsManager/goodsEdit/controllers/goodsEdit-ctrl', 'common/hbWebUploader'], function (controllers) {
    'use strict';
    angular.module('app.admin.states.goodsEdit.main', ['hb.webUploader'])

        .controller('app.admin.states.goodsEdit.indexCtrl', controllers.indexCtrl)


        .run(['$rootScope', '$http', 'hbBasicData', function ($rootScope, $http, hbBasicData) {
            hbBasicData.setResource();
        }]);
});