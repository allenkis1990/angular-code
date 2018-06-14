define(['@systemUrl@/js/modules/releaseGoods/controllers/releaseGoods-kendo-grid', 'cooper'], function (releaseGoodsKendoGrid, cooper) {
    'use strict';
    return {
        indexCtrl: ['$scope', 'HB_dialog', '$q', '$http', 'hbUtil', '$state', 'TabService', '$stateParams', 'releaseGoodsServices', 'easyKendoDialog', '$timeout', 'HB_notification', 'goodsManagerService', function ($scope, HB_dialog, $q, $http, hbUtil, $state, TabService, $stateParams, releaseGoodsServices, easyKendoDialog, $timeout, HB_notification, goodsManagerService) {

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


            //获取模板下载地址
            $http.get('/web/admin/asynQueImport/getDownLoadIp').success(function (data) {
                if (data.status) {
                    downloadUrlPrefix = data.info.downModelIP;
                } else {
                    HB_dialog.warning('提示', '获取下载地址失败，请重新进入界面');
                }
            });


            //如果不限制考试次数 则隐藏选择整班重学
            $scope.$watch('submitData.examRound.limitExamTimes', function (nv) {
                if (nv) {
                    if (nv === 'false') {
                        $scope.model.trainClassTrainingConfigRequire.trainingClassRelearn = 'false';
                    }
                }
            });

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

            $scope.$watch('model.uploader', function (newVal) {
                if (newVal) {
                    //$scope.submitData.commodityImg = newVal.newPath;
                    if(newVal.convertResult[0]){
                        $scope.submitData.commodityImg = newVal.convertResult[0].url;
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
                        enableAfterCourseLearning: 'true', // 通过课程学习考核，才可参加课后测验
                        addPracticePaperAssess: 'true' //是否纳入考核
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
                        //openPrint:'true',
                        //certificateIsDelivery:'false',
                        trainingProofId: null,
                        trainingProofName: null
                    };
                }
                if (type === 'goodsTrainingConfigRequire') {
                    return {
                        trainingProofId: null, // 培训证明Id
                        trainingProofName: null, // 培训证明名称 （不需要前端传给后端）（后端传给前端显示使用）
                        //certificateIsDelivery: 'false', // 证书是否提供配送  true: 提供证书配送  false:不提供证书配送
                        //openPrint: 'true', // 证书是否开放打印
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
                schemeId:$stateParams.schemeId,
                skuId: $stateParams.id,
                editRule:false,
                paymentRule:{},
                uploadHead: false,
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
                categoryType: 'TRAINING_CLASS_GOODS',//学习方案形式的类目ID培训班：TRAINING_CLASS_GOODS 自主选课:COURSE_SUPERMARKET_GOODS
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


                //检验没有弹窗题的课程
                lookHasNotPopCourseList: function () {
                    if ($scope.submitAble) {
                        return false;
                    }
                    var params = {pageNo: 1, pageSize: 10};
                    if ($scope.model.submitType === 'trainingClass') {

                        if (validateIsNull($scope.submitData.courseLearning.ruleId)) {
                            HB_dialog.warning('提示', '请先配置课程学习内容，否则无法检验是否无弹窗题');
                            return false;
                        }
                        params.ruleId = $scope.submitData.courseLearning.ruleId;

                    } else {
                        if ($scope.submitData.courseLearning.poolList.length <= 0) {
                            HB_dialog.warning('提示', '请先配置课程学习内容，否则无法检验是否无弹窗题');
                            return false;
                        }
                        params.poolId = [];
                        angular.forEach($scope.submitData.courseLearning.poolList, function (item) {
                            params.poolId.push(item.coursePackageId);
                        });
                        params.poolId = params.poolId.toString();

                    }

                    $scope.submitAble = true;
                    $http.get('/web/admin/commodityManager/findCourseWithoutPopPage', {params: params}).success(function (data) {
                        $scope.submitAble = false;
                        if (data.status) {
                            if (angular.isArray(data.info) && data.info.length > 0) {
                                var location = window.location;
                                if ($scope.model.submitType === 'trainingClass') {
                                    //console.log(location);
                                    window.open('/admin/'+require.unitPath+'/hasnotPopQuestionCourseList/' + $scope.submitData.courseLearning.ruleId + '/');
                                } else {
                                    window.open('/admin/'+require.unitPath+'/hasnotPopQuestionCourseList//' + params.poolId);
                                }


                            } else {
                                HB_dialog.warning('提示', '暂无数据');
                                return false;
                            }
                        }
                    });
                },


                //检测同一课程不同定价
                findMultiPriceCourseList: function () {

                    if ($scope.submitAble) {
                        return false;
                    }
                    if ($scope.submitData.coursePoolPeriodPrices.length <= 0) {
                        HB_dialog.warning('提示', '您还没有添加学时定价');
                        return false;
                    }
                    $scope.submitAble = true;
                    $http.post('/web/admin/commodityManager/findMultiPriceCourseList', $scope.submitData.coursePoolPeriodPrices).success(function (data) {
                        $scope.submitAble = false;
                        if (angular.isArray(data.info) && data.info.length > 0) {
                            var params = {
                                list: []
                            }, paramsStr = '';
                            angular.forEach(data.info, function (item) {
                                params.list.push({
                                    name: item.name,
                                    period: item.period,
                                    id: item.id
                                });
                            });
                            paramsStr = JSON.stringify(params);
                            console.log(paramsStr);
                            $state.go('states.differentPrice', {jsonStr: paramsStr});
                        } else {
                            HB_dialog.warning('提示', '没有查到相关数据');
                        }
                    });
                },

                //独立定价
                lookPriceCourse: function (item) {
                    console.log($scope.model.lookPriceCourseMode);
                    $scope.model.tempCourseIndividualPrice = angular.copy(item);
                    $scope.events.openEditCourseIndividualDialog();
                    $scope.model.lookPriceCourseMode = 2;
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

                    if (validateIsNull($scope.model.tempCourseIndividualPrice.saleTitle)) {
                        HB_dialog.warning('警告', '请输入销售标题');
                        return false;
                    }
                    if (validateIsNull($scope.model.tempCourseIndividualPrice.price)) {
                        HB_dialog.warning('警告', '请输入课程价格');
                        return false;
                    }

                    // if ($scope.model.tempCourseIndividualPrice.price % 0.5 !== 0) {
                    //     HB_dialog.warning('警告', '课程价格必须是0.5的倍数');
                    //     return false;
                    // }


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

                    var totalPeriod = 0, len = 0;

                    angular.forEach($scope.model.tempCourseIndividualPrice.courseList, function (item) {
                        totalPeriod = accAdd(totalPeriod, item.period);
                        len = $scope.model.tempCourseIndividualPrice.courseList.length;
                    });

                    return {
                        totalPeriod: totalPeriod,
                        len: len
                    };


                },

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

                choseSignerPriceCourse: function (e, item) {
                    item.ischecked = true;
                    $scope.model.tempCourseIndividualPrice.courseList.push(
                        {
                            courseName: item.courseName,
                            courseId: item.courseId, // 课程id
                            coursePoolId: item.ccpId, // 所属课程包id
                            period: item.period,
                            coursePoolName: item.poolName
                        }
                    );


                    $scope.model.totalIndividualList.push({
                        courseName: item.courseName,
                        courseId: item.courseId, // 课程id
                        coursePoolId: item.ccpId, // 所属课程包id
                        poolName: item.poolName
                    });


                    signerDisabledDo();

                    console.log($scope.model.totalIndividualList);
                    console.log($scope.signerPriceCourseArr);


                },


                cancelsignerPriceCourse: function (item) {
                    item.ischecked = false;
                    var index = findIndex($scope.model.tempCourseIndividualPrice.courseList, 'courseId', item.courseId);
                    var totalIndex = findIndex($scope.model.totalIndividualList, 'courseId', item.courseId);
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


                spliceSignerPriceCourse: function (index, oItem) {
                    angular.forEach($scope.signerPriceCourseArr, function (item) {
                        if (oItem.courseId === item.courseId) {
                            item.ischecked = false;
                        }
                    });

                    $scope.model.tempCourseIndividualPrice.courseList.splice(index, 1);

                    var oindex = findIndex($scope.model.totalIndividualList, 'courseId', oItem.courseId);
                    if (oindex !== null) {
                        $scope.model.totalIndividualList.splice(oindex, 1);
                    }
                    signerDisabledDo();

                },
                //独立定价


                lookCourseBagDetail: function (id) {

                    var location = window.location;
                    //console.log(location);
                    window.open('/admin/'+require.unitPath+'/coursePackageManager/view/' + id);
                },


                lookPriceCourseBag: function (item) {
                    //console.log($scope.model.lookPriceCourseBagMode);
                    $scope.model.tempCoursePoolPeriodPrice = angular.copy(item);
                    $scope.events.openEditCoursePoolPeriodDialog();
                    $scope.model.lookPriceCourseBagMode = 2;
                    console.log($scope.model.totalCoursePoolList);
                    console.log($scope.model.tempCoursePoolPeriodPrice);

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

                    if (validateIsNull($scope.model.tempCoursePoolPeriodPrice.saleTitle)) {
                        HB_dialog.warning('警告', '请输入定价销售名称');
                        return false;
                    }

                    if (validateIsNull($scope.model.tempCoursePoolPeriodPrice.price)) {
                        HB_dialog.warning('警告', '请输入每学时定价');
                        return false;
                    }

                    // if ($scope.model.tempCoursePoolPeriodPrice.price % 0.5 !== 0) {
                    //     HB_dialog.warning('警告', '每学时定价必须是0.5的倍数');
                    //     return false;
                    // }


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


                    console.log($scope.submitData.coursePoolPeriodPrices);
                    //如果打开方式为新增手动加一个识别的Id 如果是编辑那就只做替换操作
                    if ($scope.model.priceCourseBagPoolOp === 'add') {
                        $scope.model.tempCoursePoolPeriodPrice.uId = new Date().getTime();
                        $scope.submitData.coursePoolPeriodPrices.push($scope.model.tempCoursePoolPeriodPrice);
                    } else {
                        var index = findIndex($scope.submitData.coursePoolPeriodPrices, 'uId', $scope.model.tempCoursePoolPeriodPrice.uId);
                        console.log(index);
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
                        $scope.model.totalCoursePoolList.splice(oindex, 1);
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
                choseTrain: function (e, item) {

                    if ($scope.model.submitType === 'trainingClass') {
                        $scope.model.trainClassTrainingConfigRequire.trainingProofName = item.name;
                        $scope.model.trainClassTrainingConfigRequire.trainingProofId = item.id;
                    } else {
                        $scope.model.goodsTrainingConfigRequire.trainingProofName = item.name;
                        $scope.model.goodsTrainingConfigRequire.trainingProofId = item.id;
                    }

                    console.log(item);
                    $scope.events.closeKendoWindow('choseTrainProofWindow');

                },


                tabConfigState: function (stateName) {
                    $scope.model.config = stateName;
                },

                tabStudyType: function (item) {
                    $scope.model.currentStudyType = item.type;
                    $scope.model.currentArea = item.name;
                },

                choseStudyType: function (item) {
                    //编辑的时候弹窗题的打勾不能动
                    if (item.type === 'dialog') {
                        HB_dialog.warning('提示', '涉及考核变动无法选择');
                        return false;
                    }

                    //编辑的时候考试的打勾不能动只能修改
                    if (item.type === 'exam') {
                        HB_dialog.warning('提示', '涉及考核变动无法选择');
                        return false;
                    }

                    //编辑的时候课后测验的打勾不能动只能修改
                    if (item.type === 'afterTest') {
                        HB_dialog.warning('提示', '涉及考核变动无法选择');
                        return false;
                    }


                    //课程学习时不可取消的
                    if (item.type === 'courseStudy') {
                        item.ischecked = true;
                    } else {
                        item.ischecked = !item.ischecked;
                        if (item.type === 'courseStudy' && item.ischecked == false) {

                        }
                    }


                },

                opencourseRuleKendoDialog: function () {
                    $scope.choseCourseRuleWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/chose-courseRule-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },


                opencourseBagKendoDialog: function () {
                    $scope.choseCourseBagWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/chose-courseBag-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openTrainProofKendoDialog: function () {
                    $scope.choseTrainProofWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/chose-trainProof-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },


                openInterKendoDialog: function () {

                    var warn = warningStudyType(2, '兴趣课程');
                    if (!warn) {
                        return false;
                    }


                    $scope.choseInterWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/chose-inter-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openExcriseKendoDialog: function () {

                    var warn = warningStudyType(5, '课后测验');
                    if (!warn) {
                        return false;
                    }

                    $scope.choseExcriseWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/chose-excrise-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },


                openCourseRuleDialog: function () {
                    $scope.courseRuleWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/goodsManager/goodsEdit/edit-courseRule-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openExamDialog: function () {
                    $scope.examWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-exam-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openExamKendoDialog: function () {
                    $scope.choseExamWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/chose-exam-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openPopQuestionDialog: function () {

                    var warn = warningStudyType(3, '弹窗题');
                    if (!warn) {
                        return false;
                    }


                    $scope.copyPopupQuestionConfig = angular.copy($scope.submitData.popupQuestionConfig);
                    $scope.PopQuestionWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-pop-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openExcriseDialog: function () {


                    var warn = warningStudyType(4, '班级练习题');
                    if (!warn) {
                        return false;
                    }

                    $scope.copyExerciseConfig = angular.copy($scope.submitData.exerciseConfig);
                    $scope.copyLibrarys = angular.copy($scope.model.paper.randomTakeObjectConfigurationItemDtos);

                    $scope.excriseWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-excrise-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openAfterTestDialog: function () {

                    /*var warn=warningStudyType(5,'课后测验');
                    if(!warn){
                        return false;
                    }*/
                    $scope.copyPracticePaperConfig = angular.copy($scope.submitData.practicePaperConfig);
                    $scope.copyPracticeTotalScore = angular.copy($scope.model.practiceTotalScore);
                    $scope.afterTestWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-afterTest-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },


                openEditCourseBagDialog: function () {


                    $scope.copyRateOfProgress = angular.copy($scope.submitData.courseLearning.rateOfProgress);
                    $scope.copyPoolList = angular.copy($scope.submitData.courseLearning.poolList);
                    $scope.editCourseBagWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-editCourseBag-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openEditCoursePoolPeriodDialog: function (type) {
                    //$scope.model.totalCoursePoolList
                    if ($scope.submitData.courseLearning.poolList.length <= 0) {
                        HB_dialog.warning('警告', '请先配置课程学习下的课程包');
                        return false;
                    }
                    $scope.model.priceCourseBagPoolOp = type;
                    $scope.model.lookPriceCourseBagMode = 1;
                    $scope.copyTotalCoursePoolList = angular.copy($scope.model.totalCoursePoolList);
                    $scope.coursePoolPeriodWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-coursePoolPeriodPrices-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },
                openCoursePoolPeriodKendoDialog: function () {
                    $scope.choseCoursePoolPeriodWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/chose-coursePriceBag-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                openEditCourseIndividualDialog: function (type) {
                    //$scope.model.totalCoursePoolList
                    if ($scope.submitData.courseLearning.poolList.length <= 0) {
                        HB_dialog.warning('警告', '请先配置课程学习下的课程包');
                        return false;
                    }
                    $scope.model.priceCourseOp = type;
                    $scope.model.lookPriceCourseMode = 1;
                    $scope.copyTotalIndividualList = angular.copy($scope.model.totalIndividualList);
                    $scope.courseIndividualWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-courseIndividualPrices-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },
                openCourseIndividualKendoDialog: function () {
                    $scope.choseCourseIndividualWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/chose-courseSignerPrice-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },

                closeKendoWindow: function (windowName) {
                    if ($scope[windowName]) {
                        $scope[windowName].kendoDialog.close();
                    }
                },

                closeTab: function () {
                    $scope.closeTabByLwh(findTabIndex(), 'states.goodsManager');
                },

                pressEnterKey: function (e, gridName) {
                    if (e.keyCode == 13) {
                        $scope.events.MainPageQueryList(e, gridName);
                    }
                },

                MainPageQueryList: function (e, gridName, pageName) {
                    e.stopPropagation();
                    $scope.model[pageName].pageNo = 1;
                    $scope.kendoPlus[gridName].pager.page(1);
                },


                choseMod: function (e, item) {
                    console.log(item);
                    $scope.submitData.courseLearning.ruleId = item.id;
                    $scope.model.modViewList[0] = item;
                    $http.get('/web/admin/commodityManager/getCourseChooseRulesInfo?ruleId=' + item.id).success(function (data) {
                        $scope.model.modViewList[0].coursePackageNames = data.info.coursePackageInfoList;
                        $scope.model.modViewList[0].ruleType = data.info.ruleType;
                        $scope.model.modViewList[0].requiredPeriod = data.info.requiredPeriod;
                        //选择模板的时候发送查询选修包必修包请求 把里面的学分给这个对用来提交用
                        $scope.submitData.courseLearning.courseRequireCredit = data.info.requiredPeriod;
                    });
                    $scope.events.closeKendoWindow('choseCourseRuleWindow');
                },

                modEditTrueOrFalse: function (bol) {//编辑或者取消
                    //编辑状态bol是true  取消状态bol是false
                    $scope.modEditStatus = bol;
                    //$scope.rateOfProgressDisabled = true;//取消打勾操作
                    if (bol == true) {
                        $scope.events.openCourseRuleDialog();
                        //编辑的时候保存一下 已添加课程包 和 $scope.courseLearning对象 取消时候还原回去
                        $scope.copyRuleId = angular.copy($scope.submitData.courseLearning.ruleId);
                        $scope.copyModViewList = angular.copy($scope.model.modViewList[0]);
                        $scope.copyRateOfProgress = angular.copy($scope.submitData.courseLearning.rateOfProgress);
                    } else {
                        $scope.events.closeKendoWindow('courseRuleWindow');
                        $scope.submitData.courseLearning.ruleId = $scope.copyRuleId;
                        $scope.submitData.courseLearning.rateOfProgress = $scope.copyRateOfProgress;
                        $scope.model.modViewList[0] = $scope.copyModViewList;
                        $scope.submitData.courseLearning.courseRequireCredit = $scope.model.modViewList[0].requiredPeriod;
                    }
                },

                saveEditCourse: function () {
                    if (validateIsNull($scope.submitData.courseLearning.rateOfProgress)) {
                        HB_dialog.warning('警告', '请填写课程学习进度');
                        return false;
                    }
                    //alert(isFloatNumber(6.01));
                    if (isFloatNumber($scope.submitData.courseLearning.rateOfProgress) || !($scope.submitData.courseLearning.rateOfProgress > 0 && $scope.submitData.courseLearning.rateOfProgress <= 100)) {
                        HB_dialog.warning('警告', '课程进度必须为0-100的正整数（不包括0）');
                        return false;
                    }

                    if (validateIsNaN($scope.submitData.courseLearning.rateOfProgress)) {
                        HB_dialog.warning('警告', '课程进度必须为数字');
                        return false;
                    }

                    if ($scope.submitData.courseLearning.rateOfProgress < 0) {
                        HB_dialog.warning('警告', '课程进度不能为负数');
                        return false;
                    }


                    var submitParams = {
                        schemeId: $scope.submitData.courseLearning.schemeId, // 培训班ID，即方案ID:SchemeId
                        coursePoolRuleLearningId: $scope.submitData.courseLearning.coursePoolRuleLearningId, // 课程学习方式Id
                        rateOfProgress: $scope.submitData.courseLearning.rateOfProgress, // 课程进度 范围：1-100
                        courseRequireCredit: $scope.submitData.courseLearning.courseRequireCredit // 累计选课学时  "累计选课学时>=22"中的“22”
                    };

                    submit(submitParams, 'updateClassCourseLearning', function () {
                        $scope.events.closeKendoWindow('courseRuleWindow');
                    });
                },
                lookMod: function (e, item) {
                    $scope.events.closeKendoWindow('choseCourseRuleWindow');
                    $scope.events.closeKendoWindow('courseRuleWindow');
                    //$scope.modWindow.close();
                    //$scope.courseWindow.close();
                    TabService.appendNewTab('规则详情', 'states.coursePoolRuleManager.view', {ruleId: item.id}, 'states.coursePoolRuleManager', {closeAble: true});
                },

                //添加或者编辑考试配置
                addOrEditExam: function (type) {

                    /*var warn=warningStudyType(1,'考试');
                    if(!warn){
                        return false;
                    }*/
                    if (type) {
                        return false;
                    }

                    $scope.events.openExamDialog();
                    $scope.copyExamRound = angular.copy($scope.submitData.examRound);
                    $scope.copyExamPaperName = angular.copy($scope.model.examPaperName);
                    $scope.copyExamTotalScore = angular.copy($scope.model.examTotalScore);
                    if (type) {//打开场次窗口把商品名称赋值给场次名称
                        $scope.submitData.examRound.roundName = $scope.submitData.trainingSchemeName;
                    }
                },
                //取消编辑考试配置
                cancelEditExam: function () {
                    $scope.events.closeKendoWindow('examWindow');
                    $scope.submitData.examRound = $scope.copyExamRound;
                    $scope.model.examPaperName = $scope.copyExamPaperName;
                    $scope.model.examTotalScore = $scope.copyExamTotalScore;
                },

                saveEditExam: function () {

                    if (validateIsNull($scope.submitData.examRound.roundName)) {
                        HB_dialog.warning('警告', '请填写场次名称');
                        return false;
                    }

                    if (validateIsNull($scope.submitData.examRound.examPaperId)) {
                        HB_dialog.warning('警告', '请选择场次用卷');
                        return false;
                    }


                    if (validateIsNull($scope.submitData.examRound.examTime)) {
                        HB_dialog.warning('警告', '请填写考试时长');
                        return false;
                    }

                    if (validateIsNaN($scope.submitData.examRound.examTime)) {
                        HB_dialog.warning('警告', '考试时长必须为数字');
                        return false;
                    }

                    if ($scope.submitData.examRound.examTime <= 0) {
                        HB_dialog.warning('警告', '考试时长必须大于0');
                        return false;
                    }

                    if ($scope.submitData.examRound.limitExamTimes == 'true' && validateIsNull($scope.submitData.examRound.examTimes)) {
                        HB_dialog.warning('警告', '请填写限定的考试次数');
                        return false;
                    }

                    if ($scope.submitData.examRound.limitExamTimes == 'true' && validateIsNaN($scope.submitData.examRound.examTimes)) {
                        HB_dialog.warning('警告', '限定的考试次数必须为数字');
                        return false;
                    }

                    if ($scope.submitData.examRound.limitExamTimes == 'true' && $scope.submitData.examRound.examTimes <= 0) {
                        HB_dialog.warning('警告', '限定的考试次数必须大于0');
                        return false;
                    }


                    var submitParams = $scope.submitData.examRound;
                    submitParams.hasExam = true;
                    submitParams.coursePoolRuleLearningId = $scope.submitData.courseLearning.coursePoolRuleLearningId;
                    console.log(submitParams);
                    submit(submitParams, 'updateExamRound', function () {
                        //校验完成后关闭窗口
                        $scope.events.closeKendoWindow('examWindow');
                    });

                },

                toggleShowQuestionAnalysis: function (e) {
                    if (e.target.checked) {
                        $scope.submitData.examRound.showQuestionAnalysis = true;
                    } else {
                        $scope.submitData.examRound.showQuestionAnalysis = false;
                    }
                },
                toggleEnableAfterCourseLearning: function (e) {
                    if (e.target.checked) {
                        $scope.submitData.practicePaperConfig.enableAfterCourseLearning = true;
                    } else {
                        $scope.submitData.practicePaperConfig.enableAfterCourseLearning = false;
                    }
                },
                choseExam: function (e, item) {
                    console.log(item);
                    $scope.model.examPaperName = item.examPaperName;
                    $scope.submitData.examRound.examPaperId = item.examPaperId;
                    $scope.model.examTotalScore = item.totalScore;
                    $scope.events.closeKendoWindow('choseExamWindow');
                },
                choseInter: function (e, item) {

                    //findIndex
                    item.ischecked = true;
                    $scope.submitData.interestCourse.interestCourses.push(
                        {
                            coursePoolName: item.poolName,
                            coursePoolId: item.id
                        }
                    );
                },

                cancelInter: function (item) {
                    item.ischecked = false;
                    var index = findIndex($scope.submitData.interestCourse.interestCourses, 'coursePoolId', item.id);
                    console.log(index);
                    if (index !== null) {
                        $scope.submitData.interestCourse.interestCourses.splice(index, 1);
                    }
                },
                spliceInter: function (index) {
                    $scope.submitData.interestCourse.interestCourses.splice(index, 1);
                },


                choseCourseBag: function (e, item) {

                    //findIndex
                    item.ischecked = true;
                    $scope.submitData.courseLearning.poolList.push(
                        {
                            coursePackageId: item.id, // 课程包id
                            coursePackageName: item.poolName // 课程包名,添加时无效，查看详情使用
                        }
                    );
                },

                cancelCourseBag: function (item) {
                    item.ischecked = false;
                    var index = findIndex($scope.submitData.courseLearning.poolList, 'coursePackageId', item.id);
                    console.log(index);
                    if (index !== null) {
                        $scope.submitData.courseLearning.poolList.splice(index, 1);
                    }
                },
                spliceCourseBag: function (index, item) {
                    //console.log($scope.model.totalCoursePoolList,'定价里选的总共');
                    //console.log($scope.submitData.courseLearning.poolList,'选择的课程包');
                    var oIndex = findIndex($scope.model.totalCoursePoolList, 'coursePackageId', item.coursePackageId);
                    var oIndex2 = findIndex($scope.model.totalIndividualList, 'coursePoolId', item.coursePackageId);
                    if (oIndex !== null) {
                        HB_dialog.warning('警告', '该课程包已添加学习定价请先从学时定价中移除该课程包!');
                        return false;
                    }

                    else if (oIndex2 !== null) {
                        HB_dialog.warning('警告', '该课程包已添加个别课程独立定价请先从课程独立定价中移除该课程!');
                        return false;

                    } else {

                        HB_notification.confirm('确定要删除该课程包吗', function (dialog) {
                            dialog.doRightClose();
                            $scope.submitData.courseLearning.poolList.splice(index, 1);
                        });


                    }
                },


                cancelEditPop: function () {
                    $scope.events.closeKendoWindow('PopQuestionWindow');
                    $scope.submitData.popupQuestionConfig = $scope.copyPopupQuestionConfig;
                },

                deletePop: function () {

                    var warn = warningStudyType(3, '弹窗题');
                    if (!warn) {
                        return false;
                    }

                    $scope.model.hasEditPop = false;
                    $scope.submitData.popupQuestionConfig = {
                        addPopupQuestionAssess: 'true', // 是否添加弹窗题考核
                        popupQuestionAnswerCount: null, // 弹窗题 允许答题次数
                        courseRelearn: 'false' // 是否提供课程重学
                    };
                },

                saveEditPop: function () {


                    if (validateIsNull($scope.submitData.popupQuestionConfig.popupQuestionAnswerCount)) {
                        HB_dialog.warning('警告', '请填写答题次数');
                        return false;
                    }

                    if (validateIsNaN($scope.submitData.popupQuestionConfig.popupQuestionAnswerCount)) {
                        HB_dialog.warning('警告', '答题次数必须为数字');
                        return false;
                    }

                    if ($scope.submitData.popupQuestionConfig.popupQuestionAnswerCount <= 0) {
                        HB_dialog.warning('警告', '答题次数必须大于0');
                        return false;
                    }


                    if (isFloatNumber($scope.submitData.popupQuestionConfig.popupQuestionAnswerCount)) {
                        HB_dialog.warning('警告', '答题次数只能为整数');
                        return false;
                    }

                    var params, method;
                    if ($scope.model.submitType === 'trainingClass') {
                        params = {
                            schemeId: $scope.submitData.trainingSchemeId,
                            addPopupQuestionAssess: true,
                            popupQuestionAnswerCount: $scope.submitData.popupQuestionConfig.popupQuestionAnswerCount,
                            courseRelearn: $scope.submitData.popupQuestionConfig.courseRelearn
                        };
                        method = 'updateClassPopupQuestionConfig';
                    } else {
                        params = {
                            schemeId: $scope.submitData.trainingSchemeId,
                            addPopupQuestionAssess: true,
                            popupQuestionAnswerCount: $scope.submitData.popupQuestionConfig.popupQuestionAnswerCount
                        };
                        method = 'updateCoursePopupQuestionConfig';
                    }

                    $http.post('/web/admin/commodityManager/' + method, params).success(function (data) {
                        if (data.status) {
                            console.log($scope.submitData.popupQuestionConfig);
                            $scope.model.hasEditPop = true;
                            $scope.events.closeKendoWindow('PopQuestionWindow');
                            HB_dialog.success('提示', data.info);
                        } else {
                            HB_dialog.error('提示', data.info);
                        }
                    });

                },

                openSmartPaperLibraryTree: function (e) {
                    e.stopPropagation();
                    $scope.smartPaperLibraryTreeShow = !$scope.smartPaperLibraryTreeShow;
                },
                clickDocument: function () {
                    $scope.smartPaperLibraryTreeShow = false;
                },


                saveExcrise: function () {


                    if ($scope.submitData.exerciseConfig.questionSource === 'QUESTION_LIBRARY' && $scope.submitData.exerciseConfig.sourceIds.length <= 0) {
                        HB_dialog.warning('警告', '练习题来源于题库的时候必须至少选择一个题库');
                        return false;
                    }


                    $scope.submitAble = true;
                    $http.post('/web/admin/commodityManager/updateExerciseConfig', {
                        schemeId: $scope.submitData.trainingSchemeId,
                        enable: 'true', // 是否启用练习
                        questionSource: $scope.submitData.exerciseConfig.questionSource, // 试题来源方式
                        sourceIds: $scope.submitData.exerciseConfig.sourceIds // 试题来源ID集合
                    }).then(function (data) {
                        $scope.submitAble = false;
                        if (data.data.status) {
                            HB_notification.showTip(data.data.info, 'success');
                            $scope.model.hasEditExcrise = true;
                            $scope.events.closeKendoWindow('excriseWindow');

                        } else {
                            HB_notification.showTip(data.data.info, 'error');
                        }

                    });


                    /*if($scope.submitData.exerciseConfig.sourceIds.length){

                     }*/
                    console.log($scope.submitData.exerciseConfig);
                },

                cacelExcrise: function () {
                    $scope.submitData.exerciseConfig = $scope.copyExerciseConfig;
                    $scope.model.paper.randomTakeObjectConfigurationItemDtos = $scope.copyLibrarys;
                    //$scope.copyLibrarys=angular.copy($scope.model.paper.randomTakeObjectConfigurationItemDtos);
                    $scope.events.closeKendoWindow('excriseWindow');
                    console.log($scope.submitData.exerciseConfig);
                },
                deleteExcrise: function () {
                    if ($scope.submitAble) {
                        return false;
                    }
                    var warn = warningStudyType(4, '班级练习题');
                    if (!warn) {
                        return false;
                    }

                    HB_notification.confirm('确认删除练习题配置吗？', function (dialog) {

                        return $http.post('/web/admin/commodityManager/updateExerciseConfig', {
                            schemeId: $scope.submitData.trainingSchemeId,
                            enable: 'false' // 是否启用练习

                        }).then(function (data) {
                            dialog.doRightClose();
                            if (data.data.status) {
                                HB_notification.showTip(data.data.info, 'success');

                                $scope.model.hasEditExcrise = false;
                                $scope.model.paper.randomTakeObjectConfigurationItemDtos = [];
                                $scope.submitData.exerciseConfig = {
                                    enable: 'true', // 是否启用练习
                                    questionSource: 'QUESTION_LIBRARY', // 试题来源方式
                                    sourceIds: [] // 试题来源ID集合
                                };
                                $scope.model.studyTypeArr[4].ischecked = false;

                            } else {
                                HB_notification.showTip(data.data.info, 'error');
                            }

                        });


                    });


                },

                getQuestionOrgInfo: function (dataItem) {
                    console.log(dataItem);
                    $scope.model.libraryName = dataItem.name;
                    $scope.model.questionSearch.libraryId = dataItem.id;
                    $scope.libraryTreeShow = false;
                },

                choseAfterTest: function (e, item) {
                    $scope.submitData.practicePaperConfig.practicePaperId = item.practiceId;
                    $scope.model.practicePaperName = item.name;
                    $scope.model.practiceTotalScore = item.totalScore;
                    $scope.model.limitPracticeNum = item.limitPracticeNum;
                    $scope.events.closeKendoWindow('choseExcriseWindow');
                },

                deleteAfterTest: function () {
                    var warn = warningStudyType(5, '课后测验');
                    if (!warn) {
                        return false;
                    }
                    $scope.submitData.practicePaperConfig.practicePaperId = null;
                    $scope.model.practiceTotalScore = null;
                    $scope.model.practicePaperName = '';
                    $scope.model.limitPracticeNum = false;
                },

                cacelEditPractice: function () {
                    //$scope.copyPracticePaperConfig=angular.copy($scope.submitData.practicePaperConfig);
                    $scope.submitData.practicePaperConfig = $scope.copyPracticePaperConfig;
                    $scope.model.practiceTotalScore = $scope.copyPracticeTotalScore;
                    $scope.events.closeKendoWindow('afterTestWindow');
                },

                cacelCourseBag: function () {
                    $scope.events.closeKendoWindow('editCourseBagWindow');
                    $scope.submitData.courseLearning.rateOfProgress = $scope.copyRateOfProgress;
                    $scope.submitData.courseLearning.poolList = $scope.copyPoolList;
                },

                saveEditCourseBag: function () {
                    if (validateIsNull($scope.submitData.courseLearning.rateOfProgress)) {
                        HB_dialog.warning('警告', '请填写课程学习进度');
                        return false;
                    }
                    //alert(isFloatNumber(6.01));
                    if (isFloatNumber($scope.submitData.courseLearning.rateOfProgress) || !($scope.submitData.courseLearning.rateOfProgress > 0 && $scope.submitData.courseLearning.rateOfProgress <= 100)) {
                        HB_dialog.warning('警告', '课程进度必须为0-100的正整数（不包括0）');
                        return false;
                    }

                    if (validateIsNaN($scope.submitData.courseLearning.rateOfProgress)) {
                        HB_dialog.warning('警告', '课程进度必须为数字');
                        return false;
                    }

                    if ($scope.submitData.courseLearning.rateOfProgress < 0) {
                        HB_dialog.warning('警告', '课程进度不能为负数');
                        return false;
                    }


                    var submitParams = $scope.submitData.courseLearning;

                    submit(submitParams, 'updateCourseCourseLearning', function () {
                        $scope.events.closeKendoWindow('editCourseBagWindow');
                    });

                },

                toggleLack: function (e, name) {
                    if (e.target.checked) {
                        $scope.model.goodsTrainingConfigRequire[name] = true;
                    } else {
                        $scope.model.goodsTrainingConfigRequire[name] = false;
                    }
                    console.log($scope.model.goodsTrainingConfigRequire[name]);
                },


                isConfigExam: function () {
                    if (validateIsNull($scope.submitData.examRound.examPaperId)) {
                        $scope.model.trainClassTrainingConfigRequire.passScore = null;
                        HB_dialog.warning('警告', '请先配置考试');
                        return false;
                    }
                },


                testPassScore: function (e) {


                    //单考试
                    if ($scope.model.studyTypeArr[1].ischecked && !$scope.model.studyTypeArr[3].ischecked) {
                        if (validateIsNull($scope.submitData.examRound.examPaperId)) {
                            $scope.model.trainClassTrainingConfigRequire.passScore = null;
                            HB_dialog.warning('警告', '请先配置考试');
                            return false;
                        }
                    }

                    if ($scope.model.trainClassTrainingConfigRequire.passScore % 0.5 !== 0) {
                        HB_dialog.warning('警告', '输入的数字必须是0.5的倍数');
                        $scope.model.trainClassTrainingConfigRequire.passScore = null;
                        return false;
                    }


                    if (validateIsNaN($scope.model.trainClassTrainingConfigRequire.passScore)) {
                        HB_dialog.warning('警告', '考核成绩必须为数字');
                        $scope.model.trainClassTrainingConfigRequire.passScore = null;
                        return false;
                    }

                    if (!validateIsNull($scope.model.trainClassTrainingConfigRequire.passScore)) {
                        if ($scope.model.trainClassTrainingConfigRequire.passScore <= 0) {
                            HB_dialog.warning('警告', '考核成绩必须大于0');
                            $scope.model.trainClassTrainingConfigRequire.passScore = null;
                            return false;
                        }
                    }
                    //console.log($scope.model.trainClassTrainingConfigRequire.passScore % 0.5);
                },

                testNum: function (e, name1, name2) {
                    if ($scope.model[name1][name2] % 0.5 !== 0) {
                        HB_dialog.warning('警告', '输入的数字必须是0.5的倍数');
                        $scope.model[name1][name2] = null;
                        return false;
                    }


                    if (validateIsNaN($scope.model[name1][name2])) {
                        HB_dialog.warning('警告', '输入的必须为数字');
                        $scope.model[name1][name2] = null;
                        return false;
                    }

                    if (!validateIsNull($scope.model[name1][name2])) {
                        if ($scope.model[name1][name2] <= 0) {
                            HB_dialog.warning('警告', '输入的数字必须大于0');
                            $scope.model[name1][name2] = null;
                            return false;
                        }
                    }

                    if ($scope.model[name1][name2] > 100) {
                        HB_dialog.warning('警告', '输入的百分比必须小于100');
                        $scope.model[name1][name2] = null;
                        return false;
                    }

                    //console.log($scope.model.trainClassTrainingConfigRequire.passScore % 0.5);
                },


                testPracticeScore: function () {
                    if (validateIsNull($scope.submitData.practicePaperConfig.practicePaperId)) {
                        HB_dialog.warning('警告', '请配置课后测验');
                        $scope.model.goodsTrainingConfigRequire.practicePaperPassScore = null;
                        return false;
                    }
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


                submit: function () {

                    if ($scope.model.submitType === 'trainingClass') {


                        if ($scope.submitData.commodityImg === '@systemUrl@/images/pic.jpg') {
                            HB_dialog.warning('警告', '请上传培训班图片');
                            return false;
                        }

                        console.log(validateReleaseBas('培训班'));
                        if (validateReleaseBas('培训班') === false) {
                            return false;
                        }


                        if (validateIsNull($scope.submitData.courseLearning.ruleId)) {
                            HB_dialog.warning('警告', '请配置课程学习');
                            return false;
                        }

                        if (validateIsNull($scope.submitData.examRound.examPaperId) && $scope.model.studyTypeArr[1].ischecked) {
                            HB_dialog.warning('警告', '请配置考试');
                            return false;
                        }

                        if ($scope.submitData.interestCourse.interestCourses.length <= 0 && $scope.model.studyTypeArr[2].ischecked) {
                            HB_dialog.warning('警告', '请配置兴趣课程');
                            return false;
                        }

                        if (validateIsNull($scope.submitData.popupQuestionConfig.popupQuestionAnswerCount) && $scope.model.studyTypeArr[3].ischecked) {
                            HB_dialog.warning('警告', '请配置弹窗题');
                            return false;
                        }

                        if (!$scope.model.hasEditExcrise && $scope.model.studyTypeArr[4].ischecked) {
                            HB_dialog.warning('警告', '请配置班级练习题');
                            return false;
                        }


                        //只选考试
                        if (($scope.model.studyTypeArr[1].ischecked && !$scope.model.studyTypeArr[3].ischecked)) {


                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.passScore)) {
                                HB_dialog.warning('警告', '请填写考核成绩');
                                return false;
                            }
                            //console.log($scope.model.trainClassTrainingConfigRequire.passScore);
                            //console.log($scope.model.examTotalScore);
                            if ($scope.model.trainClassTrainingConfigRequire.passScore > $scope.model.examTotalScore) {
                                HB_dialog.warning('警告', '考核成绩不能大于总分');
                                return false;
                            }


                        }


                        //只选弹窗
                        if ((!$scope.model.studyTypeArr[1].ischecked && $scope.model.studyTypeArr[3].ischecked)) {


                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.passScore)) {
                                HB_dialog.warning('警告', '请填写考核成绩');
                                return false;
                            }


                            if ($scope.model.trainClassTrainingConfigRequire.passScore > 100) {
                                HB_dialog.warning('警告', '考核成绩不能大于总分');
                                return false;
                            }


                        }


                        //弹窗和考试都选
                        if ($scope.model.studyTypeArr[1].ischecked && $scope.model.studyTypeArr[3].ischecked) {

                            //考核成绩
                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.passScore)) {
                                HB_dialog.warning('警告', '请填写考核成绩');
                                return false;
                            }


                            if ($scope.model.trainClassTrainingConfigRequire.passScore > 100) {
                                HB_dialog.warning('警告', '考核成绩不能大于总分');
                                return false;
                            }

                            //弹窗占比
                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.popupQuestionPercent)) {
                                HB_dialog.warning('警告', '请填写弹窗题成绩占比');
                                return false;
                            }


                            //考试占比
                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.examScorePercent)) {
                                HB_dialog.warning('警告', '请填写考试成绩占比');
                                return false;
                            }

                        }


                        if (validateIsNull($scope.model.trainClassTrainingConfigRequire.credit)) {
                            HB_dialog.warning('警告', '请填写继续教育年度下学分');
                            return false;
                        }

                        if (validateIsNaN($scope.model.trainClassTrainingConfigRequire.credit)) {
                            HB_dialog.warning('警告', '继续教育年度下学分必须为数字');
                            return false;
                        }

                        if ($scope.model.trainClassTrainingConfigRequire.credit <= 0) {
                            HB_dialog.warning('警告', '继续教育年度下学分必须大于0');
                            return false;
                        }


                        if (validateSaleCommon() === false) {
                            return false;
                        }


                        if (validateIsNull($scope.submitData.price)) {
                            HB_dialog.warning('警告', '请输入培训班价格');
                            return false;
                        }

                        // if ($scope.submitData.price % 0.5 !== 0) {
                        //     HB_dialog.warning('警告', '培训班价格必须是0.5的倍数');
                        //     return false;
                        // }


                        if (validateIsNaN($scope.submitData.price)) {
                            HB_dialog.warning('警告', '培训班价格必须为数字');
                            return false;
                        }

                        if ($scope.submitData.price < 0) {
                            HB_dialog.warning('警告', '培训班价格不能为负数');
                            return false;
                        }

                        var submitParams = {

                            trainingSchemeName: $scope.submitData.trainingSchemeName,
                            trainingBeginTime: $scope.submitData.trainingBeginTime,
                            trainingEndTime: $scope.submitData.trainingEndTime,
                            skuPropertyList: $scope.skuParams.skuPropertyList,
                            courseLearning: $scope.submitData.courseLearning,
                            examRound: !$scope.model.studyTypeArr[1].ischecked ? undefined : $scope.submitData.examRound,
                            interestCourse: !$scope.model.studyTypeArr[2].ischecked ? undefined : $scope.submitData.interestCourse,
                            popupQuestionConfig: !$scope.model.studyTypeArr[3].ischecked ? undefined : $scope.submitData.popupQuestionConfig,
                            exerciseConfig: !$scope.model.studyTypeArr[4].ischecked ? undefined : $scope.submitData.exerciseConfig,
                            trainingConfigRequire: $scope.model.trainClassTrainingConfigRequire,
                            commodityImg: $scope.submitData.commodityImg,
                            justImportOpen: $scope.submitData.justImportOpen,
                            onSale: $scope.submitData.onSale,
                            onSaleImmediately: $scope.submitData.onSaleImmediately,
                            onSaleTime: $scope.submitData.onSaleTime,
                            futureOffShelves: $scope.submitData.futureOffShelves,
                            futureOffShelvesTime: $scope.submitData.futureOffShelvesTime,
                            price: $scope.submitData.price

                        };

                        submit(submitParams, 'saveClassTrainingScheme');

                    } else {


                        if (validateReleaseBas('培训方案') === false) {
                            return false;
                        }


                        if ($scope.submitData.courseLearning.poolList.length <= 0) {
                            HB_dialog.warning('警告', '请配置课程学习中的弹窗题');
                            return false;
                        }


                        if (validateIsNull($scope.submitData.popupQuestionConfig.popupQuestionAnswerCount) && $scope.model.studyTypeArr[3].ischecked) {
                            HB_dialog.warning('警告', '请配置弹窗题');
                            return false;
                        }

                        if (validateIsNull($scope.submitData.practicePaperConfig.practicePaperId) && $scope.model.studyTypeArr[5].ischecked) {
                            HB_dialog.warning('警告', '请配置课后测验');
                            return false;
                        }


                        //单测验
                        if ($scope.model.studyTypeArr[5].ischecked && !$scope.model.studyTypeArr[3].ischecked) {

                            if (validateIsNull($scope.model.goodsTrainingConfigRequire.practicePaperPassScore)) {
                                HB_dialog.warning('警告', '请填写课程课后测验成绩');
                                return false;
                            }

                            if (validateIsNaN($scope.model.goodsTrainingConfigRequire.practicePaperPassScore)) {
                                HB_dialog.warning('警告', '课程课后测验成绩必须为数字');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.practicePaperPassScore <= 0) {
                                HB_dialog.warning('警告', '课程课后测验成绩必须大于0');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.practicePaperPassScore > $scope.model.practiceTotalScore) {
                                HB_dialog.warning('警告', '课程课后测验成绩不能大于测验总分');
                                return false;
                            }

                        }


                        //单弹窗题
                        if (!$scope.model.studyTypeArr[5].ischecked && $scope.model.studyTypeArr[3].ischecked) {

                            if (validateIsNull($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore)) {
                                HB_dialog.warning('警告', '请填写课程弹窗题成绩');
                                return false;
                            }

                            if (validateIsNaN($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore)) {
                                HB_dialog.warning('警告', '课程弹窗题成绩必须为数字');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore <= 0) {
                                HB_dialog.warning('警告', '课程弹窗题成绩必须大于0');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore > 100) {
                                HB_dialog.warning('警告', '课程弹窗题成绩不能大于100分');
                                return false;
                            }

                        }


                        //弹窗+测验
                        if ($scope.model.studyTypeArr[5].ischecked && $scope.model.studyTypeArr[3].ischecked) {

                            if (validateIsNull($scope.model.goodsTrainingConfigRequire.practicePaperPassScore)) {
                                HB_dialog.warning('警告', '请填写课程课后测验成绩');
                                return false;
                            }

                            if (validateIsNaN($scope.model.goodsTrainingConfigRequire.practicePaperPassScore)) {
                                HB_dialog.warning('警告', '课程课后测验成绩必须为数字');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.practicePaperPassScore <= 0) {
                                HB_dialog.warning('警告', '课程课后测验成绩必须大于0');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.practicePaperPassScore > $scope.model.practiceTotalScore) {
                                HB_dialog.warning('警告', '课程课后测验成绩不能大于测验总分');
                                return false;
                            }


                            if (validateIsNull($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore)) {
                                HB_dialog.warning('警告', '请填写课程弹窗题成绩');
                                return false;
                            }

                            if (validateIsNaN($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore)) {
                                HB_dialog.warning('警告', '课程弹窗题成绩必须为数字');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore <= 0) {
                                HB_dialog.warning('警告', '课程弹窗题成绩必须大于0');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore > 100) {
                                HB_dialog.warning('警告', '课程弹窗题成绩不能大于100分');
                                return false;
                            }


                        }


                        if (validateSaleCommon() === false) {
                            return false;
                        }

                        if ($scope.submitData.coursePoolPeriodPrices.length <= 0) {
                            HB_dialog.warning('警告', '请配置每学时定价');
                            return false;
                        }


                        var submitParams = {

                            trainingSchemeName: $scope.submitData.trainingSchemeName,
                            trainingBeginTime: $scope.submitData.trainingBeginTime,
                            trainingEndTime: $scope.submitData.trainingEndTime,
                            skuPropertyList: $scope.skuParams.skuPropertyList,
                            courseLearning: $scope.submitData.courseLearning,
                            practicePaperConfig: $scope.submitData.practicePaperConfig,
                            popupQuestionConfig: !$scope.model.studyTypeArr[3].ischecked ? undefined : $scope.submitData.popupQuestionConfig,
                            trainingConfigRequire: $scope.model.goodsTrainingConfigRequire,
                            onSale: $scope.submitData.onSale,
                            onSaleImmediately: $scope.submitData.onSaleImmediately,
                            onSaleTime: $scope.submitData.onSaleTime,
                            futureOffShelves: $scope.submitData.futureOffShelves,
                            futureOffShelvesTime: $scope.submitData.futureOffShelvesTime,
                            coursePoolPeriodPrices: $scope.submitData.coursePoolPeriodPrices,
                            courseIndividualPrices: $scope.submitData.courseIndividualPrices.length > 0 ? $scope.submitData.courseIndividualPrices : undefined

                        };

                        submit(submitParams, 'saveCourseTrainingScheme');

                    }


                },

                submitGoodsBase: function () {
                    if ($scope.model.submitType === 'trainingClass') {
                        if ($scope.submitData.commodityImg === '@systemUrl@/images/pic.jpg') {
                            HB_dialog.warning('警告', '请上传培训班图片');
                            return false;
                        }

                        console.log(validateReleaseBas('培训班'));
                        if (validateReleaseBas('培训班') === false) {
                            return false;
                        }

                        var submitParams = {
                            trainingSchemeName: $scope.submitData.trainingSchemeName,
                            trainingBeginTime: $scope.submitData.trainingBeginTime,
                            trainingEndTime: $scope.submitData.trainingEndTime,
                            skuPropertyList: $scope.skuParams.skuPropertyList,
                            commodityImg: $scope.submitData.commodityImg,
                            trainingSchemeId: $scope.submitData.trainingSchemeId,
                            trainingSchemeStatus: $scope.submitData.trainingSchemeStatus
                        };

                        submit(submitParams, 'updateClassTrainingScheme');


                    } else {
                        if (validateReleaseBas('培训方案') === false) {
                            return false;
                        }

                        var submitParams = {
                            trainingSchemeName: $scope.submitData.trainingSchemeName,
                            trainingBeginTime: $scope.submitData.trainingBeginTime,
                            trainingEndTime: $scope.submitData.trainingEndTime,
                            skuPropertyList: $scope.skuParams.skuPropertyList,
                            trainingSchemeId: $scope.submitData.trainingSchemeId,
                            trainingSchemeStatus: $scope.submitData.trainingSchemeStatus
                        };

                        submit(submitParams, 'updateCourseTrainingScheme');


                    }
                },
                editInter: function () {
                    var warn = warningStudyType(2, '兴趣课程');
                    if (!warn) {
                        return false;
                    }
                    $scope.copyInterestCourses = angular.copy($scope.submitData.interestCourse.interestCourses);
                    $scope.editInterWindow = easyKendoDialog.content({
                        templateUrl: '@systemUrl@/views/releaseGoods/edit-inter-dialog.html',
                        width: 800,
                        title: false
                    }, $scope);
                },
                deleteInter: function () {
                    if ($scope.submitAble) {
                        return false;
                    }
                    var warn = warningStudyType(2, '兴趣课程');
                    if (!warn) {
                        return false;
                    }

                    HB_notification.confirm('确认删除兴趣课程吗？', function (dialog) {

                        return $http.post('/web/admin/commodityManager/updateInterestCourse', {
                            schemeId: $scope.submitData.trainingSchemeId,
                            enable: 'false' // 是否启用兴趣课程

                        }).then(function (data) {
                            dialog.doRightClose();
                            if (data.data.status) {
                                HB_notification.showTip(data.data.info, 'success');

                                $scope.submitData.interestCourse = resetSubmitData('interestCourse');
                                $scope.model.studyTypeArr[2].ischecked = false;

                            } else {
                                HB_notification.showTip(data.data.info, 'error');
                            }

                        });


                    });
                },

                cancelEditInter: function () {
                    $scope.submitData.interestCourse.interestCourses = $scope.copyInterestCourses;
                    $scope.events.closeKendoWindow('editInterWindow');
                },

                submitInter: function () {
                    /*if($scope.submitData.interestCourse.interestCourses.length<=0){
                        HB_dialog.warning('警告', '请选择兴趣课程包');
                        return false;
                    }*/

                    var submitParams = {
                        enable: $scope.submitData.interestCourse.interestCourses.length > 0 ? true : false,
                        schemeId: $scope.submitData.trainingSchemeId, // 方案ID:SchemeId
                        interestCourses: $scope.submitData.interestCourse.interestCourses.length > 0 ? $scope.submitData.interestCourse.interestCourses : undefined
                    };

                    submit(submitParams, 'updateInterestCourse', function () {
                        $scope.events.closeKendoWindow('editInterWindow');
                        $scope.events.closeKendoWindow('choseInterWindow');
                        if (!submitParams.interestCourses) {
                            $scope.model.studyTypeArr[2].ischecked = false;
                        }
                    });


                },

                submitPractice: function () {
                    var submitParams = $scope.submitData.practicePaperConfig;
                    submit(submitParams, 'updatePracticePaperConfig', function () {
                        $scope.events.closeKendoWindow('afterTestWindow');
                    });
                },

                submitTrainingConfigRequire: function () {
                    if ($scope.model.submitType === 'trainingClass') {



                        //只选考试
                        if (($scope.model.studyTypeArr[1].ischecked && !$scope.model.studyTypeArr[3].ischecked)) {


                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.passScore)) {
                                HB_dialog.warning('警告', '请填写考核成绩');
                                return false;
                            }
                            //console.log($scope.model.trainClassTrainingConfigRequire.passScore);
                            //console.log($scope.model.examTotalScore);
                            if ($scope.model.trainClassTrainingConfigRequire.passScore > $scope.model.examTotalScore) {
                                HB_dialog.warning('警告', '考核成绩不能大于总分');
                                return false;
                            }


                        }


                        //只选弹窗
                        if ((!$scope.model.studyTypeArr[1].ischecked && $scope.model.studyTypeArr[3].ischecked)) {


                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.passScore)) {
                                HB_dialog.warning('警告', '请填写考核成绩');
                                return false;
                            }


                            if ($scope.model.trainClassTrainingConfigRequire.passScore > 100) {
                                HB_dialog.warning('警告', '考核成绩不能大于总分');
                                return false;
                            }


                        }


                        //弹窗和考试都选
                        if ($scope.model.studyTypeArr[1].ischecked && $scope.model.studyTypeArr[3].ischecked) {

                            //考核成绩
                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.passScore)) {
                                HB_dialog.warning('警告', '请填写考核成绩');
                                return false;
                            }


                            if ($scope.model.trainClassTrainingConfigRequire.passScore > 100) {
                                HB_dialog.warning('警告', '考核成绩不能大于总分');
                                return false;
                            }

                            //弹窗占比
                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.popupQuestionPercent)) {
                                HB_dialog.warning('警告', '请填写弹窗题成绩占比');
                                return false;
                            }


                            //考试占比
                            if (validateIsNull($scope.model.trainClassTrainingConfigRequire.examScorePercent)) {
                                HB_dialog.warning('警告', '请填写考试成绩占比');
                                return false;
                            }

                        }


                        if (validateIsNull($scope.model.trainClassTrainingConfigRequire.credit)) {
                            HB_dialog.warning('警告', '请填写继续教育年度下学分');
                            return false;
                        }

                        if (validateIsNaN($scope.model.trainClassTrainingConfigRequire.credit)) {
                            HB_dialog.warning('警告', '继续教育年度下学分必须为数字');
                            return false;
                        }

                        if ($scope.model.trainClassTrainingConfigRequire.credit <= 0) {
                            HB_dialog.warning('警告', '继续教育年度下学分必须大于0');
                            return false;
                        }


                        var submitParams = $scope.model.trainClassTrainingConfigRequire;
                        submit(submitParams, 'updateClassTrainingConfigRequire');
                    } else {

                        //单测验
                        if ($scope.model.studyTypeArr[5].ischecked && !$scope.model.studyTypeArr[3].ischecked) {

                            if (validateIsNull($scope.model.goodsTrainingConfigRequire.practicePaperPassScore)) {
                                HB_dialog.warning('警告', '请填写课程课后测验成绩');
                                return false;
                            }

                            if (validateIsNaN($scope.model.goodsTrainingConfigRequire.practicePaperPassScore)) {
                                HB_dialog.warning('警告', '课程课后测验成绩必须为数字');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.practicePaperPassScore <= 0) {
                                HB_dialog.warning('警告', '课程课后测验成绩必须大于0');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.practicePaperPassScore > $scope.model.practiceTotalScore) {
                                HB_dialog.warning('警告', '课程课后测验成绩不能大于测验总分');
                                return false;
                            }

                        }


                        //单弹窗题
                        if (!$scope.model.studyTypeArr[5].ischecked && $scope.model.studyTypeArr[3].ischecked) {

                            if (validateIsNull($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore)) {
                                HB_dialog.warning('警告', '请填写课程弹窗题成绩');
                                return false;
                            }

                            if (validateIsNaN($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore)) {
                                HB_dialog.warning('警告', '课程弹窗题成绩必须为数字');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore <= 0) {
                                HB_dialog.warning('警告', '课程弹窗题成绩必须大于0');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore > 100) {
                                HB_dialog.warning('警告', '课程弹窗题成绩不能大于100分');
                                return false;
                            }

                        }


                        //弹窗+测验
                        if ($scope.model.studyTypeArr[5].ischecked && $scope.model.studyTypeArr[3].ischecked) {

                            if (validateIsNull($scope.model.goodsTrainingConfigRequire.practicePaperPassScore)) {
                                HB_dialog.warning('警告', '请填写课程课后测验成绩');
                                return false;
                            }

                            if (validateIsNaN($scope.model.goodsTrainingConfigRequire.practicePaperPassScore)) {
                                HB_dialog.warning('警告', '课程课后测验成绩必须为数字');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.practicePaperPassScore <= 0) {
                                HB_dialog.warning('警告', '课程课后测验成绩必须大于0');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.practicePaperPassScore > $scope.model.practiceTotalScore) {
                                HB_dialog.warning('警告', '课程课后测验成绩不能大于测验总分');
                                return false;
                            }


                            if (validateIsNull($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore)) {
                                HB_dialog.warning('警告', '请填写课程弹窗题成绩');
                                return false;
                            }

                            if (validateIsNaN($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore)) {
                                HB_dialog.warning('警告', '课程弹窗题成绩必须为数字');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore <= 0) {
                                HB_dialog.warning('警告', '课程弹窗题成绩必须大于0');
                                return false;
                            }

                            if ($scope.model.goodsTrainingConfigRequire.popupQuestionPassScore > 100) {
                                HB_dialog.warning('警告', '课程弹窗题成绩不能大于100分');
                                return false;
                            }


                        }

                        var submitParams = $scope.model.goodsTrainingConfigRequire;
                        submit(submitParams, 'updateCourseTrainingConfigRequire');
                    }
                },

                submitSale: function () {
                    //console.log($scope.submitData.courseIndividualPrices);
                    if ($scope.model.submitType === 'trainingClass') {
                        if (validateSaleCommon() === false) {
                            return false;
                        }


                        if (validateIsNull($scope.submitData.price)) {
                            HB_dialog.warning('警告', '请输入培训班价格');
                            return false;
                        }

                        // if ($scope.submitData.price % 0.5 !== 0) {
                        //     HB_dialog.warning('警告', '培训班价格必须是0.5的倍数');
                        //     return false;
                        // }


                        if (validateIsNaN($scope.submitData.price)) {
                            HB_dialog.warning('警告', '培训班价格必须为数字');
                            return false;
                        }

                        if ($scope.submitData.price < 0) {
                            HB_dialog.warning('警告', '培训班价格不能为负数');
                            return false;
                        }


                        var submitParams = {
                            schemeId: $scope.submitData.trainingSchemeId, // 培训方案id
                            onSale: $scope.submitData.onSale, // 是否上架
                            onSaleImmediately: $scope.submitData.onSaleImmediately, // 是否立即上架
                            onSaleTime: $scope.submitData.onSaleTime, // 商品上架时间 yyyy-MM-dd HH:mm:ss
                            futureOffShelves: $scope.submitData.futureOffShelves, // 是否预下架
                            futureOffShelvesTime: $scope.submitData.futureOffShelvesTime, // 商品预下架时间 yyyy-MM-dd HH:mm:ss
                            justImportOpen: $scope.submitData.justImportOpen, // 是否仅支持导入开通
                            price: $scope.submitData.price // 商品价格
                        };

                        submit(submitParams, 'updateClassCommodityInfo');


                    } else {
                        if (validateSaleCommon() === false) {
                            return false;
                        }

                        if ($scope.submitData.coursePoolPeriodPrices.length <= 0) {
                            HB_dialog.warning('警告', '请配置每学时定价');
                            return false;
                        }

                        var submitParams = {
                            schemeId: $scope.submitData.trainingSchemeId, // 培训方案id
                            onSale: $scope.submitData.onSale, // 是否上架
                            onSaleImmediately: $scope.submitData.onSaleImmediately, // 是否立即上架
                            onSaleTime: $scope.submitData.onSaleTime, // 商品上架时间 yyyy-MM-dd HH:mm:ss
                            futureOffShelves: $scope.submitData.futureOffShelves, // 是否预下架
                            futureOffShelvesTime: $scope.submitData.futureOffShelvesTime, // 商品预下架时间 yyyy-MM-dd HH:mm:ss
                            price: $scope.submitData.price, // 商品价格
                            coursePoolPeriodPrices: $scope.submitData.coursePoolPeriodPrices,
                            courseIndividualPrices: $scope.submitData.courseIndividualPrices.length <= 0 ? undefined : $scope.submitData.courseIndividualPrices
                        };

                        submit(submitParams, 'updateCourseCommodityInfo');
                    }
                },


                commoditySkuUp: function (item) {
                    HB_notification.confirm('确定要上架该商品？上架后学员可购买该商品', function (dialog) {
                        return goodsManagerService.onSale({
                            commoditySkuId: item.skuId
                        }).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                HB_dialog.success('提示', data.info);
                                //显示下架按钮
                                item.commoditySkuState = 1;
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        }, function (data) {
                            HB_dialog.error('提示', data.info);
                        });
                    });

                },

                commoditySkuDown: function (item) {

                    HB_notification.confirm('确定要下架该商品？下架后学员不可购买该商品', function (dialog) {
                        return goodsManagerService.offShelves({
                            commoditySkuId: item.skuId
                        }).then(function (data) {
                            dialog.doRightClose();
                            if (data.status) {
                                HB_notification.showTip(data.info, 'success');
                                //显示上架按钮 这里赋值只要不是1随便复制
                                item.commoditySkuState = 3;
                            } else {
                                HB_notification.showTip(data.info, 'error');
                            }
                        }, function (data) {
                            HB_notification.showTip(data.info, 'error');
                        });
                    });

                },

                deleteGoods: function (item, $index) {
                    //没有skuid说明是新加的 不需要发请求去删除，本地删除即可
                    if (item.skuId) {
                        HB_notification.confirm('删除后，此培训商品不可恢复，是否确认删除？', function (dialog) {
                            return goodsManagerService.deleteCommodity(item.skuId).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    console.log(item);
                                    console.log($scope.model.totalCoursePoolList, '原来');
                                    //删除$scope.model.totalCoursePoolList下Item里的有的课程包
                                    angular.forEach(item.poolList, function (eachItem) {

                                        angular.forEach($scope.model.totalCoursePoolList, function (subEachItem, index) {
                                            if (eachItem.coursePackageId === subEachItem.coursePackageId) {
                                                console.log('删除了' + '<<' + eachItem.name + '>>');
                                                $scope.model.totalCoursePoolList.splice(index, 1);
                                            }
                                        });


                                    });

                                    $scope.submitData.coursePoolPeriodPrices.splice($index, 1);
                                    console.log($scope.model.totalCoursePoolList, '删除后');
                                    HB_notification.showTip(data.info, 'success');
                                } else {
                                    HB_notification.showTip(data.info, 'error');
                                }
                            });

                        });
                    } else {
                        console.log(item);
                        console.log($scope.model.totalCoursePoolList, '原来');
                        //删除$scope.model.totalCoursePoolList下Item里的有的课程包
                        angular.forEach(item.poolList, function (eachItem) {

                            angular.forEach($scope.model.totalCoursePoolList, function (subEachItem, index) {
                                if (eachItem.coursePackageId === subEachItem.coursePackageId) {
                                    console.log('删除了' + '<<' + eachItem.name + '>>');
                                    $scope.model.totalCoursePoolList.splice(index, 1);
                                }
                            });


                        });

                        $scope.submitData.coursePoolPeriodPrices.splice($index, 1);
                        console.log($scope.model.totalCoursePoolList, '删除后');
                    }


                },

                deleteGoodsSigner: function (item, $index) {
                    //没有skuid说明是新加的 不需要发请求去删除，本地删除即可

                    if (item.skuId) {
                        HB_notification.confirm('删除后，此培训商品不可恢复，是否确认删除？', function (dialog) {
                            return goodsManagerService.deleteCommodity(item.skuId).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    console.log(item);

                                    //删除$scope.model.totalCoursePoolList下Item里的有的课程包
                                    angular.forEach(item.courseList, function (eachItem) {

                                        angular.forEach($scope.model.totalIndividualList, function (subEachItem, index) {
                                            if (eachItem.coursePoolId === subEachItem.coursePoolId) {
                                                console.log('删除了' + '<<' + eachItem.coursePoolId + '>>');
                                                $scope.model.totalIndividualList.splice(index, 1);
                                            }
                                        });


                                    });

                                    $scope.submitData.courseIndividualPrices.splice($index, 1);
                                    console.log($scope.model.totalIndividualList, '删除后');
                                    HB_notification.showTip(data.info, 'success');

                                } else {
                                    HB_notification.showTip(data.info, 'error');
                                }
                            });

                        });
                    } else {
                        console.log(item);

                        //删除$scope.model.totalCoursePoolList下Item里的有的课程包
                        angular.forEach(item.courseList, function (eachItem) {

                            angular.forEach($scope.model.totalIndividualList, function (subEachItem, index) {
                                if (eachItem.coursePoolId === subEachItem.coursePoolId) {
                                    console.log('删除了' + '<<' + eachItem.coursePoolId + '>>');
                                    $scope.model.totalIndividualList.splice(index, 1);
                                }
                            });


                        });
                        console.log($index);
                        $scope.submitData.courseIndividualPrices.splice($index, 1);
                        console.log($scope.model.totalIndividualList, '删除后');
                    }


                }

            };

            $scope.utils = {
                validateIsNull:validateIsNull
            };
            if ($stateParams.id) {
                $http.get('/web/admin/commodityManager/getCommodityDetail', {
                    params: {
                        commoditySkuId: $stateParams.id,
                        schemeId: $stateParams.schemeId
                    }
                }).success(function (data) {

                    if (data.status) {
                        $scope.submitData = data.info;
                        $scope.model.paymentRule = angular.copy(data.info.authorizedRule);
                        initParams();
                    } else {
                        HB_notification.confirm(data.info, function (dialog) {
                            dialog.doRightClose();
                        });
                    }
                });
            }


            function initParams () {
                //培训班学习
                if ($scope.submitData.trainingSchemeType === 'TRAINING_CLASS') {
                    $scope.model.submitType = 'trainingClass';

                    $scope.model.trainClassTrainingConfigRequire = angular.copy($scope.submitData.trainingConfigRequire);
                    $scope.model.trainClassTrainingConfigRequire.trainingClassRelearn = $scope.model.trainClassTrainingConfigRequire.trainingClassRelearn + '';
                    //$scope.model.goodsTrainingConfigRequire=resetModelData('goodsTrainingConfigRequire');

                }
                //自主选课
                if ($scope.submitData.trainingSchemeType === 'COURSE') {
                    $scope.model.submitType = 'goods';
                    $scope.model.goodsTrainingConfigRequire = angular.copy($scope.submitData.trainingConfigRequire);
                    $scope.model.goodsTrainingConfigRequire.courseRelearn = $scope.model.goodsTrainingConfigRequire.courseRelearn + '';
                    $scope.model.goodsTrainingConfigRequire.lackBothThenPass = $scope.submitData.trainingConfigRequire.lackBothThenPass;
                    $scope.model.goodsTrainingConfigRequire.lackPracticeThenPass = $scope.submitData.trainingConfigRequire.lackPracticeThenPass;
                    $scope.model.goodsTrainingConfigRequire.lackPopupQuestionThenPass = $scope.submitData.trainingConfigRequire.lackPopupQuestionThenPass;

                    $scope.submitData.justImportOpen = false;
                    //$scope.model.trainClassTrainingConfigRequire=resetModelData('trainClassTrainingConfigRequire');
                    $scope.submitData.commodityImg = '@systemUrl@/images/pic.jpg';
                }


                //$scope.model.trainClassTrainingConfigRequire.certificateIsDelivery=$scope.model.trainClassTrainingConfigRequire.certificateIsDelivery+'';
                //$scope.model.trainClassTrainingConfigRequire.openPrint=$scope.model.trainClassTrainingConfigRequire.openPrint+'';


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
                    $scope.submitData.examRound.regularTime = $scope.submitData.examRound.regularTime == null ? 'false' : $scope.submitData.examRound.regularTime + '';
                    $scope.submitData.examRound.asTrainingBeginEnd = $scope.submitData.examRound.asTrainingBeginEnd == null ? 'true' : $scope.submitData.examRound.asTrainingBeginEnd + '';
                    $scope.submitData.examRound.limitExamTimes = $scope.submitData.examRound.limitExamTimes == null ? 'true' : $scope.submitData.examRound.limitExamTimes + '';
                    $scope.submitData.examRound.multiMissedGetScore = $scope.submitData.examRound.multiMissedGetScore == null ? 'false' : $scope.submitData.examRound.multiMissedGetScore + '';
                    $scope.submitData.examRound.announceResults = $scope.submitData.examRound.announceResults == null ? 'true' : $scope.submitData.examRound.announceResults + '';
                    $scope.submitData.examRound.announceResultsImmediately = $scope.submitData.examRound.announceResultsImmediately == null ? 'true' : $scope.submitData.examRound.announceResultsImmediately + '';
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
                    $scope.submitData.popupQuestionConfig.addPopupQuestionAssess = $scope.submitData.popupQuestionConfig.addPopupQuestionAssess + '';
                    $scope.submitData.popupQuestionConfig.courseRelearn = $scope.submitData.popupQuestionConfig.courseRelearn + '';
                } else {
                    $scope.submitData.popupQuestionConfig = resetSubmitData('popupQuestionConfig');
                }

                if ($scope.submitData.exerciseConfig) {
                    $scope.model.studyTypeArr[4].ischecked = true;
                    $scope.model.hasEditExcrise = true;
                    if (!$scope.submitData.exerciseConfig.sourceIds) {
                        $scope.submitData.exerciseConfig.sourceIds = [];
                    }
                    $.ajax({
                        url: '/web/admin/questionLibrary/findLibraryListByParentId?libraryId=-1&enabled=0&onlySelf=0&showInsertLibrary=1',
                        dataType: 'json', // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        success: function (result) {
                            //  console.log(result.info);
                            //  console.log($scope.commodityAndClassInfo.exerciseConfig.sourceIds);
                            $scope.model.paper.randomTakeObjectConfigurationItemDtos = [];
                            for (var i = 0; i < result.info.length; i++) {
                                console.log(result.info[i].id);
                                for (var j = 0; j < $scope.submitData.exerciseConfig.sourceIds.length; j++) {
                                    //console.log($scope.commodityAndClassInfo.exerciseConfig.sourceIds[j]);

                                    if (result.info[i].id == $scope.submitData.exerciseConfig.sourceIds[j]) {
                                        $scope.model.paper.randomTakeObjectConfigurationItemDtos.push(
                                            {
                                                entityId: result.info[i].id,
                                                name: result.info[i].name
                                            });
                                        console.log($scope.model.paper.randomTakeObjectConfigurationItemDtos);
                                    }
                                    ;

                                }

                            }
                        },
                        error: function (result) {
                            console.log(result);
                        }
                    });

                } else {
                    $scope.submitData.exerciseConfig = resetSubmitData('exerciseConfig');
                }


                if ($scope.submitData.practicePaperConfig) {
                    $scope.model.studyTypeArr[5].ischecked = true;
                    $scope.model.practicePaperName = $scope.submitData.practicePaperConfig.practicePaperName;
                    $scope.model.practiceTotalScore = $scope.submitData.practicePaperConfig.practiceExamInfo.totalScore;
                    $scope.model.limitPracticeNum = $scope.submitData.practicePaperConfig.practiceExamInfo.limitPracticeNum;
                } else {
                    $scope.submitData.practicePaperConfig = resetSubmitData('practicePaperConfig');
                }


                /*$scope.model.totalCoursePoolList.push({
                 name:item.poolName,
                 coursePackageId:item.id
                 });

                 coursePoolPeriodPrices:[],
                 courseIndividualPrices:[],
                 disabledDo();*/
                if ($scope.submitData.courseIndividualPrices) {


                    angular.forEach($scope.submitData.courseIndividualPrices, function (item, index) {
                        var uId = new Date().getTime();
                        item.uId = uId + index;
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
                    angular.forEach($scope.submitData.coursePoolPeriodPrices, function (item, index) {
                        var uId = new Date().getTime();
                        item.uId = uId + index;
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


            function submit (params, methodName, callBack) {
                $scope.submitAble = true;
                $http.post('/web/admin/commodityManager/' + methodName, params).success(function (data) {
                    if (data.status) {
                        $scope.submitAble = false;
                        HB_dialog.success('提示', data.info);
                        if (callBack) {
                            callBack();
                        }
                    } else {
                        $scope.submitAble = false;
                        HB_dialog.error('提示', data.info);
                    }
                }).error(function () {
                    $scope.submitAble = false;
                });
            }


            function validateSaleCommon () {
                if ($scope.submitData.onSale === 'true' && $scope.submitData.onSaleImmediately === 'false' && validateIsNull($scope.submitData.onSaleTime)) {
                    HB_dialog.warning('警告', '请配置上架时间');
                    return false;
                }

                if ($scope.submitData.futureOffShelvesTime) {
                    if ($scope.submitData.onSale === 'true' && $scope.submitData.futureOffShelves === 'true' && validateIsNull($scope.submitData.futureOffShelvesTime)) {
                        HB_dialog.warning('警告', '请配置下架时间');
                        return false;
                    }

                    if ($scope.submitData.onSale === 'true' && $scope.submitData.futureOffShelves === 'true' && (formatDateStr($scope.submitData.futureOffShelvesTime) < new Date().getTime())) {
                        HB_dialog.warning('警告', '下架时间不能早于当前时间');
                        return false;
                    }


                }

                if ($scope.submitData.onSaleTime) {
                    if ($scope.submitData.onSale === 'true' && $scope.submitData.onSaleImmediately === 'false' && (formatDateStr($scope.submitData.onSaleTime) < new Date().getTime())) {
                        HB_dialog.warning('警告', '上架时间不能早于当前时间');
                        return false;
                    }
                }


                if ($scope.submitData.futureOffShelvesTime && $scope.submitData.onSaleTime) {
                    if (formatDateStr($scope.submitData.futureOffShelvesTime) <= formatDateStr($scope.submitData.onSaleTime)) {
                        HB_dialog.warning('警告', '下架时间不能早于上架时间');
                        return false;
                    }
                }
            }


            function validateReleaseBas (name) {
                if (validateIsNull($scope.submitData.trainingSchemeName)) {
                    HB_dialog.warning('警告', '请填写' + name + '名称');
                    return false;
                }


                var requireSkuLen = getSkuRequireLen(), skuMark = false;
                console.log(requireSkuLen);
                angular.forEach($scope.skuParams.skuPropertyList, function (item) {
                    //选中科目并且是专业课 或者全部都有选都通过检验


                    //console.log(item.skuPropertyKey+'~~~~~'+item.skuPropertyValue);

                    if ((item.propertyIdCode === 'trainingSubject' && item.valueCode === 'profession' && $scope.model.categoryType === 'COURSE_SUPERMARKET_GOODS' && requireSkuLen === 1) || requireSkuLen === 2) {
                        skuMark = true;
                    }
                });

                if (!skuMark) {
                    HB_dialog.warning('警告', '请配置完整的商品sku');
                    return false;
                }


                if (validateIsNull($scope.submitData.trainingBeginTime)) {
                    HB_dialog.warning('警告', '请填写培训开始时间');
                    return false;
                }

                if (validateIsNull($scope.submitData.trainingEndTime)) {
                    HB_dialog.warning('警告', '请填写培训结束时间');
                    return false;
                }

                if (formatDateStr($scope.submitData.trainingBeginTime) >= formatDateStr($scope.submitData.trainingEndTime)) {
                    HB_dialog.warning('警告', '培训结束时间不能小于培训开始时间');
                    return false;
                }
            }

            function getSkuRequireLen () {
                var skuLen = 0;
                angular.forEach($scope.skuParams.skuPropertyList, function (item) {
                    if (!validateIsNull(item.value)) {
                        skuLen++;
                    }
                });
                return skuLen;
            }


            //验证是否为空
            function validateIsNull (obj) {
                return (obj === '' || obj === undefined || obj === null);
            }

            //验证是否为非数字
            function validateIsNaN (obj) {
                return isNaN(Number(obj));
            }

            function formatDateStr (str) {
                var newStr = str.replace(/-/g, '/');
                var newDate = new Date(newStr).getTime();
                return newDate;
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

            function warningStudyType (arrIndex, studyType) {
                if (!$scope.model.studyTypeArr[arrIndex].ischecked) {
                    HB_dialog.warning('警告', '请先勾选' + studyType + '学习方式');
                    return false;
                } else {
                    return true;
                }
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

            //商品发布的所有kendo表格配置
            releaseGoodsKendoGrid($scope, hbUtil, disabledDo, signerDisabledDo);


        }]
    };
});