/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/login/login');
        });
        var basePorTalUser = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/userNorthMessage');
        });
        return {
            isLogin: function () {
                return base.one('isLogin').get();
            },
            getUserInfo: function () {
                return base.one('getUserInfo').get();
            },
            validateCompletion: function () {
                return basePorTalUser.one('validateCompletion').get();
            }
        };
    }];
});
