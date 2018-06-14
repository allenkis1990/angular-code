/**
 * Created by linj on 2016/9/18.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var c = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commoditySellStatistics');
        });

        return {
            exportCommoditySaleStatistic: function (parems) {
                return c.one('exportCommoditySaleStatistic').get(parems);
            }
        };
    }];
});
