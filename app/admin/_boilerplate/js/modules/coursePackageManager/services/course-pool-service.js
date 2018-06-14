/**
 * Created by ljl on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/coursePoolAction');
        });

        return {
            /**
             * 查询课程包内课程
             * @param data
             * @returns {*}
             */
            findCourseInPoolPage: function (data) {
                return base.one('findCourseInPoolPage').get(data);
            },
            /**
             * 查询课程包信息
             */
            findCoursePool: function (id) {
                return base.one('findCoursePool').get({coursePoolId: id});
            },
            /**
             * 更新课程池信息
             */
            updateCoursePool: function (coursePool) {
                return base.all('updateCoursePool').post(coursePool);
            },
            /**
             * 删除课程池信息
             */
            deleteCoursePool: function (id) {
                return base.one('deleteCoursePool').get({coursePoolId: id});
            },
            /**
             * 新增课程池信息
             */
            addCoursePool: function (coursePool) {
                return base.all('addCoursePool').post(coursePool);
            },
            /**
             * 课程池是否被引用
             */
            hasReference: function (id) {
                return base.one('hasReference').get({coursePoolId: id});
            },
            /**
             * 课程池是否被授权
             */
            hasAuthorize: function (id) {
                return base.one('hasAuthorize').get({coursePoolId: id});
            },
            removeCourseInPool: function (id, courseIds) {
                return base.one('removeCourseInPool').get({poolId: id, courseIds: courseIds});
            },
            updatePeriod: function (id, data) {
                return base.all('updatePeriod/' + id).post(data);
            },
            move: function (poolId, id, direction) {
                return base.one('updatePeriod/' + poolId + '/' + id + '/' + direction).get({});
            },
            addCourseInPool: function (id, data) {
                return base.all('addCourseInPool/' + id).post(data);
            },
            updateKeepPeriodSame: function (id, type, data) {
                return base.all('updatePeriod/' + id + '/' + type).post(data);
            },
            copyCoursePool: function (id, name) {
                return base.one('copyCoursePool').get({coursePoolId: id, copyName: name});
            }
        };
    }];
});
