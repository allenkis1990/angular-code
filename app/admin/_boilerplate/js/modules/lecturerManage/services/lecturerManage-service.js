/**
 * Created by ljl on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/lesson');
        });

        var userBase = Restangular.withConfig(function (config) {//用户的信息
            config.setBaseUrl('/web/admin/lecturerManage');
        });

        return {

            /**
             * 获取所有角色
             */
            getAllRole: function () {
                return userBase.one('findRoleList').get();
            },


            /**
             * 查询是否还有子类型
             * @param id
             * @returns {*}
             */
            findHashLessonType: function (id) {
                return base.one('hashLessonType').get({categoryId: id});
            },


            /**
             * 查询历史上传的课件
             * @param id
             * @returns {*}
             */
            findHistorCourseware: function (params) {
                return base.one('findHistorCourseware').get(params);
            },


            /**
             * 启用课程
             * @param id
             * @returns {*}
             */
            enableCourses: function (id) {
                return base.one('enableCourses').get({courseId: id});
            },
            /**
             * 查找课程
             * @param id
             * @returns {*}
             */
            findCourse: function (courseId) {
                return base.one('findCourse').get({courseId: courseId});
            },
            findLessonInfo: function (courseId) {
                return base.one('findLessonInfo').get({courseId: courseId});
            },
            findCourseReviewPage: function (pageNo, pageSize, courseId) {
                return base.one('findCourseReviewPage').get({courseId: courseId, pageNo: pageNo, pageSize: pageSize});
            },
            exchangeCourseOutlineSort: function (firstOutlineId, secondOutlineId) {
                return base.one('exchangeCourseOutlineSort').get({
                    firstOutlineId: firstOutlineId,
                    secondOutlineId: secondOutlineId
                });
            },
            findLessonProvider: function () {
                return base.one('findLessonProvider').get();
            },
            deleteCourseOutline: function (courseOutlineId) {
                return base.one('deleteCourseOutline').get({courseOutlineId: courseOutlineId});
            },
            deleteCourse: function (courseId) {
                return base.one('deleteCourse').get({courseId: courseId});
            },
            updateCourseOutlineName: function (id, name) {
                return base.one('updateCourseOutlineName').get({id: id, name: name});
            },
            updateCourseOutlineSort: function (id, sort) {
                return base.one('updateCourseOutlineSort').get({id: id, sort: sort});
            },

            /**
             * 创建管理员
             * @param administrator
             * @returns {*|{}|{method, params, headers}}
             */
            createAdministrator: function (administrator) {
                return userBase.all('create/' + administrator.administratorId).post(administrator);
            },


            /**
             * 管理员添加角色
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            authority: function (administratorId, roleId) {
                return userBase.all('authority/' + administratorId + '/' + roleId).post();
            },


            /**
             * 根据roleIds获取角色
             */
            getRoleListByRoleIds: function (roleList) {
                return userBase.all('getRoleListByRoleIds').post({'roleList': roleList});
            },


            /**
             * 管理员添加角色-批量
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            authorityBatchRole: function (administratorId, roleList) {
                return userBase.all('authorityBatchRole/' + administratorId).post({'roleList': roleList});
            },

            /**
             * 管理员取消角色
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            cancelAuthority: function (administratorId, roleId) {
                return userBase.all('cancelAuthority/' + administratorId + '/' + roleId).post();
            },


            /**
             * 启用
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            enable: function (administratorId) {
                return userBase.all('enableUser/' + administratorId).post();
            },


            /**
             * 禁用
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            suspend: function (administratorId) {
                return userBase.all('suspendUser/' + administratorId).post();
            },

            /**
             * 禁用
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            remove: function (administratorId) {
                return userBase.all('deleteUser/' + administratorId).post();
            },

            /**
             * 重置密码
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            resetPassword: function (administratorId, resertPassword) {
                return userBase.all('resetPassword/' + administratorId + '/' + resertPassword).post();
            },

            /**
             * 用户详情
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            getUserInfoByUserId: function (administratorId) {
                return userBase.one('getUserInfoByUserId/' + administratorId).get();
            },

            /**
             * 用户详情--修改
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            getUserDetailInfoByUserId: function (administratorId) {
                return userBase.one('getUserDetailInfoByUserId/' + administratorId).get();
            },

            /**
             * 获取用户的角色-字符串
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            getUserRoleListString: function (administratorId) {
                return userBase.one('getUserRoleListString/' + administratorId).get();
            },

            /**
             * 获取用户的角色集合
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            findUserRoleList: function (administratorId) {
                return userBase.one('findUserRoleList/' + administratorId).get();
            },


            /**
             * 获取角色集合
             * @param administratorId
             * @returns {*|{}|{method, params, headers}}
             */
            findAllRole: function () {
                return userBase.one('findAllRole').get();
            },


            updateCourse: function (course) {
                return base.all('updateCourse').post(course);
            },

            saveLesson: function (params) {
                return base.all('saveLesson').post(params);
            },

            createCourseware: function (params) {
                return base.all('createCourseware').post(params);
            },

            saveCourseOutline: function (courseOutline) {
                return base.all('createCourseOutline').post(courseOutline);
            }
        };
    }];
});
