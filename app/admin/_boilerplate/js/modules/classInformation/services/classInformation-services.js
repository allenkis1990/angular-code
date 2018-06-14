define(function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/userManage');
        });

        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/orderManage');
        });

        var baseCus = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/customerService');
        });
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/regionInfo');
        });
        var base2 = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/login/login');
        });
        return {

            findRegion: function (param) {
                return base2.one('findRegion').get(param);
            },
            getUserInfo: function (param) {
                return a.one('getUserInfo/' + param + '/').get();
            },
            edit: function (param) {
                return a.all('edit').post(param);
            },
            resetPassword: function (param) {
                return a.one('resetPassword/' + param + '/').get();
            },

            swapTrainClass: function (params) {
                return baseCus.one('swapTrainClass/' + params.studentId).get(params.swapObj);
            },
            swapCourse: function (params) {
                return baseCus.one('swapCourse/' + params.studentId).get(params.swapObj);
            },

            getSwapOrderPage: function (params) {
                return b.one('getSwapOrderPage').get(params);
            },

            //继续换班
            resumeSwap: function (swapOrderNo) {
                return baseCus.one('resumeSwap/' + swapOrderNo).get();
            },

            doView: function () {

            },
            validateSwapAuthorize: function (masterOrderNo,subOrderNo) {
                return baseCus.one ( 'validateSwapAuthorize').get ({
                    masterOrderNo:masterOrderNo,
                    subOrderNo : subOrderNo
                });
            },
        };
    }];
});
