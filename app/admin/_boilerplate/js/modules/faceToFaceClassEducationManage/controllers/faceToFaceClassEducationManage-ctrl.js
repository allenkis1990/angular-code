define(function (classResultOfflineManager) {
    "use strict";
    return {
        indexCtrl: ["$scope", 'kendo.grid', 'HB_dialog', '$q', '$http', 'hbUtil', 'faceToFaceClassEducationManageServices', 'hbSkuService', '$timeout', '$state',
            function ($scope, kendoGrid, HB_dialog, $q, $http, hbUtil, faceToFaceClassEducationManageServices, hbSkuService, $timeout, $state) {

                $scope.model = {
                    categoryType: 'TRAINING_CLASS_GOODS',
                    optratingItem: null,
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    },
                    configingPage: {
                        pageNo: 1,
                        pageSize: 10
                    },
                    headTeacherPage: {
                        pageNo  : 1,
                        pageSize: 10
                    },
                    headTeacherQueryParam: {
                        name: ''
                    },
                    upload: {},
                    reconResult: 0,
                    trainingLevelShow: true,
                    configedQueryParam: {
                        onSaleState: 0,//这里查全部
                        saleState: 0,
                        price: '',
                        commodityName: '',
                        minFirstUpTime: '',
                        maxFirstUpTime: '',
                        orderByCondition: 0,//0默认 1首次上架时间 排序
                        sortOrder: 0//0降序 1升序
                    },
                    queryParams: {
                        headTeacherName: null,
                        headTeacherId:null,
                        className: null,
                        trainingType:-1
                    },
                    importResult: {},
                    classChooseType: false,
                    gridPending: false,
                    attachments: []
                };

                $scope.kendoPlus = {
                    headTeacherGridInstance: null,
                    addWindowOptions        : {
                        modal    : true,
                        visible  : false,
                        resizable: false,
                        draggable: false,
                        title    : false,
                        open     : function () {
                            this.center ();
                        }
                    },
                    headTeacherWindow    : {
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

                $scope.events = {
                    changeImage: function () {
                        var image = '/web/admin/faceToFaceClassEducation/getStreamQrcode?id=' + $scope.model.schemeId + Date.now();
                        document.getElementById("code").src = image;
                    },
                    seeQRCode: function (dataItem) {
                        var image = '/web/admin/faceToFaceClassEducation/getStreamQrcode?id=' + dataItem.schemeId + '&time=' + Date.now();
                        document.getElementById("code").src = image;
                        $scope['codeWindowOptions'].center().open ();
                        $scope.model.schemeId = dataItem.schemeId;
                        $scope.model.className = dataItem.className;
                    },
                    downImage:function(){
                        var image = '/web/admin/faceToFaceClassEducation/getStreamQrcode?id=' + $scope.model.schemeId + Date.now();
                        var $a = $("<a></a>").attr("href", image).attr("download", $scope.model.className + ".png");
                        $a[0].click();
                    },
                    openKendoWindow: function ( windowName ) {
                        if (windowName === 'headTeacherWindow') {
                            utils.initHeadTeacherGridOptions();
                        }
                        $scope[windowName].center().open ();
                    },
                    closeaddFormWindow: function (windowName ) {
                        $scope[windowName].close ();
                    },
                    closeKendoWindow: function (windowName ) {
                        $scope[windowName].close ();
                    },
                    educationManage:function(dataItem){
                        $state.go('states.faceToFaceClassEducationManage.faceToFaceClassEducationDetail', {
                            schemeId: dataItem.schemeId
                        });
                    },
                    clearUnitTextContent: function () {
                        $scope.model.queryParams.headTeacherName  = '';
                        $scope.model.queryParams.headTeacherId= '';
                    },
                    chooseHeadTeacher: function ( e, item ) {
                        $scope.model.queryParams.headTeacherName = item.headTeacherName;
                        $scope.model.queryParams.headTeacherId   = item.userId;
                        $scope.events.closeKendoWindow ( 'headTeacherWindow' );
                    },
                    /**
                     * 返回教务管理界面
                     * @param e
                     */
                    goManage: function (e) {
                        e.preventDefault();
                        $state.go('states.faceToFaceClassEducationManage');
                    },
                    /*clickTab : function ( type ) {
                        if ( !$scope.model.noUserInformation && $scope.model.mark === false ) {

                        } else {
                            $scope.model.classTab = type;
                            if ( type === 0 ) {//培训学员管理
                                $scope.itemView = 'states.faceToFaceClassEducationManage.studentInfo';
                            }
                            if ( type === 1 ) {//线下考试成绩管理
                                $scope.itemView = 'states.faceToFaceClassEducationManage.managementOfExaminationResultsUnderLine';
                            }
                            if ( type === 2 ) {//学员学习明细
                                $scope.itemView = 'states.faceToFaceClassEducationManage.studentsLearningDetails';
                            }
                            if ( type === 3 ) {//调查问卷结果统计
                                $scope.itemView = 'states.faceToFaceClassEducationManage.statisticalResultsOfQuestionnaire';
                            }
                            if ( type === 4 ) {//教师课程评价
                                $scope.itemView = 'states.faceToFaceClassEducationManage.teacherCurriculumEvaluation';
                            }
                            if ( type === 5 ) {//班级通知
                                $scope.itemView = 'states.faceToFaceClassEducationManage.classNotice';
                            }
                            if ( type === 6 ) {//培训风采
                                $scope.itemView = 'states.faceToFaceClassEducationManage.trainingAndDemeanor';
                            }
                            if (findIndex() === null) {
                                if (type !== 1) {
                                    $scope.itemViewArr.push({viewName: $scope.itemView});
                                }

                                $state.go($scope.itemView);
                            } else {
                                $state.go($scope.itemView);
                            }
                        }

                    },*/
                    //查询
                    MainPageQueryList: function (e, gridName, pageName) {
                        e.preventDefault();
                        e.stopPropagation();
                        $scope.model[pageName].pageNo = 1;
                        $scope.kendoPlus[gridName].pager.page (1);
                    },
                };


                //已配置模板
                var headTeacherRowTemplate = '';
                (function () {
                    var result = [];
                    result.push ( '<tr>' );

                    result.push ( '<td>' );
                    result.push ( '#: index #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '#:headTeacherName||\'-\' #' );
                    result.push ( '</td>' );

                    result.push ( '<td>' );
                    result.push ( '<button type="button" class="table-btn" ng-click="events.chooseHeadTeacher($event,dataItem)">选择</button>' );
                    result.push ( '</td>' );

                    result.push ( '</tr>' );
                    headTeacherRowTemplate = result.join ( '' );
                }) ();


                var utils = {
                    initHeadTeacherGridOptions: function () {
                        if (!$scope.headTeacherGridOptions) {
                            $scope.headTeacherGridOptions = hbUtil.kdGridCommonOption ( {
                                template: headTeacherRowTemplate,
                                url     : "/web/admin/faceToFaceClassEducation/getHeadTeacherPage",
                                scope   : $scope,
                                page    : 'headTeacherPage',
                                param   : $scope.model.headTeacherQueryParam,
                                fn      : function ( response ) {
                                    $scope.configedArr = response.info;
                                },
                                columns : [
                                    {title: "No", sortable: false, width: 50 },
                                    {title: "班主任名称", sortable: false},
                                    {title: "操作", width: 80}
                                ]
                            });
                        }
                    }
                };



                $scope.node = {
                    lessonGrid: null
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
                    result.push('#: index #');
                    result.push('</td>');

                    // 班级名称
                    result.push('<td>');
                    result.push('#: className||\'-\' #');
                    result.push('</td>');

                    //培训年度
                    result.push ( '<td>' );
                    result.push ( '<div ng-repeat="item in dataItem.skuPropertyNameList" ng-if="item.skuPropertyName===\'年度\'">');
                    result.push ( ' <span  ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>' );
                    result.push ( '<br />' );
                    result.push ( '</div>');
                    result.push ( '</td>' );

                    //培训科目
                    result.push ( '<td>' );
                    result.push ( '<div ng-repeat="item in dataItem.skuPropertyNameList" ng-if="item.skuPropertyName===\'科目\'">');
                    result.push ( ' <span  ng-bind="item.skuPropertyValueName===null?\'-\':item.skuPropertyValueName"></span>' );
                    result.push ( '<br />' );
                    result.push ( '</div>');
                    result.push ( '</td>' );

                    //班主任
                    result.push('<td>');
                    result.push('#: headTeacherName||\'-\' #');
                    result.push('</td>');

                    //班级人数
                    result.push('<td>');
                    result.push('#: signUpOfClassCount||\'-\' #');
                    result.push('</td>');

                    //培训进度
                    result.push('<td>');
                    result.push('#: trainingType #');
                    result.push('</td>');

                    //操作
                    result.push('<td>');
                    result.push('<button type="button" class="table-btn" ng-click="events.educationManage(this.dataItem)">教务管理</button><button type="button" class="table-btn" ng-click="events.seeQRCode(this.dataItem)">查看报道二维码</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplate = result.join('');
                })();
                $scope.lessonGrid = {
                    options: hbUtil.kdGridCommonOption ({
                        template: gridRowTemplate,
                        url: "/web/admin/faceToFaceClassEducation/findFaceToFaceClassBaseInfoByPage",
                        scope: $scope,
                        page: 'configingPage',
                        //需要额外处理请求参数在这里做
                        param: $scope.model.queryParams,
                        skuParam: 'skuParamsConfiged',
                        fn: function (response) {
                            response.info.forEach(function (item) {
                                switch (item.trainingType) {
                                    case 1:
                                        item.trainingType = '培训中';
                                        break;
                                    case 2:
                                        item.trainingType = '未开始';
                                        break;
                                    case 3:
                                        item.trainingType = '培训结束'
                                        break;
                                    default:
                                        item.trainingType = '-'
                                }
                            })
                            $scope.configingArr = response.info;
                        },
                        columns: [
                            {sortable: false, field: "index", title: "No", width: 50},
                            {sortable: false, field: "className", title: "班级名称"},
                            {sortable: false, field: "trainingYear", title: "继续教育年度", width: 150},
                            {sortable: false, field: "subProject", title: "科目", width: 150},
                            {sortable: false, field: "headTeacherName", title: "班主任", width: 150},
                            {sortable: false, field: "signUpOfClassCount", title: "已报人数", width: 150},
                            {sortable: false, field: "trainingType", title: "培训状态",  width: 150},
                            {
                                title: "操作", width: 200
                            }
                        ]
                    }),
                    windows: {
                        editInfo: {//修改窗口
                            modal: true,
                            content: "views/faceToFaceClassEducationManage/editInfo.html",
                            visible: false,
                            title: false,
                            open: function () {
                                this.center();
                            }
                        }
                    }
                };

            }]
    }
});