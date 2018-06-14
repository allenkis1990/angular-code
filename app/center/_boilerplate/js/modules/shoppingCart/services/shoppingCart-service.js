/**
 * Created by wangzy on 2015/8/1.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/studentOrder');
        });
        var baseTwo = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/index');
        });

        var baseThree = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/commodity');
        });
        var baseFour = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/commodity');
        });

        return {


            findCourseCommodityList: function (params) {
                return baseThree.all('findCourseCommodityList').post(params);
            },

            findCommodityList: function (params) {
                return baseFour.all('findCommodityList').post(params);
            },

            getProfessionYearQueryOptions: function () {
                return baseTwo.one('getProfessionYearQueryOptions').get();
            },

            getShoppingCartCommodityPage: function (params) {
                return base.one('getShoppingCartCommodityPage').get(params);
            },
            putOffShoppingCart: function (params) {
                return base.all('putOffShoppingCart').post(params);
            }
        };
    }];
});
