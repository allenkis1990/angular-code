/**
 * Created by choaklin on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var logonStatistic = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/logonStatistic');
        });

        return {

            findUnitLogonTimes: function (condition) {
                return logonStatistic.one('findUnitLogonTimes').get(condition);
            }
        };
    }];
});
