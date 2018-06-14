define (function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig (function (config) {
            // config.setBaseUrl ('/web/admin/batchReconciliation');
            config.setBaseUrl ('/web/admin/batchReconciliation');
        });

        return {

            getBatchReconciliationStatistic:function(params){
                return a.one("getBatchReconciliationStatistic").get(params);
            },
            importBankFlow:function(params){
                return a.one("importBankFlow").get(params);
            },
            exportReconciliation:function(params){
                return a.one("exportReconciliation").get(params);
            }
        }
    }]
});
