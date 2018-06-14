define(function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/reconciliation');
        });

        return {

            getReconciliationStatistic: function (params) {
                return a.one('getReconciliationStatistic').get(params);
            },
            importBankFlow: function (params) {
                return a.one('importBankFlow').get(params);
            },
            exportReconciliation: function (params) {
                return a.one('exportReconciliation').get(params);
            }
        };
    }];
});
