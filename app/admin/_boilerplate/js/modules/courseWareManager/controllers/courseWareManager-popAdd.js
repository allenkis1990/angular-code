/**
 * Created by 陈祥 on 2016
 */


define(function () {
    'use strict';

    var controller = ['courseWareManagerService', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', '$scope', '$log', 'questionService', 'KENDO_UI_EDITOR', '$state',

        function (courseWareManagerService, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, $scope, $log, questionService, KENDO_UI_EDITOR, $state) {
            $scope.model = {
                saveType: 1, //1-保存，2-修改
                popQuestionId: null,
                addPopUrl: 'addPopToCourseWare',
                updatePopUrl: 'updatePopToCourseWare',
                //选择题id初始化
                optionIndex: 0,
                questionTypeName: '单选题', //初始化题型
                addQustionParentName: '',
                hour: 0,
                minute: 0,
                second: 0,
                nowTimePoint: 0,
                passTimePoint: true,
                popsInit: {},
                questionSelectionNumber: [
                    {name: '1', value: '1'}, {name: '2', value: '2'}, {name: '3', value: '3'},
                    {name: '4', value: '4'}, {name: '5', value: '5'}, {name: '6', value: '6'},
                    {name: '7', value: '7'}, {name: '8', value: '8'},
                    {name: '9', value: '9'}, {name: '10', value: '10'}
                ],
                questionType: [
                    {name: '单选题', typeCode: 2},
                    {name: '多选题', typeCode: 3},
                    {name: '判断题', typeCode: 1}
                ]
            };

            function PopsInit () {
                var courseWareId = $scope.$stateParams.courseWareId;
                courseWareManagerService.getAllPopsByCwId(courseWareId).then(function (data) {
                    if (data.status) {
                        $scope.model.popsInit = data.info;
                    } else {
                        $scope.globle.showTip('获取弹窗题列表失败，请重试', 'error');
                    }
                });
            }

            $scope.$watch('model.nowTimePoint', function () {
                if ($scope.model.nowTimePoint >= 0 && $scope.model.nowTimePoint < $scope.timeLength) {
                    $scope.model.passTimePoint = true;
                } else {
                    $scope.model.passTimePoint = false;
                }
            });
            $scope.$watch('model.hour', function () {
                $scope.model.nowTimePoint = parseInt($scope.model.hour) * 3600 + parseInt($scope.model.minute) * 60 + parseInt($scope.model.second);
            });
            $scope.$watch('model.minute', function () {
                $scope.model.nowTimePoint = parseInt($scope.model.hour) * 3600 + parseInt($scope.model.minute) * 60 + parseInt($scope.model.second);
            });
            $scope.$watch('model.second', function () {
                $scope.model.nowTimePoint = parseInt($scope.model.hour) * 3600 + parseInt($scope.model.minute) * 60 + parseInt($scope.model.second);
            });

            function init () {
                $scope.radio = {
                    radioSelected: '1'
                };
                $scope.courseWareName = $scope.$stateParams.courseWareName;
                $scope.timeLength = $scope.$stateParams.timeLength; //秒
                $scope.courseWareId = $scope.$stateParams.courseWareId; //课件id
                /**课件时长初始化**/
                $scope.hour = parseInt($scope.timeLength / 3600);
                $scope.minute = parseInt(($scope.timeLength % 3600) / 60);
                $scope.second = parseInt($scope.timeLength - $scope.minute * 60 - $scope.hour * 3600);

                $scope.updateQuestionShow = true;
                $scope.model.question = {
                    correctAnswers: [],
                    topic: null,
                    configurationItems: [{id: $scope.model.optionIndex++}, {id: $scope.model.optionIndex++},
                        {id: $scope.model.optionIndex++}, {id: $scope.model.optionIndex++}],
                    mode: '1',
                    questionType: 2,
                    enabled: 'true',
                    standard: '45',
                    correct: 'true',
                    sequence: 'true',
                    answerType: 2,
                    answersGroup: [['']],
                    answerCount: 1,
                    correctAnswer: null
                };
                $scope.model.questionCount = 4;
            }

            $scope.events = {
                /**
                 * 返回管理界面
                 * @param e
                 */
                back: function (e) {
                    $state.go('states.courseWareManager', 'index').then(function () {
                        //$scope.node.courseWareGrid.pager.page(1);
                        $scope.node.myselfCourseWareGrid.pager.page(1);
                        $scope.node.allCourseWareGrid.pager.page(1);
                    });

                    e.preventDefault();
                },
                formatAnswerAndOptions: function (answer) {
                    var ans1 = answer.split('<p>').join('');
                    var ans2 = ans1.split('</p>').join('');
                    return ans2;
                },
                changeButton: function () {
                    $scope.model.saveType = 1;
                },
                /**修改时刷新试题信息**/
                modifiedShow: function (index) {
                    $scope.model.saveType = 2;
                    var that = angular.copy($scope.model.popsInit[--index]);
                    $scope.model.popQuestionId = that.id;
                    /**回显**/
                    $scope.model.question.topic = that.topic;
                    $scope.model.question.description = that.description;
                    $scope.model.hour = parseInt(that.timePoint / 3600);
                    $scope.model.minute = parseInt((that.timePoint % 3600) / 60);
                    $scope.model.second = parseInt((that.timePoint % 3600) % 60);
                    if (that.questionType === '判断题') {
                        $scope.model.question.questionType = 1;
                        if (that.answer === '正确') {
                            $scope.model.question.correct = 'true';
                        } else {
                            $scope.model.question.correct = 'false';
                        }
                    } else if (that.questionType === '单选题') {
                        $scope.model.question.questionType = 2;
                        /****
                         * 选项回显
                         */
                        var popOptions = that.options.split(' ');
                        $scope.model.questionCount = popOptions.length - 1;
                        $scope.model.question.configurationItems = [];
                        $scope.model.optionIndex = 0;
                        var keepGoing = true;
                        _.forEach(popOptions, function (item, index) {
                            if (index === popOptions.length - 1) {
                                keepGoing = false;
                            }
                            if (keepGoing) {
                                var optionWord = item.substring(0, item.indexOf(':')); //选项字母
                                if (optionWord === that.answer.substring(0, item.indexOf(':'))) { //比较答案选项，回显答案
                                    $scope.radio.radioSelected = index + 1;
                                }
                                $scope.model.question.configurationItems.push({
                                    id: $scope.model.optionIndex++,
                                    content: item.substring(item.indexOf(':') + 1) //将选项内容截取出来
                                });
                            }
                        });
                    } else if (that.questionType === '多选题') {
                        $scope.model.question.questionType = 3;
                        /****
                         * 选项回显
                         */
                        var popOptions = that.options.split(' ');
                        var answer = that.answer.split(' ');
                        answer.splice(answer.length - 1, 1);
                        $scope.model.questionCount = popOptions.length - 1;
                        $scope.model.question.configurationItems = [];
                        $scope.model.optionIndex = 0;
                        var keepGoing = true;
                        _.forEach(popOptions, function (item, index) {
                            if (index === popOptions.length - 1) {
                                keepGoing = false;
                            }
                            if (keepGoing) {
                                $scope.model.question.configurationItems.push({
                                    id: $scope.model.optionIndex++,
                                    content: item.substring(item.indexOf(':') + 1) //将选项内容截取出来
                                });
                                _.forEach(answer, function (an, index) {
                                    var keepGoing2 = true;
                                    if (keepGoing2 && an.substring(0, an.indexOf(':')) === item.substring(0, item.indexOf(':'))) { //答案选项匹配
                                        $scope.model.question.correctAnswers.push($scope.model.optionIndex - 1);
                                        keepGoing2 = false;
                                    }
                                });
                            }
                        });
                    }
                },
                /**修改时回显多选题选项内容**/
                checkMultiAnswers: function (id) {
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
                delPop: function (questionId) {
                    $scope.globle.confirm('删除弹窗题', '确定要删除该弹窗题吗？', function (dialog) {
                        return courseWareManagerService.deletePopQuestion(questionId).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                PopsInit();
                                if (questionId === $scope.model.popQuestionId) {
                                    $scope.model.popQuestionId = null;
                                }
                                $scope.globle.showTip('删除成功', 'success');
                            } else {
                                $scope.globle.alert('删除失败', data.info);
                            }
                        });
                    });
                },
                formatTimePoint: function (time) {
                    time = Number(time);
                    var hour = parseInt(time / 3600);
                    var minute = parseInt((time - hour * 3600) / 60);
                    var second = parseInt(time - hour * 3600 - minute * 60);
                    return hour + '时' + minute + '分' + second + '秒';
                },
                setAnswerCount: function () {
                    if ($scope.model.question.answerType == 2) {
                        var sum = $scope.model.question.answersGroup.length - $scope.model.question.answerCount;
                        if (sum == 0) {
                            return;
                        } else if (sum > 0) {
                            for (var i = 0; i < sum; i++) {
                                $scope.model.question.answersGroup.pop();
                            }
                        } else {
                            for (var i = 0; i < (-sum); i++) {
                                $scope.model.question.answersGroup.push(['']);
                            }
                        }
                    } else if ($scope.model.question.answerType == 1) {
                        _.forEach($scope.model.question.answersGroup, function (answers) {
                            var sum = answers.length - $scope.model.question.answerCount;
                            if (sum == 0) {
                                return;
                            } else if (sum > 0) {
                                for (var i = 0; i < sum; i++) {
                                    answers.pop();
                                }
                            } else {
                                for (var i = 0; i < (-sum); i++) {
                                    answers.push('');
                                }
                            }
                        });
                    }
                },
                digitalToLetter: function (index) {
                    return questionService.utils.digitalToLetter(index + 1);
                },
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
                removeAlternativeAnswers: function (index1, index2) {
                    _.forEach($scope.model.question.answersGroup, function (value, index) {
                        if (index == index1) {
                            value.splice(index2, 1);
                        }
                    });
                },
                addAlternativeAnswers: function (index) {
                    var answers = $scope.model.question.answersGroup[index];
                    answers.push(' ');
                },
                /**新增多选题，选中答案项**/
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
                addAnswerGroup: function () {
                    var answers = [];
                    for (var i = 0; i < $scope.model.question.answerCount; i++) {
                        answers.push('');
                    }
                    $scope.model.question.answersGroup.push(answers);
                },
                deleteAnswerGroup: function (index) {
                    if ($scope.model.question.answersGroup.length == 1) {
                        return;
                    }
                    $scope.model.question.answersGroup.splice(index, 1);
                },
                /**修改弹窗题**/
                modify: function (type) {
                    var question = angular.copy($scope.model.question);
                    if (!checkQuestion(question)) {
                        return;
                    }
                    if ($scope.addPopQuestionFrom.$valid) {
                        switch ($scope.model.question.questionType) {
                            case parseInt(questionService.trueOrFalse):
                                break;
                            case parseInt(questionService.selectOne):
                                for (var i = 0; i < question.configurationItems.length; i++) {
                                    var item = question.configurationItems[i];
                                    if (i + 1 == $scope.radio.radioSelected) {
                                        question.correctAnswer = item.id + '';
                                        break;
                                    }
                                }
                                break;
                            case parseInt(questionService.multiSelect):
                                if (question.correctAnswers.length < 1) {
                                    $scope.globle.showTip('请至少现在一个正确选项', 'error');
                                    return;
                                }
                                break;
                        }
                        if ($scope.model.hour === null || $scope.model.hour === '')
                            $scope.model.hour = 0;
                        if ($scope.model.minute === null || $scope.model.minute === '')
                            $scope.model.minute = 0;
                        if ($scope.model.second === null || $scope.model.second === '')
                            $scope.model.second = 0;
                        $scope.timePoint = parseInt($scope.model.hour * 3600) + parseInt($scope.model.minute * 60) + parseInt($scope.model.second);
                        if ($scope.model.popQuestionId === null || $scope.model.popQuestionId === '') {
                            $scope.globle.alert('弹窗题不存在');
                        } else {
                            courseWareManagerService.updatePopQuestion(question, $scope.model.question.questionType, $scope.timePoint, $scope.model.popQuestionId, $scope.model.updatePopUrl).then(function (data) {
                                if (!data.status) {
                                    $scope.globle.alert('创建失败!', data.info);
                                } else {
                                    if (type === '1') {
                                        $state.go('states.courseWareManager').then(function () {
                                            $scope.node.courseWareGrid.pager.page(1);
                                        });
                                    } else if (type === '2') {
                                        $scope.addPopQuestionFrom.$setPristine();
                                        init();
                                        $scope.model.hour = 0;
                                        $scope.model.minute = 0;
                                        $scope.model.second = 0;
                                        PopsInit();
                                    }
                                    $scope.globle.showTip('保存成功', 'success');
                                }
                            });
                        }
                        $scope.model.saveType = 1; //转为新建键
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
                            case parseInt(questionService.trueOrFalse):

                                break;
                            case parseInt(questionService.selectOne):
                                for (var i = 0; i < question.configurationItems.length; i++) {
                                    var item = question.configurationItems[i];
                                    if (i + 1 == $scope.radio.radioSelected) {
                                        question.correctAnswer = item.id + '';
                                        break;
                                    }
                                }
                                break;
                            case parseInt(questionService.multiSelect):
                                if (question.correctAnswers.length < 1) {
                                    $scope.globle.showTip('请至少现在一个正确选项', 'error');
                                    return;
                                }
                                break;
                        }
                        if ($scope.model.hour === null || $scope.model.hour === '')
                            $scope.model.hour = 0;
                        if ($scope.model.minute === null || $scope.model.minute === '')
                            $scope.model.minute = 0;
                        if ($scope.model.second === null || $scope.model.second === '')
                            $scope.model.second = 0;
                        $scope.timePoint = parseInt($scope.model.hour * 3600) + parseInt($scope.model.minute * 60) + parseInt($scope.model.second);
                        courseWareManagerService.createPopQuestion(question, $scope.courseWareId, $scope.timePoint, $scope.model.addPopUrl, $scope.model.question.questionType).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('创建失败', data.info);
                            } else {
                                if (type === '1') {
                                    $state.go('states.courseWareManager').then(function () {
                                        $scope.node.courseWareGrid.pager.page(1);
                                    });
                                } else if (type === '2') {
                                    $scope.addPopQuestionFrom.$setPristine();
                                    init();
                                    $scope.model.hour = 0;
                                    $scope.model.minute = 0;
                                    $scope.model.second = 0;
                                    PopsInit();
                                }
                                $scope.globle.showTip('保存成功', 'success');
                            }
                        });
                    } else {
                        $scope.globle.showTip('试题信息不完整', 'error');
                    }
                    ;
                },
                toChinese: function (index) {
                    return questionService.utils.toChinese(index + 1);
                },
                checkboxChecked: function (answerId) {
                    var checked = false;
                    _.forEach($scope.model.question.correctAnswers, function (id) {
                        if (answerId == id) {
                            checked = true;
                            return;
                        }
                    });
                    return checked;
                }
            };
            /////////////////////////////////////////////////
            ///////////////初始化kendoui的配置项目/////////////
            /////////////////////////////////////////////////
            $scope.ui = {
                editor: KENDO_UI_EDITOR,
                tree: questionService.treeConfig(1),
                windowOptions: questionService.windowConfig()
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
            PopsInit();
        }];
    return controller;
});
