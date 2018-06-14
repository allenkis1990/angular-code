define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {
        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/paymentChannelManage/');
        });
        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/paymentAccount/');
        });

        return {
            getPaymentChannelList: function () {//��ȡ����Ŀ��������
                return a.one('getPaymentChannelList').get();
            },
            getPaymentAccountListByPaymentChannelId: function (id) {//ͨ������Id��ȡ�տ��˺��б�
                return a.one('getPaymentAccountListByPaymentChannelId/' + id).get();
            },
            getPaymentAccountInfoList: function () {
                return b.one('getPaymentAccountInfoList?tradeType=0').get();
            },
            addPaymentAccount: function (params) {
                return a.all('addPaymentAccount').post(params);
            },
            removePaymentAccount: function (params) {
                return a.all('removePaymentAccount').post(params);
            },
            getPaymentAccountByPaymentChannelId: function (id) {//ͨ������id��ȡ��Ʊ����
                return a.one('getPaymentAccountByPaymentChannelId/' + id).get();
            },
            getInvoiceConfigByPaymentChannelTab: function (tabType) {//ͨ������tab��ȡ��Ʊ����
                return a.one('getInvoiceConfigByPaymentChannelTab/' + tabType).get();
            },
            getInvoiceConfigByPaymentChannelTabAndSkuId: function (tabType,param) {//ͨ������tab��ȡ��Ʊ����
                return a.one('getInvoiceConfigByPaymentChannelTabAndSkuId/' + tabType).get(param);
            },
            operaBillConfig: function (params) {
                return a.all('operaBillConfig').post(params);
            },
            getPaymentAccountListByQueryParam: function (params) {//��ȡ����Ŀ��������
                return a.all('getPaymentAccountListByQueryParam').post(params);
            }
        };
    }];
});
