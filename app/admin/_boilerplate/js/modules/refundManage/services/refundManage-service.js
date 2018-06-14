define(function () {

    return ['Restangular', '$http', function (Restangular, $http) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/refund/');
        });
        return {

            cancel: function (order, desc) {
                return base.all('cancel/' + order).post({
                    desc: desc
                });
            },
            getrefundDetail: function (refundNo) {
                return base.one('get/' + refundNo).get();
            },

            reject: function (order, desc) {
                return base.all('reject/' + order).post({
                    reason: desc
                });
                /*return base.one("reject/"+order).get();*/
            },
            approve: function (order) {
                /*    return base.one("reject/"+order+'?desc='+desc).get();*/
                return base.one('approve/' + order).get();
            },
            enforceApprove: function (order) {
                /*    return base.one("reject/"+order+'?desc='+desc).get();*/
                return base.one('enforceApprove/' + order).get();
            },
            exportRefund: function (param) {

                return base.one('export').get(param);
            },
            resume: function (order) {
                return base.one('resume/' + order).get();
            },
            statistic: function (param) {
                return base.one('statistic').get(param);
            }

        };
    }];
});
