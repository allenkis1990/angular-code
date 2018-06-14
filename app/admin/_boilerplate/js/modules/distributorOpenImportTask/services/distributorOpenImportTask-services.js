define(function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/distributorOpenManage');
        });
        var aCommodit = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commodityManager/getConfigDone');
        });

        return {

            importOpenUser: function (param) {
                return a.one('importOpenUser').get(param);
            },
            exportBills: function (param) {
                return a.one('exportBillOrderExcel').get(param);
            },
            getConfigDone: function (param) {
                return aCommodit.one('getConfigDone').get(param);
            }
        };
    }];
});
