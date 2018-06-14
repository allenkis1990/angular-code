define(function () {
    'use strict';
    return ['$scope', 'KENDO_UI_EDITOR', '$state', '$stateParams', 'popQuestionManagerService',
        function ($scope, KENDO_UI_EDITOR, $state, $stateParams, popQuestionManagerService) {
            $scope.model = {
                optionIndex: 0,
                question: {},
                courseWareId: '',
                questionType: [
                    {name: '单选题', typeCode: 2},
                    {name: '多选题', typeCode: 3},
                    {name: '判断题', typeCode: 1}
                ]
            };
            $scope.radio = {
                radioSelected: '1',
                subRadioSelected: '1'
            };
            $scope.events = {
                setQuestionCount: function () {
                    var sum = $scope.model.question.configurationItems.length - $scope.model.questionCount;
                    if (sum == 0) {
                        return;
                    } else if (sum > 0) {
                        for (var i = 0; i < sum; i++) {
                            $scope.model.question.configurationItems.pop();
                            $scope.radio.radioSelected = $scope.model.questionCount;
                        }
                    } else {
                        for (var i = 0; i < (-sum); i++) {
                            $scope.model.question.configurationItems.push({
                                id: $scope.model.optionIndex++
                            });
                        }
                    }
                },
                digitalToLetter: function (index) {
                    return popQuestionManagerService.utils.digitalToLetter(index + 1);
                },
                checkMultiAnswers: function (id) {
                    var question = $scope.model.question;
                    var check = false;
                    var keepGoing = true;
                    _.forEach($scope.model.question.correctAnswers, function (answer, index) {
                        if (keepGoing) {
                            if (answer === id) {
                                check = true;
                                keepGoing = false;
                            }
                        }
                    });
                    return check;
                },
                /**
                 * 变保存方式为新增弹窗题
                 */
                changeButton: function () {
                    $scope.model.saveType = 1;
                },
                setMultipleQuestionAnswers: function (id) {
                    var deleteWay = false;
                    var deleteIndex;
                    var keepGoing = true;
                    _.forEach($scope.model.question.correctAnswers, function (varId, index) {
                        if (keepGoing && varId === id) {
                            deleteWay = true;
                            deleteIndex = index;
                            keepGoing = false;
                        }
                    });
                    if (deleteWay) {
                        $scope.model.question.correctAnswers.splice(deleteIndex, 1);
                    } else {
                        $scope.model.question.correctAnswers.push(id);
                    }
                },
                /**修改弹窗题**/
                modify: function (type) {
                    var question = angular.copy($scope.model.question);
                    // var examObjects = [{
                    //     type:'courseWareId',
                    //     objectId:courseWareId
                    // }];
                    // question.examObjects = examObjects;

                    if (!checkQuestion(question)) {
                        return;
                    }
                    if ($scope.addPopQuestionFrom.$valid) {
                        switch ($scope.model.question.questionType) {
                            case parseInt(popQuestionManagerService.trueOrFalse):
                                break;
                            case parseInt(popQuestionManagerService.selectOne):
                                for (var i = 0; i < question.configurationItems.length; i++) {
                                    var item = question.configurationItems[i];
                                    if (i + 1 == $scope.radio.radioSelected) {
                                        question.correctAnswer = item.id + '';
                                        break;
                                    }
                                }
                                break;
                            case parseInt(popQuestionManagerService.multiSelect):
                                if (question.correctAnswers.length < 1) {
                                    $scope.globle.showTip('请至少选择一个正确选项', 'error');
                                    return;
                                }
                                break;
                        }
                        if ($scope.model.question.hour === null || $scope.model.question.hour === '')
                            $scope.model.question.hour = 0;
                        if ($scope.model.question.minute === null || $scope.model.question.minute === '')
                            $scope.model.question.minute = 0;
                        if ($scope.model.question.second === null || $scope.model.question.second === '')
                            $scope.model.question.second = 0;
                        $scope.timePoint = parseInt($scope.model.question.hour * 3600) + parseInt($scope.model.question.minute * 60) + parseInt($scope.model.question.second);
                        if ($scope.model.popQuestionId === null || $scope.model.popQuestionId === '') {
                            $scope.globle.alert('弹窗题不存在');
                        } else {
                            popQuestionManagerService.updatePopQuestion(question, $scope.model.question.questionType, $scope.timePoint, $scope.model.popQuestionId, 'updatePopToCourseWare').then(function (data) {
                                if (!data.status) {
                                    $scope.globle.alert('创建失败!', data.info);
                                } else {
                                    $state.go('states.popQuestionManager').then(function () {
                                        $state.reload($state.current);
                                    });
                                }
                            });
                        }
                    } else {
                        $scope.globle.showTip('试题信息不完整', 'error');
                    }
                    ;
                },
                /**新建弹窗题**/
                save: function (type) {
                    var question = angular.copy($scope.model.question);
                    if (!checkQuestion(question)) {
                        return;
                    }
                    if ($scope.addPopQuestionFrom.$valid) {
                        switch ($scope.model.question.questionType) {
                            case parseInt(popQuestionManagerService.trueOrFalse):
                                break;
                            case parseInt(popQuestionManagerService.selectOne):
                                for (var i = 0; i < question.configurationItems.length; i++) {
                                    var item = question.configurationItems[i];
                                    if (i + 1 == $scope.radio.radioSelected) {
                                        question.correctAnswer = item.id + '';
                                        break;
                                    }
                                }
                                break;
                            case parseInt(popQuestionManagerService.multiSelect):
                                if (question.correctAnswers.length < 1) {
                                    $scope.globle.showTip('请至少选择一个正确选项', 'error');
                                    return;
                                }
                                break;
                        }
                        if ($scope.model.question.hour === null || $scope.model.question.hour === '')
                            $scope.model.question.hour = 0;
                        if ($scope.model.question.minute === null || $scope.model.question.minute === '')
                            $scope.model.question.minute = 0;
                        if ($scope.model.question.second === null || $scope.model.question.second === '')
                            $scope.model.question.second = 0;
                        $scope.timePoint = parseInt($scope.model.question.hour * 3600) + parseInt($scope.model.question.minute * 60) + parseInt($scope.model.question.second);
                        popQuestionManagerService.createPopQuestion(question, $scope.courseWareId, $scope.timePoint, 'addPopToCourseWare', $scope.model.question.questionType).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('创建失败!', data.info);
                            } else {
                                $scope.globle.showTip('保存成功', 'success');
                                $state.go('states.popQuestionManager').then(function () {
                                    $state.reload($state.current);
                                });
                            }
                        });
                    } else {
                        $scope.globle.showTip('试题信息不完整', 'error');
                    }
                    ;
                }
            };

            /** 校验试题模型 **/
            function checkQuestion (question) {
                if (question.topic == null || question.topic === '') {
                    $scope.globle.showTip('试题题目不能为空', 'error');
                    return false;
                }
                if (!$scope.model.passTimePoint) {
                    if ($scope.addPopQuestionFrom.hour.$error.pattern)
                        $scope.globle.showTip('弹窗时间点小时格式错误', 'error');
                    return false;
                    if ($scope.addPopQuestionFrom.minute.$error.pattern)
                        $scope.globle.showTip('弹窗时间点分钟格式错误', 'error');
                    return false;
                    if ($scope.addPopQuestionFrom.second.$error.pattern)
                        $scope.globle.showTip('弹窗时间点秒格式错误', 'error');
                    return false;
                }
                return true;
            };
            init();

            function init () {

                var questionId = $scope.$stateParams.questionId;
                var questionType = $scope.$stateParams.questionType;
                var popQuestionId = $scope.$stateParams.popQuestionId;
                $scope.model.popQuestionId = popQuestionId;
                popQuestionManagerService.findPopQuestionId(questionId, popQuestionId, questionType).then(function (data) {
                    if (data.status) {
                        $scope.model.question = data.info;
                        $scope.model.question.mode = '1';
                        $scope.model.question.enabled = 'true';
                        $scope.courseWareId = data.info.courseWareId;
                        //如果是单选题
                        if (questionType == popQuestionManagerService.selectOne) {
                            angular.forEach($scope.model.question.configurationItems, function (item, index) {
                                if (item.id == $scope.model.question.correctAnswer) {
                                    $scope.radio.radioSelected = index + 1;
                                }
                            });
                            $scope.model.question.correctAnswers = [];
                        }
                        if (questionType !== popQuestionManagerService.trueOrFalse) {
                            $scope.model.questionCount = $scope.model.question.configurationItems.length;
                            $scope.model.question.correct = 'true';
                        } else if (questionType == popQuestionManagerService.trueOrFalse) {
                            $scope.model.questionCount = 4;
                            $scope.model.question.configurationItems = [];
                            $scope.model.question.configurationItems = [{id: $scope.model.optionIndex++}, {id: $scope.model.optionIndex++},
                                {id: $scope.model.optionIndex++}, {id: $scope.model.optionIndex++}];
                            $scope.model.question.correct += '';
                        }
                        // /**课件时长初始化**/
                        $scope.hour = parseInt($scope.model.question.timeLength / 3600);
                        $scope.minute = parseInt(($scope.model.question.timeLength % 3600) / 60);
                        $scope.second = parseInt($scope.model.question.timeLength - $scope.minute * 60 - $scope.hour * 3600);
                        // /**弹窗时长初始化**/
                        $scope.model.question.hour = parseInt($scope.model.question.timePoint / 3600);
                        $scope.model.question.minute = parseInt(($scope.model.question.timePoint % 3600) / 60);
                        $scope.model.question.second = parseInt($scope.model.question.timePoint - $scope.model.question.minute * 60 - $scope.model.question.hour * 3600);

                        // var examObjects = [{
                        //     type:'courseWareId',
                        //     objectId:data.info.courseWareId
                        // }];
                        // $scope.model.question.examObjects=[];
                        // $scope.model.question.examObjects = examObjects;
                    } else {
                        $scope.globle.alert('查询试题信息失败!', data.info);
                    }
                });


                // $scope.updateQuestionShow  = true;
                // $scope.model.question      = {
                //     correctAnswers    : [],
                //     topic             : null,
                //     configurationItems: [{ id: $scope.model.optionIndex++ }, { id: $scope.model.optionIndex++ },
                //         { id: $scope.model.optionIndex++ }, { id: $scope.model.optionIndex++ }],
                //     mode              : '1',
                //     questionType      : 2,
                //     enabled           : 'true',
                //     standard          : '45',
                //     correct           : 'true',
                //     sequence          : 'true',
                //     answerType        : 2,
                //     answersGroup      : [['']],
                //     answerCount       : 1,
                //     correctAnswer     : null
                // };
            }

            $scope.$watch('model.nowTimePoint', function () {
                if ($scope.model.nowTimePoint >= 0 && $scope.model.nowTimePoint < $scope.model.question.timeLength) {
                    $scope.model.passTimePoint = true;
                } else {
                    $scope.model.passTimePoint = false;
                }
            });
            $scope.$watch('model.question.hour', function () {
                $scope.model.nowTimePoint = parseInt($scope.model.question.hour) * 3600 + parseInt($scope.model.question.minute) * 60 + parseInt($scope.model.question.second);
            });
            $scope.$watch('model.question.minute', function () {
                $scope.model.nowTimePoint = parseInt($scope.model.question.hour) * 3600 + parseInt($scope.model.question.minute) * 60 + parseInt($scope.model.question.second);
            });
            $scope.$watch('model.question.second', function () {
                $scope.model.nowTimePoint = parseInt($scope.model.question.hour) * 3600 + parseInt($scope.model.question.minute) * 60 + parseInt($scope.model.question.second);
            });

            var utils = {
                setTime: function (time) {
                    var hour = (time - time % 3600) / 3600;
                    var min = ((time % 3600) - (time % 3600) % 60) / 60;
                    var sec = time % 3600 % 60;
                    return hour + '时' + min + '分' + sec + '秒';
                }
            };

        }];
});