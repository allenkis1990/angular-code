/**
 * Created by choaklin on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/asynQueImport');
        });

        return {

            downloadTemplate: function () {
                return base.one('getDownLoadIp').get();
            }
        };
    }];
});
