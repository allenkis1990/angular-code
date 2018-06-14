/**
 * Created by Administrator on 2015/8/5.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/paymentAccount');
        });

        return {
            enabled: function (privateKeyPath) {
                return base.one('enabled/' + privateKeyPath).post();
            },
            disabled: function (privateKeyPath) {
                return base.one('disabled/' + privateKeyPath).post();
            },
            delete: function (privateKeyPath) {
                return base.one('delete/' + privateKeyPath).post();
            },
            accountList: function (query) {
                return base.one('getPaymentAccountInfoList?').get({
                    "unitId"              : query.unitId,
                    "objectId"            : query.objectId,
                    "rangeType"           : query.rangeType,
                    "searchRange"         : query.searchRange,
                    "belongsType"         : query.authorizeQuery.belongsType,
                    "authorizeToUnitId"   : query.authorizeQuery.authorizeToUnitId,
                    "authorizedFromUnitId": query.authorizeQuery.authorizedFromUnitId
                });
            },
            findTaxPayerList: function () {
                return base.one('findTaxPayerList').get();
            },
            create: function (params) {
                return base.all('create').post(params);
            },
            findMerchantAccount: function (privateKeyPath) {
                return base.one('findMerchantAccount/' + privateKeyPath).get();
            },
            findElectronInvoiceSupport: function () {
                return base.one('findElectronInvoiceSupport').get();
            },
            validateName: function (id, name) {
                return base.one('validateName?id=' + id + '&name=' + name).get();
            },
            update: function (params) {
                return base.all('update').post(params);
            },
            allowUpdatePaymentAccount: function (id) {
                return base.one('allowUpdatePaymentAccount?id=' + id).get();
            },
            //获取发票配置
            getBillConfigByAccountId: function (accountId) {
                return base.one('getBillConfigByAccountId?accountId='+accountId).get();
            },
            //编辑发票配置
            operaBillConfig: function (params) {
                return base.all('operaBillConfig').post(params);
            },
            //分配授权
            authorizeToUnit: function (params) {
                return base.all('authorizeToUnit').post(params);
            },
            //已授权单位
            listHasAuthorizeUnit: function (accountId) {
                return base.one('listHasAuthorizeUnit?accountId='+accountId).get();
            },
            //取消授权
            cancelAuthorizeToUnit: function (params) {
                return base.all('cancelAuthorizeToUnit').post(params);
            },
            //授权日志
            listAuthorizeRecord: function (accountId) {
                return base.one('listAuthorizeRecord?accountId='+accountId).get();
            },

        };

    }];
});
