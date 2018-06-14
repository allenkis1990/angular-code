define(function () {
    'use strict';
    return {
        index: ['$scope', 'refundManageService', '$http', '$q', '$stateParams', 'hbUtil', '$state', 'hbBasicData', 'HB_dialog', '$notify', 'hbSkuService', '$timeout','$rootScope',
            function ($scope, refundManageService, $http, $q, $stateParams, hbUtil, $state, hbBasicData, HB_dialog, $notify, hbSkuService, $timeout,$rootScope) {
                $scope.model.datasuccess = true;
                $scope.showTotal = false;
                $scope.model.totalAmount = 0;
                $scope.tempClass = {};
                $scope.allTempClass = {};
                $scope.model = {
                    showCreateUnit:true,
                    accountQuery:{},
                    allAccountQuery:{},
                    dimension:1,
                    trainingLevelShow: true,
                    classPage: {
                        pageNo: 1,
                        pageSize: 10
                    },
                    orderQueryParam: {

                        trainClassName: '',//用于显示用的
                        orderNo: '',//订单号 两个互相排斥
                        flowNo: '',//流水号 两个互相排斥
                        orderStatus: 'TRADE_SUCCESS',
                        tradeStartTimeMills: '',
                        tradeEndTimeMills: '',
                        buyerName: '',
                        loginInput: '',
                        skuId: '',//培训班ID
                        operatorId: '',
                        professionLevel: '',
                        pageNo: 1,
                        pageSize: 10,
                        eliminateFreeOrder: false//是否剔除0元订单

                    },

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

                    searTotalInfo: {}

                };

                $scope.kendoPlus = {
                    classGridInstance: null,
                    timeModel: null,
                    timeOptions: {
                        culture: 'zh-CN',
                        format: 'yyyy-MM-dd'
                        //format : "yyyy-MM-dd HH:mm:00"
                    },
                    windowOptions: {
                        modal: true,
                        visible: false,
                        resizable: false,
                        draggable: false,
                        title: false,
                        open: function () {
                            this.center();
                        }
                    }

                };
                $scope.query = {
                    trainClassName: '',
                    refundOrderStatus: 'ALL',
                    refundType: '',
                    test: 'false'
                };
                $scope.allQuery = {
                    trainClassName: '',
                    refundOrderStatus: 'ALL',
                    refundType: '',
                    test: 'false'
                };

                var resource = {
                    pageUrl: hbBasicData.baseURL + '/admin/refund/pageRefundmentOrder'

                };

                var gridDataSource = hbUtil.kendo.dataSource.gridDataSource(resource.pageUrl, {}, {

                    rebuild: function (data) {
                        /*   console.log(data);*/
                        $scope.model.enforce = data.enforce;
                        /*   $scope.model.totalAmount=0;*/
                        $scope.model.totalSize = data.length;
                        /* for(var i=0;i<$scope.model.totalSize;i++){
                              $scope.model.totalAmount +=  data[i].totalAmount;
                          }*/
                        /*$scope.model.totalAmount=data.totalAmount;*/

                        return hbUtil.kendo.dataSource.setIndex(gridDataSource, data, 1);

                    },
                    parameterMap: function (data, type) {
                        data.pageNo = data.page;
                        delete data.page;
                        delete data.skip;
                        delete data.take;
                        genQuery(data);
                        refundManageService.statistic(data).then(function (data) {
                            if ($scope.query.refundOrderStatus === 'REFUND_SUCCESS') {
                                $scope.showTotal = true;
                            } else {
                                $scope.showTotal = false;
                            }
                            $scope.model.normalCount = data.info.normalCount;
                            $scope.model.totalAmount = data.info.totalAmount;
                        });
                        return data;
                    }
                });


                function genQuery (data) {
                    if($scope.model.dimension==1){
                        data.refundOrderStatus = $scope.query.refundOrderStatus;
                        data.orderNo = $scope.query.orderNo;
                        data.auditStartTime = validateIsNull($scope.query.auditStartTime) === true ? 0 : parseTimeStrToLong($scope.query.auditStartTime);
                        data.auditEndTime = validateIsNull($scope.query.auditEndTime) === true ? 0 : parseTimeStrToLong($scope.query.auditEndTime) + 86399999;
                        data.applyStartTimeMills = validateIsNull($scope.query.applyStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.query.applyStartTimeMills);
                        /*$scope.query.applyStartTimeMills;*/
                        data.applyEndTimeMills = validateIsNull($scope.query.applyEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.query.applyEndTimeMills) + 86399999;
                        data.schemeId = getSchemeId($scope.tempClass);
                        data.loginInput = $scope.query.loginInput;
                        data.refundType = $scope.query.refundType;
                        data.test = $scope.query.test;
                        data.rangeType=$scope.model.accountQuery.rangeType;
                        data.belongsType=$scope.model.accountQuery.belongsType;
                        data.authorizeToUnitId=$scope.model.accountQuery.authorizeToUnitId;
                        data.authorizedFromUnitId=$scope.model.accountQuery.authorizedFromUnitId;
                        data.objectId=$scope.model.accountQuery.objectId;
                        data.useType=$scope.model.accountQuery.useType;
                        data.targetUnitId=$scope.model.accountQuery.targetUnitId;

                    }else{
                        data.refundOrderStatus = $scope.allQuery.refundOrderStatus;
                        data.orderNo = $scope.allQuery.orderNo;
                        data.auditStartTime = validateIsNull($scope.allQuery.auditStartTime) === true ? 0 : parseTimeStrToLong($scope.allQuery.auditStartTime);
                        data.auditEndTime = validateIsNull($scope.allQuery.auditEndTime) === true ? 0 : parseTimeStrToLong($scope.allQuery.auditEndTime) + 86399999;
                        data.applyStartTimeMills = validateIsNull($scope.allQuery.applyStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.allQuery.applyStartTimeMills);
                        /*$scope.query.applyStartTimeMills;*/
                        data.applyEndTimeMills = validateIsNull($scope.allQuery.applyEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.allQuery.applyEndTimeMills) + 86399999;
                        data.schemeId = getSchemeId($scope.tempClass);
                        data.loginInput = $scope.allQuery.loginInput;
                        data.refundType = $scope.allQuery.refundType;
                        data.test = $scope.allQuery.test;
                        data.rangeType=$scope.model.allAccountQuery.rangeType;
                        data.belongsType=$scope.model.allAccountQuery.belongsType;
                        data.authorizeToUnitId=$scope.model.allAccountQuery.authorizeToUnitId;
                        data.authorizedFromUnitId=$scope.model.allAccountQuery.authorizedFromUnitId;
                        data.objectId=$scope.model.allAccountQuery.objectId;
                        data.useType=$scope.model.allAccountQuery.useType;
                        data.targetUnitId=$scope.model.allAccountQuery.targetUnitId;
                    }
                    data.dimension=$scope.model.dimension;
                }


                $scope.mainGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template($('#template1').html()), [
                    {
                        template: 'b{{dataItem.$index > 0 ? dataItem.$index:""}}',
                        title: 'No.',
                        width: 45
                    },
                    {
                        field: 'regionName',
                        title: '订单号',
                        width: 200
                    },
                    {
                        field: 'flowNo',
                        title: '交易流水号',
                        width: 200
                    },
                    {
                        field: 'netEstablish',
                        title: '退款物品',
                        width: 200
                    },
                    {
                        field: 'notLearnYet',
                        title: '单价',
                        width: 60
                    },
                    {
                        field: 'learning',
                        title: '数量',
                        width: 60
                    },
                    {
                        field: 'learning',
                        title: '实付金额',
                        width: 80
                    },
                    {
                        field: 'learning',
                        title: '退款金额',
                        width: 80
                    },
                    {
                        field: 'learning',
                        title: '购买人',
                        width: 200
                    },
                    {
                        field: 'learning',
                        title: '收款单位',
                        width: 200
                    },
                    {
                        field: 'learning',
                        title: '申请时间',
                        width: 160
                    },
                    {
                        field: 'learning',
                        title: '审批时间',
                        width: 160
                    },
                    {
                        field: 'learning',
                        title: '退款状态',
                        width: 110
                    },
                    {
                        field: 'learned',
                        title: '操作',
                        width: 140
                    }
                ], {}, {
                    sortable: false,
                    scrollable:true,
                    height:true
                });
                $scope.allGridOptions = hbUtil.kendo.grid.genGridCommonConfig(gridDataSource, kendo.template($('#template1').html()), [
                    {
                        template: 'b{{dataItem.$index > 0 ? dataItem.$index:""}}',
                        title: 'No.',
                        width: 45
                    },
                    {
                        field: 'regionName',
                        title: '订单号',
                        width: 200
                    },
                    {
                        field: 'flowNo',
                        title: '交易流水号',
                        width: 200
                    },
                    {
                        field: 'netEstablish',
                        title: '退款物品',
                        width: 200
                    },
                    {
                        field: 'notLearnYet',
                        title: '单价',
                        width: 60
                    },
                    {
                        field: 'learning',
                        title: '数量',
                        width: 60
                    },
                    {
                        field: 'learning',
                        title: '实付金额',
                        width: 80
                    },
                    {
                        field: 'learning',
                        title: '退款金额',
                        width: 80
                    },
                    {
                        field: 'learning',
                        title: '购买人',
                        width: 200
                    },
                    {
                        template: 'b{{ $scope.model.dimension==2? saleUnitName:""}}',
                        title: '订单来源单位',
                        width: 200
                    },
                    {
                        template: 'b{{ $scope.model.dimension==2? belongUnitName:""}}',
                        title: '所属权',
                        width: 200
                    },
                    {
                        field: 'learning',
                        title: '收款单位',
                        width: 200
                    },
                    {
                        field: 'learning',
                        title: '申请时间',
                        width: 160
                    },
                    {
                        field: 'learning',
                        title: '审批时间',
                        width: 160
                    },
                    {
                        field: 'learning',
                        title: '退款状态',
                        width: 110
                    },
                    {
                        field: 'learned',
                        title: '操作',
                        width: 140
                    }
                ], {}, {
                    sortable: false,
                    scrollable:true,
                    height:true
                });
                $scope.events = {
                    toggleDimension: function (e, dimension) {
                        e.preventDefault();
                        $scope.model.dimension = dimension;
                        $scope.node.mainGrid.pager.page(1);
                        $scope.node.allGrid.pager.page(1);
                        $scope.node.mainGrid.dataSource.refresh();
                        $scope.node.allGrid.dataSource.refresh();
                    },
                    isSubProjectManager :function () {
                        var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                        return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                    },

                    openKendoWindow: function (windowName) {

                        $scope[windowName].center().open();
                    },

                    closeKendoWindow: function (windowName) {
                        $scope[windowName].close();
                    },
                    MainPageQueryList: function (e, pageName) {
                        e.stopPropagation();
                        $scope.model[pageName].pageNo = 1;
                    },
                    cancel: function () {
                        if (validateIsNull($scope.model.cancelRefundDesc) === true) {
                            HB_dialog.warning('警告', '请填写取消退款理由');
                            return false;
                        }
                        refundManageService.cancel($scope.model.refundNo, $scope.model.cancelRefundDesc).then(function (data) {
                            /*defer.resolve ();*/
                            if (data.code === '200') {
                                HB_dialog.success('提示', data.message || '取消退款成功');
                                $scope.node.mainGrid.dataSource.refresh();
                                $scope.node.allGrid.dataSource.refresh();
                                $scope.model.cancelRefundDesc = '';
                            } else {
                                HB_dialog.warning('提示', data.message || '取消退款失败');
                                $scope.model.cancelRefundDesc = '';
                                $scope.node.mainGrid.dataSource.refresh();
                                $scope.node.allGrid.dataSource.refresh();
                                //defer.resolve();
                            }
                        });
                    },
                    approverefund: function (dataItem) {
                        $scope.model.enforce = dataItem.enforce;
                        $scope.model.refundType = dataItem.refundType;
                        $scope.model.refundNo = dataItem.refundNo;
                        HB_dialog.contentAs($scope, {
                            title: '同意退款申请',
                            height: 180,
                            width: 400,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/refundManage/approveDialog.html'
                        });
                    },
                    approve: function () {
                        if ($scope.model.enforce === true) {
                            /*  $scope.model.datasuccess=true;*/
                            refundManageService.enforceApprove($scope.model.refundNo).then(function (data) {
                                /*defer.resolve ();*/
                                if (data.code === '200') {
                                    HB_dialog.success('提示', data.message || '同意退款成功');
                                    $scope.node.mainGrid.dataSource.refresh();
                                    $scope.node.allGrid.dataSource.refresh();
                                } else {
                                    HB_dialog.warning('提示', data.message || '同意退款失败');
                                    $scope.node.mainGrid.dataSource.refresh();
                                    $scope.node.allGrid.dataSource.refresh();

                                }
                            });
                        } else {
                            refundManageService.approve($scope.model.refundNo).then(function (data) {
                                /*defer.resolve ();*/
                                if (data.code === '200') {
                                    HB_dialog.success('提示', data.message || '同意退款成功');
                                    $scope.node.mainGrid.dataSource.refresh();
                                    $scope.node.allGrid.dataSource.refresh();
                                } else {
                                    HB_dialog.warning('提示', data.message || '同意退款失败');
                                    $scope.model.cancelRefundDesc = '';
                                    $scope.node.mainGrid.dataSource.refresh();
                                    $scope.node.allGrid.dataSource.refresh();
                                }
                            });
                        }

                    },

                    export_: function () {
                        if ($scope.model.dimension==1&&
                            validateIsNull($scope.query.refundType) &&
                            validateIsNull($scope.query.loginInput) &&
                            validateIsNull($scope.query.orderNo) &&
                            validateIsNull($scope.query.refundOrderStatus) &&
                            validateIsNull($scope.model.orderQueryParam.skuId) &&
                            validateIsNull($scope.query.auditStartTime) &&
                            validateIsNull($scope.query.auditEndTime) &&
                            validateIsNull($scope.query.applyStartTimeMills) &&
                            validateIsNull($scope.query.applyEndTimeMills) &&
                            validateIsNull(getSchemeId($scope.tempClass)) &&
                            validateIsNull($scope.query.test)
                        ) {

                            HB_dialog.warning('提示', '选择至少一个搜索条件才能导出');
                            return false;

                        }
                        if ($scope.model.dimension==2&&
                            validateIsNull($scope.allQuery.refundType) &&
                            validateIsNull($scope.allQuery.loginInput) &&
                            validateIsNull($scope.allQuery.orderNo) &&
                            validateIsNull($scope.allQuery.refundOrderStatus) &&
                            validateIsNull($scope.model.orderQueryParam.skuId) &&
                            validateIsNull($scope.allQuery.auditStartTime) &&
                            validateIsNull($scope.allQuery.auditEndTime) &&
                            validateIsNull($scope.allQuery.applyStartTimeMills) &&
                            validateIsNull($scope.allQuery.applyEndTimeMills) &&
                            validateIsNull(getSchemeId($scope.allTempClass)) &&
                            validateIsNull($scope.allQuery.test)
                        ) {

                            HB_dialog.warning('提示', '选择至少一个搜索条件才能导出');
                            return false;

                        }

                        $scope.submitExportOrder = true;
                        refundManageService.exportRefund({

                            refundOrderStatus: $scope.model.dimension==1?$scope.query.refundOrderStatus:$scope.allQuery.refundOrderStatus,
                            orderNo: $scope.model.dimension==1?$scope.query.orderNo:$scope.allQuery.orderNo,
                            auditStartTime: $scope.model.dimension==1?validateIsNull($scope.query.auditStartTime) === true ? 0 : parseTimeStrToLong($scope.query.auditStartTime):validateIsNull($scope.allQuery.auditStartTime) === true ? 0 : parseTimeStrToLong($scope.allQuery.auditStartTime),
                            auditEndTime: $scope.model.dimension==1? validateIsNull($scope.query.auditEndTime) === true ? 0 : parseTimeStrToLong($scope.query.auditEndTime) + 86399999:validateIsNull($scope.allQuery.auditEndTime) === true ? 0 : parseTimeStrToLong($scope.allQuery.auditEndTime) + 86399999,
                            applyStartTimeMills: $scope.model.dimension==1? validateIsNull($scope.query.applyStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.query.applyStartTimeMills): validateIsNull($scope.allQuery.applyStartTimeMills) === true ? 0 : parseTimeStrToLong($scope.allQuery.applyStartTimeMills),
                            applyEndTimeMills: $scope.model.dimension==1?validateIsNull($scope.query.applyEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.query.applyEndTimeMills) + 86399999:validateIsNull($scope.allQuery.applyEndTimeMills) === true ? 0 : parseTimeStrToLong($scope.allQuery.applyEndTimeMills) + 86399999,
                            loginInput:$scope.model.dimension==1? $scope.query.loginInput:$scope.allQuery.loginInput,
                            refundType:$scope.model.dimension==1? $scope.query.refundType:$scope.allQuery.refundType,
                            schemeId: $scope.model.dimension==1?getSchemeId($scope.tempClass):getSchemeId($scope.allTempClass),
                            test:$scope.model.dimension==1? $scope.query.test:$scope.allQuery.test,
                            rangeType:$scope.model.dimension==1?$scope.model.accountQuery.rangeType:$scope.model.allAccountQuery.rangeType,
                            belongsType:$scope.model.dimension==1?$scope.model.accountQuery.belongsType:$scope.model.allAccountQuery.belongsType,
                            authorizeToUnitId:$scope.model.dimension==1?$scope.model.accountQuery.authorizeToUnitId:$scope.model.allAccountQuery.authorizeToUnitId,
                            authorizedFromUnitId:$scope.model.dimension==1?$scope.model.accountQuery.authorizedFromUnitId:$scope.model.allAccountQuery.authorizedFromUnitId,
                            targetUnitId:$scope.model.dimension==1?$scope.model.accountQuery.targetUnitId:$scope.model.allAccountQuery.targetUnitId,
                             objectId:$scope.model.dimension==1?$scope.model.accountQuery.objectId:$scope.model.allAccountQuery.objectId,
                            dimension:$scope.model.dimension

                        }).then(function (data) {
                            $scope.submitExportOrder = false;
                            if (data.status) {
                                if (data.info === true) {
                                    HB_dialog.success('提示', '导出成功');
                                } else {
                                    HB_dialog.error('提示', '导出失败');
                                }
                            }
                        });
                    },
                    back: function () {
                        $state.go('states.refundManage');
                        $scope.node.mainGrid.dataSource.refresh();
                        $scope.node.allGrid.dataSource.refresh();
                    },
                    search: function (e) {
                        e.stopPropagation();
                        $scope.model.totalAmount = 0;
                        $scope.node.mainGrid.dataSource.refresh();
                        $scope.node.allGrid.dataSource.refresh();
                    },
                    import_: function () {
                        $scope.isLoadingImport = true;
                        $notify.success('导入成功');
                    },
                    doReset: function () {
                        $scope.query = {};
                    },
                    cancelrefund: function (dataItem) {
                        $scope.model.refundNo = dataItem.refundNo;
                        HB_dialog.contentAs($scope, {
                            title: '取消退款申请',
                            height: 300,
                            width: 600,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/refundManage/cancelDialog.html'
                        });
                    },
                    lookDetail: function (e, item) {

                        $state.go('states.refundManage.refundDetail', {orderNo: item.refundNo});

                    },

                    setSortOrder: function (sortOrder) {
                        $scope.model.configedQueryParam.orderByCondition = 1;
                        $scope.model.configedQueryParam.sortOrder = sortOrder;
                        $scope.kendoPlus['classGridInstance'].pager.page(1);
                        $scope.kendoPlus['classGridInstance'].dataSource.read();
                    },


                    choseClass: function (e, item) {
                        console.log(item);
                        $scope.model.orderQueryParam.trainClassName = item.commodityName;
                        $scope.model.orderQueryParam.skuId = item.commoditySkuId;
                        $scope.events.closeKendoWindow('classWindow');
                    },

                    queryDetailClass: function (e, item) {
                        console.log(1);
                        $scope.temporaryClassList = item.subOrderList;
                        HB_dialog.contentAs($scope, {
                            templateUrl: '@systemUrl@/views/openRecord/queryDetailClassTpl.html',
                            width: 800,
                            title: '培训班',
                            showCertain: false
                        });
                    },
                    resumerefund: function (dataItem) {
                        $scope.model.refundNo = dataItem.refundNo;
                        HB_dialog.contentAs($scope, {
                            title: '继续退款申请',
                            height: 160,
                            width: 400,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/refundManage/resumeDialog.html'
                        });

                    },
                    resume: function () {
                        refundManageService.resume($scope.model.refundNo).then(function (data) {
                            if (data.code === 200) {
                                HB_dialog.success('提示', data.message || '继续退款成功');
                                $scope.node.mainGrid.dataSource.refresh();
                                $scope.node.allGrid.dataSource.refresh();
                            } else {
                                HB_dialog.warning('提示', data.message || '继续退款失败');
                                $scope.node.mainGrid.dataSource.refresh();
                                $scope.node.allGrid.dataSource.refresh();
                                //defer.resolve();
                            }
                        });
                    },
                    rejectrefund: function (dataItem) {
                        $scope.model.refundNo = dataItem.refundNo;
                        HB_dialog.contentAs($scope, {
                            title: '拒绝退款申请',
                            height: 300,
                            width: 530,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/refundManage/rejectDialog.html'
                        });

                    },
                    reject: function () {
                        if (validateIsNull($scope.model.rejectRefundDesc) === true) {
                            HB_dialog.warning('警告', '请填写拒绝退款理由');
                            return false;
                        }
                        refundManageService.reject($scope.model.refundNo, $scope.model.rejectRefundDesc).then(function (data) {
                            /* defer.resolve ();*/
                            if (data.code === '200') {
                                HB_dialog.success('提示', data.message || '拒绝退款成功');
                                $scope.model.cancelRefundDesc = '';
                                $scope.node.mainGrid.dataSource.refresh();
                                $scope.node.allGrid.dataSource.refresh();

                            } else {

                                HB_dialog.warning('提示', data.message || '拒绝退款失败');
                                $scope.model.cancelRefundDesc = '';
                                $scope.node.mainGrid.dataSource.refresh();
                                $scope.node.allGrid.dataSource.refresh();
                                /*  defer.resolve();*/
                            }
                        });
                    },
                    selectClass: function () {
                        HB_dialog.contentAs($scope, {
                            height: 570,
                            title: '选择培训方案',
                            width: 1100,
                            showCancel: false,
                            templateUrl: '@systemUrl@/views/refundManage/classSelect.html',
                            sure: function (dialog) {
                                console.log($scope.tempClass);
                                return $timeout(function () {
                                    dialog.close(dialog.dialogIndex);
                                });
                            }
                        });
                    },
                    clearSchemeTextContent: function () {
                        $scope.tempClass.schemeId = null;
                        $scope.tempClass.schemeName = null;
                    }
                };
            }]

    };

    //验证是否为空
    function validateIsNull (obj) {
        return (obj === '' || obj === undefined || obj === null);
    }

    function findYear ($scope, arr) {
        var year = null;
        /*    console.log($scope.model.configedQueryParam.trainingYear );*/
        angular.forEach(arr, function (item) {
            if (item.optionId === $scope.model.configedQueryParam.trainingYear) {
                year = item.name;

            }
        });

        return year;
    }

    function parseTimeStrToLong (str) {
        return kendo.parseDate(str).getTime();
    }

    //验证是否为空
    function getSchemeId (obj) {
        if (obj === undefined || obj === null) {
            return null;
        }
        return obj.schemeId;
    }

});

