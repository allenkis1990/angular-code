/**
 * Created by Administrator on 2015/7/9.
 */
define(function () {

    return ['Restangular', function (Restangular) {

        var baseCommod = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/commodityManager');
        });
        var baseClassInfo = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/classInfo');
        });
        var baseCus = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/customerService');
        });
        var baseCourse = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/customerServiceCourseStudy');
        });
        return {
            fn: function () {
                alert(1);
            },
            getChapterDetail: function (params) {
                return baseClassInfo.one('getChapterDetail').get(params);
            },
            getCoursesLearningInfo: function (params) {
                return baseClassInfo.one('getCoursesLearningInfo').get(params);
            },
            getUserTrainingYears: function (params) {
                return baseClassInfo.one('getUserTrainingYears').get(params);
            },
            getUserTitleLevels: function (params) {
                return baseClassInfo.one('getUserTitleLevels').get(params);
            },
            quickenedCourseLearning: function (params) {
                return baseClassInfo.all('quickenedCourseLearning').post(params);
            },
            getCoursesLearningInfoAll: function (params) {
                return baseClassInfo.one('getCoursesLearningInfoAll').get(params);
            },
            getClassExams: function (params) {
                return baseClassInfo.one('getClassExams').get(params);
            },
            deleteExamTimesDetail: function (params) {
                return baseClassInfo.all('deleteExamTimesDetail').post(params);
            },
            oneKeyCourseLearned: function (params) {
                return baseClassInfo.all('oneKeyCourseLearned').post(params);
            },
            oneKeyPassForClass: function (params) {
                return baseClassInfo.all('oneKeyPassForClass').post(params);
            },
            oneKeyCourseWareLearned: function (params) {
                return baseClassInfo.all('oneKeyCourseWareLearned').post(params);
            },
            getTrainClassInfo: function (params) {
                return baseCus.one('getTrainClassInfo').get(params);
            },
            getPurchaseCourseInfo: function (params) {
                return baseCourse.one('userPurchaseCourseDetail').get(params);
            },
            oneKeyPassForCourse: function (params) {
                return baseCourse.all('oneKeyPassForCourse').post(params);
            },
            getHistoryPracticeInfo: function (params) {
                return baseCourse.one('getHistoryPracticeInfo').get(params);
            },
            deleteHistoryPracticeInfo: function (params) {
                return baseCourse.one('deleteHistoryPracticeInfo').get(params);
            }
        };
    }];
});
