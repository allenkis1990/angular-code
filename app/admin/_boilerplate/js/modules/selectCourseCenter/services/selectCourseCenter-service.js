/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/chooseCourse');
        });

        var lessonBase = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/lesson');
        });
        //var employeeOne = base.one('employee'),
        //    employeeAll = base.all('employee');

        return {
            //添加选修课
            save: function (courseDtoList) {
                return base.all('create').post(courseDtoList);
            },
            //删除选修课（一个或多个）
            deleteChooseCourse: function (courseIdList) {
                return base.all('deleteById').post(courseIdList);
            },
            //获取所选选修课详情
            getDetails: function (userId) {
                return base.one('getDetails').get({userId: userId});
            },
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
