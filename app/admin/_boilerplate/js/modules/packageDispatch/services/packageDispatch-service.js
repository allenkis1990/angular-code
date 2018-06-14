/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', '$http', function (Restangular, $http) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/packageDeliveryManager/deliverGood/{invoiceId}/{carrierId}/{waybillNo}');
        });

        return {
            dispatch: function () {
                $http.post();
            }
        };
    }];
});
