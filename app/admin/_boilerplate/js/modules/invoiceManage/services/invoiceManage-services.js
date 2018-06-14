define(function () {
    return ['Restangular', function (Restangular) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/billAction');
        });
        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/asynQueImport/');
        });
        var aCommodit = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commodityManager/getConfigDone');
        });

        return {

            dealWithBill: function (param) {
                return a.one('dealWithBill').get(param);
            },
            dealCancelBill: function (param) {
                return a.one('dealCancelBill').get(param);
            },
            getDealBillLog: function (param) {
                return a.one('getDealBillLog').get(param);
            },
            importBillingResult: function (param) {
                return a.one('importBillingResult').get(param);
            },
            exportBills: function (param) {
                return a.one('exportBillOrderExcel').get(param);
            },
            getConfigDone: function (param) {
                return aCommodit.one('getConfigDone').get(param);
            },
            getIssuingInvoiceInfoByOrderNo: function (param) {
                return a.one('getIssuingInvoiceInfoByOrderNo').get(param);
            },
            batchIssuingInvoice: function (invoiceIds) {
                return a.all('batchIssuingInvoice').post(invoiceIds);
            },
            downLoadElectronBlueBill: function (param) {
                return a.one('downLoadElectronBlueBill').get(param);
            },
            downloadTemplate: function () {
                return b.one('getDownLoadIp').get();
            },
            ableIssuingElectronInvoiceCount: function () {
                return a.one('ableIssuingElectronInvoiceCount').get();
            },
            realSupportIssuingElectronInvoice: function () {
                return a.one('realSupportIssuingElectronInvoice').get();
            }
        };
    }];
});
