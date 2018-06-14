define(function () {
    return ['Restangular', function (Restangular) {

        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/asynQueImport/');
        });

        return {

            downloadTemplate: function () {
                return b.one('getDownLoadIp').get();
            }
        };
    }];
});
