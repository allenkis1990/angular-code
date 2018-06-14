define(function () {
    'use strict';
    return ['$scope', 'falseLearningService', 'HB_notification',
        function ($scope, falseLearningService, HB_notification) {

            $scope.model = {
                operationModel: 'view',
                configDetail: {
                    configId: null,
                    interceptMode: 0,
                    enableRandomWithoutQuestion: false,
                    popForm: 0,
                    verificationForm: 0,
                    verificationFormValue: 0,
                    triggerForm: 2,
                    triggerFormValue: 0,
                    enableStatue: 0,
                    lastUpdateUser: '-',
                    lastUpdateTime: '-'
                }
            };


            $scope.events = {

                /**
                 * 配置信息--查询
                 */
                getUniqueConfig: function () {
                    falseLearningService.getUniqueConfig().then(function (data) {
                        if (data.status && data.info.configId != null) {
                            $scope.model.configDetail = data.info;
                        }
                    });
                },
                /**
                 * 进入编辑状态
                 */
                enterEdit: function () {
                    $scope.model.operationModel = 'edit';
                    $scope.configCopy = angular.copy($scope.model.configDetail);
                },
                //停用/启用
                changeState: function () {
                    if ($scope.model.operationModel == 'edit') {
                        if ($scope.model.configDetail.enableStatue == 0) {
                            $scope.model.configDetail.enableStatue = 1;
                        } else {
                            $scope.model.configDetail.enableStatue = 0;
                        }
                    }
                },
                //无知识点是否启用随机弹提
                isEnableRandomWithoutQuestion: function () {
                    if ($scope.model.configDetail.enableStatue == 1 && $scope.model.operationModel == 'edit') {
                        $scope.model.configDetail.enableRandomWithoutQuestion = !$scope.model.configDetail.enableRandomWithoutQuestion;
                    }
                },
                /**
                 * 配置信息--保存/或者更新
                 */
                save: function () {
                    //启用状态下才验证数据有效性
                    if ($scope.model.configDetail.enableStatue == 1) {

                        if ($scope.model.configDetail.verificationForm == 1 && $scope.model.configDetail.verificationFormValue <= 0) {
                            $scope.globle.alert('提示', '可答次数必须大于0');
                            return;
                        }
                        if ($scope.model.configDetail.interceptMode == 1 || $scope.model.configDetail.enableRandomWithoutQuestion) {
                            if ($scope.model.configDetail.triggerFormValue <= 0) {
                                $scope.globle.alert('提示', $scope.model.configDetail.triggerForm == 2 ? '课件间隔时间必须大于0' : '进度百分比必须大于0');
                                return;
                            }
                            if ($scope.model.configDetail.triggerForm == 1 && $scope.model.configDetail.triggerFormValue > 100) {
                                $scope.globle.alert('提示', '进度百分比必须小于等于100');
                                return;
                            }
                        }
                    }
                    if ($scope.model.configDetail.configId == null) {
                        falseLearningService.add($scope.model.configDetail).then(function (data) {
                            if (data.status) {
                                $scope.model.operationModel = 'view';
                                $scope.globle.alert('提示', '保存成功！');
                            } else {
                                $scope.globle.alert('提示', data.info);
                            }
                        });
                    } else {
                        falseLearningService.update($scope.model.configDetail).then(function (data) {
                            if (data.status) {
                                $scope.model.operationModel = 'view';
                                $scope.globle.alert('提示', '修改成功！');
                            } else {
                                $scope.globle.alert('提示', data.info);
                            }
                        });
                    }
                },
                //取消操作
                cancel: function () {
                    $scope.model.operationModel = 'view';
                    $scope.model.configDetail = $scope.configCopy;
                }
            };


            $scope.events.getUniqueConfig();

        }


    ];
});
