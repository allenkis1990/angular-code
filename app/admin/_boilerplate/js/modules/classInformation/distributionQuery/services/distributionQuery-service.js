define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/packageDeliveryManager');
        });
        return {
            remarkPackage: function (param) {
                return base.all('remarkPackage').post(param);
            }
        };
    }];
});
