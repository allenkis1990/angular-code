/**
 * Created by admin on 2015/7/30.
 */


define(function () {
    'use strict';

    var controller = ['kendo.grid', 'KENDO_UI_TREE', '$scope', '$log', 'paperService', 'KENDO_UI_GRID', '$state', 'HB_notification',

        function (kendoGrid, KENDO_UI_TREE, $scope, $log, paperService, KENDO_UI_GRID, $state, HB_notification) {

            var paperId = $scope.$stateParams.id;
            var configType = $scope.$stateParams.configType;
            $scope.validateParams = {
                id: $scope.$stateParams.id
            };
            $scope.model = {
                searchCourseName: null, //模糊搜索课程名
                selectedCourseId: null,//选中课程的id
                selectedCourseName: null, //选中课程名称
                selectedCourseCateId: null, //选中课程分类id
                selectedCourseCateName: null, //选中课程分类名称
                parentName: '',
                paper: {
                    examRange: '1',
                    enabled: 'true',
                    configType: '0',
                    configurationItemDtos: [],
                    name: null,
                    totalScore: null,
                    passScore: null,
                    timeLength: null,
                    randomType: '1'
                },
                questionSearch: {
                    topic: '',
                    questionType: '-1',
                    mode: '-1',
                    librarys: []
                },
                paperConfig: {
                    ratio: 'true',
                    items: [],
                    libraryItems: []
                },
                bugQuestions: {
                    questions: []
                },
                smartPaperBigQuestions: {},
                questionLibraryNumber: {},
                hasSelectLiarary: false

            };
            $scope.data = {
                dataItem: null,
                courseTopic: null
            };
            $scope.$watch('model.selectedCourseCateName', function () {
                if ($scope.model.selectedCourseCateName == '') {
                    $scope.model.selectedCourseCateId = null;
                }
            });
            $scope.$watch('model.paper.randomTakeObjectConfigurationItemDtos', function () {
                if ($scope.model.paper.randomTakeObjectConfigurationItemDtos == null || $scope.model.paper.randomTakeObjectConfigurationItemDtos == [] || $scope.model.paper.randomTakeObjectConfigurationItemDtos.length == 0) {
                    $scope.model.hasSelectLiarary = false;
                } else {
                    $scope.model.hasSelectLiarary = true;
                }
            });

            $scope.$watch('model.paper.randomType', function () {
                if ($scope.model.paper.randomType == '1') {
                    if ($scope.model.paper.randomTakeObjectConfigurationItemDtos == null || $scope.model.paper.randomTakeObjectConfigurationItemDtos == [] || $scope.model.paper.randomTakeObjectConfigurationItemDtos.length == 0) {
                        $scope.model.hasSelectLiarary = false;
                    } else {
                        $scope.model.hasSelectLiarary = true;
                    }
                } else {
                    $scope.model.hasSelectLiarary = true;
                }
            });

            $scope.$watch('model.paper.examTypeId', function (newVal, oldVal) {
                if (newVal === '-1') {
                    $scope.globle.alert('提示', '顶级节点下不允许创建试卷');
                    $scope.model.parentName = null;
                    $scope.model.paper.examTypeId = null;
                } else {
                    paperService.checkPaperClassification(newVal).then(function (data) {
                        if (!data.status) {
                            $scope.globle.alert('提示', data.info);
                            $scope.model.parentName = null;
                            $scope.model.paper.examTypeId = null;
                        }
                    });
                }
            });
            angular.extend($scope, {
                iscourseCategoryName: {
                    parentId: null,
                    name: null,
                    queryName: ''
                }
            });
            $scope.show = {
                addPaperStep1: true
            };
            $scope.node = {
                courseGridInstance: null
            };
            var saveOrUpdate = '';
            var utils = {
                swapItems: function (arr, index1, index2) {
                    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                    return arr;
                }
            };
            var removeQuestions = [];
            var backUpData = {};
            $scope.events = {
                /**
                 *显示选择/取消选择button
                 * @param dataItem
                 * @param flag true/选择 false/取消选择
                 * @returns {boolean}
                 */
                checked: function (dataItem, flag) {
                    if (flag) {
                        if (dataItem.id != $scope.model.selectedCourseId) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        if (dataItem.id == $scope.model.selectedCourseId) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                /** 取消选择课程弹出框 **/
                cancelCourseList: function (e) {
                    e.preventDefault();
                    $scope.node.windows.addWindow.close();
                },
                /**选中课程**/
                checkSelectedCourse: function (dataItem) {
                    if ($scope.model.selectedCourseId != null) {
                        $scope.globle.alert('提示', '您已经有选中课程了，不可以多选');
                    } else {
                        $scope.model.courseName = dataItem.name;
                        $scope.model.selectedCourseId = dataItem.id;
                        $scope.data.courseTopic = dataItem.topic;
                    }
                },
                /**取消选中课程**/
                cancleSelectedCourse: function () {
                    $scope.model.courseName = null;
                    $scope.model.selectedCourseId = null;
                    $scope.data.courseTopic = null;
                },
                openCourseCategoryTree: function (e) {
                    e.stopPropagation();
                    $scope.CourseCategoryTree = !$scope.CourseCategoryTree;
                },
                searchQuestionLibraryList: function (e) {
                    e.preventDefault();
                    $scope.node.courseGridInstance.dataSource.page(1);
                },
                getCourseCategoryInfo: function (dataItem) {
                    event.stopPropagation();
                    $scope.model.selectedCourseCateName = dataItem.name;
                    $scope.model.selectedCourseCateId = dataItem.id;
                    $scope.CourseCategoryTree = false;
                },
                selectCourse: function () {
                    $scope.CourseCategoryTree = false;
                    $scope.node.windows.addWindow.center().open();
                },
                treeHide: function (e) {
                    e.stopPropagation();
                    $scope.examTypeTreeShow = false;
                    $scope.smartPaperLibraryTreeShow = false;
                },
                openTree: function (e) {
                    e.stopPropagation();
                    $scope.examTypeTreeShow = !$scope.examTypeTreeShow;
                },
                libraryTreeHide: function (e) {
                    e.stopPropagation();
                    $scope.libraryTreeShow = false;
                },
                openlibraryTree: function (e) {
                    e.stopPropagation();
                    $scope.libraryTreeShow = !$scope.libraryTreeShow;
                },
                openSmartPaperLibraryTree: function (e) {
                    e.stopPropagation();
                    $scope.smartPaperLibraryTreeShow = !$scope.smartPaperLibraryTreeShow;
                },
                continueAdd: function () {
                    if ($scope.addPaperStep1Form.$valid) {
                        var isContinue = true;
                        if ($scope.model.paper.configType === '0') {
                            $scope.globle.alert('提示', '请选择组卷方式');
                            return;
                        }
                        if ($scope.model.paper.totalScore * 1 < $scope.model.paper.passScore * 1) {
                            $scope.globle.alert('提示', '及格分数不能大于试卷总分');
                            return;
                        }
                        if (!$scope.model.hasSelectLiarary) {
                            $scope.globle.alert('提示', '请选择题库');
                            return;
                        }
                        if (isContinue) {
                            $scope.show = {
                                addPaperStep2: true
                            };
                        }
                    }
                },
                back: function () {
                    $scope.show = {
                        addPaperStep1: true
                    };
                },
                getOrgInfo: function (dataItem) {
                    $scope.model.parentName = dataItem.name;
                    $scope.model.paper.examTypeId = dataItem.id;
                    $scope.examTypeTreeShow = false;
                },
                getQuestionOrgInfo: function (dataItem) {
                    $scope.model.libraryName = dataItem.name;
                    $scope.model.questionSearch.libraryId = dataItem.id;
                    $scope.libraryTreeShow = false;
                },
                test: function () {
                },
                savePaper: function (way) {
                    if (!$scope.addPaperStep1Form.$valid) {
                        return;
                    }
                    if (!$scope.model.hasSelectLiarary) {
                        return;
                    }
                    var count = 0;
                    $scope.model.paper.fixedConfigurationItemUpdateDtos = [];
                    _.forEach($scope.model.paper.configurationItemDtos, function (configurationItemDto) {
                        var score = configurationItemDto.totalScore * 1;
                        count += score;
                        var questions = [];
                        _.forEach(configurationItemDto.questions, function (question) {
                            questions.push({
                                id: question.id,
                                score: question.score,
                                scores: question.scores,
                                subQuestionUpdateDto: question.subQuestion
                            });
                        });
                        configurationItemDto.questions = questions;
                        $scope.model.paper.fixedConfigurationItemUpdateDtos.push(configurationItemDto);
                    });
                    if (way !== '2') {
                        $scope.model.paper.draft = false;
                        if ($scope.model.paper.configurationItemDtos.length < 1) {
                            $scope.globle.showTip('请至少选择一个大题', 'error');
                            return;
                        }
                        ;

                        if (count != $scope.model.paper.totalScore * 1) {
                            $scope.globle.showTip('试题总分之和不等于试卷总分', 'error');
                            return;
                        }
                    } else {
                        $scope.model.paper.draft = true;
                    }
                    if ($scope.model.paper.configType === '1' || $scope.model.paper.configType == 1) {
                        $scope.model.paper.fixedConfigurationItemUpdateDtos = $scope.model.paper.configurationItemDtos;

                        paperService.updateFixedPaper($scope.model.paper).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('创建失败!', data.info);
                            } else {
                                $scope.model.result = data.info;
                                $state.go('states.paperConfig').then(function () {
                                    $state.reload($state.current);
                                });
                            }
                        });
                    } else if ($scope.model.paper.configType === '3' || $scope.model.paper.configType == 3) {
                        var isCommit = true;
                        if ($scope.model.paper.randomType === '1') {
                            var libraryIds = [];
                            angular.forEach($scope.model.paper.randomTakeObjectConfigurationItemDtos, function (item, index) {
                                libraryIds.push(item.entityId);
                            });

                            paperService.findExamPaperQuestionCount(null, libraryIds).then(function (data) {
                                $scope.model.questionLibraryNumber = {};
                                $scope.model.questionLibraryNumber = data.info;
                                var allTypeQuestionTotal = [{type: 1, count: 0}, {type: 2, count: 0}, {
                                    type: 3,
                                    count: 0
                                }];
                                angular.forEach($scope.model.paper.configurationItemDtos, function (item, index) {
                                    switch (item.type) {
                                        case 1:
                                            allTypeQuestionTotal[0].count += parseInt(item.count);
                                            break;
                                        case 2:
                                            allTypeQuestionTotal[1].count += parseInt(item.count);
                                            break;
                                        case 3:
                                            allTypeQuestionTotal[2].count += parseInt(item.count);
                                            break;
                                    }
                                });
                                angular.forEach(allTypeQuestionTotal, function (item, index) {
                                    angular.forEach($scope.model.questionLibraryNumber, function (item2, index) {
                                        if (item.type == item2.questionType) {
                                            if (item.count > item2.questionNumber) {
                                                isCommit = false;
                                                var passCount = parseInt(item.count) - parseInt(item2.questionNumber);
                                                switch (item2.questionType) {
                                                    case '1':
                                                        HB_notification.alert('判断题数量超过题库现有的题数' + item2.questionNumber + '题，请调整后配置');
                                                        break;
                                                    case '2':
                                                        HB_notification.alert('单选题数量超过题库现有的题数' + item2.questionNumber + '题，请调整后配置');
                                                        break;
                                                    case '3':
                                                        HB_notification.alert('多选题数量超过题库现有的题数' + item2.questionNumber + '题，请调整后配置');
                                                        break;
                                                }
                                            }
                                        }
                                    });
                                });
                                if (isCommit) {
                                    $scope.model.paper.randomConfigurationItemDtos = $scope.model.paper.configurationItemDtos;
                                    paperService.updateSmartPaper($scope.model.paper).then(function (data) {
                                        if (!data.status) {
                                            $scope.globle.alert('更新失败!', data.info);
                                        } else {
                                            $state.go('states.paperConfig').then(function () {
                                                $state.reload($state.current);
                                            });
                                        }
                                    });
                                }


                            });
                        }
                        if ($scope.model.paper.randomType === '2') {
                            $scope.model.paper.randomConfigurationItemDtos = $scope.model.paper.configurationItemDtos;
                            $scope.model.paper.randomTakeObjectConfigurationItemDtos = null;
                            paperService.updateSmartPaper($scope.model.paper).then(function (data) {
                                if (!data.status) {
                                    $scope.globle.alert('更新失败!', data.info);
                                } else {
                                    $state.go('states.paperConfig').then(function () {
                                        $state.reload($state.current);
                                    });
                                }
                            });
                        }
                    }

                },
                cancle: function () {
                    $state.go('states.paperConfig');
                },
                initAddQuestion: function (questionType) {
                    $scope.node.question.gridInstance.dataSource.page(1);
                    $scope.addQuestionForm.$setPristine();
                    $scope.node.libraryTree.dataSource.read();
                    $scope.model.questionSearch = {
                        topic: '',
                        questionType: '-1',
                        mode: '-1',
                        librarys: []
                    };
                    $scope.model.paperConfig.libraryItems = [];
                    $scope.model.bugQuestions = {};
                    $scope.model.bugQuestions = {
                        totalScore: 0,
                        name: null,
                        scoreWay: '1',
                        type: questionType,
                        questions: []
                    };
                    $scope.scoreInputClass = 'ipt ipt-c-xm ipt-disabled';
                },
                initSmartPaperAddQuestion: function (questionType) {
                    $scope.smartPaperAddQuestionForm.$setPristine();
                    $scope.model.smartPaperBigQuestions = {};
                    $scope.model.smartPaperBigQuestions = {
                        totalScore: null,
                        name: null,
                        scoreWay: '1',
                        type: questionType
                    };
                    if ($scope.model.paper.randomType === '1') {
                        var libraryIds = [];
                        angular.forEach($scope.model.paper.randomTakeObjectConfigurationItemDtos, function (item, index) {
                            libraryIds.push(item.entityId);
                        });

                        paperService.findExamPaperQuestionCount(questionType, libraryIds).then(function (data) {
                            $scope.model.questionNumber = data.info[0].questionNumber;
                            // angular.forEach($scope.model.paper.configurationItemDtos, function (item2, index) {
                            //     if (questionType == item2.type){
                            //         $scope.model.questionNumber = $scope.model.questionNumber - item2.count;
                            //     }
                            // });
                        });
                    }
                },
                setFillQuestionAnswerItemScore: function (item) {
                    var fillScore = item.score / item.answerCount;
                    item.scores = [];
                    for (var i = 0; i < item.answerCount; i++) {
                        item.scores.push(fillScore);
                    }
                    return fillScore;
                },
                toAddQuestion: function (questionType) {
                    saveOrUpdate = 'save';
                    if ($scope.model.paper.configType === '1' || $scope.model.paper.configType == 1) {
                        this.initAddQuestion(questionType);
                        $scope.model.questionSearch.questionType = questionType;
                        $scope.node.question.gridInstance.dataSource.read();
                        if (questionType != 4) {
                            $scope.fillQuestion = false;
                        } else {
                            $scope.fillQuestion = true;
                        }
                        $scope.show = {
                            addQuestion: true
                        };
                    } else if ($scope.model.paper.configType === '3' || $scope.model.paper.configType == 3) {
                        this.initSmartPaperAddQuestion(questionType);
                        $scope.node.windows.addSmartQuestion.open();
                    }

                },
                cancleAddQuestion: function () {
                    $scope.model.bugQuestions.questions = removeQuestions;
                    removeQuestions = [];
                    $scope.show = {
                        addPaperStep2: true
                    };
                },
                getLibraryOrgInfo: function (dataItem) {
                    $scope.model.librayName = dataItem.name;
                    $scope.model.questionSearch.libraryId = dataItem.id;
                    $scope.libraryTreeShow = false;
                },
                chooseQuestion: function (dataItem) {
                    var question = _.find($scope.model.bugQuestions.questions, 'id', dataItem.id);
                    if (question == null) {
                        var subQuestion = [];
                        //如果是综合题需要查出子题
                        if ($scope.model.questionSearch.questionType == 6) {
                            _.forEach(dataItem.subQuestion, function (json, index) {
                                var question = angular.fromJson(json.questionJson);
                                if (question.mode == 1) {
                                    question.mode = '简单';
                                } else if (question.Mode == 2) {
                                    question.mode = '中等';
                                } else if (question == 3) {
                                    question.mode = '难';
                                }
                                subQuestion.push(question);
                            });
                        }
                        $scope.model.bugQuestions.questions.push({
                            id: dataItem.id,
                            topic: dataItem.topic,
                            answerCount: dataItem.answerCount,
                            mode: dataItem.mode,
                            score: 0,
                            subQuestion: subQuestion
                        });
                        $scope.events.changeTotalscore();
                    }
                    dataItem.isChoice = true;
                },
                removeQuestion: function (id) {
                    var viewData, i, row, rowId;

                    if ($scope.model.questionSearch.questionType != 4) {
                        viewData = $scope.node.question.gridInstance.dataSource.view();
                    } else {
                        viewData = $scope.node.question.fillGridInstance.dataSource.view();
                    }

                    for (i = 0; i < viewData.length; i++) {
                        row = viewData[i];
                        // 用户的ID key是userId
                        rowId = row.id;
                        if (rowId === id) {
                            // 单个 找到就终止判断
                            row.isChoice = false;
                            break;
                        }
                    }


                    _.remove($scope.model.bugQuestions.questions, function (question) {
                        return question.id == id;
                    });

                    this.changeTotalscore();
                },
                scoreWay: function (way) {
                    if (way == 1) {
                        $scope.scoreInputClass = 'ipt ipt-c-xm ipt-disabled';
                        this.changeTotalscore(true);
                    } else {
                        $scope.scoreInputClass = 'ipt ipt-c-xm';
                        this.changeTotalscore();
                    }
                },
                changeTotalscore: function (alway) {
                    if ($scope.model.bugQuestions.scoreWay === '1' || alway) {
                        if ($scope.model.bugQuestions.totalScore != null && $scope.model.bugQuestions.totalScore !== '') {
                            if ($scope.model.questionSearch.questionType != 6) {
                                var score = $scope.model.bugQuestions.totalScore / $scope.model.bugQuestions.questions.length;
                                _.forEach($scope.model.bugQuestions.questions, function (question) {
                                    question.score = score;
                                });
                            } else {
                                var count = 0;
                                _.forEach($scope.model.bugQuestions.questions, function (question) {
                                    count += question.subQuestion.length;
                                });
                                var score = $scope.model.bugQuestions.totalScore / count;
                                _.forEach($scope.model.bugQuestions.questions, function (question) {
                                    var parentscore = 0;
                                    _.forEach(question.subQuestion, function (child) {
                                        child.score = score;
                                        parentscore += score;
                                    });
                                    question.score = parentscore;
                                });
                            }
                        }
                    }
                },
                changeSubQuesiton: function (id) {
                    var question = _.find($scope.model.bugQuestions.questions, 'id', id);
                    var count = 0;
                    _.forEach(question.subQuestion, function (child) {
                        if (child.score != null) {
                            count += (child.score * 1);
                        }
                    });
                    question.score = count;
                },
                saveQuestion: function () {
                    if ($scope.model.bugQuestions.name == null) {
                        $scope.globle.showTip('大题名称为空,或者大于30个汉字', 'error');
                        return;
                    }
                    if ($scope.model.bugQuestions.totalScore == null || $scope.model.bugQuestions.totalScore == 0) {
                        $scope.globle.showTip('大题分数不能为空', 'error');
                        return;
                    }
                    if ($scope.addQuestionForm.$valid) {
                        var isContinue = true;
                        var count = 0;
                        if ($scope.model.bugQuestions.questions.length < 1) {
                            $scope.globle.showTip('请至少选择一提', 'error');
                            return;
                        }
                        _.forEach($scope.model.bugQuestions.questions, function (question) {
                            var score = question.score * 1;
                            if ($scope.model.bugQuestions.type == 4) {
                                var fillScore = score / question.answerCount;
                                if (fillScore % 0.5 != 0) {
                                    $scope.globle.showTip('填空题每空分值需为0.5的倍数', 'error');
                                    isContinue = false;
                                    return;
                                }
                            } else if ($scope.model.bugQuestions.type == 6) {
                                var subQuestionScore = [];
                                _.forEach(question.subQuestion, function (subQuestion) {
                                    subQuestionScore.push(subQuestion.score);
                                    if (subQuestion.QuestionType == 4) {
                                        var fillScore = subQuestion.score / subQuestion.AnswerCount;
                                        if (fillScore % 0.5 != 0) {
                                            $scope.globle.showTip('填空题每空分值需为0.5的倍数', 'error');
                                            isContinue = false;
                                            return;
                                        }
                                    } else {
                                        if (subQuestion.score % 0.5 != 0) {
                                            $scope.globle.showTip('每题分值需为0.5的倍数', 'error');
                                            isContinue = false;
                                            return;
                                        }
                                        if (subQuestion.score <= 0) {
                                            $scope.globle.showTip('请设置大于0的试题分数', 'error');
                                            isContinue = false;
                                            return;
                                        }
                                    }
                                });
                                question.subQuestionScore = subQuestionScore;
                            } else {
                                if (score % 0.5 != 0) {
                                    $scope.globle.showTip('每题分值需为0.5的倍数', 'error');
                                    isContinue = false;
                                    return;
                                }
                            }
                            if (score <= 0) {
                                $scope.globle.showTip('请设置大于0的试题分数', 'error');
                                isContinue = false;
                                return;
                            }
                            count += score;
                        });
                        if (isContinue) {
                            if ($scope.model.bugQuestions.totalScore != count) {
                                $scope.globle.showTip('小题分数总和不等于大题分数', 'error');
                                isContinue = false;
                                return;
                            }
                            $scope.model.bugQuestions.count = $scope.model.bugQuestions.questions.length;
                            if (saveOrUpdate === 'update') {
                            } else {
                                $scope.model.paper.configurationItemDtos.push($scope.model.bugQuestions);
                            }
                            $scope.show = {
                                addPaperStep2: true
                            };
                        }
                    }
                    removeQuestions = [];
                },
                saveSmartPaperQuestion: function () {
                    if ($scope.smartPaperAddQuestionForm.$valid) {

                        if ($scope.model.paper.randomType === '1' && $scope.model.smartPaperBigQuestions.count > $scope.model.questionNumber) {
                            if (saveOrUpdate === 'update') {
                                $scope.model.smartPaperBigQuestions.score = backUpData.score;
                                $scope.model.smartPaperBigQuestions.count = backUpData.count;
                            }
                            HB_notification.alert('试题数量超过' + $scope.model.questionNumber + '题，请调整后配置');
                            return;
                        }

                        $scope.model.smartPaperBigQuestions.questionType = $scope.model.questionType;
                        $scope.model.smartPaperBigQuestions.score =
                            parseInt($scope.model.smartPaperBigQuestions.totalScore) / parseInt($scope.model.smartPaperBigQuestions.count);
                        if ($scope.model.smartPaperBigQuestions.score % 0.5 != 0) {
                            $scope.globle.showTip('平均每题分值需为0.5的倍数', 'error');
                            return;
                        }
                        //智能组卷的分值分配方式，一定是平均分配
                        $scope.model.smartPaperBigQuestions.scoreWay = '1';
                        if (saveOrUpdate === 'update') {
                        } else {
                            $scope.model.paper.configurationItemDtos.push($scope.model.smartPaperBigQuestions);
                        }
                        $scope.node.windows.addSmartQuestion.close();
                    }
                },
                modifyQuestion: function (item) {
                    saveOrUpdate = 'update';
                    if ($scope.model.paper.configType === '1' || $scope.model.paper.configType == 1) {
                        this.initAddQuestion(item.type);
                        $scope.model.questionSearch.questionType = item.type;
                        if ($scope.model.questionSearch.questionType != 4) {
                            $scope.node.question.gridInstance.refresh();
                        }
                        $scope.node.question.gridInstance.dataSource.read();
                        $scope.model.bugQuestions = item;
                        //为了当用户编辑完试题后，并不像保存，只是点取消，数据能恢复，所以备份一份
                        removeQuestions = angular.copy(item.questions);
                        $scope.show = {
                            addQuestion: true
                        };
                    } else if ($scope.model.paper.configType === '3' || $scope.model.paper.configType == 3) {
                        backUpData = angular.copy(item);
                        if ($scope.model.paper.randomType === '1') {
                            var libraryIds = [];
                            angular.forEach($scope.model.paper.randomTakeObjectConfigurationItemDtos, function (item, index) {
                                libraryIds.push(item.entityId);
                            });

                            paperService.findExamPaperQuestionCount(item.type, libraryIds).then(function (data) {
                                $scope.model.questionNumber = data.info[0].questionNumber;
                                // angular.forEach($scope.model.paper.configurationItemDtos, function (item2, index) {
                                //   if (item.type == item2.type){
                                //       $scope.model.questionNumber = $scope.model.questionNumber - parseInt(item2.count);
                                //   }
                                // });
                                // $scope.model.questionNumber = $scope.model.questionNumber + parseInt(item.count);
                            });
                        }

                        $scope.model.smartPaperBigQuestions = item;
                        $scope.node.windows.addSmartQuestion.open();
                    }

                },
                exChange: function (index, way) {
                    if (way == 1) {
                        if (index == 0) {
                            return;
                        } else {
                            utils.swapItems($scope.model.paper.configurationItemDtos, index, index - 1);
                        }
                    } else if (way == 2) {
                        if (index == $scope.model.paper.configurationItemDtos.length - 1) {
                            return;
                        } else {
                            utils.swapItems($scope.model.paper.configurationItemDtos, index, index + 1);
                        }
                    }
                },
                deleteQuestion: function (index) {
                    $scope.model.paper.configurationItemDtos.splice(index, 1);
                },
                release: function () {
                    $state.go('states.paperConfig.release', $scope.model.result);
                },
                searchQuestion: function () {
                    $scope.model.questionSearch.librarys = null;
                    for (var i = 0; i < $scope.model.paperConfig.libraryItems.length; i++) {
                        var items = $scope.model.paperConfig.libraryItems[i];
                        if (i == 0) {
                            $scope.model.questionSearch.librarys = items.entityId;
                        } else {
                            $scope.model.questionSearch.librarys += items.entityId;
                        }
                        if (i != $scope.model.paperConfig.libraryItems.length - 1) {
                            $scope.model.questionSearch.librarys += '_';
                        }
                    }
                    $scope.node.question.gridInstance.dataSource.read();
                },
                closeAddQuestion: function () {
                    $scope.node.windows.addSmartQuestion.close();
                },
                paperQuestionView: function (id, questionType) {
                    $scope.node.windows.questionView.open();
                    paperService.findQuestionById(id, questionType).then(function (data) {
                        $scope.model.questionView = data.info;
                        //如果是综合题
                        $scope.model.subQuestionsView = [];
                        _.forEach($scope.model.questionView.subQuestion, function (subQuestion) {
                            $scope.model.subQuestionsView.push(angular.fromJson(subQuestion.questionJson));
                        });
                        $scope.model.questionView.questionTypeName = paperService.getQuestionType(questionType);
                    });
                },
                getLetter: function (num) {
                    return paperService.utils.digitalToLetter(num);
                },
                digitalToLetter: function (index) {
                    return paperService.utils.digitalToLetter(index + 1);
                },
                //试题查看时获取单选题正确答案
                getRadioRightAnswer: function (answers) {
                    var sum;
                    var correctAnswer = $scope.model.questionView.correctAnswer;
                    _.forEach($scope.model.questionView.configurationItems, function (item, index) {
                        if (item.id == correctAnswer) {
                            sum = index + 1;
                            return;
                        }
                    });
                    return paperService.utils.digitalToLetter(sum);
                },
                //获取多选题正确答案
                getMultiselectAnswer: function (answers) {
                    var nums = [];
                    var correctAnswers = $scope.model.questionView.correctAnswers;
                    _.forEach($scope.model.questionView.configurationItems, function (item, index) {
                        _.forEach(correctAnswers, function (item2) {
                            if (item.id == item2) {
                                nums.push(paperService.utils.digitalToLetter(index + 1));
                            }
                        });
                    });
                    return nums;
                },
                //试题查看时获取子题单选题正确答案
                getSubRadioRightAnswer: function (subQuestion) {
                    var sum;
                    var correctAnswer = subQuestion.correctAnswer;
                    _.forEach(subQuestion.configurationItems, function (item, index) {
                        if (item.id == correctAnswer) {
                            sum = index + 1;
                            return;
                        }
                    });
                    return paperService.utils.digitalToLetter(sum);
                },
                //获取多选题子题正确答案
                getSubMultiselectAnswer: function (subQuestion) {
                    var nums = [];
                    var correctAnswers = subQuestion.correctAnswers;
                    _.forEach(subQuestion.configurationItems, function (item, index) {
                        _.forEach(correctAnswers, function (item2) {
                            if (item.id == item2) {
                                nums.push(paperService.utils.digitalToLetter(index + 1));
                            }
                        });
                    });
                    return nums;
                },
                toChinese: function (number) {
                    return paperService.utils.toChinese(number);
                },
                filterHtml: function (topic) {
                    topic = topic.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, '[图片]');
                    topic = topic.replace(/<\/?.+?>/g, '', '');
                    return topic;
                },
                emptyQuestion: function () {
                    $scope.model.bugQuestions.questions = [];
                    if ($scope.model.questionSearch.questionType == 4) {
                        $scope.node.question.fillGridInstance.dataSource.page(1);
                    } else {
                        $scope.node.question.gridInstance.dataSource.page(1);
                    }

                }
            };


            function getQuetion () {
                if (configType === '1') {
                    paperService.findFixedExamPaperById(paperId).then(function (data) {
                        $scope.model.paper = data.info;
                        $scope.model.paper.configurationItemDtos = $scope.model.paper.items;
                        $scope.model.parentName = $scope.model.paper.paperTypeName;
                        _.forEach($scope.model.paper.configurationItemDtos, function (bigQuestion) {
                            bigQuestion.totalScore = bigQuestion.totalScore + '';
                            var questionObject = [];
                            _.forEach(bigQuestion.questions, function (quesiton) {
                                var obj = angular.fromJson(quesiton.questionJson);
                                obj.topic = obj.topic.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, '[图片]');
                                obj.topic = obj.topic.replace(/<\/?.+?>/g, '', '');
                                paperService.findQuestionInfo(quesiton.id).then(function (data) {
                                    if (data.info.mode == 1) {
                                        obj.mode = '简单';
                                    } else if (data.info.mode == 2) {
                                        obj.mode = '中等';
                                    } else if (data.info.mode == 2) {
                                        obj.mode = '难';
                                    }
                                });

                                //如果是综合题
                                var subQuestionScore = [];
                                var newsubQuestion = [];
                                _.forEach(obj.subQuestion, function (sub) {
                                    var child = angular.fromJson(sub.questionJson);
                                    subQuestionScore.push(child.score);
                                    child.topic = child.topic.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, '[图片]');
                                    child.topic = child.topic.replace(/<\/?.+?>/g, '', '');
                                    child.score = child.score;
                                    if (child.questionType == 4) {
                                        child.scores = child.answersItemScore;
                                    }
                                    newsubQuestion.push(child);
                                });
                                obj.subQuestionScore = subQuestionScore;
                                obj.subQuestion = newsubQuestion;
                                questionObject.push(obj);
                            });
                            bigQuestion.questions = questionObject;
                        });
                    });
                } else {
                    paperService.findLibraryExamPaperById(paperId).then(function (data) {
                        $scope.model.paper = data.info;
                        $scope.model.paper.configurationItemDtos = $scope.model.paper.randomConfigurationItemDtos;
                        $scope.model.paper.ratio = $scope.model.paper.ratio + '';
                        $scope.model.paper.enabled = $scope.model.paper.enabled + '';
                        $scope.model.parentName = $scope.model.paper.paperTypeName;
                        $scope.model.paper.randomType = $scope.model.paper.randomType + '';
                        angular.forEach($scope.model.paper.randomTakeObjectConfigurationItemDtos, function (item, index) {
                            item.entityId = item.objectId;
                        });
                        $scope.model.paper.configType = $scope.model.paper.configType + '';
                        $scope.model.paper.examRange = $scope.model.paper.examRange + '';


                    });
                }

            }

            getQuetion();
            //试卷分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '-2',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/paperClassify/findExamPaperTypeByParentId?parentId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);
                            },
                            error: function (result) {
                                // notify the data source that the request failed
                                options.error(result);
                            }
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id',
                        hasChildren: 'hasChildren'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });
            //题库树
            var libraryTreeDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '-2',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/questionLibrary/findLibraryListByParentId?libraryId=' + id + '&enabled=0' + '&onlySelf=0',
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);
                            },
                            error: function (result) {
                                // notify the data source that the request failed
                                options.error(result);
                            }
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id',
                        hasChildren: 'hasChildren'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });
            //智能组卷抽取题库树
            var smartPaperlibraryTreeDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '-2',
                            myModel = dataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/questionLibrary/findLibraryListByParentId?libraryId=' + id + '&enabled=0' + '&onlySelf=0&showInsertLibrary=1',
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                // notify the data source that the request succeeded
                                options.success(result);

                                var treeView = $scope.node.smartPaperlibraryTree;
                            },
                            error: function (result) {
                                // notify the data source that the request failed
                                options.error(result);
                            }
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id',
                        hasChildren: 'hasChildren'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });

            // 试题，构建表格的内容模板
            var questionGridRowTemplate = '';
            (function () {
                var result = [];
                result.push('<tr>');


                result.push('<td>');
                result.push('#: topic #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: mode #');
                result.push('</td>');


                result.push('<td>');
                result.push('<button class="table-btn" ng-if="!dataItem.isChoice" has-permission="paperConfig/confirmQuestionForUpdate" ng-click="events.chooseQuestion(dataItem)">选择</button>');
                result.push('<button class="table-btn" ng-if="dataItem.isChoice" has-permission="paperConfig/confirmQuestionForUpdate" ng-click="events.removeQuestion(\'#: id #\')">取消选择</button>');
                result.push('</td>');

                result.push('</tr>');
                questionGridRowTemplate = result.join('');
            })();


            // function libraryTreeCheck() {
            //     var nodes = $scope.node.smartPaperlibraryTree.dataSource.view();
            //     var  items=$scope.model.paper.randomTakeObjectConfigurationItemDtos;
            //
            //     for (var i = 0; i < nodes.length; i++) {
            //         var node = _.find(items, 'id', nodes[i].id);
            //         if (true) {
            //             nodes[i].checked = true;
            //         }
            //     }
            // }

            // libraryTreeCheck();
            // function that gathers IDs of checked nodes
            function checkedNodeIds (nodes, items) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = _.find(items, 'id', nodes[i].id);
                    if (nodes[i].checked) {
                        if (node == null) {
                            if (nodes[i].id == '-1') {
                                items.push({
                                        entityId: nodes[i].id,
                                        name: '所有题库'
                                    }
                                );
                            } else {
                                items.push({
                                        entityId: nodes[i].id,
                                        name: nodes[i].name
                                    }
                                );
                            }
                        }
                    } else {
                        if (node != null) {
                            _.remove(items, function (item) {
                                return item.entityId === nodes[i].id;
                            });
                        }
                        if (nodes[i].hasChildren) {
                            checkedNodeIds(nodes[i].children.view(), items);
                        }
                    }
                }
            }

            function initCheckedNodeIds (nodes, items) {
                for (var i = 0; i < nodes.length; i++) {
                    // var node = _.find(items, 'id', nodes[i].id);
                    for (var j = 0; j < items.length; j++) {
                        if (nodes[i].id == items[j].entityId) {
                            nodes[i].checked = true;
                        }
                    }

                    // if (nodes[i].checked) {
                    //     if (node != null) {
                    //         if (nodes[i].id == '-1') {
                    //             items.push({
                    //                     entityId: nodes[i].id,
                    //                     name: '所有题库'
                    //                 }
                    //             );
                    //         } else {
                    //             items.push({
                    //                     entityId: nodes[i].id,
                    //                     name: nodes[i].name
                    //                 }
                    //             );
                    //         }
                    //     }
                    // } else {
                    //     if (node != null) {
                    //         _.remove(items, function (item) {
                    //             return item.entityId === nodes[i].id;
                    //         });
                    //     }
                    //     if (nodes[i].hasChildren) {
                    //         checkedNodeIds(nodes[i].children.view(),items);
                    //     }
                    // }
                }
            }


            function onCheck (type) {
                var items;
                var treeView;
                $scope.model.paper.randomTakeObjectConfigurationItemDtos = null;
                $scope.model.paper.randomTakeObjectConfigurationItemDtos = [];
                $scope.model.paperConfig.libraryItems = null;
                $scope.model.paperConfig.libraryItems = [];
                if (type === 1) {
                    items = $scope.model.paper.randomTakeObjectConfigurationItemDtos;
                    treeView = $scope.node.smartPaperlibraryTree;
                } else if (type === 2) {
                    items = $scope.model.paperConfig.libraryItems;
                    treeView = $scope.node.libraryTree;
                }

                checkedNodeIds(treeView.dataSource.view(), items);
                $scope.$apply();
            }

            var courseCatagoryDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '0',
                            myModel = courseCatagoryDataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';

                        $.ajax({
                            //url: "/web/admin/organization/findUnitByParentId.action?parentId=" + id + "&nodeType=" + type,
                            url: '/web/admin/courseCategoryAction/findByQuery?categoryId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                //var keepGoing = true;
                                angular.forEach(result.info, function (item, index) {
                                    if (index == 0) {
                                        $scope.iscourseCategoryName.queryName = item.name;
                                        $scope.model.orgNames = '资源分类列表';
                                        //keepGoing = false;
                                    }
                                });
                                // notify the data source that the request succeeded
                                options.success(result);
                            },
                            error: function (result) {
                                // notify the data source that the request failed
                                options.error(result);
                            }
                        });
                    }
                },
                schema: {
                    model: {
                        id: 'id',
                        length: '',
                        hasChildren: 'hasChildren',
                        uid: 'id'
                    },
                    data: function (data) {
                        return data.info;
                    }
                }
            });

            $scope.ui = {
                courseCatagoryTree: {
                    options: {
                        checkboxes: false,
                        messages: {
                            loading: '正在加载课程分类...',
                            requestFailed: '课程分类加载失败!.'
                        },
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: courseCatagoryDataSource
                    }
                },
                courseGrid: {
                    options: {
                        // 每个行的模板定义,
                        scrollable: false,
                        dataBinding: function (e) {
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    var sortStr = '';
                                    if (type == 'read') {
                                        if (data.sort) {
                                            var str = [];
                                            angular.forEach(data.sort, function (item, index) {
                                                str.push(item.field + ' ' + item.dir);
                                            });
                                            sortStr = str.join(',');
                                        }
                                        return {
                                            'page.pageSize': data.pageSize,
                                            'page.pageNo': data.page,
                                            'courseQuery.categoryId': $scope.model.selectedCourseCateId,
                                            'courseQuery.name': $scope.model.searchCourseName
                                        };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/testQuestion/getCoursesByNameOrCate',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                data: function (response) {
                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            pageSize: 5,
                            buttonCount: 10
                        },
                        columns: [
                            {title: 'No.', field: 'num', width: 40},
                            {title: '课程名称', field: 'name', width: 250},
                            {title: '课程分类', field: 'cateName', width: 150},
                            {title: '学时', field: 'credit', width: 50},
                            {title: '弹窗题', field: 'popQuestionNum', width: 60},
                            {
                                title: '操作', width: 70,
                                template: kendo.template(
                                    '<button class="table-btn" ng-show="events.checked(dataItem,true)" has-permission="paperConfig/selectCourseForSavePaper" ng-click="events.checkSelectedCourse(dataItem)">选择</button>' +
                                    '<button class="table-btn" ng-show="events.checked(dataItem,false)" has-permission="paperConfig/selectCourseForSavePaper" ng-click="events.cancleSelectedCourse()">取消选择</button>')
                            }
                        ]
                    }
                },
                windowOptions: {
                    modal: true,
                    visible: false,
                    resizable: false,
                    draggable: false,
                    title: false,
                    open: function () {
                        this.center();
                    }
                },
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                },
                libraryTree: {
                    options: {
                        checkboxes: {
                            checkChildren: true
                        },
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: libraryTreeDataSource,
                        check: function (e) {
                            onCheck(2);
                        }
                    }
                },
                smartPaperLibraryTree: {
                    options: {
                        checkboxes: {
                            checkChildren: true
                        },
                        //checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: smartPaperlibraryTreeDataSource,
                        check: function (e) {
                            onCheck(1);
                        }
                    }
                },
                questionGrid: {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(questionGridRowTemplate),
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    var sortStr = '';
                                    if (type == 'read') {
                                        if (data.sort) {
                                            var str = [];
                                            angular.forEach(data.sort, function (item, index) {
                                                str.push(item.field + ' ' + item.dir);
                                            });
                                            sortStr = str.join(',');
                                        }
                                        return {
                                            'page.pageSize': data.pageSize,
                                            'page.pageNo': data.page,
                                            'searchDto.questionType': $scope.model.questionSearch.questionType,
                                            'searchDto.enable': '0',
                                            'searchDto.topic': $scope.model.questionSearch.topic,
                                            'searchDto.mode': $scope.model.questionSearch.mode,
                                            'libraryIds': $scope.model.questionSearch.librarys
                                        };
                                    }
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/testQuestion/findExamPaperQuestionInfoPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            selectQuestions = $scope.model.bugQuestions.questions,
                                            index = 1;

                                        _.forEach(viewData, function (row) {
                                            row.isChoice = false;
                                            row.index = index++;
                                            _.forEach(selectQuestions, function (question) {
                                                if (row.id === question.id) {
                                                    row.isChoice = true;
                                                }
                                            });
                                        });
                                        return response;
                                    } else {
                                        $scope.globle.alert('错误', '获取试题失败!');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },
                                total: function (response) {
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            pageSize: 5,
                            buttonCount: 10
                        },
                        columns: [
                            {title: '题目'},
                            {title: '难易度', width: 100},
                            {title: '操作', width: 80}
                        ]
                    }
                }
            };

            $scope.ui.questionGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.questionGrid.options);
            $scope.ui.courseGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseGrid.options);

        }];


    return controller;
});
