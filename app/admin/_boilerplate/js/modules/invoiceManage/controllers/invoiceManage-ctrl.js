define(function (invoiceManage) {
    'use strict';
    return {
        indexCtrl: ['$rootScope','$scope', 'kendo.grid', 'TabService', 'HB_dialog', 'invoiceManageServices', '$q', '$http', 'hbUtil', '$state', 'HB_notification',
            function ($rootScope,$scope, kendoGrid, TabService, HB_dialog, invoiceManageServices, $q, $http, hbUtil, $state, HB_notification) {

                $scope.tabMap={
                    myself:{
                        name:"本单位",
                        code:"myself"
                    },
                    all:{
                        name:"项目级",
                        code:"all"
                    },
                };

                $scope.currentTab = $scope.tabMap.myself.code;

                $scope.model = {
                    issuingInvoiceInfo: {},//开票信息
                    storageByTaxPayerInfoList: {},//纳税人库存电子票可开票数量信息
                    ableIssuingCommonElectronQueryParams: {//平台可开票的普通电子票 ableIssuingCommonElectronQueryParams
                        skuId: '',//培训班
                        orderNo: '',//订单号
                        buyerName: '',//购买人
                        loginInput: '',//账号
                        idNum: '',//身份证
                        // payType         : '',//缴费方式
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd: '',//索取发票结束时间
                        //isBilling: '',//是否开票
                        BillNo: '',//发票号
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd: '',//开票结束时间
                        billSelectThree: '1',
                        billCode: '',
                        billVeriCode: '',
                        //账号类型|-1，全部；0，非测试；1，测试
                        isTestUser: '0',
                        queryRange:""//查询单位范围
                    },
                    authorizedBasicQuery:{
                        rangeType:"",//查询维度
                        belongsType:"",//所属权
                        authorizeToUnitId:"",//我授权出的单位
                        authorizedFromUnitId:"",//授权给我的单位
                        objectId:"",//查询对象id,根据rangeType来确定其具体含义
                        targetUnitId:""
                    },
                    commonPaperBillOrderQueryParams: {//纸质发票（普通）
                        skuId: '',//培训班
                        orderNo: '',//订单号
                        buyerName: '',//购买人
                        loginInput: '',//账号
                        idNum: '',//身份证
                        // payType         : '',//缴费方式
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd: '',//索取发票结束时间
                        //isBilling: '',//是否开票
                        BillNo: '',//发票号
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd: '',//开票结束时间
                        // billSelectThree : '1',
                        //账号类型|-1，全部；0，非测试；1，测试
                        isTestUser: '0',
                        queryRange:""//查询单位范围
                    },
                    vatPaperBillOrderQueryParams: {//纸质发票(增值税专用发票)
                        skuId: '',//培训班
                        orderNo: '',//订单号
                        buyerName: '',//购买人
                        loginInput: '',//账号
                        idNum: '',//身份证
                        // payType         : '',//缴费方式
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd: '',//索取发票结束时间
                        //isBilling: '',//是否开票
                        BillNo: '',//发票号
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd: '',//开票结束时间
                        // billSelectThree : '1',
                        //账号类型|-1，全部；0，非测试；1，测试
                        isTestUser: '0',
                        queryRange:""//查询单位范围
                    },
                    nonTaxPaperBillOrderQueryParams: {//纸质发票(非税务发票)
                        skuId: '',//培训班
                        orderNo: '',//订单号
                        buyerName: '',//购买人
                        loginInput: '',//账号
                        idNum: '',//身份证
                        // payType         : '',//缴费方式
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd: '',//索取发票结束时间
                        //isBilling: '',//是否开票
                        BillNo: '',//发票号
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd: '',//开票结束时间
                        // billSelectThree : '1',
                        //账号类型|-1，全部；0，非测试；1，测试
                        isTestUser: '0',
                        queryRange:""//查询单位范围
                    },
                    billOrderQueryParams: {
                        skuId: '',//培训班
                        orderNo: '',//订单号
                        buyerName: '',//购买人
                        loginInput: '',//身份证
                        // payType         : '',//缴费方式
                        askBillTimeStart: '',//索取发票开始时间
                        askBillTimeEnd: '',//索取发票结束时间
                        //isBilling: '',//是否开票
                        BillNo: '',//发票号
                        billingTimeStart: '',//开票开始时间
                        billingTimeEnd: '',//开票结束时间
                        billSelectThree: '1',
                        billCode: '',
                        billVeriCode: '',
                        //账号类型|-1，全部；0，非测试；1，测试
                        isTestUser: '0',
                        queryRange:""//查询单位范围
                    },
                    page: {
                        pageSize: 10,
                        pageNo: 1
                    },
                    invoiceType: 0,
                    electron: false,
                    paperInvoiceShow: true,
                    paperInvoiceShowNum: 0,
                    dialogDetail: false,
                    itemOrderNo: '',
                    itemBillNo: '',
                    itemBillId: '',
                    remark: '',
                    upload: {
                        result: ''
                    },
                    classPage: {
                        pageNo: 1,
                        pageSize: 10
                    },

                    configedQueryParam: {
                        subjectId: '',
                        trainingYear: '',
                        commoditySkuState: 0,//这里查全部
                        //saleState: 0,
                        //periodPrice: '',
                        commoditySkuName: '',
                        firstUpTimeMin: '',
                        firstUpTimeMax: ''
                        //orderByCondition: 0,//0默认 1首次上架时间 排序
                        //sortOrder: 0//0降序 1升序
                    },
                    chooseClassItem: '',
                    paperChooseClassItem: '',
                    classChooseType: false,

                    subjectList: [],
                    yearList: []
                };

                var localDB = {//批量开票的已选对象信息
                    selectedIdArray: [],
                    selectedStatusArray: {}
                };

                //验证是否为空
                function validateIsNull (obj) {
                    return (obj === '' || obj === undefined || obj === null);
                }

                //身份证必须大于4位的数字
                function validataIdcard (str) {

                    if (!validateIsNull(str)) {
                        if (!isNaN(Number(str)) && str.length < 5) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }

                $scope.events = {
                    //选择视角
                    chooseTab : function (e,code){
                        $scope.currentTab = code;
                        this.MainPageQueryList(e);
                    },
                    //判断是否为子项目管理员
                    isSubProjectManager :function () {
                        var unitTypeList = $rootScope.$$userInfo.unitTypeList;
                        return $.inArray('UNIT_TYPE_SUBPROJECT', unitTypeList)>=0;
                    },
                    //查询
                    MainPageQueryList: function (e) {
                        //console.log($scope.model.skuId);
                        //e.preventDefault();
                        //e.stopPropagation();

                        // 重置表格已选的ID, 已选的状态
                        localDB.selectedIdArray = [];
                        localDB.selectedStatusArray = {};
                        utils.refreshBatchButton();

                        if ($scope.model.invoiceType == 1) {//电子发票
                            if (validataIdcard($scope.model.ableIssuingCommonElectronQueryParams.loginInput)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果账号为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                            if (validataIdcard($scope.model.ableIssuingCommonElectronQueryParams.idNum)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果身份证为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                        } else if ($scope.model.invoiceType == 0) {//普通发票
                            if (validataIdcard($scope.model.commonPaperBillOrderQueryParams.loginInput)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果账号为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                            if (validataIdcard($scope.model.commonPaperBillOrderQueryParams.idNum)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果身份证为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                        } else if ($scope.model.invoiceType == 2) {//增值税专用发票
                            if (validataIdcard($scope.model.vatPaperBillOrderQueryParams.loginInput)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果账号为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                            if (validataIdcard($scope.model.vatPaperBillOrderQueryParams.idNum)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果身份证为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                        } else if ($scope.model.invoiceType == 3) {//非税务发票
                            if (validataIdcard($scope.model.nonTaxPaperBillOrderQueryParams.loginInput)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果账号为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                            if (validataIdcard($scope.model.nonTaxPaperBillOrderQueryParams.idNum)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果身份证为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                        } else if ($scope.model.invoiceType == 4) {
                            if (validataIdcard($scope.model.billOrderQueryParams.loginInput)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果账号为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                            if (validataIdcard($scope.model.billOrderQueryParams.idNum)) {
                                //alert('身份证必须是大于4位的数字');
                                HB_dialog.warning('提示', '如果身份证为数字，至少输入5位才能进行查询！');
                                return false;
                            }
                        }


                        $scope.model.page.pageNo = 1;
                        if ($scope.model.invoiceType == 1) {
                            //电子发票查询
                            $scope.node.ableIssuingCommonElectronInvoiceGrid.pager.page(1);
                        } else if ($scope.model.invoiceType == 0) {//普通发票
                            $scope.node.commonPaperInvoiceGrid.pager.page(1);
                        } else if ($scope.model.invoiceType == 2) {//增值税专用发票
                            $scope.node.vatPaperInvoiceGrid.pager.page(1);
                        } else if ($scope.model.invoiceType == 3) {//非税务发票
                            $scope.node.nonTaxPaperInvoiceGrid.pager.page(1);
                        } else if ($scope.model.invoiceType == 4) {//电子发票查询(非真正支持开电子票)
                            $scope.node.lessonGrid.pager.page(1);
                        }

                    },
                    switchTable: function (type) {
                        if (type != $scope.model.invoiceType) {
                            $scope.model.paperInvoiceShowNum = type;
                            if (type === 1 || type === 4) {
                                $scope.model.electron = true;
                            } else {
                                $scope.model.electron = false;
                            }
                            $scope.model.invoiceType = type;
                        }
                        if($scope.currentTab === 'all'){
                            this.MainPageQueryList();
                        }
                    },
                    searchClassList: function (e) {
                        $scope.model.page.pageNo = 1;
                        $scope.kendoPlus.classGridInstance.pager.page(1);
                    },
                    //获取开票信息
                    getIssuingInvoiceInfo: function (e, item) {
                        e.preventDefault();
                        $scope.model.issuingInvoiceInfo = {};//先清空前面的数据
                        invoiceManageServices.getIssuingInvoiceInfoByOrderNo({orderNo: item.orderNo}).then(function (data) {
                            $scope.model.issuingInvoiceInfo = data.info;
                        });
                        HB_dialog.contentAs($scope, {
                            title: '开票信息',
                            width: 500,
                            height: 300,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/invoiceManage/issuingInvoiceDetail.html'
                        });
                    },
                    //处理发票
                    enableAdministrator: function (e, item) {
                        e.preventDefault();
                        if (item.frozen === true) {
                            HB_dialog.alert('提示', '发票被冻结，不能处理！');
                        } else {
                            //纸质发票
                            if ($scope.model.invoiceType != 1 && $scope.model.invoiceType != 4) {
                                $scope.model.dialogHeight = 200;
                                $scope.model.itemBillId = item.billId;
                                $scope.model.itemOrderNo = item.orderNo;
                                if (item.billNo === '' || item.billNo === null) {
                                    $scope.model.invoiceNum = '';
                                    // $scope.model.invoiceCode     = '';
                                    // $scope.model.invoiceVeriCode = '';
                                    $scope.model.dialogDetail = true;
                                } else {
                                    $scope.model.dialogDetail = false;
                                    $scope.model.invoiceItemDetail = item;
                                }
                            } else {
                                //电子发票
                                $scope.model.dialogHeight = 260;
                                $scope.model.itemBillId = item.billId;
                                $scope.model.itemOrderNo = item.orderNo;
                                if (item.billNo === '' || item.billNo === null) {
                                    $scope.model.invoiceNum = '';
                                    $scope.model.invoiceCode = '';
                                    $scope.model.invoiceVeriCode = '';
                                    $scope.model.dialogDetail = true;
                                } else {
                                    $scope.model.dialogDetail = false;
                                    $scope.model.invoiceItemDetail = item;
                                }
                            }
                            HB_dialog.contentAs($scope, {
                                title: '处理发票',
                                width: 500,
                                height: $scope.model.dialogHeight,
                                showCancel: false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/invoiceManage/dialogDetail.html'
                            });
                        }
                    },
                    //处理发票号
                    sureDetail: function (e, type, index) {
                        e.preventDefault();
                        if (type === 1) {
                            if ($scope.model.invoiceType == 4 && (!$scope.model.invoiceNum || !$scope.model.invoiceCode || !$scope.model.invoiceVeriCode)) {
                                HB_dialog.error('提示', '请填写完整在确认！');
                                return;
                            }
                            if ($scope.model.invoiceType != 1 && !$scope.model.invoiceNum) {
                                HB_dialog.error('提示', '请填写完整在确认！');
                                return;
                            }
                            invoiceManageServices.dealWithBill({
                                orderNo: $scope.model.itemOrderNo,
                                billId: $scope.model.itemBillId,
                                billNo: $scope.model.invoiceNum,
                                billCode: $scope.model.invoiceCode,
                                billVeriCode: $scope.model.invoiceVeriCode
                            }).then(function (data) {
                                if (data.status) {
                                    $scope.events.MainPageQueryList();
                                    HB_dialog.success('提示', '填写成功');
                                    //$state.reload($state.current.name);
                                    $scope.events.MainPageQueryList();
                                    HB_dialog.closeDialogByIndex($scope, index);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        } else {
                            // $scope.model.cancleRemark = true;
                            HB_dialog.closeDialogByIndex($scope, index);
                            HB_dialog.contentAs($scope, {
                                title: '作废发票',
                                width: 450,
                                height: 270,
                                showCancel: false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/invoiceManage/cancleRemark.html'
                            });
                        }
                    },
                    detailWithRemark: function (index) {
                        invoiceManageServices.dealCancelBill(
                            {
                                billId: $scope.model.itemBillId,
                                orderNo: $scope.model.itemOrderNo,
                                remark: $scope.model.remark
                            }
                        ).then(function (data) {
                            // dialog.doRightClose ();
                            HB_dialog.closeDialogByIndex($scope, index);
                            $scope.model.remark = '';
                            if (data.status) {
                                $scope.events.MainPageQueryList();
                                HB_dialog.success('提示', '作废成功');
                                $scope.events.MainPageQueryList();
                            } else {
                                HB_dialog.error('提示', data.info);
                            }
                        });
                    },
                    //    关闭弹窗
                    closeDialog: function (e) {
                        e.preventDefault();
                        HB_dialog.closeAlert();
                    },
                    //记录
                    suspendAdministrator: function (e, item) {
                        e.preventDefault();
                        invoiceManageServices.getDealBillLog({orderNo: item.orderNo}).then(function (data) {
                            $scope.model.orderRemenber = data.info;
                            angular.forEach($scope.model.orderRemenber, function (item, index) {
                                if (item.operationType === '1') {
                                    item.operationType = '导入';
                                }
                                if (item.operationType === '2') {
                                    item.operationType = '导出';
                                }
                                if (item.operationType === '3') {
                                    item.operationType = '作废';
                                }
                                if (item.operationType === '4') {
                                    item.operationType = '拆散';
                                }
                                if (item.operationType === '5') {
                                    item.operationType = '合并';
                                }
                                if (item.operationType === '6') {
                                    item.operationType = '打印';
                                }
                                if (item.remark === null || item.remark === '') {
                                    item.remark = '无';
                                }
                            });
                            var length = $scope.model.orderRemenber.length - 1;
                            if (length >= 10) {
                                length = 10;
                            }

                            HB_dialog.contentAs($scope, {
                                title: '操作记录',
                                width: 1000,
                                height: 140 + length * 38,
                                showCancel: false,
                                showCertain: false,
                                templateUrl: '@systemUrl@/views/invoiceManage/dialogRem.html'
                            });
                        });
                    },
                    //导入开票结果
                    chooseFile: function (e) {
                        e.preventDefault();
                        HB_dialog.contentAs($scope, {
                            title: '导入开票结果',
                            width: 500,
                            height: 270,
                            sure: function (wow) {
                                var defer = $q.defer(),
                                    promise = defer.promise;
                                if ($scope.model.upload.result) {
                                    invoiceManageServices.importBillingResult({
                                        filePath: $scope.model.upload.result.newPath,
                                        invoiceType: $scope.model.invoiceType
                                    }).then(function (data) {
                                        if (data.status) {
                                            HB_dialog.success('提示', data.info);
                                        } else {
                                            HB_dialog.error('提示', data.info);
                                        }
                                    });
                                }
                                ;
                                defer.resolve();
                                wow.close();
                                return promise;
                            },
                            templateUrl: '@systemUrl@/views/invoiceManage/dialogFile.html'
                        });
                    },
                    ListOpen: function (e) {
                        e.preventDefault();
                        var temp = {};
                        if ($scope.model.paperInvoiceShowNum === 0) {
                            temp.paperInvoiceType = 1;//1普通发票,2增值税专用发票,3非税务发票
                        } else if ($scope.model.paperInvoiceShowNum === 2) {
                            temp.paperInvoiceType = 2;
                        } else if ($scope.model.paperInvoiceShowNum === 3) {
                            temp.paperInvoiceType = 3;
                        }

                        if ($scope.model.invoiceType == 0) {//普通发票
                            //纸质发票查询参数
                            if ($scope.model.commonPaperBillOrderQueryParams.isBilling != '') {
                                temp.isBilling = $scope.model.commonPaperBillOrderQueryParams.isBilling;
                            }
                            if ($scope.model.commonPaperBillOrderQueryParams.frozen != '') {
                                temp.frozen = $scope.model.commonPaperBillOrderQueryParams.frozen;
                            }

                            invoiceManageServices.exportBills({
                                skuId: $scope.model.commonPaperBillOrderQueryParams.skuId,//培训班
                                orderNo: $scope.model.commonPaperBillOrderQueryParams.orderNo,//订单号
                                buyerName: $scope.model.commonPaperBillOrderQueryParams.buyerName,//购买人
                                loginInput: $scope.model.commonPaperBillOrderQueryParams.loginInput,//账号
                                idNum: $scope.model.commonPaperBillOrderQueryParams.idNum,//身份证
                                // payType         : temp.payType,//缴费方式
                                askBillTimeStart: $scope.model.commonPaperBillOrderQueryParams.askBillTimeStart,//索取发票开始时间
                                askBillTimeEnd: $scope.model.commonPaperBillOrderQueryParams.askBillTimeEnd,//索取发票结束时间
                                isBilling: temp.isBilling,//是否开票
                                BillNo: $scope.model.commonPaperBillOrderQueryParams.BillNo,//发票号
                                billCode: $scope.model.commonPaperBillOrderQueryParams.billCode,//发票代码
                                billVeriCode: $scope.model.commonPaperBillOrderQueryParams.billVeriCode,//发票代码
                                billingTimeStart: $scope.model.commonPaperBillOrderQueryParams.billingTimeStart,//开票开始时间
                                billingTimeEnd: $scope.model.commonPaperBillOrderQueryParams.billingTimeEnd,//开票结束时间
                                electron: $scope.model.electron,//是否电子发票
                                frozen: temp.frozen,//是否冻结
                                invoiceState: $scope.model.commonPaperBillOrderQueryParams.invoiceState,//发票状态
                                isTestUser: $scope.model.commonPaperBillOrderQueryParams.isTestUser,
                                paperInvoiceType: temp.paperInvoiceType,//纸质发票类型
                                rangeType:$scope.model.commonPaperBillOrderQueryParams.rangeType,//查询维度
                                belongsType:$scope.model.commonPaperBillOrderQueryParams.belongsType,//所属权
                                authorizeToUnitId:$scope.model.commonPaperBillOrderQueryParams.authorizeToUnitId,//我授权出的单位
                                authorizedFromUnitId:$scope.model.commonPaperBillOrderQueryParams.authorizedFromUnitId,//授权给我的单位
                                objectId:$scope.model.commonPaperBillOrderQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                targetUnitId:$scope.model.commonPaperBillOrderQueryParams.targetUnitId//查询指定单位
                            }).then(function (data) {
                                if (data.status) {
                                    HB_dialog.success('提示', data.info);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        } else if ($scope.model.invoiceType == 2) {//增值税专用发票
                            //纸质发票查询参数
                            if ($scope.model.vatPaperBillOrderQueryParams.isBilling != '') {
                                temp.isBilling = $scope.model.vatPaperBillOrderQueryParams.isBilling;
                            }
                            if ($scope.model.vatPaperBillOrderQueryParams.frozen != '') {
                                temp.frozen = $scope.model.vatPaperBillOrderQueryParams.frozen;
                            }

                            invoiceManageServices.exportBills({
                                skuId: $scope.model.vatPaperBillOrderQueryParams.skuId,//培训班
                                orderNo: $scope.model.vatPaperBillOrderQueryParams.orderNo,//订单号
                                buyerName: $scope.model.vatPaperBillOrderQueryParams.buyerName,//购买人
                                loginInput: $scope.model.vatPaperBillOrderQueryParams.loginInput,//账号
                                idNum: $scope.model.vatPaperBillOrderQueryParams.idNum,//身份证
                                // payType         : temp.payType,//缴费方式
                                askBillTimeStart: $scope.model.vatPaperBillOrderQueryParams.askBillTimeStart,//索取发票开始时间
                                askBillTimeEnd: $scope.model.vatPaperBillOrderQueryParams.askBillTimeEnd,//索取发票结束时间
                                isBilling: temp.isBilling,//是否开票
                                BillNo: $scope.model.vatPaperBillOrderQueryParams.BillNo,//发票号
                                billCode: $scope.model.vatPaperBillOrderQueryParams.billCode,//发票代码
                                billVeriCode: $scope.model.vatPaperBillOrderQueryParams.billVeriCode,//发票代码
                                billingTimeStart: $scope.model.vatPaperBillOrderQueryParams.billingTimeStart,//开票开始时间
                                billingTimeEnd: $scope.model.vatPaperBillOrderQueryParams.billingTimeEnd,//开票结束时间
                                electron: $scope.model.electron,//是否电子发票
                                frozen: temp.frozen,//是否冻结
                                invoiceState: $scope.model.vatPaperBillOrderQueryParams.invoiceState,//发票状态
                                isTestUser: $scope.model.vatPaperBillOrderQueryParams.isTestUser,
                                paperInvoiceType: temp.paperInvoiceType,//纸质发票类型
                                rangeType:$scope.model.vatPaperBillOrderQueryParams.rangeType,//查询维度
                                belongsType:$scope.model.vatPaperBillOrderQueryParams.belongsType,//所属权
                                authorizeToUnitId:$scope.model.vatPaperBillOrderQueryParams.authorizeToUnitId,//我授权出的单位
                                authorizedFromUnitId:$scope.model.vatPaperBillOrderQueryParams.authorizedFromUnitId,//授权给我的单位
                                objectId:$scope.model.vatPaperBillOrderQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                targetUnitId:$scope.model.vatPaperBillOrderQueryParams.targetUnitId//查询指定单位
                            }).then(function (data) {
                                if (data.status) {
                                    HB_dialog.success('提示', data.info);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        } else if ($scope.model.invoiceType == 3) {//非税务发票
                            //纸质发票查询参数
                            if ($scope.model.nonTaxPaperBillOrderQueryParams.isBilling != '') {
                                temp.isBilling = $scope.model.nonTaxPaperBillOrderQueryParams.isBilling;
                            }
                            if ($scope.model.nonTaxPaperBillOrderQueryParams.frozen != '') {
                                temp.frozen = $scope.model.nonTaxPaperBillOrderQueryParams.frozen;
                            }

                            invoiceManageServices.exportBills({
                                skuId: $scope.model.nonTaxPaperBillOrderQueryParams.skuId,//培训班
                                orderNo: $scope.model.nonTaxPaperBillOrderQueryParams.orderNo,//订单号
                                buyerName: $scope.model.nonTaxPaperBillOrderQueryParams.buyerName,//购买人
                                loginInput: $scope.model.nonTaxPaperBillOrderQueryParams.loginInput,//账号
                                idNum: $scope.model.nonTaxPaperBillOrderQueryParams.idNum,//身份证
                                // payType         : temp.payType,//缴费方式
                                askBillTimeStart: $scope.model.nonTaxPaperBillOrderQueryParams.askBillTimeStart,//索取发票开始时间
                                askBillTimeEnd: $scope.model.nonTaxPaperBillOrderQueryParams.askBillTimeEnd,//索取发票结束时间
                                isBilling: temp.isBilling,//是否开票
                                BillNo: $scope.model.nonTaxPaperBillOrderQueryParams.BillNo,//发票号
                                billCode: $scope.model.nonTaxPaperBillOrderQueryParams.billCode,//发票代码
                                billVeriCode: $scope.model.nonTaxPaperBillOrderQueryParams.billVeriCode,//发票代码
                                billingTimeStart: $scope.model.nonTaxPaperBillOrderQueryParams.billingTimeStart,//开票开始时间
                                billingTimeEnd: $scope.model.nonTaxPaperBillOrderQueryParams.billingTimeEnd,//开票结束时间
                                electron: $scope.model.electron,//是否电子发票
                                frozen: temp.frozen,//是否冻结
                                invoiceState: $scope.model.nonTaxPaperBillOrderQueryParams.invoiceState,//发票状态
                                isTestUser: $scope.model.nonTaxPaperBillOrderQueryParams.isTestUser,
                                paperInvoiceType: temp.paperInvoiceType,//纸质发票类型
                                rangeType:$scope.model.nonTaxPaperBillOrderQueryParams.rangeType,//查询维度
                                belongsType:$scope.model.nonTaxPaperBillOrderQueryParams.belongsType,//所属权
                                authorizeToUnitId:$scope.model.nonTaxPaperBillOrderQueryParams.authorizeToUnitId,//我授权出的单位
                                authorizedFromUnitId:$scope.model.nonTaxPaperBillOrderQueryParams.authorizedFromUnitId,//授权给我的单位
                                objectId:$scope.model.nonTaxPaperBillOrderQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                targetUnitId:$scope.model.nonTaxPaperBillOrderQueryParams.targetUnitId//查询指定单位
                            }).then(function (data) {
                                if (data.status) {
                                    HB_dialog.success('提示', data.info);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        } else if ($scope.model.invoiceType == 1) {
                            //电子发票参数
                            if ($scope.model.ableIssuingCommonElectronQueryParams.billSelectThree === '1') {
                                $scope.model.ableIssuingCommonElectronQueryParams.billCode = '';
                                $scope.model.ableIssuingCommonElectronQueryParams.billVeriCode = '';
                            } else if ($scope.model.ableIssuingCommonElectronQueryParams.billSelectThree === '2') {
                                $scope.model.ableIssuingCommonElectronQueryParams.BillNo = '';
                                $scope.model.ableIssuingCommonElectronQueryParams.billVeriCode = '';
                            } else {
                                $scope.model.ableIssuingCommonElectronQueryParams.BillNo = '';
                                $scope.model.ableIssuingCommonElectronQueryParams.billCode = '';
                            }
                            if ($scope.model.ableIssuingCommonElectronQueryParams.frozen != '') {
                                temp.frozen = $scope.model.ableIssuingCommonElectronQueryParams.frozen;
                            }
                            if ($scope.model.ableIssuingCommonElectronQueryParams.isBilling != '') {
                                temp.isBilling = $scope.model.ableIssuingCommonElectronQueryParams.isBilling;
                            }
                            invoiceManageServices.exportBills({
                                skuId: $scope.model.ableIssuingCommonElectronQueryParams.skuId,//培训班
                                orderNo: $scope.model.ableIssuingCommonElectronQueryParams.orderNo,//订单号
                                buyerName: $scope.model.ableIssuingCommonElectronQueryParams.buyerName,//购买人
                                loginInput: $scope.model.ableIssuingCommonElectronQueryParams.loginInput,//账号
                                idNum: $scope.model.ableIssuingCommonElectronQueryParams.idNum,//身份证
                                // payType         : temp.payType,//缴费方式
                                askBillTimeStart: $scope.model.ableIssuingCommonElectronQueryParams.askBillTimeStart,//索取发票开始时间
                                askBillTimeEnd: $scope.model.ableIssuingCommonElectronQueryParams.askBillTimeEnd,//索取发票结束时间
                                isBilling: temp.isBilling,//是否开票
                                BillNo: $scope.model.ableIssuingCommonElectronQueryParams.BillNo,//发票号
                                billCode: $scope.model.ableIssuingCommonElectronQueryParams.billCode,//发票代码
                                billVeriCode: $scope.model.ableIssuingCommonElectronQueryParams.billVeriCode,//发票代码
                                billingTimeStart: $scope.model.ableIssuingCommonElectronQueryParams.billingTimeStart,//开票开始时间
                                billingTimeEnd: $scope.model.ableIssuingCommonElectronQueryParams.billingTimeEnd,//开票结束时间
                                electron: $scope.model.electron,//是否电子发票
                                frozen: temp.frozen,//是否冻结
                                invoiceState: $scope.model.ableIssuingCommonElectronQueryParams.invoiceState,//发票状态
                                isTestUser: $scope.model.ableIssuingCommonElectronQueryParams.isTestUser,
                                rangeType:$scope.model.ableIssuingCommonElectronQueryParams.rangeType,//查询维度
                                belongsType:$scope.model.ableIssuingCommonElectronQueryParams.belongsType,//所属权
                                authorizeToUnitId:$scope.model.ableIssuingCommonElectronQueryParams.authorizeToUnitId,//我授权出的单位
                                authorizedFromUnitId:$scope.model.ableIssuingCommonElectronQueryParams.authorizedFromUnitId,//授权给我的单位
                                objectId:$scope.model.ableIssuingCommonElectronQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                targetUnitId:$scope.model.ableIssuingCommonElectronQueryParams.targetUnitId//查询指定单位
                            }).then(function (data) {
                                if (data.status) {
                                    HB_dialog.success('提示', data.info);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        } else if ($scope.model.invoiceType == 4) {
                            if ($scope.model.billOrderQueryParams.billSelectThree === '1') {
                                $scope.model.billOrderQueryParams.billCode = '';
                                $scope.model.billOrderQueryParams.billVeriCode = '';
                            } else if ($scope.model.billOrderQueryParams.billSelectThree === '2') {
                                $scope.model.billOrderQueryParams.BillNo = '';
                                $scope.model.billOrderQueryParams.billVeriCode = '';
                            } else {
                                $scope.model.billOrderQueryParams.BillNo = '';
                                $scope.model.billOrderQueryParams.billCode = '';
                            }
                            if ($scope.model.billOrderQueryParams.frozen != '') {
                                temp.frozen = $scope.model.billOrderQueryParams.frozen;
                            }
                            // if ( $scope.model.billOrderQueryParams.payType != "" ) {
                            //     temp.payType = $scope.model.billOrderQueryParams.payType;
                            // }
                            if ($scope.model.billOrderQueryParams.isBilling != '') {
                                temp.isBilling = $scope.model.billOrderQueryParams.isBilling;
                            }
                            invoiceManageServices.exportBills({
                                skuId: $scope.model.billOrderQueryParams.skuId,//培训班
                                orderNo: $scope.model.billOrderQueryParams.orderNo,//订单号
                                buyerName: $scope.model.billOrderQueryParams.buyerName,//购买人
                                loginInput: $scope.model.billOrderQueryParams.loginInput,//账号
                                // payType         : temp.payType,//缴费方式
                                askBillTimeStart: $scope.model.billOrderQueryParams.askBillTimeStart,//索取发票开始时间
                                askBillTimeEnd: $scope.model.billOrderQueryParams.askBillTimeEnd,//索取发票结束时间
                                isBilling: temp.isBilling,//是否开票
                                BillNo: $scope.model.billOrderQueryParams.BillNo,//发票号
                                billCode: $scope.model.billOrderQueryParams.billCode,//发票代码
                                billVeriCode: $scope.model.billOrderQueryParams.billVeriCode,//发票代码
                                billingTimeStart: $scope.model.billOrderQueryParams.billingTimeStart,//开票开始时间
                                billingTimeEnd: $scope.model.billOrderQueryParams.billingTimeEnd,//开票结束时间
                                electron: $scope.model.electron,//是否电子发票
                                frozen: temp.frozen,//是否冻结
                                isTestUser: $scope.model.billOrderQueryParams.isTestUser,
                                rangeType:$scope.model.billOrderQueryParams.rangeType,//查询维度
                                belongsType:$scope.model.billOrderQueryParams.belongsType,//所属权
                                authorizeToUnitId:$scope.model.billOrderQueryParams.authorizeToUnitId,//我授权出的单位
                                authorizedFromUnitId:$scope.model.billOrderQueryParams.authorizedFromUnitId,//授权给我的单位
                                objectId:$scope.model.billOrderQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                targetUnitId:$scope.model.billOrderQueryParams.targetUnitId//查询指定单位
                            }).then(function (data) {
                                if (data.status) {
                                    HB_dialog.success('提示', data.info);
                                } else {
                                    HB_dialog.error('提示', data.info);
                                }
                            });
                        }


                    },
                    getGoodsInfo: function () {
                        $scope.classWindow.center().open();
                    },
                    closeKendoWindow: function () {
                        $scope.classWindow.center().close();
                    },
                    questionSelectAll: function (e) {
                        // 重置表格已选的ID, 已选的状态
                        localDB.selectedIdArray = [];
                        localDB.selectedStatusArray = {};

                        // 全选
                        if (e.currentTarget.checked) {
                            var viewData = $scope.node.ableIssuingCommonElectronInvoiceGrid.dataSource.view(),
                                size = viewData.length, row;
                            for (var i = 0; i < size; i++) {
                                row = viewData[i];
                                // 缓存本地
                                localDB.selectedIdArray.push(row.billId);
                                localDB.selectedStatusArray[row.billId] = row.status;
                            }
                        }
                        utils.refreshBatchButton();
                    },
                    checkBoxCheck: function (e, dataItem) {
                        var billId = dataItem.billId;
                        if (e.currentTarget.checked) {
                            localDB.selectedIdArray.push(billId);
                            localDB.selectedStatusArray[billId] = dataItem.status;
                        } else {
                            var index = _.indexOf(localDB.selectedIdArray, billId);
                            if (index !== -1) {
                                localDB.selectedIdArray.splice(index, 1);
                            }
                            delete localDB.selectedStatusArray[billId];
                        }

                        utils.refreshBatchButton();
                    },

                    batchIssuingInvoice: function () {//批量开票（电子票）
                        if (localDB.selectedIdArray.length < 1) {
                            $scope.globle.alert('提示!', '请选择开票对象');
                            return;
                        }
                        $scope.globle.confirm('批量开票', '确定要批量开票所选发票吗？', function (dialog) {
                            return invoiceManageServices.batchIssuingInvoice(localDB.selectedIdArray).then(function (data) {
                                dialog.doRightClose();
                                if (!data.status) {
                                    $scope.globle.alert('批量开票失败!', data.info);
                                } else {
                                    $scope.node.ableIssuingCommonElectronInvoiceGrid.dataSource.page(1);
                                    //$scope.node.gridInstance.dataSource.read ();
                                    $scope.selected = false;
                                    $scope.globle.showTip('批量开票成功', 'success');
                                }
                            });
                        });
                    },

                    downLoadElectronBlueBill: function (e, dataItem) {//下载电子发票
                        var billId = dataItem.billId;
                        invoiceManageServices.downLoadElectronBlueBill({invoiceId: billId}).then(function (data) {
                            if (data.status) {
                                var dataInfo = data.info;

                                //window.open($scope.urlPrefix + "/mfs" + dataInfo.pdfPath +'?download' );
                                window.open(dataInfo.pdfPath);
                            } else {
                                $scope.globle.alert('提示', data.info);
                            }
                        });
                    },

                    getStorageByTaxPayer: function (e) {
                        e.preventDefault();
                        $scope.model.storageByTaxPayerInfoList = {};//先清空前面的数据
                        invoiceManageServices.ableIssuingElectronInvoiceCount().then(function (data) {
                            $scope.model.storageByTaxPayerInfoList = data.info;
                        });
                        HB_dialog.contentAs($scope, {
                            title: '电子发票库存量信息',
                            width: 500,
                            height: 300,
                            showCancel: false,
                            showCertain: false,
                            templateUrl: '@systemUrl@/views/invoiceManage/ableIssuingElectronInvoiceCount.html'
                        });
                    }
                };

                invoiceManageServices.downloadTemplate().then(function (data) {//初始化下载前置路径
                    if (data.status) {
                        $scope.urlPrefix = data.info.downModelIP;
                    }
                });

                invoiceManageServices.realSupportIssuingElectronInvoice().then(function (data) {//初始化电子发票是否真正支持可开票的系统配置
                    if (data.status) {
                        $scope.realSupportIssuingElectronInvoice = data.info;

                    }
                });


                $scope.node = {
                    ableIssuingCommonElectronInvoiceGrid: null,//平台可开票的普通电子票
                    commonPaperInvoiceGrid: null,
                    vatPaperInvoiceGrid: null,
                    nonTaxPaperInvoiceGrid: null,
                    lessonGrid: null
                };
                var utils = {
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
                    refreshBatchButton: function () {
                        var selectedIdArray = localDB.selectedIdArray,
                            selectedStatusArray = localDB.selectedStatusArray,
                            size = selectedIdArray.length;

                        angular.forEach(selectedStatusArray, function (status, key) {
                            switch (status) {
                                case 1 :
                                    $scope.model.batchEnable = $scope.model.batchFire = false;
                                    break; // 出现<正常>状态的, <批量启用>、<批量离职>不可用
                                case 2 :
                                    $scope.model.batchSuspend = false;
                                    break;                        // 出现<停用>状态的, <批量停用>不可用
                                case 3 :
                                    $scope.model.batchEnable = $scope.model.batchFire = false;
                                    break; // 出现<离职>状态的, <批量启用>、<批量离职>不可用
                            }
                        });

                        // 已选的数量为0, 等价于取消全选; 数量为当前展示的页面量, 等价于全选
                        if (size === 0) {
                            $scope.selected = false;
                            $scope.model.batchEnable = $scope.model.batchSuspend = $scope.model.batchFire = true;
                        } else if (size === $scope.node.ableIssuingCommonElectronInvoiceGrid.dataSource.view().length) {
                            $scope.selected = true;
                        }
                    }
                };
                //=============平台可开票的普通电子票分页开始=======================
                var ableIssuingCommonElectronGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<input ng-click="events.checkBoxCheck($event, dataItem)" type="checkbox"  id="check_#: billId #"  class="k-checkbox" ng-checked="selected" ng-if="dataItem.hasAuthority"/>' +
                        '<label class="k-checkbox-label" for="check_#: billId #" ng-if="dataItem.hasAuthority"></label>');
                    result.push('<span ng-if="!dataItem.hasAuthority">-</span>');
                    result.push('</td>');


                    result.push('<td title="#: orderNo #">');
                    result.push('<a href="javascript:void(0)" ng-click="$state.go(\'states.orderManage.orderDetail\',{orderNo:dataItem.orderNo,from:2})">#: orderNo #</a>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="dataItem.refundStatus===0">-</span>');
                    result.push('<span ng-if="dataItem.refundStatus===1">退款审批中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===2">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===3">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===4">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===5">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===6">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===7">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===8">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===9">已取消</span>');
                    result.push('<span ng-if="dataItem.refundStatus===10">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===11">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===12">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===13">已取消</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: orderMoney #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: money #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: tax === null ? \'-\' : tax #');
                    result.push('</td>');

                    result.push('<td title="#:buyerName#-#:iD#">');
                    result.push('#: buyerName === null || buyerName === \'\' ? \'/\': buyerName  #' + '<br/>账号：' + '#: iD === null || iD === \'\' ? \'/\': iD #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push('<td title="#:billTitle#">');
                    result.push('#: titleType == "1" ? "[个人]" : "[单位]" #');
                    result.push('#: billTitle === null || billTitle === \'\' ? \'/\': billTitle  #');
                    result.push('</td>');


                    result.push('<td title="#: taxpayerNo #">');
                    result.push('#: titleType == "1" ?  \'/\' :  taxpayerNo===\'\'||taxpayerNo==null?\'-\':taxpayerNo  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billCode === null || billCode === \'\' ? \'/\': billCode  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billNo === null || billNo === \'\' ?\'/\': billNo  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="dataItem.invoiceState==1">待开票</span>');
                    result.push('<span ng-if="dataItem.invoiceState==2">开票中</span>');
                    result.push('<span ng-if="dataItem.invoiceState==3">开票成功</span>');
                    result.push('<span ng-if="dataItem.invoiceState==4">开票失败</span>');
                    result.push('</td>');

                    result.push('</td>');
                    result.push('<td class="op">');
                    result.push('<button ng-if="dataItem.invoiceState==3" type="button"  class="table-btn" ng-click="events.downLoadElectronBlueBill($event,dataItem)">下载发票</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/suspendAdministrator"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    ableIssuingCommonElectronGridRowTemplate = result.join('');
                })();


                //=============普通纸质发票分页开始=======================
                var commonPaperGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: orderNo #">');
                    result.push('<a href="javascript:void(0)" ng-click="$state.go(\'states.orderManage.orderDetail\',{orderNo:dataItem.orderNo,from:2})">#: orderNo #</a>');
                    //result.push('#: orderNo #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="dataItem.refundStatus===0">-</span>');
                    result.push('<span ng-if="dataItem.refundStatus===1">退款审批中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===2">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===3">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===4">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===5">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===6">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===7">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===8">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===9">已取消</span>');
                    result.push('<span ng-if="dataItem.refundStatus===10">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===11">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===12">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===13">已取消</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: orderMoney #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: money #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: deliverType == "1" ? "邮寄" : "自取" #');
                    result.push('</td>');

                    result.push('<td title="#:buyerName#-#:iD#">');
                    result.push('#: buyerName === null || buyerName === \'\' ? \'/\': buyerName  #' + '<br/>账号：' + '#: iD === null || iD === \'\' ? \'/\': iD #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push('<td title="#:billTitle#">');
                    result.push('#: titleType == "1" ? "[个人]" : "[单位]" #');
                    result.push('#: billTitle === null || billTitle === \'\' ? \'/\': billTitle  #');
                    result.push('</td>');

                    result.push('<td title="#: taxpayerNo #">');
                    result.push('#: titleType == "1" ?  \'/\' :  taxpayerNo===\'\' ||taxpayerNo===null?\'-\':taxpayerNo  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billingTime === null || billingTime === \'\' ? \'/\': billingTimeOne  #' + '<br/>' + '#: billingTime === null || billingTime === \'\' ? \'\': billingTimeTwo  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billNo === null || billNo === \'\' ?\'/\': billNo  #');
                    result.push('</td>');

                    result.push('</td>');
                    result.push('<td class="op">');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/enableAdministrator" ng-if="dataItem.dialogDetailShow && dataItem.hasAuthority"  ng-click="events.enableAdministrator($event,dataItem)">开票</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/DetailAdministrator" ng-if="!dataItem.dialogDetailShow && dataItem.hasAuthority" ng-click="events.enableAdministrator($event,dataItem)">作废</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/suspendAdministrator"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    commonPaperGridRowTemplate = result.join('');
                })();

                //=============增值税专用发票分页开始=======================
                var vatPaperGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: orderNo #">');
                    result.push('<a href="javascript:void(0)" ng-click="$state.go(\'states.orderManage.orderDetail\',{orderNo:dataItem.orderNo,from:2})">#: orderNo #</a>');
                    //result.push('#: orderNo #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="dataItem.refundStatus===0">-</span>');
                    result.push('<span ng-if="dataItem.refundStatus===1">退款审批中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===2">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===3">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===4">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===5">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===6">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===7">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===8">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===9">已取消</span>');
                    result.push('<span ng-if="dataItem.refundStatus===10">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===11">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===12">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===13">已取消</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: orderMoney #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: money #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: deliverType == "1" ? "邮寄" : "自取" #');
                    result.push('</td>');

                    result.push('<td title="#:buyerName#-#:iD#">');
                    result.push('#: buyerName === null || buyerName === \'\' ? \'/\': buyerName  #' + '<br/>账号：' + '#: iD === null || iD === \'\' ? \'/\': iD #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billNo === null || billNo === \'\' ?\'/\': billNo  #');
                    result.push('</td>');//state

                    result.push('<td>');
                    result.push('<span ng-if="dataItem.invoiceState==2">开票中</span>');
                    result.push('<span ng-if="dataItem.invoiceState==3">开票成功</span>');
                    result.push('</td>');

                    result.push('</td>');
                    result.push('<td class="op">');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/enableAdministrator" ng-if="dataItem.dialogDetailShow && dataItem.hasAuthority"  ng-click="events.enableAdministrator($event,dataItem)">开票</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/DetailAdministrator" ng-if="!dataItem.dialogDetailShow && dataItem.hasAuthority" ng-click="events.enableAdministrator($event,dataItem)">作废</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/getIssuingInvoiceInfo" ng-click="events.getIssuingInvoiceInfo($event,dataItem)">开票信息</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/suspendAdministrator"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    vatPaperGridRowTemplate = result.join('');
                })();

                //=============非税务发票分页开始=======================
                var nonTaxPaperGridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: orderNo #">');
                    result.push('<a href="javascript:void(0)" ng-click="$state.go(\'states.orderManage.orderDetail\',{orderNo:dataItem.orderNo,from:2})">#: orderNo #</a>');
                    //result.push('#: orderNo #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('<span ng-if="dataItem.refundStatus===0">-</span>');
                    result.push('<span ng-if="dataItem.refundStatus===1">退款审批中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===2">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===3">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===4">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===5">退款处理中</span>');
                    result.push('<span ng-if="dataItem.refundStatus===6">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===7">拒绝退款</span>');
                    result.push('<span ng-if="dataItem.refundStatus===8">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===9">已取消</span>');
                    result.push('<span ng-if="dataItem.refundStatus===10">退款失败</span>');
                    result.push('<span ng-if="dataItem.refundStatus===11">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===12">退款成功</span>');
                    result.push('<span ng-if="dataItem.refundStatus===13">已取消</span>');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: orderMoney #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: money #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: deliverType == "1" ? "邮寄" : "自取" #');
                    result.push('</td>');

                    result.push('<td title="#:buyerName#-#:iD#">');
                    result.push('#: buyerName === null || buyerName === \'\' ? \'/\': buyerName  #' + '<br/>账号：' + '#: iD === null || iD === \'\' ? \'/\': iD #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push('<td title="#:billTitle#">');
                    result.push('#: titleType == "1" ? "[个人]" : "[单位]" #');
                    result.push('#: billTitle === null || billTitle === \'\' ? \'/\': billTitle  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billingTime === null || billingTime === \'\' ? \'/\': billingTimeOne  #' + '<br/>' + '#: billingTime === null || billingTime === \'\' ? \'\': billingTimeTwo  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billNo === null || billNo === \'\' ?\'/\': billNo  #');
                    result.push('</td>');

                    result.push('</td>');
                    result.push('<td class="op">');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/enableAdministrator" ng-if="dataItem.dialogDetailShow && dataItem.hasAuthority"  ng-click="events.enableAdministrator($event,dataItem)">开票</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/DetailAdministrator" ng-if="!dataItem.dialogDetailShow && dataItem.hasAuthority" ng-click="events.enableAdministrator($event,dataItem)">作废</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/suspendAdministrator"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    nonTaxPaperGridRowTemplate = result.join('');
                })();

                //=============电子发票分页开始=======================
                var gridRowTemplate = '';
                (function () {
                    var result = [];
                    result.push('<tr>');

                    result.push('<td>');
                    result.push('#: index #');
                    result.push('</td>');

                    result.push('<td title="#: orderNo #">');
                    result.push('#: orderNo #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: money #');
                    result.push('</td>');

                    result.push('<td title="#:buyerName#-#:iD#">');
                    result.push('#: buyerName === null || buyerName === \'\' ? \'/\': buyerName  #' + '<br/>账号：' + '#: iD === null || iD === \'\' ? \'/\': iD #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: askBillTimeOne #' + '<br/>' + '#: askBillTimeTwo #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: receivingUnit #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billTitle === null || billTitle === \'\' ? \'/\': billTitle  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: titleType == "1" ? "个人" : "单位" #');
                    result.push('</td>');

                    result.push('<td title="#: taxpayerNo #">');
                    result.push('#: titleType == "1" ?  \'/\' :  taxpayerNo===\'\'||taxpayerNo==null?\'-\':taxpayerNo  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billVeriCode === null || billVeriCode === \'\' ? \'/\': billVeriCode  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billCode === null || billCode === \'\' ? \'/\': billCode  #');
                    result.push('</td>');

                    result.push('<td>');
                    result.push('#: billNo === null || billNo === \'\' ?\'/\': billNo  #');
                    result.push('</td>');

                    result.push('<td title="#:email#">');
                    result.push('#: email === null || email === \'\' ? \'/\': email  #');
                    result.push('</td>');

                    result.push('</td>');
                    result.push('<td class="op">');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/enableAdministrator" ng-if="dataItem.dialogDetailShow && dataItem.hasAuthority"  ng-click="events.enableAdministrator($event,dataItem)">处理发票</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/DetailAdministrator" ng-if="!dataItem.dialogDetailShow && dataItem.hasAuthority" ng-click="events.enableAdministrator($event,dataItem)">作废发票</button>');
                    result.push('<button type="button"  class="table-btn" has-permission="invoiceManage/suspendAdministrator"   ng-click="events.suspendAdministrator($event,dataItem)">记录</button>');
                    result.push('</td>');

                    result.push('</tr>');
                    gridRowTemplate = result.join('');
                })();

                $scope.ui = {
                    datePicker: {
                        begin: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd'
                                //change: utils.startChange
                            }
                        },
                        end: {
                            options: {
                                culture: 'zh-CN',
                                format: 'yyyy-MM-dd'
                                //change: utils.endChange
                            }
                        }
                    },
                    ableIssuingCommonElectronInvoiceGrid: {//平台可开票的普通电子票
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(ableIssuingCommonElectronGridRowTemplate),
                            scrollable: true,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/billAction/findBillPage',
                                        data: function (e) {
                                            var temp = {
                                                skuId: '',//培训班
                                                orderNo: $scope.model.ableIssuingCommonElectronQueryParams.orderNo,//订单号
                                                buyerName: $scope.model.ableIssuingCommonElectronQueryParams.buyerName,//购买人
                                                loginInput: $scope.model.ableIssuingCommonElectronQueryParams.loginInput,//账号
                                                idNum: $scope.model.ableIssuingCommonElectronQueryParams.idNum,//身份证
                                                //payType: '',//缴费方式
                                                askBillTimeStart: $scope.model.ableIssuingCommonElectronQueryParams.askBillTimeStart,//索取发票开始时间
                                                askBillTimeEnd: $scope.model.ableIssuingCommonElectronQueryParams.askBillTimeEnd,//索取发票结束时间
                                                //isBilling: '',//是否开票
                                                BillNo: $scope.model.ableIssuingCommonElectronQueryParams.BillNo,//发票号
                                                billCode: $scope.model.ableIssuingCommonElectronQueryParams.billCode,//发票代码
                                                billVeriCode: $scope.model.ableIssuingCommonElectronQueryParams.billVeriCode,//发票代码
                                                billingTimeStart: $scope.model.ableIssuingCommonElectronQueryParams.billingTimeStart,//开票开始时间
                                                billingTimeEnd: $scope.model.ableIssuingCommonElectronQueryParams.billingTimeEnd,//开票结束时间
                                                electron: true,//是否电子票
                                                isTestUser: $scope.model.ableIssuingCommonElectronQueryParams.isTestUser,
                                                rangeType:$scope.model.ableIssuingCommonElectronQueryParams.rangeType,//查询维度
                                                belongsType:$scope.model.ableIssuingCommonElectronQueryParams.belongsType,//所属权
                                                authorizeToUnitId:$scope.model.ableIssuingCommonElectronQueryParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:$scope.model.ableIssuingCommonElectronQueryParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:$scope.model.ableIssuingCommonElectronQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                targetUnitId:$scope.model.ableIssuingCommonElectronQueryParams.targetUnitId,//查询指定单位
                                                pageNo: e.page,
                                                pageSize: $scope.model.page.pageSize,
                                                queryRange:$scope.currentTab
                                            };
                                            if ($scope.model.ableIssuingCommonElectronQueryParams.payType != '') {
                                                temp.payType = $scope.model.ableIssuingCommonElectronQueryParams.payType;
                                            }
                                            if ($scope.model.ableIssuingCommonElectronQueryParams.isBilling != '') {
                                                temp.isBilling = $scope.model.ableIssuingCommonElectronQueryParams.isBilling;
                                            }
                                            if ($scope.model.ableIssuingCommonElectronQueryParams.frozen != '') {
                                                temp.frozen = $scope.model.ableIssuingCommonElectronQueryParams.frozen;
                                            }
                                            //发票状态
                                            if ($scope.model.ableIssuingCommonElectronQueryParams.invoiceState != '') {
                                                temp.invoiceState = $scope.model.ableIssuingCommonElectronQueryParams.invoiceState;
                                            }
                                            if ($scope.model.ableIssuingCommonElectronQueryParams.skuId !== '') {
                                                temp.skuId = $scope.model.ableIssuingCommonElectronQueryParams.skuId;
                                            } else {
                                                temp.skuId = '';
                                            }
                                            ;
                                            if ($scope.model.ableIssuingCommonElectronQueryParams.billSelectThree === '1') {
                                                temp.billCode = '';
                                                temp.billVeriCode = '';
                                            } else if ($scope.model.ableIssuingCommonElectronQueryParams.billSelectThree === '2') {
                                                temp.BillNo = '';
                                                temp.billVeriCode = '';
                                            } else {
                                                temp.BillNo = '';
                                                temp.billCode = '';
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
                                        if (response.status) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach(dataview, function (item) {
                                                if (item.billNo === '' || item.billNo === null) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }
                                                item.askBillTimeOne = item.askBillTime.substring(0, 10);
                                                item.askBillTimeTwo = item.askBillTime.substring(10, 20);
                                                item.index = index++;
                                            });
                                        } else {
                                            HB_dialog.error('提示', '[普通电子发票查询报错]：' + response.info);
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
                                $scope.model.gridReturnData = e.items;
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
                                {title: 'No', width: 40},
                                {
                                    title: '<span><input class=\'k-checkbox\' ng-model=\'selected\' id=\'questionSelectAll\' ng-click=\'events.questionSelectAll($event)\' type=\'checkbox\'/><label class=\'k-checkbox-label\' for=\'questionSelectAll\'></label></span>',
                                    filterable: false,
                                    width: 40,
                                    attributes: { // 用template的时候失效。
                                        'class': 'tcenter'
                                    }
                                },
                                {sortable: false, field: 'name', title: '订单号', width: 190},
                                {sortable: false, field: 'name', title: '退款状态', width: 80},
                                {sortable: false, field: 'orderMoney', title: '付款金额', width: 80},
                                {sortable: false, field: 'money', title: '开票金额', width: 80},
                                {sortable: false, field: 'tax', title: '税额', width: 80},
                                {sortable: false, field: 'typeName', title: '购买人信息', width: 200},
                                {sortable: false, field: 'unit', title:'收款单位',width:100},
                                {sortable: false, field: 'title', title: '发票抬头', width: 100},
                                {sortable: false, field: 'taxpayerNo', title: '纳税人识别码', width: 100},
                                {sortable: false, field: 'result', title: '发票代码', width: 100},
                                {sortable: false, field: 'result', title: '发票号', width: 100},
                                {sortable: false, field: 'state', title: '发票状态', width: 100},
                                //{sortable: false, field: "result", title: "电子邮箱", width: 180},
                                {
                                    title: '操作', width: 120
                                }
                            ]
                        }
                    },
                    commonPaperInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(commonPaperGridRowTemplate),
                            scrollable: true,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/billAction/findBillPage',
                                        data: function (e) {
                                            var temp = {
                                                skuId: '',//培训班
                                                orderNo: $scope.model.commonPaperBillOrderQueryParams.orderNo,//订单号
                                                deliverType: $scope.model.commonPaperBillOrderQueryParams.deliverType,//配送方式
                                                buyerName: $scope.model.commonPaperBillOrderQueryParams.buyerName,//购买人
                                                loginInput: $scope.model.commonPaperBillOrderQueryParams.loginInput,//账号
                                                idNum: $scope.model.commonPaperBillOrderQueryParams.idNum,//身份证
                                                askBillTimeStart: $scope.model.commonPaperBillOrderQueryParams.askBillTimeStart,//索取发票开始时间
                                                askBillTimeEnd: $scope.model.commonPaperBillOrderQueryParams.askBillTimeEnd,//索取发票结束时间
                                                BillNo: $scope.model.commonPaperBillOrderQueryParams.BillNo,//发票号
                                                billingTimeStart: $scope.model.commonPaperBillOrderQueryParams.billingTimeStart,//开票开始时间
                                                billingTimeEnd: $scope.model.commonPaperBillOrderQueryParams.billingTimeEnd,//开票结束时间
                                                electron: false,//是否电子票
                                                isTestUser: $scope.model.commonPaperBillOrderQueryParams.isTestUser,
                                                rangeType:$scope.model.commonPaperBillOrderQueryParams.rangeType,//查询维度
                                                belongsType:$scope.model.commonPaperBillOrderQueryParams.belongsType,//所属权
                                                authorizeToUnitId:$scope.model.commonPaperBillOrderQueryParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:$scope.model.commonPaperBillOrderQueryParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:$scope.model.commonPaperBillOrderQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                targetUnitId:$scope.model.commonPaperBillOrderQueryParams.targetUnitId,//查询指定单位
                                                pageNo: e.page,
                                                pageSize: $scope.model.page.pageSize,
                                                queryRange:$scope.currentTab

                                            };
                                            if ($scope.model.commonPaperBillOrderQueryParams.isBilling != '') {
                                                temp.isBilling = $scope.model.commonPaperBillOrderQueryParams.isBilling;
                                            }

                                            if ($scope.model.commonPaperBillOrderQueryParams.frozen != '') {
                                                temp.frozen = $scope.model.commonPaperBillOrderQueryParams.frozen;
                                            }
                                            //发票状态
                                            if ($scope.model.commonPaperBillOrderQueryParams.invoiceState != '') {
                                                temp.invoiceState = $scope.model.commonPaperBillOrderQueryParams.invoiceState;
                                            }
                                            if ($scope.model.commonPaperBillOrderQueryParams.skuId !== '') {
                                                temp.skuId = $scope.model.commonPaperBillOrderQueryParams.skuId;
                                            } else {
                                                temp.skuId = '';
                                            }

                                            temp.paperInvoiceType = 1;//1普通发票,2增值税专用发票,3非税务发票

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
                                        if (response.status) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach(dataview, function (item) {
                                                if (item.billNo === '' || item.billNo === null) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }

                                                item.askBillTimeOne = item.askBillTime.substring(0, 10);
                                                item.askBillTimeTwo = item.askBillTime.substring(10, 20);

                                                if (!(item.billingTime === null || item.billingTime === '')) {
                                                    item.billingTimeOne = item.billingTime.substring(0, 10);
                                                    item.billingTimeTwo = item.billingTime.substring(10, 20);
                                                }
                                                item.index = index++;
                                            });
                                        } else {
                                            HB_dialog.error('提示', '[普通纸质发票查询报错]：' + response.info);
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
                                $scope.model.gridReturnData = e.items;
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
                                {title: 'No', width: 40},
                                {sortable: false, field: 'name', title: '订单号', width: 130},
                                {sortable: false, field: 'name', title: '退款状态', width: 80},
                                {sortable: false, field: 'orderMoney', title: '付款金额', width: 80},
                                {sortable: false, field: 'money', title: '开票金额', width: 80},
                                {sortable: false, field: 'deliverType', title: '配送方式', width: 80},
                                {sortable: false, field: 'typeName', title: '购买人信息', width: 200},
                                {sortable: false, field: 'unit', title:'收款单位',width:100},
                                {sortable: false, field: 'title', title: '发票抬头', width: 100},
                                {sortable: false, field: 'taxpayerNo', title: '纳税人识别码', width: 100},
                                {sortable: false, field: 'result', title: '开票时间', width: 100},
                                {sortable: false, field: 'result', title: '发票号', width: 100},
                                {title: '操作', width: 120}
                            ]
                        }
                    },
                    vatPaperInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(vatPaperGridRowTemplate),
                            scrollable: true,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/billAction/findBillPage',
                                        data: function (e) {
                                            var temp = {
                                                skuId: '',//培训班
                                                orderNo: $scope.model.vatPaperBillOrderQueryParams.orderNo,//订单号
                                                deliverType: $scope.model.vatPaperBillOrderQueryParams.deliverType,//配送方式
                                                buyerName: $scope.model.vatPaperBillOrderQueryParams.buyerName,//购买人
                                                loginInput: $scope.model.vatPaperBillOrderQueryParams.loginInput,//账号
                                                idNum: $scope.model.vatPaperBillOrderQueryParams.idNum,//身份证
                                                askBillTimeStart: $scope.model.vatPaperBillOrderQueryParams.askBillTimeStart,//索取发票开始时间
                                                askBillTimeEnd: $scope.model.vatPaperBillOrderQueryParams.askBillTimeEnd,//索取发票结束时间
                                                BillNo: $scope.model.vatPaperBillOrderQueryParams.BillNo,//发票号
                                                billingTimeStart: $scope.model.vatPaperBillOrderQueryParams.billingTimeStart,//开票开始时间
                                                billingTimeEnd: $scope.model.vatPaperBillOrderQueryParams.billingTimeEnd,//开票结束时间
                                                electron: false,//是否电子票
                                                isTestUser: $scope.model.vatPaperBillOrderQueryParams.isTestUser,
                                                rangeType:$scope.model.vatPaperBillOrderQueryParams.rangeType,//查询维度
                                                belongsType:$scope.model.vatPaperBillOrderQueryParams.belongsType,//所属权
                                                authorizeToUnitId:$scope.model.vatPaperBillOrderQueryParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:$scope.model.vatPaperBillOrderQueryParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:$scope.model.vatPaperBillOrderQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                targetUnitId:$scope.model.vatPaperBillOrderQueryParams.targetUnitId,//查询指定单位
                                                pageNo: e.page,
                                                pageSize: $scope.model.page.pageSize,
                                                queryRange:$scope.currentTab
                                            };
                                            if ($scope.model.vatPaperBillOrderQueryParams.isBilling != '') {
                                                temp.isBilling = $scope.model.vatPaperBillOrderQueryParams.isBilling;
                                            }

                                            if ($scope.model.vatPaperBillOrderQueryParams.frozen != '') {
                                                temp.frozen = $scope.model.vatPaperBillOrderQueryParams.frozen;
                                            }
                                            //发票状态
                                            if ($scope.model.vatPaperBillOrderQueryParams.invoiceState != '') {
                                                temp.invoiceState = $scope.model.vatPaperBillOrderQueryParams.invoiceState;
                                            }
                                            if ($scope.model.vatPaperBillOrderQueryParams.skuId !== '') {
                                                temp.skuId = $scope.model.vatPaperBillOrderQueryParams.skuId;
                                            } else {
                                                temp.skuId = '';
                                            }

                                            temp.paperInvoiceType = 2;//1普通发票,2增值税专用发票,3非税务发票

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
                                        if (response.status) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach(dataview, function (item) {
                                                if (item.billNo === '' || item.billNo === null) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }

                                                item.askBillTimeOne = item.askBillTime.substring(0, 10);
                                                item.askBillTimeTwo = item.askBillTime.substring(10, 20);

                                                if (!(item.billingTime === null || item.billingTime === '')) {
                                                    item.billingTimeOne = item.billingTime.substring(0, 10);
                                                    item.billingTimeTwo = item.billingTime.substring(10, 20);
                                                }
                                                item.index = index++;
                                            });
                                        } else {
                                            HB_dialog.error('提示', '[增值税专用发票查询报错]：' + response.info);
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
                                $scope.model.gridReturnData = e.items;
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
                                {title: 'No', width: 40},
                                {sortable: false, field: 'name', title: '订单号', width: 130},
                                {sortable: false, field: 'name', title: '退款状态', width: 80},
                                {sortable: false, field: 'orderMoney', title: '付款金额', width: 80},
                                {sortable: false, field: 'money', title: '开票金额', width: 80},
                                {sortable: false, field: 'deliverType', title: '配送方式', width: 80},
                                {sortable: false, field: 'typeName', title: '购买人信息', width: 200},
                                {sortable: false, field: 'unit', title:'收款单位',width:100},
                                {sortable: false, field: 'result', title: '发票号', width: 100},
                                {sortable: false, field: 'state', title: '发票状态', width: 80},
                                {title: '操作', width: 120}
                            ]
                        }
                    },
                    nonTaxPaperInvoiceGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(nonTaxPaperGridRowTemplate),
                            scrollable: true,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/billAction/findBillPage',
                                        data: function (e) {
                                            var temp = {
                                                skuId: '',//培训班
                                                orderNo: $scope.model.nonTaxPaperBillOrderQueryParams.orderNo,//订单号
                                                deliverType: $scope.model.nonTaxPaperBillOrderQueryParams.deliverType,//配送方式
                                                buyerName: $scope.model.nonTaxPaperBillOrderQueryParams.buyerName,//购买人
                                                loginInput: $scope.model.nonTaxPaperBillOrderQueryParams.loginInput,//账号
                                                idNum: $scope.model.nonTaxPaperBillOrderQueryParams.idNum,//身份证
                                                askBillTimeStart: $scope.model.nonTaxPaperBillOrderQueryParams.askBillTimeStart,//索取发票开始时间
                                                askBillTimeEnd: $scope.model.nonTaxPaperBillOrderQueryParams.askBillTimeEnd,//索取发票结束时间
                                                BillNo: $scope.model.nonTaxPaperBillOrderQueryParams.BillNo,//发票号
                                                billingTimeStart: $scope.model.nonTaxPaperBillOrderQueryParams.billingTimeStart,//开票开始时间
                                                billingTimeEnd: $scope.model.nonTaxPaperBillOrderQueryParams.billingTimeEnd,//开票结束时间
                                                electron: false,//是否电子票
                                                isTestUser: $scope.model.nonTaxPaperBillOrderQueryParams.isTestUser,
                                                rangeType:$scope.model.nonTaxPaperBillOrderQueryParams.rangeType,//查询维度
                                                belongsType:$scope.model.nonTaxPaperBillOrderQueryParams.belongsType,//所属权
                                                authorizeToUnitId:$scope.model.nonTaxPaperBillOrderQueryParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:$scope.model.nonTaxPaperBillOrderQueryParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:$scope.model.nonTaxPaperBillOrderQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                targetUnitId:$scope.model.nonTaxPaperBillOrderQueryParams.targetUnitId,//查询指定单位
                                                pageNo: e.page,
                                                pageSize: $scope.model.page.pageSize,
                                                queryRange:$scope.currentTab
                                            };
                                            if ($scope.model.nonTaxPaperBillOrderQueryParams.isBilling != '') {
                                                temp.isBilling = $scope.model.nonTaxPaperBillOrderQueryParams.isBilling;
                                            }

                                            if ($scope.model.nonTaxPaperBillOrderQueryParams.frozen != '') {
                                                temp.frozen = $scope.model.nonTaxPaperBillOrderQueryParams.frozen;
                                            }
                                            //发票状态
                                            if ($scope.model.nonTaxPaperBillOrderQueryParams.invoiceState != '') {
                                                temp.invoiceState = $scope.model.nonTaxPaperBillOrderQueryParams.invoiceState;
                                            }
                                            if ($scope.model.nonTaxPaperBillOrderQueryParams.skuId !== '') {
                                                temp.skuId = $scope.model.nonTaxPaperBillOrderQueryParams.skuId;
                                            } else {
                                                temp.skuId = '';
                                            }

                                            temp.paperInvoiceType = 3;//1普通发票,2增值税专用发票,3非税务发票

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
                                        if (response.status) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach(dataview, function (item) {
                                                if (item.billNo === '' || item.billNo === null) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }

                                                item.askBillTimeOne = item.askBillTime.substring(0, 10);
                                                item.askBillTimeTwo = item.askBillTime.substring(10, 20);

                                                if (!(item.billingTime === null || item.billingTime === '')) {
                                                    item.billingTimeOne = item.billingTime.substring(0, 10);
                                                    item.billingTimeTwo = item.billingTime.substring(10, 20);
                                                }
                                                item.index = index++;
                                            });
                                        } else {
                                            HB_dialog.error('提示', '[非税务发票查询报错]：' + response.info);
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
                                $scope.model.gridReturnData = e.items;
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
                                {title: 'No', width: 40},
                                {sortable: false, field: 'name', title: '订单号', width: 130},
                                {sortable: false, field: 'name', title: '退款状态', width: 80},
                                {sortable: false, field: 'orderMoney', title: '付款金额', width: 80},
                                {sortable: false, field: 'money', title: '开票金额', width: 80},
                                {sortable: false, field: 'deliverType', title: '配送方式', width: 80},
                                {sortable: false, field: 'typeName', title: '购买人信息', width: 200},
                                {sortable: false, field: 'unit', title:'收款单位',width:100},
                                {sortable: false, field: 'title', title: '发票抬头', width: 100},
                                {sortable: false, field: 'result', title: '开票时间', width: 100},
                                {sortable: false, field: 'result', title: '发票号', width: 100},
                                {title: '操作', width: 120}
                            ]
                        }
                    },
                    lessonGrid: {
                        options: {
                            // 每个行的模板定义,
                            rowTemplate: kendo.template(gridRowTemplate),
                            scrollable: true,
                            noRecords: {
                                template: '暂无数据'
                            },
                            dataSource: {
                                transport: {
                                    read: {
                                        contentType: 'application/x-www-form-urlencoded;charset=utf-8;',
                                        url: '/web/admin/billAction/findBillPage',
                                        data: function (e) {
                                            var temp = {
                                                skuId: '',//培训班
                                                orderNo: $scope.model.billOrderQueryParams.orderNo,//订单号
                                                buyerName: $scope.model.billOrderQueryParams.buyerName,//购买人
                                                loginInput: $scope.model.billOrderQueryParams.loginInput,//账号
                                                //payType: '',//缴费方式
                                                askBillTimeStart: $scope.model.billOrderQueryParams.askBillTimeStart,//索取发票开始时间
                                                askBillTimeEnd: $scope.model.billOrderQueryParams.askBillTimeEnd,//索取发票结束时间
                                                //isBilling: '',//是否开票
                                                BillNo: $scope.model.billOrderQueryParams.BillNo,//发票号
                                                billCode: $scope.model.billOrderQueryParams.billCode,//发票代码
                                                billVeriCode: $scope.model.billOrderQueryParams.billVeriCode,//发票代码
                                                billingTimeStart: $scope.model.billOrderQueryParams.billingTimeStart,//开票开始时间
                                                billingTimeEnd: $scope.model.billOrderQueryParams.billingTimeEnd,//开票结束时间
                                                electron: true,//是否电子票
                                                isTestUser: $scope.model.billOrderQueryParams.isTestUser,
                                                rangeType:$scope.model.billOrderQueryParams.rangeType,//查询维度
                                                belongsType:$scope.model.billOrderQueryParams.belongsType,//所属权
                                                authorizeToUnitId:$scope.model.billOrderQueryParams.authorizeToUnitId,//我授权出的单位
                                                authorizedFromUnitId:$scope.model.billOrderQueryParams.authorizedFromUnitId,//授权给我的单位
                                                objectId:$scope.model.billOrderQueryParams.objectId,//查询对象id,根据rangeType来确定其具体含义
                                                targetUnitId:$scope.model.billOrderQueryParams.targetUnitId,//查询指定单位
                                                pageNo: e.page,
                                                pageSize: $scope.model.page.pageSize,
                                                queryRange:$scope.currentTab
                                            };
                                            //temp.billOrderQueryParams = angular.copy($scope.model.billOrderQueryParams);
                                            //if(temp.billOrderQueryParams.payType === '0' || temp.billOrderQueryParams.payType === '1'){
                                            //    delete temp.billOrderQueryParams.payType;
                                            //}
                                            if ($scope.model.billOrderQueryParams.payType != '') {
                                                temp.payType = $scope.model.billOrderQueryParams.payType;
                                            }
                                            if ($scope.model.billOrderQueryParams.isBilling != '') {
                                                temp.isBilling = $scope.model.billOrderQueryParams.isBilling;
                                            }
                                            if ($scope.model.billOrderQueryParams.frozen != '') {
                                                temp.frozen = $scope.model.billOrderQueryParams.frozen;
                                            }
                                            if ($scope.model.billOrderQueryParams.skuId !== '') {
                                                temp.skuId = $scope.model.billOrderQueryParams.skuId;
                                            } else {
                                                temp.skuId = '';
                                            }
                                            ;
                                            if ($scope.model.billOrderQueryParams.billSelectThree === '1') {
                                                temp.billCode = '';
                                                temp.billVeriCode = '';
                                            } else if ($scope.model.billOrderQueryParams.billSelectThree === '2') {
                                                temp.BillNo = '';
                                                temp.billVeriCode = '';
                                            } else {
                                                temp.BillNo = '';
                                                temp.billCode = '';
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
                                        if (response.status) {
                                            var dataview = response.info, index = 1;
                                            angular.forEach(dataview, function (item) {
                                                if (item.billNo === '' || item.billNo === null) {
                                                    item.dialogDetailShow = true;
                                                } else {
                                                    item.dialogDetailShow = false;
                                                }

                                                item.askBillTimeOne = item.askBillTime.substring(0, 10);
                                                item.askBillTimeTwo = item.askBillTime.substring(10, 20);
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
                                $scope.model.gridReturnData = e.items;
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
                                {title: 'No', width: 40},
                                {sortable: false, field: 'name', title: '订单号', width: 190},
                                {sortable: false, field: 'name', title: '发票金额', width: 80},
                                {sortable: false, field: 'typeName', title: '购买人信息', width: 200},
                                {sortable: false, field: 'teacherName', title: '索取发票时间', width: 110},
                                {sortable: false, field: 'unit', title:'收款单位',width:100},
                                {sortable: false, field: 'title', title: '发票抬头', width: 100},
                                {sortable: false, field: 'titleType', title: '抬头类型', width: 100},
                                {sortable: false, field: 'taxpayerNo', title: '纳税人识别码', width: 100},
                                {sortable: false, field: 'result', title: '查询验证码', width: 100},
                                {sortable: false, field: 'result', title: '发票代码', width: 100},
                                {sortable: false, field: 'result', title: '发票号', width: 100},
                                {sortable: false, field: 'result', title: '电子邮箱', width: 180},
                                {
                                    title: '操作', width: 120
                                }
                            ]
                        }
                    }
                };

                $scope.kendoPlus = {
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

            }]
    };
});