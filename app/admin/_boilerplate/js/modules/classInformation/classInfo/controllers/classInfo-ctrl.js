define(function (classInfo) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'kendo.grid', 'classInfoServiceSon', '$timeout', 'HB_dialog', '$http', '$state', 'classInformationServices', 'HB_notification',
            function ($scope, kendoGrid, classInfoServiceSon, $timeout, HB_dialog, $http, $state, classInformationServices, HB_notification) {
                $scope.model.mark = false;
                //初始化为自主选课方案
                $scope.model.categoryType = 'COURSE_SUPERMARKET_GOODS';
                $scope.model.currenTab = 'course';
                $scope.model.firstSwitchTab = true;
                $scope.$watch('model.userId', function (newVal) {
                    if (newVal) {
                        $scope.model.mark = false;
                        classInformationServices.doview($state.current.name);
                        $scope.classInfoModel.buyerIds = newVal;
                        $scope.courseInfoModel.buyerIds = newVal;

                        if ($scope.kendoPlus.courseGridDelay === false && $scope.model.classTab === 0) {
                            $scope.kendoPlus.courseGridDelay = true;
                        } else {
                            if ($scope.model.classTab === 0) {
                                $scope.courseInfoModel.gridPending = true;
                                $scope.events.searchCourse();
                            }
                        }

                    }
                });
                $scope.classInfoModel = {
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    },
                    useIndex: 0,
                    changeClassOk: false,
                    showClassChangeList: false,
                    classInfoTab: 0,
                    classUserStatus: 2,//0有效，1冻结，2失效
                    gridPending: false,
                    paperScore: null,
                    popQuestionScore: null
                };
                $scope.courseInfoModel = {
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    },
                    gridPending: false,
                    courseInfoTab: 0,
                    popQuestionScore: null,
                    coursePracticeScore: null,
                    coursePracticeExam: null//历史课后测验及答卷相关信息
                };

                $scope.events = {
                    //自主选课学习方案和培训班学习方案之间的tab切换
                    switchTab: function (index) {
                        switch (index) {
                            case 1:
                                //自主选课学习方案类别
                                $scope.model.categoryType = 'COURSE_SUPERMARKET_GOODS';
                                $scope.model.currenTab = 'course';
                                break;
                            case 2:
                                //培训班学习方案类别
                                $scope.model.categoryType = 'TRAINING_CLASS_GOODS';
                                $scope.model.currenTab = 'trainingClass';
                                if ($scope.model.firstSwitchTab) {
                                    this.searchClassPage();
                                    $scope.model.firstSwitchTab = false;
                                }
                                break;
                        }
                    },
                    //已报班级查询
                    searchClassPage: function (e) {
                        $scope.classInfoModel.page.pageNo = 1;
                        $scope.node.learningClass.pager.page(1);
                    },
                    learningStatusList: function (e) {
                        $scope.refreshAble = true;
                        $scope.ui.courseTable.dataSource.read();
                        // classInfoServiceSon.getCoursesLearningInfo({
                        //     userId: $scope.classInfoModel.buyerIds,
                        //     classId: $scope.classInfoModel.classId,
                        //     pageNo: 1,
                        //     pageSize: 10
                        // }).then(function (data) {
                        //     $scope.refreshAble = false;
                        //     $scope.classInfoModel.learnStatusList = data.info;
                        //     angular.forEach($scope.classInfoModel.learnStatusList, function (item) {
                        //         // item.timeLength=timeToStr(item.timeLength);
                        //         item.ischecked = false;
                        //         item.firstRequest = true;
                        //         item.childrenList = [];
                        //     });
                        // });
                    },
                    toggleChildren: function (item) {
                        item.ischecked = !item.ischecked;
                        if (item.firstRequest === true) {
                            classInfoServiceSon.getChapterDetail({
                                userId: $scope.classInfoModel.buyerIds,
                                classId: $scope.classInfoModel.classId,
                                courseId: item.courseId

                            }).then(function (data) {
                                item.childrenList = data.info;
                                item.firstRequest = false;
                            });
                        }
                    },
                    //切换班级
                    changeClassList: function (e) {
                        $scope.classInfoModel.page.pageNo = 1;
                        $scope.node.changeClass.pager.page(1);
                    },
                    //切换班级
                    chooseUse: function (item) {
                        $scope.classInfoModel.gridPending = true;
                        $scope.classInfoModel.classId = item.classId;
                        $scope.classInfoModel.commoditySkuId = item.commoditySkuId;
                        $scope.classInfoModel.schemeId = item.schemeId;
                        $scope.classInfoModel.createType = item.createType;
                        $scope.classInfoModel.classUserState = item.userState;
                        $scope.events.getTrainClassInfo(item.commoditySkuId);
                        $scope.classInfoModel.showClassChangeList = false;
                        if ($scope.classInfoModel.classInfoTab === 1) {
                            $timeout(function () {
                                $scope.events.changeClassInfoTab(1, 1);
                            }, 500);
                        }
                        if ($scope.classInfoModel.classInfoTab === 2) {
                            $timeout($scope.events.getClassTestInfo, 500);
                        }
                    },
                    //获取培训班的基本信息
                    getTrainClassInfo: function (commoditySkuId) {
                        $scope.classInfoModel.gridPending = true;
                        $scope.classInfoModel.classInfoTab = 0;
                        classInfoServiceSon.getTrainClassInfo({
                            userId: $scope.classInfoModel.buyerIds,
                            schemeId: $scope.classInfoModel.classId,
                            commoditySkuId: commoditySkuId
                        }).then(function (data) {
                            $scope.classInfoModel.gridPending = false;
                            if (data.status) {
                                $scope.classInfoModel.classRealInfo = data.info;
                                $scope.classInfoModel.subOrderNo = data.info.subOrderNo;
                                $scope.classInfoModel.paperTotalScore = data.info.paperTotalScore;
                                $scope.classInfoModel.popQuestionTotalScore = data.info.popQuestionTotalScore;
                                if ($scope.classInfoModel.classRealInfo.examinationResult === -1) {
                                    $scope.classInfoModel.classRealInfo.examinationResult = '未考核';
                                } else if ($scope.classInfoModel.classRealInfo.examinationResult === 0) {
                                    $scope.classInfoModel.classRealInfo.examinationResult = '不合格';
                                } else {
                                    $scope.classInfoModel.classRealInfo.examinationResult = '合格';
                                }
                                if ($scope.classInfoModel.classRealInfo.activeType) {
                                    if ($scope.classInfoModel.classRealInfo.activeType === 1) {
                                        $scope.classInfoModel.classRealInfo.activeType = '线上支付';
                                    } else {
                                        $scope.classInfoModel.classRealInfo.activeType = '线下支付';
                                    }
                                }
                            }
                        });
                    },
                    //班级学习方案下的tab切换点击事件
                    changeClassInfoTab: function (e, type) {
                        $scope.model.mark = false;
                        $scope.classInfoModel.gridPending = true;
                        if (type === 2) {
                            $scope.events.learningStatusList();
                        }
                        if ($scope.classInfoModel.classInfoTab === 1) {
                            $scope.events.learningStatusList();
                        }
                        $scope.classInfoModel.changeClassOk = true;
                        classInfoServiceSon.getCoursesLearningInfoAll({
                            userId: $scope.classInfoModel.buyerIds,
                            classId: $scope.classInfoModel.classId
                        }).then(function (data) {
                            if (data.status) {
                                $scope.classInfoModel.gridPending = false;
                                $scope.classInfoModel.classTotalLearning = data.info;
                                $scope.classInfoModel.classInfoTab = 1;
                            }
                        });
                        $scope.model.mark = true;
                    },
                    //获取考试记录
                    getClassTestInfo: function () {
                        $scope.classInfoModel.gridPending = true;
                        classInfoServiceSon.getClassExams({
                            userId: $scope.classInfoModel.buyerIds,
                            classId: $scope.classInfoModel.classId
                        }).then(function (data) {
                            $scope.classInfoModel.gridPending = false;
                            if (data.status) {
                                $scope.classInfoModel.classTestInfomation = data.info;
                            }
                        });
                        $scope.classInfoModel.classInfoTab = 2;
                    },
                    //删除指定的考试记录
                    deleteClassTest: function (item, dataItem) {
                        HB_notification.confirm(
                            '是否确认删除该考试的答题记录，删除后学员侧对应的考试记录也将会清空',
                            function (dialog) {
                                return classInfoServiceSon.deleteExamTimesDetail({
                                    userId: $scope.classInfoModel.buyerIds,
                                    classId: $scope.classInfoModel.classId,
                                    examRoundId: item.examRoundId,
                                    examAnswerId: item.examAnswerId,
                                    examTimesDetailId: dataItem.examTimesDetailId
                                }).then(function (data) {
                                    dialog.doRightClose();
                                    if (data.status) {
                                        $scope.events.getClassTestInfo();
                                        HB_dialog.success('提示', '删除成功');
                                    } else {
                                        HB_dialog.error('提示', data.info);
                                    }
                                });
                            });
                    },
                    //班级一键合格确认
                    oneKeyOkForClass: function () {
                        $scope.events.destroyClassInfoModelScore();

                        var height = 500;
                        var hasExamAssess = $scope.classInfoModel.classRealInfo.hasExamAssess;
                        var hasPopQuestionAssess = $scope.classInfoModel.classRealInfo.hasPopQuestionAssess;
                        if (!hasExamAssess && !hasPopQuestionAssess) {
                            HB_notification.confirm(
                                '确定一键合格?',
                                function (dialog) {
                                    classInfoServiceSon.oneKeyPassForClass({
                                        userId: $scope.classInfoModel.buyerIds,
                                        schemeId: $scope.classInfoModel.classId
                                    }).then(function (data) {
                                        if (data.status) {
                                            HB_dialog.success('提示', '一键合格成功，请稍后刷新列表');
                                            // $state.reload ( $state.current.name );
                                        } else {
                                            HB_dialog.error('提示', data.info);
                                        }
                                    }, function (data) {
                                        HB_dialog.error('提示', data.data.info);
                                    });
                                });
                            return;
                        } else if (hasExamAssess && hasPopQuestionAssess) {
                            height = 500;
                        } else {
                            height = 300;
                        }

                        HB_dialog.contentAs($scope, {
                            title: '一键合格，设置分数',
                            height: height,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/classInformation/classInfo/dialogOneKeyOkForClass.html'
                        });
                    },
                    //触发班级一键合格
                    sureOneKeyOkForClass: function (index) {

                        var hasExamAssess = $scope.classInfoModel.classRealInfo.hasExamAssess;
                        var hasPopQuestionAssess = $scope.classInfoModel.classRealInfo.hasPopQuestionAssess;

                        var paperScore = $scope.classInfoModel.paperScore;
                        var popQuestionScore = $scope.classInfoModel.popQuestionScore;
                        if (hasExamAssess) {
                            var flag = $scope.events.isDouble(paperScore);
                            var paperRequireScore = $scope.classInfoModel.classRealInfo.paperRequireScore;
                            if (!flag) {
                                HB_notification.alert('请输入小数位不超过两位的纯数字');
                                return;
                            }
                            if (!paperScore) {
                                HB_notification.alert('考试合格分不能为空');
                                return;
                            } else if (paperScore < paperRequireScore || paperScore > $scope.classInfoModel.paperTotalScore) {
                                HB_notification.alert('考试合格分不能小于' + paperRequireScore + '分且不能大于试卷的总分' + $scope.classInfoModel.paperTotalScore + '分');
                                return;
                            }
                        }
                        if (hasPopQuestionAssess) {
                            var flag = $scope.events.isDouble(popQuestionScore);
                            var popQuestionRequireScore = $scope.classInfoModel.classRealInfo.popQuestionRequireScore;
                            if (!flag) {
                                HB_notification.alert('请输入小数位不超过两位的纯数字');
                                return;
                            }
                            if (!popQuestionScore) {
                                HB_notification.alert('弹窗题合格分不能为空');
                                return;
                            } else if (popQuestionScore < popQuestionRequireScore || popQuestionScore > $scope.classInfoModel.popQuestionTotalScore) {
                                HB_notification.alert('弹窗题合格分不能小于' + popQuestionRequireScore + '分且不能大于弹窗题的总分' + $scope.classInfoModel.popQuestionTotalScore + '分');
                                return;
                            }
                        }
                        HB_dialog.closeDialogByIndex($scope, index);
                        classInfoServiceSon.oneKeyPassForClass({
                            userId: $scope.classInfoModel.buyerIds,
                            schemeId: $scope.classInfoModel.classId,
                            paperScore: paperScore,
                            popQuestionScore: popQuestionScore
                        }).then(function (data) {
                            if (data.status) {
                                HB_dialog.success('提示', '一键合格成功，请稍后刷新列表');
                                // $state.reload ( $state.current.name );
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        }, function (data) {
                            HB_dialog.error('提示', data.data.info);
                        });
                    },
                    //课程一键学习确认
                    feedLearning: function (item) {
                        $scope.classInfoModel.feedlessonId = item.courseId;
                        HB_notification.confirm(
                            '确定一键学习?',
                            function (dialog) {
                                return $scope.events.sureFeedLearning(dialog);
                            });
                    },
                    //触发课程一键学习
                    sureFeedLearning: function (dialog) {
                        return classInfoServiceSon.oneKeyCourseLearned({
                            userId: $scope.classInfoModel.buyerIds,
                            classId: $scope.classInfoModel.classId,
                            courseId: $scope.classInfoModel.feedlessonId
                        }).then(function (data) {
                            dialog && dialog.doRightClose();
                            if (data.status) {
                                HB_dialog.success('提示', '一键学习成功，请稍后刷新列表');
                                $scope.events.learningStatusList();
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        }, function () {
                        });
                    },
                    //课件一键学习
                    oneKeyCourseWareLearned: function (graItem, item, index) {
                        $scope.classInfoModel.parentIndex = index;
                        $scope.classInfoModel.cwdId = graItem.courseWareId;
                        $scope.classInfoModel.feedlessonId = item.courseId;
                        HB_notification.confirm(
                            '确定一键学习?',
                            function (dialog) {
                                return $scope.events.sureOneKeyCourseWareLearned(dialog);
                            });
                    },
                    //触发课件一键学习
                    sureOneKeyCourseWareLearned: function (dialog) {
                        return classInfoServiceSon.oneKeyCourseWareLearned({
                            userId: $scope.classInfoModel.buyerIds,
                            classId: $scope.classInfoModel.classId,
                            courseId: $scope.classInfoModel.feedlessonId,
                            coursewareId: $scope.classInfoModel.cwdId
                        }).then(function (data) {
                            dialog && dialog.doRightClose();
                            if (data.status) {
                                HB_dialog.success('提示', '一键学习成功,请刷新列表');
                                $scope.events.reFreshChildList($scope.classInfoModel.parentIndex);
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        }, function () {
                        });
                    },
                    reFreshChildList: function (index) {
                        classInfoServiceSon.getChapterDetail({
                            userId: $scope.classInfoModel.buyerIds,
                            classId: $scope.classInfoModel.classId,
                            courseId: $scope.classInfoModel.feedlessonId

                        }).then(function (data) {
                            $scope.classInfoModel.learnStatusList[index].childrenList = data.info;
                        });
                    },
                    refresh: function () {
                        $scope.events.learningStatusList();
                    },
                    //取消一键合格，两种学习方案公用
                    cancelOneKeyOk: function (index) {
                        HB_dialog.closeDialogByIndex($scope, index);
                    },
                    //一键合格之前先清除原来设置的分数
                    destroyClassInfoModelScore: function () {
                        $scope.classInfoModel.paperScore = null;
                        $scope.classInfoModel.popQuestionScore = null;
                    },
                    // ******************课程学习方案***************************************************
                    //已购买课程分页查询
                    searchCourse: function (e) {
                        $scope.courseInfoModel.page.pageNo = 1;
                        $scope.node.course.pager.page(1);
                    },
                    //课程超市学习方案下的tab切换点击事件
                    changeCourseInfoTab: function (e, type) {
                        $scope.courseInfoModel.courseInfoTab = 1;
                        this.getHistoryPracticeInfo();
                    },

                    getHistoryPracticeInfo: function () {
                        classInfoServiceSon.getHistoryPracticeInfo({
                            userId: $scope.courseInfoModel.buyerIds,
                            schemeId: $scope.courseInfoModel.schemeId,
                            courseId: $scope.courseInfoModel.courseId
                        }).then(function (data) {
                            if (data.status) {
                                $scope.courseInfoModel.coursePracticeExam = data.info;
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        });
                    },
                    //点击课程列表具体课程，切换课程信息
                    chooseCourse: function (item) {
                        $scope.courseInfoModel.gridPending = true;
                        $scope.courseInfoModel.courseId = item.courseId;
                        $scope.courseInfoModel.schemeId = item.schemeId;
                        $scope.events.getPurchaseCourseInfo(item.commoditySkuId);
                    },
                    //获取课程详情
                    getPurchaseCourseInfo: function () {
                        $scope.courseInfoModel.gridPending = true;
                        $scope.courseInfoModel.classInfoTab = 0;
                        classInfoServiceSon.getPurchaseCourseInfo({
                            userId: $scope.courseInfoModel.buyerIds,
                            schemeId: $scope.courseInfoModel.schemeId,
                            courseId: $scope.courseInfoModel.courseId
                        }).then(function (data) {
                            $scope.courseInfoModel.gridPending = false;
                            if (data.status) {
                                $scope.courseInfoModel.courseRealInfo = data.info;
                                $scope.courseInfoModel.subOrderNo = data.info.subOrderNo;
                                var assessStatus = '';
                                switch ($scope.courseInfoModel.courseRealInfo.assessStatus) {
                                    case -1:
                                        assessStatus = '未考核';
                                        break;
                                    case 0:
                                        assessStatus = '不合格';
                                        break;
                                    case 1:
                                        assessStatus = '合格';
                                        break;
                                }
                                $scope.courseInfoModel.courseRealInfo.assessStatus = assessStatus;
                                if ($scope.courseInfoModel.courseRealInfo.activeType) {
                                    if ($scope.courseInfoModel.courseRealInfo.activeType === 1) {
                                        $scope.courseInfoModel.courseRealInfo.activeType = '线上支付';
                                    } else {
                                        $scope.courseInfoModel.courseRealInfo.activeType = '线下支付';
                                    }
                                }
                            }
                        });
                    },
                    //课程一键合格确认
                    oneKeyOkForCourse: function () {
                        $scope.events.destroyCourseInfoModelScore();
                        var height = 500;
                        var hasCoursePracticeAssess = $scope.courseInfoModel.courseRealInfo.hasCoursePracticeAssess;
                        var hasPopQuestionAssess = $scope.courseInfoModel.courseRealInfo.hasPopQuestionAssess;
                        if (!hasCoursePracticeAssess && !hasPopQuestionAssess) {
                            HB_notification.confirm(
                                '确定一键合格?',
                                function (dialog) {
                                    classInfoServiceSon.oneKeyPassForCourse({
                                        userId: $scope.courseInfoModel.buyerIds,
                                        schemeId: $scope.courseInfoModel.schemeId,
                                        courseId: $scope.courseInfoModel.courseId
                                    }).then(function (data) {
                                        if (data.status) {
                                            HB_dialog.success('提示', '一键合格成功，请稍后刷新列表');
                                            // $state.reload ( $state.current.name );
                                        } else {
                                            HB_dialog.error('提示', data.info);
                                        }
                                    }, function (data) {
                                        HB_dialog.error('提示', data.data.info);
                                    });
                                });
                            return;
                        } else if (hasCoursePracticeAssess && hasPopQuestionAssess) {
                            height = 500;
                        } else {
                            height = 300;
                        }
                        HB_dialog.contentAs($scope, {
                            title: '一键合格，设置分数（课程）',
                            height: height,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/classInformation/classInfo/dialogOneKeyOkForCourse.html'
                        });
                    },
                    //触发自主选课学习方案下的课程一键合格
                    sureOneKeyOkForCourse: function (index) {
                        var hasCoursePracticeAssess = $scope.courseInfoModel.courseRealInfo.hasCoursePracticeAssess;
                        var hasPopQuestionAssess = $scope.courseInfoModel.courseRealInfo.hasPopQuestionAssess;

                        var coursePracticeScore = $scope.courseInfoModel.coursePracticeScore;
                        var popQuestionScore = $scope.courseInfoModel.popQuestionScore;
                        if (hasCoursePracticeAssess) {
                            var flag = $scope.events.isDouble(coursePracticeScore);
                            var coursePracticeRequireScore = $scope.courseInfoModel.courseRealInfo.coursePracticeRequireScore;
                            if (!flag) {
                                HB_notification.alert('请输入小数位不超过两位的纯数字');
                                return;
                            }
                            if (!coursePracticeScore) {
                                HB_notification.alert('课后测验合格分不能为空');
                                return;
                            } else if (coursePracticeScore < coursePracticeRequireScore || coursePracticeScore > $scope.courseInfoModel.courseRealInfo.coursePracticeTotalScore) {
                                HB_notification.alert('课后测验合格分不能小于合格分' + coursePracticeRequireScore + '分且不能大于总分' + $scope.courseInfoModel.courseRealInfo.coursePracticeTotalScore + '分');
                                return;
                            }
                        }
                        if (hasPopQuestionAssess) {
                            var flag = $scope.events.isDouble(popQuestionScore);
                            var popQuestionRequireScore = $scope.courseInfoModel.courseRealInfo.popQuestionRequireScore;
                            if (!flag) {
                                HB_notification.alert('请输入小数位不超过两位的纯数字');
                                return;
                            }
                            if (!popQuestionScore) {
                                HB_notification.alert('弹窗题合格分不能为空');
                                return;
                            } else if (popQuestionScore < popQuestionRequireScore || popQuestionScore > $scope.courseInfoModel.courseRealInfo.popQuestionTotalScore) {
                                HB_notification.alert('弹窗题合格分不能小于合格分' + popQuestionRequireScore + '分且不能大于总分' + $scope.courseInfoModel.courseRealInfo.popQuestionTotalScore + '分');
                                return;
                            }
                        }
                        HB_dialog.closeDialogByIndex($scope, index);
                        classInfoServiceSon.oneKeyPassForCourse({
                            userId: $scope.courseInfoModel.buyerIds,
                            schemeId: $scope.courseInfoModel.schemeId,
                            coursePracticeScore: coursePracticeScore,
                            popQuestionScore: popQuestionScore,
                            courseId: $scope.courseInfoModel.courseId
                        }).then(function (data) {
                            if (data.status) {
                                HB_dialog.success('提示', '一键合格成功，请稍后刷新列表');
                                // $state.reload ( $state.current.name );
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        }, function (data) {
                            HB_dialog.error('提示', data.data.info);
                        });
                    },
                    //一键合格之前先清除原来设置的分数
                    destroyCourseInfoModelScore: function () {
                        $scope.courseInfoModel.coursePracticeScore = null;
                        $scope.courseInfoModel.popQuestionScore = null;
                    },
                    //删除指定的课后测验记录
                    deleteCoursePracticeRecord: function (item) {

                        HB_notification.confirm(
                            '是否确认删除该课后测验的答题记录，删除后学员侧对应的测验记录也将会清空',
                            function (dialog) {
                                return classInfoServiceSon.deleteHistoryPracticeInfo({
                                    userId: $scope.courseInfoModel.buyerIds,
                                    schemeId: $scope.courseInfoModel.schemeId,
                                    courseId: $scope.courseInfoModel.courseId,
                                    practiseId: item.practiseId,
                                    historyAnswerInfoId: item.historyAnswerInfoId
                                }).then(function (data) {
                                    dialog.doRightClose();
                                    if (data.status) {
                                        $scope.events.getHistoryPracticeInfo();
                                        HB_dialog.success('提示', '删除成功');
                                    } else {
                                        HB_dialog.error('提示', data.info);
                                    }
                                });
                            });
                    },
                    //******************************工具**************************************
                    //校验输入的字符串是否是double类型数据
                    isDouble: function (num) {
                        var patten = /^\d*[.]?\d{0,2}$/;
                        return patten.test(num);
                    }
                };

                $scope.kendoPlus = {
                    gridDelay: false,
                    courseGridDelay: false
                };

                $scope.node = {
                    learningClass: null,
                    learnStatus: null,
                    changeClass: null,
                    course: null
                };

                //用户已选班级列表
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
                    result.push('#: classStatus #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: createTypeInfo #');
                    result.push('</td>');

                    result.push('</tr>');
                    learningClassTemplate = result.join('');
                })();
                $scope.ui.learningClass = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(learningClassTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/classInfo/getCustomersClassPage',
                                    data: function (e) {
                                        var temp = {
                                            query: {
                                                userId: $scope.classInfoModel.buyerIds,
                                                className: $scope.classInfoModel.className,
                                                pageNo: e.page,
                                                pageSize: e.pageSize
                                            }
                                        };
                                        if (!$scope.skuParamsCustomServiceClassInfo) {
                                            temp.query.skuPropertyList = undefined;
                                        } else {
                                            temp.query.skuPropertyList = $scope.skuParamsCustomServiceClassInfo.skuPropertyList;
                                        }
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
                                    $timeout(function () {
                                        $scope.model.mark = true;
                                        //$scope.model.markTwo=true;
                                        //if($scope.model.markOne && $scope.model.markTwo){
                                        //    $scope.model.mark = true;
                                        //}
                                    });

                                    if (response.status) {
                                        $scope.classInfoModel.gridPending = false;
                                        if (response.info.length === 0) {
                                            $timeout(function () {
                                                $scope.classInfoModel.noClassInformarion = true;
                                            });
                                        } else {
                                            $timeout(function () {
                                                $scope.classInfoModel.noClassInformarion = false;
                                                $scope.classInfoModel.classResult = response.info;
                                                $scope.events.chooseUse($scope.classInfoModel.classResult[0]);
                                            });
                                        }
                                        var dataview = response.info, index = 1;
                                        angular.forEach(dataview, function (item) {
                                            item.index = index++;
                                            if (item.createType === 1) {
                                                item.createTypeInfo = '系统创建';
                                            }
                                            if (item.createType === 2) {
                                                item.createTypeInfo = '用户创建';
                                            }
                                            if (item.createType === 3) {
                                                item.createTypeInfo = '管理员创建';
                                            }
                                            if (item.createType === 4) {
                                                item.createTypeInfo = '历史迁移';
                                            }
                                            if (item.createType === 5) {
                                                item.createTypeInfo = '外部接口';
                                            }

                                            if (item.userState === 0) {
                                                item.classStatus = '有效';
                                            } else if (item.userState === 1) {
                                                item.classStatus = '冻结';
                                            } else {
                                                item.classStatus = '失效';
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
                                width: 40
                            },
                            {sortable: false, field: 'name', title: '班级名称'},
                            {sortable: false, field: 'name', title: '状态', width: 70},
                            {sortable: false, field: 'name', title: '创建方式', width: 80}
                        ]
                    }
                };
                //课程学习进度列表
                var learnStatusTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: courseName #">');
                    result.push('#: courseName #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: courseHours #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: timeLength #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: learningSchedule #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: learningStartTime === null?\'/\': learningStartTime#');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: lastLearningTime === null?\'/\': lastLearningTime#');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: totalPopQuestionNum #' + '(对' + ' #: correctPopQuestionNum # ' + '错' + ' #: errorPopQuestionNum # ' + ')');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-disabled="classInfoModel.classRealInfo.examinationResult === \'合格\' || classInfoModel.classUserStatus !== 0" ng-click="events.feedLearning(dataItem)" >一键学习</button>');
                    result.push('</td>');
                    // has-permission="classInformation/onekeyLearn"
                    result.push('</tr>');
                    learnStatusTemplate = result.join('');
                })();
                $scope.ui.learningStatus = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(learnStatusTemplate),
                        scrollable: true,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/classInfo/getCoursesLearningInfo',
                                    data: function (e) {
                                        var temp = {
                                            userId: $scope.classInfoModel.buyerIds,
                                            classId: $scope.classInfoModel.classId,
                                            pageNo: e.page,
                                            pageSize: $scope.classInfoModel.page.pageSize
                                        };
                                        if (!temp.userId) {
                                            temp.userId = '';
                                        }
                                        if (!temp.classId) {
                                            temp.classId = '';
                                        }
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
                                        $scope.classInfoModel.gridPending = false;
                                        //$scope.model.markOne=true;
                                        //if($scope.model.markOne && $scope.model.markTwo){
                                        //    $scope.model.mark = true;
                                        //}
                                    });
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if (response.status) {
                                        var dataview = response.info, index = 1;
                                        angular.forEach(dataview, function (item) {

                                            function timeToStr (time) {
                                                var h = 0,
                                                    m = 0,
                                                    s = 0,
                                                    _h = '00',
                                                    _m = '00',
                                                    _s = '00';
                                                h = Math.floor(time / 3600);
                                                time = Math.floor(time % 3600);
                                                m = Math.floor(time / 60);
                                                s = Math.floor(time % 60);
                                                _s = s < 10 ? '0' + s : s + '';
                                                _m = m < 10 ? '0' + m : m + '';
                                                _h = h < 10 ? '0' + h : h + '';
                                                return _h + ':' + _m + ':' + _s;
                                            }

                                            item.timeLength = timeToStr(item.timeLength);
                                            item.index = index++;
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
                            {sortable: false, field: 'name', title: '课程名称', width: 250},
                            {sortable: false, field: 'result', title: '学时', width: 80},
                            {sortable: false, field: 'result', title: '时长', width: 90},
                            {sortable: false, field: 'result', title: '学习进度', width: 90},
                            {sortable: false, field: 'result', title: '开始学习时间', width: 145},
                            {sortable: false, field: 'result', title: '最后学习时间', width: 145},
                            {sortable: false, field: 'result', title: '弹窗答题', width: 110},
                            {
                                title: '操作',
                                width: 90
                            }
                        ]
                    }
                };
                //用户购买的课程（自主选课学习方案）
                var courseTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr ng-class="{\'k-state-selected\':courseInfoModel.useIndex === dataItem.index}" ng-click="events.chooseCourse(dataItem)">');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: courseName #">');
                    result.push('#: courseName #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: courseStatus #');
                    result.push('</td>');

                    result.push('</tr>');
                    courseTemplate = result.join('');
                })();
                $scope.ui.course = {
                    options: {
                        // 每个行的模板定义,
                        rowTemplate: kendo.template(courseTemplate),
                        scrollable: false,
                        noRecords: {
                            template: '暂无数据'
                        },
                        dataSource: {
                            transport: {
                                read: {
                                    contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                    url: '/web/admin/customerServiceCourseStudy/pageUserPurchaseCourse',
                                    data: function (e) {
                                        var temp = {
                                            query: {
                                                userId: $scope.model.userId,
                                                pageNo: e.page,
                                                pageSize: e.pageSize
                                            }
                                        };
                                        if (!$scope.skuParamsCustomServiceCourseInfo) {
                                            temp.query.skuPropertyList = undefined;
                                        } else {
                                            temp.query.skuPropertyList = $scope.skuParamsCustomServiceCourseInfo.skuPropertyList;
                                        }
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
                                    $timeout(function () {
                                        $scope.model.mark = true;
                                    });

                                    if (response.status) {
                                        $scope.courseInfoModel.gridPending = false;
                                        if (response.info.length === 0) {
                                            $timeout(function () {
                                                $scope.courseInfoModel.noCourseformarion = true;
                                            });
                                        } else {
                                            $timeout(function () {
                                                $scope.courseInfoModel.noCourseformarion = false;
                                                $scope.courseInfoModel.classResult = response.info;
                                                $scope.events.chooseCourse($scope.courseInfoModel.classResult[0]);
                                            });
                                        }
                                        var dataview = response.info, index = 1;
                                        angular.forEach(dataview, function (item) {
                                            item.index = index++;
                                            if (item.state === 0) {
                                                item.courseStatus = '正常';
                                            } else if (item.state === 1) {
                                                item.courseStatus = '冻结';
                                            } else {
                                                item.courseStatus = '失效';
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
                        },
                        // 选中切换的时候改变选中行的时候触发的事件
                        columns: [
                            {
                                title: 'No',
                                width: 40
                            },
                            {sortable: false, field: 'name', title: '课程名称'},
                            {sortable: false, field: 'name', title: '状态', width: 70}
                        ]
                    }
                };
                $scope.ui.courseTable = {
                    refresh   : true,
                    dataSource: new kendo.data.DataSource ( {
                        serverPaging: true,
                        page        : 1,
                        pageSize    : 5, // 每页显示的数据数目
                        transport   : {
                            parameterMap: function ( data, type ) {
                                return {
                                    pageNo: data.page,
                                    pageSize: data.pageSize,
                                    // userId: "2c9180e562af4a900162b34653830913",
                                    // classId: "2c91801662ae309b0162b82ea0700348"
                                    userId: $scope.classInfoModel.buyerIds,
                                    classId: $scope.classInfoModel.classId
                                };
                            },
                            read        : {
                                url     : "/web/admin/classInfo/getCoursesLearningInfo",
                                dataType: 'json'
                            }
                        },
                        schema      : {
                            parse: function ( response ) {
                                // 将会把这个返回的数组绑定到数据源当中
                                if ( response.status ) {
                                    $scope.refreshAble = false;
                                    $scope.classInfoModel.learnStatusList = response.info;
                                    angular.forEach($scope.classInfoModel.learnStatusList, function (item) {
                                        // item.timeLength=timeToStr(item.timeLength);
                                        item.ischecked = false;
                                        item.firstRequest = true;
                                        item.childrenList = [];
                                    });
                                    return response;
                                } else {
                                    $scope.globle.showTip ( '加载学习课程失败', 'error' );
                                    return {
                                        status       : response.status,
                                        totalSize    : 0,
                                        totalPageSize: 0,
                                        info         : []
                                    };
                                }
                            },
                            total: function ( response ) {
                                return response.totalSize;
                            },
                            data : function ( response ) {
                                $scope.model.newsList = response.info;
                                $scope.$apply ();
                                return response.info;
                            }
                        }
                    } ),
                    pageable: {
                        refresh: true,
                        pageSizes: [5, 10, 30, 50] || true,
                        pageSize: 10,
                        buttonCount: 10
                    },
                };
            }]
    };
});