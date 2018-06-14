/**
 * Created by ljl on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/trainClass');
        });
        var lesson = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/lesson');
        });
        var exam = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/');
        });
        return {
            /**
             * 查询是否还有子类型
             * @param id
             * @returns {*}
             */
            hashTrainClassType: function (id) {
                return base.one('hashTrainClassType').get({categoryId: id});
            },
            /**
             * 查询是否还有子类型
             * @param id
             * @returns {*}
             */
            hashExamPaperType: function (id) {
                return base.one('hashExamPaperType').get({categoryId: id});
            },

            createTrainClassInfo: function (trainClss) {
                return base.all('createTrainClassInfo').post(trainClss);
            },
            createTrainClassCourse: function (trainClassLesson) {
                return base.all('createTrainClassCourse').post(trainClassLesson);
            },
            updateTrainClassCourse: function (trainClassLesson) {
                return base.all('updateTrainClassCourse').post(trainClassLesson);
            },
            createUser: function (data) {
                return base.all('createUser').post(data);
            },

            /**获取培训班课程统计
             *
             * @param params
             * @returns {*}
             */
            getTrainClassLessonCounts: function (params) {
                return base.one('getTrainClassLessonCounts').get(params);
            },
            /**获取培训班课程统计
             *
             * @param params
             * @returns {*}
             */
            findTrainClassInfo: function (trnId) {
                return base.one('findTrainClassInfo').get({trnId: trnId});
            },
            findTrainClassLessons: function (trnId) {
                return base.one('findTrainClassLessons').get({trnId: trnId});
            },
            operatingExam: function (trnId, released) {
                return base.one('operatingExam').get({id: trnId, released: released});
            },
            operatingTrainClass: function (trnId, state, quantity) {
                return base.one('operatingTrainClass').get({trnId: trnId, state: state, quantity: quantity});
            },
            deleteTrainClass: function (trnId) {
                return base.one('deleteTrainClass').get({trnId: trnId});
            },
            findTrainClassExam: function (trnId) {
                return base.one('findTrainClassExam').get({trnId: trnId});
            },
            loadTrainPersonalAssess: function (trnId) {
                return base.one('loadTrainPersonalAssess').get({trnId: trnId});
            },
            publishTrain: function (trnId) {
                return base.one('publishTrain').get({trnId: trnId});
            },
            /**创建培训班考试
             *
             * @param params
             * @returns {*}
             */
            releaseExam: function (paper) {
                return base.all('createTrainClassExam').post(paper);
            },
            /**更新培训班考试
             *
             * @param params
             * @returns {*}
             */
            updateTrainClassExam: function (paper) {
                return base.all('updateTrainClassExam').post(paper);
            },
            /**创建培训班考试考核
             *
             * @param params
             * @returns {*}
             */
            releaseTrainClassAssess: function (createTrainClassAssess) {
                return base.all('releaseTrainClassAssess').post(createTrainClassAssess);
            },
            findTrainEmployees: function (trnId) {
                return base.one('findTrainEmployees').get({trnId: trnId});
            },
            getUnitList: function (trnId) {
                return base.one('getUnitList').get({trnId: trnId});
            },
            findTrainJobs: function (trnId) {
                return base.one('findTrainJobs').get({trnId: trnId});
            },
            getCreateTrainUserData: function (trnId) {
                return base.one('getCreateTrainUserData').get({trnId: trnId});
            },
            getExamViewUrl: function (id, requestType) {
                return base.one('getPreviewRootUrl').get({id: id, requestType: requestType});
            },
            /**
             * 获取培训班下的课程总数
             * @param trainClassId
             * @returns {*}
             */
            getCourseTotalCountByTrainClassId: function (trainClassId) {
                return base.one('getCourseTotalCountByTrainClassId').get({trainClassId: trainClassId});
            },
            /**
             * 获取培训班下的学员总数
             * @param trainClassId
             * @returns {*}
             */
            getStudentTotalCountByTrainClassId: function (trainClassId) {
                return base.one('getStudentTotalCountByTrainClassId').get({trainClassId: trainClassId});
            },
            /**
             * 查询课程分类是否还有子分类
             * @param id
             * @returns {*}
             */
            findHashLessonType: function (id) {
                return lesson.one('hashLessonType').get({categoryId: id});
            },
            /**
             * 根据培训班id获取培训班的考核规则
             * @param id
             * @returns {*}
             */
            getTrainClassAssessRule: function (id) {
                return base.one('getTrainClassAssessRule').get({trainClassId: id});
            },
            /**
             * 根据培训班id获取培训班考核通过人数
             * @param id
             * @returns {*}
             */
            getPassAssessStudentTotalCount: function (id) {
                return base.one('GetPassAssessStudentTotalCount').get({trainClassId: id});
            }
            ,
            /**
             * 验证试卷是否包含主观题，包含返回true，不包含返回false
             *
             * @param id
             * @returns {*}
             */
            checkExamPaperIncludeSubjectiveQuestion: function (id) {
                return base.one('checkExamPaperIncludeSubjectiveQuestion').get({examPaperId: id});
            }
        };
    }];
});
