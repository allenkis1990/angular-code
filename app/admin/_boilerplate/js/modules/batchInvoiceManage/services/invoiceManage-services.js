define (function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig (function (config) {
            config.setBaseUrl ('/web/admin/billAction');
        });
        var aCommodit = Restangular.withConfig (function (config) {
            config.setBaseUrl ('/web/admin/commodityManager/getConfigDone');
        });

        return {

            dealWithBill:function(param){
                return a.one("dealWithBill").get(param);
            },
            dealCancelBill:function(param){
                return a.one("dealCancelBill").get(param);
            },
            getDealBillLog:function(param){
                return a.one("getDealBillLog").get(param);
            },
            importBatchBill:function(param){
                return a.one("importBatchBill").get(param);
            },
            exportBatchBill:function(param){
                return a.one("exportBatchBill").get(param);
            },
            getConfigDone:function(param){
                return aCommodit.one("getConfigDone").get(param);
            },
            batchIssuingInvoice: function (invoiceIds) {
                return a.all('batchIssuingInvoice').post(invoiceIds);
            },
            ableIssuingElectronInvoiceCount: function () {
            return a.one('ableIssuingElectronInvoiceCount').get();
        },
            realSupportIssuingElectronInvoice: function () {
                return a.one('realSupportIssuingElectronInvoice').get();
            },
            getIssuingInvoiceInfoByBatchNo: function (param) {
                return a.one('getIssuingInvoiceInfoByBatchNo').get(param);
            },
            downLoadElectronBlueBill: function (param) {
                return a.one('downLoadElectronBlueBill').get(param);
            },
        }
    }]
});
