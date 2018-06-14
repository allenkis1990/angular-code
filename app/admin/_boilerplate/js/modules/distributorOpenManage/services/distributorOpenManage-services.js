define(function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/distributorOpenManage');
        });

        return {

            deleteById: function (id) {
                return a.one('delete/' + id).get();
            }
        };
    }];
});
