define(function (learningProcess) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'learningProcesService', 'kendo.grid', '$timeout', '$state', 'classInformationServices', function ($scope, learningProcesService, kendoGrid, $timeout, $state, classInformationServices) {
            $scope.learnProcessModel = {
                trainingYear: '',
                subjectId: '',
                courseTrainingYear: '',
                courseSubjectId: '',
                titleLevel: -1,
                testResult: -2,
                page: {
                    pageSize: 10,
                    pageNo: 1
                },
                searchLearning: false,
                noLearningProcess: true
            };
            $scope.model.configState = 'course';
            $scope.model.categoryId = 'TRAINING_CLASS_GOODS';
            $scope.model.courseCategoryId = 'COURSE_SUPERMARKET_GOODS';
            $scope.model.mark = false;


            function numAdd (num1, num2) {
                var baseNum, baseNum1, baseNum2;
                try {
                    baseNum1 = num1.toString().split('.')[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split('.')[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                return (num1 * baseNum + num2 * baseNum) / baseNum;
            };


            $scope.events = {
                tabConfig: function (state) {
                    $scope.model.configState = state;
                    if (state == 'course') {
                        findUserTrainCourseMessage();

                    }
                    if (state == 'class') {
                        /*findUserTrainClassMessage();*/
                        $scope.node.learningClass.pager.page(1);
                    }
                },
                coursePageQueryList: function () {
                    findUserTrainCourseMessage();
                },
                MainPageQueryList: function (e) {
                    $scope.learnProcessModel.page.pageNo = 1;
                    $scope.node.learningClass.pager.page(1);
                }


            };

            $scope.$watch('model.userId', function (newVal) {
                if (newVal) {
                    $scope.model.mark = false;
                    classInformationServices.doview($state.current.name);
                    $scope.learnProcessModel.buyerIds = newVal;
                    findUserTrainCourseMessage();
                    if (newVal === '') {
                        $scope.learnProcessModel.searchLearning = false;
                        $scope.learnProcessModel.noLearningProcess = true;
                        $scope.model.mark = true;
                    } else {
                        $scope.learnProcessModel.noLearningProcess = false;
                        if ($scope.learnProcessModel.searchLearning) {
                            findUserTrainCourseMessage();
                            $scope.node.learningClass.pager.page(1);
                        } else {
                            if ($scope.model.classTab === 4) {
                                $scope.learnProcessModel.searchLearning = true;
                                $scope.model.mark = true;
                            }
                        }
                    }
                }
            });

            /**
             * 获取自主选课信息
             */
            function findUserTrainCourseMessage () {
                learningProcesService.getTrainCourseInfoByUserId({
                    userId: $scope.learnProcessModel.buyerIds,
                    skuPropertyList: validateIsNull($scope.skuParamsCourseLearning) == true ? null : $scope.skuParamsCourseLearning.skuPropertyList
                }).then(function (data) {
                    if (data.status) {
                        $scope.model.trainCourseMessage = data.info;
                        $scope.model.mark = true;
                    } else {
                        $scope.globle.showTip(data.info, 'error');
                        $scope.model.mark = true;
                    }

                });
            }

            /**
             * 获取学员培训班级信息
             */

            $scope.node = {
                learningClass: null
            };
            var learningClassTemplate = '';
            (function () {
                var result = [];
                result.push('<tr ng-class="{\'k-state-selected\':classInfoModel.useIndex === dataItem.index}" ng-click="events.chooseUse(dataItem)">');

                result.push('<td>');
                result.push('#: index #');
                result.push('</td>');

                result.push('<td title="#: className #">');
                result.push('#: className #');
                result.push('</td>');

                result.push('<td>');
                //hbSkuService.kendoSkuDo(result);
                //result.push ( '<div ng-repeat="item in dataItem.skuPropertyNameList">');
                //result.push ( '<span ng-bind="item.skuPropertyName"></span>：' + '<span ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>' );
                result.push('科目：' + '#: subjectName #');
                result.push('<br />');
                result.push('年度：' + '#: year #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: studyHour #');
                result.push('</td>');


                result.push('<td>');
                result.push('课程进度>=#: requiredProcess #<span ng-if="#: hasExamAssess #==true&&#: hasPopAssess #==false">且考试成绩>= #: requiredScore # 分</span>'
                    + '<span ng-if="#: hasExamAssess #==true&&#: hasPopAssess #==true">且考核成绩>= #: requiredScore #分（考试成绩</span><br ng-if="#: hasExamAssess #==true&&#: hasPopAssess #==true"/><span ng-if="#: hasExamAssess #==true&&#: hasPopAssess #==true">>=#: requiredExamScore #分与弹窗题考核成绩>=#: requiredPopScore #分）</span>'
                    + '<span ng-if="#: hasExamAssess #==false&&#: hasPopAssess #==true">且弹窗题考核成绩>= #: requiredScore #分 </span>');
                result.push('</td>');

                result.push('<td>');
                result.push('课程进度=#: nowProcess #%<span ng-if="#: hasExamAssess #==true&&#: hasPopAssess #==false "">考试成绩=#: nowExamScore === \'\' ? \'--\' : nowExamScore #分 </span>'
                    + '<span ng-if="#: hasExamAssess #==true&&#: hasPopAssess #==true">考核成绩= #: nowScore #分（考试成绩</span><br ng-if="#: hasExamAssess #==true&&#: hasPopAssess #==true"/><span ng-if="#: hasExamAssess #==true&&#: hasPopAssess #==true">=#: nowExamScore #分与弹窗题考核成绩=#: nowPopScore #分）</span>'
                    + '<span ng-if="#: hasExamAssess #==false&&#: hasPopAssess #==true">弹窗题考核成绩= #: nowPopScore # 分</span>');
                result.push('</td>');

                result.push('<td>');
                result.push('#: result #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: result === \'合格\' ? passTime : \'--\' #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: userState #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: createType #');
                result.push('</td>');

                result.push('</tr>');
                learningClassTemplate = result.join('');
            })();
            $scope.ui.learningClass = {
                options: {
                    // 每个行的模板定义,
                    rowTemplate: kendo.template(learningClassTemplate),
                    scrollable: true,
                    noRecords: {
                        template: '暂无数据'
                    },
                    dataSource: {
                        transport: {
                            read: {
                                contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                url: '/web/admin/studyProcess/getStudyProcessPage',
                                data: function (e) {
                                    var temp = {
                                        query: {
                                            userId: $scope.learnProcessModel.buyerIds
                                        },
                                        page: {
                                            pageNo: e.page,
                                            pageSize: $scope.learnProcessModel.page.pageSize
                                        }
                                    };
                                    if (!$scope.skuParamsClassLearning) {
                                        temp.query.skuPropertyList = undefined;
                                    } else {
                                        temp.query.skuPropertyList = $scope.skuParamsClassLearning.skuPropertyList;
                                    }
                                    if (temp.query.careerLevel === -1) {
                                        delete temp.query.careerLevel;
                                    }

                                    //temp.query=angular.extend(temp.query,$scope.learningProcess);


                                    $scope.learnProcessModel.page.pageNo = e.page;
                                    $scope.learnProcessModel.page.pageSize = e.pageSize;
                                    delete e.page;
                                    delete e.pageSize;
                                    delete e.skip;
                                    delete e.take;
                                    return temp;
                                },
                                dataType: 'json'
                            }

                        },
                        pageSize: 10, // 每页显示的数据数目
                        schema: {
                            // 数据源默认绑定的字段
                            // 后台返回的数据结构如果是{"d": {"result": []}}  -- 》 data: "d.results"
                            // 后台返回的数据结构如果是{"result": []} -- 》 data: "results"
                            // 优先与后面的data执行，返回的数据为下面data上面的参数response
                            parse: function (response) {
                                $timeout(function () {
                                    $scope.model.mark = true;
                                });
                                // 将会把这个返回的数组绑定到数据源当中
                                if (response.status) {
                                    if (response.info.length === 0) {
                                        $timeout(function () {
                                            //$scope.learnProcessModel.noLearningProcess = true;
                                        });
                                    } else {
                                        $timeout(function () {
                                            $scope.learnProcessModel.noLearningProcess = false;
                                        });
                                    }
                                    var dataview = response.info, index = 1;
                                    angular.forEach(dataview, function (item) {
                                        item.index = index++;
                                        if (item.result === -1) {
                                            item.result = '未考核';
                                        } else if (item.result === 0) {
                                            item.result = '不合格';
                                        } else {
                                            item.result = '合格';
                                        }
                                        ;
                                        if (item.userState === 0) {
                                            item.userState = '有效';
                                        }
                                        if (item.userState === 1) {
                                            item.userState = '冻结';
                                        }
                                        if (item.userState === 2) {
                                            item.userState = '失效';
                                        }
                                        ;
                                        if (item.nowPopScore === '' || item.nowExamScore === '') {
                                            if (item.nowPopScore === '' && item.nowExamScore !== '') {
                                                item.nowTotalScore = item.nowExamScore;
                                            } else if (item.nowPopScore !== '' && item.nowExamScore === '') {
                                                item.nowTotalScore = item.nowPopScore;
                                            } else {
                                                item.nowTotalScore = '--';
                                            }
                                        } else {
                                            item.nowTotalScore = numAdd(item.nowPopScore, item.nowExamScore);
                                        }
                                    });
                                }
                                return response;
                            },
                            total: function (response) {
                                return response.totalSize;
                            },
                            data: function (response) {
                                return response.info;
                            } // 指定数据源
                        },
                        serverPaging: true, //远程获取书籍
                        serverSorting: true //远程排序字段
                    },
                    selectable: true,
                    sortable: {
                        mode: 'single',
                        allowUnsort: false
                    },
                    dataBinding: function (e) {
                        //$scope.model.gridReturnData = e.items;
                        kendoGrid.nullDataDealLeaf(e);
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
                        pageSize: 10,
                        buttonCount: 10
                        //change: function (e) {
                        //    $scope.model.page.pageNo = parseInt(e.index, 10);
                        //    //== !!important!! 这里重复了page(1)的作用
                        //    // $scope.node.lessonGrid.dataSource.read();
                        //}
                    },
                    // 选中切换的时候改变选中行的时候触发的事件
                    columns: [
                        {
                            title: 'No',
                            width: 50
                        },
                        {sortable: false, field: 'name', title: '培训班名称', width: 200},
                        {sortable: false, field: 'name', title: '培训班属性', width: 180},
                        {sortable: false, field: 'name', title: '学时', width: 75},
                        {sortable: false, field: 'name', title: '考核要求', width: 300},
                        {sortable: false, field: 'name', title: '考核结果', width: 300},
                        {sortable: false, field: 'name', title: '是否合格', width: 80},
                        {sortable: false, field: 'name', title: '合格时间', width: 150},
                        {sortable: false, field: 'name', title: '班级状态', width: 115},
                        {sortable: false, field: 'name', title: '创建方式', width: 90}
                    ]
                }
            };

            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            function resetParam () {
                $scope.learnProcessModel.trainingYear = '';
                $scope.learnProcessModel.subjectId = '';
            }

        }]
    };
});