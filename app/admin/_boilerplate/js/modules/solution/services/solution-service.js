/**
 * Created by choaklin on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/solution');
        });

        return {

            //== 新增
            save: function (appType, solution) {
                return base.all('create?appType=' + appType).post(solution);
            },

            //== 查看
            getById: function (solutionId) {
                return base.one('get/' + solutionId).get();
            },

            listRecord: function (solutionId) {
                return base.one('listRecord/' + solutionId).get();
            },

            getJobGrade: function (solutionId) {
                return base.one('listJobGrade/' + solutionId).get();
            },

            getJobGradeLessonList: function (jobGradeId, lessonName) {
                return base.one('getJobGradeLessonList/' + jobGradeId + '?lessonName=' + lessonName).get();
            },

            getLessonList: function (solutionId) {
                return base.one('getPackageLessonList/' + solutionId).get();
            },


            //== 推送
            send: function (solutionId, sendingConfigList) {
                return base.all('sendSolution/' + solutionId).post(sendingConfigList);
            },


            //== 作废
            remove: function (solutionId) {
                return base.one('invalid/' + solutionId).get();
            }
        };
    }];
});
