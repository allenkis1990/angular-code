/**
 * Created by choaklin on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var lessonBase = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/lesson');
        });

        return {

            findLessonInfo: function (courseId) {
                return lessonBase.one('findLessonInfo').get({courseId: courseId});
            },
            findCourseReviewPage: function (pageNo, pageSize, courseId) {
                return lessonBase.one('findCourseReviewPage').get({
                    courseId: courseId,
                    pageNo: pageNo,
                    pageSize: pageSize
                });
            }
        };
    }];
});
