/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var baseCommod = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/classInfo');
        });
        var c = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commodityManager');
        });

        var userBase = Restangular.withConfig(function (config) {//用户的信息
            config.setBaseUrl('/web/admin/userManage');
        });
        var courseBase = Restangular.withConfig(function (config) {//用户的信息
            config.setBaseUrl('/web/admin/studyProcess');
        });
        return {

            /**
             * 用户详情--学员培训班信息
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            getTrainClassInfoByUserId: function (userId) {
                return userBase.one('getTrainClassInfoByUserId/' + userId).get();
            },
            getTrainCourseInfoByUserId: function (params) {
                return courseBase.all('findUserCourseDtoList').post(params);
            },

            getTitleLevelList: function (params) {
                return c.one('getAllSkuPropertyOption').get(params);
            },
            getTrainingYearList: function (params) {
                return c.one('getAllSkuPropertyOption').get(params);
            },
            getUserTrainingYears: function (params) {
                return baseCommod.one('getUserTrainingYears').get(params);
            },
            getUserTitleLevels: function (params) {
                return baseCommod.one('getUserTitleLevels').get(params);
            },
            getUserCourseSku: function (params) {
                return courseBase.one('findUserCourseSkuPropertyOption').get(params);
            }
        };
    }];
});
