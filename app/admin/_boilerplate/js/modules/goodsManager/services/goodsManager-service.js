define(function () {
    return ['Restangular', '$http', function (Restangular, $http) {

        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commodityManager');
        });


        return {


            findCommoditySkuPriceRecord: function (params) {
                return a.one('findCommoditySkuPriceRecord').get(params);
            },

            getTitleLevelList: function () {
                return a.one('getTitleLevelList').get();
            },
            getTrainingYearList: function () {
                return a.one('getTrainingYearList').get();
            },


            getCommodityDetail: function (param) {
                return a.one('getCommodityDetail').get(param);
            },

            updateCourseLearning: function (param) {
                return a.all('updateCourseLearning').post(param);
            },

            updateTrainingConfigRequire: function (param) {
                return a.all('updateTrainingConfigRequire').post(param);
            },

            updateExamRound: function (param) {
                return a.all('updateExamRound').post(param);
            },

            updateCommodityAndClassInfo: function (param) {
                return a.all('updateCommodityAndClassInfo').post(param);
            },

            deleteCommodity: function (commoditySkuId) {
                return a.all('deleteCommodity/' + commoditySkuId).post();
            },

            onSale: function (param) {
                return a.one('onSale').get(param);
            },

            offShelves: function (param) {
                return a.one('offShelves').get(param);
            },

            commodityCopy: function (param) {
                return a.all('commodityCopy/' + param).post();
            },
            changeAuthorizedRule: function(param){
                return a.all('changeAuthorizedRule').post(param);
            },
            authorizeCommodity: function(param){
                return a.all('authorizeCommodity').post(param);
            },
            cancelAuthorized: function(param){
                return a.one('cancelAuthorized').get(param);
            },
            getAuthorizedRuleChangeLogPage: function(param){
                return a.one('getAuthorizedRuleChangeLogPage').get(param);
            }

        };
    }];
});
