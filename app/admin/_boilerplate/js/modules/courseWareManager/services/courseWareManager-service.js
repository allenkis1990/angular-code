/**
 * Created by linj on 2016/9/13
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/courseWareManager');

        });
        var courseBase = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/courseManager');
        });
        return {
            getAllPopsByCwId: function (courseWareId) {
                return base.one('getAllPopsByCwId').get({courseWareId: courseWareId});
            },
            /**
             * 查询是否还有子类型
             * @param id
             * @returns {*}
             */
            hasChild: function (id) {
                return base.one('hasChild').get({categoryId: id});
            },
            /**
             * 启用课件
             * @param id
             * @returns {*}
             */
            setCourseWareUsable: function (id, usable) {
                return base.one('updateCourseWareUsable').get({id: id, isUsable: usable});
            },
            findCourseReviewPage: function (pageNo, pageSize, courseId) {
                return base.one('findCourseWarePage').get({courseId: courseId, pageNo: pageNo, pageSize: pageSize});
            },
            findProvider: function () {

                return base.one('findProvider').get();
            },
            /**
             * 查找课程
             * @param id
             * @returns {*}
             */
            findCourseWare: function (courseWareId) {
                return base.one('findCourseWare').get({id: courseWareId});
            },
            deleteCourseWare: function (courseWareId) {
                return base.one('deleteCourseWare').get({id: courseWareId});
            },
            createCourseWare: function (courseWare) {
                return base.all('createCourseWare').post(courseWare);
            },
            updateCourseWare: function (courseWare) {
                return base.all('updateCourseWare').post(courseWare);
            },
            courseWareHasReference: function (courseWareId) {
                return base.one('courseWareHasReference').get({id: courseWareId});
            },
            /**
             * 创建弹窗题
             * @param model 试题基类
             * @param courseWareId 课件id
             * @param timePoint 时间点：秒
             * @param url
             * @param questionType
             * @returns {*|{}|{method, params, headers}}
             */
            createPopQuestion: function (model, courseWareId, timePoint, url, questionType) {
                var examObjects = [{
                    type: 'courseWareId',
                    objectId: courseWareId
                }];
                model.examObjects = examObjects;
                return base.all(url).post(model, {
                    questionType: questionType,
                    timePoint: timePoint,
                    courseWareId: courseWareId
                });
            },
            /**
             * 修改弹窗题
             * @param model 弹窗题
             * @param questionType 弹窗题类型
             * @param timePoint 时间点：秒
             * @param popQuestionId 弹窗题id
             * @returns {*|{}|{method, params, headers}}
             */
            updatePopQuestion: function (model, questionType, timePoint, popQuestionId, url) {
                return base.all(url).post(model, {
                    questionType: questionType,
                    timePoint: timePoint,
                    popQuestionId: popQuestionId
                });
            },
            /****
             * 删除弹窗题
             * @param questionId
             * @returns {*|{}|{method, params, headers}}
             */
            deletePopQuestion: function (questionId) {
                //console.log("questionId:" + questionId)
                return base.one('delPopQuestionById').get({questionId: questionId});
            },
            findCourseListByCourseWareId: function (courseWareId) {
                return courseBase.one('findCourseByCourseWareId').get({courseWareId: courseWareId});
            }
        };
    }];
});
