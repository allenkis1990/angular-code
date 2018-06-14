/**
 * Created by wangzy on 2015/8/1.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/commodity');
        });

        var baseTwo = Restangular.withConfig(function (config) {//web/front/shoppingCart/addCommodity
            config.setBaseUrl('/web/front/studentOrder');
        });
        return {

            getDetail: function (params) {
                return base.one('get/' + params).get();
            },

            putIntoShoppingCart: function (param) {
                return baseTwo.one('putIntoShoppingCart/' + param).get();
            }
        };
    }];
});
