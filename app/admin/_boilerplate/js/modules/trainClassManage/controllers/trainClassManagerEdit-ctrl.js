define(function () {
    'use strict';
    return ['$scope', 'trainClassManageService', '$state', 'kendo.grid', '$interval', '$stateParams', '$timeout',
        function ($scope, trainClassManageService, $state, kendoGrid, $interval, $stateParams, $timeout) {
            $scope.examValidate = undefined;
            $scope.validateParams = {
                id: ''
            };
            var utils;
            var $node = {
                lessonTypeTree: $('#lesson_type')
            };
            /**
             * node: 需要操作组件的节点对象, 通常为组件的对象, 如日期组件对象、表格组件对象
             *
             * @type {{workBeginTime: null, workEndTime: null}}
             */
            $scope.node = {
                //== index node
                examGrid: null,
                lessonGrid: null,
                workBeginTime: null,
                workEndTime: null,
                publishTime: null
            };
            $scope.model = {};

            $scope.events = {

                /**
                 * 设置完成数量的值
                 * @param data
                 */
                setCompleteCourseQuantityValue: function (data) {
                    if (data) {
                        $scope.model.trainClassAssess.completeCourseQuantity = null;
                        if ($scope.model.passExam) {
                            var temp = $scope.model.trainClassAssess.passExamQuantity;
                            if (temp == null || temp == '') {
                                $scope.model.examQuantityValidateDate = false;
                            } else {
                                $scope.model.examQuantityValidateDate = true;
                            }

                        } else {
                            $scope.model.examQuantityValidateDate = false;
                        }

                    } else {
                        $scope.model.examQuantityValidateDate = false;
                    }
                },
                /**
                 * 设置考试通过的值
                 * @param data
                 */
                setpassExamQuantityValue: function (data) {
                    if (data) {
                        $scope.model.trainClassAssess.passExamQuantity = null;
                        if ($scope.model.completeCourse) {
                            var temp = $scope.model.trainClassAssess.completeCourseQuantity;
                            if (temp == null || temp == '') {
                                $scope.model.examQuantityValidateDate = false;
                            } else {
                                $scope.model.examQuantityValidateDate = true;
                            }
                        } else {
                            $scope.model.examQuantityValidateDate = false;
                        }
                    } else {
                        $scope.model.examQuantityValidateDate = false;
                    }
                },
                /**
                 * 验证课程完成数
                 * @param data
                 */
                checkCompleteCourseQuantity: function (data) {
                    if (data == null || data == '') {
                        $scope.model.examQuantityValidateDate = false;
                    } else {
                        var lessonNum = $scope.model.selectedLessonIdList.length;
                        if (lessonNum < data) {
                            $scope.model.examQuantityValidateDate = false;
                            $scope.globle.alert('错误', '通过課程數量必须小于等于课程总数' + lessonNum + '门!');
                        } else {
                            if ($scope.model.passExam) {
                                var temp = $scope.model.trainClassAssess.passExamQuantity;
                                if (temp == null || temp == '') {
                                    $scope.model.examQuantityValidateDate = false;
                                } else {
                                    $scope.model.examQuantityValidateDate = true;
                                }

                            } else {
                                $scope.model.examQuantityValidateDate = true;
                            }
                        }

                    }
                },
                /**
                 * .验证考试通过
                 * @param data
                 */
                checkPassExamQuantity: function (data) {
                    if (data == null || data == '') {
                        $scope.model.examQuantityValidateDate = false;
                    } else {
                        if ($scope.model.completeCourse) {
                            var temp = $scope.model.trainClassAssess.completeCourseQuantity;
                            if (temp == null || temp == '') {
                                $scope.model.examQuantityValidateDate = false;
                            } else {
                                $scope.model.examQuantityValidateDate = true;
                            }

                        } else {
                            $scope.model.examQuantityValidateDate = true;
                        }

                    }
                },
                /**
                 * 验证培训班人数
                 * @param data
                 */
                checkNumber: function (data) {
                    if (data == null || data == '') {
                        $scope.model.validateNumber = false;
                    } else {
                        $scope.model.validateNumber = true;
                    }
                },
                /**
                 *
                 * @param e
                 */
                cancel: function (e) {
                    e.preventDefault();
                    $scope.events.goTrainClassManage(e);
                },
                /**
                 * 发布班级考核为草稿
                 * @param e
                 */
                saveDraft: function (e) {
                    e.preventDefault();
                    if ($scope.trainClassAssessValidate.$valid && $scope.model.savetrainClassAssess && $scope.model.examQuantityValidateDate) {
                        $scope.model.trainClassAssess.trnId = $scope.model.trainClass.id;
                        $scope.model.savetrainClassAssess = false;
                        trainClassManageService.releaseTrainClassAssess($scope.model.trainClassAssess).then(function (data) {
                            if (data.status) {
                                $scope.events.goTrainClassManage(e);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.savetrainClassAssess = true;
                        });

                    }
                },
                /**
                 *取消发布编辑
                 * @param e
                 */
                cancelReleaseExam: function (e) {
                    e.preventDefault();
                    $scope.node.windows.addExam2.close();

                },
                /**
                 * 返回试卷列表
                 * @param e
                 */
                returnExamList: function (e) {
                    e.preventDefault();
                    $scope.node.examGrid.pager.page(1);
                    $scope.node.windows.addExam1.open();
                    $scope.node.windows.addExam2.close();
                },
                /**
                 * 添加考试
                 * @param e
                 */
                addExam: function (e) {
                    e.preventDefault();
                    $scope.model.addExam = true;
                    $scope.node.examGrid.pager.page(1);
                    $scope.node.windows.addExam1.open();
                },
                /**
                 * 获取课程分类ID
                 * @param dataItem
                 */
                getExamTypeInfo: function (dataItem, e) {
                    e.stopPropagation();
                    trainClassManageService.hashExamPaperType(dataItem.id).then(function (data) {
                        if (!data.info) {
                            $scope.model.examTypeName = dataItem.name;
                            $scope.model.paperSearch.examTypeId = dataItem.id;
                            $scope.examTypeShow = false;
                        }
                    });
                },
                /**
                 * 显示试卷分类
                 */
                openExamTree: function (e) {
                    e.stopPropagation();
                },
                /**
                 * 发布培训班考核
                 * @param e
                 */
                releaseTrainClassAssess: function (e) {
                    e.preventDefault();
                    if ($scope.trainClassAssessValidate.$valid && $scope.model.savetrainClassAssess && $scope.model.examQuantityValidateDate) {
                        $scope.model.trainClassAssess.trnId = $scope.model.trainClass.id;
                        $scope.model.savetrainClassAssess = false;
                        trainClassManageService.releaseTrainClassAssess($scope.model.trainClassAssess).then(function (data) {
                            if (data.status) {
                                $scope.model.step += 20;
                                $scope.time = 10;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.savetrainClassAssess = true;
                        });

                    }
                },
                /***
                 * 跳过添加考试到下部
                 * @param e
                 */
                goAhead: function (e) {
                    e.preventDefault();
                    $scope.model.step += 20;

                },
                /**
                 * 显示课程分类
                 */
                openTree: function (e) {
                    e.stopPropagation();
                },
                /**
                 * 选择
                 * @param e
                 */
                selectRegistrationNumber: function () {
                    if ($scope.model.notNumber) {
                        $scope.model.notNumber = false;
                        $scope.model.validateNumber = false;
                    } else {
                        $scope.model.validateNumber = true;
                        $scope.model.trainClass.registrationNumber = null;
                        $scope.model.notNumber = true;
                    }
                },
                /**
                 * 跳过添加考试
                 * @param e
                 */
                jumpOver: function (e) {
                    e.preventDefault();
                    $scope.model.exams = [];
                    $scope.model.step += 20;
                },
                /**
                 * 返回上一步
                 * @param e
                 */
                comeBack: function (e) {
                    e.preventDefault();
                    $scope.model.step -= 20;
                },
                /**
                 * 保存培训班基本信息
                 * @param e
                 */
                saveTrainClassInfo: function (e) {
                    e.preventDefault();
                    if ($scope.trainClassValidate.$valid && $scope.model.saveInfo && $scope.model.validateDate) {
                        setTime();
                        var check = checkData();
                        if (!check) {
                            return false;
                        }
                        $scope.model.saveInfo = false;
                        trainClassManageService.createTrainClassInfo($scope.model.trainClass).then(function (data) {
                            if (data.status) {
                                $scope.validateParams.id = data.info;
                                $scope.model.trainClass.id = data.info;
                                $scope.model.step = 20;
                                $scope.node.lessonGrid.pager.page(1);
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.saveInfo = true;
                        });
                    }
                },
                /**
                 * 返回资源管理页面
                 * @param e
                 */
                goTrainClassManage: function (e) {
                    window.clearInterval($scope.timerIntervalId);
                    e.preventDefault();
                    $state.go('states.trainClassManage').then(function () {
                        $state.reload();
                    });

                },
                /**
                 * 保存培训班信息为草稿
                 * @param e
                 */
                saveTrainClassInfoDraft: function (e) {
                    e.preventDefault();
                    if ($scope.trainClassValidate.$valid && $scope.model.saveInfo && $scope.model.validateDate) {
                        setTime();
                        $scope.model.saveInfo = false;
                        trainClassManageService.createTrainClassInfo($scope.model.trainClass).then(function (data) {
                            if (data.status) {
                                $scope.events.goTrainClassManage(e);

                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.saveInfo = true;
                        });
                    }
                },

                /**
                 *设置报名的名称
                 */
                setValue: function (value) {
                    $timeout(function () {
                        if (value == 1) {
                            $scope.model.validateDate = true;
                        } else {
                            $scope.model.validateDate = false;
                            validateDate();
                        }
                        $scope.model.trainClass.registerMode = value;
                    });

                },
                /**
                 * 保存培训班的课程
                 * @param e
                 */
                createTrainClassLesson: function (e) {
                    e.preventDefault();
                    var trainClassLesson = {
                        courseIds: $scope.model.selectedLessonIdList,
                        id: $scope.model.trainClass.id,
                        name: $scope.model.trainClass.name,
                        packageId: $scope.model.trainClass.packageId
                    };
                    if ($scope.model.selectedLessonIdList.length > 0 && $scope.model.saveCourse) {
                        $scope.model.saveCourse = false;
                        if ($scope.model.trainClass.packageId) {
                            trainClassManageService.updateTrainClassCourse(trainClassLesson).then(function (data) {
                                if (data.status) {
                                    $scope.model.trainClass.packageId = data.info;
                                    $scope.model.step += 20;
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.saveCourse = true;
                            });
                        } else {
                            trainClassManageService.createTrainClassCourse(trainClassLesson).then(function (data) {
                                if (data.status) {
                                    $scope.model.trainClass.packageId = data.info;
                                    $scope.model.step += 20;
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.saveCourse = true;
                            });

                        }

                    }

                },
                /**
                 * 保存培训班的课程为草稿
                 * @param e
                 */
                createTrainClassLessonDraft: function (e) {
                    e.preventDefault();
                    var trainClassLesson = {
                        courseIds: $scope.model.selectedLessonIdList,
                        id: $scope.model.trainClass.id,
                        name: $scope.model.trainClass.name,
                        packageId: $scope.model.trainClass.packageId
                    };
                    if ($scope.model.selectedLessonIdList.length > 0 && $scope.model.saveCourse) {
                        $scope.model.saveCourse = false;
                        if ($scope.model.trainClass.packageId) {
                            trainClassManageService.updateTrainClassCourse(trainClassLesson).then(function (data) {
                                if (data.status) {
                                    $scope.model.trainClass.packageId = data.info;
                                    $scope.events.goTrainClassManage(e);
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.saveCourse = true;
                            });
                        } else {
                            trainClassManageService.createTrainClassCourse(trainClassLesson).then(function (data) {
                                if (data.status) {
                                    $scope.events.goTrainClassManage(e);
                                } else {
                                    $scope.globle.showTip(data.info, 'error');
                                }
                                $scope.model.saveCourse = true;
                            });
                        }

                    }

                },
                /**
                 * 表格中选择课程
                 * @param e
                 */
                choose: function (e, dataItem) {
                    e.preventDefault();

                    $scope.model.selectedLessonIdList.push(dataItem.id);
                    $scope.model.selectedLessonList.push(utils.wrapGridRowData(dataItem));

                    $scope.model.creditCount += dataItem.credit;
                    dataItem.isChoice = true;
                    // $scope.node.lessonGrid.refresh();
                },
                /**
                 * 更新考试
                 * @param e
                 * @param index
                 * @param exam
                 */
                updateExam: function (e, index, exam) {
                    e.preventDefault();
                    $scope.model.addExam = false;
                    $scope.model.currentIndex = index;
                    $scope.model.releaseExam = {};
                    $scope.model.releaseExam.id = exam.id;
                    $scope.model.releaseExam.examPaperId = exam.examPaperId;
                    $scope.model.releaseExam.name = exam.name;
                    $scope.model.releaseExam.completeQuantity = exam.completeQuantity;
                    $scope.model.releaseExam.examCount = exam.examCount;
                    $scope.model.releaseExam.totalScore = exam.totalScore;
                    $scope.model.releaseExam.paperName = exam.paperName;
                    $scope.model.releaseExam.examTimeLength = exam.examTimeLength;
                    $scope.model.releaseExam.passScore = exam.passScore;
                    $scope.model.releaseExam.continueExam = exam.continueExam;
                    $scope.model.releaseExam.publishType = exam.publishType;//发布类型 0-不发布 1-立即发布 2-限时发布
                    $scope.model.releaseExam.publishTime = exam.publishTime;//发布类型 0-不发布 1-立即发布 2-限时发布
                    $scope.node.windows.addExam2.open();
                },
                /**
                 * 删除考试
                 * @param e
                 * @param index
                 * @param exam
                 */
                operatingExam: function (e, index, exam) {
                    e.preventDefault();
                    var type = exam.released ? '停用' : '启用';
                    $scope.globle.confirm('提示', '是否' + type + '考试', function (dialog) {
                        return trainClassManageService.operatingExam(exam.id, exam.released).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                exam.released = !exam.released;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }

                        });
                    });
                },
                /**
                 * 发布培训班
                 * @param e
                 */
                publishTrain: function (e) {
                    e.preventDefault();
                    var temp = 0;
                    if ($scope.model.trainClassAssess.passExamQuantity) {
                        temp = $scope.model.trainClassAssess.passExamQuantity;
                    }
                    if ($scope.model.publishTrain && temp <= $scope.model.exams.length) {
                        $scope.model.publishTrain = false;
                        trainClassManageService.publishTrain($scope.model.trainClass.id).then(function (data) {
                            if (data.status) {
                                $scope.model.step += 20;
                                //$scope.time = 10;
                                //$scope.timerIntervalId = $interval(timer, 1000).$$intervalId;
                            } else {
                                $scope.globle.showTip(data.info, 'error');
                            }
                            $scope.model.publishTrain = true;
                        });
                    }

                },
                /**
                 * 在表格中<取消选择>课程
                 * @param e
                 * @param dataItem
                 */
                removeByGrid: function (e, dataItem) {
                    e.preventDefault();

                    // 获取当前课程ID在<selectedLessonList>的下标并移除
                    var index = -1, selectedLessonList = $scope.model.selectedLessonList, i, lesson;
                    for (i = 0; i < selectedLessonList.length; i++) {
                        lesson = selectedLessonList[i];
                        if (lesson.id === dataItem.id) {
                            index = i;
                            break;
                        } else {
                            index = -1;
                        }
                    }
                    index !== -1 && $scope.model.selectedLessonList.splice(index, 1);

                    // 从已选课程ID的数组中移除
                    var position = _.indexOf($scope.model.selectedLessonIdList, dataItem.id);
                    if (position !== -1) {
                        $scope.model.selectedLessonIdList.splice(position, 1);
                    }

                    // 减学分、设置未选
                    $scope.model.creditCount -= dataItem.credit;
                    dataItem.isChoice = false;
                },
                /**
                 * 从已选中移除课程
                 *
                 * @param e
                 * @param index 当前操作元素处于$scope.model.selectedLesson的索引下标
                 * @param lessonId 课程ID
                 */
                remove: function (e, index, lessonId) {
                    e.preventDefault();

                    // 减学分
                    $scope.model.creditCount -= $scope.model.selectedLessonList[index].credit;
                    //从已选课程的数组中移除
                    $scope.model.selectedLessonList.splice(index, 1);
                    // 从已选课程ID的数组中移除
                    var position = _.indexOf($scope.model.selectedLessonIdList, lessonId);
                    if (position !== -1) {
                        $scope.model.selectedLessonIdList.splice(position, 1);
                    }

                    // 从grid当前view中找到对应的行并设置<isChoice>为false;
                    var viewData = $scope.node.lessonGrid.dataSource.view(),
                        i, row;
                    for (i = 0; i < viewData.length; i++) {
                        row = viewData[i];
                        if (row.id === lessonId) {
                            row.isChoice = false;
                        }
                    }
                },
                /**
                 *
                 * @param e
                 */
                queryLessonByEnter: function (e) {
                    if (e.keyCode == 13) {
                        this.queryLessonGrid(e, $scope.model.lessonGridParams.resourceType);
                    }
                },
                /**
                 * 批量选择课程
                 *
                 * @param e
                 */
                batchSelect: function (e) {
                    e.preventDefault();

                    var viewData = $scope.node.lessonGrid.dataSource.view(),
                        selectedLessonIdList = $scope.model.selectedLessonIdList,
                        selectedLessonList = $scope.model.selectedLessonList,
                        i, dataItem,
                        index;

                    for (i = 0; i < viewData.length; i++) {
                        dataItem = viewData[i];
                        // 判断是否已在选中的列表中
                        index = _.indexOf(selectedLessonIdList, dataItem.id);
                        if (index === -1) {
                            // 追加学分
                            $scope.model.creditCount += dataItem.credit;
                            dataItem.isChoice = true;

                            selectedLessonIdList.push(dataItem.id);
                            selectedLessonList.push(utils.wrapGridRowData(dataItem));
                        }
                    }
                },
                reloadResource: function (e) {
                    e.preventDefault();
                },
                /**
                 * 点击<查询> 重载课程grid
                 * @param e
                 * @param resourceType
                 */
                queryLessonGrid: function (e, resourceType) {
                    e.preventDefault();
                    // 设置能力项ID、刷新表格
                    $scope.model.lessonGridParams.resourceType = resourceType;
                    $scope.node.lessonGrid.pager.page(1);
                },
                /**
                 * enter查询试卷
                 * @param e
                 */
                queryByEnter: function (e) {
                    if (e.keyCode == 13) {
                        this.serachPaper();
                    }
                },
                serachPaper: function (e) {
                    e.preventDefault();
                    $scope.node.examGrid.pager.page(1);
                },

                /**
                 * 清空已选的课程
                 * @param e
                 */
                empty: function (e) {
                    e.preventDefault();

                    // 重置
                    $scope.model.creditCount = 0;
                    $scope.model.selectedLessonIdList = [];
                    $scope.model.selectedLessonList = [];

                    // 从grid把当前view的所有数据全部设置<isChoice>为false;
                    var viewData = $scope.node.lessonGrid.dataSource.view(),
                        i;
                    for (i = 0; i < viewData.length; i++) {
                        viewData[i].isChoice = false;
                    }
                },
                /**
                 * 选择发布考试
                 * @param e
                 * @param id
                 */
                chooseReleaseExam: function (e, paper, passScore, paperName) {
                    e.preventDefault();
                    $scope.examValidate.$setPristine();
                    $scope.model.releaseExam = {};
                    $scope.model.releaseExam.examPaperId = paper.id;
                    $scope.model.releaseExam.name = null;
                    $scope.model.releaseExam.completeQuantity = null;
                    $scope.model.releaseExam.examCount = 1;//默认只能考一次
                    $scope.model.releaseExam.totalScore = paper.totalScore;
                    $scope.model.releaseExam.paperName = paperName;
                    $scope.model.releaseExam.examTimeLength = paper.timeLength;
                    $scope.model.releaseExam.passScore = passScore;
                    $scope.model.releaseExam.continueExam = '0';
                    $scope.model.releaseExam.publishType = '0';//发布类型 0-不发布 1-立即发布 2-限时发布
                    $scope.model.releaseExam.publishTime = '';//发布类型 0-不发布 1-立即发布 2-限时发布
                    $scope.model.examPaperIncludeSubjective = true;
                    trainClassManageService.checkExamPaperIncludeSubjectiveQuestion(paper.id).then(function (data) {
                        if (data.status) {
                            if (data.info) {
                                $scope.model.examPaperIncludeSubjective = true;
                            } else {
                                $scope.model.examPaperIncludeSubjective = false;
                            }
                        } else {
                            $scope.globle.alert('错误', '验证试卷是否包含主观题失败！');
                        }
                    });

                    $scope.node.windows.addExam2.open();
                    $scope.node.windows.addExam1.close();
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
                },
                /**
                 * 发布试卷
                 * @param e
                 */
                releaseExam: function (e) {
                    e.preventDefault();
                    if (!$scope.examValidate.$valid || !$scope.model.saveReleaseExam || $scope.model.releaseExam.completeQuantity > $scope.model.selectedLessonIdList.length) {
                        return false;
                    }
                    $scope.model.saveReleaseExam = false;
                    $scope.model.releaseExam.trnId = $scope.model.trainClass.id;
                    $scope.model.releaseExam.released = true;
                    $scope.model.releaseExam.examRange = 1;
                    trainClassManageService.releaseExam($scope.model.releaseExam).then(function (data) {
                        if (data.status) {
                            $scope.model.releaseExam.id = data.info;
                            $scope.model.exams.push($scope.model.releaseExam);
                            $scope.model.paperSearch.paperIds.push($scope.model.releaseExam.examPaperId);
                            $scope.node.examGrid.pager.page(1);
                            $scope.node.windows.addExam1.open();
                            $scope.node.windows.addExam2.close();

                        } else {
                            $scope.globle.showTip(data.info, 'error');
                        }

                        $scope.model.saveReleaseExam = true;
                    });
                },
                /**
                 * 继续发布
                 * @param e
                 */
                continuePost: function (e) {
                    init();
                    window.clearInterval($scope.timerIntervalId);
                    $scope.trainClassValidate.$setPristine();
                    $scope.trainClassAssessValidate.$setPristine();
                    e.preventDefault();
                },
                opentrainClassTypeTree: function () {
                    $scope.trainClassTypeShow = !$scope.trainClassTypeShow;
                },
                /**
                 * 获取课程分类ID
                 * @param dataItem
                 */
                getTypeInfo: function (dataItem) {
                    trainClassManageService.hashTrainClassType(dataItem.id).then(function (data) {
                        if (!data.info) {
                            $scope.model.trainClass.trainingTypeName = dataItem.name;
                            $scope.model.trainClass.tttId = dataItem.id;
                            $scope.trainClassTypeShow = false;
                        }
                    });
                },

                /**
                 * enter触发事件
                 * @param e
                 */
                search: function (e) {
                    if (e.keyCode === 13) {
                        $scope.events.searchCourseware(e);
                    }
                }

            };
//试卷分类树
            var dataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '-2',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
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

            //培训班分类树
            var trainTypedataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function (options) {
                        var id = options.data.id ? options.data.id : '0',
                            myModel = dataSource.get(options.data.id);
                        //console.log("parentid="+myModel.id+"parenttype="+myModel.type);
                        var type = myModel ? myModel.type : '';
                        $.ajax({
                            url: '/web/admin/trainingTypeAction/getTrainingTypeById?categoryId=' + id,
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

            utils = {
                startChange: function () {
                    var startDate = $scope.node.workBeginTime.value(),
                        endDate = $scope.node.workEndTime.value();
                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.workEndTime.min(startDate);
                    } else if (endDate) {
                        $scope.node.workBeginTime.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.workBeginTime.max(endDate);
                        $scope.node.workEndTime.min(endDate);
                    }
                    validateDate();
                },
                endChange: function () {
                    var endDate = $scope.node.workEndTime.value(),
                        startDate = $scope.node.workBeginTime.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.workBeginTime.max(endDate);
                    } else if (startDate) {
                        $scope.node.workEndTime.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.workBeginTime.max(endDate);
                        $scope.node.workEndTime.min(endDate);
                    }
                },
                registrationStartChange: function () {
                    var startDate = $scope.node.registrationStart.value(),
                        endDate = $scope.node.registrationEnd.value();

                    if (startDate) {
                        startDate = new Date(startDate);
                        startDate.setDate(startDate.getDate());
                        $scope.node.registrationEnd.min(startDate);
                    } else if (endDate) {
                        $scope.node.registrationStart.max(new Date(endDate));
                    } else {
                        endDate = new Date();
                        $scope.node.registrationStart.max(endDate);
                        $scope.node.registrationEnd.min(endDate);
                    }
                    validateDate();
                },
                registrationEndChange: function () {
                    var endDate = $scope.node.registrationEnd.value(),
                        startDate = $scope.node.registrationStart.value();

                    if (endDate) {
                        endDate = new Date(endDate);
                        endDate.setDate(endDate.getDate());
                        $scope.node.registrationStart.max(endDate);
                    } else if (startDate) {
                        $scope.node.registrationEnd.min(new Date(startDate));
                    } else {
                        endDate = new Date();
                        $scope.node.registrationStart.max(endDate);
                        $scope.node.registrationEnd.min(endDate);
                    }
                    validateDate();
                },
                loadLessonCounts: function () {
                    trainClassManageService.getTrainClassLessonCounts($scope.model.lessonGridParams).then(function (response) {
                        if (response.status) {
                            var packageLessonCount = response.info;

                            $scope.model.userLevel = packageLessonCount.userLevel;
                            $scope.model.unlimitCount = packageLessonCount.unrestrictedCount;
                            $scope.model.operatorSendCount = packageLessonCount.operatorSendCount;
                            $scope.model.blocCount = packageLessonCount.groupsCount;
                            $scope.model.selfCount = packageLessonCount.selfCount;
                            $scope.model.subordinateCount = packageLessonCount.subordinateCount;
                        } else {
                            $scope.globle.alert('错误', '课程数量加载失败!');
                        }
                    });
                },
                /**
                 * 初始化课程分类的树
                 */
                initialLessonTypeTree: function () {
                    var $lessonTypeTree = $node.lessonTypeTree;
                    // 已加载则不加载
                    if (!$lessonTypeTree.children('ul').length) {
                        $scope.ui.lessonType = {
                            dataSource: {
                                transport: {
                                    read: {
                                        url: '/web/admin/requiredPackage/listLessonType',
                                        // 节点展开时, 默认传递的参数名是id, 参考下面expand的实现
                                        dataType: 'json'
                                    }
                                },
                                schema: {
                                    data: function (response) {
                                        return response.info;
                                    },
                                    model: {
                                        hasChildren: true
                                    }
                                }
                            },
                            dataTextField: 'name',
                            select: function (e) {
                                // refresh lesson grid
                                $scope.model.lessonGridParams.catalogId = this.dataItem(e.node).id;
                                // 加载课程数量、课程分页
                                utils.loadLessonCounts();
                                $scope.node.lessonGrid.pager.page(1);
                            },
                            expand: function (e) {
                                $scope.model.lessonGridParams.catalogId = this.dataItem(e.node).id;
                            }
                        };
                    }
                },
                /**
                 * 加载课程的表格
                 */
                initialLessonGrid: function () {
                    $scope.ui.lessonGrid = {
                        selectable: true,
                        scrollable: false,
                        pageable: {
                            refresh: true,
                            buttonCount: 5
                        },
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(uiTemplate.lessonGridRow()),
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataBinding: function (e) {
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        dataSource: {
                            serverPaging: true,
                            page: 1,
                            pageSize: 6, // 每页显示的数据数目
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        angular.extend(data, $scope.model.lessonGridParams);
                                        data.pageNo = data.page;
                                    }
                                    return data;
                                },
                                read: {
                                    url: '/web/admin/requiredPackage/getLessonPage',
                                    dataType: 'json'
                                }
                            },
                            schema: {
                                parse: function (response) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var viewData = response.info,
                                            selectedLessonIdList = $scope.model.selectedLessonIdList,
                                            index = 1;
                                        _.forEach(viewData, function (row) {
                                            row.isChoice = false;
                                            row.index = index++;
                                            _.forEach(selectedLessonIdList, function (lessonId) {
                                                if (row.id === lessonId) {
                                                    row.isChoice = true;
                                                }
                                            });
                                        });
                                        // console.log(response.info);
                                        return response;
                                    } else {
                                        //$scope.globle.alert('错误', '课程加载失败!');
                                        return {
                                            status: response.status,
                                            totalSize: 0,
                                            totalPageSize: 0,
                                            info: []
                                        };
                                    }
                                },
                                total: function (response) {
                                    // 绑定数据所有总共多少条;
                                    var resourceType = $scope.model.lessonGridParams.resourceType;
                                    switch (resourceType) {
                                        case 0:
                                            $scope.model.unlimitCount = response.totalSize;
                                            break;
                                        case 1:
                                            $scope.model.blocCount = response.totalSize;
                                            break;
                                        case 2:
                                            $scope.model.selfCount = response.totalSize;
                                            break;
                                        case 3:
                                            $scope.model.subordinateCount = response.totalSize;
                                            break;
                                        case 4:
                                            $scope.model.operatorSendCount = response.totalSize;
                                            break;
                                        default:
                                            alert('error resourceType query param: ' + resourceType);
                                    }
                                    return response.totalSize;
                                },
                                data: function (response) {
                                    // 重置跟分页相关的缓存参数
                                    return response.info;
                                }
                            }
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            //{title: "No.", width: 60},
                            {field: 'name', title: '课程名称'},
                            {field: 'credit', title: '学分', width: 60},
                            {title: '操作', width: 120}
                        ]
                    };
                },
                /**
                 * 加载试卷的表格
                 */
                initialExamGrid: function () {
                    $scope.ui.examGrid = {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(uiTemplate.examGridRow()),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                parameterMap: function (data, type) {
                                    if (type === 'read') {
                                        angular.extend(data, $scope.model.paperSearch);
                                        data.pageNo = data.page;
                                        data.paperIds = $scope.model.paperSearch.paperIds.toString();
                                    }
                                    return data;
                                },
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/trainClass/findExamPaperPage',
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
                            $scope.model.gridReturnData = e.items;
                            kendoGrid.nullDataDealLeaf(e);
                        },
                        pageable: {
                            refresh: true,
                            pageSizes: true,
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
                            {title: '试卷名称'},
                            {title: '试卷类型', width: 80},
                            {title: '组卷方式', width: 80},
                            {title: '试卷类别', width: 120},
                            {title: '试卷总分', width: 80},
                            {title: '创建时间', width: 140},
                            {title: '创建者', width: 70},
                            {title: '操作', width: 90}
                        ]
                    };
                },
                wrapGridRowData: function (dataItem) {
                    return {
                        id: dataItem.id,
                        name: dataItem.name,
                        credit: dataItem.credit,
                        lessonTypeName: dataItem.lessonTypeName
                    };
                }
            };

//设置报名的时间
            function setTime () {
                $scope.model.trainClass.beginDate = $scope.node.workBeginTime.value().getTime();
                $scope.model.trainClass.endDate = $scope.node.workEndTime.value().getTime();
                $scope.model.trainClass.registrationStartDate = $scope.model.trainClass.registrationStartTime ? $scope.node.registrationStart.value().getTime() : $scope.node.workBeginTime.value().getTime();
                $scope.model.trainClass.registrationEndDate = $scope.model.trainClass.registrationEndTime ? $scope.node.registrationEnd.value().getTime() : $scope.node.workEndTime.value().getTime();
            }

            /**
             * 验证培训班时间时间
             * @returns {boolean}
             */
            function checkData () {
                var currentDate = new Date(),
                    currentTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();
                if ($scope.node.workBeginTime.value().getTime() < currentTime) {
                    $scope.globle.showTip('培训班开始时间不能小于当前时间', 'error');
                    return false;
                }
                ;
                if ($scope.node.workEndTime.value().getTime() < currentTime) {
                    $scope.globle.showTip('培训班结束时间不能小于当前时间', 'error');
                    return false;
                }
                ;
                if ($scope.model.trainClass.registrationType == 1) {
                    if ($scope.model.trainClass.registrationStartDate < currentTime) {
                        $scope.globle.showTip('报名开始时间不能小于当前时间', 'error');
                        return false;
                    }
                    ;
                    if ($scope.model.trainClass.registrationEndDate < currentTime) {
                        $scope.globle.showTip('报名结束时间不能小于当前时间', 'error');
                        return false;
                    }
                    ;
                }

                return true;
            }

            /**
             * 验证报名时间
             */
            function validateDate () {
                $timeout(function () {
                    if ($scope.model.trainClass.registrationType == 1 && $scope.model.trainClass.registerMode == 0) {
                        if ($scope.node.registrationStart) {
                            var startDate = $scope.node.workBeginTime.value(),
                                registrationStartDate = $scope.node.registrationStart.value();
                            if ($scope.node.registrationEnd) {
                                var registrationEnd = $scope.node.registrationEnd.value();
                                startDate = new Date(startDate).getTime();
                                registrationEnd = new Date(registrationEnd).getTime();
                                if (startDate >= registrationEnd) {
                                    $scope.model.validateDate = true;
                                } else {
                                    $scope.model.validateDate = false;
                                }
                            } else {
                                $scope.model.validateDate = false;
                            }
                        } else {
                            $scope.model.validateDate = false;
                        }
                    } else {

                        $scope.model.validateDate = true;
                    }
                });
            };
            var uiTemplate = {
                /**
                 * 课程表格的行配置
                 * @returns {string}
                 */
                lessonGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    //result.push ('<td>');
                    //result.push ('#: index #');
                    //result.push ('</td>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: credit #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button ng-click="events.audit($event,dataItem)" class="table-btn">试听</button>');
                    result.push('<button ng-if="!dataItem.isChoice" ng-click="events.choose($event, dataItem)" class="table-btn">选择</button>');
                    result.push('<button ng-if="dataItem.isChoice" ng-click="events.removeByGrid($event, dataItem)" class="table-btn">取消选择</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                },
                /**
                 * 考试表格的行配置
                 * @returns {string}
                 */
                examGridRow: function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: name #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: examRange ==1 ? \'考试\' : ( examRange == 2 ? \'练习\' : \'模拟\') #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: configType ==1 ?\'手动组卷\' : \'智能组卷\' #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: examTypeName #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: totalScore #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: createTime #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: createUserName #');
                    result.push('</td>');

                    result.push('<td class="op">');
                    result.push('<button  ng-click="events.chooseReleaseExam($event, dataItem,\'#:passScore#\',\'#:name#\')" class="table-btn">选择发布考试</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    return result.join('');
                }
            };
            $scope.ui = {
                tree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: dataSource
                    }
                },
                trainTypeTree: {
                    options: {
                        checkboxes: false,
                        // 当要去远程获取数据的时候数据源这么配置
                        dataSource: trainTypedataSource
                    }
                },
                datePicker: {
                    begin: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: utils.startChange
                        }
                    },
                    end: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: utils.endChange
                        }
                    },
                    publishDate: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            min: new Date()
                        }
                    },
                    registrationStart: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: utils.registrationStartChange
                        }
                    },
                    registrationEnd: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd',
                            change: utils.registrationEndChange
                        }
                    },
                    workDate: {
                        options: {
                            culture: 'zh-CN',
                            format: 'yyyy-MM-dd'
                        }
                    }
                },
                windows: {
                    addExam1: {//添加试卷第一个窗口
                        modal: true,
                        width: '70%',
                        content: '@systemUrl@/views/trainClassManage/addExam1.html',
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    },
                    addExam2: {//添加试卷第二个窗口
                        modal: true,
                        visible: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }
                }
            };
            $scope.$watch('model.uploadImage', function () {
                if ($scope.model.uploadImage) {
                    $scope.model.image = '/mfs' + $scope.model.uploadImage.newPath;
                    $scope.model.trainClass.picture = $scope.model.uploadImage.newPath;
                }
                else {
                    $scope.model.image = 'images/afei.jpg';
                }
            });

            function timer () {
                $scope.time -= 1;
                if ($scope.time == 0) {
                    window.clearInterval($scope.timerIntervalId);
                    $state.go('states.trainClassManage').then(function () {
                        $state.reload();
                    });
                }
            };

            function findTrainClassInfo () {
                trainClassManageService.findTrainClassInfo($stateParams.trnId).then(function (data) {
                    if (data.status) {
                        var currentData = data.info;
                        $scope.model.trainClass = currentData;
                        $scope.model.validateNumber = true;
                        $scope.model.validateDate = true;
                        $scope.model.saveInfo = true;
                        if (currentData.registrationNumber == 0) {
                            $scope.model.notNumber = true;
                            $scope.model.trainClass.registrationNumber = null;
                        } else {
                            $scope.model.notNumber = false;
                        }
                        if (currentData.picture) {
                            $scope.model.image = '/mfs/' + currentData.picture;
                        } else {
                            $scope.model.image = 'images/afei.jpg';
                        }
                        $scope.model.trainClass.beginTime = currentData.beginDate;
                        $scope.model.trainClass.endTime = currentData.endDate;
                        if (currentData.register) {
                            $scope.model.trainClass.registrationType = 1;
                            if (currentData.registerMode == 0) {
                                $scope.model.trainClass.registrationStartTime = currentData.registerBeginDate;
                                $scope.model.trainClass.registrationEndTime = currentData.registerEndDate;
                            }
                        } else {
                            $scope.model.trainClass.registrationType = 0;

                        }
                        loadTrainClassData();
                    }
                });

            }

            function loadTrainClassData () {
                trainClassManageService.findTrainClassLessons($scope.model.trainClass.id).then(function (response) {
                    if (response.status) {
                        $scope.model.trainClass.packageId = response.info.packageId;
                        if (response.info.packageId) {
                            $scope.model.creditCount = response.info.allCredit;
                            $scope.model.selectedLessonList = response.info.packageCourseDtos;
                            $scope.model.selectedLessonIdList = response.info.courseIds;
                        }
                    }
                });
                trainClassManageService.findTrainClassExam($scope.model.trainClass.id).then(function (response) {
                    if (response.status) {
                        $scope.model.exams = response.info;
                        angular.forEach(response.info, function (row) {
                            $scope.model.paperSearch.paperIds.push(row.examPaperId);
                        });
                    }
                });
                trainClassManageService.loadTrainPersonalAssess($scope.model.trainClass.id).then(function (data) {
                    if (data.status) {
                        $scope.model.trainClassAssess = data.info;
                        if (data.info.completeCourseQuantity) {
                            $scope.model.completeCourse = true;
                            $scope.model.examQuantityValidateDate = true;
                        }
                        if (data.info.passExamQuantity) {
                            $scope.model.passExam = true;
                            $scope.model.examQuantityValidateDate = true;
                        }
                        if (data.info.assessType) {

                        } else {
                            $scope.model.trainClassAssess.assessType = 1;
                        }
                    }
                });
            }

            function init () {
                $scope.validateParams = {
                    id: ''
                };
                $scope.model.releaseExam = {};
                $scope.model.notNumber = false;
                $scope.model.validateNumber = false;
                $scope.model.validateDate = false;
                $scope.model.savetrainClassAssess = true;
                $scope.model.saveInfo = true;
                $scope.model.saveCourse = true;
                $scope.model.saveReleaseExam = true;
                $scope.model.publishTrain = true;
                $scope.model.creditCount = 0;  // 所选课程的总学分
                $scope.model.trainClass = {
                    registrationType: 0,
                    registerMode: 1
                };
                $scope.model.savetrainClassAssess = true;
                $scope.model.completeCourseQuantityValidateDate = false;
                $scope.model.examQuantityValidateDate = false;
                $scope.model.selectedLessonIdList = []; // 已选课程的ID集合
                $scope.model.selectedLessonList = []; // 已选课程的集合
                $scope.model.exams = [];
                $scope.model.lessonGridParams = {         // 课程分页参数
                    catalogType: 1,
                    abilityId: null,
                    catalogId: null,
                    name: null,
                    resourceType: 0
                };
                $scope.model.trainClassAssess = {
                    assessType: 1

                };
                $scope.model.paperSearch = {
                    configType: '-1',
                    examRange: '-1',
                    paperIds: []
                };
                $scope.model.step = 0;
            }

// 加载课程分类、课程数量、课程分页
            init();
            findTrainClassInfo();
            utils.initialLessonTypeTree();
            utils.loadLessonCounts();
            utils.initialLessonGrid();
            utils.initialExamGrid();
            $scope.$on('events:clickMenuItem', function () {
                window.clearInterval($scope.timerIntervalId);
            });
        }
    ];
})
;
