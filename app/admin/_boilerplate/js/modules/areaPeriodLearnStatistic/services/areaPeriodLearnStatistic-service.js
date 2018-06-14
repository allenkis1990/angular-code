/**
 * Created by linj on 2016/9/18.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/courseCategoryAction');
        });
        var a = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commodityManager');
        });
        var b = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/regionPeriod');
        });

        return {

            exportRegionPeriodStatistic: function (prames) {
                return b.one('exportRegionPeriodStatistic').get(prames);
            },
            getTitleLevelList: function () {
                return a.one('getTitleLevelList').get();
            },
            getTrainingYearList: function () {
                return a.one('getTrainingYearList').get();
            },
            ajaxValidate: function (courseCategoryAdd) {
                return base.one('isExist').get(courseCategoryAdd);
            },
            findByQuery: function (nodeId) {
                return base.one('findByQuery').get({categoryId: nodeId});
            },
            update: function (courseCategoryAdd) {
                return base.all('update').post(courseCategoryAdd);
            },
            save: function (courseCategoryAdd) {
                return base.all('create').post(courseCategoryAdd);
            },
            deleteLessonType: function (nodeId) {
                return base.one('delete').get({categoryId: nodeId});
            }
        };
    }];
});
