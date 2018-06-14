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

        // /web/login/login/findRegion
        return {

            findRegion: function (param) {
                return base.one('findRegion').get(param);
            },


            register: function (param) {
                return base.all('register').post(param);
            },

            perfectinformation: function (param) {
                return base.all('perfectinformation').post(param);
            },


            isLogin: function () {
                return base.one('isLogin').get();
            },
            getUserInfo: function () {
                return base.one('getUserInfo').get();
            },
            validateCompletion: function () {
                return basePorTalUser.one('validateCompletion').get();
            },
            isUserExist: function (params) {
                return base.one('isUserExist/' + params.identify + '?name=' + params.name).get();
            },
            sendMobileValidateCode:function(params){
                return base.one("sendMobileVerificationCode").get(params);
            },
            isSupportMobileVerifycode: function(){
                return base.one("isSupportMobileVerifycode").get();
            }
        };
    }];
});
