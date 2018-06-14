define(['@systemUrl@/js/modules/releaseGoods/controllers/releaseGoods-kendo-grid', 'cooper'], function (releaseGoodsKendoGrid, cooper) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_dialog', '$q', '$http', 'hbUtil', '$state', 'TabService', '$stateParams', 'releaseGoodsServices', 'easyKendoDialog', '$timeout', 'HB_notification', function ($scope, HB_dialog, $q, $http, hbUtil, $state, TabService, $stateParams, releaseGoodsServices, easyKendoDialog, $timeout, HB_notification) {

            var cp = new cooper();
            var downloadUrlPrefix = null;


            $scope.closeTabByLwh = function (index, wantToGoView, viewParams) {
                TabService.from = '0';
                $scope.HB_TAB.tabs.splice(index, 1);
                if (viewParams == undefined || viewParams == null) {
                    $state.go(wantToGoView);
                } else {
                    $state.go(wantToGoView, viewParams);
                }
            };


            $scope.$watch('model.submitType', function (nv) {
                if (nv) {

                    //切换后都默认还原成选中课程学习
                    $scope.model.currentStudyType = 'courseStudy';
                    $scope.model.currentArea = '课程学习';
                    if (nv === 'trainingClass') {
                        $scope.model.categoryType = 'TRAINING_CLASS_GOODS';
                        angular.forEach($scope.model.studyTypeArr, function (item) {
                            if (item.type === 'afterTest') {
                                item.show = false;
                            } else {
                                item.show = true;
                            }
                        });
                    } else {
                        $scope.model.categoryType = 'COURSE_SUPERMARKET_GOODS';
                        angular.forEach($scope.model.studyTypeArr, function (item) {
                            //item.show=true;
                            if (item.type === 'exam' || item.type === 'inter' || item.type === 'excrise') {
                                item.show = false;
                            } else {
                                item.show = true;
                            }
                        });
                    }
                }
            });


            function resetSubmitData (type) {
                if (type === 'examRound') {
                    return {
                        exam: 'true',//是否开启考试
                        schemeId: null,//培训班Id
                        examLearningId: null,//考试学习Id
                        roundName: '',
                        examPaperId: '',
                        //passScore:'',
                        regularTime: 'false',//true/false 固定时间/随到随考
                        asTrainingBeginEnd: 'true',//true/false 同培训时间/自定义时间
                        examBeginTime: '',
                        examEndTime: '',
                        examTime: 60,
                        //limitHandInTime:'true',//是否限制最早交卷时间   true/false 限制/不限制
                        //firstHandInTime:'',//开考后最早交卷时间
                        limitExamTimes: 'true',//是否限制考试次数   true/false 限制/不限制
                        examTimes: 3,//考试次数
                        multiMissedGetScore: 'false',//多选漏选是否得分
                        announceResults: 'true',//是否公布成绩
                        announceResultsImmediately: 'true',//是否马上公布成绩  true/false 马上公布/限时公布
                        //deadlinePublishTime:'',//成绩公布时间
                        enablePreventCheating: 'true',//是否防作弊
                        upsetQuestions: 'true',//是否打乱试题顺序  true/false 打乱/不打乱
                        upsetAnswers: 'true',//是否打乱答案顺序  true/false 打乱/不打乱
                        examInstruction: '',//考试说明
                        showQuestionAnalysis: true//是否勾选题目解析
                    };
                }
                if (type === 'interestCourse') {
                    return {
                        haveInterest: true, // 是否有兴趣包
                        interestCourses: []
                    };
                }
                if (type === 'popupQuestionConfig') {
                    return {
                        addPopupQuestionAssess: 'true', // 是否添加弹窗题考核
                        popupQuestionAnswerCount: null, // 弹窗题 允许答题次数
                        courseRelearn: 'false' // 是否提供课程重学
                    };
                }
                if (type === 'exerciseConfig') {
                    return {
                        enable: 'true', // 是否启用练习
                        questionSource: 'QUESTION_LIBRARY', // 试题来源方式
                        sourceIds: [] // 试题来源ID集合
                    };
                }
                if (type === 'practicePaperConfig') {
                    return {
                        practicePaperId: null, // 练习卷id
                        enableAfterCourseLearning: true // 通过课程学习考核，才可参加课后测验
                    };
                }
            }


            function resetModelData (type) {
                if (type === 'trainClassTrainingConfigRequire') {
                    return {
                        passScore: null,
                        popupQuestionPercent: null,
                        examScorePercent: null,
                        trainingClassRelearn: 'true',
                        credit: null,
                        openPrint: 'true',
                        certificateIsDelivery: 'false',
                        trainingProofId: null,
                        trainingProofName: null
                    };
                }
                if (type === 'goodsTrainingConfigRequire') {
                    return {
                        trainingProofId: null, // 培训证明Id
                        trainingProofName: null, // 培训证明名称 （不需要前端传给后端）（后端传给前端显示使用）
                        certificateIsDelivery: 'false', // 证书是否提供配送  true: 提供证书配送  false:不提供证书配送
                        openPrint: 'true', // 证书是否开放打印
                        lackPracticeThenPass: true, // 课程试题数不足，当其他考核达标是否通过
                        lackPopupQuestionThenPass: true, // 课程弹窗题数不足，当其他考核达标是否通过
                        lackBothThenPass: true,//都不足
                        popupQuestionPassScore: null, // 弹窗题合格成绩
                        practicePaperPassScore: null, // 练习卷通过分数
                        courseRelearn: 'false'//是否提供课程重学
                    };
                }
            }


            $scope.model = {

                courseRulePage: {pageNo: 1, pageSize: 10},
                courseBagPage: {pageNo: 1, pageSize: 10},
                trainProofPage: {pageNo: 1, pageSize: 10},
                interPage: {pageNo: 1, pageSize: 10},
                excrisePage: {pageNo: 1, pageSize: 10},
                examPage: {pageNo: 1, pageSize: 10},
                priceCoursePage: {pageNo: 1, pageSize: 10},
                signerPriceCoursePage: {pageNo: 1, pageSize: 10},
                config: 'base',
                currentStudyType: 'courseStudy',
                currentArea: '课程学习',
                studyTypeArr: [
                    {name: '课程学习', ischecked: true, type: 'courseStudy', show: true},
                    {name: '考试', ischecked: false, type: 'exam', show: true},
                    {name: '兴趣课程', ischecked: false, type: 'inter', show: true},
                    {name: '弹窗题', ischecked: false, type: 'dialog', show: true},
                    {name: '班级练习题', ischecked: false, type: 'excrise', show: true},
                    {name: '课后测验', ischecked: false, type: 'afterTest', show: true}
                ],
                submitType: 'trainingClass',//培训方案类型
                categoryType: 'values:TRAINING_CLASS_GOODS',//学习方案形式的类目ID培训班：35f84aea57d24cc299a397c1 自主选课:35f84aea57d24cc299a397c2
                modViewList: [],
                hasEditPop: false,
                hasEditExcrise: false,
                paper: {},
                paperConfig: {
                    libraryItems: []
                },
                questionSearch: {},

                trainClassTrainingConfigRequire: resetModelData('trainClassTrainingConfigRequire'),
                goodsTrainingConfigRequire: resetModelData('goodsTrainingConfigRequire'),

                tempCoursePoolPeriodPrice: {
                    price: null, // 价格
                    poolList: [] // 涵盖的课程包集合
                },

                tempCourseIndividualPrice: {
                    price: null, // 价格
                    courseList: []
                },

                totalCoursePoolList: [],
                totalIndividualList: [],

                priceCourseBagPoolOp: 'add',
                priceCourseOp: 'add',
                lookPriceCourseBagMode: 1,//1可编辑 2查看
                lookPriceCourseMode: 1//1可编辑 2查看


            };


            //选课规则列表查询参数
            $scope.courseRule = {
                name: '',
                ruleType: '0'
            };
            //测验列表查询参数
            $scope.excrise = {};
            //考试列表查询参数
            $scope.exam = {};

            //价格课程包列表查询参数
            $scope.priceCourseBagParams = {
                poolName: ''
            };
            //独立价格课程列表查询参数
            $scope.priceCourseParams = {
                courseName: '',
                poolId: ''
            };


            $scope.node = {};


            $scope.submitData = {
                trainingSchemeName: '',//培训方案名称
                commodityImg: '@systemUrl@/images/pic.jpg',
                courseLearning: {
                    rateOfProgress: 100,
                    poolList: []
                    /*{
                     coursePackageId:"", // 课程包id
                     coursePackageName:"" // 课程包名,添加时无效，查看详情使用
                     }*/
                },

                examRound: resetSubmitData('examRound'),
                interestCourse: resetSubmitData('interestCourse'),

                popupQuestionConfig: resetSubmitData('popupQuestionConfig'),

                exerciseConfig: resetSubmitData('exerciseConfig'),

                practicePaperConfig: resetSubmitData('practicePaperConfig'),


                coursePoolPeriodPrices: [],
                courseIndividualPrices: [],

                justImportOpen: false,

                onSale: 'true',
                onSaleImmediately: 'true',
                onSaleTime: '',
                futureOffShelves: 'false',
                futureOffShelvesTime: ''


            };


            $scope.kendoPlus = {
                timeModel: null,
                timeOptions: {
                    culture: 'zh-CN',
                    format: 'yyyy-MM-dd HH:mm:ss'
                    // format : "yyyy-MM-dd 00:00:00"
                    //min: new Date()
                }
            };


            $scope.events = {


                //独立定价
                lookPriceCourse: function (item) {
                    console.log($scope.model.lookPriceCourseMode);
                    $scope.model.tempCourseIndividualPrice = angular.copy(item);
                    $scope.events.openEditCourseIndividualDialog();
                    $scope.model.lookPriceCourseMode = 2;
                },


                openEditCourseIndividualDialog: function (type) {
                    $scope.model.priceCourseOp = type;
                    $scope.model.lookPriceCourseMode = 1;
                    $scope.copyTotalIndividualList = angular.copy($scope.model.totalIndividualList);
                    $scope.courseIndividualWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-courseIndividualPrices-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },


                lookCourseDetail: function (id) {

                    var location = window.location;
                    //console.log(location);
                    window.open('/admin/'+require.unitPath+'/courseManager/view/' + id);
                },

                cacelCourseIndividualPriceTemp: function () {
                    $scope.model.totalIndividualList = $scope.copyTotalIndividualList;
                    $scope.events.cleanTempCourseIndividualPrice();
                    $scope.events.closeKendoWindow('courseIndividualWindow');
                },


                cleanTempCourseIndividualPrice: function () {
                    $scope.model.tempCourseIndividualPrice = {
                        price: null, // 价格
                        courseList: [] //
                    };
                },


                pushCourseIndividualPrice: function () {


                    if (validateIsNull($scope.model.tempCourseIndividualPrice.price)) {
                        HB_dialog.warning('警告', '请输入课程价格');
                        return false;
                    }

                    if ($scope.model.tempCourseIndividualPrice.price % 0.5 !== 0) {
                        HB_dialog.warning('警告', '课程价格必须是0.5的倍数');
                        return false;
                    }


                    if (validateIsNaN($scope.model.tempCourseIndividualPrice.price)) {
                        HB_dialog.warning('警告', '课程价格必须为数字');
                        return false;
                    }

                    if ($scope.model.tempCourseIndividualPrice.price < 0) {
                        HB_dialog.warning('警告', '课程价格不能为负数');
                        return false;
                    }

                    if ($scope.model.tempCourseIndividualPrice.courseList.length <= 0) {
                        HB_dialog.warning('警告', '请选择课程');
                        return false;
                    }


                    //如果打开方式为新增手动加一个识别的Id 如果是编辑那就只做替换操作
                    if ($scope.model.priceCourseOp === 'add') {
                        $scope.model.tempCourseIndividualPrice.uId = new Date().getTime();
                        $scope.submitData.courseIndividualPrices.push($scope.model.tempCourseIndividualPrice);
                    } else {
                        var index = findIndex($scope.submitData.courseIndividualPrices, 'uId', $scope.model.tempCourseIndividualPrice.uId);
                        if (index !== null) {
                            $scope.submitData.courseIndividualPrices[index] = $scope.model.tempCourseIndividualPrice;
                        }
                    }

                    console.log($scope.submitData.courseIndividualPrices);
                    $scope.events.closeKendoWindow('courseIndividualWindow');
                    $scope.events.cleanTempCourseIndividualPrice();
                },

                countTheHasChoseCourse: function () {

                    var totalCourse = 0, totalPeriod = 0, len = 0;

                    angular.forEach($scope.model.tempCoursePoolPeriodPrice.poolList, function (item) {
                        totalCourse = accAdd(totalCourse, item.courseCount);
                        totalPeriod = accAdd(totalPeriod, item.totalPeriod);
                        len = $scope.model.tempCoursePoolPeriodPrice.poolList.length;
                    });

                    return {
                        totalCourse: totalCourse,
                        totalPeriod: totalPeriod,
                        len: len
                    };


                },

                //编辑item
                editCourseIndividualTemp: function (item, type) {


                    if ($scope.submitData.courseLearning.poolList.length <= 0) {
                        HB_dialog.warning('警告', '请先配置课程学习下的课程包');
                        return false;
                    }

                    $scope.model.priceCourseOp = type;
                    $scope.model.lookPriceCourseMode = 1;
                    $scope.model.tempCourseIndividualPrice = angular.copy(item);
                    //$scope.copyTotalCoursePoolList=angular.copy($scope.model.totalCoursePoolList);
                    $scope.events.openEditCourseIndividualDialog();
                },


                choseSignerCourse: function (e, item) {

                    item.ischecked = true;
                    $scope.model.tempCourseIndividualPrice.courseList.push(
                        {
                            poolName: poolName,
                            name: item.poolName,
                            courseId: item.id,
                            period: 22,
                            totalPeriod: item.totalPeriod
                        }
                    );


                    $scope.model.totalIndividualList.push({
                        name: item.poolName,
                        courseId: item.id
                    });


                    signerDisabledDo();
                    console.log($scope.model.totalIndividualList);
                    console.log($scope.signerPriceCourseArr);


                },

                cancelSignerCourse: function (item) {
                    item.ischecked = false;
                    var index = findIndex($scope.model.tempCourseIndividualPrice.courseList, 'courseId', item.id);
                    var totalIndex = findIndex($scope.model.totalIndividualList, 'courseId', item.id);
                    //console.log(index);
                    console.log(totalIndex);
                    if (index !== null) {
                        $scope.model.tempCourseIndividualPrice.courseList.splice(index, 1);
                    }
                    if (totalIndex !== null) {
                        $scope.model.totalIndividualList.splice(totalIndex, 1);
                    }
                    signerDisabledDo();

                    console.log($scope.model.totalIndividualList);
                    console.log($scope.signerPriceCourseArr);

                },
                spliceSignerCourse: function (index, oItem) {
                    angular.forEach($scope.signerPriceCourseArr, function (item) {
                        if (oItem.courseId === item.id) {
                            item.ischecked = false;
                        }
                    });

                    $scope.model.tempCourseIndividualPrice.courseList.splice(index, 1);

                    var oindex = findIndex($scope.model.totalIndividualList, 'courseId', oItem.courseId);
                    if (oindex !== null) {
                        $scope.model.totalIndividualList.splice(index, 1);
                    }
                    signerDisabledDo();

                },


                lookCourseBagDetail: function (id) {

                    var location = window.location;
                    //console.log(location);
                    window.open('/admin/'+require.unitPath+'/coursePackageManager/view/' + id);
                },


                lookPriceCourseBag: function (item) {
                    console.log($scope.model.lookPriceCourseBagMode);
                    $scope.model.tempCoursePoolPeriodPrice = angular.copy(item);
                    $scope.events.openEditCoursePoolPeriodDialog();
                    $scope.model.lookPriceCourseBagMode = 2;
                },


                countTheHasChosePool: function () {

                    var totalCourse = 0, totalPeriod = 0, len = 0;

                    angular.forEach($scope.model.tempCoursePoolPeriodPrice.poolList, function (item) {
                        totalCourse = accAdd(totalCourse, item.courseCount);
                        totalPeriod = accAdd(totalPeriod, item.totalPeriod);
                        len = $scope.model.tempCoursePoolPeriodPrice.poolList.length;
                    });

                    return {
                        totalCourse: totalCourse,
                        totalPeriod: totalPeriod,
                        len: len
                    };


                },

                editPriceCourseTemp: function (item, type) {


                    if ($scope.submitData.courseLearning.poolList.length <= 0) {
                        HB_dialog.warning('警告', '请先配置课程学习下的课程包');
                        return false;
                    }

                    $scope.model.priceCourseBagPoolOp = type;
                    $scope.model.lookPriceCourseBagMode = 1;
                    $scope.model.tempCoursePoolPeriodPrice = angular.copy(item);
                    //$scope.copyTotalCoursePoolList=angular.copy($scope.model.totalCoursePoolList);
                    $scope.events.openEditCoursePoolPeriodDialog();
                },

                cacelEditPriceCourseTemp: function () {
                    $scope.model.totalCoursePoolList = $scope.copyTotalCoursePoolList;
                    $scope.events.cleanTempCoursePoolPeriodPrice();
                    $scope.events.closeKendoWindow('coursePoolPeriodWindow');
                },


                cleanTempCoursePoolPeriodPrice: function () {
                    $scope.model.tempCoursePoolPeriodPrice = {
                        price: null, // 价格
                        poolList: [] // 涵盖的课程包集合
                    };
                },


                pushCoursePoolPeriodPrice: function () {


                    if (validateIsNull($scope.model.tempCoursePoolPeriodPrice.price)) {
                        HB_dialog.warning('警告', '请输入每学时定价');
                        return false;
                    }

                    if ($scope.model.tempCoursePoolPeriodPrice.price % 0.5 !== 0) {
                        HB_dialog.warning('警告', '每学时定价必须是0.5的倍数');
                        return false;
                    }


                    if (validateIsNaN($scope.model.tempCoursePoolPeriodPrice.price)) {
                        HB_dialog.warning('警告', '每学时定价必须为数字');
                        return false;
                    }

                    if ($scope.model.tempCoursePoolPeriodPrice.price < 0) {
                        HB_dialog.warning('警告', '每学时定价不能为负数');
                        return false;
                    }

                    if ($scope.model.tempCoursePoolPeriodPrice.poolList.length <= 0) {
                        HB_dialog.warning('警告', '请选择课程包');
                        return false;
                    }


                    //如果打开方式为新增手动加一个识别的Id 如果是编辑那就只做替换操作
                    if ($scope.model.priceCourseBagPoolOp === 'add') {
                        $scope.model.tempCoursePoolPeriodPrice.uId = new Date().getTime();
                        $scope.submitData.coursePoolPeriodPrices.push($scope.model.tempCoursePoolPeriodPrice);
                    } else {
                        var index = findIndex($scope.submitData.coursePoolPeriodPrices, 'uId', $scope.model.tempCoursePoolPeriodPrice.uId);
                        if (index !== null) {
                            $scope.submitData.coursePoolPeriodPrices[index] = $scope.model.tempCoursePoolPeriodPrice;
                        }
                    }

                    console.log($scope.submitData.coursePoolPeriodPrices);
                    $scope.events.cleanTempCoursePoolPeriodPrice();
                    $scope.events.closeKendoWindow('coursePoolPeriodWindow');
                },


                chosePriceCourse: function (e, item) {
                    var index = null;
                    angular.forEach($scope.submitData.courseLearning.poolList, function (dataItem, dataIndex) {
                        if (dataItem.coursePackageId === item.id) {
                            index = dataIndex;
                        }
                    });
                    console.log(index);
                    if (index === null) {
                        HB_dialog.warning('警告', '请先把该课程包添加进课程学习');
                        return false;
                    }


                    item.ischecked = true;
                    $scope.model.tempCoursePoolPeriodPrice.poolList.push(
                        {
                            name: item.poolName,
                            coursePackageId: item.id,
                            createTime: item.createTime,
                            courseCount: item.courseCount,
                            totalPeriod: item.totalPeriod
                        }
                    );


                    $scope.model.totalCoursePoolList.push({
                        name: item.poolName,
                        coursePackageId: item.id
                    });


                    disabledDo();
                    console.log($scope.model.totalCoursePoolList);
                    console.log($scope.priceCourseArr);


                },

                cancelPriceCourse: function (item) {
                    item.ischecked = false;
                    var index = findIndex($scope.model.tempCoursePoolPeriodPrice.poolList, 'coursePackageId', item.id);
                    var totalIndex = findIndex($scope.model.totalCoursePoolList, 'coursePackageId', item.id);
                    //console.log(index);
                    console.log(totalIndex);
                    if (index !== null) {
                        $scope.model.tempCoursePoolPeriodPrice.poolList.splice(index, 1);
                    }
                    if (totalIndex !== null) {
                        $scope.model.totalCoursePoolList.splice(totalIndex, 1);
                    }
                    disabledDo();

                    console.log($scope.model.totalCoursePoolList);
                    console.log($scope.priceCourseArr);

                },
                splicePriceCourse: function (index, oItem) {
                    angular.forEach($scope.priceCourseArr, function (item) {
                        if (oItem.coursePackageId === item.id) {
                            item.ischecked = false;
                        }
                    });

                    $scope.model.tempCoursePoolPeriodPrice.poolList.splice(index, 1);

                    var oindex = findIndex($scope.model.totalCoursePoolList, 'coursePackageId', oItem.coursePackageId);
                    if (oindex !== null) {
                        $scope.model.totalCoursePoolList.splice(index, 1);
                    }
                    disabledDo();

                },


                tottleJustImportOpen: function (e) {
                    if (e.target.checked) {
                        $scope.submitData.justImportOpen = true;
                    } else {
                        $scope.submitData.justImportOpen = false;
                    }
                },

                deleteTrain: function (objName) {
                    $scope.model[objName].trainingProofId = null;
                    $scope.model[objName].trainingProofName = null;
                },
                preview: function (e, item) {
                    var popup = window.open('about:blank', '_blank');  //先发起弹窗（因为是用户触发，所以不会被拦截）
                    popup.document.write('<h2>加载中...</h2>');
                    $http.get('/web/admin/certifiedTemplate/getCertifiedPreview?type=' + item.type).success(function (data) {
                        if (data.status) {
                            var previewData = data.info.certifiedTemplatePreview,
                                url = data.info.defaultPdfPrintAddress;
                            cp.request({
                                sendData: previewData,
                                url: url,
                                containerId: 'preview'
                            }).then(function (back) {
                                console.log(back);
                                if (back.status) {
                                    var downloadUrl = downloadUrlPrefix + back.info.resourceUrl + back.info.path;
                                    console.log(downloadUrl);
                                    // window.open(downloadUrl);
                                    popup.location = downloadUrl;
                                } else {
                                    HB_dialog.warning('提示', data.messages);
                                }
                            }, function (data) {
                                HB_dialog.warning('提示', data.messages);
                            });
                        } else {
                            HB_dialog.warning('提示', data.messages);
                        }
                    });
                },


                tabConfigState: function (stateName) {
                    $scope.model.config = stateName;
                },

                tabStudyType: function (item) {
                    $scope.model.currentStudyType = item.type;
                    $scope.model.currentArea = item.name;
                },


                closeTab: function () {
                    $scope.closeTabByLwh(findTabIndex(), 'states.goodsManager');
                },


                parseNum: function (arg1, arg2) {
                    if (!arg1 || !arg2) {
                        return false;
                    }
                    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                    try {
                        m += s1.split('.')[1].length;
                    } catch (e) {
                    }
                    try {
                        m += s2.split('.')[1].length;
                    } catch (e) {
                    }
                    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
                },
                openEditCoursePoolPeriodDialog: function (type) {
                    //$scope.model.totalCoursePoolList
                    $scope.model.priceCourseBagPoolOp = type;
                    $scope.model.lookPriceCourseBagMode = 1;
                    $scope.copyTotalCoursePoolList = angular.copy($scope.model.totalCoursePoolList);
                    $scope.coursePoolPeriodWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-coursePoolPeriodPrices-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },
                closeKendoWindow: function (windowName) {
                    if ($scope[windowName]) {
                        $scope[windowName].kendoDialog.close();
                    }
                }


            };


            if ($stateParams.id) {
                $http.get('/web/admin/commodityManager/getCommodityDetail', {
                    params: {
                        commoditySkuId: $stateParams.id,
                        schemeId: $stateParams.schemeId
                    }
                }).success(function (data) {
                    $scope.submitData = data.info;
                    initParams();
                });
            }


            function initParams () {
                //培训班学习
                if ($scope.submitData.trainingSchemeType === 'TRAINING_CLASS') {
                    $scope.model.submitType = 'trainingClass';
                    $scope.model.trainClassTrainingConfigRequire = angular.copy($scope.submitData.trainingConfigRequire);
                }
                //自主选课
                if ($scope.submitData.trainingSchemeType === 'COURSE') {
                    $scope.model.submitType = 'goods';
                    $scope.model.goodsTrainingConfigRequire = angular.copy($scope.submitData.trainingConfigRequire);
                    $scope.model.goodsTrainingConfigRequire.lackBothThenPass = $scope.submitData.trainingConfigRequire.lackBothThenPass;
                    $scope.model.goodsTrainingConfigRequire.lackPracticeThenPass = $scope.submitData.trainingConfigRequire.lackPracticeThenPass;
                    $scope.model.goodsTrainingConfigRequire.lackPopupQuestionThenPass = $scope.submitData.trainingConfigRequire.lackPopupQuestionThenPass;
                    $scope.submitData.justImportOpen = false;
                    //$scope.model.trainClassTrainingConfigRequire=resetModelData('trainClassTrainingConfigRequire');
                    $scope.submitData.commodityImg = '@systemUrl@/images/pic.jpg';
                }


                //课程学习ID不为空的时候才去查询选修必修包
                //培训班的时候才去调用这个口
                if ($scope.model.submitType === 'trainingClass') {
                    if (!validateIsNull($scope.submitData.courseLearning.ruleId)) {
                        $http.get('/web/admin/commodityManager/getCourseChooseRulesInfo?ruleId=' + $scope.submitData.courseLearning.ruleId).success(function (data) {
                            $scope.model.modViewList[0] = data.info;
                            $scope.model.modViewList[0].coursePackageNames = data.info.coursePackageInfoList;
                            $scope.model.modViewList[0].ruleType = data.info.ruleType;
                            $scope.model.modViewList[0].requiredPeriod = data.info.requiredPeriod;
                            console.log($scope.model.modViewList);
                        });
                    } else {
                        $scope.model.modViewList[0] = {
                            coursePackageNames: null,
                            courseRequireContent: null,
                            courseRequireSign: null,
                            courseRequireValue: null,
                            ruleName: null
                        };
                    }
                }


                if ($scope.submitData.examRound) {
                    $scope.model.studyTypeArr[1].ischecked = true;
                    $scope.model.examPaperName = $scope.submitData.examRound.examPaperName;
                    $scope.model.examTotalScore = $scope.submitData.examRound.totalScore;
                } else {
                    $scope.submitData.examRound = resetSubmitData('examRound');
                }


                if ($scope.submitData.interestCourse) {
                    $scope.model.studyTypeArr[2].ischecked = true;
                } else {
                    $scope.submitData.interestCourse = resetSubmitData('interestCourse');
                }

                if ($scope.submitData.popupQuestionConfig) {
                    $scope.model.studyTypeArr[3].ischecked = true;
                    $scope.model.hasEditPop = true;
                } else {
                    $scope.submitData.popupQuestionConfig = resetSubmitData('popupQuestionConfig');
                }

                if ($scope.submitData.exerciseConfig) {
                    $scope.model.studyTypeArr[4].ischecked = true;
                    $scope.model.hasEditExcrise = true;
                    if (!$scope.submitData.exerciseConfig.sourceIds) {
                        $scope.submitData.exerciseConfig.sourceIds = [];
                    }
                } else {
                    $scope.submitData.exerciseConfig = resetSubmitData('exerciseConfig');
                }


                if ($scope.submitData.practicePaperConfig) {
                    $scope.model.studyTypeArr[5].ischecked = true;
                    $scope.model.practicePaperName = $scope.submitData.practicePaperConfig.practicePaperName;
                    $scope.model.practiceTotalScore = $scope.submitData.practicePaperConfig.practiceExamInfo.totalScore;
                } else {
                    $scope.submitData.practicePaperConfig = resetSubmitData('practicePaperConfig');
                }

                if ($scope.submitData.courseIndividualPrices) {


                    angular.forEach($scope.submitData.courseIndividualPrices, function (item) {

                        angular.forEach(item.courseList, function (subItem) {
                            $scope.model.totalIndividualList.push({
                                courseName: subItem.courseName,
                                courseId: subItem.courseId,
                                coursePoolId: subItem.coursePoolId

                                /*courseName:item.courseName,
                                 courseId:item.courseId, // 课程id
                                 coursePoolId:item.ccpId, // 所属课程包id
                                 poolName:item.poolName*/

                            });
                        });


                    });

                    signerDisabledDo();


                } else {
                    $scope.submitData.courseIndividualPrices = [];
                }

                if ($scope.submitData.coursePoolPeriodPrices) {
                    angular.forEach($scope.submitData.coursePoolPeriodPrices, function (item) {

                        angular.forEach(item.poolList, function (subItem) {
                            $scope.model.totalCoursePoolList.push({
                                name: subItem.name,
                                coursePackageId: subItem.coursePackageId
                            });
                        });


                    });

                    disabledDo();
                } else {
                    $scope.submitData.coursePoolPeriodPrices = [];
                }

                $scope.submitData.onSale = $scope.submitData.onSale + '';
                $scope.submitData.onSaleImmediately = $scope.submitData.onSaleImmediately + '';
                $scope.submitData.futureOffShelves = $scope.submitData.futureOffShelves + '';


            }


            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }


            function findTabIndex () {
                var index = null;
                angular.forEach($scope.HB_TAB.tabs, function (item, itemIndex) {
                    if (item.name == '发布商品') {
                        index = itemIndex;
                    }
                });
                return index;
            }


            function isFloatNumber (num) {
                var reg = /.*\..*/;
                return reg.test(num);
            }


            function findIndex (arr, property, id) {
                var index = null;
                angular.forEach(arr, function (item, itemIndex) {
                    if (item[property] === id) {
                        index = itemIndex;
                    }
                });
                return index;
            }


            function disabledDo () {
                angular.forEach($scope.priceCourseArr, function (dataItem) {
                    dataItem.disabled = false;
                    angular.forEach($scope.model.totalCoursePoolList, function (subItem) {
                        if (dataItem.id === subItem.coursePackageId) {
                            dataItem.disabled = true;
                        }
                    });
                });
            }

            function signerDisabledDo () {
                angular.forEach($scope.signerPriceCourseArr, function (dataItem) {
                    dataItem.disabled = false;
                    angular.forEach($scope.model.totalIndividualList, function (subItem) {
                        if (dataItem.courseId === subItem.courseId) {
                            dataItem.disabled = true;
                        }
                    });
                });
            }

            function accAdd (arg1, arg2) {
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split('.')[1].length;
                } catch (e) {
                    r1 = 0;
                }
                ;
                try {
                    r2 = arg2.toString().split('.')[1].length;
                } catch (e) {
                    r2 = 0;
                }
                ;
                m = Math.pow(10, Math.max(r1, r2));
                return (arg1 * m + arg2 * m) / m;
            }

        }]
    };
});