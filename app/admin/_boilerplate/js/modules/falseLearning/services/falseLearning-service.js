/**
 * Created by linf on 2016/5/31.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/falseLearning');
        });

        return {
            getUniqueConfig: function () {
                return base.one('getUniqueConfig').get();
            },

            add: function (params) {
                return base.all('addFalseLearning').post(params);
            },
            update: function (params) {
                return base.all('updateFalseLearning').post(params);
            },
            updateState: function (params) {
                return base.one('updateFalseLearningState').get(params);
            }
        };

    }];
});
