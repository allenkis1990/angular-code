/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/study');
        });
        var baseLogin = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/login/login');
        });
        return {
            creditCertify: function (params) {
                return base.one('creditCertify').get(params);
            },
            getUserInfo: function () {
                return baseLogin.one('getUserInfo').get();
            }
        };
    }];
});
