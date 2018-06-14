define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/certifiedTemplate/');
        });
        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/asynQueImport/');
        });
        return {
            getCertifiedList: function (unitId,dimension) {
                return a.one('getCertifiedList').get({getAllCertified: true,unitId:unitId,dimension:dimension});
            },
            getCertifiedPreview: function (id) {
                return a.one('getCertifiedPreview').get({id: id});
            },
            getDownloadUrl: function () {
                return b.one('getDownLoadIp').get();
            }
        };
    }];
});
