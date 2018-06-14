/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/info');
        });
        return {
            getInfoDetail: function (params) {
                return base.one('getInfoDetail').get(params);
            }

        };
    }];
});
