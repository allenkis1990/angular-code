/**
 * Created by linj on 2016/9/13
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/courseManager');
        });

        return {
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

            enable: function (params) {
                return base.one('enable').get(params);
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
                return base.one('findCourseInfo').get({courseId: courseId});
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
            createCourse: function (course) {
                return base.all('createCourse').post(course);
            },
            updateCourseInfo: function (course) {
                return base.all('updateCourseInfo').post(course);
            },
            updateCourse: function (course) {
                return base.all('updateCourse').post(course);
            },
            saveCourseOutlines: function (params) {
                return base.all('saveCourseOutlines').post(params);
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
