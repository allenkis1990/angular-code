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
            config.setBaseUrl('/web/admin/courseWareManager');
        });
        var c = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/courseChooseStatistic');
        });
        var d = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/supplierResources');
        });
        return {
            findProvider: function () {
                return b.one('findProvider').get();
            },
            exportCourseStatistics: function (pramas) {
                return c.one('exportStatisticData').get(pramas);
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
            },
            findUnitByParentId:function(parentId){
                return d.one("findUnitByParentId").get({parentId:parentId});
            }
        };
    }];
});
