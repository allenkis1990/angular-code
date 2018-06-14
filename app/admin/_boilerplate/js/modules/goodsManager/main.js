define(['angular',
    '@systemUrl@/js/modules/goodsManager/controllers/goodsManager-ctrl',
    '@systemUrl@/js/modules/goodsManager/services/goodsManager-service',
    '@systemUrl@/js/modules/releaseGoods/services/releaseGoods-services',
    '@systemUrl@/js/modules/channelDistribution/services/channelDistribution-service',
    '@systemUrl@/js/modules/releaseGoods/directives/releaseGoods-directive',
    '@systemUrl@/js/modules/goodsManager/directives/goodsManager-directive'
],
    function (angular,controllers, goodsManagerService, releaseGoodsServices,channelDistributionServices,releaseGoodsDirective,goodsManagerDirective) {
    'use strict';
    angular.module('app.admin.states.goodsManager.main', [])

        .controller('app.admin.states.goodsManager.indexCtrl', controllers.indexCtrl)

        .factory('goodsManagerService', goodsManagerService)

        .factory('releaseGoodsServices', releaseGoodsServices)
        .factory('channelDistributionServices', channelDistributionServices)

        .directive('coursebagConfig2', releaseGoodsDirective.coursebagConfig)
        .directive('paymentRules', goodsManagerDirective.paymentRules)
        .directive('authorizedOpDialog', goodsManagerDirective.authorizedOpDialog)
        .directive('commodityAuthroizedOption', goodsManagerDirective.commodityAuthroizedOption)
        .directive('practiceConfig2', releaseGoodsDirective.practiceConfig);
});