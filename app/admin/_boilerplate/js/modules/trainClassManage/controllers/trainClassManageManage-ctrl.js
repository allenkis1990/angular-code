define(function () {
    'use strict';
    return ['$scope', 'trainClassManageService', 'KENDO_UI_GRID', 'kendo.grid', '$state', '$stateParams', '$timeout', 'TabService',
        function ($scope, trainClassManageService, KENDO_UI_GRID, kendoGrid, $state, $stateParams, $timeout, TabService) {
            var utils;
            $scope.model = {
                trainClassName: $stateParams.name,//导航栏显示的培训班名称
                //控制tab的切换、显示隐藏等
                states: {
                    currentState: 'statistic',//当前的功能tab的状态，统计、阅卷（如果培训班没有配置考试，则不可点击‘阅卷tab’）
                    statisticDimension: 'student',//统计功能下的维度，学员维度、课程维度、考核情况
                    hasExamRound: false//培训班是否有配置场次,有则阅卷tab可以使用，没有则阅卷按钮不能使用
                },
                /**
                 * 查询功能相关model
                 */
                statistic: {
                    /**
                     * 学员维度统计
                     */
                    student: {
                        //学员维度查询的查询条件
                        queryParam: {
                            trainClassId: $stateParams.id,//培训班id
                            studentName: '',//学员名称
                            unitId: '',//单位id
                            unitName: ''//单位名称
                            /*,
                             organizationId: '',//部门id
                             organizationName: ''//部门名称*/
                        },
                        //学员维度课程查询条件
                        courseQueryParam: {
                            trainClassId: $stateParams.id,//培训班id
                            studentId: '',//学员id
                            courseName: ''//课程名称
                        },
                        //学员维度分页参数
                        page: {
                            pageSize: 10,
                            pageNo: 1
                        },
                        //学员维度课程查询分页参数
                        coursePage: {
                            pageSize: 10,
                            pageNo: 1
                        },
                        //培训班课程总数
                        courseCount: 0,
                        //学员维度课程统计信息
                        courseCountObject: {
                            total: 0,//全部课程数
                            finish: 0,//已完成课程数
                            studying: 0,//在学课程数
                            neverStart: 0//未学课程数
                        },
                        showUnitTree: false,
                        /*showOrganizationTree: false,*/
                        studentName: ''
                    },

                    /**
                     * 课程维度统计
                     */
                    course: {
                        //课程维度查询条件
                        queryParam: {
                            trainClassId: $stateParams.id,//培训班id
                            courseName: '',//课程名称
                            courseCategoryId: '',//课程分类id
                            courseCategoryName: ''//课程分类名称
                        },
                        //课程维度学员查询条件
                        studentQueryParam: {
                            trainClassId: $stateParams.id,//培训班id
                            courseId: '',//课程id
                            studentName: ''//学员姓名
                        },
                        //课程维度分页参数
                        page: {
                            pageSize: 10,
                            pageNo: 1
                        },
                        //课程维度学员查询分页参数
                        studentPage: {
                            pageSize: 10,
                            pageNo: 1
                        },
                        //培训班学员总数
                        studentCount: 0,
                        //课程维度学员统计信息
                        studentCountObject: {
                            total: 0,//应学人数
                            finish: 0,//已完成学习人数
                            studying: 0,//在学人数
                            neverStart: 0//未学人数
                        },
                        showCourseCategoryTree: false,
                        courseName: ''
                    },


                    /**
                     * 考核维度查询条件
                     */
                    check: {
                        //考核维度查询条件
                        queryParam: {
                            trainClassId: $stateParams.id,//培训班id
                            studentName: '',//学员姓名
                            unitId: '',//学员所在单位id，
                            unitName: '',//学员所在单位名称
                            /*organizationId: '',//学员所在部门id
                             organizationName: '',//学员所在部门名称*/
                            isPass: '-1'//合格与否 （ '-1'-全部，'0'-不合格，'1'-合格）
                        },
                        //考核维度分页参数
                        page: {
                            pageSize: 10,
                            pageNo: 1
                        },
                        //考核通过人数统计对象
                        checkPassObject: {
                            pass: 0,//考核通过人数
                            total: 0//总人数
                        },
                        //是否多个考核条件及多条件的关系
                        manyConditionObject: {
                            isManyCondition: true,//是否多个考核条件
                            relationType: ''//多个考核条件之间的关系 “或”  “且”

                        },
                        assessRule: {},//培训班考核规则
                        showUnitTree: false//显示隐藏单位树变量
                    }
                }
                ,
                /**
                 * 阅卷功能
                 */
                markExam: {
                    exams: []//培训班配置的场次信息
                }
            };

            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //统计功能
                statistic: {
                    //学员维度统计
                    student: {
                        studentGrid: null,//学员维度统计列表
                        courseGrid: null//学员所有课程统计列表
                    },
                    //课程维度统计
                    course: {
                        courseGrid: null,//课程维度统计列表
                        studentGrid: null//课程下所有学员统计列表
                    },
                    //考核维度统计
                    check: {
                        grid: null//数据列表
                    }
                },
                //阅卷功能
                markExam: {
                    grid: null,
                    enterTimeBegin: null,
                    enterTimeEnd: null
                }
            };

            /**
             * 加载需要加载的全局数据
             */
            //获取培训班下配置的场次信息，如果没有场次信息，则阅卷tab不可操作
            trainClassManageService.findTrainClassExam($stateParams.id).then(function (data) {
                if (data.status) {
                    if (data.info.length > 0) {
                        $scope.model.markExam.exams = data.info;
                        $scope.model.states.hasExamRound = true;
                    } else {
                        $scope.model.states.hasExamRound = false;
                    }
                } else {
                    $scope.globle.alert('错误', '查询培训班的场次配置情况出现异常！');
                }
            });
            //获取培训班下的课程总数
            trainClassManageService.getCourseTotalCountByTrainClassId($stateParams.id).then(function (data) {
                if (data.status) {
                    $scope.model.statistic.student.courseCount = data.info;
                } else {
                    $scope.globle.alert('错误', data.info);
                }
            });

            //获取培训班下的学员总数
            trainClassManageService.getStudentTotalCountByTrainClassId($stateParams.id).then(function (data) {
                if (data.status) {
                    $scope.model.statistic.course.studentCount = data.info;//课程维度培训班总人数
                    $scope.model.statistic.check.checkPassObject.total = data.info;//考核维度培训班总人数
                } else {
                    $scope.globle.alert('错误', data.info);
                }
            });

            //获取培训班的考核规则
            trainClassManageService.getTrainClassAssessRule($stateParams.id).then(function (data) {
                if (data.status) {
                    $scope.model.statistic.check.assessRule = data.info;
                    //如果是多个条件，则需要指定多个条件之间的关系
                    if (data.info.itemList.length > 1) {
                        $scope.model.statistic.check.manyConditionObject.isManyCondition = true;
                        if (data.info.rule.indexOf('||') > -1) {
                            $scope.model.statistic.check.manyConditionObject.relationType = '或';
                        } else if (data.info.rule.indexOf('&&') > -1) {
                            $scope.model.statistic.check.manyConditionObject.relationType = '且';
                        } else {
                            $scope.model.statistic.check.manyConditionObject.relationType = '非法关系';
                        }
                    } else {
                        $scope.model.statistic.check.manyConditionObject.isManyCondition = false;
                    }
                } else {
                    $scope.globle.alert('错误', data.info);
                }
            });

            //获取培训班的考核通过人数
            trainClassManageService.getPassAssessStudentTotalCount($stateParams.id).then(function (data) {
                if (data.status) {
                    $scope.model.statistic.check.checkPassObject.pass = data.info;//考核维度培训班考核通过人数
                } else {
                    $scope.globle.alert('错误', data.info);
                }
            });

            $scope.events = {

                /**
                 * 切换功能tab（统计、阅卷）
                 * @param tab
                 */
                changeFunction: function (tab) {
                    $scope.model.states.currentState = tab;
                },

                /**
                 * 切换统计维度tab（学员维度、课程维度、考核情况）
                 * @param dimension
                 */
                changeStatisticDimension: function (dimension) {
                    $scope.model.states.statisticDimension = dimension;
                },
                /**
                 * 统计功能的事件
                 */
                statistic: {
                    //学员维度统计的事件
                    studentDimension: {
                        /**
                         * 显示单位树
                         * @param e
                         */
                        openUnitTree: function (e) {
                            e.stopPropagation();
                            $scope.model.statistic.student.showUnitTree = true;
                        },
                        /**
                         * 隐藏单位树
                         * @param e
                         */
                        closeUnitTree: function (e) {
                            e.stopPropagation();
                            $scope.model.statistic.student.showUnitTree = false;
                        },
                        /*/!**
                         * 显示部门树
                         * @param e
                         *!/
                         openOrganizationTree: function (e) {
                         e.stopPropagation();
                         $scope.model.statistic.student.showOrganizationTree = true;
                         },
                         /!**
                         * 隐藏部门树
                         * @param e
                         *!/
                         closeOrganizationTree: function (e) {
                         e.stopPropagation();
                         $scope.model.statistic.student.showOrganizationTree = false;
                         },*/
                        /**
                         * 获取单位
                         * @param dataItem
                         * @param e
                         */
                        getUnit: function (e, dataItem) {
                            e.stopPropagation();
                            /*if (dataItem.id != $scope.model.statistic.student.queryParam.unitId) {
                             /!* $timeout(function(){

                             });*!/
                             $scope.model.statistic.student.queryParam.organizationId = '';
                             $scope.model.statistic.student.queryParam.organizationName = '';
                             }*/
                            $scope.model.statistic.student.queryParam.unitId = dataItem.id;
                            $scope.model.statistic.student.queryParam.unitName = dataItem.name;
                            //$scope.ui.statistic.studentDimension.organizationTree.options.dataSource.read();
                            $scope.model.statistic.student.showUnitTree = false;
                        },
                        /*/!**
                         * 获取部门
                         * @param dataItem
                         * @param e
                         *!/
                         getOrganization: function (e, dataItem) {
                         e.stopPropagation();
                         $scope.model.statistic.student.queryParam.organizationId = dataItem.id;
                         $scope.model.statistic.student.queryParam.organizationName = dataItem.name;
                         $scope.model.statistic.student.showOrganizationTree = false;
                         },*/
                        /**
                         * 学员统计查询条件点击回车
                         * @param e
                         */
                        studentPagePressEnterKey: function (e) {
                            if (e.keyCode === 13) {
                                this.studentPageQuery(e);
                            }
                        },
                        /**
                         * 学员统计查询
                         * @param e
                         */
                        studentPageQuery: function (e) {
                            $scope.model.statistic.student.page.pageNo = 1;
                            if ($scope.model.statistic.student.queryParam.unitName == null || $scope.model.statistic.student.queryParam.unitName == '') {
                                $scope.model.statistic.student.queryParam.unitId = null;
                                /*$scope.model.statistic.student.queryParam.organizationId = null;
                                 $scope.model.statistic.student.queryParam.organizationName = null;*/
                            }
                            /*if ($scope.model.statistic.student.queryParam.organizationName == null || $scope.model.statistic.student.queryParam.organizationName == '') {
                             $scope.model.statistic.student.queryParam.organizationId = null;
                             }*/
                            $scope.node.statistic.student.studentGrid.pager.page(1);
                            e.preventDefault();
                        },
                        /**
                         * 查看学员课程完成情况详情
                         * @param e
                         * @param dataItem
                         */
                        detail: function (e, dataItem) {
                            $scope.model.statistic.student.studentName = dataItem.studentName;
                            $scope.model.statistic.student.courseCountObject.total = dataItem.totalCount;
                            $scope.model.statistic.student.courseCountObject.finish = dataItem.finishCount;
                            $scope.model.statistic.student.courseCountObject.neverStart = dataItem.neverStartCount;
                            $scope.model.statistic.student.courseCountObject.studying = dataItem.studyingCount;
                            //$scope.model.statistic.student.courseQueryParam.trainClassId = dataItem.trainClassId;
                            $scope.model.statistic.student.courseQueryParam.studentId = dataItem.studentId;
                            $scope.model.statistic.student.coursePage.pageNo = 1;
                            $scope.node.statistic.student.courseGrid.pager.page(1);
                            $scope.node.statistic.student.detailWindow.open();
                        },
                        /**
                         * 学员课程统计查询条件点击回车
                         * @param e
                         */
                        coursePagePressEnterKey: function (e) {
                            if (e.keyCode === 13) {
                                this.coursePageQuery(e);
                            }
                        },
                        /**
                         * 学员课程统计查询
                         * @param e
                         */
                        coursePageQuery: function (e) {
                            e.stopPropagation();
                            $scope.model.statistic.student.coursePage.pageNo = 1;
                            $scope.node.statistic.student.courseGrid.pager.page(1);
                        }

                    },
                    //课程维度统计的事件
                    courseDimension: {
                        /**
                         * 显示单位树
                         * @param e
                         */
                        openCourseCategoryTree: function (e) {
                            e.stopPropagation();
                            $scope.model.statistic.course.showCourseCategoryTree = true;
                        },
                        /**
                         * 隐藏单位树
                         * @param e
                         */
                        closeCourseCategoryTree: function (e) {
                            e.stopPropagation();
                            $scope.model.statistic.course.showCourseCategoryTree = false;
                        },
                        /**
                         * 获取课程分类
                         * @param dataItem
                         * @param e
                         */
                        getCourseCategory: function (e, dataItem) {
                            e.stopPropagation();
                            trainClassManageService.findHashLessonType(dataItem.id).then(function (data) {
                                if (!data.info) {
                                    $scope.model.statistic.course.queryParam.courseCategoryId = dataItem.id;
                                    $scope.model.statistic.course.queryParam.courseCategoryName = dataItem.name;
                                    $scope.model.statistic.course.showCourseCategoryTree = false;
                                }
                            });

                        },
                        /**
                         * 课程统计查询条件点击回车
                         * @param e
                         */
                        coursePagePressEnterKey: function (e) {
                            if (e.keyCode === 13) {
                                this.coursePageQuery(e);
                            }
                        },
                        /**
                         * 课程统计查询
                         * @param e
                         */
                        coursePageQuery: function (e) {
                            $scope.model.statistic.course.page.pageNo = 1;
                            if ($scope.model.statistic.course.queryParam.courseCategoryName == null || $scope.model.statistic.course.queryParam.courseCategoryName == '') {
                                $scope.model.statistic.course.queryParam.courseCategoryId = null;
                            }
                            $scope.node.statistic.course.courseGrid.pager.page(1);
                            e.preventDefault();
                        },
                        /**
                         * 查看课程下所有学员完成情况详情
                         * @param e
                         * @param dataItem
                         */
                        detail: function (e, dataItem) {
                            $scope.model.statistic.course.courseName = dataItem.courseName;
                            $scope.model.statistic.course.studentCountObject.total = dataItem.totalCount;
                            $scope.model.statistic.course.studentCountObject.finish = dataItem.finishCount;
                            $scope.model.statistic.course.studentCountObject.neverStart = dataItem.neverStartCount;
                            $scope.model.statistic.course.studentCountObject.studying = dataItem.studyingCount;
                            //$scope.model.statistic.course.studentQueryParam.trainClassId = dataItem.trainClassId;
                            $scope.model.statistic.course.studentQueryParam.courseId = dataItem.courseId;
                            $scope.model.statistic.course.studentPage.pageNo = 1;
                            $scope.node.statistic.course.studentGrid.pager.page(1);
                            $scope.node.statistic.course.detailWindow.open();
                        },
                        /**
                         * 学员课程统计查询条件点击回车
                         * @param e
                         */
                        studentPagePressEnterKey: function (e) {
                            if (e.keyCode === 13) {
                                this.studentPageQuery(e);
                            }
                        },
                        /**
                         * 学员课程统计查询
                         * @param e
                         */
                        studentPageQuery: function (e) {
                            e.stopPropagation();
                            $scope.model.statistic.course.studentPage.pageNo = 1;
                            $scope.node.statistic.course.studentGrid.pager.page(1);
                        }
                    },
                    //考核情况统计维度的事件
                    checkDimension: {
                        /**
                         * 显示单位树
                         * @param e
                         */
                        openUnitTree: function (e) {
                            e.stopPropagation();
                            $scope.model.statistic.check.showUnitTree = true;
                        },
                        /**
                         * 隐藏单位树
                         * @param e
                         */
                        closeUnitTree: function (e) {
                            e.stopPropagation();
                            $scope.model.statistic.check.showUnitTree = false;
                        },
                        /**
                         * 获取单位
                         * @param dataItem
                         * @param e
                         */
                        getUnit: function (e, dataItem) {
                            e.stopPropagation();
                            $scope.model.statistic.check.queryParam.unitId = dataItem.id;
                            $scope.model.statistic.check.queryParam.unitName = dataItem.name;
                            //$scope.ui.statistic.studentDimension.organizationTree.options.dataSource.read();
                            $scope.model.statistic.check.showUnitTree = false;
                        },
                        /**
                         * 考核查询条件点击回车
                         * @param e
                         */
                        checkPagePressEnterKey: function (e) {
                            if (e.keyCode === 13) {
                                this.checkPageQuery(e);
                            }
                        },
                        /**
                         * 考核查询
                         * @param e
                         */
                        checkPageQuery: function (e) {
                            $scope.model.statistic.check.page.pageNo = 1;
                            if ($scope.model.statistic.check.queryParam.unitName == null || $scope.model.statistic.check.queryParam.unitName == '') {
                                $scope.model.statistic.check.queryParam.unitId = null;
                            }
                            $scope.node.statistic.check.grid.pager.page(1);
                            e.preventDefault();
                        }
                    }
                },

                /**
                 * 阅卷功能的事件
                 */
                markExam: {
                    /**
                     * 点击答卷管理，进入考试管理的答卷管理页面
                     * @param e
                     * @param dataItem
                     */
                    toExamAnswerPaperManagePage: function (e, dataItem) {
                        TabService.appendNewTab('考试管理', 'states.exam.answerPaper', {id: dataItem.id}, 'states.exam', true);
                    },
                    /**
                     * 预览试卷
                     *
                     * @param e event object
                     * @param dataItem row data
                     * @author choaklin
                     */
                    preview: function (e, dataItem) {
                        e.stopPropagation();
                        trainClassManageService.getExamViewUrl(dataItem.examPaperId, 4).then(function (data) {
                            window.open(data.info);
                        });
                        /*var id = dataItem.examPaperId;
                         e.preventDefault();
                         window.open('/exam/#/preview/' + id+'/'+dataItem.name);*/
                    }
                }
            };


//=============分页开始=======================
            var gridRowTemplate = {
                statistic: {//统计功能的分页表格模板
                    studentDimension: {//学员维度
                        studentGrid: '',//学员分页
                        courseGrid: ''//学员所学课程分页
                    },
                    courseDimension: {//课程维度
                        courseGrid: '',//课程分页
                        studentGrid: ''//课程所有学员分页
                    },
                    checkDimension: {//考核维度
                        grid: ''//考核分页
                    }
                },
                markExam: ''//阅卷功能分页表格模板
            };

            /**
             * 统计功能--学员维度--学员分页表格模板
             */
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('#: studentName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: unitName#');
                result.push('</td>');

                result.push('<td>');
                result.push('#: finishRate #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: finishCount #/#: neverStartCount #/#: studyingCount #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#:lastStudyTime#');
                result.push('</td>');
                //
                //result.push('<td>');
                //result.push('#:order#');
                //result.push('</td>');

                result.push('<td>');
                result.push('<button type="button"class="table-btn" ng-click="events.statistic.studentDimension.detail($event,dataItem)">详情</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate.statistic.studentDimension.studentGrid = result.join('');
            })();
            /**
             * 统计功能--学员维度--学员所学课程分页表格模板
             */
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('#: courseName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: schedule#');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate.statistic.studentDimension.courseGrid = result.join('');
            })();

            /**
             * 统计功能--课程维度--课程分页表格模板
             */
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('#: courseName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: courseCategoryName#');
                result.push('</td>');

                result.push('<td>');
                result.push('#: finishRate #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: finishCount #/#: studyingCount #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('<button type="button"class="table-btn" ng-click="events.statistic.courseDimension.detail($event,dataItem)">详情</button>');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate.statistic.courseDimension.courseGrid = result.join('');
            })();
            /**
             * 统计功能--课程维度--课程下所有学员学习情况分页表格模板
             */
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('#: studentName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: schedule#');
                result.push('</td>');

                result.push('</tr>');
                gridRowTemplate.statistic.courseDimension.studentGrid = result.join('');
            })();

            /**
             * 统计功能--考核--考核分页表格模板
             */
            (function () {
                var result = [];
                result.push('<tr>');
                result.push('<td>');
                result.push('#: studentName #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: unitName#');
                result.push('</td>');

                result.push('<td>');
                result.push('#: courseFinishRate #');
                result.push('</td>');

                result.push('<td>');
                result.push('#: courseFinishCount #');
                result.push('</div>');
                result.push('</td>');

                result.push('<td>');
                result.push('#:examRoundFinishRate#');
                result.push('</td>');

                result.push('<td>');
                result.push('#:isPass==\'1\'?\'是\':\'否\'#');
                result.push('</td>');

                /*result.push('<td>');
                 result.push('<button type="button"class="table-btn" ng-click="events.statistic.studentDimension.detail($event,dataItem)">详情</button>');
                 result.push('</td>');*/

                result.push('</tr>');
                gridRowTemplate.statistic.checkDimension.grid = result.join('');
            })();
            /**
             * 树数据源
             */
            var dataSource = {
                //统计功能中树数据源
                statistic: {
                    studentDimension: {
                        unitTree: new kendo.data.HierarchicalDataSource({
                            transport: {
                                read: function (options) {
                                    var id = options.data.id ? options.data.id : '',
                                        myModel = dataSource.statistic.studentDimension.unitTree.get(options.data.id);
                                    //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                                    var type = myModel ? myModel.type : '';
                                    $.ajax({
                                        url: '/web/admin/organization/findUnitTree.action?parentId=' + id + '&nodeType=' + type + '&needOrg=false',
                                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for
                                                          // same-domain requests
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
                        })
                        /*,
                         organizationTree: new kendo.data.HierarchicalDataSource({
                         transport: {
                         read: function (options) {
                         var unitId = options.data.unitId ? options.data.unitId : $scope.model.statistic.student.queryParam.unitId;
                         var id = options.data.id ? options.data.id : '';
                         $.ajax({
                         url: "/web/admin/organization/findOrganizationByUnitIdAndParentId.action?unitId=" + unitId + "&parentId=" + id,
                         dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for
                         // same-domain requests
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
                         id: "id",
                         hasChildren: "hasChildren"
                         },
                         data: function (data) {
                         return data.info;
                         }
                         }
                         })*/
                    },
                    courseDimension: {
                        courseCategoryTree: new kendo.data.HierarchicalDataSource({
                            transport: {
                                read: function (options) {
                                    var id = options.data.id ? options.data.id : '0';
                                    //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                                    $.ajax({
                                        url: '/web/admin/lesson/getLessonType?categoryId=' + id,
                                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for
                                                          // same-domain requests
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
                        })
                    },
                    checkDimension: {
                        unitTree: new kendo.data.HierarchicalDataSource({
                            transport: {
                                read: function (options) {
                                    var id = options.data.id ? options.data.id : '',
                                        myModel = dataSource.statistic.studentDimension.unitTree.get(options.data.id);
                                    var type = myModel ? myModel.type : '';
                                    $.ajax({
                                        url: '/web/admin/organization/findUnitTree.action?parentId=' + id + '&nodeType=' + type + '&needOrg=false',
                                        dataType: 'json',
                                        success: function (result) {
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
                                    hasChildren: 'hasChildren'
                                },
                                data: function (data) {
                                    return data.info;
                                }
                            }
                        })
                    }
                },
                //阅卷功能中树数据源
                markExam: {}

            };

            /**
             * 界面展示的所有控件初始化
             * @type {{statistic: {studentDimension: {unitTree: {options: {checkboxes: boolean, dataSource: *}}, organizationTree: {options: {checkboxes: boolean, dataSource: *}}}}, markExam: {datePicker: {begin: {options: {culture: string, format: string, change: $scope.events.markExam.startChange}}, end: {options: {culture: string, format: string, change: $scope.events.markExam.endChange}}}}, trainGrid: {options: {rowTemplate: *, scrollable: boolean, noRecords: {template: string}, dataSource: {transport: {read: {contentType: string, url: string, data: $scope.ui.trainGrid.options.dataSource.transport.read.data, dataType: string}}, pageSize: number, schema: {parse: $scope.ui.trainGrid.options.dataSource.schema.parse, total: $scope.ui.trainGrid.options.dataSource.schema.total, data: $scope.ui.trainGrid.options.dataSource.schema.data}, serverPaging: boolean, serverSorting: boolean}, selectable: boolean, sortable: {mode: string, allowUnsort: boolean}, dataBinding: $scope.ui.trainGrid.options.dataBinding, pageable: {refresh: boolean, pageSizes: boolean, pageSize: number, buttonCount: number}, columns: *[]}}}}
             */
            $scope.ui = {
                /**
                 * 统计功能
                 */
                statistic: {
                    studentDimension: {//学员维度
                        unitTree: {//单位树
                            options: {
                                checkboxes: false,
                                // 当要去远程获取数据的时候数据源这么配置
                                dataSource: dataSource.statistic.studentDimension.unitTree
                            }
                        },
                        /*organizationTree: {//部门树
                         options: {
                         checkboxes: false,
                         // 当要去远程获取数据的时候数据源这么配置
                         dataSource: dataSource.statistic.studentDimension.organizationTree
                         }
                         },*/
                        studentGrid: { //学员列表
                            options: {
                                // 每个行的模板定义,
                                rowTemplate: kendo.template(gridRowTemplate.statistic.studentDimension.studentGrid),
                                scrollable: false,
                                noRecords: {
                                    template: '暂无数据'
                                },
                                dataSource: {
                                    transport: {
                                        read: {
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            url: '/web/admin/trainClass/getManageStudentPage',
                                            data: function (e) {
                                                var temp = {studentQueryParam: {sort: e.sort}},
                                                    params = $scope.model.statistic.student.queryParam;
                                                for (var key in params) {
                                                    if (params.hasOwnProperty(key)) {
                                                        if (params[key]) {
                                                            temp.studentQueryParam[key] = params[key];
                                                        }
                                                    }
                                                }
                                                temp.pageNo = e.page;
                                                temp.pageSize = $scope.model.statistic.student.page.pageSize;
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
                                            // 将会把这个返回的数组绑定到数据源当中
                                            return response;
                                        },
                                        total: function (response) {
                                            return response.totalSize;
                                        },
                                        data: function (response) {
                                            if (response.status) {
                                                return response.info;
                                            } else {
                                                $scope.globle.alert('错误', response.info);
                                                response.info = [];
                                                return response.info;
                                            }

                                        } // 指定数据源
                                    },
                                    serverPaging: true, //远程获取数据
                                    serverSorting: true //远程排序字段
                                },
                                selectable: true,
                                sortable: {
                                    mode: 'single',
                                    allowUnsort: false
                                },
                                dataBinding: function (e) {
                                    $scope.model.gridReturnData = e.items;
                                    kendoGrid.nullDataDealLeaf(e);
                                },
                                pageable: {
                                    refresh: true,
                                    pageSizes: true,
                                    pageSize: 10,
                                    buttonCount: 10
                                },
                                // 选中切换的时候改变选中行的时候触发的事件
                                columns: [
                                    {sortable: false, field: 'studentName', title: '姓名', width: 150},
                                    {sortable: false, field: 'unitName', title: '单位'},
                                    {sortable: false, field: 'finishRate', title: '完成课程占比（%）', width: 200},
                                    {sortable: false, field: 'finishCount', title: '完成/未学/在学', width: 150},
                                    {sortable: false, field: 'lastStudyTime', title: '最近学习时间', width: 150},
                                    /*{sortable: false, field: "sort", title: "排名", width: 100},*/
                                    {
                                        title: '操作', width: 100
                                    }
                                ]
                            }
                        },
                        courseGrid: { //学员课程列表
                            options: {
                                // 每个行的模板定义,
                                rowTemplate: kendo.template(gridRowTemplate.statistic.studentDimension.courseGrid),
                                scrollable: false,
                                noRecords: {
                                    template: '暂无数据'
                                },
                                dataSource: {
                                    transport: {
                                        read: {
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            url: '/web/admin/trainClass/getManageStudentCoursePage',
                                            data: function (e) {
                                                var temp = {studentCourseQueryParam: {sort: e.sort}},
                                                    params = $scope.model.statistic.student.courseQueryParam;
                                                for (var key in params) {
                                                    if (params.hasOwnProperty(key)) {
                                                        if (params[key]) {
                                                            temp.studentCourseQueryParam[key] = params[key];
                                                        }
                                                    }
                                                }
                                                temp.pageNo = e.page;
                                                temp.pageSize = $scope.model.statistic.student.coursePage.pageSize;
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
                                            // 将会把这个返回的数组绑定到数据源当中
                                            return response;
                                        },
                                        total: function (response) {
                                            return response.totalSize;
                                        },
                                        data: function (response) {
                                            if (response.status) {
                                                return response.info;
                                            } else {
                                                $scope.globle.alert('错误', response.info);
                                                response.info = [];
                                                return response.info;
                                            }
                                        } // 指定数据源
                                    },
                                    serverPaging: true, //远程获取数据
                                    serverSorting: true //远程排序字段
                                },
                                selectable: true,
                                sortable: {
                                    mode: 'single',
                                    allowUnsort: false
                                },
                                dataBinding: function (e) {
                                    $scope.model.gridReturnData = e.items;
                                    kendoGrid.nullDataDealLeaf(e);
                                },
                                pageable: {
                                    refresh: true,
                                    pageSizes: true,
                                    pageSize: 10,
                                    buttonCount: 10
                                },
                                // 选中切换的时候改变选中行的时候触发的事件
                                columns: [
                                    {sortable: false, field: 'courseName', title: '课程名称'},
                                    {sortable: false, field: 'schedule', title: '进度（%）', width: 100}
                                ]
                            }
                        },
                        detailWindow: {
                            modal: true,
                            content: '@systemUrl@/views/trainClassManage/manage/studentCoursePage.html',
                            visible: false,
                            title: false,
                            open: function () {
                                this.center();
                            }
                        }
                    },
                    courseDimension: {//课程维度
                        courseCategoryTree: {//课程分类树
                            options: {
                                checkboxes: false,
                                // 当要去远程获取数据的时候数据源这么配置
                                dataSource: dataSource.statistic.courseDimension.courseCategoryTree
                            }
                        },
                        courseGrid: { //学员列表
                            options: {
                                // 每个行的模板定义,
                                rowTemplate: kendo.template(gridRowTemplate.statistic.courseDimension.courseGrid),
                                scrollable: false,
                                noRecords: {
                                    template: '暂无数据'
                                },
                                dataSource: {
                                    transport: {
                                        read: {
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            url: '/web/admin/trainClass/getManageCoursePage',
                                            data: function (e) {
                                                var temp = {courseQueryParam: {sort: e.sort}},
                                                    params = $scope.model.statistic.course.queryParam;
                                                for (var key in params) {
                                                    if (params.hasOwnProperty(key)) {
                                                        if (params[key]) {
                                                            temp.courseQueryParam[key] = params[key];
                                                        }
                                                    }
                                                }
                                                temp.pageNo = e.page;
                                                temp.pageSize = $scope.model.statistic.course.page.pageSize;
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
                                            // 将会把这个返回的数组绑定到数据源当中
                                            return response;
                                        },
                                        total: function (response) {
                                            return response.totalSize;
                                        },
                                        data: function (response) {
                                            if (response.status) {
                                                return response.info;
                                            } else {
                                                $scope.globle.alert('错误', response.info);
                                                response.info = [];
                                                return response.info;
                                            }

                                        } // 指定数据源
                                    },
                                    serverPaging: true, //远程获取数据
                                    serverSorting: true //远程排序字段
                                },
                                selectable: true,
                                sortable: {
                                    mode: 'single',
                                    allowUnsort: false
                                },
                                dataBinding: function (e) {
                                    $scope.model.gridReturnData = e.items;
                                    kendoGrid.nullDataDealLeaf(e);
                                },
                                pageable: {
                                    refresh: true,
                                    pageSizes: true,
                                    pageSize: 10,
                                    buttonCount: 10
                                },
                                // 选中切换的时候改变选中行的时候触发的事件
                                columns: [
                                    {sortable: false, field: 'courseName', title: '课程名称'},
                                    {sortable: false, field: 'courseCategoryName', title: '课程分类名称'},
                                    {sortable: false, field: 'finishRate', title: '完成率（%）', width: 200},
                                    {sortable: false, field: 'finishCount', title: '完成/在学', width: 150},
                                    {
                                        title: '操作', width: 100
                                    }
                                ]
                            }
                        },
                        studentGrid: { //课程学员列表
                            options: {
                                // 每个行的模板定义,
                                rowTemplate: kendo.template(gridRowTemplate.statistic.courseDimension.studentGrid),
                                scrollable: false,
                                noRecords: {
                                    template: '暂无数据'
                                },
                                dataSource: {
                                    transport: {
                                        read: {
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            url: '/web/admin/trainClass/getManageCourseStudentPage',
                                            data: function (e) {
                                                var temp = {courseStudentQueryParam: {sort: e.sort}},
                                                    params = $scope.model.statistic.course.studentQueryParam;
                                                for (var key in params) {
                                                    if (params.hasOwnProperty(key)) {
                                                        if (params[key]) {
                                                            temp.courseStudentQueryParam[key] = params[key];
                                                        }
                                                    }
                                                }
                                                temp.pageNo = e.page;
                                                temp.pageSize = $scope.model.statistic.course.studentPage.pageSize;
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
                                            // 将会把这个返回的数组绑定到数据源当中
                                            return response;
                                        },
                                        total: function (response) {
                                            return response.totalSize;
                                        },
                                        data: function (response) {
                                            if (response.status) {
                                                return response.info;
                                            } else {
                                                $scope.globle.alert('错误', response.info);
                                                response.info = [];
                                                return response.info;
                                            }
                                        } // 指定数据源
                                    },
                                    serverPaging: true, //远程获取数据
                                    serverSorting: true //远程排序字段
                                },
                                selectable: true,
                                sortable: {
                                    mode: 'single',
                                    allowUnsort: false
                                },
                                dataBinding: function (e) {
                                    $scope.model.gridReturnData = e.items;
                                    kendoGrid.nullDataDealLeaf(e);
                                },
                                pageable: {
                                    refresh: true,
                                    pageSizes: true,
                                    pageSize: 10,
                                    buttonCount: 10
                                },
                                // 选中切换的时候改变选中行的时候触发的事件
                                columns: [
                                    {sortable: false, field: 'studentName', title: '学员名称'},
                                    {sortable: false, field: 'schedule', title: '进度（%）', width: 100}
                                ]
                            }
                        },
                        detailWindow: {
                            modal: true,
                            content: '@systemUrl@/views/trainClassManage/manage/courseStudentPage.html',
                            visible: false,
                            title: false,
                            open: function () {
                                this.center();
                            }
                        }
                    },
                    checkDimension: {//考核维度
                        unitTree: {//单位树
                            options: {
                                checkboxes: false,
                                dataSource: dataSource.statistic.checkDimension.unitTree
                            }
                        }
                        ,
                        grid: { //考核列表
                            options: {
                                // 每个行的模板定义,
                                rowTemplate: kendo.template(gridRowTemplate.statistic.checkDimension.grid),
                                scrollable: false,
                                noRecords: {
                                    template: '暂无数据'
                                },
                                dataSource: {
                                    transport: {
                                        read: {
                                            contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                            url: '/web/admin/trainClass/getManageCheckPage',
                                            data: function (e) {
                                                var temp = {checkQueryParam: {sort: e.sort}},
                                                    params = $scope.model.statistic.check.queryParam;
                                                for (var key in params) {
                                                    if (params.hasOwnProperty(key)) {
                                                        if (params[key]) {
                                                            temp.checkQueryParam[key] = params[key];
                                                        }
                                                    }
                                                }
                                                temp.pageNo = e.page;
                                                temp.pageSize = $scope.model.statistic.check.page.pageSize;
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
                                            // 将会把这个返回的数组绑定到数据源当中
                                            return response;
                                        },
                                        total: function (response) {
                                            return response.totalSize;
                                        },
                                        data: function (response) {
                                            if (response.status) {
                                                return response.info;
                                            } else {
                                                $scope.globle.alert('错误', response.info);
                                                response.info = [];
                                                return response.info;
                                            }

                                        } // 指定数据源
                                    },
                                    serverPaging: true, //远程获取数据
                                    serverSorting: true //远程排序字段
                                },
                                selectable: true,
                                sortable: {
                                    mode: 'single',
                                    allowUnsort: false
                                },
                                dataBinding: function (e) {
                                    $scope.model.gridReturnData = e.items;
                                    kendoGrid.nullDataDealLeaf(e);
                                },
                                pageable: {
                                    refresh: true,
                                    pageSizes: true,
                                    pageSize: 10,
                                    buttonCount: 10
                                },
                                // 选中切换的时候改变选中行的时候触发的事件
                                columns: [
                                    {sortable: false, field: 'studentName', title: '姓名', width: 200},
                                    {sortable: false, field: 'unitName', title: '所在单位'},
                                    {sortable: false, field: 'courseFinishRate', title: '课程完成占比（%）', width: 200},
                                    {sortable: false, field: 'courseFinishCount', title: '完成课程数', width: 200},
                                    {sortable: false, field: 'examRoundFinishCount', title: '考试完成占比（%）', width: 200},
                                    {sortable: false, field: 'isPass', title: '是否通过考核', width: 200}
                                ]
                            }
                        }
                    }
                },
                /**
                 * 阅卷功能
                 */
                markExam: {
                    datePicker: {
                        begin: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd',
                                change: $scope.events.markExam.startChange

                            }
                        }
                        ,
                        end: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd',
                                change: $scope.events.markExam.endChange
                            }
                        }
                    }

                }

            }
            ;
        }]
        ;
})
;
