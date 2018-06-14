define(function (myRealClass) {
    'use strict';
    return {
        indexCtrl: ['$scope', '$state', '$rootScope', '$dialog', '$stateParams', 'myRealClassService', '$timeout', '$http', 'hbBasicData',
            function ($scope, $state, $rootScope, $dialog, $stateParams, myRealClassService, $timeout, $http, hbBasicData) {
                //hbBasicData.doPopQuestion($scope);
                $scope.model = {
                    learnType: 1,
                    testPaperShow: false,
                    ifLearned: false,
                    changeClass: false,
                    hasChoseLesson: [],
                    historyExamArr: [],
                    dialogTimeLen: {},
                    //web/front/myClass/getClassCheckProgress(假数据1)
                    myRelClass: {},
                    lessonLength: {},
                    imgLoding: true,
                    getClassNum: 0,
                    changeClassStatus: true,
                    getUserCourseStudyInfo: null,
                    getUserExamInfo: {},
                    getUserClassLearningInfo: {},
                    currentTab: 'trainClass',
                    IsSecretClass: false //是否为涉密班级
                };
                $scope.mapValue = [];
                $scope.correctAnswer = '--';

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


                //获取考试圈的百分比
                function getExamTimesSchedule () {
                    var examTimesSchedule = null;
                    if ($scope.model.myRelClass.paperCanAnswerTime === -1) {
                        if ($scope.model.myRelClass.paperHaveAnswerTime > 0) {
                            examTimesSchedule = 100;
                        } else {
                            examTimesSchedule = 0;
                        }
                    } else {
                        examTimesSchedule = $scope.model.myRelClass.paperGetScore >= $scope.model.myRelClass.paperRequireGetScore ? 100 : 0;
                    }
                    console.log($scope.model.myRelClass.paperGetScore);
                    console.log($scope.model.myRelClass.paperRequireGetScore);
                    return examTimesSchedule;
                }


                myRealClassService.findUserSelectedInterestCourseInPoolList($stateParams.id,'').success(function (data) {
                    console.log(data);
                    if (data.status && data.code === 200) {
                        $scope.model.intrestPackList = data.info;
                        if (angular.isArray(data.info) && data.info.length > 0) {
                            $scope.model.hasInterestCourseCount = true;
                        }

                    }
                });


                $http.get('/web/front/myClass/getClassCheckProgress', {params: {classId: $stateParams.id}}).success(function (data) {
                    $scope.model.imgLoding = false;
                    if (data.status) {
                        $scope.model.myRelClass = data.info;
                        $scope.model.lessonLength.totalTimeLength = $scope.model.myRelClass.needSelectedHour;
                        $scope.model.lessonLength.chosenTimeLength = $scope.model.myRelClass.haveSelectedHour;

                        $scope.model.myRelClass.haveLearnedHour = data.info.haveLearnedHour;
                        if ($scope.model.myRelClass.questionGetScore !== null) {
                            $scope.totalGetScore = numAdd($scope.model.myRelClass.questionGetScore, $scope.model.myRelClass.paperGetScore);
                        } else {
                            $scope.totalGetScore = '--';
                        }
                        //指令参数
                        //$scope.model.myRelClass.examinationResult=1;
                        //$scope.model.myRelClass.trainingPassScore=60;
                        //$scope.model.myRelClass.paperGetScore=61;


                        $scope.mapValue = [
                            $scope.model.myRelClass.courseLearningSchedule,
                            getExamTimesSchedule(),
                            parseInt($scope.model.myRelClass.popQuestionGetScore / $scope.model.myRelClass.popQuestionRequireScore * 100),
                            ($scope.model.myRelClass.examinationResult === 1 ) ? 100 : 0,
                            ($scope.model.myRelClass.paperGetScore >= $scope.model.myRelClass.trainingPassScore) ? true : false
                        ];
                        //答题率
                        $scope.presentPaper = $scope.model.myRelClass.answeredQuestionNum !== 0 ? parseInt($scope.model.myRelClass.correctQuestionNum * 100 / $scope.model.myRelClass.answeredQuestionNum) : 0;
                        //$scope.model.myRelClass.examinationResult=0;
                        //$scope.model.myRelClass.paperCanAnswerTime=-1;

                        $scope.events.getclassTotalInfor();


                        //判断考试是否通过
                        if ($scope.model.myRelClass.paperGetScore && $scope.model.myRelClass.paperRequireGetScore) {
                            if ($scope.model.myRelClass.paperGetScore >= $scope.model.myRelClass.paperRequireGetScore) {
                                $scope.model.myRelClass.examHasPass = true;
                            }
                        }


                    }
                });


                $scope.$watch('presentPaper', function (newVal) {
                    if (!isNaN(newVal)) {
                        $scope.correctAnswer = newVal;
                    }
                });


                //判断是否有练习 考试等等。。
                $http.get('/web/front/myClass/getClassConfig?classId=' + $stateParams.id).success(function (data) {
                    if (data.status) {
                        //是否有弹窗题考核
                        $scope.model.hasPopQuestionAssess = data.info.hasPopQuestionAssess;
                        //是否有练习
                        $scope.model.hasPractice = data.info.hasPractice;
                        //是否配置课程重学
                        $scope.model.courseRelearn = data.info.courseRelearn;
                        //是否配置整班重学
                        $scope.model.classRelearn = data.info.classRelearn;
                        //是否有兴趣课程
                        $scope.model.hasInterestCourse = data.info.hasInterestCourse;
                        //是否有考试
                        $scope.model.hasExamAssess = data.info.hasExamAssess;
                    }
                });

                /*myRealClassService.hasPractice({
                    schemeId: $stateParams.id
                }).then(function (data) {
                    $scope.model.hasPractice = data.data.info;
                });*/

                //是否为涉密班级
                /*myRealClassService.checkIsSecretClass({
                    trainingId: $stateParams.id
                }).then(function (response) {
                    if (response.status) {
                        $scope.model.IsSecretClass = response.info;
                    }
                });*/


                //主从同步延时1秒
                $timeout(function () {
                    myRealClassService.validateUserClassThenDo('init', $stateParams.id, $dialog, null, $scope);
                }, 1000);


                $scope.events = {
                    toIntrest: function () {
                        console.log($scope.model.getUserClassLearningInfo);
                        $state.go('states.myRealClass.intrestCourse', {
                            classId: $scope.model.getUserClassLearningInfo.classId,
                            coursePoolId: $scope.model.getUserClassLearningInfo.interestCoursePoolId,
                            haveInterest: $scope.model.hasInterestCourse
                        });
                    },
                    getclassTotalInfor: function () {
                        //培训进度请求
                        myRealClassService.getUserCourseStudyInfo({classId: $stateParams.id}).then(function (data) {
                            $scope.model.getUserCourseStudyInfo = data.info;
                            $scope.model.getClassNum = $scope.model.getClassNum + 1;
                            $scope.model.myRelClass.haveLearnedHour = data.info.haveLearnedHour;
                            $scope.ruleType = data.info.ruleType;
                            $scope.surplusHour = data.info.surplusHour;
                        });
                        myRealClassService.getUserExamInfo({classId: $stateParams.id}).then(function (data) {
                            if (data) {
                                $scope.model.getUserExamInfo = data.info;
                                //$scope.model.isAllowExam = data.info.isAllowExam;
                                $scope.model.getClassNum = $scope.model.getClassNum + 1;
                            } else {
                                $scope.model.getUserExamInfo = null;
                                //$scope.model.isAllowExam = data.info.isAllowExam;
                                $scope.model.getClassNum = $scope.model.getClassNum + 1;
                            }

                        });
                        myRealClassService.getUserClassLearningInfo({classId: $stateParams.id}).then(function (data) {
                            $scope.model.getUserClassLearningInfo = data.info;
                            $scope.model.getClassNum = $scope.model.getClassNum + 1;
                        });
                    },
                    goChooseLesson: function (e) {
                        e.preventDefault();
                        $state.go('states.myRealClass.chooseLesson', {id: $stateParams.id});
                    },
                    //选课考核要求
                    dialogRequirements: function (e) {
                        $scope.events.getCourseList();
                        e.preventDefault();
                        $dialog.contentDialog({
                            title: '本班选课及考核要求',
                            visible: true,
                            modal: true,
                            width: 820,
                            contentUrl: '@systemUrl@/views/myRealClass/dialogRealClass.html'
                        }, $scope);
                    },
                    //课程重学
                    reLearn: function (e, item) {
                        e.preventDefault();
                        $dialog.confirm({
                            title: '提示',
                            visible: true,
                            modal: true,
                            width: 250,
                            ok: function () {
                                $scope.events.sureReLearn(item);
                                return true;
                            },
                            cancel: function () {
                                return true;
                            },
                            content: '确认要重学该课程吗？重学后课程的学习进度、课程练习记录将被清除！'
                        });

                    },

                    //课程重学确认
                    sureReLearn: function (item) {
                        $scope.lwhLoading = true;
                        $http.get('/web/front/myClass/relearnClassCourse', {
                            params: {
                                classId: $stateParams.id,
                                courseId: item.courseId
                            }
                        }).success(function (data) {
                            $scope.lwhLoading = false;
                            if (data.status) {
                                $dialog.alert({
                                    title: '提示',
                                    visible: true,
                                    modal: true,
                                    width: 250,
                                    ok: function () {

                                        return true;
                                    },
                                    content: '课程重学成功！'
                                });
                                $state.reload($state.current.name);
                            } else {
                                $dialog.alert({
                                    title: '提示',
                                    visible: true,
                                    modal: true,
                                    width: 250,
                                    ok: function () {

                                        return true;
                                    },
                                    content: '课程重学失败！'
                                });
                            }
                        });
                    },


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


                                hbBasicData.addPendingModal($scope);
                                setTimeout(function () {
                                    hbBasicData.closePendingDialog();
                                    $dialog.alert({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            $state.reload($state.current.name);
                                            return true;
                                        },
                                        cancel: function () {
                                            $state.reload($state.current.name);
                                            return true;
                                        },
                                        content: '整班重学成功！'
                                    });
                                }, 3000);

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
                    },


                    //试卷点击
                    testPaper: function (e) {
                        e.preventDefault();

                        if ($scope.submitAble) {
                            return false;
                        }

                        $scope.submitAble = true;
                        myRealClassService.isAllowExam({classId: $stateParams.id}).then(function (data) {
                            //data.info=true;
                            //如果通过前置条件
                            //data.info.isPassPrecondition=true;
                            if (data.status) {
                                if (data.info.isPassPrecondition) {


                                    if (!data.info.isAnswerAllPopQuestion) {
                                        $dialog.alert({
                                            title: '提示',
                                            modal: true,
                                            width: 250,
                                            ok: function () {
                                                $scope.testListParams = {
                                                    schemeId: $stateParams.id,
                                                    trainingSchemeType: 'TRAINING_CLASS'
                                                };
                                                hbBasicData.doPopQuestion($scope);
                                                return true;
                                            },
                                            content: '您尚有' + data.info.unAnswerQuestionNums + '道课程练习未作答，请先作答完才可进入考试'
                                        });
                                        return false;
                                    }


                                    $scope.model.currentTab = 'exam';
                                    $scope.model.imgLoding = true;
                                    myRealClassService.getExamInfo({classId: $stateParams.id}).then(function (data) {
                                        $scope.model.imgLoding = false;
                                        //$scope.model.limitExamCount=data.info[0].limitExamCount;
                                        if (data.status) {
                                            $scope.model.textPaperInfo = data.info;
                                        } else {
                                            $dialog.confirm({
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
                                } else {
                                    //没通过前置条件提示一下
                                    $scope.model.imgLoding = false;
                                    $dialog.confirm({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '请先完成班级要求的课时，课程学习进度达到' + data.info.completeProgress + '%，再进入考试'
                                    });
                                }
                            } else {
                                $scope.model.imgLoding = false;
                                $dialog.confirm({
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
                    },


                    goTextHtml: function (e, item) {
                        e.preventDefault();
                        if ($scope.model.myRelClass.examinationResult === 1) {
                            $dialog.confirm({
                                title: '提示',
                                visible: true,
                                modal: true,
                                width: 250,
                                ok: function () {
                                    return true;
                                },
                                content: 'Hi,您已通过培训考核，无需继续考试！'
                            });
                        } else {
                            var popup = window.open('about:blank', '_blank');  //先发起弹窗（因为是用户触发，所以不会被拦截）
                            popup.document.write('<h2>加载中...</h2>');
                            if (item.surplusExamCount <= 0 && item.limitExamCount === true) {
                                popup.close();
                                $dialog.confirm({
                                    title: '提示',
                                    visible: true,
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: 'Hi,您已经没有剩余的考试次数，请确认！'
                                });
                            } else {
                                myRealClassService.examination({
                                    examRoundId: item.examRoundId,
                                    classId: $stateParams.id
                                }).then(function (data) {
                                    if (data.status) {
                                        popup.location = data.info;
                                        // window.open(data.info);
                                    } else {
                                        popup.close();

                                        if (data.code === '31208') {
                                            $dialog.confirm({
                                                title: '提示',
                                                visible: true,
                                                modal: true,
                                                width: 250,
                                                ok: function () {
                                                    $scope.testListParams = {
                                                        schemeId: $stateParams.id,
                                                        trainingSchemeType: 'TRAINING_CLASS'
                                                    };
                                                    hbBasicData.doPopQuestion($scope);
                                                    return true;
                                                },
                                                content: data.info
                                            });
                                        } else {
                                            $dialog.confirm({
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


                                    }
                                });
                            }
                        }
                    },
                    changeClassEvent: function (e, item) {
                        e.preventDefault();
                        if ($scope.goRealClassDis === true) {
                            return false;
                        }
                        $scope.goRealClassDis = true;
                        myRealClassService.validateUserClassAccess({classId: item.classId}).then(function (data) {
                            $scope.goRealClassDis = false;
                            switch (data.code) {
                                case 200:
                                    $state.go('states.myRealClass', {
                                        id: item.classId,
                                        name: item.className
                                    });
                                    break;

                                case '31203':
                                    $dialog.confirm({
                                        title: '班级处于退款审核中，暂不开放学习',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '当前班级正处于退款审核阶段，暂不开放学习。'
                                    });
                                    break;

                                case '31204':
                                    $dialog.confirm({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '用户该班级已失效'
                                    });
                                    break;

                                case '31205':
                                    $dialog.confirm({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '当前班级处于迁移数据，请移步旧平台'
                                    });
                                    break;

                                case '31206':
                                    $dialog.confirm({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '该班级尚未开始培训'
                                    });
                                    break;

                                case '31207':
                                    $dialog.confirm({
                                        title: '班级已结束培训',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '当前班级已结束培训，不再开放培训咯。'
                                    });
                                    break;
                            }
                        });

                    },
                    getMyCourseList: function (type) {
                        myRealClassService.getMyCourseList({
                            classId: $stateParams.id,
                            listType: type
                        }).then(function (data) {
                            if (type === 1) {
                                $scope.model.lessonIsLearning = data.info;
                                angular.forEach($scope.model.lessonIsLearning, function (item, index) {
                                    if (item.courseName.length >= 20) {
                                        item.courseNameShort = item.courseName.substr(0, 20) + '...';
                                    } else {
                                        item.courseNameShort = item.courseName;
                                    }
                                });
                            } else {
                                $scope.model.lessonIsLearned = data.info;
                                angular.forEach($scope.model.lessonIsLearned, function (item, index) {
                                    if (item.courseName.length >= 20) {
                                        item.courseNameShort = item.courseName.substr(0, 20) + '...';
                                    } else {
                                        item.courseNameShort = item.courseName;
                                    }
                                });
                            }
                        });
                    },
                    tryListen: function (e, id) {
                        e.preventDefault();
                        var popup = window.open('about:blank', '_blank');  //先发起弹窗（因为是用户触发，所以不会被拦截）
                        popup.document.write('<h2>加载中...</h2>');
                        myRealClassService.validateUserClassAccess({classId: $stateParams.id}).then(function (data) {
                            if (!data.status) {
                                popup.close();
                                $dialog.confirm({
                                    title: '提示',
                                    visible: true,
                                    modal: true,
                                    width: 250,
                                    ok: function () {
                                        return true;
                                    },
                                    content: data.info
                                });
                            } else {
                                //hbBasicData.setCookie('trainingSchemeTypeEnum','TRAINING_CLASS');
                                popup.location = '/play/#/learn/' + $stateParams.id + '/' + id + '/courseware/TRAINING_CLASS?unitName='+require.unitPath;  //在重定向页面链接
                                //window.open('/play/#/learn/' + $stateParams.id + '/' + id + '/courseware');
                            }
                        });
                    },
                    chooseLearned: function (type) {
                        if ($scope.model.learnType === type) {
                            return false;
                        }
                        $scope.model.learnType = type;
                        $scope.events.getMyCourseList(type);
                        if (type === 2) {
                            $scope.model.ifLearned = true;
                        } else {
                            $scope.model.ifLearned = false;
                        }
                    },
                    getCourseList: function () {
                        myRealClassService.findCoursePage({
                            listType: 3,
                            schemeId: $stateParams.id
                        }).then(function (data) {
                            $scope.model.hasChooseLesson = data.info;
                            angular.forEach($scope.model.hasChooseLesson, function (item) {
                                if (item.name.length >= 15) {
                                    item.shortName = item.name.substr(0, 15) + '...';
                                } else {
                                    item.shortName = item.name;
                                }
                                item.timeLength = timeToStr(item.timeLength);
                            });

                        });
                    },
                    changeClassList: function (e) {
                        e.stopPropagation();
                        $scope.model.changeClass = !$scope.model.changeClass;
                        if ($scope.model.changeClassStatus) {
                            $scope.model.imgLoding = true;
                            myRealClassService.getMyClassInfoList({
                                trainingYearId: -1,
                                upToStandard: -1,
                                pageNo: 1,
                                pageSize: 8
                            }).then(function (data) {
                                $scope.model.imgLoding = false;
                                if (data.status) {
                                    $scope.model.changeClassStatus = false;
                                    $scope.model.changeClassInfo = data.info;
                                    angular.forEach($scope.model.changeClassInfo, function (item, index) {
                                        if (item.classId === $stateParams.id) {
                                            $scope.model.classIndex = index;
                                        }
                                    });
                                    $scope.model.changeClassInfo.splice($scope.model.classIndex, 1);
                                }
                            });
                        }
                    },

                    historyExamDialog: function () {
                        $scope.lookExamSubmit = true;
                        myRealClassService.getHistoryExamPaper($stateParams.id).then(function (data) {
                            $scope.lookExamSubmit = false;
                            if (data.data.status) {
                                if (data.data.info.length > 0) {
                                    $scope.model.historyExamArr = data.data.info;
                                    $dialog.contentDialog({
                                        title: '历史考试记录',
                                        visible: true,
                                        modal: true,
                                        width: 820,
                                        contentUrl: '/center/@systemUrl@/views/myRealClass/historyExamDialog.html'
                                    }, $scope);
                                } else {
                                    $dialog.confirm({
                                        title: '提示',
                                        visible: true,
                                        modal: true,
                                        width: 250,
                                        ok: function () {
                                            return true;
                                        },
                                        content: '还没有历史考试记录。'
                                    });
                                }


                            }
                        });

                    },

                    lookHistoryView: function (item) {
                        if (!item.showQuestionAnalysis) {
                            return false;
                        }
                        var popup = window.open('about:blank', '_blank');  //先发起弹窗（因为是用户触发，所以不会被拦截）
                        popup.document.write('<h2>加载中...</h2>');
                        myRealClassService.viewAnswerHistory(item.id, item.answerPaperId).success(function (data) {
                            if (data.code === 200) {
                                //window.open(data.info);
                                popup.location = data.info;
                            }
                        });
                    },

                    certificateApplication: function (e) {
                        if ($scope.model.myRelClass.examinationResult != 1) {
                            $dialog.alert({
                                content: '尚未通过班级考核，暂无法申请证书',
                                title: '提示',
                                visible: true,
                                okValue: '确定',
                                ok: function () {
                                }
                            });
                            return;
                        }
                        $state.go('states.myRealClass.certificateApplication', {trainingId: $stateParams.id});
                    },

                    checkQuestionNum: function (num) {
                        $scope.model.maxQuestionNum = num;
                    }
                };


                $scope.$watch('model.getClassNum', function (nv) {
                    if (nv >= 3) {
                        $scope.model.jkIsOk = true;
                    }
                });

                $scope.events.getMyCourseList(1);
                /////////////////////////////////
                /////////////////////////////////
                /////////////////////////////////
                /////////////////////////////////
                console.log($stateParams.id);
                $scope.model.maxQuestionNum = '5';
                $scope.events.goPractice = function (type) {
                    var method = {
                        practice: function practice () {
                            $dialog.contentDialog({
                                title: '请选择本次练习题量',
                                visible: true,
                                contentUrl: '/center/@systemUrl@/views/myRealClass/chooseQuestionNumber.html',
                                modal: true,
                                okValue: '开始',
                                ok: function () {
                                    var popup = window.open('about:blank', '_blank');  //先发起弹窗（因为是用户触发，所以不会被拦截）
                                    popup.document.write('<h2>加载中...</h2>');
                                    var me = this;
                                    myRealClassService.getPracticeInfo({
                                        schemeId: $stateParams.id,
                                        maxQuestionNum: $scope.model.maxQuestionNum
                                    }).then(function (data) {
                                        if (data.data.status) {
                                            if (data.data.info.code !== '200') {
                                                popup.close();
                                                $dialog.alert({
                                                    content: data.data.info.message,
                                                    title: '练习暂未开放',
                                                    visible: true,
                                                    okValue: '确定',
                                                    ok: function () {
                                                    }
                                                });
                                            } else {
                                                //popup.location = '#/exam/' + $stateParams.id;
                                                //popup.location = decodeURIComponent(data.data.info.data);  //在重定向页面链接
                                                //window.open(data.data.info.info);'
                                                popup.location = data.data.info.data;
                                            }
                                        } else {
                                            popup.close();
                                            $dialog.alert({
                                                content: data.data.info.message,
                                                title: '班级失效',
                                                visible: true,
                                                okValue: '确定',
                                                ok: function () {
                                                }
                                            });
                                        }
                                        me.close();
                                    });
                                    return false;
                                }
                            }, $scope);
                        },
                        history: function () {
                            var popup = window.open('about:blank', '_blank');  //先发起弹窗（因为是用户触发，所以不会被拦截）
                            // popup.document.write('<h2>加载中...</h2>');

                            myRealClassService.getPracticeInfo({
                                schemeId: $stateParams.id,
                                maxQuestionNum: $scope.model.maxQuestionNum
                            }).then(function (data) {
                                if (data.data.status) {
                                    if (data.data.info.code !== '200') {
                                        popup.close();
                                        $dialog.alert({
                                            content: data.data.info.message,
                                            title: '练习暂未开放',
                                            visible: true,
                                            okValue: '确定',
                                            ok: function () {
                                            }
                                        });
                                    } else {
                                        require.extUtil.openWindow(popup, '/center/#/exam/' + $stateParams.id, '_blank')
                                        //popup.location = '/center/#/exam/' + $stateParams.id;  //在重定向页面链接
                                        //popup.location =  decodeURIComponent(data.data.info.data) //在重定向页面链接
                                        //console.log(decodeURIComponent('http://dev.exam.com:8080/web/examService/examination?requestType=9&projectId=40289b7c60683fec0160684477cd0004&subProjectId=40289b7c60683fec0160684477f80006&platformId=40289b7c60683fec01606844760c0000&platformVersionId=40289b7c60683fec01606844767a0001&unitId=-1&organizationId=-1&userId=2c9180e56053a04f016068ee932926b6&bizUrl=http%3A%2F%2Fdev.coursesupermarketv2.com%3A9000%2Fweb%2Ffront%2FquestionPracticeLibrary%2FgetFetchQuestionParam%3FtrainingSchemeId%3D2c91801661223e9c016125dcdfa00139%26maxQuestionNum%3D5%26userId%3D2c9180e56053a04f016068ee932926b6'));
                                        //console.log(decodeURIComponent('http://www.baidu.com'));
                                    }
                                } else {
                                    popup.close();
                                    $dialog.alert({
                                        content: data.data.info.message,
                                        title: '班级失效',
                                        visible: true,
                                        okValue: '确定',
                                        ok: function () {
                                        }
                                    });
                                }
                            });
                            // $state.go('states.exam', {trainClassId: $stateParams.id});
                        }
                    };

                    method[type]();
                };

                $scope.events.toPractice = function () {
                    if ($scope.model.currentTab === 'practice') {
                        return;
                    }
                    $scope.model.imgLoding = true;
                    myRealClassService.getPracticeInfo({
                        schemeId: $stateParams.id,
                        maxQuestionNum: 5
                    }).then(function (data) {
                        $scope.model.imgLoding = false;
                        if (data.data.code != 200) {
                            $dialog.alert({
                                content: data.data.info,
                                title: '班级无效',
                                visible: true,
                                okValue: '确定',
                                ok: function () {
                                }
                            });
                            return;
                        }
                        if (data.data.info.result === '1' || data.data.info.result === '2' || data.data.code == 31207) {
                            if (data.data.code == 31207) {
                                $dialog.alert({
                                    content: data.data.info,
                                    title: '培训结束',
                                    visible: true,
                                    okValue: '确定',
                                    ok: function () {
                                    }
                                });
                            } else {
                                $dialog.alert({
                                    content: data.data.info.info,
                                    title: data.data.info.result === '1' ? '练习暂未开放' : '暂无练习可做，请先学完课程',
                                    visible: true,
                                    okValue: '确定',
                                    ok: function () {
                                    }
                                });
                            }
                        } else {
                            $scope.model.currentTab = 'practice';
                            $scope.model.toPracticeUrl = data.data.info.info;
                            myRealClassService.getPracticeCount({schemeId: $stateParams.id})

                                .then(function (data) {
                                    $scope.model.donePracticeCount = data.data.info;
                                });
                        }
                    });
                };


                //获取弹窗里的数据
                myRealClassService.getCoursePoolRuleForm($stateParams.id).success(function (data) {
                    if (data.status && data.code === 200) {
                        $scope.model.hasChoseLesson = data.info.courseList;
                        $scope.model.dialogTimeLen = data.info.timeLength;
                    }
                });

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

            }]
    };
});