define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/orderManage');
        });

        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/distributorOpenManage');
        });

        var c = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/administratorManage');
        });

        var d = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commodityManager');
        });
        var refund = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/refund');
        });
        ///web/admin/commodityManager/getTitleLevelList
        return {

            getTrainingYearList: function () {
                return d.one('getTrainingYearList').get();
            },

            getTitleLevelList: function () {
                return d.one('getTitleLevelList').get();
            },

            getAreaByParentId: function (param) {
                return c.one('getAreaByParentId').get(param);
            },


            getOrderStatistic: function (param) {
                return a.one('getOrderStatistic').get(param);
            },

            closeTheOrder: function (order, desc) {
                return a.one('close/' + order + '?desc=' + desc).get();
            },

            getOrderDetail: function (param) {
                return a.one('get/' + param).get();
            },

            exportOrder: function (param) {
                return a.one('exportOrder').get(param);
            },

            getDistributorOrderStatistic: function (param) {
                return b.one('getOrderStatistic').get(param);
            },
            exportDistributorOrder: function (param) {
                return b.one('exportOrder').get(param);
            },
            enableRefund: function (param) {
                return a.one('enableRefund/' + param).get();
            },
            listRefundReason: function () {
                return refund.one('listRefundReason').get();
            },
            applyRefund: function (subOrder, reasonId, desc) {
                return refund.all('applyRefund/' + subOrder).post({
                    reasonId: reasonId,
                    desc: desc
                });
            }
        };
    }];
});
