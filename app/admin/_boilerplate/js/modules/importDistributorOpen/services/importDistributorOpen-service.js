/**
 * Created by linf on 2016/10/8 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/distributorOpenManage');
        });

        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/asynQueImport/');
        });

        return {
            importOpenUser: function (param) {
                return a.all('importOpenUser').post(param);
            },

            downloadTemplate: function () {
                return b.one('getDownLoadIp').get();
            }
        };
    }];
});
