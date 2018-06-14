define(['@systemUrl@/js/modules/myStudy/controllers/myStudy-ctrl',
    '@systemUrl@/js/modules/myStudy/controllers/goods-ctrl',
    '@systemUrl@/js/modules/myStudy/controllers/trainClass-ctrl',
    '@systemUrl@/js/modules/myStudy/services/myStudy-service',
    '@systemUrl@/js/modules/myRealClass/services/myRealClass-service'], function (controllers, goodsCtrl, trainClassCtrl, myStudyService, myRealClassService) {
    'use strict';
    angular.module('app.center.states.myStudy.main', [])
        .controller('app.center.states.myStudy.indexCtrl', controllers.indexCtrl)
        .controller('app.center.states.goods.indexCtrl', goodsCtrl.indexCtrl)
        .controller('app.center.states.trainClass.indexCtrl', trainClassCtrl.indexCtrl)

        .factory('myRealClassService', myRealClassService)
        .factory('myStudyService', myStudyService);


});