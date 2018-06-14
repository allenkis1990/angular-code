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
        var baseForget = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/passwordProtectioned');
        });
        return {
            /*       setDefaultPassword: function (params) {
                       return base.one ( 'setDefaultPassword/'+params.identify+'?name='+params.name ).get ();
                   },
                   checkResetPassword: function (params) {
                       return baseForget.all ( 'checkResetPassword' ).post (params);
                   },
                   resetPassword: function (params) {
                       return baseForget.all ( 'resetPassword' ).post (params);
                   },
                   getQuestionsByUserId: function (params) {
                       return baseForget.one ( 'getQuestionsByUserId/'+params.userId ).get ();
                   },
                   matchAnswerItems: function (params) {
                       return baseForget.all ( 'matchAnswerItems').post (params);
                   },
                   resetPassword: function (params) {
                       return baseForget.all ( 'resetPassword').post (params);
                   }*/
            toFindPassword: function (params) {
                return base.one('toFindPassword').get(params);
            },
            changePassword: function (params) {
                return base.all('changePassword').post(params);
            }
        };
    }];
});
