/**
 * Created by linf on 2016/5/31.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/distributionManager');
        });

        return {
            info: function () {
                return base.one('info').get();
            },
            savePhysicalStorage: function (param) {
                return base.all('createPhysicsStorge').post(param);
            },
            findPhysicalStorage: function (physicsStorageId) {
                return base.one('findPhysicsStorageById/' + physicsStorageId).get();
            },
            updatePhysicalStorage: function (param) {
                return base.all('createPhysicsStorge').post(param);
            },
            stopPhysicalStorage: function (physicsStorageId) {
                return base.all('dealPausePhysicsStorage/' + physicsStorageId).post();
            },
            openPhysicalStorage: function (physicsStorageId) {
                return base.all('dealOpenPhysicsStorage/' + physicsStorageId).post();
            },
            deletePhysicalStorage: function (physicsStorageId) {

                return base.all('deletePhysicsStorageById/' + physicsStorageId).post();
            },
            saveCommonCarrier: function (param) {
                return base.all('createCommonCarrier').post(param);
            },
            findCommonCarrier: function (commonCarrierId) {
                return base.all('findCommonCarrierById/' + commonCarrierId).post();
            },
            updateCommonCarrier: function (param) {
                return base.all('createCommonCarrier').post(param);
            },
            deleteCommonCarrier: function (commonCarrierId) {
                return base.all('deleteCommonCarrierById/' + commonCarrierId).post();

            },
            saveDeliveryMode: function (deliveryModeDto) {
                return base.all('saveDeliveryMode').post(deliveryModeDto);
            },
            findDeliveryMode: function (obj) {
                var temp = "";
                if (!(obj === '' || obj === undefined || obj === null)){
                    temp = obj;
                }
                return base.one('/findDeliveryMode?unitId='+temp).get();
            }
        };
    }];
});
