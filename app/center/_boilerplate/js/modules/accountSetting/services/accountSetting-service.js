define(function () {

    return ['Restangular', '$compile', function (Restangular, $compile) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/front/userSetting');
        });
        var base2 = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/login/login');
        });
        /*  var baseSafe = Restangular.withConfig(function (config) {
              config.setBaseUrl('/web/portal/passwordProtectioned');
          });*/
        return {
            modifyLoginPassword: function (params) {
                return base.all('modifyLoginPassword').post(params);
            },
            getUserInfo: function () {
                return base.all('getUserInfo').post();
            },
            findRegion: function (param) {
                return base2.one('findRegion').get(param);
            },
            updateUserInfo: function (param) {
                return base.all('updateUserInfo').post(param);
            },

            modifyDisplayPhoto: function (params) {
                return base.one('modifyDisplayPhoto').get(params);
            }
            /* findUserDetailInfo:function(){
                 return base.one("findUserDetailInfo").get();
             },
             saveUserInfo:function(params){
                 return base.all("saveUserInfo").post(params);
             },
 
             getQuestionsByUserId:function(params){
                 return baseSafe.one("getQuestionsByUserId/"+params.userId).get();
             },
             getAllQuestion:function(){
                 return baseSafe.one("getAllQuestion").get();
             },
             saveAnswerItems:function(params){
                 return baseSafe.all("saveAnswerItems").post(params);
             },
             matchAnswerItems:function(params){
                 return baseSafe.all("matchAnswerItems").post(params);
             },
             updateAnswerItems:function(params){
                 return baseSafe.all("updateAnswerItems").post(params);
             },
             deleteAnswerItems:function(params){
                 return baseSafe.all("deleteAnswerItems").post(params);
             }*/

        };
    }];
});
