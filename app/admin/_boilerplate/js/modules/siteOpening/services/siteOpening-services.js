define(function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/userManage');
        });

        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/orderManage');
        });

        return {

            getUserInfo: function (param) {
                return a.one('getUserInfo/' + param).get();
            },

            openTheClass: function (userId, params) {
                return b.all('create/' + userId).post(params);
            }
        };
    }];
});
