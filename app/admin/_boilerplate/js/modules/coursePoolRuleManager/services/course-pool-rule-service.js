/**
 * Created by ljl on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/coursePoolRuleAction');
        });

        return {
            /**
             * 查询课程包信息
             */
            findCoursePoolRule: function (id) {
                return base.one('findCoursePoolRule').get({ruleId: id});
            },
            /**
             * 更新课程池信息
             */
            updateCoursePoolRule: function (coursePoolRule) {
                return base.all('updateCoursePoolRule').post(coursePoolRule);
            },
            /**
             * 删除课程池信息
             */
            deleteCoursePoolRule: function (id) {
                return base.one('deleteCoursePoolRule').get({ruleId: id});
            },
            /**
             * 新增课程池信息
             */
            addCoursePoolRule: function (coursePoolRule) {
                return base.all('addCoursePoolRule').post(coursePoolRule);
            },
            /**
             * 课程池是否被引用
             */
            hasReference: function (id) {
                return base.one('hasReference').get({ruleId: id});
            }

        };
    }];
});
