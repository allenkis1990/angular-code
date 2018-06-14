/**
 * Created by linf on 2016/10/8 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var userBase = Restangular.withConfig(function (config) {//用户的信息
            config.setBaseUrl('/web/admin/userManage');
        });

        return {
            importUser: function (params) {
                return userBase.all('userImport').post(params);
            },
            downloadTemplate: function () {
                return userBase.one('getDownLoadIp').get();
            }
        };
    }];
});
