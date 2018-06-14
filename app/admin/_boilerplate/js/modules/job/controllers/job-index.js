define(function () {
    'use strict';
    return ['$scope', 'jobService', '$state', function ($scope, jobService, $state) {

        $scope.model = {
            totalCredits: 0,
            jobname: null,
            param: {
                jobGradeId: null,
                courseName: null
            },
            courseInfos: null
        };
        $scope.noData = false;
        $scope.noJob = false;

        $scope.events = {
            editNew: function (e) {
                e.preventDefault();
                $state.go('states.job.editNew');
            },

            edit: function (e, dataItem) {
                e.preventDefault();
                $state.go('states.job.edit', {
                    jobId: dataItem.id
                });

            },
            deleteJob: function (e, dataItem) {
                e.stopPropagation();
                //console.log(dataItem.name + "deleteJob" + dataItem.id);
                $scope.globle.confirm('删除', '确定要删除该岗位吗？', function (dialog) {
                    return jobService.deleteJob(dataItem.id).then(function (data) {
                        dialog.doRightClose();
                        if (data.status) {
                            $scope.globle.showTip('删除岗位成功！', 'success');
                            $scope.events.queryJob();
                        } else {
                            $scope.globle.showTip('删除岗位失败！', 'error');
                        }
                    });
                });

            },
            search: function () {
                //console.log("aaa");
            },
            queryJob: function () {
                jobService.queryJob($scope.model.jobname).then(function (data) {

                    if (data.status) {
                        $scope.jobInfos = data.info;
                        if ($scope.jobInfos.length <= 0) {
                            $scope.courseInfos = [];
                            $scope.model.totalCredits = 0;
                            $scope.model.param.jobGradeId = null;
                            $scope.noJob = true;
                            $scope.noData = true;
                        } else {
                            angular.forEach(data.info, function (item, index) {

                                if (index == 0 && item) {
                                    $scope.jobId = item.id;
                                    if (item.listjobInfo) {
                                        $scope.events.firstLoadCourse(item.listjobInfo[0]);
                                    }
                                }

                            });
                            $scope.noJob = false;
                        }
                    }
                });
            },
            queryCourse: function (e, dataItem) {

                e.stopPropagation();
                e.preventDefault();
                if (dataItem) {
                    $scope.model.param.jobGradeId = dataItem.id;
                    $scope.model.param.courseName = null;
                }
                jobService.listJobGradeLessons($scope.model.param.jobGradeId, $scope.model.param.courseName).then(function (data) {
                    if (data.status) {
                        $scope.courseInfos = data.info;
                        $scope.model.totalCredits = 0;
                        if ($scope.courseInfos.length <= 0) {
                            $scope.noData = true;
                        } else {
                            angular.forEach($scope.courseInfos, function (item, index) {

                                $scope.model.totalCredits += item.credit;

                            });
                            $scope.noData = false;
                        }
                    }
                });
                //console.log(dataItem.name + "queryCourse" + dataItem.id);
            },
            firstLoadCourse: function (dataItem) {

                if (dataItem) {
                    $scope.model.param.jobGradeId = dataItem.id;
                    $scope.model.param.courseName = null;
                }
                jobService.listJobGradeLessons($scope.model.param.jobGradeId, $scope.model.param.courseName).then(function (data) {
                    if (data.status) {
                        $scope.courseInfos = data.info;
                        $scope.model.totalCredits = 0;
                        if ($scope.courseInfos.length <= 0) {
                            $scope.noData = true;
                        } else {
                            angular.forEach($scope.courseInfos, function (item, index) {
                                $scope.model.totalCredits += item.credit;
                            });
                            $scope.noData = false;
                        }
                    }
                });
            },
            backLoadCourse: function (id) {

                if (id) {
                    $scope.model.param.jobGradeId = id;
                    $scope.model.param.courseName = null;
                }
                jobService.listJobGradeLessons($scope.model.param.jobGradeId, $scope.model.param.courseName).then(function (data) {
                    $scope.courseInfos = data.info;
                    $scope.model.totalCredits = 0;
                    angular.forEach($scope.courseInfos, function (item, index) {
                        $scope.model.totalCredits += item.credit;
                    });
                });
            },
            deleteJobGradeCourse: function (e, lessonId) {
                e.preventDefault();
                e.stopPropagation();
                $scope.globle.confirm('删除', '确定要删除该课程？', function (dialog) {
                    //console.log(lessonId);
                    return jobService.deleteJobGradeCourse($scope.model.param.jobGradeId, lessonId).then(function (data) {
                        dialog.doRightClose();
                        if (data.status) {
                            $scope.globle.showTip('删除课程成功！', 'success');
                            $scope.events.backLoadCourse($scope.model.param.jobGradeId);
                        } else {
                            $scope.globle.showTip('删除课程失败！', 'error');
                        }
                    });
                });
            }

        };
        $scope.erji0 = true;

        $scope.events.queryJob();

    }];
});
