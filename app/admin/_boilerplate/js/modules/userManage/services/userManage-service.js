/**
 * Created by linf on 2016/10/8 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {

        var userBase = Restangular.withConfig(function (config) {//用户的信息
            config.setBaseUrl('/web/admin/userManage');
        });

        return {

            /**
             * 用户详情--学员基本信息
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            getUserInfoByUserId: function (userId) {
                return userBase.one('getUserInfoByUserId/' + userId).get();
            },

            /**
             * 用户详情--学员培训课程信息
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            getTrainCourseInfoByUserId: function (params) {
                return userBase.all('getUserCourseDtoList').post(params);
            },
            /**
             * 用户详情--学员培训班信息
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            getTrainClassInfoByUserId: function (userId) {
                return userBase.one('getTrainClassInfoByUserId/' + userId).get();
            },


            /**
             * 导出学员
             */
            exportUserInfo: function (params) {
                return userBase.all('exportUserInfo').post(params);
            },

            enable: function (userId) {
                return userBase.one('enable/' + userId).get();
            },

            suspend: function (userId) {
                return userBase.one('suspend/' + userId).get();
            }

        };
    }];
});
