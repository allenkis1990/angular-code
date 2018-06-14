/**
 * Created by choaklin on 2015/7/13 11:56
 * Copyright 2015 HB, Inc. All rights reserved.
 */
define(function () {
    return ['Restangular', function (Restangular) {
        var base = Restangular.withConfig(function (config) {
            config.setBaseUrl('/web/admin/job');
        });

        return {

            save: function (job) {
                return base.all('create').post(job);
            },

            getById: function (jobId) {
                return base.one('get/' + jobId).get();
            },

            getJobGrade: function (jobId) {
                return base.one('listJobGrade/' + jobId).get();
            },

            update: function (job) {
                return base.all('update/' + job.id).post(job);
            },

            listAbility: function () {
                return base.one('listAbility').get();
            },
            getPackageLessonCounts: function (params) {
                return base.all('getPackageAvailableLessonCounts').post(params);
            },

            queryJob: function (keyword) {
                return base.one('queryJob').get({keyword: keyword});
            },
            deleteJob: function (jobId) {
                return base.one('deleteJob/' + jobId).get();
            },
            listJobGradeLessons: function (jobGradeId, lessonName) {
                return base.one('listJobGradeLesson/' + jobGradeId).get({lessonName: lessonName});
            },
            deleteJobGradeCourse: function (jobId, lessonId) {
                return base.one('deleteJobGradeCourse/' + jobId).get({lessonId: lessonId});
            }
        };
    }];
});
