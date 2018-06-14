/**
 * Created by hb on 2017/3/20.
 */
/**
 * Created by linj on 2016/9/13
 */
define(function () {
    return ['Restangular', '$stateParams', function (Restangular, $stateParams) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/fakeLearning');
        });

        return {

            save: function (defenceFake) {
                return base.all('createInterceptConfig').post(defenceFake);
            },

            remove: function (item) {
                return base.one('deleteInterceptConfig').get({
                    configId: item.configId
                });
            },

            detail: function (params) {
                return base.one('getInterceptConfig').get(params);
            },

            update: function (params) {
                return base.all('updateInterceptConfig').post(params);
            },

            enable: function (params) {
                return base.one('changeState').get(params);
            },

            getTrainClassListLength: function (configId) {
                return base.one('getInterceptConfigTrainClassPage').get({
                    configId: configId,
                    pageNo: 1,
                    pageSize: 5
                });
            },

            unSign: function (params) {
                return base.one('unAssignInterceptConfig').get(params);
            },

            assign: function (params) {
                return base.all('assignInterceptConfig/' + params.configId).post(params.classList);
            }


        };
    }];
});
