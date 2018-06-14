define(function (testResult) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'testResultService', '$stateParams', '$dialog', '$http', function ($scope, testResultService, $stateParams, $dialog, $http) {
            $scope.model = {};


            $scope.events = {
                //整班重学
                classRelearn: function () {
                    $dialog.confirm({
                        title: '提示',
                        visible: true,
                        modal: true,
                        width: 250,
                        ok: function () {
                            $scope.events.sureReLearnClass();
                            return true;
                        },
                        cancel: function () {
                            return true;
                        },
                        content: '重学培训班将清空本班已有学习记录（无需重新选课）、考试成绩 是否确认重学当前培训班？'
                    });
                },

                sureReLearnClass: function () {
                    $scope.lwhLoading = true;
                    $http.get('/web/front/myClass/relearnClass', {
                        params: {
                            classId: $stateParams.id
                        }
                    }).success(function (data) {
                        $scope.lwhLoading = false;
                        if (data.status) {
                            $scope.model.showSuccessRelearnMsg = true;
                        } else {
                            $dialog.alert({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {

                                    return true;
                                },
                                content: data.info
                            });
                        }
                    });
                }
            };

            testResultService.getExamResultInfo({
                classId: $stateParams.id
            }).then(function (data) {
                if (data.status) {
                    $scope.model.testResult = data.info;
                    if ($scope.model.testResult.examinationResult === -1) {
                        $scope.model.testResult.examResult = '未考核';
                    } else if ($scope.model.testResult.examinationResult === 0) {
                        $scope.model.testResult.examResult = '未通过';
                    } else {
                        $scope.model.testResult.examResult = '通过';
                    }
                }
            });
        }]
    };
});