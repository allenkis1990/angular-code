/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/batchOrderAction');
        });
        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/asynQueImport/');
        });
        var c = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/paymentChannelManage/');
        });

        var baseFour = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/portal/register');
        });
        var baseThree = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/userManage');
        });
        //var employeeOne = base.one('employee'),
        //    employeeAll = base.all('employee');
        //batchOrderAction/commitBatch/{batchNo}
        return {
            commitBatch: function (batchNo,params) {
                return base.all("commitBatch/"+batchNo).post(params);
            },
            updateUserReceive: function (params) {
                return baseThree.all("updateUserReceive").post(params);
            },

            findUserBatchPage: function (pramas) {
                return base.one('findUserBatchPage').get(pramas);
            },
            createBatch: function () {
                return base.one('createBatch').get();
            },
            createTestBatch: function (batchType) {
                return base.one('createTestBatch').get({batchType:batchType});
            },
            deleteBatch: function (pramas) {
                return base.one('deleteBatch').get(pramas);
            },
            importGoodsToBatchList: function (pramas) {
                return base.one('importGoodsToBatchList').get(pramas);
            },
            downloadTemplate: function () {
                return b.one('getDownLoadIp').get();
            },
            removeGoodsFromBatchList: function (pramas) {
                return base.one('removeGoodsFromBatchList').get(pramas);
            },
            findBatchDetail: function (pramas) {
                return base.one('findBatchDetail').get(pramas);
            },
            addGoodsToBatchList: function (pramas) {
                return base.all('addGoodsToBatchList').post(pramas);
            },
            getBillConfigByPaymentChannel: function (pramas) {
                return c.one('getBillConfigByPaymentChannel').get(pramas);
            },
            findRegionByParentId: function (parentId) {
                return baseFour.one("findRegionByParentId/" + parentId + '/2').get();
            },
            toPayBatch: function (batchNo,pramas) {
                return base.one("toPayBatch/"+batchNo).get(pramas);
            },
            getPaymentAccountByPaymentChannel: function (pramas) {
                return c.one('getPaymentAccountByPaymentChannel').get(pramas);
            },
            getMerchantAccountList: function (pramas) {
                return c.one('getMerchantAccountList').get(pramas);
            },
            paySuccess: function (batchNo) {
                return base.one('paySuccess?batchNo='+batchNo).get();
            },
            closeBatch: function (batchNo,reason) {
                return base.one('closeBatch/'+batchNo).get(reason);
            },
            getCommitResult: function (batchNo) {
                return base.one('getCommitResult').get(batchNo);
            },
            findBatchListPage: function (batchNo,pramas) {
                return base.one('findBatchListPage/'+batchNo).get(pramas);
            },
        };

    }]
});
