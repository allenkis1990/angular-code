/**
 * Created by admin on 2015/7/30.
 */


define(function () {
    'use strict';

    var controller = ['$scope', '$log', 'questionService', 'KENDO_UI_EDITOR', '$state', 'KENDO_UI_GRID', 'KENDO_UI_TREE', 'kendo.grid', 'HB_notification',

        function ($scope, $log, questionService, KENDO_UI_EDITOR, $state, KENDO_UI_GRID, KENDO_UI_TREE, kendoGrid, HB_notification) {

            var questionId = $scope.$stateParams.questionId;

            $scope.model = {
                //选择题id初始化
                optionIndex: 0,
                courseName: ($scope.$stateParams.courseName ===null || $scope.$stateParams.courseName ==='null')?null:$scope.$stateParams.courseName,
                searchCourseName: ($scope.$stateParams.courseName ===null || $scope.$stateParams.courseName ==='null')?null:$scope.$stateParams.courseName, //模糊搜索课程名
                selectedCourseId: ($scope.$stateParams.courseId ===null || $scope.$stateParams.courseId ==='null')?null:$scope.$stateParams.courseId,//选中课程的id
                selectedCourseName:($scope.$stateParams.courseName ===null || $scope.$stateParams.courseName ==='null')?null:$scope.$stateParams.courseName, //选中课程名称
                selectedCourseCateId: null, //选中课程分类id
                selectedCourseCateName: null, //选中课程分类名称

                questionSelectionNumber: [
                    {name: '1', value: '1'}, {name: '2', value: '2'}, {name: '3', value: '3'},
                    {name: '4', value: '4'}, {name: '5', value: '5'}, {name: '6', value: '6'},
                    {name: '7', value: '7'}, {name: '8', value: '8'},
                    {name: '9', value: '9'}, {name: '10', value: '10'}
                ],
                question: {
                    questionType: questionService.getQuestionType($scope.$stateParams.questionType)
                },
                questionType: [
                    {name: '单选题', typeCode: 2},
                    {name: '多选题', typeCode: 3},
                    {name: '判断题', typeCode: 1},
                    {name: '填空题', typeCode: 4},
                    {name: '简答题', typeCode: 5},
                    {name: '综合题', typeCode: 6}
                ]
            };

            $scope.data = {
                dataItem: null,
                courseTopic: null
            };

            angular.extend($scope, {
                iscourseCategoryName: {
                    parentId: null,
                    name: null,
                    queryName: ''
                }
            });

            $scope.node = {
                courseGridInstance: null
            };

            $scope.radio = {
                radioSelected: '1',
                subRadioSelected: '1'
            };


            $scope.model.questionCount = 2;
            $scope.model.subQuestionCount = 2;
            $scope.subQuestionCount = 2;

            $scope.$watch('model.selectedCourseCateName', function () {
                if ($scope.model.selectedCourseCateName == '') {
                    $scope.model.selectedCourseCateId = null;
                }
            });

            var courseCatagoryDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '0',
                            myModel = courseCatagoryDataSource.get(options.data.id);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/courseCategoryAction/findByQuery?categoryId=' + id,
                            dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            success: function (result) {
                                angular.forEach(result.info, function (item, index) {
                                    if (index == 0) {
                                        $scope.iscourseCategoryName.queryName = item.name;
                                        $scope.model.orgNames = '资源分类列表';
                                    }
                                });
                                options.success(result);
                            },
                            error: function (result) {
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
                openCourseCategoryTree: function (e) {
                    e.stopPropagation();
                    $scope.CourseCategoryTree = !$scope.CourseCategoryTree;
                },
                getCourseCategoryInfo: function (dataItem) {
                    event.stopPropagation();
                    $scope.model.selectedCourseCateName = dataItem.name;
                    $scope.model.selectedCourseCateId = dataItem.id;
                    $scope.CourseCategoryTree = false;
                },
                searchQuestionLibraryList: function (e) {
                    e.preventDefault();
                    $scope.node.courseGridInstance.dataSource.page(1);
                },
                selectCourse: function () {
                    $scope.CourseCategoryTree = false;
                    $scope.node.windows.addWindow.center().open();
                },
                /** 取消选择课程弹出框 **/
                cancelCourseList: function (e) {
                    e.preventDefault();
                    $scope.node.windows.addWindow.close();
                },
                /**选中课程**/
                checkSelectedCourse: function (dataItem) {
                    // if($scope.model.selectedCourseId != null){
                    //     HB_notification.alert("您已经有选中课程了，不可以多选。");
                    // }else{
                    $scope.model.courseName = dataItem.name;
                    $scope.model.selectedCourseId = dataItem.id;
                    $scope.data.courseTopic = dataItem.topic;
                    $scope.node.windows.addWindow.close();
                    // }
                },
                /**取消选中课程**/
                cancleSelectedCourse: function () {
                    $scope.model.courseName = null;
                    $scope.model.selectedCourseId = null;
                    $scope.data.courseTopic = null;
                },
                cancel: function () {
                    $scope.addQuestionShow = false;
                },
                treeHide: function (e) {
                    e.stopPropagation();
                    $scope.addQuestionlibraryTreeShow = false;
                },
                /**
                 * 打开题库树
                 */
                openAddQuestionTree: function (e) {
                    e.stopPropagation();
                    $scope.addQuestionlibraryTreeShow = !$scope.addQuestionlibraryTreeShow;
                },

                toCreateQuestionLib: function () {
                    $scope.globle.stateGo('states.library', '题库管理', {newlibray: true});
                },

                addQuestionGetOrgInfo: function (dataItem) {
                    if (dataItem.id === '-1') {
                        return;
                    }
                    $scope.model.addQustionParentName = dataItem.name;
                    $scope.model.question.libraryId = dataItem.id;
                    $scope.addQuestionlibraryTreeShow = false;
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
                initFill: function () {
                    $scope.model.question.answerCount = 1;
                    $scope.model.question.answersGroup = [['']];
                },
                initSubFill: function () {
                    $scope.model.subQuestion.answerCount = 1;
                    $scope.model.subQuestion.answersGroup = [['']];
                },
                removeAlternativeAnswers: function (index1, index2) {
                    _.forEach($scope.model.question.answersGroup, function (value, index) {
                        if (index == index1) {
                            value.splice(index2, 1);
                        }
                    });
                },
                //查看填空题说明
                explain: function () {
                    $scope.node.windows.explain.open();
                },
                removeSubAlternativeAnswers: function (index1, index2) {
                    _.forEach($scope.model.subQuestion.answersGroup, function (value, index) {
                        if (index == index1) {
                            value.splice(index2, 1);
                        }
                    });
                },
                addAlternativeAnswers: function (index) {
                    var answers = $scope.model.question.answersGroup[index];
                    answers.push(' ');
                },
                addSubAlternativeAnswers: function (index) {
                    var answers = $scope.model.subQuestion.answersGroup[index];
                    answers.push('');
                },
                //新增多选题，选中答案项
                setMultipleQuestionAnswers: function (id) {
                    var deleteWay = false;
                    var deleteIndex;
                    _.forEach($scope.model.question.correctAnswers, function (varId, index) {
                        if (varId === id) {
                            deleteWay = true;
                            deleteIndex = index;
                            return;
                        }
                    });
                    if (deleteWay) {
                        $scope.model.question.correctAnswers.splice(deleteIndex, 1);
                    } else {
                        $scope.model.question.correctAnswers.push(id);
                    }
                },
                //新增子多选题，选中答案项
                setSubMultipleQuestionAnswers: function (id) {
                    var deleteWay = false;
                    var deleteIndex;
                    _.forEach($scope.model.subQuestion.correctAnswers, function (varId, index) {
                        if (varId === id) {
                            deleteWay = true;
                            deleteIndex = index;
                            return;
                        }
                    });
                    if (deleteWay) {
                        $scope.model.subQuestion.correctAnswers.splice(deleteIndex, 1);
                    } else {
                        $scope.model.subQuestion.correctAnswers.push(id);
                    }
                },
                addAnswerGroup: function () {
                    var answers = [];
                    for (var i = 0; i < $scope.model.question.answerCount; i++) {
                        answers.push('');
                    }
                    $scope.model.question.answersGroup.push(answers);
                },
                addSubAnswerGroup: function () {
                    var answers = [];
                    for (var i = 0; i < $scope.model.subQuestion.answerCount; i++) {
                        answers.push('');
                    }
                    $scope.model.subQuestion.answersGroup.push(answers);
                },
                deleteAnswerGroup: function (index) {
                    if ($scope.model.question.answersGroup.length == 1) {
                        return;
                    }
                    $scope.model.question.answersGroup.splice(index, 1);
                },
                deleteSubAnswerGroup: function (index) {
                    if ($scope.model.subQuestion.answersGroup.length == 1) {
                        return;
                    }
                    $scope.model.subQuestion.answersGroup.splice(index, 1);
                },
                deleteSubQuestion: function (index) {
                    $scope.model.question.subQuestion.splice(index, 1);
                },
                setSubAnswerCount: function () {
                    if ($scope.model.subQuestion.answerType == 2) {
                        var sum = $scope.model.subQuestion.answersGroup.length - $scope.model.subQuestion.answerCount;
                        if (sum == 0) {
                            return;
                        } else if (sum > 0) {
                            for (var i = 0; i < sum; i++) {
                                $scope.model.subQuestion.answersGroup.pop();
                            }
                        } else {
                            for (var i = 0; i < (-sum); i++) {
                                $scope.model.subQuestion.answersGroup.push(['']);
                            }
                        }
                    } else if ($scope.model.subQuestion.answerType == 1) {
                        _.forEach($scope.model.subQuestion.answersGroup, function (answers) {
                            var sum = answers.length - $scope.model.subQuestion.answerCount;
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
                save: function () {
                    var url;
                    var question = angular.copy($scope.model.question);
                    if (!checkQuestion(question)) {
                        return;
                    }
                    if ($scope.addQuestionFrom.$valid) {
                        switch ($scope.model.question.questionType) {
                            case questionService.trueOrFalse:
                                url = 'updateOpinionQuestion';
                                break;
                            case questionService.selectOne:
                                url = 'updateRadioQuestion';
                                for (var i = 0; i < question.configurationItems.length; i++) {
                                    var itme = question.configurationItems[i];
                                    if (i + 1 == $scope.radio.radioSelected) {
                                        question.correctAnswer = itme.id;
                                        break;
                                    }
                                }
                                break;
                            case questionService.multiSelect:
                                if (question.correctAnswers.length < 1) {
                                    $scope.globle.showTip('请至少现在一个正确选项', 'error');
                                    return;
                                }
                                url = 'updateMultipleQuestion';
                                break;
                        }
                        questionService.updateQuestion(question, $scope.model.selectedCourseId, url).then(function (data) {
                            if (!data.status) {
                                $scope.globle.alert('更新失败!', data.info);
                            } else {
                                $state.go('states.questionManage').then(function () {
                                    $state.reload($state.current);
                                });
                            }
                        });
                    } else {
                        $scope.globle.showTip('试题信息不完整', 'error');
                    }

                },
                toChinese: function (index) {
                    return questionService.utils.toChinese(index + 1);
                },
                setSubQuestionCount: function () {
                    var sum = $scope.model.subQuestion.configurationItems.length - $scope.model.subQuestionCount;
                    if (sum == 0) {
                        return;
                    } else if (sum > 0) {
                        for (var i = 0; i < sum; i++) {
                            $scope.model.subQuestion.configurationItems.pop();
                            $scope.radio.subRadioSelected = $scope.model.subQuestionCount;
                        }
                    } else {
                        for (var i = 0; i < (-sum); i++) {
                            $scope.model.subQuestion.configurationItems.push({
                                id: $scope.model.optionIndex++
                            });
                        }
                    }
                },
                saveSubQuestion: function (type) {
                    var subQuestion = $scope.model.subQuestion;
                    if (!checkSubQuestion($scope.model.subQuestion)) {
                        return;
                    }
                    if ($scope.addSubQuestionFrom.$valid) {
                        //如果是单选题
                        if ($scope.model.subQuestion.questionType === questionService.selectOne) {

                            for (var i = 0; i < subQuestion.configurationItems.length; i++) {
                                var itme = subQuestion.configurationItems[i];
                                if (i + 1 == $scope.radio.subRadioSelected) {
                                    subQuestion.correctAnswer = itme.id;
                                    break;
                                }
                            }
                        }
                        var questionJson = angular.toJson($scope.model.subQuestion);
                        var child = {
                            id: '222',
                            topic: $scope.model.subQuestion.topic,
                            questionType: $scope.model.subQuestion.questionType,
                            questionJson: questionJson
                        };
                        $scope.model.question.subQuestion.push(
                            child
                        );
                        if (type == 1) {
                            $scope.node.windows.subQuestionWindow.close();
                        } else {
                            this.initAddSubQuestion();
                        }
                    } else {
                        $scope.globle.showTip('试题信息不完整', 'error');
                    }
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
                tree: questionService.treeConfig(0, 0),
                windowOptions: questionService.windowConfig(),
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
                                    //$scope.questionSelcted=false;
                                    //localDB.selectedIdArray=[];
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
                            {title: '状态', field: 'status', width: 50},
                            {title: '学分', field: 'credit', width: 50},
                            {title: '弹窗题', field: 'popQuestionNum', width: 60},
                            {
                                title: '操作', width: 70,
                                template: kendo.template(
                                    '<button class="table-btn" has-permission="questionManage/selectCourseForUpdateQue" ng-show="events.checked(dataItem,true)" ng-click="events.checkSelectedCourse(dataItem)">选择</button>' +
                                    '<button class="table-btn" has-permission="questionManage/selectCourseForUpdateQue" ng-show="events.checked(dataItem,false)" ng-click="events.cancleSelectedCourse()">取消选择</button>')
                            }
                        ]
                    }
                }
            };


            getQuestion();

            /**
             *
             * 校验试题模型
             * **/
            function checkQuestion (question) {
                if (question.libraryId == null || question.libraryId === '') {
                    $scope.globle.showTip('请选择题库', 'error');
                    return false;
                }
                // if ($scope.model.courseName == null || $scope.model.courseName === '') {
                //     $scope.globle.showTip('请选择试题所属课程', 'error');
                //     return false;
                // }
                if (question.topic == null || question.topic === '') {
                    $scope.globle.showTip('试题题目不能为空', 'error');
                    return false;
                }
                if (question.questionType == questionService.composite) {
                    if (question.subQuestion == null || question.subQuestion.length < 1) {
                        $scope.globle.showTip('至少添加一个子题', 'error');
                        return false;
                    }
                }
                return true;
            };

            /**
             * 校验子试题模型
             * */
            function checkSubQuestion (question) {
                if (question.topic == null || question.topic === '') {
                    $scope.globle.showTip('试题题目不能为空', 'error');
                    return false;
                }
                return true;
            };

            function getQuestion () {
                var questionType = $scope.model.question.questionType;

                questionService.findQuestionById(questionId, questionType).then(function (data) {

                    $scope.model.question = data.info;
                    $scope.model.question.questionType = questionType;
                    $scope.model.addQustionParentName = data.info.libraryName;

                    //如果是单选题
                    if (questionType == questionService.selectOne) {
                        angular.forEach($scope.model.question.configurationItems, function (item, index) {
                            if (item.id == $scope.model.question.correctAnswer) {
                                $scope.radio.radioSelected = index + 1;
                            }
                        });
                    }
                    if (questionType !== questionService.trueOrFalse) {
                        $scope.model.questionCount = $scope.model.question.configurationItems.length;
                    }
                });
            }

            $scope.ui.courseGrid.options = _.merge({}, KENDO_UI_GRID, $scope.ui.courseGrid.options);
        }];

    return controller;
});
