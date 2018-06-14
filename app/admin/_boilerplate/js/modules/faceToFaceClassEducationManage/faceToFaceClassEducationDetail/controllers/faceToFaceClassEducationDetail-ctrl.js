define(function (classResultOfflineManager) {
    "use strict";
    return {
        indexCtrl: ["$scope", 'kendo.grid', 'KENDO_UI_EDITOR', 'HB_dialog', '$q', '$http', 'hbUtil', 'faceToFaceClassEducationManageServices', 'hbSkuService', '$timeout', '$state','$stateParams',
            function ($scope, kendoGrid, KENDO_UI_EDITOR, HB_dialog, $q, $http, hbUtil, faceToFaceClassEducationManageServices, hbSkuService, $timeout, $state, $stateParams) {

                $scope.model={
                    upload: {},
                    classTab:0,
                    generalQuestionnaire: false,
                    paperInvoiceShow: true,
                    questionnaireType:0,
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    },
                    params:{
                        signUpStatus:-1,
                        hadReport:-1,
                        accommodationInfoStatus:-1,
                        schemeId:$stateParams.schemeId,
                    },
                    recordParams:{
                        schemeId:$stateParams.schemeId,
                        userName:'',
                        phoneNumber:'',
                        identity:''
                    },
                    /**
                     * 整体报告
                     */
                    overallReport:{
                        questionnaireName:'',
                        joinAndSubmitOfUserCount:0,
                        questionnaireScore:0
                    },
                    /**
                     * 教师课程评价
                     */
                    modelTCE:{
                        isInitClassNotice:true,
                        teacherCurriculumEvaluationList : {},
                    },
                    /**
                     * 班级通知
                     */
                    modelCN:{
                        isInitClassNotice:true,
                        titleClassNotice:"发布班级通知",
                        submitAble: true,
                        classNoticeQuery  : {//分页查询班级通知参数
                            title           : null,//资讯标题
                            classId         : $stateParams.schemeId,//班级Id
                            isPop          : "-1",//资讯状态 -1 不查 0-草稿 1-已发布 2-定时发布
                            publishStartTime: null,//发布开始时间
                            publishEndTime  : null,//发布结束时间
                        },
                        classNoticeList: [],//班级通知分页数据
                        createClassNotice:{
                            title :null,
                            context:null,
                            classId:$stateParams.schemeId,
                            isPop:"1",
                        },
                    },
                    /**
                     * 培训风采
                     */
                    modelTAD:{
                        isInitTrainingAndDemeanor:true,
                        submitAble: true,
                        imgSrc:'/admin/_boilerplate/images/afei.jpg',
                        trainingAndDemeanorQuery : {//分页查询培训风采参数
                            classId : $stateParams.schemeId,//班级Id
                        },
                        trainingAndDemeanorList:{},//培训风采分页数据
                        createTrainingAndDemeanor:{
                            classId : $stateParams.schemeId,//班级Id
                            demeanorImgPath:null,
                        },
                    },
                };

                $scope.kendoPlus = {
                    importWindowOptions        : {
                        modal    : true,
                        visible  : false,
                        resizable: false,
                        draggable: false,
                        title    : false,
                        open: function () {
                            $timeout(function () {
                                $scope.windowLoaded = true
                            })
                            this.center();
                        },
                        close: function () {
                            $timeout(function () {
                                $scope.windowLoaded = false
                            })
                        }
                    },
                    signInDetailWindowOptions        : {
                        modal    : true,
                        visible  : false,
                        resizable: false,
                        draggable: false,
                        title    : false,
                        open     : function () {
                            this.center ();
                        }
                    },
                    detailWindowOptions        : {
                        modal    : true,
                        visible  : false,
                        resizable: false,
                        draggable: false,
                        title    : false,
                        open     : function () {
                            this.center ();
                        }
                    },
                    createClassNoticeWindowOptions        : {
                        modal    : true,
                        visible  : false,
                        resizable: false,
                        draggable: false,
                        title    : false,
                        open     : function () {
                            this.center ();
                        }
                    }
                };


                $scope.events= {
                    openKendoWindow: function (windowName) {
                        $scope[windowName].center().open();
                    },
                    closeKendoWindow: function (windowName) {
                        $scope[windowName].close();
                    },
                    //查询
                    mainPageQueryList: function (e, gridName, pageName) {
                        e.preventDefault();
                        e.stopPropagation();
                        $scope.model[pageName].pageNo = 1;
                        $scope.kendoPlus[gridName].pager.page(1);
                    },
                    goManage: function () {
                        $state.go('states.faceToFaceClassEducationManage');
                    },
                    clickTab: function (type) {
                        if (type === $scope.model.classTab) {
                            return false;
                        }
                        if (type == 3) {
                            faceToFaceClassEducationManageServices.test({
                                schemeId: $scope.model.params.schemeId
                            }).then(function (data) {
                                $scope.model.questionnaireType = data.info;
                            }),
                            faceToFaceClassEducationManageServices.getOverallReport({
                                schemeId: $scope.model.params.schemeId
                            }).then(function (data) {
                                $scope.model.overallReport = data.info;
                            })
                        }
                        $scope.model.classTab = type;
                    },
                    //导出学员信息
                    exportStudentInfo: function () {
                        faceToFaceClassEducationManageServices.exportStudentInfo({
                            "schemeId": $scope.model.params.schemeId,
                            "userName": $scope.model.params.userName,
                            "identity": $scope.model.params.identity,
                            "phoneNumber": $scope.model.params.phoneNumber,
                            "signUpStatus": $scope.model.params.signUpStatus,
                            "hadReport": $scope.model.params.hadReport,
                            "accommodationInfoStatus": $scope.model.params.accommodationInfoStatus,
                            "exportType": 1,
                            "asynchronousTaskGroupName": "EXPORT_USER_INFO_IN_CLASS"
                        }).then(function (data) {
                            if (data.status && data.info) {
                                $scope.globle.showTip("请到异步任务管理查看相关信息", "success");
                            } else {
                                $scope.globle.showTip("data.info", "error");
                            }
                        })
                    },
                    //导出住宿信息
                    exportAccommodationsInfo: function () {
                        faceToFaceClassEducationManageServices.exportStudentInfo({
                            "schemeId": $scope.model.params.schemeId,
                            "userName": $scope.model.params.userName,
                            "identity": $scope.model.params.identity,
                            "phoneNumber": $scope.model.params.phoneNumber,
                            "signUpStatus": $scope.model.params.signUpStatus,
                            "hadReport": $scope.model.params.hadReport,
                            "accommodationInfoStatus": $scope.model.params.accommodationInfoStatus,
                            "exportType": 2,
                            "asynchronousTaskGroupName": "EXPORT_ACCOMMODATIONS"
                        }).then(function (data) {
                            if (data.status && data.info) {
                                $scope.globle.showTip("请到异步任务管理查看相关信息", "success");
                            } else {
                                $scope.globle.showTip("data.info", "error");
                            }
                        })
                    },
                    //导入住宿信息
                    importUserAccommodationsInfo: function (e) {
                        if ($scope.model.upload == undefined || $scope.model.upload === '' || $scope.model.upload.result == undefined || $scope.model.upload.result === '') {
                            $scope.globle.showTip('请先选择文件', "warning");
                            return false;
                        }
                        faceToFaceClassEducationManageServices.userAccommodationsInfoImport({
                            filePath: $scope.model.upload.result.newPath,
                            fileName: $scope.model.upload.result.fileName,
                            schemeId: $stateParams.schemeId,
                        }).then(function (data) {
                            $scope.events.closeKendoWindow('importWindowOptions');
                            if (!data.status || !data.info) {
                                $scope.globle.showTip(data.info, "error");
                            } else {
                                $scope.model.upload = {};
                                HB_dialog.contentAs($scope, {
                                    title: '提示',
                                    width: 350,
                                    height: 170,
                                    confirmText: '查看任务进度',
                                    cancelText: '确定',
                                    sure: function (wow) {
                                        var defer = $q.defer(),
                                            promise = defer.promise;
                                        $state.go('states.faceToFaceClassEducationAsynExport', {
                                            groupType: 'IMPORT_ACCOMMODATIONS'
                                        });
                                        defer.resolve();
                                        wow.close();
                                        return promise;
                                    },
                                    templateUrl: '@systemUrl@/views/faceToFaceClassEducationManage/dialogFile.html'
                                });
                            }
                        })
                    },

                    getDetailInfo: function (dataItem) {
                        faceToFaceClassEducationManageServices.getUserDetailInfoByUserId({
                            schemeId: $stateParams.schemeId,
                            userId: dataItem.userId
                        }).then(function (data) {
                            if (data.status) {
                                $scope.events.openKendoWindow('detailWindowOptions');
                                $scope.model.userInfo = data.info;
                            } else {
                                $scope.globle.showTip("查看日志失败", 'error');
                            }
                        })
                    },

                    switchTable: function (type) {
                        if (type != $scope.model.invoiceType) {
                            $scope.model.paperInvoiceShow = !$scope.model.paperInvoiceShow;
                            $scope.model.generalQuestionnaire = !$scope.model.generalQuestionnaire;
                            $scope.model.invoiceType = type;
                        }
                        if (type == 0) {
                            faceToFaceClassEducationManageServices.getOverallReport({
                                schemeId: $scope.model.params.schemeId
                            }).then(function (data) {
                                $scope.model.overallReport = data.info;
                            })
                        }
                        if (type == 1) {
                            $scope.model['page'].pageNo = 1;
                            $scope.kendoPlus['recordGridInstance'].pager.page(1);
                        }
                    },

                    //查看打卡明细
                    getSigninDetail: function (dataItem) {
                        faceToFaceClassEducationManageServices.getUserDetailInfoByUserId({
                            schemeId: $stateParams.schemeId,
                            userId: dataItem.userId
                        }).then(function (data) {
                            if (data.status) {
                                $scope.events.openKendoWindow('signinDetailWindowOptions');
                                $scope.model.userInfo = data.info;
                            } else {
                                $scope.globle.showTip("查看日志失败", 'error');
                            }
                        })
                    },

                    /**
                     * 班级通知-输入框点击回车按钮
                     * @param e
                     */
                    pressEnterKeyCN: function (e) {
                        if (e.keyCode == 13) {
                            $scope.events.classNoticeQuery(e);
                        }
                    },

                    /**
                     * 班级通知-条件查询
                     * @param e
                     */
                    queryClassNotice: function (e) {
                        e.stopPropagation();
                        if (null == $scope.model.categoryName || $scope.model.categoryName == "") {
                            $scope.model.modelCN.classNoticeQuery.categoryType = "";
                        }
                        $scope.model.page.pageNo = 1;
                        $scope.ui.classNoticePager.dataSource.page(1);
                    },
                    /**
                     * 班级通知-发布资讯
                     * @param e
                     */
                    publishClassNotice:function(e){
                        e.stopPropagation();
                        if($scope.model.modelCN.createClassNotice.title==null||$scope.model.modelCN.createClassNotice.title==''){
                            $scope.globle.alert('提示', '请输入资讯标题');
                            return ;
                        }
                        if($scope.model.modelCN.createClassNotice.content==null||$scope.model.modelCN.createClassNotice.content==''){
                            $scope.globle.alert('提示', '请输入资讯内容');
                            return ;
                        }
                        if($scope.model.modelCN.createClassNotice.isPop==null||$scope.model.modelCN.createClassNotice.isPop==''){
                            $scope.globle.alert('提示', '请选择弹窗展示通知');
                            return ;
                        }
                        $scope.model.modelCN.submitAble=false;
                        //发布
                        $scope.model.modelCN.createClassNotice.status="1";
                        if($scope.model.modelCN.createClassNotice.id != null && $scope.model.modelCN.createClassNotice.id != ""){//编辑
                            faceToFaceClassEducationManageServices.updateClassNoticeInFaceToFaceClass($scope.model.modelCN.createClassNotice).then(function (data) {
                                $scope.model.modelCN.submitAble = true;
                                if (data.status) {
                                    $scope.globle.showTip("发布通知成功！", 'success');
                                    $scope.events.closeKendoWindow("createClassNoticeWindowOptions");
                                    $scope.ui.classNoticePager.dataSource.page(1);
                                } else {
                                    $scope.globle.alert("提示", "发布通知失败！");
                                }
                            })
                        }else {//发布
                            faceToFaceClassEducationManageServices.createClassNoticeInFaceToFaceClass($scope.model.modelCN.createClassNotice).then(function (data) {
                                $scope.model.modelCN.submitAble = true;
                                if (data.status) {
                                    $scope.globle.showTip("发布通知成功！", 'success');
                                    $scope.events.closeKendoWindow("createClassNoticeWindowOptions");
                                    $scope.ui.classNoticePager.dataSource.page(1);
                                } else {
                                    $scope.globle.alert("提示", "发布通知失败！");
                                }
                            })
                        }
                    },
                    /**
                     * 班级通知-新增资讯
                     * @param e
                     * @param dataItem
                     */
                    toAddClassNotice: function (e) {
                        e.stopPropagation();
                        $scope.model.modelCN.titleClassNotice="发布班级通知";
                        $scope.model.modelCN.createClassNotice.id = null;
                        $scope.events.clearClassNotice(e);
                        $scope.events.openKendoWindow('createClassNoticeWindowOptions');
                    },
                    /**
                     * 班级通知-编辑资讯
                     * @param e
                     * @param dataItem
                     */
                    toEditClassNotice: function (e, dataItem) {
                        e.stopPropagation();
                        $scope.model.modelCN.titleClassNotice="编辑班级通知";
                        $scope.model.modelCN.createClassNotice.id = dataItem.id;
                        $scope.model.modelCN.createClassNotice.title = dataItem.title;
                        $scope.model.modelCN.createClassNotice.content = dataItem.content;
                        $scope.model.modelCN.createClassNotice.isPop = dataItem.isPop;
                        $scope.events.openKendoWindow('createClassNoticeWindowOptions');
                    },
                    /**
                     * 班级通知-编辑资讯
                     * @param e
                     * @param dataItem
                     */
                    clearClassNotice: function (e) {
                        e.stopPropagation();
                        $scope.model.modelCN.createClassNotice.title = null;
                        $scope.model.modelCN.createClassNotice.content = null;
                        $scope.model.modelCN.createClassNotice.isPop = "1";
                    },
                    /**
                     * 班级通知-删除资讯
                     * @param e
                     * @param dataItem
                     */
                    deleteClassNotice: function (e, dataItem) {
                        e.stopPropagation();
                        $scope.globle.confirm("提示", "确认删除该资讯？", function (dialog) {
                            return faceToFaceClassEducationManageServices.deleteClassNoticeInFaceToFaceClass({
                                id: dataItem.id
                            }).then(function (data) {
                                dialog.doRightClose();
                                if (data.status) {
                                    $scope.ui.classNoticePager.dataSource.page($scope.model.page.pageNo);
                                    var size = $scope.model.modelCN.classNoticeList.length;
                                    if (size == 1 && $scope.model.page.pageNo != 1) {
                                        $scope.model.page.pageNo = $scope.model.page.pageNo - 1;
                                        $scope.ui.classNoticePager.dataSource.page($scope.model.page.pageNo);
                                    }
                                    $scope.globle.showTip("删除成功！", 'success');
                                } else {
                                    $scope.globle.alert("提示", "删除失败！");
                                }
                            })
                        })
                    },

                    /**
                     * 班级通知-上传风采
                     * @param e
                     */
                    saveDemeanorImgUrl:function(e){
                        e.stopPropagation();
                        if (!$scope.model.uploaderTrainingAndDemeanor || !$scope.model.uploaderTrainingAndDemeanor.newPath || $scope.model.modelTAD.demeanorImgPath ==="") {
                            $scope.globle.alert("提示", "请选择需上传的图片！");
                            return;
                        }
                        $scope.model.modelTAD.submitAble=false;
                        faceToFaceClassEducationManageServices.createTrainingAndDemeanorInFaceToFaceClass($scope.model.modelTAD.createTrainingAndDemeanor).then(function (data) {
                            $scope.model.modelTAD.submitAble = true;
                            if (data.status) {
                                $scope.globle.showTip("上传风采成功！", 'success');
                                $scope.model.modelTAD.imgSrc = "/admin/_boilerplate/images/afei.jpg";
                                $scope.model.modelTAD.createTrainingAndDemeanor.demeanorImgPath = "";
                                $scope.ui.trainingAndDemeanorPager.dataSource.page(1);
                            } else {
                                $scope.globle.alert("提示", "上传风采失败！");
                            }
                        })
                    },

                    /**
                     * 删除选中的风采图片
                     * @param e
                     */
                    deleteDemeanorImgUrl:function(e){
                        e.stopPropagation();
                        $scope.model.modelTAD.createTrainingAndDemeanor.demeanorImgPath= "";
                        $scope.model.modelTAD.imgSrc="/admin/_boilerplate/images/afei.jpg";
                    },
                };

                $scope.node = {
                    studentInfoGrid: null
                };

                //=============普通问卷答题记录分页开始=======================
                var gridRowTemplateRecord = '';
                (function () {
                    function file () {
                        return 'state';
                    }
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index||\'-\'  #');
                    result.push('</td>');

                    //姓名
                    result.push('<td>');
                    result.push('#: userName||\'-\'  #');
                    result.push('</td>');

                    //手机号
                    result.push('<td>');
                    result.push('#: phoneNumber||\'-\'  #');
                    result.push('</td>');

                    //身份证
                    result.push('<td>');
                    result.push('#: identity||\'-\'  #');
                    result.push('</td>');

                    //问卷提交时间
                    result.push('<td>');
                    result.push('#: submitTime||\'-\'  #');
                    result.push('</td>');

                    //操作
                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.getDetailInfo(this.dataItem)">查看答卷</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplateRecord = result.join('');
                })();
                $scope.recordGrid = {
                    options: hbUtil.kdGridCommonOption ({
                        template: gridRowTemplateRecord,
                        url: "/web/admin/faceToFaceClassEducation/getQuestionnaireRecordOfAnswer",
                        scope: $scope,
                        page: 'page',
                        //需要额外处理请求参数在这里做
                        param: $scope.model.recordParams,
                        fn: function (response) {
                            $scope.configingArr = response.info;
                        },
                        columns: [
                            {sortable: false, field: "index", title: "No.", width: 50},
                            {sortable: false, field: "userName", title: "姓名"},
                            {sortable: false, field: "phoneNumber", title: "手机号"},
                            {sortable: false, field: "identity", title: "身份证号"},
                            {sortable: false, field: "submitTime", title: "问卷提交时间"},
                            {
                                title: "操作", width: 100
                            }
                        ]
                    })
                };

                //=============量表问卷答题记录分页开始=======================
                var gridRowTemplateGauge = '';
                (function () {
                    function file () {
                        return 'state';
                    }
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index||\'-\'  #');
                    result.push('</td>');

                    //姓名
                    result.push('<td>');
                    result.push('#: userName||\'-\'  #');
                    result.push('</td>');

                    //手机号
                    result.push('<td>');
                    result.push('#: phoneNumber||\'-\'  #');
                    result.push('</td>');

                    //身份证
                    result.push('<td>');
                    result.push('#: identity||\'-\'  #');
                    result.push('</td>');

                    //问卷提交时间
                    result.push('<td>');
                    result.push('#: submitTime||\'-\'  #');
                    result.push('</td>');

                    //问卷得分
                    result.push('<td>');
                    result.push('#: score||\'-\'  #');
                    result.push('</td>');

                    //操作
                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.getDetailInfo(this.dataItem)">查看答卷</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplateGauge = result.join('');
                })();
                $scope.gaugeGrid = {
                    options: hbUtil.kdGridCommonOption ({
                        template: gridRowTemplateGauge,
                        url: "/web/admin/faceToFaceClassEducation/getQuestionnaireRecordOfAnswer",
                        scope: $scope,
                        page: 'page',
                        //需要额外处理请求参数在这里做
                        param: $scope.model.recordParams,
                        fn: function (response) {
                            $scope.configingArr = response.info;
                        },
                        columns: [
                            {sortable: false, field: "index", title: "No.", width: 50},
                            {sortable: false, field: "userName", title: "姓名"},
                            {sortable: false, field: "phoneNumber", title: "手机号"},
                            {sortable: false, field: "identity", title: "身份证号"},
                            {sortable: false, field: "submitTime", title: "问卷提交时间"},
                            {sortable: false, field: "score", title: "问卷得分"},
                            {
                                title: "操作", width: 100
                            }
                        ]
                    })
                };

                //=============分页开始=======================
                var gridRowTemplate = '';
                (function () {
                    function file () {
                        return 'state';
                    }
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index||\'-\'  #');
                    result.push('</td>');

                    //姓名
                    result.push('<td>');
                    result.push('#: userName||\'-\'  #');
                    result.push('</td>');

                    //手机号
                    result.push('<td>');
                    result.push('#: phoneNumber||\'-\'  #');
                    result.push('</td>');

                    //身份证
                    result.push('<td>');
                    result.push('#: identity||\'-\'  #');
                    result.push('</td>');

                    //报名时间
                    result.push('<td>');
                    result.push('#: signUpTime||\'-\'  #');
                    result.push('</td>');

                    //报名状态
                    result.push('<td>');
                    result.push('<span ng-if="#:signUpStatus==1#">已报名</span>');
                    result.push('<span ng-if="#:signUpStatus==2#">已退班</span>');
                    result.push('</td>');

                    //是否报到
                    result.push('<td>');
                    result.push('#: hadReport?\'是\':\'否\' #');
                    result.push('</td>');

                    //报到时间
                    result.push('<td>');
                    result.push('#: reportTime||\'-\'  #');
                    result.push('</td>');

                    //住宿信息状态
                    result.push('<td>');
                    result.push('<span ng-if="#:accommodationInfoStatus==1#">已设置</span>');
                    result.push('<span ng-if="#:accommodationInfoStatus==2#">未设置</span>');
                    result.push('</td>');

                    //操作
                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.getDetailInfo(this.dataItem)">详情</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplate = result.join('');
                })();
                $scope.studentInfoGrid = {
                    options: hbUtil.kdGridCommonOption ({
                        template: gridRowTemplate,
                        url: "/web/admin/faceToFaceClassEducation/getStudentInfoInFaceToFaceClass",
                        scope: $scope,
                        page: 'page',
                        //需要额外处理请求参数在这里做
                        param: $scope.model.params,
                        fn: function (response) {
                            $scope.configingArr = response.info;
                        },
                        columns: [
                            {sortable: false, field: "index", title: "No.", width: 50},
                            {sortable: false, field: "userName", title: "姓名", width: 100},
                            {sortable: false, field: "phoneNumber", title: "手机号", width: 150},
                            {sortable: false, field: "identity", title: "身份证号"},
                            {sortable: false, field: "signUpTime", title: "报名时间", width: 150},
                            {sortable: false, field: "signUpStatus", title: "报名状态", width: 100},
                            {sortable: false, field: "hadReport", title: "是否报到",  width: 100},
                            {sortable: false, field: "reportTime", title: "报到时间",  width: 150},
                            {sortable: false, field: "accommodationInfoStatus", title: "住宿信息状态",  width: 150},
                            {
                                title: "操作", width: 100
                            }
                        ]
                    })
                };

                /*学员学习明细*/
                var gridRowTemplateStudentLearning = '';
                (function () {
                    function file () {
                        return 'state';
                    }
                    var result = [];
                    result.push('<tr>');
                    //NO.
                    result.push('<td>');
                    result.push('#: index||\'-\'  #');
                    result.push('</td>');

                    //姓名
                    result.push('<td>');
                    result.push('#: userName||\'-\'  #');
                    result.push('</td>');

                    //手机号
                    result.push('<td>');
                    result.push('#: phoneNumber||\'-\'  #');
                    result.push('</td>');

                    //身份证号
                    result.push('<td>');
                    result.push('#: identity||\'-\'  #');
                    result.push('</td>');

                    //报名时间
                    result.push('<td>');
                    result.push('#: signUpTime||\'-\'  #');
                    result.push('</td>');

                    //有效签到次数
                    result.push('<td>');
                    result.push('#: validSigninCount||\'-\'  #');
                    result.push('</td>');

                    //有效签退次数
                    //是否报到
                    result.push('<td>');
                    result.push('#: validSignoutCount||\'-\' #');
                    result.push('</td>');

                    //考试得分
                    result.push('<td>');
                    result.push('#: examScore||\'-\'  #');
                    result.push('</td>');

                    //完成问卷份数
                    result.push('<td>');
                    result.push('#: completeQuestionnaireCount||\'-\'  #');
                    result.push('</td>');

                    //考核结果
                    result.push('<td>');
                    result.push('#: examResult||\'-\'  #');
                    result.push('</td>');

                    //考核通过时间
                    result.push('<td>');
                    result.push('#: examPassTime||\'-\'  #');
                    result.push('</td>');

                    //操作
                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.getSigninDetail(this.dataItem)">查看打卡明细</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplateStudentLearning = result.join('');
                })();
                $scope.studentLearningGrid = {
                    options: hbUtil.kdGridCommonOption ({
                        template: gridRowTemplateStudentLearning,
                        url: "/web/admin/faceToFaceClassEducation/getStudentLearningInFaceToFaceClass",
                        scope: $scope,
                        page: 'page',
                        //需要额外处理请求参数在这里做
                        param: $scope.model.params,
                        fn: function (response) {
                            $scope.configingArr = response.info;
                        },
                        columns: [
                            {sortable: false, field: "index", title: "No.", width: 50},
                            {sortable: false, field: "userName", title: "姓名", width: 80},
                            {sortable: false, field: "phoneNumber", title: "手机号", width: 100},
                            {sortable: false, field: "identity", title: "身份证号", width: 150},
                            {sortable: false, field: "signUpTime", title: "报名时间", width: 150},
                            {sortable: false, field: "validSigninCount", title: "有效签到次数", width: 100},
                            {sortable: false, field: "validSignoutCount", title: "有效签退次数",  width: 100},
                            {sortable: false, field: "examScore", title: "考试得分",  width: 150},
                            {sortable: false, field: "completeQuestionnaireCount", title: "完成问卷份数",  width: 100},
                            {sortable: false, field: "examResult", title: "考核结果", width: 80},
                            {sortable: false, field: "examPassTime", title: "考核通过时间", width: 150},
                            {
                                title: "操作", width: 150
                            }
                        ]
                    })
                };
                /*学员打卡明细*/
                var gridRowTemplateSignInDetail = '';
                (function () {
                    function file () {
                        return 'state';
                    }
                    var result = [];
                    result.push('<tr>');
                    //NO.
                    result.push('<td>');
                    result.push('#: index||\'-\'  #');
                    result.push('</td>');

                    //姓名
                    result.push('<td>');
                    result.push('#: userName||\'-\'  #');
                    result.push('</td>');

                    //手机号
                    result.push('<td>');
                    result.push('#: phoneNumber||\'-\'  #');
                    result.push('</td>');

                    //身份证号
                    result.push('<td>');
                    result.push('#: identity||\'-\'  #');
                    result.push('</td>');

                    //报名时间
                    result.push('<td>');
                    result.push('#: signUpTime||\'-\'  #');
                    result.push('</td>');

                    //有效签到次数
                    result.push('<td>');
                    result.push('#: validSigninCount||\'-\'  #');
                    result.push('</td>');

                    //有效签退次数
                    //是否报到
                    result.push('<td>');
                    result.push('#: validSignoutCount||\'-\' #');
                    result.push('</td>');

                    //考试得分
                    result.push('<td>');
                    result.push('#: examScore||\'-\'  #');
                    result.push('</td>');

                    //完成问卷份数
                    result.push('<td>');
                    result.push('#: completeQuestionnaireCount||\'-\'  #');
                    result.push('</td>');

                    //考核结果
                    result.push('<td>');
                    result.push('#: examResult||\'-\'  #');
                    result.push('</td>');

                    //考核通过时间
                    result.push('<td>');
                    result.push('#: examPassTime||\'-\'  #');
                    result.push('</td>');

                    //操作
                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.getSigninDetail(this.dataItem)">查看打卡明细</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplateStudentLearning = result.join('');
                })();
                $scope.signInDetailGrid = {
                    options: hbUtil.kdGridCommonOption ({
                        template: gridRowTemplateSignInDetail,
                        url: "/web/admin/faceToFaceClassEducation/getStudentLearningInFaceToFaceClass",
                        scope: $scope,
                        page: 'page',
                        //需要额外处理请求参数在这里做
                        param: $scope.model.params,
                        fn: function (response) {
                            $scope.configingArr = response.info;
                        },
                        columns: [
                            {sortable: false, field: "index", title: "No.", width: 50},
                            {sortable: false, field: "userName", title: "课程名称", width: 80},
                            {sortable: false, field: "phoneNumber", title: "授课教师", width: 100},
                            {sortable: false, field: "signUpTime", title: "授课时间", width: 150},
                            {sortable: false, field: "signinTime", title: "签到时间", width: 150},
                            {sortable: false, field: "signoutTime", title: "签退时间",  width: 150},
                        ]
                    })
                };

                $scope.ui = {
                    editor: KENDO_UI_EDITOR,

                    datePicker : {
                        begin: {
                            options: {
                                culture: "zh-CN",
                                format: "yyyy-MM-dd",
                                change: $scope.events.startChange
                            }
                        },
                        end: {
                            options: {
                                culture: "zh-CN",
                                format: "yyyy-MM-dd",
                                change: $scope.events.endChange
                            }
                        }
                    },


                    classNoticePager : {
                        refresh   : true,
                        dataSource: new kendo.data.DataSource ( {
                            serverPaging: true,
                            page        : 1,
                            pageSize    : 5, // 每页显示的数据数目
                            transport   : {
                                parameterMap: function ( data, type ) {
                                    var temp  = {
                                        queryParam: {},
                                        page      : { pageNo: data.page, pageSize: data.pageSize }
                                    }, params = $scope.model.modelCN.classNoticeQuery;
                                    for ( var key in params ) {
                                        if ( params.hasOwnProperty ( key ) ) {
                                            if ( params[key] ) {
                                                temp.queryParam[key] = params[key];
                                            }
                                        }
                                    }
                                    $scope.model.page.pageNo   = data.page;
                                    $scope.model.page.pageSize = data.pageSize;
                                    delete data.page;
                                    delete data.pageSize;
                                    delete data.skip;
                                    delete data.take;
                                    return temp;
                                },
                                read        : {
                                    url     : "/web/admin/faceToFaceClassEducation/getClassNoticeInFaceToFaceClass",
                                    dataType: 'json'
                                }
                            },
                            schema      : {
                                parse: function ( response ) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if ( response.status ) {
                                        return response;
                                    } else {
                                        $scope.globle.showTip ( '加载资讯的分页数据失败', 'error' );
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
                                    $scope.model.modelCN.classNoticeList = response.info;
                                    $scope.$apply ();
                                    return response.info;
                                }
                            }
                        } )
                    },

                    trainingAndDemeanorPager : {
                        refresh   : true,
                        dataSource: new kendo.data.DataSource ( {
                            serverPaging: true,
                            page        : 1,
                            pageSize    : 14, // 每页显示的数据数目
                            transport   : {
                                parameterMap: function ( data, type ) {
                                    var temp  = {
                                        queryParam: {},
                                        page      : { pageNo: data.page, pageSize: data.pageSize }
                                    }, params = $scope.model.modelTAD.trainingAndDemeanorQuery;
                                    for ( var key in params ) {
                                        if ( params.hasOwnProperty ( key ) ) {
                                            if ( params[key] ) {
                                                temp.queryParam[key] = params[key];
                                            }
                                        }
                                    }
                                    $scope.model.page.pageNo   = data.page;
                                    $scope.model.page.pageSize = data.pageSize;
                                    delete data.page;
                                    delete data.pageSize;
                                    delete data.skip;
                                    delete data.take;
                                    return temp;
                                },
                                read        : {
                                    url     : "/web/admin/faceToFaceClassEducation/getTrainigAndDemeanorInFaceToFaceClass",
                                    dataType: 'json'
                                }
                            },
                            schema      : {
                                parse: function ( response ) {
                                    // 将会把这个返回的数组绑定到数据源当中
                                    if ( response.status ) {
                                        return response;
                                    } else {
                                        $scope.globle.showTip ( '加载资讯的分页数据失败', 'error' );
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
                                    $scope.model.modelTAD.trainingAndDemeanorList = response.info;
                                    $scope.$apply ();
                                    return response.info;
                                }
                            }
                        } )
                    },
                };

                //监控风采图片是否上传
                $scope.$watch('model.uploaderTrainingAndDemeanor',function(newVal){
                    if(newVal){
                        var a=angular.fromJson(newVal);
                        $scope.model.modelTAD.createTrainingAndDemeanor.demeanorImgPath= a.convertResult[0].url;
                        $scope.model.modelTAD.imgSrc='/mfs' + a.convertResult[0].url;
                    }
                });
                //监控标签页
                $scope.$watch('model.classTab',function(tab){
                    if(tab){
                        if(tab == 4){
                            if($scope.model.modelTCE.isInitClassNotice){
                                $scope.model.modelTCE.isInitClassNotice = false;
                                faceToFaceClassEducationManageServices.getTeacherCurriculumEvaluationInFaceToFaceClass({
                                    schemeId: $stateParams.schemeId
                                }).then(function(data){
                                        if(data.status){
                                            $scope.model.modelTCE.teacherCurriculumEvaluationList = data.info;
                                        }
                                });
                            }
                        }
                        if(tab === 5){
                            if($scope.model.modelCN.isInitClassNotice){
                                $scope.model.modelCN.isInitClassNotice = false;
                                $scope.ui.classNoticePager.dataSource.read ();
                            }
                        }
                        if(tab === 6){
                            if($scope.model.modelTAD.isInitTrainingAndDemeanor){
                                $scope.model.modelTAD.isInitTrainingAndDemeanor = false;
                                $scope.ui.trainingAndDemeanorPager.dataSource.read ();
                            }
                        }
                    }
                });

            }]
    }
});